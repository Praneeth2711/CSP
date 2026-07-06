import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNotification } from "../context/NotificationContext";
import { 
  Cpu, Send, User, Sparkles, HelpCircle, 
  Award, FileText, GraduationCap, X 
} from "lucide-react";
import { Button, Card, Input } from "@empowerrural/ui";

interface Message {
  sender: "user" | "ai";
  text: string;
}

interface AIAgent {
  id: string;
  name: string;
  role: string;
  welcomeMsg: string;
  icon: React.ReactNode;
}

export const AIAssistant: React.FC = () => {
  const { token, user } = useAuth();
  const { showToast } = useNotification();

  const [activeAgentId, setActiveAgentId] = useState("coach");
  const [messages, setMessages] = useState<Message[]>([
    { sender: "ai", text: "Namaste! I am your EmpowerRural Career Coach. Ask me how to discover local jobs, NPTEL courses, or check government scheme criteria!" }
  ]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  const agents: AIAgent[] = [
    { 
      id: "coach", 
      name: "Career Coach", 
      role: "Guidance Advisor", 
      welcomeMsg: "Namaste! I am your Career Coach. Let me know your educational qualifications and interests, and I will recommend career pathways or training links.",
      icon: <Sparkles className="w-4 h-4 text-emerald-650" /> 
    },
    { 
      id: "resume", 
      name: "Resume Analyst", 
      role: "ATS Optimizer", 
      welcomeMsg: "Hello! Paste your resume summary here or ask me about ATS optimization, formatting rules, and action verbs.",
      icon: <FileText className="w-4 h-4 text-blue-650" /> 
    },
    { 
      id: "interview", 
      name: "Interview Coach", 
      role: "Mock Evaluator", 
      welcomeMsg: "Ready to practice? Ask me about general HR questions, technical topics like Excel, or tips on presentation and speech.",
      icon: <HelpCircle className="w-4 h-4 text-orange-655" /> 
    },
    { 
      id: "scheme", 
      name: "Scheme Assistant", 
      role: "Welfare Matcher", 
      welcomeMsg: "I can check eligibility rules. Tell me your age, state, and qualification, and I will find matching PMKVY or state subsidies.",
      icon: <Award className="w-4 h-4 text-indigo-650" /> 
    },
    { 
      id: "advisor", 
      name: "Learning Advisor", 
      role: "Course Recommender", 
      welcomeMsg: "Let me suggest online modules! Ask me about certified training programs on SWAYAM, Skill India, and YouTube.",
      icon: <GraduationCap className="w-4 h-4 text-pink-650" /> 
    }
  ];

  const activeAgent = agents.find(a => a.id === activeAgentId) || agents[0];

  // Auto-scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Handle Switching Agent
  const handleAgentChange = (agentId: string) => {
    setActiveAgentId(agentId);
    const target = agents.find(a => a.id === agentId);
    if (target) {
      setMessages([{ sender: "ai", text: target.welcomeMsg }]);
    }
  };

  // Submit User Message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMsg = inputText.trim();
    setMessages(prev => [...prev, { sender: "user", text: userMsg }]);
    setInputText("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          message: userMsg,
          module: activeAgentId,
          context: user ? {
            age: user.age,
            gender: user.gender,
            income: user.income_annual,
            state: user.state,
            qualification: user.qualification,
            skills: user.skills
          } : {}
        })
      });

      if (res.ok) {
        const data = await res.json();
        setMessages(prev => [...prev, { sender: "ai", text: data.reply }]);
      } else {
        throw new Error("Chat API failed");
      }
    } catch (err) {
      // Local fallback logic
      setTimeout(() => {
        let fallbackReply = "I am currently running in offline mock mode. Feel free to ask about jobs, courses, and resumes, and I will assist you using local guidance rules!";
        const lower = userMsg.toLowerCase();
        
        if (activeAgentId === "resume") {
          fallbackReply = "📝 **Resume Tip:** Ensure your contact details (Mobile +91 and Email) are clearly listed at the top. Single-column layouts are much more ATS-friendly.";
        } else if (activeAgentId === "interview") {
          fallbackReply = "🎤 **Mock Tip:** When asked 'What is your strength?', use the STAR method: describe a Situation, Task, Action you took, and the final Result.";
        } else if (activeAgentId === "scheme") {
          fallbackReply = "💡 **Scheme Matcher:** Under DDU-GKY, rural youth between 15-35 years of age are eligible for 100% free residential skill training programs.";
        }

        setMessages(prev => [...prev, { sender: "ai", text: fallbackReply }]);
      }, 800);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[72vh] overflow-hidden">
      
      {/* 1. LEFT SIDEBAR: AGENTS SELECTOR */}
      <div className="lg:col-span-1 hidden lg:flex flex-col space-y-2 border-r pr-4 overflow-y-auto">
        <h3 className="font-extrabold text-slate-400 uppercase tracking-wider text-xs px-2 mb-2">Specialist AI Coaches</h3>
        {agents.map(agent => (
          <button
            key={agent.id}
            onClick={() => handleAgentChange(agent.id)}
            className={`flex items-start text-left w-full p-3 rounded-2xl border transition-all ${
              activeAgentId === agent.id
                ? "bg-slate-900 border-slate-900 text-white dark:bg-emerald-600 dark:border-emerald-600"
                : "bg-white border-slate-100 text-slate-655 hover:bg-slate-50 hover:-translate-y-0.5 shadow-sm shadow-slate-50/50"
            }`}
          >
            <div className="mr-3 mt-1 p-2 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-600 shrink-0">
              {agent.icon}
            </div>
            <div>
              <p className="font-bold text-sm leading-none">{agent.name}</p>
              <p className="text-[10px] text-slate-400 mt-1 font-semibold">{agent.role}</p>
            </div>
          </button>
        ))}
      </div>

      {/* 2. CHAT AREA CONTAINER */}
      <Card className="lg:col-span-3 flex flex-col justify-between h-full p-4 sm:p-5 border border-slate-100 max-h-full overflow-hidden">
        
        {/* Active agent detail header */}
        <div className="flex justify-between items-center pb-3 border-b mb-3">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center border">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-bold text-slate-850 dark:text-white leading-none">{activeAgent.name}</h4>
              <p className="text-[10px] text-slate-450 mt-1 font-semibold">Active Portal Helper</p>
            </div>
          </div>
        </div>

        {/* Message bubble stream log */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1 py-2">
          {messages.map((msg, index) => {
            const isAi = msg.sender === "ai";
            return (
              <div 
                key={index} 
                className={`flex items-start max-w-[85%] ${isAi ? "mr-auto" : "ml-auto flex-row-reverse"}`}
              >
                {/* Bubble avatar */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                  isAi ? "bg-emerald-550/10 text-emerald-700 mr-2.5" : "bg-blue-600 text-white ml-2.5"
                }`}>
                  {isAi ? <Cpu className="w-4 h-4 text-emerald-600" /> : <User className="w-4 h-4" />}
                </div>

                {/* Bubble body text */}
                <div className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-line ${
                  isAi 
                    ? "bg-slate-50 text-slate-700 border border-slate-100 dark:bg-slate-800 dark:text-slate-200" 
                    : "bg-blue-600 text-white"
                }`}>
                  {msg.text}
                </div>
              </div>
            );
          })}

          {/* Typing shimmer loader bubble */}
          {loading && (
            <div className="flex items-start mr-auto max-w-[80%]">
              <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center mr-2.5">
                <Cpu className="w-4 h-4 text-emerald-600 animate-pulse" />
              </div>
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center space-x-1.5 py-4">
                <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input Bar Form */}
        <form onSubmit={handleSendMessage} className="flex gap-2 pt-3 border-t mt-3">
          <Input
            placeholder={`Send message to ${activeAgent.name}...`}
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            disabled={loading}
            className="flex-1"
          />
          <Button variant="primary" type="submit" disabled={loading} className="px-5 bg-emerald-600 hover:bg-emerald-700">
            <Send className="w-4 h-4" />
          </Button>
        </form>

      </Card>
      
    </div>
  );
};
