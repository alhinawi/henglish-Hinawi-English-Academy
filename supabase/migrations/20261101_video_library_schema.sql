-- ==============================================================================
-- Henglish Academy (HENGLISH) - UNLIMITED DYNAMIC VIDEO & MOVIE LIBRARY SCHEMA
-- PostgreSQL / Supabase Migration
-- File: supabase/migrations/20261101_video_library_schema.sql
-- ==============================================================================

-- 1. Video Categories Table (20 comprehensive categories)
CREATE TABLE IF NOT EXISTS public.video_categories (
  id TEXT PRIMARY KEY,
  name_en TEXT NOT NULL,
  name_ar TEXT NOT NULL,
  description_en TEXT,
  description_ar TEXT,
  icon TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed Categories
INSERT INTO public.video_categories (id, name_en, name_ar, icon, display_order)
VALUES
  ('movie_scenes', 'Movie Scenes', 'مشاهد سينمائية شهيرة', 'Film', 1),
  ('tv_series', 'TV Series', 'مسلسلات تلفزيونية', 'Tv', 2),
  ('sitcoms', 'Sitcoms', 'مسلسلات كوميدية ومواقف', 'Smile', 3),
  ('interviews', 'Interviews', 'مقابلات المشاهير والخبراء', 'Mic', 4),
  ('daily_conversations', 'Daily Conversations', 'حوارات ومحادثات يومية', 'MessageCircle', 5),
  ('street_interviews', 'Street Interviews', 'لقاءات الشارع الحقيقية', 'Users', 6),
  ('podcasts', 'Podcasts', 'بودكاست بالإنجليزية', 'Headphones', 7),
  ('ted_talks', 'TED Talks', 'أحاديث تيد الملهمة', 'Sparkles', 8),
  ('documentaries', 'Documentaries', 'أفلام وثائقية واستكشافية', 'Globe', 9),
  ('business_english', 'Business English', 'الإنجليزية المهنية وبيئة العمل', 'Briefcase', 10),
  ('travel_english', 'Travel English', 'إنجليزية السفر والمطارات', 'Plane', 11),
  ('academic_english', 'Academic English', 'الإنجليزية الأكاديمية والجامعية', 'GraduationCap', 12),
  ('job_interviews', 'Job Interviews', 'مقابلات التوظيف وأسئلة العمل', 'Award', 13),
  ('american_english', 'American English', 'الإنجليزية واللكنة الأمريكية 🇺🇸', 'Compass', 14),
  ('british_english', 'British English', 'الإنجليزية واللكنة البريطانية 🇬🇧', 'Compass', 15),
  ('pronunciation_practice', 'Pronunciation Practice', 'تدريبات النطق ومخارج الحروف', 'Volume2', 16),
  ('slang_and_expressions', 'Slang and Expressions', 'المصطلحات الشعبية والعامية', 'Flame', 17),
  ('english_for_beginners', 'English for Beginners', 'إنجليزية المبتدئين خطوة بخطوة', 'BookOpen', 18),
  ('advanced_english', 'Advanced English', 'المستوى المتقدم والطلاقة', 'Zap', 19),
  ('listening_comprehension', 'Listening Comprehension', 'اختبارات وفهم الاستماع', 'Ear', 20)
ON CONFLICT (id) DO NOTHING;

-- 2. Educational Videos Table
CREATE TABLE IF NOT EXISTS public.educational_videos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  youtube_id TEXT UNIQUE NOT NULL,
  canonical_url TEXT NOT NULL,
  title TEXT NOT NULL,
  channel_name TEXT NOT NULL,
  thumbnail_url TEXT,
  duration TEXT,
  duration_seconds INTEGER DEFAULT 0,
  start_time INTEGER DEFAULT 0,
  end_time INTEGER DEFAULT 0,
  category_id TEXT REFERENCES public.video_categories(id) ON DELETE SET NULL,
  genre TEXT DEFAULT 'Educational',
  cefr_level TEXT CHECK (cefr_level IN ('A1', 'A2', 'B1', 'B2', 'C1', 'C2', 'Unclassified')) DEFAULT 'B1',
  accent TEXT DEFAULT 'American', -- 'American', 'British', 'Australian', 'International', 'Unknown'
  dialogue_quote TEXT,
  actor_or_speaker TEXT,
  character_name TEXT,
  scene_description TEXT,
  verification_status TEXT CHECK (verification_status IN (
    'verified_playable',
    'embed_disabled',
    'unavailable',
    'private_or_deleted',
    'needs_review',
    'video_only'
  )) DEFAULT 'verified_playable',
  is_embeddable BOOLEAN DEFAULT TRUE,
  has_subtitles BOOLEAN DEFAULT FALSE,
  has_quizzes BOOLEAN DEFAULT FALSE,
  has_vocabulary BOOLEAN DEFAULT FALSE,
  content_source TEXT DEFAULT 'YouTube Curated',
  view_count INTEGER DEFAULT 0,
  saved_count INTEGER DEFAULT 0,
  last_verified_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_edu_videos_youtube_id ON public.educational_videos(youtube_id);
CREATE INDEX IF NOT EXISTS idx_edu_videos_category ON public.educational_videos(category_id);
CREATE INDEX IF NOT EXISTS idx_edu_videos_cefr ON public.educational_videos(cefr_level);
CREATE INDEX IF NOT EXISTS idx_edu_videos_status ON public.educational_videos(verification_status);

-- 3. Video Subtitles Table
CREATE TABLE IF NOT EXISTS public.video_subtitles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  video_id UUID REFERENCES public.educational_videos(id) ON DELETE CASCADE,
  start_seconds NUMERIC(6, 2) NOT NULL,
  end_seconds NUMERIC(6, 2) NOT NULL,
  english_text TEXT NOT NULL,
  arabic_egyptian_text TEXT NOT NULL,
  arabic_fusha_text TEXT,
  speaker TEXT,
  sequence_order INTEGER NOT NULL,
  keywords_json JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_video_subtitles_video_id ON public.video_subtitles(video_id);

-- 4. Video Vocabulary Table
CREATE TABLE IF NOT EXISTS public.video_vocabulary (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  video_id UUID REFERENCES public.educational_videos(id) ON DELETE CASCADE,
  term TEXT NOT NULL,
  term_type TEXT DEFAULT 'idiom', -- 'idiom', 'phrasal-verb', 'collocation', 'slang', 'cultural', 'academic'
  meaning_ar TEXT NOT NULL,
  meaning_en TEXT NOT NULL,
  egyptian_equivalent TEXT,
  example_in_scene TEXT,
  ipa TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_video_vocab_video_id ON public.video_vocabulary(video_id);

-- 5. Video Comprehension Quizzes Table
CREATE TABLE IF NOT EXISTS public.video_quizzes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  video_id UUID REFERENCES public.educational_videos(id) ON DELETE CASCADE,
  quiz_type TEXT DEFAULT 'comprehension', -- 'comprehension', 'missing-word', 'idiom'
  question_en TEXT NOT NULL,
  question_ar TEXT NOT NULL,
  options_json JSONB NOT NULL, -- array of strings
  correct_index INTEGER NOT NULL,
  explanation_ar TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_video_quizzes_video_id ON public.video_quizzes(video_id);

-- 6. User Video Bookmarks & Progress
CREATE TABLE IF NOT EXISTS public.user_video_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  video_id UUID REFERENCES public.educational_videos(id) ON DELETE CASCADE,
  last_watched_position_seconds INTEGER DEFAULT 0,
  is_completed BOOLEAN DEFAULT FALSE,
  quiz_score INTEGER,
  echo_recorded_count INTEGER DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, video_id)
);

