import React, { useCallback, useContext, useEffect, useState } from "react"
import userIcon from "../assets/user.gif"
import { AppContext } from "../context/AppContext"
import { useNavigate } from "react-router-dom"
import { getCookie } from "../utils/userCookie"
import axios from "axios"

const Profile = () => {
   const { user, setUser } = useContext(AppContext)
   
   document.title = "Profile - Lonks"
   const [passwords, setPasswords] = useState({
      current: "",
      newPassword: "",
      confirmPassword: ""
   })
   const [error, setError] = useState("")
   const [buttonText, setButtonText] = useState("Change Password")
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
      if (authChecked && !user?.logged)
         navigate("/auth/login", { replace: true })
   }, [user, navigate, authChecked])

   const handleChange = e => {
      setPasswords({ ...passwords, [e.target.name]: e.target.value })
   }

   const handleSubmit = useCallback(async e => {
      e.preventDefault()
      if (passwords.newPassword !== passwords.confirmPassword) {
         setError("Passwords do not match!")
         return
      }
      
      try {
         setError(null)
         setButtonText("Updating..")
         await axios.post("/api/v1/auth/update-password", {
            oldPassword: passwords.current,
            newPassword: passwords.newPassword,
            assoc: user?.email
         })
         setError("")
         alert("Password Updated!")
      } catch (err) {
         console.error(err)
         setError(err.response?.data?.message || "Login failed")
      } finally {
         setTimeout(() => {
            setButtonText("Change Password")
         }, 1000)
      }
   }, [passwords, user])

   return (
      <div className="profileContainer">
         <div className="profile-card">
            <div className="userInfo">
            <img
               src={userIcon}
               alt="User Avatar"
               className="avatar"
            />
            <div>
               <h2>{user?.username}</h2>
               <p>{user?.email}</p>
            </div>
            </div>
            <hr />
            <div className="changePasswordContainer">
            <h3 className="password-title">Change Password</h3>
            <form onSubmit={handleSubmit}>
               <input
                  type="password"
                  name="current"
                  placeholder="Current Password"
                  value={passwords.current}
                  onChange={handleChange}
                  required
               />
               <input
                  type="password"
                  name="newPassword"
                  placeholder="New Password"
                  value={passwords.newPassword}
                  onChange={handleChange}
                  required
               />
               <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm New Password"
                  value={passwords.confirmPassword}
                  onChange={handleChange}
                  required
               />
               <button type="submit">{buttonText}</button>
            </form>
            {error && <p className="error">{error}</p>}
            </div>
         </div>
      </div>
   )
}

export default Profile