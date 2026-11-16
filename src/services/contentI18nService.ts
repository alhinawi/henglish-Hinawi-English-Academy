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

const mapCache = new Map<string, Promise<ContentMap | null>>();

export function loadContentMap(bankPath: string, lang: string): Promise<ContentMap | null> {
  const key = `${bankPath}/${lang}`;
  if (!mapCache.has(key)) {
    mapCache.set(
      key,
      fetch(`/data/${bankPath}/i18n/${lang}.json`)
        .then((res) => (res.ok ? (res.json() as Promise<ContentMap>) : null))
        .catch(() => null)
    );
  }
  return mapCache.get(key)!;
}

/** React hook: translation overlay for a bank in the active UI language. */
export function useContentMap(bankPath: string): ContentMap | null {
  const { lang } = useLanguage();
  const [map, setMap] = useState<ContentMap | null>(null);
  useEffect(() => {
    let cancelled = false;
    if (!needsContentTranslation(lang)) {
      setMap(null);
      return;
    }
    loadContentMap(bankPath, lang).then((m) => {
      if (!cancelled) setMap(m);
    });
    return () => {
      cancelled = true;
    };
  }, [bankPath, lang]);
  return map;
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
