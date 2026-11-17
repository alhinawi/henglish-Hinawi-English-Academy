import { mediaStorageKey } from './accountMediaStorage';
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
  studyDates?: string[]; // UTC review days, recorded only from real reviews
}

const STORAGE_KEY_SRS = 'henglish_srs_sentences_v1';
const STORAGE_KEY_FAVORITES = 'henglish_sentence_favorites_v1';
const STORAGE_KEY_DIFFICULT = 'henglish_sentence_difficult_v1';
const STORAGE_KEY_RECENT = 'henglish_sentence_recent_v1';
const STORAGE_KEY_COLLECTIONS = 'henglish_sentence_collections_v1';
const STORAGE_KEY_STATS = 'henglish_sentence_stats_v1';

function createOwnerStore(learnerId?: string) {
function readOwnerValue(base: string): string | null {
  try {
    const guestKey = mediaStorageKey(base);
    if (localStorage.getItem(guestKey) === null) {
      const legacy = localStorage.getItem(base);
      if (legacy !== null) {
        try { JSON.parse(legacy); localStorage.setItem(guestKey, legacy); } catch { /* Leave damaged legacy data untouched. */ }
      }
    }
  } catch { /* Optional guest recovery must not hide a valid owner record. */ }
  return localStorage.getItem(mediaStorageKey(base, learnerId));
}
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
  const read = (base: string): unknown => {
    try { return JSON.parse(readOwnerValue(base) || 'null'); } catch { return null; }
  };
  const strings = (value: unknown): string[] => Array.isArray(value) ? value.filter((id): id is string => typeof id === 'string') : [];
  const rawSrs = read(STORAGE_KEY_SRS);
  if (rawSrs && typeof rawSrs === 'object' && !Array.isArray(rawSrs)) {
    for (const [id, value] of Object.entries(rawSrs)) {
      if (value && typeof value === 'object' && typeof value.sentenceId === 'string' &&
          typeof value.lastReviewedAt === 'string' && typeof value.nextReviewAt === 'string' &&
          typeof value.timesReviewed === 'number') srsRecords[id] = value as SentenceSrsRecord;
    }
  }
  favoriteIds = new Set(strings(read(STORAGE_KEY_FAVORITES)));
  difficultIds = new Set(strings(read(STORAGE_KEY_DIFFICULT)));
  recentIds = strings(read(STORAGE_KEY_RECENT));
  const rawCollections = read(STORAGE_KEY_COLLECTIONS);
  if (Array.isArray(rawCollections)) collections = rawCollections.filter((c): c is UserSentenceCollection =>
    !!c && typeof c === 'object' && typeof c.id === 'string' && typeof c.name === 'string' &&
    Array.isArray(c.sentenceIds) && c.sentenceIds.every((id: unknown) => typeof id === 'string'));
  const rawStats = read(STORAGE_KEY_STATS);
  if (rawStats && typeof rawStats === 'object' && !Array.isArray(rawStats)) {
    stats.studyDates = strings((rawStats as SentenceLearningStats).studyDates);
  }
  isInitialized = true;
}

function persistAll() {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(mediaStorageKey(STORAGE_KEY_SRS, learnerId), JSON.stringify(srsRecords));
    localStorage.setItem(mediaStorageKey(STORAGE_KEY_FAVORITES, learnerId), JSON.stringify(Array.from(favoriteIds)));
    localStorage.setItem(mediaStorageKey(STORAGE_KEY_DIFFICULT, learnerId), JSON.stringify(Array.from(difficultIds)));
    localStorage.setItem(mediaStorageKey(STORAGE_KEY_RECENT, learnerId), JSON.stringify(recentIds));
    localStorage.setItem(mediaStorageKey(STORAGE_KEY_COLLECTIONS, learnerId), JSON.stringify(collections));
    localStorage.setItem(mediaStorageKey(STORAGE_KEY_STATS, learnerId), JSON.stringify(stats));
  } catch (err) {
    console.error('Error persisting SRS data to storage:', err);
  }
}

/**
 * Record a Spaced Repetition review for a sentence
 */
function reviewSentence(sentenceId: string, rating: ReviewRating): SentenceSrsRecord {
  initStorage();
  // Retain older latest-review evidence before replacing this record.
  recomputeStats();

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
  recomputeStats(now);
  persistAll();

  return updated;
}

