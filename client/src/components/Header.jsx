import { Link } from 'react-router-dom'
import '../css/HeaderFooter.css'
import axios from "axios"
import logout from "../utils/logout"

const Header = ({ user, setUser }) => {
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
            <Link to="/"><h1>Lonks</h1></Link>
         </div>
         <nav className="nav">
            <ul>
               {!user?.logged && <li><Link to="/">Home</Link></li>}
               {!user?.logged && <li><Link to="/auth/login">Login</Link></li>}
               {!user?.logged && <li><Link to="/auth/signup">Signup</Link></li>}
               {user?.logged && <li><Link to="/app/dashboard">Dashboard</Link></li>}
               {user?.logged && <li><Link to="/app/shorten">Shorten</Link></li>}
               {user?.logged && <li><span className="logout-btn"
                  onClick={handleLogout}>Logout
               </span></li>}
            </ul>
         </nav>
      </header>
   );
};

export default Header