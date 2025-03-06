import User from "../models/User.js"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import crypto from "crypto"
import { otpSender, resetPasswordEmail, welcomeSender } from "../utils/emailSender.js"

export const login = async (req, res) => {
   try {
      const { identifier, password } = req.body

      const isEmail = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/.test(identifier)

      const user = await User.findOne({ [isEmail ? "email" : "username"]: identifier })
      if (!user)
         return res.status(401).json({ message: "User is not registered!" })
      const isPassMatch = await bcrypt.compare(password, user.password)
      if (!isPassMatch)
         return res.status(401).json({ message: "Please provide a valid password." })

      const token = createToken(user._id, identifier)
      res.cookie("lonks-jwt", token, { httpOnly: true, maxAge })
      res.status(200).json({ userId: user._id, username: user.username, email: user.email })
   } catch (err) {
      res.status(400).json({ message: err.message})
   }
}

//logout route
export const logout = async (req, res) => {
   try {
      res.clearCookie("lonks-jwt")
      res.clearCookie("lonks-user")
      res.status(200).json({ message: "Logged out successfully!" })
   } catch (err) {
      res.status(400).json({ message: err.message })
   }
}

let otpStore = {}
export const signup = async (req, res) => {
   try {
      const { email } = req.body

      const existingUser = await User.findOne({ email })
      if (existingUser)
         return res.status(400).json({ message: "Email already exists" })
      
      const otp = crypto.randomInt(100000, 999999).toString() // 6-digit OTP

      // Store the OTP in memory
      otpStore[email] = { otp, expiresAt: Date.now() + 10 * 60 * 1000 } // OTP expires in 10 minutes

      // Send OTP via email
      await otpSender(email, otp)

      // Respond with success message
      res.status(200).json({ message: 'OTP sent to email' })
   } catch (err) {
      res.status(400).json({ message: err.message })
   }
}

export const verifyOtp = async (req, res) => {
   const { email, otp, username, password } = req.body

   const storedOtp = otpStore[email]

   if (!storedOtp || storedOtp.expiresAt < Date.now())
      return res.status(400).json({ message: 'OTP expired or invalid' })

   if (storedOtp.otp !== otp)
      return res.status(400).json({ message: 'Incorrect OTP' })

   try {
      // OTP verified, create user
      const newUser = await User.create({ username, email, password: await bcrypt.hash(password, 10) })

      // Generate JWT
      const token = createToken(newUser._id)
      res.cookie('lonks-jwt', token, { httpOnly: true, maxAge })

      // Remove OTP from memory
      delete otpStore[email]

      // Send welcome email
      await welcomeSender(email, username)

      res.status(201).json({ userId: newUser._id })
   } catch (err) {
      res.status(400).json({ message: err.message })
   }
}

// Forgot passowrd
export const forgotPassword = async (req, res) => {
   const { email } = req.body
   
   try {
      const user = await User.findOne({ email })
      if (!user)
         return res.status(404).json({ message: "User not found" })
   
      // Generate a token
      const resetToken = crypto.randomBytes(32).toString("hex")
      user.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex")
      user.resetPasswordExpires = Date.now() + 10 * 60 * 1000     // Token valid for 10 minutes
   
      await user.save()
   
      // Send reset link
      const resetLink = `${req.protocol}://${req.get("host")}/auth/reset-password/${resetToken}`
      await resetPasswordEmail(email, resetLink)
   
      res.status(200).json({ message: "Reset link sent to your email" })
   } catch (err) {
      console.log(err)
      res.status(500).json({ message: err.message })
   }
}

// Reset password
export const resetPassword = async (req, res) => {
   const { token, password } = req.body
   
   try {
      // Check if token is present or not
      if (!token)
         return res.status(400).json({ message: "Invalid token" })

      const hashedToken = crypto.createHash("sha256").update(token).digest("hex")
      const user = await User.findOne({
         resetPasswordToken: hashedToken,
         resetPasswordExpires: { $gt: Date.now() }    // Check token expiry
      })
   
      if (!user)
         return res.status(400).json({ message: "Invalid or expired token" })
   
      // Update the password
      user.password = await bcrypt.hash(password, 10)
      user.resetPasswordToken = undefined
      user.resetPasswordExpires = undefined
   
      await user.save()
      res.status(200).json({ message: "Password reset successfully! Redirecting to login page." })
   } catch (err) {
      console.log(err)
      res.status(500).json({ message: err.message })
   }
}

// Update password
export const updatePassword = async (req, res) => {
  const { oldPassword, newPassword, assoc } = req.body
   
   // Check if user is authenticated & the requested email is same as the actual email
   if (!res.user || res.user.email !== assoc)
      return res.status(401).json({ message: "Unauthorized access detected! Please re-login" })

   try {
      const user = await User.findOne({ email: res.user.email })
      
      if(!user)
         res.status(404).json({ message: "User not found" })

      // Verify old password
      const isMatch = await bcrypt.compare(oldPassword, user.password)
      if (!isMatch)
         return res.status(400).json({ message: "Incorrect old password" })

      // Hash new password and update
      user.password = await bcrypt.hash(newPassword, 10)
      await user.save()
      
      res.json({ message: "Password updated successfully" })
   } catch (err) {
      console.log(err.message)
      res.status(500).json({ message: err.message })
   }
}

/* Create JWT */
const maxAge = 15 * 24 * 60 * 60 * 1000    // 15 days
const createToken = (userId, email) =>
   jwt.sign({ userId, email }, process.env.JWT_SECRET, {
      expiresIn: "15d"   // 15 days
   })
