import { Router } from 'express'
import {
   forgotPassword, updatePassword,
   login, logout, resetPassword, signup, verifyOtp
} from "../controllers/authController.js"
import limiter from "../utils/limiter.js"
import { checkUser, requireAuth } from "../middlewares/authMiddleware.js"

const router =  Router()

router.post("/login", login)
router.post("/logout", logout)
router.post("/signup", signup)
router.post("/verify", verifyOtp)
router.post("/forgot-password", forgotPassword)
router.post("/reset-password", resetPassword)
router.post("/update-password", limiter, requireAuth, checkUser, updatePassword)

export default router