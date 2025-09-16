import { useCallback, useContext, useEffect, useMemo, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { getCookie } from "../../utils/userCookie"
import axios from "axios"
import { AppContext } from "../../context/AppContext"
import AnalyticsRechart from "./Recharts"
import CountryBarChart from "./CountryBarChart"
import "../../css/Chart.css"
import { getDate, isAnalyticsAvailable } from "../../utils/analytics"
import NumberFlow from "@number-flow/react"
import { getFaviconUrls } from "../../utils/dashboardUtils"
import { toast } from "sonner"

const Analytics = () => {
   const { user, setUser, socket } = useContext(AppContext)

   document.title = "Analytics - Lonks"
   const [url, setUrl] = useState(null)
   const [error, setError] = useState(null)
   const [authChecked, setAuthChecked] = useState(false)
   const [animatedClicks, setAnimatedClicks] = useState(0)
   const [faviconIdx, setFaviconIdx] = useState(0)
   const favicons = useMemo(() => {
      if(!url?.originalUrl) return []
      return getFaviconUrls(url.originalUrl)
   }, [url])

   const { slug } = useParams()
   
   useEffect(() => {
      // Receive updated data via socket
      socket.on("analytics-update", (updatedUrl) => {
         const updUrl = JSON.parse(updatedUrl)
         if(slug === updUrl.slug)
            setUrl(prevVal => ({ ...prevVal, ...updUrl }))
      })
      
      return () => {
         socket.off("analytics-update")
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
            setError(null)
            toast.loading("Fetching analytics...", { id: "fetch-toast" })
            const { data } = await axios.post("/url/getone", { assoc: user?.email, slug })
            setUrl(data)
         } catch (err) {
            setUrl(null)
            console.log(err)
            if(err.status === 404) {
               toast.error("Slug not found")
               setError("Slug not found")
            } else {
               toast.error(err?.response?.data?.message || "Something went wrong")
               setError(err?.response?.data?.message || "Something went wrong")
            }
         } finally {
            toast.dismiss("fetch-toast")
         }
      }
      user?.email && fetchUrls()
   }, [user, slug])

   const analyticsAvDiff = useMemo(() => getDate(url), [url])

   return (
      <div className="analytics-container">
         {error && <p className="error">{error}</p>}

         {url &&
            <>
               <div className="analytics-details">
                  <div className="analytics-favicon-slug">
                     <img
                        src={favicons[faviconIdx]}
                        alt="favicon"
                        onError={() => setFaviconIdx(idx => idx + 1)}
                     />
                     <h2 style={{ margin: 0 }}>/{url.slug}</h2>
                  </div>
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
                  <CountryBarChart url={url} />
               </> :
               <h2 style={{textAlign:"center"}}>Full analytics not available</h2> }
            </>
         }
      </div>
   )
}

export default Analytics
