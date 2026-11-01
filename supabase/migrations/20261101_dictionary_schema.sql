-- ==============================================================================
-- Henglish Academy (HENGLISH) - COMPREHENSIVE ENGLISH VOCABULARY DATABASE
-- PostgreSQL / Supabase Migration
-- File: supabase/migrations/20261101_dictionary_schema.sql
-- ==============================================================================

-- 1. Lexical Headwords & Entries Table
CREATE TABLE IF NOT EXISTS public.dictionary_lexical_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  headword TEXT NOT NULL,
  normalized_headword TEXT NOT NULL, -- lowercased, stripped for fast search
  primary_part_of_speech TEXT NOT NULL,
  cefr_level TEXT CHECK (cefr_level IN ('A1', 'A2', 'B1', 'B2', 'C1', 'C2', 'Unclassified')) DEFAULT 'Unclassified',
  ipa_us TEXT,
  ipa_uk TEXT,
  audio_us_url TEXT,
  audio_uk_url TEXT,
  frequency_tier TEXT DEFAULT 'medium', -- 'top500', 'top1000', 'top3000', 'top5000', 'academic', 'rare'
  formality TEXT DEFAULT 'Neutral', -- 'Formal', 'Neutral', 'Informal', 'Slang', 'Academic', 'Technical', 'Archaic'
  variety TEXT DEFAULT 'International', -- 'American', 'British', 'Australian', 'Canadian', 'International'
  domain_category TEXT DEFAULT 'general', -- 'general', 'business', 'tech', 'medical', 'academic', 'legal', 'finance', 'daily'
  etymology TEXT,
  inflections_json JSONB DEFAULT '{}'::jsonb, -- plural, irregular past, v3, -ing, comparative, superlative
  verification_status TEXT CHECK (verification_status IN ('verified', 'ai_enriched', 'pending_review')) DEFAULT 'verified',
  data_source TEXT DEFAULT 'Henglish Lexical Core',
  search_view_count INTEGER DEFAULT 0,
  save_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(normalized_headword, primary_part_of_speech)
);

CREATE INDEX IF NOT EXISTS idx_dict_normalized_headword 
ON public.dictionary_lexical_entries(normalized_headword);

CREATE INDEX IF NOT EXISTS idx_dict_cefr_level 
ON public.dictionary_lexical_entries(cefr_level);

CREATE INDEX IF NOT EXISTS idx_dict_domain_category 
ON public.dictionary_lexical_entries(domain_category);

CREATE INDEX IF NOT EXISTS idx_dict_frequency_tier 
ON public.dictionary_lexical_entries(frequency_tier);

-- 2. Word Senses / Multiple Meanings Table
CREATE TABLE IF NOT EXISTS public.dictionary_senses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  entry_id UUID REFERENCES public.dictionary_lexical_entries(id) ON DELETE CASCADE,
  sense_number INTEGER NOT NULL DEFAULT 1,
  part_of_speech TEXT NOT NULL,
  english_definition TEXT NOT NULL,
  egyptian_arabic_meaning TEXT NOT NULL,
  standard_arabic_meaning TEXT NOT NULL,
  cefr_level TEXT,
  register TEXT DEFAULT 'Neutral',
  domain TEXT DEFAULT 'general',
  example_en TEXT NOT NULL,
  example_ar TEXT NOT NULL,
  synonyms_json JSONB DEFAULT '[]'::jsonb,
  antonyms_json JSONB DEFAULT '[]'::jsonb,
  collocations_json JSONB DEFAULT '[]'::jsonb,
  common_mistake_note_ar TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_dict_senses_entry_id 
ON public.dictionary_senses(entry_id);

-- 3. Phrasal Verbs Table
CREATE TABLE IF NOT EXISTS public.dictionary_phrasal_verbs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  verb TEXT NOT NULL,
  particle TEXT NOT NULL,
  phrasal_verb TEXT UNIQUE NOT NULL, -- e.g. "look forward to", "turn down"
  is_separable BOOLEAN DEFAULT FALSE,
  is_transitive BOOLEAN DEFAULT TRUE,
  cefr_level TEXT DEFAULT 'B1',
  formality TEXT DEFAULT 'Neutral',
  senses_json JSONB NOT NULL, -- array of { definitionEn, meaningEg, meaningFusha, exampleEn, exampleAr }
  similar_verbs_json JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_dict_phrasal_verbs_verb 
ON public.dictionary_phrasal_verbs(verb);

