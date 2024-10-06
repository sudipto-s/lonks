import Url from "../models/Url.js"

export const createUrl = async (req, res) => {
   const { slug, originalUrl } = req.body
   try {
      await Url.create({ slug, originalUrl })
      res.status(201).json({ slugUrl: `${req.protocol}://${req.get('host')}/${slug}` })
   } catch (err) {
      console.log(err.message)
      res.status(400).send(err.message)
   }
}

export const getUrl = async (req, res) => {
   const { slug } = req.params
   const url = await Url.findOne({ slug })
   if (url)
      res.redirect(url.originalUrl)
   else
      res.status(404).send("Url not found")
}

export const deleteUrl = async (req, res) => {
   const { slug } = req.params
   const url = await Url.findOneAndDelete({ slug })
   if (url)
      res.status(200).send("Url deleted")
   else
      res.status(404).send("Url not found")
}

export const getAll = async (req, res) => {
   const urls = await Url.find()
   if (urls)
      res.send(urls)
   else
      res.status(404).send("No url found")
}