import { createClient } from "@supabase/supabase-js";
import { CONFIG } from "../config/index.js";
import { 
  Job, Course, Scheme, UserProfile, JobApplication, 
  UserResume, Notification, Bookmark, InterviewQuestion, 
  InterviewProgress, QuizQuestion, QuizResult, LearningProgress
} from "@empowerrural/types";

// ==========================================
// 1. SUPABASE CLIENT
// ==========================================
export const supabase = !CONFIG.IS_MOCK_DB
  ? createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_ANON_KEY)
  : null;

// ==========================================
// 2. HIGH-FIDELITY MOCK IN-MEMORY STORE
// ==========================================
const mockSkills = [
  { id: 1, name: "Python Programming", category: "Technical" },
  { id: 2, name: "Web Development (HTML/CSS/JS)", category: "Technical" },
  { id: 3, name: "Data Entry & Office Excel", category: "Technical" },
  { id: 4, name: "Digital Marketing & Social Media", category: "Technical" },
  { id: 5, name: "House Wiring & Electrician", category: "Manual" },
  { id: 6, name: "Basic Plumbing", category: "Manual" },
  { id: 7, name: "Tailoring & Pattern Designing", category: "Manual" },
  { id: 8, name: "Spoken English & Communication", category: "Soft Skill" },
  { id: 9, name: "Organic Farming & Crop Management", category: "Agriculture" }
];

const mockQuizQuestions: QuizQuestion[] = [
  {
    id: "quiz-q1",
    question: "What kind of work environment sounds most exciting to you?",
    options: [
      { text: "Designing websites and writing code on a computer", scoreMap: { engineering: 3, private: 2 } },
      { text: "Working in a local school teaching children", scoreMap: { teaching: 3 } },
      { text: "Consulting farmers on improving crop yields using technology", scoreMap: { agriculture: 3, skill_based: 1 } },
      { text: "Serving in public administration or gram panchayat offices", scoreMap: { government: 3 } },
      { text: "Setting up an independent tailoring or electrical workshop", scoreMap: { skill_based: 3 } }
    ]
  },
  {
    id: "quiz-q2",
    question: "When you face a problem, how do you prefer to solve it?",
    options: [
      { text: "Analyze the math or logic behind it systematically", scoreMap: { engineering: 3 } },
      { text: "Discuss and work with others to find a community solution", scoreMap: { teaching: 2, government: 3 } },
      { text: "Use hands-on tools to fix or build physical objects", scoreMap: { skill_based: 3 } },
      { text: "Observe nature, soil, or weather patterns to adapt", scoreMap: { agriculture: 3 } }
    ]
  },
  {
    id: "quiz-q3",
    question: "Which of these subjects did you enjoy or find interesting during school?",
    options: [
      { text: "Mathematics and Computers", scoreMap: { engineering: 3, private: 2 } },
      { text: "Social Studies and Public Administration", scoreMap: { government: 3, teaching: 1 } },
      { text: "Biology and Environmental Sciences", scoreMap: { agriculture: 3 } },
      { text: "Crafts, Drawing, and Vocational Workshops", scoreMap: { skill_based: 3 } }
    ]
  }
];

const mockInterviewQuestions: InterviewQuestion[] = [
  {
    id: "int-q1",
    category: "hr",
    sub_category: "General",
    question: "Tell me about yourself and your background.",
    hints: ["Mention your hometown, school/college education.", "Talk about your skills and why you applied."],
    sample_answer: "I am a degree graduate from Anantapur district. I have completed a digital marketing certification through Skill India and have strong basic computer skills. I am looking to utilize my communication skills to help local companies expand their digital reach."
  },
  {
    id: "int-q2",
    category: "hr",
    sub_category: "Behavioral",
    question: "Why do you want to work in your village/district rather than moving to a major metro city?",
    hints: ["Emphasize community connection.", "Discuss local growth opportunities."],
    sample_answer: "I believe rural areas hold immense potential. By staying in my district, I can support local businesses and help bridge the digital gap in our community while remaining close to my family."
  },
  {
    id: "int-q3",
    category: "technical",
    sub_category: "Data Entry",
    question: "How do you ensure data accuracy when typing large volumes of information in MS Excel?",
    hints: ["Mention validation features.", "Talk about regular audit checks."],
    sample_answer: "I ensure accuracy by using built-in Excel features like Data Validation to restrict inputs. Additionally, I double-check data blocks periodically using formula sum tallies and format checks."
  },
  {
    id: "int-q4",
    category: "technical",
    sub_category: "Agriculture Tech",
    question: "What is organic farming and what are some common natural fertilizers?",
    hints: ["Explain the basic definition.", "Give examples like compost, vermicompost."],
    sample_answer: "Organic farming is a method that avoids synthetic fertilizers and chemical pesticides. We use natural organic inputs like compost, cow dung manure, vermicompost, and bio-fertilizers to sustain soil health and ecology."
  }
];

