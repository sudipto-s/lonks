import { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import '../css/HeaderFooter.css'
import axios from "axios"
import logout from "../utils/logout"
import { AppContext } from "../context/AppContext"
import { ShinyText } from './ReactBits'
import menu from "../assets/menu.svg"
import close from "../assets/close.svg"

const Header = () => {
   const { user, setUser } = useContext(AppContext)
   const [isOpen, setIsOpen] = useState(false)

   useEffect(() => {
      // set false on esc press
      const handleEsc = (e) => {
         if (e.key === "Escape")
            setIsOpen(false)
      }

      document.addEventListener("keydown", handleEsc)
      return () => {
         document.removeEventListener("keydown", handleEsc)
      }
   })

   const handleLogout = async () => {
      try {
         await axios.post("/api/v1/auth/logout")
         logout(setUser)
      } catch (err) {
         console.log(err)
         alert(err.message)
      }
   }

   return (
      <header className="header">
         <div className="logo">
            <Link to="/"><h1>
               <ShinyText text="Lonks" disabled={false} speed={3} className='custom-class' />
            </h1></Link>
         </div>

         {isOpen && <div className="sidenav-overlay show" onClick={() => setIsOpen(false)}></div>}

         <div className="menu-icon" onClick={() => setIsOpen(p => !p)}>
            <img src={isOpen ? close : menu} alt="menu" />
         </div>

         <div className={`sidenav ${isOpen ? "open" : ""}`}>
            <nav>
               <ul>
                  {!user?.logged && <li><Link to="/" onClick={() => setIsOpen(false)}>Home</Link></li>}
                  {!user?.logged && <li><Link to="/auth/login" onClick={() => setIsOpen(false)}>Login</Link></li>}
                  {!user?.logged && <li><Link to="/auth/signup" onClick={() => setIsOpen(false)}>Signup</Link></li>}
                  {user?.logged && <li><Link to={`/u/${user?.username}`} onClick={() => setIsOpen(false)}>Profile</Link></li>}
                  {user?.logged && <li><Link to="/app/dashboard" onClick={() => setIsOpen(false)}>Dashboard</Link></li>}
                  {user?.logged && <li><Link to="/app/shorten" onClick={() => setIsOpen(false)}>Shorten</Link></li>}
                  {user?.logged && (
                     <li>
                        <span className="logout-btn" onClick={() => { handleLogout(); setIsOpen(false) }}>Logout</span>
                     </li>
                  )}
               </ul>
            </nav>
         </div>
      </header>
   )
}

export default Header