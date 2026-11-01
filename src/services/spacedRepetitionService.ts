// ==============================================================================
// Henglish Academy (HENGLISH) - SM-2 SPACED REPETITION ENGINE
// Scientifically proven memory consolidation algorithm for vocabulary mastery
// ==============================================================================

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

export function loadSrsCardsFromStorage(): VocabularyCard[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {}
  return [];
}

export function saveSrsCardsToStorage(cards: VocabularyCard[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
  } catch {}
}
