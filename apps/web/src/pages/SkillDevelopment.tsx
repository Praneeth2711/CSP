import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNotification } from "../context/NotificationContext";
import { Course } from "@empowerrural/types";
import { 
  Search, GraduationCap, Video, MapPin, Award, 
  ExternalLink, CheckCircle, RefreshCw, Bookmark 
} from "lucide-react";
import { Button, Card, Input, Badge, EmptyState, PageLoader } from "@empowerrural/ui";

export const SkillDevelopment: React.FC = () => {
  const { token, user } = useAuth();
  const { showToast } = useNotification();
  
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Tracked learning logs from DB / local storage
  const [enrollments, setEnrollments] = useState<{ [key: string]: number }>({});
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);
  
  // Filters State
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedPrice, setSelectedPrice] = useState("");

  const categories = ["AI", "Programming", "Electrician", "Plumbing", "Tailoring", "Digital Marketing", "Communication", "Data Entry"];

  // Fetch Courses & Progress
  const fetchCoursesAndProgress = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedCategory) params.append("category", selectedCategory);
      if (selectedType) params.append("type", selectedType);
      if (selectedPrice) params.append("price_type", selectedPrice);

      const res = await fetch(`/api/courses?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        
        let filtered = data;
        if (searchText) {
          const q = searchText.toLowerCase();
          filtered = data.filter((c: Course) => 
            c.title.toLowerCase().includes(q) || 
            c.description.toLowerCase().includes(q) ||
            c.provider.toLowerCase().includes(q)
          );
        }
        setCourses(filtered);
      } else {
        throw new Error("Failed course query");
      }

      // Fetch user progress log
      if (user) {
        const progressRes = await fetch("/api/courses/progress/me", {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (progressRes.ok) {
          const progressLogs = await progressRes.json();
          const enrollmentMap: { [key: string]: number } = {};
          progressLogs.forEach((log: any) => {
            enrollmentMap[log.course_id] = log.progress_percent;
          });
          setEnrollments(enrollmentMap);
        }
      }
    } catch (err) {
      console.warn("Failed to reach API server. Falling back to local courses seed data.");
      // Fallback seed courses
      const seedCourses: Course[] = [
        {
          id: "course-1",
          title: "Digital Literacy & Basic Office Suite",
          provider: "Skill India",
          category: "Digital Marketing",
          type: "online",
          price_type: "free",
          price: 0,
          duration: "4 weeks",
          url: "https://www.skillindia.gov.in/",
          description: "Learn basic operations of computers, sending emails, using spreadsheets (MS Excel), creating presentations, and navigating internet banking safely.",
          certified: true,
          is_trending: true,
          created_at: new Date().toISOString()
        },
        {
          id: "course-2",
          title: "Domestic Electrician & House Wiring",
          provider: "PMKVY",
          category: "Electrician",
          type: "offline",
          price_type: "free",
          price: 0,
          duration: "12 weeks",
          url: "https://pmkvyofficial.org",
          description: "Complete hands-on vocational program teaching household wiring, phase lines, transformers, electrical safety protocols, and generator operations.",
          certified: true,
          is_trending: false,
          created_at: new Date().toISOString()
        },
        {
          id: "course-3",
          title: "Introduction to AI and Prompt Engineering",
          provider: "SWAYAM",
          category: "AI",
          type: "online",
          price_type: "free",
          price: 0,
          duration: "8 weeks",
          url: "https://swayam.gov.in",
          description: "Basic introduction to Artificial Intelligence tools like ChatGPT, Claude, and Gemini, explaining how prompt engineering can boost productivity.",
          certified: true,
          is_trending: true,
          created_at: new Date().toISOString()
        }
      ];

      let filtered = [...seedCourses];
      if (searchText) {
        const q = searchText.toLowerCase();
        filtered = filtered.filter(c => c.title.toLowerCase().includes(q) || c.description.toLowerCase().includes(q));
      }
      if (selectedCategory) filtered = filtered.filter(c => c.category === selectedCategory);
      if (selectedType) filtered = filtered.filter(c => c.type === selectedType);
      if (selectedPrice) filtered = filtered.filter(c => c.price_type === selectedPrice);
      setCourses(filtered);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoursesAndProgress();
  }, [selectedCategory, selectedType, selectedPrice, searchText]);

  // Handle Enrollment & Progress updates
  const handleUpdateProgress = async (courseId: string, currentPercent: number) => {
    if (!user) {
      showToast("Please login to track your course progress.", "warning");
      return;
    }

    const nextPercent = currentPercent === undefined || currentPercent === null ? 0 : currentPercent + 25;
    
    // Optimistic state updates
    setEnrollments(prev => ({ ...prev, [courseId]: Math.min(100, nextPercent) }));

    if (nextPercent >= 100) {
      showToast("Congratulations! Course Completed! Download your Certificate below.", "success");
    } else if (nextPercent === 25) {
      showToast("Enrolled in Course successfully! Let's get started.", "success");
    } else {
      showToast(`Learning progress updated to ${nextPercent}%!`, "info");
    }

    try {
      await fetch(`/api/courses/${courseId}/progress`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ progress_percent: Math.min(100, nextPercent) })
      });
    } catch (err) {
      console.warn("Failed to sync progress with backend server.");
    }
  };

  // Toggle Bookmark
  const handleBookmarkToggle = async (courseId: string) => {
    if (!user) {
      showToast("Please sign in to bookmark courses.", "warning");
      return;
    }
    const idx = bookmarkedIds.indexOf(courseId);
    if (idx !== -1) {
      setBookmarkedIds(prev => prev.filter(id => id !== courseId));
      showToast("Course removed from bookmarks.", "info");
    } else {
      setBookmarkedIds(prev => [...prev, courseId]);
      showToast("Course bookmarked successfully!", "success");
    }

    try {
      await fetch(`/api/courses/${courseId}/bookmark`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (err) {
      console.warn("Bookmark request could not be sent to server.");
    }
  };

  return (
    <div className="space-y-8">
      {/* Header details */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-slate-800 dark:text-white">Vocational & Digital Training</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Aggregated courses from top government certified institutes. Learn programming, electrical work, plumbing, AI tools, or digital basics.</p>
      </div>

      {/* 1. FILTERS SECTION */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-white dark:bg-slate-850 p-4 rounded-2xl border border-slate-150/60 dark:border-slate-850 shadow-soft">
        <div className="sm:col-span-2">
          <Input
            placeholder="Search courses by keywords, provider, or skills..."
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
            icon={<Search className="w-5 h-5 text-slate-400" />}
          />
        </div>
        
        {/* Category Select */}
        <select
          value={selectedCategory}
          onChange={e => setSelectedCategory(e.target.value)}
          className="text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-700 dark:text-slate-200"
        >
          <option value="">All Categories</option>
          {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
        </select>

        {/* Course Medium Select */}
        <select
          value={selectedType}
          onChange={e => setSelectedType(e.target.value)}
          className="text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-700 dark:text-slate-200"
        >
          <option value="">All Formats</option>
          <option value="online">Online (Video/PDF)</option>
          <option value="offline">Offline (In-Person Workshop)</option>
        </select>
      </div>

      {/* 2. COURSES LISTING */}
      {loading ? (
        <PageLoader />
      ) : courses.length === 0 ? (
        <EmptyState
          title="No Courses Found"
          description="We couldn't find any skill training courses matching your selected filters."
          actionText="Reset Filters"
          onActionClick={() => {
            setSearchText("");
            setSelectedCategory("");
            setSelectedType("");
            setSelectedPrice("");
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {courses.map(course => {
            const progress = enrollments[course.id];
            const isEnrolled = progress !== undefined;
            const isBookmarked = bookmarkedIds.includes(course.id);

            return (
              <Card key={course.id} hoverEffect className="flex flex-col justify-between border border-slate-100 p-5">
                <div className="space-y-4">
                  {/* Top Header */}
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                        {course.provider}
                      </span>
                      <h3 className="font-bold text-slate-850 dark:text-white leading-tight mt-0.5">{course.title}</h3>
                    </div>
                    <button
                      onClick={() => handleBookmarkToggle(course.id)}
                      className={`p-1.5 rounded-lg border transition-colors ${
                        isBookmarked 
                          ? "bg-amber-50 border-amber-200 text-amber-600" 
                          : "border-slate-100 text-slate-400 hover:text-slate-600"
                      }`}
                    >
                      <Bookmark className="w-4 h-4 fill-current" />
                    </button>
                  </div>

                  {/* Badges */}
                  <div className="flex flex-wrap gap-1.5">
                    <Badge variant="default">
                      {course.category}
                    </Badge>
                    <Badge variant={course.type === "online" ? "success" : "info"}>
                      {course.type === "online" ? "Online" : "Offline Workshop"}
                    </Badge>
                    {course.certified && (
                      <Badge variant="warning">
                        Certified
                      </Badge>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">
                    {course.description}
                  </p>

                  {/* Metadata duration */}
                  <div className="flex items-center text-xs font-semibold text-slate-500 space-x-4 pt-1">
                    <div className="flex items-center space-x-1">
                      {course.type === "online" ? <Video className="w-3.5 h-3.5 text-slate-400" /> : <MapPin className="w-3.5 h-3.5 text-slate-400" />}
                      <span>{course.duration}</span>
                    </div>
                  </div>

                  {/* Active Progress Slider */}
                  {isEnrolled && (
                    <div className="space-y-1.5 pt-2">
                      <div className="flex justify-between text-[11px] font-bold">
                        <span className="text-slate-400">Course Progress</span>
                        <span className="text-emerald-600">{progress}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-600 transition-all duration-300" style={{ width: `${progress}%` }} />
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer buttons */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-50 dark:border-slate-800 mt-4">
                  {progress === 100 ? (
                    <a href="https://empowerrural.org/certs/mock-certificate.pdf" target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" size="sm" className="border-emerald-200 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 flex items-center">
                        <Award className="w-4 h-4 mr-1.5" />
                        Get Certificate
                      </Button>
                    </a>
                  ) : (
                    <Button 
                      variant={isEnrolled ? "outline" : "primary"} 
                      size="sm"
                      onClick={() => handleUpdateProgress(course.id, progress)}
                      className={isEnrolled ? "text-slate-700 flex items-center" : "bg-emerald-600 hover:bg-emerald-700"}
                    >
                      {isEnrolled ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 mr-1.5 animate-spin-slow" />
                          Study (+25%)
                        </>
                      ) : (
                        "Enroll Course"
                      )}
                    </Button>
                  )}
                  
                  <a href={course.url} target="_blank" rel="noopener noreferrer">
                    <Button variant="ghost" size="sm" className="text-slate-500 hover:text-slate-700 flex items-center">
                      Portal
                      <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
                    </Button>
                  </a>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};
