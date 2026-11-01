-- ==============================================================================
-- Migration: 20261101_grammar_academy_future_perfect_integration.sql
-- Description: Refactor curriculum hierarchy to integrate Future Perfect into
--              Grammar Academy (Future Tenses section) rather than standalone academy.
-- ==============================================================================

-- 1. Ensure courses categorization reflects the Grammar Academy integration
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'courses') THEN
    -- Update existing course record if present
    UPDATE public.courses
    SET category = 'grammar',
        is_flagship = true
    WHERE slug = 'future-perfect';

    -- Insert or ensure Grammar Academy parent course exists
    INSERT INTO public.courses (slug, title_en, title_ar, description_ar, level, category, is_flagship, is_published)
    VALUES (
      'grammar-academy',
      'Grammar Academy',
      'أكاديمية قواعد اللغة الإنجليزية',
      'المنهج الأكاديمي الشامل لجميع أزمنة وقواعد اللغة الإنجليزية من A1 إلى C1.',
      'A1 - C1',
      'grammar',
      true,
      true
    )
    ON CONFLICT (slug) DO UPDATE
    SET description_ar = EXCLUDED.description_ar,
        category = 'grammar';
  END IF;
END $$;

-- 2. Add comment documenting curriculum hierarchy
COMMENT ON TABLE public.courses IS 'Courses catalog: Future Perfect is an integrated masterclass module within Grammar Academy -> Future Tenses.';
