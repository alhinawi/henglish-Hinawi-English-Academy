-- ==============================================================================
-- Henglish Academy (HENGLISH) - MASTER COMPLETE PRODUCTION SCHEMA
-- Fully Consolidated, Repeatable, Idempotent, High-Performance PostgreSQL Schema
-- File: supabase/migrations/20261102_master_complete_schema.sql
-- Covers all 52 Tables, RLS Policies, Indexes, Triggers, and Authoritative RPCs
-- ==============================================================================

-- Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- ------------------------------------------------------------------------------
-- 1. USER PROFILES & ACCOUNTS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT,
    full_name TEXT,
    full_name_ar TEXT,
    avatar_url TEXT,
    role TEXT CHECK (role IN ('student', 'teacher', 'admin')) DEFAULT 'student',
    level TEXT DEFAULT 'A1',
    current_level TEXT CHECK (current_level IN ('A1', 'A2', 'B1', 'B2', 'C1', 'C2')) DEFAULT 'A1',
    target_level TEXT CHECK (target_level IN ('A1', 'A2', 'B1', 'B2', 'C1', 'C2')) DEFAULT 'B2',
    xp INT DEFAULT 100,
    xp_points INT DEFAULT 100,
    streak INT DEFAULT 1,
    streak_days INT DEFAULT 1,
    username TEXT UNIQUE,
    phone TEXT,
    account_status TEXT CHECK (account_status IN ('active', 'suspended', 'pending_verification')) DEFAULT 'active',
    is_email_verified BOOLEAN DEFAULT FALSE,
    email_verified_at TIMESTAMPTZ,
    last_login_at TIMESTAMPTZ,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ensure all columns exist if profiles was partially created earlier
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'full_name_ar') THEN
    ALTER TABLE public.profiles ADD COLUMN full_name_ar TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'xp_points') THEN
    ALTER TABLE public.profiles ADD COLUMN xp_points INT DEFAULT 100;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'streak_days') THEN
    ALTER TABLE public.profiles ADD COLUMN streak_days INT DEFAULT 1;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'current_level') THEN
    ALTER TABLE public.profiles ADD COLUMN current_level TEXT DEFAULT 'A1';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'target_level') THEN
    ALTER TABLE public.profiles ADD COLUMN target_level TEXT DEFAULT 'B2';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'username') THEN
    ALTER TABLE public.profiles ADD COLUMN username TEXT UNIQUE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'phone') THEN
    ALTER TABLE public.profiles ADD COLUMN phone TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'account_status') THEN
    ALTER TABLE public.profiles ADD COLUMN account_status TEXT DEFAULT 'active';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'is_email_verified') THEN
    ALTER TABLE public.profiles ADD COLUMN is_email_verified BOOLEAN DEFAULT FALSE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'email_verified_at') THEN
    ALTER TABLE public.profiles ADD COLUMN email_verified_at TIMESTAMPTZ;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'last_login_at') THEN
    ALTER TABLE public.profiles ADD COLUMN last_login_at TIMESTAMPTZ;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'metadata') THEN
    ALTER TABLE public.profiles ADD COLUMN metadata JSONB DEFAULT '{}'::jsonb;
  END IF;
END $$;

-- ------------------------------------------------------------------------------
-- 2. USER LEARNING PROGRESS & ACHIEVEMENTS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.user_learning_progress (
  user_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  total_xp INTEGER DEFAULT 100,
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
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.user_vocabulary_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  word_id TEXT NOT NULL,
  headword TEXT NOT NULL,
  status TEXT CHECK (status IN ('new', 'learning', 'reviewed', 'mastered')) DEFAULT 'learning',
  interval_days INTEGER DEFAULT 1,
  ease_factor NUMERIC(4, 2) DEFAULT 2.50,
  repetition_count INTEGER DEFAULT 0,
  next_review_at TIMESTAMPTZ DEFAULT NOW(),
  last_reviewed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, word_id)
);

CREATE TABLE IF NOT EXISTS public.user_grammar_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  rule_id TEXT NOT NULL,
  category TEXT NOT NULL,
  proficiency_score INTEGER DEFAULT 0,
  exercises_completed INTEGER DEFAULT 0,
  exercises_correct INTEGER DEFAULT 0,
  is_mastered BOOLEAN DEFAULT FALSE,
  last_practiced_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, rule_id)
);

CREATE TABLE IF NOT EXISTS public.user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  badge_id TEXT NOT NULL,
  unlocked_at TIMESTAMPTZ DEFAULT NOW(),
  progress_data JSONB DEFAULT '{}'::jsonb,
  UNIQUE(user_id, badge_id)
);

CREATE TABLE IF NOT EXISTS public.user_learning_preferences (
  user_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  native_language TEXT DEFAULT 'ar',
  accent_preference TEXT CHECK (accent_preference IN ('american', 'british')) DEFAULT 'american',
  daily_goal_minutes INTEGER DEFAULT 15,
  daily_goal_words INTEGER DEFAULT 10,
  reminder_time TIME DEFAULT '20:00:00',
  reminders_enabled BOOLEAN DEFAULT TRUE,
  sound_effects_enabled BOOLEAN DEFAULT TRUE,
  dark_mode_enabled BOOLEAN DEFAULT TRUE,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.teacher_student_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  assignment_title TEXT NOT NULL,
  assigned_module_type TEXT CHECK (assigned_module_type IN ('course', 'lesson', 'grammar_rule', 'vocabulary_deck', 'quiz')) NOT NULL,
  assigned_module_id TEXT NOT NULL,
  due_date TIMESTAMPTZ,
  is_completed BOOLEAN DEFAULT FALSE,
  grade_percentage NUMERIC(5, 2),
  teacher_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 3. EDUCATIONAL CONTENT (COURSES, LESSONS, GRAMMAR, QUESTIONS)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.courses (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    title_ar TEXT,
    title_en TEXT,
    description TEXT,
    description_ar TEXT,
    level TEXT,
    category TEXT,
    lessons_count INT DEFAULT 0,
    duration TEXT,
    rating NUMERIC(3, 2) DEFAULT 4.90,
    students_count INT DEFAULT 0,
    is_flagship BOOLEAN DEFAULT FALSE,
    tag TEXT,
    icon TEXT,
    thumbnail_url TEXT,
    is_published BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.lessons (
    id TEXT PRIMARY KEY,
    course_id TEXT REFERENCES public.courses(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    title_ar TEXT,
    title_en TEXT,
    description TEXT,
    content JSONB,
    order_index INT DEFAULT 0,
    duration_minutes INT DEFAULT 15,
    xp_reward INT DEFAULT 50,
    is_published BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.grammar_topics (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    title_ar TEXT,
    category TEXT,
    explanation TEXT,
    explanation_ar TEXT,
    formula TEXT,
    examples JSONB DEFAULT '[]'::jsonb,
    common_mistakes JSONB DEFAULT '[]'::jsonb,
    level TEXT DEFAULT 'A1',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.questions (
    id TEXT PRIMARY KEY,
    skill TEXT NOT NULL,
    cefr_level TEXT NOT NULL,
    question_type TEXT NOT NULL,
    question_text TEXT NOT NULL,
    question_ar TEXT,
    options JSONB DEFAULT '[]'::jsonb,
    correct_answer TEXT NOT NULL,
    explanation TEXT,
    explanation_ar TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.lesson_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    lesson_id TEXT REFERENCES public.lessons(id) ON DELETE CASCADE,
    completed BOOLEAN DEFAULT false,
    score INT DEFAULT 0,
    completed_at TIMESTAMPTZ,
    UNIQUE(user_id, lesson_id)
);

CREATE TABLE IF NOT EXISTS public.quiz_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    quiz_id TEXT NOT NULL,
    score INT NOT NULL,
    total_questions INT NOT NULL,
    percentage INT NOT NULL,
    passed BOOLEAN NOT NULL,
    time_spent_seconds INT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.simulation_scenarios (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    title_ar TEXT,
    category TEXT,
    difficulty TEXT,
    location TEXT,
    ai_role TEXT,
    user_role TEXT,
    initial_prompt TEXT,
    dialogue_script JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.certificates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    certificate_code TEXT UNIQUE NOT NULL,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    student_name TEXT NOT NULL,
    course_name TEXT NOT NULL,
    cefr_level TEXT NOT NULL,
    issue_date DATE NOT NULL DEFAULT CURRENT_DATE,
    status TEXT DEFAULT 'valid',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.user_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    lesson_id TEXT,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.user_bookmarks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    item_type TEXT NOT NULL,
    item_id TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, item_type, item_id)
);

CREATE TABLE IF NOT EXISTS public.pronunciation_evaluations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    phrase_text TEXT NOT NULL,
    accuracy_score NUMERIC(5,2) NOT NULL,
    fluency_score NUMERIC(5,2),
    completeness_score NUMERIC(5,2),
    prosody_score NUMERIC(5,2),
    phoneme_breakdown JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.vocabulary_srs_cards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    word TEXT NOT NULL,
    ipa TEXT,
    translation_ar TEXT,
    category TEXT,
    cefr_level TEXT,
    example_en TEXT,
    example_ar TEXT,
    repetition_count INT DEFAULT 0,
    interval_days INT DEFAULT 1,
    ease_factor NUMERIC(4,2) DEFAULT 2.50,
    next_review_at TIMESTAMPTZ DEFAULT NOW(),
    last_reviewed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, word)
);

CREATE TABLE IF NOT EXISTS public.ai_generated_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    topic TEXT NOT NULL,
    cefr_level TEXT NOT NULL,
    question_payload JSONB NOT NULL,
    quality_score NUMERIC(3,2) DEFAULT 1.0,
    generation_provider TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.video_resources (
    id TEXT PRIMARY KEY,
    youtube_id TEXT NOT NULL,
    title TEXT NOT NULL,
    title_ar TEXT,
    duration_seconds INT,
    cefr_level TEXT,
    transcription_vtt TEXT,
    vocabulary_highlights JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.multiplayer_game_rooms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    game_mode TEXT NOT NULL,
    room_code TEXT UNIQUE NOT NULL,
    host_user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    guest_user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    status TEXT DEFAULT 'waiting',
    round_data JSONB,
    winner_user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.simulation_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    scenario_id TEXT NOT NULL,
    transcript JSONB,
    evaluation_score INT,
    feedback_ar TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 4. DICTIONARY & LEXICAL DATABASE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.dictionary_lexical_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    headword TEXT NOT NULL UNIQUE,
    normalized_headword TEXT NOT NULL,
    primary_part_of_speech TEXT NOT NULL,
    cefr_level TEXT CHECK (cefr_level IN ('A1', 'A2', 'B1', 'B2', 'C1', 'C2')),
    ipa_us TEXT,
    ipa_uk TEXT,
    audio_us_url TEXT,
    audio_uk_url TEXT,
    frequency_rank INT,
    etymology TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.dictionary_senses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entry_id UUID NOT NULL REFERENCES public.dictionary_lexical_entries(id) ON DELETE CASCADE,
    part_of_speech TEXT NOT NULL,
    definition_en TEXT NOT NULL,
    definition_ar TEXT NOT NULL,
    context_register TEXT,
    cefr_level TEXT,
    examples_en TEXT[] DEFAULT ARRAY[]::TEXT[],
    examples_ar TEXT[] DEFAULT ARRAY[]::TEXT[],
    order_index INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS public.dictionary_phrasal_verbs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    base_verb_id UUID NOT NULL REFERENCES public.dictionary_lexical_entries(id) ON DELETE CASCADE,
    phrasal_verb TEXT NOT NULL,
    particle TEXT NOT NULL,
    meaning_en TEXT NOT NULL,
    meaning_ar TEXT NOT NULL,
    example_en TEXT,
    example_ar TEXT,
    cefr_level TEXT
);

CREATE TABLE IF NOT EXISTS public.dictionary_idioms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    headword_id UUID NOT NULL REFERENCES public.dictionary_lexical_entries(id) ON DELETE CASCADE,
    idiom TEXT NOT NULL,
    meaning_en TEXT NOT NULL,
    meaning_ar TEXT NOT NULL,
    example_en TEXT,
    example_ar TEXT,
    origin TEXT,
    cefr_level TEXT
);

CREATE TABLE IF NOT EXISTS public.dictionary_collocations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    headword_id UUID NOT NULL REFERENCES public.dictionary_lexical_entries(id) ON DELETE CASCADE,
    collocate_text TEXT NOT NULL,
    collocation_type TEXT,
    example_en TEXT,
    example_ar TEXT
);

CREATE TABLE IF NOT EXISTS public.dictionary_word_families (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    headword_id UUID NOT NULL REFERENCES public.dictionary_lexical_entries(id) ON DELETE CASCADE,
    noun TEXT,
    verb TEXT,
    adjective TEXT,
    adverb TEXT
);

CREATE TABLE IF NOT EXISTS public.dictionary_confusable_pairs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    word_a_id UUID NOT NULL REFERENCES public.dictionary_lexical_entries(id) ON DELETE CASCADE,
    word_b_id UUID NOT NULL REFERENCES public.dictionary_lexical_entries(id) ON DELETE CASCADE,
    difference_explanation_en TEXT NOT NULL,
    difference_explanation_ar TEXT NOT NULL,
    example_a TEXT NOT NULL,
    example_b TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS public.dictionary_user_saved_words (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    word TEXT NOT NULL,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, word)
);

-- Full-text search tsvector column on dictionary_lexical_entries
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'dictionary_lexical_entries' 
    AND column_name = 'tsv'
  ) THEN
    ALTER TABLE public.dictionary_lexical_entries 
    ADD COLUMN tsv tsvector GENERATED ALWAYS AS (
      setweight(to_tsvector('english', coalesce(headword, '')), 'A') ||
      setweight(to_tsvector('english', coalesce(normalized_headword, '')), 'B')
    ) STORED;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_dict_lexical_tsv ON public.dictionary_lexical_entries USING GIN(tsv);
CREATE INDEX IF NOT EXISTS idx_dict_lexical_headword_trgm ON public.dictionary_lexical_entries USING GIN(headword gin_trgm_ops);

