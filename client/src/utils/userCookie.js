import Cookies from "js-cookie"

export const getCookie = () => {
   const cookies = Cookies.get("lonks-user", {secure:true})
   return cookies && JSON.parse(cookies)
}

export const setCookie = (value) =>
   Cookies.set("lonks-user", JSON.stringify(value), {expires:15, secure:true})

export const removeCookie = id =>
   Cookies.remove(id, {secure:true})