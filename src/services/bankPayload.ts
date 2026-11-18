const text = (value: unknown): value is string => typeof value === 'string' && Boolean(value.trim());
export async function fetchBankPayload(url: string): Promise<unknown> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30000);
  try {
    const response = await fetch(url, { signal: controller.signal });
    if (!response.ok) throw new Error('Bank download failed');
    return await response.json();
  } finally { clearTimeout(timeout); }
}
export function validateBankIndex<T>(value: unknown, kind: 'bank' | 'exam', owner: string): T {
  if (!value || typeof value !== 'object') throw new Error('Invalid bank index');
  const data = value as Record<string, unknown>;
  if (data[kind] !== owner || !text(data.idPrefix) || !/^[a-z-]+$/.test(data.idPrefix)
    || !Number.isInteger(data.totalEntries) || Number(data.totalEntries) <= 0
    || !Array.isArray(data.chunks) || !data.chunks.length
    || !data.chunks.every(file => typeof file === 'string' && /^[a-z]{1,3}\d{6}-\d{6}\.json$/.test(file))
    || new Set(data.chunks).size !== data.chunks.length) throw new Error('Invalid bank index');
  return value as T;
}
export function validateBankRows<T>(value: unknown, kind: 'phrase' | 'word'): T[] {
  if (!Array.isArray(value) || !value.length) throw new Error('Invalid bank chunk');
  const fields = ['id', kind, 'meaningAr', 'exampleEn', 'exampleAr', 'source', ...(kind === 'phrase' ? ['register', 'origin'] : ['partOfSpeech', 'level', 'topic'])];
  for (const row of value) {
    if (!row || typeof row !== 'object' || !fields.every(key => text(row[key]))
      || row.popularity !== undefined && (!Number.isInteger(row.popularity) || row.popularity < 1 || row.popularity > 5)
      || kind === 'phrase' && (!['formal', 'neutral', 'informal', 'vulgar', 'offensive'].includes(row.register) || !['US', 'UK', 'both', 'global'].includes(row.origin))
      || kind === 'word' && (!['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].includes(row.level)
        || ['band', 'collocation', 'noteAr'].some(key => row[key] !== undefined && typeof row[key] !== 'string')
        || row.synonyms !== undefined && (!Array.isArray(row.synonyms) || !row.synonyms.every(text)))) throw new Error('Invalid bank entry');
  }
  if (new Set(value.map(row => row.id)).size !== value.length) throw new Error('Duplicate bank entries');
  return value as T[];
}
export function validateWholeBank<T extends { id: string }>(rows: T[], total: number): T[] {
  if (rows.length !== total || new Set(rows.map(row => row.id)).size !== rows.length) throw new Error('Incomplete bank');
  return rows;
}
