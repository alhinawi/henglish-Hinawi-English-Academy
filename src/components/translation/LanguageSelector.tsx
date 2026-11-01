// ==============================================================================
// Henglish Academy (HENGLISH) - TRANSLATION LANGUAGE SELECTOR
// Supports dynamic source & target language selection with auto-detect and swap
// ==============================================================================

import React, { useState, useRef, useEffect } from 'react';
import { LanguageCode, SupportedLanguage, SUPPORTED_LANGUAGES } from '../../types/translation';
import { ArrowLeftRight, ChevronDown, Search, Sparkles } from 'lucide-react';
import { playSound } from '../../utils/audio';

interface LanguageSelectorProps {
  sourceLang: LanguageCode;
  targetLang: LanguageCode;
  detectedLang?: LanguageCode;
  onSourceChange: (lang: LanguageCode) => void;
  onTargetChange: (lang: LanguageCode) => void;
  onSwap: () => void;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  sourceLang,
  targetLang,
  detectedLang,
  onSourceChange,
  onTargetChange,
  onSwap,
}) => {
  const [isSourceOpen, setIsSourceOpen] = useState(false);
  const [isTargetOpen, setIsTargetOpen] = useState(false);
  const [searchSource, setSearchSource] = useState('');
  const [searchTarget, setSearchTarget] = useState('');

  const sourceRef = useRef<HTMLDivElement>(null);
  const targetRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (sourceRef.current && !sourceRef.current.contains(e.target as Node)) {
        setIsSourceOpen(false);
      }
      if (targetRef.current && !targetRef.current.contains(e.target as Node)) {
        setIsTargetOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getLangInfo = (code: LanguageCode): SupportedLanguage => {
    return SUPPORTED_LANGUAGES.find(l => l.code === code) || SUPPORTED_LANGUAGES[1];
  };

  const sourceInfo = getLangInfo(sourceLang);
  const targetInfo = getLangInfo(targetLang);
  const detectedInfo = detectedLang ? getLangInfo(detectedLang) : null;

  const filteredSourceLanguages = SUPPORTED_LANGUAGES.filter(
    l =>
      l.nameEn.toLowerCase().includes(searchSource.toLowerCase()) ||
      l.nameAr.includes(searchSource)
  );

  const filteredTargetLanguages = SUPPORTED_LANGUAGES.filter(
    l =>
      l.code !== 'auto' &&
      (l.nameEn.toLowerCase().includes(searchTarget.toLowerCase()) ||
        l.nameAr.includes(searchTarget))
  );

  const handleSwapClick = () => {
    playSound('click');
    onSwap();
  };

  return (
    <div className="flex items-center justify-between gap-3 p-3 bg-[#0d0c24]/90 backdrop-blur-md rounded-2xl border border-white/10 shadow-lg">
      {/* Source Language Dropdown */}
      <div className="relative flex-1" ref={sourceRef}>
        <button
          type="button"
          onClick={() => {
            playSound('click');
            setIsSourceOpen(prev => !prev);
            setIsTargetOpen(false);
          }}
          className="w-full flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors text-right"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="text-xl shrink-0">{sourceInfo.flag}</span>
            <div className="flex flex-col text-right leading-tight min-w-0">
              <span className="text-xs text-[#b9b6d5]">لغة المصدر</span>
              <span className="text-sm font-semibold text-white truncate">
                {sourceInfo.nameAr}
                {sourceLang === 'auto' && detectedInfo && (
                  <span className="mr-1.5 text-xs text-[#41e7ff] font-normal">
                    (تم كشف: {detectedInfo.nameAr})
                  </span>
                )}
              </span>
            </div>
          </div>
          <ChevronDown className="w-4 h-4 text-[#b9b6d5] shrink-0" />
        </button>

        {/* Dropdown Menu */}
        {isSourceOpen && (
          <div className="absolute top-full right-0 mt-2 w-72 bg-[#12102e] border border-white/15 rounded-xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
            <div className="relative mb-2">
              <Search className="w-4 h-4 absolute right-3 top-2.5 text-[#b9b6d5]" />
              <input
                type="text"
                value={searchSource}
                onChange={e => setSearchSource(e.target.value)}
                placeholder="ابحث عن لغة..."
                className="w-full bg-black/40 border border-white/10 rounded-lg pr-9 pl-3 py-1.5 text-xs text-white placeholder-[#b9b6d5]/50 focus:outline-none focus:border-[#41e7ff]"
                autoFocus
              />
            </div>
            <div className="max-h-60 overflow-y-auto space-y-1 scrollbar-thin">
              {filteredSourceLanguages.map(lang => (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => {
                    playSound('click');
                    onSourceChange(lang.code);
                    setIsSourceOpen(false);
                    setSearchSource('');
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-colors ${
                    sourceLang === lang.code
                      ? 'bg-[#41e7ff]/20 text-[#41e7ff] font-bold border border-[#41e7ff]/40'
                      : 'text-slate-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span>{lang.flag}</span>
                    <span>{lang.nameAr}</span>
                  </div>
                  <span className="text-[11px] text-[#b9b6d5]/70">{lang.nameEn}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Language Swap Button */}
      <button
        type="button"
        onClick={handleSwapClick}
        title="تبديل لغة المصدر والهدف"
        className="p-2.5 rounded-xl bg-white/5 hover:bg-[#41e7ff]/20 border border-white/10 text-[#b9b6d5] hover:text-[#41e7ff] hover:border-[#41e7ff]/40 transition-all cursor-pointer active:scale-95 shrink-0"
        aria-label="تبديل اللغات"
      >
        <ArrowLeftRight className="w-4 h-4" />
      </button>

      {/* Target Language Dropdown */}
      <div className="relative flex-1" ref={targetRef}>
        <button
          type="button"
          onClick={() => {
            playSound('click');
            setIsTargetOpen(prev => !prev);
            setIsSourceOpen(false);
          }}
          className="w-full flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors text-right"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="text-xl shrink-0">{targetInfo.flag}</span>
            <div className="flex flex-col text-right leading-tight min-w-0">
              <span className="text-xs text-[#b9b6d5]">لغة الترجمة</span>
              <span className="text-sm font-semibold text-white truncate">{targetInfo.nameAr}</span>
            </div>
          </div>
          <ChevronDown className="w-4 h-4 text-[#b9b6d5] shrink-0" />
        </button>

        {/* Dropdown Menu */}
        {isTargetOpen && (
          <div className="absolute top-full left-0 mt-2 w-72 bg-[#12102e] border border-white/15 rounded-xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
            <div className="relative mb-2">
              <Search className="w-4 h-4 absolute right-3 top-2.5 text-[#b9b6d5]" />
              <input
                type="text"
                value={searchTarget}
                onChange={e => setSearchTarget(e.target.value)}
                placeholder="ابحث عن لغة..."
                className="w-full bg-black/40 border border-white/10 rounded-lg pr-9 pl-3 py-1.5 text-xs text-white placeholder-[#b9b6d5]/50 focus:outline-none focus:border-[#41e7ff]"
                autoFocus
              />
            </div>
            <div className="max-h-60 overflow-y-auto space-y-1 scrollbar-thin">
              {filteredTargetLanguages.map(lang => (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => {
                    playSound('click');
                    onTargetChange(lang.code);
                    setIsTargetOpen(false);
                    setSearchTarget('');
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-colors ${
                    targetLang === lang.code
                      ? 'bg-[#41e7ff]/20 text-[#41e7ff] font-bold border border-[#41e7ff]/40'
                      : 'text-slate-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span>{lang.flag}</span>
                    <span>{lang.nameAr}</span>
                  </div>
                  <span className="text-[11px] text-[#b9b6d5]/70">{lang.nameEn}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
