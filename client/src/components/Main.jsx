import { Routes, Route } from "react-router-dom"
import Home from "./Home";
import Login from "./Login";
import Signup from "./Signup";
import Shortener from "./Shortener";
import NotFound from "./NotFound";
import Dashboard from "./Dashboard";
import ForgotPassword from "./ForgotPassword";
import ResetPassword from "./ResetPassword";
import Analytics from "./charts/Analytics";
import Profile from "./Profile"

const Main = () => {
   return (
      <Routes>
         <Route path="/" element={ <Home /> } />
         <Route path="/app/dashboard" element={ <Dashboard /> } />
         <Route path="/app/shorten" element={ <Shortener /> } />
         <Route path="/u/profile" element={ <Profile />} />
         <Route path="/auth/login" element={ <Login />} />
         <Route path="/auth/signup" element={ <Signup /> } />
         <Route path="/auth/forgot-password" element={ <ForgotPassword /> } />
         <Route path="/auth/reset-password/:token" element={ <ResetPassword /> } />
         <Route path="/s/:slug" element={ <Analytics /> } />
         <Route path="*" element={ <NotFound /> } />
      </Routes>
   );
}
 
export default Main;