import Url from "../models/Url.js"

export const createurl = async (req, res) => {
   const { slug, originalUrl } = req.body
   try {
      let newUrl = await Url.create({ slug, originalUrl })
      newUrl = { ...newUrl, slugUrl: `${req.protocol}://${req.get('host')}/${slug}`}
      res.status(201).json(newUrl)
   } catch (err) {
      console.log(err.message)
      res.status(400).send(err.message)
   }
}

export const getUrl = async (req, res, next) => {
   const { slug } = req.params
   const url = await Url.findOne({ slug })
   if (url)
      res.redirect(url.originalUrl)
   else
      res.status(404).send("Url not found")
}