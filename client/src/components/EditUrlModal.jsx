import { useState } from 'react'
import axios from 'axios'

const EditUrlModal = ({ link, closeModal, fetchUrls }) => {
   const [originalUrl, setOriginalUrl] = useState(link.originalUrl)
   const [newSlug, setNewSlug] = useState(link.slug)

   const handleUpdate = async (e) => {
      e.preventDefault()
      try {
         await axios.patch('/url/update', {
            originalUrl,
            slug: link.slug,
            newSlug,
         })
         fetchUrls()
         closeModal()
      } catch (err) {
         console.error(err)
      }
   }

   return (
      <div className="modal-overlay">
         <div className="modal-content">
            <h2>Edit URL</h2>
            <form onSubmit={handleUpdate}>
               <label>
                  Original URL:
                  <input
                     type="text"
                     value={originalUrl}
                     onChange={(e) => setOriginalUrl(e.target.value)}
                  />
               </label>
               <label>
                  New Slug:
                  <input
                     type="text"
                     value={newSlug}
                     onChange={(e) => setNewSlug(e.target.value)}
                  />
               </label>
               <div className="modal-actions">
                  <button type="submit">Save Changes</button>
                  <button type="button" onClick={closeModal}>Cancel</button>
               </div>
            </form>
         </div>
      </div>
   )
}

export default EditUrlModal