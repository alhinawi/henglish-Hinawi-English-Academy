// ==============================================================================
// Henglish Academy (HENGLISH) - VOCABULARY & LEXICAL EXPLORER SERVICE
// High-performance search, multi-index filtering, and dual Supabase/JSON engine
// ==============================================================================

import { supabase } from './authService';
import { VOCABULARY_ACADEMY_WORDS, VocabWord } from '../data/vocabularyAcademyData';
import { calculateSM2, ReviewRating } from './spacedRepetitionService';

export type CEFRLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2' | 'Unclassified';

export interface LexicalEntry {
  id: string;
  headword: string;
  normalized: string;
  pos: string; // 'noun' | 'verb' | 'adjective' | 'adverb' etc.
  cefr: CEFRLevel;
  ipaUs: string;
  ipaUk: string;
  audioUsUrl?: string;
  audioUkUrl?: string;
  frequencyTier: string; // 'top500' | 'top1000' | 'top2000' | 'top3000' | 'top5000' | 'academic' | 'advanced' | 'rare'
  rank?: number;
  zipf?: number;
  domain: string;
  formality: string;
  meaningAr: string;
  otherMeaningsAr?: string[];
  definitionEn: string;
  exampleEn: string;
  exampleAr: string;
  inflections?: Record<string, any>;
  synonyms?: string[];
  antonyms?: string[];
  collocations?: string[];
}

export interface ExpressionEntry {
  id: string;
  expression: string;
  category: 'phrasal_verb' | 'idiom' | 'collocation' | 'conversational' | 'common_expression' | 'business_tech';
  meaningAr: string;
  definitionEn: string;
  exampleEn: string;
  exampleAr: string;
  cefr: string;
  formality: string;
  domain: string;
}

export interface VocabularyManifest {
  totalHeadwords: number;
  generatedAt: string;
  distributionCefr: Record<string, number>;
  distributionPos: Record<string, number>;
  distributionDomain: Record<string, number>;
  stats: {
    withUsIpa: number;
    withUkIpa: number;
    withAudioUs: number;
    withAudioUk: number;
    withArabicTranslation: number;
    withEnglishDefinition: number;
  };
}

export interface VocabularyFilterOptions {
  searchQuery?: string;
  cefr?: CEFRLevel | 'all';
  pos?: string | 'all';
  domain?: string | 'all';
  frequencyTier?: string | 'all';
  audioFilter?: 'all' | 'has_us' | 'has_uk' | 'has_both';
  sortBy?: 'popular' | 'alpha_asc' | 'alpha_desc' | 'cefr_asc' | 'cefr_desc';
  page?: number;
  pageSize?: number;
}

export interface SavedWordItem {
  id: string;
  word: string;
  entry: LexicalEntry;
  savedAt: string;
  notes?: string;
  isLearned: boolean;
  repetitionCount: number;
  intervalDays: number;
  easeFactor: number;
  nextReviewAt: string;
  lastReviewedAt?: string;
}

const SAVED_WORDS_STORAGE_KEY = 'henglish_saved_vocabulary_v1';

// In-memory cache
let cachedWords: LexicalEntry[] = [];
let fullDatasetLoaded = false;
let coreLoadingPromise: Promise<LexicalEntry[]> | null = null;
let fullLoadingPromise: Promise<LexicalEntry[]> | null = null;

let cachedExpressions: ExpressionEntry[] = [];
let expressionsLoadingPromise: Promise<ExpressionEntry[]> | null = null;

let cachedManifest: VocabularyManifest | null = null;

// Multi-index maps for instant O(1) filter intersections
const cefrIndex = new Map<string, Set<number>>();
const posIndex = new Map<string, Set<number>>();
const domainIndex = new Map<string, Set<number>>();
const freqIndex = new Map<string, Set<number>>();

function buildIndices(items: LexicalEntry[]) {
  cefrIndex.clear();
  posIndex.clear();
  domainIndex.clear();
  freqIndex.clear();

  items.forEach((item, idx) => {
    // CEFR
    const cKey = item.cefr;
    if (!cefrIndex.has(cKey)) cefrIndex.set(cKey, new Set());
    cefrIndex.get(cKey)!.add(idx);

    // POS
    const pKey = item.pos.toLowerCase();
    if (!posIndex.has(pKey)) posIndex.set(pKey, new Set());
    posIndex.get(pKey)!.add(idx);

    // Domain
    const dKey = item.domain.toLowerCase();
    if (!domainIndex.has(dKey)) domainIndex.set(dKey, new Set());
    domainIndex.get(dKey)!.add(idx);

    // Frequency
    const fKey = item.frequencyTier;
    if (!freqIndex.has(fKey)) freqIndex.set(fKey, new Set());
    freqIndex.get(fKey)!.add(idx);
  });
}

