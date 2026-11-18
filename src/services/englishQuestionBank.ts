import type { BankQuestion } from './questionBankService';

export type EnglishQuestionOverlay = Partial<Pick<BankQuestion,
  'prompt' | 'options' | 'explanationAr' | 'passage' | 'audioText' | 'topic'>>;
export type EnglishQuestionMap = Record<string, EnglishQuestionOverlay>;
const fields = ['prompt', 'options', 'explanationAr', 'passage', 'audioText', 'topic'] as const;
const hasArabic = (value: unknown) => /[\u0600-\u06ff]/.test(JSON.stringify(value) ?? '');
let pending: Promise<EnglishQuestionMap> | null = null;

// Called only for the English question-bank view, alongside its lazy chunks.
// Reject incomplete maps rather than showing an Arabic flash or partial quiz.
export function validateEnglishQuestionMap(raw: unknown, questions: BankQuestion[]): EnglishQuestionMap {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) throw new Error('Invalid English question map');
  const map = raw as EnglishQuestionMap;
  const ids = new Set(questions.map(q => q.id));
  if (Object.keys(map).length !== ids.size || Object.keys(map).some(id => !ids.has(id))) throw new Error('Incomplete English question map');
  for (const q of questions) {
    const entry = map[q.id];
    if (!entry || typeof entry !== 'object' || Array.isArray(entry) || Object.keys(entry).some(k => !fields.includes(k as typeof fields[number]) && k !== 'answerIndex')) throw new Error('Invalid English question entry');
    const answerIndex = (entry as EnglishQuestionOverlay & {answerIndex?: unknown}).answerIndex;
    if (answerIndex !== undefined && answerIndex !== q.answerIndex) throw new Error('Changed answer index');
    for (const key of fields) {
      const value = entry[key];
      if (value === undefined) {
        if (hasArabic(q[key])) throw new Error('Missing English question field');
        continue;
      }
      if (key === 'options') {
        if (!Array.isArray(value) || value.length !== q.options.length || value.some(v => typeof v !== 'string' || !v.trim()) || new Set(value).size !== value.length) throw new Error('Invalid English options');
      } else if (typeof value !== 'string' || !value.trim()) throw new Error('Invalid English text');
      if (hasArabic(value)) throw new Error('Arabic in English question field');
    }
  }
  return map;
}

export function loadEnglishQuestionMap(questions: BankQuestion[]): Promise<EnglishQuestionMap> {
  if (!pending) {
    pending = (async () => {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 30000);
      try {
        const response = await fetch('/data/questions/i18n/en.json', {signal: controller.signal});
        if (!response.ok) throw new Error('English question map unavailable');
        return validateEnglishQuestionMap(await response.json(), questions);
      } finally { clearTimeout(timer); }
    })().catch(error => { pending = null; throw error; });
  }
  return pending;
}

export function englishBankQuestion(q: BankQuestion, map: EnglishQuestionMap): BankQuestion {
  const entry = map[q.id];
  if (!entry) throw new Error('Missing English question');
  // Never spread answerIndex, id or other source metadata from an overlay.
  const translated = {...q};
  for (const key of fields) {
    if (key === 'options') translated.options = entry.options ?? q.options;
    else if (entry[key] !== undefined) translated[key] = entry[key];
  }
  return translated;
}
