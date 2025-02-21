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
   },
   referrers: { type: Map, of: Number, default: {} },
   countryStats: { type: Map, of: Number, default: {} },
   deviceStats: { type: Map, of: Number, default: {} },
   osStats: { type: Map, of: Number, default: {} },
   browserStats: { type: Map, of: Number, default: {} },
   analyticsAvailableFrom: { type: Date, default: Date.now() },
}, { timestamps: true })

// Indexing for fast querying
urlSchema.index({ slug: 1, assoc: 1 })

// Create a TTL index on expiryDate
urlSchema.index({ expires: 1 }, { expireAfterSeconds: 0 })

export default model("Url", urlSchema)