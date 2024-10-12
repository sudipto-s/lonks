import axios from "axios"
import $ from "jquery"
import { removeCookie } from "./userCookie"

const deleteAccount = async (_id, setUser) => {
   const consent = prompt("Sure delete your account? Type 'delete my account'.")?.trim().toLocaleLowerCase()
   if (consent === "delete my account") {
      $(".account-delete-btn").text("Deleting account...")
      try {
         const { data } = await axios.delete(`/api/v1/proposal/${_id}`)
         console.log(data)
         removeCookie("lonks-user")
         setUser(null)

         alert("Account deleted successfully!")
      } catch (err) {
         console.log(err)
         $(".account-delete-btn").text("DELETE MY ACCOUNT")
         alert("Account deletion unsuccess!")
      }
   } else
      alert("Account deletion unsuccess!")
}

export default deleteAccount