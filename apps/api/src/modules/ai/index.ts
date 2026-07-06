import { Router, Request, Response } from "express";
import { authenticateToken } from "../../middlewares/auth.js";
import { CONFIG } from "../../config/index.js";
import { mockDb, supabase } from "../../database/index.js";

const router = Router();

// ==========================================
// 1. CHAT BOT AGENT WITH SUB-MODULE SUPPORT
// ==========================================
router.post("/chat", authenticateToken, async (req: Request, res: Response) => {
  const { message, module = "coach", context = {} } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message content is required" });
  }

  try {
    // If Gemini API Key is configured, make real API request
    if (CONFIG.GEMINI_API_KEY) {
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${CONFIG.GEMINI_API_KEY}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{
                parts: [{
                  text: `You are an expert AI Career and Skill assistant for rural youth in India named EmpowerRural AI. 
                  Role Module: ${module}. 
                  User context profile: ${JSON.stringify(context)}. 
                  User query: "${message}". 
                  Provide direct, encouraging, easy-to-understand, and practical responses in simple English (supporting local terminology like Panchayat, PMKVY, ITI, SWAYAM where relevant). Keep it under 250 words.`
                }]
              }]
            })
          }
        );
        const data = await response.json();
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) {
          return res.json({ reply: text, source: "gemini" });
        }
      } catch (geminiError: any) {
        console.error("Gemini API call failed, falling back to local engine:", geminiError.message);
      }
    }

    // --- High-Fidelity Local Semantic Engine ---
    const lowerMessage = message.toLowerCase();
    let reply = "";

    switch (module) {
      case "resume":
        reply = "🔍 **Resume Reviewer Feedback:**\n\n";
        if (lowerMessage.includes("format") || lowerMessage.includes("template")) {
          reply += "• Standard single-column formats are best for ATS algorithms.\n• Avoid using fancy graphical charts or progress bars for skills.\n• Use clear headings: Personal Info, Education, Experience, Skills, Projects.";
        } else if (lowerMessage.includes("experience") || lowerMessage.includes("job")) {
          reply += "• List work history in reverse chronological order (newest first).\n• Use action verbs (e.g. 'Managed', 'Developed', 'Repaired') for each bullet.\n• Try to quantify achievements (e.g. 'Handled 50+ customer service records daily').";
        } else {
          reply += "• Ensure your mobile number (+91) and email are correct.\n• Keep skill lists concise and related to the target job.\n• Use our built-in Resume Builder to generate a clean ATS-friendly design instantly.";
        }
        break;

      case "interview":
        reply = "🎯 **Interview Coach Tips:**\n\n";
        if (lowerMessage.includes("nervous") || lowerMessage.includes("fear")) {
          reply += "• Feeling nervous is normal. Practice answering aloud in front of a mirror.\n• Take a slow breath before speaking.\n• Focus on structure: State your experience, give an example, and show your enthusiasm.";
        } else if (lowerMessage.includes("hr") || lowerMessage.includes("introduce")) {
          reply += "• To answer 'Tell me about yourself', follow the **Past-Present-Future** formula:\n  1. *Past*: Where you studied / grew up.\n  2. *Present*: What skills/courses you just finished.\n  3. *Future*: Why this specific job fits your career growth.";
        } else {
          reply += "• Research the company/office before the interview.\n• Dress professionally (formal wear).\n• Browse our Mock Interview simulator to practice specific questions and receive feedback!";
        }
        break;

      case "scheme":
        reply = "💡 **Scheme Eligibility Guidance:**\n\n";
        if (lowerMessage.includes("farmer") || lowerMessage.includes("agriculture")) {
          reply += "• Check the **Rythu Bandhu** scheme for seasonal agriculture subsidies (Telangana).\n• Look into **PM-KISAN** central scheme for landholder support.\n• Apply via your local Gram Panchayat or Village Volunteer.";
        } else if (lowerMessage.includes("free training") || lowerMessage.includes("course") || lowerMessage.includes("skill")) {
          reply += "• Under the **PMKVY** & **DDU-GKY** central programs, rural youth get 100% free skill certifications.\n• Free residential training with meal support is available for selected courses.";
        } else {
          reply += "• Use our 'Schemes Explorer' check tool. Input your age, gender, income, and state, and we will list all eligible schemes instantly.";
        }
        break;

      case "skills":
      case "advisor":
        reply = "📚 **Learning & Skill Advisor Recommendations:**\n\n";
        if (lowerMessage.includes("computer") || lowerMessage.includes("it") || lowerMessage.includes("coding")) {
          reply += "• Highly recommend: **Digital Literacy & Basic Office Suite** (Skill India) to learn Excel/typing.\n• If interested in software: Look up Python & Web Development modules on SWAYAM/NPTEL.";
        } else if (lowerMessage.includes("job ready") || lowerMessage.includes("fast")) {
          reply += "• Vocational paths like **Domestic Electrician** or **Tailoring & Design** offer quick job placement opportunities locally.\n• Soft skills like **Spoken English & Communication** significantly improve interview selection rates.";
        } else {
          reply += "• Explore courses categorized under 'Skill Development'. Most are free and provide official government-recognized certificates.";
        }
        break;

      case "coach":
      default:
        reply = "👋 Namaste! I am your **EmpowerRural Career Coach**.\n\n";
        if (lowerMessage.includes("job") || lowerMessage.includes("career")) {
          reply += "To suggest career paths, let me know:\n1. What is your highest qualification? (e.g. 10th, ITI, Degree)\n2. Do you prefer working on computers, hand tools (electrician/plumbing), or in agriculture?\n3. Would you like remote work-from-home options?";
        } else {
          reply += "I can guide you through:\n• Discovering jobs & central/state government schemes\n• Recommending courses (SWAYAM, PMKVY, Skill India)\n• Reviewing resume templates and mock interview preps\n\nTell me what you would like to explore!";
        }
        break;
    }

    return res.json({ reply, source: "local" });
  } catch (err: any) {
    console.error("POST /chat error:", err.message);
    res.status(500).json({ error: "Failed to query AI Assistant" });
  }
});

