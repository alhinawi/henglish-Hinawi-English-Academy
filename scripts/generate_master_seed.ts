import * as fs from 'fs';
import * as path from 'path';

// Load static catalogs
import { COURSES_CATALOG } from '../src/data/coursesData';
import { COMPLETE_GAMES_CATALOG, GameCategory } from '../src/data/gamesCatalogData';
import { VIDEO_20_CATEGORIES } from '../src/services/videoLibraryService';
import { REAL_LIFE_SCENARIOS } from '../src/data/realLifeSimulationsData';
import { MASSIVE_QUESTION_BANK } from '../src/data/massiveQuestionBank';
import { ALL_GRAMMAR_RULES } from '../src/data/allGrammarRules';

function escapeSql(str: string | null | undefined): string {
  if (str === null || str === undefined) return 'NULL';
  return `'${String(str).replace(/'/g, "''")}'`;
}

function escapeJson(obj: any): string {
  if (obj === null || obj === undefined) return "'{}'::jsonb";
  return `'${JSON.stringify(obj).replace(/'/g, "''")}'::jsonb`;
}

function mapGameCategory(cat: GameCategory): string {
  switch (cat) {
    case 'vocabulary':
      return 'vocabulary';
    case 'grammar':
      return 'grammar';
    case 'listening':
      return 'listening';
    case 'spelling':
      return 'vocabulary';
    case 'reading':
      return 'interactive';
    case 'competitive':
      return 'speed_trivia';
    default:
      return 'interactive';
  }
}

function mapDifficulty(level: string): string {
  if (level.includes('A1') || level.includes('A2')) return 'beginner';
  if (level.includes('B1') || level.includes('B2')) return 'intermediate';
  if (level.includes('C1') || level.includes('C2')) return 'advanced';
  return 'all_levels';
}

console.log('Generating master SQL seed file...');

const lines: string[] = [
  '--',
  '-- Henglish Academy (HENGLISH) - MASTER EDUCATIONAL SEED DATA',
  '-- Generated for Supabase Production Database',
  '-- File: supabase/seeds/20261102_master_seed_data.sql',
  '--',
  'BEGIN;',
  ''
];

// 1. Courses
lines.push('-- 1. COURSES SEED');
for (const c of COURSES_CATALOG) {
  lines.push(`INSERT INTO public.courses (id, title, title_ar, title_en, description, description_ar, level, category, lessons_count, duration, rating, students_count, is_flagship, tag, icon, thumbnail_url, is_published)
VALUES (${escapeSql(c.id)}, ${escapeSql(c.titleEn || c.title)}, ${escapeSql(c.title)}, ${escapeSql(c.titleEn)}, ${escapeSql(c.description)}, ${escapeSql(c.description)}, ${escapeSql(c.level)}, 'core', ${c.lessonsCount || 0}, ${escapeSql(c.duration)}, ${c.rating || 4.9}, ${c.studentsCount || 100}, ${c.isFlagship ? 'TRUE' : 'FALSE'}, ${escapeSql(c.tag)}, ${escapeSql(c.icon)}, ${escapeSql(c.imageUrl)}, TRUE)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  title_ar = EXCLUDED.title_ar,
  description = EXCLUDED.description,
  rating = EXCLUDED.rating,
  thumbnail_url = EXCLUDED.thumbnail_url;`);
}
lines.push('');

// 2. GameVerse Definitions
lines.push('-- 2. GAMEVERSE DEFINITIONS SEED');
for (const g of COMPLETE_GAMES_CATALOG) {
  const title = g.titleEn || g.id;
  const titleAr = g.titleAr || title;
  const desc = g.descriptionAr || `Interactive English learning game: ${title}`;
  const cat = mapGameCategory(g.category);
  const diff = mapDifficulty(g.cefrLevel || 'all_levels');

  lines.push(`INSERT INTO public.gameverse_definitions (id, title, title_ar, description, description_ar, category, difficulty, xp_reward, thumbnail_url, is_active, min_players, max_players)
VALUES (${escapeSql(g.id)}, ${escapeSql(title)}, ${escapeSql(titleAr)}, ${escapeSql(desc)}, ${escapeSql(desc)}, ${escapeSql(cat)}, ${escapeSql(diff)}, ${g.xpReward || 50}, NULL, TRUE, 1, 4)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  title_ar = EXCLUDED.title_ar,
  description = EXCLUDED.description,
  description_ar = EXCLUDED.description_ar,
  category = EXCLUDED.category,
  difficulty = EXCLUDED.difficulty,
  xp_reward = EXCLUDED.xp_reward,
  is_active = TRUE;`);
}
lines.push('');

