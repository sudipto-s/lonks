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
   assoc: {
      type: String,
      default: null
   },
   clicks: {
      type: Number,
      default: 0
   },
   expires: {
      type: Date,
      default: null
   }
}, { timestamps: true })

// Indexing for fast querying
urlSchema.index({ slug: 1, assoc: 1 })

// Create a TTL index on expiryDate
urlSchema.index({ expires: 1 }, { expireAfterSeconds: 0 })

export default model("Url", urlSchema)