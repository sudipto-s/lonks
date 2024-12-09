import { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { getCookie, setCookie } from '../utils/userCookie'
import "../css/Auth.css"
import SignupForm from './forms/SignupForm'
import OtpForm from "./forms/OtpForm"

const Signup = ({ user, setUser }) => {
   document.title = "Signup - Lonks"
   const [newUser, setNewUser] = useState({username:"",email:"",password:"",confirmPassword:""})
   const [otp, setOtp] = useState("")
   const [otpSent, setOtpSent] = useState(false)
   const [error, setError] = useState("")
   const [buttonText, setButtonText] = useState("Signup")
   
   const navigate = useNavigate()
   useEffect(() => {
      setUser(getCookie())
      navigate(user?.logged && "/app/dashboard")
   }, [user, setUser, navigate])
   useEffect(() => {
      const cok = getCookie()
      cok && setUser({ ...cok })
   }, [setUser, navigate])

   const handleSubmit = async (e) => {
      e.preventDefault()
      const { email, password, confirmPassword } = newUser

      const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/
      if (!emailRegex.test(email)) {
         setError("Please enter a valid Email format")
         return
      }
      if (password.length < 6) {
         setError("Minimun passoword length is 6")
         return
      }
      if (password !== confirmPassword) {
         setError("Passwords do not match")
         return
      }
      const username = email.split("@")[0]
      setNewUser(prev => ({ ...prev, username }))

      try {
         setError(null)
         setButtonText("Loading..")
         const { data } = await axios.post("/api/v1/auth/signup", { email })
         console.log(data)
         setOtpSent(true)
         setError("")
      } catch (err) {
         console.error(err)
         setError(err.response?.data?.message || "Signup failed")
      } finally {
         setButtonText("Signup")
      }
   }

   const handleOtpVerify = async e => {
      e.preventDefault()
      const { username, email, password } = newUser
      
      try {
         setError(null)
         setButtonText("Verifying OTP..")
         const { data } = await axios.post("/api/v1/auth/verify", { username, email, otp, password })
         setUser({ ...data, username, email, logged: true })
         setCookie({ ...data, username, email, logged: true })
      } catch (err) {
         setButtonText('Verify')
         console.error(err)
         setError(err.response?.data?.message || 'OTP verification failed')
      }
   }

   return (
      <div className="auth-container">
         <form onSubmit={otpSent ? handleOtpVerify : handleSubmit} className="auth-form">
            <h2>{otpSent ? "Verify" : "Signup"}</h2>
            {error && <p className="error">{error}</p>}
            {
               !otpSent ?
               <SignupForm
                  newUser={newUser} setNewUser={setNewUser}
                  error={error} buttonText={buttonText}
               /> :
               <OtpForm
                  otp={otp} setOtp={setOtp}
                  error={error} buttonText={buttonText}
               />
            }
         </form>
      </div>
   )
}

export default Signup