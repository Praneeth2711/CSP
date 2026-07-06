import { Router, Request, Response } from "express";
import { authenticateToken } from "../../middlewares/auth.js";
import { CONFIG } from "../../config/index.js";
import { mockDb, supabase } from "../../database/index.js";
import { Job, Course, Scheme } from "@empowerrural/types";

const router = Router();

// GET /dashboard/summary - Retrieve stats, bookmarks, and recommendations
router.get("/summary", authenticateToken, async (req: Request, res: Response) => {
  const userId = req.user!.id;

  try {
    let profile = null;
    let savedJobsCount = 0;
    let savedCoursesCount = 0;
    let savedSchemesCount = 0;
    let applicationsCount = 0;
    let coursesInProgress = 0;
    let notificationsCount = 0;
    
    let recommendedJobs: Job[] = [];
    let recommendedCourses: Course[] = [];
    let recommendedSchemes: Scheme[] = [];

    if (CONFIG.IS_MOCK_DB) {
      profile = mockDb.getProfile(userId);
      const bookmarks = mockDb.bookmarks.filter(b => b.user_id === userId);
      savedJobsCount = bookmarks.filter(b => b.item_type === "job").length;
      savedCoursesCount = bookmarks.filter(b => b.item_type === "course").length;
      savedSchemesCount = bookmarks.filter(b => b.item_type === "scheme").length;
      
      applicationsCount = mockDb.jobApplications.filter(a => a.user_id === userId).length;
      coursesInProgress = mockDb.learningProgress.filter(p => p.user_id === userId && !p.completed).length;
      notificationsCount = mockDb.notifications.filter(n => n.user_id === userId && !n.read).length;

      // Personalized Recommendations based on skills, state, and qualification
      const userSkills = profile.skills || [];
      const userState = profile.state || "";
      const userQual = profile.qualification || "";

      // Recommended Jobs: match user state or matching qualification
      recommendedJobs = mockDb.jobs.filter(j => 
        j.state.toLowerCase() === userState.toLowerCase() ||
        j.qualification.toLowerCase() === userQual.toLowerCase()
      ).slice(0, 3);

      // Recommended Courses: match category of skills
      recommendedCourses = mockDb.courses.filter(c => 
        userSkills.some(skill => c.category.toLowerCase().includes(skill.toLowerCase()) || skill.toLowerCase().includes(c.category.toLowerCase())) ||
        c.is_trending
      ).slice(0, 3);

      // Recommended Schemes: match state or age
      recommendedSchemes = mockDb.schemes.filter(s => 
        !s.state || s.state.toLowerCase() === userState.toLowerCase()
      ).slice(0, 3);

    } else {
      if (!supabase) throw new Error("Supabase client missing");

      // Load Profile
      const { data: prof } = await supabase.from("profiles").select("*").eq("id", userId).single();
      profile = prof;

      // Load Bookmarks
      const { data: bms } = await supabase.from("bookmarks").select("item_type").eq("user_id", userId);
      if (bms) {
        savedJobsCount = bms.filter(b => b.item_type === "job").length;
        savedCoursesCount = bms.filter(b => b.item_type === "course").length;
        savedSchemesCount = bms.filter(b => b.item_type === "scheme").length;
      }

      // Load Applications
      const { count: appCount } = await supabase
        .from("job_applications")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId);
      applicationsCount = appCount || 0;

      // Load Course progress
      const { count: progressCount } = await supabase
        .from("learning_progress")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId)
        .eq("completed", false);
      coursesInProgress = progressCount || 0;

      // Unread notifications
      const { count: unreadCount } = await supabase
        .from("notifications")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId)
        .eq("read", false);
      notificationsCount = unreadCount || 0;

      // Simple recommendation fallbacks (featured / trending items)
      const { data: rJobs } = await supabase.from("jobs").select("*").limit(3);
      const { data: rCourses } = await supabase.from("courses").select("*").eq("is_trending", true).limit(3);
      const { data: rSchemes } = await supabase.from("schemes").select("*").eq("is_featured", true).limit(3);

      recommendedJobs = rJobs || [];
      recommendedCourses = rCourses || [];
      recommendedSchemes = rSchemes || [];
    }

    // Calculate profile completeness score
    let score = 20; // baseline for account email
    if (profile?.full_name) score += 20;
    if (profile?.mobile) score += 10;
    if (profile?.state && profile?.district) score += 20;
    if (profile?.qualification) score += 10;
    if (profile?.skills && profile.skills.length > 0) score += 10;
    if (profile?.resume_completed) score += 10;

    return res.json({
      profileCompleteness: score,
      stats: {
        savedJobsCount,
        savedCoursesCount,
        savedSchemesCount,
        applicationsCount,
        coursesInProgress,
        notificationsCount
      },
      recommendations: {
        jobs: recommendedJobs,
        courses: recommendedCourses,
        schemes: recommendedSchemes
      }
    });

  } catch (err: any) {
    console.error("GET /dashboard/summary error:", err.message);
    res.status(500).json({ error: "Failed to gather dashboard statistics" });
  }
});

export default router;
