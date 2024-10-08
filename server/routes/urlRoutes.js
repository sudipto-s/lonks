import { Router } from "express"
import {
   createUrl, getUrl, getAll, updateUrl, deleteUrl
} from "../controllers/urlController.js"
import limiter from "../utils/limiter.js"

const router = Router()

router.post("/url/create", limiter, createUrl)
router.get("/:slug", getUrl)
router.post("/url/all", limiter, getAll)
router.patch("/url/update/:slug", limiter, updateUrl)
router.delete("/url/delete/:slug", limiter, deleteUrl)

export default router