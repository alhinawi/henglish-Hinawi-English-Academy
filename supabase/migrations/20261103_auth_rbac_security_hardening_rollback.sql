-- ==============================================================================
-- HENGLISH ACADEMY - ROLLBACK MIGRATION
-- Rollback for: 20261103_auth_rbac_security_hardening.sql
-- ==============================================================================

-- 1. Restore previous handle_new_auth_user()
CREATE OR REPLACE FUNCTION public.handle_new_auth_user()
RETURNS TRIGGER AS $$
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
    COALESCE(NEW.raw_user_meta_data->>'role', 'student'),
    COALESCE(NEW.raw_user_meta_data->>'current_level', 'A1'),
    COALESCE(NEW.raw_user_meta_data->>'target_level', 'B2'),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'),
    COALESCE(NEW.email_confirmed_at IS NOT NULL, FALSE)
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    is_email_verified = (NEW.email_confirmed_at IS NOT NULL),
    updated_at = NOW();

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Drop privilege protection triggers
DROP TRIGGER IF EXISTS trg_protect_profile_privileges ON public.profiles;
DROP FUNCTION IF EXISTS public.protect_profile_privileges();

DROP TRIGGER IF EXISTS trg_protect_learning_progress ON public.user_learning_progress;
DROP FUNCTION IF EXISTS public.protect_user_learning_progress_privileges();

-- 3. Restore certificate policies
DROP POLICY IF EXISTS "Admins manage certificates" ON public.certificates;
DROP POLICY IF EXISTS "Users view own certificates" ON public.certificates;
DROP POLICY IF EXISTS "Public verify valid certificates" ON public.certificates;

CREATE POLICY "Users can manage own certificates" 
  ON public.certificates FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Public can verify valid certificates" 
  ON public.certificates FOR SELECT 
  USING (status = 'valid');

