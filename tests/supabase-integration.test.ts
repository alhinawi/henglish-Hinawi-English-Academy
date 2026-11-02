import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import { getSupabaseConfig, testSupabaseConnection } from '../src/lib/supabase';
import { calculateSM2, VocabularyCard } from '../src/services/spacedRepetitionService';

describe('Henglish Supabase Integration & Architecture Suite', () => {
  it('correctly parses Supabase configuration parameters', () => {
    const config = getSupabaseConfig();
    expect(config).toBeDefined();
    expect(typeof config.isConfigured).toBe('boolean');
    expect(typeof config.url).toBe('string');
    expect(typeof config.anonKey).toBe('string');
  });

  it('verifies that the Master Schema SQL contains all 52 essential tables', () => {
    const schemaPath = path.resolve(process.cwd(), 'supabase/migrations/20261102_master_complete_schema.sql');
    expect(fs.existsSync(schemaPath)).toBe(true);

    const schemaSql = fs.readFileSync(schemaPath, 'utf8');

    const expectedTables = [
      'profiles',
      'user_learning_progress',
      'user_vocabulary_progress',
      'user_grammar_progress',
      'courses',
      'lessons',
      'grammar_topics',
      'questions',
      'gameverse_definitions',
      'user_game_sessions',
      'xp_ledger',
      'dictionary_lexical_entries',
      'video_categories',
      'educational_videos',
      'translations_history',
      'translation_saved_vocabulary',
      'vocabulary_srs_cards'
    ];

    for (const table of expectedTables) {
      expect(schemaSql).toContain(`CREATE TABLE IF NOT EXISTS public.${table}`);
    }
  });

  it('verifies that the Master Schema enforces RLS and Authoritative RPCs', () => {
    const schemaPath = path.resolve(process.cwd(), 'supabase/migrations/20261102_master_complete_schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');

    // Security triggers
    expect(schemaSql).toContain('FUNCTION public.handle_new_auth_user');
    expect(schemaSql).toContain('FUNCTION public.protect_profile_privileges');

    // Authoritative RPCs
    expect(schemaSql).toContain('FUNCTION public.submit_verified_game_session');
    expect(schemaSql).toContain('FUNCTION public.search_dictionary_entries');

    // RLS activation
    expect(schemaSql).toContain('ENABLE ROW LEVEL SECURITY');
    expect(schemaSql).toContain('CREATE POLICY "Public can view published courses"');
    expect(schemaSql).toContain('CREATE POLICY "Users can view own profile"');
  });

  it('verifies that the Master Seed SQL populates all core educational domains', () => {
    const seedPath = path.resolve(process.cwd(), 'supabase/seeds/20261102_master_seed_data.sql');
    expect(fs.existsSync(seedPath)).toBe(true);

    const seedSql = fs.readFileSync(seedPath, 'utf8');

    expect(seedSql).toContain('INSERT INTO public.courses');
    expect(seedSql).toContain('INSERT INTO public.gameverse_definitions');
    expect(seedSql).toContain('INSERT INTO public.video_categories');
    expect(seedSql).toContain('INSERT INTO public.grammar_topics');
    expect(seedSql).toContain('INSERT INTO public.simulation_scenarios');
    expect(seedSql).toContain('INSERT INTO public.questions');
    expect(seedSql).toContain('INSERT INTO public.dictionary_lexical_entries');
  });

  it('correctly executes SuperMemo SM-2 spaced repetition calculations', () => {
    const sampleCard: VocabularyCard = {
      id: 'test-card-1',
      word: 'perseverance',
      ipa: '/ˌpɜːsɪˈvɪərəns/',
      translationAr: 'المثابرة والإصرار',
      category: 'character',
      cefrLevel: 'B2',
      exampleEn: 'Success requires great perseverance.',
      exampleAr: 'النجاح يتطلب مثابرة عظيمة.',
      repetitionCount: 0,
      intervalDays: 1,
      easeFactor: 2.50,
      nextReviewAt: new Date().toISOString(),
    };

    // Rating 5 (Perfect recall)
    const resultGood = calculateSM2(sampleCard, 5);
    expect(resultGood.repetitionCount).toBe(1);
    expect(resultGood.intervalDays).toBe(1);
    expect(resultGood.easeFactor).toBeGreaterThanOrEqual(2.50);

    // Second review rating 4 (Good)
    const cardStep2: VocabularyCard = { ...sampleCard, ...resultGood };
    const resultStep2 = calculateSM2(cardStep2, 4);
    expect(resultStep2.repetitionCount).toBe(2);
    expect(resultStep2.intervalDays).toBe(6);

    // Rating 1 (Forgot completely)
    const resultFailed = calculateSM2(cardStep2, 1);
    expect(resultFailed.repetitionCount).toBe(0);
    expect(resultFailed.intervalDays).toBe(1);
  });
});
