import express from "express"
import mongoose from "mongoose"
import "dotenv/config"
import path from "path"

// Routes
import urlRoutes from "./routes/urlRoutes.js"

const app = express()
const __dirname = path.resolve()

//Middlewares
app.use(express.json())
app.use(express.static(path.join(__dirname, "client/dist")))

// Routes
app.use(urlRoutes)

// Catches all routes
app.use("*", (req, res) => {
   res.sendFile(path.join(__dirname, "client/dist/index.html"))
})

// Constants
const PORT = process.env.PORT || 5000

// Connect to database & start the server
mongoose.connect(process.env.DATABASE_URL)
  .then(() => app.listen(PORT, () => console.log("http://localhost:5000")))
  .catch((err) => console.log(err))