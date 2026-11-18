// ==============================================================================
// Henglish Academy (HENGLISH) - CONTENT I18N SERVICE
// Static per-language overlays for the learning content (meanings, examples,
// 10-sentence packs). Files live next to each bank under public/data and are
// lazy-loaded only when the visitor picks a UI language other than ar/en:
//   /data/<bank>/i18n/<lang>.json                     -> { "<id>": { m, e } }
//   /data/<bank>/i18n/sentences/<lang>/<block>.json   -> { items: [{id, s[]}] }
//   /data/vocab/i18n/<lang>.json                      -> { "<id>": { m, e } }
// Missing languages/entries fall back to the built-in Arabic copy.
// ==============================================================================

import { useEffect, useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';

export interface ContentTx {
  /** translated meaning (source: meaningAr) */
  m?: string;
  /** translated example (source: exampleEn) */
  e?: string;
}

export type ContentMap = Record<string, ContentTx>;

/** ar/en already ship inside the bank chunks; every other language overlays. */
export function needsContentTranslation(lang: string): boolean {
  return lang !== 'ar' && lang !== 'en';
}

async function fetchTranslationJson(url: string): Promise<{ missing: boolean; data?: unknown }> {
  const controller = new AbortController();
  const deadline = setTimeout(() => controller.abort(), 30000);
  try {
    const response = await fetch(url, { signal: controller.signal });
    if (response.status === 404) return { missing: true };
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return { missing: false, data: await response.json() };
  } finally { clearTimeout(deadline); }
}

const mapCache = new Map<string, Promise<ContentMap | null>>();

export function loadContentMap(bankPath: string, lang: string): Promise<ContentMap | null> {
  const key = `${bankPath}/${lang}`;
  if (!mapCache.has(key)) {
    mapCache.set(
      key,
      fetchTranslationJson(`/data/${bankPath}/i18n/${lang}.json`)
        .then(result => {
          if (result.missing) return null;
          const data = result.data;
          if (!data || typeof data !== 'object' || Array.isArray(data) || Object.values(data).some(value =>
            !value || typeof value !== 'object' || Array.isArray(value) || ['m', 'e'].some(field =>
              field in value && typeof (value as Record<string, unknown>)[field] !== 'string'))) {
            throw new Error('Invalid content translation map');
          }
          return data as ContentMap;
        })
        .catch(() => { mapCache.delete(key); return null; })
    );
  }
  return mapCache.get(key)!;
}

/** React hook: translation overlay for a bank in the active UI language. */
export function useContentMap(bankPath: string): ContentMap | null {
  const { lang } = useLanguage();
  const key = `${bankPath}/${lang}`;
  const [loaded, setLoaded] = useState<{ key: string; map: ContentMap | null } | null>(null);
  useEffect(() => {
    let cancelled = false;
    if (!needsContentTranslation(lang)) {
      setLoaded(null);
      return;
    }
    loadContentMap(bankPath, lang).then((m) => {
      if (!cancelled) setLoaded({ key, map: m });
    });
    return () => {
      cancelled = true;
    };
  }, [bankPath, lang, key]);
  return needsContentTranslation(lang) && loaded?.key === key ? loaded.map : null;
}

// -----------------------------------------------------------------------------
// App-content overlays: Arabic string literals from src/data + src/services,
// translated per language into static /data/app-i18n/<module>/<lang>.json files
// mapping the Arabic source string to its translation. Loaded lazily per module
// on language switch. English grammar titles/categories also have an overlay.
// -----------------------------------------------------------------------------

export type AppTextMap = Record<string, string>;

const appTextCache = new Map<string, Promise<AppTextMap | null>>();

export function loadAppTextMap(module: string, lang: string): Promise<AppTextMap | null> {
  const key = `${module}/${lang}`;
  if (!appTextCache.has(key)) {
    appTextCache.set(
      key,
      fetchTranslationJson(`/data/app-i18n/${module}/${lang}.json`)
        .then(result => {
          if (result.missing) return null;
          const data = result.data;
          if (!data || typeof data !== 'object' || Array.isArray(data) || Object.values(data).some(value => typeof value !== 'string')) {
            throw new Error('Invalid app translation map');
          }
          return data as AppTextMap;
        })
        .catch(() => { appTextCache.delete(key); return null; })
    );
  }
  return appTextCache.get(key)!;
}

/** React hook: Arabic-source translation map for one data module. */
export function useAppTextMap(module: string): AppTextMap | null {
  const { lang } = useLanguage();
  const key = `${module}/${lang}`;
  const needsOverlay = needsContentTranslation(lang) || (lang === 'en' && ['allGrammarRules', 'speakingAcademyData', 'coursesData'].includes(module));
  const [loaded, setLoaded] = useState<{ key: string; map: AppTextMap | null } | null>(null);
  useEffect(() => {
    let cancelled = false;
    if (!needsOverlay) {
      setLoaded(null);
      return;
    }
    loadAppTextMap(module, lang).then((m) => {
      if (!cancelled) setLoaded({ key, map: m });
    });
    return () => {
      cancelled = true;
    };
  }, [module, lang, key]);
  return needsOverlay && loaded?.key === key ? loaded.map : null;
}

/** Translate an Arabic source string through the module overlay. */
export function txText(map: AppTextMap | null, source: string): string {
  return map?.[source] ?? source;
}

/** Resolve the meaning/example for an entry in the active overlay. */
export function txMeaning(map: ContentMap | null, id: string, fallback: string): string {
  return map?.[id]?.m ?? fallback;
}

export function txExample(map: ContentMap | null, id: string, fallback: string): string {
  return map?.[id]?.e ?? fallback;
}

// -----------------------------------------------------------------------------
// 10-sentence overlays: same per-100-id block layout as the source packs.
// -----------------------------------------------------------------------------

const sentenceOverlayCache = new Map<string, Promise<Record<string, string[]> | null>>();

export function sentenceBlockFileName(idPrefix: string, entryId: string): string | null {
  const numeric = parseInt(entryId.replace(`${idPrefix}-`, ''), 10);
  if (!Number.isFinite(numeric) || numeric < 1) return null;
  const lo = Math.floor((numeric - 1) / 100) * 100 + 1;
  const hi = lo + 99;
  const pad = (n: number) => String(n).padStart(6, '0');
  return `${idPrefix}-sent-${pad(lo)}-${pad(hi)}.json`;
}

/**
 * Translated sentences for one entry, index-aligned with the source pack
 * (a slot that failed translation keeps its Arabic line, never a gap).
 */
export function loadSentenceOverlay(
  bankPath: string,
  lang: string,
  idPrefix: string,
  entryId: string
): Promise<string[] | null> {
  const file = sentenceBlockFileName(idPrefix, entryId);
  if (!file) return Promise.resolve(null);
  const key = `${bankPath}/${lang}/${file}`;
  if (!sentenceOverlayCache.has(key)) {
    sentenceOverlayCache.set(
      key,
      fetch(`/data/${bankPath}/i18n/sentences/${lang}/${file}`)
        .then(async (res) => {
          if (!res.ok) return null;
          const data = (await res.json()) as { items?: { id: string; s: string[] }[] };
          const map: Record<string, string[]> = {};
          for (const item of data.items ?? []) map[item.id] = item.s;
          return map;
        })
        .catch(() => null)
    );
  }
  return sentenceOverlayCache.get(key)!.then((m) => m?.[entryId] ?? null);
}
