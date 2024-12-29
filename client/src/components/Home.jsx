import { useContext, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { getCookie } from "../utils/userCookie"
import { AppContext } from "../context/AppContext"

const Home = () => {
   const { user, setUser } = useContext(AppContext)

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
         <h2>Lonks <br /> A Simple Link Shortener</h2>
      </div>
   );
}
 
export default Home;