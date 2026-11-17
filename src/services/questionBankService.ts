// ==============================================================================
// Henglish Academy (HENGLISH) - QUESTION BANK SERVICE
// Chunked lazy-loaded question bank with per-user random draw:
// every session serves a different set; no question repeats until the whole
// matching pool has been served (served ids live in localStorage).
// Chunk format + schema contract: scripts/check_question_chunks.py
// ==============================================================================

export type QuestionSkill = 'vocabulary' | 'grammar' | 'reading' | 'listening' | 'usage' | string;
export type QuestionType = 'multiple-choice' | 'fill-blank' | 'true-false';
export type QuestionLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

export interface BankQuestion {
  id: string;
  skill: QuestionSkill;
  type: QuestionType;
  level: QuestionLevel;
  prompt: string;
  promptAr: string;
  options: string[];
  answerIndex: number;
  explanationAr: string;
  topic: string;
  source: string;
  /** Reading-comprehension text the question refers to (reading skill). */
  passage?: string;
  /** Listening transcript the question refers to (listening skill). */
  audioText?: string;
}

interface QuestionIndex {
  totalQuestions: number;
  chunkSize: number;
  chunks: string[];
  counts: {
    byLevel: Record<string, number>;
    bySkill: Record<string, number>;
    byType: Record<string, number>;
    bySource: Record<string, number>;
  };
}

export interface DrawOptions {
  count: number;
  skill?: QuestionSkill;
  level?: QuestionLevel | 'all';
  type?: QuestionType | 'all';
}

const INDEX_URL = '/data/questions/questions-index.json';
const CHUNKS_BASE = '/data/questions/chunks/';
const SERVED_KEY = 'henglish_qbank_served_v1';
const FETCH_BATCH = 24;

let cachedIndex: QuestionIndex | null = null;
let cachedQuestions: BankQuestion[] = [];
let fullLoadingPromise: Promise<BankQuestion[]> | null = null;

function isBankQuestion(value: unknown): value is BankQuestion {
  if (!value || typeof value !== 'object') return false;
  const q = value as BankQuestion;
  const text = (v: unknown) => typeof v === 'string' && v.trim().length > 0;
  return [q.id, q.skill, q.prompt, q.promptAr, q.explanationAr, q.topic, q.source].every(text)
    && ['multiple-choice', 'fill-blank', 'true-false'].includes(q.type)
    && ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].includes(q.level)
    && Array.isArray(q.options) && q.options.length >= 2 && q.options.every(text)
    && new Set(q.options).size === q.options.length
    && Number.isInteger(q.answerIndex) && q.answerIndex >= 0 && q.answerIndex < q.options.length
    && (q.passage === undefined || text(q.passage)) && (q.audioText === undefined || text(q.audioText));
}

export async function loadQuestionIndex(): Promise<QuestionIndex> {
  if (cachedIndex) return cachedIndex;
  const res = await fetch(INDEX_URL);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const index = await res.json() as QuestionIndex;
  if (!index || !Number.isInteger(index.totalQuestions) || index.totalQuestions <= 0
    || !Array.isArray(index.chunks) || !index.chunks.length
    || !index.chunks.every(name => typeof name === 'string' && /^q\d{6}-\d{6}\.json$/.test(name))
    || new Set(index.chunks).size !== index.chunks.length) throw new Error('Invalid question index');
  cachedIndex = index;
  return index;
}

export async function loadAllQuestions(): Promise<BankQuestion[]> {
  if (cachedQuestions.length > 0) return cachedQuestions;
  if (fullLoadingPromise) return fullLoadingPromise;

  fullLoadingPromise = (async () => {
    try {
      const index = await loadQuestionIndex();
      const all: BankQuestion[] = [];
      for (let i = 0; i < index.chunks.length; i += FETCH_BATCH) {
        const batch = index.chunks.slice(i, i + FETCH_BATCH);
        const parts = await Promise.all(
          batch.map(async name => {
            const res = await fetch(`${CHUNKS_BASE}${name}`);
            if (!res.ok) throw new Error(`HTTP ${res.status} for ${name}`);
            const questions: unknown = await res.json();
            if (!Array.isArray(questions) || !questions.length || !questions.every(isBankQuestion)) throw new Error('Invalid question chunk');
            return questions as BankQuestion[];
          })
        );
        parts.forEach(p => all.push(...p));
      }
      if (all.length !== index.totalQuestions || new Set(all.map(q => q.id)).size !== all.length) throw new Error('Incomplete question bank');
      cachedQuestions = all;
      return cachedQuestions;
    } catch (error) {
      cachedIndex = null;
      throw error;
    } finally {
      fullLoadingPromise = null;
    }
  })();

  return fullLoadingPromise;
}

