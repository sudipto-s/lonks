import Url from "../models/Url.js"
import User from "../models/User.js"
import { io } from "../index.js"

const urlChangeStream = Url.watch()

const getUpdate = async (model, id) => await model.findById(id)

const handleChange = async (change, model, name) => {
   // console.log(change.operationType, `${name} changed:`)

   try {
      if (change.documentKey?._id) {
         let changeDoc
         if(change.operationType === "insert")
            changeDoc = change.fullDocument
         else if(change.operationType === "update")
            changeDoc = await getUpdate(model, change.documentKey._id)
         else if(change.operationType === "delete")
            changeDoc = change.documentKey?._id

         io.emit(`${name}Change-${change.operationType}`, JSON.stringify(changeDoc))
      }
   } catch (error) {
      console.error(`Error fetching original document for ${name}:`, error)
   }
}

urlChangeStream.on("change", change => handleChange(change, Url, "url"))

export default { urlChangeStream }