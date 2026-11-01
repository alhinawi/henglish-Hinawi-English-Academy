// ==============================================================================
// Henglish Academy (HENGLISH) - SENTENCE SPACED REPETITION & COLLECTIONS ENGINE
// SuperMemo SM-2 algorithm, streaks, mastery scores, and custom user decks
// ==============================================================================

import { calculateSM2, ReviewRating } from './spacedRepetitionService';

export interface SentenceSrsRecord {
  sentenceId: string;
  repetitionCount: number;
  intervalDays: number;
  easeFactor: number;
  nextReviewAt: string; // ISO string
  lastReviewedAt: string; // ISO string
  status: 'new' | 'learning' | 'remembered' | 'forgotten';
  timesReviewed: number;
  timesRemembered: number;
  timesForgotten: number;
}

export interface UserSentenceCollection {
  id: string;
  name: string;
  description?: string;
  color: string;
  icon?: string;
  sentenceIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface SentenceLearningStats {
  totalStudied: number;
  rememberedCount: number;
  forgottenCount: number;
  dueTodayCount: number;
  streakDays: number;
  lastStudyDate: string;
  masteryScore: number; // 0 to 100 percentage
}

const STORAGE_KEY_SRS = 'henglish_srs_sentences_v1';
const STORAGE_KEY_FAVORITES = 'henglish_sentence_favorites_v1';
const STORAGE_KEY_DIFFICULT = 'henglish_sentence_difficult_v1';
const STORAGE_KEY_RECENT = 'henglish_sentence_recent_v1';
const STORAGE_KEY_COLLECTIONS = 'henglish_sentence_collections_v1';
const STORAGE_KEY_STATS = 'henglish_sentence_stats_v1';

// In-memory state
let srsRecords: Record<string, SentenceSrsRecord> = {};
let favoriteIds = new Set<string>();
let difficultIds = new Set<string>();
let recentIds: string[] = [];
let collections: UserSentenceCollection[] = [];
let stats: SentenceLearningStats = {
  totalStudied: 0,
  rememberedCount: 0,
  forgottenCount: 0,
  dueTodayCount: 0,
  streakDays: 0,
  lastStudyDate: '',
  masteryScore: 0,
};

let isInitialized = false;

function initStorage() {
  if (isInitialized || typeof window === 'undefined') return;
  try {
    const rawSrs = localStorage.getItem(STORAGE_KEY_SRS);
    if (rawSrs) srsRecords = JSON.parse(rawSrs);

    const rawFavs = localStorage.getItem(STORAGE_KEY_FAVORITES);
    if (rawFavs) favoriteIds = new Set(JSON.parse(rawFavs));

    const rawDiff = localStorage.getItem(STORAGE_KEY_DIFFICULT);
    if (rawDiff) difficultIds = new Set(JSON.parse(rawDiff));

    const rawRecent = localStorage.getItem(STORAGE_KEY_RECENT);
    if (rawRecent) recentIds = JSON.parse(rawRecent);

    const rawCols = localStorage.getItem(STORAGE_KEY_COLLECTIONS);
    if (rawCols) collections = JSON.parse(rawCols);

    const rawStats = localStorage.getItem(STORAGE_KEY_STATS);
    if (rawStats) stats = JSON.parse(rawStats);
  } catch (err) {
    console.error('Error loading SRS data from storage:', err);
  }
  isInitialized = true;
}

function persistAll() {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_SRS, JSON.stringify(srsRecords));
    localStorage.setItem(STORAGE_KEY_FAVORITES, JSON.stringify(Array.from(favoriteIds)));
    localStorage.setItem(STORAGE_KEY_DIFFICULT, JSON.stringify(Array.from(difficultIds)));
    localStorage.setItem(STORAGE_KEY_RECENT, JSON.stringify(recentIds));
    localStorage.setItem(STORAGE_KEY_COLLECTIONS, JSON.stringify(collections));
    localStorage.setItem(STORAGE_KEY_STATS, JSON.stringify(stats));
  } catch (err) {
    console.error('Error persisting SRS data to storage:', err);
  }
}

/**
 * Record a Spaced Repetition review for a sentence
 */
export function reviewSentence(sentenceId: string, rating: ReviewRating): SentenceSrsRecord {
  initStorage();

  const now = new Date();
  const existing = srsRecords[sentenceId] || {
    sentenceId,
    repetitionCount: 0,
    intervalDays: 1,
    easeFactor: 2.5,
    nextReviewAt: now.toISOString(),
    lastReviewedAt: now.toISOString(),
    status: 'new' as const,
    timesReviewed: 0,
    timesRemembered: 0,
    timesForgotten: 0,
  };

  // Convert to SM2 input format
  const sm2Input = {
    id: sentenceId,
    word: sentenceId,
    ipa: '',
    translationAr: '',
    category: '',
    cefrLevel: '',
    exampleEn: '',
    exampleAr: '',
    repetitionCount: existing.repetitionCount,
    intervalDays: existing.intervalDays,
    easeFactor: existing.easeFactor,
    nextReviewAt: existing.nextReviewAt,
  };

  const calculated = calculateSM2(sm2Input, rating);
  const isSuccess = rating >= 3;

  const updated: SentenceSrsRecord = {
    sentenceId,
    repetitionCount: calculated.repetitionCount,
    intervalDays: calculated.intervalDays,
    easeFactor: calculated.easeFactor,
    nextReviewAt: calculated.nextReviewAt,
    lastReviewedAt: now.toISOString(),
    status: isSuccess ? 'remembered' : 'forgotten',
    timesReviewed: existing.timesReviewed + 1,
    timesRemembered: isSuccess ? existing.timesRemembered + 1 : existing.timesRemembered,
    timesForgotten: !isSuccess ? existing.timesForgotten + 1 : existing.timesForgotten,
  };

  srsRecords[sentenceId] = updated;

  // Manage difficult list automatically if rating is low (0, 1, 2)
  if (rating <= 2) {
    difficultIds.add(sentenceId);
  } else if (rating >= 4 && difficultIds.has(sentenceId)) {
    difficultIds.delete(sentenceId);
  }

  // Update recent list
  markRecentlyStudied(sentenceId);

  // Update general learning stats
  recomputeStats();
  persistAll();

  return updated;
}

