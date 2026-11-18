import { DEFAULT_LANG, languageInfo } from './languages';

export function validUiLanguage(value: string | null | undefined): value is string {
  return Boolean(value && languageInfo(value).code === value);
}

// This is a language preference signal, not a nationality or location check.
// Static hosting needs no IP request, country service, cookie or paid API.
export function initialUiLanguage(urlChoice: string | null, savedChoice: string | null, browserLanguage?: string): string {
  if (validUiLanguage(urlChoice)) return urlChoice;
  if (validUiLanguage(savedChoice)) return savedChoice;
  const primary = browserLanguage?.trim().split(/[-_]/)[0].toLowerCase();
  if (!primary || !/^[a-z]{2,3}$/.test(primary)) return DEFAULT_LANG;
  return primary === 'ar' ? 'ar' : 'en';
}
