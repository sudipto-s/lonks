import { useState, useEffect } from "react"
import axios from "axios"

const useFetchUrls = (path, body) => {
   const [data, setData] = useState(null)
   const [errors, setError] = useState("")

   useEffect(() => {
      const fetchUrls = async () => {
         const controller = new AbortController()
         const signal = controller.signal

         try {
            const { data } = await axios.post(
               path, body, { signal }
            )
            setData(data)
            setError("")
         } catch (err) {
            if (axios.isCancel(err))
               console.log("Fetch aborted")
            else {
               console.error(err)
               setData(null)
               setError(err.response?.data?.message || "Failed to fetch URLs")
            }
         }

         // Cancel the request if the component unmounts or user changes
         return () => controller.abort()
      }
      fetchUrls()
   }, [path, body])

   return { data, errors }
}

export default useFetchUrls