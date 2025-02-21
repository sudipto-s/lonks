import { useCallback, useContext, useEffect, useMemo, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { getCookie } from "../../utils/userCookie"
import axios from "axios"
import { AppContext } from "../../context/AppContext"
import AnalyticsRechart from "./Recharts"
import WorldMapAnalytics from "./WorldMap"
import "../../css/Chart.css"
import { getDate, isAnalyticsAvailable } from "../../utils/analytics"
import { CountUp } from "../ReactBits"

const Analytics = () => {
   const { user, setUser, socket } = useContext(AppContext)

   document.title = "Analytics - Lonks"
   const [url, setUrl] = useState(null)
   const [error, setError] = useState("")
   const [loading, setLoading] = useState(false)
   const [copySlug, setCopySlug] = useState(null) 
   const [deleteSlug, setDeleteSlug] = useState(null)
   const [isModalOpen, setModalOpen] = useState(null)

   const { slug } = useParams()

   useEffect(() => {
      // Receive updated data via socket
      socket.on("click-update", ({ slug: updatedSlug, clicks }) => {
         if(slug === updatedSlug)
            setUrl(prevVal => ({ ...prevVal, clicks }))
      })
      
      return () => socket.off("click-update")
   }, [socket, slug])

   const navigate = useNavigate()
   useEffect(() => {
      const cok = getCookie()
      cok && setUser({ ...cok })
   }, [setUser])
   useEffect(() => {
      if(!user?.logged)
         navigate("/auth/login", { replace: true })
   }, [user, navigate])

   useEffect(() => {
      const fetchUrls = async () => {
         try {
            setLoading(true)
            const { data } = await axios.post("/url/getone", { assoc: user?.email, slug })
            setUrl(data)
            setError(null)
            if(!isAnalyticsAvailable(data)) {
               setUrl(null)
               setError(`No analytics available for /${slug}`)
            }
         } catch (err) {
            setUrl(null)
            console.log(err)
            if(err.status === 404)
               setError("Slug not found")
            else
               setError(err.response?.data?.message)
         } finally {
            setLoading(false)
         }
      }
      user?.email && fetchUrls()
   }, [user, slug])

   const analyticsAvDiff = useMemo(() => getDate(url), [url])

   const handleDelete = useCallback(async slug => {
      if (confirm(`Do you want to delete /${slug}`)) {
         try {
            const { data } = await axios.delete(`/url/delete/${slug}`)
            console.log(data)
            setDeleteSlug(slug)
            setError("")
            setTimeout(() => setDeleteSlug(null), 2500)

            // Update the URLs state to remove the deleted URL
            navigate("/app/dashboard")
         } catch (err) {
            console.log(err)
            setDeleteSlug(null)
            setError(err.response?.data?.message)
            alert(err.response?.data?.message)
         }
      }
   }, [navigate])

   return (
      <div className="analytics-container">
         {loading && <h2 style={{ textAlign: "center" }}>Loading...</h2>}

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

         {error && <p className="error">{error}</p>}
         {url &&
            <>
               <div className="analytics-details">
                  <h1 style={{ textAlign: "center" }}>Analytics for /{url.slug}</h1>
                  {<h3>Link created at <span>{new Date(url.createdAt).toLocaleDateString('en-IN')}</span></h3>}
                  {analyticsAvDiff && <h3>Analytics available from <span>{analyticsAvDiff}</span></h3>}
                  <h3>Total Clicks:&nbsp;
                  <CountUp
                     from={0}
                     to={url.clicks}
                     separator=","
                     direction="up"
                     duration={1}
                     className="count-up-text"
                  /></h3>
                  {url?.expires && <h3>Link expires at {new Date(url.expires).toLocaleDateString()}</h3>}
               </div>

               <AnalyticsRechart url={url} />
               <WorldMapAnalytics countryStats={url.countryStats} />
            </>
         }
      </div>
   )
}

export default Analytics