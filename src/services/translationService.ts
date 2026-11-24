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
    contextHintAr: 'أسلوب بلاغي يوازن بين جذب الجمهور وتبديد الشكوك باستخدام not only ... but also.',
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

  {"id": "prac-a1-5", "direction": "ar-to-en", "difficulty": "A1", "category": "Daily Basics", "sourceSentence": "كل صباح أضع كتابي على المكتب.", "contextHintAr": "عادة بسيطة عن مكان الكتاب.", "modelTranslations": ["Every morning, I put my book on the desk.", "I put my book on the desk every morning."], "keyVocabulary": [{"word": "desk", "translation": "مكتب"}, {"word": "every morning", "translation": "كل صباح"}], "grammarFocusAr": "المضارع البسيط مع I وحرف الجر on."},
  {"id": "prac-a1-6", "direction": "en-to-ar", "difficulty": "A1", "category": "Daily Basics", "sourceSentence": "There are three books next to my notebook.", "contextHintAr": "وصف عدد الكتب ومكانها بالنسبة للكشكول.", "modelTranslations": ["توجد ثلاثة كتب بجوار دفتري.", "فيه تلات كتب جنب كشكولي."], "keyVocabulary": [{"word": "next to", "translation": "بجوار / جنب"}, {"word": "notebook", "translation": "دفتر / كشكول"}], "grammarFocusAr": "There are مع الجمع وحرف المكان next to."},
  {"id": "prac-a2-4", "direction": "ar-to-en", "difficulty": "A2", "category": "Travel & Plans", "sourceSentence": "هل يمكننا تغيير موعد الرحلة إلى صباح الغد؟", "contextHintAr": "طلب مهذب لتغيير توقيت رحلة، وليس تأكيد حجز.", "modelTranslations": ["Can we change the trip to tomorrow morning?", "Could we move the trip to tomorrow morning?"], "keyVocabulary": [{"word": "change", "translation": "يغير"}, {"word": "tomorrow morning", "translation": "صباح الغد"}], "grammarFocusAr": "Can we أو Could we لطلب تغيير مع توقيت مستقبلي."},
  {"id": "prac-a2-5", "direction": "en-to-ar", "difficulty": "A2", "category": "Travel & Plans", "sourceSentence": "I was waiting for the train when you called me.", "contextHintAr": "حدث كان مستمرًا في الماضي عندما وقع اتصال.", "modelTranslations": ["كنت أنتظر القطار عندما اتصلت بي.", "كنت مستني القطر لما اتصلت بيا."], "keyVocabulary": [{"word": "wait for", "translation": "ينتظر"}, {"word": "call", "translation": "يتصل"}], "grammarFocusAr": "الماضي المستمر was waiting مع الماضي البسيط called."},
  {"id": "prac-b1-5", "direction": "ar-to-en", "difficulty": "B1", "category": "Work & Communication", "sourceSentence": "إذا تأخر الاجتماع، سأرسل لك ملخصًا بالبريد الإلكتروني.", "contextHintAr": "وعد مشروط بتأخر الاجتماع.", "modelTranslations": ["If the meeting is delayed, I will email you a summary.", "If the meeting runs late, I will send you a summary by email."], "keyVocabulary": [{"word": "summary", "translation": "ملخص"}, {"word": "be delayed", "translation": "يتأخر"}], "grammarFocusAr": "الشرط الأول: If مع المضارع، ثم will مع الفعل."},
  {"id": "prac-b1-6", "direction": "en-to-ar", "difficulty": "B1", "category": "Work & Communication", "sourceSentence": "Could you let me know whether the revised schedule works for your team?", "contextHintAr": "سؤال مهذب عن ملاءمة جدول معدل للفريق.", "modelTranslations": ["هل يمكنك إخباري بما إذا كان الجدول المعدل مناسبًا لفريقك؟", "ممكن تبلغني إذا كان الجدول بعد التعديل مناسب لفريقك؟"], "keyVocabulary": [{"word": "revised schedule", "translation": "جدول معدل"}, {"word": "work for", "translation": "يكون مناسبًا لـ"}], "grammarFocusAr": "Could you لطلب مهذب وwhether مع ترتيب الجملة الخبرية."},
  {"id": "prac-b2-4", "direction": "ar-to-en", "difficulty": "B2", "category": "Work & Communication", "sourceSentence": "لو كنا اختبرنا النسخة مبكرًا، لكنا اكتشفنا المشكلة قبل الإطلاق.", "contextHintAr": "تخيل نتيجة مختلفة لقرار لم يحدث في الماضي.", "modelTranslations": ["If we had tested the version earlier, we would have found the problem before launch.", "Had we tested the version sooner, we would have discovered the issue before the launch."], "keyVocabulary": [{"word": "discover an issue", "translation": "يكتشف مشكلة"}, {"word": "before launch", "translation": "قبل الإطلاق"}], "grammarFocusAr": "الشرط الثالث: had مع التصريف الثالث، ثم would have مع التصريف الثالث."},
  {"id": "prac-b2-5", "direction": "en-to-ar", "difficulty": "B2", "category": "Work & Communication", "sourceSentence": "Despite the tight deadline, the team managed to deliver without compromising quality.", "contextHintAr": "نجاح الفريق رغم ضيق الوقت مع الحفاظ على الجودة.", "modelTranslations": ["رغم ضيق الموعد النهائي، تمكن الفريق من التسليم دون المساس بالجودة.", "مع إن الوقت كان ضيق، الفريق قدر يسلم من غير ما يضحي بالجودة."], "keyVocabulary": [{"word": "tight deadline", "translation": "موعد نهائي ضيق"}, {"word": "compromise quality", "translation": "يضر بالجودة / يضحي بالجودة"}], "grammarFocusAr": "Despite يتبعها اسم، وmanaged to للتعبير عن نجاح رغم صعوبة."},
  {"id": "prac-c1-4", "direction": "ar-to-en", "difficulty": "C1", "category": "Argument & Evidence", "sourceSentence": "ينبغي تقييم نجاح السياسة على أساس نتائجها الفعلية، لا على أساس نوايا واضعيها.", "contextHintAr": "تمييز معياري بين النتائج والنوايا في تقييم سياسة.", "modelTranslations": ["The success of a policy should be judged by its actual outcomes, not by the intentions of its authors.", "A policy should be considered successful on the basis of its real results rather than its designers' intentions."], "keyVocabulary": [{"word": "actual outcomes", "translation": "نتائج فعلية"}, {"word": "on the basis of", "translation": "على أساس"}], "grammarFocusAr": "المبني للمجهول بعد should مع المقابلة not by أو rather than."},
  {"id": "prac-c1-5", "direction": "en-to-ar", "difficulty": "C1", "category": "Argument & Evidence", "sourceSentence": "While the findings are consistent with our hypothesis, they do not rule out alternative explanations.", "contextHintAr": "توافق النتائج مع الفرضية لا يعني استبعاد كل تفسير آخر.", "modelTranslations": ["مع أن النتائج تتسق مع فرضيتنا، فإنها لا تستبعد تفسيرات بديلة.", "رغم توافق النتائج مع الفرضية، فإنها لا تنفي احتمال وجود تفسيرات أخرى."], "keyVocabulary": [{"word": "consistent with", "translation": "متسق مع"}, {"word": "rule out", "translation": "يستبعد"}], "grammarFocusAr": "While هنا للتنازل، وrule out للاستبعاد لا لإثبات السببية."},
  {"id": "prac-c2-4", "direction": "ar-to-en", "difficulty": "C2", "category": "Argument & Evidence", "sourceSentence": "ليس من الإنصاف اختزال خلاف معقد في ثنائية مبسطة تتجاهل ما بين طرفيها من احتمالات.", "contextHintAr": "اعتراض على تصوير خلاف متعدد الأبعاد باعتباره خيارين فقط.", "modelTranslations": ["It is unfair to reduce a complex disagreement to a simplistic binary that ignores the possibilities in between.", "A complex dispute cannot fairly be reduced to two stark alternatives at the expense of the possibilities between them."], "keyVocabulary": [{"word": "simplistic binary", "translation": "ثنائية مبسطة بإفراط"}, {"word": "reduce to", "translation": "يختزل في"}], "grammarFocusAr": "It is مع الصفة وto، أو المبني للمجهول cannot be reduced مع الحفاظ على معنى الإنصاف."},
  {"id": "prac-c2-5", "direction": "en-to-ar", "difficulty": "C2", "category": "Argument & Evidence", "sourceSentence": "No sooner had the compromise been announced than its apparent simplicity began to unravel under scrutiny.", "contextHintAr": "تتابع سريع بعد إعلان تسوية اتضح أن بساطتها ظاهرية.", "modelTranslations": ["ما إن أُعلنت التسوية حتى بدأت بساطتها الظاهرية تتداعى تحت التدقيق.", "لم تكد التسوية تعلن حتى أخذ الفحص الدقيق يكشف أن بساطتها لم تكن إلا ظاهرية."], "keyVocabulary": [{"word": "compromise", "translation": "تسوية"}, {"word": "under scrutiny", "translation": "تحت التدقيق"}], "grammarFocusAr": "القلب بعد No sooner مع had، والربط بـ than؛ began to unravel هنا مجازي."},
  {"id": "prac-a1-7", "direction": "ar-to-en", "difficulty": "A1", "category": "Original practice", "sourceSentence": "أحتاج كوب ماء، من فضلك.", "contextHintAr": "طلب بسيط ومهذب لمياه.", "modelTranslations": ["I need a glass of water, please.", "I need a cup of water, please."], "keyVocabulary": [{"word": "a glass of water", "translation": "كوب مياه"}, {"word": "please", "translation": "من فضلك"}], "grammarFocusAr": "need مع اسم وplease للطلب المهذب."},
  {"id": "prac-a1-8", "direction": "en-to-ar", "difficulty": "A1", "category": "Original practice", "sourceSentence": "Our English lesson starts at nine.", "contextHintAr": "موعد بداية درس الإنجليزية للمجموعة.", "modelTranslations": ["يبدأ درس الإنجليزية الخاص بنا الساعة التاسعة.", "درس الإنجليزي بتاعنا بيبدأ الساعة تسعة."], "keyVocabulary": [{"word": "lesson", "translation": "درس"}, {"word": "starts at nine", "translation": "يبدأ الساعة التاسعة"}], "grammarFocusAr": "المضارع البسيط starts مع فاعل مفرد وat للساعة."},
  {"id": "prac-a2-6", "direction": "ar-to-en", "difficulty": "A2", "category": "Original practice", "sourceSentence": "اشتريت تذكرة القطار أمس، لكنني لم أحجز مقعدًا.", "contextHintAr": "شراء تذكرة في الماضي من غير حجز مقعد.", "modelTranslations": ["I bought a train ticket yesterday, but I did not reserve a seat.", "Yesterday, I bought a train ticket, but I did not book a seat."], "keyVocabulary": [{"word": "train ticket", "translation": "تذكرة قطار"}, {"word": "reserve a seat", "translation": "يحجز مقعد"}], "grammarFocusAr": "الماضي البسيط bought والنفي did not مع الفعل الأصلي."},
  {"id": "prac-a2-7", "direction": "en-to-ar", "difficulty": "A2", "category": "Original practice", "sourceSentence": "You can borrow this book, but please return it before Monday.", "contextHintAr": "السماح باستعارة كتاب مع طلب إعادته قبل يوم محدد.", "modelTranslations": ["يمكنك استعارة هذا الكتاب، لكن من فضلك أعده قبل الاثنين.", "ممكن تستلف الكتاب ده، بس رجعه قبل يوم الاتنين لو سمحت."], "keyVocabulary": [{"word": "borrow", "translation": "يستعير"}, {"word": "return", "translation": "يعيد"}], "grammarFocusAr": "can للسماح وbefore قبل نقطة زمنية."},
  {"id": "prac-b1-7", "direction": "ar-to-en", "difficulty": "B1", "category": "Original practice", "sourceSentence": "منذ أن انتقلت إلى هذا الفريق، تعلمت كيف أشرح أفكاري بوضوح أكبر.", "contextHintAr": "تعلم بدأ بعد الانضمام للفريق وما زال مرتبط بالحاضر.", "modelTranslations": ["Since I joined this team, I have learned to explain my ideas more clearly.", "I have learned how to explain my ideas more clearly since I moved to this team."], "keyVocabulary": [{"word": "join a team", "translation": "ينضم لفريق"}, {"word": "more clearly", "translation": "بوضوح أكبر"}], "grammarFocusAr": "المضارع التام مع since ثم الماضي البسيط."},
  {"id": "prac-b1-8", "direction": "en-to-ar", "difficulty": "B1", "category": "Original practice", "sourceSentence": "The train had already left by the time we reached the station.", "contextHintAr": "رحيل القطار سبق وصول المتكلمين للمحطة.", "modelTranslations": ["كان القطار قد غادر بالفعل بحلول وصولنا إلى المحطة.", "القطر كان مشي خلاص لما وصلنا المحطة."], "keyVocabulary": [{"word": "had already left", "translation": "كان قد غادر بالفعل"}, {"word": "reach the station", "translation": "يصل إلى المحطة"}], "grammarFocusAr": "الماضي التام had left لحدث سبق الماضي البسيط reached."},
  {"id": "prac-b2-6", "direction": "ar-to-en", "difficulty": "B2", "category": "Original practice", "sourceSentence": "لا فائدة من تمديد الموعد النهائي ما لم نحصل على البيانات الناقصة.", "contextHintAr": "تمديد المهلة وحده غير مفيد من غير البيانات المطلوبة.", "modelTranslations": ["There is no point in extending the deadline unless we obtain the missing data.", "Extending the deadline is pointless unless we get the missing data."], "keyVocabulary": [{"word": "extend the deadline", "translation": "يمدد الموعد النهائي"}, {"word": "missing data", "translation": "بيانات ناقصة"}], "grammarFocusAr": "There is no point in مع صيغة ing وunless بمعنى if not."},
  {"id": "prac-b2-7", "direction": "en-to-ar", "difficulty": "B2", "category": "Original practice", "sourceSentence": "The report is due to be published next week, subject to final approval.", "contextHintAr": "النشر مقرر لكنه متوقف على موافقة نهائية.", "modelTranslations": ["من المقرر نشر التقرير الأسبوع المقبل، رهنًا بالموافقة النهائية.", "المفروض التقرير يتنشر الأسبوع الجاي، بشرط الموافقة النهائية."], "keyVocabulary": [{"word": "due to be published", "translation": "مقرر نشره"}, {"word": "final approval", "translation": "موافقة نهائية"}], "grammarFocusAr": "is due to be مع المبني للمجهول وsubject to لشرط لازم."},
  {"id": "prac-c1-6", "direction": "ar-to-en", "difficulty": "C1", "category": "Original practice", "sourceSentence": "قد يخفي التحسن الإجمالي تفاوتًا كبيرًا بين المناطق، ولذلك ينبغي تفصيل النتائج قبل استخلاص أي استنتاج.", "contextHintAr": "احتمال أن يخفي المتوسط تفاوت المناطق يستدعي تحليل النتائج بتفصيل.", "modelTranslations": ["The overall improvement may conceal substantial regional disparities, so the results should be broken down before any conclusion is drawn.", "Aggregate improvement may mask marked differences between regions; the findings should therefore be disaggregated before drawing a conclusion."], "keyVocabulary": [{"word": "regional disparities", "translation": "تفاوت بين المناطق"}, {"word": "break down results", "translation": "يفصل النتائج"}], "grammarFocusAr": "may للتحفظ وshould be مع المبني للمجهول وترتيب before."},
  {"id": "prac-c1-7", "direction": "en-to-ar", "difficulty": "C1", "category": "Original practice", "sourceSentence": "Had the reviewers been given access to the raw data, their conclusions might have been less tentative.", "contextHintAr": "افتراض ماضٍ غير واقع مع نتيجة محتملة وليست مؤكدة.", "modelTranslations": ["لو أتيح للمراجعين الاطلاع على البيانات الخام، لربما كانت استنتاجاتهم أقل تحفظًا.", "لو حصل المراجعون على البيانات الأولية، لكانت استنتاجاتهم على الأرجح أقل ترددًا."], "keyVocabulary": [{"word": "raw data", "translation": "بيانات خام"}, {"word": "tentative conclusions", "translation": "استنتاجات مبدئية غير جازمة"}], "grammarFocusAr": "قلب الشرط Had مع المبني للمجهول وmight have been للاحتمال."},
  {"id": "prac-c2-6", "direction": "ar-to-en", "difficulty": "C2", "category": "Original practice", "sourceSentence": "ليس الخلاف حول جدوى الإصلاح بقدر ما هو حول من يتحمل تكلفته ومن يجني ثماره.", "contextHintAr": "محور الخلاف توزيع التكاليف والمكاسب أكثر من قيمة الإصلاح نفسه.", "modelTranslations": ["The disagreement concerns less the merits of reform than who bears its costs and who reaps its benefits.", "The dispute is less about whether reform is worthwhile than about who pays for it and who benefits from it."], "keyVocabulary": [{"word": "bear the costs", "translation": "يتحمل التكاليف"}, {"word": "reap the benefits", "translation": "يجني الثمار"}], "grammarFocusAr": "less ... than للمقارنة بين محوري الخلاف مع who."},
  {"id": "prac-c2-7", "direction": "en-to-ar", "difficulty": "C2", "category": "Original practice", "sourceSentence": "To concede that the evidence is incomplete is not to concede that all interpretations are equally defensible.", "contextHintAr": "عدم اكتمال الأدلة لا يجعل كل تفسير مساويًا لغيره في القوة.", "modelTranslations": ["الإقرار بأن الأدلة غير مكتملة لا يعني التسليم بأن جميع التأويلات قابلة للدفاع عنها بالقدر نفسه.", "الاعتراف بنقص الأدلة لا يستلزم قبول أن كل التفسيرات متساوية في وجاهتها."], "keyVocabulary": [{"word": "concede", "translation": "يقر / يسلم"}, {"word": "equally defensible", "translation": "قابل للدفاع عنه بالقدر نفسه"}], "grammarFocusAr": "مصدران To concede مع is not ونطاق النفي في equally."},
];
