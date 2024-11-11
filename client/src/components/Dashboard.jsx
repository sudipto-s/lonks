import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { getCookie } from "../utils/userCookie"
import axios from "axios"
import EditUrlModal from "./EditUrlModal"
import { io } from "socket.io-client"
import visit from "../assets/visit.svg"
import edit from "../assets/edit.svg"
import share from "../assets/share.svg"
import copy from "../assets/copy.svg"
import deleteimg from "../assets/delete.svg"
import { copyLink, getDaysCreatedAge, getFaviconUrl, shareLink } from "../utils/dashboardUtils"

const Dashboard = ({ user, setUser }) => {
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
            {urls?.map((link, i) => (
               <div key={i} className="url-card">
                  <div className="top">
                     <div className="host-logo">
                        <img src={getFaviconUrl(link.originalUrl)} alt="host-logo" />
                     </div>
                     <div className="url-links">
                        <span className="short-url">
                           {window.origin.replace(/https?:\/\//, "")}/{link.slug}
                        </span>
                        <p className="dest-url" title="Destination URL">
                           {link.originalUrl}
                        </p>
                     </div>
                  </div>
                  <div className="middle">
                     <span className="clicks">{link.clicks} click{link.clicks > 1 ? "s" : ""}</span> |&nbsp;
                     <span className="created">Created {getDaysCreatedAge(link.createdAt)}</span>
                     {/* | <span className="expires">Expires in t days</span> */}
                  </div>
                  <div className="bottom">
                     <span title="Visit link">
                        <a href={`/${link.slug}`} target="_blank" rel="noopener noreferrer">
                           <img src={visit} className="link-visit" alt="visit" />
                        </a>
                     </span>
                     <span onClick={() => setModalOpen(link)} title="Edit link">
                        <img src={edit} className="link-edit" alt="edit" />
                     </span>
                     <span onClick={() => shareLink(`${window.origin}/${link.slug}`)} title="Share link">
                        <img src={share} className="link-share" alt="share" />
                     </span>
                     <span onClick={() => copyLink(`${window.origin}/${link.slug}`, setCopySlug)} title="Copy link">
                        <img src={copy} className="link-copy" alt="copy" />
                     </span>
                     <span onClick={() => handleDelete(link.slug)} data-tip="Delete link">
                        <img src={deleteimg} className="link-delete" alt="delete" />
                     </span>
                  </div>
               </div>
            ))}
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