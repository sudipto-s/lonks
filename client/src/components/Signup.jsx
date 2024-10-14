import { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { getCookie, setCookie } from '../utils/userCookie'
import "../css/LoginSignup.css"
import SignupForm from './forms/SignupForm'
import OtpForm from "./forms/OtpForm"

const Signup = ({ user, setUser }) => {
   const [newUser, setNewUser] = useState({username:"",email:"",password:"",confirmPassword:""})
   const [otp, setOtp] = useState("")
   const [otpSent, setOtpSent] = useState(false)
   const [error, setError] = useState("")
   const [buttonText, setButtonText] = useState("Login")
   
   const navigate = useNavigate()
   useEffect(() => {
      setUser(getCookie())
      navigate(user?.logged && "/app/dashboard")
   }, [user, setUser, navigate])
   useEffect(() => {
      console.log(user)
   }, [user])
   useEffect(() => {
      const cok = getCookie()
      cok && setUser({ ...cok })
   }, [setUser, navigate])

   const handleSubmit = async (e) => {
      e.preventDefault()
      setButtonText("Loading..")
      const { email, password, confirmPassword } = newUser

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
         const { data } = await axios.post("/api/v1/auth/signup", { username, email, password })
         console.log(data)
         setOtpSent(true)
         setError("")
      } catch (err) {
         console.error(err)
         setError(err.response?.data?.message || "Signup failed")
      } finally {
         setButtonText("Verify")
      }
   }

   const handleOtpVerify = async e => {
      e.preventDefault()
      setButtonText("Verifying OTP..")
      const { username, email, password } = newUser

      try {
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