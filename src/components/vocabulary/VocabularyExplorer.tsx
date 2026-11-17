// ==============================================================================
// Henglish Academy (HENGLISH) - INTELLIGENT VOCABULARY EXPLORER
// Vocabulary entries from the legacy set and frequency chunks
// Search-first layout with bottom-sheet filters
// ==============================================================================

import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Search,
  LayoutGrid,
  List,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Loader2,
  X,
  SlidersHorizontal,
} from 'lucide-react';
import {
  LexicalEntry,
  CEFRLevel,
  loadVocabularyCore,
  loadFullVocabulary,
  searchVocabulary,
  getLoadedVocabularyCount,
} from '../../services/vocabularyService';
import { WordCard } from './WordCard';
import { WordDetailModal } from './WordDetailModal';
import { playSound } from '../../utils/audio';
import { useLanguage } from '../../i18n/LanguageContext';

const CEFR_OPTIONS: Array<{ id: CEFRLevel | 'all'; label: string }> = [
  { id: 'all', label: 'vx.all' },
  { id: 'A1', label: 'A1' },
  { id: 'A2', label: 'A2' },
  { id: 'B1', label: 'B1' },
  { id: 'B2', label: 'B2' },
  { id: 'C1', label: 'C1' },
  { id: 'C2', label: 'C2' },
];

const POS_OPTIONS = [
  { id: 'all', label: 'vx.pos.all' },
  { id: 'noun', label: 'vx.pos.noun' },
  { id: 'verb', label: 'vx.pos.verb' },
  { id: 'adjective', label: 'vx.pos.adjective' },
  { id: 'adverb', label: 'vx.pos.adverb' },
  { id: 'pronoun', label: 'vx.pos.pronoun' },
  { id: 'preposition', label: 'vx.pos.preposition' },
  { id: 'conjunction', label: 'vx.pos.conjunction' },
  { id: 'determiner', label: 'vx.pos.determiner' },
  { id: 'number', label: 'vx.pos.number' },
  { id: 'interjection', label: 'vx.pos.interjection' },
  { id: 'modal verb', label: 'vx.pos.modalVerb' },
  { id: 'particle', label: 'vx.pos.particle' },
  { id: 'phrasal verb', label: 'vx.pos.phrasalVerb' },
];

const LETTERS = 'abcdefghijklmnopqrstuvwxyz'.split('');

const DOMAIN_OPTIONS = [
  { id: 'all', label: 'vx.domain.all' },
  { id: 'everyday', label: 'vx.domain.everyday' },
  { id: 'business', label: 'vx.domain.business' },
  { id: 'tech', label: 'vx.domain.tech' },
  { id: 'academic', label: 'vx.domain.academic' },
  { id: 'travel', label: 'vx.domain.travel' },
  { id: 'workplace', label: 'vx.domain.workplace' },
  { id: 'medical', label: 'vx.domain.medical' },
  { id: 'food', label: 'vx.domain.food' },
  { id: 'hotel', label: 'vx.domain.hotel' },
  { id: 'phrasal_verbs', label: 'vx.domain.phrasalVerbs' },
  { id: 'idioms', label: 'vx.domain.idioms' },
  { id: 'collocations', label: 'vx.domain.collocations' },
];

const FREQUENCY_OPTIONS = [
  { id: 'all', label: 'vx.freq.all' },
  { id: 'top500', label: 'vx.freq.top500' },
  { id: 'top1000', label: 'vx.freq.top1000' },
  { id: 'top2000', label: 'vx.freq.top2000' },
  { id: 'top3000', label: 'vx.freq.top3000' },
  { id: 'top5000', label: 'vx.freq.top5000' },
  { id: 'advanced', label: 'vx.freq.advanced' },
  { id: 'rare', label: 'vx.freq.rare' },
];

const SORT_OPTIONS = [
  { id: 'popular', label: 'vx.sort.popular' },
  { id: 'alpha_asc', label: 'vx.sort.alphaAsc' },
  { id: 'alpha_desc', label: 'vx.sort.alphaDesc' },
  { id: 'cefr_asc', label: 'vx.sort.cefrAsc' },
  { id: 'cefr_desc', label: 'vx.sort.cefrDesc' },
];

