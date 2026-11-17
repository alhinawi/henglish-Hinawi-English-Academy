// ==============================================================================
// Henglish Academy (HENGLISH) - TRANSLATION STUDIO TYPES & CONTRACTS
// Complete definitions for Translation Engine, Modes, Grammar, OCR, and Practice
// ==============================================================================

import { CEFRLevel } from './index';

export type LanguageCode =
  | 'auto'
  | 'en'
  | 'ar'
  | 'fr'
  | 'de'
  | 'es'
  | 'it'
  | 'pt'
  | 'tr'
  | 'ru'
  | 'zh'
  | 'ja'
  | 'ko'
  | 'nl'
  | 'sv'
  | 'hi'
  | 'fa';

export interface SupportedLanguage {
  code: LanguageCode;
  nameEn: string;
  nameAr: string;
  flag: string;
  dir: 'ltr' | 'rtl';
}

export const SUPPORTED_LANGUAGES: SupportedLanguage[] = [
  { code: 'auto', nameEn: 'Auto Detect', nameAr: 'tl.lang.auto', flag: '✨', dir: 'ltr' },
  { code: 'en', nameEn: 'English', nameAr: 'tl.lang.en', flag: '🇬🇧', dir: 'ltr' },
  { code: 'ar', nameEn: 'Arabic', nameAr: 'tl.lang.ar', flag: '🇸🇦', dir: 'rtl' },
  { code: 'fr', nameEn: 'French', nameAr: 'tl.lang.fr', flag: '🇫🇷', dir: 'ltr' },
  { code: 'de', nameEn: 'German', nameAr: 'tl.lang.de', flag: '🇩🇪', dir: 'ltr' },
  { code: 'es', nameEn: 'Spanish', nameAr: 'tl.lang.es', flag: '🇪🇸', dir: 'ltr' },
  { code: 'it', nameEn: 'Italian', nameAr: 'tl.lang.it', flag: '🇮🇹', dir: 'ltr' },
  { code: 'pt', nameEn: 'Portuguese', nameAr: 'tl.lang.pt', flag: '🇵🇹', dir: 'ltr' },
  { code: 'tr', nameEn: 'Turkish', nameAr: 'tl.lang.tr', flag: '🇹🇷', dir: 'ltr' },
  { code: 'ru', nameEn: 'Russian', nameAr: 'tl.lang.ru', flag: '🇷🇺', dir: 'ltr' },
  { code: 'zh', nameEn: 'Chinese', nameAr: 'tl.lang.zh', flag: '🇨🇳', dir: 'ltr' },
  { code: 'ja', nameEn: 'Japanese', nameAr: 'tl.lang.ja', flag: '🇯🇵', dir: 'ltr' },
  { code: 'ko', nameEn: 'Korean', nameAr: 'tl.lang.ko', flag: '🇰🇷', dir: 'ltr' },
  { code: 'nl', nameEn: 'Dutch', nameAr: 'tl.lang.nl', flag: '🇳🇱', dir: 'ltr' },
  { code: 'sv', nameEn: 'Swedish', nameAr: 'tl.lang.sv', flag: '🇸🇪', dir: 'ltr' },
  { code: 'hi', nameEn: 'Hindi', nameAr: 'tl.lang.hi', flag: '🇮🇳', dir: 'ltr' },
  { code: 'fa', nameEn: 'Persian', nameAr: 'tl.lang.fa', flag: '🇮🇷', dir: 'rtl' },
];

export type TranslationMode =
  | 'natural'
  | 'literal'
  | 'professional'
  | 'academic'
  | 'casual'
  | 'business'
  | 'formal'
  | 'informal'
  | 'technical'
  | 'conversational';

export interface TranslationModeConfig {
  id: TranslationMode;
  titleEn: string;
  titleAr: string;
  descriptionAr: string;
  badge: string;
  color: string;
}

