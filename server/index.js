import express from "express"
import "dotenv/config"
import path from "path"
import cookieParser from "cookie-parser"
import http from "http"
import { Server } from "socket.io"
import dbConnect from "./utils/dbConnect.js"

// Routes
import urlRoutes from "./routes/urlRoutes.js"
import userRoutes from "./routes/userRoutes.js"
import authRoutes from "./routes/authRoutes.js"

const app = express()
const server = http.createServer(app)
const io = new Server(server, {
   cors: {
      methods: ['GET', 'POST', 'PATCH', "DELETE"],
   }
})
const __dirname = path.resolve()

//Middlewares
app.use(cookieParser())
app.use(express.json())
app.use(express.static(path.join(__dirname, "client/dist")))

// Routes
app.use(urlRoutes)
app.use("/api/v1/user", userRoutes)
app.use("/api/v1/auth", authRoutes)

// Catches all routes
app.use("*", (req, res) => {
   res.sendFile(path.join(__dirname, "client/dist/index.html"))
})

// Emit updated data to client
export const emitClickCountUpdate = (updatedUrl) =>
   io.emit("analytics-update", updatedUrl)

// Constants
const PORT = process.env.PORT || 5000

// Connect to database & start the server
dbConnect(process.env.DATABASE_URL)
  .then(() => server.listen(PORT, () => console.log(`http://localhost:${PORT}`)))
  .catch((err) => console.log(err))
