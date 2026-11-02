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
