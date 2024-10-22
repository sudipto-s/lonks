import nodemailer from "nodemailer"
import { OTP_TEMPLATE, WELCOME_TEMPLATE } from "./templates.js"

const emailSender = async (to, subject, html) => {
   const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
         user: process.env.EMAIL,
         pass: process.env.EMAIL_APP_PASS,
      }
   })

   try {
      const response = await transporter.sendMail({
         from: `Lonks <${process.env.EMAIL}>`,
         to,
         subject,
         html
      })
      return response.messageId
   } catch (err) {
      console.log(err)
      return null
   }
}

export const otpSender = async (to, otp) => {
   return await emailSender(
      to,
      "Lonks Registration OTP",
      OTP_TEMPLATE.replace("[[OTP]]", otp)
   )
}

export const welcomeSender = async (to, username) => {
   return await emailSender(
      to,
      "Welcome to Lonks",
      WELCOME_TEMPLATE.replace("[[USERNAME]]", username),
   )
}