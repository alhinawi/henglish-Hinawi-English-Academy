-- ==============================================================================
-- Henglish Academy (HENGLISH) - TRANSLATION STUDIO DATABASE SCHEMA
-- PostgreSQL / Supabase Migration
-- File: supabase/migrations/20261101_translation_studio_schema.sql
-- ==============================================================================

-- 1. Translations History Table
CREATE TABLE IF NOT EXISTS public.translations_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  source_lang TEXT NOT NULL DEFAULT 'auto',
  target_lang TEXT NOT NULL DEFAULT 'ar',
  source_text TEXT NOT NULL,
  translated_text TEXT NOT NULL,
  mode TEXT NOT NULL DEFAULT 'natural',
  alternatives_json JSONB DEFAULT '[]'::jsonb,
  explanation_json JSONB DEFAULT '{}'::jsonb,
  word_analysis_json JSONB DEFAULT '[]'::jsonb,
  is_favorite BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_trans_hist_user_created 
ON public.translations_history(user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_trans_hist_favorite 
ON public.translations_history(user_id, is_favorite);

-- 2. Translation Custom Vocabulary Collections
CREATE TABLE IF NOT EXISTS public.translation_collections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  name_ar TEXT NOT NULL,
  description TEXT,
  color TEXT DEFAULT '#41e7ff',
  icon TEXT DEFAULT 'folder',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_trans_collections_user 
ON public.translation_collections(user_id);

-- 3. Saved Vocabulary Cards (Integrated with Spaced Repetition SM-2)
CREATE TABLE IF NOT EXISTS public.translation_saved_vocabulary (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  word_or_phrase TEXT NOT NULL,
  translation_ar TEXT NOT NULL,
  definition TEXT,
  part_of_speech TEXT,
  ipa TEXT,
  example_en TEXT,
  example_ar TEXT,
  personal_notes TEXT,
  cefr_level TEXT DEFAULT 'B1',
  collection_id UUID REFERENCES public.translation_collections(id) ON DELETE SET NULL,
  repetition_count INTEGER DEFAULT 0,
  interval_days INTEGER DEFAULT 1,
  ease_factor NUMERIC(3, 2) DEFAULT 2.50,
  next_review_at TIMESTAMPTZ DEFAULT NOW(),
  last_reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_trans_vocab_user_srs 
ON public.translation_saved_vocabulary(user_id, next_review_at);

CREATE INDEX IF NOT EXISTS idx_trans_vocab_collection 
ON public.translation_saved_vocabulary(collection_id);

-- 4. Translation Educational Practice Challenges & AI Evaluation
CREATE TABLE IF NOT EXISTS public.translation_practice_attempts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  direction TEXT NOT NULL CHECK (direction IN ('ar-to-en', 'en-to-ar')),
  difficulty_level TEXT NOT NULL,
  prompt_sentence TEXT NOT NULL,
  user_translation TEXT NOT NULL,
  suggested_translation TEXT NOT NULL,
  overall_score INTEGER NOT NULL CHECK (overall_score BETWEEN 0 AND 100),
  meaning_score INTEGER NOT NULL CHECK (meaning_score BETWEEN 0 AND 100),
  grammar_score INTEGER NOT NULL CHECK (grammar_score BETWEEN 0 AND 100),
  vocabulary_score INTEGER NOT NULL CHECK (vocabulary_score BETWEEN 0 AND 100),
  naturalness_score INTEGER NOT NULL CHECK (naturalness_score BETWEEN 0 AND 100),
  feedback_ar TEXT NOT NULL,
  mistakes_json JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_trans_practice_user 
ON public.translation_practice_attempts(user_id, created_at DESC);

-- 5. User Translation Preferences
CREATE TABLE IF NOT EXISTS public.translation_user_preferences (
  user_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  default_source_lang TEXT DEFAULT 'auto',
  default_target_lang TEXT DEFAULT 'ar',
  default_mode TEXT DEFAULT 'natural',
  auto_speak BOOLEAN DEFAULT FALSE,
  show_alternatives BOOLEAN DEFAULT TRUE,
  show_word_analysis BOOLEAN DEFAULT TRUE,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. RLS (Row Level Security) Configuration
ALTER TABLE public.translations_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.translation_collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.translation_saved_vocabulary ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.translation_practice_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.translation_user_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own translation history" 
ON public.translations_history FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own translation collections" 
ON public.translation_collections FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own saved vocabulary" 
ON public.translation_saved_vocabulary FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own practice attempts" 
ON public.translation_practice_attempts FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own translation preferences" 
ON public.translation_user_preferences FOR ALL USING (auth.uid() = user_id);
