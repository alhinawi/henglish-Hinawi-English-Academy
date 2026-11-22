import { extractDocxDocumentText, extractPdfDocumentText } from './documentTextExtraction';
import { mediaStorageKey, readMediaList } from './accountMediaStorage';
// ==============================================================================
// Henglish Academy (HENGLISH) - TRANSLATION STUDIO CLIENT SERVICE
// High-performance client manager for Translations, History, SRS Decks, OCR & Practice
// ==============================================================================

import {
  TranslationRequest,
  TranslationResponse,
  TranslationHistoryItem,
  SavedVocabularyCard,
  VocabularyCollection,
  PracticeChallenge,
  OcrResult,
  LanguageCode,
  TranslationMode,
} from '../types/translation';
import { CEFRLevel } from '../types';
import { throwForAiResponse } from './aiAvailability';
import { saveSrsCardsToStorage, loadSrsCardsFromStorage, VocabularyCard } from './spacedRepetitionService';

const STORAGE_KEY_HISTORY = 'henglish_translation_history_v1';
const STORAGE_KEY_SAVED_VOCAB = 'henglish_translation_saved_vocab_v1';
const STORAGE_KEY_COLLECTIONS = 'henglish_translation_collections_v1';
const STORAGE_KEY_PRACTICE_STATS = 'henglish_translation_practice_stats_v1';

// Default starter collections
const DEFAULT_COLLECTIONS: VocabularyCollection[] = [
  {
    id: 'col-business',
    name: 'Business & Career',
    nameAr: 'إنجليزي الأعمال والشركات',
    description: 'مصطلحات وتعبيرات مهنية للاجتماعات والمراسلات الرسمية',
    color: '#ffb84d',
    icon: 'briefcase',
    cardCount: 0,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'col-idioms',
    name: 'Idioms & Phrasal Verbs',
    nameAr: 'تعبيرات واصطلاحات متقدمة',
    description: 'أفعال مركبة وتعبيرات مجازية شائعة بين المتحدثين الأصليين',
    color: '#a855f7',
    icon: 'sparkles',
    cardCount: 0,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'col-daily',
    name: 'Daily Spoken English',
    nameAr: 'محادثات الحياة اليومية',
    description: 'عبارات سريعة وتراكيب حوارية للمواقف الواقعية',
    color: '#41e7ff',
    icon: 'message-circle',
    cardCount: 0,
    createdAt: new Date().toISOString(),
  },
];

// Optional provider material is still untrusted: its panels render strings and
// iterate arrays, and word tokens can become saved vocabulary.
function validateTranslationLearningPayload(value: unknown): void {
  const object = (item: unknown): item is Record<string, unknown> =>
    !!item && typeof item === 'object' && !Array.isArray(item);
  const strings = (item: Record<string, unknown>, keys: string[]) =>
    keys.every(key => item[key] === undefined || typeof item[key] === 'string');
  const list = (item: unknown, valid: (entry: unknown) => boolean) =>
    item === undefined || (Array.isArray(item) && item.every(valid));
  const word = (item: unknown) => object(item) &&
    typeof item.word === 'string' && !!item.word.trim() &&
    typeof item.cleanWord === 'string' && !!item.cleanWord.trim() &&
    strings(item, ['meaningAr', 'partOfSpeech', 'partOfSpeechAr', 'ipa', 'cefrLevel', 'exampleEn', 'exampleAr']) &&
    ['synonyms', 'antonyms', 'collocations', 'relatedTerms'].every(key => list(item[key], entry => typeof entry === 'string'));
  if (!object(value)) throw new Error('Invalid translation learning material');
  const explanation = value.explanation;
  const validExplanation = explanation === undefined || explanation === null ||
    (object(explanation) && strings(explanation, ['summaryMeaningAr', 'cefrLevel', 'culturalContextAr', 'translationRationaleAr']) &&
      list(explanation.grammarNotes, entry => object(entry) && strings(entry, ['structureName', 'structureNameAr', 'category', 'explanationAr', 'ruleFormula', 'targetContrastAr'])) &&
      list(explanation.importantVocabulary, word) &&
      list(explanation.idiomsAndExpressions, entry => object(entry) && strings(entry, ['idiom', 'literalMeaningAr', 'actualMeaningAr', 'example'])) &&
      list(explanation.commonTrapsAr, entry => object(entry) && strings(entry, ['trapEn', 'wrongAr', 'correctAr', 'whyTrapAr'])));
  if (!validExplanation || !list(value.wordTokens, word) ||
      !list(value.alternatives, entry => object(entry) && typeof entry.translation === 'string' && !!entry.translation.trim() &&
        strings(entry, ['styleLabel', 'styleLabelAr', 'whenToUseAr']))) {
    throw new Error('Invalid translation learning material');
  }
}

