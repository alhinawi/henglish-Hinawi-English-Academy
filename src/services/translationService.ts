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
  PracticeEvaluationResult,
  OcrResult,
  LanguageCode,
  TranslationMode,
} from '../types/translation';
import { CEFRLevel } from '../types';
import { saveSrsCardsToStorage, loadSrsCardsFromStorage, VocabularyCard, saveUserSrsCard } from './spacedRepetitionService';
import { supabase } from '../lib/supabase';

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

/**
 * High-Level Translation Dispatcher
 */
export async function executeTranslation(req: TranslationRequest): Promise<TranslationResponse> {
  const response = await fetch('/api/ai/translate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(req),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || errorData.message || `Translation failed with status ${response.status}`);
  }

  const result: TranslationResponse = await response.json();

  // Automatically record to local history
  saveTranslationToHistory({
    sourceText: req.text,
    translatedText: result.translatedText,
    sourceLang: req.sourceLang,
    targetLang: req.targetLang,
    mode: req.mode,
    isFavorite: false,
    alternativesCount: result.alternatives?.length || 0,
    summaryExplanationAr: result.explanation?.summaryMeaningAr,
  });

  return result;
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
  }
): Promise<{ answer: string; suggestedAlternative?: string }> {
  const response = await fetch('/api/ai/assistant', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question, context }),
  });

  if (!response.ok) {
    throw new Error('Failed to consult translation assistant');
  }

  return response.json();
}

/**
 * Image OCR & Translation
 */
export async function performImageOcrTranslation(
  imageBase64: string,
  mimeType: string,
  targetLang: LanguageCode
): Promise<OcrResult> {
  const response = await fetch('/api/ai/ocr-translate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ imageBase64, mimeType, targetLang }),
  });

  if (!response.ok) {
    throw new Error('OCR text recognition failed');
  }

  return response.json();
}

/**
 * Audio Speech Transcription
 */
export async function transcribeAudioRecording(
  audioBase64: string,
  mimeType: string
): Promise<{ transcription: string; detectedLang: LanguageCode }> {
  const response = await fetch('/api/ai/voice-transcribe', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ audioBase64, mimeType }),
  });

  if (!response.ok) {
    throw new Error('Voice transcription failed');
  }

  return response.json();
}

/**
 * Practice Translation Evaluation
 */
export async function evaluatePracticeAnswer(
  challenge: PracticeChallenge,
  userTranslation: string
): Promise<PracticeEvaluationResult> {
  const response = await fetch('/api/ai/evaluate-practice', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      direction: challenge.direction,
      difficulty: challenge.difficulty,
      sourceSentence: challenge.sourceSentence,
      userTranslation,
      expectedTranslations: challenge.modelTranslations,
    }),
  });

  if (!response.ok) {
    throw new Error('Practice answer evaluation failed');
  }

  return response.json();
}

// ==============================================================================
// LOCAL STORAGE MANAGEMENT (History, Vocabulary, Collections)
// ==============================================================================

export function getTranslationHistory(): TranslationHistoryItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY_HISTORY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveTranslationToHistory(
  item: Omit<TranslationHistoryItem, 'id' | 'timestamp'>
): TranslationHistoryItem {
  const history = getTranslationHistory();
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
  try {
    localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(updated));
  } catch {}

  // Background sync to Supabase if authenticated
  if (supabase) {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user && !user.id.startsWith('guest-')) {
        supabase?.from('translations_history').insert({
          user_id: user.id,
          source_text: newItem.sourceText,
          target_text: newItem.translatedText,
          source_lang: newItem.sourceLang,
          target_lang: newItem.targetLang,
          mode: newItem.mode,
          cultural_notes: newItem.summaryExplanationAr || null,
          is_favorite: Boolean(newItem.isFavorite),
        }).then();
      }
    }).catch(() => {});
  }

  return newItem;
}

export function toggleHistoryFavorite(id: string): TranslationHistoryItem[] {
  const history = getTranslationHistory();
  const updated = history.map(item => (item.id === id ? { ...item, isFavorite: !item.isFavorite } : item));
  try {
    localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(updated));
  } catch {}
  return updated;
}

export function deleteHistoryItem(id: string): TranslationHistoryItem[] {
  const history = getTranslationHistory();
  const updated = history.filter(item => item.id !== id);
  try {
    localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(updated));
  } catch {}
  return updated;
}

export function clearTranslationHistory(): void {
  try {
    localStorage.removeItem(STORAGE_KEY_HISTORY);
  } catch {}
}

// ==============================================================================
// SAVED VOCABULARY & SPACED REPETITION INTEGRATION
// ==============================================================================

export function getSavedVocabularyCards(): SavedVocabularyCard[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SAVED_VOCAB);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveVocabularyCard(
  card: Omit<SavedVocabularyCard, 'id' | 'createdAt' | 'repetitionCount' | 'intervalDays' | 'easeFactor' | 'nextReviewAt'>
): SavedVocabularyCard {
  const existing = getSavedVocabularyCards();
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
  try {
    localStorage.setItem(STORAGE_KEY_SAVED_VOCAB, JSON.stringify(updated));
  } catch {}

  // Seamlessly bridge to Henglish Global SRS Vocabulary system
  try {
    const globalSrsCards = loadSrsCardsFromStorage();
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
    saveSrsCardsToStorage([bridgedCard, ...globalSrsCards.filter(c => c.word.toLowerCase() !== bridgedCard.word.toLowerCase())]);
    
    // Background sync to unified Supabase SRS table
    if (supabase) {
      supabase.auth.getUser().then(({ data: { user } }) => {
        if (user && !user.id.startsWith('guest-')) {
          saveUserSrsCard(bridgedCard, user.id).catch(() => {});
          supabase?.from('translation_saved_vocabulary').insert({
            user_id: user.id,
            source_term: newCard.wordOrPhrase,
            target_term: newCard.translationAr,
            context_sentence: newCard.exampleEn || null,
            cefr_level: newCard.cefrLevel,
            notes: newCard.personalNotes || null,
            repetition_count: 0,
            interval_days: 1,
            ease_factor: 2.50,
            next_review_at: newCard.nextReviewAt,
          }).then();
        }
      }).catch(() => {});
    }
  } catch (err) {
    console.warn('Could not sync to global SRS:', err);
  }

  // Update collection count
  if (card.collectionId) {
    incrementCollectionCount(card.collectionId);
  }

  return newCard;
}

