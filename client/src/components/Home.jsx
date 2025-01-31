import { useContext, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { getCookie } from "../utils/userCookie"
import { AppContext } from "../context/AppContext"
import { SplitText, BlurText } from "./ReactBits"

const Home = () => {
   const { user, setUser } = useContext(AppContext)

   const navigate = useNavigate()
   useEffect(() => {
      navigate(user?.logged && "/app/dashboard", { replace: true })
   }, [user, navigate])
   useEffect(() => {
      const cok = getCookie()
      cok && setUser({ ...cok })
   }, [setUser])

   return (
      <div className="Home">
         <h2>
            <SplitText
               text="Lonks"
               className="text-2xl font-semibold text-center"
               delay={150}
               animationFrom={{ opacity: 0, transform: 'translate3d(0,50px,0)' }}
               animationTo={{ opacity: 1, transform: 'translate3d(0,0,0)' }}
               easing="easeOutCubic"
               threshold={0.2}
               rootMargin="-50px"
            />
         </h2>
         <h2>
            <BlurText
               text="Link Shortener"
               delay={150}
               animateBy="words"
               direction="top"
               className="text-2xl mb-8"
            />
         </h2>
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