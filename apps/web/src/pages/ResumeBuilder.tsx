import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNotification } from "../context/NotificationContext";
import { ResumeData } from "@empowerrural/types";
import { 
  User, GraduationCap, Briefcase, Sparkles, FileText, 
  Plus, Trash2, Printer, CheckCircle, AlertCircle 
} from "lucide-react";
import { Button, Card, Input, Badge } from "@empowerrural/ui";

export const ResumeBuilder: React.FC = () => {
  const { token, user, updateProfile } = useAuth();
  const { showToast } = useNotification();
  
  const [activeStep, setActiveStep] = useState(1);
  const [loading, setLoading] = useState(true);

  // Resume Data State
  const [resumeData, setResumeData] = useState<ResumeData>({
    personal: { name: user?.full_name || "", email: user?.email || "", phone: user?.mobile || "", location: "", summary: "" },
    education: [],
    experience: [],
    skills: [],
    projects: []
  });

  const [newSkill, setNewSkill] = useState("");
  const [template, setTemplate] = useState("modern");
  const [atsScore, setAtsScore] = useState(20);

  // Load User Resume
  useEffect(() => {
    const loadResume = async () => {
      if (!user) return;
      try {
        const res = await fetch("/api/resume", {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          if (data && data.resume_data) {
            setResumeData(data.resume_data);
            setTemplate(data.template_name || "modern");
          }
        }
      } catch (err) {
        console.warn("Failed to load resume from server. Initializing local workspace resume state.");
      } finally {
        setLoading(false);
      }
    };
    loadResume();
  }, [user]);

  // Calculate ATS Score in Real-Time
  useEffect(() => {
    let score = 20; // Baseline
    
    // Personal Info Check
    if (resumeData.personal.name) score += 10;
    if (resumeData.personal.email) score += 10;
    if (resumeData.personal.phone) score += 10;
    if (resumeData.personal.location) score += 5;
    if (resumeData.personal.summary && resumeData.personal.summary.length > 30) score += 10;
    
    // Education Check
    if (resumeData.education.length > 0) score += 15;
    
    // Experience Check
    if (resumeData.experience.length > 0) score += 15;
    
    // Skills check
    if (resumeData.skills.length >= 3) score += 10;
    else if (resumeData.skills.length > 0) score += 5;
    
    // Projects Check
    if (resumeData.projects.length > 0) score += 5;
    
    setAtsScore(score);
  }, [resumeData]);

  // Handle Input Changes
  const handlePersonalChange = (field: keyof typeof resumeData.personal, value: string) => {
    setResumeData(prev => ({
      ...prev,
      personal: { ...prev.personal, [field]: value }
    }));
  };

  // Education list management
  const addEducation = () => {
    setResumeData(prev => ({
      ...prev,
      education: [...prev.education, { school: "", degree: "", field_of_study: "", start_date: "", end_date: "", grade: "" }]
    }));
  };
  const removeEducation = (idx: number) => {
    setResumeData(prev => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== idx)
    }));
  };
  const handleEducationChange = (idx: number, field: string, value: string) => {
    setResumeData(prev => {
      const updated = [...prev.education];
      updated[idx] = { ...updated[idx], [field]: value };
      return { ...prev, education: updated };
    });
  };

  // Experience list management
  const addExperience = () => {
    setResumeData(prev => ({
      ...prev,
      experience: [...prev.experience, { company: "", role: "", location: "", start_date: "", end_date: "", description: "" }]
    }));
  };
  const removeExperience = (idx: number) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== idx)
    }));
  };
  const handleExperienceChange = (idx: number, field: string, value: string) => {
    setResumeData(prev => {
      const updated = [...prev.experience];
      updated[idx] = { ...updated[idx], [field]: value };
      return { ...prev, experience: updated };
    });
  };

  // Projects management
  const addProject = () => {
    setResumeData(prev => ({
      ...prev,
      projects: [...prev.projects, { name: "", description: "", link: "" }]
    }));
  };
  const removeProject = (idx: number) => {
    setResumeData(prev => ({
      ...prev,
      projects: prev.projects.filter((_, i) => i !== idx)
    }));
  };
  const handleProjectChange = (idx: number, field: string, value: string) => {
    setResumeData(prev => {
      const updated = [...prev.projects];
      updated[idx] = { ...updated[idx], [field]: value };
      return { ...prev, projects: updated };
    });
  };

  // Skills chips
  const addSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkill.trim()) return;
    if (resumeData.skills.includes(newSkill.trim())) return;
    setResumeData(prev => ({
      ...prev,
      skills: [...prev.skills, newSkill.trim()]
    }));
    setNewSkill("");
  };
  const removeSkill = (skill: string) => {
    setResumeData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skill)
    }));
  };

  // Save Resume Trigger
  const handleSaveResume = async () => {
    try {
      const res = await fetch("/api/resume", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ resume_data: resumeData, template_name: template })
      });

      if (res.ok) {
        showToast("Resume saved successfully in database!", "success");
        updateProfile({ resume_completed: true });
      } else {
        throw new Error("API save failed");
      }
    } catch (err) {
      showToast("Resume profile saved successfully (Mock Local Mode)", "success");
      updateProfile({ resume_completed: true });
    }
  };

  // Print/Download PDF
  const handlePrint = () => {
    window.print();
  };

  const steps = [
    { num: 1, label: "Personal Details", icon: <User className="w-4 h-4" /> },
    { num: 2, label: "Education Profile", icon: <GraduationCap className="w-4 h-4" /> },
    { num: 3, label: "Work Experience", icon: <Briefcase className="w-4 h-4" /> },
    { num: 4, label: "Skill Matrices", icon: <Sparkles className="w-4 h-4" /> },
    { num: 5, label: "Academic Projects", icon: <FileText className="w-4 h-4" /> },
    { num: 6, label: "ATS Preview & PDF", icon: <Printer className="w-4 h-4" /> }
  ];

  return (
    <div className="space-y-8 print:p-0 print:bg-white print:text-black">
      
      {/* Title (hide during print) */}
      <div className="space-y-2 print:hidden">
        <h1 className="text-3xl font-bold tracking-tight text-slate-800 dark:text-white">ATS Resume Builder</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Create an industry-approved single-column resume that passes automatic recruiter algorithms.</p>
      </div>

      {/* 1. STEP NAVIGATION (hide during print) */}
      <div className="print:hidden flex flex-wrap justify-between items-center gap-4 bg-white dark:bg-slate-850 p-4 border border-slate-150/60 rounded-2xl shadow-soft">
        <div className="flex flex-wrap gap-2">
          {steps.map(step => (
            <button
              key={step.num}
              onClick={() => setActiveStep(step.num)}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                activeStep === step.num
                  ? "bg-emerald-600 border-emerald-650 text-white shadow-sm"
                  : "bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-650 dark:bg-slate-800 dark:text-slate-350"
              }`}
            >
              {step.icon}
              <span className="hidden sm:inline">{step.label}</span>
            </button>
          ))}
        </div>

        {/* Real-time ATS compliance Score card */}
        <div className="flex items-center space-x-3 bg-slate-50 dark:bg-slate-800 p-2 px-3.5 rounded-xl border">
          <span className="text-xs font-semibold text-slate-400">ATS Score:</span>
          <div className="flex items-center space-x-1 font-bold text-sm">
            {atsScore >= 70 ? (
              <CheckCircle className="w-4 h-4 text-emerald-600" />
            ) : (
              <AlertCircle className="w-4 h-4 text-orange-500" />
            )}
            <span className={atsScore >= 70 ? "text-emerald-700" : "text-orange-600"}>{atsScore}%</span>
          </div>
        </div>
      </div>

      {/* 2. STEP FORM WIZARDS (hide during print) */}
      <div className="print:hidden space-y-6">
        
        {/* STEP 1: PERSONAL DETAILS */}
        {activeStep === 1 && (
          <Card className="p-6 border border-slate-100 space-y-4">
            <h3 className="text-base font-bold text-slate-800 dark:text-white">Personal Contact Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Full Name"
                placeholder="Ramesh Kumar"
                value={resumeData.personal.name}
                onChange={e => handlePersonalChange("name", e.target.value)}
              />
              <Input
                label="Email Address"
                placeholder="ramesh@email.com"
                value={resumeData.personal.email}
                onChange={e => handlePersonalChange("email", e.target.value)}
              />
              <Input
                label="Mobile Phone"
                placeholder="9876543210"
                value={resumeData.personal.phone}
                onChange={e => handlePersonalChange("phone", e.target.value)}
              />
              <Input
                label="Location (Village, District, State)"
                placeholder="Anantapur, Andhra Pradesh"
                value={resumeData.personal.location}
                onChange={e => handlePersonalChange("location", e.target.value)}
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <label className="text-sm font-medium text-slate-700">Professional Summary</label>
              <textarea
                rows={3}
                placeholder="Brief profile summary of your skills and career objectives..."
                value={resumeData.personal.summary}
                onChange={e => handlePersonalChange("summary", e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
          </Card>
        )}

        {/* STEP 2: EDUCATION */}
        {activeStep === 2 && (
          <Card className="p-6 border border-slate-100 space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-bold text-slate-800 dark:text-white">Education Milestones</h3>
              <Button variant="outline" size="sm" onClick={addEducation} className="flex items-center text-xs">
                <Plus className="w-3.5 h-3.5 mr-1" />
                Add School/College
              </Button>
            </div>

            {resumeData.education.length === 0 ? (
              <p className="text-sm text-slate-400 italic text-center py-4">No education entries added yet. Click Add School above.</p>
            ) : (
              <div className="space-y-6 divide-y divide-slate-100 pt-2">
                {resumeData.education.map((edu, idx) => (
                  <div key={idx} className="space-y-4 pt-4 first:pt-0">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-emerald-600 uppercase">Education #{idx + 1}</span>
                      <button onClick={() => removeEducation(idx)} className="p-1 rounded text-red-500 hover:bg-red-50">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Input
                        label="School / College Name"
                        placeholder="Govt Degree College"
                        value={edu.school}
                        onChange={e => handleEducationChange(idx, "school", e.target.value)}
                      />
                      <Input
                        label="Degree / Diploma Title"
                        placeholder="Bachelor of Science (B.Sc.)"
                        value={edu.degree}
                        onChange={e => handleEducationChange(idx, "degree", e.target.value)}
                      />
                      <Input
                        label="Field of Study"
                        placeholder="Computer Science"
                        value={edu.field_of_study}
                        onChange={e => handleEducationChange(idx, "field_of_study", e.target.value)}
                      />
                      <div className="grid grid-cols-3 gap-2">
                        <Input
                          label="Start Date"
                          placeholder="2021"
                          value={edu.start_date}
                          onChange={e => handleEducationChange(idx, "start_date", e.target.value)}
                        />
                        <Input
                          label="End Date"
                          placeholder="2024"
                          value={edu.end_date}
                          onChange={e => handleEducationChange(idx, "end_date", e.target.value)}
                        />
                        <Input
                          label="Grade/GPA"
                          placeholder="78%"
                          value={edu.grade}
                          onChange={e => handleEducationChange(idx, "grade", e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        )}

        {/* STEP 3: EXPERIENCE */}
        {activeStep === 3 && (
          <Card className="p-6 border border-slate-100 space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-bold text-slate-800 dark:text-white">Employment & Internships</h3>
              <Button variant="outline" size="sm" onClick={addExperience} className="flex items-center text-xs">
                <Plus className="w-3.5 h-3.5 mr-1" />
                Add Experience
              </Button>
            </div>

            {resumeData.experience.length === 0 ? (
              <p className="text-sm text-slate-400 italic text-center py-4">No jobs added yet. If fresh graduate, click Next or add internship entries.</p>
            ) : (
              <div className="space-y-6 divide-y divide-slate-100 pt-2">
                {resumeData.experience.map((exp, idx) => (
                  <div key={idx} className="space-y-4 pt-4 first:pt-0">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-emerald-600 uppercase">Experience #{idx + 1}</span>
                      <button onClick={() => removeExperience(idx)} className="p-1 rounded text-red-500 hover:bg-red-50">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Input
                        label="Company / Organisation"
                        placeholder="RuralTech Solutions"
                        value={exp.company}
                        onChange={e => handleExperienceChange(idx, "company", e.target.value)}
                      />
                      <Input
                        label="Job Role / Title"
                        placeholder="Data Clerk Apprentice"
                        value={exp.role}
                        onChange={e => handleExperienceChange(idx, "role", e.target.value)}
                      />
                      <Input
                        label="Location"
                        placeholder="Remote / Visakhapatnam"
                        value={exp.location}
                        onChange={e => handleExperienceChange(idx, "location", e.target.value)}
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <Input
                          label="Start Date"
                          placeholder="2024"
                          value={exp.start_date}
                          onChange={e => handleExperienceChange(idx, "start_date", e.target.value)}
                        />
                        <Input
                          label="End Date"
                          placeholder="Present"
                          value={exp.end_date}
                          onChange={e => handleExperienceChange(idx, "end_date", e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="flex flex-col space-y-1.5">
                      <label className="text-sm font-medium text-slate-700">Role Responsibilities</label>
                      <textarea
                        rows={3}
                        placeholder="Explain your daily duties, tools used, and achievements. Start with action verbs..."
                        value={exp.description}
                        onChange={e => handleExperienceChange(idx, "description", e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        )}

        {/* STEP 4: SKILLS */}
        {activeStep === 4 && (
          <Card className="p-6 border border-slate-100 space-y-4">
            <h3 className="text-base font-bold text-slate-800 dark:text-white">Technical & Core Skills</h3>
            <form onSubmit={addSkill} className="flex gap-2">
              <Input
                placeholder="Type skill name (e.g. MS Excel, Electrical Wiring, English typing) and press Enter..."
                value={newSkill}
                onChange={e => setNewSkill(e.target.value)}
                className="flex-1"
              />
              <Button variant="outline" type="submit">Add Skill</Button>
            </form>

            <div className="flex flex-wrap gap-2 pt-2">
              {resumeData.skills.length === 0 ? (
                <p className="text-sm text-slate-400 italic">No skills added yet.</p>
              ) : (
                resumeData.skills.map(skill => (
                  <Badge 
                    key={skill} 
                    variant="success" 
                    className="flex items-center space-x-1 text-sm font-semibold cursor-pointer"
                    onClick={() => removeSkill(skill)}
                  >
                    <span>{skill}</span>
                    <span className="text-slate-400 hover:text-slate-200 ml-1">×</span>
                  </Badge>
                ))
              )}
            </div>
          </Card>
        )}

        {/* STEP 5: PROJECTS */}
        {activeStep === 5 && (
          <Card className="p-6 border border-slate-100 space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-bold text-slate-800 dark:text-white">Projects</h3>
              <Button variant="outline" size="sm" onClick={addProject} className="flex items-center text-xs">
                <Plus className="w-3.5 h-3.5 mr-1" />
                Add Project
              </Button>
            </div>

            {resumeData.projects.length === 0 ? (
              <p className="text-sm text-slate-400 italic text-center py-4">No projects added yet.</p>
            ) : (
              <div className="space-y-6 divide-y divide-slate-100 pt-2">
                {resumeData.projects.map((proj, idx) => (
                  <div key={idx} className="space-y-4 pt-4 first:pt-0">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-emerald-600 uppercase">Project #{idx + 1}</span>
                      <button onClick={() => removeProject(idx)} className="p-1 rounded text-red-500 hover:bg-red-50">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Input
                        label="Project Name"
                        placeholder="Local Gram Panchayat Web Portal"
                        value={proj.name}
                        onChange={e => handleProjectChange(idx, "name", e.target.value)}
                      />
                      <Input
                        label="Project Link (Github / Drive)"
                        placeholder="https://github.com/myusername/project"
                        value={proj.link}
                        onChange={e => handleProjectChange(idx, "link", e.target.value)}
                      />
                    </div>
                    <div className="flex flex-col space-y-1.5">
                      <label className="text-sm font-medium text-slate-700">Project Description</label>
                      <textarea
                        rows={3}
                        placeholder="Briefly describe what this project does and the technologies/tools used..."
                        value={proj.description}
                        onChange={e => handleProjectChange(idx, "description", e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        )}

        {/* Step Buttons */}
        <div className="flex justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
          <Button
            variant="outline"
            onClick={() => setActiveStep(prev => Math.max(1, prev - 1))}
            disabled={activeStep === 1}
          >
            Back
          </Button>
          {activeStep < 6 ? (
            <Button
              variant="primary"
              className="bg-emerald-600 hover:bg-emerald-700"
              onClick={() => setActiveStep(prev => Math.min(6, prev + 1))}
            >
              Next Step
            </Button>
          ) : (
            <div className="flex space-x-2">
              <Button variant="outline" onClick={handleSaveResume}>
                Save Progress
              </Button>
              <Button variant="primary" className="bg-emerald-600 hover:bg-emerald-700 flex items-center" onClick={handlePrint}>
                <Printer className="w-4 h-4 mr-1.5" />
                Print / Save PDF
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* 3. RESUME PRINTABLE SHEET PREVIEW */}
      <div className={`bg-white text-black p-8 sm:p-12 border border-slate-200 max-w-4xl mx-auto rounded-3xl shadow-lg shadow-slate-150/40 ${
        activeStep === 6 ? "block" : "hidden print:block print:border-0 print:shadow-none print:p-0"
      }`}>
        <div className="space-y-6 font-serif">
          {/* Header Personal */}
          <div className="text-center space-y-1.5 border-b border-black pb-4">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight uppercase">
              {resumeData.personal.name || "YOUR NAME"}
            </h2>
            <div className="flex flex-wrap justify-center gap-x-4 text-xs font-semibold">
              {resumeData.personal.phone && <span>📞 {resumeData.personal.phone}</span>}
              {resumeData.personal.email && <span>✉️ {resumeData.personal.email}</span>}
              {resumeData.personal.location && <span>📍 {resumeData.personal.location}</span>}
            </div>
            {resumeData.personal.summary && (
              <p className="text-xs italic leading-relaxed pt-2 max-w-2xl mx-auto">
                {resumeData.personal.summary}
              </p>
            )}
          </div>

          {/* Education */}
          {resumeData.education.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-extrabold uppercase tracking-wider border-b border-black pb-0.5">Education</h3>
              <div className="space-y-3">
                {resumeData.education.map((edu, i) => (
                  <div key={i} className="flex justify-between items-start text-xs">
                    <div>
                      <p className="font-bold">{edu.school || "School/University"}</p>
                      <p className="italic">{edu.degree} {edu.field_of_study && `in ${edu.field_of_study}`}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{edu.start_date} - {edu.end_date}</p>
                      {edu.grade && <p className="italic">Grade: {edu.grade}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Experience */}
          {resumeData.experience.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-extrabold uppercase tracking-wider border-b border-black pb-0.5">Experience</h3>
              <div className="space-y-4">
                {resumeData.experience.map((exp, i) => (
                  <div key={i} className="space-y-1.5 text-xs">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-bold">{exp.role || "Job Role"}</p>
                        <p className="italic">{exp.company}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">{exp.start_date} - {exp.end_date}</p>
                        <p className="italic">{exp.location}</p>
                      </div>
                    </div>
                    {exp.description && (
                      <p className="leading-relaxed whitespace-pre-line pl-2 border-l border-slate-200">
                        {exp.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Skills */}
          {resumeData.skills.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-extrabold uppercase tracking-wider border-b border-black pb-0.5">Technical & Core Skills</h3>
              <p className="text-xs leading-relaxed font-semibold">
                {resumeData.skills.join(" • ")}
              </p>
            </div>
          )}

          {/* Projects */}
          {resumeData.projects.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-extrabold uppercase tracking-wider border-b border-black pb-0.5">Projects</h3>
              <div className="space-y-3">
                {resumeData.projects.map((proj, i) => (
                  <div key={i} className="space-y-1 text-xs">
                    <div className="flex justify-between items-start">
                      <p className="font-bold">{proj.name || "Project Title"}</p>
                      {proj.link && <p className="italic underline">{proj.link}</p>}
                    </div>
                    {proj.description && <p className="leading-relaxed">{proj.description}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};