/**
 * Map a verified VocabWord (legacy reviewed data or frequency chunk) to LexicalEntry.
 * Never sets audio URLs: playback falls back to speech synthesis.
 */
function freqTierFromRank(rank?: number): string {
  if (!rank) return 'rare';
  if (rank <= 500) return 'top500';
  if (rank <= 1000) return 'top1000';
  if (rank <= 2000) return 'top2000';
  if (rank <= 3000) return 'top3000';
  if (rank <= 5000) return 'top5000';
  if (rank <= 10000) return 'advanced';
  return 'rare';
}

let ranksIndexPromise: Promise<Record<string, [number, number]>> | null = null;

function loadRanksIndex(): Promise<Record<string, [number, number]>> {
  if (!ranksIndexPromise) {
    ranksIndexPromise = fetch('/data/vocab/ranks-index.json')
      .then(res => (res.ok ? res.json() : {}))
      .catch(() => ({}));
  }
  return ranksIndexPromise;
}

function mapLegacyWord(w: VocabWord, ranks: Record<string, [number, number]>): LexicalEntry {
  const r = ranks[w.word];
  return {
    id: w.id,
    headword: w.word,
    normalized: w.word.toLowerCase(),
    pos: w.partOfSpeech,
    cefr: (w.level as CEFRLevel) || 'Unclassified',
    ipaUs: w.ipa,
    ipaUk: '',
    frequencyTier: freqTierFromRank(r?.[0]),
    domain: w.category,
    formality: '',
    meaningAr: w.meaningAr,
    definitionEn: '',
    exampleEn: w.exampleEn,
    exampleAr: w.exampleAr,
    collocations: w.collocation ? [w.collocation] : undefined,
    rank: r?.[0],
    zipf: r?.[1],
  };
}

interface VocabChunkEntry {
  id: string;
  word: string;
  rank: number;
  ipa: string;
  partOfSpeech: string;
  meaningAr: string;
  level: string;
  category: string;
  exampleEn: string;
  exampleAr: string;
  highlight: string;
}

function mapChunkEntry(e: VocabChunkEntry, ranks: Record<string, [number, number]>): LexicalEntry {
  return {
    id: e.id,
    headword: e.word,
    normalized: e.word.toLowerCase(),
    pos: e.partOfSpeech,
    cefr: (e.level as CEFRLevel) || 'Unclassified',
    ipaUs: e.ipa,
    ipaUk: '',
    frequencyTier: freqTierFromRank(e.rank),
    domain: e.category,
    formality: '',
    meaningAr: e.meaningAr,
    definitionEn: '',
    exampleEn: e.exampleEn,
    exampleAr: e.exampleAr,
    collocations: e.highlight ? [e.highlight] : undefined,
    rank: e.rank,
    zipf: ranks[e.word]?.[1],
  };
}

/**
 * Load the verified vocabulary (legacy hand-reviewed entries) for instant hydration.
 */
export async function loadVocabularyCore(): Promise<LexicalEntry[]> {
  if (cachedWords.length > 0) return cachedWords;
  if (coreLoadingPromise) return coreLoadingPromise;

  coreLoadingPromise = (async () => {
    try {
      const ranks = await loadRanksIndex();
      const data = VOCABULARY_ACADEMY_WORDS.map(w => mapLegacyWord(w, ranks));
      if (!fullDatasetLoaded) {
        cachedWords = data;
        buildIndices(data);
      }
      return cachedWords;
    } finally {
      coreLoadingPromise = null;
    }
  })();

  return coreLoadingPromise;
}

/**
 * Load every verified frequency chunk (100 words per file) and merge with core.
 */
export async function loadFullVocabulary(): Promise<LexicalEntry[]> {
  if (fullDatasetLoaded) return cachedWords;
  if (fullLoadingPromise) return fullLoadingPromise;

  fullLoadingPromise = (async () => {
    try {
      const [ranks, indexRes] = await Promise.all([
        loadRanksIndex(),
        fetch('/data/vocab/chunks-index.json'),
      ]);
      if (!indexRes.ok) throw new Error(`HTTP ${indexRes.status}`);
      const index: { files: string[] } = await indexRes.json();

      const core = VOCABULARY_ACADEMY_WORDS.map(w => mapLegacyWord(w, ranks));
      const chunkEntries: LexicalEntry[] = [];
      const BATCH = 24;
      for (let i = 0; i < index.files.length; i += BATCH) {
        const batch = index.files.slice(i, i + BATCH);
        const parts: VocabChunkEntry[][] = await Promise.all(
          batch.map(async name => {
            const res = await fetch(`/data/vocab/chunks/${name}`);
            if (!res.ok) throw new Error(`HTTP ${res.status} for ${name}`);
            return res.json();
          })
        );
        parts.flat().forEach(e => chunkEntries.push(mapChunkEntry(e, ranks)));
      }

      cachedWords = [...core, ...chunkEntries];
      fullDatasetLoaded = true;
      buildIndices(cachedWords);
      return cachedWords;
    } catch (err) {
      console.error('Failed to load full vocabulary database:', err);
      throw err;
    } finally {
      fullLoadingPromise = null;
    }
  })();

  return fullLoadingPromise;
}

