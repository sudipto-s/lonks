import { useState, useEffect } from 'react' 
import axios from "axios" 
import "../css/Auth.css"
import { useNavigate } from 'react-router-dom'
import { getCookie } from "../utils/userCookie"

const ForgotPassword = ({ user, setUser }) => {
   const [email, setEmail] = useState('')
   const [btnTxt, setBtnTxt] = useState("Continue")
   const [message, setMessage] = useState(null)

   const navigate = useNavigate()
   useEffect(() => {
      navigate(user?.logged && "/app/dashboard")
   }, [user, navigate])
   useEffect(() => {
      const cok = getCookie()
      cok && setUser({ ...cok })
   }, [setUser])

   const handleForgotPassword = async e => {
      e.preventDefault()
      setBtnTxt("Loading..")

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
   }

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