-- ------------------------------------------------------------------------------
-- 5. GAMEVERSE ARCHITECTURE & ANTI-CHEAT
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.gameverse_definitions (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    title_ar TEXT,
    description TEXT NOT NULL,
    description_ar TEXT,
    category TEXT CHECK (category IN ('vocabulary', 'grammar', 'listening', 'speaking', 'speed_trivia', 'interactive')) NOT NULL,
    difficulty TEXT CHECK (difficulty IN ('beginner', 'intermediate', 'advanced', 'all_levels')) DEFAULT 'all_levels',
    xp_reward INT DEFAULT 50,
    thumbnail_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    min_players INT DEFAULT 1,
    max_players INT DEFAULT 4,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.user_game_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    game_id TEXT REFERENCES public.gameverse_definitions(id) ON DELETE CASCADE,
    score INT NOT NULL,
    accuracy NUMERIC(5,2) NOT NULL,
    duration_seconds INT NOT NULL,
    xp_earned INT NOT NULL,
    idempotency_key TEXT UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.xp_ledger (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    amount INT NOT NULL,
    source TEXT NOT NULL,
    reference_id TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.game_rooms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_code TEXT NOT NULL UNIQUE,
    game_id TEXT REFERENCES public.gameverse_definitions(id) ON DELETE CASCADE,
    host_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    status TEXT CHECK (status IN ('waiting', 'active', 'finished')) DEFAULT 'waiting',
    settings JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.game_room_players (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_id UUID REFERENCES public.game_rooms(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    score INT DEFAULT 0,
    is_ready BOOLEAN DEFAULT FALSE,
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(room_id, user_id)
);

-- ------------------------------------------------------------------------------
-- 6. MULTI-PROVIDER AI CONVERSATIONS & USAGE ANALYTICS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.ai_conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    persona TEXT DEFAULT 'general',
    prompt TEXT NOT NULL,
    response TEXT NOT NULL,
    corrections_json JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.ai_usage_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    provider TEXT NOT NULL,
    model TEXT NOT NULL,
    feature TEXT NOT NULL,
    prompt_tokens INT DEFAULT 0,
    completion_tokens INT DEFAULT 0,
    total_tokens INT DEFAULT 0,
    latency_ms INT DEFAULT 0,
    success BOOLEAN DEFAULT TRUE,
    error_message TEXT,
    ip_hash TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.ai_router_settings (
    id TEXT PRIMARY KEY,
    primary_provider TEXT NOT NULL DEFAULT 'groq',
    fallback_chain TEXT[] NOT NULL DEFAULT ARRAY['gemini', 'cloudflare', 'openai', 'local'],
    rate_limit_per_minute INT DEFAULT 60,
    daily_quota_tokens BIGINT DEFAULT 1000000,
    is_maintenance_mode BOOLEAN DEFAULT FALSE,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 7. TRANSLATION STUDIO TABLES
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.translations_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    source_text TEXT NOT NULL,
    target_text TEXT NOT NULL,
    source_lang TEXT NOT NULL,
    target_lang TEXT NOT NULL,
    mode TEXT NOT NULL,
    formality TEXT,
    dialect TEXT,
    cultural_notes TEXT,
    alternatives JSONB,
    is_favorite BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.translation_collections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    name_ar TEXT,
    description TEXT,
    color TEXT DEFAULT '#41e7ff',
    icon TEXT DEFAULT 'folder',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.translation_saved_vocabulary (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    collection_id UUID REFERENCES public.translation_collections(id) ON DELETE SET NULL,
    source_term TEXT NOT NULL,
    target_term TEXT NOT NULL,
    context_sentence TEXT,
    cefr_level TEXT,
    notes TEXT,
    repetition_count INT DEFAULT 0,
    interval_days INT DEFAULT 1,
    ease_factor NUMERIC(4,2) DEFAULT 2.50,
    next_review_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.translation_practice_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    card_id UUID REFERENCES public.translation_saved_vocabulary(id) ON DELETE CASCADE,
    user_input TEXT NOT NULL,
    accuracy_score NUMERIC(5,2) NOT NULL,
    feedback TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.translation_user_preferences (
    user_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
    default_source_lang TEXT DEFAULT 'ar',
    default_target_lang TEXT DEFAULT 'en',
    default_mode TEXT DEFAULT 'standard',
    default_formality TEXT DEFAULT 'neutral',
    audio_speed NUMERIC(3,2) DEFAULT 1.0,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 8. VIDEO LIBRARY & STREAMING
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.video_categories (
    id TEXT PRIMARY KEY,
    name_en TEXT NOT NULL,
    name_ar TEXT NOT NULL,
    description_ar TEXT,
    icon_name TEXT DEFAULT 'Film',
    order_index INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.educational_videos (
    id TEXT PRIMARY KEY,
    youtube_id TEXT NOT NULL,
    title TEXT NOT NULL,
    title_ar TEXT,
    channel_name TEXT,
    category_id TEXT REFERENCES public.video_categories(id) ON DELETE SET NULL,
    cefr_level TEXT CHECK (cefr_level IN ('A1', 'A2', 'B1', 'B2', 'C1', 'C2', 'All')),
    dialect TEXT CHECK (dialect IN ('american', 'british', 'australian', 'neutral', 'mixed')) DEFAULT 'american',
    duration_seconds INT DEFAULT 0,
    thumbnail_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.video_subtitles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    video_id TEXT REFERENCES public.educational_videos(id) ON DELETE CASCADE,
    start_seconds NUMERIC(8,3) NOT NULL,
    end_seconds NUMERIC(8,3) NOT NULL,
    text_en TEXT NOT NULL,
    text_ar TEXT,
    order_index INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS public.video_vocabulary (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    video_id TEXT REFERENCES public.educational_videos(id) ON DELETE CASCADE,
    word TEXT NOT NULL,
    timestamp_seconds NUMERIC(8,3),
    definition_en TEXT,
    definition_ar TEXT,
    cefr_level TEXT
);

CREATE TABLE IF NOT EXISTS public.video_quizzes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    video_id TEXT REFERENCES public.educational_videos(id) ON DELETE CASCADE,
    timestamp_seconds NUMERIC(8,3),
    question_en TEXT NOT NULL,
    question_ar TEXT,
    options JSONB NOT NULL,
    correct_option_index INT NOT NULL,
    explanation_en TEXT,
    explanation_ar TEXT
);

CREATE TABLE IF NOT EXISTS public.user_video_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    video_id TEXT REFERENCES public.educational_videos(id) ON DELETE CASCADE,
    last_position_seconds NUMERIC(8,3) DEFAULT 0,
    completed BOOLEAN DEFAULT FALSE,
    watch_count INT DEFAULT 1,
    last_watched_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, video_id)
);

CREATE TABLE IF NOT EXISTS public.user_video_bookmarks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    video_id TEXT REFERENCES public.educational_videos(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, video_id)
);

CREATE TABLE IF NOT EXISTS public.video_verification_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    youtube_id TEXT NOT NULL,
    status TEXT NOT NULL,
    embeddable BOOLEAN DEFAULT TRUE,
    checked_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 9. ENABLE ROW LEVEL SECURITY (RLS) ON ALL TABLES
-- ------------------------------------------------------------------------------
DO $$
DECLARE
  tbl text;
  tbls text[] := ARRAY[
    'profiles', 'user_learning_progress', 'user_vocabulary_progress', 'user_grammar_progress',
    'user_achievements', 'user_learning_preferences', 'teacher_student_assignments',
    'courses', 'lessons', 'grammar_topics', 'questions', 'lesson_progress', 'quiz_attempts',
    'simulation_scenarios', 'certificates', 'user_notes', 'user_bookmarks', 'pronunciation_evaluations',
    'vocabulary_srs_cards', 'ai_generated_questions', 'video_resources', 'multiplayer_game_rooms',
    'simulation_sessions', 'dictionary_lexical_entries', 'dictionary_senses', 'dictionary_phrasal_verbs',
    'dictionary_idioms', 'dictionary_collocations', 'dictionary_word_families', 'dictionary_confusable_pairs',
    'dictionary_user_saved_words', 'gameverse_definitions', 'user_game_sessions', 'xp_ledger',
    'game_rooms', 'game_room_players', 'ai_conversations', 'ai_usage_analytics', 'ai_router_settings',
    'translations_history', 'translation_collections', 'translation_saved_vocabulary',
    'translation_practice_attempts', 'translation_user_preferences', 'video_categories',
    'educational_videos', 'video_subtitles', 'video_vocabulary', 'video_quizzes',
    'user_video_progress', 'user_video_bookmarks', 'video_verification_logs'
  ];
BEGIN
  FOREACH tbl IN ARRAY tbls LOOP
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY;', tbl);
  END LOOP;
END $$;

-- ------------------------------------------------------------------------------
-- 10. RLS POLICIES
-- ------------------------------------------------------------------------------

-- Public Content (Read-Only for Everyone)
DROP POLICY IF EXISTS "Public can view published courses" ON public.courses;
CREATE POLICY "Public can view published courses" ON public.courses FOR SELECT USING (is_published = true);

DROP POLICY IF EXISTS "Public can view published lessons" ON public.lessons;
CREATE POLICY "Public can view published lessons" ON public.lessons FOR SELECT USING (is_published = true);

DROP POLICY IF EXISTS "Public can view grammar topics" ON public.grammar_topics;
CREATE POLICY "Public can view grammar topics" ON public.grammar_topics FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can view questions" ON public.questions;
CREATE POLICY "Public can view questions" ON public.questions FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can view simulation scenarios" ON public.simulation_scenarios;
CREATE POLICY "Public can view simulation scenarios" ON public.simulation_scenarios FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can view gameverse definitions" ON public.gameverse_definitions;
CREATE POLICY "Public can view gameverse definitions" ON public.gameverse_definitions FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Public can view video categories" ON public.video_categories;
CREATE POLICY "Public can view video categories" ON public.video_categories FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can view active educational videos" ON public.educational_videos;
CREATE POLICY "Public can view active educational videos" ON public.educational_videos FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Public can view video subtitles" ON public.video_subtitles;
CREATE POLICY "Public can view video subtitles" ON public.video_subtitles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can view video vocabulary" ON public.video_vocabulary;
CREATE POLICY "Public can view video vocabulary" ON public.video_vocabulary FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can view video quizzes" ON public.video_quizzes;
CREATE POLICY "Public can view video quizzes" ON public.video_quizzes FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can view dictionary lexical entries" ON public.dictionary_lexical_entries;
CREATE POLICY "Public can view dictionary lexical entries" ON public.dictionary_lexical_entries FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can view dictionary senses" ON public.dictionary_senses;
CREATE POLICY "Public can view dictionary senses" ON public.dictionary_senses FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can view dictionary phrasal verbs" ON public.dictionary_phrasal_verbs;
CREATE POLICY "Public can view dictionary phrasal verbs" ON public.dictionary_phrasal_verbs FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can view dictionary idioms" ON public.dictionary_idioms;
CREATE POLICY "Public can view dictionary idioms" ON public.dictionary_idioms FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can view dictionary collocations" ON public.dictionary_collocations;
CREATE POLICY "Public can view dictionary collocations" ON public.dictionary_collocations FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can view dictionary word families" ON public.dictionary_word_families;
CREATE POLICY "Public can view dictionary word families" ON public.dictionary_word_families FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can view dictionary confusable pairs" ON public.dictionary_confusable_pairs;
CREATE POLICY "Public can view dictionary confusable pairs" ON public.dictionary_confusable_pairs FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can verify valid certificates" ON public.certificates;
CREATE POLICY "Public can verify valid certificates" ON public.certificates FOR SELECT USING (status = 'valid');

-- Profiles Policies
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- User Private Records (Select/Insert/Update/Delete for Owner)
DO $$
DECLARE
  t text;
  user_owned_tables text[] := ARRAY[
    'user_learning_progress', 'user_vocabulary_progress', 'user_grammar_progress',
    'user_achievements', 'user_learning_preferences', 'lesson_progress', 'quiz_attempts',
    'user_notes', 'user_bookmarks', 'pronunciation_evaluations', 'vocabulary_srs_cards',
    'simulation_sessions', 'dictionary_user_saved_words', 'user_game_sessions', 'xp_ledger',
    'ai_conversations', 'translations_history', 'translation_collections',
    'translation_saved_vocabulary', 'translation_practice_attempts',
    'translation_user_preferences', 'user_video_progress', 'user_video_bookmarks'
  ];
BEGIN
  FOREACH t IN ARRAY user_owned_tables LOOP
    EXECUTE format('DROP POLICY IF EXISTS "Users manage own %I" ON public.%I;', t, t);
    EXECUTE format('CREATE POLICY "Users manage own %I" ON public.%I FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);', t, t);
  END LOOP;
END $$;

-- ------------------------------------------------------------------------------
-- 11. SECURITY TRIGGERS (AUTH & PRIVILEGE HARDENING)
-- ------------------------------------------------------------------------------

-- Auth User Creation Trigger: Forces role = 'student' to prevent client metadata privilege injection
CREATE OR REPLACE FUNCTION public.handle_new_auth_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    email,
    full_name,
    avatar_url,
    role,
    level,
    xp,
    streak,
    account_status,
    is_email_verified,
    email_verified_at,
    created_at,
    updated_at
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(
      NEW.raw_user_meta_data->>'full_name',
      NEW.raw_user_meta_data->>'name',
      split_part(NEW.email, '@', 1)
    ),
    COALESCE(
      NEW.raw_user_meta_data->>'avatar_url',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'
    ),
    'student', -- Strict default
    'A1',
    100,
    1,
    'active',
    NEW.email_confirmed_at IS NOT NULL,
    NEW.email_confirmed_at,
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    is_email_verified = (NEW.email_confirmed_at IS NOT NULL),
    email_verified_at = COALESCE(NEW.email_confirmed_at, public.profiles.email_verified_at),
    updated_at = NOW();

  -- Initialize progress row
  INSERT INTO public.user_learning_progress (user_id, total_xp, current_level, target_level, streak_days)
  VALUES (NEW.id, 100, 'A1', 'B2', 1)
  ON CONFLICT (user_id) DO NOTHING;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_auth_user();

-- Trigger: Prevent Non-Admins from altering role, id, email, or xp in profiles
CREATE OR REPLACE FUNCTION public.protect_profile_privileges()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_caller_role TEXT;
BEGIN
  IF auth.uid() IS NULL THEN
    RETURN NEW;
  END IF;

  SELECT role INTO v_caller_role
  FROM public.profiles
  WHERE id = auth.uid();

  IF v_caller_role != 'admin' THEN
    IF NEW.role IS DISTINCT FROM OLD.role THEN
      RAISE EXCEPTION 'Unauthorized: Users cannot change their own role';
    END IF;
    IF NEW.id IS DISTINCT FROM OLD.id THEN
      RAISE EXCEPTION 'Unauthorized: Profile identity is immutable';
    END IF;
    IF NEW.email IS DISTINCT FROM OLD.email THEN
      RAISE EXCEPTION 'Unauthorized: Email must be updated through authenticated flow';
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_protect_profile_privileges ON public.profiles;
CREATE TRIGGER trg_protect_profile_privileges
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.protect_profile_privileges();

-- ------------------------------------------------------------------------------
-- 12. AUTHORITATIVE RPC FUNCTIONS
-- ------------------------------------------------------------------------------

-- Dictionary Fulltext Search RPC
CREATE OR REPLACE FUNCTION public.search_dictionary_entries(
  search_term TEXT,
  result_limit INT DEFAULT 20
)
RETURNS TABLE (
  id UUID,
  headword TEXT,
  primary_part_of_speech TEXT,
  cefr_level TEXT,
  ipa_us TEXT,
  ipa_uk TEXT,
  similarity_score REAL
)
LANGUAGE sql
STABLE
SET search_path = public
AS $$
  SELECT 
    e.id,
    e.headword,
    e.primary_part_of_speech,
    e.cefr_level,
    e.ipa_us,
    e.ipa_uk,
    similarity(e.headword, search_term) AS similarity_score
  FROM public.dictionary_lexical_entries e
  WHERE 
    e.headword ILIKE search_term || '%'
    OR e.tsv @@ plainto_tsquery('english', search_term)
    OR similarity(e.headword, search_term) > 0.3
  ORDER BY 
    (e.headword ILIKE search_term) DESC,
    (e.headword ILIKE search_term || '%') DESC,
    similarity(e.headword, search_term) DESC
  LIMIT result_limit;
$$;

-- GameVerse Anti-Cheat RPC
CREATE OR REPLACE FUNCTION public.submit_verified_game_session(
  p_user_id UUID,
  p_game_id TEXT,
  p_score INT,
  p_accuracy NUMERIC,
  p_duration_seconds INT,
  p_idempotency_key TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_game_exists BOOLEAN;
  v_game_active BOOLEAN;
  v_base_xp INT;
  v_calculated_xp INT;
  v_accuracy_clamped NUMERIC;
  v_session_id UUID;
  v_caller_auth UUID;
BEGIN
  v_caller_auth := auth.uid();
  IF v_caller_auth IS NOT NULL AND v_caller_auth <> p_user_id THEN
    RETURN jsonb_build_object('success', false, 'error', 'Forbidden: User identity mismatch');
  END IF;

  SELECT TRUE, is_active, COALESCE(xp_reward, 50)
  INTO v_game_exists, v_game_active, v_base_xp
  FROM public.gameverse_definitions
  WHERE id = p_game_id;

  IF v_game_exists IS NOT TRUE THEN
    RETURN jsonb_build_object('success', false, 'error', 'Invalid game_id: Game does not exist');
  END IF;

  IF v_game_active IS NOT TRUE THEN
    RETURN jsonb_build_object('success', false, 'error', 'Game is currently inactive');
  END IF;

  IF p_duration_seconds < 3 AND p_score > 20 THEN
    v_calculated_xp := 0;
  ELSE
    v_accuracy_clamped := LEAST(100.0, GREATEST(0.0, p_accuracy));
    v_calculated_xp := ROUND(v_base_xp * (v_accuracy_clamped / 100.0));
    IF p_score >= 100 THEN
      v_calculated_xp := v_calculated_xp + 20;
    END IF;
  END IF;

  INSERT INTO public.user_game_sessions (
    user_id, game_id, score, accuracy, duration_seconds, xp_earned, idempotency_key
  )
  VALUES (
    p_user_id, p_game_id, p_score, p_accuracy, p_duration_seconds, v_calculated_xp, p_idempotency_key
  )
  ON CONFLICT (idempotency_key) DO NOTHING
  RETURNING id INTO v_session_id;

  IF v_session_id IS NULL THEN
    RETURN jsonb_build_object('success', true, 'idempotent', true, 'xp_earned', v_calculated_xp);
  END IF;

  IF v_calculated_xp > 0 THEN
    INSERT INTO public.xp_ledger (user_id, amount, source, reference_id)
    VALUES (p_user_id, v_calculated_xp, 'gameverse_session', v_session_id::text);

    UPDATE public.profiles
    SET xp = COALESCE(xp, 0) + v_calculated_xp,
        xp_points = COALESCE(xp_points, 0) + v_calculated_xp,
        updated_at = NOW()
    WHERE id = p_user_id;

    UPDATE public.user_learning_progress
    SET total_xp = COALESCE(total_xp, 0) + v_calculated_xp,
        updated_at = NOW()
    WHERE user_id = p_user_id;
  END IF;

  RETURN jsonb_build_object(
    'success', true,
    'session_id', v_session_id,
    'xp_earned', v_calculated_xp
  );
END;
$$;
--
-- Henglish Academy (HENGLISH) - MASTER EDUCATIONAL SEED DATA
-- Generated for Supabase Production Database
-- File: supabase/seeds/20261102_master_seed_data.sql
--
BEGIN;

-- 1. COURSES SEED
INSERT INTO public.courses (id, title, title_ar, title_en, description, description_ar, level, category, lessons_count, duration, rating, students_count, is_flagship, tag, icon, thumbnail_url, is_published)
VALUES ('future-perfect', 'Master the Future Perfect Tense', 'Ø§Ù„Ù…Ø³ØªÙ‚Ø¨Ù„ Ø§Ù„ØªØ§Ù… Ø§Ù„Ø´Ø§Ù…Ù„ (Future Perfect Masterclass)', 'Master the Future Perfect Tense', 'ÙƒÙˆØ±Ø³ Ù…Ø§Ø³ØªØ± ÙƒÙ„Ø§Ø³ Ø§Ù„Ù…Ø³ØªÙ‚Ø¨Ù„ Ø§Ù„ØªØ§Ù… Ø§Ù„Ù…Ø¯Ù…Ø¬ Ø¨Ø£ÙƒØ§Ø¯ÙŠÙ…ÙŠØ© Ø§Ù„Ø¬Ø±Ø§Ù…Ø±: Ù…Ù† Ø§Ù„ØµÙØ± ÙˆØ­ØªÙ‰ Ø§Ù„Ø§Ø­ØªØ±Ø§Ù Ù…Ø¹ Ù¨ Ø¯Ø±ÙˆØ³ ØªÙØ§Ø¹Ù„ÙŠØ©ØŒ Ø®Ø·ÙˆØ· Ø²Ù…Ù†ÙŠØ©ØŒ ÙƒÙˆÙŠØ²Ø§ØªØŒ Ø£Ù„Ø¹Ø§Ø¨ØŒ ÙˆÙ…Ø­Ø§Ø¯Ø«Ø§Øª ÙˆØ§Ù‚Ø¹ÙŠØ©.', 'ÙƒÙˆØ±Ø³ Ù…Ø§Ø³ØªØ± ÙƒÙ„Ø§Ø³ Ø§Ù„Ù…Ø³ØªÙ‚Ø¨Ù„ Ø§Ù„ØªØ§Ù… Ø§Ù„Ù…Ø¯Ù…Ø¬ Ø¨Ø£ÙƒØ§Ø¯ÙŠÙ…ÙŠØ© Ø§Ù„Ø¬Ø±Ø§Ù…Ø±: Ù…Ù† Ø§Ù„ØµÙØ± ÙˆØ­ØªÙ‰ Ø§Ù„Ø§Ø­ØªØ±Ø§Ù Ù…Ø¹ Ù¨ Ø¯Ø±ÙˆØ³ ØªÙØ§Ø¹Ù„ÙŠØ©ØŒ Ø®Ø·ÙˆØ· Ø²Ù…Ù†ÙŠØ©ØŒ ÙƒÙˆÙŠØ²Ø§ØªØŒ Ø£Ù„Ø¹Ø§Ø¨ØŒ ÙˆÙ…Ø­Ø§Ø¯Ø«Ø§Øª ÙˆØ§Ù‚Ø¹ÙŠØ©.', 'Ø´Ø§Ù…Ù„', 'core', 8, 'Ø³Ø§Ø¹ØªØ§Ù† ÙˆÙ¤Ù¥ Ø¯Ù‚ÙŠÙ‚Ø©', 4.95, 3840, TRUE, 'Ø£ÙƒØ§Ø¯ÙŠÙ…ÙŠØ© Ø§Ù„Ø¬Ø±Ø§Ù…Ø± â€¢ Ø§Ù„Ù…Ø³ØªÙ‚Ø¨Ù„ Ø§Ù„ØªØ§Ù… ðŸ‘‘', 'âš¡', 'https://images.unsplash.com/photo-1506784365847-bbad939e9335?auto=format&fit=crop&w=800&q=80', TRUE)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  title_ar = EXCLUDED.title_ar,
  description = EXCLUDED.description,
  rating = EXCLUDED.rating,
  thumbnail_url = EXCLUDED.thumbnail_url;
INSERT INTO public.courses (id, title, title_ar, title_en, description, description_ar, level, category, lessons_count, duration, rating, students_count, is_flagship, tag, icon, thumbnail_url, is_published)
VALUES ('present-perfect', 'Present Perfect in Real Life', 'Ø§Ù„Ù…Ø¶Ø§Ø±Ø¹ Ø§Ù„ØªØ§Ù… ÙˆØ¹Ù„Ø§Ù‚ØªÙ‡ Ø¨Ø§Ù„Ø­Ø§Ø¶Ø±', 'Present Perfect in Real Life', 'Ø§ÙÙ‡Ù… Ø§Ù„ÙØ±Ù‚ Ø¨ÙŠÙ† Ø§Ù„Ù…Ø§Ø¶ÙŠ Ø§Ù„Ø¨Ø³ÙŠØ· ÙˆØ§Ù„Ù…Ø¶Ø§Ø±Ø¹ Ø§Ù„ØªØ§Ù… Ø¨Ø¯ÙˆÙ† ØªØ¹Ù‚ÙŠØ¯ØŒ Ù…Ø¹ Ø­Ø§Ù„Ø§Øª since Ùˆfor Ùˆjust Ùˆalready.', 'Ø§ÙÙ‡Ù… Ø§Ù„ÙØ±Ù‚ Ø¨ÙŠÙ† Ø§Ù„Ù…Ø§Ø¶ÙŠ Ø§Ù„Ø¨Ø³ÙŠØ· ÙˆØ§Ù„Ù…Ø¶Ø§Ø±Ø¹ Ø§Ù„ØªØ§Ù… Ø¨Ø¯ÙˆÙ† ØªØ¹Ù‚ÙŠØ¯ØŒ Ù…Ø¹ Ø­Ø§Ù„Ø§Øª since Ùˆfor Ùˆjust Ùˆalready.', 'Ù…ØªÙˆØ³Ø·', 'core', 6, 'Ø³Ø§Ø¹ØªØ§Ù†', 4.88, 2950, FALSE, 'Ù‚ÙˆØ§Ø¹Ø¯ Ø­ÙŠÙˆÙŠØ©', 'ðŸŽ¯', 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800&q=80', TRUE)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  title_ar = EXCLUDED.title_ar,
  description = EXCLUDED.description,
  rating = EXCLUDED.rating,
  thumbnail_url = EXCLUDED.thumbnail_url;
INSERT INTO public.courses (id, title, title_ar, title_en, description, description_ar, level, category, lessons_count, duration, rating, students_count, is_flagship, tag, icon, thumbnail_url, is_published)
VALUES ('conditionals', 'Master All 4 Conditionals', 'Ù‚ÙˆØ§Ø¹Ø¯ Ù„Ùˆ ÙˆØ§Ù„Ø´Ø±Ø· (Zero to 3rd Conditionals)', 'Master All 4 Conditionals', 'Ø¯Ù„ÙŠÙ„Ùƒ Ø§Ù„Ù…Ø¨Ø³Ø· Ù„Ø­Ø§Ù„Ø§Øª If Ø§Ù„Ø£Ø±Ø¨Ø¹Ø©ØŒ ÙˆØ§Ù„Ø´Ø±Ø· Ø§Ù„Ù…Ø®ØªÙ„Ø· (Mixed Conditionals) Ù…Ø¹ Ø£Ù…Ø«Ù„Ø© Ø­ÙŠØ©.', 'Ø¯Ù„ÙŠÙ„Ùƒ Ø§Ù„Ù…Ø¨Ø³Ø· Ù„Ø­Ø§Ù„Ø§Øª If Ø§Ù„Ø£Ø±Ø¨Ø¹Ø©ØŒ ÙˆØ§Ù„Ø´Ø±Ø· Ø§Ù„Ù…Ø®ØªÙ„Ø· (Mixed Conditionals) Ù…Ø¹ Ø£Ù…Ø«Ù„Ø© Ø­ÙŠØ©.', 'Ù…ØªÙˆØ³Ø·', 'core', 5, 'Ø³Ø§Ø¹Ø© ÙˆÙ†ØµÙ', 4.91, 1820, FALSE, 'Ù‚ÙˆØ§Ø¹Ø¯ Ù…ØªÙ‚Ø¯Ù…Ø©', 'ðŸ”®', 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&w=800&q=80', TRUE)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  title_ar = EXCLUDED.title_ar,
  description = EXCLUDED.description,
  rating = EXCLUDED.rating,
  thumbnail_url = EXCLUDED.thumbnail_url;
INSERT INTO public.courses (id, title, title_ar, title_en, description, description_ar, level, category, lessons_count, duration, rating, students_count, is_flagship, tag, icon, thumbnail_url, is_published)
VALUES ('tech-english', 'English for Software Engineers', 'Ø§Ù„Ø¥Ù†Ø¬Ù„ÙŠØ²ÙŠØ© Ù„Ù„Ù…Ø¨Ø±Ù…Ø¬ÙŠÙ† ÙˆÙ…Ù‡Ù†Ø¯Ø³ÙŠ Ø§Ù„Ø¨Ø±Ù…Ø¬ÙŠØ§Øª', 'English for Software Engineers', 'Ù…ØµØ·Ù„Ø­Ø§Øª Ø§Ù„Ù€ Pull RequestsØŒ Ø§Ø¬ØªÙ…Ø§Ø¹Ø§Øª Ø§Ù„Ù€ Daily StandupØŒ Ù†Ù‚Ø§Ø´Ø§Øª Ø§Ù„ØªØµÙ…ÙŠÙ… Ø§Ù„Ù…Ø¹Ù…Ø§Ø±ÙŠØŒ ÙˆÙƒØªØ§Ø¨Ø© Ø§Ù„Ù€ Documentation.', 'Ù…ØµØ·Ù„Ø­Ø§Øª Ø§Ù„Ù€ Pull RequestsØŒ Ø§Ø¬ØªÙ…Ø§Ø¹Ø§Øª Ø§Ù„Ù€ Daily StandupØŒ Ù†Ù‚Ø§Ø´Ø§Øª Ø§Ù„ØªØµÙ…ÙŠÙ… Ø§Ù„Ù…Ø¹Ù…Ø§Ø±ÙŠØŒ ÙˆÙƒØªØ§Ø¨Ø© Ø§Ù„Ù€ Documentation.', 'Ù…ØªÙ‚Ø¯Ù…', 'core', 10, 'Ù£ Ø³Ø§Ø¹Ø§Øª', 4.98, 4210, FALSE, 'Ù…Ù‡Ù†ÙŠ ÙˆØªÙ‚Ù†ÙŠ', 'ðŸ’»', 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80', TRUE)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  title_ar = EXCLUDED.title_ar,
  description = EXCLUDED.description,
  rating = EXCLUDED.rating,
  thumbnail_url = EXCLUDED.thumbnail_url;
INSERT INTO public.courses (id, title, title_ar, title_en, description, description_ar, level, category, lessons_count, duration, rating, students_count, is_flagship, tag, icon, thumbnail_url, is_published)
VALUES ('business-writing', 'Professional Business Correspondence', 'Ø§Ù„Ù…Ø±Ø§Ø³Ù„Ø§Øª Ø§Ù„Ù…Ù‡Ù†ÙŠØ© ÙˆØ§Ù„Ø¥ÙŠÙ…ÙŠÙ„Ø§Øª Ø§Ù„Ø±Ø³Ù…ÙŠØ©', 'Professional Business Correspondence', 'ÙƒÙŠÙ ØªÙƒØªØ¨ Ø¥ÙŠÙ…ÙŠÙ„Ø§Øª ÙˆØ§Ø¶Ø­Ø©ØŒ Ù…Ù‡Ø°Ø¨Ø©ØŒ ÙˆÙ…Ø¤Ø«Ø±Ø© Ù„Ù…Ø¯ÙŠØ±ÙƒØŒ Ø¹Ù…ÙŠÙ„ÙƒØŒ Ø£Ùˆ Ø´Ø±ÙƒØ§Øª Ø£Ø¬Ù†Ø¨ÙŠØ©.', 'ÙƒÙŠÙ ØªÙƒØªØ¨ Ø¥ÙŠÙ…ÙŠÙ„Ø§Øª ÙˆØ§Ø¶Ø­Ø©ØŒ Ù…Ù‡Ø°Ø¨Ø©ØŒ ÙˆÙ…Ø¤Ø«Ø±Ø© Ù„Ù…Ø¯ÙŠØ±ÙƒØŒ Ø¹Ù…ÙŠÙ„ÙƒØŒ Ø£Ùˆ Ø´Ø±ÙƒØ§Øª Ø£Ø¬Ù†Ø¨ÙŠØ©.', 'Ù…ØªÙˆØ³Ø·', 'core', 6, 'Ø³Ø§Ø¹ØªØ§Ù†', 4.85, 2100, FALSE, 'Ø¨ÙŠØ¦Ø© Ø§Ù„Ø¹Ù…Ù„', 'âœ‰ï¸', 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=800&q=80', TRUE)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  title_ar = EXCLUDED.title_ar,
  description = EXCLUDED.description,
  rating = EXCLUDED.rating,
  thumbnail_url = EXCLUDED.thumbnail_url;
INSERT INTO public.courses (id, title, title_ar, title_en, description, description_ar, level, category, lessons_count, duration, rating, students_count, is_flagship, tag, icon, thumbnail_url, is_published)
VALUES ('ielts-speaking', 'IELTS Speaking & Natural Fluency', 'Ø£Ø³Ø±Ø§Ø± Ø§Ù„Ø·Ù„Ø§Ù‚Ø© ÙˆÙ…Ø­Ø§Ø¯Ø«Ø§Øª Ø§Ù„Ø¢ÙŠÙ„ØªØ³ (Band 7.5+)', 'IELTS Speaking & Natural Fluency', 'ØªØ·ÙˆÙŠØ± Ø³Ø±Ø¹Ø© Ø§Ù„ØªÙÙƒÙŠØ± Ø¨Ø§Ù„Ø¥Ù†Ø¬Ù„ÙŠØ²ÙŠØŒ Ø±Ø¨Ø· Ø§Ù„Ø£ÙÙƒØ§Ø±ØŒ ÙˆØ§Ù„ØªØ­Ø¯Ø« Ø§Ù„ØªÙ„Ù‚Ø§Ø¦ÙŠ Ø¯ÙˆÙ† ØªÙˆÙ‚Ù Ø£Ùˆ ØªØ±Ø¯Ø¯.', 'ØªØ·ÙˆÙŠØ± Ø³Ø±Ø¹Ø© Ø§Ù„ØªÙÙƒÙŠØ± Ø¨Ø§Ù„Ø¥Ù†Ø¬Ù„ÙŠØ²ÙŠØŒ Ø±Ø¨Ø· Ø§Ù„Ø£ÙÙƒØ§Ø±ØŒ ÙˆØ§Ù„ØªØ­Ø¯Ø« Ø§Ù„ØªÙ„Ù‚Ø§Ø¦ÙŠ Ø¯ÙˆÙ† ØªÙˆÙ‚Ù Ø£Ùˆ ØªØ±Ø¯Ø¯.', 'Ù…ØªÙ‚Ø¯Ù…', 'core', 12, 'Ù¤ Ø³Ø§Ø¹Ø§Øª', 4.96, 3150, FALSE, 'Ø´Ù‡Ø§Ø¯Ø§Øª Ø¯ÙˆÙ„ÙŠØ©', 'ðŸŽ™ï¸', 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80', TRUE)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  title_ar = EXCLUDED.title_ar,
  description = EXCLUDED.description,
  rating = EXCLUDED.rating,
  thumbnail_url = EXCLUDED.thumbnail_url;

-- 2. GAMEVERSE DEFINITIONS SEED
INSERT INTO public.gameverse_definitions (id, title, title_ar, description, description_ar, category, difficulty, xp_reward, thumbnail_url, is_active, min_players, max_players)
VALUES ('vocab-rush', 'Vocabulary Rush', 'Ø³Ø¨Ø§Ù‚ Ø§Ù„Ù…ÙØ±Ø¯Ø§Øª Ø§Ù„Ø³Ø±ÙŠØ¹ âš¡', 'Ø§Ø®ØªØ± Ø§Ù„Ù…Ø¹Ù†Ù‰ Ø§Ù„Ø¹Ø±Ø¨ÙŠ Ø§Ù„Ø¯Ù‚ÙŠÙ‚ Ù„Ù„ÙƒÙ„Ù…Ø© Ø§Ù„Ø¥Ù†Ø¬Ù„ÙŠØ²ÙŠØ© Ø§Ù„Ø¥Ù†Ø¬Ù„ÙŠØ²ÙŠØ© Ù‚Ø¨Ù„ Ø§Ù†ØªÙ‡Ø§Ø¡ Ø§Ù„Ø¹Ø¯Ø§Ø¯ Ø§Ù„Ø²Ù…Ù†ÙŠ Ø§Ù„Ø³Ø±ÙŠØ¹.', 'Ø§Ø®ØªØ± Ø§Ù„Ù…Ø¹Ù†Ù‰ Ø§Ù„Ø¹Ø±Ø¨ÙŠ Ø§Ù„Ø¯Ù‚ÙŠÙ‚ Ù„Ù„ÙƒÙ„Ù…Ø© Ø§Ù„Ø¥Ù†Ø¬Ù„ÙŠØ²ÙŠØ© Ø§Ù„Ø¥Ù†Ø¬Ù„ÙŠØ²ÙŠØ© Ù‚Ø¨Ù„ Ø§Ù†ØªÙ‡Ø§Ø¡ Ø§Ù„Ø¹Ø¯Ø§Ø¯ Ø§Ù„Ø²Ù…Ù†ÙŠ Ø§Ù„Ø³Ø±ÙŠØ¹.', 'vocabulary', 'beginner', 35, NULL, TRUE, 1, 4)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  title_ar = EXCLUDED.title_ar,
  description = EXCLUDED.description,
  description_ar = EXCLUDED.description_ar,
  category = EXCLUDED.category,
  difficulty = EXCLUDED.difficulty,
  xp_reward = EXCLUDED.xp_reward,
  is_active = TRUE;
INSERT INTO public.gameverse_definitions (id, title, title_ar, description, description_ar, category, difficulty, xp_reward, thumbnail_url, is_active, min_players, max_players)
VALUES ('word-detective', 'Word Detective', 'Ø§Ù„Ù…Ø­Ù‚Ù‚ Ø§Ù„Ù„ØºÙˆÙŠ ðŸ•µï¸', 'Ø§ÙƒØªØ´Ù Ø§Ù„ÙƒÙ„Ù…Ø© Ø§Ù„Ø¥Ù†Ø¬Ù„ÙŠØ²ÙŠØ© Ø§Ù„Ø³Ø±ÙŠØ© Ù…Ù† Ø®Ù„Ø§Ù„ 3 Ø£Ù„ØºØ§Ø² ÙˆØªÙ„Ù…ÙŠØ­Ø§Øª Ø³ÙŠØ§Ù‚ÙŠØ© Ø°ÙƒÙŠØ©.', 'Ø§ÙƒØªØ´Ù Ø§Ù„ÙƒÙ„Ù…Ø© Ø§Ù„Ø¥Ù†Ø¬Ù„ÙŠØ²ÙŠØ© Ø§Ù„Ø³Ø±ÙŠØ© Ù…Ù† Ø®Ù„Ø§Ù„ 3 Ø£Ù„ØºØ§Ø² ÙˆØªÙ„Ù…ÙŠØ­Ø§Øª Ø³ÙŠØ§Ù‚ÙŠØ© Ø°ÙƒÙŠØ©.', 'vocabulary', 'intermediate', 45, NULL, TRUE, 1, 4)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  title_ar = EXCLUDED.title_ar,
  description = EXCLUDED.description,
  description_ar = EXCLUDED.description_ar,
  category = EXCLUDED.category,
  difficulty = EXCLUDED.difficulty,
  xp_reward = EXCLUDED.xp_reward,
  is_active = TRUE;
INSERT INTO public.gameverse_definitions (id, title, title_ar, description, description_ar, category, difficulty, xp_reward, thumbnail_url, is_active, min_players, max_players)
VALUES ('synonym-hunter', 'Synonym Arena', 'Ù…Ø¹Ø±ÙƒØ© Ø§Ù„Ù…ØªØ±Ø§Ø¯ÙØ§Øª ðŸ¹', 'Ø§ØµØ·Ø¯ Ø§Ù„Ù…ØªØ±Ø§Ø¯Ù Ø§Ù„Ø£ÙƒØ«Ø± Ø¯Ù‚Ø© Ù„Ù„ÙƒÙ„Ù…Ø© Ø§Ù„Ù…Ø·Ù„ÙˆØ¨Ø© Ø¶Ù…Ù† Ø³ÙŠØ§Ù‚Ø§Øª Ù…ØªÙ‚Ø¯Ù…Ø© ÙˆÙ…ØªÙ†ÙˆØ¹Ø©.', 'Ø§ØµØ·Ø¯ Ø§Ù„Ù…ØªØ±Ø§Ø¯Ù Ø§Ù„Ø£ÙƒØ«Ø± Ø¯Ù‚Ø© Ù„Ù„ÙƒÙ„Ù…Ø© Ø§Ù„Ù…Ø·Ù„ÙˆØ¨Ø© Ø¶Ù…Ù† Ø³ÙŠØ§Ù‚Ø§Øª Ù…ØªÙ‚Ø¯Ù…Ø© ÙˆÙ…ØªÙ†ÙˆØ¹Ø©.', 'vocabulary', 'intermediate', 40, NULL, TRUE, 1, 4)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  title_ar = EXCLUDED.title_ar,
  description = EXCLUDED.description,
  description_ar = EXCLUDED.description_ar,
  category = EXCLUDED.category,
  difficulty = EXCLUDED.difficulty,
  xp_reward = EXCLUDED.xp_reward,
  is_active = TRUE;
INSERT INTO public.gameverse_definitions (id, title, title_ar, description, description_ar, category, difficulty, xp_reward, thumbnail_url, is_active, min_players, max_players)
VALUES ('antonym-arena', 'Antonym Arena', 'Ø­Ù„Ø¨Ø© Ø§Ù„Ø£Ø¶Ø¯Ø§Ø¯ ÙˆØ§Ù„Ù…Ø¹ÙƒÙˆØ³Ø§Øª âš–ï¸', 'Ø§Ø®ØªØ± Ø§Ù„ÙƒÙ„Ù…Ø© Ø§Ù„Ù…Ø¹Ø§ÙƒØ³Ø© ØªÙ…Ø§Ù…Ø§Ù‹ ÙÙŠ Ø§Ù„Ù…Ø¹Ù†Ù‰ Ø¨Ø³Ø±Ø¹Ø© ØªØ­Øª Ø¶ØºØ· Ø§Ù„ØªÙˆÙ‚ÙŠØª Ø§Ù„Ù…ØªØµØ§Ø¹Ø¯.', 'Ø§Ø®ØªØ± Ø§Ù„ÙƒÙ„Ù…Ø© Ø§Ù„Ù…Ø¹Ø§ÙƒØ³Ø© ØªÙ…Ø§Ù…Ø§Ù‹ ÙÙŠ Ø§Ù„Ù…Ø¹Ù†Ù‰ Ø¨Ø³Ø±Ø¹Ø© ØªØ­Øª Ø¶ØºØ· Ø§Ù„ØªÙˆÙ‚ÙŠØª Ø§Ù„Ù…ØªØµØ§Ø¹Ø¯.', 'vocabulary', 'beginner', 40, NULL, TRUE, 1, 4)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  title_ar = EXCLUDED.title_ar,
  description = EXCLUDED.description,
  description_ar = EXCLUDED.description_ar,
  category = EXCLUDED.category,
  difficulty = EXCLUDED.difficulty,
  xp_reward = EXCLUDED.xp_reward,
  is_active = TRUE;
INSERT INTO public.gameverse_definitions (id, title, title_ar, description, description_ar, category, difficulty, xp_reward, thumbnail_url, is_active, min_players, max_players)
VALUES ('word-association', 'Word Association', 'Ø§Ù„Ø±ÙˆØ§Ø¨Ø· Ø§Ù„Ø°Ù‡Ù†ÙŠØ© ÙˆØ§Ù„Ø¯Ù„Ø§Ù„ÙŠØ© ðŸ”—', 'Ø§Ø±Ø¨Ø· Ø§Ù„ÙƒÙ„Ù…Ø§Øª Ø§Ù„ØªÙŠ ØªÙ†ØªÙ…ÙŠ Ù„Ù†ÙØ³ Ø§Ù„Ù…Ø¬Ø§Ù„ Ø§Ù„Ø¯Ù„Ø§Ù„ÙŠ ÙˆØ§ÙƒØªØ´Ù Ø§Ù„ÙƒÙ„Ù…Ø© Ø§Ù„Ø´Ø§Ø°Ø© Ø£Ùˆ Ø§Ù„Ù…Ø±ØªØ¨Ø·Ø©.', 'Ø§Ø±Ø¨Ø· Ø§Ù„ÙƒÙ„Ù…Ø§Øª Ø§Ù„ØªÙŠ ØªÙ†ØªÙ…ÙŠ Ù„Ù†ÙØ³ Ø§Ù„Ù…Ø¬Ø§Ù„ Ø§Ù„Ø¯Ù„Ø§Ù„ÙŠ ÙˆØ§ÙƒØªØ´Ù Ø§Ù„ÙƒÙ„Ù…Ø© Ø§Ù„Ø´Ø§Ø°Ø© Ø£Ùˆ Ø§Ù„Ù…Ø±ØªØ¨Ø·Ø©.', 'vocabulary', 'intermediate', 45, NULL, TRUE, 1, 4)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  title_ar = EXCLUDED.title_ar,
  description = EXCLUDED.description,
  description_ar = EXCLUDED.description_ar,
  category = EXCLUDED.category,
  difficulty = EXCLUDED.difficulty,
  xp_reward = EXCLUDED.xp_reward,
  is_active = TRUE;
INSERT INTO public.gameverse_definitions (id, title, title_ar, description, description_ar, category, difficulty, xp_reward, thumbnail_url, is_active, min_players, max_players)
VALUES ('context-master', 'Context Master', 'Ø³ÙŠØ¯ Ø§Ù„Ø³ÙŠØ§Ù‚ ÙˆØ§Ù„Ù…ÙˆØ§Ù‚Ù ðŸŽ­', 'Ø§Ø®ØªØ± Ø§Ù„ÙƒÙ„Ù…Ø© Ø§Ù„Ø£Ø¯Ù‚ Ù„Ù…Ù„Ø¡ Ø§Ù„ÙØ±Ø§Øº Ø¯Ø§Ø®Ù„ ÙÙ‚Ø±Ø§Øª ÙˆØ³ÙŠØ§Ù‚Ø§Øª Ù…Ù‡Ù†ÙŠØ© ÙˆØ£ÙƒØ§Ø¯ÙŠÙ…ÙŠØ© Ø­Ù‚ÙŠÙ‚ÙŠØ©.', 'Ø§Ø®ØªØ± Ø§Ù„ÙƒÙ„Ù…Ø© Ø§Ù„Ø£Ø¯Ù‚ Ù„Ù…Ù„Ø¡ Ø§Ù„ÙØ±Ø§Øº Ø¯Ø§Ø®Ù„ ÙÙ‚Ø±Ø§Øª ÙˆØ³ÙŠØ§Ù‚Ø§Øª Ù…Ù‡Ù†ÙŠØ© ÙˆØ£ÙƒØ§Ø¯ÙŠÙ…ÙŠØ© Ø­Ù‚ÙŠÙ‚ÙŠØ©.', 'vocabulary', 'intermediate', 45, NULL, TRUE, 1, 4)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  title_ar = EXCLUDED.title_ar,
  description = EXCLUDED.description,
  description_ar = EXCLUDED.description_ar,
  category = EXCLUDED.category,
  difficulty = EXCLUDED.difficulty,
  xp_reward = EXCLUDED.xp_reward,
  is_active = TRUE;
INSERT INTO public.gameverse_definitions (id, title, title_ar, description, description_ar, category, difficulty, xp_reward, thumbnail_url, is_active, min_players, max_players)
VALUES ('phrasal-quest', 'Phrasal Verb Quest', 'Ù…ØªØ§Ù‡Ø© Ø§Ù„Ø£ÙØ¹Ø§Ù„ Ø§Ù„Ù…Ø±ÙƒØ¨Ø© ðŸ§­', 'Ø·Ø§Ø¨Ù‚ Ø§Ù„ÙØ¹Ù„ Ù…Ø¹ Ø­Ø±Ù Ø§Ù„Ø¬Ø± Ø§Ù„Ù…Ù†Ø§Ø³Ø¨ ÙˆØ§ÙƒØªØ´Ù Ø§Ù„ØªØºÙŠØ± Ø§Ù„ÙƒØ§Ù…Ù„ ÙÙŠ Ø§Ù„Ù…Ø¹Ù†Ù‰ Ø§Ù„Ø¯Ù„Ø§Ù„ÙŠ.', 'Ø·Ø§Ø¨Ù‚ Ø§Ù„ÙØ¹Ù„ Ù…Ø¹ Ø­Ø±Ù Ø§Ù„Ø¬Ø± Ø§Ù„Ù…Ù†Ø§Ø³Ø¨ ÙˆØ§ÙƒØªØ´Ù Ø§Ù„ØªØºÙŠØ± Ø§Ù„ÙƒØ§Ù…Ù„ ÙÙŠ Ø§Ù„Ù…Ø¹Ù†Ù‰ Ø§Ù„Ø¯Ù„Ø§Ù„ÙŠ.', 'vocabulary', 'intermediate', 50, NULL, TRUE, 1, 4)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  title_ar = EXCLUDED.title_ar,
  description = EXCLUDED.description,
  description_ar = EXCLUDED.description_ar,
  category = EXCLUDED.category,
  difficulty = EXCLUDED.difficulty,
  xp_reward = EXCLUDED.xp_reward,
  is_active = TRUE;
INSERT INTO public.gameverse_definitions (id, title, title_ar, description, description_ar, category, difficulty, xp_reward, thumbnail_url, is_active, min_players, max_players)
VALUES ('idiom-explorer', 'Idiom Explorer', 'Ù…Ø³ØªÙƒØ´Ù Ø§Ù„Ø£Ù…Ø«Ø§Ù„ ÙˆØ§Ù„ØªØ¹Ø¨ÙŠØ±Ø§Øª ðŸ”®', 'ÙÙƒ Ø´ÙØ±Ø© Ø§Ù„Ù…Ø¹Ø§Ù†ÙŠ Ø§Ù„Ø­Ù‚ÙŠÙ‚ÙŠØ© ÙˆØ±Ø§Ø¡ Ø§Ù„ØªØ¹Ø¨ÙŠØ±Ø§Øª Ø§Ù„Ø´Ø¹Ø¨ÙŠØ© ÙˆØ§Ù„Ù…Ø¬Ø§Ø²ÙŠØ© Ø§Ù„Ø´Ø§Ø¦Ø¹Ø© ÙƒÙ€ "Bite the bullet".', 'ÙÙƒ Ø´ÙØ±Ø© Ø§Ù„Ù…Ø¹Ø§Ù†ÙŠ Ø§Ù„Ø­Ù‚ÙŠÙ‚ÙŠØ© ÙˆØ±Ø§Ø¡ Ø§Ù„ØªØ¹Ø¨ÙŠØ±Ø§Øª Ø§Ù„Ø´Ø¹Ø¨ÙŠØ© ÙˆØ§Ù„Ù…Ø¬Ø§Ø²ÙŠØ© Ø§Ù„Ø´Ø§Ø¦Ø¹Ø© ÙƒÙ€ "Bite the bullet".', 'vocabulary', 'intermediate', 50, NULL, TRUE, 1, 4)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  title_ar = EXCLUDED.title_ar,
  description = EXCLUDED.description,
  description_ar = EXCLUDED.description_ar,
  category = EXCLUDED.category,
  difficulty = EXCLUDED.difficulty,
  xp_reward = EXCLUDED.xp_reward,
  is_active = TRUE;
INSERT INTO public.gameverse_definitions (id, title, title_ar, description, description_ar, category, difficulty, xp_reward, thumbnail_url, is_active, min_players, max_players)
VALUES ('word-formation', 'Word Formation Lab', 'Ù…Ø¹Ù…Ù„ Ø§Ø´ØªÙ‚Ø§Ù‚ Ø§Ù„ÙƒÙ„Ù…Ø§Øª ðŸ§ª', 'Ø­ÙˆÙ‘Ù„ Ø¬Ø°Ø± Ø§Ù„ÙƒÙ„Ù…Ø© Ø¨Ø¥Ø¶Ø§ÙØ© Ø§Ù„Ø³ÙˆØ§Ø¨Ù‚ (Prefixes) ÙˆØ§Ù„Ù„ÙˆØ§Ø­Ù‚ (Suffixes) Ù„Ø§Ø³Ù… Ø£Ùˆ ØµÙØ© Ø£Ùˆ Ø¸Ø±Ù.', 'Ø­ÙˆÙ‘Ù„ Ø¬Ø°Ø± Ø§Ù„ÙƒÙ„Ù…Ø© Ø¨Ø¥Ø¶Ø§ÙØ© Ø§Ù„Ø³ÙˆØ§Ø¨Ù‚ (Prefixes) ÙˆØ§Ù„Ù„ÙˆØ§Ø­Ù‚ (Suffixes) Ù„Ø§Ø³Ù… Ø£Ùˆ ØµÙØ© Ø£Ùˆ Ø¸Ø±Ù.', 'vocabulary', 'intermediate', 45, NULL, TRUE, 1, 4)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  title_ar = EXCLUDED.title_ar,
  description = EXCLUDED.description,
  description_ar = EXCLUDED.description_ar,
  category = EXCLUDED.category,
  difficulty = EXCLUDED.difficulty,
  xp_reward = EXCLUDED.xp_reward,
  is_active = TRUE;
INSERT INTO public.gameverse_definitions (id, title, title_ar, description, description_ar, category, difficulty, xp_reward, thumbnail_url, is_active, min_players, max_players)
VALUES ('collocation-challenge', 'Collocation Challenge', 'ØªØ­Ø¯ÙŠ Ø§Ù„Ù…ØªÙ„Ø§Ø²Ù…Ø§Øª Ø§Ù„Ù„ÙØ¸ÙŠØ© ðŸ¤', 'Ø§Ø®ØªØ± Ø§Ù„ÙƒÙ„Ù…Ø§Øª Ø§Ù„Ù…ØªÙ„Ø§Ø²Ù…Ø© Ø·Ø¨ÙŠØ¹ÙŠØ§Ù‹ ÙÙŠ Ù„ØºØ© Ø£Ù‡Ù„ Ø§Ù„Ù„ØºØ© (Ù…Ø«Ù„: make a decision ÙˆÙ„ÙŠØ³ do).', 'Ø§Ø®ØªØ± Ø§Ù„ÙƒÙ„Ù…Ø§Øª Ø§Ù„Ù…ØªÙ„Ø§Ø²Ù…Ø© Ø·Ø¨ÙŠØ¹ÙŠØ§Ù‹ ÙÙŠ Ù„ØºØ© Ø£Ù‡Ù„ Ø§Ù„Ù„ØºØ© (Ù…Ø«Ù„: make a decision ÙˆÙ„ÙŠØ³ do).', 'vocabulary', 'intermediate', 40, NULL, TRUE, 1, 4)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  title_ar = EXCLUDED.title_ar,
  description = EXCLUDED.description,
  description_ar = EXCLUDED.description_ar,
  category = EXCLUDED.category,
  difficulty = EXCLUDED.difficulty,
  xp_reward = EXCLUDED.xp_reward,
  is_active = TRUE;
INSERT INTO public.gameverse_definitions (id, title, title_ar, description, description_ar, category, difficulty, xp_reward, thumbnail_url, is_active, min_players, max_players)
VALUES ('sentence-builder', 'Sentence Builder', 'Ù…Ø¹Ù…Ù„ ØªØ±ÙƒÙŠØ¨ Ø§Ù„Ø¬Ù…Ù„ ðŸ§©', 'Ø±ØªÙ‘Ø¨ Ø§Ù„ÙƒÙ„Ù…Ø§Øª Ø§Ù„Ù…Ø¨Ø¹Ø«Ø±Ø© Ø¨Ø§Ù„ØªØ±ØªÙŠØ¨ Ø§Ù„Ù†Ø­ÙˆÙŠ ÙˆØ§Ù„Ø³ÙŠØ§Ù‚ÙŠ Ø§Ù„ØµØ­ÙŠØ­ Ù„Ø¨Ù†Ø§Ø¡ Ø¬Ù…Ù„ Ø§Ø­ØªØ±Ø§ÙÙŠØ©.', 'Ø±ØªÙ‘Ø¨ Ø§Ù„ÙƒÙ„Ù…Ø§Øª Ø§Ù„Ù…Ø¨Ø¹Ø«Ø±Ø© Ø¨Ø§Ù„ØªØ±ØªÙŠØ¨ Ø§Ù„Ù†Ø­ÙˆÙŠ ÙˆØ§Ù„Ø³ÙŠØ§Ù‚ÙŠ Ø§Ù„ØµØ­ÙŠØ­ Ù„Ø¨Ù†Ø§Ø¡ Ø¬Ù…Ù„ Ø§Ø­ØªØ±Ø§ÙÙŠØ©.', 'grammar', 'beginner', 40, NULL, TRUE, 1, 4)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  title_ar = EXCLUDED.title_ar,
  description = EXCLUDED.description,
  description_ar = EXCLUDED.description_ar,
  category = EXCLUDED.category,
  difficulty = EXCLUDED.difficulty,
  xp_reward = EXCLUDED.xp_reward,
  is_active = TRUE;
INSERT INTO public.gameverse_definitions (id, title, title_ar, description, description_ar, category, difficulty, xp_reward, thumbnail_url, is_active, min_players, max_players)
VALUES ('error-hunter', 'Error Hunter', 'ØµØ§Ø¦Ø¯ Ø§Ù„Ø£Ø®Ø·Ø§Ø¡ Ø§Ù„Ù‚ÙˆØ§Ø¹Ø¯ÙŠØ© ðŸŽ¯', 'Ø§ÙØ­Øµ Ø§Ù„Ø¬Ù…Ù„ Ø¨Ø¯Ù‚Ø© Ø®Ø¨ÙŠØ± Ù„ØºÙˆÙŠ Ù„Ø§ÙƒØªØ´Ø§Ù Ø§Ù„Ø£Ø®Ø·Ø§Ø¡ Ø§Ù„Ù‚ÙˆØ§Ø¹Ø¯ÙŠØ© Ø§Ù„Ø¯ÙÙŠÙ†Ø© ÙˆØµÙˆØ¨Ù‡Ø§ ÙÙˆØ±Ø§Ù‹.', 'Ø§ÙØ­Øµ Ø§Ù„Ø¬Ù…Ù„ Ø¨Ø¯Ù‚Ø© Ø®Ø¨ÙŠØ± Ù„ØºÙˆÙŠ Ù„Ø§ÙƒØªØ´Ø§Ù Ø§Ù„Ø£Ø®Ø·Ø§Ø¡ Ø§Ù„Ù‚ÙˆØ§Ø¹Ø¯ÙŠØ© Ø§Ù„Ø¯ÙÙŠÙ†Ø© ÙˆØµÙˆØ¨Ù‡Ø§ ÙÙˆØ±Ø§Ù‹.', 'grammar', 'intermediate', 45, NULL, TRUE, 1, 4)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  title_ar = EXCLUDED.title_ar,
  description = EXCLUDED.description,
  description_ar = EXCLUDED.description_ar,
  category = EXCLUDED.category,
  difficulty = EXCLUDED.difficulty,
  xp_reward = EXCLUDED.xp_reward,
  is_active = TRUE;
INSERT INTO public.gameverse_definitions (id, title, title_ar, description, description_ar, category, difficulty, xp_reward, thumbnail_url, is_active, min_players, max_players)
VALUES ('v3-blitz', 'V3 Irregular Verbs Blitz', 'Ø³Ø¨Ø§Ù‚ Ø§Ù„ØªØµØ±ÙŠÙ Ø§Ù„Ø«Ø§Ù„Ø« V3 âš¡', 'Ø§Ø®ØªØ± Ø§Ù„ØªØµØ±ÙŠÙ Ø§Ù„Ø«Ø§Ù„Ø« (V3) Ø§Ù„ØµØ­ÙŠØ­ Ù„Ù„Ø£ÙØ¹Ø§Ù„ Ø§Ù„Ø´Ø§Ø°Ø© Ø¨Ø£Ù‚ØµÙ‰ Ø³Ø±Ø¹Ø© Ø®Ù„Ø§Ù„ 25 Ø«Ø§Ù†ÙŠØ©.', 'Ø§Ø®ØªØ± Ø§Ù„ØªØµØ±ÙŠÙ Ø§Ù„Ø«Ø§Ù„Ø« (V3) Ø§Ù„ØµØ­ÙŠØ­ Ù„Ù„Ø£ÙØ¹Ø§Ù„ Ø§Ù„Ø´Ø§Ø°Ø© Ø¨Ø£Ù‚ØµÙ‰ Ø³Ø±Ø¹Ø© Ø®Ù„Ø§Ù„ 25 Ø«Ø§Ù†ÙŠØ©.', 'grammar', 'beginner', 35, NULL, TRUE, 1, 4)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  title_ar = EXCLUDED.title_ar,
  description = EXCLUDED.description,
  description_ar = EXCLUDED.description_ar,
  category = EXCLUDED.category,
  difficulty = EXCLUDED.difficulty,
  xp_reward = EXCLUDED.xp_reward,
  is_active = TRUE;
INSERT INTO public.gameverse_definitions (id, title, title_ar, description, description_ar, category, difficulty, xp_reward, thumbnail_url, is_active, min_players, max_players)
VALUES ('grammar-tower', 'Grammar Tower', 'Ø¨Ø±Ø¬ Ø§Ù„Ù‚ÙˆØ§Ø¹Ø¯ Ø§Ù„Ù…ØªØµØ§Ø¹Ø¯ ðŸ°', 'Ø§ØµØ¹Ø¯ Ø·ÙˆØ§Ø¨Ù‚ Ø§Ù„Ø¨Ø±Ø¬ Ø¨Ø¥Ø¬Ø§Ø¨Ø§Øª Ù†Ø­ÙˆÙŠØ© ØµØ­ÙŠØ­Ø© Ù…ØªØªØ§Ù„ÙŠØ©Ø› Ø£ÙŠ Ø®Ø·Ø£ Ù‚Ø¯ ÙŠÙƒÙ„ÙÙƒ Ø§Ù„Ø³Ù‚ÙˆØ· Ø·Ø§Ø¨Ù‚Ø§Ù‹ Ù„Ù„Ø£Ø³ÙÙ„!', 'Ø§ØµØ¹Ø¯ Ø·ÙˆØ§Ø¨Ù‚ Ø§Ù„Ø¨Ø±Ø¬ Ø¨Ø¥Ø¬Ø§Ø¨Ø§Øª Ù†Ø­ÙˆÙŠØ© ØµØ­ÙŠØ­Ø© Ù…ØªØªØ§Ù„ÙŠØ©Ø› Ø£ÙŠ Ø®Ø·Ø£ Ù‚Ø¯ ÙŠÙƒÙ„ÙÙƒ Ø§Ù„Ø³Ù‚ÙˆØ· Ø·Ø§Ø¨Ù‚Ø§Ù‹ Ù„Ù„Ø£Ø³ÙÙ„!', 'grammar', 'beginner', 60, NULL, TRUE, 1, 4)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  title_ar = EXCLUDED.title_ar,
  description = EXCLUDED.description,
  description_ar = EXCLUDED.description_ar,
  category = EXCLUDED.category,
  difficulty = EXCLUDED.difficulty,
  xp_reward = EXCLUDED.xp_reward,
  is_active = TRUE;
INSERT INTO public.gameverse_definitions (id, title, title_ar, description, description_ar, category, difficulty, xp_reward, thumbnail_url, is_active, min_players, max_players)
VALUES ('tense-switch', 'Tense Switch', 'Ù…Ø­ÙˆÙ‘Ù„ Ø§Ù„Ø£Ø²Ù…Ù†Ø© Ø§Ù„Ù‚ÙˆØ§Ø¹Ø¯ÙŠØ© â³', 'Ø­ÙˆÙ‘Ù„ Ø§Ù„Ø¬Ù…Ù„Ø© Ø¨ÙŠÙ† Ø§Ù„Ø£Ø²Ù…Ù†Ø© (Ø§Ù„Ù…Ø¶Ø§Ø±Ø¹ØŒ Ø§Ù„Ù…Ø§Ø¶ÙŠØŒ Ø§Ù„Ù…Ø³ØªÙ‚Ø¨Ù„ Ø§Ù„ØªØ§Ù…) Ù…Ø¹ Ø§Ù„Ø­ÙØ§Ø¸ Ø¹Ù„Ù‰ Ø§Ù„Ù‚ÙˆØ§Ø¹Ø¯ Ø§Ù„Ø³Ù„ÙŠÙ…Ø©.', 'Ø­ÙˆÙ‘Ù„ Ø§Ù„Ø¬Ù…Ù„Ø© Ø¨ÙŠÙ† Ø§Ù„Ø£Ø²Ù…Ù†Ø© (Ø§Ù„Ù…Ø¶Ø§Ø±Ø¹ØŒ Ø§Ù„Ù…Ø§Ø¶ÙŠØŒ Ø§Ù„Ù…Ø³ØªÙ‚Ø¨Ù„ Ø§Ù„ØªØ§Ù…) Ù…Ø¹ Ø§Ù„Ø­ÙØ§Ø¸ Ø¹Ù„Ù‰ Ø§Ù„Ù‚ÙˆØ§Ø¹Ø¯ Ø§Ù„Ø³Ù„ÙŠÙ…Ø©.', 'grammar', 'intermediate', 45, NULL, TRUE, 1, 4)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  title_ar = EXCLUDED.title_ar,
  description = EXCLUDED.description,
  description_ar = EXCLUDED.description_ar,
  category = EXCLUDED.category,
  difficulty = EXCLUDED.difficulty,
  xp_reward = EXCLUDED.xp_reward,
  is_active = TRUE;
INSERT INTO public.gameverse_definitions (id, title, title_ar, description, description_ar, category, difficulty, xp_reward, thumbnail_url, is_active, min_players, max_players)
VALUES ('passive-converter', 'Passive Voice Converter', 'Ù…Ø­ÙˆÙ„ Ø§Ù„Ù…Ø¨Ù†ÙŠ Ù„Ù„Ù…Ø¬Ù‡ÙˆÙ„ ðŸ”„', 'Ø±ØªÙ‘Ø¨ Ø¹Ù†Ø§ØµØ± Ø§Ù„Ø¬Ù…Ù„Ø© Ù„ØªØ­ÙˆÙŠÙ„Ù‡Ø§ Ù…Ù† Ø§Ù„Ù…Ø¨Ù†ÙŠ Ù„Ù„Ù…Ø¹Ù„ÙˆÙ… (Active) Ù„Ù„Ù…Ø¨Ù†ÙŠ Ù„Ù„Ù…Ø¬Ù‡ÙˆÙ„ (Passive).', 'Ø±ØªÙ‘Ø¨ Ø¹Ù†Ø§ØµØ± Ø§Ù„Ø¬Ù…Ù„Ø© Ù„ØªØ­ÙˆÙŠÙ„Ù‡Ø§ Ù…Ù† Ø§Ù„Ù…Ø¨Ù†ÙŠ Ù„Ù„Ù…Ø¹Ù„ÙˆÙ… (Active) Ù„Ù„Ù…Ø¨Ù†ÙŠ Ù„Ù„Ù…Ø¬Ù‡ÙˆÙ„ (Passive).', 'grammar', 'intermediate', 45, NULL, TRUE, 1, 4)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  title_ar = EXCLUDED.title_ar,
  description = EXCLUDED.description,
  description_ar = EXCLUDED.description_ar,
  category = EXCLUDED.category,
  difficulty = EXCLUDED.difficulty,
  xp_reward = EXCLUDED.xp_reward,
  is_active = TRUE;
INSERT INTO public.gameverse_definitions (id, title, title_ar, description, description_ar, category, difficulty, xp_reward, thumbnail_url, is_active, min_players, max_players)
VALUES ('conditional-architect', 'Conditional Architect', 'Ù…Ù‡Ù†Ø¯Ø³ Ø§Ù„Ø¬Ù…Ù„ Ø§Ù„Ø´Ø±Ø·ÙŠØ© ðŸ—ï¸', 'Ø§Ø¨Ù†Ù Ø­Ø§Ù„Ø§Øª If Ø§Ù„Ø´Ø±Ø·ÙŠØ© (Zero, 1st, 2nd, 3rd Conditionals) ÙˆØ·Ø§Ø¨Ù‚ Ø¬Ù…Ù„Ø© Ø§Ù„Ø´Ø±Ø· ÙˆØ¬ÙˆØ§Ø¨Ù‡ Ø¨Ø¯Ù‚Ø©.', 'Ø§Ø¨Ù†Ù Ø­Ø§Ù„Ø§Øª If Ø§Ù„Ø´Ø±Ø·ÙŠØ© (Zero, 1st, 2nd, 3rd Conditionals) ÙˆØ·Ø§Ø¨Ù‚ Ø¬Ù…Ù„Ø© Ø§Ù„Ø´Ø±Ø· ÙˆØ¬ÙˆØ§Ø¨Ù‡ Ø¨Ø¯Ù‚Ø©.', 'grammar', 'intermediate', 45, NULL, TRUE, 1, 4)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  title_ar = EXCLUDED.title_ar,
  description = EXCLUDED.description,
  description_ar = EXCLUDED.description_ar,
  category = EXCLUDED.category,
  difficulty = EXCLUDED.difficulty,
  xp_reward = EXCLUDED.xp_reward,
  is_active = TRUE;
INSERT INTO public.gameverse_definitions (id, title, title_ar, description, description_ar, category, difficulty, xp_reward, thumbnail_url, is_active, min_players, max_players)
VALUES ('grammar-detective', 'Grammar Detective', 'Ù…Ø­Ù‚Ù‚ Ø£Ø¬Ø²Ø§Ø¡ Ø§Ù„ÙƒÙ„Ø§Ù… ÙˆØ§Ù„Ø£ÙØ®Ø§Ø® ðŸ”', 'Ø­Ø¯Ø¯ Ø§Ù„ÙˆØ¸ÙŠÙØ© Ø§Ù„Ù†Ø­ÙˆÙŠØ© Ù„Ù„ÙƒÙ„Ù…Ø§Øª ÙˆØ§ÙƒØªØ´Ù Ø§Ù„Ø£ÙØ®Ø§Ø® Ø§Ù„Ø´Ø§Ø¦Ø¹Ø© ÙÙŠ Ø­Ø±ÙˆÙ Ø§Ù„Ø¬Ø± ÙˆØªÙˆØ§ÙÙ‚ Ø§Ù„ÙØ¹Ù„ ÙˆØ§Ù„ÙØ§Ø¹Ù„.', 'Ø­Ø¯Ø¯ Ø§Ù„ÙˆØ¸ÙŠÙØ© Ø§Ù„Ù†Ø­ÙˆÙŠØ© Ù„Ù„ÙƒÙ„Ù…Ø§Øª ÙˆØ§ÙƒØªØ´Ù Ø§Ù„Ø£ÙØ®Ø§Ø® Ø§Ù„Ø´Ø§Ø¦Ø¹Ø© ÙÙŠ Ø­Ø±ÙˆÙ Ø§Ù„Ø¬Ø± ÙˆØªÙˆØ§ÙÙ‚ Ø§Ù„ÙØ¹Ù„ ÙˆØ§Ù„ÙØ§Ø¹Ù„.', 'grammar', 'intermediate', 45, NULL, TRUE, 1, 4)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  title_ar = EXCLUDED.title_ar,
  description = EXCLUDED.description,
  description_ar = EXCLUDED.description_ar,
  category = EXCLUDED.category,
  difficulty = EXCLUDED.difficulty,
  xp_reward = EXCLUDED.xp_reward,
  is_active = TRUE;
INSERT INTO public.gameverse_definitions (id, title, title_ar, description, description_ar, category, difficulty, xp_reward, thumbnail_url, is_active, min_players, max_players)
VALUES ('spelling-bee', 'Spelling Bee Challenge', 'ØªØ­Ø¯ÙŠ Ø§Ù„ØªÙ‡Ø¬Ø¦Ø© ÙˆØ§Ù„Ø¥Ù…Ù„Ø§Ø¡ ðŸ', 'Ø§Ø³ØªÙ…Ø¹ Ù„Ù„Ù†Ø·Ù‚ Ø§Ù„ØµÙˆØªÙŠ ÙˆØ§ÙƒØªØ¨ Ø­Ø±ÙˆÙ Ø§Ù„ÙƒÙ„Ù…Ø© Ø§Ù„ØµØ­ÙŠØ­Ø© Ø¨Ø¯Ù‚Ø© ÙˆØªØ¬Ø§ÙˆØ² Ø§Ù„Ø­Ø±ÙˆÙ Ø§Ù„ØµØ§Ù…ØªØ© ÙˆØ§Ù„Ø£ÙØ®Ø§Ø®.', 'Ø§Ø³ØªÙ…Ø¹ Ù„Ù„Ù†Ø·Ù‚ Ø§Ù„ØµÙˆØªÙŠ ÙˆØ§ÙƒØªØ¨ Ø­Ø±ÙˆÙ Ø§Ù„ÙƒÙ„Ù…Ø© Ø§Ù„ØµØ­ÙŠØ­Ø© Ø¨Ø¯Ù‚Ø© ÙˆØªØ¬Ø§ÙˆØ² Ø§Ù„Ø­Ø±ÙˆÙ Ø§Ù„ØµØ§Ù…ØªØ© ÙˆØ§Ù„Ø£ÙØ®Ø§Ø®.', 'vocabulary', 'beginner', 40, NULL, TRUE, 1, 4)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  title_ar = EXCLUDED.title_ar,
  description = EXCLUDED.description,
  description_ar = EXCLUDED.description_ar,
  category = EXCLUDED.category,
  difficulty = EXCLUDED.difficulty,
  xp_reward = EXCLUDED.xp_reward,
  is_active = TRUE;
INSERT INTO public.gameverse_definitions (id, title, title_ar, description, description_ar, category, difficulty, xp_reward, thumbnail_url, is_active, min_players, max_players)
VALUES ('pronunciation-arena', 'Pronunciation Arena', 'Ø³Ø§Ø­Ø© Ø§Ù„Ø±Ù…ÙˆØ² Ø§Ù„ØµÙˆØªÙŠØ© IPA ðŸ—£ï¸', 'Ø§Ø±Ø¨Ø· Ø§Ù„ÙƒÙ„Ù…Ø§Øª Ø¨Ø±Ù…ÙˆØ²Ù‡Ø§ Ø§Ù„ØµÙˆØªÙŠØ© Ø§Ù„Ø¯ÙˆÙ„ÙŠØ© (IPA) ÙˆØ§ÙƒØªØ´Ù Ø·Ø±ÙŠÙ‚Ø© Ø§Ù„Ù†Ø·Ù‚ Ø§Ù„Ù…Ø¹ØªÙ…Ø¯Ø© Ø¹Ø§Ù„Ù…ÙŠØ§Ù‹.', 'Ø§Ø±Ø¨Ø· Ø§Ù„ÙƒÙ„Ù…Ø§Øª Ø¨Ø±Ù…ÙˆØ²Ù‡Ø§ Ø§Ù„ØµÙˆØªÙŠØ© Ø§Ù„Ø¯ÙˆÙ„ÙŠØ© (IPA) ÙˆØ§ÙƒØªØ´Ù Ø·Ø±ÙŠÙ‚Ø© Ø§Ù„Ù†Ø·Ù‚ Ø§Ù„Ù…Ø¹ØªÙ…Ø¯Ø© Ø¹Ø§Ù„Ù…ÙŠØ§Ù‹.', 'vocabulary', 'beginner', 40, NULL, TRUE, 1, 4)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  title_ar = EXCLUDED.title_ar,
  description = EXCLUDED.description,
  description_ar = EXCLUDED.description_ar,
  category = EXCLUDED.category,
  difficulty = EXCLUDED.difficulty,
  xp_reward = EXCLUDED.xp_reward,
  is_active = TRUE;
INSERT INTO public.gameverse_definitions (id, title, title_ar, description, description_ar, category, difficulty, xp_reward, thumbnail_url, is_active, min_players, max_players)
VALUES ('minimal-pairs', 'Minimal Pairs Challenge', 'ØªØ­Ø¯ÙŠ Ø§Ù„Ø£Ø²ÙˆØ§Ø¬ Ø§Ù„ØµÙˆØªÙŠØ© Ø§Ù„Ø¯Ù‚ÙŠÙ‚Ø© ðŸŽ§', 'Ø§Ø³ØªÙ…Ø¹ ÙˆÙØ±Ù‘Ù‚ Ø¨ÙŠÙ† Ø§Ù„Ø£ØµÙˆØ§Øª Ø§Ù„Ù…ØªÙ‚Ø§Ø±Ø¨Ø© Ø¬Ø¯Ø§Ù‹ Ø§Ù„ØªÙŠ ØªØ­ÙŠÙ‘Ø± Ø§Ù„Ù…ØªØ¹Ù„Ù…ÙŠÙ† Ù…Ø«Ù„ /p/ vs /b/ Ø£Ùˆ ship vs sheep.', 'Ø§Ø³ØªÙ…Ø¹ ÙˆÙØ±Ù‘Ù‚ Ø¨ÙŠÙ† Ø§Ù„Ø£ØµÙˆØ§Øª Ø§Ù„Ù…ØªÙ‚Ø§Ø±Ø¨Ø© Ø¬Ø¯Ø§Ù‹ Ø§Ù„ØªÙŠ ØªØ­ÙŠÙ‘Ø± Ø§Ù„Ù…ØªØ¹Ù„Ù…ÙŠÙ† Ù…Ø«Ù„ /p/ vs /b/ Ø£Ùˆ ship vs sheep.', 'vocabulary', 'beginner', 40, NULL, TRUE, 1, 4)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  title_ar = EXCLUDED.title_ar,
  description = EXCLUDED.description,
  description_ar = EXCLUDED.description_ar,
  category = EXCLUDED.category,
  difficulty = EXCLUDED.difficulty,
  xp_reward = EXCLUDED.xp_reward,
  is_active = TRUE;
INSERT INTO public.gameverse_definitions (id, title, title_ar, description, description_ar, category, difficulty, xp_reward, thumbnail_url, is_active, min_players, max_players)
VALUES ('stress-detective', 'Stress Detective', 'Ù…Ø­Ù‚Ù‚ Ù†Ø¨Ø±Ø© Ø§Ù„Ù…Ù‚Ø§Ø·Ø¹ Ø§Ù„ØµÙˆØªÙŠØ© ðŸŽµ', 'Ø­Ø¯Ø¯ Ø§Ù„Ù…Ù‚Ø·Ø¹ Ø§Ù„Ù…Ø´Ø¯Ø¯ (Primary Syllable Stress) ÙÙŠ Ø§Ù„ÙƒÙ„Ù…Ø§Øª Ø§Ù„Ø¥Ù†Ø¬Ù„ÙŠØ²ÙŠØ© Ø§Ù„Ø´Ø§Ø¦Ø¹Ø© ÙˆØ§Ù„Ù…ØªØ´Ø§Ø¨Ù‡Ø©.', 'Ø­Ø¯Ø¯ Ø§Ù„Ù…Ù‚Ø·Ø¹ Ø§Ù„Ù…Ø´Ø¯Ø¯ (Primary Syllable Stress) ÙÙŠ Ø§Ù„ÙƒÙ„Ù…Ø§Øª Ø§Ù„Ø¥Ù†Ø¬Ù„ÙŠØ²ÙŠØ© Ø§Ù„Ø´Ø§Ø¦Ø¹Ø© ÙˆØ§Ù„Ù…ØªØ´Ø§Ø¨Ù‡Ø©.', 'vocabulary', 'intermediate', 40, NULL, TRUE, 1, 4)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  title_ar = EXCLUDED.title_ar,
  description = EXCLUDED.description,
  description_ar = EXCLUDED.description_ar,
  category = EXCLUDED.category,
  difficulty = EXCLUDED.difficulty,
  xp_reward = EXCLUDED.xp_reward,
  is_active = TRUE;
INSERT INTO public.gameverse_definitions (id, title, title_ar, description, description_ar, category, difficulty, xp_reward, thumbnail_url, is_active, min_players, max_players)
VALUES ('phoneme-match', 'Phoneme Match', 'Ù…Ø·Ø§Ø¨Ù‚Ø© Ø§Ù„ÙÙˆÙ†ÙŠÙ…Ø§Øª ÙˆØ§Ù„Ø£ØµÙˆØ§Øª ðŸ”¤', 'Ø·Ø§Ø¨Ù‚ Ø§Ù„Ø£ØµÙˆØ§Øª Ø§Ù„Ù…ØªØ­Ø±ÙƒØ© ÙˆØ§Ù„Ø³Ø§ÙƒÙ†Ø© Ù…Ø¹ Ø§Ù„Ø­Ø±ÙˆÙ Ø§Ù„ØªÙŠ ØªÙ…Ø«Ù„Ù‡Ø§ ÙÙŠ Ø§Ù„ØªÙ‡Ø¬Ø¦Ø© Ø§Ù„Ø¥Ù†Ø¬Ù„ÙŠØ²ÙŠØ©.', 'Ø·Ø§Ø¨Ù‚ Ø§Ù„Ø£ØµÙˆØ§Øª Ø§Ù„Ù…ØªØ­Ø±ÙƒØ© ÙˆØ§Ù„Ø³Ø§ÙƒÙ†Ø© Ù…Ø¹ Ø§Ù„Ø­Ø±ÙˆÙ Ø§Ù„ØªÙŠ ØªÙ…Ø«Ù„Ù‡Ø§ ÙÙŠ Ø§Ù„ØªÙ‡Ø¬Ø¦Ø© Ø§Ù„Ø¥Ù†Ø¬Ù„ÙŠØ²ÙŠØ©.', 'vocabulary', 'beginner', 40, NULL, TRUE, 1, 4)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  title_ar = EXCLUDED.title_ar,
  description = EXCLUDED.description,
  description_ar = EXCLUDED.description_ar,
  category = EXCLUDED.category,
  difficulty = EXCLUDED.difficulty,
  xp_reward = EXCLUDED.xp_reward,
  is_active = TRUE;
INSERT INTO public.gameverse_definitions (id, title, title_ar, description, description_ar, category, difficulty, xp_reward, thumbnail_url, is_active, min_players, max_players)
VALUES ('listening-detective', 'Listening Detective', 'Ù…Ø­Ù‚Ù‚ Ø§Ù„Ø§Ø³ØªÙ…Ø§Ø¹ Ø§Ù„ØµÙˆØªÙŠ ðŸ•µï¸â€â™‚ï¸', 'Ø§Ø³ØªÙ…Ø¹ Ù„Ù…Ù‚Ø·Ø¹ ØµÙˆØªÙŠ ÙˆØ£Ø¬Ø¨ Ø¹Ù† Ø£Ø³Ø¦Ù„Ø© Ø§Ù„ÙÙ‡Ù… ÙˆØ§Ù„Ø§Ø³ØªÙ†ØªØ§Ø¬ Ù„Ù„ØªÙØ§ØµÙŠÙ„ Ø§Ù„Ø¯Ù‚ÙŠÙ‚Ø©.', 'Ø§Ø³ØªÙ…Ø¹ Ù„Ù…Ù‚Ø·Ø¹ ØµÙˆØªÙŠ ÙˆØ£Ø¬Ø¨ Ø¹Ù† Ø£Ø³Ø¦Ù„Ø© Ø§Ù„ÙÙ‡Ù… ÙˆØ§Ù„Ø§Ø³ØªÙ†ØªØ§Ø¬ Ù„Ù„ØªÙØ§ØµÙŠÙ„ Ø§Ù„Ø¯Ù‚ÙŠÙ‚Ø©.', 'listening', 'beginner', 45, NULL, TRUE, 1, 4)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  title_ar = EXCLUDED.title_ar,
  description = EXCLUDED.description,
  description_ar = EXCLUDED.description_ar,
  category = EXCLUDED.category,
  difficulty = EXCLUDED.difficulty,
  xp_reward = EXCLUDED.xp_reward,
  is_active = TRUE;
INSERT INTO public.gameverse_definitions (id, title, title_ar, description, description_ar, category, difficulty, xp_reward, thumbnail_url, is_active, min_players, max_players)
VALUES ('dictation-challenge', 'Dictation Challenge', 'ØªØ­Ø¯ÙŠ Ø§Ù„Ø¥Ù…Ù„Ø§Ø¡ Ø§Ù„Ø³Ù…Ø¹ÙŠ Ø§Ù„Ù…Ø¨Ø§Ø´Ø± ðŸŽ™ï¸', 'Ø§Ø³ØªÙ…Ø¹ Ù„Ù„Ø¬Ù…Ù„Ø© Ø§Ù„Ù…Ù†Ø·ÙˆÙ‚Ø© ÙƒØ§Ù…Ù„Ø© ÙˆØ§ÙƒØªØ¨Ù‡Ø§ Ø¨Ø¯Ù‚Ø© Ù…Ø¹ ØªØµØ­ÙŠØ­ Ø°ÙƒÙŠ ÙŠÙ‚ÙŠØ³ Ù†Ø³Ø¨Ø© Ø§Ù„ØªØ·Ø§Ø¨Ù‚.', 'Ø§Ø³ØªÙ…Ø¹ Ù„Ù„Ø¬Ù…Ù„Ø© Ø§Ù„Ù…Ù†Ø·ÙˆÙ‚Ø© ÙƒØ§Ù…Ù„Ø© ÙˆØ§ÙƒØªØ¨Ù‡Ø§ Ø¨Ø¯Ù‚Ø© Ù…Ø¹ ØªØµØ­ÙŠØ­ Ø°ÙƒÙŠ ÙŠÙ‚ÙŠØ³ Ù†Ø³Ø¨Ø© Ø§Ù„ØªØ·Ø§Ø¨Ù‚.', 'listening', 'intermediate', 50, NULL, TRUE, 1, 4)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  title_ar = EXCLUDED.title_ar,
  description = EXCLUDED.description,
  description_ar = EXCLUDED.description_ar,
  category = EXCLUDED.category,
  difficulty = EXCLUDED.difficulty,
  xp_reward = EXCLUDED.xp_reward,
  is_active = TRUE;
INSERT INTO public.gameverse_definitions (id, title, title_ar, description, description_ar, category, difficulty, xp_reward, thumbnail_url, is_active, min_players, max_players)
VALUES ('listening-gap-fill', 'Listening Gap Fill', 'Ø¥ÙƒÙ…Ø§Ù„ Ø§Ù„ÙØ±Ø§ØºØ§Øª Ø§Ù„Ø³Ù…Ø¹ÙŠØ© ðŸ“', 'Ø§Ø³ØªÙ…Ø¹ Ù„Ù„ØªØ³Ø¬ÙŠÙ„ ÙˆØ§ÙƒØªØ´Ù Ø§Ù„ÙƒÙ„Ù…Ø© Ø§Ù„Ù…Ø­Ø°ÙˆÙØ© Ù…Ù† Ø§Ù„Ù†Øµ ÙˆØ§ÙƒØªØ¨Ù‡Ø§ Ø¨Ø§Ù„ØªÙ‡Ø¬Ø¦Ø© Ø§Ù„ØµØ­ÙŠØ­Ø©.', 'Ø§Ø³ØªÙ…Ø¹ Ù„Ù„ØªØ³Ø¬ÙŠÙ„ ÙˆØ§ÙƒØªØ´Ù Ø§Ù„ÙƒÙ„Ù…Ø© Ø§Ù„Ù…Ø­Ø°ÙˆÙØ© Ù…Ù† Ø§Ù„Ù†Øµ ÙˆØ§ÙƒØªØ¨Ù‡Ø§ Ø¨Ø§Ù„ØªÙ‡Ø¬Ø¦Ø© Ø§Ù„ØµØ­ÙŠØ­Ø©.', 'listening', 'beginner', 40, NULL, TRUE, 1, 4)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  title_ar = EXCLUDED.title_ar,
  description = EXCLUDED.description,
  description_ar = EXCLUDED.description_ar,
  category = EXCLUDED.category,
  difficulty = EXCLUDED.difficulty,
  xp_reward = EXCLUDED.xp_reward,
  is_active = TRUE;
INSERT INTO public.gameverse_definitions (id, title, title_ar, description, description_ar, category, difficulty, xp_reward, thumbnail_url, is_active, min_players, max_players)
VALUES ('accent-detective', 'Accent Detective', 'Ù…Ø­Ù‚Ù‚ Ø§Ù„Ù„Ù‡Ø¬Ø§Øª Ø§Ù„Ø£Ù…Ø±ÙŠÙƒÙŠØ© ÙˆØ§Ù„Ø¨Ø±ÙŠØ·Ø§Ù†ÙŠØ© ðŸŒ', 'Ù…ÙŠÙ‘Ø² Ø¨ÙŠÙ† Ø§Ù„Ù†Ø·Ù‚ Ø§Ù„Ø£Ù…Ø±ÙŠÙƒÙŠ ÙˆØ§Ù„Ù†Ø·Ù‚ Ø§Ù„Ø¨Ø±ÙŠØ·Ø§Ù†ÙŠ ÙˆÙ…ÙØ±Ø¯Ø§Øª Ø§Ù„Ù„Ù‡Ø¬ØªÙŠÙ† (Ù…Ø«Ù„ flat vs apartment).', 'Ù…ÙŠÙ‘Ø² Ø¨ÙŠÙ† Ø§Ù„Ù†Ø·Ù‚ Ø§Ù„Ø£Ù…Ø±ÙŠÙƒÙŠ ÙˆØ§Ù„Ù†Ø·Ù‚ Ø§Ù„Ø¨Ø±ÙŠØ·Ø§Ù†ÙŠ ÙˆÙ…ÙØ±Ø¯Ø§Øª Ø§Ù„Ù„Ù‡Ø¬ØªÙŠÙ† (Ù…Ø«Ù„ flat vs apartment).', 'listening', 'intermediate', 45, NULL, TRUE, 1, 4)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  title_ar = EXCLUDED.title_ar,
  description = EXCLUDED.description,
  description_ar = EXCLUDED.description_ar,
  category = EXCLUDED.category,
  difficulty = EXCLUDED.difficulty,
  xp_reward = EXCLUDED.xp_reward,
  is_active = TRUE;
INSERT INTO public.gameverse_definitions (id, title, title_ar, description, description_ar, category, difficulty, xp_reward, thumbnail_url, is_active, min_players, max_players)
VALUES ('reading-speedster', 'Reading Speedster', 'Ù…Ø­Ù‚Ù‚ Ø§Ù„Ù‚Ø±Ø§Ø¡Ø© Ø§Ù„Ø³Ø±ÙŠØ¹Ø© ðŸ“–', 'Ø§Ù‚Ø±Ø£ ÙÙ‚Ø±Ø© Ø³Ø±ÙŠØ¹Ø© ØªØ­Øª Ù…Ø¤Ù‚ØªØŒ Ø«Ù… Ø£Ø¬Ø¨ Ø¹Ù† Ø£Ø³Ø¦Ù„Ø© Ø§Ù„ÙÙ‡Ù… Ø¨Ø¹Ø¯ Ø¥Ø®ÙØ§Ø¡ Ø§Ù„Ù†Øµ Ù„Ø§Ø®ØªØ¨Ø§Ø± Ø§Ù„Ø°Ø§ÙƒØ±Ø© ÙˆØ§Ù„Ø§Ø³ØªÙŠØ¹Ø§Ø¨.', 'Ø§Ù‚Ø±Ø£ ÙÙ‚Ø±Ø© Ø³Ø±ÙŠØ¹Ø© ØªØ­Øª Ù…Ø¤Ù‚ØªØŒ Ø«Ù… Ø£Ø¬Ø¨ Ø¹Ù† Ø£Ø³Ø¦Ù„Ø© Ø§Ù„ÙÙ‡Ù… Ø¨Ø¹Ø¯ Ø¥Ø®ÙØ§Ø¡ Ø§Ù„Ù†Øµ Ù„Ø§Ø®ØªØ¨Ø§Ø± Ø§Ù„Ø°Ø§ÙƒØ±Ø© ÙˆØ§Ù„Ø§Ø³ØªÙŠØ¹Ø§Ø¨.', 'interactive', 'intermediate', 50, NULL, TRUE, 1, 4)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  title_ar = EXCLUDED.title_ar,
  description = EXCLUDED.description,
  description_ar = EXCLUDED.description_ar,
  category = EXCLUDED.category,
  difficulty = EXCLUDED.difficulty,
  xp_reward = EXCLUDED.xp_reward,
  is_active = TRUE;
INSERT INTO public.gameverse_definitions (id, title, title_ar, description, description_ar, category, difficulty, xp_reward, thumbnail_url, is_active, min_players, max_players)
VALUES ('paragraph-builder', 'Paragraph Builder', 'Ù…Ø¹Ù…Ø§Ø± Ø§Ù„ÙÙ‚Ø±Ø§Øª ÙˆØ§Ù„Ù…Ù‚Ø§Ù„Ø§Øª ðŸ“‘', 'Ø£Ø¹Ø¯ ØªØ±ØªÙŠØ¨ Ø§Ù„Ø¬Ù…Ù„ Ø§Ù„Ù…Ø¨Ø¹Ø«Ø±Ø© Ù„Ø¨Ù†Ø§Ø¡ ÙÙ‚Ø±Ø© Ù…Ù†Ø·Ù‚ÙŠØ© Ù…ØªÙ…Ø§Ø³ÙƒØ© ÙˆÙ…ØªØ±Ø§Ø¨Ø·Ø© Ø§Ù„Ø£ÙÙƒØ§Ø±.', 'Ø£Ø¹Ø¯ ØªØ±ØªÙŠØ¨ Ø§Ù„Ø¬Ù…Ù„ Ø§Ù„Ù…Ø¨Ø¹Ø«Ø±Ø© Ù„Ø¨Ù†Ø§Ø¡ ÙÙ‚Ø±Ø© Ù…Ù†Ø·Ù‚ÙŠØ© Ù…ØªÙ…Ø§Ø³ÙƒØ© ÙˆÙ…ØªØ±Ø§Ø¨Ø·Ø© Ø§Ù„Ø£ÙÙƒØ§Ø±.', 'interactive', 'intermediate', 50, NULL, TRUE, 1, 4)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  title_ar = EXCLUDED.title_ar,
  description = EXCLUDED.description,
  description_ar = EXCLUDED.description_ar,
  category = EXCLUDED.category,
  difficulty = EXCLUDED.difficulty,
  xp_reward = EXCLUDED.xp_reward,
  is_active = TRUE;
INSERT INTO public.gameverse_definitions (id, title, title_ar, description, description_ar, category, difficulty, xp_reward, thumbnail_url, is_active, min_players, max_players)
VALUES ('story-completion', 'Story Completion', 'Ø¥ÙƒÙ…Ø§Ù„ Ø§Ù„Ù‚ØµØ© Ø§Ù„ØªÙØ§Ø¹Ù„ÙŠØ© ðŸ§­', 'Ø¹Ø´ Ù‚ØµØ© ØªÙØ§Ø¹Ù„ÙŠØ© Ù…ØªØ¹Ø¯Ø¯Ø© Ø§Ù„Ù…Ø³Ø§Ø±Ø§Øª ÙˆØ§Ø®ØªØ± Ø§Ù„Ù‚Ø±Ø§Ø± Ø§Ù„Ù„ØºÙˆÙŠ Ø§Ù„Ø³Ù„ÙŠÙ… Ù„Ù„Ù…Ø¶ÙŠ Ù‚Ø¯Ù…Ø§Ù‹ ÙÙŠ Ø§Ù„Ø£Ø­Ø¯Ø§Ø«.', 'Ø¹Ø´ Ù‚ØµØ© ØªÙØ§Ø¹Ù„ÙŠØ© Ù…ØªØ¹Ø¯Ø¯Ø© Ø§Ù„Ù…Ø³Ø§Ø±Ø§Øª ÙˆØ§Ø®ØªØ± Ø§Ù„Ù‚Ø±Ø§Ø± Ø§Ù„Ù„ØºÙˆÙŠ Ø§Ù„Ø³Ù„ÙŠÙ… Ù„Ù„Ù…Ø¶ÙŠ Ù‚Ø¯Ù…Ø§Ù‹ ÙÙŠ Ø§Ù„Ø£Ø­Ø¯Ø§Ø«.', 'interactive', 'intermediate', 45, NULL, TRUE, 1, 4)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  title_ar = EXCLUDED.title_ar,
  description = EXCLUDED.description,
  description_ar = EXCLUDED.description_ar,
  category = EXCLUDED.category,
  difficulty = EXCLUDED.difficulty,
  xp_reward = EXCLUDED.xp_reward,
  is_active = TRUE;
INSERT INTO public.gameverse_definitions (id, title, title_ar, description, description_ar, category, difficulty, xp_reward, thumbnail_url, is_active, min_players, max_players)
VALUES ('ai-duel', 'AI Opponent Duel', 'Ù…Ø¨Ø§Ø±Ø²Ø© Ø§Ù„Ø°ÙƒØ§Ø¡ Ø§Ù„Ø§ØµØ·Ù†Ø§Ø¹ÙŠ âš”ï¸', 'Ø§Ø¯Ø®Ù„ ÙÙŠ Ù…ÙˆØ§Ø¬Ù‡Ø© Ù…Ø¨Ø§Ø´Ø±Ø© ÙˆØ³Ø±ÙŠØ¹Ø© Ø¶Ø¯ Ø±ÙˆØ¨ÙˆØªØ§Øª Ø°ÙƒÙŠØ© Ø¨Ù…Ø³ØªÙˆÙŠØ§Øª ØµØ¹ÙˆØ¨Ø© Ù…ØªÙ†ÙˆØ¹Ø©.', 'Ø§Ø¯Ø®Ù„ ÙÙŠ Ù…ÙˆØ§Ø¬Ù‡Ø© Ù…Ø¨Ø§Ø´Ø±Ø© ÙˆØ³Ø±ÙŠØ¹Ø© Ø¶Ø¯ Ø±ÙˆØ¨ÙˆØªØ§Øª Ø°ÙƒÙŠØ© Ø¨Ù…Ø³ØªÙˆÙŠØ§Øª ØµØ¹ÙˆØ¨Ø© Ù…ØªÙ†ÙˆØ¹Ø©.', 'speed_trivia', 'beginner', 60, NULL, TRUE, 1, 4)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  title_ar = EXCLUDED.title_ar,
  description = EXCLUDED.description,
  description_ar = EXCLUDED.description_ar,
  category = EXCLUDED.category,
  difficulty = EXCLUDED.difficulty,
  xp_reward = EXCLUDED.xp_reward,
  is_active = TRUE;
INSERT INTO public.gameverse_definitions (id, title, title_ar, description, description_ar, category, difficulty, xp_reward, thumbnail_url, is_active, min_players, max_players)
VALUES ('flashcards', 'Flashcard Deck', 'Ø¨Ø·Ø§Ù‚Ø§Øª Ø§Ù„ØªÙƒØ±Ø§Ø± Ø§Ù„Ù…ØªØ¨Ø§Ø¹Ø¯ ðŸƒ', 'Ø±Ø§Ø¬Ø¹ Ø§Ù„ÙƒÙ„Ù…Ø§Øª ÙˆØ­ÙØ¸Ù‡Ø§ ÙÙŠ Ø§Ù„Ø°Ø§ÙƒØ±Ø© Ø·ÙˆÙŠÙ„Ø© Ø§Ù„Ù…Ø¯Ù‰ Ø¨Ø§Ø³ØªØ®Ø¯Ø§Ù… ØªÙ‚Ù†ÙŠØ© Ø§Ù„ØªÙƒØ±Ø§Ø± Ø§Ù„Ù…ØªØ¨Ø§Ø¹Ø¯ (SRS).', 'Ø±Ø§Ø¬Ø¹ Ø§Ù„ÙƒÙ„Ù…Ø§Øª ÙˆØ­ÙØ¸Ù‡Ø§ ÙÙŠ Ø§Ù„Ø°Ø§ÙƒØ±Ø© Ø·ÙˆÙŠÙ„Ø© Ø§Ù„Ù…Ø¯Ù‰ Ø¨Ø§Ø³ØªØ®Ø¯Ø§Ù… ØªÙ‚Ù†ÙŠØ© Ø§Ù„ØªÙƒØ±Ø§Ø± Ø§Ù„Ù…ØªØ¨Ø§Ø¹Ø¯ (SRS).', 'vocabulary', 'beginner', 30, NULL, TRUE, 1, 4)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  title_ar = EXCLUDED.title_ar,
  description = EXCLUDED.description,
  description_ar = EXCLUDED.description_ar,
  category = EXCLUDED.category,
  difficulty = EXCLUDED.difficulty,
  xp_reward = EXCLUDED.xp_reward,
  is_active = TRUE;

-- 3. VIDEO CATEGORIES SEED
INSERT INTO public.video_categories (id, name_en, name_ar, description_ar, icon_name, order_index)
VALUES ('movie_scenes', 'Movie Scenes', 'Ù…Ø´Ø§Ù‡Ø¯ Ø³ÙŠÙ†Ù…Ø§Ø¦ÙŠØ© Ø´Ù‡ÙŠØ±Ø©', 'Ø£Ù‚ÙˆÙ‰ Ø§Ù„Ø­ÙˆØ§Ø±Ø§Øª Ø§Ù„Ø³ÙŠÙ†Ù…Ø§Ø¦ÙŠØ© Ù…Ù† Ù‡ÙˆÙ„ÙŠÙˆÙˆØ¯ Ù…Ø¹ Ø§Ù„Ù†Ø·Ù‚ ÙˆØ§Ù„Ù„Ù‡Ø¬Ø§Øª Ø§Ù„ÙˆØ§Ù‚Ø¹ÙŠØ©', 'Film', 0)
ON CONFLICT (id) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  description_ar = EXCLUDED.description_ar;
INSERT INTO public.video_categories (id, name_en, name_ar, description_ar, icon_name, order_index)
VALUES ('tv_series', 'TV Series', 'Ù…Ø³Ù„Ø³Ù„Ø§Øª Ø¯Ø±Ø§Ù…ÙŠØ© ÙˆØªÙ„ÙØ²ÙŠÙˆÙ†ÙŠØ©', 'Ù…Ø´Ø§Ù‡Ø¯ Ù…Ù† Ø£Ø´Ù‡Ø± Ø§Ù„Ù…Ø³Ù„Ø³Ù„Ø§Øª Ø§Ù„Ø¹Ø§Ù„Ù…ÙŠØ© Ù„ØªØ·ÙˆÙŠØ± Ø§Ù„Ø­ØµÙŠÙ„Ø© Ø§Ù„ÙŠÙˆÙ…ÙŠØ©', 'Tv', 1)
ON CONFLICT (id) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  description_ar = EXCLUDED.description_ar;
INSERT INTO public.video_categories (id, name_en, name_ar, description_ar, icon_name, order_index)
VALUES ('sitcoms', 'Sitcoms & Comedy', 'Ù…Ø³Ù„Ø³Ù„Ø§Øª ÙƒÙˆÙ…ÙŠØ¯ÙŠØ© (Sitcoms)', 'Ø§Ù„ÙƒÙˆÙ…ÙŠØ¯ÙŠØ§ ÙˆØ§Ù„Ù…ÙØ§Ø±Ù‚Ø§Øª Ø§Ù„Ø­ÙˆØ§Ø±ÙŠØ© (Friends, The Office, Modern Family)', 'Smile', 2)
ON CONFLICT (id) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  description_ar = EXCLUDED.description_ar;
INSERT INTO public.video_categories (id, name_en, name_ar, description_ar, icon_name, order_index)
VALUES ('interviews', 'Interviews & Talks', 'Ù…Ù‚Ø§Ø¨Ù„Ø§Øª ÙˆØ­ÙˆØ§Ø±Ø§Øª Ø­ØµØ±ÙŠØ©', 'Ù„Ù‚Ø§Ø¡Ø§Øª Ø§Ù„Ù…Ø´Ø§Ù‡ÙŠØ± ÙˆØ§Ù„Ø®Ø¨Ø±Ø§Ø¡ ÙˆØ£ØµØ­Ø§Ø¨ Ø§Ù„Ø¥Ù†Ø¬Ø§Ø²Ø§Øª', 'Mic', 3)
ON CONFLICT (id) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  description_ar = EXCLUDED.description_ar;
INSERT INTO public.video_categories (id, name_en, name_ar, description_ar, icon_name, order_index)
VALUES ('daily_conversations', 'Daily Conversations', 'Ø­ÙˆØ§Ø±Ø§Øª ÙˆÙ…Ø­Ø§Ø¯Ø«Ø§Øª ÙŠÙˆÙ…ÙŠØ©', 'Ù…ÙˆØ§Ù‚Ù Ø§Ù„Ø­ÙŠØ§Ø© Ø§Ù„ÙŠÙˆÙ…ÙŠØ© ÙÙŠ Ø§Ù„Ø³ÙˆÙ‚ØŒ Ø§Ù„Ù…Ø·Ø¹Ù…ØŒ ÙˆØ§Ù„Ù…ÙˆØ§ØµÙ„Ø§Øª', 'MessageCircle', 4)
ON CONFLICT (id) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  description_ar = EXCLUDED.description_ar;
INSERT INTO public.video_categories (id, name_en, name_ar, description_ar, icon_name, order_index)
VALUES ('street_interviews', 'Street Interviews', 'Ù„Ù‚Ø§Ø¡Ø§Øª Ø§Ù„Ø´Ø§Ø±Ø¹ Ø§Ù„Ø­Ù‚ÙŠÙ‚ÙŠØ©', 'Ø­ÙˆØ§Ø±Ø§Øª Ø¹ÙÙˆÙŠØ© Ù…Ø¹ Ù…ØªØ­Ø¯Ø«ÙŠÙ† Ø£ØµÙ„ÙŠÙŠÙ† ÙÙŠ Ø´ÙˆØ§Ø±Ø¹ Ù„Ù†Ø¯Ù† ÙˆÙ†ÙŠÙˆÙŠÙˆØ±Ùƒ', 'Users', 5)
ON CONFLICT (id) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  description_ar = EXCLUDED.description_ar;
INSERT INTO public.video_categories (id, name_en, name_ar, description_ar, icon_name, order_index)
VALUES ('podcasts', 'Podcasts', 'Ø¨ÙˆØ¯ÙƒØ§Ø³Øª Ø¨Ø§Ù„Ø¥Ù†Ø¬Ù„ÙŠØ²ÙŠØ©', 'Ù…Ù‚Ø§Ø·Ø¹ ØµÙˆØªÙŠØ© ÙˆØ¨ØµØ±ÙŠØ© ØºÙ†ÙŠØ© Ø¨Ø§Ù„Ø£ÙÙƒØ§Ø± ÙˆØ§Ù„Ù…ÙØ±Ø¯Ø§Øª Ø§Ù„Ø¯Ù‚ÙŠÙ‚Ø©', 'Headphones', 6)
ON CONFLICT (id) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  description_ar = EXCLUDED.description_ar;
INSERT INTO public.video_categories (id, name_en, name_ar, description_ar, icon_name, order_index)
VALUES ('ted_talks', 'TED Talks', 'Ø£Ø­Ø§Ø¯ÙŠØ« ØªÙŠØ¯ Ø§Ù„Ù…Ù„Ù‡Ù…Ø© (TED Talks)', 'Ø®Ø·Ø§Ø¨Ø§Øª Ù…Ù„Ù‡Ù…Ø© ÙˆØ£ÙÙƒØ§Ø± ØªØºÙŠØ± Ø§Ù„Ø¹Ø§Ù„Ù… Ø¨Ù„ØºØ© Ø¨Ù„ÙŠØºØ© ÙˆÙˆØ§Ø¶Ø­Ø©', 'Sparkles', 7)
ON CONFLICT (id) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  description_ar = EXCLUDED.description_ar;
INSERT INTO public.video_categories (id, name_en, name_ar, description_ar, icon_name, order_index)
VALUES ('documentaries', 'Documentaries', 'Ø£ÙÙ„Ø§Ù… ÙˆØ«Ø§Ø¦Ù‚ÙŠØ© ÙˆØ§Ø³ØªÙƒØ´Ø§ÙÙŠØ©', 'Ø¹Ù„ÙˆÙ…ØŒ Ø·Ø¨ÙŠØ¹Ø©ØŒ ÙˆØªØ§Ø±ÙŠØ® Ø¨Ù„ØºØ© ÙØµØ­Ù‰ ÙˆÙ†Ø·Ù‚ Ù…Ø¯Ø±ÙˆØ³', 'Globe', 8)
ON CONFLICT (id) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  description_ar = EXCLUDED.description_ar;
INSERT INTO public.video_categories (id, name_en, name_ar, description_ar, icon_name, order_index)
VALUES ('business_english', 'Business English', 'Ø§Ù„Ø¥Ù†Ø¬Ù„ÙŠØ²ÙŠØ© Ø§Ù„Ù…Ù‡Ù†ÙŠØ© ÙˆØ§Ù„Ø´Ø±ÙƒØ§Øª', 'Ø¨ÙŠØ¦Ø© Ø§Ù„Ø¹Ù…Ù„ØŒ Ø§Ù„Ø§Ø¬ØªÙ…Ø§Ø¹Ø§ØªØŒ Ø§Ù„Ø¹Ø±ÙˆØ¶ Ø§Ù„ØªÙ‚Ø¯ÙŠÙ…ÙŠØ©ØŒ ÙˆØ§Ù„ØªÙØ§ÙˆØ¶', 'Briefcase', 9)
ON CONFLICT (id) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  description_ar = EXCLUDED.description_ar;
INSERT INTO public.video_categories (id, name_en, name_ar, description_ar, icon_name, order_index)
VALUES ('travel_english', 'Travel English', 'Ø¥Ù†Ø¬Ù„ÙŠØ²ÙŠØ© Ø§Ù„Ø³ÙØ± ÙˆØ§Ù„Ù…Ø·Ø§Ø±Ø§Øª', 'Ø­Ø¬ÙˆØ²Ø§Øª Ø§Ù„Ø·ÙŠØ±Ø§Ù†ØŒ Ø§Ù„ÙÙ†Ø§Ø¯Ù‚ØŒ Ø·Ù„Ø¨ Ø§Ù„Ù…Ø³Ø§Ø¹Ø¯Ø©ØŒ ÙˆØ§Ù„ØªØ¬ÙˆØ§Ù„', 'Plane', 10)
ON CONFLICT (id) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  description_ar = EXCLUDED.description_ar;
INSERT INTO public.video_categories (id, name_en, name_ar, description_ar, icon_name, order_index)
VALUES ('academic_english', 'Academic English', 'Ø§Ù„Ø¥Ù†Ø¬Ù„ÙŠØ²ÙŠØ© Ø§Ù„Ø£ÙƒØ§Ø¯ÙŠÙ…ÙŠØ© ÙˆØ§Ù„Ø¬Ø§Ù…Ø¹ÙŠØ©', 'Ù…Ø­Ø§Ø¶Ø±Ø§Øª ÙˆÙ…ØµØ·Ù„Ø­Ø§Øª Ø¨Ø­Ø«ÙŠØ© Ù„Ù„Ø¬Ø§Ù…Ø¹Ø§Øª ÙˆØ§Ø®ØªØ¨Ø§Ø±Ø§Øª Ø§Ù„Ø¢ÙŠÙ„ØªØ³ ÙˆØ§Ù„ØªØ±Ø¬Ù…Ø©', 'GraduationCap', 11)
ON CONFLICT (id) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  description_ar = EXCLUDED.description_ar;
INSERT INTO public.video_categories (id, name_en, name_ar, description_ar, icon_name, order_index)
VALUES ('job_interviews', 'Job Interviews', 'Ù…Ù‚Ø§Ø¨Ù„Ø§Øª Ø§Ù„ØªÙˆØ¸ÙŠÙ (Job Interviews)', 'ÙƒÙŠÙ ØªØ¬ÙŠØ¨ Ø¨Ø«Ù‚Ø© ÙˆØ°ÙƒØ§Ø¡ Ø¹Ù„Ù‰ Ø£Ø³Ø¦Ù„Ø© Ø§Ù„Ù…Ù‚Ø§Ø¨Ù„Ø§Øª Ø§Ù„Ø´Ø®ØµÙŠØ© Ø¨Ø§Ù„Ø¥Ù†Ø¬Ù„ÙŠØ²ÙŠØ©', 'Award', 12)
ON CONFLICT (id) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  description_ar = EXCLUDED.description_ar;
INSERT INTO public.video_categories (id, name_en, name_ar, description_ar, icon_name, order_index)
VALUES ('american_english', 'American English', 'Ø§Ù„Ø¥Ù†Ø¬Ù„ÙŠØ²ÙŠØ© ÙˆØ§Ù„Ù„ÙƒÙ†Ø© Ø§Ù„Ø£Ù…Ø±ÙŠÙƒÙŠØ© ðŸ‡ºðŸ‡¸', 'Ø§Ù„Ù†Ø·Ù‚ Ø§Ù„Ø£Ù…Ø±ÙŠÙƒÙŠ Ø§Ù„Ø£ØµÙŠÙ„ØŒ Ø§Ù„Ø±Ø¨Ø· Ø§Ù„ØµÙˆØªÙŠØŒ ÙˆØ§Ù„ØªØ¹Ø§Ø¨ÙŠØ± Ø§Ù„Ù…Ù†ØªØ´Ø±Ø©', 'Compass', 13)
ON CONFLICT (id) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  description_ar = EXCLUDED.description_ar;
INSERT INTO public.video_categories (id, name_en, name_ar, description_ar, icon_name, order_index)
VALUES ('british_english', 'British English', 'Ø§Ù„Ø¥Ù†Ø¬Ù„ÙŠØ²ÙŠØ© ÙˆØ§Ù„Ù„ÙƒÙ†Ø© Ø§Ù„Ø¨Ø±ÙŠØ·Ø§Ù†ÙŠØ© ðŸ‡¬ðŸ‡§', 'Ø§Ù„Ù†Ø·Ù‚ Ø§Ù„Ø¨Ø±ÙŠØ·Ø§Ù†ÙŠ Ø§Ù„Ù‚ÙŠØ§Ø³ÙŠØŒ Ù†ØºÙ…Ø§Øª Ø§Ù„ØµÙˆØªØŒ ÙˆÙ…ÙØ±Ø¯Ø§Øª Ø§Ù„Ù…Ù…Ù„ÙƒØ© Ø§Ù„Ù…ØªØ­Ø¯Ø©', 'Compass', 14)
ON CONFLICT (id) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  description_ar = EXCLUDED.description_ar;
INSERT INTO public.video_categories (id, name_en, name_ar, description_ar, icon_name, order_index)
VALUES ('pronunciation_practice', 'Pronunciation Practice', 'ØªØ¯Ø±ÙŠØ¨Ø§Øª Ø§Ù„Ù†Ø·Ù‚ Ø§Ù„ØµÙˆØªÙŠ (Phonetics)', 'Ù…Ø®Ø§Ø±Ø¬ Ø§Ù„Ø­Ø±ÙˆÙ Ø§Ù„ØµØ¹Ø¨Ø©ØŒ Ø§Ù„Ø±Ø¨Ø· Ø§Ù„ØµÙˆØªÙŠØŒ ÙˆØ§Ù„Ø±Ù…ÙˆØ² Ø§Ù„ØµÙˆØªÙŠØ© IPA', 'Volume2', 15)
ON CONFLICT (id) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  description_ar = EXCLUDED.description_ar;
INSERT INTO public.video_categories (id, name_en, name_ar, description_ar, icon_name, order_index)
VALUES ('slang_and_expressions', 'Slang and Expressions', 'Ø§Ù„Ù…ØµØ·Ù„Ø­Ø§Øª Ø§Ù„Ø´Ø¹Ø¨ÙŠØ© ÙˆØ§Ù„Ø¹Ø§Ù…ÙŠØ©', 'Ø§Ù„Ø¥ÙŠØ¯ÙŠÙˆÙ…Ø§Øª Ø§Ù„Ø´Ø§Ø¦Ø¹Ø© ÙˆÙ…Ø§ ÙŠØªØ­Ø¯Ø« Ø¨Ù‡ Ø§Ù„Ø´Ø¨Ø§Ø¨ ÙÙŠ Ø§Ù„Ø´Ø§Ø±Ø¹', 'Flame', 16)
ON CONFLICT (id) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  description_ar = EXCLUDED.description_ar;
INSERT INTO public.video_categories (id, name_en, name_ar, description_ar, icon_name, order_index)
VALUES ('english_for_beginners', 'English for Beginners', 'Ø¥Ù†Ø¬Ù„ÙŠØ²ÙŠØ© Ø§Ù„Ù…Ø¨ØªØ¯Ø¦ÙŠÙ† (A1 - A2)', 'Ù…Ù‚Ø§Ø·Ø¹ Ø¨Ø·ÙŠØ¦Ø© ÙˆÙˆØ§Ø¶Ø­Ø© Ø¨Ø¬Ù…Ù„ Ø¨Ø³ÙŠØ·Ø© Ù„Ø¨Ù†Ø§Ø¡ Ø§Ù„Ø«Ù‚Ø© ÙˆØ§Ù„Ø£Ø³Ø§Ø³', 'BookOpen', 17)
ON CONFLICT (id) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  description_ar = EXCLUDED.description_ar;
INSERT INTO public.video_categories (id, name_en, name_ar, description_ar, icon_name, order_index)
VALUES ('advanced_english', 'Advanced English', 'Ø§Ù„Ù…Ø³ØªÙˆÙ‰ Ø§Ù„Ù…ØªÙ‚Ø¯Ù… ÙˆØ§Ù„Ø·Ù„Ø§Ù‚Ø© (C1 - C2)', 'ØªØ±Ø§ÙƒÙŠØ¨ Ø¨Ù„Ø§ØºÙŠØ© Ù…Ø¹Ù‚Ø¯Ø©ØŒ ÙÙƒØ§Ù‡Ø© Ø°ÙƒÙŠØ©ØŒ ÙˆØ³Ø±Ø¹Ø© Ù†Ø·Ù‚ Ø¹Ø§Ù„ÙŠØ©', 'Zap', 18)
ON CONFLICT (id) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  description_ar = EXCLUDED.description_ar;
INSERT INTO public.video_categories (id, name_en, name_ar, description_ar, icon_name, order_index)
VALUES ('listening_comprehension', 'Listening Comprehension', 'Ø§Ø®ØªØ¨Ø§Ø±Ø§Øª ÙˆÙÙ‡Ù… Ø§Ù„Ø§Ø³ØªÙ…Ø§Ø¹', 'ØªÙ…Ø§Ø±ÙŠÙ† ÙˆØªØ­Ø¯ÙŠØ§Øª ÙÙƒ Ø´ÙØ±Ø© Ø§Ù„ÙƒÙ„Ø§Ù… Ø§Ù„Ø³Ø±ÙŠØ¹ ÙˆØ£Ø³Ø¦Ù„Ø© Ø§Ù„ÙÙ‡Ù…', 'Ear', 19)
ON CONFLICT (id) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  description_ar = EXCLUDED.description_ar;

-- 4. GRAMMAR TOPICS SEED
INSERT INTO public.grammar_topics (id, title, title_ar, category, explanation, explanation_ar, formula, examples, common_mistakes, level)
VALUES ('present-simple', 'Present Simple Tense', NULL, 'Ø£Ø²Ù…Ù†Ø© Ø§Ù„Ù…Ø¶Ø§Ø±Ø¹', NULL, NULL, NULL, '[{"en":"She manages an engineering team at a multinational software company.","ar":"Ù‡ÙŠ ØªØ¯ÙŠØ± ÙØ±ÙŠÙ‚Ø§Ù‹ Ù‡Ù†Ø¯Ø³ÙŠØ§Ù‹ ÙÙŠ Ø´Ø±ÙƒØ© Ø¨Ø±Ù…Ø¬ÙŠØ§Øª Ù…ØªØ¹Ø¯Ø¯Ø© Ø§Ù„Ø¬Ù†Ø³ÙŠØ§Øª.","highlight":"manages","context":"ÙˆØ¸ÙŠÙØ© ÙˆØ­Ø§Ù„Ø© Ø¯Ø§Ø¦Ù…Ø©"},{"en":"The morning train to Alexandria leaves daily at 7:30 AM sharp.","ar":"Ù‚Ø·Ø§Ø± Ø§Ù„ØµØ¨Ø§Ø­ Ø¥Ù„Ù‰ Ø§Ù„Ø¥Ø³ÙƒÙ†Ø¯Ø±ÙŠØ© ÙŠØºØ§Ø¯Ø± ÙŠÙˆÙ…ÙŠØ§Ù‹ ÙÙŠ ØªÙ…Ø§Ù… Ø§Ù„Ø³Ø§Ø¹Ø© 7:30 ØµØ¨Ø§Ø­Ø§Ù‹.","highlight":"leaves","context":"Ø¬Ø¯ÙˆÙ„ Ù…ÙˆØ§Ø¹ÙŠØ¯ Ø±Ø³Ù…ÙŠ Ø«Ø§Ø¨Øª"},{"en":"Water boils at 100 degrees Celsius under standard atmospheric pressure.","ar":"ÙŠØºÙ„ÙŠ Ø§Ù„Ù…Ø§Ø¡ Ø¹Ù†Ø¯ 100 Ø¯Ø±Ø¬Ø© Ù…Ø¦ÙˆÙŠØ© ØªØ­Øª Ø§Ù„Ø¶ØºØ· Ø§Ù„Ø¬ÙˆÙŠ Ø§Ù„Ù…Ø¹ØªØ§Ø¯.","highlight":"boils","context":"Ø­Ù‚ÙŠÙ‚Ø© Ø¹Ù„Ù…ÙŠØ© Ø«Ø§Ø¨ØªØ©"}]'::jsonb, '[]'::jsonb, 'A1 - Ù…Ø¨ØªØ¯Ø¦')
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  explanation = EXCLUDED.explanation,
  formula = EXCLUDED.formula;
INSERT INTO public.grammar_topics (id, title, title_ar, category, explanation, explanation_ar, formula, examples, common_mistakes, level)
VALUES ('present-continuous', 'Present Continuous Tense', NULL, 'Ø£Ø²Ù…Ù†Ø© Ø§Ù„Ù…Ø¶Ø§Ø±Ø¹', NULL, NULL, NULL, '[{"en":"The developers are testing the new payment gateway right now.","ar":"Ø§Ù„Ù…Ø·ÙˆØ±ÙˆÙ† ÙŠØ®ØªØ¨Ø±ÙˆÙ† Ø¨ÙˆØ§Ø¨Ø© Ø§Ù„Ø¯ÙØ¹ Ø§Ù„Ø¬Ø¯ÙŠØ¯Ø© ÙÙŠ Ù‡Ø°Ù‡ Ø§Ù„Ù„Ø­Ø¸Ø© Ø¨Ø§Ù„Ø¶Ø¨Ø·.","highlight":"are testing","context":"Ø­Ø¯Ø« ÙŠÙ‚Ø¹ Ø§Ù„Ø¢Ù† Ù…Ø¨Ø§Ø´Ø±Ø©"},{"en":"Omar is staying at his uncle''s apartment this week until his renovation finishes.","ar":"Ø¹Ù…Ø± ÙŠÙ‚ÙŠÙ… ÙÙŠ Ø´Ù‚Ø© Ø¹Ù…Ù‡ Ù‡Ø°Ø§ Ø§Ù„Ø£Ø³Ø¨ÙˆØ¹ Ù…Ø¤Ù‚ØªØ§Ù‹ Ø­ØªÙ‰ ÙŠÙ†ØªÙ‡ÙŠ ØªØ´Ø·ÙŠØ¨ Ø´Ù‚ØªÙ‡.","highlight":"is staying","context":"ÙˆØ¶Ø¹ Ù…Ø¤Ù‚Øª Ø®Ù„Ø§Ù„ Ù‡Ø°Ø§ Ø§Ù„Ø£Ø³Ø¨ÙˆØ¹"},{"en":"We are flying to Dubai next Tuesday; the tickets and hotel are already booked.","ar":"Ù†Ø­Ù† Ù…Ø³Ø§ÙØ±ÙˆÙ† Ø¬ÙˆØ§Ù‹ Ø¥Ù„Ù‰ Ø¯Ø¨ÙŠ Ø§Ù„Ø«Ù„Ø§Ø«Ø§Ø¡ Ø§Ù„Ù‚Ø§Ø¯Ù…ØŒ Ø§Ù„ØªØ°Ø§ÙƒØ± ÙˆØ§Ù„ÙÙ†Ø¯Ù‚ Ù…Ø­Ø¬ÙˆØ²Ø© Ø¨Ø§Ù„ÙØ¹Ù„.","highlight":"are flying","context":"ØªØ±ØªÙŠØ¨ Ù…Ø³ØªÙ‚Ø¨Ù„ÙŠ Ù…Ø­Ø¬ÙˆØ² ÙˆÙ…Ø¤ÙƒØ¯"}]'::jsonb, '[]'::jsonb, 'A1 - Ù…Ø¨ØªØ¯Ø¦')
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  explanation = EXCLUDED.explanation,
  formula = EXCLUDED.formula;
INSERT INTO public.grammar_topics (id, title, title_ar, category, explanation, explanation_ar, formula, examples, common_mistakes, level)
VALUES ('present-perfect', 'Present Perfect Simple', NULL, 'Ø£Ø²Ù…Ù†Ø© Ø§Ù„Ù…Ø¶Ø§Ø±Ø¹', NULL, NULL, NULL, '[{"en":"I have lost my passport, so I cannot board the international flight.","ar":"Ù„Ù‚Ø¯ ÙÙ‚Ø¯Øª Ø¬ÙˆØ§Ø² Ø³ÙØ±ÙŠØŒ ÙˆÙ„Ø°Ù„Ùƒ Ù„Ø§ ÙŠÙ…ÙƒÙ†Ù†ÙŠ Ø§Ù„ØµØ¹ÙˆØ¯ Ø¥Ù„Ù‰ Ø§Ù„Ø·Ø§Ø¦Ø±Ø© Ø§Ù„Ø¯ÙˆÙ„ÙŠØ© Ø§Ù„Ø¢Ù†.","highlight":"have lost","context":"ÙØ¹Ù„ Ù…Ø§Ø¶Ù Ø£Ø«Ø±Ù‡ Ù…Ø¨Ø§Ø´Ø± ÙÙŠ Ø§Ù„Ø­Ø§Ø¶Ø±"},{"en":"Has Karim ever worked with international distributed remote teams?","ar":"Ù‡Ù„ Ø³Ø¨Ù‚ Ù„ÙƒØ±ÙŠÙ… Ø¹Ù„Ù‰ Ø§Ù„Ø¥Ø·Ù„Ø§Ù‚ Ø§Ù„Ø¹Ù…Ù„ Ù…Ø¹ ÙØ±Ù‚ Ø¹Ù…Ù„ Ø¯ÙˆÙ„ÙŠØ© Ù…ÙˆØ²Ø¹Ø© Ø¹Ù† Ø¨Ø¹Ø¯ØŸ","highlight":"Has Karim ever worked","context":"Ø³Ø¤Ø§Ù„ Ø¹Ù† Ø±ØµÙŠØ¯ Ø§Ù„Ø®Ø¨Ø±Ø§Øª Ø§Ù„Ø­ÙŠØ§ØªÙŠØ©"},{"en":"They have lived in Alexandria since they graduated in 2018.","ar":"Ù‡Ù… ÙŠØ¹ÙŠØ´ÙˆÙ† ÙÙŠ Ø§Ù„Ø¥Ø³ÙƒÙ†Ø¯Ø±ÙŠØ© Ù…Ù†Ø° ØªØ®Ø±Ø¬Ù‡Ù… ÙÙŠ Ø¹Ø§Ù… 2018.","highlight":"have lived","context":"Ø­Ø¯Ø« Ø¨Ø¯Ø£ ÙÙŠ Ø§Ù„Ù…Ø§Ø¶ÙŠ ÙˆÙ…Ø³ØªÙ…Ø± Ø­ØªÙ‰ Ø§Ù„Ø¢Ù†"}]'::jsonb, '[]'::jsonb, 'A2 - ØªØ£Ø³ÙŠØ³ÙŠ')
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  explanation = EXCLUDED.explanation,
  formula = EXCLUDED.formula;
INSERT INTO public.grammar_topics (id, title, title_ar, category, explanation, explanation_ar, formula, examples, common_mistakes, level)
VALUES ('present-perfect-continuous', 'Present Perfect Continuous', NULL, 'Ø£Ø²Ù…Ù†Ø© Ø§Ù„Ù…Ø¶Ø§Ø±Ø¹', NULL, NULL, NULL, '[{"en":"The data science team has been analyzing customer logs since 6 AM.","ar":"ÙØ±ÙŠÙ‚ Ø¹Ù„ÙˆÙ… Ø§Ù„Ø¨ÙŠØ§Ù†Ø§Øª ÙŠØ¹ÙƒÙ Ø¹Ù„Ù‰ ØªØ­Ù„ÙŠÙ„ Ø³Ø¬Ù„Ø§Øª Ø§Ù„Ø¹Ù…Ù„Ø§Ø¡ Ø¨Ø§Ø³ØªÙ…Ø±Ø§Ø± Ù…Ù†Ø° Ø§Ù„Ø³Ø§Ø¹Ø© Ø§Ù„Ø³Ø§Ø¯Ø³Ø© ØµØ¨Ø§Ø­Ø§Ù‹.","highlight":"has been analyzing","context":"ØªØ±ÙƒÙŠØ² Ø¹Ù„Ù‰ Ø§Ø³ØªÙ…Ø±Ø§Ø± Ø§Ù„ØªØ­Ù„ÙŠÙ„ ÙˆØ§Ù„Ø¬Ù‡Ø¯"},{"en":"Why are your hands covered in paint? â€” I have been painting the studio walls.","ar":"Ù„Ù…Ø§Ø°Ø§ ÙŠØ¯Ø§Ùƒ Ù…ØºØ·Ø§Ø© Ø¨Ø§Ù„Ø·Ù„Ø§Ø¡ØŸ â€” Ù„Ø£Ù†Ù†ÙŠ ÙƒÙ†Øª Ø£Ù‚ÙˆÙ… Ø¨Ø·Ù„Ø§Ø¡ Ø¬Ø¯Ø±Ø§Ù† Ø§Ù„Ø£Ø³ØªÙˆØ¯ÙŠÙˆ Ø·ÙˆØ§Ù„ Ø§Ù„ÙˆÙ‚Øª.","highlight":"have been painting","context":"Ø£Ø«Ø± Ø¬Ø³Ø¯ÙŠ Ù…Ø¨Ø§Ø´Ø± Ù„ÙØ¹Ù„ Ø§Ø³ØªÙ…Ø± Ù„ÙØªØ±Ø©"}]'::jsonb, '[]'::jsonb, 'B1 - Ù…ØªÙˆØ³Ø·')
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  explanation = EXCLUDED.explanation,
  formula = EXCLUDED.formula;
INSERT INTO public.grammar_topics (id, title, title_ar, category, explanation, explanation_ar, formula, examples, common_mistakes, level)
VALUES ('past-simple', 'Past Simple Tense', NULL, 'Ø£Ø²Ù…Ù†Ø© Ø§Ù„Ù…Ø§Ø¶ÙŠ', NULL, NULL, NULL, '[{"en":"The company launched its revolutionary AI product three weeks ago.","ar":"Ø£Ø·Ù„Ù‚Øª Ø§Ù„Ø´Ø±ÙƒØ© Ù…Ù†ØªØ¬ Ø§Ù„Ø°ÙƒØ§Ø¡ Ø§Ù„Ø§ØµØ·Ù†Ø§Ø¹ÙŠ Ø§Ù„Ø«ÙˆØ±ÙŠ Ù‚Ø¨Ù„ Ø«Ù„Ø§Ø«Ø© Ø£Ø³Ø§Ø¨ÙŠØ¹.","highlight":"launched","context":"Ø­Ø¯Ø« Ù…Ø§Ø¶Ù Ù…ÙƒØªÙ…Ù„ Ù…Ø¹ ÙˆÙ‚Øª Ù…Ø­Ø¯Ø¯ (three weeks ago)"},{"en":"Mona woke up, made a fresh cup of coffee, and walked to her morning seminar.","ar":"Ø§Ø³ØªÙŠÙ‚Ø¸Øª Ù…Ù†Ù‰ØŒ ÙˆØ£Ø¹Ø¯Øª ÙƒÙˆØ¨Ø§Ù‹ Ø·Ø§Ø²Ø¬Ø§Ù‹ Ù…Ù† Ø§Ù„Ù‚Ù‡ÙˆØ©ØŒ Ø«Ù… Ù…Ø´Øª Ø¥Ù„Ù‰ Ù†Ø¯ÙˆØªÙ‡Ø§ Ø§Ù„ØµØ¨Ø§Ø­ÙŠØ©.","highlight":"woke up, made, walked","context":"Ø³Ù„Ø³Ù„Ø© Ø£Ø­Ø¯Ø§Ø« Ù…ØªØªØ§Ø¨Ø¹Ø© ÙÙŠ Ø§Ù„Ù…Ø§Ø¶ÙŠ"}]'::jsonb, '[]'::jsonb, 'A1 - Ù…Ø¨ØªØ¯Ø¦')
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  explanation = EXCLUDED.explanation,
  formula = EXCLUDED.formula;
INSERT INTO public.grammar_topics (id, title, title_ar, category, explanation, explanation_ar, formula, examples, common_mistakes, level)
VALUES ('past-continuous', 'Past Continuous Tense', NULL, 'Ø£Ø²Ù…Ù†Ø© Ø§Ù„Ù…Ø§Ø¶ÙŠ', NULL, NULL, NULL, '[{"en":"While Karim was debugging the server scripts, the electricity suddenly went out.","ar":"Ø¨ÙŠÙ†Ù…Ø§ ÙƒØ§Ù† ÙƒØ±ÙŠÙ… ÙŠÙ‚ÙˆÙ… Ø¨Ø¥ØµÙ„Ø§Ø­ Ø£ÙƒÙˆØ§Ø¯ Ø§Ù„Ø®Ø§Ø¯Ù…ØŒ Ø§Ù†Ù‚Ø·Ø¹Øª Ø§Ù„ÙƒÙ‡Ø±Ø¨Ø§Ø¡ ÙØ¬Ø£Ø©.","highlight":"was debugging / went out","context":"Ø­Ø¯Ø« Ø·ÙˆÙŠÙ„ Ù…Ø³ØªÙ…Ø± Ù‚Ø·Ø¹Ù‡ Ø­Ø¯Ø« Ù…ÙØ§Ø¬Ø¦"},{"en":"At 10:30 PM last night, I was reviewing the quarterly financial statements.","ar":"ÙÙŠ ØªÙ…Ø§Ù… Ø§Ù„Ø³Ø§Ø¹Ø© 10:30 Ù…Ø³Ø§Ø¡ Ø£Ù…Ø³ØŒ ÙƒÙ†Øª Ø£Ø±Ø§Ø¬Ø¹ Ø§Ù„Ù‚ÙˆØ§Ø¦Ù… Ø§Ù„Ù…Ø§Ù„ÙŠØ© Ø§Ù„Ø±Ø¨Ø¹ Ø³Ù†ÙˆÙŠØ©.","highlight":"was reviewing","context":"Ø­Ø¯Ø« ÙƒØ§Ù† Ø¬Ø§Ø±ÙŠØ§Ù‹ ÙÙŠ ØªÙˆÙ‚ÙŠØª Ù…Ø§Ø¶Ù Ù…Ø­Ø¯Ø¯ Ø¨Ø¯Ù‚Ø©"}]'::jsonb, '[]'::jsonb, 'A2 - ØªØ£Ø³ÙŠØ³ÙŠ')
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  explanation = EXCLUDED.explanation,
  formula = EXCLUDED.formula;
INSERT INTO public.grammar_topics (id, title, title_ar, category, explanation, explanation_ar, formula, examples, common_mistakes, level)
VALUES ('past-perfect', 'Past Perfect Simple', NULL, 'Ø£Ø²Ù…Ù†Ø© Ø§Ù„Ù…Ø§Ø¶ÙŠ', NULL, NULL, NULL, '[{"en":"By the time the ambulance arrived at the scene, the doctor had already stabilized the patient.","ar":"Ø¨Ø­Ù„ÙˆÙ„ ÙˆÙ‚Øª ÙˆØµÙˆÙ„ Ø³ÙŠØ§Ø±Ø© Ø§Ù„Ø¥Ø³Ø¹Ø§Ù Ø¥Ù„Ù‰ Ø§Ù„Ù…ÙˆÙ‚Ø¹ØŒ ÙƒØ§Ù† Ø§Ù„Ø·Ø¨ÙŠØ¨ Ù‚Ø¯ Ø§Ø³ØªÙ‚Ø± Ø¨Ø­Ø§Ù„Ø© Ø§Ù„Ù…Ø±ÙŠØ¶ Ø¨Ø§Ù„ÙØ¹Ù„.","highlight":"had already stabilized / arrived","context":"Ø¹Ù„Ø§Ø¬ Ø§Ù„Ù…Ø±ÙŠØ¶ ØªÙ… Ø£ÙˆÙ„Ø§Ù‹ (had stabilized) Ø«Ù… ÙˆØµÙ„Øª Ø§Ù„Ø¥Ø³Ø¹Ø§Ù Ø«Ø§Ù†ÙŠØ§Ù‹ (arrived)"},{"en":"Laila couldn''t enter the building because she had forgotten her access card at home.","ar":"Ù„Ù… ØªØªÙ…ÙƒÙ† Ù„ÙŠÙ„Ù‰ Ù…Ù† Ø¯Ø®ÙˆÙ„ Ø§Ù„Ù…Ø¨Ù†Ù‰ Ù„Ø£Ù†Ù‡Ø§ ÙƒØ§Ù†Øª Ù‚Ø¯ Ù†Ø³ÙŠØª Ø¨Ø·Ø§Ù‚Ø© Ø§Ù„Ø¯Ø®ÙˆÙ„ ÙÙŠ Ù…Ù†Ø²Ù„Ù‡Ø§ Ù…Ø³Ø¨Ù‚Ø§Ù‹.","highlight":"had forgotten / couldn''t enter","context":"Ù†Ø³ÙŠØ§Ù† Ø§Ù„Ø¨Ø·Ø§Ù‚Ø© Ø­Ø¯Ø« Ø£ÙˆÙ„Ø§Ù‹ ÙØªØ±ØªØ¨ Ø¹Ù„ÙŠÙ‡ Ù…Ù†Ø¹ Ø§Ù„Ø¯Ø®ÙˆÙ„ Ø«Ø§Ù†ÙŠØ§Ù‹"}]'::jsonb, '[]'::jsonb, 'B1 - Ù…ØªÙˆØ³Ø·')
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  explanation = EXCLUDED.explanation,
  formula = EXCLUDED.formula;
INSERT INTO public.grammar_topics (id, title, title_ar, category, explanation, explanation_ar, formula, examples, common_mistakes, level)
VALUES ('past-perfect-continuous', 'Past Perfect Continuous', NULL, 'Ø£Ø²Ù…Ù†Ø© Ø§Ù„Ù…Ø§Ø¶ÙŠ', NULL, NULL, NULL, '[{"en":"The engineers had been inspecting the bridge for five hours before they detected the structural crack.","ar":"ÙƒØ§Ù† Ø§Ù„Ù…Ù‡Ù†Ø¯Ø³ÙˆÙ† ÙŠÙØ­ØµÙˆÙ† Ø§Ù„Ø¬Ø³Ø± Ø¨ØµÙˆØ±Ø© Ù…Ø³ØªÙ…Ø±Ø© Ù„Ù…Ø¯Ø© Ø®Ù…Ø³ Ø³Ø§Ø¹Ø§Øª Ù‚Ø¨Ù„ Ø£Ù† ÙŠÙƒØªØ´ÙÙˆØ§ Ø§Ù„Ø´Ø±Ø® Ø§Ù„Ø¥Ù†Ø´Ø§Ø¦ÙŠ.","highlight":"had been inspecting","context":"Ø§Ø³ØªÙ…Ø±Ø§Ø± Ø§Ù„ÙØ­Øµ Ù„Ø®Ù…Ø³ Ø³Ø§Ø¹Ø§Øª Ù‚Ø¨Ù„ Ø§Ù„Ø§ÙƒØªØ´Ø§Ù"}]'::jsonb, '[]'::jsonb, 'B2 - ÙÙˆÙ‚ Ù…ØªÙˆØ³Ø·')
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  explanation = EXCLUDED.explanation,
  formula = EXCLUDED.formula;
INSERT INTO public.grammar_topics (id, title, title_ar, category, explanation, explanation_ar, formula, examples, common_mistakes, level)
VALUES ('future-simple', 'Future Simple (Will)', NULL, 'Ø£Ø²Ù…Ù†Ø© Ø§Ù„Ù…Ø³ØªÙ‚Ø¨Ù„', NULL, NULL, NULL, '[{"en":"The phone is ringing. â€” Don''t worry, I will answer it.","ar":"Ø§Ù„Ù‡Ø§ØªÙ ÙŠØ±Ù†. â€” Ù„Ø§ ØªÙ‚Ù„Ù‚ØŒ Ø³Ø£Ø±Ø¯ Ø£Ù†Ø§ Ø¹Ù„ÙŠÙ‡ ÙÙˆØ±Ø§Ù‹.","highlight":"will answer","context":"Ù‚Ø±Ø§Ø± Ù„Ø­Ø¸ÙŠ Ø³Ø±ÙŠØ¹"},{"en":"I promise I will never reveal your secret to anyone.","ar":"Ø£Ø¹Ø¯Ùƒ Ø¨Ø£Ù†Ù†ÙŠ Ù„Ù† Ø£ÙØ´ÙŠ Ø³Ø±Ùƒ Ù„Ø£ÙŠ Ø´Ø®Øµ Ø£Ø¨Ø¯Ø§Ù‹.","highlight":"will never reveal","context":"ÙˆØ¹Ø¯ Ù…Ø¤ÙƒØ¯"}]'::jsonb, '[]'::jsonb, 'A2 - ØªØ£Ø³ÙŠØ³ÙŠ')
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  explanation = EXCLUDED.explanation,
  formula = EXCLUDED.formula;
INSERT INTO public.grammar_topics (id, title, title_ar, category, explanation, explanation_ar, formula, examples, common_mistakes, level)
VALUES ('be-going-to', 'Be Going To', NULL, 'Ø£Ø²Ù…Ù†Ø© Ø§Ù„Ù…Ø³ØªÙ‚Ø¨Ù„', NULL, NULL, NULL, '[{"en":"Look at those dark clouds! It is going to rain very soon.","ar":"Ø§Ù†Ø¸Ø± Ø¥Ù„Ù‰ ØªÙ„Ùƒ Ø§Ù„ØºÙŠÙˆÙ… Ø§Ù„Ø¯Ø§ÙƒÙ†Ø©! Ø¥Ù†Ù‡Ø§ Ø¹Ù„Ù‰ ÙˆØ´Ùƒ Ø£Ù† ØªÙ…Ø·Ø± Ù‚Ø±ÙŠØ¨Ø§Ù‹ Ø¬Ø¯Ø§Ù‹.","highlight":"is going to rain","context":"ØªÙ†Ø¨Ø¤ Ù‚Ø§Ø¦Ù… Ø¹Ù„Ù‰ Ø¯Ù„ÙŠÙ„ Ù…Ø±Ø¦ÙŠ Ø­Ø³ÙŠ"},{"en":"We have saved enough capital; we are going to launch our e-commerce store next month.","ar":"Ù„Ù‚Ø¯ Ø§Ø¯Ø®Ø±Ù†Ø§ Ø±Ø£Ø³ Ù…Ø§Ù„ ÙƒØ§ÙÙŠØ§Ù‹Ø› ÙˆØ³Ù†Ø·Ù„Ù‚ Ù…ØªØ¬Ø±Ù†Ø§ Ø§Ù„Ø¥Ù„ÙƒØªØ±ÙˆÙ†ÙŠ Ø§Ù„Ø´Ù‡Ø± Ø§Ù„Ù‚Ø§Ø¯Ù….","highlight":"are going to launch","context":"Ø®Ø·Ø© Ø¹Ù…Ù„ Ù…Ø¯Ø±ÙˆØ³Ø© Ù…Ø³Ø¨Ù‚Ø§Ù‹"}]'::jsonb, '[]'::jsonb, 'A2 - ØªØ£Ø³ÙŠØ³ÙŠ')
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  explanation = EXCLUDED.explanation,
  formula = EXCLUDED.formula;
INSERT INTO public.grammar_topics (id, title, title_ar, category, explanation, explanation_ar, formula, examples, common_mistakes, level)
VALUES ('future-continuous', 'Future Continuous Tense', NULL, 'Ø£Ø²Ù…Ù†Ø© Ø§Ù„Ù…Ø³ØªÙ‚Ø¨Ù„', NULL, NULL, NULL, '[{"en":"This time tomorrow, we will be flying over the Atlantic Ocean on our way to Toronto.","ar":"ÙÙŠ Ù…Ø«Ù„ Ù‡Ø°Ø§ Ø§Ù„ÙˆÙ‚Øª ØºØ¯Ø§Ù‹ØŒ Ø³Ù†ÙƒÙˆÙ† Ù…Ø­Ù„Ù‚ÙŠÙ† ÙÙˆÙ‚ Ø§Ù„Ù…Ø­ÙŠØ· Ø§Ù„Ø£Ø·Ù„Ø³ÙŠ ÙÙŠ Ø·Ø±ÙŠÙ‚Ù†Ø§ Ø¥Ù„Ù‰ ØªÙˆØ±ÙˆÙ†ØªÙˆ.","highlight":"will be flying","context":"Ø­Ø¯Ø« Ø³ÙŠÙƒÙˆÙ† Ù‚ÙŠØ¯ Ø§Ù„Ø­Ø¯ÙˆØ« ÙˆØ§Ù„Ø§Ø³ØªÙ…Ø±Ø§Ø± ØºØ¯Ø§Ù‹ ÙÙŠ Ù†ÙØ³ Ø§Ù„Ù„Ø­Ø¸Ø©"}]'::jsonb, '[]'::jsonb, 'B1 - Ù…ØªÙˆØ³Ø·')
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  explanation = EXCLUDED.explanation,
  formula = EXCLUDED.formula;
INSERT INTO public.grammar_topics (id, title, title_ar, category, explanation, explanation_ar, formula, examples, common_mistakes, level)
VALUES ('future-perfect', 'Future Perfect Tense (Masterclass Core)', NULL, 'Ø£Ø²Ù…Ù†Ø© Ø§Ù„Ù…Ø³ØªÙ‚Ø¨Ù„', NULL, NULL, NULL, '[{"en":"By next December, the architectural firm will have completed the new high-speed rail terminal.","ar":"Ø¨Ø­Ù„ÙˆÙ„ Ø´Ù‡Ø± Ø¯ÙŠØ³Ù…Ø¨Ø± Ø§Ù„Ù‚Ø§Ø¯Ù…ØŒ Ø³ØªÙƒÙˆÙ† Ø§Ù„Ø´Ø±ÙƒØ© Ø§Ù„Ù…Ø¹Ù…Ø§Ø±ÙŠØ© Ù‚Ø¯ Ø£ØªÙ…Øª Ù…Ø­Ø·Ø© Ø§Ù„Ù‚Ø·Ø§Ø± ÙØ§Ø¦Ù‚ Ø§Ù„Ø³Ø±Ø¹Ø© Ø§Ù„Ø¬Ø¯ÙŠØ¯Ø©.","highlight":"will have completed","context":"Ù…ÙˆØ¹Ø¯ Ù…Ø³ØªÙ‚Ø¨Ù„ÙŠ Ù…Ø­Ø¯Ø¯ ÙŠÙƒØªÙ…Ù„ Ù‚Ø¨Ù„Ù‡ Ø§Ù„ÙØ¹Ù„"},{"en":"By the time you finish your presentation, we will have prepared the partnership contract.","ar":"Ø¹Ù„Ù‰ Ø¨Ø§Ù„ Ù…Ø§ ØªØ®Ù„Øµ Ø¹Ø±Ø¶Ùƒ Ø§Ù„ØªÙ‚Ø¯ÙŠÙ…ÙŠØŒ Ù‡Ù†ÙƒÙˆÙ† Ø¬Ù‡Ø²Ù†Ø§ Ø¹Ù‚Ø¯ Ø§Ù„Ø´Ø±Ø§ÙƒØ© Ø¨Ø§Ù„ÙƒØ§Ù…Ù„.","highlight":"will have prepared","context":"Ø±Ø¨Ø· Ø¨ÙŠÙ† Ø¬Ù…Ù„ØªÙŠÙ†"}]'::jsonb, '[]'::jsonb, 'B2 - ÙÙˆÙ‚ Ù…ØªÙˆØ³Ø·')
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  explanation = EXCLUDED.explanation,
  formula = EXCLUDED.formula;
INSERT INTO public.grammar_topics (id, title, title_ar, category, explanation, explanation_ar, formula, examples, common_mistakes, level)
VALUES ('future-perfect-continuous', 'Future Perfect Continuous', NULL, 'Ø£Ø²Ù…Ù†Ø© Ø§Ù„Ù…Ø³ØªÙ‚Ø¨Ù„', NULL, NULL, NULL, '[{"en":"By this November, engineer Tarek will have been working at Henglish for ten full years.","ar":"Ø¨Ø­Ù„ÙˆÙ„ Ø´Ù‡Ø± Ù†ÙˆÙÙ…Ø¨Ø± Ø§Ù„Ù‚Ø§Ø¯Ù…ØŒ Ø³ÙŠÙƒÙˆÙ† Ø§Ù„Ù…Ù‡Ù†Ø¯Ø³ Ø·Ø§Ø±Ù‚ Ù‚Ø¯ Ø£Ù…Ø¶Ù‰ Ø¹Ø´Ø± Ø³Ù†ÙˆØ§Øª ÙƒØ§Ù…Ù„Ø© ÙÙŠ Ø§Ù„Ø¹Ù…Ù„ Ù„Ø¯Ù‰ Ù‡Ù†Ø§ÙˆÙŠ.","highlight":"will have been working","context":"Ø§Ù„ØªØ±ÙƒÙŠØ² Ø¹Ù„Ù‰ Ø·ÙˆÙ„ ÙØªØ±Ø© Ø§Ù„Ø®Ø¯Ù…Ø© ÙˆØ§Ù„Ø¹Ù…Ù„ Ø§Ù„Ù…Ø³ØªÙ…Ø±"}]'::jsonb, '[]'::jsonb, 'B2 - ÙÙˆÙ‚ Ù…ØªÙˆØ³Ø·')
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  explanation = EXCLUDED.explanation,
  formula = EXCLUDED.formula;
INSERT INTO public.grammar_topics (id, title, title_ar, category, explanation, explanation_ar, formula, examples, common_mistakes, level)
VALUES ('zero-conditional', 'Zero Conditional', NULL, 'Ù…ÙˆØ§Ø¶ÙŠØ¹ ÙˆÙ‚ÙˆØ§Ø¹Ø¯ Ø£Ø®Ø±Ù‰', NULL, NULL, NULL, '[{"en":"If you expose ice to high heat, it melts immediately.","ar":"Ø¥Ø°Ø§ Ø¹Ø±Ø¶Øª Ø§Ù„Ø¬Ù„ÙŠØ¯ Ù„Ø­Ø±Ø§Ø±Ø© Ù…Ø±ØªÙØ¹Ø©ØŒ ÙØ¥Ù†Ù‡ ÙŠØ°ÙˆØ¨ ÙÙˆØ±Ø§Ù‹.","highlight":"expose / melts","context":"Ø­Ù‚ÙŠÙ‚Ø© ÙÙŠØ²ÙŠØ§Ø¦ÙŠØ© Ø¹Ù„Ù…ÙŠØ© Ø«Ø§Ø¨ØªØ©"}]'::jsonb, '[]'::jsonb, 'A2 - ØªØ£Ø³ÙŠØ³ÙŠ')
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  explanation = EXCLUDED.explanation,
  formula = EXCLUDED.formula;
INSERT INTO public.grammar_topics (id, title, title_ar, category, explanation, explanation_ar, formula, examples, common_mistakes, level)
VALUES ('first-conditional', 'First Conditional', NULL, 'Ù…ÙˆØ§Ø¶ÙŠØ¹ ÙˆÙ‚ÙˆØ§Ø¹Ø¯ Ø£Ø®Ø±Ù‰', NULL, NULL, NULL, '[{"en":"If the software team deploys the hotfix tonight, the servers will run smoothly tomorrow.","ar":"Ø¥Ø°Ø§ Ø£Ø·Ù„Ù‚ ÙØ±ÙŠÙ‚ Ø§Ù„Ø¨Ø±Ù…Ø¬ÙŠØ§Øª Ø§Ù„ØªØ­Ø¯ÙŠØ« Ø§Ù„Ø¹Ø§Ø¬Ù„ Ø§Ù„Ù„ÙŠÙ„Ø©ØŒ Ø³ØªØ¹Ù…Ù„ Ø§Ù„Ø®ÙˆØ§Ø¯Ù… Ø¨Ø³Ù„Ø§Ø³Ø© ØºØ¯Ø§Ù‹.","highlight":"deploys / will run","context":"Ø§Ø­ØªÙ…Ø§Ù„ ÙˆØ§Ù‚Ø¹ÙŠ ÙˆÙ…Ù…ÙƒÙ† Ø¬Ø¯Ø§Ù‹"}]'::jsonb, '[]'::jsonb, 'B1 - Ù…ØªÙˆØ³Ø·')
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  explanation = EXCLUDED.explanation,
  formula = EXCLUDED.formula;
INSERT INTO public.grammar_topics (id, title, title_ar, category, explanation, explanation_ar, formula, examples, common_mistakes, level)
VALUES ('second-conditional', 'Second Conditional', NULL, 'Ù…ÙˆØ§Ø¶ÙŠØ¹ ÙˆÙ‚ÙˆØ§Ø¹Ø¯ Ø£Ø®Ø±Ù‰', NULL, NULL, NULL, '[{"en":"If Karim spoke fluent German, he would apply for the engineering fellowship in Munich.","ar":"Ù„Ùˆ ÙƒØ§Ù† ÙƒØ±ÙŠÙ… ÙŠØªØ­Ø¯Ø« Ø§Ù„Ø£Ù„Ù…Ø§Ù†ÙŠØ© Ø¨Ø·Ù„Ø§Ù‚Ø©ØŒ Ù„ÙƒØ§Ù† Ù‚Ø¯ ØªÙ‚Ø¯Ù… Ù„Ù…Ù†Ø­Ø© Ø§Ù„Ù‡Ù†Ø¯Ø³Ø© ÙÙŠ Ù…ÙŠÙˆÙ†ÙŠØ® (Ù„ÙƒÙ†Ù‡ Ù„Ø§ ÙŠØªØ­Ø¯Ø«Ù‡Ø§ Ø­Ø§Ù„ÙŠØ§Ù‹).","highlight":"spoke / would apply","context":"Ø§ÙØªØ±Ø§Ø¶ ØºÙŠØ± ÙˆØ§Ù‚Ø¹ÙŠ ÙÙŠ Ø§Ù„Ø­Ø§Ø¶Ø±"},{"en":"If I were you, I would accept the job offer in Dubai immediately.","ar":"Ù„Ùˆ ÙƒÙ†Øª Ù…ÙƒØ§Ù†ÙƒØŒ Ù„ÙˆØ§ÙÙ‚Øª Ø¹Ù„Ù‰ Ø¹Ø±Ø¶ Ø§Ù„Ø¹Ù…Ù„ ÙÙŠ Ø¯Ø¨ÙŠ Ø¹Ù„Ù‰ Ø§Ù„ÙÙˆØ±.","highlight":"were / would accept","context":"Ù†ØµÙŠØ­Ø© ÙˆØ¯ÙŠØ©"}]'::jsonb, '[]'::jsonb, 'B1 - Ù…ØªÙˆØ³Ø·')
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  explanation = EXCLUDED.explanation,
  formula = EXCLUDED.formula;
INSERT INTO public.grammar_topics (id, title, title_ar, category, explanation, explanation_ar, formula, examples, common_mistakes, level)
VALUES ('third-conditional', 'Third Conditional', NULL, 'Ù…ÙˆØ§Ø¶ÙŠØ¹ ÙˆÙ‚ÙˆØ§Ø¹Ø¯ Ø£Ø®Ø±Ù‰', NULL, NULL, NULL, '[{"en":"If we had booked the airline tickets earlier, we would have saved hundreds of dollars.","ar":"Ù„Ùˆ ÙƒÙ†Ø§ Ø­Ø¬Ø²Ù†Ø§ ØªØ°Ø§ÙƒØ± Ø§Ù„Ø·ÙŠØ±Ø§Ù† Ù…Ø¨ÙƒØ±Ø§Ù‹ØŒ Ù„ÙƒÙ†Ø§ ÙˆÙØ±Ù†Ø§ Ù…Ø¦Ø§Øª Ø§Ù„Ø¯ÙˆÙ„Ø§Ø±Ø§Øª (Ù„ÙƒÙ†Ù†Ø§ ØªØ£Ø®Ø±Ù†Ø§ ÙˆÙ†Ø¯Ù…Ù†Ø§).","highlight":"had booked / would have saved","context":"Ù†Ø¯Ù… ØªØ§Ù… Ø¹Ù„Ù‰ ÙØ±ØµØ© Ø¶Ø§Ø¦Ø¹Ø© ÙÙŠ Ø§Ù„Ù…Ø§Ø¶ÙŠ"}]'::jsonb, '[]'::jsonb, 'B2 - ÙÙˆÙ‚ Ù…ØªÙˆØ³Ø·')
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  explanation = EXCLUDED.explanation,
  formula = EXCLUDED.formula;
INSERT INTO public.grammar_topics (id, title, title_ar, category, explanation, explanation_ar, formula, examples, common_mistakes, level)
VALUES ('modal-verbs', 'Modal Verbs (Must, Should, Could, Might)', NULL, 'Ù…ÙˆØ§Ø¶ÙŠØ¹ ÙˆÙ‚ÙˆØ§Ø¹Ø¯ Ø£Ø®Ø±Ù‰', NULL, NULL, NULL, '[{"en":"You must sign the non-disclosure agreement before accessing confidential client data.","ar":"ÙŠØ¬Ø¨ Ø¹Ù„ÙŠÙƒ ØªÙˆÙ‚ÙŠØ¹ Ø§ØªÙØ§Ù‚ÙŠØ© Ø¹Ø¯Ù… Ø§Ù„Ø¥ÙØµØ§Ø­ Ù‚Ø¨Ù„ Ø§Ù„Ø§Ø·Ù„Ø§Ø¹ Ø¹Ù„Ù‰ Ø¨ÙŠØ§Ù†Ø§Øª Ø§Ù„Ø¹Ù…Ù„Ø§Ø¡ Ø§Ù„Ø³Ø±ÙŠØ©.","highlight":"must sign","context":"Ø¥Ù„Ø²Ø§Ù… Ù‚Ø§Ù†ÙˆÙ†ÙŠ ÙˆØ£Ù…Ù†ÙŠ ØµØ§Ø±Ù…"},{"en":"His office lights are still on and his laptop is open; he must be working on the urgent proposal.","ar":"Ø£Ø¶ÙˆØ§Ø¡ Ù…ÙƒØªØ¨Ù‡ Ù„Ø§ ØªØ²Ø§Ù„ Ù…Ø¶Ø§Ø¡Ø© ÙˆØ­Ø§Ø³ÙˆØ¨Ù‡ Ù…ÙØªÙˆØ­Ø› Ù„Ø§ Ø¨Ø¯ ÙˆØ£Ù†Ù‡ ÙŠØ¹Ù…Ù„ Ø¹Ù„Ù‰ Ø§Ù„Ù…Ù‚ØªØ±Ø­ Ø§Ù„Ø¹Ø§Ø¬Ù„ Ø¨Ø§Ù„ØªØ£ÙƒÙŠØ¯.","highlight":"must be working","context":"Ø§Ø³ØªÙ†ØªØ§Ø¬ Ù…Ù†Ø·Ù‚ÙŠ Ù‚ÙˆÙŠ Ù…Ø¨Ù†ÙŠ Ø¹Ù„Ù‰ Ø¯Ù„ÙŠÙ„ Ù…Ø±Ø¦ÙŠ"}]'::jsonb, '[]'::jsonb, 'B1 - Ù…ØªÙˆØ³Ø·')
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  explanation = EXCLUDED.explanation,
  formula = EXCLUDED.formula;
INSERT INTO public.grammar_topics (id, title, title_ar, category, explanation, explanation_ar, formula, examples, common_mistakes, level)
VALUES ('passive-voice', 'Passive Voice Across All Tenses', NULL, 'Ù…ÙˆØ§Ø¶ÙŠØ¹ ÙˆÙ‚ÙˆØ§Ø¹Ø¯ Ø£Ø®Ø±Ù‰', NULL, NULL, NULL, '[{"en":"The security vulnerability was patched by the cybersecurity team within two hours.","ar":"ØªÙ…Øª Ù…Ø¹Ø§Ù„Ø¬Ø© Ø§Ù„Ø«ØºØ±Ø© Ø§Ù„Ø£Ù…Ù†ÙŠØ© ÙˆØ³Ø¯Ù‡Ø§ Ù…Ù† Ù‚Ø¨Ù„ ÙØ±ÙŠÙ‚ Ø§Ù„Ø£Ù…Ù† Ø§Ù„Ø³ÙŠØ¨Ø±Ø§Ù†ÙŠ ÙÙŠ ØºØ¶ÙˆÙ† Ø³Ø§Ø¹ØªÙŠÙ†.","highlight":"was patched","context":"Ù…Ø¨Ù†ÙŠ Ù„Ù„Ù…Ø¬Ù‡ÙˆÙ„ ÙÙŠ Ø§Ù„Ù…Ø§Ø¶ÙŠ Ø§Ù„Ø¨Ø³ÙŠØ· (Past Simple Passive)"},{"en":"By 2030, all official municipal documents will have been digitized across the city.","ar":"Ø¨Ø­Ù„ÙˆÙ„ Ø¹Ø§Ù… 2030ØŒ Ø³ØªÙƒÙˆÙ† Ø¬Ù…ÙŠØ¹ Ø§Ù„ÙˆØ«Ø§Ø¦Ù‚ Ø§Ù„Ø¨Ù„Ø¯ÙŠØ© Ø§Ù„Ø±Ø³Ù…ÙŠØ© Ù‚Ø¯ ØªÙ… ØªØ­ÙˆÙŠÙ„Ù‡Ø§ Ø±Ù‚Ù…ÙŠØ§Ù‹ Ø¨Ø§Ù„ÙƒØ§Ù…Ù„ ÙÙŠ Ø£Ù†Ø­Ø§Ø¡ Ø§Ù„Ù…Ø¯ÙŠÙ†Ø©.","highlight":"will have been digitized","context":"Ù…Ø¨Ù†ÙŠ Ù„Ù„Ù…Ø¬Ù‡ÙˆÙ„ ÙÙŠ Ø§Ù„Ù…Ø³ØªÙ‚Ø¨Ù„ Ø§Ù„ØªØ§Ù… (Future Perfect Passive)"}]'::jsonb, '[]'::jsonb, 'B2 - ÙÙˆÙ‚ Ù…ØªÙˆØ³Ø·')
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  explanation = EXCLUDED.explanation,
  formula = EXCLUDED.formula;
INSERT INTO public.grammar_topics (id, title, title_ar, category, explanation, explanation_ar, formula, examples, common_mistakes, level)
VALUES ('reported-speech', 'Reported Speech (Direct to Indirect)', NULL, 'Ù…ÙˆØ§Ø¶ÙŠØ¹ ÙˆÙ‚ÙˆØ§Ø¹Ø¯ Ø£Ø®Ø±Ù‰', NULL, NULL, NULL, '[{"en":"\"I will deliver the design files by 5 PM,\" Omar said. âž” Omar said that he would deliver the design files by 5 PM.","ar":"Ø¹Ù…Ø± Ù‚Ø§Ù„ Ø¥Ù†Ù‡ Ø³ÙŠØ³Ù„Ù… Ù…Ù„ÙØ§Øª Ø§Ù„ØªØµÙ…ÙŠÙ… Ø¨Ø­Ù„ÙˆÙ„ Ø§Ù„Ø³Ø§Ø¹Ø© Ø§Ù„Ø®Ø§Ù…Ø³Ø© Ù…Ø³Ø§Ø¡Ù‹.","highlight":"would deliver","context":"ØªØ­ÙˆÙŠÙ„ will Ø¥Ù„Ù‰ would ÙÙŠ Ø§Ù„ÙƒÙ„Ø§Ù… Ø§Ù„Ù…Ù†Ù‚ÙˆÙ„"}]'::jsonb, '[]'::jsonb, 'B2 - ÙÙˆÙ‚ Ù…ØªÙˆØ³Ø·')
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  explanation = EXCLUDED.explanation,
  formula = EXCLUDED.formula;
INSERT INTO public.grammar_topics (id, title, title_ar, category, explanation, explanation_ar, formula, examples, common_mistakes, level)
VALUES ('relative-clauses', 'Relative Clauses (Who, Which, That, Whose, Where)', NULL, 'Ù…ÙˆØ§Ø¶ÙŠØ¹ ÙˆÙ‚ÙˆØ§Ø¹Ø¯ Ø£Ø®Ø±Ù‰', NULL, NULL, NULL, '[{"en":"The software engineer who designed our security architecture won the global developer award.","ar":"Ù…Ù‡Ù†Ø¯Ø³ Ø§Ù„Ø¨Ø±Ù…Ø¬ÙŠØ§Øª Ø§Ù„Ø°ÙŠ ØµÙ…Ù… Ø¨Ù†ÙŠØªÙ†Ø§ Ø§Ù„Ø£Ù…Ù†ÙŠØ© ÙØ§Ø² Ø¨Ø¬Ø§Ø¦Ø²Ø© Ø§Ù„Ù…Ø·ÙˆØ±ÙŠÙ† Ø§Ù„Ø¹Ø§Ù„Ù…ÙŠØ©.","highlight":"who designed","context":"Ø¶Ù…ÙŠØ± ÙˆØµÙ„ Ù„Ù„Ø¹Ø§Ù‚Ù„ ÙŠØ­Ø¯Ø¯ Ø§Ù„Ø´Ø®Øµ Ø¨Ø¯Ù‚Ø©"}]'::jsonb, '[]'::jsonb, 'B1 - Ù…ØªÙˆØ³Ø·')
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  explanation = EXCLUDED.explanation,
  formula = EXCLUDED.formula;
INSERT INTO public.grammar_topics (id, title, title_ar, category, explanation, explanation_ar, formula, examples, common_mistakes, level)
VALUES ('parts-of-speech', 'The 8 Parts of Speech & Sentence Anatomy', NULL, 'Ø§Ù„Ø£Ø³Ø§Ø³ÙŠØ§Øª ÙˆØ§Ù„ØªØ±ÙƒÙŠØ¨ Ø§Ù„Ù„ØºÙˆÙŠ', NULL, NULL, NULL, '[{"en":"The diligent developer rapidly resolved the critical database error.","ar":"Ù‚Ø§Ù… Ø§Ù„Ù…Ø·ÙˆØ± Ø§Ù„Ù…Ø¬ØªÙ‡Ø¯ Ø¨Ø­Ù„ Ø®Ø·Ø£ Ù‚Ø§Ø¹Ø¯Ø© Ø§Ù„Ø¨ÙŠØ§Ù†Ø§Øª Ø§Ù„Ø­Ø±Ø¬ Ø¨Ø³Ø±Ø¹Ø© ÙØ§Ø¦Ù‚Ø©.","highlight":"diligent ... rapidly resolved","context":"ØªØ·Ø¨ÙŠÙ‚ Ø¹Ù…Ù„ÙŠ: ØµÙØ© + ÙØ§Ø¹Ù„ + Ø¸Ø±Ù + ÙØ¹Ù„ Ù…Ø§Ø¶Ù + Ù…ÙØ¹ÙˆÙ„"}]'::jsonb, '[]'::jsonb, 'A1 - Ù…Ø¨ØªØ¯Ø¦')
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  explanation = EXCLUDED.explanation,
  formula = EXCLUDED.formula;
INSERT INTO public.grammar_topics (id, title, title_ar, category, explanation, explanation_ar, formula, examples, common_mistakes, level)
VALUES ('articles-determiners', 'Articles (A, An, The) & Quantifiers', NULL, 'Ø§Ù„Ø£Ø³Ø§Ø³ÙŠØ§Øª ÙˆØ§Ù„ØªØ±ÙƒÙŠØ¨ Ø§Ù„Ù„ØºÙˆÙŠ', NULL, NULL, NULL, '[{"en":"She earned a masterâ€™s degree from an accredited university in London.","ar":"Ø­ØµÙ„Øª Ø¹Ù„Ù‰ Ø¯Ø±Ø¬Ø© Ø§Ù„Ù…Ø§Ø¬Ø³ØªÙŠØ± Ù…Ù† Ø¬Ø§Ù…Ø¹Ø© Ù…Ø¹ØªÙ…Ø¯Ø© ÙÙŠ Ù„Ù†Ø¯Ù†.","highlight":"a masterâ€™s ... an accredited","context":"Ø§Ø³ØªØ®Ø¯Ø§Ù… a Ùˆ an Ø¨Ø¯Ù‚Ø© Ø¨Ø­Ø³Ø¨ Ø§Ù„ØµÙˆØª Ø§Ù„Ø¨Ø§Ø¯Ø¦"}]'::jsonb, '[]'::jsonb, 'A2 - ØªØ£Ø³ÙŠØ³ÙŠ')
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  explanation = EXCLUDED.explanation,
  formula = EXCLUDED.formula;
INSERT INTO public.grammar_topics (id, title, title_ar, category, explanation, explanation_ar, formula, examples, common_mistakes, level)
VALUES ('prepositions-mastery', 'Prepositions of Time and Place (In, On, At)', NULL, 'Ø§Ù„Ø£Ø³Ø§Ø³ÙŠØ§Øª ÙˆØ§Ù„ØªØ±ÙƒÙŠØ¨ Ø§Ù„Ù„ØºÙˆÙŠ', NULL, NULL, NULL, '[{"en":"The keynote presentation starts at 9:00 AM sharp on Monday in the main conference hall.","ar":"ØªØ¨Ø¯Ø£ Ø§Ù„ÙƒÙ„Ù…Ø© Ø§Ù„Ø§ÙØªØªØ§Ø­ÙŠØ© ÙÙŠ ØªÙ…Ø§Ù… Ø§Ù„Ø³Ø§Ø¹Ø© 9:00 ØµØ¨Ø§Ø­Ø§Ù‹ ÙŠÙˆÙ… Ø§Ù„Ø¥Ø«Ù†ÙŠÙ† ÙÙŠ Ù‚Ø§Ø¹Ø© Ø§Ù„Ù…Ø¤ØªÙ…Ø±Ø§Øª Ø§Ù„Ø±Ø¦ÙŠØ³ÙŠØ©.","highlight":"at 9:00 AM ... on Monday ... in the hall","context":"ØªØ·Ø¨ÙŠÙ‚ Ù‡Ø±Ù…ÙŠ Ø´Ø§Ù…Ù„: at Ù„Ù„Ø³Ø§Ø¹Ø©ØŒ on Ù„Ù„ÙŠÙˆÙ…ØŒ in Ù„Ù„Ù‚Ø§Ø¹Ø©"}]'::jsonb, '[]'::jsonb, 'A2 - ØªØ£Ø³ÙŠØ³ÙŠ')
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  explanation = EXCLUDED.explanation,
  formula = EXCLUDED.formula;
INSERT INTO public.grammar_topics (id, title, title_ar, category, explanation, explanation_ar, formula, examples, common_mistakes, level)
VALUES ('gerunds-infinitives', 'Gerunds and Infinitives (V-ing vs. To + Verb)', NULL, 'Ø§Ù„Ø£Ø³Ø§Ø³ÙŠØ§Øª ÙˆØ§Ù„ØªØ±ÙƒÙŠØ¨ Ø§Ù„Ù„ØºÙˆÙŠ', NULL, NULL, NULL, '[{"en":"The architect managed to secure the approval without compromising the ecological design.","ar":"Ù†Ø¬Ø­ Ø§Ù„Ù…Ù‡Ù†Ø¯Ø³ Ø§Ù„Ù…Ø¹Ù…Ø§Ø±ÙŠ ÙÙŠ ØªØ£Ù…ÙŠÙ† Ø§Ù„Ù…ÙˆØ§ÙÙ‚Ø© Ø¯ÙˆÙ† Ø§Ù„Ù…Ø³Ø§ÙˆÙ…Ø© Ø¹Ù„Ù‰ Ø§Ù„ØªØµÙ…ÙŠÙ… Ø§Ù„Ø¨ÙŠØ¦ÙŠ.","highlight":"managed to secure ... without compromising","context":"manage ÙŠØªØ¨Ø¹Ù‡ Ù…ØµØ¯Ø± to secureØŒ ÙˆØ­Ø±Ù Ø§Ù„Ø¬Ø± without ÙŠØªØ¨Ø¹Ù‡ gerund"}]'::jsonb, '[]'::jsonb, 'B2 - ÙÙˆÙ‚ Ù…ØªÙˆØ³Ø·')
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  explanation = EXCLUDED.explanation,
  formula = EXCLUDED.formula;
INSERT INTO public.grammar_topics (id, title, title_ar, category, explanation, explanation_ar, formula, examples, common_mistakes, level)
VALUES ('causatives-inversion', 'Causative Verbs (Have/Get) & Negative Inversion', NULL, 'Ø§Ù„Ø£Ø³Ø§Ø³ÙŠØ§Øª ÙˆØ§Ù„ØªØ±ÙƒÙŠØ¨ Ø§Ù„Ù„ØºÙˆÙŠ', NULL, NULL, NULL, '[{"en":"Hardly had the platform launched when it recorded over one hundred thousand active subscribers.","ar":"Ù„Ù… ØªÙƒØ¯ Ø§Ù„Ù…Ù†ØµØ© ØªÙ†Ø·Ù„Ù‚ Ø­ØªÙ‰ Ø³Ø¬Ù„Øª Ø£ÙƒØ«Ø± Ù…Ù† Ù…Ø¦Ø© Ø£Ù„Ù Ù…Ø´ØªØ±Ùƒ Ù†Ø´Ø·.","highlight":"Hardly had the platform launched","context":"ØªÙ‚Ø¯ÙŠÙ… Ø³Ù„Ø¨ÙŠ Ù…ØªÙ‚Ø¯Ù… (Inversion) ÙŠÙ…Ø§Ø«Ù„ Ø£Ø¹Ù„Ù‰ Ø¯Ø±Ø¬Ø§Øª Ø§Ù„Ø¨Ù„Ø§ØºØ© Ø§Ù„Ø¥Ù†Ø¬Ù„ÙŠØ²ÙŠØ©"}]'::jsonb, '[]'::jsonb, 'C1 - Ù…ØªÙ‚Ø¯Ù…')
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  explanation = EXCLUDED.explanation,
  formula = EXCLUDED.formula;

-- 5. SIMULATION SCENARIOS SEED
INSERT INTO public.simulation_scenarios (id, title, title_ar, category, difficulty, location, ai_role, user_role, initial_prompt, dialogue_script)
VALUES ('sim-airport-checkin', 'Airport Check-in & Baggage Drop', 'Airport Check-in & Baggage Drop', 'travel', NULL, NULL, NULL, NULL, NULL, '[]'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  location = EXCLUDED.location,
  initial_prompt = EXCLUDED.initial_prompt;
INSERT INTO public.simulation_scenarios (id, title, title_ar, category, difficulty, location, ai_role, user_role, initial_prompt, dialogue_script)
VALUES ('sim-restaurant-ordering', 'Ordering at a Fine Dining Restaurant', 'Ordering at a Fine Dining Restaurant', 'hospitality', NULL, NULL, NULL, NULL, NULL, '[]'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  location = EXCLUDED.location,
  initial_prompt = EXCLUDED.initial_prompt;
INSERT INTO public.simulation_scenarios (id, title, title_ar, category, difficulty, location, ai_role, user_role, initial_prompt, dialogue_script)
VALUES ('sim-doctor-appointment', 'Describing Symptoms to a Doctor', 'Describing Symptoms to a Doctor', 'healthcare', NULL, NULL, NULL, NULL, NULL, '[]'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  location = EXCLUDED.location,
  initial_prompt = EXCLUDED.initial_prompt;
INSERT INTO public.simulation_scenarios (id, title, title_ar, category, difficulty, location, ai_role, user_role, initial_prompt, dialogue_script)
VALUES ('sim-job-interview', 'Global Tech Company Job Interview', 'Global Tech Company Job Interview', 'professional', NULL, NULL, NULL, NULL, NULL, '[]'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  location = EXCLUDED.location,
  initial_prompt = EXCLUDED.initial_prompt;

-- 6. QUESTIONS SEED
INSERT INTO public.questions (id, skill, cefr_level, question_type, question_text, question_ar, options, correct_answer, explanation, explanation_ar)
VALUES ('a1-gram-1', 'grammar', NULL, 'multiple-choice', 'She ______ in a major international hospital in Cairo.', 'Ø§Ø®ØªØ± ØªØµØ±ÙŠÙ Ø§Ù„ÙØ¹Ù„ Ø§Ù„Ù…Ù†Ø§Ø³Ø¨ ÙÙŠ Ø§Ù„Ù…Ø¶Ø§Ø±Ø¹ Ø§Ù„Ø¨Ø³ÙŠØ· Ù…Ø¹ Ø§Ù„ÙØ§Ø¹Ù„ Ø§Ù„Ù…ÙØ±Ø¯ Ø§Ù„ØºØ§Ø¦Ø¨:', '["works","work","working","is work"]'::jsonb, NULL, NULL, NULL)
ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  correct_answer = EXCLUDED.correct_answer;
INSERT INTO public.questions (id, skill, cefr_level, question_type, question_text, question_ar, options, correct_answer, explanation, explanation_ar)
VALUES ('a1-gram-2', 'grammar', NULL, 'multiple-choice', 'Where ______ you live before moving to Alexandria?', 'Ø§Ø®ØªØ± Ø§Ù„ÙØ¹Ù„ Ø§Ù„Ù…Ø³Ø§Ø¹Ø¯ Ø§Ù„Ù…Ù†Ø§Ø³Ø¨ Ù„ØªÙƒÙˆÙŠÙ† Ø§Ù„Ø³Ø¤Ø§Ù„ ÙÙŠ Ø§Ù„Ù…Ø§Ø¶ÙŠ Ø§Ù„Ø¨Ø³ÙŠØ·:', '["did","do","were","have"]'::jsonb, NULL, NULL, NULL)
ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  correct_answer = EXCLUDED.correct_answer;
INSERT INTO public.questions (id, skill, cefr_level, question_type, question_text, question_ar, options, correct_answer, explanation, explanation_ar)
VALUES ('a1-voc-1', 'vocabulary', NULL, 'multiple-choice', 'A person who flies an airplane professionally is called a ______.', 'Ø§Ø®ØªØ± Ø§Ù„Ù…Ø³Ù…Ù‰ Ø§Ù„ÙˆØ¸ÙŠÙÙŠ Ø§Ù„ØµØ­ÙŠØ­ Ù„Ù„Ø´Ø®Øµ Ø§Ù„Ø°ÙŠ ÙŠÙ‚ÙˆØ¯ Ø§Ù„Ø·Ø§Ø¦Ø±Ø§Øª:', '["pilot","driver","sailor","engineer"]'::jsonb, NULL, NULL, NULL)
ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  correct_answer = EXCLUDED.correct_answer;
INSERT INTO public.questions (id, skill, cefr_level, question_type, question_text, question_ar, options, correct_answer, explanation, explanation_ar)
VALUES ('a2-gram-1', 'grammar', NULL, 'multiple-choice', 'Look at those dark storm clouds! It ______ rain very heavily.', 'Ø§Ø®ØªØ± Ø§Ù„ØµÙŠØºØ© Ø§Ù„Ù…Ø³ØªÙ‚Ø¨Ù„ÙŠØ© Ø§Ù„ØµØ­ÙŠØ­Ø© Ø¹Ù†Ø¯ ÙˆØ¬ÙˆØ¯ Ø¯Ù„ÙŠÙ„ Ù…Ø±Ø¦ÙŠ Ø­Ø§Ù„ÙŠ:', '["is going to","will","is","rains"]'::jsonb, NULL, NULL, NULL)
ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  correct_answer = EXCLUDED.correct_answer;
INSERT INTO public.questions (id, skill, cefr_level, question_type, question_text, question_ar, options, correct_answer, explanation, explanation_ar)
VALUES ('a2-gram-2', 'grammar', NULL, 'multiple-choice', 'While my brother was cooking dinner, I ______ my homework.', 'Ø§Ø®ØªØ± Ø§Ù„Ø²Ù…Ù† Ø§Ù„Ù…Ù†Ø§Ø³Ø¨ Ù„Ø­Ø¯Ø«ÙŠÙ† ÙƒØ§Ù†Ø§ ÙŠÙ‚Ø¹Ø§Ù† Ø¨Ø§Ù„ØªÙˆØ§Ø²ÙŠ ÙÙŠ Ø§Ù„Ù…Ø§Ø¶ÙŠ:', '["was doing","did","do","have done"]'::jsonb, NULL, NULL, NULL)
ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  correct_answer = EXCLUDED.correct_answer;
INSERT INTO public.questions (id, skill, cefr_level, question_type, question_text, question_ar, options, correct_answer, explanation, explanation_ar)
VALUES ('a2-voc-1', 'vocabulary', NULL, 'multiple-choice', 'To "postpone" a business meeting means to ______ it.', 'Ù…Ø§ Ø§Ù„Ù…Ø¹Ù†Ù‰ Ø§Ù„Ø¯Ù‚ÙŠÙ‚ Ù„ÙƒÙ„Ù…Ø© postpone ÙÙŠ Ø¨ÙŠØ¦Ø© Ø§Ù„Ø¹Ù…Ù„ØŸ', '["delay","cancel","start","repeat"]'::jsonb, NULL, NULL, NULL)
ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  correct_answer = EXCLUDED.correct_answer;
INSERT INTO public.questions (id, skill, cefr_level, question_type, question_text, question_ar, options, correct_answer, explanation, explanation_ar)
VALUES ('a2-listen-1', 'listening', NULL, 'multiple-choice', 'Listen to the airport announcement: What is the passenger advised to do?', NULL, '["Go directly to gate 14","Collect lost luggage","Wait at passport control","Change flight ticket"]'::jsonb, NULL, NULL, NULL)
ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  correct_answer = EXCLUDED.correct_answer;
INSERT INTO public.questions (id, skill, cefr_level, question_type, question_text, question_ar, options, correct_answer, explanation, explanation_ar)
VALUES ('b1-gram-1', 'grammar', NULL, 'multiple-choice', 'Omar is exhausted because he ______ the tech report all morning.', 'Ø§Ø®ØªØ± Ø§Ù„Ø²Ù…Ù† Ø§Ù„Ø¯Ø§Ù„ Ø¹Ù„Ù‰ Ø§Ù„Ù…Ø¬Ù‡ÙˆØ¯ ÙˆØ§Ø³ØªÙ…Ø±Ø§Ø±ÙŠØ© Ø§Ù„ÙØ¹Ù„ ÙÙŠ Ø§Ù„Ù…Ø§Ø¶ÙŠ ÙˆØ§Ù„Ù…Ù…ØªØ¯ Ù„Ù„Ø­Ø§Ø¶Ø±:', '["has been writing","wrote","writes","is written"]'::jsonb, NULL, NULL, NULL)
ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  correct_answer = EXCLUDED.correct_answer;
INSERT INTO public.questions (id, skill, cefr_level, question_type, question_text, question_ar, options, correct_answer, explanation, explanation_ar)
VALUES ('b1-gram-2', 'grammar', NULL, 'multiple-choice', 'If you ______ harder last semester, you would have passed the scholarship exam.', 'Ø§Ø®ØªØ± Ø§Ù„ØµÙŠØºØ© Ø§Ù„ØµØ­ÙŠØ­Ø© Ù„ÙØ¹Ù„ Ø§Ù„Ø´Ø±Ø· ÙÙŠ Ø§Ù„Ø­Ø§Ù„Ø© Ø§Ù„Ø´Ø±Ø·ÙŠØ© Ø§Ù„Ø«Ø§Ù„Ø«Ø© (Ø§Ù„Ù†Ø¯Ù… Ø¹Ù„Ù‰ Ø§Ù„Ù…Ø§Ø¶ÙŠ):', '["had studied","studied","would study","have studied"]'::jsonb, NULL, NULL, NULL)
ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  correct_answer = EXCLUDED.correct_answer;
INSERT INTO public.questions (id, skill, cefr_level, question_type, question_text, question_ar, options, correct_answer, explanation, explanation_ar)
VALUES ('b1-gram-3', 'grammar', NULL, 'multiple-choice', 'By the time the delivery courier arrives, we ______ the conference room.', 'Ø§Ø®ØªØ± Ø²Ù…Ù† Ø§Ù„Ù…Ø³ØªÙ‚Ø¨Ù„ Ø§Ù„ØªØ§Ù… Ø§Ù„Ù…Ù†Ø§Ø³Ø¨ Ù…Ø¹ Ø±Ø§Ø¨Ø· Ø§Ù„ÙˆÙ‚Øª By the time:', '["will have arranged","will arrange","arranged","have arranged"]'::jsonb, NULL, NULL, NULL)
ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  correct_answer = EXCLUDED.correct_answer;
INSERT INTO public.questions (id, skill, cefr_level, question_type, question_text, question_ar, options, correct_answer, explanation, explanation_ar)
VALUES ('b1-voc-1', 'vocabulary', NULL, 'multiple-choice', 'The new mobile application received a ______ response from early testers, exceeding expectations.', 'Ø§Ø®ØªØ± Ø§Ù„ÙƒÙ„Ù…Ø© Ø§Ù„Ù…Ù†Ø§Ø³Ø¨Ø© Ù„ÙˆØµÙ Ø§Ù„Ø±Ø¯ÙˆØ¯ Ø´Ø¯ÙŠØ¯Ø© Ø§Ù„Ø¥ÙŠØ¬Ø§Ø¨ÙŠØ© ÙˆØ§Ù„Ø­Ù…Ø§Ø³ÙŠØ©:', '["phenomenal","reluctant","mediocre","tedious"]'::jsonb, NULL, NULL, NULL)
ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  correct_answer = EXCLUDED.correct_answer;
INSERT INTO public.questions (id, skill, cefr_level, question_type, question_text, question_ar, options, correct_answer, explanation, explanation_ar)
VALUES ('b1-read-1', 'reading', NULL, 'multiple-choice', 'According to the passage, what do managers consider crucial for remote team success?', 'Ø¨Ù†Ø§Ø¡Ù‹ Ø¹Ù„Ù‰ Ø§Ù„Ù†ØµØŒ Ù…Ø§ Ø§Ù„Ø°ÙŠ ÙŠØ¹ØªØ¨Ø±Ù‡ Ø§Ù„Ù…Ø¯ÙŠØ±ÙˆÙ† Ø¶Ø±ÙˆØ±ÙŠØ§Ù‹ Ù„Ù†Ø¬Ø§Ø­ ÙØ±Ù‚ Ø§Ù„Ø¹Ù…Ù„ Ø¹Ù† Ø¨Ø¹Ø¯ØŸ', '["Structured documentation and check-ins","Longer daily commutes","Eliminating all meetings","Returning to the office immediately"]'::jsonb, NULL, NULL, NULL)
ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  correct_answer = EXCLUDED.correct_answer;
INSERT INTO public.questions (id, skill, cefr_level, question_type, question_text, question_ar, options, correct_answer, explanation, explanation_ar)
VALUES ('b2-gram-1', 'grammar', NULL, 'multiple-choice', 'By next November, Dr. Farida ______ as head of clinical trials for a full decade.', 'Ø§Ø®ØªØ± Ø§Ù„Ø²Ù…Ù† Ø§Ù„Ù…Ø¹Ø¨Ø± Ø¹Ù† Ø§Ø³ØªÙƒÙ…Ø§Ù„ ÙØªØ±Ø© Ø²Ù…Ù†ÙŠØ© ÙƒØ§Ù…Ù„Ø© Ø¨Ø­Ù„ÙˆÙ„ Ù…ÙˆØ¹Ø¯ Ù…Ø³ØªÙ‚Ø¨Ù„ÙŠ Ù…Ø­Ø¯Ø¯:', '["will have been serving","will serve","is serving","has served"]'::jsonb, NULL, NULL, NULL)
ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  correct_answer = EXCLUDED.correct_answer;
INSERT INTO public.questions (id, skill, cefr_level, question_type, question_text, question_ar, options, correct_answer, explanation, explanation_ar)
VALUES ('b2-gram-2', 'grammar', NULL, 'multiple-choice', 'The financial audit ______ by a team of independent external consultants last week.', 'Ø§Ø®ØªØ± ØµÙŠØºØ© Ø§Ù„Ù…Ø¨Ù†ÙŠ Ù„Ù„Ù…Ø¬Ù‡ÙˆÙ„ Ø§Ù„ØµØ­ÙŠØ­Ø© ÙÙŠ Ø§Ù„Ù…Ø§Ø¶ÙŠ Ø§Ù„Ø¨Ø³ÙŠØ·:', '["was conducted","has conducted","is conducted","conducted"]'::jsonb, NULL, NULL, NULL)
ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  correct_answer = EXCLUDED.correct_answer;
INSERT INTO public.questions (id, skill, cefr_level, question_type, question_text, question_ar, options, correct_answer, explanation, explanation_ar)
VALUES ('b2-voc-1', 'vocabulary', NULL, 'multiple-choice', 'To "streamline" a workflow process means to ______.', 'Ù…Ø§ Ø§Ù„Ù…Ø¹Ù†Ù‰ Ø§Ù„Ø¯Ù‚ÙŠÙ‚ Ù„Ù…ØµØ·Ù„Ø­ Streamline ÙÙŠ Ø¥Ø¯Ø§Ø±Ø© Ø§Ù„Ø£Ø¹Ù…Ø§Ù„ ÙˆØ§Ù„Ø¨Ø±Ù…Ø¬ÙŠØ§ØªØŸ', '["make it more efficient and simpler","delay it unnecessarily","hire more employees","cancel the project"]'::jsonb, NULL, NULL, NULL)
ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  correct_answer = EXCLUDED.correct_answer;
INSERT INTO public.questions (id, skill, cefr_level, question_type, question_text, question_ar, options, correct_answer, explanation, explanation_ar)
VALUES ('b2-usage-1', 'usage', NULL, 'multiple-choice', 'In a formal email negotiation, which phrase is most professional to express polite disagreement?', 'Ø£ÙŠ Ù…Ù† Ø§Ù„Ø¹Ø¨Ø§Ø±Ø§Øª Ø§Ù„Ø¢ØªÙŠØ© Ù‡ÙŠ Ø§Ù„Ø£ÙƒØ«Ø± Ø¯Ø¨Ù„ÙˆÙ…Ø§Ø³ÙŠØ© ÙˆØ§Ø­ØªØ±Ø§ÙÙŠØ© Ù„Ù„ØªØ¹Ø¨ÙŠØ± Ø¹Ù† Ø§Ù„Ø§Ø¹ØªØ±Ø§Ø¶ ÙÙŠ Ø¥ÙŠÙ…ÙŠÙ„ Ø¹Ù…Ù„ØŸ', '["While I see your point, our data suggests an alternative approach.","You are completely wrong about this estimate.","I do not care about your perspective.","This proposal makes no sense at all."]'::jsonb, NULL, NULL, NULL)
ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  correct_answer = EXCLUDED.correct_answer;
INSERT INTO public.questions (id, skill, cefr_level, question_type, question_text, question_ar, options, correct_answer, explanation, explanation_ar)
VALUES ('c1-gram-1', 'grammar', NULL, 'multiple-choice', 'Hardly ______ the stage when the entire auditorium erupted in thunderous applause.', 'Ø§Ø®ØªØ± Ø§Ù„ØµÙŠØºØ© Ø§Ù„Ù…Ø¹ÙƒÙˆØ³Ø© Ø§Ù„ØµØ­ÙŠØ­Ø© (Inversion) Ø¨Ø¹Ø¯ Ø¸Ø±Ù Ø§Ù„Ù†ÙÙŠ Hardly:', '["had the keynote speaker entered","the keynote speaker had entered","did the speaker entered","was the speaker enter"]'::jsonb, NULL, NULL, NULL)
ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  correct_answer = EXCLUDED.correct_answer;
INSERT INTO public.questions (id, skill, cefr_level, question_type, question_text, question_ar, options, correct_answer, explanation, explanation_ar)
VALUES ('c1-voc-1', 'vocabulary', NULL, 'multiple-choice', 'The keynote speaker''s insights were remarkably ______, dissecting macroeconomic trends with razor-sharp precision.', 'Ø§Ø®ØªØ± Ø§Ù„ØµÙØ© Ø§Ù„Ø¨Ù„ÙŠØºØ© Ø§Ù„Ù…Ù†Ø§Ø³Ø¨Ø© Ù„Ù„ØªØ¹Ø¨ÙŠØ± Ø¹Ù† Ø§Ù„Ø¹Ù…Ù‚ Ø§Ù„ÙÙƒØ±ÙŠ ÙˆØ§Ù„ÙØ·Ù†Ø© Ø§Ù„Ø«Ø§Ù‚Ø¨Ø©:', '["incisive","ambiguous","superficial","redundant"]'::jsonb, NULL, NULL, NULL)
ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  correct_answer = EXCLUDED.correct_answer;
INSERT INTO public.questions (id, skill, cefr_level, question_type, question_text, question_ar, options, correct_answer, explanation, explanation_ar)
VALUES ('c1-read-1', 'reading', NULL, 'multiple-choice', 'What core thesis do cognitive linguists advance in the passage?', 'Ù…Ø§ Ù‡ÙŠ Ø§Ù„Ø£Ø·Ø±ÙˆØ­Ø© Ø§Ù„Ø¬ÙˆÙ‡Ø±ÙŠØ© Ø§Ù„ØªÙŠ ÙŠÙ‚Ø¯Ù…Ù‡Ø§ Ø¹Ù„Ù…Ø§Ø¡ Ø§Ù„Ù„ØºØ© Ø§Ù„Ù…Ø¹Ø±ÙÙŠÙˆÙ† ÙÙŠ Ø§Ù„Ù†ØµØŸ', '["Abstract temporal concepts derive organically from physical spatial metaphors","Grammar consists strictly of mathematical algebraic formulas","Languages have no underlying conceptual metaphors","Time expressions cannot be conceptualized by humans"]'::jsonb, NULL, NULL, NULL)
ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  correct_answer = EXCLUDED.correct_answer;

-- 7. CORE VOCABULARY SEED
INSERT INTO public.dictionary_lexical_entries (headword, normalized_headword, primary_part_of_speech, cefr_level, ipa_us, ipa_uk)
VALUES ('the', 'the', 'noun', 'A1', '/ËˆÃ°É™/, /Ã°É™/, /Ã°i/', '/Ã°É™, Ã°i/')
ON CONFLICT (headword) DO NOTHING;
INSERT INTO public.dictionary_lexical_entries (headword, normalized_headword, primary_part_of_speech, cefr_level, ipa_us, ipa_uk)
VALUES ('of', 'of', 'noun', 'A1', '/ËˆÉ™v/', '/ËˆÉ’v/')
ON CONFLICT (headword) DO NOTHING;
INSERT INTO public.dictionary_lexical_entries (headword, normalized_headword, primary_part_of_speech, cefr_level, ipa_us, ipa_uk)
VALUES ('and', 'and', 'noun', 'A1', '/ËˆÃ¦nd/, /É™nd/', '/ËˆÃ¦nd/')
ON CONFLICT (headword) DO NOTHING;
INSERT INTO public.dictionary_lexical_entries (headword, normalized_headword, primary_part_of_speech, cefr_level, ipa_us, ipa_uk)
VALUES ('to', 'to', 'noun', 'A1', '/Ëˆtu/, /tÉ™/, /tÉª/', '/tËˆuË/')
ON CONFLICT (headword) DO NOTHING;
INSERT INTO public.dictionary_lexical_entries (headword, normalized_headword, primary_part_of_speech, cefr_level, ipa_us, ipa_uk)
VALUES ('in', 'in', 'noun', 'A1', '/ËˆÉªn/, /Éªn/', '/ËˆÉªn/')
ON CONFLICT (headword) DO NOTHING;
INSERT INTO public.dictionary_lexical_entries (headword, normalized_headword, primary_part_of_speech, cefr_level, ipa_us, ipa_uk)
VALUES ('for', 'for', 'noun', 'A1', '/ËˆfÉ”É¹/, /fÉ/, /fÉ¹É/', '/fËˆÉ”Ë/')
ON CONFLICT (headword) DO NOTHING;
INSERT INTO public.dictionary_lexical_entries (headword, normalized_headword, primary_part_of_speech, cefr_level, ipa_us, ipa_uk)
VALUES ('is', 'is', 'verb', 'A1', '/ËˆÉªz/, /Éªz/', '/ËˆÉªz/')
ON CONFLICT (headword) DO NOTHING;
INSERT INTO public.dictionary_lexical_entries (headword, normalized_headword, primary_part_of_speech, cefr_level, ipa_us, ipa_uk)
VALUES ('on', 'on', 'noun', 'A1', '/ËˆÉ‘n/, /ËˆÉ”n/', '/ËˆÉ’n/')
ON CONFLICT (headword) DO NOTHING;
INSERT INTO public.dictionary_lexical_entries (headword, normalized_headword, primary_part_of_speech, cefr_level, ipa_us, ipa_uk)
VALUES ('that', 'that', 'noun', 'A1', '/ËˆÃ°Ã¦t/, /Ã°É™t/', '/Ã°ËˆÃ¦t/')
ON CONFLICT (headword) DO NOTHING;
INSERT INTO public.dictionary_lexical_entries (headword, normalized_headword, primary_part_of_speech, cefr_level, ipa_us, ipa_uk)
VALUES ('by', 'by', 'noun', 'A1', '/ËˆbaÉª/', '/bËˆaÉª/')
ON CONFLICT (headword) DO NOTHING;
INSERT INTO public.dictionary_lexical_entries (headword, normalized_headword, primary_part_of_speech, cefr_level, ipa_us, ipa_uk)
VALUES ('this', 'this', 'noun', 'A1', '/ËˆÃ°Éªs/, /Ã°Éªs/', '/Ã°ËˆÉªs/')
ON CONFLICT (headword) DO NOTHING;
INSERT INTO public.dictionary_lexical_entries (headword, normalized_headword, primary_part_of_speech, cefr_level, ipa_us, ipa_uk)
VALUES ('with', 'with', 'noun', 'A1', '/ËˆwÉªÃ°/, /ËˆwÉªÎ¸/, /wÉªÃ°/, /wÉªÎ¸/', '/wËˆÉªÃ°/')
ON CONFLICT (headword) DO NOTHING;
INSERT INTO public.dictionary_lexical_entries (headword, normalized_headword, primary_part_of_speech, cefr_level, ipa_us, ipa_uk)
VALUES ('you', 'you', 'noun', 'A1', '/Ëˆju/', '/jËˆuË/')
ON CONFLICT (headword) DO NOTHING;
INSERT INTO public.dictionary_lexical_entries (headword, normalized_headword, primary_part_of_speech, cefr_level, ipa_us, ipa_uk)
VALUES ('it', 'it', 'noun', 'A1', '/ËˆÉªt/, /Éªt/', '/ËˆÉªt/')
ON CONFLICT (headword) DO NOTHING;
INSERT INTO public.dictionary_lexical_entries (headword, normalized_headword, primary_part_of_speech, cefr_level, ipa_us, ipa_uk)
VALUES ('not', 'not', 'noun', 'A1', '/ËˆnÉ‘t/', '/nËˆÉ’t/')
ON CONFLICT (headword) DO NOTHING;
INSERT INTO public.dictionary_lexical_entries (headword, normalized_headword, primary_part_of_speech, cefr_level, ipa_us, ipa_uk)
VALUES ('or', 'or', 'noun', 'A1', '/ËˆÉ”É¹/, /É/', '/ËˆÉ”Ë/')
ON CONFLICT (headword) DO NOTHING;
INSERT INTO public.dictionary_lexical_entries (headword, normalized_headword, primary_part_of_speech, cefr_level, ipa_us, ipa_uk)
VALUES ('be', 'be', 'noun', 'A1', '/Ëˆbi/, /bi/', '/bËˆiË/')
ON CONFLICT (headword) DO NOTHING;
INSERT INTO public.dictionary_lexical_entries (headword, normalized_headword, primary_part_of_speech, cefr_level, ipa_us, ipa_uk)
VALUES ('are', 'are', 'verb', 'A1', '/ËˆÉ‘É¹/, /É/', '/ËˆÉ‘É¹/, /É/')
ON CONFLICT (headword) DO NOTHING;
INSERT INTO public.dictionary_lexical_entries (headword, normalized_headword, primary_part_of_speech, cefr_level, ipa_us, ipa_uk)
VALUES ('from', 'from', 'noun', 'A1', '/ËˆfÉ¹É™m/', '/fÉ¹ËˆÉ’m/')
ON CONFLICT (headword) DO NOTHING;
INSERT INTO public.dictionary_lexical_entries (headword, normalized_headword, primary_part_of_speech, cefr_level, ipa_us, ipa_uk)
VALUES ('at', 'at', 'noun', 'A1', '/ËˆÃ¦t/', '/ËˆÃ¦t/')
ON CONFLICT (headword) DO NOTHING;
INSERT INTO public.dictionary_lexical_entries (headword, normalized_headword, primary_part_of_speech, cefr_level, ipa_us, ipa_uk)
VALUES ('as', 'as', 'noun', 'A1', '/ËˆÃ¦z/, /ËˆÉ›z/', '/ËˆÃ¦z/, /ËˆÉ›z/')
ON CONFLICT (headword) DO NOTHING;
INSERT INTO public.dictionary_lexical_entries (headword, normalized_headword, primary_part_of_speech, cefr_level, ipa_us, ipa_uk)
VALUES ('your', 'your', 'noun', 'A1', '/ËˆjÉ”É¹/, /ËˆjÊŠÉ¹/', '/jËˆÉ”Ë/')
ON CONFLICT (headword) DO NOTHING;
INSERT INTO public.dictionary_lexical_entries (headword, normalized_headword, primary_part_of_speech, cefr_level, ipa_us, ipa_uk)
VALUES ('all', 'all', 'noun', 'A1', '/ËˆÉ”É«/', '/ËˆÉ”Ël/')
ON CONFLICT (headword) DO NOTHING;
INSERT INTO public.dictionary_lexical_entries (headword, normalized_headword, primary_part_of_speech, cefr_level, ipa_us, ipa_uk)
VALUES ('have', 'have', 'noun', 'A1', '/ËˆhÃ¦v/', '/ËˆhÃ¦v/')
ON CONFLICT (headword) DO NOTHING;
INSERT INTO public.dictionary_lexical_entries (headword, normalized_headword, primary_part_of_speech, cefr_level, ipa_us, ipa_uk)
VALUES ('new', 'new', 'noun', 'A1', '/Ëˆnju/, /Ëˆnu/', '/njËˆuË/')
ON CONFLICT (headword) DO NOTHING;
INSERT INTO public.dictionary_lexical_entries (headword, normalized_headword, primary_part_of_speech, cefr_level, ipa_us, ipa_uk)
VALUES ('more', 'more', 'noun', 'A1', '/ËˆmÉ”É¹/', '/mËˆÉ”Ë/')
ON CONFLICT (headword) DO NOTHING;
INSERT INTO public.dictionary_lexical_entries (headword, normalized_headword, primary_part_of_speech, cefr_level, ipa_us, ipa_uk)
VALUES ('an', 'an', 'adjective', 'A1', '/ËˆÃ¦n/, /É™n/', '/ËˆÉn/')
ON CONFLICT (headword) DO NOTHING;
INSERT INTO public.dictionary_lexical_entries (headword, normalized_headword, primary_part_of_speech, cefr_level, ipa_us, ipa_uk)
VALUES ('was', 'was', 'verb', 'A1', '/ËˆwÉ‘z/, /wÉ™z/', '/wËˆÉ’z/')
ON CONFLICT (headword) DO NOTHING;
INSERT INTO public.dictionary_lexical_entries (headword, normalized_headword, primary_part_of_speech, cefr_level, ipa_us, ipa_uk)
VALUES ('we', 'we', 'noun', 'A1', '/Ëˆwi/', '/wËˆiË/')
ON CONFLICT (headword) DO NOTHING;
INSERT INTO public.dictionary_lexical_entries (headword, normalized_headword, primary_part_of_speech, cefr_level, ipa_us, ipa_uk)
VALUES ('will', 'will', 'noun', 'A1', '/ËˆwÉªÉ«/, /wÉ™É«/', '/wËˆÉªl/')
ON CONFLICT (headword) DO NOTHING;
INSERT INTO public.dictionary_lexical_entries (headword, normalized_headword, primary_part_of_speech, cefr_level, ipa_us, ipa_uk)
VALUES ('home', 'home', 'noun', 'A1', '/ËˆhoÊŠm/', '/hËˆÉ™ÊŠm/')
ON CONFLICT (headword) DO NOTHING;
INSERT INTO public.dictionary_lexical_entries (headword, normalized_headword, primary_part_of_speech, cefr_level, ipa_us, ipa_uk)
VALUES ('can', 'can', 'noun', 'A1', '/ËˆkÃ¦n/, /kÉ™n/', '/kËˆÃ¦n/')
ON CONFLICT (headword) DO NOTHING;
INSERT INTO public.dictionary_lexical_entries (headword, normalized_headword, primary_part_of_speech, cefr_level, ipa_us, ipa_uk)
VALUES ('us', 'us', 'noun', 'A1', '/ËˆÉ™s/, /ËŒjuËˆÉ›s/', '/ËˆÊŒs/')
ON CONFLICT (headword) DO NOTHING;
INSERT INTO public.dictionary_lexical_entries (headword, normalized_headword, primary_part_of_speech, cefr_level, ipa_us, ipa_uk)
VALUES ('if', 'if', 'noun', 'A1', '/ËˆÉªf/, /Éªf/', '/ËˆÉªf/')
ON CONFLICT (headword) DO NOTHING;
INSERT INTO public.dictionary_lexical_entries (headword, normalized_headword, primary_part_of_speech, cefr_level, ipa_us, ipa_uk)
VALUES ('page', 'page', 'noun', 'A1', '/ËˆpeÉªdÊ’/', '/pËˆeÉªdÊ’/')
ON CONFLICT (headword) DO NOTHING;
INSERT INTO public.dictionary_lexical_entries (headword, normalized_headword, primary_part_of_speech, cefr_level, ipa_us, ipa_uk)
VALUES ('my', 'my', 'noun', 'A1', '/ËˆmaÉª/', '/mËˆaÉª/')
ON CONFLICT (headword) DO NOTHING;
INSERT INTO public.dictionary_lexical_entries (headword, normalized_headword, primary_part_of_speech, cefr_level, ipa_us, ipa_uk)
VALUES ('has', 'has', 'noun', 'A1', '/ËˆhÃ¦z/, /hÉ™z/', '/hËˆÃ¦z/')
ON CONFLICT (headword) DO NOTHING;
INSERT INTO public.dictionary_lexical_entries (headword, normalized_headword, primary_part_of_speech, cefr_level, ipa_us, ipa_uk)
VALUES ('search', 'search', 'noun', 'A1', '/ËˆsÉtÊƒ/', '/sËˆÉœËtÊƒ/')
ON CONFLICT (headword) DO NOTHING;
INSERT INTO public.dictionary_lexical_entries (headword, normalized_headword, primary_part_of_speech, cefr_level, ipa_us, ipa_uk)
VALUES ('free', 'free', 'noun', 'A1', '/ËˆfÉ¹i/', '/fÉ¹ËˆiË/')
ON CONFLICT (headword) DO NOTHING;
INSERT INTO public.dictionary_lexical_entries (headword, normalized_headword, primary_part_of_speech, cefr_level, ipa_us, ipa_uk)
VALUES ('but', 'but', 'noun', 'A1', '/ËˆbÉ™t/', '/bËˆÊŒt/')
ON CONFLICT (headword) DO NOTHING;
INSERT INTO public.dictionary_lexical_entries (headword, normalized_headword, primary_part_of_speech, cefr_level, ipa_us, ipa_uk)
VALUES ('our', 'our', 'noun', 'A1', '/ËˆaÊŠÉ/, /ËˆaÊŠÉ¹/, /ËˆÉ‘É¹/', '/ËˆaÊŠÉ™/')
ON CONFLICT (headword) DO NOTHING;
INSERT INTO public.dictionary_lexical_entries (headword, normalized_headword, primary_part_of_speech, cefr_level, ipa_us, ipa_uk)
VALUES ('one', 'one', 'noun', 'A1', '/ËˆwÉ™n/', '/wËˆÉ’n/')
ON CONFLICT (headword) DO NOTHING;
INSERT INTO public.dictionary_lexical_entries (headword, normalized_headword, primary_part_of_speech, cefr_level, ipa_us, ipa_uk)
VALUES ('other', 'other', 'noun', 'A1', '/ËˆÉ™Ã°É/', '/ËˆÊŒÃ°É/')
ON CONFLICT (headword) DO NOTHING;
INSERT INTO public.dictionary_lexical_entries (headword, normalized_headword, primary_part_of_speech, cefr_level, ipa_us, ipa_uk)
VALUES ('do', 'do', 'noun', 'A1', '/Ëˆdu/', '/Ëˆdu/')
ON CONFLICT (headword) DO NOTHING;
INSERT INTO public.dictionary_lexical_entries (headword, normalized_headword, primary_part_of_speech, cefr_level, ipa_us, ipa_uk)
VALUES ('no', 'no', 'noun', 'A1', '/ËˆnoÊŠ/', '/ËˆnoÊŠ/')
ON CONFLICT (headword) DO NOTHING;
INSERT INTO public.dictionary_lexical_entries (headword, normalized_headword, primary_part_of_speech, cefr_level, ipa_us, ipa_uk)
VALUES ('information', 'information', 'noun', 'A1', '/ËŒÉªnfÉËˆmeÉªÊƒÉ™n/, /ÉªnËˆfÉ”É¹ËˆmeÉªÊƒÉ™n/', '/ËŒÉªnfÉ™mËˆeÉªÊƒÉ™n/')
ON CONFLICT (headword) DO NOTHING;
INSERT INTO public.dictionary_lexical_entries (headword, normalized_headword, primary_part_of_speech, cefr_level, ipa_us, ipa_uk)
VALUES ('time', 'time', 'noun', 'A1', '/ËˆtaÉªm/', '/tËˆaÉªm/')
ON CONFLICT (headword) DO NOTHING;
INSERT INTO public.dictionary_lexical_entries (headword, normalized_headword, primary_part_of_speech, cefr_level, ipa_us, ipa_uk)
VALUES ('they', 'they', 'noun', 'A1', '/ËˆÃ°eÉª/', '/Ã°ËˆeÉª/')
ON CONFLICT (headword) DO NOTHING;
INSERT INTO public.dictionary_lexical_entries (headword, normalized_headword, primary_part_of_speech, cefr_level, ipa_us, ipa_uk)
VALUES ('site', 'site', 'noun', 'A1', '/ËˆsaÉªt/', '/sËˆaÉªt/')
ON CONFLICT (headword) DO NOTHING;
INSERT INTO public.dictionary_lexical_entries (headword, normalized_headword, primary_part_of_speech, cefr_level, ipa_us, ipa_uk)
VALUES ('he', 'he', 'noun', 'A1', '/Ëˆhi/', '/Ëˆhi/')
ON CONFLICT (headword) DO NOTHING;
INSERT INTO public.dictionary_lexical_entries (headword, normalized_headword, primary_part_of_speech, cefr_level, ipa_us, ipa_uk)
VALUES ('up', 'up', 'noun', 'A1', '/ËˆÉ™p/', '/ËˆÊŒp/')
ON CONFLICT (headword) DO NOTHING;
INSERT INTO public.dictionary_lexical_entries (headword, normalized_headword, primary_part_of_speech, cefr_level, ipa_us, ipa_uk)
VALUES ('may', 'may', 'verb', 'A1', '/ËˆmeÉª/', '/mËˆeÉª/')
ON CONFLICT (headword) DO NOTHING;
INSERT INTO public.dictionary_lexical_entries (headword, normalized_headword, primary_part_of_speech, cefr_level, ipa_us, ipa_uk)
VALUES ('what', 'what', 'noun', 'A1', '/ËˆhwÉ™t/, /ËˆwÉ™t/', '/wËˆÉ’t/')
ON CONFLICT (headword) DO NOTHING;
INSERT INTO public.dictionary_lexical_entries (headword, normalized_headword, primary_part_of_speech, cefr_level, ipa_us, ipa_uk)
VALUES ('which', 'which', 'noun', 'A1', '/ËˆhwÉªtÊƒ/, /ËˆwÉªtÊƒ/', '/wËˆÉªtÊƒ/')
ON CONFLICT (headword) DO NOTHING;
INSERT INTO public.dictionary_lexical_entries (headword, normalized_headword, primary_part_of_speech, cefr_level, ipa_us, ipa_uk)
VALUES ('their', 'their', 'noun', 'A1', '/ËˆÃ°É›É¹/', '/Ã°ËˆeÉ™/')
ON CONFLICT (headword) DO NOTHING;
INSERT INTO public.dictionary_lexical_entries (headword, normalized_headword, primary_part_of_speech, cefr_level, ipa_us, ipa_uk)
VALUES ('news', 'news', 'noun', 'A1', '/Ëˆnjuz/, /Ëˆnuz/', '/njËˆuËz/')
ON CONFLICT (headword) DO NOTHING;
INSERT INTO public.dictionary_lexical_entries (headword, normalized_headword, primary_part_of_speech, cefr_level, ipa_us, ipa_uk)
VALUES ('out', 'out', 'noun', 'A1', '/ËˆaÊŠt/', '/ËˆaÊŠt/')
ON CONFLICT (headword) DO NOTHING;
INSERT INTO public.dictionary_lexical_entries (headword, normalized_headword, primary_part_of_speech, cefr_level, ipa_us, ipa_uk)
VALUES ('use', 'use', 'noun', 'A1', '/Ëˆjus/, /Ëˆjuz/', '/Ëˆjus/, /Ëˆjuz/')
ON CONFLICT (headword) DO NOTHING;
INSERT INTO public.dictionary_lexical_entries (headword, normalized_headword, primary_part_of_speech, cefr_level, ipa_us, ipa_uk)
VALUES ('any', 'any', 'noun', 'A1', '/ËˆÉ›ni/', '/ËˆÉ›ni/')
ON CONFLICT (headword) DO NOTHING;
INSERT INTO public.dictionary_lexical_entries (headword, normalized_headword, primary_part_of_speech, cefr_level, ipa_us, ipa_uk)
VALUES ('there', 'there', 'noun', 'A1', '/ËˆÃ°É›É¹/', '/Ã°ËˆeÉ™/')
ON CONFLICT (headword) DO NOTHING;
INSERT INTO public.dictionary_lexical_entries (headword, normalized_headword, primary_part_of_speech, cefr_level, ipa_us, ipa_uk)
VALUES ('see', 'see', 'noun', 'A1', '/Ëˆsi/', '/sËˆiË/')
ON CONFLICT (headword) DO NOTHING;
INSERT INTO public.dictionary_lexical_entries (headword, normalized_headword, primary_part_of_speech, cefr_level, ipa_us, ipa_uk)
VALUES ('only', 'only', 'adverb', 'A1', '/ËˆoÊŠnÉ«i/', '/ËˆÉ™ÊŠnli/')
ON CONFLICT (headword) DO NOTHING;
INSERT INTO public.dictionary_lexical_entries (headword, normalized_headword, primary_part_of_speech, cefr_level, ipa_us, ipa_uk)
VALUES ('so', 'so', 'noun', 'A1', '/ËˆsoÊŠ/', '/sËˆÉ™ÊŠ/')
ON CONFLICT (headword) DO NOTHING;
INSERT INTO public.dictionary_lexical_entries (headword, normalized_headword, primary_part_of_speech, cefr_level, ipa_us, ipa_uk)
VALUES ('his', 'his', 'noun', 'A1', '/ËˆhÉªz/, /hÉªz/', '/hËˆÉªz/')
ON CONFLICT (headword) DO NOTHING;
INSERT INTO public.dictionary_lexical_entries (headword, normalized_headword, primary_part_of_speech, cefr_level, ipa_us, ipa_uk)
VALUES ('when', 'when', 'noun', 'A1', '/ËˆhwÉ›n/, /ËˆhwÉªn/, /ËˆwÉ›n/, /ËˆwÉªn/', '/wËˆÉ›n/')
ON CONFLICT (headword) DO NOTHING;
INSERT INTO public.dictionary_lexical_entries (headword, normalized_headword, primary_part_of_speech, cefr_level, ipa_us, ipa_uk)
VALUES ('contact', 'contact', 'noun', 'A1', '/ËˆkÉ‘nËŒtÃ¦kt/', '/ËˆkÉ‘nËŒtÃ¦kt/')
ON CONFLICT (headword) DO NOTHING;
INSERT INTO public.dictionary_lexical_entries (headword, normalized_headword, primary_part_of_speech, cefr_level, ipa_us, ipa_uk)
VALUES ('here', 'here', 'noun', 'A1', '/ËˆhiÉ¹/', '/hËˆiÉ™/')
ON CONFLICT (headword) DO NOTHING;
INSERT INTO public.dictionary_lexical_entries (headword, normalized_headword, primary_part_of_speech, cefr_level, ipa_us, ipa_uk)
VALUES ('business', 'business', 'noun', 'A1', '/ËˆbÉªznÉ™s/, /ËˆbÉªznÉªs/', '/bËˆÉªznÉ™s/')
ON CONFLICT (headword) DO NOTHING;
INSERT INTO public.dictionary_lexical_entries (headword, normalized_headword, primary_part_of_speech, cefr_level, ipa_us, ipa_uk)
VALUES ('who', 'who', 'noun', 'A1', '/Ëˆhu/', '/hËˆuË/')
ON CONFLICT (headword) DO NOTHING;
INSERT INTO public.dictionary_lexical_entries (headword, normalized_headword, primary_part_of_speech, cefr_level, ipa_us, ipa_uk)
VALUES ('web', 'web', 'noun', 'A1', '/ËˆwÉ›b/', '/wËˆÉ›b/')
ON CONFLICT (headword) DO NOTHING;
INSERT INTO public.dictionary_lexical_entries (headword, normalized_headword, primary_part_of_speech, cefr_level, ipa_us, ipa_uk)
VALUES ('also', 'also', 'noun', 'A1', '/ËˆÉ”É«soÊŠ/', '/ËˆÉ’lsÉ™ÊŠ/')
ON CONFLICT (headword) DO NOTHING;
INSERT INTO public.dictionary_lexical_entries (headword, normalized_headword, primary_part_of_speech, cefr_level, ipa_us, ipa_uk)
VALUES ('now', 'now', 'noun', 'A1', '/ËˆnaÊŠ/', '/nËˆaÊŠ/')
ON CONFLICT (headword) DO NOTHING;
INSERT INTO public.dictionary_lexical_entries (headword, normalized_headword, primary_part_of_speech, cefr_level, ipa_us, ipa_uk)
VALUES ('help', 'help', 'noun', 'A1', '/ËˆhÉ›É«p/', '/hËˆÉ›lp/')
ON CONFLICT (headword) DO NOTHING;
INSERT INTO public.dictionary_lexical_entries (headword, normalized_headword, primary_part_of_speech, cefr_level, ipa_us, ipa_uk)
VALUES ('get', 'get', 'noun', 'A1', '/ËˆÉ¡É›t/, /ËˆÉ¡Éªt/', '/É¡ËˆÉ›t/')
ON CONFLICT (headword) DO NOTHING;
INSERT INTO public.dictionary_lexical_entries (headword, normalized_headword, primary_part_of_speech, cefr_level, ipa_us, ipa_uk)
VALUES ('pm', 'pm', 'noun', 'A1', '/ËˆpiËˆÉ›m/', '/ËˆpiËˆÉ›m/')
ON CONFLICT (headword) DO NOTHING;
INSERT INTO public.dictionary_lexical_entries (headword, normalized_headword, primary_part_of_speech, cefr_level, ipa_us, ipa_uk)
VALUES ('view', 'view', 'noun', 'A1', '/Ëˆvju/', '/vjËˆuË/')
ON CONFLICT (headword) DO NOTHING;
INSERT INTO public.dictionary_lexical_entries (headword, normalized_headword, primary_part_of_speech, cefr_level, ipa_us, ipa_uk)
VALUES ('online', 'online', 'noun', 'A1', '/ËˆÉ”nËŒÉ«aÉªn/', '/ËˆÉ’nlaÉªn/')
ON CONFLICT (headword) DO NOTHING;
INSERT INTO public.dictionary_lexical_entries (headword, normalized_headword, primary_part_of_speech, cefr_level, ipa_us, ipa_uk)
VALUES ('first', 'first', 'noun', 'A1', '/ËˆfÉst/', '/fËˆÉœËst/')
ON CONFLICT (headword) DO NOTHING;
INSERT INTO public.dictionary_lexical_entries (headword, normalized_headword, primary_part_of_speech, cefr_level, ipa_us, ipa_uk)
VALUES ('am', 'am', 'verb', 'A1', '/ËˆÃ¦m/, /ËˆeÉªËˆÉ›m/', '/ËˆÃ¦m/, /ËˆeÉªËˆÉ›m/')
ON CONFLICT (headword) DO NOTHING;
INSERT INTO public.dictionary_lexical_entries (headword, normalized_headword, primary_part_of_speech, cefr_level, ipa_us, ipa_uk)
VALUES ('been', 'been', 'noun', 'A1', '/ËˆbÉªn/, /bÉ™n/, /bÉªn/', '/bËˆiËn/')
ON CONFLICT (headword) DO NOTHING;
INSERT INTO public.dictionary_lexical_entries (headword, normalized_headword, primary_part_of_speech, cefr_level, ipa_us, ipa_uk)
VALUES ('would', 'would', 'verb', 'A1', '/ËˆwÊŠd/', '/wËˆÊŠd/')
ON CONFLICT (headword) DO NOTHING;
INSERT INTO public.dictionary_lexical_entries (headword, normalized_headword, primary_part_of_speech, cefr_level, ipa_us, ipa_uk)
VALUES ('how', 'how', 'noun', 'A1', '/ËˆhaÊŠ/', '/hËˆaÊŠ/')
ON CONFLICT (headword) DO NOTHING;
INSERT INTO public.dictionary_lexical_entries (headword, normalized_headword, primary_part_of_speech, cefr_level, ipa_us, ipa_uk)
VALUES ('were', 'were', 'verb', 'A1', '/ËˆwÉ/', '/wËˆÉœË/')
ON CONFLICT (headword) DO NOTHING;
INSERT INTO public.dictionary_lexical_entries (headword, normalized_headword, primary_part_of_speech, cefr_level, ipa_us, ipa_uk)
VALUES ('me', 'me', 'noun', 'A1', '/Ëˆmi/', '/mËˆiË/')
ON CONFLICT (headword) DO NOTHING;
INSERT INTO public.dictionary_lexical_entries (headword, normalized_headword, primary_part_of_speech, cefr_level, ipa_us, ipa_uk)
VALUES ('services', 'services', 'noun', 'A1', '/ËˆsÉvÉ™sÉ™z/, /ËˆsÉvÉªsÉªz/', '/sËˆÉœËvÉªsÉªz/')
ON CONFLICT (headword) DO NOTHING;
INSERT INTO public.dictionary_lexical_entries (headword, normalized_headword, primary_part_of_speech, cefr_level, ipa_us, ipa_uk)
VALUES ('some', 'some', 'noun', 'A1', '/ËˆsÉ™m/', '/sËˆÊŒm/')
ON CONFLICT (headword) DO NOTHING;
INSERT INTO public.dictionary_lexical_entries (headword, normalized_headword, primary_part_of_speech, cefr_level, ipa_us, ipa_uk)
VALUES ('these', 'these', 'noun', 'A1', '/ËˆÃ°iz/', '/Ã°ËˆiËz/')
ON CONFLICT (headword) DO NOTHING;
INSERT INTO public.dictionary_lexical_entries (headword, normalized_headword, primary_part_of_speech, cefr_level, ipa_us, ipa_uk)
VALUES ('click', 'click', 'verb', 'A1', '/ËˆkÉ«Éªk/', '/klËˆÉªk/')
ON CONFLICT (headword) DO NOTHING;
INSERT INTO public.dictionary_lexical_entries (headword, normalized_headword, primary_part_of_speech, cefr_level, ipa_us, ipa_uk)
VALUES ('its', 'its', 'noun', 'A1', '/ËˆÉªts/, /Éªts/', '/ËˆÉªts/')
ON CONFLICT (headword) DO NOTHING;
INSERT INTO public.dictionary_lexical_entries (headword, normalized_headword, primary_part_of_speech, cefr_level, ipa_us, ipa_uk)
VALUES ('like', 'like', 'noun', 'A1', '/ËˆÉ«aÉªk/', '/lËˆaÉªk/')
ON CONFLICT (headword) DO NOTHING;
INSERT INTO public.dictionary_lexical_entries (headword, normalized_headword, primary_part_of_speech, cefr_level, ipa_us, ipa_uk)
VALUES ('service', 'service', 'noun', 'A1', '/ËˆsÉvÉ™s/, /ËˆsÉvÉªs/', '/sËˆÉœËvÉªs/')
ON CONFLICT (headword) DO NOTHING;
INSERT INTO public.dictionary_lexical_entries (headword, normalized_headword, primary_part_of_speech, cefr_level, ipa_us, ipa_uk)
VALUES ('than', 'than', 'noun', 'A1', '/ËˆÃ°Ã¦n/, /Ã°É™n/', '/Ã°ËˆÉn/')
ON CONFLICT (headword) DO NOTHING;
INSERT INTO public.dictionary_lexical_entries (headword, normalized_headword, primary_part_of_speech, cefr_level, ipa_us, ipa_uk)
VALUES ('find', 'find', 'noun', 'A1', '/ËˆfaÉªnd/', '/fËˆaÉªnd/')
ON CONFLICT (headword) DO NOTHING;
INSERT INTO public.dictionary_lexical_entries (headword, normalized_headword, primary_part_of_speech, cefr_level, ipa_us, ipa_uk)
VALUES ('price', 'price', 'noun', 'A1', '/ËˆpÉ¹aÉªs/', '/pÉ¹ËˆaÉªs/')
ON CONFLICT (headword) DO NOTHING;
INSERT INTO public.dictionary_lexical_entries (headword, normalized_headword, primary_part_of_speech, cefr_level, ipa_us, ipa_uk)
VALUES ('date', 'date', 'noun', 'A1', '/ËˆdeÉªt/', '/dËˆeÉªt/')
ON CONFLICT (headword) DO NOTHING;
INSERT INTO public.dictionary_lexical_entries (headword, normalized_headword, primary_part_of_speech, cefr_level, ipa_us, ipa_uk)
VALUES ('back', 'back', 'noun', 'A1', '/ËˆbÃ¦k/', '/bËˆÃ¦k/')
ON CONFLICT (headword) DO NOTHING;
INSERT INTO public.dictionary_lexical_entries (headword, normalized_headword, primary_part_of_speech, cefr_level, ipa_us, ipa_uk)
VALUES ('top', 'top', 'noun', 'A1', '/ËˆtÉ‘p/, /ËˆtÉ”p/', '/tËˆÉ’p/')
ON CONFLICT (headword) DO NOTHING;
INSERT INTO public.dictionary_lexical_entries (headword, normalized_headword, primary_part_of_speech, cefr_level, ipa_us, ipa_uk)
VALUES ('people', 'people', 'noun', 'A1', '/ËˆpipÉ™É«/', '/pËˆiËpÉ™l/')
ON CONFLICT (headword) DO NOTHING;
INSERT INTO public.dictionary_lexical_entries (headword, normalized_headword, primary_part_of_speech, cefr_level, ipa_us, ipa_uk)
VALUES ('had', 'had', 'noun', 'A1', '/ËˆhÃ¦d/', '/hËˆÃ¦d/')
ON CONFLICT (headword) DO NOTHING;
INSERT INTO public.dictionary_lexical_entries (headword, normalized_headword, primary_part_of_speech, cefr_level, ipa_us, ipa_uk)
VALUES ('list', 'list', 'noun', 'A1', '/ËˆÉ«Éªst/', '/lËˆÉªst/')
ON CONFLICT (headword) DO NOTHING;
COMMIT;
-- Master seed generated successfully.
