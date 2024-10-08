import { Schema, model } from "mongoose"

const urlSchema = new Schema({
   slug: {
      type: String,
      required: true,
      unique: true
   },
   originalUrl: {
      type: String,
      required: true
   },
   clicks: {
      type: Number,
      default: 0
   }
}, { timestamps: true })

export default model("Url", urlSchema)