// ==============================================================================
// Henglish Academy (HENGLISH) - UI LANGUAGE CONTEXT
// Lazy-loaded per-language string tables, RTL/LTR switching, persisted choice.
// Fallback order: chosen language -> English -> Arabic.
// ==============================================================================

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { DEFAULT_LANG, FALLBACK_LANG, languageInfo } from './languages';
import arMessages from './locales/ar.json';
import enMessages from './locales/en.json';

export type Messages = Record<string, string>;

const STATIC: Record<string, Messages> = {
  ar: arMessages as Messages,
  en: enMessages as Messages,
};

// Explicit literal dynamic imports: import.meta.glob is Vite-only and crashes
// the Next.js production build, so every locale file gets one literal entry.
const loaders: Record<string, () => Promise<Messages>> = {
  de: () => import('./locales/de.json').then((m) => m.default as Messages),
  fr: () => import('./locales/fr.json').then((m) => m.default as Messages),
  es: () => import('./locales/es.json').then((m) => m.default as Messages),
  pt: () => import('./locales/pt.json').then((m) => m.default as Messages),
  it: () => import('./locales/it.json').then((m) => m.default as Messages),
  ru: () => import('./locales/ru.json').then((m) => m.default as Messages),
  tr: () => import('./locales/tr.json').then((m) => m.default as Messages),
  zh: () => import('./locales/zh.json').then((m) => m.default as Messages),
  ja: () => import('./locales/ja.json').then((m) => m.default as Messages),
  ko: () => import('./locales/ko.json').then((m) => m.default as Messages),
  hi: () => import('./locales/hi.json').then((m) => m.default as Messages),
  ur: () => import('./locales/ur.json').then((m) => m.default as Messages),
  fa: () => import('./locales/fa.json').then((m) => m.default as Messages),
  id: () => import('./locales/id.json').then((m) => m.default as Messages),
  ms: () => import('./locales/ms.json').then((m) => m.default as Messages),
  bn: () => import('./locales/bn.json').then((m) => m.default as Messages),
  nl: () => import('./locales/nl.json').then((m) => m.default as Messages),
  pl: () => import('./locales/pl.json').then((m) => m.default as Messages),
  uk: () => import('./locales/uk.json').then((m) => m.default as Messages),
  sv: () => import('./locales/sv.json').then((m) => m.default as Messages),
  el: () => import('./locales/el.json').then((m) => m.default as Messages),
  he: () => import('./locales/he.json').then((m) => m.default as Messages),
  th: () => import('./locales/th.json').then((m) => m.default as Messages),
  vi: () => import('./locales/vi.json').then((m) => m.default as Messages),
  ro: () => import('./locales/ro.json').then((m) => m.default as Messages),
  cs: () => import('./locales/cs.json').then((m) => m.default as Messages),
  hu: () => import('./locales/hu.json').then((m) => m.default as Messages),
  sw: () => import('./locales/sw.json').then((m) => m.default as Messages),
};

async function loadMessages(code: string): Promise<Messages | null> {
  if (STATIC[code]) return STATIC[code];
  const loader = loaders[code];
  if (!loader) return null;
  try {
    return await loader();
  } catch {
    return null;
  }
}

interface LanguageContextValue {
  lang: string;
  dir: 'rtl' | 'ltr';
  setLang: (code: string) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextValue>({
  lang: DEFAULT_LANG,
  dir: 'rtl',
  setLang: () => {},
  t: (key) => key,
});

const STORAGE_KEY = 'henglish_ui_lang_v1';

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<string>(() => {
    try {
      const fromUrl = new URLSearchParams(window.location.search).get('lang');
      if (fromUrl && languageInfo(fromUrl).code === fromUrl) return fromUrl;
      return localStorage.getItem(STORAGE_KEY) || DEFAULT_LANG;
    } catch {
      return DEFAULT_LANG;
    }
  });
  const [messages, setMessages] = useState<Messages>(STATIC[DEFAULT_LANG]);

  useEffect(() => {
    let cancelled = false;
    loadMessages(lang).then((m) => {
      if (cancelled) return;
      setMessages(m ?? (STATIC[FALLBACK_LANG] as Messages));
    });
    const info = languageInfo(lang);
    document.documentElement.lang = info.code;
    document.documentElement.dir = info.dir;
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      /* private mode */
    }
    return () => {
      cancelled = true;
    };
  }, [lang]);

  const value = useMemo<LanguageContextValue>(() => {
    const info = languageInfo(lang);
    const en = STATIC[FALLBACK_LANG] as Messages;
    const ar = STATIC[DEFAULT_LANG] as Messages;
    return {
      lang,
      dir: info.dir,
      setLang: setLangState,
      t: (key: string) => messages[key] ?? en[key] ?? ar[key] ?? key,
    };
  }, [lang, messages]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export function useLanguage(): LanguageContextValue {
  return useContext(LanguageContext);
}
