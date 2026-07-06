-- EMPOWERRURAL Supabase PostgreSQL Database Schema
-- Location: supabase/schema.sql

-- Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==========================================
-- 1. REGIONAL GEOGRAPHY DATA TABLES
-- ==========================================
CREATE TABLE IF NOT EXISTS states (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS districts (
  id SERIAL PRIMARY KEY,
  state_id INTEGER REFERENCES states(id) ON DELETE CASCADE NOT NULL,
  name VARCHAR(100) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(state_id, name)
);

-- ==========================================
-- 2. USER PROFILES
-- ==========================================
CREATE TYPE user_role AS ENUM ('youth', 'admin', 'panchayat');

CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) UNIQUE NOT NULL,
  role user_role DEFAULT 'youth'::user_role NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  mobile VARCHAR(15),
  gender VARCHAR(20),
  age INTEGER,
  income_annual NUMERIC(12, 2),
  qualification VARCHAR(150),
  state VARCHAR(100),
  district VARCHAR(100),
  bio TEXT,
  avatar_url TEXT,
  resume_completed BOOLEAN DEFAULT false NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Index for searching users by region
CREATE INDEX IF NOT EXISTS idx_profiles_region ON profiles(state, district);

-- ==========================================
-- 3. SKILLS MASTER & USER MATRIX
-- ==========================================
CREATE TABLE IF NOT EXISTS skills (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  category VARCHAR(100), -- e.g., Technical, Manual, Soft Skill
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS user_skills (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  skill_id INTEGER REFERENCES skills(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id, skill_id)
);

-- ==========================================
-- 4. JOBS AND APPLICATIONS
-- ==========================================
CREATE TYPE job_type AS ENUM ('government', 'private', 'remote', 'internship');
CREATE TYPE location_type AS ENUM ('on_site', 'remote', 'hybrid');

CREATE TABLE IF NOT EXISTS jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  company VARCHAR(255) NOT NULL,
  logo_url TEXT,
  description TEXT NOT NULL,
  requirements TEXT[] DEFAULT '{}'::TEXT[] NOT NULL,
  benefits TEXT[] DEFAULT '{}'::TEXT[] NOT NULL,
  salary_range VARCHAR(100) NOT NULL,
  location_type location_type DEFAULT 'on_site'::location_type NOT NULL,
  type job_type DEFAULT 'private'::job_type NOT NULL,
  state VARCHAR(100) NOT NULL,
  district VARCHAR(100) NOT NULL,
  qualification VARCHAR(150) NOT NULL,
  category VARCHAR(100) NOT NULL,
  apply_url TEXT,
  is_featured BOOLEAN DEFAULT false NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_jobs_search ON jobs(state, district, type, qualification);

CREATE TYPE application_status AS ENUM ('applied', 'interviewing', 'selected', 'rejected');

CREATE TABLE IF NOT EXISTS job_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  job_id UUID REFERENCES jobs(id) ON DELETE CASCADE NOT NULL,
  resume_url TEXT,
  status application_status DEFAULT 'applied'::application_status NOT NULL,
  applied_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id, job_id)
);

-- ==========================================
-- 5. COURSES AND LEARNING PROGRESS
-- ==========================================
CREATE TYPE course_medium AS ENUM ('online', 'offline');
CREATE TYPE price_type AS ENUM ('free', 'paid');

CREATE TABLE IF NOT EXISTS courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  provider VARCHAR(150) NOT NULL, -- e.g. SWAYAM, Skill India
  category VARCHAR(150) NOT NULL, -- e.g. Programming, Electrician
  type course_medium DEFAULT 'online'::course_medium NOT NULL,
  price_type price_type DEFAULT 'free'::price_type NOT NULL,
  price NUMERIC(10, 2) DEFAULT 0.00,
  duration VARCHAR(100) NOT NULL,
  url TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT,
  certified BOOLEAN DEFAULT false NOT NULL,
  syllabus TEXT[] DEFAULT '{}'::TEXT[] NOT NULL,
  is_trending BOOLEAN DEFAULT false NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS learning_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE NOT NULL,
  progress_percent INTEGER DEFAULT 0 NOT NULL,
  completed BOOLEAN DEFAULT false NOT NULL,
  certificates_earned BOOLEAN DEFAULT false NOT NULL,
  certificate_url TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id, course_id)
);

-- ==========================================
-- 6. GOVERNMENT SCHEMES
-- ==========================================
CREATE TABLE IF NOT EXISTS schemes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  sponsor VARCHAR(50) NOT NULL, -- e.g., 'central' or 'state'
  state VARCHAR(100), -- populated if state scheme
  category VARCHAR(150) NOT NULL,
  description TEXT NOT NULL,
  benefits TEXT NOT NULL,
  eligibility JSONB DEFAULT '{}'::jsonb NOT NULL,
  apply_steps TEXT[] DEFAULT '{}'::TEXT[] NOT NULL,
  link TEXT NOT NULL,
  is_featured BOOLEAN DEFAULT false NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==========================================
