import Cookies from "js-cookie"
import axios from "axios"

export const getCookie = id => {
   /*if (id) {
      axios.get(`/api/v1/user/get/${id}`)
      .then(response => {
         console.log(response)
      })
      .catch(err => console.log(err))
   }*/
   const cookies = Cookies.get("lonks-user", {secure:true})
   return cookies && JSON.parse(cookies)
}

export const setCookie = (value) =>
   Cookies.set("lonks-user", JSON.stringify(value), {expires:4, secure:true})

export const removeCookie = id =>
   Cookies.remove(id, {secure:true})