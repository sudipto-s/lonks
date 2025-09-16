import { Schema, model } from "mongoose"


const otpSchema = new Schema({
   email: {
      type: String,
      required: [true, "Enter an email to continue"],
      unique: true,
      lowercase: true,
      validate: [val => /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/g.test(val), "Please enter a valid email format"]
   },
   otp: {
      type: Number,
      required: true
   },
   expires: {
      type: Date,
      required: true,
      default: () => new Date(Date.now() + 10 * 60 * 1000)
   }
}, { timestamps: true })

// Indexing for fast querying
otpSchema.index({ email: 1 })

// Create a TTL index on expires field
otpSchema.index({ expires: 1 }, { expireAfterSeconds: 0 })

export default model("Otp", otpSchema)