export const TRANSLATION_MODES: TranslationModeConfig[] = [
  {
    id: 'natural',
    titleEn: 'Natural Translation',
    titleAr: 'tl.mode.natural.title',
    descriptionAr: 'tl.mode.natural.desc',
    badge: 'tl.mode.natural.badge',
    color: '#41e7ff',
  },
  {
    id: 'literal',
    titleEn: 'Literal Translation',
    titleAr: 'tl.mode.literal.title',
    descriptionAr: 'tl.mode.literal.desc',
    badge: 'tl.mode.literal.badge',
    color: '#a855f7',
  },
  {
    id: 'professional',
    titleEn: 'Professional Translation',
    titleAr: 'tl.mode.professional.title',
    descriptionAr: 'tl.mode.professional.desc',
    badge: 'tl.mode.professional.badge',
    color: '#10b981',
  },
  {
    id: 'academic',
    titleEn: 'Academic Translation',
    titleAr: 'tl.mode.academic.title',
    descriptionAr: 'tl.mode.academic.desc',
    badge: 'tl.mode.academic.badge',
    color: '#6366f1',
  },
  {
    id: 'casual',
    titleEn: 'Casual Translation',
    titleAr: 'tl.mode.casual.title',
    descriptionAr: 'tl.mode.casual.desc',
    badge: 'tl.mode.casual.badge',
    color: '#ec4899',
  },
  {
    id: 'business',
    titleEn: 'Business Translation',
    titleAr: 'tl.mode.business.title',
    descriptionAr: 'tl.mode.business.desc',
    badge: 'Corporate',
    color: '#ffb84d',
  },
  {
    id: 'formal',
    titleEn: 'Formal Translation',
    titleAr: 'tl.mode.formal.title',
    descriptionAr: 'tl.mode.formal.desc',
    badge: 'tl.mode.formal.badge',
    color: '#3b82f6',
  },
  {
    id: 'informal',
    titleEn: 'Informal Translation',
    titleAr: 'tl.mode.informal.title',
    descriptionAr: 'tl.mode.informal.desc',
    badge: 'tl.mode.informal.badge',
    color: '#14b8a6',
  },
  {
    id: 'technical',
    titleEn: 'Technical Translation',
    titleAr: 'tl.mode.technical.title',
    descriptionAr: 'tl.mode.technical.desc',
    badge: 'Tech & STEM',
    color: '#f97316',
  },
  {
    id: 'conversational',
    titleEn: 'Conversational Translation',
    titleAr: 'tl.mode.conversational.title',
    descriptionAr: 'tl.mode.conversational.desc',
    badge: 'tl.mode.conversational.badge',
    color: '#06b6d4',
  },
];

export interface TranslationAlternative {
  translation: string;
  styleLabel: string;
  styleLabelAr: string;
  whenToUseAr: string;
}

export interface GrammarStructureAnalysis {
  structureName: string;
  structureNameAr: string;
  category:
    | 'tense'
    | 'passive'
    | 'conditional'
    | 'modal'
    | 'relative-clause'
    | 'phrasal-verb'
    | 'idiom'
    | 'complex-syntax';
  explanationAr: string;
  ruleFormula?: string;
  targetContrastAr: string;
}

export interface WordAnalysisDetail {
  word: string;
  cleanWord: string;
  meaningAr: string;
  partOfSpeech: string;
  partOfSpeechAr: string;
  ipa: string;
  cefrLevel: CEFRLevel;
  exampleEn: string;
  exampleAr: string;
  synonyms: string[];
  antonyms: string[];
  collocations: string[];
  relatedTerms: string[];
}

export interface IdiomExpressionAnalysis {
  idiom: string;
  literalMeaningAr: string;
  actualMeaningAr: string;
  example: string;
}

export interface TranslationTrap {
  trapEn: string;
  wrongAr: string;
  correctAr: string;
  whyTrapAr: string;
}

