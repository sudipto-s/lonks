import { useCallback, useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import "../css/Auth.css"
import { getCookie, setCookie } from '../utils/userCookie'
import LoginForm from './forms/LoginForm'
import { AppContext } from "../context/AppContext"

const Login = () => {
   const { user, setUser } = useContext(AppContext)
   
   document.title = "Login - Lonks"
   const [identifier, setIdentifier] = useState("")
   const [password, setPassword] = useState("")
   const [error, setError] = useState("")
   const [buttonText, setButtonText] = useState("Login")

   const navigate = useNavigate()
   useEffect(() => {
      navigate(user?.logged && "/app/dashboard", { replace: true })
   }, [user, navigate])
   useEffect(() => {
      const cok = getCookie()
      cok && setUser({ ...cok })
   }, [setUser, navigate])

   const handleSubmit = useCallback(async e => {
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
   }, [identifier, password, setUser])

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