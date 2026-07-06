// Shared TypeScript Types for EmpowerRural

export type UserRole = 'youth' | 'admin' | 'panchayat';

export interface UserProfile {
  id: string;
  email: string;
  role: UserRole;
  full_name: string;
  mobile?: string;
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  age?: number;
  income_annual?: number;
  qualification?: string;
  state?: string;
  district?: string;
  skills: string[];
  bio?: string;
  avatar_url?: string;
  resume_completed: boolean;
  created_at: string;
  updated_at: string;
}

export type JobType = 'government' | 'private' | 'remote' | 'internship';
export type LocationType = 'on_site' | 'remote' | 'hybrid';

export interface Job {
  id: string;
  title: string;
  company: string;
  logo_url?: string;
  description: string;
  requirements: string[];
  benefits: string[];
  salary_range: string;
  location_type: LocationType;
  type: JobType;
  state: string;
  district: string;
  qualification: string;
  category: string; // e.g., 'IT', 'Agriculture', 'Teaching', 'Manual'
  apply_url?: string;
  is_featured: boolean;
  created_at: string;
}

export type ApplicationStatus = 'applied' | 'interviewing' | 'selected' | 'rejected';

export interface JobApplication {
  id: string;
  user_id: string;
  job_id: string;
  job_title?: string;
  company_name?: string;
  resume_url?: string;
  status: ApplicationStatus;
  applied_at: string;
}

export type CourseType = 'online' | 'offline';
export type PriceType = 'free' | 'paid';

export interface Course {
  id: string;
  title: string;
  provider: string; // e.g., PMKVY, SWAYAM, NPTEL, Skill India
  category: string; // e.g., AI, Programming, Plumbing, Tailoring, Electrician
  type: CourseType;
  price_type: PriceType;
  price?: number;
  duration: string; // e.g., "12 weeks", "40 hours"
  url: string;
  description: string;
  image_url?: string;
  certified: boolean;
  syllabus?: string[];
  is_trending: boolean;
  created_at: string;
}

export interface Scheme {
  id: string;
  name: string;
  sponsor: 'central' | 'state';
  state?: string; // Empty for central schemes
  category: string; // e.g., Skill Development, Self Employment, Farming, Education
  description: string;
  benefits: string;
  eligibility: {
    min_age?: number;
    max_age?: number;
    genders?: string[];
    max_income?: number;
    qualifications?: string[];
    states?: string[];
  };
  apply_steps: string[];
  link: string;
  is_featured: boolean;
  created_at: string;
}

export interface ResumeSectionPersonal {
  name: string;
  email: string;
  phone: string;
  location: string;
  summary: string;
  linkedin_url?: string;
  portfolio_url?: string;
}

export interface ResumeSectionEducation {
  school: string;
  degree: string;
  field_of_study: string;
  start_date: string;
  end_date: string;
  grade?: string;
}

export interface ResumeSectionExperience {
  company: string;
  role: string;
  location: string;
  start_date: string;
  end_date: string;
  description: string;
}

export interface ResumeSectionProject {
  name: string;
  description: string;
  link?: string;
}

export interface ResumeData {
  personal: ResumeSectionPersonal;
  education: ResumeSectionEducation[];
  experience: ResumeSectionExperience[];
  skills: string[];
  projects: ResumeSectionProject[];
}

export interface UserResume {
  id: string;
  user_id: string;
  resume_data: ResumeData;
  template_name: string;
  version: number;
  created_at: string;
  updated_at: string;
}

export interface InterviewQuestion {
  id: string;
  category: 'hr' | 'technical';
  sub_category?: string; // e.g. "React", "Electrical", "Agriculture"
  question: string;
  hints?: string[];
  sample_answer: string;
}

export interface InterviewProgress {
  id: string;
  user_id: string;
  category: 'hr' | 'technical';
  score: number;
  transcript: {
    question: string;
    answer: string;
    score: number;
    feedback: string;
  }[];
  completed_at: string;
}

export interface Bookmark {
  id: string;
  user_id: string;
  item_type: 'job' | 'course' | 'scheme';
  item_id: string;
  created_at: string;
}

export type NotificationType = 'application_update' | 'new_scheme' | 'new_job' | 'course_reminder' | 'interview_reminder' | 'system';

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: NotificationType;
  read: boolean;
  created_at: string;
}

export interface SystemFeedback {
  id: string;
  user_id?: string;
  name: string;
  email: string;
  message: string;
  moderated: boolean;
  created_at: string;
}

export interface ActivityLog {
  id: string;
  user_id: string;
  action: string; // e.g., "apply_job", "bookmark_scheme", "create_resume"
  details: string;
  created_at: string;
}

export interface CareerPath {
  id: string;
  title: string;
  category: 'engineering' | 'government' | 'agriculture' | 'teaching' | 'private' | 'skill_based';
  description: string;
  steps: {
    title: string;
    description: string;
    skills_to_learn: string[];
    resources: { title: string; url: string }[];
  }[];
  expected_salary: string;
  job_outlook: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: {
    text: string;
    scoreMap: { [key: string]: number }; // e.g. { engineering: 3, agriculture: 1 }
  }[];
}

export interface QuizResult {
  id: string;
  user_id: string;
  scores: { [key: string]: number };
  recommended_paths: string[];
  taken_at: string;
}

export interface LearningProgress {
  id: string;
  user_id: string;
  course_id: string;
  progress_percent: number;
  completed: boolean;
  certificates_earned: boolean;
  certificate_url?: string;
  updated_at: string;
}

