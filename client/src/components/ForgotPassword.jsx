import { useState, useEffect, useCallback, useContext } from 'react' 
import axios from "axios" 
import "../css/Auth.css"
import { useNavigate } from 'react-router-dom'
import { getCookie } from "../utils/userCookie"
import { isEmail } from "../utils/authUtils"
import { AppContext } from "../context/AppContext"

const ForgotPassword = () => {
   const { user, setUser } = useContext(AppContext)

   const [email, setEmail] = useState('')
   const [btnTxt, setBtnTxt] = useState("Continue")
   const [message, setMessage] = useState(null)
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

   const handleForgotPassword = useCallback(async e => {
      e.preventDefault()
      setBtnTxt("Loading..")

      if (!isEmail(email)) {
         setMessage("Please enter a valid Email format")
         return
      }

      try {
         const { data } = await axios.post("/api/v1/auth/forgot-password", { email })
         console.log(data)
         setEmail("")
         setMessage(data.message)
      } catch (err) {
         console.log(err)
         setMessage(err.response?.data?.message || "Something went wrong!")
      } finally {
         setBtnTxt("Continue")
      }
   }, [email])

   return (
      <div className="auth-container">
         <form onSubmit={handleForgotPassword} className="auth-form">
            <h2>Recover Password</h2>
            {message && <p className="error">{message}</p>}
            <div>
               <input
                  type="email" value={email}
                  placeholder="Email"
                  onChange={e => setEmail(e.target.value?.trim()) }
                  required 
               />
               <button type="submit">{btnTxt}</button>
            </div>
         </form>
      </div>
   )
}
 
export default ForgotPassword;