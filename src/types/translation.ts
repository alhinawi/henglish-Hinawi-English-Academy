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
  { code: 'auto', nameEn: 'Auto Detect', nameAr: 'كشف تلقائي', flag: '✨', dir: 'ltr' },
  { code: 'en', nameEn: 'English', nameAr: 'الإنجليزية', flag: '🇬🇧', dir: 'ltr' },
  { code: 'ar', nameEn: 'Arabic', nameAr: 'العربية', flag: '🇸🇦', dir: 'rtl' },
  { code: 'fr', nameEn: 'French', nameAr: 'الفرنسية', flag: '🇫🇷', dir: 'ltr' },
  { code: 'de', nameEn: 'German', nameAr: 'الألمانية', flag: '🇩🇪', dir: 'ltr' },
  { code: 'es', nameEn: 'Spanish', nameAr: 'الإسبانية', flag: '🇪🇸', dir: 'ltr' },
  { code: 'it', nameEn: 'Italian', nameAr: 'الإيطالية', flag: '🇮🇹', dir: 'ltr' },
  { code: 'pt', nameEn: 'Portuguese', nameAr: 'البرتغالية', flag: '🇵🇹', dir: 'ltr' },
  { code: 'tr', nameEn: 'Turkish', nameAr: 'التركية', flag: '🇹🇷', dir: 'ltr' },
  { code: 'ru', nameEn: 'Russian', nameAr: 'الروسية', flag: '🇷🇺', dir: 'ltr' },
  { code: 'zh', nameEn: 'Chinese', nameAr: 'الصينية', flag: '🇨🇳', dir: 'ltr' },
  { code: 'ja', nameEn: 'Japanese', nameAr: 'اليابانية', flag: '🇯🇵', dir: 'ltr' },
  { code: 'ko', nameEn: 'Korean', nameAr: 'الكورية', flag: '🇰🇷', dir: 'ltr' },
  { code: 'nl', nameEn: 'Dutch', nameAr: 'الهولندية', flag: '🇳🇱', dir: 'ltr' },
  { code: 'sv', nameEn: 'Swedish', nameAr: 'السويدية', flag: '🇸🇪', dir: 'ltr' },
  { code: 'hi', nameEn: 'Hindi', nameAr: 'الهندية', flag: '🇮🇳', dir: 'ltr' },
  { code: 'fa', nameEn: 'Persian', nameAr: 'الفارسية', flag: '🇮🇷', dir: 'rtl' },
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
    titleAr: 'طبيعية ودارجة',
    descriptionAr: 'تنقل المعنى بسلاسة كما يتحدث بها أهل اللغة الأصليين دون تكلف.',
    badge: 'الأكثر استخداماً',
    color: '#41e7ff',
  },
  {
    id: 'literal',
    titleEn: 'Literal Translation',
    titleAr: 'حرفية دقيقة',
    descriptionAr: 'تطابق الكلمات والتركيب حرفياً لفهم بناء الجملة الأصلي وقواعدها.',
    badge: 'للتحليل النحوي',
    color: '#a855f7',
  },
  {
    id: 'professional',
    titleEn: 'Professional Translation',
    titleAr: 'مهنية احترافية',
    descriptionAr: 'صياغة متقنة مناسبة للتقارير والبيئات الوظيفية والأعمال الرسمية.',
    badge: 'سوق العمل',
    color: '#10b981',
  },
  {
    id: 'academic',
    titleEn: 'Academic Translation',
    titleAr: 'أكاديمية معتمدة',
    descriptionAr: 'لغة رصينة ومصطلحات موثقة مناسبة للأبحاث والجامعات والمقالات العلمية.',
    badge: 'جامعية',
    color: '#6366f1',
  },
  {
    id: 'casual',
    titleEn: 'Casual Translation',
    titleAr: 'يومية غير رسمية',
    descriptionAr: 'لغة الحياة اليومية والأصدقاء ومواقع التواصل الاجتماعي بانسيابية تامة.',
    badge: 'حديث يومي',
    color: '#ec4899',
  },
  {
    id: 'business',
    titleEn: 'Business Translation',
    titleAr: 'أعمال ومراسلات',
    descriptionAr: 'مخصصة للإيميلات الرسمية، المفاوضات التجارية، والعقود والشركات.',
    badge: 'Corporate',
    color: '#ffb84d',
  },
  {
    id: 'formal',
    titleEn: 'Formal Translation',
    titleAr: 'رسمية وفصحى',
    descriptionAr: 'عربية فصحى راقية أو إنجليزية رسمية مهذبة تناسب الخطابات العليا.',
    badge: 'رسمية',
    color: '#3b82f6',
  },
  {
    id: 'informal',
    titleEn: 'Informal Translation',
    titleAr: 'عامية شائعة',
    descriptionAr: 'تستخدم التعبيرات العامية الشائعة والمتداولة في الشارع بين الشباب.',
    badge: 'عامية دارجة',
    color: '#14b8a6',
  },
  {
    id: 'technical',
    titleEn: 'Technical Translation',
    titleAr: 'تقنية وتخصصية',
    descriptionAr: 'تحافظ على المصطلحات الدقيقة للبرمجة، الهندسة، الطب، والعلوم.',
    badge: 'Tech & STEM',
    color: '#f97316',
  },
  {
    id: 'conversational',
    titleEn: 'Conversational Translation',
    titleAr: 'حوارية ومحادثات',
    descriptionAr: 'صيغ حوارية تفاعلية جاهزة للاستخدام الفوري في الدردشة واللقاءات.',
    badge: 'محادثة',
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
