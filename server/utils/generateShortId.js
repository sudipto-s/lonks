import { nanoid } from "nanoid"
import Url from "../models/Url.js"

// Generates a 4 characters long ID
export default async () => {
   try {
      while (true) {
         const slug = nanoid().slice(0, 4).toLowerCase()
         const existingUrl = await Url.findOne({ slug })
         if (!existingUrl)
            return slug
      }
   } catch (err) {
      console.error("Error generating slug:", err.message)
      throw new Error("Slug generation failed")
   }
}