/**
 * Recomputes aggregate stats, learning streak, and mastery score
 */
function recomputeStats(reviewedAt?: Date) {
  const records = Object.values(srsRecords);
  const total = records.length;
  const remembered = records.filter(r => r.status === 'remembered').length;
  const forgotten = records.filter(r => r.status === 'forgotten').length;

  const now = new Date();
  const due = records.filter(r => new Date(r.nextReviewAt) <= now).length;

  // Do not count page views as study. Older aggregate streak/lastStudyDate
  // fields were polluted by reads, so recover only dated review evidence.
  const dayMs = 24 * 60 * 60 * 1000;
  const todayStr = now.toISOString().slice(0, 10);
  const reviewDays = new Set<string>();
  if (total > 0) {
    for (const day of Array.isArray(stats.studyDates) ? stats.studyDates : []) {
      if (/^\d{4}-\d{2}-\d{2}$/.test(day) && day <= todayStr &&
          Number.isFinite(Date.parse(day)) && new Date(day).toISOString().slice(0, 10) === day) reviewDays.add(day);
    }
    for (const record of records) {
      if (!(record.timesReviewed > 0)) continue;
      const date = new Date(record.lastReviewedAt);
      if (Number.isFinite(date.getTime())) {
        const day = date.toISOString().slice(0, 10);
        if (day <= todayStr) reviewDays.add(day);
      }
    }
    if (reviewedAt) reviewDays.add(reviewedAt.toISOString().slice(0, 10));
  }
  const studyDates = [...reviewDays].sort();
  let cursor = Date.parse(todayStr);
  if (!reviewDays.has(todayStr)) cursor -= dayMs;
  let streak = 0;
  while (reviewDays.has(new Date(cursor).toISOString().slice(0, 10))) {
    streak += 1;
    cursor -= dayMs;
  }

  // Legacy field name: share last self-rated remembered, not proficiency (0 to 100)
  const mastery = total > 0 ? Math.round((remembered / total) * 100) : 0;

  stats = {
    totalStudied: total,
    rememberedCount: remembered,
    forgottenCount: forgotten,
    dueTodayCount: due,
    streakDays: streak,
    lastStudyDate: studyDates[studyDates.length - 1] || '',
    studyDates,
    masteryScore: mastery,
  };
}

function getSentenceStats(): SentenceLearningStats {
  initStorage();
  recomputeStats();
  return stats;
}

function getSentenceSrsRecord(sentenceId: string): SentenceSrsRecord | undefined {
  initStorage();
  return srsRecords[sentenceId];
}

function getDueSentencesIds(): string[] {
  initStorage();
  const now = new Date();
  return Object.values(srsRecords)
    .filter(r => new Date(r.nextReviewAt) <= now)
    .map(r => r.sentenceId);
}

// --- FAVORITES ---
function toggleFavoriteSentence(sentenceId: string): boolean {
  initStorage();
  if (favoriteIds.has(sentenceId)) {
    favoriteIds.delete(sentenceId);
  } else {
    favoriteIds.add(sentenceId);
  }
  persistAll();
  return favoriteIds.has(sentenceId);
}

function isFavoriteSentence(sentenceId: string): boolean {
  initStorage();
  return favoriteIds.has(sentenceId);
}

function getFavoriteSentenceIds(): string[] {
  initStorage();
  return Array.from(favoriteIds);
}

// --- DIFFICULT SENTENCES ---
function toggleDifficultSentence(sentenceId: string): boolean {
  initStorage();
  if (difficultIds.has(sentenceId)) {
    difficultIds.delete(sentenceId);
  } else {
    difficultIds.add(sentenceId);
  }
  persistAll();
  return difficultIds.has(sentenceId);
}

function isDifficultSentence(sentenceId: string): boolean {
  initStorage();
  return difficultIds.has(sentenceId);
}

function getDifficultSentenceIds(): string[] {
  initStorage();
  return Array.from(difficultIds);
}

// --- RECENTLY STUDIED ---
function markRecentlyStudied(sentenceId: string) {
  initStorage();
  recentIds = [sentenceId, ...recentIds.filter(id => id !== sentenceId)].slice(0, 50);
  persistAll();
}

function getRecentlyStudiedIds(): string[] {
  initStorage();
  return recentIds;
}

// --- CUSTOM USER COLLECTIONS ---
function getCollections(): UserSentenceCollection[] {
  initStorage();
  return collections;
}

