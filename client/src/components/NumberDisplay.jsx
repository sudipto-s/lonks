import { useState } from 'react'
import axios from "axios"

const NumberDisplay = () => {
   const [slug, setSlug] = useState("")
   const [originalUrl, setOriginalUrl] = useState("")
   const [slugUrl, setSlugUrl] = useState(null)

   const handleSubmit = async e => {
      e.preventDefault()

      try {
         const { data } = await axios.post("/url/create", { slug, originalUrl })
         console.log(data)
         setSlugUrl(data.slugUrl)
      } catch (err) {
         setSlugUrl(null)
         console.log(err)
         alert(err.response.data)
      }
   }

   return (
      <div className="">
         <form onSubmit={handleSubmit}>
            <label htmlFor="slug">Slug: </label>
            <input type="text" value={slug} onChange={e => setSlug(e.target.value)} /><br />
            <label htmlFor="slug">Original URL: </label>
            <input type="url" value={originalUrl} onChange={e => setOriginalUrl(e.target.value)} />
            <button type="submit">Submit</button>
            <br /><br />
            {slugUrl && 
               <div>
                  <p>Shortened URL: <a href={slugUrl} target="_blank" rel="noopener noreferrer">{slugUrl}</a></p>
               </div>
            }
         </form>
      </div>
   );
};

export default NumberDisplay;
