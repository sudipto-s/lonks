import { useEffect, useState } from 'react'
import axios from 'axios'

const EditUrlModal = ({ link, setUrls, setModalOpen }) => {
   const [newOriginalUrl, setNewOriginalUrl] = useState(link.originalUrl)
   const [newSlug, setNewSlug] = useState(link.slug)
   const [error, setError] = useState(null)
   const [btnText, setBtnText] = useState("Save Changes")

   const handleUpdate = async e => {
      e.preventDefault()

      if (newSlug === "app") {
         setError("Slug 'app' is restricted")
         return
      }
      if (!/^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(:\d+)?(\/[^\s]*)?$/.test(newOriginalUrl)) {
         setError("Invalid url format")
         return
      }
      if (newSlug.includes("/") || newSlug.includes("\\")) {
         setError("Invalid slug format")
         return
      }

      try {
         setError(null)
         setBtnText("Updating..")

         const { data } = await axios.patch('/url/update', {
            originalUrl: newOriginalUrl,
            slug: link.slug,
            newSlug,
         })
         setUrls(prevUrls =>
            prevUrls?.map(item =>
               item.slug === link.slug ? {
                  ...item, slug: data.slug, originalUrl: newOriginalUrl
               } : item
            )
         )
         setModalOpen(null)
         setError(null)
      } catch (err) {
         setBtnText("Save Changes")
         console.error(err)
         if (err.status === 409)
            setError(`Slug '${newSlug}' already exists! Please choose another one or leave empty`)
         else if (err.status === 429)
            setError("Only 5 requests per minute is allowed")
         else
            setError(err.response?.data?.message || "A server error has occured")
      }
   }

   useEffect(() => {
      const handleKeyDown = e => {
         if (e.keyCode === 27) setModalOpen(null);
      }
      document.addEventListener("keydown", handleKeyDown)
      
      return () =>
         document.removeEventListener("keydown", handleKeyDown)
   }, [setModalOpen])

   return (
      <div className="modal-overlay">
         <div className="modal-content">
            <h2>Edit URL</h2>
            {error && <p className="error">{error}</p>}
            <form onSubmit={handleUpdate}>
               <label>
                  Original URL:
                  <input
                     type="url"
                     value={newOriginalUrl} required
                     onChange={e => setNewOriginalUrl(e.target.value?.trim().toLocaleLowerCase())}
                  />
               </label>
               <label>
                  Slug (optional):
                  <input
                     type="text"
                     value={newSlug}
                     onChange={e => setNewSlug(e.target.value?.trim().toLocaleLowerCase())}
                  />
               </label>
               <div className="modal-actions">
                  <button type="submit">{btnText}</button>
                  <button type="button"
                     onClick={() => setModalOpen(null)}
                  >Cancel</button>
               </div>
            </form>
         </div>
      </div>
   )
}

export default EditUrlModal