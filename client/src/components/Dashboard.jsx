import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { getCookie } from "../utils/userCookie"
import axios from "axios"


const Dashboard = ({ user, setUser }) => {
   const [urls, setUrls] = useState([])
   const [error, setError] = useState("")

   const navigate = useNavigate()
   useEffect(() => {
      navigate(user?.logged || "/app/login")
   }, [user, navigate])
   useEffect(() => {
      const cok = getCookie()
      cok && setUser({ ...cok })
   }, [setUser])

   useEffect(() => {
      const fetchUrls = async () => {
         try {
            const { data } = await axios.post("/api/v1/url/all", { email: user?.email })
            setUrls(data)
            setError("")
         } catch (err) {
            console.error(err)
            setError(err.response?.data?.message || "Failed to fetch URLs")
         }
      }

      user?.logged && fetchUrls()
   }, [user])

   return (
      <div className="dashboard-container">
         <h2>Welcome, {user?.username}</h2>
         {error ? <p className="error">{error}</p> : <h3>Your Shortened Links</h3>}
         {!urls?.length ? (
            <p>No shortened links yet. Start by creating one!</p>
         ) : (
            <table>
               <thead>
                  <tr>
                     <th>Slug</th>
                     <th>Original URL</th>
                     <th>Shortened URL</th>
                     <th>Clicks</th>
                  </tr>
               </thead>
               <tbody>
                  {urls?.map(url =>
                     <tr key={url._id}>
                        <td>{url.slug}</td>
                        <td>{url.originalUrl}</td>
                        <td><a href={`/${url.slug}`} target="_blank" rel="noopener noreferrer">{`/${url.slug}`}</a></td>
                        <td>{url.clicks}</td>
                     </tr>
                  )}
               </tbody>
            </table>
         )}
      </div>
   )
}

export default Dashboard