import { Router } from 'express'
import {
   getUsers, createUsers, updateUsers, deleteUsers
} from "../controllers/userController.js"
import { checkUser, requireAuth } from '../middlewares/authMiddleware.js'

const router =  Router()

router.post("/getall", requireAuth, checkUser, getUsers)
router.post("/create", createUsers)
router.patch("/update", updateUsers)
router.delete("/delete/:username", deleteUsers)

export default router