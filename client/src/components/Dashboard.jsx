import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { getCookie } from "../utils/userCookie"
import axios from "axios"

const Dashboard = ({ user, setUser }) => {
   const [urls, setUrls] = useState(null)
   const [error, setError] = useState("")
   const [loading, setLoading] = useState(false)

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
            setLoading(true)
            const { data } = await axios.post("/url/all", { assoc: user?.email })
            setUrls(data)
            setError(null)
         } catch (err) {
            setUrls(null)
            setError(err.response?.data?.message)
         } finally {
            setLoading(false)
         }
      }
      user?.email && fetchUrls()
   }, [user])

   const truncateUrl = url =>
      url.length > 25 ? url.slice(0, 30) + '...' : url

   const handleDelete = async (e, slug) => {
      const action = e.target.value
      if (action === "delete") {
         if (confirm(`Do you want to delete /${slug}`)) {
            try {
               const { data } = await axios.delete(`/url/delete/${slug}`)
               console.log(data)
               alert(data)
               setError("")

               // Update the URLs state to remove the deleted URL
               setUrls((prevUrls) => prevUrls.filter(link => link.slug !== slug))
            } catch (err) {
               console.log(err)
               setError(err.response?.data?.message)
               alert(err.response?.data?.message)
            }
         }
      }
   }

   return (
      <div className="dashboard-container">
         <h2>Welcome, {user?.username}</h2>
         {loading && <p>Loading your shortened links...</p>}
         {error ? <p className="error">{error}</p> : <h3>Your Shortened Links</h3>}
         {!urls?.length && !loading ? (
            <p>No shortened links yet. Start by creating one!</p>
         ) : (
            <table>
               <thead>
                  <tr>
                     <th>Original URL</th>
                     <th>Shortened URL</th>
                     <th>Clicks</th>
                     <th>Actions</th>
                  </tr>
               </thead>
               <tbody>
                  {urls?.map(link => (
                     <tr key={link._id}>
                        <td data-label="Original URL" title={link.originalUrl}>
                           {truncateUrl(link.originalUrl)}
                        </td>
                        <td data-label="Shortened URL">
                           <a href={`/${link.slug}`} target="_blank" rel="noopener noreferrer">
                              /{link.slug}
                           </a>
                        </td>
                        <td data-label="Clicks">{link.clicks}</td>
                        <td data-label="Actions" className="action-dropdown">
                           <select onChange={e => handleDelete(e, link.slug)}>
                              <option value="">Actions</option>
                              <option value="delete">Delete</option>
                           </select>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
            /*<table>
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
            </table>*/
         )}
      </div>
   )
}

export default Dashboard