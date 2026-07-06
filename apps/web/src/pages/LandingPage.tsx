import React from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { 
  Briefcase, Award, GraduationCap, FileText, CheckCircle, 
  Users, Building2, ShieldCheck, Cpu, Sparkles, BookOpen, HelpCircle, ArrowRight
} from "lucide-react";
import { Button, Card, Badge } from "@empowerrural/ui";

export const LandingPage: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const statistics = [
    { value: "25,000+", label: "Students Connected", icon: <Users className="w-6 h-6 text-emerald-600" /> },
    { value: "1,500+", label: "Panchayats Registered", icon: <Building2 className="w-6 h-6 text-blue-600" /> },
    { value: "8,000+", label: "Verified Local Jobs", icon: <Briefcase className="w-6 h-6 text-orange-500" /> },
    { value: "300+", label: "Certified Courses", icon: <GraduationCap className="w-6 h-6 text-indigo-500" /> }
  ];

  const features = [
    {
      title: "Regional Jobs Portal",
      tagline: "Local Employment Hub",
      desc: "Connect directly with government, private, and remote job vacancies matching your 10th/12th/ITI credentials in your own district.",
      icon: <Briefcase className="w-7 h-7 text-emerald-600" />,
      path: "/jobs",
      actionText: "Explore Opportunities",
      borderColor: "hover:border-emerald-500/30",
      accent: "bg-emerald-500"
    },
    {
      title: "Government Schemes",
      tagline: "Smart Welfare Matcher",
      desc: "Calculate your eligibility for central & state skill subsidies, student grants, and agricultural welfare in 3 simple steps.",
      icon: <Award className="w-7 h-7 text-blue-600" />,
      path: "/schemes",
      actionText: "Verify Scheme Eligibility",
      borderColor: "hover:border-blue-500/30",
      accent: "bg-blue-600"
    },
    {
      title: "Vocational Training",
      tagline: "Certified Career Skills",
      desc: "Enroll in industry-standard certifications through SWAYAM and Skill India. Complete modules to earn printable certificates.",
      icon: <GraduationCap className="w-7 h-7 text-indigo-600" />,
      path: "/skills",
      actionText: "Start Upskilling",
      borderColor: "hover:border-indigo-500/30",
      accent: "bg-indigo-600"
    },
    {
      title: "AI Career Assistant",
      tagline: "Personal Guidance Coach",
      desc: "Get 24/7 coaching on career roadmaps, job suggestions, and scheme questions tailored to regional languages.",
      icon: <Cpu className="w-7 h-7 text-pink-600" />,
      path: "/ai",
      actionText: "Consult AI Coach",
      borderColor: "hover:border-pink-500/30",
      accent: "bg-pink-600"
    },
    {
      title: "ATS Resume Builder",
      tagline: "Professional Portfolio",
      desc: "Generate clean, print-ready PDF resumes that pass automated screening and highlight your local training credentials.",
      icon: <FileText className="w-7 h-7 text-orange-655" />,
      path: "/resume",
      actionText: "Build My Resume",
      borderColor: "hover:border-orange-500/30",
      accent: "bg-orange-500"
    },
    {
      title: "Interview Practice",
      tagline: "AI Mock Evaluations",
      desc: "Solve standard HR and technical questions. Receive immediate AI scores, custom hints, and structured answers.",
      icon: <HelpCircle className="w-7 h-7 text-teal-600" />,
      path: "/interview",
      actionText: "Practice mock interview",
      borderColor: "hover:border-teal-500/30",
      accent: "bg-teal-600"
    }
  ];

  return (
    <div className="space-y-24 py-4 overflow-hidden">
      
      {/* 1. HERO SECTION WITH FLOATING MOCKUPS */}
      <section className="relative rounded-[2.5rem] overflow-hidden bg-gradient-to-tr from-slate-950 via-slate-900 to-indigo-950 text-white p-8 sm:p-12 lg:p-16 shadow-2xl border border-slate-800">
        {/* Glow circles */}
        <div className="absolute top-0 right-0 w-[45rem] h-[45rem] bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-5 gap-12 items-center">
          {/* Hero Left Content */}
          <div className="lg:col-span-3 space-y-8">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-slate-900/80 border border-slate-700/80 text-emerald-400 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Connecting Rural India with Jobs</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-extrabold tracking-tight leading-[1.1] text-white">
              Build Your Career. <br />
              <span className="bg-gradient-to-r from-emerald-400 via-emerald-300 to-blue-400 bg-clip-text text-transparent">
                Find Government Schemes.
              </span> <br />
              Get Hired.
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-light max-w-xl">
              India's first unified digital career platform built specifically for rural youth. Access verified local jobs, certified skill workshops, and AI-powered interview coaches—even on slow networks.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <Button 
                variant="primary" 
                size="lg" 
                onClick={() => navigate("/jobs")} 
                className="bg-emerald-600 hover:bg-emerald-700 text-white border-0 px-8 py-4 rounded-2xl shadow-lg shadow-emerald-500/20 font-bold"
              >
                Find Local Jobs
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                onClick={() => navigate("/schemes")} 
                className="bg-slate-900/60 border-slate-750 hover:bg-slate-800 text-white px-8 py-4 rounded-2xl font-bold"
              >
                Check Scheme Eligibility
              </Button>
            </div>
          </div>

          {/* Hero Right Visual Mockup Panel (Wow Factor) */}
          <div className="lg:col-span-2 relative hidden md:block">
            {/* Visual background wrapper */}
            <div className="w-full h-96 bg-slate-900/40 rounded-3xl border border-slate-800/80 p-6 relative overflow-hidden backdrop-blur-md">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-emerald-500/5" />
              
              {/* Floating Card 1: Job Match */}
              <div className="absolute top-6 left-6 right-6 bg-slate-950/90 border border-slate-800 p-4 rounded-2xl shadow-xl flex items-center justify-between transform -rotate-1 hover:rotate-0 transition-transform duration-300">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-450 flex items-center justify-center border border-emerald-500/20">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-white">Data Entry Operator</h4>
                    <p className="text-[10px] text-slate-400">Panchayat Office • Visakhapatnam</p>
                  </div>
                </div>
                <Badge variant="success">MATCHED</Badge>
              </div>

              {/* Floating Card 2: Scheme Match */}
              <div className="absolute top-28 left-12 right-4 bg-slate-950/95 border border-slate-800 p-4 rounded-2xl shadow-xl flex items-center justify-between transform rotate-2 hover:rotate-0 transition-transform duration-300">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-450 flex items-center justify-center border border-orange-500/20">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-white">PMKVY Skill Training</h4>
                    <p className="text-[10px] text-slate-400">100% Sponsored Central Scheme</p>
                  </div>
                </div>
                <Badge variant="warning">ELIGIBLE</Badge>
              </div>

              {/* Floating Card 3: AI Resume Feedback */}
              <div className="absolute bottom-6 left-4 right-10 bg-slate-950/90 border border-slate-800 p-4 rounded-2xl shadow-xl flex items-start space-x-3 transform -rotate-1 hover:rotate-0 transition-transform duration-300">
                <div className="w-10 h-10 rounded-xl bg-pink-500/10 text-pink-450 flex items-center justify-center border border-pink-500/20 shrink-0">
                  <Cpu className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-white flex items-center">
                    AI Resume Coach 
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full ml-1.5 animate-ping" />
                  </h4>
                  <p className="text-[10px] text-slate-350 leading-relaxed mt-1">
                    "Your profile completeness is <b>85%</b>! Added <i>MS Excel</i> to match 3 active local listings."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. STATISTICS COUNTER SECTION */}
      <section className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 rounded-[2rem] p-8 sm:p-12 shadow-soft">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 divide-y lg:divide-y-0 lg:divide-x divide-slate-100 dark:divide-slate-850 text-center">
          {statistics.map((stat, index) => (
            <div key={index} className={`space-y-3 pt-8 lg:pt-0 ${index === 0 ? "pt-0" : ""}`}>
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-850 mb-2">
                {stat.icon}
              </div>
              <p className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">{stat.value}</p>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. CORE MODULE FEATURES GRID (320px tall, High Visual hierarchy) */}
      <section className="space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider">
            Why Choose EmpowerRural?
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
            Integrated Tools for Rural Upliftment
          </h2>
          <p className="text-slate-550 dark:text-slate-400 text-base leading-relaxed">
            Eliminating administrative barriers and skill mismatching by providing target services locally.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feat, index) => (
            <div 
              key={index} 
              onClick={() => navigate(feat.path)}
              className={`group cursor-pointer h-[340px] flex flex-col justify-between p-6 bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-3xl transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-slate-200/40 dark:hover:shadow-black/50 ${feat.borderColor} relative overflow-hidden`}
            >
              {/* Decorative accent top bar */}
              <div className={`absolute top-0 left-0 right-0 h-1.5 ${feat.accent} opacity-80`} />

              <div className="space-y-5">
                <div className="w-14 h-14 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-750 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-250">
                  {feat.icon}
                </div>
                <div className="space-y-2">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">{feat.tagline}</span>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white leading-tight">{feat.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-3">
                    {feat.desc}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-50 dark:border-slate-850 flex items-center justify-between text-xs font-bold text-slate-850 dark:text-white">
                <span className="group-hover:text-emerald-600 transition-colors">{feat.actionText}</span>
                <div className="w-7 h-7 rounded-full bg-slate-50 dark:bg-slate-800 border flex items-center justify-center group-hover:bg-slate-900 group-hover:text-white dark:group-hover:bg-emerald-600 transition-colors">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. PROBLEM & SOLUTION LAYOUT GRID */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-8">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-orange-50 dark:bg-orange-950/20 text-orange-700 dark:text-orange-400 text-xs font-bold uppercase tracking-wider">
            Bridging The Infrastructure Gap
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
            Designed for Indian Rural Reality
          </h2>
          <p className="text-slate-550 dark:text-slate-400 leading-relaxed text-sm sm:text-base">
            Rural youth face severe connectivity and guidance limitations. Traditional job platforms are designed for urban tech graduates. EmpowerRural addresses the actual local environment.
          </p>
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="w-6 h-6 rounded-full bg-rose-50 dark:bg-rose-950/20 text-rose-600 flex items-center justify-center mr-3.5 shrink-0 mt-0.5">
                <span className="text-xs font-bold">1</span>
              </div>
              <p className="text-xs sm:text-sm font-semibold text-slate-655 text-slate-600 dark:text-slate-300">
                <b>Zero Information Dissemination:</b> Citizens miss schemes because guidelines are buried in complex 100-page English files.
              </p>
            </div>
            <div className="flex items-start">
              <div className="w-6 h-6 rounded-full bg-rose-50 dark:bg-rose-950/20 text-rose-600 flex items-center justify-center mr-3.5 shrink-0 mt-0.5">
                <span className="text-xs font-bold">2</span>
              </div>
              <p className="text-xs sm:text-sm font-semibold text-slate-655 text-slate-600 dark:text-slate-300">
                <b>Low Internet Speeds:</b> Large web bundles crash on weak rural 3G networks.
              </p>
            </div>
            <div className="flex items-start">
              <div className="w-6 h-6 rounded-full bg-rose-50 dark:bg-rose-950/20 text-rose-600 flex items-center justify-center mr-3.5 shrink-0 mt-0.5">
                <span className="text-xs font-bold">3</span>
              </div>
              <p className="text-xs sm:text-sm font-semibold text-slate-655 text-slate-600 dark:text-slate-300">
                <b>No Resume Optimization:</b> Standard applications fail formatting rules for automatic applicant screening.
              </p>
            </div>
          </div>
        </div>

        {/* Dynamic solution panels */}
        <div className="bg-slate-100 dark:bg-slate-800/40 rounded-[2rem] p-6 sm:p-10 border border-slate-200/50 dark:border-slate-800 shadow-soft space-y-6">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">EmpowerRural Solution Framework</h3>
          
          <div className="space-y-4">
            <div className="flex items-start bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-850 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mr-4 shrink-0 dark:bg-emerald-950/20">
                <CheckCircle className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-slate-900 dark:text-white text-sm">Low-bandwidth PWA Support</p>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Caching headers support offline operations and ensure instant rendering on weak local connections.
                </p>
              </div>
            </div>

            <div className="flex items-start bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-850 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mr-4 shrink-0 dark:bg-blue-950/20">
                <CheckCircle className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-slate-900 dark:text-white text-sm">Gram Panchayat Integration</p>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Allows local village collectors and panchayat coordinators to post vacancies, matching youth with nearby work.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. TESTIMONIAL PANEL */}
      <section className="space-y-12">
        <div className="text-center max-w-xl mx-auto space-y-3">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Stories of Local Impact</h2>
          <p className="text-slate-655 dark:text-slate-400 text-sm sm:text-base">Real experiences from students who secured work using our tool.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="flex flex-col justify-between p-6 border border-slate-100 hover:shadow-lg transition-shadow">
            <p className="text-xs sm:text-sm italic text-slate-600 dark:text-slate-300 leading-relaxed">
              "As an ITI graduate in Kurnool, I had no idea how to structure my resume. Using the builder's local categories, I compiled mine in minutes and was hired as a network technician apprentice!"
            </p>
            <div className="flex items-center space-x-3 pt-4 border-t border-slate-50 dark:border-slate-800 mt-6">
              <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold text-sm">
                SK
              </div>
              <div>
                <p className="font-bold text-xs text-slate-900 dark:text-white">Sai Kumar</p>
                <p className="text-[10px] text-slate-400 font-semibold">ITI Apprentice, Andhra Pradesh</p>
              </div>
            </div>
          </Card>

          <Card className="flex flex-col justify-between p-6 border border-slate-100 hover:shadow-lg transition-shadow">
            <p className="text-xs sm:text-sm italic text-slate-600 dark:text-slate-300 leading-relaxed">
              "I wanted alternate income in my village. I completed the free Digital Literacy sheets module, checked eligibility rules, and applied for customer support. I now work from home earning ₹14,000/month."
            </p>
            <div className="flex items-center space-x-3 pt-4 border-t border-slate-50 dark:border-slate-800 mt-6">
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
                PL
              </div>
              <div>
                <p className="font-bold text-xs text-slate-900 dark:text-white">Praveena Laxmi</p>
                <p className="text-[10px] text-slate-400 font-semibold">Customer Assistant, Warangal</p>
              </div>
            </div>
          </Card>

          <Card className="flex flex-col justify-between p-6 border border-slate-100 hover:shadow-lg transition-shadow">
            <p className="text-xs sm:text-sm italic text-slate-600 dark:text-slate-300 leading-relaxed">
              "The schemes eligibility matching solved all my problems. I entered my family income and age, got suggested a central start-up subsidy, and was able to expand my organic dairy farm."
            </p>
            <div className="flex items-center space-x-3 pt-4 border-t border-slate-50 dark:border-slate-800 mt-6">
              <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold text-sm">
                RP
              </div>
              <div>
                <p className="font-bold text-xs text-slate-900 dark:text-white">Rajesh Patel</p>
                <p className="text-[10px] text-slate-400 font-semibold">Organic Dairy Farmer, Jaipur</p>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* 6. CALL TO ACTION SECTION */}
      <section className="bg-gradient-to-br from-slate-950 to-slate-900 text-white p-8 sm:p-16 rounded-[2.5rem] text-center space-y-6 shadow-2xl relative overflow-hidden border border-slate-850">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="relative z-10 max-w-xl mx-auto space-y-6">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Open Opportunities In Your Gram Panchayat</h2>
          <p className="text-slate-350 text-xs sm:text-sm leading-relaxed font-light">
            Start checking central schemes, learning industry skills, building ATS profiles, and training for interview mock questions. Free and open to all citizens.
          </p>
          <div className="pt-4">
            <Button 
              variant="accent" 
              size="lg" 
              onClick={() => navigate("/dashboard")} 
              className="px-10 py-4 bg-orange-500 hover:bg-orange-600 text-white border-0 font-bold rounded-2xl shadow-lg shadow-orange-500/10"
            >
              Get Started for Free
            </Button>
          </div>
        </div>
      </section>
      
    </div>
  );
};
