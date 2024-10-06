import { useState } from 'react'
import axios from "axios"

const Shortener = () => {
   const [slug, setSlug] = useState("")
   const [originalUrl, setOriginalUrl] = useState("")
   const [slugUrl, setSlugUrl] = useState(null)

   const handleSubmit = async e => {
      e.preventDefault()
      if (!originalUrl) {
         alert("Please fill in both fields")
         return
      }

      try {
         const { data } = await axios.post("/url/create", { slug, originalUrl })
         console.log(data)
         setSlugUrl(data.slugUrl)
         setSlug("")
         setOriginalUrl("")
      } catch (err) {
         setSlugUrl(null)
         console.log(err)
         if (err.status === 400)
            alert(`Slug '${slug}' already exists! Please choose another one or leave empty`)
         else if (err.status === 429)
            alert("Only 5 requests per minute is allowed")
         else
            alert(err.message)
      }
   }

   return (
      <div className="shortener-form-container">
         <form onSubmit={handleSubmit} className="shortener-form">
            <h2>URL Shortener</h2>
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
            <button type="submit">Shorten URL</button>
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