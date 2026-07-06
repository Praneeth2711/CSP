import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import { Router } from "express";

export function setupSecurityMiddlewares(router: Router) {
  // 1. Helmet protection
  router.use(helmet());

  // 2. CORS configuration (allow requests from development server origins)
  router.use(cors({
    origin: "*", 
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  }));

  // 3. Rate limiting (Max 200 requests per 15 minutes per IP)
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 200,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: "Too many requests from this IP, please try again after 15 minutes." }
  });

  router.use(limiter);
}
