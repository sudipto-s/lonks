import { Schema, model } from "mongoose"

const userSchema = new Schema({
   username: {
      type: String,
      required: true,
      unique: true
   },
   email: {
      type: String,
      required: [true, "Enter an email to continue"],
      unique: true,
      lowercase: true,
      // validate: [val => /^[\w\-\.]+@([\w-]+\.)+[\w-]{2,}$/g.test(val), "Please enter a valid email"]
   },
   password: {
      type: String,
      required: [true, 'Please enter a password'],
      // minlength: [6, 'Minimum password length is 6 characters'],
   }
}, { timestamps: true })

export default model("User", userSchema)