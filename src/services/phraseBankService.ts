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

export function filterPhrases(
  entries: PhraseEntry[],
  query: string,
  register: PhraseRegister | 'all',
  origin: PhraseOrigin | 'all'
): PhraseEntry[] {
  const q = query.trim().toLowerCase();
  return entries.filter((e) => {
    if (register !== 'all' && e.register !== register) return false;
    if (origin !== 'all' && e.origin !== origin) return false;
    if (!q) return true;
    return (
      e.phrase.toLowerCase().includes(q) ||
      e.meaningAr.includes(query.trim()) ||
      e.exampleEn.toLowerCase().includes(q)
    );
  });
}
