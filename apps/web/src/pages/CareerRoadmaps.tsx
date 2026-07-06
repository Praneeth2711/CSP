import React, { useState } from "react";
import { useNotification } from "../context/NotificationContext";
import { 
  Award, ClipboardList, DollarSign
} from "lucide-react";
import { Button, Card } from "@empowerrural/ui";

interface RoadmapStep {
  title: string;
  desc: string;
  skills: string[];
}

interface CareerStream {
  id: string;
  title: string;
  description: string;
  salary: string;
  outlook: string;
  steps: RoadmapStep[];
}

export const CareerRoadmaps: React.FC = () => {
  const { showToast } = useNotification();
  
  // Quiz State
  const [quizActive, setQuizActive] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [scores, setScores] = useState<{ [key: string]: number }>({
    engineering: 0,
    government: 0,
    agriculture: 0,
    teaching: 0,
    skill_based: 0
  });
  const [recommendedStream, setRecommendedStream] = useState<string | null>(null);

  // Active Stream Selection
  const [activeStreamId, setActiveStreamId] = useState("engineering");

  const quizQuestions = [
    {
      question: "Which of these tasks would you enjoy doing the most?",
      options: [
        { text: "Building website layouts or coding programs", scoreMap: { engineering: 3 } },
        { text: "Helping students understand subjects in a class", scoreMap: { teaching: 3 } },
        { text: "Designing soil irrigation plans for organic crops", scoreMap: { agriculture: 3 } },
        { text: "Managing local files in a government office", scoreMap: { government: 3 } },
        { text: "Installing house wires, fuse systems, or meters", scoreMap: { skill_based: 3 } }
      ]
    },
    {
      question: "How do you prefer to resolve complex issues?",
      options: [
        { text: "Use math, computer logic, or write algorithms", scoreMap: { engineering: 3 } },
        { text: "Explain concepts clearly and work with others", scoreMap: { teaching: 2, government: 1 } },
        { text: "Use mechanical tools to build or fix items", scoreMap: { skill_based: 3 } },
        { text: "Observe natural crop cycles and farming patterns", scoreMap: { agriculture: 3 } }
      ]
    },
    {
      question: "What is your main professional interest?",
      options: [
        { text: "Working in IT services or tech companies", scoreMap: { engineering: 3 } },
        { text: "Assisting rural citizens and managing government welfare hubs", scoreMap: { government: 3 } },
        { text: "Improving local crop production and harvesting", scoreMap: { agriculture: 3 } },
        { text: "Starting a local tailoring or electrical service store", scoreMap: { skill_based: 3 } }
      ]
    }
  ];

  const careerRoadmaps: { [key: string]: CareerStream } = {
    engineering: {
      id: "engineering",
      title: "Software & Digital Technology",
      description: "Build a career as a web developer, data analyst, or python programmer working remotely for top startups.",
      salary: "₹3.5 - ₹8.0 Lakh / Year",
      outlook: "High Growth / High Remote Availability",
      steps: [
        { title: "Step 1: Digital Literacy Foundations", desc: "Master basic typing, office suite (MS Excel), and internet search tools.", skills: ["MS Excel", "Fast Typing", "Web Navigation"] },
        { title: "Step 2: Frontend Coding Basics", desc: "Learn HTML, CSS, and basic Javascript via free NPTEL or YouTube tutorials.", skills: ["HTML5", "CSS3", "JavaScript"] },
        { title: "Step 3: Relational Databases & Frameworks", desc: "Build complete dynamic web applications using React and SQLite/Postgres.", skills: ["React.js", "SQL Databases", "Git Version Control"] },
        { title: "Step 4: Remote Placement Preparation", desc: "Create a Github portfolio of 3 projects and practice mock technical interviews.", skills: ["Portfolio Building", "Resume Optimization"] }
      ]
    },
    government: {
      id: "government",
      title: "Public Administration & Central Services",
      description: "Secure local government jobs like Village Volunteer, Gram Panchayat Clerk, or SSC Railway support staff.",
      salary: "₹2.2 - ₹4.5 Lakh / Year",
      outlook: "Extremely Stable / District Centered",
      steps: [
        { title: "Step 1: Core Graduation Degree", desc: "Complete any basic graduate degree (BA, BSc, BCom) from recognized universities.", skills: ["Educational Prerequisite"] },
        { title: "Step 2: Competitive Entrance Exam Prep", desc: "Study reasoning, arithmetic, general knowledge, and regional languages.", skills: ["Quantitative Aptitude", "General Knowledge"] },
        { title: "Step 3: Mock Testing & Speed", desc: "Solve previous year exam papers under strict time limits.", skills: ["Time Management", "Speed Typing"] },
        { title: "Step 4: Government Job Application", desc: "Keep track of official portal deadlines and apply through District offices.", skills: ["Documentation Checklist"] }
      ]
    },
    agriculture: {
      id: "agriculture",
      title: "Smart Agriculture & Agrotech consulting",
      description: "Deploy modern organic farming, soil analysis, drip irrigation systems, and supply chain marketing.",
      salary: "₹1.8 - ₹3.6 Lakh / Year (Variable)",
      outlook: "Independent / Sustainable Growth",
      steps: [
        { title: "Step 1: Soil & Crop Diagnostics", desc: "Test soil quality and learn how organic compost improves yield over chemicals.", skills: ["Soil Diagnostics", "Organic Manure Crafting"] },
        { title: "Step 2: Micro-Irrigation Setup", desc: "Implement cost-efficient drip irrigation systems to preserve water resources.", skills: ["Drip Irrigation", "Farming Hardware Setup"] },
        { title: "Step 3: Agrotech Consulting & Machinery", desc: "Use mobile weather apps and tractor scheduling platforms to decrease manual labor.", skills: ["Weather API Apps", "Machinery Sourcing"] },
        { title: "Step 4: E-Market Direct Sales", desc: "Sell organic harvests directly to city wholesalers using WhatsApp Business and e-NAM.", skills: ["Digital Sales", "B2B Marketing"] }
      ]
    },
    teaching: {
      id: "teaching",
      title: "Primary & Secondary School Teaching",
      description: "Become a primary school teacher, NGO training coach, or private tutor in your regional district.",
      salary: "₹2.0 - ₹4.0 Lakh / Year",
      outlook: "Steady Demand / High Community Impact",
      steps: [
        { title: "Step 1: Undergrad / Teacher Education", desc: "Complete secondary school and seek a Bachelor of Education (B.Ed) or Diploma.", skills: ["Pedagogical Theory"] },
        { title: "Step 2: TET Qualification Exams", desc: "Study syllabus and pass the State Teacher Eligibility Test (TET) boards.", skills: ["Curriculum Structuring"] },
        { title: "Step 3: Classroom Interactive Skills", desc: "Master digital whiteboard operations and learn child psychology.", skills: ["Public Speaking", "Instruction Design"] },
        { title: "Step 4: Recruitment & Counseling", desc: "Attend local district recruitment drives and join local schools.", skills: ["Patience", "Classroom Administration"] }
      ]
    },
    skill_based: {
      id: "skill_based",
      title: "Vocational Entrepreneurship",
      description: "Launch your own regional service workshop: Domestic Electrician, Plumber, Tailor, or Mobile Repair Specialist.",
      salary: "₹2.4 - ₹5.0 Lakh / Year (Self-Employed)",
      outlook: "High Local Demand / Entrepreneurial",
      steps: [
        { title: "Step 1: ITI Trade Certification", desc: "Enroll in a 6-month trade program (Electrician/Plumbing) at nearby ITIs or PMKVY centers.", skills: ["Trade Hardware Operations"] },
        { title: "Step 2: Apprentice Field Training", desc: "Work as an assistant to senior village technicians to learn diagnostic tricks.", skills: ["Client Handholding", "Hands-on Troubleshooting"] },
        { title: "Step 3: State Licensing board exam", desc: "Apply for a certified electrical wiring license from the State Power Board.", skills: ["Safety Code Regulatory Compliance"] },
        { title: "Step 4: Direct Launch Workshop", desc: "Register your shop under MSME schemes and acquire micro-loans for machinery.", skills: ["Business Finance", "MSME Registration"] }
      ]
    }
  };

  const activeRoadmap = careerRoadmaps[activeStreamId];

  // Handle Quiz Answer selection
  const handleAnswerClick = (scoreMap: { [key: string]: number }) => {
    // Add up scores
    setScores(prev => {
      const updated = { ...prev };
      Object.keys(scoreMap).forEach(key => {
        updated[key] = (updated[key] || 0) + scoreMap[key];
      });
      return updated;
    });

    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      // Calculate max stream
      let bestStream = "engineering";
      let maxScore = -1;
      
      const finalScores = { ...scores };
      Object.keys(scoreMap).forEach(key => {
        finalScores[key] = (finalScores[key] || 0) + scoreMap[key];
      });

      Object.keys(finalScores).forEach(key => {
        if (finalScores[key] > maxScore) {
          maxScore = finalScores[key];
          bestStream = key;
        }
      });

      setRecommendedStream(bestStream);
      setActiveStreamId(bestStream);
      setQuizActive(false);
      showToast("Career assessment complete! Recommended roadmap unlocked.", "success");
    }
  };

  const startQuiz = () => {
    setScores({ engineering: 0, government: 0, agriculture: 0, teaching: 0, skill_based: 0 });
    setCurrentQuestion(0);
    setRecommendedStream(null);
    setQuizActive(true);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-slate-800 dark:text-white">Career roadmaps & Guidance</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Not sure which career path to choose? Take our interactive quiz to discover your interests, or browse the roadmaps below.</p>
      </div>

      {/* 1. QUIZ BOARD */}
      <Card className="bg-gradient-to-tr from-emerald-50 to-blue-50/50 dark:from-slate-800 dark:to-slate-850 border border-emerald-100 p-6 sm:p-8">
        {!quizActive && !recommendedStream ? (
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-3">
              <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center">
                <ClipboardList className="w-5 h-5 text-emerald-600 mr-2" />
                Find Your Perfect Career Path
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-350 leading-relaxed max-w-xl">
                Take a quick 3-question career assessment quiz. We will evaluate your choices and recommend the ideal stream (IT, Public Sector, Agriculture, Teaching, or Trade) with a detailed step-by-step training roadmap.
              </p>
            </div>
            <Button onClick={startQuiz} className="bg-emerald-600 hover:bg-emerald-700 whitespace-nowrap">
              Start Career Quiz
            </Button>
          </div>
        ) : quizActive ? (
          <div className="space-y-6">
            {/* Progress indicator */}
            <div className="flex justify-between items-center text-xs font-semibold text-slate-400">
              <span>Question {currentQuestion + 1} of {quizQuestions.length}</span>
              <div className="w-24 h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-emerald-600 transition-all duration-200" 
                  style={{ width: `${((currentQuestion + 1) / quizQuestions.length) * 100}%` }}
                />
              </div>
            </div>

            <h3 className="text-base sm:text-lg font-bold text-slate-800 dark:text-white">
              {quizQuestions[currentQuestion].question}
            </h3>

            <div className="flex flex-col space-y-3">
              {quizQuestions[currentQuestion].options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAnswerClick(opt.scoreMap as unknown as Record<string, number>)}
                  className="text-left w-full p-4 bg-white hover:bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-850 hover:border-emerald-500 rounded-2xl text-xs sm:text-sm font-semibold transition-all hover:translate-x-1"
                >
                  {opt.text}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-3">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 animate-bounce">
                Quiz Result
              </span>
              <h2 className="text-xl font-bold text-slate-850 dark:text-white">
                Recommended stream: <span className="text-emerald-600 dark:text-emerald-400">{careerRoadmaps[recommendedStream!].title}</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-xl">
                Based on your interests, we recommend pursuing {careerRoadmaps[recommendedStream!].title}. We have unlocked the roadmap timeline below for you to follow.
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={startQuiz}>Retake Quiz</Button>
              <Button variant="primary" onClick={() => { setRecommendedStream(null); }} className="bg-emerald-600 hover:bg-emerald-700">View Roadmap</Button>
            </div>
          </div>
        )}
      </Card>

      {/* 2. CAREER PATH SELECTION SWITCHER */}
      <div className="flex flex-wrap gap-2 border-b border-slate-100 dark:border-slate-850 pb-4">
        {Object.values(careerRoadmaps).map(stream => (
          <button
            key={stream.id}
            onClick={() => setActiveStreamId(stream.id)}
            className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold border transition-all ${
              activeStreamId === stream.id
                ? "bg-slate-900 border-slate-900 text-white dark:bg-emerald-600 dark:border-emerald-600 dark:text-white"
                : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-350"
            }`}
          >
            {stream.title}
          </button>
        ))}
      </div>

      {/* 3. ROADMAP DETAIL VIEW */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Stream Summary Card */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="p-6 border border-slate-100 space-y-5">
            <div className="space-y-2">
              <h2 className="text-xl font-extrabold text-slate-800 dark:text-white">{activeRoadmap.title}</h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{activeRoadmap.description}</p>
            </div>

            <div className="space-y-3.5 pt-4 border-t border-slate-50">
              <div className="flex items-center space-x-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
                <DollarSign className="w-4 h-4 text-emerald-600" />
                <span>Salary Outlook: <b>{activeRoadmap.salary}</b></span>
              </div>
              <div className="flex items-center space-x-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
                <Award className="w-4 h-4 text-blue-600" />
                <span>Outlook: <b>{activeRoadmap.outlook}</b></span>
              </div>
            </div>
          </Card>
        </div>

        {/* Timeline roadmap Steps */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6 border border-slate-100">
            <h3 className="text-lg font-bold text-slate-850 dark:text-white mb-6">Execution Milestones</h3>
            
            <div className="relative border-l border-slate-200 dark:border-slate-700 ml-4 space-y-8">
              {activeRoadmap.steps.map((step, index) => (
                <div key={index} className="relative pl-8">
                  {/* Step bullet indicator */}
                  <span className="absolute -left-4 top-1.5 flex items-center justify-center w-8 h-8 rounded-full border-2 border-emerald-600 bg-white dark:bg-slate-900 text-xs font-bold text-emerald-600">
                    {index + 1}
                  </span>

                  <div className="space-y-2">
                    <h4 className="text-base font-bold text-slate-800 dark:text-white">{step.title}</h4>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-450 leading-relaxed">{step.desc}</p>
                    
                    {/* Skills list tags */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {step.skills.map((skill, sIdx) => (
                        <span key={sIdx} className="inline-flex items-center px-2 py-0.5 rounded-lg text-[10px] font-bold bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

      </div>

    </div>
  );
};
