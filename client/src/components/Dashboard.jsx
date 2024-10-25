import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { getCookie } from "../utils/userCookie"
import axios from "axios"
import EditUrlModal from "./EditUrlModal"
import { io } from "socket.io-client"

const Dashboard = ({ user, setUser }) => {
   const [urls, setUrls] = useState(null)
   const [error, setError] = useState("")
   const [loading, setLoading] = useState(false)
   const [deleteSlug, setDeleteSlug] = useState(null)
   const [isModalOpen, setModalOpen] = useState(null)
   const [_, setSocket] = useState(null)

   useEffect(() => {
      // Create a new socket connection
      const newSocket = io(
         import.meta.env.MODE === "development" ?
         "http://localhost:5000" : window.location.origin
      )
      setSocket(newSocket)

      // Receive updated data from via socket
      newSocket.on("click-update", ({ slug, clicks }) => {
         setUrls(prevUrls =>
            prevUrls?.map(url =>
               url.slug === slug ? { ...url, clicks } : url
            )
         )
      })
      
      return () => newSocket.disconnect()
   }, [])

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

   const truncateUrl = url => {
      const screenWidth = window.innerWidth;
      const charLimit = Math.floor(screenWidth / (screenWidth > 600 ? 30 : 18)); // Adjust the divisor to fine-tune

      return url.length > charLimit ? url.slice(0, charLimit) + '...' : url;
   }

   const handleDelete = async slug => {
      if (confirm(`Do you want to delete /${slug}`)) {
         try {
            const { data } = await axios.delete(`/url/delete/${slug}`)
            console.log(data)
            setDeleteSlug(slug)
            setError("")
            setTimeout(() => setDeleteSlug(null), 2500)

            // Update the URLs state to remove the deleted URL
            setUrls(prevUrls => prevUrls.filter(link => link.slug !== slug))
         } catch (err) {
            console.log(err)
            setDeleteSlug(null)
            setError(err.response?.data?.message)
            alert(err.response?.data?.message)
         }
      }
   }

   return (
      <div className="dashboard-container">
         <h2>Welcome, {user?.username}! ✨</h2>
         {loading && <p>Loading your shortened links...</p>}

         {deleteSlug && (
            <h3 className={`delete-slug-msg ${deleteSlug ? 'show' : ''}`}>
               Slug /{deleteSlug} deleted successfully!
            </h3>
         )}

         {error || loading ? <p className="error">{error}</p> : <h3>Your Shortened Links</h3>}

         {!urls?.length ? (
            !loading && <p>No shortened links yet. Start by creating one!</p>
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
                  {urls?.map((link, i) => (
                     <tr key={i}>
                        <td data-label="Original URL" title={link.originalUrl}>
                           {truncateUrl(link.originalUrl)}
                        </td>
                        <td data-label="Shortened URL">
                           <a href={`/${link.slug}`} target="_blank" rel="noopener noreferrer">
                              /{link.slug}
                           </a>
                        </td>
                        <td data-label="Clicks">{link.clicks}</td>
                        <td data-label="Actions" className="">
                           <div className="actions-div">
                              <button
                                 className="delete-button"
                                 onClick={() => handleDelete(link.slug)}
                              >Delete</button> | &nbsp;
                              <button
                                 className="delete-button"
                                 onClick={() => setModalOpen(link)}
                              >Update</button>
                           </div>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         )}
         {isModalOpen && (
            <EditUrlModal
               link={isModalOpen} setUrls={setUrls}
               setModalOpen={setModalOpen}
            />
         )}
      </div>
   )
}

export default Dashboard