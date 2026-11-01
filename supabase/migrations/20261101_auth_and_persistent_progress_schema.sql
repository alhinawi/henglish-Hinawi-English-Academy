-- ==============================================================================
-- Henglish Academy (HENGLISH) - COMPLETE PRODUCTION AUTHENTICATION,
-- ROLE-BASED ACCESS CONTROL (RBAC) & PERSISTENT DATABASE PROGRESS SCHEMA
-- PostgreSQL / Supabase Migration
-- File: supabase/migrations/20261101_auth_and_persistent_progress_schema.sql
-- ==============================================================================

-- 1. Extend public.profiles table with additional auth & security columns
ALTER TABLE public.profiles 
  ADD COLUMN IF NOT EXISTS username TEXT UNIQUE,
  ADD COLUMN IF NOT EXISTS phone TEXT,
  ADD COLUMN IF NOT EXISTS account_status TEXT CHECK (account_status IN ('active', 'suspended', 'pending_verification')) DEFAULT 'active',
  ADD COLUMN IF NOT EXISTS is_email_verified BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS email_verified_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}'::jsonb;

-- 2. User Learning Progress Aggregate Table (Source of truth for student state)
CREATE TABLE IF NOT EXISTS public.user_learning_progress (
  user_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  total_xp INTEGER DEFAULT 0,
  current_level TEXT CHECK (current_level IN ('A1', 'A2', 'B1', 'B2', 'C1', 'C2')) DEFAULT 'A1',
  target_level TEXT CHECK (target_level IN ('A1', 'A2', 'B1', 'B2', 'C1', 'C2')) DEFAULT 'B2',
  streak_days INTEGER DEFAULT 1,
  last_study_date DATE DEFAULT CURRENT_DATE,
  completed_lessons TEXT[] DEFAULT ARRAY[]::TEXT[],
  completed_rules TEXT[] DEFAULT ARRAY[]::TEXT[],
  quiz_scores JSONB DEFAULT '{}'::jsonb,
  total_study_time_minutes INTEGER DEFAULT 0,
  daily_goal_target INTEGER DEFAULT 1,
  daily_goal_current INTEGER DEFAULT 0,
  daily_goal_completed BOOLEAN DEFAULT FALSE,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Detailed Vocabulary SRS Progress Table (Spaced Repetition System)
CREATE TABLE IF NOT EXISTS public.user_vocabulary_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  word_id TEXT NOT NULL,
  headword TEXT NOT NULL,
  status TEXT CHECK (status IN ('learning', 'reviewed', 'mastered')) DEFAULT 'learning',
  repetition_count INTEGER DEFAULT 0,
  interval_days INTEGER DEFAULT 1,
  ease_factor NUMERIC(3,2) DEFAULT 2.50,
  next_review_at TIMESTAMPTZ DEFAULT NOW(),
  last_reviewed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, word_id)
);

-- 4. Grammar Mastery Tracking Table
CREATE TABLE IF NOT EXISTS public.user_grammar_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  rule_id TEXT NOT NULL,
  rule_title TEXT NOT NULL,
  category TEXT NOT NULL,
  quiz_attempts INTEGER DEFAULT 0,
  best_score INTEGER DEFAULT 0,
  is_mastered BOOLEAN DEFAULT FALSE,
  mastered_at TIMESTAMPTZ,
  last_practiced_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, rule_id)
);

-- 5. User Achievements & Badges Table
CREATE TABLE IF NOT EXISTS public.user_achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  badge_id TEXT NOT NULL,
  badge_title TEXT NOT NULL,
  badge_category TEXT NOT NULL,
  unlocked_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, badge_id)
);

