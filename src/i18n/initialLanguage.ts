import { DEFAULT_LANG, languageInfo } from './languages';

export function validUiLanguage(value: string | null | undefined): value is string {
  return Boolean(value && languageInfo(value).code === value);
}

// This is a language preference signal, not a nationality or location check.
// Static hosting needs no IP request, country service, cookie or paid API.
export function initialUiLanguage(urlChoice: string | null, savedChoice: string | null, browserLanguage?: string): string {
  if (validUiLanguage(urlChoice)) return urlChoice;
  if (validUiLanguage(savedChoice)) return savedChoice;
  const localeParts = browserLanguage?.trim().replace(/_/g, '-').split('-') ?? [];
  const primary = localeParts[0]?.toLowerCase();
  // Region is read from the locale, never inferred from IP or nationality.
  // Stop before extensions/private-use so en-US-x-EG is not an Egypt locale.
  const extensionIndex = localeParts.findIndex(part => part.length === 1);
  const baseParts = extensionIndex < 0 ? localeParts : localeParts.slice(0, extensionIndex);
  const region = baseParts.slice(1).find(part => /^[A-Za-z]{2}$|^[0-9]{3}$/.test(part));
  const egyptLocale = region?.toUpperCase() === 'EG';
  if (!primary || !/^[a-z]{2,3}$/.test(primary)) return DEFAULT_LANG;
  return primary === 'ar' || egyptLocale ? 'ar' : 'en';
}
