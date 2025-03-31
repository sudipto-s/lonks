import { useCallback, useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { getCookie } from "../utils/userCookie"
import axios from "axios"
import EditUrlModal from "./EditUrlModal"
import UrlCard from "./UrlCard"
import { AppContext } from "../context/AppContext"
import info from "../assets/info.svg"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/ReactToastify.css"
import NProgress from "nprogress"
import "nprogress/nprogress.css"

const Dashboard = () => {
   const { user, setUser, socket } = useContext(AppContext)

   document.title = "Dashboard - Lonks"
   const [urls, setUrls] = useState(null)
   const [error, setError] = useState("")
   const [loading, setLoading] = useState(false)
   const [copySlug, setCopySlug] = useState(null) 
   const [deleteSlug, setDeleteSlug] = useState(null)
   const [isModalOpen, setModalOpen] = useState(null)
   const [authChecked, setAuthChecked] = useState(false)

   useEffect(() => {
      // Listen for analytics update
      socket.on("analytics-update", updatedUrl => {
         const updUrl = JSON.parse(updatedUrl)
         setUrls(prevUrls =>
            prevUrls?.map(url =>
               url.slug === updUrl.slug ? { ...url, clicks: updUrl.clicks } : url
            )
         )
      })
      
      // Listen for url insertion
      socket.on("urlChange-insert", data => {
         const insrtUrl = JSON.parse(data)
         if(insrtUrl.assoc === user?.email) {
            setUrls(prevUrls => [insrtUrl, ...prevUrls])
            toast.info("An URL was added")
         }
      })

      // Listen for url updations
      socket.on("urlChange-update", data => {
         const updUrl = JSON.parse(data)
         setUrls(prevUrls =>
            prevUrls?.map(url =>
               url._id === updUrl._id ? { ...url, ...updUrl } : url
            )
         )
         NProgress.start()
         setTimeout(() => NProgress.done(), 200)
      })

      // Listen for any url deletions
      socket.on("urlChange-delete", data => {
         const dltUrlId = JSON.parse(data)
         setUrls(prevUrls => prevUrls?.filter(url => url._id !== dltUrlId))
         if(!deleteSlug)
            toast.info(`A slug was removed!`)
      })
      
      return () => {
         socket.off("analytics-update")
         socket.off("urlChange-insert")
         socket.off("urlChange-update")
         socket.off("urlChange-delete")
      }
   }, [socket, deleteSlug, user])

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
            setDeleteSlug(slug)
            const { data } = await axios.delete(`/url/delete/${slug}`)
            console.log(data)
            setError("")
            toast.info(`Slug /${slug} deleted successfully!`)
            setTimeout(() => setDeleteSlug(null), 2000)

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
         <ToastContainer
            position="top-center" autoClose={2000}
            hideProgressBar={true}
         />
         <h2>Welcome, {user?.username}! ✨</h2>
         {loading && <p>Loading your shortened links...</p>}

         {error || loading ?
            <p className="error">{error}</p>
            : <div className="loader-container">
               <h3>Your Shortened Links</h3>
               <div className="tooltip-container">
                  <img src={info} className="info-icon" alt="info" />
                  <span className="tooltip-text">Click on the shortened link or favicon to get analytics</span>
               </div>
              </div>
         }

         {!urls?.length ? (
            !loading && <p>No shortened links yet. Start by creating one!</p>
         ) : (
            <div className="url-container">
            {urls?.map(link =>
               <UrlCard key={link._id} link={link}
                  handleDelete={handleDelete}
                  setModalOpen={setModalOpen}
                  onClick={() => navigate(`/s/${link.slug}`)}
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