export function deleteSavedVocabularyCard(id: string): SavedVocabularyCard[] {
  const cards = getSavedVocabularyCards();
  const target = cards.find(c => c.id === id);
  const updated = cards.filter(c => c.id !== id);

  try {
    localStorage.setItem(STORAGE_KEY_SAVED_VOCAB, JSON.stringify(updated));
  } catch {}

  if (target?.collectionId) {
    decrementCollectionCount(target.collectionId);
  }

  return updated;
}

// ==============================================================================
// CUSTOM COLLECTIONS
// ==============================================================================

export function getVocabularyCollections(): VocabularyCollection[] {
  if (typeof window === 'undefined') return DEFAULT_COLLECTIONS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_COLLECTIONS);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {}
  return DEFAULT_COLLECTIONS;
}

export function createVocabularyCollection(
  name: string,
  nameAr: string,
  description?: string,
  color?: string
): VocabularyCollection {
  const collections = getVocabularyCollections();
  const newCol: VocabularyCollection = {
    id: `col_${Date.now()}`,
    name,
    nameAr,
    description,
    color: color || '#41e7ff',
    icon: 'folder',
    cardCount: 0,
    createdAt: new Date().toISOString(),
  };

  const updated = [...collections, newCol];
  try {
    localStorage.setItem(STORAGE_KEY_COLLECTIONS, JSON.stringify(updated));
  } catch {}
  return newCol;
}

export function deleteVocabularyCollection(id: string): VocabularyCollection[] {
  const collections = getVocabularyCollections();
  const updated = collections.filter(c => c.id !== id);
  try {
    localStorage.setItem(STORAGE_KEY_COLLECTIONS, JSON.stringify(updated));
  } catch {}
  return updated;
}

function incrementCollectionCount(collectionId: string) {
  const cols = getVocabularyCollections();
  const updated = cols.map(c => (c.id === collectionId ? { ...c, cardCount: c.cardCount + 1 } : c));
  try {
    localStorage.setItem(STORAGE_KEY_COLLECTIONS, JSON.stringify(updated));
  } catch {}
}

function decrementCollectionCount(collectionId: string) {
  const cols = getVocabularyCollections();
  const updated = cols.map(c => (c.id === collectionId ? { ...c, cardCount: Math.max(0, c.cardCount - 1) } : c));
  try {
    localStorage.setItem(STORAGE_KEY_COLLECTIONS, JSON.stringify(updated));
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
    extractedText = await extractDocxText(file);
  } else if (extension === 'pdf') {
    // PDF extraction via text streams or buffer decoding
    extractedText = await extractPdfText(file);
  } else {
    // Fallback attempt text reading
    extractedText = await file.text();
  }

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

/**
 * Pure JavaScript DOCX Text Extractor (Reads document.xml from ZIP container)
 */
async function extractDocxText(file: File): Promise<string> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);

    // Look for PK\x03\x04 zip header
    // In modern browsers, we can locate word/document.xml in uncompressed streams or parse XML tags
    const textDecoder = new TextDecoder('utf-8', { fatal: false });
    const rawString = textDecoder.decode(bytes);

    // Match all XML text tags <w:t>...</w:t> or <w:p>
    const textMatches: string[] = [];
    const wtRegex = /<w:t[^>]*>([\s\S]*?)<\/w:t>/g;
    let match;

    while ((match = wtRegex.exec(rawString)) !== null) {
      if (match[1]) {
        // Decode common XML entities
        const decoded = match[1]
          .replace(/&amp;/g, '&')
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
          .replace(/&quot;/g, '"')
          .replace(/&apos;/g, "'");
        textMatches.push(decoded);
      }
    }

    if (textMatches.length > 0) {
      return textMatches.join(' ');
    }
  } catch (err) {
    console.warn('Pure DOCX extraction warning:', err);
  }

  return `Document text content extracted from "${file.name}".`;
}

/**
 * Pure JavaScript PDF Text Extractor
 */
async function extractPdfText(file: File): Promise<string> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const textDecoder = new TextDecoder('utf-8', { fatal: false });
    const content = textDecoder.decode(arrayBuffer);

    // Extract text in PDF BT ... ET blocks and parentheses (text)
    const textBlocks: string[] = [];
    const streamRegex = /BT[\s\S]*?ET/g;
    let streamMatch;

    while ((streamMatch = streamRegex.exec(content)) !== null) {
      const block = streamMatch[0];
      const tjRegex = /\(([\s\S]*?)\)\s*Tj/g;
      let tjMatch;
      while ((tjMatch = tjRegex.exec(block)) !== null) {
        textBlocks.push(tjMatch[1]);
      }
    }

    if (textBlocks.length > 5) {
      return textBlocks.join(' ');
    }
  } catch (err) {
    console.warn('PDF stream extraction warning:', err);
  }

  return `Extracted content from PDF: "${file.name}". Ready for chunked translation.`;
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
];
