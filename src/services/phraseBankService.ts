import { fetchExampleSentenceBlock } from './exampleSentenceBlock';
// ==============================================================================
// Henglish Academy (HENGLISH) - PHRASE BANK SERVICE
// Chunked lazy-loaded phrase banks (idioms / slang / genz).
// Chunk format + schema contract: scripts/check_phrase_chunks.py
// Manifests: public/data/<bank>/<bank>-index.json
// ==============================================================================

export type PhraseBankId = 'idioms' | 'slang' | 'genz';

export type PhraseRegister = 'formal' | 'neutral' | 'informal' | 'vulgar' | 'offensive';
export type PhraseOrigin = 'US' | 'UK' | 'both' | 'global';

export interface PhraseEntry {
  id: string;
  phrase: string;
  meaningAr: string;
  exampleEn: string;
  exampleAr: string;
  register: PhraseRegister;
  origin: PhraseOrigin;
  /** 1 = most common ... 5 = rare; missing treated as 3. */
  popularity?: number;
  source: string;
}

export interface PhraseBankIndex {
  bank: PhraseBankId;
  idPrefix: string;
  totalEntries: number;
  chunkSize: number;
  chunks: string[];
  counts: {
    byRegister: Record<string, number>;
    byOrigin: Record<string, number>;
  };
}

const indexCache: Partial<Record<PhraseBankId, Promise<PhraseBankIndex>>> = {};
const chunkCache = new Map<string, Promise<PhraseEntry[]>>();

export function loadPhraseIndex(bank: PhraseBankId): Promise<PhraseBankIndex> {
  if (!indexCache[bank]) {
    indexCache[bank] = fetch(`/data/${bank}/${bank}-index.json`).then((res) => {
      if (!res.ok) throw new Error(`Failed to load ${bank} index: ${res.status}`);
      return res.json() as Promise<PhraseBankIndex>;
    }).catch((error) => {
      delete indexCache[bank];
      throw error;
    });
  }
  return indexCache[bank]!;
}

function loadChunk(bank: PhraseBankId, file: string): Promise<PhraseEntry[]> {
  const key = `${bank}/${file}`;
  if (!chunkCache.has(key)) {
    chunkCache.set(
      key,
      fetch(`/data/${bank}/chunks/${file}`).then((res) => {
        if (!res.ok) throw new Error(`Failed to load ${bank} chunk ${file}: ${res.status}`);
        return res.json() as Promise<PhraseEntry[]>;
      }).catch((error) => {
        chunkCache.delete(key);
        throw error;
      })
    );
  }
  return chunkCache.get(key)!;
}

/** Load the first N chunks (progressive browsing). */
export async function loadPhrasePrefix(bank: PhraseBankId, chunkCount: number): Promise<PhraseEntry[]> {
  const index = await loadPhraseIndex(bank);
  const names = index.chunks.slice(0, Math.max(0, chunkCount));
  const parts = await Promise.all(names.map((n) => loadChunk(bank, n)));
  return parts.flat();
}

/** Load every chunk (searching / filtering across the whole bank). */
export async function loadAllPhrases(bank: PhraseBankId): Promise<PhraseEntry[]> {
  const index = await loadPhraseIndex(bank);
  const parts = await Promise.all(index.chunks.map((n) => loadChunk(bank, n)));
  return parts.flat();
}

export type PhraseSortMode = 'popularity' | 'alpha';

export function sortPhrases(entries: PhraseEntry[], mode: PhraseSortMode): PhraseEntry[] {
  const sorted = [...entries];
  if (mode === 'alpha') {
    sorted.sort((a, b) => a.phrase.localeCompare(b.phrase, 'en'));
  } else {
    sorted.sort(
      (a, b) => (a.popularity ?? 3) - (b.popularity ?? 3) || a.phrase.localeCompare(b.phrase, 'en')
    );
  }
  return sorted;
}

// -----------------------------------------------------------------------------
// 10-sentence detail data (per-entry examples). Files cover 100 ids each:
// public/data/<bank>/sentences/<prefix>-sent-NNNNNN-NNNNNN.json
// Contract: scripts/check_phrase_sentences.py. Partial coverage is expected;
// callers fall back to the entry's built-in example.
// -----------------------------------------------------------------------------

export interface PhraseSentence {
  en: string;
  ar: string;
}

const sentenceBlockCache = new Map<string, Promise<Record<string, PhraseSentence[]> | null>>();

export async function loadPhraseSentences(
  bank: PhraseBankId,
  entryId: string
): Promise<PhraseSentence[] | null> {
  const index = await loadPhraseIndex(bank).catch(() => null);
  if (!index) return null;
  const numeric = parseInt(entryId.replace(`${index.idPrefix}-`, ''), 10);
  if (!Number.isFinite(numeric) || numeric < 1) return null;
  const lo = Math.floor((numeric - 1) / 100) * 100 + 1;
  const hi = lo + 99;
  const pad = (n: number) => String(n).padStart(6, '0');
  const file = `${index.idPrefix}-sent-${pad(lo)}-${pad(hi)}.json`;
  const key = `${bank}/${file}`;
  if (!sentenceBlockCache.has(key)) {
    sentenceBlockCache.set(
      key,
      fetchExampleSentenceBlock(`/data/${bank}/sentences/${file}`)
        .catch(() => { sentenceBlockCache.delete(key); return null; })
    );
  }
  const block = await sentenceBlockCache.get(key)!;
  return block?.[entryId] ?? null;
}

export function filterPhrases(
  entries: PhraseEntry[],
  query: string,
  register: PhraseRegister | 'all',
  origin: PhraseOrigin | 'all',
  tier: number | 'all' = 'all',
  translations?: Record<string, { m?: string; e?: string }> | null
): PhraseEntry[] {
  const q = query.trim().toLowerCase();
  return entries.filter((e) => {
    if (register !== 'all' && e.register !== register) return false;
    if (origin !== 'all' && e.origin !== origin) return false;
    if (tier !== 'all' && (e.popularity ?? 3) !== tier) return false;
    if (!q) return true;
    return [e.phrase, e.meaningAr, e.exampleEn, e.exampleAr, translations?.[e.id]?.m || '', translations?.[e.id]?.e || ''].some(text => text.toLowerCase().includes(q));
  });
}