/**
 * Recomputes aggregate stats, learning streak, and mastery score
 */
function recomputeStats() {
  const records = Object.values(srsRecords);
  const total = records.length;
  const remembered = records.filter(r => r.status === 'remembered').length;
  const forgotten = records.filter(r => r.status === 'forgotten').length;

  const now = new Date();
  const due = records.filter(r => new Date(r.nextReviewAt) <= now).length;

  // Check streak
  const todayStr = new Date().toISOString().split('T')[0];
  let streak = stats.streakDays;
  if (!stats.lastStudyDate) {
    streak = 1;
  } else if (stats.lastStudyDate !== todayStr) {
    const lastDate = new Date(stats.lastStudyDate);
    const diffDays = Math.floor((now.getTime() - lastDate.getTime()) / (1000 * 3600 * 24));
    if (diffDays === 1) {
      streak += 1;
    } else if (diffDays > 1) {
      streak = 1; // streak reset
    }
  }

  // Mastery score = weighted remembered vs total studied (0 to 100)
  const mastery = total > 0 ? Math.round((remembered / total) * 100) : 0;

  stats = {
    totalStudied: total,
    rememberedCount: remembered,
    forgottenCount: forgotten,
    dueTodayCount: due,
    streakDays: streak,
    lastStudyDate: todayStr,
    masteryScore: mastery,
  };
}

export function getSentenceStats(): SentenceLearningStats {
  initStorage();
  recomputeStats();
  return stats;
}

export function getSentenceSrsRecord(sentenceId: string): SentenceSrsRecord | undefined {
  initStorage();
  return srsRecords[sentenceId];
}

export function getDueSentencesIds(): string[] {
  initStorage();
  const now = new Date();
  return Object.values(srsRecords)
    .filter(r => new Date(r.nextReviewAt) <= now)
    .map(r => r.sentenceId);
}

// --- FAVORITES ---
export function toggleFavoriteSentence(sentenceId: string): boolean {
  initStorage();
  if (favoriteIds.has(sentenceId)) {
    favoriteIds.delete(sentenceId);
  } else {
    favoriteIds.add(sentenceId);
  }
  persistAll();
  return favoriteIds.has(sentenceId);
}

export function isFavoriteSentence(sentenceId: string): boolean {
  initStorage();
  return favoriteIds.has(sentenceId);
}

export function getFavoriteSentenceIds(): string[] {
  initStorage();
  return Array.from(favoriteIds);
}

// --- DIFFICULT SENTENCES ---
export function toggleDifficultSentence(sentenceId: string): boolean {
  initStorage();
  if (difficultIds.has(sentenceId)) {
    difficultIds.delete(sentenceId);
  } else {
    difficultIds.add(sentenceId);
  }
  persistAll();
  return difficultIds.has(sentenceId);
}

export function isDifficultSentence(sentenceId: string): boolean {
  initStorage();
  return difficultIds.has(sentenceId);
}

export function getDifficultSentenceIds(): string[] {
  initStorage();
  return Array.from(difficultIds);
}

// --- RECENTLY STUDIED ---
export function markRecentlyStudied(sentenceId: string) {
  initStorage();
  recentIds = [sentenceId, ...recentIds.filter(id => id !== sentenceId)].slice(0, 50);
  persistAll();
}

export function getRecentlyStudiedIds(): string[] {
  initStorage();
  return recentIds;
}

// --- CUSTOM USER COLLECTIONS ---
export function getCollections(): UserSentenceCollection[] {
  initStorage();
  return collections;
}

export function createCollection(name: string, color: string = '#f25f4c', description?: string): UserSentenceCollection {
  initStorage();
  const newCol: UserSentenceCollection = {
    id: `col-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    name,
    description,
    color,
    sentenceIds: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  collections.push(newCol);
  persistAll();
  return newCol;
}

export function addSentenceToCollection(collectionId: string, sentenceId: string): boolean {
  initStorage();
  const col = collections.find(c => c.id === collectionId);
  if (!col) return false;
  if (!col.sentenceIds.includes(sentenceId)) {
    col.sentenceIds.push(sentenceId);
    col.updatedAt = new Date().toISOString();
    persistAll();
  }
  return true;
}

export function removeSentenceFromCollection(collectionId: string, sentenceId: string): boolean {
  initStorage();
  const col = collections.find(c => c.id === collectionId);
  if (!col) return false;
  col.sentenceIds = col.sentenceIds.filter(id => id !== sentenceId);
  col.updatedAt = new Date().toISOString();
  persistAll();
  return true;
}

export function deleteCollection(collectionId: string): boolean {
  initStorage();
  const beforeLen = collections.length;
  collections = collections.filter(c => c.id !== collectionId);
  persistAll();
  return collections.length < beforeLen;
}
