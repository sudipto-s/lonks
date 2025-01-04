import { useEffect, useState } from "react"

const NetworkStatus = () => {
   const [isOnline, setIsOnline] = useState(true)

   const updateOnlineStatus = () => {
      setIsOnline(navigator.onLine)
   }

   useEffect(() => {
      window.addEventListener("online", updateOnlineStatus);
      window.addEventListener("offline", updateOnlineStatus)
      
      return () => {
         window.removeEventListener("online", updateOnlineStatus);
         window.removeEventListener("offline", updateOnlineStatus)
      }
   }, [])

   return <div className={`network-status ${!isOnline ? "show" : ""}`}>
         {!isOnline ? "You are offline!" : ""}
   </div>
}

export default NetworkStatus