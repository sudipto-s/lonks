import { Router } from 'express'
import {
   login, signup
} from "../controllers/authController.js"
import { requireAuth } from '../middlewares/authMiddleware.js'

const router =  Router()

router.post("/login", requireAuth, login)
router.post("/signup", signup)

export default router