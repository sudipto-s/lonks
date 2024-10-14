import User from "../models/User.js"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import crypto from "crypto"
import otpSender from "../utils/otpSender.js"

export const login = async (req, res) => {
   try {
      const { email, password } = req.body

      const user = await User.findOne({ email })
      if (!user)
         return res.status(401).json({ message: "Invalid email" })
      const isPassMatch = await bcrypt.compare(password, user.password)
      if (!isPassMatch)
         return res.status(401).json({ message: "Invalid password" })

      const token = createToken(user._id, email)
      res.cookie("lonks-jwt", token, { httpOnly: true, maxAge })
      res.status(200).json({ userId: user._id, username: user.username })
   } catch (err) {
      res.status(400).json({ message: err.message})
   }
}

let otpStore = {}
/*export const signup = async (req, res) => {
   try {
      const { username, email, password } = req.body
      const newUser = await User.create({ username, email, password: await bcrypt.hash(password, 10) })
      const token = createToken(newUser._id, email)
      res.cookie("lonks-jwt", token, { httpOnly: true, maxAge })
      res.status(201).json({ userId: newUser._id })
   } catch (err) {
      if (err.message.includes("User validation failed: email:"))
         return res.status(400).json({ message: "Please enter a valid email format" })
      else if (err.code === 11000)
         return res.status(400).json({ message: "Email already exists" })
      res.status(400).json({ message: err.message })
   }
}*/
export const signup = async (req, res) => {
   try {
      const { email } = req.body
      const otp = crypto.randomInt(100000, 999999) // 6-digit OTP

      // Store the OTP in memory
      otpStore[email] = { otp, expiresAt: Date.now() + 10 * 60 * 1000 } // OTP expires in 10 minutes

      // Send OTP via email
      await otpSender(email, otp)

      // Respond with success message
      res.status(200).json({ message: 'OTP sent to email' })
   } catch (err) {
      if (err.message.includes("User validation failed: email:"))
         return res.status(400).json({ message: "Please enter a valid email format" })
      else if (err.code === 11000)
         return res.status(400).json({ message: "Email already exists" })
      res.status(400).json({ message: err.message })
   }
}

export const verifyOtp = async (req, res) => {
   const { email, otp, username, password } = req.body

   const storedOtp = otpStore[email]

   if (!storedOtp || storedOtp.expiresAt < Date.now())
      return res.status(400).json({ message: 'OTP expired or invalid' })

   if (storedOtp.otp !== parseInt(otp))
      return res.status(400).json({ message: 'Incorrect OTP' })

   try {
      // OTP verified, create user
      const newUser = await User.create({ username, email, password })

      // Generate JWT
      const token = createToken(newUser._id)
      res.cookie('lonks-jwt', token, { httpOnly: true, maxAge })

      // Remove OTP from memory
      delete otpStore[email]

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