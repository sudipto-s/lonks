import { Router } from 'express'
import {
   login, logout, signup, verifyOtp
} from "../controllers/authController.js"

const router =  Router()

router.post("/login", login)
router.post("/logout", logout)
router.post("/signup", signup)
router.post("/verify", verifyOtp)

export default router