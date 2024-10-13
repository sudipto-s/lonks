import { useEffect, useState } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import { getCookie, setCookie } from '../utils/userCookie'
import "../css/LoginSignup.css"

const Signup = ({ user, setUser }) => {
   const [email, setEmail] = useState("")
   const [password, setPassword] = useState("")
   const [confirmPassword, setConfirmPassword] = useState("")
   const [error, setError] = useState("")
   const [buttonText, setButtonText] = useState("Login")
   
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
      setButtonText("Loading..")

      if (password !== confirmPassword) {
         setError("Passwords do not match")
         return
      }
      const username = email.split("@")[0]

      try {
         const { data } = await axios.post("/api/v1/auth/signup", { username, email, password })
         console.log(data)
         setUser({ ...data, username, email, logged: true })
         setCookie({ ...data, username, email, logged: true })
         setError("")
      } catch (err) {
         console.error(err)
         setError(err.response?.data?.message || "Signup failed")
      } finally {
         setButtonText("Signup")
      }
   }

   return (
      <div className="auth-container">
         <form onSubmit={handleSubmit} className="auth-form">
            <h2>Signup</h2>
            {error && <p className="error">{error}</p>}
            <div>
               <input
                  type="email" value={email} 
                  placeholder="Email" 
                  onChange={e => setEmail(e.target.value)} 
                  required 
               />
               <input 
                  type="password" value={password} 
                  placeholder="Password" 
                  onChange={e => setPassword(e.target.value?.trim())} 
                  required 
               />
               <input 
                  type="password" value={confirmPassword} 
                  placeholder="Confirm Password" 
                  onChange={e => setConfirmPassword(e.target.value?.trim())} 
                  required 
               />
               <button type="submit">{buttonText}</button>
            </div>
            <div className="already-have-account form-links">
               <span>Already have an account? </span>
               <Link className="login-link" to="/app/login">Login</Link>
            </div>
         </form>
      </div>
   )
}

export default Signup