import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { getCookie } from "../utils/userCookie"

const Home = ({ user, setUser }) => {
   const navigate = useNavigate()
   useEffect(() => {
      navigate(user?.logged && "/app/dashboard")
   }, [user, navigate])
   useEffect(() => {
      const cok = getCookie()
      cok && setUser({ ...cok })
   }, [setUser])

   return (
      <div className="Home">
         <h2>Lonks - A Simple Link Shortener</h2>
      </div>
   );
}
 
export default Home;