export interface TranslationExplanation {
  summaryMeaningAr: string;
  cefrLevel: CEFRLevel;
  grammarNotes: GrammarStructureAnalysis[];
  importantVocabulary: WordAnalysisDetail[];
  idiomsAndExpressions: IdiomExpressionAnalysis[];
  culturalContextAr: string;
  translationRationaleAr: string;
  commonTrapsAr: TranslationTrap[];
}

export interface TranslationResponse {
  originalText: string;
  translatedText: string;
  sourceLang: LanguageCode;
  detectedSourceLang?: LanguageCode;
  targetLang: LanguageCode;
  mode: TranslationMode;
  alternatives: TranslationAlternative[];
  explanation: TranslationExplanation;
  wordTokens: WordAnalysisDetail[];
  provider: string;
  model: string;
  isCached?: boolean;
  historySaved?: boolean;
}

export interface TranslationRequest {
  text: string;
  sourceLang: LanguageCode;
  targetLang: LanguageCode;
  mode: TranslationMode;
  userLevel?: CEFRLevel;
  includeAlternatives?: boolean;
  includeExplanation?: boolean;
}

export interface DocumentChunk {
  index: number;
  originalText: string;
  translatedText?: string;
  status: 'pending' | 'translating' | 'completed' | 'error';
}

export interface DocumentTranslationJob {
  id: string;
  fileName: string;
  fileSize: number;
  fileType: 'txt' | 'pdf' | 'docx';
  sourceLang: LanguageCode;
  targetLang: LanguageCode;
  mode: TranslationMode;
  totalChunks: number;
  completedChunks: number;
  chunks: DocumentChunk[];
  status: 'idle' | 'parsing' | 'translating' | 'completed' | 'error';
  errorMessage?: string;
  translatedDocumentText?: string;
  createdAt: string;
}

export interface TranslationHistoryItem {
  id: string;
  sourceText: string;
  translatedText: string;
  sourceLang: LanguageCode;
  targetLang: LanguageCode;
  mode: TranslationMode;
  timestamp: string;
  isFavorite: boolean;
  alternativesCount: number;
  summaryExplanationAr?: string;
}

export interface SavedVocabularyCard {
  id: string;
  wordOrPhrase: string;
  translationAr: string;
  definition?: string;
  partOfSpeech?: string;
  ipa?: string;
  exampleEn?: string;
  exampleAr?: string;
  personalNotes?: string;
  cefrLevel: CEFRLevel;
  collectionId?: string;
  collectionName?: string;
  // SRS properties
  repetitionCount: number;
  intervalDays: number;
  easeFactor: number;
  nextReviewAt: string;
  lastReviewedAt?: string;
  createdAt: string;
}

export interface VocabularyCollection {
  id: string;
  name: string;
  nameAr: string;
  description?: string;
  color: string;
  icon?: string;
  cardCount: number;
  createdAt: string;
}

export interface PracticeChallenge {
  id: string;
  direction: 'ar-to-en' | 'en-to-ar';
  difficulty: CEFRLevel;
  category: string;
  sourceSentence: string;
  contextHintAr: string;
  modelTranslations: string[];
  keyVocabulary: { word: string; translation: string }[];
  grammarFocusAr: string;
}

export interface PracticeEvaluationResult {
  overallScore: number;
  meaningScore: number;
  grammarScore: number;
  vocabularyScore: number;
  naturalnessScore: number;
  completenessScore: number;
  userAnswer: string;
  suggestedAnswer: string;
  alternativeValidAnswers: string[];
  feedbackAr: string;
  strengths: string[];
  mistakesAndCorrections: Array<{
    userPart: string;
    correction: string;
    reasonAr: string;
  }>;
  earnedXp: number;
}

export interface AssistantChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface OcrDetectedBox {
  text: string;
  confidence: number;
}

export interface OcrResult {
  extractedText: string;
  translatedText?: string;
  detectedLang: LanguageCode;
  boxes?: OcrDetectedBox[];
  confidence: number;
}
