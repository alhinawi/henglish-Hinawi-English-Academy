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


async function loadMessages(code: string): Promise<Messages | null> {
  if (STATIC[code]) return STATIC[code];
  if (!/^[a-z]{2,3}(-[A-Za-z]{2,4})?$/.test(code)) return null;
  try {
    // webpack builds a context module for ./locales/*.json, so every locale file becomes its own lazy chunk.
    const mod = await import(`./locales/${code}.json`);
    return (mod.default ?? mod) as Messages;
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
