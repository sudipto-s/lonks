import Url from "../models/Url.js"
import generateShortId from "../utils/generateShortId.js"
import botUserAgents from "../utils/botList.js"
// import { emitClickCountUpdate } from "../index.js"

// Create a short link
export const createUrl = async (req, res) => {
   let { slug, originalUrl } = req.body
   if (!res.user)
      return res.status(401).json({ message: "Unauthorized! Please re-login" })
   const { email: assoc } = res.user

   // slug 'app' is restricted value
   if (slug === "app")
      return res.status(400).json({ message: "Slug 'app' is restricted"})
   else if (!slug)
      slug = await generateShortId()

   try {
      await Url.create({ slug, originalUrl, assoc })
      res.status(201).json({ slugUrl: slug })
   } catch (err) {
      console.log(err.message)
      if (err.message.includes("E11000"))
         return res.status(409).send("Duplicate slug")
      res.status(500).json({ message: err.message })
   }
}

// Redirect to original url
export const getUrl = async (req, res) => {
   const { slug } = req.params
   if (slug === "app")
      return res.status(301).redirect("/")

   // Check if the request is from a bot or pre-fetching service
   const userAgent = req.headers['user-agent']

   // Check if the request comes from one of these bots
   const isBot = botUserAgents.some(bot => userAgent.toLowerCase().includes(bot.toLowerCase()))

   try {
      const url = await Url.findOne({ slug })

      if (!url)
         return res.status(404).send("Url not found")

      // Increment the click count if request is not from a bot
      if (!isBot) {
         url.clicks++
         await url.save()
         
         // Emit the updated click count to connected clients
         // emitClickCountUpdate(slug, url.clicks)
      }

      return res.redirect(url.originalUrl)
   } catch (err) {
      console.log(err.message)
      res.status(500).json({ messgae: err.message })
   }
}

// Update a slug
export const updateUrl = async (req, res) => {
   let { slug, newSlug, originalUrl } = req.body
   if (!res.user)
      return res.status(401).json({ message: "Unauthorized! Please re-login" })

   if (!newSlug)
      newSlug = await generateShortId()
   
   try {
      const updatedUrl = await Url.findOneAndUpdate(
         { slug },
         { slug: newSlug, originalUrl },
         { new: true }
      )
      if (!updatedUrl)
         return res.status(404).send("Url not found. Error deleting url")
      res.status(200).send(updatedUrl)
   } catch (err) {
      console.log(err.message)
      if (err.message.includes("E11000"))
         return res.status(409).send("Duplicate slug")
      res.status(500).json({ message: err.message })
   }
}

// Delete a slug
export const deleteUrl = async (req, res) => {  
   const { slug } = req.params
   if (!res.user)
      return res.status(401).json({ message: "Unauthorized! Please re-login" })

   try {
      const url = await Url.findOneAndDelete({ slug })
      if (!url)
         return res.status(404).send({ message: "Url not found" })
      return res.status(200).send("Url deleted")
   } catch (err) {
      console.log(err.message)
      res.status(500).json({ message: err.message })
   }
}

// Get slugs
export const getAll = async (req, res) => {
   const { assoc } = req.body
   if (!res.user)
      return res.status(401).json({ message: "Unauthorized! Please re-login" })

   try {
      const urls = await Url.find(assoc ? { assoc } : {})
      if (!urls)
         return res.status(404).send({ message: "No URLs found" })
      return res.status(200).send(urls)
   } catch (err) {
      console.log(err.message)
      res.status(500).json({ message: err.message })
   }
}