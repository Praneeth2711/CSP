import { Request, Response, NextFunction } from "express";
import { supabase } from "../database/index.js";
import { CONFIG } from "../config/index.js";

// Extend Express Request types to hold user information
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: "youth" | "admin" | "panchayat";
      };
    }
  }
}

export async function authenticateToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  // If running in Mock DB Mode, automatically authenticate as the mock user if no token is provided
  if (CONFIG.IS_MOCK_DB) {
    req.user = {
      id: "mock-user-123",
      email: "demo.user@empowerrural.org",
      role: "youth"
    };
    return next();
  }

  if (!token) {
    return res.status(401).json({ error: "Access token required" });
  }

  try {
    if (!supabase) {
      throw new Error("Supabase client not initialized");
    }

    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(403).json({ error: "Invalid or expired token" });
    }

    // Retrieve user profile to find their role
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    req.user = {
      id: user.id,
      email: user.email || "",
      role: (profile?.role as any) || "youth"
    };

    next();
  } catch (err: any) {
    console.error("Auth middleware error:", err.message);
    res.status(500).json({ error: "Authentication system failure" });
  }
}

export function authorizeRole(roles: ("youth" | "admin" | "panchayat")[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized access" });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: "Access denied: insufficient permissions" });
    }

    next();
  };
}
