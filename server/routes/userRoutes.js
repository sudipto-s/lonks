import { Router } from 'express'
import {
   getUsers, createUsers, updateUsers, deleteUsers
} from "../controllers/userController.js"
import limiter from '../utils/limiter.js'

const router =  Router()

router.post("/getall", getUsers)
router.post("/create", createUsers)
router.patch("/update", limiter, updateUsers)
router.delete("/delete/:username", deleteUsers)

export default router