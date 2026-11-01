-- ==============================================================================
-- HENGLISH ACADEMY - MULTI-PROVIDER AI SYSTEM SCHEMA & ANALYTICS
-- Migration: 20261101_multi_provider_ai_architecture.sql
-- ==============================================================================

-- 1. AI USAGE ANALYTICS LEDGER
CREATE TABLE IF NOT EXISTS public.ai_usage_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider TEXT NOT NULL CHECK (provider IN ('groq', 'gemini', 'cloudflare', 'openai', 'local')),
  model TEXT NOT NULL,
  task_type TEXT NOT NULL,
  duration_ms INTEGER NOT NULL,
  prompt_tokens INTEGER NOT NULL DEFAULT 0,
  completion_tokens INTEGER NOT NULL DEFAULT 0,
  total_tokens INTEGER NOT NULL DEFAULT 0,
  estimated_cost_usd NUMERIC(10, 6) NOT NULL DEFAULT 0.000000,
  status TEXT NOT NULL CHECK (status IN ('success', 'fallback_recovered', 'failed')),
  fallback_chain TEXT[] DEFAULT '{}',
  error_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ai_usage_provider ON public.ai_usage_analytics(provider);
CREATE INDEX IF NOT EXISTS idx_ai_usage_task ON public.ai_usage_analytics(task_type);
CREATE INDEX IF NOT EXISTS idx_ai_usage_created ON public.ai_usage_analytics(created_at DESC);

-- 2. AI ROUTER PERSISTENT CONFIGURATION
CREATE TABLE IF NOT EXISTS public.ai_router_settings (
  id TEXT PRIMARY KEY DEFAULT 'global_router_config',
  provider_priority TEXT[] NOT NULL DEFAULT ARRAY['groq', 'gemini', 'cloudflare', 'openai', 'local'],
  enabled_providers JSONB NOT NULL DEFAULT '{"groq": true, "gemini": true, "cloudflare": true, "openai": true, "local": true}'::jsonb,
  default_timeout_ms INTEGER NOT NULL DEFAULT 25000,
  cooldown_period_ms INTEGER NOT NULL DEFAULT 45000,
  cache_enabled BOOLEAN NOT NULL DEFAULT TRUE,
  cache_ttl_ms INTEGER NOT NULL DEFAULT 900000,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Seed Initial Global Settings
INSERT INTO public.ai_router_settings (id, provider_priority, enabled_providers, default_timeout_ms, cooldown_period_ms)
VALUES (
  'global_router_config',
  ARRAY['groq', 'gemini', 'cloudflare', 'openai', 'local'],
  '{"groq": true, "gemini": true, "cloudflare": true, "openai": true, "local": true}'::jsonb,
  25000,
  45000
)
ON CONFLICT (id) DO NOTHING;

-- 3. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.ai_usage_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_router_settings ENABLE ROW LEVEL SECURITY;

-- Analytics: Admins or Service Role can read
CREATE POLICY "Admins can view AI usage analytics"
  ON public.ai_usage_analytics FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() AND (profiles.role = 'admin' OR profiles.role = 'teacher')
    )
  );

-- Router Settings: Admins can view and update
CREATE POLICY "Admins can view router settings"
  ON public.ai_router_settings FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() AND (profiles.role = 'admin' OR profiles.role = 'teacher')
    )
  );

CREATE POLICY "Admins can update router settings"
  ON public.ai_router_settings FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() AND (profiles.role = 'admin')
    )
  );
