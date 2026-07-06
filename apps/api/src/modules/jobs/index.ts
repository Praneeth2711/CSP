import { Router, Request, Response } from "express";
import { authenticateToken, authorizeRole } from "../../middlewares/auth.js";
import { CONFIG } from "../../config/index.js";
import { mockDb, supabase } from "../../database/index.js";
import { Job, JobApplication } from "@empowerrural/types";

const router = Router();

// GET /jobs - Fetch and filter jobs
router.get("/", async (req: Request, res: Response) => {
  const { search, type, state, district, qualification } = req.query;

  try {
    if (CONFIG.IS_MOCK_DB) {
      let filteredJobs = [...mockDb.jobs];

      // 1. Text Search Filter
      if (search) {
        const query = (search as string).toLowerCase();
        filteredJobs = filteredJobs.filter(
          job => job.title.toLowerCase().includes(query) ||
                 job.company.toLowerCase().includes(query) ||
                 job.description.toLowerCase().includes(query)
        );
      }

      // 2. Job Type Filter
      if (type) {
        filteredJobs = filteredJobs.filter(job => job.type === type);
      }

      // 3. Regional Filters
      if (state) {
        filteredJobs = filteredJobs.filter(job => job.state.toLowerCase() === (state as string).toLowerCase());
      }
      if (district) {
        filteredJobs = filteredJobs.filter(job => job.district.toLowerCase() === (district as string).toLowerCase());
      }

      // 4. Qualification Filter
      if (qualification) {
        filteredJobs = filteredJobs.filter(job => job.qualification.toLowerCase() === (qualification as string).toLowerCase());
      }

      return res.json(filteredJobs);
    }

    if (!supabase) throw new Error("Supabase client missing");

    let query = supabase.from("jobs").select("*");

    if (search) {
      query = query.or(`title.ilike.%${search}%,company.ilike.%${search}%,description.ilike.%${search}%`);
    }
    if (type) {
      query = query.eq("type", type);
    }
    if (state) {
      query = query.eq("state", state);
    }
    if (district) {
      query = query.eq("district", district);
    }
    if (qualification) {
      query = query.eq("qualification", qualification);
    }

    const { data: jobs, error } = await query;

    if (error) return res.status(400).json({ error: error.message });
    return res.json(jobs);
  } catch (err: any) {
    console.error("GET /jobs error:", err.message);
    res.status(500).json({ error: "Failed to load jobs list" });
  }
});

// GET /jobs/applications/me - Get user's applications
router.get("/applications/me", authenticateToken, async (req: Request, res: Response) => {
  const userId = req.user!.id;

  try {
    if (CONFIG.IS_MOCK_DB) {
      const userApps = mockDb.jobApplications
        .filter(app => app.user_id === userId)
        .map(app => {
          const job = mockDb.jobs.find(j => j.id === app.job_id);
          return {
            ...app,
            job_title: job?.title || "Unknown Job",
            company_name: job?.company || "Unknown Company"
          };
        });
      return res.json(userApps);
    }

    if (!supabase) throw new Error("Supabase client missing");

    const { data: apps, error } = await supabase
      .from("job_applications")
      .select("*, jobs(title, company)")
      .eq("user_id", userId);

    if (error) return res.status(400).json({ error: error.message });

    const formattedApps = apps.map(app => ({
      id: app.id,
      user_id: app.user_id,
      job_id: app.job_id,
      resume_url: app.resume_url,
      status: app.status,
      applied_at: app.applied_at,
      job_title: app.jobs?.title || "Unknown Job",
      company_name: app.jobs?.company || "Unknown Company"
    }));

    return res.json(formattedApps);
  } catch (err: any) {
    console.error("GET /applications/me error:", err.message);
    res.status(500).json({ error: "Failed to fetch user applications" });
  }
});

// GET /jobs/:id - Get single job detail
router.get("/:id", async (req: Request, res: Response) => {
  const jobId = req.params.id;

  try {
    if (CONFIG.IS_MOCK_DB) {
      const job = mockDb.jobs.find(j => j.id === jobId);
      if (!job) return res.status(404).json({ error: "Job posting not found" });
      return res.json(job);
    }

    if (!supabase) throw new Error("Supabase client missing");

    const { data: job, error } = await supabase
      .from("jobs")
      .select("*")
      .eq("id", jobId)
      .single();

    if (error || !job) return res.status(404).json({ error: "Job posting not found" });
    return res.json(job);
  } catch (err: any) {
    console.error("GET /jobs/:id error:", err.message);
    res.status(500).json({ error: "Failed to load job details" });
  }
});

