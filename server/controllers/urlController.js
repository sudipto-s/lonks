import Url from "../models/Url.js"
import generateShortId from "../utils/generateShortId.js"
import { isbot } from "isbot"
import { io } from "../index.js"
import geoip from "geoip-lite"
import {UAParser} from "ua-parser-js"
import { getCountryName, extractDomain } from "../utils/utils.js"

// Create a short link
export const createUrl = async (req, res) => {
   let { slug, originalUrl, expires } = req.body
   if (!res.user)
      return res.status(401).json({ message: "Unauthorized! Please re-login" })
   const { email: assoc } = res.user

   // Generate a 4 character unique slug if user doesn't provide
   if (!slug)
      slug = await generateShortId()
   // Change slug to lower case
   slug = slug.toLowerCase()
   // Check if slug is less than 3 characters
   if (slug.length < 3)
      return res.status(400).json({ message: "Slug must be at least 3 characters" })

   try {      
      await Url.create({
         slug, originalUrl, assoc,
         expires: expires === "never" ? null : new Date(Date.now() + expires * 24 * 60 * 60 * 1000),
      })

      res.status(201).json({ slugUrl: slug })
   } catch (err) {
      console.log(err.message)
      if (err.message.includes("E11000"))
         return res.status(409).send("Duplicate slug")
      res.status(500).json({ message: err.message })
   }
}

// Redirect to original url
const redirects = ["app", "auth", "s", "u"]
export const getUrl = async (req, res) => {
   let { slug } = req.params
   slug = slug.toLowerCase()
   if (redirects.includes(slug))
      return res.status(301).redirect("/")

   // Check if the request is from a bot or pre-fetching service
   const userAgent = req.headers['user-agent'] || ""

   // Check if the request comes from one of these bots
   const isBot = isbot(userAgent)

   try {
      // Extract user details
      const ip = req.headers["x-forwarded-for"]?.split(",")[0] || req.connection.remoteAddress
      const geo = geoip.lookup(ip)
      const ua = UAParser(req.headers["user-agent"])
      // Click data
      const clickData = {
         referrer: extractDomain(req.get("Referer")) || "Direct",
         country: getCountryName(geo?.country),
         browser: ua.browser.name || "Unknown",
         os: ua.os.name || "Unknown",
         device: ua.device.type || "Desktop"
      }

      let updatedUrl
      if (isBot)
         updatedUrl = await Url.findOne({ slug })
      else {
         updatedUrl = await Url.findOneAndUpdate(
            { slug },
            { $inc: {
               clicks: 1,
               [`referrers.${clickData.referrer}`]: 1,
               [`countryStats.${clickData.country}`]: 1,
               [`deviceStats.${clickData.device}`]: 1,
               [`osStats.${clickData.os}`]: 1,
               [`browserStats.${clickData.browser}`]: 1
            }},
            { new: true }
         )
      }
      
      if (!updatedUrl)
         return res.status(404).send("Url not found")

      // Emit the updated url to connected clients if not bot
      if (!isBot)
         io.emit("analytics-update", JSON.stringify(updatedUrl))

      res.redirect(updatedUrl.originalUrl)
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

   // Generate a 4 character unique slug if user doesn't provide
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

   // Check if user is authenticated & the requested email is same as the actual email
   if (!res.user || res.user.email !== assoc)
      return res.status(401).json({ message: "Unauthorized access detected! Please re-login" })

   try {
      // Find links associated with the email, sorted by 'createdAt' in descending order
      const urls = await Url.find({ assoc }).sort({ createdAt: -1 })
      if (!urls)
         return res.status(404).send({ message: "No URLs found" })
      return res.status(200).send(urls)
   } catch (err) {
      console.log(err.message)
      res.status(500).json({ message: err.message })
   }
}

// Get one
export const getOne = async (req, res) => {
   const { assoc, slug } = req.body

   // Check if user is authenticated & the requested email is same as the actual email
   if (!res.user || res.user.email !== assoc)
      return res.status(401).json({ message: "Unauthorized access detected! Please re-login" })

   try {
      const url = await Url.findOne({ slug, assoc })
      if (!url)
         return res.status(404).send({ message: "No URL found" })
      return res.status(200).send(url)
   } catch (err) {
      console.log(err.message)
      res.status(500).json({ message: err.message })
   }
}
