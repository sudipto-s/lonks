import { useEffect, useState } from 'react'
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { getCookie } from '../utils/userCookie'

const Shortener = ({ user, setUser }) => {
   const [slug, setSlug] = useState("")
   const [originalUrl, setOriginalUrl] = useState("")
   const [slugUrl, setSlugUrl] = useState(null)
   const [error, setError] = useState(null)
   const [buttonTxt, setButtonTxt] = useState("Shorten URL")

   const navigate = useNavigate()
   useEffect(() => {
      navigate(!user?.logged && "/app/login")
   }, [user, navigate])
   useEffect(() => {
      const cok = getCookie()
      cok && setUser({ ...cok })
   }, [setUser, navigate])

   const handleSubmit = async e => {
      e.preventDefault()
      if (!originalUrl) {
         alert("Please enter original url")
         return
      }

      try {
         setButtonTxt("Loading..")
         const { data } = await axios.post("/url/create", { slug, originalUrl })
         console.log(data)
         setSlug("")
         setError("")
         setOriginalUrl("")
         setSlugUrl(data.slugUrl)
      } catch (err) {
         setSlugUrl(null)
         console.log(err)
         if (err.status === 409)
            setError(`Slug '${slug}' already exists! Please choose another one or leave empty`)
         else if (err.status === 429)
            setError("Only 5 requests per minute is allowed")
         else
            setError(err.response?.data?.message || "A server error has occured")
      } finally {
         setButtonTxt("Shorten URL")
      }
   }

   return (
      <div className="shortener-form-container">
         <form onSubmit={handleSubmit} className="shortener-form">
            <h2>URL Shortener</h2>
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
               onChange={e => setSlug(e.target.value?.trim().toLocaleLowerCase())} 
            />
            <button type="submit">{buttonTxt}</button>
            {slugUrl && 
               <div className="result">
                  <p>Shortened URL: <a href={slugUrl} target="_blank" rel="noopener noreferrer">{slugUrl}</a></p>
               </div>
            }
         </form>
      </div>
   );
}

export default Shortener;