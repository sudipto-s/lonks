import { Router } from "express"
import {
   createUrl, getUrl, getAll, updateUrl, deleteUrl
} from "../controllers/urlController.js"
import limiter from "../utils/limiter.js"
import { checkUser, requireAuth } from "../middlewares/authMiddleware.js"

const router = Router()

router.post("/url/create", limiter, requireAuth, checkUser, createUrl)
router.get("/:slug", getUrl)
router.post("/url/all", limiter, requireAuth, getAll)
router.patch("/url/update/", limiter, requireAuth, updateUrl)
router.delete("/url/delete", limiter, requireAuth, deleteUrl)

export default router