/**
 * High-Level Translation Dispatcher
 */
export async function executeTranslation(req: TranslationRequest, learnerId?: string, signal?: AbortSignal): Promise<TranslationResponse> {
  const response = await fetch('/api/ai/translate', {
    signal,
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(req),
  });

  await throwForAiResponse(response, `Translation failed with status ${response.status}`);

  const payload: unknown = await response.json();
  if (!payload || typeof payload !== 'object' || Array.isArray(payload) ||
      typeof (payload as { translatedText?: unknown }).translatedText !== 'string' ||
      !(payload as { translatedText: string }).translatedText.trim()) {
    throw new Error('Translation returned no usable output');
  }
  validateTranslationLearningPayload(payload);
  const result = payload as TranslationResponse;

  // Automatically record to local history
  let historySaved = true;
  try { saveTranslationToHistory({
    sourceText: req.text,
    translatedText: result.translatedText,
    sourceLang: req.sourceLang,
    targetLang: req.targetLang,
    mode: req.mode,
    isFavorite: false,
    alternativesCount: result.alternatives?.length || 0,
    summaryExplanationAr: result.explanation?.summaryMeaningAr,
  }, learnerId); } catch { historySaved = false; }

  return { ...result, historySaved };
}

/**
 * Ask Translation Assistant
 */
export async function askTranslationAssistant(
  question: string,
  context: {
    originalText: string;
    translatedText: string;
    sourceLang: string;
    targetLang: string;
    mode: string;
    userLevel?: CEFRLevel;
  },
  signal?: AbortSignal
): Promise<{ answer: string; suggestedAlternative?: string }> {
  const response = await fetch('/api/ai/assistant', {
    signal,
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question, context }),
  });

  await throwForAiResponse(response, 'Failed to consult translation assistant');

  const result: unknown = await response.json();
  if (!result || typeof result !== 'object' || Array.isArray(result) ||
      typeof (result as { answer?: unknown }).answer !== 'string' ||
      !(result as { answer: string }).answer.trim()) {
    throw new Error('Translation assistant returned no usable answer');
  }
  return result as { answer: string; suggestedAlternative?: string };
}

/**
 * Image OCR & Translation
 */
export async function performImageOcrTranslation(
  imageBase64: string,
  mimeType: string,
  targetLang: LanguageCode,
  signal?: AbortSignal
): Promise<OcrResult> {
  const response = await fetch('/api/ai/ocr-translate', {
    signal,
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ imageBase64, mimeType, targetLang }),
  });

  await throwForAiResponse(response, 'OCR text recognition failed');

  const result: unknown = await response.json();
  if (!result || typeof result !== 'object' || Array.isArray(result) ||
      typeof (result as { extractedText?: unknown }).extractedText !== 'string' ||
      !(result as { extractedText: string }).extractedText.trim() ||
      ((result as { translatedText?: unknown }).translatedText !== undefined &&
       typeof (result as { translatedText?: unknown }).translatedText !== 'string')) {
    throw new Error('OCR returned no usable extracted text');
  }
  return result as OcrResult;
}

/**
 * Audio Speech Transcription
 */
export async function transcribeAudioRecording(
  audioBase64: string,
  mimeType: string,
  signal?: AbortSignal
): Promise<{ transcription: string; detectedLang: LanguageCode }> {
  const response = await fetch('/api/ai/voice-transcribe', {
    signal,
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ audioBase64, mimeType }),
  });

  await throwForAiResponse(response, 'Voice transcription failed');

  const result: unknown = await response.json();
  if (!result || typeof result !== 'object' || Array.isArray(result) ||
      typeof (result as { transcription?: unknown }).transcription !== 'string' ||
      !(result as { transcription: string }).transcription.trim()) {
    throw new Error('Voice transcription returned no usable text');
  }
  return result as { transcription: string; detectedLang: LanguageCode };
}

// ==============================================================================
// LOCAL STORAGE MANAGEMENT (History, Vocabulary, Collections)
// ==============================================================================

export function getTranslationHistory(learnerId?: string): TranslationHistoryItem[] {
  return readMediaList(STORAGE_KEY_HISTORY, learnerId).filter((item): item is TranslationHistoryItem =>
    !!item && typeof item === 'object' && typeof (item as TranslationHistoryItem).id === 'string' &&
    typeof (item as TranslationHistoryItem).sourceText === 'string' && typeof (item as TranslationHistoryItem).translatedText === 'string');
}

