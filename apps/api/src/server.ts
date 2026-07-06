import express, { Request, Response, NextFunction } from "express";
import { CONFIG } from "./config/index.js";
import { setupSecurityMiddlewares } from "./middlewares/security.js";
import apiRouter from "./routes/index.js";

const app = express();

// 1. Setup global JSON parsing with moderate payload size limits
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true, limit: "2mb" }));

// 2. Load Helmet, CORS, and Rate Limiters
setupSecurityMiddlewares(app);

// 3. Health check route
app.get("/health", (req: Request, res: Response) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    mode: CONFIG.IS_MOCK_DB ? "offline-mock" : "supabase-live",
    environment: CONFIG.NODE_ENV
  });
});

// 4. Register all feature modules on the /api prefix
app.use("/api", apiRouter);

// 5. Global Error Handling Middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error("Unhandled Server Error:", err.stack || err.message || err);
  res.status(500).json({
    error: "Internal Server Error",
    details: CONFIG.NODE_ENV === "development" ? err.message : undefined
  });
});

// 6. Bind listener port
app.listen(CONFIG.PORT, () => {
  console.log(`==========================================`);
  console.log(`EMPOWERRURAL Backend API Server Running`);
  console.log(`URL: http://localhost:${CONFIG.PORT}`);
  console.log(`Environment: ${CONFIG.NODE_ENV}`);
  console.log(`Database Mode: ${CONFIG.IS_MOCK_DB ? "OFFLINE/MOCK DB FALLBACK" : "SUPABASE LIVE"}`);
  console.log(`==========================================`);
});
