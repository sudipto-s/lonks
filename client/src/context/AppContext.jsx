import { createContext, useState } from 'react'
import { io } from "socket.io-client"

export const AppContext = createContext()

export const AppProvider = ({ children }) => {
   const [user, setUser] = useState(null)

   // Create a new socket connection
   const socket = io(import.meta.env.DEV ?
      "http://localhost:5000" : window.location.origin
   )

   return (
      <AppContext.Provider value={{ user, setUser, socket }}>
         {children}
      </AppContext.Provider>
   )
}