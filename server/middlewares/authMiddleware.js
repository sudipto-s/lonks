import jwt from "jsonwebtoken"
import User from "../models/User.js"

export const requireAuth = (req, res, next) => {
   const token = req.cookies["lonks-jwt"]

   // check json web token exists & is verified
   if (token) {
      jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
         if (err) {
            console.log(err.message)
            res.cookie("lonks-jwt", '', { maxAge: 1 })
            return res.status(403).json({ message: "Authorization denied. Please re-login" })
         } else
            next()
      })
   } else {
      res.status(403).json({ message: "No token, authorization denied. Please re-login" })
   }
}

// check current user
export const checkUser = (req, res, next) => {
  const token = req.cookies["lonks-jwt"]
   if (token) {
      jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
         if (err)
            res.user = null
         else
            res.user = await User.findById(decodedToken.userId)
         next()
      })
   } else {
      res.user = null
      next()
   }
}