const mockSchemes: Scheme[] = [
  {
    id: "scheme-1",
    name: "Pradhan Mantri Kaushal Vikas Yojana (PMKVY)",
    sponsor: "central",
    category: "Skill Development",
    description: "A flagship skill training initiative providing free vocational courses with industry-standard certification to help youth secure better livelihood opportunities.",
    benefits: "100% sponsored course training fees, assessment coverage, transport allowance, and startup kits for selected courses.",
    eligibility: {
      min_age: 15,
      max_age: 45,
      qualifications: ["10th Pass", "12th Pass", "ITI Certificate"],
      states: []
    },
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
    eligibility: {
      min_age: 18,
      max_age: 100,
      max_income: 1000000,
      states: ["Telangana"]
    },
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
    eligibility: {
      min_age: 15,
      max_age: 35,
      qualifications: ["10th Pass", "12th Pass"],
      states: []
    },
    apply_steps: ["Apply online via Kaushal Bharat portal", "Meet village volunteer at Gram Panchayat office", "Verify income cert and Aadhaar card"],
    link: "http://ddugky.gov.in/",
    is_featured: true,
    created_at: new Date().toISOString()
  }
];

const mockCourses: Course[] = [
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
    image_url: "https://images.unsplash.com/photo-1542744094-3a31f103e35f?auto=format&fit=crop&w=400&q=80",
    certified: true,
    syllabus: ["Introduction to OS", "MS Word & Text Processing", "MS Excel Data Structuring", "Internet and Safe Online Payments"],
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
    image_url: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=400&q=80",
    certified: true,
    syllabus: ["Electrical Theory", "House Circuit Connections", "Appliance Diagnostics", "Safety Auditing"],
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
    image_url: "https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=400&q=80",
    certified: true,
    syllabus: ["AI Fundamentals", "Large Language Models Overview", "Structuring Prompts", "AI for Writing and Analysis"],
    is_trending: true,
    created_at: new Date().toISOString()
  }
];

const mockJobs: Job[] = [
  {
    id: "job-1",
    title: "Data Entry Operator",
    company: "District Collectorate Office",
    logo_url: "",
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
    apply_url: "https://visakhapatnam.ap.gov.in/",
    is_featured: true,
    created_at: new Date().toISOString()
  },
  {
    id: "job-2",
    title: "Remote Customer Support Assistant",
    company: "RuralTech Solutions",
    logo_url: "",
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
    apply_url: "https://ruraltech.co.in/careers",
    is_featured: true,
    created_at: new Date().toISOString()
  },
  {
    id: "job-3",
    title: "Apprentice Field Electrician",
    company: "District Power Supply Corp",
    logo_url: "",
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
    apply_url: "https://mahadiscom.in/",
    is_featured: false,
    created_at: new Date().toISOString()
  }
];

// In-Memory dynamic DB Tables
export const mockDb = {
  skills: [...mockSkills],
  quizQuestions: [...mockQuizQuestions],
  interviewQuestions: [...mockInterviewQuestions],
  schemes: [...mockSchemes],
  courses: [...mockCourses],
  jobs: [...mockJobs],
  profiles: [] as UserProfile[],
  jobApplications: [] as JobApplication[],
  bookmarks: [] as Bookmark[],
  resumes: [] as UserResume[],
  notifications: [] as Notification[],
  interviewProgress: [] as InterviewProgress[],
  quizResults: [] as QuizResult[],
  learningProgress: [] as LearningProgress[],

  // Getters
  getJobs: () => mockDb.jobs,
  getCourses: () => mockDb.courses,
  getSchemes: () => mockDb.schemes,
  
  // Custom Profile Helper (creates one automatically for development if not exists)
  getProfile: (userId: string): UserProfile => {
    let profile = mockDb.profiles.find(p => p.id === userId);
    if (!profile) {
      profile = {
        id: userId,
        email: "demo.user@empowerrural.org",
        role: "youth",
        full_name: "Ramesh Kumar",
        mobile: "9876543210",
        gender: "male",
        age: 23,
        income_annual: 85000,
        qualification: "12th Pass",
        state: "Telangana",
        district: "Hyderabad",
        skills: ["Data Entry & Office Excel", "Spoken English & Communication"],
        bio: "Determined youth from Nizamabad looking for skill certificates and private remote data jobs.",
        avatar_url: "",
        resume_completed: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      mockDb.profiles.push(profile);
    }
    return profile;
  },

  updateProfile: (userId: string, updates: Partial<UserProfile>): UserProfile => {
    const profile = mockDb.getProfile(userId);
    Object.assign(profile, updates, { updated_at: new Date().toISOString() });
    return profile;
  }
};