function readHistoryForWrite(learnerId?: string): TranslationHistoryItem[] {
  // Let guest migration run, then refuse to overwrite an unreadable owner copy.
  getTranslationHistory(learnerId);
  const raw = localStorage.getItem(mediaStorageKey(STORAGE_KEY_HISTORY, learnerId));
  if (raw === null) return [];
  const parsed: unknown = JSON.parse(raw);
  if (!Array.isArray(parsed) || parsed.some(item => !item || typeof item !== 'object' || typeof item.id !== 'string' || typeof item.sourceText !== 'string' || typeof item.translatedText !== 'string')) throw new Error('Saved history is unreadable');
  return parsed;
}

export function saveTranslationToHistory(
  item: Omit<TranslationHistoryItem, 'id' | 'timestamp'>, learnerId?: string
): TranslationHistoryItem {
  const history = readHistoryForWrite(learnerId);
  const newItem: TranslationHistoryItem = {
    ...item,
    id: `trans_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    timestamp: new Date().toISOString(),
  };

  // Avoid saving immediate duplicates
  const filtered = history.filter(
    h => !(h.sourceText === newItem.sourceText && h.mode === newItem.mode && h.targetLang === newItem.targetLang)
  );

  const updated = [newItem, ...filtered].slice(0, 100); // Keep last 100 items
  localStorage.setItem(mediaStorageKey(STORAGE_KEY_HISTORY, learnerId), JSON.stringify(updated));
  return newItem;
}

export function toggleHistoryFavorite(id: string, learnerId?: string): TranslationHistoryItem[] {
  const history = readHistoryForWrite(learnerId);
  const updated = history.map(item => (item.id === id ? { ...item, isFavorite: !item.isFavorite } : item));
  localStorage.setItem(mediaStorageKey(STORAGE_KEY_HISTORY, learnerId), JSON.stringify(updated));
  return updated;
}

export function deleteHistoryItem(id: string, learnerId?: string): TranslationHistoryItem[] {
  const history = readHistoryForWrite(learnerId);
  const updated = history.filter(item => item.id !== id);
  localStorage.setItem(mediaStorageKey(STORAGE_KEY_HISTORY, learnerId), JSON.stringify(updated));
  return updated;
}

export function clearTranslationHistory(learnerId?: string): void {
  localStorage.setItem(mediaStorageKey(STORAGE_KEY_HISTORY, learnerId), '[]');
}

// ==============================================================================
// SAVED VOCABULARY & SPACED REPETITION INTEGRATION
// ==============================================================================

export function getSavedVocabularyCards(learnerId?: string): SavedVocabularyCard[] {
  return readMediaList(STORAGE_KEY_SAVED_VOCAB, learnerId).filter((item): item is SavedVocabularyCard =>
    !!item && typeof item === 'object' && typeof (item as SavedVocabularyCard).id === 'string' &&
    typeof (item as SavedVocabularyCard).wordOrPhrase === 'string');
}

function readSavedVocabularyForWrite(learnerId?: string): SavedVocabularyCard[] {
  getSavedVocabularyCards(learnerId);
  const raw = localStorage.getItem(mediaStorageKey(STORAGE_KEY_SAVED_VOCAB, learnerId));
  if (raw === null) return [];
  const parsed: unknown = JSON.parse(raw);
  if (!Array.isArray(parsed) || parsed.some(item => !item || typeof item !== 'object' || typeof item.id !== 'string' || typeof item.wordOrPhrase !== 'string')) throw new Error('Saved vocabulary is unreadable');
  return parsed;
}

export function saveVocabularyCard(
  card: Omit<SavedVocabularyCard, 'id' | 'createdAt' | 'repetitionCount' | 'intervalDays' | 'easeFactor' | 'nextReviewAt'>, learnerId?: string
): SavedVocabularyCard & { reviewSynced: boolean } {
  const existing = readSavedVocabularyForWrite(learnerId);
  const newCard: SavedVocabularyCard = {
    ...card,
    id: `vocab_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    repetitionCount: 0,
    intervalDays: 1,
    easeFactor: 2.5,
    nextReviewAt: new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
    createdAt: new Date().toISOString(),
  };

  const updated = [newCard, ...existing.filter(c => c.wordOrPhrase.toLowerCase() !== card.wordOrPhrase.toLowerCase())];
  // Primary save failure must reach the UI before any dependent writes.
  localStorage.setItem(mediaStorageKey(STORAGE_KEY_SAVED_VOCAB, learnerId), JSON.stringify(updated));
  let reviewSynced = false;

  // Seamlessly bridge to Henglish Global SRS Vocabulary system
  try {
    const globalSrsCards = loadSrsCardsFromStorage(learnerId, true);
    const bridgedCard: VocabularyCard = {
      id: newCard.id,
      word: newCard.wordOrPhrase,
      ipa: newCard.ipa || '',
      translationAr: newCard.translationAr,
      category: newCard.collectionName || 'Translation Studio',
      cefrLevel: newCard.cefrLevel,
      exampleEn: newCard.exampleEn || '',
      exampleAr: newCard.exampleAr || '',
      repetitionCount: 0,
      intervalDays: 1,
      easeFactor: 2.5,
      nextReviewAt: newCard.nextReviewAt,
    };
    reviewSynced = saveSrsCardsToStorage([bridgedCard, ...globalSrsCards.filter(c => c.word.toLowerCase() !== bridgedCard.word.toLowerCase())], learnerId);
  } catch (err) {
    console.warn('Could not sync to global SRS:', err);
  }

  // Update collection count
  const previous = existing.find(c => c.wordOrPhrase.toLowerCase() === card.wordOrPhrase.toLowerCase());
  if (previous?.collectionId !== card.collectionId) {
    if (previous?.collectionId) decrementCollectionCount(previous.collectionId, learnerId);
    if (card.collectionId) incrementCollectionCount(card.collectionId, learnerId);
  }

  return { ...newCard, reviewSynced };
}

