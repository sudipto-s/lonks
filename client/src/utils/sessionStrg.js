export const getSessionStrg = () => {
   const lt = sessionStorage.getItem("lonks-user")
   return lt
}

export const setSessionStrg = value =>
   sessionStorage.setItem("lonks-user", JSON.stringify(value))

export const removeSessionStrg = () =>
   sessionStorage.removeItem("lonks-user")