// 3. Video Categories
lines.push('-- 3. VIDEO CATEGORIES SEED');
for (let i = 0; i < VIDEO_20_CATEGORIES.length; i++) {
  const vc = VIDEO_20_CATEGORIES[i];
  lines.push(`INSERT INTO public.video_categories (id, name_en, name_ar, description_ar, icon_name, order_index)
VALUES (${escapeSql(vc.id)}, ${escapeSql(vc.nameEn)}, ${escapeSql(vc.nameAr)}, ${escapeSql(vc.descriptionAr)}, ${escapeSql(vc.iconName)}, ${i})
ON CONFLICT (id) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  description_ar = EXCLUDED.description_ar;`);
}
lines.push('');

// 4. Grammar Topics
lines.push('-- 4. GRAMMAR TOPICS SEED');
for (const r of ALL_GRAMMAR_RULES.slice(0, 50)) {
  lines.push(`INSERT INTO public.grammar_topics (id, title, title_ar, category, explanation, explanation_ar, formula, examples, common_mistakes, level)
VALUES (${escapeSql(r.id)}, ${escapeSql(r.titleEn || r.title)}, ${escapeSql(r.title)}, ${escapeSql(r.category)}, ${escapeSql(r.explanationEn || r.explanation)}, ${escapeSql(r.explanation)}, ${escapeSql(r.formula)}, ${escapeJson(r.examples || [])}, ${escapeJson(r.commonMistakes || [])}, ${escapeSql(r.level || 'A1')})
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  explanation = EXCLUDED.explanation,
  formula = EXCLUDED.formula;`);
}
lines.push('');

// 5. Simulation Scenarios
lines.push('-- 5. SIMULATION SCENARIOS SEED');
for (const s of REAL_LIFE_SCENARIOS) {
  lines.push(`INSERT INTO public.simulation_scenarios (id, title, title_ar, category, difficulty, location, ai_role, user_role, initial_prompt, dialogue_script)
VALUES (${escapeSql(s.id)}, ${escapeSql(s.titleEn || s.title)}, ${escapeSql(s.title)}, ${escapeSql(s.category)}, ${escapeSql(s.difficulty)}, ${escapeSql(s.location)}, ${escapeSql(s.aiRole)}, ${escapeSql(s.userRole)}, ${escapeSql(s.initialPrompt)}, ${escapeJson(s.dialogueScript || [])})
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  location = EXCLUDED.location,
  initial_prompt = EXCLUDED.initial_prompt;`);
}
lines.push('');

// 6. Questions
lines.push('-- 6. QUESTIONS SEED');
for (const q of MASSIVE_QUESTION_BANK.slice(0, 50)) {
  lines.push(`INSERT INTO public.questions (id, skill, cefr_level, question_type, question_text, question_ar, options, correct_answer, explanation, explanation_ar)
VALUES (${escapeSql(q.id)}, ${escapeSql(q.skill)}, ${escapeSql(q.cefrLevel)}, ${escapeSql(q.type)}, ${escapeSql(q.prompt)}, ${escapeSql(q.promptAr)}, ${escapeJson(q.options || [])}, ${escapeSql(q.correctAnswer)}, ${escapeSql(q.explanationEn || q.explanation)}, ${escapeSql(q.explanation)})
ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  correct_answer = EXCLUDED.correct_answer;`);
}
lines.push('');

// 7. Core Vocabulary
lines.push('-- 7. CORE VOCABULARY SEED');
const vocabPath = path.resolve(process.cwd(), 'public/data/vocabulary-core.json');
if (fs.existsSync(vocabPath)) {
  try {
    const vocabData = JSON.parse(fs.readFileSync(vocabPath, 'utf8'));
    const coreSlice = vocabData.slice(0, 100);
    for (const v of coreSlice) {
      lines.push(`INSERT INTO public.dictionary_lexical_entries (headword, normalized_headword, primary_part_of_speech, cefr_level, ipa_us, ipa_uk)
VALUES (${escapeSql(v.headword)}, ${escapeSql(v.normalized || v.headword.toLowerCase())}, ${escapeSql(v.pos || 'noun')}, ${escapeSql(v.cefr || 'A1')}, ${escapeSql(v.ipaUs || '')}, ${escapeSql(v.ipaUk || '')})
ON CONFLICT (headword) DO NOTHING;`);
    }
  } catch (err) {
    console.warn('Could not read vocabulary-core.json:', err);
  }
}

lines.push('COMMIT;');
lines.push('-- Master seed generated successfully.');

const seedDir = path.resolve(process.cwd(), 'supabase/seeds');
if (!fs.existsSync(seedDir)) {
  fs.mkdirSync(seedDir, { recursive: true });
}

const outputPath = path.resolve(seedDir, '20261102_master_seed_data.sql');
fs.writeFileSync(outputPath, lines.join('\n'), 'utf8');

console.log(`Generated master seed SQL with ${lines.length} lines at: ${outputPath}`);
