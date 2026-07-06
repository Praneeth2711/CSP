import { Router, Request, Response } from "express";
import { authenticateToken } from "../../middlewares/auth.js";
import { CONFIG } from "../../config/index.js";
import { mockDb, supabase } from "../../database/index.js";
import { Scheme } from "@empowerrural/types";

const router = Router();

// GET /schemes - Retrieve government schemes list
router.get("/", async (req: Request, res: Response) => {
  const { category, sponsor } = req.query;

  try {
    if (CONFIG.IS_MOCK_DB) {
      let list = [...mockDb.schemes];
      if (category) {
        list = list.filter(s => s.category.toLowerCase() === (category as string).toLowerCase());
      }
      if (sponsor) {
        list = list.filter(s => s.sponsor === sponsor);
      }
      return res.json(list);
    }

    if (!supabase) throw new Error("Supabase client missing");

    let query = supabase.from("schemes").select("*");
    if (category) query = query.eq("category", category);
    if (sponsor) query = query.eq("sponsor", sponsor);

    const { data: schemes, error } = await query;
    if (error) return res.status(400).json({ error: error.message });
    return res.json(schemes);
  } catch (err: any) {
    console.error("GET /schemes error:", err.message);
    res.status(500).json({ error: "Failed to fetch schemes list" });
  }
});

// POST /schemes/check-eligibility - Evaluate inputs against rules
router.post("/check-eligibility", async (req: Request, res: Response) => {
  const { age, gender, income, state, qualification } = req.body;

  try {
    let allSchemes: Scheme[] = [];

    if (CONFIG.IS_MOCK_DB) {
      allSchemes = [...mockDb.schemes];
    } else {
      if (!supabase) throw new Error("Supabase client missing");
      const { data, error } = await supabase.from("schemes").select("*");
      if (error) return res.status(400).json({ error: error.message });
      allSchemes = data || [];
    }

    const matchedSchemes = allSchemes.filter(scheme => {
      const rules = scheme.eligibility;

      // 1. Age Rule
      if (age !== undefined && age !== null && age !== "") {
        const parsedAge = parseInt(age);
        if (rules.min_age && parsedAge < rules.min_age) return false;
        if (rules.max_age && parsedAge > rules.max_age) return false;
      }

      // 2. Gender Rule
      if (gender && rules.genders && rules.genders.length > 0) {
        if (!rules.genders.map(g => g.toLowerCase()).includes(gender.toLowerCase())) {
          return false;
        }
      }

      // 3. Income Rule (Annual max limit check)
      if (income !== undefined && income !== null && income !== "") {
        const parsedIncome = parseFloat(income);
        if (rules.max_income && parsedIncome > rules.max_income) return false;
      }

      // 4. State Rule (State specific check)
      if (state && rules.states && rules.states.length > 0) {
        const stateMatch = rules.states.map(s => s.toLowerCase()).includes(state.toLowerCase());
        if (!stateMatch) return false;
      }

      // 5. Qualification Rule (Required check)
      if (qualification && rules.qualifications && rules.qualifications.length > 0) {
        const qualMatch = rules.qualifications.map(q => q.toLowerCase()).includes(qualification.toLowerCase());
        if (!qualMatch) return false;
      }

      return true;
    });

    return res.json(matchedSchemes);
  } catch (err: any) {
    console.error("POST /check-eligibility error:", err.message);
    res.status(500).json({ error: "Failed to evaluate scheme eligibility" });
  }
});

// GET /schemes/:id - Retrieve detail of single scheme
router.get("/:id", async (req: Request, res: Response) => {
  const schemeId = req.params.id;

  try {
    if (CONFIG.IS_MOCK_DB) {
      const scheme = mockDb.schemes.find(s => s.id === schemeId);
      if (!scheme) return res.status(404).json({ error: "Scheme not found" });
      return res.json(scheme);
    }

    if (!supabase) throw new Error("Supabase client missing");

    const { data: scheme, error } = await supabase
      .from("schemes")
      .select("*")
      .eq("id", schemeId)
      .single();

    if (error || !scheme) return res.status(404).json({ error: "Scheme not found" });
    return res.json(scheme);
  } catch (err: any) {
    console.error("GET /schemes/:id error:", err.message);
    res.status(500).json({ error: "Failed to load scheme details" });
  }
});

// POST /schemes/:id/bookmark - Toggle bookmark scheme
router.post("/:id/bookmark", authenticateToken, async (req: Request, res: Response) => {
  const schemeId = req.params.id;
  const userId = req.user!.id;

  try {
    if (CONFIG.IS_MOCK_DB) {
      const idx = mockDb.bookmarks.findIndex(b => b.user_id === userId && b.item_type === "scheme" && b.item_id === schemeId);
      if (idx !== -1) {
        mockDb.bookmarks.splice(idx, 1);
        return res.json({ bookmarked: false });
      } else {
        mockDb.bookmarks.push({
          id: `bm-${Date.now()}`,
          user_id: userId,
          item_type: "scheme",
          item_id: schemeId,
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
      .eq("item_type", "scheme")
      .eq("item_id", schemeId)
      .maybeSingle();

    if (existing) {
      await supabase.from("bookmarks").delete().eq("id", existing.id);
      return res.json({ bookmarked: false });
    } else {
      await supabase.from("bookmarks").insert({
        user_id: userId,
        item_type: "scheme",
        item_id: schemeId
      });
      return res.json({ bookmarked: true });
    }
  } catch (err: any) {
    console.error("POST /bookmark error:", err.message);
    res.status(500).json({ error: "Failed to update bookmark state" });
  }
});

export default router;
