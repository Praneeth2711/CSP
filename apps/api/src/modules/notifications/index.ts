import { Router, Request, Response } from "express";
import { authenticateToken, authorizeRole } from "../../middlewares/auth.js";
import { CONFIG } from "../../config/index.js";
import { mockDb, supabase } from "../../database/index.js";
import { Notification } from "@empowerrural/types";

const router = Router();

// GET /notifications - Retrieve notifications for current user
router.get("/", authenticateToken, async (req: Request, res: Response) => {
  const userId = req.user!.id;

  try {
    if (CONFIG.IS_MOCK_DB) {
      // Return custom mock notifications if empty
      const list = mockDb.notifications.filter(n => n.user_id === userId);
      if (list.length === 0) {
        const standardNotifs: Notification[] = [
          {
            id: "notif-1",
            user_id: userId,
            title: "Welcome to EmpowerRural!",
            message: "Explore jobs, build your resume, and check government scheme eligibility.",
            type: "system",
            read: false,
            created_at: new Date(Date.now() - 3600000).toISOString()
          },
          {
            id: "notif-2",
            user_id: userId,
            title: "Trending Course Recommendation",
            message: "Basic Office Suite and Excel has been added to SWAYAM course index.",
            type: "course_reminder",
            read: false,
            created_at: new Date(Date.now() - 7200000).toISOString()
          }
        ];
        mockDb.notifications.push(...standardNotifs);
        return res.json(standardNotifs);
      }
      return res.json(list);
    }

    if (!supabase) throw new Error("Supabase client missing");

    const { data: list, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) return res.status(400).json({ error: error.message });
    return res.json(list);
  } catch (err: any) {
    console.error("GET /notifications error:", err.message);
    res.status(500).json({ error: "Failed to load notifications" });
  }
});

// PUT /notifications/:id/read - Mark notification as read
router.put("/:id/read", authenticateToken, async (req: Request, res: Response) => {
  const notifId = req.params.id;
  const userId = req.user!.id;

  try {
    if (CONFIG.IS_MOCK_DB) {
      const notif = mockDb.notifications.find(n => n.id === notifId && n.user_id === userId);
      if (notif) {
        notif.read = true;
        return res.json(notif);
      }
      return res.status(404).json({ error: "Notification not found" });
    }

    if (!supabase) throw new Error("Supabase client missing");

    const { data: updated, error } = await supabase
      .from("notifications")
      .update({ read: true })
      .eq("id", notifId)
      .eq("user_id", userId)
      .select()
      .single();

    if (error) return res.status(400).json({ error: error.message });
    return res.json(updated);
  } catch (err: any) {
    console.error("PUT /notifications/:id/read error:", err.message);
    res.status(500).json({ error: "Failed to update notification state" });
  }
});

// POST /notifications/broadcast - Send notification to all profiles (Admin Only)
router.post("/broadcast", authenticateToken, authorizeRole(["admin"]), async (req: Request, res: Response) => {
  const { title, message } = req.body;

  if (!title || !message) {
    return res.status(400).json({ error: "Title and message are required" });
  }

  try {
    if (CONFIG.IS_MOCK_DB) {
      // Broadcast in-memory
      mockDb.profiles.forEach(profile => {
        mockDb.notifications.push({
          id: `broad-${Date.now()}-${profile.id}`,
          user_id: profile.id,
          title,
          message,
          type: "system",
          read: false,
          created_at: new Date().toISOString()
        });
      });
      return res.json({ success: true, message: "Broadcast sent successfully to local mock users" });
    }

    if (!supabase) throw new Error("Supabase client missing");

    // Fetch all user profile IDs
    const { data: profiles, error: pError } = await supabase.from("profiles").select("id");
    if (pError || !profiles) {
      return res.status(400).json({ error: pError?.message || "Failed to retrieve user index" });
    }

    const inserts = profiles.map(p => ({
      user_id: p.id,
      title,
      message,
      type: "system",
      read: false
    }));

    const { error } = await supabase.from("notifications").insert(inserts);

    if (error) return res.status(400).json({ error: error.message });
    return res.json({ success: true, message: `Broadcast sent successfully to ${profiles.length} users` });
  } catch (err: any) {
    console.error("POST /broadcast error:", err.message);
    res.status(500).json({ error: "Failed to broadcast notifications" });
  }
});

export default router;
