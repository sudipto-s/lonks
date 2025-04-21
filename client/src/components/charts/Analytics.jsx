import { useCallback, useContext, useEffect, useMemo, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { getCookie } from "../../utils/userCookie"
import axios from "axios"
import { AppContext } from "../../context/AppContext"
import AnalyticsRechart from "./Recharts"
import "../../css/Chart.css"
import { getDate, isAnalyticsAvailable } from "../../utils/analytics"
import NumberFlow from "@number-flow/react"
import NProgress from "nprogress"
import "nprogress/nprogress.css"

const Analytics = () => {
   const { user, setUser, socket } = useContext(AppContext)

   document.title = "Analytics - Lonks"
   const [url, setUrl] = useState(null)
   const [error, setError] = useState("")
   const [loading, setLoading] = useState(false)
   const [authChecked, setAuthChecked] = useState(false)
   const [animatedClicks, setAnimatedClicks] = useState(0)

   const { slug } = useParams()
   
   useEffect(() => {
      // Receive updated data via socket
      socket.on("analytics-update", (updatedUrl) => {
         const updUrl = JSON.parse(updatedUrl)
         if(slug === updUrl.slug)
            setUrl(prevVal => ({ ...prevVal, ...updUrl }))
      })

      // Listen for url updations
      socket.on("urlChange-update", () => {
         NProgress.start()
         setTimeout(() => NProgress.done(), 200)
      })
      
      return () => {
         socket.off("analytics-update")
         socket.off("urlChange-update")
      }
   }, [socket, slug])
   
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
      const timeout = setTimeout(() => {
         setAnimatedClicks(url?.clicks || 0)
      }, 300)

      return () => clearTimeout(timeout)
   }, [url])

   useEffect(() => {
      const fetchUrls = async () => {
         try {
            setLoading(true)
            const { data } = await axios.post("/url/getone", { assoc: user?.email, slug })
            setUrl(data)
            setError(null)
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

   return (
      <div className="analytics-container">
         {loading && <h2 style={{ textAlign: "center" }}>Loading...</h2>}

         {error && <p className="error">{error}</p>}
         {url &&
            <>
               <div className="analytics-details">
                  <h2 style={{ textAlign: "center" }}>Analytics for <code>/{url.slug}</code></h2>
                  <p className="dest-url" title="Destination URL">
                     {url.originalUrl}
                  </p>
                  <p>Total Clicks: <NumberFlow value={animatedClicks} /></p>
                  <p>Created: <span>{new Date(url.createdAt).toLocaleDateString('en-IN')}</span></p>
                  <p>Last updated: <span>{new Date(url.updatedAt).toLocaleString('en-IN')}</span></p>
                  {analyticsAvDiff && <p>Analytics available: <span>{analyticsAvDiff}</span></p>}
                  {url?.expires && <p>Expires: {new Date(url.expires).toLocaleString('en-IN')}</p>}
               </div>

               {isAnalyticsAvailable(url) ? <>
                  <AnalyticsRechart url={url} />
               </> :
               <h2 style={{textAlign:"center"}}>Full analytics not available</h2> }
            </>
         }
      </div>
   )
}

export default Analytics