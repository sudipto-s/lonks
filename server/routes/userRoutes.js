import { Router } from 'express'
import {
   getUsers, createUsers, updateUsers, deleteUsers
} from "../controllers/userController.js"
import limiter from '../utils/limiter.js'
import { requireAuth } from '../middlewares/authMiddleware.js'

const router =  Router()

router.use(limiter)
router.post("/getall", getUsers, requireAuth)
router.post("/create", createUsers)
router.patch("/update", updateUsers)
router.delete("/delete/:username", deleteUsers)

export default router