/**
 * Load expressions collection (10,000 items)
 */
export async function loadExpressions(): Promise<ExpressionEntry[]> {
  if (cachedExpressions.length > 0) return cachedExpressions;
  if (expressionsLoadingPromise) return expressionsLoadingPromise;

  expressionsLoadingPromise = (async () => {
    try {
      const res = await fetch('/data/expressions.json');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: ExpressionEntry[] = await res.json();
      cachedExpressions = data;
      return data;
    } catch (err) {
      console.error('Failed to load expressions collection:', err);
      return [];
    } finally {
      expressionsLoadingPromise = null;
    }
  })();

  return expressionsLoadingPromise;
}

/**
 * Load vocabulary manifest statistics
 */
export async function loadVocabularyManifest(): Promise<VocabularyManifest | null> {
  if (cachedManifest) return cachedManifest;
  try {
    const res = await fetch('/data/vocabulary-manifest.json');
    if (!res.ok) return null;
    cachedManifest = await res.json();
    return cachedManifest;
  } catch {
    return null;
  }
}

const CEFR_ORDER: Record<string, number> = {
  A1: 1,
  A2: 2,
  B1: 3,
  B2: 4,
  C1: 5,
  C2: 6,
  Unclassified: 7,
};

/**
 * High-performance search and filter execution
 */
export function getLoadedVocabularyCount(): number {
  return cachedWords.length;
}

export function searchVocabulary(options: VocabularyFilterOptions = {}): {
  entries: LexicalEntry[];
  totalMatches: number;
  page: number;
  pageSize: number;
  totalPages: number;
} {
  const {
    searchQuery = '',
    cefr = 'all',
    pos = 'all',
    domain = 'all',
    frequencyTier = 'all',
    audioFilter = 'all',
    sortBy = 'popular',
    page = 1,
    pageSize = 30,
  } = options;

  if (cachedWords.length === 0) {
    return { entries: [], totalMatches: 0, page: 1, pageSize, totalPages: 0 };
  }

  const query = searchQuery.trim().toLowerCase();
  const hasQuery = query.length > 0;

  // Filter items
  let filtered = cachedWords.filter(item => {
    // 1. Search Query (English prefix/contains or Arabic translation)
    if (hasQuery) {
      const matchHeadword = item.normalized.includes(query);
      const matchAr = item.meaningAr.includes(query) || (item.otherMeaningsAr && item.otherMeaningsAr.some(m => m.includes(query)));
      const matchDef = item.definitionEn.toLowerCase().includes(query);
      if (!matchHeadword && !matchAr && !matchDef) {
        return false;
      }
    }

    // 2. CEFR
    if (cefr !== 'all' && item.cefr !== cefr) {
      return false;
    }

    // 3. POS
    if (pos !== 'all' && item.pos.toLowerCase() !== pos.toLowerCase()) {
      return false;
    }

    // 4. Domain
    if (domain !== 'all' && item.domain.toLowerCase() !== domain.toLowerCase()) {
      return false;
    }

    // 5. Frequency Tier
    if (frequencyTier !== 'all' && item.frequencyTier !== frequencyTier) {
      return false;
    }

    // 6. Audio Availability
    if (audioFilter === 'has_us' && !item.audioUsUrl) return false;
    if (audioFilter === 'has_uk' && !item.audioUkUrl) return false;
    if (audioFilter === 'has_both' && (!item.audioUsUrl || !item.audioUkUrl)) return false;

    return true;
  });

  // Sorting
  filtered.sort((a, b) => {
    // If search query exists, prioritize exact match, then prefix match
    if (hasQuery) {
      const aExact = a.normalized === query;
      const bExact = b.normalized === query;
      if (aExact && !bExact) return -1;
      if (!aExact && bExact) return 1;

      const aPrefix = a.normalized.startsWith(query);
      const bPrefix = b.normalized.startsWith(query);
      if (aPrefix && !bPrefix) return -1;
      if (!aPrefix && bPrefix) return 1;
    }

    if (sortBy === 'alpha_asc') {
      return a.headword.localeCompare(b.headword);
    }
    if (sortBy === 'alpha_desc') {
      return b.headword.localeCompare(a.headword);
    }
    if (sortBy === 'cefr_asc') {
      return (CEFR_ORDER[a.cefr] || 99) - (CEFR_ORDER[b.cefr] || 99);
    }
    if (sortBy === 'cefr_desc') {
      return (CEFR_ORDER[b.cefr] || 99) - (CEFR_ORDER[a.cefr] || 99);
    }
    // Default 'popular': most frequent first (zipf DESC, rank ASC fallback)
    const az = a.zipf ?? -1;
    const bz = b.zipf ?? -1;
    if (az !== bz) return bz - az;
    return (a.rank ?? 99999) - (b.rank ?? 99999);
  });

  const totalMatches = filtered.length;
  const totalPages = Math.ceil(totalMatches / pageSize) || 1;
  const currentPage = Math.max(1, Math.min(page, totalPages));
  const offset = (currentPage - 1) * pageSize;
  const pagedEntries = filtered.slice(offset, offset + pageSize);

  return {
    entries: pagedEntries,
    totalMatches,
    page: currentPage,
    pageSize,
    totalPages,
  };
}

