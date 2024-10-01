import { Router } from "express"
import { createurl, getUrl } from "../controllers/urlController.js"
import limiter from "../utils/limiter.js"

const router = Router()

router.post("/url/create", limiter, createurl)
router.get("/:slug", getUrl)

export default router