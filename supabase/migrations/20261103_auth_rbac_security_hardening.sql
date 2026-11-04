-- ==============================================================================
-- HENGLISH ACADEMY - PRODUCTION AUTHENTICATION, RBAC & PRIVILEGE HARDENING
-- Migration: 20261103_auth_rbac_security_hardening.sql
-- 
-- Objectives:
-- 1. Prevent client-controlled privilege escalation during self-registration:
--    Forces role = 'student' in handle_new_auth_user() regardless of user metadata.
-- 2. Prevent users from altering their own role, XP, email verification status,
--    or administrative fields in public.profiles via protect_profile_privileges().
-- 3. Prevent users from directly tampering with total_xp in public.user_learning_progress.
-- 4. Revoke direct INSERT/UPDATE policies on user_game_sessions and xp_ledger,
--    forcing all XP awards through the authoritative submit_verified_game_session() RPC.
-- 5. Hardens submit_verified_game_session() with strict caller identity enforcement
--    (auth.uid() verification, anti-impersonation, anti-cheat clamping).
-- 6. Enforces safe, fixed search_path = public, pg_temp on all SECURITY DEFINER functions.
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. HARDEN NEW USER REGISTRATION TRIGGER (PREVENT ROLE ESCALATION)
-- ------------------------------------------------------------------------------
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
    account_status,
    is_email_verified,
    email_verified_at,
    created_at,
    updated_at
  ) VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'full_name_ar', split_part(NEW.email, '@', 1)),
    'student', -- STRICT: All self-registrations start as student. Role promotions require verified admin action.
    COALESCE(NEW.raw_user_meta_data->>'current_level', 'A1'),
    COALESCE(NEW.raw_user_meta_data->>'target_level', 'B2'),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'),
    'active',
    COALESCE(NEW.email_confirmed_at IS NOT NULL, FALSE),
    NEW.email_confirmed_at,
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    is_email_verified = (NEW.email_confirmed_at IS NOT NULL),
    email_verified_at = COALESCE(NEW.email_confirmed_at, public.profiles.email_verified_at),
    updated_at = NOW();

  -- Initialize learning progress aggregate
  INSERT INTO public.user_learning_progress (
    user_id, 
    total_xp, 
    streak_days, 
    current_level, 
    target_level
  ) VALUES (
    NEW.id, 
    100, 
    1, 
    'A1', 
    'B2'
  )
  ON CONFLICT (user_id) DO NOTHING;

  -- Initialize learning preferences row
  INSERT INTO public.user_learning_preferences (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Rebind trigger on auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT OR UPDATE ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_auth_user();

-- ------------------------------------------------------------------------------
-- 2. PROFILE PRIVILEGE PROTECTION TRIGGER (PREVENT ROLE, XP & STATUS TAMPERING)
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.protect_profile_privileges()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_caller_role TEXT;
  v_jwt_role TEXT;
BEGIN
  -- If executed by service_role (backend admin server API), permit the change
  v_jwt_role := current_setting('request.jwt.claim.role', true);
  IF v_jwt_role = 'service_role' THEN
    RETURN NEW;
  END IF;

  -- Fetch caller role from profiles table
  SELECT role INTO v_caller_role
  FROM public.profiles
  WHERE id = auth.uid();

  -- Non-admin callers CANNOT alter privileged fields
  IF v_caller_role IS DISTINCT FROM 'admin' THEN
    -- Identity & Privileges immutability
    NEW.id := OLD.id;
    NEW.role := OLD.role;
    
    -- Gamification & Progress immutability (XP only modifiable via server RPC)
    NEW.xp := OLD.xp;
    NEW.xp_points := OLD.xp_points;
    
    -- Account status & Verification immutability (must go through official auth flow)
    NEW.account_status := OLD.account_status;
    NEW.is_email_verified := OLD.is_email_verified;
    NEW.email_verified_at := OLD.email_verified_at;
    NEW.email := OLD.email;
  END IF;

  NEW.updated_at := NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_protect_profile_privileges ON public.profiles;
CREATE TRIGGER trg_protect_profile_privileges
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.protect_profile_privileges();

-- ------------------------------------------------------------------------------
-- 3. USER LEARNING PROGRESS PRIVILEGE TRIGGER (PREVENT CLIENT TOTAL_XP TAMPERING)
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.protect_user_learning_progress_privileges()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_caller_role TEXT;
  v_jwt_role TEXT;
BEGIN
  -- If executed by service_role, permit change
  v_jwt_role := current_setting('request.jwt.claim.role', true);
  IF v_jwt_role = 'service_role' THEN
    RETURN NEW;
  END IF;

  -- Fetch caller role
  SELECT role INTO v_caller_role
  FROM public.profiles
  WHERE id = auth.uid();

  -- Non-admin users cannot manually inject total_xp
  IF v_caller_role IS DISTINCT FROM 'admin' THEN
    NEW.user_id := OLD.user_id;
    NEW.total_xp := OLD.total_xp; -- Preserved: XP changes require server RPC
  END IF;

  NEW.updated_at := NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_protect_learning_progress ON public.user_learning_progress;
CREATE TRIGGER trg_protect_learning_progress
  BEFORE UPDATE ON public.user_learning_progress
  FOR EACH ROW
  EXECUTE FUNCTION public.protect_user_learning_progress_privileges();

-- ------------------------------------------------------------------------------
-- 4. REVOKE DIRECT INSERT/UPDATE ON SESSIONS & XP LEDGER (ENFORCE RPC)
-- ------------------------------------------------------------------------------
-- Ensure RLS is active on user_game_sessions & xp_ledger
ALTER TABLE public.user_game_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.xp_ledger ENABLE ROW LEVEL SECURITY;

-- Revoke all direct client INSERT/UPDATE/DELETE policies on user_game_sessions
DROP POLICY IF EXISTS "Users can insert own game sessions" ON public.user_game_sessions;
DROP POLICY IF EXISTS "Users manage own user_game_sessions" ON public.user_game_sessions;
DROP POLICY IF EXISTS "Users can manage own game sessions" ON public.user_game_sessions;
DROP POLICY IF EXISTS "Users can view own game sessions" ON public.user_game_sessions;

CREATE POLICY "Users view own game sessions" 
  ON public.user_game_sessions FOR SELECT 
  USING (auth.uid() = user_id);

-- Revoke direct client INSERT/UPDATE/DELETE policies on xp_ledger
DROP POLICY IF EXISTS "Users manage own xp_ledger" ON public.xp_ledger;
DROP POLICY IF EXISTS "Users can view own xp ledger" ON public.xp_ledger;
DROP POLICY IF EXISTS "Users view own xp ledger" ON public.xp_ledger;

CREATE POLICY "Users view own xp ledger" 
  ON public.xp_ledger FOR SELECT 
  USING (auth.uid() = user_id);

-- ------------------------------------------------------------------------------
-- 5. HARDEN AUTHORITATIVE GAME SESSION SUBMISSION RPC
-- ------------------------------------------------------------------------------
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
  v_caller_jwt_role TEXT;
  v_effective_user_id UUID;
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
  -- 1. Identity & Authorization Verification
  v_auth_uid := auth.uid();
  v_caller_jwt_role := current_setting('request.jwt.claim.role', true);

  IF v_auth_uid IS NOT NULL THEN
    -- Authenticated caller: anti-impersonation check
    IF p_user_id IS NOT NULL AND p_user_id <> v_auth_uid THEN
      RAISE EXCEPTION 'Forbidden: Authenticated user cannot submit game sessions on behalf of another user ID.';
    END IF;
    v_effective_user_id := v_auth_uid;
  ELSIF v_caller_jwt_role = 'service_role' THEN
    -- Backend service role: permitted to submit for verified user
    v_effective_user_id := p_user_id;
  ELSE
    -- Unauthenticated guest submission: calculate feedback but award NO persistent XP
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

  -- 3. Game Definition Validation
  IF p_game_id IS NULL OR trim(p_game_id) = '' THEN
    RAISE EXCEPTION 'Invalid request: game_id is mandatory.';
  END IF;

  SELECT * INTO v_game 
  FROM public.gameverse_definitions 
  WHERE id = p_game_id AND is_active = TRUE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Game with ID "%" does not exist or is inactive.', p_game_id;
  END IF;

  -- 4. Anti-Cheat & Bounds Clamping
  v_clamped_accuracy := GREATEST(0.00, LEAST(100.00, COALESCE(p_accuracy, 0.00)));
  IF v_clamped_accuracy <> p_accuracy THEN
    v_flags := array_append(v_flags, 'clamped_accuracy');
  END IF;

  IF p_score < 0 OR p_max_score <= 0 OR p_score > (p_max_score * 2) THEN
    v_flags := array_append(v_flags, 'invalid_score_bounds');
  END IF;

  IF p_duration_seconds < 0 THEN
    p_duration_seconds := 0;
  END IF;

  -- Impossible speed detection (e.g., > 20 score in under 3 seconds)
  IF p_duration_seconds < 3 AND p_score > 20 THEN
    v_flags := array_append(v_flags, 'impossible_speed');
  END IF;

  -- 5. Authoritative Server-Side XP Calculation
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

  -- 6. Insert Verified Game Session Record
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

  -- 7. Persist to XP Ledger & Update User Aggregates (Atomic Transaction)
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
        xp_points = COALESCE(xp_points, 0) + v_total_xp_awarded,
        updated_at = NOW()
    WHERE id = v_effective_user_id
    RETURNING xp INTO v_current_user_xp;

    -- Update user learning progress aggregate
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

-- ------------------------------------------------------------------------------
-- 6. CERTIFICATES ACCESS RESTRICTION (PREVENT FORGERY & PRIVATE DATA LEAKS)
-- ------------------------------------------------------------------------------
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;

-- Drop insecure policies if present
DROP POLICY IF EXISTS "Public can verify valid certificates" ON public.certificates;
DROP POLICY IF EXISTS "Users can manage own certificates" ON public.certificates;
DROP POLICY IF EXISTS "Users can view own certificates" ON public.certificates;
DROP POLICY IF EXISTS "Users insert own certificates" ON public.certificates;

-- Policy 1: Authenticated users can view their own certificates
CREATE POLICY "Users view own certificates"
  ON public.certificates FOR SELECT
  USING (auth.uid() = user_id);

-- Policy 2: Public verification allows looking up verified valid certificates by certificate_code
CREATE POLICY "Public verify valid certificates"
  ON public.certificates FOR SELECT
  USING (status = 'valid');

-- Policy 3: Only service_role or admin can INSERT/UPDATE/DELETE certificates
CREATE POLICY "Admins manage certificates"
  ON public.certificates FOR ALL
  USING (
    current_setting('request.jwt.claim.role', true) = 'service_role' OR
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  )
  WITH CHECK (
    current_setting('request.jwt.claim.role', true) = 'service_role' OR
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

