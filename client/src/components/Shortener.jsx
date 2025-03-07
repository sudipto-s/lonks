import { useCallback, useContext, useEffect, useState } from 'react'
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { getCookie } from '../utils/userCookie'
import NewUrlCard from './NewUrlCard'
import { AppContext } from "../context/AppContext"

const Shortener = () => {
   const { user, setUser } = useContext(AppContext)

   document.title = "Shorten - Lonks"
   const [slug, setSlug] = useState("")
   const [originalUrl, setOriginalUrl] = useState("")
   const [destination, setDestination] = useState("")
   const [slugUrl, setSlugUrl] = useState(null)
   const [expires, setExpires] = useState("never")
   const [error, setError] = useState(null)
   const [buttonTxt, setButtonTxt] = useState("Shorten URL")
   const [urlCreated, setUrlCreated] = useState(false)
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

   const handleSubmit = useCallback(async e => {
      e.preventDefault()
      if (!originalUrl) {
         setError("Please enter original url")
         return
      }
      if (slug && slug.length < 3) {
         setError("Slug should be minimum 3 characters long")
         return
      }
      if (["app", "auth"].includes(slug)) {
         setError("This slug is restricted")
         return
      }
      if (!/^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(:\d+)?(\/[^\s]*)?$/.test(originalUrl)) {
         setError("Invalid url format")
         return
      }
      if (slug && !/^(?![-_])[a-zA-Z0-9-_]{1,50}(?<![-_])$/.test(slug)) {
         setError("Invalid slug format")
         return
      }

      try {
         setError(null)
         setButtonTxt("Loading..")
         const { data } = await axios.post("/url/create", { slug, originalUrl, expires })
         setSlug("")
         setError("")
         setDestination(originalUrl)
         setOriginalUrl("")
         setExpires("never")
         setUrlCreated(true)
         setSlugUrl(data.slugUrl)
      } catch (err) {
         setSlugUrl(null)
         console.log(err)
         if (err.status === 409)
            setError(`Slug is not available!`)
         else if (err.status === 429)
            setError("Only 5 requests per minute is allowed")
         else
            setError(err.response?.data?.message || "A server error has occured")
      } finally {
         setButtonTxt("Shorten URL")
      }
   }, [slug, originalUrl, expires])

   return (
      <div className="shortener-form-container">
         <form onSubmit={handleSubmit} className="shortener-form">
            {error && <p className="error">{error}</p>}
            <label htmlFor="originalUrl">Original URL:</label>
            <input 
               type="url" value={originalUrl}
               placeholder="Enter the original URL" 
               onChange={e => setOriginalUrl(e.target.value?.trim())} 
               required 
            />
            <label htmlFor="slug">Slug (optional):</label>
            <input 
               type="text" value={slug}
               placeholder="Enter a custom slug" 
               onChange={e => setSlug(e.target.value?.trim())} 
            />
            <label htmlFor="expiresin">Expires in:</label>
            <select
               value={expires}
               onChange={e => setExpires(e.target.value)}
            >
               <option value="never">Never</option>
               <option value="1">1 day</option>
               <option value="2">2 days</option>
               <option value="7">7 days</option>
            </select>
            <button type="submit" disabled={buttonTxt === "Loading.."}>{buttonTxt}</button>
            {urlCreated &&
               <NewUrlCard slug={slugUrl}
                  destination={destination}
                  setUrlCreated={setUrlCreated}
                  expires={expires}
               />
            }
         </form>
      </div>
   );
}

export default Shortener;