-- 4. Idioms & Figurative Expressions Table
CREATE TABLE IF NOT EXISTS public.dictionary_idioms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  idiom TEXT UNIQUE NOT NULL,
  literal_meaning_ar TEXT,
  figurative_meaning_ar TEXT NOT NULL,
  english_definition TEXT NOT NULL,
  cefr_level TEXT DEFAULT 'B2',
  cultural_origin TEXT,
  example_en TEXT NOT NULL,
  example_ar TEXT NOT NULL,
  tags_json JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Collocations Table
CREATE TABLE IF NOT EXISTS public.dictionary_collocations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  headword TEXT NOT NULL,
  collocation TEXT NOT NULL,
  collocation_type TEXT NOT NULL, -- 'verb+noun', 'adj+noun', 'verb+adv', 'noun+noun', 'adv+adj'
  meaning_ar TEXT NOT NULL,
  example_en TEXT NOT NULL,
  example_ar TEXT NOT NULL,
  why_natural_ar TEXT,
  cefr_level TEXT DEFAULT 'B1',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(headword, collocation)
);

CREATE INDEX IF NOT EXISTS idx_dict_collocations_headword 
ON public.dictionary_collocations(headword);

-- 6. Word Family Networks Table
CREATE TABLE IF NOT EXISTS public.dictionary_word_families (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  root_word TEXT UNIQUE NOT NULL, -- e.g. "create"
  root_meaning_ar TEXT NOT NULL,
  nouns_json JSONB DEFAULT '[]'::jsonb, -- e.g. ["creation", "creator", "creativity"]
  verbs_json JSONB DEFAULT '[]'::jsonb, -- e.g. ["create", "recreate"]
  adjectives_json JSONB DEFAULT '[]'::jsonb, -- e.g. ["creative", "uncreative"]
  adverbs_json JSONB DEFAULT '[]'::jsonb, -- e.g. ["creatively"]
  expressions_json JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Confusable Word Pairs Table (e.g. Accept vs Except, Affect vs Effect)
CREATE TABLE IF NOT EXISTS public.dictionary_confusable_pairs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  word_a TEXT NOT NULL,
  word_b TEXT NOT NULL,
  difference_explanation_ar TEXT NOT NULL,
  word_a_example TEXT NOT NULL,
  word_b_example TEXT NOT NULL,
  memory_trick_ar TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(word_a, word_b)
);

-- 8. User Saved Dictionary Vocabulary & SM-2 Review State
CREATE TABLE IF NOT EXISTS public.dictionary_user_saved_words (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  word TEXT NOT NULL,
  entry_id UUID REFERENCES public.dictionary_lexical_entries(id) ON DELETE SET NULL,
  custom_notes TEXT,
  collection_name TEXT DEFAULT 'General Vocabulary',
  is_learned BOOLEAN DEFAULT FALSE,
  is_difficult BOOLEAN DEFAULT FALSE,
  repetition_count INTEGER DEFAULT 0,
  interval_days INTEGER DEFAULT 1,
  ease_factor NUMERIC(3, 2) DEFAULT 2.50,
  next_review_at TIMESTAMPTZ DEFAULT NOW(),
  last_reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, word)
);

CREATE INDEX IF NOT EXISTS idx_dict_user_saved_due 
ON public.dictionary_user_saved_words(user_id, next_review_at);

-- 9. Row Level Security Policies
ALTER TABLE public.dictionary_lexical_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dictionary_senses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dictionary_phrasal_verbs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dictionary_idioms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dictionary_collocations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dictionary_word_families ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dictionary_confusable_pairs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dictionary_user_saved_words ENABLE ROW LEVEL SECURITY;

-- Read policies: Open to public / authenticated users
CREATE POLICY "Public read dictionary entries" ON public.dictionary_lexical_entries FOR SELECT USING (true);
CREATE POLICY "Public read dictionary senses" ON public.dictionary_senses FOR SELECT USING (true);
CREATE POLICY "Public read phrasal verbs" ON public.dictionary_phrasal_verbs FOR SELECT USING (true);
CREATE POLICY "Public read idioms" ON public.dictionary_idioms FOR SELECT USING (true);
CREATE POLICY "Public read collocations" ON public.dictionary_collocations FOR SELECT USING (true);
CREATE POLICY "Public read word families" ON public.dictionary_word_families FOR SELECT USING (true);
CREATE POLICY "Public read confusable pairs" ON public.dictionary_confusable_pairs FOR SELECT USING (true);

-- User-specific policy for personal saved words
CREATE POLICY "Users can manage own saved dictionary words" 
ON public.dictionary_user_saved_words FOR ALL USING (auth.uid() = user_id);
