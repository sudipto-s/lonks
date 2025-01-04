import { useEffect, useState } from "react"

const NetworkStatus = () => {
   const [isOnline, setIsOnline] = useState(true)

   const updateOnlineStatus = () => {
      setIsOnline(navigator.onLine)
   }

   useEffect(() => {
      navigator.connection.addEventListener("change", updateOnlineStatus)
      
      return () => {
         navigator.connection.removeEventListener("change", updateOnlineStatus)
      }
   }, [])

   // return !isOnline ?
   // (
   //    <div className="network-status">
   //       You are OFFline! Try connection to the internet..
   //    </div>
   // ) : null
   return <div className={`network-status ${!isOnline ? "show" : ""}`}>
         {!isOnline ? "You are offline. Please check your connection!" : ""}
   </div>
}

export default NetworkStatus