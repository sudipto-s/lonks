import { useEffect } from "react"
import visit from "../assets/visit.svg"
import share from "../assets/share.svg"
import copy from "../assets/copy.svg"
import {
   copyLink, getFaviconUrl, shareLink
} from "../utils/dashboardUtils"

export default function NewUrlCard({ slug, destination, setUrlCreated }) {
   useEffect(() => {
      const handleKeyDown = e => {
         if (e.keyCode === 27) setUrlCreated(false);
      }
      document.addEventListener("keydown", handleKeyDown)
      
      return () =>
         document.removeEventListener("keydown", handleKeyDown)
   }, [setUrlCreated])

   return (
      <>
         <div className="new-url-card-backdrop" onClick={() => setUrlCreated(false)}></div>

         <div className="url-card new-url-card">
            <div className="new-url-card-header">
               <img src={getFaviconUrl(destination)} alt="host logo" />
            </div>
            <div className="new-url-card-links">
               <span className="short-url" title="Short link">
                  {window.origin.replace(/https?:\/\//, "")}/{slug}
               </span>
               <p className="dest-url" title="Destination URL">
                  {destination}
               </p>
            </div>
            <div className="new-url-card-bottom">
               <span title="Visit link">
                  <a href={`/${slug}`} target="_blank" rel="noopener noreferrer">
                     <img src={visit} className="link-visit" alt="visit" />
                  </a>
               </span>
               <span onClick={() => shareLink(`${window.origin}/${slug}`)} title="Share link">
                  <img src={share} className="link-share" alt="share" />
               </span>
               <span onClick={() => copyLink(`${window.origin}/${slug}`)} title="Copy link">
                  <img src={copy} className="link-copy" alt="copy" />
               </span>
            </div>
         </div>
      </>
   )
}