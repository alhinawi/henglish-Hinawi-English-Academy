// ==============================================================================
// Henglish Academy (HENGLISH) - EXAM VOCAB SERVICE
// Chunked lazy-loaded exam vocabulary (IELTS / TOEFL).
// Chunk format + schema contract: scripts/check_exam_vocab_chunks.py
// Manifests: public/data/<exam>/vocab/vocab-index.json
// ==============================================================================

export type ExamId = 'ielts' | 'toefl';

export interface ExamVocabEntry {
  id: string;
  word: string;
  partOfSpeech: string;
  meaningAr: string;
  exampleEn: string;
  exampleAr: string;
  level: string;
  topic: string;
  band?: string;
  collocation?: string;
  noteAr?: string;
  synonyms?: string[];
  /** 1 = most common ... 5 = rare; missing treated as 3. */
  popularity?: number;
  source: string;
}

export interface ExamVocabIndex {
  exam: ExamId;
  idPrefix: string;
  totalEntries: number;
  chunkSize: number;
  chunks: string[];
  counts: {
    byLevel: Record<string, number>;
    byPos: Record<string, number>;
    byTopic: Record<string, number>;
  };
}

const indexCache: Partial<Record<ExamId, Promise<ExamVocabIndex>>> = {};
const chunkCache = new Map<string, Promise<ExamVocabEntry[]>>();

export function loadExamVocabIndex(exam: ExamId): Promise<ExamVocabIndex> {
  if (!indexCache[exam]) {
    indexCache[exam] = fetch(`/data/${exam}/vocab/vocab-index.json`).then((res) => {
      if (!res.ok) throw new Error(`Failed to load ${exam} index: ${res.status}`);
      return res.json() as Promise<ExamVocabIndex>;
    });
  }
  return indexCache[exam]!;
}

function loadChunk(exam: ExamId, file: string): Promise<ExamVocabEntry[]> {
  const key = `${exam}/${file}`;
  if (!chunkCache.has(key)) {
    chunkCache.set(
      key,
      fetch(`/data/${exam}/vocab/chunks/${file}`).then((res) => {
        if (!res.ok) throw new Error(`Failed to load ${exam} chunk ${file}: ${res.status}`);
        return res.json() as Promise<ExamVocabEntry[]>;
      })
    );
  }
  return chunkCache.get(key)!;
}

/** Load every chunk (banks are a few hundred KB - fine to hold in memory). */
export async function loadAllExamVocab(exam: ExamId): Promise<ExamVocabEntry[]> {
  const index = await loadExamVocabIndex(exam);
  const parts = await Promise.all(index.chunks.map((n) => loadChunk(exam, n)));
  return parts.flat();
}

export type ExamSortMode = 'popularity' | 'alpha';

export function sortExamVocab(entries: ExamVocabEntry[], mode: ExamSortMode): ExamVocabEntry[] {
  const sorted = [...entries];
  if (mode === 'alpha') {
    sorted.sort((a, b) => a.word.localeCompare(b.word, 'en'));
  } else {
    sorted.sort(
      (a, b) => (a.popularity ?? 3) - (b.popularity ?? 3) || a.word.localeCompare(b.word, 'en')
    );
  }
  return sorted;
}

export function filterExamVocab(
  entries: ExamVocabEntry[],
  query: string,
  level: string,
  topic: string,
  pos: string
): ExamVocabEntry[] {
  const q = query.trim().toLowerCase();
  return entries.filter((e) => {
    if (level !== 'all' && e.level !== level) return false;
    if (topic !== 'all' && e.topic !== topic) return false;
    if (pos !== 'all' && e.partOfSpeech !== pos) return false;
    if (!q) return true;
    return e.word.toLowerCase().includes(q) || e.meaningAr.includes(query.trim());
  });
}