-- 7. BOOKMARKS
-- ==========================================
CREATE TYPE bookmark_type AS ENUM ('job', 'course', 'scheme');

CREATE TABLE IF NOT EXISTS bookmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  item_type bookmark_type NOT NULL,
  item_id UUID NOT NULL, -- references jobs, courses, or schemes id
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id, item_type, item_id)
);

-- ==========================================
-- 8. RESUMES SYSTEM
-- ==========================================
CREATE TABLE IF NOT EXISTS resumes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE UNIQUE NOT NULL,
  resume_data JSONB DEFAULT '{}'::jsonb NOT NULL,
  template_name VARCHAR(100) DEFAULT 'modern' NOT NULL,
  version INTEGER DEFAULT 1 NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==========================================
-- 9. CAREER QUIZ AND ROADMAPS
-- ==========================================
CREATE TABLE IF NOT EXISTS career_paths (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  steps JSONB DEFAULT '[]'::jsonb NOT NULL, -- roadmap timeline
  expected_salary VARCHAR(100),
  job_outlook VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS quiz_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question TEXT NOT NULL,
  options JSONB NOT NULL, -- text and career path score map
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS quiz_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  scores JSONB NOT NULL, -- category scores
  recommended_paths TEXT[] DEFAULT '{}'::TEXT[] NOT NULL,
  taken_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==========================================
-- 10. MOCK INTERVIEWS SYSTEM
-- ==========================================
CREATE TABLE IF NOT EXISTS interview_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category VARCHAR(50) NOT NULL, -- e.g. 'hr' or 'technical'
  sub_category VARCHAR(100), -- e.g. 'React', 'Agriculture', 'Electrical'
  question TEXT NOT NULL,
  hints TEXT[] DEFAULT '{}'::TEXT[],
  sample_answer TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS interview_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  category VARCHAR(50) NOT NULL,
  score INTEGER DEFAULT 0 NOT NULL,
  transcript JSONB DEFAULT '[]'::jsonb NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==========================================
-- 11. NOTIFICATIONS
-- ==========================================
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(50) DEFAULT 'system' NOT NULL,
  read BOOLEAN DEFAULT false NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_notifications_unread ON notifications(user_id, read);

-- ==========================================
-- 12. FEEDBACK AND AUDIT LOGS
-- ==========================================
CREATE TABLE IF NOT EXISTS feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  moderated BOOLEAN DEFAULT false NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  action VARCHAR(150) NOT NULL,
  details TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==========================================
-- 13. AUTOMATED DB PROFILE CREATION PATTERN
-- ==========================================
-- Automatically create profile row when user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    COALESCE((new.raw_user_meta_data->>'role')::public.user_role, 'youth'::public.user_role)
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger definition
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==========================================
-- 14. ROW-LEVEL SECURITY (RLS) POLICIES
-- ==========================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE schemes ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE resumes ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE interview_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Public profiles can be read by authenticated users" ON profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can edit their own profiles" ON profiles FOR UPDATE TO authenticated USING (auth.uid() = id);

-- Jobs Policies
CREATE POLICY "Anyone can view job listings" ON jobs FOR SELECT USING (true);
CREATE POLICY "Admins can insert/edit jobs" ON jobs FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'::user_role)
);

-- Schemes Policies
CREATE POLICY "Anyone can view schemes" ON schemes FOR SELECT USING (true);
CREATE POLICY "Admins can manage schemes" ON schemes FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'::user_role)
);

-- Courses Policies
CREATE POLICY "Anyone can view courses" ON courses FOR SELECT USING (true);
CREATE POLICY "Admins can manage courses" ON courses FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'::user_role)
);

-- Job Applications Policies
CREATE POLICY "Users can view their own job applications" ON job_applications FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can apply for jobs" ON job_applications FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins/Panchayat can read all job applications" ON job_applications FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND (profiles.role = 'admin'::user_role OR profiles.role = 'panchayat'::user_role))
);

-- Bookmarks Policies
CREATE POLICY "Users can manage their own bookmarks" ON bookmarks FOR ALL TO authenticated USING (auth.uid() = user_id);

-- Resumes Policies
CREATE POLICY "Users can manage their own resumes" ON resumes FOR ALL TO authenticated USING (auth.uid() = user_id);

-- Notifications Policies
CREATE POLICY "Users can manage their own notifications" ON notifications FOR ALL TO authenticated USING (auth.uid() = user_id);
