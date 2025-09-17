import { Resend } from "resend"
import { OTP_TEMPLATE, WELCOME_TEMPLATE } from "./templates.js"

const resendClient = new Resend(process.env.RESEND_API_KEY)

const emailSender = async (to, subject, html) => {
   try {
      const { data, error } = await resendClient.emails.send({
         from: `Lonks <onboarding@resend.dev>`,
         to: [to],
         replyTo: process.env.EMAIL,
         subject,
         html
      })
      
      if (error) {
         console.log(error)
         throw new Error("Something went wrong! Please try after some times.")
      }
      return data.id
   } catch (err) {
      console.log(err)
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
export const welcomeSender = async (to, username, req) => {
   const domain = `${req.protocol}://${req.get("host")}`
   return await emailSender(
      to,
      "Welcome to Lonks",
      WELCOME_TEMPLATE
      .replace("[[USERNAME]]", username)
      .replace("[[DOMAIN]]", domain)
   )
}
export const resetPasswordEmail = async (to, resetLink) =>
   await emailSender(
   to,
   "Password reset request",
   `<p>Click <a href="${resetLink}">here</a> to reset your password. This link will expire in 10 minutes.</p>`
)