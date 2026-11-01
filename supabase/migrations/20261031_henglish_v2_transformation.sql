-- ==============================================================================
-- Henglish Academy (HENGLISH 2.0) - PLATFORM TRANSFORMATION DATABASE SCHEMA
-- PostgreSQL / Supabase Migration
-- File: supabase/migrations/20261031_henglish_v2_transformation.sql
-- ==============================================================================

-- 1. Voice Recordings & Pronunciation Assessment Submissions
CREATE TABLE IF NOT EXISTS public.pronunciation_evaluations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  target_sentence TEXT NOT NULL,
  transcription TEXT NOT NULL,
  audio_url TEXT,
  overall_score INTEGER NOT NULL CHECK (overall_score BETWEEN 0 AND 100),
  pronunciation_score INTEGER NOT NULL CHECK (pronunciation_score BETWEEN 0 AND 100),
  fluency_score INTEGER NOT NULL CHECK (fluency_score BETWEEN 0 AND 100),
  accuracy_score INTEGER NOT NULL CHECK (accuracy_score BETWEEN 0 AND 100),
  completeness_score INTEGER NOT NULL CHECK (completeness_score BETWEEN 0 AND 100),
  words_per_minute INTEGER DEFAULT 0,
  word_breakdown_json JSONB NOT NULL,
  problematic_sounds_json JSONB DEFAULT '[]'::jsonb,
  is_ai_evaluated BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast user speaking history queries
CREATE INDEX IF NOT EXISTS idx_pronunciation_eval_user_created 
ON public.pronunciation_evaluations(user_id, created_at DESC);

-- 2. Spaced Repetition Vocabulary System (SM-2 Algorithm)
CREATE TABLE IF NOT EXISTS public.vocabulary_srs_cards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  word TEXT NOT NULL,
  ipa TEXT,
  translation_ar TEXT NOT NULL,
  cefr_level TEXT NOT NULL,
  category TEXT NOT NULL,
  repetition_count INTEGER DEFAULT 0,
  interval_days INTEGER DEFAULT 1,
  ease_factor NUMERIC(3, 2) DEFAULT 2.50,
  next_review_at TIMESTAMPTZ DEFAULT NOW(),
  last_reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, word)
);

CREATE INDEX IF NOT EXISTS idx_vocab_srs_due 
ON public.vocabulary_srs_cards(user_id, next_review_at);

-- 3. Dynamic AI-Generated Questions Cache
CREATE TABLE IF NOT EXISTS public.ai_generated_questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cefr_level TEXT NOT NULL,
  topic_slug TEXT NOT NULL,
  skill TEXT NOT NULL,
  question_type TEXT NOT NULL,
  prompt TEXT NOT NULL,
  options_json JSONB NOT NULL,
  correct_answer_index INTEGER NOT NULL,
  explanation_ar TEXT NOT NULL,
  distractors_explanation_json JSONB,
  quality_score NUMERIC(3, 2) DEFAULT 0.95,
  usage_count INTEGER DEFAULT 0,
  is_verified BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ai_questions_lookup 
ON public.ai_generated_questions(cefr_level, topic_slug, skill);

-- 4. Video Resources Management & Health Tracking
CREATE TABLE IF NOT EXISTS public.video_resources (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  youtube_id VARCHAR(11) NOT NULL,
  topic_slug TEXT NOT NULL,
  title_en TEXT NOT NULL,
  title_ar TEXT NOT NULL,
  channel_name TEXT NOT NULL,
  duration_text TEXT NOT NULL,
  thumbnail_url TEXT,
  is_available BOOLEAN DEFAULT TRUE,
  last_verified_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(youtube_id, topic_slug)
);

-- 5. Multiplayer Game Rooms & Live Arena
CREATE TABLE IF NOT EXISTS public.multiplayer_game_rooms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  room_code VARCHAR(8) UNIQUE NOT NULL,
  game_type TEXT NOT NULL,
  host_user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  guest_user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  status TEXT CHECK (status IN ('waiting', 'in_progress', 'completed', 'cancelled')) DEFAULT 'waiting',
  host_score INTEGER DEFAULT 0,
  guest_score INTEGER DEFAULT 0,
  winner_user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  questions_payload JSONB NOT NULL,
  started_at TIMESTAMPTZ,
  ended_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Real-Life 3D Simulation & NPC Dialogue Sessions
CREATE TABLE IF NOT EXISTS public.simulation_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  scenario_id TEXT NOT NULL,
  scenario_title_ar TEXT NOT NULL,
  location_name TEXT NOT NULL,
  npc_name TEXT NOT NULL,
  conversation_transcript JSONB NOT NULL,
  score_percentage INTEGER,
  feedback_ar TEXT,
  completed_at TIMESTAMPTZ DEFAULT NOW()
);
