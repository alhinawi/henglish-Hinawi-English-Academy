import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

function loadEnv() {
  const envPath = path.resolve(process.cwd(), '.env');
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf8');
    for (const line of content.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eqIdx = trimmed.indexOf('=');
      if (eqIdx !== -1) {
        const key = trimmed.slice(0, eqIdx).trim();
        let val = trimmed.slice(eqIdx + 1).trim();
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
          val = val.slice(1, -1);
        }
        if (!process.env[key]) {
          process.env[key] = val;
        }
      }
    }
  }
}

loadEnv();

const url = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const key = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_PUBLISHABLE_KEY;

console.log('--- LIVE SUPABASE AUDIT ---');
console.log('Target URL:', url);
console.log('Anon/Publishable Key Configured:', !!key, key ? `length: ${key.length}` : 'missing');

if (!url || !key) {
  console.error('Missing Supabase credentials in .env');
  process.exit(1);
}

const supabase = createClient(url, key);

const candidateTables = [
  'profiles',
  'courses',
  'lessons',
  'grammar_topics',
  'questions',
  'lesson_progress',
  'quiz_attempts',
  'simulation_scenarios',
  'certificates',
  'user_notes',
  'user_bookmarks',
  'ai_conversations',
  'pronunciation_evaluations',
  'vocabulary_srs_cards',
  'ai_generated_questions',
  'video_resources',
  'multiplayer_game_rooms',
  'simulation_sessions',
  'user_learning_progress',
  'user_vocabulary_progress',
  'user_grammar_progress',
  'user_achievements',
  'user_learning_preferences',
  'teacher_student_assignments',
  'dictionary_lexical_entries',
  'dictionary_senses',
  'dictionary_phrasal_verbs',
  'dictionary_idioms',
  'dictionary_collocations',
  'dictionary_word_families',
  'dictionary_confusable_pairs',
  'dictionary_user_saved_words',
  'gameverse_definitions',
  'user_game_sessions',
  'xp_ledger',
  'game_rooms',
  'game_room_players',
  'ai_usage_analytics',
  'ai_router_settings',
  'translations_history',
  'translation_collections',
  'translation_saved_vocabulary',
  'translation_practice_attempts',
  'translation_user_preferences',
  'video_categories',
  'educational_videos',
  'video_subtitles',
  'video_vocabulary',
  'video_quizzes',
  'user_video_progress',
  'user_video_bookmarks',
  'video_verification_logs'
];

async function runAudit() {
  console.log(`Checking ${candidateTables.length} candidate tables in live Supabase...`);
  const existing: string[] = [];
  const missing: string[] = [];

  for (const table of candidateTables) {
    try {
      const { data, error, count } = await supabase.from(table).select('*', { count: 'exact', head: true });
      if (error) {
        if (error.code === '42P01') { // undefined_table
          missing.push(table);
        } else if (error.code === '42501' || error.message.includes('row-level security') || error.message.includes('permission denied')) {
          existing.push(`${table} (RLS restricted - table EXISTS)`);
        } else {
          missing.push(`${table} (code ${error.code}: ${error.message})`);
        }
      } else {
        existing.push(`${table} (count: ${count ?? 0})`);
      }
    } catch (e: any) {
      missing.push(`${table} (exception: ${e.message})`);
    }
  }

  console.log('\n=== AUDIT RESULTS ===');
  console.log(`Found (${existing.length}):`);
  existing.forEach(t => console.log('  [+] ' + t));

  console.log(`\nMissing / Not yet migrated (${missing.length}):`);
  missing.forEach(t => console.log('  [-] ' + t));
}

runAudit().catch(err => {
  console.error('Audit fatal error:', err);
});
