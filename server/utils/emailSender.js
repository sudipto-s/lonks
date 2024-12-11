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
      if (err.responseCode === 535)
         throw new Error("Something went wrong! Please try after some times.")
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

export const resetPasswordEmail = async (to, resetLink) =>
   await emailSender(
   to,
   "Password reset request",
   `<p>Click <a href="${resetLink}">here</a> to reset your password. This link will expire in 10 minutes.</p>`
)