export const VocabularyExplorer: React.FC = () => {
  const { t } = useLanguage();
  const optT = (opts: Array<{ id: string; label: string }>, id: string) => { const o = opts.find(x => x.id === id); return o ? t(o.label) : id; };
  // Filters & State
  const searchRef = useRef<HTMLInputElement>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCefr, setSelectedCefr] = useState<CEFRLevel | 'all'>('all');
  const [selectedPos, setSelectedPos] = useState<string>('all');
  const [selectedDomain, setSelectedDomain] = useState<string>('all');
  const [selectedLetter, setSelectedLetter] = useState<string>('all');
  const [selectedFrequency, setSelectedFrequency] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'popular' | 'alpha_asc' | 'alpha_desc' | 'cefr_asc' | 'cefr_desc'>('popular');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [page, setPage] = useState(1);
  const [pageSize] = useState(30);

  // Bottom sheet
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);

  // Data Loading State
  const [isLoading, setIsLoading] = useState(true);
  const [isFullLoading, setIsFullLoading] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [loadAttempt, setLoadAttempt] = useState(0);

  // Selected Word for Modal Inspector
  const [selectedModalWord, setSelectedModalWord] = useState<LexicalEntry | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Saved words mutation trigger
  const [savedUpdateCount, setSavedUpdateCount] = useState(0);

  // Initial load: legacy set for instant hydration,
  // then frequency chunks in the background
  useEffect(() => {
    let mounted = true;
    (async () => {
      setIsLoading(getLoadedVocabularyCount() === 0);
      setLoadError(false);
      try {
        await loadVocabularyCore();
        if (!mounted) return;
        setIsLoading(false);
        setIsFullLoading(true);
        await loadFullVocabulary();
      } catch (err) {
        console.error('Failed to initialize vocabulary explorer:', err);
        if (mounted) setLoadError(true);
      } finally {
        if (mounted) {
          setIsLoading(false);
          setIsFullLoading(false);
        }
      }
    })();
    return () => {
      mounted = false;
    };
  }, [loadAttempt]);

  // Reset page when any filter changes
  useEffect(() => {
    setPage(1);
  }, [searchQuery, selectedCefr, selectedPos, selectedDomain, selectedLetter, selectedFrequency, sortBy]);

  const loadedCount = getLoadedVocabularyCount();

  const searchResults = useMemo(() => {
    return searchVocabulary({
      searchQuery,
      cefr: selectedCefr,
      pos: selectedPos,
      domain: selectedDomain,
      letter: selectedLetter,
      frequencyTier: selectedFrequency,
      sortBy,
      page,
      pageSize,
    });
  }, [
    searchQuery,
    selectedCefr,
    selectedPos,
    selectedDomain,
    selectedLetter,
    selectedFrequency,
    sortBy,
    page,
    pageSize,
    isLoading,
    isFullLoading,
    savedUpdateCount,
  ]);

  const handleOpenDetails = (entry: LexicalEntry) => {
    playSound('click');
    setSelectedModalWord(entry);
    setIsModalOpen(true);
  };

  const handleClearFilters = () => {
    playSound('click');
    setSearchQuery('');
    setSelectedCefr('all');
    setSelectedPos('all');
    setSelectedDomain('all');
    setSelectedLetter('all');
    setSelectedFrequency('all');
    setSortBy('popular');
  };

  const activeChips: Array<{ key: string; label: string; clear: () => void }> = [];
  if (searchQuery !== '') {
    activeChips.push({ key: 'q', label: t('vx.chipSearch').replace('{q}', searchQuery), clear: () => setSearchQuery('') });
  }
  if (selectedCefr !== 'all') {
    activeChips.push({ key: 'cefr', label: selectedCefr, clear: () => setSelectedCefr('all') });
  }
  if (selectedPos !== 'all') {
    activeChips.push({
      key: 'pos',
      label: optT(POS_OPTIONS, selectedPos),
      clear: () => setSelectedPos('all'),
    });
  }
  if (selectedDomain !== 'all') {
    activeChips.push({
      key: 'domain',
      label: optT(DOMAIN_OPTIONS, selectedDomain),
      clear: () => setSelectedDomain('all'),
    });
  }
  if (selectedLetter !== 'all') {
    activeChips.push({
      key: 'letter',
      label: t('vx.chipLetter').replace('{L}', selectedLetter.toUpperCase()),
      clear: () => setSelectedLetter('all'),
    });
  }
  if (selectedFrequency !== 'all') {
    activeChips.push({
      key: 'freq',
      label: optT(FREQUENCY_OPTIONS, selectedFrequency),
      clear: () => setSelectedFrequency('all'),
    });
  }
  if (sortBy !== 'popular') {
    activeChips.push({
      key: 'sort',
      label: optT(SORT_OPTIONS, sortBy),
      clear: () => setSortBy('popular'),
    });
  }

  const sheetFilterCount =
    (selectedPos !== 'all' ? 1 : 0) +
    (selectedDomain !== 'all' ? 1 : 0) +
    (selectedLetter !== 'all' ? 1 : 0) +
    (selectedFrequency !== 'all' ? 1 : 0) +
    (sortBy !== 'popular' ? 1 : 0);

  const hasActiveFilters = activeChips.length > 0;

  const selectClass =
    'w-full px-3 py-2.5 rounded-xl bg-[#09091a] border border-white/10 text-sm font-bold text-white focus:outline-none focus:border-[#41e7ff] cursor-pointer';

  return (
    <div className="space-y-5 text-right">
      {/* Search bar */}
      <div className="relative">
        <Search className="w-5 h-5 text-[#41e7ff] absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          dir="auto"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          ref={searchRef}
          aria-label={t('vx.searchPlaceholder')}
          placeholder={t('vx.searchPlaceholder')}
          className="w-full pl-12 pr-12 py-3.5 rounded-2xl bg-[#09091a] border border-white/15 text-white placeholder-white/40 text-sm sm:text-base font-sans focus:outline-none focus:border-[#41e7ff] shadow-inner transition-colors"
        />
        {searchQuery && (
          <button
            aria-label={t('se.clear')}
            onClick={() => { setSearchQuery(''); searchRef.current?.focus(); }}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white/70 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* CEFR chip row + filter button */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar flex-1">
          {CEFR_OPTIONS.map(c => (
            <button
              key={c.id}
              aria-pressed={selectedCefr === c.id}
              onClick={() => {
                playSound('click');
                setSelectedCefr(c.id);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer border ${
                selectedCefr === c.id
                  ? 'bg-[#c4ff55]/20 text-[#c4ff55] border-[#c4ff55]/50 shadow-sm'
                  : 'bg-white/5 text-white/70 hover:bg-white/10 border-white/5'
              }`}
            >
              {t(c.label)}
            </button>
          ))}
        </div>
        <button
          onClick={() => {
            playSound('click');
            setIsFilterSheetOpen(true);
          }}
          className="relative inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all cursor-pointer shrink-0"
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span>{t('vx.filters')}</span>
          {sheetFilterCount > 0 && (
            <span className="absolute -top-1.5 -left-1.5 w-4.5 h-4.5 min-w-[18px] min-h-[18px] px-0.5 rounded-full bg-[#c4ff55] text-[#09091a] text-[10px] font-black flex items-center justify-center">
              {sheetFilterCount}
            </span>
          )}
        </button>
      </div>

      {/* Sticky count + view toggle */}
      <div className="sticky top-2 z-20 flex flex-wrap items-center justify-between gap-2 px-3 py-2 rounded-2xl bg-[#0c0c20]/90 backdrop-blur-md border border-white/10">
        <div className="flex flex-wrap items-center gap-2">
          <div className="text-xs text-white/70 font-bold">
            <strong className="text-[#c4ff55]">{searchResults.totalMatches.toLocaleString()}</strong>
            <span>{' '}{t('vx.words')}</span>
            <span className="text-white/40 text-[11px] mr-1.5">
              ({t('vx.ofVerified').replace('{n}', loadedCount.toLocaleString())})
            </span>
            {isFullLoading && (
              <Loader2 className="w-3 h-3 inline-block animate-spin text-[#41e7ff] mr-1" />
            )}
          </div>
          {activeChips.map(chip => (
            <button
              key={chip.key}
              onClick={() => {
                playSound('click');
                chip.clear();
              }}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[11px] font-bold bg-[#41e7ff]/10 text-[#41e7ff] border border-[#41e7ff]/30 hover:bg-[#41e7ff]/20 transition-all cursor-pointer"
            >
              <span>{chip.label}</span>
              <X className="w-3 h-3" />
            </button>
          ))}
          {hasActiveFilters && (
            <button
              onClick={handleClearFilters}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[11px] font-black text-red-400 hover:bg-red-500/10 transition-all cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>{t('vx.clearAll')}</span>
            </button>
          )}
        </div>
        <div className="flex items-center p-0.5 rounded-lg bg-white/5 border border-white/10">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-1.5 rounded-md transition-all cursor-pointer ${
              viewMode === 'grid' ? 'bg-white/20 text-white' : 'text-white/40 hover:text-white'
            }`}
            title={t('vx.gridView')}
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-1.5 rounded-md transition-all cursor-pointer ${
              viewMode === 'list' ? 'bg-white/20 text-white' : 'text-white/40 hover:text-white'
            }`}
            title={t('vx.listView')}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {loadError && (
        <div role="alert" className="glass-panel p-5 rounded-2xl border border-red-400/20 space-y-3 text-center">
          <p className="text-sm text-red-200">{t('vx.loadError')}</p>
          <button onClick={() => setLoadAttempt(n => n + 1)} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 text-white text-sm font-bold cursor-pointer">
            <RotateCcw className="w-4 h-4" />{t('ex.retry')}
          </button>
        </div>
      )}
      {/* Words Grid / List Content */}
      {isLoading ? (
        <div className="p-16 rounded-3xl border border-white/10 text-center space-y-4">
          <Loader2 className="w-10 h-10 text-[#41e7ff] animate-spin mx-auto" />
          <p className="text-white/80 font-bold text-sm">{t('vx.loading')}</p>
        </div>
      ) : loadError && searchResults.entries.length === 0 ? null : searchResults.entries.length === 0 ? (
        <div className="glass-panel p-16 rounded-3xl border border-white/10 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-white/40">
            <Search className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-black text-white">{t('vx.noMatches')}</h3>
          <p className="text-sm text-white/60 max-w-md mx-auto">
            {t('vx.noMatchesHint')}
          </p>
          <button
            onClick={handleClearFilters}
            className="px-4 py-2 rounded-xl bg-[#41e7ff] text-[#09091a] text-xs font-black hover:bg-[#70efff] transition-all cursor-pointer"
          >
            {t('vx.clearFilters')}
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          <div
            className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                : 'space-y-3'
            }
          >
            {searchResults.entries.map(entry => (
              <WordCard
                key={entry.id}
                entry={entry}
                onOpenDetails={handleOpenDetails}
                savedVersion={savedUpdateCount}
                onSavedChange={() => setSavedUpdateCount(c => c + 1)}
                viewMode={viewMode}
              />
            ))}
          </div>

          {/* Pagination Controls */}
          {searchResults.totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl glass-panel border border-white/10">
              <div className="text-xs text-white/60 font-bold">
                {t('ex.page')} <strong className="text-white">{searchResults.page}</strong> {t('ex.of')}{' '}
                <strong className="text-white">{searchResults.totalPages}</strong>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    playSound('click');
                    setPage(p => Math.max(1, p - 1));
                  }}
                  disabled={searchResults.page <= 1}
                  className="px-3 py-1.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-xs font-bold text-white disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer flex items-center gap-1"
                >
                  <ChevronRight className="w-4 h-4" />
                  <span>{t('vx.prev')}</span>
                </button>

                <div className="flex items-center gap-1">
                  {[...Array(Math.min(5, searchResults.totalPages))].map((_, i) => {
                    let pageNum = searchResults.page - 2 + i;
                    if (pageNum < 1) pageNum = i + 1;
                    if (pageNum > searchResults.totalPages) return null;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => {
                          playSound('click');
                          setPage(pageNum);
                        }}
                        className={`w-8 h-8 rounded-xl text-xs font-black transition-all cursor-pointer ${
                          searchResults.page === pageNum
                            ? 'bg-[#c4ff55] text-[#09091a]'
                            : 'bg-white/5 text-white/70 hover:bg-white/10'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => {
                    playSound('click');
                    setPage(p => Math.min(searchResults.totalPages, p + 1));
                  }}
                  disabled={searchResults.page >= searchResults.totalPages}
                  className="px-3 py-1.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-xs font-bold text-white disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer flex items-center gap-1"
                >
                  <span>{t('vx.next')}</span>
                  <ChevronLeft className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Filter bottom sheet */}
      {isFilterSheetOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsFilterSheetOpen(false)}
          />
          <div className="relative w-full max-w-lg bg-[#121124] border-t border-white/15 rounded-t-3xl p-6 space-y-5 text-right shadow-2xl max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-white">{t('vx.searchFilters')}</h3>
              <button
                onClick={() => setIsFilterSheetOpen(false)}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white/70 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-white/60">{t('vx.firstLetter')}</label>
              <div dir="ltr" className="flex flex-wrap gap-1.5 justify-end">
                <button
                  onClick={() => {
                    playSound('click');
                    setSelectedLetter('all');
                  }}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer border ${
                    selectedLetter === 'all'
                      ? 'bg-[#c4ff55]/20 text-[#c4ff55] border-[#c4ff55]/50'
                      : 'bg-white/5 text-white/70 hover:bg-white/10 border-white/5'
                  }`}
                >
                  {t('vx.all')}
                </button>
                {LETTERS.map(l => (
                  <button
                    key={l}
                    onClick={() => {
                      playSound('click');
                      setSelectedLetter(l);
                    }}
                    className={`w-8 h-8 rounded-lg text-xs font-black uppercase transition-all cursor-pointer border ${
                      selectedLetter === l
                        ? 'bg-[#c4ff55]/20 text-[#c4ff55] border-[#c4ff55]/50'
                        : 'bg-white/5 text-white/70 hover:bg-white/10 border-white/5'
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-white/60">{t('vx.posLabel')}</label>
              <div className="flex flex-wrap gap-1.5">
                {POS_OPTIONS.map(p => (
                  <button
                    key={p.id}
                    onClick={() => {
                      playSound('click');
                      setSelectedPos(p.id);
                    }}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer border ${
                      selectedPos === p.id
                        ? 'bg-[#c4ff55]/20 text-[#c4ff55] border-[#c4ff55]/50'
                        : 'bg-white/5 text-white/70 hover:bg-white/10 border-white/5'
                    }`}
                  >
                    {t(p.label)}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-white/60">{t('vx.domainLabel')}</label>
              <select
                value={selectedDomain}
                onChange={e => setSelectedDomain(e.target.value)}
                className={selectClass}
              >
                {DOMAIN_OPTIONS.map(d => (
                  <option key={d.id} value={d.id} className="bg-[#121124] text-white">
                    {t(d.label)}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-white/60">{t('vx.freqLabel')}</label>
              <select
                value={selectedFrequency}
                onChange={e => setSelectedFrequency(e.target.value)}
                className={selectClass}
              >
                {FREQUENCY_OPTIONS.map(f => (
                  <option key={f.id} value={f.id} className="bg-[#121124] text-white">
                    {t(f.label)}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-white/60">{t('vx.sortLabel')}</label>
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as any)}
                className={selectClass}
              >
                {SORT_OPTIONS.map(s => (
                  <option key={s.id} value={s.id} className="bg-[#121124] text-white">
                    {t(s.label)}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={() => {
                playSound('click');
                setIsFilterSheetOpen(false);
              }}
              className="w-full py-3 rounded-xl bg-[#c4ff55] text-[#09091a] text-sm font-black hover:bg-[#d4ff75] transition-all cursor-pointer"
            >
              {t('vx.showResults')}
            </button>
          </div>
        </div>
      )}

      {/* Comprehensive Word Detail Modal */}
      <WordDetailModal
        entry={selectedModalWord}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onWordSavedChange={() => setSavedUpdateCount(c => c + 1)}
      />
    </div>
  );
};
