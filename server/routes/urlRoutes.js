import { Router } from "express"
import {
   createUrl, getUrl, getAll, updateUrl, deleteUrl
} from "../controllers/urlController.js"
import limiter from "../utils/limiter.js"
import { checkUser, requireAuth } from "../middlewares/authMiddleware.js"

const router = Router()

router.get("/:slug", getUrl)
router.post("/url/all", getAll)
router.delete("/url/delete/:slug", deleteUrl)
router.use(limiter, requireAuth, checkUser)
router.post("/url/create", createUrl)
router.patch("/url/update", updateUrl)

export default router