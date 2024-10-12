import { Schema, model } from "mongoose"

const otpSchema = new Schema({
   otp: {
      type: String,
      required: true
   },
   email: {
      type: String,
      required: true,
      unique: true
   }
}, { timestamps: true })

export default model("Otp", otpSchema)