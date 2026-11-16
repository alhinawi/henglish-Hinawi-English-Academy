// ==============================================================================
// Henglish Academy (HENGLISH) - UI LANGUAGES REGISTRY
// Data-driven language list for the interface. Locale files lazy-load from
// ./locales/<code>.json; missing files fall back to English, then Arabic.
// `reviewed` marks hand-reviewed translations (vs working drafts).
// ==============================================================================

export interface LanguageInfo {
  code: string;
  nativeName: string;
  englishName: string;
  dir: 'rtl' | 'ltr';
  reviewed: boolean;
}

export const DEFAULT_LANG = 'ar';
export const FALLBACK_LANG = 'en';

export const LANGUAGES: LanguageInfo[] = [
  { code: 'ar', nativeName: 'العربية', englishName: 'Arabic', dir: 'rtl', reviewed: true },
  { code: 'en', nativeName: 'English', englishName: 'English', dir: 'ltr', reviewed: true },
  { code: 'de', nativeName: 'Deutsch', englishName: 'German', dir: 'ltr', reviewed: true },
  { code: 'fr', nativeName: 'Français', englishName: 'French', dir: 'ltr', reviewed: false },
  { code: 'es', nativeName: 'Español', englishName: 'Spanish', dir: 'ltr', reviewed: false },
  { code: 'pt', nativeName: 'Português', englishName: 'Portuguese', dir: 'ltr', reviewed: false },
  { code: 'it', nativeName: 'Italiano', englishName: 'Italian', dir: 'ltr', reviewed: false },
  { code: 'ru', nativeName: 'Русский', englishName: 'Russian', dir: 'ltr', reviewed: false },
  { code: 'tr', nativeName: 'Türkçe', englishName: 'Turkish', dir: 'ltr', reviewed: false },
  { code: 'zh', nativeName: '中文', englishName: 'Chinese', dir: 'ltr', reviewed: false },
  { code: 'ja', nativeName: '日本語', englishName: 'Japanese', dir: 'ltr', reviewed: false },
  { code: 'ko', nativeName: '한국어', englishName: 'Korean', dir: 'ltr', reviewed: false },
  { code: 'hi', nativeName: 'हिन्दी', englishName: 'Hindi', dir: 'ltr', reviewed: false },
  { code: 'ur', nativeName: 'اردو', englishName: 'Urdu', dir: 'rtl', reviewed: false },
  { code: 'fa', nativeName: 'فارسی', englishName: 'Persian', dir: 'rtl', reviewed: false },
  { code: 'id', nativeName: 'Bahasa Indonesia', englishName: 'Indonesian', dir: 'ltr', reviewed: false },
  { code: 'ms', nativeName: 'Bahasa Melayu', englishName: 'Malay', dir: 'ltr', reviewed: false },
  { code: 'bn', nativeName: 'বাংলা', englishName: 'Bengali', dir: 'ltr', reviewed: false },
  { code: 'nl', nativeName: 'Nederlands', englishName: 'Dutch', dir: 'ltr', reviewed: false },
  { code: 'pl', nativeName: 'Polski', englishName: 'Polish', dir: 'ltr', reviewed: false },
  { code: 'uk', nativeName: 'Українська', englishName: 'Ukrainian', dir: 'ltr', reviewed: false },
  { code: 'sv', nativeName: 'Svenska', englishName: 'Swedish', dir: 'ltr', reviewed: false },
  { code: 'el', nativeName: 'Ελληνικά', englishName: 'Greek', dir: 'ltr', reviewed: false },
  { code: 'he', nativeName: 'עברית', englishName: 'Hebrew', dir: 'rtl', reviewed: false },
  { code: 'th', nativeName: 'ไทย', englishName: 'Thai', dir: 'ltr', reviewed: false },
  { code: 'vi', nativeName: 'Tiếng Việt', englishName: 'Vietnamese', dir: 'ltr', reviewed: false },
  { code: 'ro', nativeName: 'Română', englishName: 'Romanian', dir: 'ltr', reviewed: false },
  { code: 'cs', nativeName: 'Čeština', englishName: 'Czech', dir: 'ltr', reviewed: false },
  { code: 'hu', nativeName: 'Magyar', englishName: 'Hungarian', dir: 'ltr', reviewed: false },
  { code: 'sw', nativeName: 'Kiswahili', englishName: 'Swahili', dir: 'ltr', reviewed: false },
];

export function languageInfo(code: string): LanguageInfo {
  return LANGUAGES.find((l) => l.code === code) ?? LANGUAGES[0];
}
