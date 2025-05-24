import cron from "node-cron"
import axios from "axios"

const PING_URL = "https://lonks.onrender.com/"

// Schedule a task to send a request every 13 minutes
if(process.env.NODE_ENV === "production") {
   cron.schedule("*/10 * * * *", async () => {
      try {
         const response = await axios.get(PING_URL)
         console.log("Server Pinged:", response.status)
      } catch (error) {
         console.error("Ping failed:", error.message)
      }
   })

   console.log("Worker is running...")
}
