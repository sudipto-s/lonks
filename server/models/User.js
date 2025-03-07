import { Schema, model } from "mongoose"

const userSchema = new Schema({
   username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
   },
   email: {
      type: String,
      required: [true, "Enter an email to continue"],
      unique: true,
      lowercase: true,
      validate: [val => /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/g.test(val), "Please enter a valid email format"]
   },
   password: {
      type: String,
      required: true,
      minlength: 6,
   },
   resetPasswordToken: String,
   resetPasswordExpires: Date,
}, { timestamps: true })

// Indexing for fast querying
userSchema.index({ username: 1, email: 1 })

export default model("User", userSchema)