export function deleteSavedVocabularyCard(id: string, learnerId?: string): SavedVocabularyCard[] {
  const cards = readSavedVocabularyForWrite(learnerId);
  const target = cards.find(c => c.id === id);
  const updated = cards.filter(c => c.id !== id);

  localStorage.setItem(mediaStorageKey(STORAGE_KEY_SAVED_VOCAB, learnerId), JSON.stringify(updated));

  if (target?.collectionId) {
    decrementCollectionCount(target.collectionId, learnerId);
  }

  return updated;
}

// ==============================================================================
// CUSTOM COLLECTIONS
// ==============================================================================

export function getVocabularyCollections(learnerId?: string): VocabularyCollection[] {
  if (typeof window === 'undefined') return DEFAULT_COLLECTIONS;
  const list = readMediaList(STORAGE_KEY_COLLECTIONS, learnerId);
  try { if (localStorage.getItem(mediaStorageKey(STORAGE_KEY_COLLECTIONS, learnerId)) === null) return DEFAULT_COLLECTIONS; } catch { return DEFAULT_COLLECTIONS; }
  return list.filter((item): item is VocabularyCollection => !!item && typeof item === 'object' &&
    typeof (item as VocabularyCollection).id === 'string' && typeof (item as VocabularyCollection).name === 'string');
}

export function createVocabularyCollection(
  name: string,
  nameAr: string,
  description?: string,
  color?: string,
  learnerId?: string
): VocabularyCollection {
  const collections = getVocabularyCollections(learnerId);
  const raw = localStorage.getItem(mediaStorageKey(STORAGE_KEY_COLLECTIONS, learnerId));
  if (raw !== null && !Array.isArray(JSON.parse(raw))) throw new Error('Saved collections are unreadable');
  const newCol: VocabularyCollection = {
    id: `col_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`,
    name,
    nameAr,
    description,
    color: color || '#41e7ff',
    icon: 'folder',
    cardCount: 0,
    createdAt: new Date().toISOString(),
  };

  const updated = [...collections, newCol];
  localStorage.setItem(mediaStorageKey(STORAGE_KEY_COLLECTIONS, learnerId), JSON.stringify(updated));
  return newCol;
}

export function deleteVocabularyCollection(id: string, learnerId?: string): VocabularyCollection[] {
  const collections = getVocabularyCollections(learnerId);
  const updated = collections.filter(c => c.id !== id);
  try {
    localStorage.setItem(mediaStorageKey(STORAGE_KEY_COLLECTIONS, learnerId), JSON.stringify(updated));
  } catch {}
  return updated;
}

function incrementCollectionCount(collectionId: string, learnerId?: string) {
  const cols = getVocabularyCollections(learnerId);
  const updated = cols.map(c => (c.id === collectionId ? { ...c, cardCount: c.cardCount + 1 } : c));
  try {
    localStorage.setItem(mediaStorageKey(STORAGE_KEY_COLLECTIONS, learnerId), JSON.stringify(updated));
  } catch {}
}

