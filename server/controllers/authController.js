import User from "../models/User.js"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

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
      res.cookie("lonks-jwt", token, { httpOnly: true, maxAge: maxAge * 1000 })
      res.status(200).json({ userId: user._id, username: user.username })
   } catch (err) {
      res.status(400).json({ message: err.message})
   }
}

export const signup = async (req, res) => {
   try {
      const { username, email, password } = req.body
      const newUser = await User.create({ username, email, password: await bcrypt.hash(password, 10) })
      const token = createToken(newUser._id, email)
      res.cookie("lonks-jwt", token, { httpOnly: true, maxAge: maxAge * 1000 })
      res.status(201).json({ userId: newUser._id })
   } catch (err) {
      if (err.code === 11000)
         return res.status(400).json({ message: "Email already exists" })
      res.status(400).json({ message: err.message })
   }
}

/* Create JWT */
const maxAge = 4 * 24 * 60 * 60
const createToken = (userId, email) =>
   jwt.sign({ userId, email }, process.env.JWT_SECRET, {
      expiresIn: maxAge   // 4 days
   })