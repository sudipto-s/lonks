import { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import "../css/Auth.css"
import { getCookie, setCookie } from '../utils/userCookie'
import LoginForm from './forms/LoginForm'

const Login = ({ user, setUser }) => {
   document.title = "Login - Lonks"
   const [identifier, setIdentifier] = useState("")
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

      try {
         setError(null)
         setButtonText("Loading..")
         const { data } = await axios.post("/api/v1/auth/login", { identifier, password })
         setUser({ ...data, logged: true })
         setCookie({ ...data, logged: true })
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
            identifier={identifier} setIdentifier={setIdentifier}
            password={password} setPassword={setPassword}
            error={error} buttonText={buttonText}
            handleSubmit={handleSubmit}
         />
      </div>
   )
}

export default Login