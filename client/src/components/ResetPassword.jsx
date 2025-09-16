import { useCallback, useState, useEffect, useContext } from "react"
import { useNavigate, useParams } from "react-router-dom"
import axios from "axios"
import "../css/Auth.css"
import { getCookie } from "../utils/userCookie"
import { AppContext } from "../context/AppContext"
import { toast } from "sonner"

const ResetPassword = () => {
   const { user, setUser } = useContext(AppContext)

   const [password, setPassword] = useState("")
   const [confirmPassword, setConfirmPassword] = useState("")
   const [btnTxt, setBtnTxt] = useState("Reset Password")
   const [authChecked, setAuthChecked] = useState(false)

   const navigate = useNavigate()
   const { token } = useParams()

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
      setBtnTxt("Loading..")
      if (password.length < 6) {
         toast.error("Minimun passoword length is 6")
         setBtnTxt("Reset Password")
         return
      }
      if (password !== confirmPassword) {
         toast.error("Passwords do not match!")
         setBtnTxt("Reset Password")
         return
      }

      try {
         toast.dismiss()
         const { data } = await axios.post("/api/v1/auth/reset-password", {
            token, password
         })
         toast.success(data.message)
         setTimeout(() => navigate("/auth/login"), 2000)
      } catch (err) {
         toast.error(err.response?.data?.message || "Something went wrong!")
      } finally {
         setBtnTxt("Reset Password")
      }
   }, [password, confirmPassword, token, navigate])

   return (
      <div className="auth-container">
         <form onSubmit={handleSubmit} className="auth-form">
            <h2>Reset Password</h2>
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