function decrementCollectionCount(collectionId: string, learnerId?: string) {
  const cols = getVocabularyCollections(learnerId);
  const updated = cols.map(c => (c.id === collectionId ? { ...c, cardCount: Math.max(0, c.cardCount - 1) } : c));
  try {
    localStorage.setItem(mediaStorageKey(STORAGE_KEY_COLLECTIONS, learnerId), JSON.stringify(updated));
  } catch {}
}

// ==============================================================================
// DOCUMENT TEXT EXTRACTION & CHUNKING (TXT, PDF, DOCX)
// ==============================================================================

/**
 * Format-aware document text extractor
 */
export async function extractTextFromDocument(file: File): Promise<{ text: string; chunks: string[] }> {
  const extension = file.name.split('.').pop()?.toLowerCase();

  let extractedText = '';

  if (extension === 'txt') {
    extractedText = await file.text();
  } else if (extension === 'docx') {
    // DOCX XML Extraction
    extractedText = await extractDocxDocumentText(file);
  } else if (extension === 'pdf') {
    // PDF extraction via text streams or buffer decoding
    extractedText = await extractPdfDocumentText(file);
  } else {
    // Fallback attempt text reading
    extractedText = await file.text();
  }

  if (!extractedText.trim()) throw new Error('The document contains no readable text.');

  // Preserve paragraphs, headers, and bullet lists
  const cleanedText = extractedText.replace(/\r\n/g, '\n').trim();

  // Intelligent paragraph chunking (splits into natural paragraphs of 150-400 words)
  const paragraphs = cleanedText.split(/\n\s*\n/).filter(p => p.trim().length > 0);
  const chunks: string[] = [];

  let currentChunk = '';
  for (const para of paragraphs) {
    if (currentChunk.length + para.length > 1200) {
      if (currentChunk.trim()) chunks.push(currentChunk.trim());
      currentChunk = para;
    } else {
      currentChunk = currentChunk ? `${currentChunk}\n\n${para}` : para;
    }
  }
  if (currentChunk.trim()) {
    chunks.push(currentChunk.trim());
  }

  return {
    text: cleanedText,
    chunks: chunks.length > 0 ? chunks : [cleanedText],
  };
}

// ==============================================================================
// PRACTICE MODE CHALLENGES REPOSITORY
// ==============================================================================

