// ==============================================================================
// Henglish Academy - Arcade content builders
// Every round is generated from real platform content: the vocabulary academy,
// the movie scenes library and the 5,000-sentence bank. Nothing is made up.
// ==============================================================================

import { VOCABULARY_ACADEMY_WORDS, VocabWord } from '../../data/vocabularyAcademyData';
import { MOVIE_SCENES_CATALOG } from '../../data/movieScenesData';
import { loadSentences, SentenceItem } from '../../services/sentencesService';

export interface WordPair {
  en: string;
  ar: string;
  exampleEn?: string;
}

export interface SentencePair {
  en: string;
  ar: string;
}

export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function sample<T>(arr: T[], n: number): T[] {
  return shuffle(arr).slice(0, Math.max(0, Math.min(n, arr.length)));
}

/** All word->meaning pairs on the platform: vocabulary academy + movie keywords. */
export function allWordPairs(): WordPair[] {
  const fromAcademy: WordPair[] = VOCABULARY_ACADEMY_WORDS.map((w: VocabWord) => ({
    en: w.word,
    ar: w.meaningAr,
    exampleEn: w.exampleEn,
  }));
  const fromScenes: WordPair[] = MOVIE_SCENES_CATALOG.flatMap((s) =>
    s.subtitles.flatMap((t) => t.keyWords.map((k) => ({ en: k.word, ar: k.meaningAr }))),
  );
  const seen = new Set<string>();
  return [...fromAcademy, ...fromScenes].filter((p) => {
    const key = p.en.toLowerCase();
    if (seen.has(key) || !p.en.trim() || !p.ar.trim()) return false;
    seen.add(key);
    return true;
  });
}

/** A matching board needs one owner per meaning, not only unique English words. */
export function uniqueMeaningPairs(words: WordPair[]): WordPair[] {
  const seen = new Set<string>();
  return words.filter((word) => {
    const meaning = word.ar.trim().normalize('NFKC');
    if (!meaning || seen.has(meaning)) return false;
    seen.add(meaning);
    return true;
  });
}

/** Movie-scene subtitle lines, always available synchronously. */
export function sceneSentencePairs(): SentencePair[] {
  return MOVIE_SCENES_CATALOG.flatMap((s) =>
    s.subtitles
      .filter((t) => t.en.trim() && t.arEg.trim())
      .map((t) => ({ en: t.en.trim(), ar: t.arEg.trim() })),
  );
}

/**
 * The 5,000-sentence bank (async, cached by sentencesService) reduced to the
 * word counts that work for arcade rounds.
 */
export async function bankSentencePairs(minWords = 3, maxWords = 9): Promise<SentencePair[]> {
  const items: SentenceItem[] = await loadSentences();
  return items
    .filter((s) => {
      const words = s.english.trim().split(/\s+/).length;
      return words >= minWords && words <= maxWords && s.arabicEg.trim();
    })
    .map((s) => ({ en: s.english.trim(), ar: s.arabicEg.trim() }));
}

/** Every sentence pool we have, movie lines first (they are the platform's face). */
export async function allSentencePairs(minWords = 3, maxWords = 9): Promise<SentencePair[]> {
  const scene = sceneSentencePairs().filter((p) => {
    const w = p.en.split(/\s+/).length;
    return w >= minWords && w <= maxWords;
  });
  const bank = await bankSentencePairs(minWords, maxWords);
  const seen = new Set<string>();
  return [...scene, ...bank].filter((p) => {
    const key = p.en.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export interface TrueFalseRound extends SentencePair { truth: boolean; }

/** A false answer must actually differ from this sentence's saved translation. */
export function buildTrueFalseRounds(pairs: SentencePair[], count: number): TrueFalseRound[] {
  const picks = sample(pairs, count);
  return picks.map((pair) => {
    const others = picks.filter((other) => other.ar.trim().normalize('NFKC') !== pair.ar.trim().normalize('NFKC'));
    if (Math.random() < 0.5 || !others.length) return { ...pair, truth: true };
    const fake = others[Math.floor(Math.random() * others.length)];
    return { en: pair.en, ar: fake.ar, truth: false };
  });
}

/** Vocabulary words whose example sentence actually contains the word. */
export interface GapItem {
  sentence: string; // with the word replaced by _____
  answer: string;
  distractors: string[];
  translationAr: string;
}

export function gapFillItems(count: number): GapItem[] {
  const usable = uniqueAcademyWords(VOCABULARY_ACADEMY_WORDS).filter((w) =>
    new RegExp(`\\b${w.word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i').test(w.exampleEn),
  );
  return sample(usable, count).map((w) => {
    const re = new RegExp(`\\b${w.word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
    const others = sample(
      usable.filter((o) => o.word.toLowerCase() !== w.word.toLowerCase()),
      3,
    ).map((o) => o.word);
    return {
      sentence: w.exampleEn.replace(re, '_____'),
      answer: w.word,
      distractors: others,
      translationAr: w.exampleAr,
    };
  });
}

/** Normalize free typing for the listening/spelling games. */
export function normalizeTyped(s: string): string {
  return s
    .toLowerCase()
    .replace(/[’‘]/g, "'")
    .replace(/[^a-z0-9'\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Ordered word accuracy. Added words and missing words both lower the score. */
export function wordAccuracy(target: string, typed: string): number {
  const t = normalizeTyped(target).split(' ').filter(Boolean);
  const a = normalizeTyped(typed).split(' ').filter(Boolean);
  if (!t.length || !a.length) return 0;
  // Longest common subsequence keeps repeated words and sentence order honest.
  // One row bounds memory even if a learner pastes a long answer.
  const matches = new Array<number>(t.length + 1).fill(0);
  for (const word of a) {
    let previous = 0;
    for (let i = 1; i <= t.length; i++) {
      const old = matches[i];
      matches[i] = word === t[i - 1] ? previous + 1 : Math.max(matches[i], matches[i - 1]);
      previous = old;
    }
  }
  return matches[t.length] / Math.max(t.length, a.length);
}

/** Avoid ambiguous repeated headwords and meanings in arcade decks/options. */
export function uniqueAcademyWords(words: VocabWord[], uniqueMeanings = false): VocabWord[] {
  const en = new Set<string>(), ar = new Set<string>();
  return words.filter(w => {
    const key = w.word.trim().toLowerCase(), meaning = w.meaningAr.trim();
    if (!key || !meaning || en.has(key) || (uniqueMeanings && ar.has(meaning))) return false;
    en.add(key); ar.add(meaning); return true;
  });
}
