import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNotification } from "../context/NotificationContext";
import { STATES_LIST, QUALIFICATIONS } from "@empowerrural/utils";
import { Scheme } from "@empowerrural/types";
import { 
  Search, Award, DollarSign, Calendar, MapPin, 
  HelpCircle, CheckCircle, ArrowRight, UserCheck, X, Bookmark
} from "lucide-react";
import { Button, Card, Input, Badge, EmptyState, PageLoader } from "@empowerrural/ui";

export const GovSchemes: React.FC = () => {
  const { token, user } = useAuth();
  const { showToast } = useNotification();
  
  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);
  
  // Search & Category Filters
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSponsor, setSelectedSponsor] = useState("");

  // Eligibility wizard modal/form toggle
  const [showEligibilityForm, setShowEligibilityForm] = useState(false);
  const [age, setAge] = useState<number | "">(user?.age || 21);
  const [gender, setGender] = useState(user?.gender || "male");
  const [annualIncome, setAnnualIncome] = useState<number | "">(user?.income_annual || 90000);
  const [state, setState] = useState(user?.state || "");
  const [qualification, setQualification] = useState(user?.qualification || "");
  const [isFilteredByEligibility, setIsFilteredByEligibility] = useState(false);

  // Scheme Guide Detail Modal
  const [activeSchemeGuide, setActiveSchemeGuide] = useState<Scheme | null>(null);

  // Fetch Schemes
  const fetchSchemes = async (eligibilityParams?: any) => {
    setLoading(true);
    try {
      let url = "/api/schemes";
      let options: RequestInit = {};

      if (eligibilityParams) {
        url = "/api/schemes/check-eligibility";
        options = {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(eligibilityParams)
        };
      } else {
        const params = new URLSearchParams();
        if (selectedCategory) params.append("category", selectedCategory);
        if (selectedSponsor) params.append("sponsor", selectedSponsor);
        url += `?${params.toString()}`;
      }

      const res = await fetch(url, options);
      if (res.ok) {
        const data = await res.json();
        
        // Filter search locally if browse mode and search text set
        let finalData = data;
        if (!eligibilityParams && searchText) {
          const q = searchText.toLowerCase();
          finalData = data.filter((s: Scheme) => 
            s.name.toLowerCase().includes(q) || 
            s.description.toLowerCase().includes(q)
          );
        }
        setSchemes(finalData);
      } else {
        throw new Error("Failed scheme API fetch");
      }
    } catch (err) {
      console.warn("Failed to reach API server. Falling back to local schemes seed data.");
      // Fallback local seed dataset
      const seedSchemes: Scheme[] = [
        {
          id: "scheme-1",
          name: "Pradhan Mantri Kaushal Vikas Yojana (PMKVY)",
          sponsor: "central",
          category: "Skill Development",
          description: "A flagship skill training initiative providing free vocational courses with industry-standard certification to help youth secure better livelihood opportunities.",
          benefits: "100% sponsored course training fees, assessment coverage, transport allowance, and startup kits for selected courses.",
          eligibility: { min_age: 15, max_age: 45, qualifications: ["10th Pass", "12th Pass", "ITI Certificate"] },
          apply_steps: ["Visit PMKVY portal", "Register using Aadhaar card details", "Select nearest training partner center", "Enroll in desired course track"],
          link: "https://www.pmkvyofficial.org/",
          is_featured: true,
          created_at: new Date().toISOString()
        },
        {
          id: "scheme-2",
          name: "Rythu Bandhu Scheme",
          sponsor: "state",
          state: "Telangana",
          category: "Farming Support",
          description: "Telangana state financial support model assisting farmers with seed, fertilizer, and farm maintenance expenses twice every year.",
          benefits: "₹5,000 per acre per season (Kharif and Rabi) deposited directly into farmers bank accounts.",
          eligibility: { min_age: 18, max_age: 100, max_income: 1000000, states: ["Telangana"] },
          apply_steps: ["Submit Pattadar Passbook copies to local agricultural officer", "Submit bank account details", "Aadhaar verification verification"],
          link: "http://rythubandhu.telangana.gov.in/",
          is_featured: false,
          created_at: new Date().toISOString()
        },
        {
          id: "scheme-3",
          name: "Deen Dayal Upadhyaya Grameen Kaushalya Yojana (DDU-GKY)",
          sponsor: "central",
          category: "Skill Development",
          description: "Placement linked skill training program for rural poor youth to diversify income source for rural families.",
          benefits: "Free residential skill coaching, uniforms, books, tablet computers, and guaranteed job interviews.",
          eligibility: { min_age: 15, max_age: 35, qualifications: ["10th Pass", "12th Pass"] },
          apply_steps: ["Apply online via Kaushal Bharat portal", "Meet village volunteer at Gram Panchayat office", "Verify income cert and Aadhaar card"],
          link: "http://ddugky.gov.in/",
          is_featured: true,
          created_at: new Date().toISOString()
        }
      ];

      // Match locally
      let filtered = [...seedSchemes];
      if (eligibilityParams) {
        const { age: a, gender: g, income: inc, state: st, qualification: q } = eligibilityParams;
        filtered = filtered.filter(scheme => {
          const rules = scheme.eligibility;
          if (a && rules.min_age && a < rules.min_age) return false;
          if (a && rules.max_age && a > rules.max_age) return false;
          if (inc && rules.max_income && inc > rules.max_income) return false;
          if (st && rules.states && rules.states.length > 0 && !rules.states.includes(st)) return false;
          if (q && rules.qualifications && rules.qualifications.length > 0 && !rules.qualifications.includes(q)) return false;
          return true;
        });
      } else {
        if (searchText) {
          const q = searchText.toLowerCase();
          filtered = filtered.filter(s => s.name.toLowerCase().includes(q) || s.description.toLowerCase().includes(q));
        }
        if (selectedCategory) {
          filtered = filtered.filter(s => s.category === selectedCategory);
        }
        if (selectedSponsor) {
          filtered = filtered.filter(s => s.sponsor === selectedSponsor);
        }
      }
      setSchemes(filtered);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isFilteredByEligibility) {
      fetchSchemes();
    }
  }, [selectedCategory, selectedSponsor, searchText, isFilteredByEligibility]);

  // Run Smart Eligibility Checker
  const handleCheckEligibility = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      age: age ? Number(age) : undefined,
      gender,
      income: annualIncome ? Number(annualIncome) : undefined,
      state,
      qualification
    };
    setIsFilteredByEligibility(true);
    setShowEligibilityForm(false);
    fetchSchemes(payload);
    showToast("Eligibility filters applied successfully!", "success");
  };

  // Toggle Bookmark
  const handleBookmarkToggle = async (schemeId: string) => {
    if (!user) {
      showToast("Please sign in to bookmark schemes.", "warning");
      return;
    }
    const idx = bookmarkedIds.indexOf(schemeId);
    if (idx !== -1) {
      setBookmarkedIds(prev => prev.filter(id => id !== schemeId));
      showToast("Scheme removed from bookmarks.", "info");
    } else {
      setBookmarkedIds(prev => [...prev, schemeId]);
      showToast("Scheme bookmarked successfully!", "success");
    }

    try {
      await fetch(`/api/schemes/${schemeId}/bookmark`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (err) {
      console.warn("Bookmark request could not be sent to server.");
    }
  };

  const categories = ["Skill Development", "Farming Support", "Self Employment", "Education"];

  return (
    <div className="space-y-8">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-800 dark:text-white">Government Schemes</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Discover and verify welfare benefits, training grants, and loans sponsored by Central & State governments.</p>
        </div>
        <Button 
          variant="accent" 
          onClick={() => {
            if (isFilteredByEligibility) {
              setIsFilteredByEligibility(false);
              fetchSchemes();
            } else {
              setShowEligibilityForm(true);
            }
          }}
          className="bg-orange-500 hover:bg-orange-650 flex items-center shrink-0 border-0"
        >
          <UserCheck className="w-5 h-5 mr-1.5" />
          {isFilteredByEligibility ? "Show All Schemes" : "Check Smart Eligibility"}
        </Button>
      </div>

      {/* 1. ELIGIBILITY RESULTS RESET BAR */}
      {isFilteredByEligibility && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900 rounded-2xl flex items-center justify-between">
          <div className="flex items-center space-x-2 text-emerald-800 dark:text-emerald-400">
            <CheckCircle className="w-5 h-5 text-emerald-600" />
            <span className="text-sm font-semibold">Showing eligible schemes for {age}yo, earning ₹{annualIncome?.toLocaleString()}/yr in {state || "India"}.</span>
          </div>
          <button 
            onClick={() => {
              setIsFilteredByEligibility(false);
              fetchSchemes();
            }} 
            className="text-xs font-semibold text-emerald-700 dark:text-emerald-300 hover:underline"
          >
            Clear Filter
          </button>
        </div>
      )}

      {/* 2. BROWSE FILTERS (Hide when showing eligibility results to focus view) */}
      {!isFilteredByEligibility && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Input
            placeholder="Search schemes by name or keywords..."
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
            icon={<Search className="w-5 h-5 text-slate-400" />}
          />
          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            className="text-xs sm:text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-700 dark:text-slate-200"
          >
            <option value="">All Categories</option>
            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
          <select
            value={selectedSponsor}
            onChange={e => setSelectedSponsor(e.target.value)}
            className="text-xs sm:text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-700 dark:text-slate-200"
          >
            <option value="">All Sponsors</option>
            <option value="central">Central Govt</option>
            <option value="state">State Govt</option>
          </select>
        </div>
      )}

      {/* 3. SCHEMES GRID */}
      {loading ? (
        <PageLoader />
      ) : schemes.length === 0 ? (
        <EmptyState
          title="No Matching Schemes Found"
          description="We couldn't find any government schemes matching your profile specifications."
          actionText="Clear All Filters"
          onActionClick={() => {
            setIsFilteredByEligibility(false);
            setSearchText("");
            setSelectedCategory("");
            setSelectedSponsor("");
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {schemes.map(scheme => {
            const isBookmarked = bookmarkedIds.includes(scheme.id);
            return (
              <Card key={scheme.id} hoverEffect className="flex flex-col justify-between p-5 border border-slate-100">
                <div className="space-y-4">
                  {/* Title & Bookmark */}
                  <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-950/20 text-orange-600 flex items-center justify-center border border-orange-100">
                        <Award className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-800 dark:text-white leading-tight">{scheme.name}</h3>
                        <p className="text-xs text-slate-500 font-medium capitalize mt-0.5">{scheme.sponsor} Sponsored</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleBookmarkToggle(scheme.id)}
                      className={`p-1.5 rounded-lg border transition-colors ${
                        isBookmarked 
                          ? "bg-amber-50 border-amber-200 text-amber-600" 
                          : "border-slate-100 text-slate-400 hover:text-slate-600"
                      }`}
                    >
                      <Bookmark className="w-4 h-4 fill-current" />
                    </button>
                  </div>

                  {/* Category tag */}
                  <div>
                    <Badge variant="info">{scheme.category}</Badge>
                  </div>

                  {/* Summary */}
                  <p className="text-xs sm:text-sm text-slate-500 leading-relaxed line-clamp-3">
                    {scheme.description}
                  </p>

                  {/* Metadata benefits */}
                  <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl space-y-1">
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Welfare Benefits</p>
                    <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">{scheme.benefits}</p>
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-50 dark:border-slate-850 mt-4">
                  <Button variant="outline" size="sm" onClick={() => setActiveSchemeGuide(scheme)}>
                    How to Apply
                  </Button>
                  <a href={scheme.link} target="_blank" rel="noopener noreferrer">
                    <Button variant="primary" size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                      Official Portal
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  </a>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* 4. SMART ELIGIBILITY CHECKER MULTI-STEP MODAL */}
      {showEligibilityForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          {/* Backdrop */}
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowEligibilityForm(false)} />
          
          {/* Dialog Box */}
          <div className="relative w-full max-w-md bg-white dark:bg-slate-850 rounded-2xl p-6 shadow-xl border border-slate-100 dark:border-slate-800 flex flex-col transform animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-slate-850 dark:text-white flex items-center">
                <UserCheck className="w-5 h-5 text-emerald-600 mr-1.5" />
                Smart Eligibility Wizard
              </h3>
              <button onClick={() => setShowEligibilityForm(false)} className="p-1 rounded bg-slate-50 hover:bg-slate-150 text-slate-400 dark:bg-slate-800">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCheckEligibility} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Age"
                  type="number"
                  placeholder="23"
                  value={age}
                  onChange={e => setAge(e.target.value ? Number(e.target.value) : "")}
                  required
                />
                
                <div className="flex flex-col space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">Gender</label>
                  <select
                    value={gender}
                    onChange={e => setGender(e.target.value as any)}
                    className="bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-slate-700"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <Input
                label="Annual Family Income (₹)"
                type="number"
                placeholder="120000"
                value={annualIncome}
                onChange={e => setAnnualIncome(e.target.value ? Number(e.target.value) : "")}
                required
              />

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">Home State</label>
                  <select
                    value={state}
                    onChange={e => setState(e.target.value)}
                    required
                    className="bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-slate-700"
                  >
                    <option value="">Select State</option>
                    {STATES_LIST.map(st => <option key={st} value={st}>{st}</option>)}
                  </select>
                </div>

                <div className="flex flex-col space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">Qualification</label>
                  <select
                    value={qualification}
                    onChange={e => setQualification(e.target.value)}
                    required
                    className="bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-slate-700"
                  >
                    <option value="">Select Education</option>
                    {QUALIFICATIONS.map(q => <option key={q} value={q}>{q}</option>)}
                  </select>
                </div>
              </div>

              <div className="flex gap-3 justify-end pt-2">
                <Button variant="outline" type="button" onClick={() => setShowEligibilityForm(false)}>
                  Cancel
                </Button>
                <Button variant="primary" type="submit" className="bg-emerald-600 hover:bg-emerald-700">
                  Search Matching Schemes
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. SCHEME APPLICATION PROCESS DIALOG */}
      {activeSchemeGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          {/* Backdrop */}
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setActiveSchemeGuide(null)} />
          
          {/* Box */}
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-850 rounded-2xl p-6 shadow-xl border border-slate-100 dark:border-slate-800 flex flex-col transform animate-in zoom-in-95 duration-200 max-h-[85vh] overflow-hidden">
            <div className="flex justify-between items-start pb-4 border-b border-slate-100 dark:border-slate-700 mb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-800 dark:text-white leading-tight">{activeSchemeGuide.name}</h3>
                <p className="text-xs text-slate-500 capitalize mt-0.5">{activeSchemeGuide.sponsor} Government Program</p>
              </div>
              <button onClick={() => setActiveSchemeGuide(null)} className="p-1 rounded bg-slate-50 hover:bg-slate-150 text-slate-400 dark:bg-slate-800">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="overflow-y-auto flex-1 pr-1 space-y-4 text-sm text-slate-650 dark:text-slate-300">
              <div>
                <h4 className="font-bold text-slate-800 dark:text-white mb-1.5 flex items-center">
                  <CheckCircle className="w-4 h-4 text-emerald-600 mr-1.5" />
                  Welfare Benefits & Compensation
                </h4>
                <p className="bg-emerald-50/50 dark:bg-emerald-950/10 p-3 border border-emerald-100 rounded-xl font-medium text-emerald-900 dark:text-emerald-300">
                  {activeSchemeGuide.benefits}
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-800 dark:text-white mb-2 flex items-center">
                  <Calendar className="w-4 h-4 text-blue-600 mr-1.5" />
                  Step-by-Step Application Roadmap
                </h4>
                <ol className="relative border-l border-slate-200 dark:border-slate-700 ml-2.5 space-y-4">
                  {activeSchemeGuide.apply_steps.map((step, idx) => (
                    <li key={idx} className="mb-4 ml-6">
                      <span className="absolute -left-3.5 flex items-center justify-center w-7 h-7 bg-white dark:bg-slate-800 border-2 border-blue-500 rounded-full text-xs font-bold text-blue-600">
                        {idx + 1}
                      </span>
                      <p className="font-semibold text-slate-800 dark:text-white mt-0.5">{step}</p>
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            <div className="flex gap-3 justify-end pt-4 border-t border-slate-100 dark:border-slate-700 mt-4 bg-slate-50 dark:bg-slate-800/20 p-4 -m-6 rounded-b-2xl">
              <Button variant="outline" onClick={() => setActiveSchemeGuide(null)}>
                Close Guidelines
              </Button>
              <a href={activeSchemeGuide.link} target="_blank" rel="noopener noreferrer">
                <Button variant="primary" className="bg-emerald-600 hover:bg-emerald-700">
                  Apply on Govt Portal
                </Button>
              </a>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
