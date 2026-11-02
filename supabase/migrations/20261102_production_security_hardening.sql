-- ==============================================================================
-- HENGLISH ACADEMY - PRODUCTION SECURITY HARDENING & ANTI-CHEAT REMEDIATION
-- Migration: 20261102_production_security_hardening.sql
-- 
-- Fixes:
-- 1. GameVerse Anti-Cheat RPC (submit_verified_game_session):
--    - Enforces auth.uid() identity verification (prevents impersonation)
--    - Validates active game IDs in public.gameverse_definitions
--    - Validates score, duration, accuracy bounds
--    - Authoritative server-side XP calculation
--    - Strict idempotency checking (prevents duplicate XP exploits)
--    - Full transactional consistency across ledger, sessions, and profiles
-- 2. Revokes direct user INSERT on public.user_game_sessions (forces RPC validation)
-- 3. Protects public.profiles against role elevation & XP tampering via trigger
-- 4. Prevents registration privilege escalation in handle_new_auth_user()
-- ==============================================================================

-- 1. HARDEN NEW USER REGISTRATION TRIGGER (PREVENT ROLE ESCALATION)
-- New users signing up via Supabase Auth must ALWAYS start with role 'student'.
-- Never trust raw_user_meta_data for 'admin' or 'teacher' privileges.
CREATE OR REPLACE FUNCTION public.handle_new_auth_user()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
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
    'student', -- ALWAYS student on self-registration; promotions require admin action
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
$$ LANGUAGE plpgsql;

-- 2. PROFILE PRIVILEGE PROTECTION TRIGGER (PREVENT DIRECT ROLE & XP TAMPERING)
-- Normal authenticated users updating their own profile CANNOT change role, xp, or email.
CREATE OR REPLACE FUNCTION public.protect_profile_privileges()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_caller_role TEXT;
BEGIN
  -- If executed by service_role, allow all updates (administrative/internal)
  IF current_setting('request.jwt.claim.role', true) = 'service_role' THEN
    RETURN NEW;
  END IF;

  -- Check if caller is an existing verified admin in profiles
  SELECT role INTO v_caller_role
  FROM public.profiles
  WHERE id = auth.uid();

  -- Non-admins cannot alter role, xp, or id
  IF v_caller_role IS DISTINCT FROM 'admin' THEN
    NEW.role := OLD.role;
    NEW.xp := OLD.xp;
    NEW.id := OLD.id;
    -- Email changes must go through Supabase auth.updateUser email flow
    NEW.email := OLD.email;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_protect_profile_privileges ON public.profiles;
CREATE TRIGGER trg_protect_profile_privileges
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.protect_profile_privileges();

-- 3. REMOVE DIRECT INSERT POLICY ON user_game_sessions
-- Sessions must ONLY be inserted by the authoritative submit_verified_game_session() RPC
DROP POLICY IF EXISTS "Users can insert own game sessions" ON public.user_game_sessions;

-- 4. AUTHORITATIVE & ANTI-CHEAT GAME SESSION SUBMISSION FUNCTION
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
  v_auth_uid UUID;
  v_effective_user_id UUID;
  v_caller_jwt_role TEXT;
  v_existing_session RECORD;
  v_game RECORD;
  v_calculated_xp INTEGER := 0;
  v_speed_bonus INTEGER := 0;
  v_total_xp_awarded INTEGER := 0;
  v_flags TEXT[] := '{}';
  v_new_session_id UUID;
  v_current_user_xp INTEGER := 0;
  v_clamped_accuracy NUMERIC;
