import { Router } from "express"
import urlController from "../controllers/urlController.js"
import limiter from "../utils/limiter.js"

const router = Router()

router.post("/url/create", limiter, urlController.createUrl)
router.get("/:slug", urlController.getUrl)
router.post("/url/all", urlController.getAll)
router.delete("/url/delete/:slug", urlController.deleteUrl)

export default router