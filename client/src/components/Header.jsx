import { Link } from 'react-router-dom'
import '../css/HeaderFooter.css'
import logout from "../utils/logout.js"

const Header = ({ user, setUser }) => {
   return (
      <header className="header">
         <div className="logo">
            <Link to="/"><h1>Lonks</h1></Link>
         </div>
         <nav className="nav">
            <ul>
               {!user?.logged && <li><Link to="/">Home</Link></li>}
               {!user?.logged && <li><Link to="/app/login">Login</Link></li>}
               {!user?.logged && <li><Link to="/app/signup">Signup</Link></li>}
               {user?.logged && <li><Link to="/app/dashboard">Dashboard</Link></li>}
               {user?.logged && <li><Link to="/app/shorten">Shorten</Link></li>}
               {user?.logged && <li><span className="logout-btn"
                  onClick={() => logout(setUser)}>Logout
               </span></li>}
            </ul>
         </nav>
      </header>
   );
};

export default Header