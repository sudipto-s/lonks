import { useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import axios from "axios"
import "../css/Auth.css"

const ResetPassword = () => {
   const [password, setPassword] = useState("")
   const [confirmPassword, setConfirmPassword] = useState("")
   const [message, setMessage] = useState("")
   const [btnTxt, setBtnTxt] = useState("Reset Password")
   const navigate = useNavigate()
   const [searchParams] = useSearchParams()
   const token = searchParams.get("token")

   const handleSubmit = async e => {
      e.preventDefault()
      setBtnTxt("Loading..")
      if (password !== confirmPassword) {
         setMessage("Passwords do not match!")
         return
      }

      try {
         const { data } = await axios.post("/api/v1/auth/reset-password", {
            token, password
         })
         setMessage(data.message)
         setTimeout(() => navigate("/app/login"), 2000)
      } catch (err) {
         setMessage(err.response?.data?.message || "Something went wrong!")
      } finally {
         setBtnTxt("Reset Password")
      }
   }

   return (
      <div className="auth-container">
         <form onSubmit={handleSubmit} className="auth-form">
            <h2>Reset Password</h2>
            {message && <p className="error">{message}</p>}
            <input
               type="password"
               placeholder="New Password"
               value={password}
               onChange={e => setPassword(e.target.value)}
               required
            />
            <input
               type="password"
               placeholder="Confirm Password"
               value={confirmPassword}
               onChange={e => setConfirmPassword(e.target.value)}
               required
            />
            <button type="submit">{btnTxt}</button>
         </form>
      </div>
   )
}

export default ResetPassword
