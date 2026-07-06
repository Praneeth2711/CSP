import React, { useState } from "react";
import { Search, BookOpen, Video, FileText, ExternalLink, Globe } from "lucide-react";
import { Card, Input, Badge, Button, EmptyState } from "@empowerrural/ui";

interface Resource {
  title: string;
  source: string;
  category: "Digital" | "Govt Exam" | "Vocational" | "Agriculture";
  format: "Video Playlist" | "PDF Manual" | "Portal Link";
  url: string;
  description: string;
}

export const LearningResources: React.FC = () => {
  const [searchText, setSearchText] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const resources: Resource[] = [
    {
      title: "Basic Computer & Typing Tutorials",
      source: "YouTube Academy",
      category: "Digital",
      format: "Video Playlist",
      url: "https://www.youtube.com",
      description: "Step-by-step videos in Hindi covering keyboard layout, typing fast, and MS Word formatting fundamentals."
    },
    {
      title: "PMKVY Electrician Course Curriculum Handbook",
      source: "Skill India Portal",
      category: "Vocational",
      format: "PDF Manual",
      url: "https://www.skillindia.gov.in/",
      description: "Official training PDF detailing home electrical wiring, safety audits, phase lines, and grid operations."
    },
    {
      title: "SWAYAM Free Online Course Catalog",
      source: "SWAYAM MHRD",
      category: "Digital",
      format: "Portal Link",
      url: "https://swayam.gov.in",
      description: "Aggregated national database of undergraduate and vocational modules hosted by IITs and Central Universities."
    },
    {
      title: "DigiLocker Setup Guide for Rural Citizens",
      source: "National Informatics Centre",
      category: "Digital",
      format: "PDF Manual",
      url: "https://www.digilocker.gov.in/",
      description: "Illustrated document explaining how to link Aadhaar, retrieve school certificate sheets, and verify documents online."
    },
    {
      title: "Modern Farming Techniques & Soil Health Management",
      source: "ICAR India",
      category: "Agriculture",
      format: "Video Playlist",
      url: "https://www.icar.org.in/",
      description: "Videos demonstrating drip irrigation installation, organic fertilizers, and seasonal crop rotation guidelines."
    },
    {
      title: "Railway & Panchayat Recruitment Exam Guides",
      source: "Govt Exam Prep Hub",
      category: "Govt Exam",
      format: "PDF Manual",
      url: "https://www.ssc.gov.in",
      description: "Previous year question booklets, syllabus breakdowns, and pattern guides for SSC, Railway Group D, and Village Vol roles."
    }
  ];

  const categories = ["All", "Digital", "Vocational", "Agriculture", "Govt Exam"];

  // Filter Logic
  const filtered = resources.filter(res => {
    const matchesSearch = res.title.toLowerCase().includes(searchText.toLowerCase()) || 
                          res.description.toLowerCase().includes(searchText.toLowerCase()) ||
                          res.source.toLowerCase().includes(searchText.toLowerCase());
    const matchesCategory = activeCategory === "All" || res.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const icons = {
    "Video Playlist": <Video className="w-5 h-5 text-rose-500" />,
    "PDF Manual": <FileText className="w-5 h-5 text-blue-500" />,
    "Portal Link": <Globe className="w-5 h-5 text-emerald-500" />
  };

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-slate-800 dark:text-white">Learning Resource Directory</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Access free handbook PDFs, YouTube tutorials, and competitive government exam preparation booklets.</p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <div className="w-full md:max-w-md">
          <Input
            placeholder="Search handbooks, play lists, exam guides..."
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
            icon={<Search className="w-5 h-5 text-slate-400" />}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                activeCategory === cat
                  ? "bg-emerald-600 border-emerald-650 text-white shadow-sm shadow-emerald-200"
                  : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <EmptyState
          title="No Resources Found"
          description="Try clearing search query tags or selecting a different category catalog."
          actionText="Clear Search"
          onActionClick={() => setSearchText("")}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((res, idx) => (
            <Card key={idx} hoverEffect className="flex flex-col justify-between p-5 border border-slate-100">
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center border border-slate-200/50">
                      {icons[res.format]}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800 dark:text-white leading-tight">{res.title}</h3>
                      <p className="text-xs text-slate-500 font-medium mt-0.5">{res.source}</p>
                    </div>
                  </div>
                  <Badge variant="default">{res.format}</Badge>
                </div>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">{res.description}</p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-50 dark:border-slate-800 mt-4">
                <Badge variant="info">{res.category}</Badge>
                <a href={res.url} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="sm" className="flex items-center text-xs">
                    View Resource
                    <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
                  </Button>
                </a>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
