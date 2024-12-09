import { Routes, Route } from "react-router-dom"
import Home from "./Home";
import Login from "./Login";
import Signup from "./Signup";
import Shortener from "./Shortener";
import NotFound from "./NotFound";
import Dashboard from "./Dashboard";
import ForgotPassword from "./ForgotPassword";
import ResetPassword from "./ResetPassword";

const Main = ({ user, setUser }) => {
   return (
      <Routes>
         <Route path="/" element={ <Home user={user} setUser={setUser} /> } />
         <Route path="/app/login" element={ <Login user={user} setUser={setUser} />} />
         <Route path="/app/signup" element={ <Signup user={user} setUser={setUser} /> } />
         <Route path="/app/dashboard" element={ <Dashboard user={user} setUser={setUser} /> } />
         <Route path="/app/shorten" element={ <Shortener user={user} setUser={setUser} /> } />
         <Route path="/app/forgot-password" element={ <ForgotPassword user={user} setUser={setUser} /> } />
         <Route path="/app/reset-password" element={ <ResetPassword /> } />
         <Route path="*" element={ <NotFound /> } />
      </Routes>
   );
}
 
export default Main;