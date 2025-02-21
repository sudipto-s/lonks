import { Router } from "express"
import {
   createUrl, getUrl, getAll, updateUrl, deleteUrl, getOne
} from "../controllers/urlController.js"
import limiter from "../utils/limiter.js"
import { checkUser, requireAuth } from "../middlewares/authMiddleware.js"

const router = Router()

router.get("/:slug", getUrl)
router.delete("/url/delete/:slug", requireAuth, checkUser, deleteUrl)
router.post("/url/all", requireAuth, checkUser, getAll)
router.post("/url/getone", requireAuth, checkUser, getOne)
router.post("/url/create", limiter, requireAuth, checkUser, createUrl)
router.patch("/url/update", requireAuth, checkUser, updateUrl)

export default router