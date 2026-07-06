import { Router, Request, Response } from "express";
import { authenticateToken } from "../../middlewares/auth.js";
import { CONFIG } from "../../config/index.js";
import { mockDb, supabase } from "../../database/index.js";
import { UserResume } from "@empowerrural/types";

const router = Router();

// GET /resume - Retrieve current user resume
router.get("/", authenticateToken, async (req: Request, res: Response) => {
  const userId = req.user!.id;

  try {
    if (CONFIG.IS_MOCK_DB) {
      let resume = mockDb.resumes.find(r => r.user_id === userId);
      if (!resume) {
        // Initialize empty mock resume template
        resume = {
          id: `res-${Date.now()}`,
          user_id: userId,
          resume_data: {
            personal: { name: "", email: "", phone: "", location: "", summary: "" },
            education: [],
            experience: [],
            skills: [],
            projects: []
          },
          template_name: "modern",
          version: 1,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        mockDb.resumes.push(resume);
      }
      return res.json(resume);
    }

    if (!supabase) throw new Error("Supabase client missing");

    const { data: resume, error } = await supabase
      .from("resumes")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

    if (error) return res.status(400).json({ error: error.message });

    if (!resume) {
      return res.json({
        resume_data: {
          personal: { name: "", email: "", phone: "", location: "", summary: "" },
          education: [],
          experience: [],
          skills: [],
          projects: []
        },
        template_name: "modern",
        version: 1
      });
    }

    return res.json(resume);
  } catch (err: any) {
    console.error("GET /resume error:", err.message);
    res.status(500).json({ error: "Failed to fetch resume details" });
  }
});

// POST /resume - Save / Update resume details
router.post("/", authenticateToken, async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const { resume_data, template_name } = req.body;

  try {
    if (CONFIG.IS_MOCK_DB) {
      let resume = mockDb.resumes.find(r => r.user_id === userId);
      if (resume) {
        resume.resume_data = resume_data;
        resume.template_name = template_name || resume.template_name;
        resume.version += 1;
        resume.updated_at = new Date().toISOString();
      } else {
        resume = {
          id: `res-${Date.now()}`,
          user_id: userId,
          resume_data,
          template_name: template_name || "modern",
          version: 1,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        mockDb.resumes.push(resume);
      }
      
      // Update profile status
      mockDb.updateProfile(userId, { resume_completed: true });
      
      return res.json(resume);
    }

    if (!supabase) throw new Error("Supabase client missing");

    // Retrieve original resume if exists to determine version bump
    const { data: existing } = await supabase
      .from("resumes")
      .select("version")
      .eq("user_id", userId)
      .maybeSingle();

    const version = existing ? existing.version + 1 : 1;

    const { data: resume, error } = await supabase
      .from("resumes")
      .upsert({
        user_id: userId,
        resume_data,
        template_name: template_name || "modern",
        version,
        updated_at: new Date().toISOString()
      }, { onConflict: "user_id" })
      .select()
      .single();

    if (error) return res.status(400).json({ error: error.message });

    // Mark user profile as resume completed
    await supabase
      .from("profiles")
      .update({ resume_completed: true })
      .eq("id", userId);

    return res.json(resume);
  } catch (err: any) {
    console.error("POST /resume error:", err.message);
    res.status(500).json({ error: "Failed to save resume details" });
  }
});

export default router;
