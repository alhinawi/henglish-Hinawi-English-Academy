// ==============================================================================
// Henglish Academy (HENGLISH) - 5,500 ESSENTIAL SENTENCES SERVICE
// High-performance search, indexing, filtering, and retrieval engine
// ==============================================================================

import { CEFRLevel } from '../types';

export interface SentenceConversation {
  speakerA: string;
  speakerB: string;
  context: string;
}

export interface SentenceItem {
  id: string;
  english: string;
  arabicEg: string;
  arabicFusha: string;
  cefr: CEFRLevel;
  section: string;
  category: string;
  subcategory: string;
  grammar: string;
  vocabulary: string[];
  ipa: string;
  naturalness: 'High' | 'Native' | 'Idiomatic';
  formality: 'Casual' | 'Conversational' | 'Polite' | 'Formal' | 'Academic' | 'Professional' | 'Idiomatic';
  purpose: string;
  audioAvailable: boolean;
  conversation: SentenceConversation;
  relatedSentences: string[];
  tags: string[];
}

export interface SearchFilterOptions {
  cefr?: CEFRLevel | 'all';
  section?: string | 'all';
  category?: string | 'all';
  subcategory?: string | 'all';
  grammar?: string | 'all';
  formality?: string | 'all';
  limit?: number;
  offset?: number;
}

export interface SemanticExplanationMatch {
  sentence: SentenceItem;
  similarityScore: number;
  nuanceExplanationAr?: string;
  matchedAspect: 'english' | 'arabic-eg' | 'arabic-fusha' | 'grammar' | 'concept';
}

// In-memory cache
let cachedSentences: SentenceItem[] | null = null;
let loadPromise: Promise<SentenceItem[]> | null = null;

// Search indices
const cefrIndex = new Map<CEFRLevel, SentenceItem[]>();
const sectionIndex = new Map<string, SentenceItem[]>();
const grammarIndex = new Map<string, SentenceItem[]>();

/**
 * Load sentences database with in-memory caching
 */
export async function loadSentences(): Promise<SentenceItem[]> {
  if (cachedSentences) {
    return cachedSentences;
  }
  if (loadPromise) {
    return loadPromise;
  }

  loadPromise = (async () => {
    try {
      const response = await fetch('/data/sentences.json');
      if (!response.ok) {
        throw new Error(`Failed to load sentences: ${response.statusText}`);
      }
      const data: SentenceItem[] = await response.json();
      cachedSentences = data;

      // Populate indices
      cefrIndex.clear();
      sectionIndex.clear();
      grammarIndex.clear();

      data.forEach(item => {
        // CEFR
        const cefrList = cefrIndex.get(item.cefr) || [];
        cefrList.push(item);
        cefrIndex.set(item.cefr, cefrList);

        // Section
        const secList = sectionIndex.get(item.section) || [];
        secList.push(item);
        sectionIndex.set(item.section, secList);

        // Grammar
        const gKey = item.grammar.toLowerCase().trim();
        const gList = grammarIndex.get(gKey) || [];
        gList.push(item);
        grammarIndex.set(gKey, gList);
      });

      return data;
    } catch (err) {
      console.error('Error fetching sentences database:', err);
      return [];
    } finally {
      loadPromise = null;
    }
  })();

  return loadPromise;
}

/**
 * Get all loaded sentences synchronously if cached, or empty array
 */
export function getCachedSentences(): SentenceItem[] {
  return cachedSentences || [];
}

/**
 * Find single sentence by ID
 */
export async function getSentenceById(id: string): Promise<SentenceItem | undefined> {
  const all = await loadSentences();
  return all.find(s => s.id === id);
}

/**
 * Normalizes text for clean fuzzy searching (removes diacritics, punctuation, alef variations)
 */