-- 6. User Learning Preferences & Audio Settings Table
CREATE TABLE IF NOT EXISTS public.user_learning_preferences (
  user_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  preferred_accent TEXT DEFAULT 'US',
  preferred_voice_id TEXT DEFAULT 'male-natural',
  preferred_voice_gender TEXT DEFAULT 'male',
  speech_rate NUMERIC(3,2) DEFAULT 1.0,
  daily_xp_goal INTEGER DEFAULT 50,
  theme TEXT DEFAULT 'dark',
  audio_autoplay BOOLEAN DEFAULT FALSE,
  sound_effects_enabled BOOLEAN DEFAULT TRUE,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Teacher Class Assignments & Reviews Table (Teacher RBAC)
CREATE TABLE IF NOT EXISTS public.teacher_student_assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  teacher_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  course_code TEXT DEFAULT 'GEN-ENG',
  assigned_at TIMESTAMPTZ DEFAULT NOW(),
  notes TEXT,
  UNIQUE(teacher_id, student_id)
);

-- 8. Enable Row Level Security (RLS) on all persistent tables
ALTER TABLE public.user_learning_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_vocabulary_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_grammar_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_learning_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teacher_student_assignments ENABLE ROW LEVEL SECURITY;

-- 9. RLS Policies:
-- Self Access: Authenticated users can read/write their own records
CREATE POLICY "Users can manage own learning progress" 
  ON public.user_learning_progress FOR ALL 
  USING (auth.uid() = user_id) 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can manage own vocabulary progress" 
  ON public.user_vocabulary_progress FOR ALL 
  USING (auth.uid() = user_id) 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can manage own grammar progress" 
  ON public.user_grammar_progress FOR ALL 
  USING (auth.uid() = user_id) 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can manage own achievements" 
  ON public.user_achievements FOR ALL 
  USING (auth.uid() = user_id) 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can manage own preferences" 
  ON public.user_learning_preferences FOR ALL 
  USING (auth.uid() = user_id) 
  WITH CHECK (auth.uid() = user_id);

-- Teacher Access: Teachers can view assigned student progress
CREATE POLICY "Teachers can view assigned student learning progress" 
  ON public.user_learning_progress FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.teacher_student_assignments tsa
      JOIN public.profiles p ON p.id = tsa.teacher_id
      WHERE tsa.teacher_id = auth.uid() 
        AND tsa.student_id = public.user_learning_progress.user_id
        AND p.role IN ('teacher', 'admin')
    )
  );

CREATE POLICY "Teachers can view assigned students" 
  ON public.teacher_student_assignments FOR ALL 
  USING (
    auth.uid() = teacher_id OR 
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Admin Access: Admins have full read/write on all progress & assignments
CREATE POLICY "Admins full access on user_learning_progress" 
  ON public.user_learning_progress FOR ALL 
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- 10. Automated Profile Creation Trigger for Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_auth_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (
    id, 
    email, 
    full_name, 
    full_name_ar, 
    role, 
    current_level, 
    target_level, 
    avatar_url,
    is_email_verified
  ) VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'full_name_ar', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'role', 'student'),
    COALESCE(NEW.raw_user_meta_data->>'current_level', 'A1'),
    COALESCE(NEW.raw_user_meta_data->>'target_level', 'B2'),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'),
    COALESCE(NEW.email_confirmed_at IS NOT NULL, FALSE)
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    is_email_verified = (NEW.email_confirmed_at IS NOT NULL),
    updated_at = NOW();

  -- Initialize learning progress row
  INSERT INTO public.user_learning_progress (user_id, total_xp, streak_days, current_level, target_level)
  VALUES (NEW.id, 100, 1, 'A1', 'B2')
  ON CONFLICT (user_id) DO NOTHING;

  -- Initialize learning preferences row
  INSERT INTO public.user_learning_preferences (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate trigger on auth.users if not present
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT OR UPDATE ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_auth_user();

-- 11. Performance Indexes
CREATE INDEX IF NOT EXISTS idx_user_vocab_user ON public.user_vocabulary_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_vocab_next_review ON public.user_vocabulary_progress(user_id, next_review_at);
CREATE INDEX IF NOT EXISTS idx_user_grammar_user ON public.user_grammar_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_achievements_user ON public.user_achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_teacher_assignments ON public.teacher_student_assignments(teacher_id, student_id);

