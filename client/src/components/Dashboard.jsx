import { useCallback, useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { getCookie } from "../utils/userCookie"
import axios from "axios"
import EditUrlModal from "./EditUrlModal"
import { io } from "socket.io-client"
import UrlCard from "./UrlCard"
import { AppContext } from "../context/AppContext"

const Dashboard = () => {
   const { user, setUser } = useContext(AppContext)

   document.title = "Dashboard - Lonks"
   const [urls, setUrls] = useState(null)
   const [error, setError] = useState("")
   const [loading, setLoading] = useState(false)
   const [copySlug, setCopySlug] = useState(null) 
   const [deleteSlug, setDeleteSlug] = useState(null)
   const [isModalOpen, setModalOpen] = useState(null)

   useEffect(() => {
      // Create a new socket connection
      const newSocket = io(
         import.meta.env.MODE === "development" ?
         "http://localhost:5000" : window.location.origin
      )

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
      navigate(user?.logged || "/auth/login", { replace: true })
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

   const handleDelete = useCallback(async slug => {
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
   }, [])

   return (
      <div className="dashboard-container">
         <h2>Welcome, {user?.username}! ✨</h2>
         {loading && <p>Loading your shortened links...</p>}

         {copySlug && (
            <h3 className={`delete-slug-msg ${copySlug ? 'show' : ''}`}>
               Link copied successfully!
            </h3>
         )}
         {deleteSlug && (
            <h3 className={`delete-slug-msg ${deleteSlug ? 'show' : ''}`}>
               Slug /{deleteSlug} deleted successfully!
            </h3>
         )}

         {error || loading ? <p className="error">{error}</p> : <h3>Your Shortened Links</h3>}

         {!urls?.length ? (
            !loading && <p>No shortened links yet. Start by creating one!</p>
         ) : (
            <div className="url-container">
            {urls?.map((link, i) =>
               <UrlCard key={i} link={link}
                  handleDelete={handleDelete}
                  setModalOpen={setModalOpen}
                  setCopySlug={setCopySlug}
               />
            )}
            </div>
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