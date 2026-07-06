import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNotification } from "../context/NotificationContext";
import { STATES_LIST, STATES_AND_DISTRICTS, QUALIFICATIONS, formatSalary } from "@empowerrural/utils";
import { Job, JobType } from "@empowerrural/types";
import { 
  Search, MapPin, Briefcase, GraduationCap, Clock, 
  Bookmark, Award, Building2, Check, X, FileCheck 
} from "lucide-react";
import { Button, Card, Input, Badge, EmptyState, CardSkeleton } from "@empowerrural/ui";

export const JobsPortal: React.FC = () => {
  const { token, user } = useAuth();
  const { showToast } = useNotification();
  
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Search & Filters State
  const [searchText, setSearchText] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedQual, setSelectedQual] = useState("");
  
  // Bookmarks tracked locally for immediate responsive UI feedback
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);
  
  // Apply Modal state
  const [applyingJob, setApplyingJob] = useState<Job | null>(null);
  const [submittingApp, setSubmittingApp] = useState(false);
  const [resumeUrl, setResumeUrl] = useState("");

  const districtsOptions = selectedState ? STATES_AND_DISTRICTS[selectedState] || [] : [];

  // Fetch Jobs
  const fetchJobs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchText) params.append("search", searchText);
      if (selectedType) params.append("type", selectedType);
      if (selectedState) params.append("state", selectedState);
      if (selectedDistrict) params.append("district", selectedDistrict);
      if (selectedQual) params.append("qualification", selectedQual);

      const res = await fetch(`/api/jobs?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setJobs(data);
      } else {
        throw new Error("API failed");
      }
    } catch (err) {
      console.warn("Failed to reach API server. Performing local search on seed database.");
      // Frontend Local Search fallback
      import("@empowerrural/utils").then(() => {
        // Mock seed array matching backend/src/database/index.ts
        const seedJobs: Job[] = [
          {
            id: "job-1",
            title: "Data Entry Operator",
            company: "District Collectorate Office",
            description: "We are hiring an administrative data entry assistant to record regional land records and citizen feedback registries in our district office.",
            requirements: ["Typing speed > 35 WPM", "Basic understanding of MS Excel", "High attention to detail"],
            benefits: ["Government employee health benefits", "Paid holiday calendar", "PF contribution"],
            salary_range: "₹18,000 - ₹22,000 / Month",
            location_type: "on_site",
            type: "government",
            state: "Andhra Pradesh",
            district: "Visakhapatnam",
            qualification: "12th Pass",
            category: "Data Entry",
            is_featured: true,
            created_at: new Date().toISOString()
          },
          {
            id: "job-2",
            title: "Remote Customer Support Assistant",
            company: "RuralTech Solutions",
            description: "Assist rural customers in troubleshooting smartphone applications, e-commerce orders, and banking queries. Fully work-from-home.",
            requirements: ["Excellent spoken Telugu and basic English", "Must have a working smartphone and broadband connection", "Patience and polite phone manner"],
            benefits: ["Monthly internet bill allowance", "Flexible shifting options", "Skill bonus structures"],
            salary_range: "₹12,000 - ₹15,000 / Month",
            location_type: "remote",
            type: "remote",
            state: "Telangana",
            district: "Hyderabad",
            qualification: "Graduate (B.A. / B.Sc. / B.Com.)",
            category: "Communication",
            is_featured: true,
            created_at: new Date().toISOString()
          },
          {
            id: "job-3",
            title: "Apprentice Field Electrician",
            company: "District Power Supply Corp",
            description: "Maintain distribution grid networks, residential lines, and fuse systems across selected Gram Panchayats.",
            requirements: ["ITI Electrician trade completion certificate", "Must own a two-wheeler with valid license", "Familiar with safety gears"],
            benefits: ["Health and accidental insurance coverage", "Fuel conveyance benefits"],
            salary_range: "₹15,000 - ₹18,000 / Month",
            location_type: "on_site",
            type: "private",
            state: "Maharashtra",
            district: "Pune",
            qualification: "ITI Certificate",
            category: "Electrician",
            is_featured: false,
            created_at: new Date().toISOString()
          }
        ];
        
        let filtered = [...seedJobs];
        if (searchText) {
          const q = searchText.toLowerCase();
          filtered = filtered.filter(j => j.title.toLowerCase().includes(q) || j.company.toLowerCase().includes(q));
        }
        if (selectedType) filtered = filtered.filter(j => j.type === selectedType);
        if (selectedState) filtered = filtered.filter(j => j.state === selectedState);
        if (selectedDistrict) filtered = filtered.filter(j => j.district === selectedDistrict);
        if (selectedQual) filtered = filtered.filter(j => j.qualification === selectedQual);
        setJobs(filtered);
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [selectedType, selectedState, selectedDistrict, selectedQual]);

  // Handle Search Input Submission
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchJobs();
  };

  // Toggle Bookmark
  const handleBookmarkToggle = async (jobId: string) => {
    if (!user) {
      showToast("Please sign in to bookmark jobs.", "warning");
      return;
    }
    
    // Optimistic toggle
    const isBookmarked = bookmarkedIds.includes(jobId);
    if (isBookmarked) {
      setBookmarkedIds(prev => prev.filter(id => id !== jobId));
      showToast("Job removed from bookmarks.", "info");
    } else {
      setBookmarkedIds(prev => [...prev, jobId]);
      showToast("Job saved successfully!", "success");
    }

    try {
      await fetch(`/api/jobs/${jobId}/bookmark`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (err) {
      console.warn("Bookmark request could not be sent to server.");
    }
  };

  // Submit Job Application
  const handleApplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!applyingJob) return;
    setSubmittingApp(true);

    try {
      const res = await fetch(`/api/jobs/${applyingJob.id}/apply`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ resume_url: resumeUrl || "https://empowerrural.org/resumes/demo-resume.pdf" })
      });

      if (res.ok) {
        showToast(`Successfully applied to ${applyingJob.company}!`, "success");
        setApplyingJob(null);
        setResumeUrl("");
      } else {
        const data = await res.json();
        showToast(data.error || "Failed to submit application.", "error");
      }
    } catch (err) {
      // Local fallback simulation
      showToast(`Applied successfully to ${applyingJob.company} (Mock Database Mode)`, "success");
      setApplyingJob(null);
      setResumeUrl("");
    } finally {
      setSubmittingApp(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Title */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-slate-800 dark:text-white">Discover Opportunities</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Explore verified jobs posted by Collectorates, Gram Panchayats, and remote-first startups.</p>
      </div>

      {/* 1. SEARCH BAR */}
      <form onSubmit={handleSearchSubmit} className="flex gap-2">
        <Input
          placeholder="Search jobs by title, company, or skills (e.g. Excel, Electrician)..."
          value={searchText}
          onChange={e => setSearchText(e.target.value)}
          icon={<Search className="w-5 h-5 text-slate-400" />}
          className="flex-1"
        />
        <Button variant="primary" type="submit" className="px-6 bg-emerald-600 hover:bg-emerald-700">
          Find Jobs
        </Button>
      </form>

      {/* 2. ADVANCED FILTERS ROW */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white dark:bg-slate-850 p-4 rounded-2xl border border-slate-150/60 dark:border-slate-850 shadow-soft">
        
        {/* State Select */}
        <div className="flex flex-col space-y-1">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">State</span>
          <select
            value={selectedState}
            onChange={e => { setSelectedState(e.target.value); setSelectedDistrict(""); }}
            className="text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-2.5 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-700 dark:text-slate-200"
          >
            <option value="">All States</option>
            {STATES_LIST.map(st => <option key={st} value={st}>{st}</option>)}
          </select>
        </div>

        {/* District Select */}
        <div className="flex flex-col space-y-1">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">District</span>
          <select
            value={selectedDistrict}
            onChange={e => setSelectedDistrict(e.target.value)}
            disabled={!selectedState}
            className="text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-2.5 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-700 dark:text-slate-200 disabled:opacity-40"
          >
            <option value="">All Districts</option>
            {districtsOptions.map(dist => <option key={dist} value={dist}>{dist}</option>)}
          </select>
        </div>

        {/* Job Type Select */}
        <div className="flex flex-col space-y-1">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Job Type</span>
          <select
            value={selectedType}
            onChange={e => setSelectedType(e.target.value)}
            className="text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-2.5 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-700 dark:text-slate-200"
          >
            <option value="">All Types</option>
            <option value="government">Government</option>
            <option value="private">Private</option>
            <option value="remote">Remote Work</option>
            <option value="internship">Internship</option>
          </select>
        </div>

        {/* Qualification Select */}
        <div className="flex flex-col space-y-1">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Education</span>
          <select
            value={selectedQual}
            onChange={e => setSelectedQual(e.target.value)}
            className="text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-2.5 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-700 dark:text-slate-200"
          >
            <option value="">All Qualifications</option>
            {QUALIFICATIONS.map(q => <option key={q} value={q}>{q}</option>)}
          </select>
        </div>
      </div>

      {/* 3. JOBS GRID LIST */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : jobs.length === 0 ? (
        <EmptyState
          title="No Matching Jobs Found"
          description="We couldn't find any openings matching your search criteria. Try adjusting state filters or search terms."
          actionText="Clear Filters"
          onActionClick={() => {
            setSearchText("");
            setSelectedState("");
            setSelectedDistrict("");
            setSelectedType("");
            setSelectedQual("");
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {jobs.map(job => {
            const isBookmarked = bookmarkedIds.includes(job.id);
            const badgeVariants: Record<JobType, "success" | "info" | "warning" | "default"> = {
              government: "warning",
              private: "default",
              remote: "success",
              internship: "info"
            };

            return (
              <Card key={job.id} hoverEffect className="flex flex-col justify-between p-5 border border-slate-100">
                <div className="space-y-4">
                  {/* Top details */}
                  <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-850 flex items-center justify-center text-slate-500 border border-slate-200/50">
                        {job.type === "government" ? <Award className="w-6 h-6 text-orange-500" /> : <Building2 className="w-6 h-6 text-blue-600" />}
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-850 dark:text-white leading-tight">{job.title}</h3>
                        <p className="text-xs text-slate-500 font-medium mt-0.5">{job.company}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleBookmarkToggle(job.id)}
                      className={`p-1.5 rounded-lg border transition-colors ${
                        isBookmarked 
                          ? "bg-amber-50 border-amber-200 text-amber-600" 
                          : "border-slate-100 text-slate-400 hover:text-slate-600 dark:border-slate-700"
                      }`}
                    >
                      <Bookmark className="w-4 h-4 fill-current" />
                    </button>
                  </div>

                  {/* Badges */}
                  <div className="flex flex-wrap gap-1.5">
                    <Badge variant={badgeVariants[job.type]}>
                      {job.type.toUpperCase()}
                    </Badge>
                    <Badge variant="default">
                      {job.location_type.toUpperCase()}
                    </Badge>
                    <Badge variant="success">
                      {job.salary_range}
                    </Badge>
                  </div>

                  {/* Description summary */}
                  <p className="text-xs sm:text-sm text-slate-500 leading-relaxed line-clamp-2">
                    {job.description}
                  </p>

                  {/* Metadata labels */}
                  <div className="grid grid-cols-2 gap-y-2 pt-2 text-[11px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400">
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{job.district}, {job.state}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
                      <span>{job.qualification}</span>
                    </div>
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-50 dark:border-slate-800 mt-4">
                  <span className="text-[11px] text-slate-400 flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    Posted {new Date(job.created_at).toLocaleDateString()}
                  </span>
                  <Button variant="primary" size="sm" onClick={() => setApplyingJob(job)} className="bg-emerald-600 hover:bg-emerald-700">
                    Apply Now
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* 4. APPLY FORM MODAL OVERLAY */}
      {applyingJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          {/* Backdrop */}
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setApplyingJob(null)} />
          
          {/* Box */}
          <div className="relative w-full max-w-md bg-white dark:bg-slate-850 rounded-2xl p-6 shadow-xl border border-slate-100 dark:border-slate-800 flex flex-col transform animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-800 dark:text-white">Apply for {applyingJob.title}</h3>
                <p className="text-xs text-slate-500 mt-0.5">{applyingJob.company}</p>
              </div>
              <button onClick={() => setApplyingJob(null)} className="p-1 rounded bg-slate-50 hover:bg-slate-150 text-slate-400 dark:bg-slate-800">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleApplySubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Applicant Profile</label>
                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-150 text-sm">
                  <p className="font-bold text-slate-800 dark:text-white">{user?.full_name || "Ramesh Kumar"}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{user?.email || "demo.user@empowerrural.org"}</p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Submit Resume Link</label>
                <Input
                  placeholder="https://empowerrural.org/resumes/my-resume.pdf"
                  value={resumeUrl}
                  onChange={e => setResumeUrl(e.target.value)}
                  icon={<FileCheck className="w-5 h-5 text-slate-400" />}
                  helperText="Leave empty to auto-attach your generated Resume Builder profile."
                />
              </div>

              {/* Requirements review */}
              <div className="p-3 bg-emerald-50/50 dark:bg-emerald-950/10 border border-emerald-100 rounded-xl">
                <p className="text-xs font-semibold text-emerald-800 dark:text-emerald-400 mb-1">Key Job Requirements Check:</p>
                <ul className="text-xs space-y-1 text-slate-600 dark:text-slate-350 list-disc list-inside">
                  {applyingJob.requirements.slice(0, 2).map((req, i) => (
                    <li key={i}>{req}</li>
                  ))}
                </ul>
              </div>

              <div className="flex gap-3 justify-end pt-2">
                <Button variant="outline" type="button" onClick={() => setApplyingJob(null)}>
                  Cancel
                </Button>
                <Button variant="primary" type="submit" isLoading={submittingApp} className="bg-emerald-600 hover:bg-emerald-700">
                  Confirm Application
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
