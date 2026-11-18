export interface ExampleSentence { en: string; ar: string; }

// Sentence packs are optional. Only a real missing file is a cacheable absence;
// network/server/malformed responses must allow a later open to try again.
export async function fetchExampleSentenceBlock(url: string): Promise<Record<string, ExampleSentence[]> | null> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30000);
  try {
    const response = await fetch(url, { signal: controller.signal });
    if (response.status === 404) return null;
    if (!response.ok) throw new Error('Example pack could not load');
    const data: unknown = await response.json();
    if (!data || typeof data !== 'object' || !Array.isArray((data as { items?: unknown }).items)) throw new Error('Invalid example pack');
    const map: Record<string, ExampleSentence[]> = Object.create(null);
    for (const item of (data as { items: unknown[] }).items) {
      if (!item || typeof item !== 'object') throw new Error('Invalid example entry');
      const row = item as { id?: unknown; sentences?: unknown };
      if (typeof row.id !== 'string' || !row.id.trim() || Object.hasOwn(map, row.id)
        || !Array.isArray(row.sentences) || row.sentences.length !== 10) throw new Error('Invalid example entry');
      for (const sentence of row.sentences) {
        if (!sentence || typeof sentence !== 'object'
          || typeof sentence.en !== 'string' || !sentence.en.trim()
          || typeof sentence.ar !== 'string' || !sentence.ar.trim()) throw new Error('Invalid example sentence');
      }
      map[row.id] = row.sentences;
    }
    return map;
  } finally { clearTimeout(timeout); }
}
