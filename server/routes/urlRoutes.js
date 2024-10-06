import { Router } from "express"
import {
   createUrl, getUrl, getAll, deleteUrl
} from "../controllers/urlController.js"
import limiter from "../utils/limiter.js"

const router = Router()

router.post("/url/create", limiter, createUrl)
router.get("/:slug", getUrl)
router.post("/url/all", getAll)
router.delete("/url/delete/:slug", deleteUrl)

export default router