import nodemailer from "nodemailer"
import { OTP_TEMPLATE } from "./templates.js"

const sendOtp = async (to, otp) => {
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
         subject: "Lonks Registration OTP",
         html: OTP_TEMPLATE.replace("[[OTP]]", otp)
      })
      return response.messageId
   } catch (err) {
      console.log(err)
      return null
   }
}

export default sendOtp