BEGIN
  -- 1. Authentication & Identity Enforcement
  v_auth_uid := auth.uid();
  v_caller_jwt_role := current_setting('request.jwt.claim.role', true);

  IF v_auth_uid IS NOT NULL THEN
    -- If caller is authenticated, enforce identity: cannot submit for another user
    IF p_user_id IS NOT NULL AND p_user_id <> v_auth_uid THEN
      RAISE EXCEPTION 'Forbidden: Authenticated users cannot submit game sessions for another user ID.';
    END IF;
    v_effective_user_id := v_auth_uid;
  ELSIF v_caller_jwt_role = 'service_role' THEN
    -- Backend API calling with service_role key on behalf of a verified user
    v_effective_user_id := p_user_id;
  ELSE
    -- Unauthenticated guest submission (no persistent user profile to update)
    v_effective_user_id := NULL;
  END IF;

  -- 2. Idempotency Check (Prevent duplicate XP exploitation)
  IF p_idempotency_key IS NULL OR trim(p_idempotency_key) = '' THEN
    RAISE EXCEPTION 'Invalid request: idempotency_key is mandatory.';
  END IF;

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

  -- 3. Game ID Validation
  IF p_game_id IS NULL OR trim(p_game_id) = '' THEN
    RAISE EXCEPTION 'Invalid request: game_id is mandatory.';
  END IF;

  SELECT * INTO v_game 
  FROM public.gameverse_definitions 
  WHERE id = p_game_id AND is_active = TRUE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Game with ID "%" does not exist or is inactive.', p_game_id;
  END IF;

  -- 4. Anti-Cheat & Input Sanitization
  v_clamped_accuracy := GREATEST(0.00, LEAST(100.00, COALESCE(p_accuracy, 0.00)));
  IF v_clamped_accuracy <> p_accuracy THEN
    v_flags := array_append(v_flags, 'clamped_accuracy');
  END IF;

  -- Validate score bounds
  IF p_score < 0 OR p_max_score <= 0 OR p_score > (p_max_score * 2) THEN
    v_flags := array_append(v_flags, 'invalid_score_bounds');
  END IF;

  -- Validate duration bounds
  IF p_duration_seconds < 0 THEN
    p_duration_seconds := 0;
  END IF;

  -- Flag: Impossible speed (less than 3 seconds for substantive score)
  IF p_duration_seconds < 3 AND p_score > 20 THEN
    v_flags := array_append(v_flags, 'impossible_speed');
  END IF;

  -- 5. Authoritative Server-Side XP Calculation
  -- Disqualify from XP awards if critical anti-cheat flags are triggered
  IF NOT ('impossible_speed' = ANY(v_flags)) AND NOT ('invalid_score_bounds' = ANY(v_flags)) THEN
    v_calculated_xp := ROUND(COALESCE(v_game.base_xp, 30) * (v_clamped_accuracy / 100.00));
    
    -- Speed Bonus (accurate completion within threshold)
    IF v_clamped_accuracy >= 80.00 
       AND p_duration_seconds >= 3 
       AND p_duration_seconds < COALESCE(v_game.duration_seconds, 45) THEN
      v_speed_bonus := LEAST(15, ROUND((COALESCE(v_game.duration_seconds, 45) - p_duration_seconds) * 0.4));
    END IF;

    v_total_xp_awarded := v_calculated_xp + v_speed_bonus;
  ELSE
    v_total_xp_awarded := 0;
  END IF;

  -- 6. Record Verified Game Session
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
    v_effective_user_id,
    p_game_id,
    p_score,
    p_max_score,
    v_clamped_accuracy,
    p_duration_seconds,
    COALESCE(p_answers, '[]'::jsonb),
    p_idempotency_key,
    (v_total_xp_awarded > 0),
    v_flags
  )
  RETURNING id INTO v_new_session_id;

  -- 7. Record in XP Ledger & Profile Update (Atomic Transaction)
  IF v_effective_user_id IS NOT NULL AND v_total_xp_awarded > 0 THEN
    INSERT INTO public.xp_ledger (
      user_id,
      amount,
      source_type,
      reference_id,
      idempotency_key,
      metadata
    ) VALUES (
      v_effective_user_id,
      v_total_xp_awarded,
      'gameverse',
      p_game_id,
      p_idempotency_key,
      jsonb_build_object(
        'session_id', v_new_session_id,
        'game_id', p_game_id,
        'accuracy', v_clamped_accuracy,
        'duration_seconds', p_duration_seconds,
        'speed_bonus', v_speed_bonus
      )
    );

    -- Update profile XP directly within the transaction
    UPDATE public.profiles
    SET xp = COALESCE(xp, 0) + v_total_xp_awarded,
        updated_at = NOW()
    WHERE id = v_effective_user_id
    RETURNING xp INTO v_current_user_xp;

    -- Update user learning progress aggregate if row exists
    UPDATE public.user_learning_progress
    SET total_xp = COALESCE(total_xp, 0) + v_total_xp_awarded,
        daily_goal_current = COALESCE(daily_goal_current, 0) + 1,
        updated_at = NOW()
    WHERE user_id = v_effective_user_id;
  END IF;

  RETURN jsonb_build_object(
    'status', 'success',
    'session_id', v_new_session_id,
    'xp_awarded', v_total_xp_awarded,
    'base_xp', v_calculated_xp,
    'speed_bonus', v_speed_bonus,
    'accuracy', v_clamped_accuracy,
    'flags', v_flags,
    'total_user_xp', v_current_user_xp,
    'message', CASE 
      WHEN array_length(v_flags, 1) > 0 THEN 'Session recorded with anti-cheat audit flags'
      ELSE 'Session authoritatively verified and XP awarded.'
    END
  );
END;
$$;
