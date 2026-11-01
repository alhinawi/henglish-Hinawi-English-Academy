-- ==============================================================================
-- Henglish Academy (HENGLISH) - VOCABULARY DATABASE FULL-TEXT SEARCH & PERFORMANCE
-- File: supabase/migrations/20261101_dictionary_fulltext_search.sql
-- ==============================================================================

-- Enable pg_trgm for fuzzy search and prefix matching if available
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Add tsvector generated columns for fast full-text search
ALTER TABLE public.dictionary_lexical_entries
ADD COLUMN IF NOT EXISTS tsv_search tsvector 
GENERATED ALWAYS AS (
  setweight(to_tsvector('english', coalesce(headword, '')), 'A') ||
  setweight(to_tsvector('english', coalesce(domain_category, '')), 'C') ||
  setweight(to_tsvector('english', coalesce(primary_part_of_speech, '')), 'D')
) STORED;

CREATE INDEX IF NOT EXISTS idx_dict_entries_tsv 
ON public.dictionary_lexical_entries USING GIN(tsv_search);

-- Trigram index on headword for fast autocomplete and typo tolerance
CREATE INDEX IF NOT EXISTS idx_dict_headword_trgm 
ON public.dictionary_lexical_entries USING GIN(headword gin_trgm_ops);

-- Trigram index on normalized_headword
CREATE INDEX IF NOT EXISTS idx_dict_norm_headword_trgm 
ON public.dictionary_lexical_entries USING GIN(normalized_headword gin_trgm_ops);

-- Senses English & Arabic full-text search indexes
ALTER TABLE public.dictionary_senses
ADD COLUMN IF NOT EXISTS tsv_senses tsvector
GENERATED ALWAYS AS (
  setweight(to_tsvector('english', coalesce(english_definition, '')), 'A') ||
  setweight(to_tsvector('simple', coalesce(standard_arabic_meaning, '')), 'B') ||
  setweight(to_tsvector('simple', coalesce(egyptian_arabic_meaning, '')), 'B')
) STORED;

CREATE INDEX IF NOT EXISTS idx_dict_senses_tsv 
ON public.dictionary_senses USING GIN(tsv_senses);

-- Trigram indexes on Arabic meanings for fast Arabic search
CREATE INDEX IF NOT EXISTS idx_dict_senses_std_ar_trgm 
ON public.dictionary_senses USING GIN(standard_arabic_meaning gin_trgm_ops);

CREATE INDEX IF NOT EXISTS idx_dict_senses_eg_ar_trgm 
ON public.dictionary_senses USING GIN(egyptian_arabic_meaning gin_trgm_ops);

-- Fast combined search RPC function
CREATE OR REPLACE FUNCTION search_dictionary_entries(
  search_query TEXT DEFAULT '',
  filter_cefr TEXT DEFAULT 'all',
  filter_pos TEXT DEFAULT 'all',
  filter_domain TEXT DEFAULT 'all',
  filter_has_audio BOOLEAN DEFAULT FALSE,
  page_limit INT DEFAULT 30,
  page_offset INT DEFAULT 0
)
RETURNS TABLE (
  id UUID,
  headword TEXT,
  primary_part_of_speech TEXT,
  cefr_level TEXT,
  ipa_us TEXT,
  ipa_uk TEXT,
  audio_us_url TEXT,
  audio_uk_url TEXT,
  frequency_tier TEXT,
  domain_category TEXT,
  formality TEXT,
  inflections_json JSONB,
  primary_definition_en TEXT,
  primary_meaning_ar TEXT,
  example_en TEXT,
  example_ar TEXT,
  total_count BIGINT
) LANGUAGE plpgsql STABLE AS $$
DECLARE
  clean_q TEXT := lower(trim(search_query));
BEGIN
  RETURN QUERY
  WITH filtered AS (
    SELECT 
      e.id,
      e.headword,
      e.primary_part_of_speech,
      e.cefr_level,
      e.ipa_us,
      e.ipa_uk,
      e.audio_us_url,
      e.audio_uk_url,
      e.frequency_tier,
      e.domain_category,
      e.formality,
      e.inflections_json,
      s.english_definition AS primary_definition_en,
      s.standard_arabic_meaning AS primary_meaning_ar,
      s.example_en,
      s.example_ar,
      COUNT(*) OVER() AS total_count
    FROM public.dictionary_lexical_entries e
    LEFT JOIN LATERAL (
      SELECT english_definition, standard_arabic_meaning, example_en, example_ar
      FROM public.dictionary_senses
      WHERE entry_id = e.id
      ORDER BY sense_number ASC
      LIMIT 1
    ) s ON true
    WHERE 
      (clean_q = '' OR 
       e.normalized_headword ILIKE clean_q || '%' OR
       e.normalized_headword ILIKE '%' || clean_q || '%' OR
       s.standard_arabic_meaning ILIKE '%' || clean_q || '%' OR
       s.egyptian_arabic_meaning ILIKE '%' || clean_q || '%')
      AND (filter_cefr = 'all' OR e.cefr_level = filter_cefr)
      AND (filter_pos = 'all' OR lower(e.primary_part_of_speech) = lower(filter_pos))
      AND (filter_domain = 'all' OR lower(e.domain_category) = lower(filter_domain))
      AND (NOT filter_has_audio OR (e.audio_us_url IS NOT NULL OR e.audio_uk_url IS NOT NULL))
  )
  SELECT * FROM filtered
  ORDER BY 
    CASE WHEN clean_q <> '' AND normalized_headword = clean_q THEN 0
         WHEN clean_q <> '' AND normalized_headword LIKE clean_q || '%' THEN 1
         ELSE 2 END,
    headword ASC
  LIMIT page_limit
  OFFSET page_offset;
END;
$$;

