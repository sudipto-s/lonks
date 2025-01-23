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
         <h2>Lonks</h2>
         <h2>Link Shortener</h2>
         <div className="swiper-group">
            <div className="swiper">
               <div className="swiper-inner">
                  <div className="first">
                     <span>Shorten</span>
                  </div>
                  <div className="second">
                     <span>Edit</span>
                  </div>
                  <div className="third">
                     <span>Delete</span>
                  </div>
                  <div className="fourth">
                     <span>Share</span>
                  </div>
               </div>
            </div>
            <h2>links</h2>
         </div>
      </div>
   );
}
 
export default Home;