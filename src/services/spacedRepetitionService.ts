// ==============================================================================
// Henglish Academy (HENGLISH) - SM-2 SPACED REPETITION ENGINE
// Scientifically proven memory consolidation algorithm with Hybrid Supabase & Local Cache
// ==============================================================================

import { supabase } from '../lib/supabase';

export interface VocabularyCard {
  id: string;
  word: string;
  ipa: string;
  translationAr: string;
  category: string;
  cefrLevel: string;
  exampleEn: string;
  exampleAr: string;
  repetitionCount: number;
  intervalDays: number;
  easeFactor: number;
  nextReviewAt: string; // ISO string
  lastReviewedAt?: string;
}

export type ReviewRating = 0 | 1 | 2 | 3 | 4 | 5;

const STORAGE_KEY = 'henglish_srs_vocabulary_v2';

/**
 * SuperMemo SM-2 Calculation
 */
export function calculateSM2(
  card: VocabularyCard,
  rating: ReviewRating
): { repetitionCount: number; intervalDays: number; easeFactor: number; nextReviewAt: string } {
  let repetitionCount = card.repetitionCount || 0;
  let intervalDays = card.intervalDays || 1;
  let easeFactor = card.easeFactor || 2.5;

  if (rating >= 3) {
    if (repetitionCount === 0) {
      intervalDays = 1;
    } else if (repetitionCount === 1) {
      intervalDays = 6;
    } else {
      intervalDays = Math.round(intervalDays * easeFactor);
    }
    repetitionCount += 1;
    easeFactor = Math.max(1.3, easeFactor + (0.1 - (5 - rating) * (0.08 + (5 - rating) * 0.02)));
  } else {
    repetitionCount = 0;
    intervalDays = 1;
  }

  const nextReviewDate = new Date();
  nextReviewDate.setDate(nextReviewDate.getDate() + intervalDays);

  return {
    repetitionCount,
    intervalDays,
    easeFactor: Number(easeFactor.toFixed(2)),
    nextReviewAt: nextReviewDate.toISOString(),
  };
}

export function getDueSrsCards(allCards: VocabularyCard[]): VocabularyCard[] {
  const now = new Date();
  return allCards.filter(c => new Date(c.nextReviewAt) <= now);
}

/**
 * Synchronous local storage reader (used as immediate fallback/cache)
 */
export function loadSrsCardsFromStorage(): VocabularyCard[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {}
  return [];
}

/**
 * Synchronous local storage writer (updates client cache)
 */
export function saveSrsCardsToStorage(cards: VocabularyCard[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
  } catch {}
}

/**
 * Production Supabase-backed loader:
 * Loads cards from public.vocabulary_srs_cards for authenticated users,
 * falls back to localStorage for guest learners or offline scenarios.
 */
export async function loadUserSrsCards(userId?: string): Promise<VocabularyCard[]> {
  const localCards = loadSrsCardsFromStorage();

  if (!supabase || !userId || userId.startsWith('guest-') || userId.startsWith('demo-')) {
    return localCards;
  }

  try {
    const { data, error } = await supabase
      .from('vocabulary_srs_cards')
      .select('*')
      .eq('user_id', userId);

    if (error || !data || data.length === 0) {
      return localCards;
    }

    const dbCards: VocabularyCard[] = data.map((r: any) => ({
      id: r.id,
      word: r.word,
      ipa: r.ipa || '',
      translationAr: r.translation_ar || '',
      category: r.category || 'general',
      cefrLevel: r.cefr_level || 'A1',
      exampleEn: r.example_en || '',
      exampleAr: r.example_ar || '',
      repetitionCount: r.repetition_count || 0,
      intervalDays: r.interval_days || 1,
      easeFactor: Number(r.ease_factor || 2.5),
      nextReviewAt: r.next_review_at || new Date().toISOString(),
      lastReviewedAt: r.last_reviewed_at,
    }));

    // Cache locally for offline resilience
    saveSrsCardsToStorage(dbCards);
    return dbCards;
  } catch (err) {
    console.warn('[SRS] Database fetch failed, using local cache:', err);
    return localCards;
  }
}

/**
 * Saves review outcome to Supabase and updates local storage
 */
export async function saveUserSrsCard(
  card: VocabularyCard,
  userId?: string
): Promise<void> {
  // 1. Update local storage first (optimistic)
  const current = loadSrsCardsFromStorage();
  const existingIdx = current.findIndex(c => c.word.toLowerCase() === card.word.toLowerCase());
  if (existingIdx !== -1) {
    current[existingIdx] = card;
  } else {
    current.push(card);
  }
  saveSrsCardsToStorage(current);

  // 2. Persist to Supabase if authenticated
  if (!supabase || !userId || userId.startsWith('guest-') || userId.startsWith('demo-')) {
    return;
  }

  try {
    await supabase.from('vocabulary_srs_cards').upsert(
      {
        user_id: userId,
        word: card.word,
        ipa: card.ipa,
        translation_ar: card.translationAr,
        category: card.category,
        cefr_level: card.cefrLevel,
        example_en: card.exampleEn,
        example_ar: card.exampleAr,
        repetition_count: card.repetitionCount,
        interval_days: card.intervalDays,
        ease_factor: card.easeFactor,
        next_review_at: card.nextReviewAt,
        last_reviewed_at: new Date().toISOString(),
      },
      { onConflict: 'user_id,word' }
    );
  } catch (err) {
    console.warn('[SRS] Database card upsert failed:', err);
  }
}

/**
 * Migrates local storage SRS cards to authenticated account
 */
export async function syncLocalSrsCardsToSupabase(userId: string): Promise<number> {
  if (!supabase || !userId || userId.startsWith('guest-') || userId.startsWith('demo-')) {
    return 0;
  }

  const localCards = loadSrsCardsFromStorage();
  if (localCards.length === 0) return 0;

  try {
    const payload = localCards.map(c => ({
      user_id: userId,
      word: c.word,
      ipa: c.ipa,
      translation_ar: c.translationAr,
      category: c.category,
      cefr_level: c.cefrLevel,
      example_en: c.exampleEn,
      example_ar: c.exampleAr,
      repetition_count: c.repetitionCount,
      interval_days: c.intervalDays,
      ease_factor: c.easeFactor,
      next_review_at: c.nextReviewAt,
      last_reviewed_at: c.lastReviewedAt || new Date().toISOString(),
    }));

    const { error } = await supabase
      .from('vocabulary_srs_cards')
      .upsert(payload, { onConflict: 'user_id,word' });

    if (!error) {
      return payload.length;
    }
  } catch (err) {
    console.warn('[SRS] Local to database sync exception:', err);
  }
  return 0;
}
