-- ==============================================================================
-- HENGLISH ACADEMY - GAMEVERSE & SECURE BACKEND ARCHITECTURE
-- Migration: 20261101_gameverse_and_backend_architecture.sql
-- ==============================================================================

-- 1. GAME DEFINITIONS CATALOG
CREATE TABLE IF NOT EXISTS public.gameverse_definitions (
  id TEXT PRIMARY KEY,
  title_en TEXT NOT NULL,
  title_ar TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN (
    'vocabulary', 'grammar', 'listening', 'speaking', 
    'reading', 'writing', 'adventure', 'competitive'
  )),
  cefr_min TEXT NOT NULL DEFAULT 'A1',
  cefr_max TEXT NOT NULL DEFAULT 'C2',
  description_ar TEXT NOT NULL,
  icon TEXT NOT NULL,
  duration_seconds INTEGER NOT NULL DEFAULT 45,
  base_xp INTEGER NOT NULL DEFAULT 35,
  mechanics TEXT NOT NULL,
  supports_multiplayer BOOLEAN NOT NULL DEFAULT FALSE,
  supports_ai_duel BOOLEAN NOT NULL DEFAULT TRUE,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. USER GAME SESSIONS (Authoritative & Verified Records)
CREATE TABLE IF NOT EXISTS public.user_game_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  game_id TEXT NOT NULL,
  score INTEGER NOT NULL DEFAULT 0,
  max_score INTEGER NOT NULL DEFAULT 0,
  accuracy NUMERIC(5,2) NOT NULL DEFAULT 0.00,
  duration_seconds INTEGER NOT NULL DEFAULT 0,
  xp_awarded INTEGER NOT NULL DEFAULT 0,
  answers_summary JSONB DEFAULT '[]'::jsonb,
  idempotency_key TEXT UNIQUE NOT NULL,
  is_verified BOOLEAN NOT NULL DEFAULT TRUE,
  verification_flags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_game_sessions_user ON public.user_game_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_game_sessions_game ON public.user_game_sessions(game_id);
CREATE INDEX IF NOT EXISTS idx_user_game_sessions_idempotency ON public.user_game_sessions(idempotency_key);

-- 3. IMMUTABLE XP LEDGER (Anti-Cheat Transaction Ledger)
CREATE TABLE IF NOT EXISTS public.xp_ledger (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  amount INTEGER NOT NULL,
  source_type TEXT NOT NULL, -- 'gameverse', 'quiz', 'academy', 'daily_challenge'
  reference_id TEXT,
  idempotency_key TEXT UNIQUE NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_xp_ledger_user ON public.xp_ledger(user_id);
CREATE INDEX IF NOT EXISTS idx_xp_ledger_key ON public.xp_ledger(idempotency_key);

-- 4. MULTIPLAYER GAME ROOMS (Supabase Realtime)
CREATE TABLE IF NOT EXISTS public.game_rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_code VARCHAR(6) UNIQUE NOT NULL,
  host_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  game_id TEXT NOT NULL,
  category TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'waiting' CHECK (status IN ('waiting', 'in_progress', 'finished', 'cancelled')),
  max_players INTEGER NOT NULL DEFAULT 4,
  current_question_index INTEGER NOT NULL DEFAULT 0,
  questions JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '2 hours')
);

CREATE INDEX IF NOT EXISTS idx_game_rooms_code ON public.game_rooms(room_code);
CREATE INDEX IF NOT EXISTS idx_game_rooms_status ON public.game_rooms(status);

