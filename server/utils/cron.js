import cron from "node-cron"
import axios from "axios"

const PING_URL = "https://lonks.onrender.com/"

// Schedule a task to send a request every 10 minutes
if (process.env.EN_CRON == "true") {
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
