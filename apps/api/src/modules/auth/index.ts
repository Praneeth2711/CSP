import { Router, Request, Response } from "express";
import { authenticateToken } from "../../middlewares/auth.js";
import { CONFIG } from "../../config/index.js";
import { mockDb, supabase } from "../../database/index.js";

const router = Router();

// GET /auth/me - Retrieve current profile
router.get("/me", authenticateToken, async (req: Request, res: Response) => {
  const userId = req.user!.id;

  try {
    if (CONFIG.IS_MOCK_DB) {
      const profile = mockDb.getProfile(userId);
      return res.json(profile);
    }

    if (!supabase) throw new Error("Supabase client missing");

    const { data: profile, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error || !profile) {
      return res.status(404).json({ error: "Profile not found" });
    }

    return res.json(profile);
  } catch (err: any) {
    console.error("GET /me error:", err.message);
    res.status(500).json({ error: "Failed to fetch profile info" });
  }
});

// PUT /auth/profile - Update profile details
router.put("/profile", authenticateToken, async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const { full_name, mobile, gender, age, income_annual, qualification, state, district, bio, skills } = req.body;

  try {
    if (CONFIG.IS_MOCK_DB) {
      const updated = mockDb.updateProfile(userId, {
        full_name,
        mobile,
        gender,
        age: age ? parseInt(age) : undefined,
        income_annual: income_annual ? parseFloat(income_annual) : undefined,
        qualification,
        state,
        district,
        bio,
        skills: Array.isArray(skills) ? skills : []
      });
      return res.json(updated);
    }

    if (!supabase) throw new Error("Supabase client missing");

    const { data: updated, error } = await supabase
      .from("profiles")
      .update({
        full_name,
        mobile,
        gender,
        age: age ? parseInt(age) : null,
        income_annual: income_annual ? parseFloat(income_annual) : null,
        qualification,
        state,
        district,
        bio,
        skills: Array.isArray(skills) ? skills : [],
        updated_at: new Date().toISOString()
      })
      .eq("id", userId)
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.json(updated);
  } catch (err: any) {
    console.error("PUT /profile error:", err.message);
    res.status(500).json({ error: "Failed to update profile info" });
  }
});

// GET /auth/skills - Get master list of skills
router.get("/skills", async (req: Request, res: Response) => {
  try {
    if (CONFIG.IS_MOCK_DB) {
      return res.json(mockDb.skills);
    }

    if (!supabase) throw new Error("Supabase client missing");

    const { data: skills, error } = await supabase
      .from("skills")
      .select("*");

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.json(skills);
  } catch (err: any) {
    console.error("GET /skills error:", err.message);
    res.status(500).json({ error: "Failed to load skills master list" });
  }
});

export default router;
