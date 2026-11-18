// ==============================================================================
// Henglish Academy (HENGLISH) - 10,000+ EXPRESSIONS, IDIOMS & PHRASAL VERBS TAB
// Specialized explorer for phrasal verbs, idioms, collocations, and business phrases
// ==============================================================================

import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Search,
  Sparkles,
  BookOpen,
  Filter,
  ChevronLeft,
  ChevronRight,
  Layers,
  MessageSquare,
  Briefcase,
  Loader2,
  X,
  RotateCcw,
} from 'lucide-react';
import { ExpressionEntry, loadExpressions } from '../../services/vocabularyService';
import { txExample, txMeaning, useContentMap } from '../../services/contentI18nService';
import { PronunciationButton } from './PronunciationButton';
import { playSound } from '../../utils/audio';
import { useLanguage } from '../../i18n/LanguageContext';

const CATEGORIES: Array<{ id: string; label?: string; labelKey?: string }> = [
  { id: 'all', labelKey: 'ex.catAll' },
  { id: 'phrasal_verb', labelKey: 'ex.catPhrasalVerb' },
  { id: 'idiom', labelKey: 'ex.catIdiom' },
  { id: 'collocation', labelKey: 'ex.catCollocation' },
  { id: 'conversational', labelKey: 'ex.catConversational' },
  { id: 'business_tech', labelKey: 'ex.catBusinessTech' },
  { id: 'common_expression', labelKey: 'ex.catCommon' },
];