/**
 * Personal Saved Vocabulary & Spaced Repetition (SM-2)
 */
export function getSavedWords(): SavedWordItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(SAVED_WORDS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveWord(entry: LexicalEntry, notes?: string): SavedWordItem[] {
  const words = getSavedWords();
  const existingIdx = words.findIndex(w => w.word.toLowerCase() === entry.headword.toLowerCase());

  if (existingIdx >= 0) {
    if (notes !== undefined) {
      words[existingIdx].notes = notes;
    }
  } else {
    const newItem: SavedWordItem = {
      id: `saved-${Date.now()}-${entry.id}`,
      word: entry.headword,
      entry,
      savedAt: new Date().toISOString(),
      notes,
      isLearned: false,
      repetitionCount: 0,
      intervalDays: 1,
      easeFactor: 2.5,
      nextReviewAt: new Date().toISOString(),
    };
    words.unshift(newItem);
  }

  try {
    localStorage.setItem(SAVED_WORDS_STORAGE_KEY, JSON.stringify(words));
  } catch {
    // ignore
  }

  // Sync to Supabase if authenticated
  syncSavedWordToSupabase(entry.headword, notes);

  return words;
}

export function removeSavedWord(wordText: string): SavedWordItem[] {
  let words = getSavedWords();
  words = words.filter(w => w.word.toLowerCase() !== wordText.toLowerCase());

  try {
    localStorage.setItem(SAVED_WORDS_STORAGE_KEY, JSON.stringify(words));
  } catch {
    // ignore
  }

  // Remove from Supabase if connected
  if (supabase) {
    supabase.from('dictionary_user_saved_words').delete().eq('word', wordText).then();
  }

  return words;
}

export function isWordSaved(wordText: string): boolean {
  const words = getSavedWords();
  return words.some(w => w.word.toLowerCase() === wordText.toLowerCase());
}

export function rateSavedWord(wordText: string, rating: ReviewRating): SavedWordItem[] {
  const words = getSavedWords();
  const target = words.find(w => w.word.toLowerCase() === wordText.toLowerCase());
  if (!target) return words;

  const sm2Result = calculateSM2(
    {
      id: target.id,
      word: target.word,
      ipa: target.entry.ipaUs,
      translationAr: target.entry.meaningAr,
      category: target.entry.domain,
      cefrLevel: target.entry.cefr,
      exampleEn: target.entry.exampleEn,
      exampleAr: target.entry.exampleAr,
      repetitionCount: target.repetitionCount,
      intervalDays: target.intervalDays,
      easeFactor: target.easeFactor,
      nextReviewAt: target.nextReviewAt,
    },
    rating
  );

  target.repetitionCount = sm2Result.repetitionCount;
  target.intervalDays = sm2Result.intervalDays;
  target.easeFactor = sm2Result.easeFactor;
  target.nextReviewAt = sm2Result.nextReviewAt;
  target.lastReviewedAt = new Date().toISOString();
  target.isLearned = target.repetitionCount >= 3;

  try {
    localStorage.setItem(SAVED_WORDS_STORAGE_KEY, JSON.stringify(words));
  } catch {
    // ignore
  }

  return [...words];
}

async function syncSavedWordToSupabase(word: string, notes?: string) {
  if (!supabase) return;
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from('dictionary_user_saved_words').upsert(
      {
        user_id: user.id,
        word,
        custom_notes: notes,
        next_review_at: new Date().toISOString(),
      },
      { onConflict: 'user_id,word' }
    );
  } catch {
    // quiet fallback
  }
}