// POST /jobs - Add new job (Admin or Panchayat)
router.post("/", authenticateToken, authorizeRole(["admin", "panchayat"]), async (req: Request, res: Response) => {
  const { title, company, logo_url, description, requirements, benefits, salary_range, location_type, type, state, district, qualification, category, apply_url } = req.body;

  try {
    const newJob: Job = {
      id: CONFIG.IS_MOCK_DB ? `job-${Date.now()}` : undefined as any,
      title,
      company,
      logo_url,
      description,
      requirements: Array.isArray(requirements) ? requirements : [],
      benefits: Array.isArray(benefits) ? benefits : [],
      salary_range,
      location_type,
      type,
      state,
      district,
      qualification,
      category,
      apply_url,
      is_featured: false,
      created_at: new Date().toISOString()
    };

    if (CONFIG.IS_MOCK_DB) {
      mockDb.jobs.unshift(newJob);
      return res.status(201).json(newJob);
    }

    if (!supabase) throw new Error("Supabase client missing");

    const { data: job, error } = await supabase
      .from("jobs")
      .insert(newJob)
      .select()
      .single();

    if (error) return res.status(400).json({ error: error.message });
    return res.status(201).json(job);
  } catch (err: any) {
    console.error("POST /jobs error:", err.message);
    res.status(500).json({ error: "Failed to create job listing" });
  }
});

// DELETE /jobs/:id - Delete job (Admin or Panchayat)
router.delete("/:id", authenticateToken, authorizeRole(["admin", "panchayat"]), async (req: Request, res: Response) => {
  const jobId = req.params.id;

  try {
    if (CONFIG.IS_MOCK_DB) {
      const idx = mockDb.jobs.findIndex(j => j.id === jobId);
      if (idx === -1) return res.status(404).json({ error: "Job not found" });
      mockDb.jobs.splice(idx, 1);
      return res.json({ success: true, message: "Job deleted successfully" });
    }

    if (!supabase) throw new Error("Supabase client missing");

    const { error } = await supabase
      .from("jobs")
      .delete()
      .eq("id", jobId);

    if (error) return res.status(400).json({ error: error.message });
    return res.json({ success: true, message: "Job deleted successfully" });
  } catch (err: any) {
    console.error("DELETE /jobs/:id error:", err.message);
    res.status(500).json({ error: "Failed to delete job listing" });
  }
});

// POST /jobs/:id/apply - Submit job application
router.post("/:id/apply", authenticateToken, async (req: Request, res: Response) => {
  const jobId = req.params.id;
  const userId = req.user!.id;
  const { resume_url } = req.body;

  try {
    if (CONFIG.IS_MOCK_DB) {
      const alreadyApplied = mockDb.jobApplications.some(app => app.user_id === userId && app.job_id === jobId);
      if (alreadyApplied) return res.status(400).json({ error: "You have already applied for this job" });

      const newApp: JobApplication = {
        id: `app-${Date.now()}`,
        user_id: userId,
        job_id: jobId,
        resume_url,
        status: "applied",
        applied_at: new Date().toISOString()
      };
      mockDb.jobApplications.push(newApp);

      // Create notification
      const job = mockDb.jobs.find(j => j.id === jobId);
      mockDb.notifications.push({
        id: `notif-${Date.now()}`,
        user_id: userId,
        title: "Application Submitted Successfully",
        message: `Your application for "${job?.title}" at "${job?.company}" has been sent.`,
        type: "application_update",
        read: false,
        created_at: new Date().toISOString()
      });

      return res.status(201).json(newApp);
    }

    if (!supabase) throw new Error("Supabase client missing");

    const { data: newApp, error } = await supabase
      .from("job_applications")
      .insert({
        user_id: userId,
        job_id: jobId,
        resume_url,
        status: "applied"
      })
      .select()
      .single();

    if (error) return res.status(400).json({ error: error.message });
    return res.status(201).json(newApp);
  } catch (err: any) {
    console.error("POST /apply error:", err.message);
    res.status(500).json({ error: "Failed to submit job application" });
  }
});

// POST /jobs/:id/bookmark - Toggle bookmark job
router.post("/:id/bookmark", authenticateToken, async (req: Request, res: Response) => {
  const jobId = req.params.id;
  const userId = req.user!.id;

  try {
    if (CONFIG.IS_MOCK_DB) {
      const idx = mockDb.bookmarks.findIndex(b => b.user_id === userId && b.item_type === "job" && b.item_id === jobId);
      if (idx !== -1) {
        mockDb.bookmarks.splice(idx, 1);
        return res.json({ bookmarked: false });
      } else {
        mockDb.bookmarks.push({
          id: `bm-${Date.now()}`,
          user_id: userId,
          item_type: "job",
          item_id: jobId,
          created_at: new Date().toISOString()
        });
        return res.json({ bookmarked: true });
      }
    }

    if (!supabase) throw new Error("Supabase client missing");

    // Check if bookmark exists
    const { data: existing } = await supabase
      .from("bookmarks")
      .select("*")
      .eq("user_id", userId)
      .eq("item_type", "job")
      .eq("item_id", jobId)
      .maybeSingle();

    if (existing) {
      await supabase.from("bookmarks").delete().eq("id", existing.id);
      return res.json({ bookmarked: false });
    } else {
      await supabase.from("bookmarks").insert({
        user_id: userId,
        item_type: "job",
        item_id: jobId
      });
      return res.json({ bookmarked: true });
    }
  } catch (err: any) {
    console.error("POST /bookmark error:", err.message);
    res.status(500).json({ error: "Failed to update bookmark state" });
  }
});

export default router;
