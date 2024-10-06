import Url from "../models/Url.js"
import generateShortId from "../utils/generateShortId.js"

// Create a short link
export const createUrl = async (req, res) => {
   let { slug, originalUrl } = req.body
   if (!slug)
      slug = generateShortId()
   try {
      await Url.create({ slug, originalUrl })
      res.status(201).json({ slugUrl: `${req.protocol}://${req.get('host')}/${slug}` })
   } catch (err) {
      console.log(err.message)
      res.status(400).send(err.message)
   }
}

// Get all slugs
export const getUrl = async (req, res) => {
   const { slug } = req.params
   try {
      const url = await Url.findOne({ slug })
      if (url)
         res.redirect(url.originalUrl)
      else
         res.status(404).send("Url not found")
   } catch (err) {
      console.log(err.message)
      res.status(400).send("Server error")
   }
}

// Update a slug
export const updateUrl = async (req, res) => {
   const { slug } = req.params
   try {
      await Url.updateOne({ slug }, { $set: req.body })
      res.status(200).json({ message: "Url updated successfully" })
   } catch (err) {
      console.log(err.message)
      res.status(400).send("Server error")
   }
}

// Delete a slug
export const deleteUrl = async (req, res) => {
   const { slug } = req.params
   try {
      const url = await Url.findOneAndDelete({ slug })
      if (url)
         res.status(200).send("Url deleted")
      else
         res.status(404).send("Url not found")
   } catch (err) {
      console.log(err.message)
      res.status(400).send("Server error")
   }
}

export const getAll = async (req, res) => {
   try {
      const urls = await Url.find()
      if (urls)
         res.send(urls)
      else
         res.status(404).send("No url found")
   } catch (err) {
      console.log(err.message)
      res.status(400).send("Server error")
   }
}