export function getLoadedQuestionCount(): number {
  return cachedQuestions.length;
}

// ---------------------------------------------------------------------------
// Served-history store: per user, per pool. A pool is the (skill|level|type)
// combination, so a vocab A2 run never consumes the grammar B1 pool.
// ---------------------------------------------------------------------------

type ServedStore = Record<string, string[]>;

export function questionHistoryKey(learnerId?: string): string {
  const owner = learnerId && !learnerId.startsWith('guest-') && !learnerId.startsWith('demo-')
    ? `user:${encodeURIComponent(learnerId)}` : 'guest';
  return `${SERVED_KEY}:${owner}`;
}

function parseServed(raw: string | null): ServedStore {
  if (raw === null) return {};
  const value: unknown = JSON.parse(raw);
  if (!value || typeof value !== 'object' || Array.isArray(value)
    || !Object.values(value).every(ids => Array.isArray(ids) && ids.every(id => typeof id === 'string'))) throw new Error('Invalid question history');
  return value as ServedStore;
}

function readServed(learnerId?: string): ServedStore {
  // The old browser-wide history belongs to guest only. Preserve its bytes.
  try {
    const guestKey = questionHistoryKey();
    if (localStorage.getItem(guestKey) === null) {
      const legacy = localStorage.getItem(SERVED_KEY);
      if (legacy !== null) { parseServed(legacy); localStorage.setItem(guestKey, legacy); }
    }
  } catch { /* Guest recovery must never hide an owner's valid history. */ }
  return parseServed(localStorage.getItem(questionHistoryKey(learnerId)));
}

function writeServed(store: ServedStore, learnerId?: string): void {
  localStorage.setItem(questionHistoryKey(learnerId), JSON.stringify(store));
}

function poolKey(opts: DrawOptions): string {
  return `${opts.skill ?? 'all'}|${opts.level ?? 'all'}|${opts.type ?? 'all'}`;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Draw `count` random questions matching the filter, different every time:
 * questions already served to this user are excluded until the matching pool
 * is exhausted, then the pool resets and a fresh cycle starts.
 */
export function drawQuestions(all: BankQuestion[], opts: DrawOptions, learnerId?: string): BankQuestion[] {
  const { count, skill, level = 'all', type = 'all' } = opts;
  const pool = all.filter(
    q =>
      (!skill || q.skill === skill) &&
      (level === 'all' || q.level === level) &&
      (type === 'all' || q.type === type)
  );
  if (pool.length === 0 || count <= 0) return [];

  const key = poolKey(opts);
  const store = readServed(learnerId);
  const served = new Set(store[key] ?? []);
  const fresh = pool.filter(q => !served.has(q.id));
  const requested = Math.min(count, pool.length);
  let drawn: BankQuestion[];

  if (fresh.length < requested) {
    // Finish the old cycle before repeating anything. Do not repeat a tail
    // question within this draw when filling from the next cycle.
    const tail = shuffle(fresh);
    const tailIds = new Set(tail.map(q => q.id));
    const nextCycle = shuffle(pool.filter(q => !tailIds.has(q.id)))
      .slice(0, requested - tail.length);
    drawn = [...tail, ...nextCycle];
    store[key] = nextCycle.map(q => q.id);
  } else {
    drawn = shuffle(fresh).slice(0, requested);
    store[key] = [...(store[key] ?? []), ...drawn.map(q => q.id)];
  }

  writeServed(store, learnerId);
  return drawn;
}

/** Clear served history (all pools, or one pool when a filter is given). */
export function resetServedQuestions(opts?: DrawOptions, learnerId?: string): void {
  const store = readServed(learnerId);
  if (!opts) { writeServed({}, learnerId); return; }
  delete store[poolKey(opts)];
  writeServed(store, learnerId);
}
