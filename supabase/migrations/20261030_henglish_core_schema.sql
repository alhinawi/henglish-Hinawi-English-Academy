-- ==============================================================================
-- Henglish Academy (HENGLISH) - COMPREHENSIVE PRODUCTION DATABASE SCHEMA
-- PostgreSQL / Supabase Migration
-- File: supabase/migrations/20261030_henglish_core_schema.sql
-- ==============================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Profiles Table (Extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  full_name_ar TEXT NOT NULL,
  avatar_url TEXT DEFAULT 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
  role TEXT CHECK (role IN ('student', 'teacher', 'admin')) DEFAULT 'student',
  current_level TEXT CHECK (current_level IN ('A1', 'A2', 'B1', 'B2', 'C1', 'C2')) DEFAULT 'A1',
  target_level TEXT CHECK (target_level IN ('A1', 'A2', 'B1', 'B2', 'C1', 'C2')) DEFAULT 'B2',
  xp_points INTEGER DEFAULT 0,
  streak_days INTEGER DEFAULT 1,
  bio TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Courses Table
CREATE TABLE IF NOT EXISTS public.courses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  title_en TEXT NOT NULL,
  title_ar TEXT NOT NULL,
  description_ar TEXT NOT NULL,
  level TEXT NOT NULL,
  category TEXT NOT NULL,
  thumbnail_url TEXT,
  is_flagship BOOLEAN DEFAULT FALSE,
  is_published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Lessons Table
CREATE TABLE IF NOT EXISTS public.lessons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
  lesson_number INTEGER NOT NULL,
  slug TEXT NOT NULL,
  title_en TEXT NOT NULL,
  title_ar TEXT NOT NULL,
  kicker TEXT,
  description_ar TEXT NOT NULL,
  read_time_minutes INTEGER DEFAULT 8,
  image_url TEXT,
  formula_json JSONB,
  timeline_json JSONB,
  egyptian_tips_json JSONB,
  common_traps_json JSONB,
  is_published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(course_id, lesson_number)
);

-- 5. Grammar Rules Table
CREATE TABLE IF NOT EXISTS public.grammar_topics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  topic_slug TEXT UNIQUE NOT NULL,
  order_index INTEGER NOT NULL,
  category_ar TEXT NOT NULL,
  category_en TEXT NOT NULL,
  title_ar TEXT NOT NULL,
  title_en TEXT NOT NULL,
  level TEXT NOT NULL,
  golden_formula TEXT NOT NULL,
  negative_formula TEXT NOT NULL,
  question_formula TEXT NOT NULL,
  summary_ar TEXT NOT NULL,
  timeline_description TEXT NOT NULL,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Questions Bank Table
CREATE TABLE IF NOT EXISTS public.questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lesson_id UUID REFERENCES public.lessons(id) ON DELETE SET NULL,
  grammar_topic_id UUID REFERENCES public.grammar_topics(id) ON DELETE SET NULL,
  skill TEXT CHECK (skill IN ('grammar', 'vocabulary', 'reading', 'listening', 'usage')) NOT NULL,
  type TEXT CHECK (type IN ('multiple-choice', 'fill-blank', 'error-correction', 'word-order', 'matching')) NOT NULL,
  cefr_level TEXT NOT NULL,
  prompt TEXT NOT NULL,
  prompt_ar TEXT,
  passage TEXT,
  audio_text TEXT,
  options JSONB NOT NULL,
  correct_answer_index INTEGER NOT NULL,
  explanation_ar TEXT NOT NULL,
  topic_tag TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Lesson Progress Table
CREATE TABLE IF NOT EXISTS public.lesson_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  lesson_id TEXT NOT NULL, -- references either lesson UUID or slug
  completed BOOLEAN DEFAULT TRUE,
  score_percentage INTEGER,
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, lesson_id)
);

-- 8. Quiz Attempts Table
CREATE TABLE IF NOT EXISTS public.quiz_attempts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  quiz_id TEXT NOT NULL,
  score INTEGER NOT NULL,
  total INTEGER NOT NULL,
  percentage INTEGER NOT NULL,
  attempt_date TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Real-Life Simulation Scenarios Table
CREATE TABLE IF NOT EXISTS public.simulation_scenarios (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  title_en TEXT NOT NULL,
  title_ar TEXT NOT NULL,
  category TEXT NOT NULL,
  level TEXT NOT NULL,
  location_name TEXT NOT NULL,
  backdrop_image TEXT,
  description_ar TEXT NOT NULL,
  reward_xp INTEGER DEFAULT 100,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Certificates Table
CREATE TABLE IF NOT EXISTS public.certificates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  certificate_code TEXT UNIQUE NOT NULL,
  student_name_en TEXT NOT NULL,
  student_name_ar TEXT NOT NULL,
  course_title_en TEXT NOT NULL,
  course_title_ar TEXT NOT NULL,
  cefr_level TEXT NOT NULL,
  final_score_percentage INTEGER NOT NULL,
  issued_at TIMESTAMPTZ DEFAULT NOW(),
  status TEXT CHECK (status IN ('valid', 'revoked')) DEFAULT 'valid'
);

-- 11. Personal Notes & Bookmarks Table
CREATE TABLE IF NOT EXISTS public.user_notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  lesson_id TEXT NOT NULL,
  lesson_title TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.user_bookmarks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  route TEXT NOT NULL,
  lesson_id TEXT,
  title TEXT NOT NULL,
  subtitle TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. AI Conversations Table
CREATE TABLE IF NOT EXISTS public.ai_conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  mode TEXT NOT NULL,
  prompt TEXT NOT NULL,
  response TEXT NOT NULL,
  corrections_json JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. Enable Row Level Security (RLS) on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.grammar_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.simulation_scenarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_conversations ENABLE ROW LEVEL SECURITY;

-- 14. Standard RLS Policies:
-- Public can read published courses, lessons, grammar topics, questions, simulations
CREATE POLICY "Public can view published courses" ON public.courses FOR SELECT USING (is_published = true);
CREATE POLICY "Public can view published lessons" ON public.lessons FOR SELECT USING (is_published = true);
CREATE POLICY "Public can view grammar topics" ON public.grammar_topics FOR SELECT USING (true);
CREATE POLICY "Public can view questions" ON public.questions FOR SELECT USING (true);
CREATE POLICY "Public can view simulation scenarios" ON public.simulation_scenarios FOR SELECT USING (true);
CREATE POLICY "Public can verify valid certificates" ON public.certificates FOR SELECT USING (status = 'valid');

-- Users can read and update their own profile and records
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can manage own progress" ON public.lesson_progress FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own quiz attempts" ON public.quiz_attempts FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own certificates" ON public.certificates FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own notes" ON public.user_notes FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own bookmarks" ON public.user_bookmarks FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can view own AI conversations" ON public.ai_conversations FOR ALL USING (auth.uid() = user_id);

-- 15. Indexes for High Performance
CREATE INDEX IF NOT EXISTS idx_lessons_course_id ON public.lessons(course_id);
CREATE INDEX IF NOT EXISTS idx_questions_skill_level ON public.questions(skill, cefr_level);
CREATE INDEX IF NOT EXISTS idx_lesson_progress_user ON public.lesson_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_user ON public.quiz_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_certificates_code ON public.certificates(certificate_code);