export const ExpressionsTab: React.FC = () => {
  const { t, lang } = useLanguage();
  const txMap = useContentMap('expressions');
  const [expressions, setExpressions] = useState<ExpressionEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [loadAttempt, setLoadAttempt] = useState(0);
  const searchRef = useRef<HTMLInputElement>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedCefr, setSelectedCefr] = useState<string>('all');
  const [page, setPage] = useState(1);
  const pageSize = 24;

  useEffect(() => {
    let mounted = true;
    (async () => {
      setIsLoading(true);
      setLoadError(false);
      try {
        const data = await loadExpressions();
        if (mounted) {
          setExpressions(data);
          setIsLoading(false);
        }
      } catch (err) {
        console.error('Error loading expressions:', err);
        if (mounted) { setLoadError(true); setIsLoading(false); }
      }
    })();
    return () => {
      mounted = false;
    };
  }, [loadAttempt]);

  useEffect(() => {
    setPage(1);
  }, [searchQuery, selectedCategory, selectedCefr]);

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return expressions.filter(item => {
      if (q) {
        const searchable = [item.expression, item.meaningAr, item.definitionEn,
          item.exampleEn, item.exampleAr, txMeaning(txMap, item.id, item.meaningAr),
          txExample(txMap, item.id, item.exampleAr)];
        if (!searchable.some(value => value.toLowerCase().includes(q))) return false;
      }
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }
      if (selectedCefr !== 'all' && item.cefr !== selectedCefr) {
        return false;
      }
      return true;
    });
  }, [expressions, searchQuery, selectedCategory, selectedCefr, txMap]);

  const totalMatches = filtered.length;
  const totalPages = Math.ceil(totalMatches / pageSize) || 1;
  const currentPage = Math.max(1, Math.min(page, totalPages));
  const offset = (currentPage - 1) * pageSize;
  const pagedItems = filtered.slice(offset, offset + pageSize);

  return (
    <div className="space-y-8 text-right">
      {/* Search & Category Filter Section */}
      <section className="glass-panel p-5 sm:p-7 rounded-3xl border border-white/10 space-y-5">
        <div className="relative">
          <Search className="w-5 h-5 text-[#ffd166] absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            dir="auto"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            ref={searchRef}
            aria-label={t('ex.searchPlaceholder')}
            placeholder={t('ex.searchPlaceholder')}
            className="w-full pl-12 pr-12 py-3.5 rounded-2xl bg-[#09091a] border border-white/15 text-white placeholder-white/40 text-sm font-sans focus:outline-none focus:border-[#ffd166]"
          />
          {searchQuery && (
            <button
              aria-label={t('se.clear')}
              onClick={() => { setSearchQuery(''); searchRef.current?.focus(); }}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white/70"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Categories Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              aria-pressed={selectedCategory === cat.id}
              onClick={() => {
                playSound('click');
                setSelectedCategory(cat.id);
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer border ${
                selectedCategory === cat.id
                  ? 'bg-[#ffd166]/20 text-[#ffd166] border-[#ffd166]/50 shadow-sm'
                  : 'bg-white/5 text-white/70 hover:bg-white/10 border-white/5'
              }`}
            >
              {cat.labelKey ? t(cat.labelKey) : cat.label}
            </button>
          ))}
        </div>

        {/* Count overview */}
        <div className="text-xs text-white/60 font-bold flex items-center justify-between pt-2 border-t border-white/10">
          <div>
            <span>{t('ex.found')} </span>
            <strong className="text-[#ffd166] text-sm">
              {totalMatches.toLocaleString()}
            </strong>
            <span> {t('ex.foundSuffix')}</span>
          </div>

          <span className="text-[11px] text-white/40">
            {t('ex.approvedSet')}
          </span>
        </div>
      </section>

      {/* Grid of Expressions */}
      {loadError ? (
        <div role="alert" className="glass-panel p-8 rounded-3xl border border-red-400/20 text-center space-y-4">
          <p className="text-sm text-red-200">{t('ex.loadError')}</p>
          <button onClick={() => setLoadAttempt(n => n + 1)} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 text-white text-sm font-bold cursor-pointer">
            <RotateCcw className="w-4 h-4" />{t('ex.retry')}
          </button>
        </div>
      ) : isLoading ? (
        <div className="p-16 rounded-3xl border border-white/10 text-center space-y-4">
          <Loader2 className="w-10 h-10 text-[#ffd166] animate-spin mx-auto" />
          <p className="text-white/80 font-bold text-sm">{t('ex.loading')}</p>
        </div>
      ) : pagedItems.length === 0 ? (
        <div className="glass-panel p-16 rounded-3xl border border-white/10 text-center space-y-3">
          <BookOpen className="w-10 h-10 text-white/30 mx-auto" />
          <h4 className="text-lg font-black text-white">{t('ex.noResults')}</h4>
          <p className="text-xs text-white/60">{t('ex.noResultsHint')}</p>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {pagedItems.map(item => (
              <div
                key={item.id}
                className="glass-panel p-5 rounded-2xl border border-white/10 hover:border-white/30 transition-all flex flex-col justify-between space-y-3 text-right"
              >
                {/* Header with Category Badge and CEFR */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <PronunciationButton wordId={`expression:${item.id}`} wordText={item.expression} accent="US" size="sm" />
                    <PronunciationButton wordId={`expression:${item.id}`} wordText={item.expression} accent="UK" size="sm" />
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white/10 text-white/70">
                      {item.category.replace('_', ' ')}
                    </span>
                    <span className="text-[10px] font-black px-2 py-0.5 rounded bg-[#ffd166]/15 text-[#ffd166] border border-[#ffd166]/30">
                      {item.cefr}
                    </span>
                  </div>
                </div>

                {/* Expression & Meaning */}
                <div className="space-y-1">
                  <h3 className="en text-xl font-black text-white tracking-tight" dir="ltr">
                    {item.expression}
                  </h3>
                  <p className="text-sm font-black text-[#c4ff55]">
                    {(lang === 'en' ? item.definitionEn : txMeaning(txMap, item.id, item.meaningAr))}
                  </p>
                </div>

                {/* English Definition */}
                <p className="text-xs text-white/70 line-clamp-2 leading-relaxed font-sans" dir="ltr">
                  {item.definitionEn}
                </p>

                {/* Bilingual Example */}
                {item.exampleEn && (
                  <div className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-1 text-xs">
                    <p className="font-bold text-white/90 font-sans" dir="ltr">
                      "{item.exampleEn}"
                    </p>
                    <p className="text-white/60 text-[11px]">
                      {(lang === 'en' ? item.exampleEn : txExample(txMap, item.id, item.exampleAr))}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between p-4 rounded-2xl glass-panel border border-white/10">
              <span className="text-xs text-white/60 font-bold">
                {t('ex.page')} <strong className="text-white">{currentPage}</strong> {t('ex.of')}{' '}
                <strong className="text-white">{totalPages}</strong> ({totalMatches.toLocaleString()} {t('ex.expressions')})
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    playSound('click');
                    setPage(p => Math.max(1, p - 1));
                  }}
                  disabled={currentPage <= 1}
                  className="px-3 py-1.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-xs font-bold text-white disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer flex items-center gap-1"
                >
                  <ChevronRight className="w-4 h-4" />
                  <span>{t('ex.prev')}</span>
                </button>

                <button
                  onClick={() => {
                    playSound('click');
                    setPage(p => Math.min(totalPages, p + 1));
                  }}
                  disabled={currentPage >= totalPages}
                  className="px-3 py-1.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-xs font-bold text-white disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer flex items-center gap-1"
                >
                  <span>{t('ex.next')}</span>
                  <ChevronLeft className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