function createCollection(name: string, color: string = '#f25f4c', description?: string): UserSentenceCollection {
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

function addSentenceToCollection(collectionId: string, sentenceId: string): boolean {
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

function removeSentenceFromCollection(collectionId: string, sentenceId: string): boolean {
  initStorage();
  const col = collections.find(c => c.id === collectionId);
  if (!col) return false;
  col.sentenceIds = col.sentenceIds.filter(id => id !== sentenceId);
  col.updatedAt = new Date().toISOString();
  persistAll();
  return true;
}

function deleteCollection(collectionId: string): boolean {
  initStorage();
  const beforeLen = collections.length;
  collections = collections.filter(c => c.id !== collectionId);
  persistAll();
  return collections.length < beforeLen;
}

return { reviewSentence, getSentenceStats, getSentenceSrsRecord, getDueSentencesIds, toggleFavoriteSentence, isFavoriteSentence, getFavoriteSentenceIds, toggleDifficultSentence, isDifficultSentence, getDifficultSentenceIds, markRecentlyStudied, getRecentlyStudiedIds, getCollections, createCollection, addSentenceToCollection, removeSentenceFromCollection, deleteCollection };
}

const ownerStores = new Map<string, ReturnType<typeof createOwnerStore>>();
function ownerStore(learnerId?: string) {
  const key = mediaStorageKey("sentences", learnerId);
  let store = ownerStores.get(key);
  if (!store) { store = createOwnerStore(learnerId); ownerStores.set(key, store); }
  return store;
}

export function reviewSentence(sentenceId: string, rating: ReviewRating, learnerId?: string): SentenceSrsRecord {
  return ownerStore(learnerId).reviewSentence(sentenceId, rating);
}

export function getSentenceStats(learnerId?: string): SentenceLearningStats {
  return ownerStore(learnerId).getSentenceStats();
}

export function getSentenceSrsRecord(sentenceId: string, learnerId?: string): SentenceSrsRecord | undefined {
  return ownerStore(learnerId).getSentenceSrsRecord(sentenceId);
}

export function getDueSentencesIds(learnerId?: string): string[] {
  return ownerStore(learnerId).getDueSentencesIds();
}

export function toggleFavoriteSentence(sentenceId: string, learnerId?: string): boolean {
  return ownerStore(learnerId).toggleFavoriteSentence(sentenceId);
}

export function isFavoriteSentence(sentenceId: string, learnerId?: string): boolean {
  return ownerStore(learnerId).isFavoriteSentence(sentenceId);
}

export function getFavoriteSentenceIds(learnerId?: string): string[] {
  return ownerStore(learnerId).getFavoriteSentenceIds();
}

export function toggleDifficultSentence(sentenceId: string, learnerId?: string): boolean {
  return ownerStore(learnerId).toggleDifficultSentence(sentenceId);
}

export function isDifficultSentence(sentenceId: string, learnerId?: string): boolean {
  return ownerStore(learnerId).isDifficultSentence(sentenceId);
}

export function getDifficultSentenceIds(learnerId?: string): string[] {
  return ownerStore(learnerId).getDifficultSentenceIds();
}

export function markRecentlyStudied(sentenceId: string, learnerId?: string) {
  return ownerStore(learnerId).markRecentlyStudied(sentenceId);
}

export function getRecentlyStudiedIds(learnerId?: string): string[] {
  return ownerStore(learnerId).getRecentlyStudiedIds();
}

export function getCollections(learnerId?: string): UserSentenceCollection[] {
  return ownerStore(learnerId).getCollections();
}

export function createCollection(name: string, color: string = '#f25f4c', description?: string, learnerId?: string): UserSentenceCollection {
  return ownerStore(learnerId).createCollection(name, color, description);
}

export function addSentenceToCollection(collectionId: string, sentenceId: string, learnerId?: string): boolean {
  return ownerStore(learnerId).addSentenceToCollection(collectionId, sentenceId);
}

export function removeSentenceFromCollection(collectionId: string, sentenceId: string, learnerId?: string): boolean {
  return ownerStore(learnerId).removeSentenceFromCollection(collectionId, sentenceId);
}

export function deleteCollection(collectionId: string, learnerId?: string): boolean {
  return ownerStore(learnerId).deleteCollection(collectionId);
}
