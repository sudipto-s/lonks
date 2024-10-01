import rateLimit from "express-rate-limit"

// Rate Limiting Middleware (e.g., max 5 requests per 1 minute per IP)
export default rateLimit({
   windowMs: 60 * 1000, // 1 minute
   max: 5, // Limit each IP to 5 requests per windowMs
   message: {
      error: "Too many requests, please try again after a minute."
   }
})