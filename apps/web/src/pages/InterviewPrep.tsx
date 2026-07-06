import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNotification } from "../context/NotificationContext";
import { InterviewQuestion } from "@empowerrural/types";
import { 
  HelpCircle, User, Award, BookOpen, Clock, 
  ChevronRight, ArrowRight, Play, RefreshCw, Send, CheckCircle 
} from "lucide-react";
import { Button, Card, Input, Badge, EmptyState, PageLoader } from "@empowerrural/ui";

export const InterviewPrep: React.FC = () => {
  const { token, user } = useAuth();
  const { showToast } = useNotification();

  const [activeTab, setActiveTab] = useState<"guides" | "mock">("guides");
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [loading, setLoading] = useState(false);

  // Mock Simulator State
  const [simulatorActive, setSimulatorActive] = useState(false);
  const [activeCategory, setActiveCategory] = useState<"hr" | "technical">("hr");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [submittingAnswer, setSubmittingAnswer] = useState(false);

  // Result/Scorecard State
  const [evaluationResult, setEvaluationResult] = useState<{
    score: number;
    feedback: string;
    sampleAnswer: string;
  } | null>(null);

  const interviewTips = [
    { title: "Dress Professionally", desc: "Wear neat, ironed formal clothing even if the interview is online." },
    { title: "Body Posture & Contact", desc: "Sit straight, maintain polite eye contact, and greet panel members with a smile." },
    { title: "Past-Present-Future Pitch", desc: "Structure your self-introduction by explaining what you studied (past), your skills (present), and why you fit (future)." },
    { title: "Listen Carefully", desc: "Take a breath, listen to the complete question, and ask for clarification if anything is unclear." }
  ];

  // Fetch Questions for simulator
  const startSimulator = async (category: "hr" | "technical") => {
    setLoading(true);
    setActiveCategory(category);
    setEvaluationResult(null);
    setCurrentQuestionIndex(0);
    setUserAnswer("");
    
    try {
      const res = await fetch(`/api/ai/interview/questions?category=${category}`);
      if (res.ok) {
        const data = await res.json();
        setQuestions(data);
        setSimulatorActive(true);
      } else {
        throw new Error("Failed fetching question index");
      }
    } catch (err) {
      console.warn("Failed to reach API server. Resolving locally from mock data.");
      // Fallback local interview questions
      const localQ: InterviewQuestion[] = [
        {
          id: "int-q1",
          category: "hr" as const,
          sub_category: "General",
          question: "Tell me about yourself and your background.",
          hints: ["Mention your hometown, school/college education.", "Talk about your skills and why you applied."],
          sample_answer: "I am a degree graduate from Anantapur district. I have completed a digital marketing certification through Skill India and have strong basic computer skills. I am looking to utilize my communication skills to help local companies expand their digital reach."
        },
        {
          id: "int-q2",
          category: "hr" as const,
          sub_category: "Behavioral",
          question: "Why do you want to work in your village/district rather than moving to a major metro city?",
          hints: ["Emphasize community connection.", "Discuss local growth opportunities."],
          sample_answer: "I believe rural areas hold immense potential. By staying in my district, I can support local businesses and help bridge the digital gap in our community while remaining close to my family."
        },
        {
          id: "int-q3",
          category: "technical" as const,
          sub_category: "Data Entry",
          question: "How do you ensure data accuracy when typing large volumes of information in MS Excel?",
          hints: ["Mention validation features.", "Talk about regular audit checks."],
          sample_answer: "I ensure accuracy by using built-in Excel features like Data Validation to restrict inputs. Additionally, I double-check data blocks periodically using formula sum tallies and format checks."
        }
      ].filter(q => q.category === category) as any;
      setQuestions(localQ);
      setSimulatorActive(true);
    } finally {
      setLoading(false);
    }
  };

  // Submit Answer for AI Evaluation
  const handleSubmitAnswer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userAnswer.trim()) {
      showToast("Please write down your answer before submitting.", "warning");
      return;
    }
    setSubmittingAnswer(true);

    const activeQuestion = questions[currentQuestionIndex];

    try {
      const res = await fetch("/api/ai/interview/evaluate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          questionId: activeQuestion.id,
          answer: userAnswer
        })
      });

      if (res.ok) {
        const data = await res.json();
        setEvaluationResult(data);
        showToast("Answer evaluated successfully! Scorecard unlocked.", "success");
      } else {
        throw new Error("Evaluation API failure");
      }
    } catch (err) {
      // Local fallback simulator logic
      const len = userAnswer.trim().length;
      let score = 6;
      let feedback = "Good response. Connect your trade skills directly with the job requirements.";
      if (len < 20) {
        score = 4;
        feedback = "Answer is too short. Elaborate with details about your training and motivation.";
      } else if (len > 80) {
        score = 8;
        feedback = "Great answer structure. Mention a concrete project example next time to secure a 10.";
      }
      setEvaluationResult({
        score,
        feedback,
        sampleAnswer: activeQuestion.sample_answer
      });
      showToast("Evaluation generated successfully (Mock local mode)", "success");
    } finally {
      setSubmittingAnswer(false);
    }
  };

  const handleNextQuestion = () => {
    setEvaluationResult(null);
    setUserAnswer("");
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setSimulatorActive(false);
      showToast("Mock Interview practice session finished!", "success");
    }
  };

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-slate-800 dark:text-white">Interview Preparation</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Review common questions, browse professional tips, and simulate mock interviews with our AI Evaluation Coach.</p>
      </div>

      {/* Tab Switcher */}
      <div className="flex space-x-2 border-b border-slate-100 dark:border-slate-850 pb-4">
        <button
          onClick={() => { setActiveTab("guides"); setSimulatorActive(false); }}
          className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold border transition-all ${
            activeTab === "guides"
              ? "bg-slate-900 border-slate-900 text-white"
              : "bg-white border-slate-200 text-slate-650 hover:bg-slate-50"
          }`}
        >
          Interview Guides & Q&As
        </button>
        <button
          onClick={() => setActiveTab("mock")}
          className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold border transition-all ${
            activeTab === "mock"
              ? "bg-slate-900 border-slate-900 text-white"
              : "bg-white border-slate-200 text-slate-650 hover:bg-slate-50"
          }`}
        >
          Mock Simulator
        </button>
      </div>

      {/* SECTION 1: GUIDES AND TIPS */}
      {activeTab === "guides" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Interview tips */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="p-6 border border-slate-100 space-y-4">
              <h3 className="font-extrabold text-slate-800 dark:text-white uppercase tracking-wider text-xs">Recruiter Tips</h3>
              <div className="space-y-4">
                {interviewTips.map((tip, idx) => (
                  <div key={idx} className="space-y-1 text-xs">
                    <p className="font-bold text-slate-800 dark:text-white flex items-center">
                      <span className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-[10px] mr-2">
                        {idx + 1}
                      </span>
                      {tip.title}
                    </p>
                    <p className="text-slate-500 leading-relaxed pl-7">{tip.desc}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Common Q&A aggregates */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6 border border-slate-100">
              <h3 className="text-lg font-bold text-slate-850 dark:text-white mb-4">Common Interview Questions</h3>
              
              <div className="space-y-5 divide-y divide-slate-50 pt-2">
                <div className="space-y-2">
                  <Badge variant="warning">HR QUESTION</Badge>
                  <p className="font-bold text-slate-800 dark:text-white">"Tell me about yourself and your background."</p>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    <b>Sample Answer:</b> "I completed my secondary school and vocational electrical course in Telangana. I have strong house wiring skills and customer communications. I am looking to grow as an electrical apprentice locally."
                  </p>
                </div>
                <div className="space-y-2 pt-4">
                  <Badge variant="info">TECHNICAL QUESTION</Badge>
                  <p className="font-bold text-slate-800 dark:text-white">"What is the difference between single-phase and three-phase wiring?"</p>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    <b>Sample Answer:</b> "Single-phase has two wires (phase and neutral) operating at 230V, ideal for small household loads. Three-phase has four wires (three phases and one neutral) operating at 415V, ideal for heavy agricultural pumps or motors."
                  </p>
                </div>
              </div>
            </Card>
          </div>

        </div>
      )}

      {/* SECTION 2: MOCK SIMULATOR BOARD */}
      {activeTab === "mock" && !simulatorActive && (
        <Card className="p-6 border border-slate-100 text-center max-w-xl mx-auto space-y-6">
          <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto border border-emerald-100">
            <Play className="w-6 h-6" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-slate-850 dark:text-white">AI Mock Interview Simulator</h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-405 leading-relaxed">
              Answer simulated interview questions and get an automated scorecard checking keywords, explanation length, and structure. Unlocks matching model answers.
            </p>
          </div>

          <div className="flex gap-4 justify-center pt-2">
            <Button variant="outline" className="flex items-center text-xs" onClick={() => startSimulator("hr")}>
              HR Interview
            </Button>
            <Button variant="primary" className="bg-emerald-600 hover:bg-emerald-700 flex items-center text-xs" onClick={() => startSimulator("technical")}>
              Technical Interview
            </Button>
          </div>
        </Card>
      )}

      {activeTab === "mock" && simulatorActive && questions.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Question & Answer Box */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6 border border-slate-100 space-y-4">
              <div className="flex justify-between items-center text-xs font-semibold text-slate-450 border-b pb-2">
                <span className="capitalize">{activeCategory} Interview Session</span>
                <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
              </div>

              {/* Question text */}
              <div className="space-y-2">
                <p className="text-[10px] uppercase font-bold text-emerald-600 tracking-wider">Active Question</p>
                <h4 className="text-base sm:text-lg font-bold text-slate-800 dark:text-white">
                  {questions[currentQuestionIndex].question}
                </h4>
              </div>

              {/* Hints */}
              {questions[currentQuestionIndex].hints && (
                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl space-y-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Coach Hints</p>
                  <ul className="text-xs list-disc list-inside text-slate-650 space-y-0.5">
                    {questions[currentQuestionIndex].hints?.map((hint, i) => <li key={i}>{hint}</li>)}
                  </ul>
                </div>
              )}

              {/* Input Form */}
              <form onSubmit={handleSubmitAnswer} className="space-y-4 pt-2">
                <div className="flex flex-col space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700">Write Your Answer:</label>
                  <textarea
                    rows={4}
                    placeholder="Type your response here... (Write 2-3 lines explaining with details)"
                    value={userAnswer}
                    onChange={e => setUserAnswer(e.target.value)}
                    disabled={evaluationResult !== null}
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 disabled:opacity-50"
                  />
                </div>

                {!evaluationResult && (
                  <div className="flex justify-end">
                    <Button variant="primary" type="submit" isLoading={submittingAnswer} className="bg-emerald-600 hover:bg-emerald-700 flex items-center">
                      <Send className="w-4 h-4 mr-1.5" />
                      Submit Answer for Review
                    </Button>
                  </div>
                )}
              </form>
            </Card>
          </div>

          {/* Results Scorecard Box */}
          <div className="lg:col-span-1">
            {evaluationResult ? (
              <Card className="p-6 border border-slate-100 space-y-5 animate-in slide-in-from-right-4">
                <div className="text-center space-y-2">
                  <Badge variant={evaluationResult.score >= 7 ? "success" : "warning"}>SCORECARD</Badge>
                  <p className="text-4xl font-extrabold text-slate-800 dark:text-white">{evaluationResult.score}/10</p>
                  <p className="text-xs font-semibold text-slate-400">AI Evaluation Complete</p>
                </div>

                <div className="space-y-2 border-t pt-4">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Coach Feedback</p>
                  <p className="text-xs leading-relaxed text-slate-600">{evaluationResult.feedback}</p>
                </div>

                <div className="space-y-2 border-t pt-4">
                  <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Recommended Model Answer</p>
                  <p className="text-xs leading-relaxed text-slate-500 italic">"{evaluationResult.sampleAnswer}"</p>
                </div>

                <Button 
                  variant="primary" 
                  onClick={handleNextQuestion} 
                  fullWidth
                  className="bg-emerald-600 hover:bg-emerald-700 flex items-center justify-center mt-2"
                >
                  <span>Next Question</span>
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </Card>
            ) : (
              <Card className="p-6 border border-slate-100 text-center flex flex-col justify-center items-center h-full text-slate-400 space-y-2">
                <HelpCircle className="w-8 h-8 text-slate-300" />
                <p className="text-xs font-semibold">Write and submit your response to see your AI scorecard.</p>
              </Card>
            )}
          </div>

        </div>
      )}

    </div>
  );
};
