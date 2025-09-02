import { useCallback, useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from "sonner"

const EditUrlModal = ({ link, setUrls, setModalOpen }) => {
   const [newOriginalUrl, setNewOriginalUrl] = useState(link.originalUrl)
   const [newSlug, setNewSlug] = useState(link.slug)
   const [btnText, setBtnText] = useState("Save Changes")

   const handleUpdate = useCallback(async e => {
      e.preventDefault()

      if (newSlug && newSlug.length < 3) {
         toast.error("Slug should be minimum 3 characters long")
         return
      }
      if (["app", "auth"].includes(newSlug)) {
         toast.error("This slug is restricted")
         return
      }
      if (!/^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(:\d+)?(\/[^\s]*)?$/.test(newOriginalUrl)) {
         toast.error("Invalid url format")
         return
      }
      if (newSlug && !/^(?![-_])[a-zA-Z0-9-_]{1,50}(?<![-_])$/.test(newSlug)) {
         toast.error("Invalid slug format")
         return
      }

      try {
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
         toast.success("URL updated successfully")
      } catch (err) {
         setBtnText("Save Changes")
         console.error(err)
         if (err.status === 409)
            toast.error(`Slug '${newSlug}' already exists! Please choose another one or leave empty`)
         else if (err.status === 429)
            toast.error("Only 5 requests per minute is allowed")
         else
            toast.error(err.response?.data?.message || "A server error has occured")
      }
   }, [link, newSlug, newOriginalUrl, setModalOpen, setUrls])

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
            <form onSubmit={handleUpdate}>
               <label>
                  Original URL:
                  <input
                     type="url"
                     value={newOriginalUrl} required
                     onChange={e => setNewOriginalUrl(e.target.value?.trim())}
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