CREATE TABLE IF NOT EXISTS public.user_video_bookmarks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  video_id UUID REFERENCES public.educational_videos(id) ON DELETE CASCADE,
  collection_name TEXT DEFAULT 'Favorites',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, video_id)
);

-- 7. Video Verification Logs
CREATE TABLE IF NOT EXISTS public.video_verification_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  youtube_id TEXT NOT NULL,
  checked_status TEXT NOT NULL,
  is_embeddable BOOLEAN NOT NULL,
  http_response_code INTEGER,
  response_details TEXT,
  checked_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_video_verification_ytid ON public.video_verification_logs(youtube_id);

-- 8. Row Level Security Policies
ALTER TABLE public.video_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.educational_videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.video_subtitles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.video_vocabulary ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.video_quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_video_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_video_bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.video_verification_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read video categories" ON public.video_categories FOR SELECT USING (true);
CREATE POLICY "Public read educational videos" ON public.educational_videos FOR SELECT USING (true);
CREATE POLICY "Public read video subtitles" ON public.video_subtitles FOR SELECT USING (true);
CREATE POLICY "Public read video vocabulary" ON public.video_vocabulary FOR SELECT USING (true);
CREATE POLICY "Public read video quizzes" ON public.video_quizzes FOR SELECT USING (true);

CREATE POLICY "Users can manage own video progress" ON public.user_video_progress FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own video bookmarks" ON public.user_video_bookmarks FOR ALL USING (auth.uid() = user_id);
