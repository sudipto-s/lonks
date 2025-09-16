import visit from "../assets/visit.svg"
import edit from "../assets/edit.svg"
import share from "../assets/share.svg"
import copy from "../assets/copy.svg"
import deleteimg from "../assets/delete.svg"
import {
   copyLink, getDaysCreatedAge, getExpiresIn, getFaviconUrls, shareLink
} from "../utils/dashboardUtils"
import NumberFlow from "@number-flow/react"
import { useState, useEffect } from "react"

const UrlCard = ({ link, setModalOpen, handleDelete, onClick = f => f }) => {
   const [animatedClicks, setAnimatedClicks] = useState(0)
   const [faviconIdx, setFaviconIdx] = useState(0)
   const favicons = getFaviconUrls(link.originalUrl)

   useEffect(() => {
      const timeout = setTimeout(() => {
         setAnimatedClicks(link.clicks)
      }, 300)

      return () => clearTimeout(timeout)
   }, [link])

   return <div className="url-card">
      <div className="top">
         <div className="host-logo">
            <img
               src={favicons[faviconIdx]}
               onError={() => setFaviconIdx(idx => idx + 1)}
               onClick={onClick}
               alt="host logo"
            />
         </div>
         <div className="url-links">
            <span className="short-url" title="Short link" onClick={onClick}>
               {window.origin.replace(/https?:\/\//, "")}/{link.slug}
            </span>
            <p className="dest-url" title="Destination URL">
               {link.originalUrl}
            </p>
         </div>
      </div>
      <div className="middle">
         <span className="clicks">
         <NumberFlow
            value={animatedClicks}
         />&nbsp;click{link.clicks > 1 ? "s" : ""}</span>
         <span className="created"> | Created {getDaysCreatedAge(link.createdAt)}</span>
         { link?.expires && <span className="expires"> | Expires {getExpiresIn(link.expires)}</span>}
      </div>
      <div className="bottom">
         <span title="Visit link">
            <a href={`/${link.slug}`} target="_blank" rel="noopener noreferrer">
               <img src={visit} className="link-visit" alt="visit" />
            </a>
         </span>
         <span onClick={() => setModalOpen(link)} title="Edit link">
            <img src={edit} className="link-edit" alt="edit" />
         </span>
         <span onClick={() => shareLink(`${window.origin}/${link.slug}`)} title="Share link">
            <img src={share} className="link-share" alt="share" />
         </span>
         <span onClick={() => copyLink(`${window.origin}/${link.slug}`)} title="Copy link">
            <img src={copy} className="link-copy" alt="copy" />
         </span>
         <span onClick={() => handleDelete(link.slug)} title="Delete link">
            <img src={deleteimg} className="link-delete" alt="delete" />
         </span>
      </div>
   </div>
}

export default UrlCard