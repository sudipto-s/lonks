import { Router } from 'express'
import {
   forgotPassword,
   login, logout, resetPassword, signup, verifyOtp
} from "../controllers/authController.js"

const router =  Router()

router.post("/login", login)
router.post("/logout", logout)
router.post("/signup", signup)
router.post("/verify", verifyOtp)
router.post("/forgot-password", forgotPassword)
router.post("/reset-password", resetPassword)

export default router