import User from "../models/User.js"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import crypto from "crypto"
import { otpSender, welcomeSender } from "../utils/emailSender.js"

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

/* Create JWT */
const maxAge = 4 * 24 * 60 * 60 * 1000
const createToken = (userId, email) =>
   jwt.sign({ userId, email }, process.env.JWT_SECRET, {
      expiresIn: "4d"   // 4 days
   })
