import { Router, Request, Response } from "express";
import { authenticateToken } from "../../middlewares/auth.js";
import { CONFIG } from "../../config/index.js";
import { mockDb, supabase } from "../../database/index.js";
import { Course } from "@empowerrural/types";

const router = Router();

// GET /courses - Retrieve courses
router.get("/", async (req: Request, res: Response) => {
  const { category, provider, price_type, type } = req.query;

  try {
    if (CONFIG.IS_MOCK_DB) {
      let list = [...mockDb.courses];
      if (category) {
        list = list.filter(c => c.category.toLowerCase() === (category as string).toLowerCase());
      }
      if (provider) {
        list = list.filter(c => c.provider.toLowerCase() === (provider as string).toLowerCase());
      }
      if (price_type) {
        list = list.filter(c => c.price_type === price_type);
      }
      if (type) {
        list = list.filter(c => c.type === type);
      }
      return res.json(list);
    }

    if (!supabase) throw new Error("Supabase client missing");

    let query = supabase.from("courses").select("*");
    if (category) query = query.eq("category", category);
    if (provider) query = query.eq("provider", provider);
    if (price_type) query = query.eq("price_type", price_type);
    if (type) query = query.eq("type", type);

    const { data: courses, error } = await query;
    if (error) return res.status(400).json({ error: error.message });
    return res.json(courses);
  } catch (err: any) {
    console.error("GET /courses error:", err.message);
    res.status(500).json({ error: "Failed to load courses list" });
  }
});

// GET /courses/progress/me - Get current user course progress logs
router.get("/progress/me", authenticateToken, async (req: Request, res: Response) => {
  const userId = req.user!.id;

  try {
    if (CONFIG.IS_MOCK_DB) {
      const records = mockDb.learningProgress.filter(p => p.user_id === userId);
      const formatted = records.map(rec => {
        const course = mockDb.courses.find(c => c.id === rec.course_id);
        return {
          ...rec,
          course_title: course?.title || "Unknown Course",
          course_provider: course?.provider || "Unknown Provider"
        };
      });
      return res.json(formatted);
    }

    if (!supabase) throw new Error("Supabase client missing");

    const { data: records, error } = await supabase
      .from("learning_progress")
      .select("*, courses(title, provider)")
      .eq("user_id", userId);

    if (error) return res.status(400).json({ error: error.message });

    const formatted = records.map(rec => ({
      id: rec.id,
      user_id: rec.user_id,
      course_id: rec.course_id,
      progress_percent: rec.progress_percent,
      completed: rec.completed,
      certificates_earned: rec.certificates_earned,
      certificate_url: rec.certificate_url,
      course_title: rec.courses?.title || "Unknown Course",
      course_provider: rec.courses?.provider || "Unknown Provider"
    }));

    return res.json(formatted);
  } catch (err: any) {
    console.error("GET /progress/me error:", err.message);
    res.status(500).json({ error: "Failed to fetch user learning progress logs" });
  }
});

// POST /courses/:id/progress - Update progress in course
router.post("/:id/progress", authenticateToken, async (req: Request, res: Response) => {
  const courseId = req.params.id;
  const userId = req.user!.id;
  const { progress_percent } = req.body;

  try {
    const percent = parseInt(progress_percent || "0");
    const completed = percent >= 100;
    const certEarned = completed;

    if (CONFIG.IS_MOCK_DB) {
      let record = mockDb.learningProgress.find(p => p.user_id === userId && p.course_id === courseId);
      if (record) {
        record.progress_percent = percent;
        record.completed = completed;
        record.certificates_earned = certEarned;
        record.updated_at = new Date().toISOString();
      } else {
        record = {
          id: `lp-${Date.now()}`,
          user_id: userId,
          course_id: courseId,
          progress_percent: percent,
          completed,
          certificates_earned: certEarned,
          certificate_url: certEarned ? "https://empowerrural.org/certs/mock-certificate.pdf" : undefined,
          updated_at: new Date().toISOString()
        };
        mockDb.learningProgress.push(record);
      }
      return res.json(record);
    }

    if (!supabase) throw new Error("Supabase client missing");

    const { data: record, error } = await supabase
      .from("learning_progress")
      .upsert({
        user_id: userId,
        course_id: courseId,
        progress_percent: percent,
        completed,
        certificates_earned: certEarned,
        certificate_url: certEarned ? "https://empowerrural.org/certs/mock-certificate.pdf" : null,
        updated_at: new Date().toISOString()
      }, { onConflict: "user_id,course_id" })
      .select()
      .single();

    if (error) return res.status(400).json({ error: error.message });
    return res.json(record);
  } catch (err: any) {
    console.error("POST /progress error:", err.message);
    res.status(500).json({ error: "Failed to update learning progress" });
  }
});

// GET /courses/:id - Course detail
router.get("/:id", async (req: Request, res: Response) => {
  const courseId = req.params.id;

  try {
    if (CONFIG.IS_MOCK_DB) {
      const course = mockDb.courses.find(c => c.id === courseId);
      if (!course) return res.status(404).json({ error: "Course not found" });
      return res.json(course);
    }

    if (!supabase) throw new Error("Supabase client missing");

    const { data: course, error } = await supabase
      .from("courses")
      .select("*")
      .eq("id", courseId)
      .single();

    if (error || !course) return res.status(404).json({ error: "Course not found" });
    return res.json(course);
  } catch (err: any) {
    console.error("GET /courses/:id error:", err.message);
    res.status(500).json({ error: "Failed to load course details" });
  }
});

// POST /courses/:id/bookmark - Toggle bookmark course
router.post("/:id/bookmark", authenticateToken, async (req: Request, res: Response) => {
  const courseId = req.params.id;
  const userId = req.user!.id;

  try {
    if (CONFIG.IS_MOCK_DB) {
      const idx = mockDb.bookmarks.findIndex(b => b.user_id === userId && b.item_type === "course" && b.item_id === courseId);
      if (idx !== -1) {
        mockDb.bookmarks.splice(idx, 1);
        return res.json({ bookmarked: false });
      } else {
        mockDb.bookmarks.push({
          id: `bm-${Date.now()}`,
          user_id: userId,
          item_type: "course",
          item_id: courseId,
          created_at: new Date().toISOString()
        });
        return res.json({ bookmarked: true });
      }
    }

    if (!supabase) throw new Error("Supabase client missing");

    const { data: existing } = await supabase
      .from("bookmarks")
      .select("*")
      .eq("user_id", userId)
      .eq("item_type", "course")
      .eq("item_id", courseId)
      .maybeSingle();

    if (existing) {
      await supabase.from("bookmarks").delete().eq("id", existing.id);
      return res.json({ bookmarked: false });
    } else {
      await supabase.from("bookmarks").insert({
        user_id: userId,
        item_type: "course",
        item_id: courseId
      });
      return res.json({ bookmarked: true });
    }
  } catch (err: any) {
    console.error("POST /bookmark error:", err.message);
    res.status(500).json({ error: "Failed to update bookmark state" });
  }
});

export default router;
