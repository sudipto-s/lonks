import { useCallback, useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import "../css/Auth.css"
import { getCookie, setCookie } from '../utils/userCookie'
import LoginForm from './forms/LoginForm'
import { AppContext } from "../context/AppContext"
import { toast } from "sonner"

const Login = () => {
   const { user, setUser } = useContext(AppContext)
   
   document.title = "Login - Lonks"
   const [identifier, setIdentifier] = useState("")
   const [password, setPassword] = useState("")
   const [error, setError] = useState("")
   const [buttonText, setButtonText] = useState("Login")
   const [authChecked, setAuthChecked] = useState(false)

   const navigate = useNavigate()
   useEffect(() => {
      (async function() {
         const savedUser = getCookie()
            setUser(savedUser)
         setAuthChecked(true)
      })()
   }, [setUser])
   useEffect(() => {
      if (authChecked && user?.logged)
         navigate("/app/dashboard", { replace: true })
   }, [user, navigate, authChecked])

   const handleSubmit = useCallback(async e => {
      e.preventDefault()

      try {
         setButtonText("Loading..")
         const { data } = await axios.post("/api/v1/auth/login", { identifier, password })
         setUser({ ...data, logged: true })
         setCookie({ ...data, logged: true })
         toast.success("Logged in successfully!", { duration: 2000 })
      } catch (err) {
         console.error(err)
         toast.error(err.response?.data?.message || "Login failed")
      } finally {
         setButtonText("Login")
      }
   }, [identifier, password, setUser])

   return (
      <div className="auth-container">
         <LoginForm
            identifier={identifier} setIdentifier={setIdentifier}
            password={password} setPassword={setPassword}
            buttonText={buttonText}
            handleSubmit={handleSubmit}
         />
      </div>
   )
}

export default Login