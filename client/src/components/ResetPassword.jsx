import { useCallback, useState, useEffect, useContext } from "react"
import { useNavigate, useParams } from "react-router-dom"
import axios from "axios"
import "../css/Auth.css"
import { getCookie } from "../utils/userCookie"
import { AppContext } from "../context/AppContext"

const ResetPassword = () => {
   const { user, setUser } = useContext(AppContext)

   const [password, setPassword] = useState("")
   const [confirmPassword, setConfirmPassword] = useState("")
   const [message, setMessage] = useState("")
   const [btnTxt, setBtnTxt] = useState("Reset Password")
   const navigate = useNavigate()
   const { token } = useParams()

   useEffect(() => {
      setUser(getCookie())
      navigate(user?.logged && "/app/dashboard", { replace: true })
   }, [user, setUser, navigate])
   useEffect(() => {
      const cok = getCookie()
      cok && setUser({ ...cok })
   }, [setUser, navigate])

   const handleSubmit = useCallback(async e => {
      e.preventDefault()
      setBtnTxt("Loading..")
      if (password.length < 6) {
         setMessage("Minimun passoword length is 6")
         setBtnTxt("Reset Password")
         return
      }
      if (password !== confirmPassword) {
         setMessage("Passwords do not match!")
         setBtnTxt("Reset Password")
         return
      }

      try {
         const { data } = await axios.post("/api/v1/auth/reset-password", {
            token, password
         })
         setMessage(data.message)
         setTimeout(() => navigate("/auth/login"), 2000)
      } catch (err) {
         setMessage(err.response?.data?.message || "Something went wrong!")
      } finally {
         setBtnTxt("Reset Password")
      }
   }, [password, confirmPassword, token, navigate])

   return (
      <div className="auth-container">
         <form onSubmit={handleSubmit} className="auth-form">
            <h2>Reset Password</h2>
            {message && <p className="error">{message}</p>}
            <input
               type="password"
               placeholder="New Password"
               value={password}
               onChange={e => setPassword(e.target.value?.trim())}
               required
            />
            <input
               type="password"
               placeholder="Confirm Password"
               value={confirmPassword}
               onChange={e => setConfirmPassword(e.target.value?.trim())}
               required
            />
            <button type="submit" disabled={btnTxt === "Loading.."}>{btnTxt}</button>
         </form>
      </div>
   )
}

export default ResetPassword