function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[أإآ]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي')
    .replace(/[ًٌٍَُِّْ]/g, '') // remove Arabic tashkeel
    .replace(/[.,/#!$%^&*;:{}=\-_`~()?"']/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * High-precision Search & Semantic Query Engine
 */
export async function searchSentences(
  query: string,
  filters: SearchFilterOptions = {}
): Promise<{ results: SentenceItem[]; total: number; semanticMatches?: SemanticExplanationMatch[] }> {
  const all = await loadSentences();
  const normalizedQuery = normalizeText(query);
  const queryTokens = normalizedQuery ? normalizedQuery.split(' ').filter(Boolean) : [];

  const {
    cefr = 'all',
    section = 'all',
    category = 'all',
    subcategory = 'all',
    grammar = 'all',
    formality = 'all',
    limit = 50,
    offset = 0,
  } = filters;

  // Filter pass
  let filtered = all.filter(s => {
    if (cefr !== 'all' && s.cefr !== cefr) return false;
    if (section !== 'all' && s.section !== section) return false;
    if (category !== 'all' && s.category !== category) return false;
    if (subcategory !== 'all' && s.subcategory !== subcategory) return false;
    if (grammar !== 'all' && !s.grammar.toLowerCase().includes(grammar.toLowerCase())) return false;
    if (formality !== 'all' && s.formality.toLowerCase() !== formality.toLowerCase()) return false;
    return true;
  });

  if (!normalizedQuery) {
    const total = filtered.length;
    const paginated = filtered.slice(offset, offset + limit);
    return { results: paginated, total };
  }

  // Scoring algorithm
  interface ScoredItem {
    item: SentenceItem;
    score: number;
    aspect: SemanticExplanationMatch['matchedAspect'];
  }

  const scored: ScoredItem[] = [];

  for (const s of filtered) {
    let score = 0;
    let matchedAspect: SemanticExplanationMatch['matchedAspect'] = 'english';

    const normEn = normalizeText(s.english);
    const normEg = normalizeText(s.arabicEg);
    const normFusha = normalizeText(s.arabicFusha);
    const normGrammar = normalizeText(s.grammar);
    const normPurpose = normalizeText(s.purpose);

    // Exact full sentence match
    if (normEn === normalizedQuery) {
      score += 100;
      matchedAspect = 'english';
    } else if (normEg === normalizedQuery) {
      score += 95;
      matchedAspect = 'arabic-eg';
    } else if (normFusha === normalizedQuery) {
      score += 90;
      matchedAspect = 'arabic-fusha';
    }

    // Substring contains
    if (normEn.includes(normalizedQuery)) {
      score += 50;
      matchedAspect = 'english';
    } else if (normEg.includes(normalizedQuery)) {
      score += 45;
      matchedAspect = 'arabic-eg';
    } else if (normFusha.includes(normalizedQuery)) {
      score += 40;
      matchedAspect = 'arabic-fusha';
    } else if (normGrammar.includes(normalizedQuery)) {
      score += 35;
      matchedAspect = 'grammar';
    } else if (normPurpose.includes(normalizedQuery)) {
      score += 30;
      matchedAspect = 'concept';
    }

    // Token match
    let tokenMatches = 0;
    for (const token of queryTokens) {
      if (normEn.includes(token)) tokenMatches += 5;
      if (normEg.includes(token)) tokenMatches += 4;
      if (normFusha.includes(token)) tokenMatches += 3;
      if (s.vocabulary.some(v => normalizeText(v).includes(token))) tokenMatches += 4;
      if (s.tags.some(t => normalizeText(t).includes(token))) tokenMatches += 3;
    }
    score += tokenMatches;

    if (score > 0) {
      scored.push({ item: s, score, aspect: matchedAspect });
    }
  }

  scored.sort((a, b) => b.score - a.score);

  // Semantic explanation matches for top items
  const semanticMatches: SemanticExplanationMatch[] = scored.slice(0, 5).map(s => {
    let nuance = '';
    if (s.item.grammar.toLowerCase().includes('past continuous')) {
      nuance = 'صيغة الماضي المستمر توضح أن الحدث كان مستمراً في نقطة زمنية معينة في الماضي.';
    } else if (s.item.grammar.toLowerCase().includes('present perfect continuous')) {
      nuance = 'صيغة المضارع التام المستمر تركز على استغراق الوقت من الماضي ومستمر حتى لحظة التكلم.';
    } else if (s.item.grammar.toLowerCase().includes('future perfect')) {
      nuance = 'صيغة المستقبل التام تعبر عن إنجاز الحدث واكتماله قبل حلول وقت محدد في المستقبل.';
    } else if (s.item.grammar.toLowerCase().includes('indirect')) {
      nuance = 'صيغة الطلب غير المباشر هي قمة الأدب الدبلوماسي في التخاطب باللغة الإنجليزية.';
    }
    return {
      sentence: s.item,
      similarityScore: Math.min(100, s.score),
      nuanceExplanationAr: nuance,
      matchedAspect: s.aspect,
    };
  });

  const total = scored.length;
  const paginated = scored.slice(offset, offset + limit).map(s => s.item);

  return {
    results: paginated,
    total,
    semanticMatches,
  };
}

/**
 * Deterministic Daily Sentence (Identical for all users on any given day)
 */
export async function getDailySentence(): Promise<SentenceItem | null> {
  const all = await loadSentences();
  if (all.length === 0) return null;

  const today = new Date();
  const dayOfYear = Math.floor(
    (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24
  );
  const index = Math.abs((dayOfYear * 97 + today.getFullYear()) % all.length);
  return all[index] || all[0];
}

/**
 * Deterministic Sentence of the Week
 */
export async function getSentenceOfTheWeek(): Promise<SentenceItem | null> {
  const all = await loadSentences();
  if (all.length === 0) return null;

  const today = new Date();
  const weekNumber = Math.ceil(
    ((today.getTime() - new Date(today.getFullYear(), 0, 1).getTime()) / 86400000 + 1) / 7
  );
  // Prefer B2 or C1 for sentence of the week
  const b2c1 = all.filter(s => s.cefr === 'B2' || s.cefr === 'C1');
  const pool = b2c1.length > 0 ? b2c1 : all;
  const index = Math.abs((weekNumber * 31) % pool.length);
  return pool[index] || pool[0];
}

/**
 * Get random sentence, optional CEFR or Section filter
 */
export async function getRandomSentence(cefr?: CEFRLevel, section?: string): Promise<SentenceItem | null> {
  const all = await loadSentences();
  let pool = all;
  if (cefr) {
    pool = pool.filter(s => s.cefr === cefr);
  }
  if (section) {
    pool = pool.filter(s => s.section === section);
  }
  if (pool.length === 0) return null;
  const randIdx = Math.floor(Math.random() * pool.length);
  return pool[randIdx];
}
