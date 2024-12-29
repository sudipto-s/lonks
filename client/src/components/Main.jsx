import { Routes, Route } from "react-router-dom"
import Home from "./Home";
import Login from "./Login";
import Signup from "./Signup";
import Shortener from "./Shortener";
import NotFound from "./NotFound";
import Dashboard from "./Dashboard";
import ForgotPassword from "./ForgotPassword";
import ResetPassword from "./ResetPassword";

const Main = () => {
   return (
      <Routes>
         <Route path="/" element={ <Home /> } />
         <Route path="/auth/login" element={ <Login />} />
         <Route path="/auth/signup" element={ <Signup /> } />
         <Route path="/app/dashboard" element={ <Dashboard /> } />
         <Route path="/app/shorten" element={ <Shortener /> } />
         <Route path="/auth/forgot-password" element={ <ForgotPassword /> } />
         <Route path="/auth/reset-password" element={ <ResetPassword /> } />
         <Route path="*" element={ <NotFound /> } />
      </Routes>
   );
}
 
export default Main;