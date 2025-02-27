import { useEffect, useState } from "react"

const NetworkStatus = () => {
   const [isOnline, setIsOnline] = useState(true)

   const updateOnlineStatus = () => {
      setIsOnline(navigator.onLine)
   }

   useEffect(() => {
      if(navigator.connection) {
         navigator.connection.addEventListener("change", updateOnlineStatus)
         
         return () => {
            navigator.connection.removeEventListener("change", updateOnlineStatus)
         }
      }
   }, [])

   return <div className={`network-status ${!isOnline ? "show" : ""}`}>
         {!isOnline ? "You are offline!" : ""}
   </div>
}

export default NetworkStatus