-- 5. MULTIPLAYER ROOM PLAYERS
CREATE TABLE IF NOT EXISTS public.game_room_players (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID REFERENCES public.game_rooms(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL,
  score INTEGER NOT NULL DEFAULT 0,
  streak INTEGER NOT NULL DEFAULT 0,
  is_ready BOOLEAN NOT NULL DEFAULT FALSE,
  last_answered_at TIMESTAMPTZ,
  joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT unique_room_player UNIQUE (room_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_room_players_room ON public.game_room_players(room_id);

-- 6. SEED CORE GAMEVERSE DEFINITIONS
INSERT INTO public.gameverse_definitions 
(id, title_en, title_ar, category, cefr_min, cefr_max, description_ar, icon, duration_seconds, base_xp, mechanics, supports_multiplayer, supports_ai_duel)
VALUES
-- Vocabulary
('vocab-rush', 'Vocabulary Rush', 'سباق المفردات السريع ⚡', 'vocabulary', 'A2', 'B2', 'اختر المعنى الصحيح للكلمة الإنجليزية بأسرع وقت ممكن قبل انتهاء الثواني المعدودة.', '⚡', 30, 35, 'speed_quiz', TRUE, TRUE),
('word-detective', 'Word Detective', 'المحقق اللغوي 🕵️', 'vocabulary', 'B1', 'C1', 'اكتشف الكلمة الإنجليزية السرية من خلال تحليل 3 تلميحات سياقية وتراكيب لغوية.', '🕵️', 45, 45, 'clue_reveal', TRUE, TRUE),
('spelling-bee', 'Spelling Bee', 'تحدي التهجئة والإملاء ✍️', 'vocabulary', 'A2', 'C1', 'استمع للنطق الصوتي الصحيح واكتب الحروف بدقة متناهية متجنباً الأفخاخ الصوتية.', '✍️', 40, 40, 'spelling_audio', TRUE, TRUE),
('synonym-hunter', 'Synonym & Antonym Arena', 'معركة المترادفات والأضداد 🏹', 'vocabulary', 'B1', 'C2', 'ميّز بين المترادفات الدقيقة والأضداد واصطد الكلمة الأكثر ملائمة للسياق.', '🏹', 45, 40, 'speed_quiz', TRUE, TRUE),
('idiom-explorer', 'Idiom & Phrasal Quest', 'مستكشف التعبيرات والأفعال المركبة 🧭', 'vocabulary', 'B2', 'C2', 'فك شفرات الأفعال المركبة والمصطلحات الإنجليزية الأكثر استخداماً في الحياة اليومية.', '🧭', 50, 50, 'speed_quiz', TRUE, TRUE),

-- Grammar
('sentence-builder', 'Sentence Builder', 'معمل تركيب الجمل 🧩', 'grammar', 'A1', 'B2', 'رتّب الكلمات المبعثرة بالترتيب النحوي والسياقي الصحيح لبناء جمل احترافية.', '🧩', 45, 40, 'sentence_tiles', TRUE, FALSE),
('error-hunter', 'Error Hunter', 'صائد الأخطاء القواعدية 🎯', 'grammar', 'B1', 'C2', 'افحص الجمل بدقة خبير لغوي لاكتشاف الأخطاء القواعدية الخفية أو تأكيد صحتها.', '🎯', 45, 45, 'error_spotting', TRUE, TRUE),
('v3-blitz', 'V3 Irregular Verbs Blitz', 'سباق التصريف الثالث السريع ⚡', 'grammar', 'A1', 'B2', 'اختر التصريف الثالث (V3) الصحيح للأفعال الشاذة بأقصى سرعة ممكنة.', '⚡', 25, 30, 'speed_quiz', TRUE, TRUE),
('grammar-tower', 'Grammar Tower', 'برج القواعد والأزمنة 🏰', 'grammar', 'B1', 'C2', 'ابنِ طوابق البرج بإتقان الأزمنة وحالات If الشرطية والمبني للمجهول دون خطأ.', '🏰', 60, 50, 'tower_stack', TRUE, TRUE),
('preposition-master', 'Preposition Master', 'سيد حروف الجر الإنجليزية ⚓', 'grammar', 'A2', 'C1', 'اختر حرف الجر الصحيح وفق التراكيب الاصطلاحية المعتمدة (at, on, in, by, for).', '⚓', 40, 35, 'speed_quiz', TRUE, TRUE),

-- Listening
('listening-detective', 'Listening Detective', 'محقق الاستماع الصوتي 🎧', 'listening', 'A2', 'B2', 'استمع للمقطع الصوتي وحدد التفاصيل الدقيقة واللهجة المستخدمة (UK/US).', '🎧', 45, 45, 'listening_audio', TRUE, TRUE),
('accent-duel', 'US vs UK Accent Duel', 'تحدي اللهجة الأمريكية والبريطانية 🇬🇧🇺🇸', 'listening', 'B1', 'C2', 'فرّق بين النطق والمفردات في الإنجليزية الأمريكية والبريطانية باحتراف.', '🎙️', 40, 40, 'speed_quiz', TRUE, TRUE),

-- Speaking
('pronunciation-challenge', 'Pronunciation Challenge', 'تحدي النطق ومخارج الحروف 🗣️', 'speaking', 'A2', 'C1', 'تدرّب على النطق الصوتي الصحيح وتجاوز أزواج الكلمات المتشابهة (Minimal Pairs).', '🗣️', 60, 50, 'voice_input', FALSE, FALSE),

-- Reading
('reading-speedster', 'Reading Detective', 'محقق القراءة والاستيعاب 📖', 'reading', 'B1', 'C2', 'اقرأ النصوص القصيرة واستخلص الفكرة الرئيسية والمعاني الضمنية بسرعة.', '📖', 60, 50, 'speed_quiz', TRUE, TRUE),

-- Competitive
('ai-duel', 'AI Arena 1v1', 'مبارزة الذكاء الاصطناعي ⚔️', 'competitive', 'A1', 'C2', 'ادخل في مواجهة مباشرة وسريعة ضد روبوتات ذكية بمستويات صعوبة متنوعة.', '⚔️', 60, 60, 'duel_1v1', FALSE, TRUE),
('multiplayer-arena', 'Live Multiplayer Room', 'غرفة التحدي الجماعي المباشر 👥', 'competitive', 'A1', 'C2', 'أنشئ غرفة أو انضم برمز سداسي لتنافس زملاءك في معركة أسئلة بالوقت الحقيقي.', '👥', 90, 75, 'multiplayer_live', TRUE, FALSE)
ON CONFLICT (id) DO UPDATE SET
  title_en = EXCLUDED.title_en,
  title_ar = EXCLUDED.title_ar,
  category = EXCLUDED.category,
  cefr_min = EXCLUDED.cefr_min,
  cefr_max = EXCLUDED.cefr_max,
  description_ar = EXCLUDED.description_ar,
  icon = EXCLUDED.icon,
  duration_seconds = EXCLUDED.duration_seconds,
  base_xp = EXCLUDED.base_xp,
  mechanics = EXCLUDED.mechanics,
  supports_multiplayer = EXCLUDED.supports_multiplayer,
  supports_ai_duel = EXCLUDED.supports_ai_duel;

-- 7. SECURE SERVER-SIDE SUBMIT RPC FUNCTION (Anti-Cheat & Authoritative XP)
CREATE OR REPLACE FUNCTION public.submit_verified_game_session(
  p_user_id UUID,
  p_game_id TEXT,
  p_score INTEGER,
  p_max_score INTEGER,
  p_accuracy NUMERIC,
  p_duration_seconds INTEGER,
  p_answers JSONB,
  p_idempotency_key TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_existing_session RECORD;
  v_game RECORD;
  v_calculated_xp INTEGER := 0;
  v_speed_bonus INTEGER := 0;
  v_total_xp_awarded INTEGER := 0;
  v_flags TEXT[] := '{}';
  v_new_session_id UUID;
  v_current_user_xp INTEGER := 0;
BEGIN
  -- Check if idempotency key was already processed
  SELECT id, xp_awarded, score, accuracy, created_at 
  INTO v_existing_session
  FROM public.user_game_sessions
  WHERE idempotency_key = p_idempotency_key;

  IF FOUND THEN
    RETURN jsonb_build_object(
      'status', 'already_processed',
      'session_id', v_existing_session.id,
      'xp_awarded', v_existing_session.xp_awarded,
      'score', v_existing_session.score,
      'accuracy', v_existing_session.accuracy,
      'message', 'Session was previously recorded and verified.'
    );
  END IF;

  -- Validate Game
  SELECT * INTO v_game FROM public.gameverse_definitions WHERE id = p_game_id;
  IF NOT FOUND THEN
    v_flags := array_append(v_flags, 'unknown_game_id');
  END IF;

  -- Anti-Cheat: Validate minimum duration
  -- E.g. If answering 5+ questions in under 2 seconds, flag as suspicious
  IF p_duration_seconds < 3 AND p_score > 30 THEN
    v_flags := array_append(v_flags, 'impossible_speed');
  END IF;

  -- Anti-Cheat: Clamp accuracy
  IF p_accuracy > 100.00 THEN
    p_accuracy := 100.00;
    v_flags := array_append(v_flags, 'clamped_accuracy');
  END IF;

  -- Authoritative XP Calculation:
  -- Base XP scaled by accuracy
  IF array_length(v_flags, 1) IS NULL OR NOT ('impossible_speed' = ANY(v_flags)) THEN
    v_calculated_xp := ROUND(COALESCE(v_game.base_xp, 30) * (p_accuracy / 100.00));
    
    -- Speed Bonus (if completed with high accuracy in good time)
    IF p_accuracy >= 80.00 AND p_duration_seconds > 0 AND p_duration_seconds < COALESCE(v_game.duration_seconds, 45) THEN
      v_speed_bonus := LEAST(15, ROUND((COALESCE(v_game.duration_seconds, 45) - p_duration_seconds) * 0.5));
    END IF;

    v_total_xp_awarded := v_calculated_xp + v_speed_bonus;
  ELSE
    -- Flagged suspicious: award 0 XP
    v_total_xp_awarded := 0;
  END IF;

  -- Record Session
  INSERT INTO public.user_game_sessions (
    user_id,
    game_id,
    score,
    max_score,
    accuracy,
    duration_seconds,
    xp_awarded,
    answers_summary,
    idempotency_key,
    is_verified,
    verification_flags
  ) VALUES (
    p_user_id,
    p_game_id,
    p_score,
    p_max_score,
    p_accuracy,
    p_duration_seconds,
    p_answers,
    p_idempotency_key,
    (v_total_xp_awarded > 0),
    v_flags
  )
  RETURNING id INTO v_new_session_id;

  -- Record in XP Ledger if user is authenticated and XP > 0
  IF p_user_id IS NOT NULL AND v_total_xp_awarded > 0 THEN
    INSERT INTO public.xp_ledger (
      user_id,
      amount,
      source_type,
      reference_id,
      idempotency_key,
      metadata
    ) VALUES (
      p_user_id,
      v_total_xp_awarded,
      'gameverse',
      p_game_id,
      p_idempotency_key,
      jsonb_build_object(
        'session_id', v_new_session_id,
        'game_id', p_game_id,
        'accuracy', p_accuracy,
        'duration_seconds', p_duration_seconds,
        'speed_bonus', v_speed_bonus
      )
    );

    -- Update user profile total_xp if profiles table exists
    BEGIN
      UPDATE public.profiles
      SET xp = COALESCE(xp, 0) + v_total_xp_awarded
      WHERE id = p_user_id
      RETURNING xp INTO v_current_user_xp;
    EXCEPTION WHEN OTHERS THEN
      -- If profiles table has different column or structure, silently skip
      NULL;
    END;
  END IF;

  RETURN jsonb_build_object(
    'status', 'success',
    'session_id', v_new_session_id,
    'xp_awarded', v_total_xp_awarded,
    'base_xp', v_calculated_xp,
    'speed_bonus', v_speed_bonus,
    'accuracy', p_accuracy,
    'flags', v_flags,
    'current_total_xp', v_current_user_xp
  );
END;
$$;

-- 8. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.gameverse_definitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_game_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.xp_ledger ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_room_players ENABLE ROW LEVEL SECURITY;

-- Gameverse Definitions: Public Read
CREATE POLICY "Public can view active game definitions"
  ON public.gameverse_definitions FOR SELECT
  USING (is_active = TRUE);

-- User Game Sessions:
CREATE POLICY "Users can view own game sessions"
  ON public.user_game_sessions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own game sessions"
  ON public.user_game_sessions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- XP Ledger:
CREATE POLICY "Users can view own XP ledger entries"
  ON public.xp_ledger FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);
-- Note: No INSERT policy on xp_ledger for normal authenticated users! 
-- Inserts happen strictly through the security definer RPC or service role.

-- Game Rooms:
CREATE POLICY "Anyone authenticated can view open rooms"
  ON public.game_rooms FOR SELECT
  TO authenticated
  USING (status IN ('waiting', 'in_progress'));

CREATE POLICY "Host can insert room"
  ON public.game_rooms FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = host_user_id);

CREATE POLICY "Host can update room"
  ON public.game_rooms FOR UPDATE
  TO authenticated
  USING (auth.uid() = host_user_id);

-- Game Room Players:
CREATE POLICY "Players can view room participants"
  ON public.game_room_players FOR SELECT
  TO authenticated
  USING (TRUE);

CREATE POLICY "Players can join room"
  ON public.game_room_players FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Players can update own status"
  ON public.game_room_players FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