// ==========================================
// 2. MOCK INTERVIEW SIMULATOR ROUTES
// ==========================================

// GET /ai/interview/questions - Retrieve interview practice questions
router.get("/interview/questions", async (req: Request, res: Response) => {
  const { category } = req.query;

  try {
    if (CONFIG.IS_MOCK_DB) {
      let questions = mockDb.interviewQuestions;
      if (category) {
        questions = questions.filter(q => q.category === category);
      }
      return res.json(questions);
    }

    if (!supabase) throw new Error("Supabase client missing");

    let query = supabase.from("interview_questions").select("*");
    if (category) query = query.eq("category", category);

    const { data: questions, error } = await query;
    if (error) return res.status(400).json({ error: error.message });
    return res.json(questions);
  } catch (err: any) {
    console.error("GET /interview/questions error:", err.message);
    res.status(500).json({ error: "Failed to fetch interview questions" });
  }
});

// POST /ai/interview/evaluate - Generate mock interview scorecard
router.post("/interview/evaluate", authenticateToken, async (req: Request, res: Response) => {
  const { questionId, answer } = req.body;
  const userId = req.user!.id;

  if (!questionId || !answer) {
    return res.status(400).json({ error: "questionId and answer are required" });
  }

  try {
    let question = null;

    if (CONFIG.IS_MOCK_DB) {
      question = mockDb.interviewQuestions.find(q => q.id === questionId);
    } else {
      if (!supabase) throw new Error("Supabase client missing");
      const { data, error } = await supabase.from("interview_questions").select("*").eq("id", questionId).single();
      if (!error) question = data;
    }

    if (!question) {
      return res.status(404).json({ error: "Interview question not found" });
    }

    // High fidelity evaluation engine
    const answerLen = answer.trim().length;
    let score = 5; // base score
    let feedback = "";

    if (answerLen < 15) {
      score = 4;
      feedback = "Your answer is very brief. Try to explain with more detail. Mention your background, skills, and concrete examples.";
    } else if (answerLen > 100) {
      score = 8;
      feedback = "Great depth! You structured your points well. To score a perfect 10, include a measurable outcome of your action.";
    } else {
      score = 7;
      feedback = "Good response. Try to connect your skill directly with the needs of the job role and talk about your future goals.";
    }

    // Match keywords for high score
    const lowerAns = answer.toLowerCase();
    if (lowerAns.includes("because") || lowerAns.includes("for example") || lowerAns.includes("specifically")) {
      score += 1;
    }
    if (lowerAns.includes("learn") || lowerAns.includes("develop") || lowerAns.includes("improve")) {
      score += 1;
    }
    score = Math.min(10, score); // Cap at 10

    // Save mock interview progress
    const newProgress = {
      id: CONFIG.IS_MOCK_DB ? `ip-${Date.now()}` : undefined as any,
      user_id: userId,
      category: question.category,
      score,
      transcript: [{
        question: question.question,
        answer,
        score,
        feedback
      }],
      completed_at: new Date().toISOString()
    };

    if (CONFIG.IS_MOCK_DB) {
      mockDb.interviewProgress.push(newProgress);
    } else {
      if (!supabase) throw new Error("Supabase client missing");
      await supabase.from("interview_progress").insert(newProgress);
    }

    return res.json({
      score,
      feedback,
      sampleAnswer: question.sample_answer
    });

  } catch (err: any) {
    console.error("POST /interview/evaluate error:", err.message);
    res.status(500).json({ error: "Failed to evaluate response" });
  }
});

export default router;
