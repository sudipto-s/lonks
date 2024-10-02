import { Router } from "express"
import { createurl, getAll, getUrl } from "../controllers/urlController.js"
import limiter from "../utils/limiter.js"

const router = Router()

router.post("/url/create", limiter, createurl)
router.get("/:slug", getUrl)
router.post("/url/all", getAll)

export default router