import Url from "../models/Url.js"
import generateShortId from "../utils/generateShortId.js"

// Create a short link
export const createUrl = async (req, res) => {
   let { slug, originalUrl } = req.body
   if (!slug)
      slug = await generateShortId()
   try {
      await Url.create({ slug, originalUrl })
      res.status(201).json({ slugUrl: `${req.protocol}://${req.get('host')}/${slug}` })
   } catch (err) {
      console.log(err.message)
      if (err.message.includes("E11000"))
         return res.status(409).send("Duplicate slug")
      res.status(500).send(err.message)
   }
}

// Redirect to original url
export const getUrl = async (req, res) => {
   const { slug } = req.params
   try {
      const url = await Url.findOneAndUpdate({ slug }, { $inc: { clicks: 1 } })
      if (!url)
         return res.status(404).send("Url not found")
      return res.redirect(url.originalUrl)
   } catch (err) {
      console.log(err.message)
      res.status(500).send("Server error")
   }
}

// Update a slug
export const updateUrl = async (req, res) => {
   const { slug } = req.params
   try {
      const updatedUrl = await Url.updateOne({ slug }, { $set: { ...req.body } })
      if (!updatedUrl.modifiedCount)
         return res.status(404).send("Url not found")
      return res.status(200).json({ message: "Url updated successfully" })
   } catch (err) {
      console.log(err.message)
      res.status(500).send("Server error")
   }
}

// Delete a slug
export const deleteUrl = async (req, res) => {  
   const { slug } = req.params
   try {
      const url = await Url.findOneAndDelete({ slug })
      if (!url)
         return res.status(404).send("Url not found")
      return res.status(200).send("Url deleted")
   } catch (err) {
      console.log(err.message)
      res.status(500).send("Server error")
   }
}

// Get all slugs
export const getAll = async (req, res) => {
   try {
      const urls = await Url.find()
      if (!urls)
         return res.status(404).send("No url found")
      return res.send(urls)
   } catch (err) {
      console.log(err.message)
      res.status(500).send("Server error")
   }
}