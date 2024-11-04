import { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import "../css/LoginSignup.css"
import { getCookie, setCookie } from '../utils/userCookie'
import LoginForm from './forms/LoginForm'

const Login = ({ user, setUser }) => {
   document.title = "Login - Lonks"
   const [email, setEmail] = useState("")
   const [password, setPassword] = useState("")
   const [error, setError] = useState("")
   const [buttonText, setButtonText] = useState("Login")

   const navigate = useNavigate()
   useEffect(() => {
      navigate(user?.logged && "/app/dashboard")
   }, [user, navigate])
   useEffect(() => {
      const cok = getCookie()
      cok && setUser({ ...cok })
   }, [setUser, navigate])

   const handleSubmit = async (e) => {
      e.preventDefault()

      // Regular expression for email validation
      const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
      // Validate the email
      if (!emailRegex.test(email)) {
         setError("Please enter a valid email address")
         return
      } else 
         setError("")

      try {
         setError(null)
         setButtonText("Loading..")
         const { data } = await axios.post("/api/v1/auth/login", { email, password })
         setUser({ ...data, email, logged: true })
         setCookie({ ...data, email, logged: true })
         setError("")
      } catch (err) {
         console.error(err)
         setError(err.response?.data?.message || "Login failed")
      } finally {
         setButtonText("Login")
      }
   }

   return (
      <div className="auth-container">
         <LoginForm
            email={email} setEmail={setEmail}
            password={password} setPassword={setPassword}
            error={error} buttonText={buttonText}
            handleSubmit={handleSubmit}
         />
         
      </div>
   )
}

export default Login