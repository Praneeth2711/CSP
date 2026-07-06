import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNotification } from "../context/NotificationContext";
import { 
  User, CheckCircle, Briefcase, Award, GraduationCap, 
  Settings, Bookmark, Calendar, ArrowRight, ShieldCheck, Square, CheckSquare 
} from "lucide-react";
import { Button, Card, Badge, PageLoader, Input } from "@empowerrural/ui";
import { Job, Course, Scheme } from "@empowerrural/types";

interface DashboardSummary {
  profileCompleteness: number;
  stats: {
    savedJobsCount: number;
    savedCoursesCount: number;
    savedSchemesCount: number;
    applicationsCount: number;
    coursesInProgress: number;
    notificationsCount: number;
  };
  recommendations: {
    jobs: Job[];
    courses: Course[];
    schemes: Scheme[];
  };
}

export const Dashboard: React.FC = () => {
  const { token, user, updateProfile } = useAuth();
  const { showToast } = useNotification();
  
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);

  // Edit profile state
  const [editingProfile, setEditingProfile] = useState(false);
  const [fullName, setFullName] = useState(user?.full_name || "");
  const [mobile, setMobile] = useState(user?.mobile || "");
  const [bio, setBio] = useState(user?.bio || "");

  // Weekly goals state
  const [weeklyGoals, setWeeklyGoals] = useState([
    { id: 1, text: "Build Resume Profile in Resume Builder", done: user?.resume_completed || false },
    { id: 2, text: "Practice Mock Interview and score 7+", done: false },
    { id: 3, text: "Enroll in 1 skill development course", done: false },
    { id: 4, text: "Check central schemes eligibility", done: true }
  ]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/dashboard/summary", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setSummary(data);
      } else {
        throw new Error("Failed fetching summary");
      }
    } catch (err) {
      console.warn("Failed to reach API server. Rendering fallback offline dashboard mock data.");
      // Fallback dashboard layout
      setSummary({
        profileCompleteness: user?.resume_completed ? 85 : 55,
        stats: {
          savedJobsCount: 2,
          savedCoursesCount: 1,
          savedSchemesCount: 3,
          applicationsCount: 1,
          coursesInProgress: 1,
          notificationsCount: 2
        },
        recommendations: {
          jobs: [
            {
              id: "job-1",
              title: "Data Entry Operator",
              company: "District Collectorate Office",
              description: "Hiring administrative assistant to update regional land registers.",
              requirements: ["Typing speed > 35 WPM"],
              benefits: ["Health care", "Conveyance"],
              salary_range: "₹18,000 - ₹22,000 / Month",
              location_type: "on_site",
              type: "government",
              state: "Andhra Pradesh",
              district: "Visakhapatnam",
              qualification: "12th Pass",
              category: "Data Entry",
              is_featured: true,
              created_at: new Date().toISOString()
            }
          ],
          courses: [
            {
              id: "course-1",
              title: "Digital Literacy & Basic Office Suite",
              provider: "Skill India",
              category: "Digital Marketing",
              type: "online",
              price_type: "free",
              duration: "4 weeks",
              url: "https://www.skillindia.gov.in/",
              description: "Basic spreadsheet operations, email setup and digital payments.",
              certified: true,
              is_trending: true,
              created_at: new Date().toISOString()
            }
          ],
          schemes: [
            {
              id: "scheme-1",
              name: "Pradhan Mantri Kaushal Vikas Yojana (PMKVY)",
              sponsor: "central",
              category: "Skill Development",
              description: "A flagship skill training initiative providing free vocational courses with industry-standard certification.",
              benefits: "100% sponsored training course fees and tools kits.",
              eligibility: { min_age: 15, max_age: 45 },
              apply_steps: ["Register online"],
              link: "https://pmkvyofficial.org",
              is_featured: true,
              created_at: new Date().toISOString()
            }
          ]
        }
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  const toggleGoal = (goalId: number) => {
    setWeeklyGoals(prev => prev.map(g => g.id === goalId ? { ...g, done: !g.done } : g));
  };

  // Submit Profile Changes
  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfile({
        full_name: fullName,
        mobile,
        bio
      });
      setEditingProfile(false);
      showToast("Profile details updated successfully!", "success");
    } catch (err) {
      showToast("Failed to save profile changes.", "error");
    }
  };

  if (loading || !summary) {
    return <PageLoader />;
  }

  return (
    <div className="space-y-8">
      {/* 1. WELCOME BANNER WITH COMPLETENESS BAR */}
      <Card className="bg-gradient-to-br from-emerald-600 to-emerald-800 text-white p-6 sm:p-8 border-0 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          <div className="md:col-span-2 space-y-3">
            <h2 className="text-2xl font-bold">Welcome back, {user?.full_name || "Ramesh Kumar"}!</h2>
            <p className="text-sm text-emerald-100 font-light leading-relaxed max-w-xl">
              Track your learning, check government schemes, apply for local jobs, and prepare for interviews from your unified center.
            </p>
          </div>
          
          {/* Completeness gauge */}
          <div className="bg-white/10 p-4 border border-white/15 rounded-2xl space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <span>Profile Completeness</span>
              <span>{summary.profileCompleteness}%</span>
            </div>
            <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
              <div 
                className="h-full bg-orange-400 transition-all duration-300" 
                style={{ width: `${summary.profileCompleteness}%` }}
              />
            </div>
            {summary.profileCompleteness < 100 && (
              <p className="text-[10px] text-orange-200 font-medium">Add skills and build a resume to unlock 100% suggestions.</p>
            )}
          </div>
        </div>
      </Card>

      {/* 2. STATS ROW */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 flex items-center space-x-4 border border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center dark:bg-blue-950/20">
            <Briefcase className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xl font-extrabold text-slate-800 dark:text-white">{summary.stats.applicationsCount}</p>
            <p className="text-[11px] font-semibold text-slate-400">Applications Sent</p>
          </div>
        </Card>
        <Card className="p-4 flex items-center space-x-4 border border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center dark:bg-emerald-950/20">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xl font-extrabold text-slate-800 dark:text-white">{summary.stats.coursesInProgress}</p>
            <p className="text-[11px] font-semibold text-slate-400">Courses Studying</p>
          </div>
        </Card>
        <Card className="p-4 flex items-center space-x-4 border border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center dark:bg-orange-950/20">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xl font-extrabold text-slate-800 dark:text-white">{summary.stats.savedSchemesCount}</p>
            <p className="text-[11px] font-semibold text-slate-400">Saved Schemes</p>
          </div>
        </Card>
        <Card className="p-4 flex items-center space-x-4 border border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-600 flex items-center justify-center dark:bg-slate-800/40">
            <Bookmark className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xl font-extrabold text-slate-800 dark:text-white">{summary.stats.savedJobsCount}</p>
            <p className="text-[11px] font-semibold text-slate-400">Bookmarked Jobs</p>
          </div>
        </Card>
      </div>

      {/* 3. DUAL GRID: PROFILES EDIT vs WEEKLY GOALS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Profile Card */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="p-6 border border-slate-100 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b">
              <h3 className="font-bold text-slate-800 dark:text-white flex items-center">
                <User className="w-4 h-4 mr-1.5 text-emerald-600" />
                Regional Profile
              </h3>
              <button 
                onClick={() => { setEditingProfile(!editingProfile); setFullName(user?.full_name || ""); setMobile(user?.mobile || ""); }} 
                className="text-[11px] font-bold text-emerald-600 hover:underline flex items-center"
              >
                <Settings className="w-3.5 h-3.5 mr-0.5" />
                Edit
              </button>
            </div>

            {!editingProfile ? (
              <div className="space-y-3.5 text-xs font-semibold text-slate-655 text-slate-600">
                <p>Name: <span className="text-slate-850 font-bold dark:text-white">{user?.full_name}</span></p>
                <p>Mobile: <span className="text-slate-850 font-bold dark:text-white">{user?.mobile || "Not Linked"}</span></p>
                <p>Education: <span className="text-slate-850 font-bold dark:text-white">{user?.qualification || "Not Checked"}</span></p>
                <p>Location: <span className="text-slate-850 font-bold dark:text-white">{user?.district}, {user?.state}</span></p>
                {user?.bio && <p className="italic font-light leading-relaxed border-l-2 pl-2">"{user.bio}"</p>}
              </div>
            ) : (
              <form onSubmit={handleProfileSubmit} className="space-y-3.5">
                <Input
                  label="Full Name"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  required
                />
                <Input
                  label="Mobile Number"
                  value={mobile}
                  onChange={e => setMobile(e.target.value)}
                />
                <div className="flex flex-col space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500">Short Bio</label>
                  <textarea
                    rows={2}
                    value={bio}
                    onChange={e => setBio(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-700"
                  />
                </div>
                <div className="flex gap-2 justify-end pt-1">
                  <Button variant="outline" size="sm" type="button" onClick={() => setEditingProfile(false)}>Cancel</Button>
                  <Button variant="primary" size="sm" type="submit" className="bg-emerald-600 hover:bg-emerald-700">Save</Button>
                </div>
              </form>
            )}
          </Card>
        </div>

        {/* Weekly Goals Card */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6 border border-slate-100">
            <h3 className="text-lg font-bold text-slate-850 dark:text-white mb-4">Weekly Career Milestones</h3>
            <div className="space-y-3">
              {weeklyGoals.map(goal => (
                <button
                  key={goal.id}
                  onClick={() => toggleGoal(goal.id)}
                  className="flex items-center text-left w-full p-3 hover:bg-slate-50 rounded-xl transition-colors border border-dashed border-slate-150 text-xs sm:text-sm font-semibold text-slate-650"
                >
                  {goal.done ? (
                    <CheckSquare className="w-4 h-4 text-emerald-600 mr-3 shrink-0" />
                  ) : (
                    <Square className="w-4 h-4 text-slate-300 mr-3 shrink-0" />
                  )}
                  <span className={goal.done ? "line-through text-slate-400" : ""}>{goal.text}</span>
                </button>
              ))}
            </div>
          </Card>
        </div>

      </div>

      {/* 4. DYNAMIC PERSONALIZED RECOMMENDATIONS FEED */}
      <div className="space-y-6">
        <h3 className="text-lg font-bold text-slate-850 dark:text-white flex items-center">
          <ShieldCheck className="w-5 h-5 text-emerald-600 mr-2 animate-pulse" />
          Personalized Recommendations For You
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Jobs rec */}
          <Card className="p-5 border border-slate-100 flex flex-col justify-between">
            <div className="space-y-3">
              <Badge variant="warning">RECOMMENDED JOB</Badge>
              {summary.recommendations.jobs.map(job => (
                <div key={job.id} className="space-y-1">
                  <p className="font-bold text-slate-850 text-sm leading-tight">{job.title}</p>
                  <p className="text-[11px] text-slate-500 font-semibold">{job.company}</p>
                  <p className="text-[10px] text-slate-400 mt-1 flex items-center">
                    📍 {job.district}, {job.state}
                  </p>
                </div>
              ))}
            </div>
            <div className="pt-4 border-t mt-4 flex items-center justify-between text-xs font-semibold text-emerald-600">
              <span>View Openings</span>
              <span>→</span>
            </div>
          </Card>

          {/* Course rec */}
          <Card className="p-5 border border-slate-100 flex flex-col justify-between">
            <div className="space-y-3">
              <Badge variant="success">TRENDING COURSE</Badge>
              {summary.recommendations.courses.map(course => (
                <div key={course.id} className="space-y-1">
                  <p className="font-bold text-slate-850 text-sm leading-tight">{course.title}</p>
                  <p className="text-[11px] text-slate-500 font-semibold">{course.provider}</p>
                  <p className="text-[10px] text-slate-400 mt-1 flex items-center">
                    ⏱️ {course.duration} ({course.type})
                  </p>
                </div>
              ))}
            </div>
            <div className="pt-4 border-t mt-4 flex items-center justify-between text-xs font-semibold text-emerald-600">
              <span>Start Learning</span>
              <span>→</span>
            </div>
          </Card>

          {/* Scheme rec */}
          <Card className="p-5 border border-slate-100 flex flex-col justify-between">
            <div className="space-y-3">
              <Badge variant="info">WELFARE SCHEME</Badge>
              {summary.recommendations.schemes.map(scheme => (
                <div key={scheme.id} className="space-y-1">
                  <p className="font-bold text-slate-850 text-sm leading-tight">{scheme.name}</p>
                  <p className="text-[11px] text-slate-500 font-semibold capitalize">{scheme.sponsor} Sponsored</p>
                  <p className="text-[10px] text-slate-400 mt-1 leading-relaxed line-clamp-2">
                    {scheme.description}
                  </p>
                </div>
              ))}
            </div>
            <div className="pt-4 border-t mt-4 flex items-center justify-between text-xs font-semibold text-emerald-600">
              <span>Check Rules</span>
              <span>→</span>
            </div>
          </Card>
        </div>
      </div>

    </div>
  );
};
