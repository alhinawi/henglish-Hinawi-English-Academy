import type { CEFRLevel, LexicalEntry } from './vocabularyService';

// Validate the whole JSON batch before any saved-word write occurs.
export function parseVocabularyImport(text: string): LexicalEntry[] {
  const parsed: unknown = JSON.parse(text);
  if (!Array.isArray(parsed) || parsed.length === 0) throw new Error('Invalid import');
  const seen = new Set<string>();
  const levels = ['A1','A2','B1','B2','C1','C2','Unclassified'];
  return parsed.map((item, index) => {
    if (!item || typeof item !== 'object' || Array.isArray(item)) throw new Error('Invalid import');
    const field = (key: string): string => {
      if (item[key] === undefined) return '';
      if (typeof item[key] !== 'string') throw new Error('Invalid import');
      return item[key].trim();
    };
    const headword = field('headword'), meaningAr = field('meaningAr');
    const normalized = headword.toLowerCase();
    if (!headword || !meaningAr || seen.has(normalized)) throw new Error('Invalid import');
    seen.add(normalized);
    const cefr = field('cefr') || 'Unclassified';
    if (!levels.includes(cefr)) throw new Error('Invalid import');
    return {
      id: field('id') || `bulk-${Date.now()}-${index}`, headword, normalized,
      meaningAr, cefr: cefr as CEFRLevel, pos: field('pos'),
      ipaUs: field('ipaUs'), ipaUk: field('ipaUk'),
      audioUsUrl: field('audioUsUrl') || undefined, audioUkUrl: field('audioUkUrl') || undefined,
      frequencyTier: field('frequencyTier'), domain: field('domain') || 'custom',
      formality: field('formality'), definitionEn: field('definitionEn'),
      exampleEn: field('exampleEn'), exampleAr: field('exampleAr'),
    };
  });
}
