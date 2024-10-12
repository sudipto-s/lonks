import { removeCookie } from "./userCookie"

export default setUser => {
   removeCookie("lonks-user")
   setUser(null)
}