export const TRANSLATION_PRACTICE_CHALLENGES: PracticeChallenge[] = [
  // A1 Level
  {
    id: 'prac-a1-1',
    direction: 'ar-to-en',
    difficulty: 'A1',
    category: 'Daily Basics',
    sourceSentence: 'أنا أتعلم اللغة الإنجليزية كل يوم.',
    contextHintAr: 'جملة مضارع بسيط تعبر عن عادة يومية مستمرة.',
    modelTranslations: [
      'I learn English every day.',
      'I study English every day.',
      'I am learning English every day.',
    ],
    keyVocabulary: [
      { word: 'learn / study', translation: 'يتعلم / يدرس' },
      { word: 'every day', translation: 'كل يوم' },
    ],
    grammarFocusAr: 'زمن المضارع البسيط (Present Simple) مع الفاعل I.',
  },
  {
    id: 'prac-a1-2',
    direction: 'en-to-ar',
    difficulty: 'A1',
    category: 'Daily Basics',
    sourceSentence: 'Where is the nearest train station?',
    contextHintAr: 'سؤال استفسار مهذب عن مكان محطة القطار الأقرب.',
    modelTranslations: [
      'أين أقرب محطة قطار؟',
      'أين تقع أقرب محطة قطارات؟',
      'فين أقرب محطة قطر؟',
    ],
    keyVocabulary: [
      { word: 'nearest', translation: 'الأقرب' },
      { word: 'train station', translation: 'محطة القطار' },
    ],
    grammarFocusAr: 'صيغة التفضيل العليا (Superlative: nearest).',
  },

  // A2 Level
  {
    id: 'prac-a2-1',
    direction: 'ar-to-en',
    difficulty: 'A2',
    category: 'Past Experiences',
    sourceSentence: 'سافرت إلى القاهرة الأسبوع الماضي وقابلت أصدقائي القدامى.',
    contextHintAr: 'حدثان اكتمل حدوثهما في الماضي خلال الأسبوع الماضي.',
    modelTranslations: [
      'I traveled to Cairo last week and met my old friends.',
      'I went to Cairo last week and met my old friends.',
      'I travelled to Cairo last week and met up with my old friends.',
    ],
    keyVocabulary: [
      { word: 'traveled', translation: 'سافرت' },
      { word: 'met', translation: 'قابلت (ماضي meet)' },
      { word: 'old friends', translation: 'أصدقائي القدامى' },
    ],
    grammarFocusAr: 'الماضي البسيط للأفعال المنتظمة والشاذة (traveled, met).',
  },

  // B1 Level
  {
    id: 'prac-b1-1',
    direction: 'ar-to-en',
    difficulty: 'B1',
    category: 'Business & Plans',
    sourceSentence: 'أتطلع إلى مقابلتك في مؤتمر التكنولوجيا القادم.',
    contextHintAr: 'تعبير رسمي مهذب مع phrasal verb متبوع بـ Gerund.',
    modelTranslations: [
      'I am looking forward to meeting you at the upcoming tech conference.',
      'I look forward to meeting you at the next tech conference.',
      'I look forward to seeing you at the upcoming technology conference.',
    ],
    keyVocabulary: [
      { word: 'look forward to', translation: 'يتطلع إلى' },
      { word: 'upcoming', translation: 'القادم / المرتقب' },
      { word: 'conference', translation: 'مؤتمر' },
    ],
    grammarFocusAr: 'الصيغة الصحيحة: look forward to + V-ing (meeting).',
  },
  {
    id: 'prac-b1-2',
    direction: 'en-to-ar',
    difficulty: 'B1',
    category: 'Future & Deadlines',
    sourceSentence: 'By next October, our team will have built the complete platform.',
    contextHintAr: 'زمن المستقبل التام المعبر عن إنجاز مكتمل قبل موعد محدد.',
    modelTranslations: [
      'بحلول أكتوبر القادم، سيكون فريقنا قد بنى المنصة بالكامل.',
      'قبل حلول شهر أكتوبر القادم، سيكون فريقنا قد أتم بناء المنصة المتكاملة.',
      'على أكتوبر الجاي، هيكون فريقنا خلص بناء المنصة كلها.',
    ],
    keyVocabulary: [
      { word: 'By next October', translation: 'بحلول أكتوبر القادم' },
      { word: 'will have built', translation: 'سيكون قد بنى' },
      { word: 'complete platform', translation: 'المنصة الكاملة' },
    ],
    grammarFocusAr: 'المستقبل التام (Future Perfect: will have + V3).',
  },

  // B2 Level
  {
    id: 'prac-b2-1',
    direction: 'ar-to-en',
    difficulty: 'B2',
    category: 'Conditional & Speculation',
    sourceSentence: 'لو كنت استيقظت مبكراً، لما فاتني موعد المقابلة الشخصية.',
    contextHintAr: 'الحالة الشرطية الثالثة (Third Conditional) للتعبير عن الندم في الماضي.',
    modelTranslations: [
      'If I had woken up early, I would not have missed the job interview.',
      'Had I woken up early, I would not have missed the interview.',
      'If I had got up early, I wouldn’t have missed my interview appointment.',
    ],
    keyVocabulary: [
      { word: 'woken up', translation: 'استيقظت (V3)' },
      { word: 'missed', translation: 'فوتت / فاتني' },
      { word: 'job interview', translation: 'المقابلة الشخصية' },
    ],
    grammarFocusAr: 'الحالة الشرطية الثالثة: If + had + V3, would have + V3.',
  },

  // C1 Level
  {
    id: 'prac-c1-1',
    direction: 'ar-to-en',
    difficulty: 'C1',
    category: 'Academic & Diplomacy',
    sourceSentence: 'على الرغم من التحديات الاقتصادية الراهنة، ينبغي علينا اتخاذ تدابير استباقية لضمان استدامة المشاريع.',
    contextHintAr: 'لغة أكاديمية واقتصادية رفيعة المستوى (High Register).',
    modelTranslations: [
      'Notwithstanding current economic challenges, we must adopt proactive measures to ensure project sustainability.',
      'Despite the prevailing economic hurdles, we ought to implement proactive measures to safeguard project sustainability.',
      'In spite of the existing economic constraints, taking proactive steps is imperative to secure project longevity.',
    ],
    keyVocabulary: [
      { word: 'notwithstanding / despite', translation: 'على الرغم من' },
      { word: 'proactive measures', translation: 'تدابير استباقية' },
      { word: 'project sustainability', translation: 'استدامة المشاريع' },
    ],
    grammarFocusAr: 'استخدام الروابط الأكاديمية (Notwithstanding) والصفات المركبة.',
  },

  // C2 Level
  {
    id: 'prac-c2-1',
    direction: 'en-to-ar',
    difficulty: 'C2',
    category: 'Literary & Rhetoric',
    sourceSentence: 'His eloquent rhetoric not only captivated the audience but also dispelled their lingering skepticism.',
    contextHintAr: 'أسلوب أدبي وبلاغي إنجليزي فائق الدقة مع تقديم وتأخير بلاغي (Inversion).',
    modelTranslations: [
      'لم تقتصر بلاغته الفصيحة على أسر عقول الحاضرين فحسب، بل بددت أيضاً شكوكهم العالقة.',
      'إن فصاحة بيانه الآسرة لم تكتفِ بجذب انتباه الجمهور، بل أزاحت ما علق بأذهانهم من ريب.',
    ],
    keyVocabulary: [
      { word: 'eloquent rhetoric', translation: 'البلاغة الفصيحة / فصاحة البيان' },
      { word: 'captivated', translation: 'أسر / سحر' },
      { word: 'dispelled lingering skepticism', translation: 'بدد الشكوك العالقة' },
    ],
    grammarFocusAr: 'التركيب البلاغي المتلازم: not only ... but also مع الموازنة التعبيرية.',
  },
{ id:'prac-a1-3', direction:'ar-to-en', difficulty:'A1', category:'Daily Basics', sourceSentence:'أختي تعمل في مدرسة قريبة من البيت.', contextHintAr:'معلومة عامة عن عمل الأخت ومكانه.', modelTranslations:['My sister works at a school near our home.','My sister works in a school close to home.'], keyVocabulary:[{word:'near',translation:'قريب من'}], grammarFocusAr:'المضارع البسيط مع she: works.' },
  { id:'prac-a1-4', direction:'en-to-ar', difficulty:'A1', category:'Daily Basics', sourceSentence:'Please put the blue bag under the table.', contextHintAr:'طلب بسيط يحدد لون الشيء ومكانه.', modelTranslations:['من فضلك ضع الحقيبة الزرقاء تحت الطاولة.','لو سمحت حط الشنطة الزرقا تحت الترابيزة.'], keyVocabulary:[{word:'under',translation:'تحت'}], grammarFocusAr:'فعل الأمر وحرف الجر under.' },
  { id:'prac-a2-2', direction:'ar-to-en', difficulty:'A2', category:'Past Experiences', sourceSentence:'لم أتمكن من ركوب الحافلة لأنني نسيت محفظتي في المنزل.', contextHintAr:'موقف ماضٍ وسبب عدم ركوب الحافلة.', modelTranslations:['I could not take the bus because I left my wallet at home.','I could not get on the bus because I had forgotten my wallet at home.'], keyVocabulary:[{word:'wallet',translation:'محفظة'}], grammarFocusAr:'could not للتعبير عن عدم القدرة في الماضي وbecause للسبب.' },
  { id:'prac-a2-3', direction:'en-to-ar', difficulty:'A2', category:'Travel & Plans', sourceSentence:'We are going to visit the museum after lunch if it is open.', contextHintAr:'خطة لزيارة مكان بشرط أن يكون مفتوحًا.', modelTranslations:['سنزور المتحف بعد الغداء إذا كان مفتوحًا.','إحنا ناويين نزور المتحف بعد الغدا لو كان مفتوح.'], keyVocabulary:[{word:'after lunch',translation:'بعد الغداء'}], grammarFocusAr:'going to للخطة وif للشرط.' },
  { id:'prac-b1-3', direction:'ar-to-en', difficulty:'B1', category:'Work & Communication', sourceSentence:'هل يمكنك توضيح ما تقصده قبل أن ننتقل إلى النقطة التالية؟', contextHintAr:'طلب مهذب لتوضيح المقصود قبل استكمال النقاش.', modelTranslations:['Could you explain what you mean before we move on to the next point?','Could you clarify what you mean before we go on to the next point?'], keyVocabulary:[{word:'clarify',translation:'يوضح'}], grammarFocusAr:'السؤال المهذب بـ Could you وترتيب الكلمات في what you mean.' },
  { id:'prac-b1-4', direction:'en-to-ar', difficulty:'B1', category:'Work & Communication', sourceSentence:'Although the journey took longer than expected, we arrived in time for the meeting.', contextHintAr:'تعارض بين طول الرحلة والوصول في الوقت المناسب.', modelTranslations:['رغم أن الرحلة استغرقت وقتًا أطول من المتوقع، وصلنا في الوقت المناسب للاجتماع.','مع إن الطريق أخد وقت أطول من المتوقع، وصلنا ولحقنا الاجتماع.'], keyVocabulary:[{word:'in time',translation:'في الوقت المناسب'}], grammarFocusAr:'Although لربط فكرتين متعارضتين.' },
  { id:'prac-b2-2', direction:'ar-to-en', difficulty:'B2', category:'Work & Decisions', sourceSentence:'كان من الأفضل إبلاغ الفريق بالتغيير قبل نشر الإعلان.', contextHintAr:'تقييم نقدي لتصرف كان ينبغي حدوثه في الماضي.', modelTranslations:['It would have been better to inform the team of the change before publishing the announcement.','The team should have been told about the change before the announcement was published.'], keyVocabulary:[{word:'inform',translation:'يبلغ'}], grammarFocusAr:'would have been better أو should have been للماضي.' },
  { id:'prac-b2-3', direction:'en-to-ar', difficulty:'B2', category:'Work & Decisions', sourceSentence:'Unless we receive written confirmation by Friday, we will have to postpone the launch.', contextHintAr:'شرط سلبي مع مهلة زمنية ونتيجة محتملة.', modelTranslations:['ما لم نتلق تأكيدًا كتابيًا بحلول الجمعة، فسنضطر إلى تأجيل الإطلاق.','لو ما وصلناش تأكيد مكتوب لحد الجمعة، هنضطر نأجل الإطلاق.'], keyVocabulary:[{word:'postpone',translation:'يؤجل'}], grammarFocusAr:'Unless بمعنى if not وwill have to للاضطرار مستقبلًا.' },
  { id:'prac-c1-2', direction:'ar-to-en', difficulty:'C1', category:'Policy & Evidence', sourceSentence:'لا ينبغي تفسير غياب الأدلة القاطعة على أنه دليل على عدم وجود مشكلة.', contextHintAr:'تمييز دقيق بين غياب الدليل والدليل على الغياب.', modelTranslations:['The absence of conclusive evidence should not be interpreted as evidence that no problem exists.','A lack of conclusive evidence should not be taken as proof that there is no problem.'], keyVocabulary:[{word:'conclusive evidence',translation:'أدلة قاطعة'}], grammarFocusAr:'المبني للمجهول بعد should not be مع interpreted as.' },
  { id:'prac-c1-3', direction:'en-to-ar', difficulty:'C1', category:'Policy & Evidence', sourceSentence:'The proposal is promising, provided that its assumptions are tested independently rather than accepted at face value.', contextHintAr:'قبول مشروط بالتحقق المستقل بدلًا من التسليم بالافتراضات.', modelTranslations:['المقترح واعد، شريطة اختبار افتراضاته بصورة مستقلة بدلًا من قبولها دون تمحيص.','تبدو الخطة مبشرة، بشرط فحص افتراضاتها بشكل مستقل بدلًا من الأخذ بها على ظاهرها.'], keyVocabulary:[{word:'at face value',translation:'دون تمحيص / على ظاهره'}], grammarFocusAr:'provided that للشرط وrather than للمقابلة.' },
  { id:'prac-c2-2', direction:'ar-to-en', difficulty:'C2', category:'Argument & Register', sourceSentence:'بقدر ما يبدو الإجماع مطمئنًا، فإنه لا يعفينا من مساءلة الأسس التي يقوم عليها.', contextHintAr:'الاعتراف بقيمة الإجماع مع التحفظ على أسسه.', modelTranslations:['Reassuring though consensus may seem, it does not absolve us of the need to question its foundations.','However reassuring the consensus appears, we must still scrutinize the assumptions on which it rests.'], keyVocabulary:[{word:'scrutinize',translation:'يفحص بدقة'}], grammarFocusAr:'التنازل بـ Reassuring though أو However reassuring.' },
  { id:'prac-c2-3', direction:'en-to-ar', difficulty:'C2', category:'Argument & Register', sourceSentence:'What passes for pragmatism may, on closer inspection, amount to little more than an unwillingness to confront uncomfortable trade-offs.', contextHintAr:'تقييم نقدي للفارق بين البراغماتية المعلنة وتجنب المفاضلات الصعبة.', modelTranslations:['ما يُقدَّم على أنه واقعية عملية قد لا يعدو، عند التدقيق، أن يكون إحجامًا عن مواجهة مفاضلات غير مريحة.','قد يتبين عند الفحص أن ما يُحسب براغماتية ليس أكثر من عزوف عن مواجهة الخيارات الصعبة وتبعاتها.'], keyVocabulary:[{word:'trade-offs',translation:'مفاضلات بين مكاسب وتنازلات'}], grammarFocusAr:'What passes for كجملة اسمية وmay amount to للتحفظ في الحكم.' },
];
