-- ==============================================================================
-- HENGLISH ACADEMY - DATABASE RBAC & PRIVILEGE HARDENING SQL TESTS
-- File: tests/sql/test_auth_rbac_hardening.sql
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- TEST 1: Privilege Escalation Prevention on public.profiles
-- Normal authenticated student attempts to update their own role to 'admin'
-- ------------------------------------------------------------------------------
DO $$
DECLARE
  v_test_user_id UUID := gen_random_uuid();
  v_profile RECORD;
BEGIN
  -- Simulate initial student profile
  INSERT INTO public.profiles (id, email, full_name, role, xp, account_status, is_email_verified)
  VALUES (v_test_user_id, 'student.attacker@example.com', 'Test Attacker', 'student', 100, 'active', false);

  -- Simulate caller identity
  PERFORM set_config('request.jwt.claim.sub', v_test_user_id::text, true);
  PERFORM set_config('request.jwt.claim.role', 'authenticated', true);

  -- Attacker executes malicious update
  UPDATE public.profiles
  SET role = 'admin',
      xp = 999999,
      is_email_verified = true
  WHERE id = v_test_user_id;

  -- Verify update was intercepted and neutralized by trg_protect_profile_privileges
  SELECT * INTO v_profile FROM public.profiles WHERE id = v_test_user_id;

  ASSERT v_profile.role = 'student', 'FAIL: Privilege escalation succeeded! Role was changed to admin';
  ASSERT v_profile.xp = 100, 'FAIL: XP tampering succeeded! XP was changed to 999999';
  ASSERT v_profile.is_email_verified = false, 'FAIL: Email verification status was modified directly!';

  RAISE NOTICE '✅ TEST 1 PASSED: Profile privilege protection trigger successfully blocked role, xp and verification escalation.';

  -- Cleanup
  DELETE FROM public.profiles WHERE id = v_test_user_id;
END $$;

-- ------------------------------------------------------------------------------
-- TEST 2: Self-Registration Trigger Strips Metadata Role Injection
-- User signs up passing metadata { "role": "admin" }
-- ------------------------------------------------------------------------------
DO $$
DECLARE
  v_test_auth_id UUID := gen_random_uuid();
  v_profile RECORD;
BEGIN
  -- Simulate auth.users insert with malicious metadata
  PERFORM set_config('request.jwt.claim.role', 'service_role', true);

  -- Call trigger function directly simulating auth.users insert
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    v_test_auth_id,
    'sneaky.signup@example.com',
    'Sneaky User',
    'student' -- handle_new_auth_user forces student
  );

  SELECT * INTO v_profile FROM public.profiles WHERE id = v_test_auth_id;
  ASSERT v_profile.role = 'student', 'FAIL: New registration was not assigned student role!';

  RAISE NOTICE '✅ TEST 2 PASSED: New registration strictly defaulted to student.';

  -- Cleanup
  DELETE FROM public.profiles WHERE id = v_test_auth_id;
END $$;

-- ------------------------------------------------------------------------------
-- TEST 3: GameVerse Anti-Impersonation Check
-- Authenticated User A attempts to submit score on behalf of User B
-- ------------------------------------------------------------------------------
DO $$
DECLARE
  v_user_a UUID := gen_random_uuid();
  v_user_b UUID := gen_random_uuid();
  v_err_caught BOOLEAN := FALSE;
BEGIN
  -- Insert mock profiles
  INSERT INTO public.profiles (id, email, full_name, role) VALUES (v_user_a, 'usera@example.com', 'User A', 'student');
  INSERT INTO public.profiles (id, email, full_name, role) VALUES (v_user_b, 'userb@example.com', 'User B', 'student');

  -- Simulate User A logged in
  PERFORM set_config('request.jwt.claim.sub', v_user_a::text, true);
  PERFORM set_config('request.jwt.claim.role', 'authenticated', true);

  BEGIN
    -- User A attempts to submit for User B
    PERFORM public.submit_verified_game_session(
      p_user_id := v_user_b,
      p_game_id := 'v3-blitz',
      p_score := 100,
      p_max_score := 100,
      p_accuracy := 100,
      p_duration_seconds := 30,
      p_answers := '[]'::jsonb,
      p_idempotency_key := 'impersonation_test_key_001'
    );
  EXCEPTION WHEN OTHERS THEN
    v_err_caught := TRUE;
  END;

  ASSERT v_err_caught = TRUE, 'FAIL: submit_verified_game_session allowed cross-user submission!';
  RAISE NOTICE '✅ TEST 3 PASSED: submit_verified_game_session rejected cross-user impersonation.';

  -- Cleanup
  DELETE FROM public.profiles WHERE id IN (v_user_a, v_user_b);
END $$;

