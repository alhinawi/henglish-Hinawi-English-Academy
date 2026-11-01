// ==============================================================================
// Henglish Academy (HENGLISH) - INTELLIGENT VOCABULARY EXPLORER
// Multi-filter search engine across 55,000+ words with dual US/UK pronunciation
// ==============================================================================

import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  Filter,
  Volume2,
  Sparkles,
  LayoutGrid,
  List,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Database,
  CheckCircle2,
  Loader2,
  X,
  SlidersHorizontal,
} from 'lucide-react';
import {
  LexicalEntry,
  CEFRLevel,
  loadVocabularyCore,
  loadFullVocabulary,
  loadVocabularyManifest,
  searchVocabulary,
  VocabularyManifest,
} from '../../services/vocabularyService';
import { WordCard } from './WordCard';
import { WordDetailModal } from './WordDetailModal';
import { playSound } from '../../utils/audio';

const CEFR_OPTIONS: Array<{ id: CEFRLevel | 'all'; label: string }> = [
  { id: 'all', label: 'جميع المستويات' },
  { id: 'A1', label: 'A1 مبتدئ' },
  { id: 'A2', label: 'A2 أساسي' },
  { id: 'B1', label: 'B1 متوسط' },
  { id: 'B2', label: 'B2 فوق المتوسط' },
  { id: 'C1', label: 'C1 متقدم' },
  { id: 'C2', label: 'C2 متقن' },
];

const POS_OPTIONS = [
  { id: 'all', label: 'جميع الأقسام' },
  { id: 'noun', label: 'أسماء (Nouns)' },
  { id: 'verb', label: 'أفعال (Verbs)' },
  { id: 'adjective', label: 'صفات (Adjectives)' },
  { id: 'adverb', label: 'ظروف (Adverbs)' },
];

const DOMAIN_OPTIONS = [
  { id: 'all', label: 'جميع المجالات (All Domains)' },
  { id: 'everyday', label: 'الحياة اليومية (Everyday)' },
  { id: 'business', label: 'إدارة الأعمال (Business)' },
  { id: 'ai_tech', label: 'التكنولوجيا والذكاء الاصطناعي (AI & Tech)' },
  { id: 'medicine', label: 'الطب والصحة (Medicine)' },
  { id: 'science', label: 'العلوم والأبحاث (Science)' },
  { id: 'finance', label: 'المالية والبنوك (Finance)' },
  { id: 'law', label: 'القانون والعدالة (Law)' },
  { id: 'travel', label: 'السفر والمطارات (Travel)' },
  { id: 'food', label: 'المطاعم والطهي (Food)' },
  { id: 'education', label: 'التعليم والجامعات (Education)' },
  { id: 'media', label: 'الإعلام والصحافة (Media)' },
  { id: 'aviation', label: 'الطيران والملاحة (Aviation)' },
  { id: 'arts', label: 'الفنون والإبداع (Arts)' },
  { id: 'music', label: 'الموسيقى والصوتيات (Music)' },
  { id: 'sports', label: 'الرياضة واللياقة (Sports)' },
  { id: 'environment', label: 'البيئة والمناخ (Environment)' },
  { id: 'politics', label: 'السياسة والعلاقات الدولية (Politics)' },
];

const FREQUENCY_OPTIONS = [
  { id: 'all', label: 'جميع درجات الشيوع' },
  { id: 'top500', label: 'أكثر 500 كلمة شيوعاً (Top 500)' },
  { id: 'top1000', label: 'أكثر 1,000 كلمة (Top 1,000)' },
  { id: 'top2000', label: 'أكثر 2,000 كلمة (Top 2,000)' },
  { id: 'top3000', label: 'أكثر 3,000 كلمة (Top 3,000)' },
  { id: 'top5000', label: 'أكثر 5,000 كلمة (Top 5,000)' },
  { id: 'academic', label: 'الكلمات الأكاديمية (Academic AWL)' },
  { id: 'advanced', label: 'مفردات متقدمة ونادرة (Advanced)' },
];

export const VocabularyExplorer: React.FC = () => {
  // Filters & State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCefr, setSelectedCefr] = useState<CEFRLevel | 'all'>('all');
  const [selectedPos, setSelectedPos] = useState<string>('all');
  const [selectedDomain, setSelectedDomain] = useState<string>('all');
  const [selectedFrequency, setSelectedFrequency] = useState<string>('all');
  const [audioFilter, setAudioFilter] = useState<'all' | 'has_us' | 'has_uk' | 'has_both'>('all');
  const [sortBy, setSortBy] = useState<'popular' | 'alpha_asc' | 'alpha_desc' | 'cefr_asc' | 'cefr_desc'>('popular');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(30);

  // Data Loading & Manifest State
  const [isLoading, setIsLoading] = useState(true);
  const [isFullLoading, setIsFullLoading] = useState(false);
  const [fullLoaded, setFullLoaded] = useState(false);
  const [manifest, setManifest] = useState<VocabularyManifest | null>(null);

  // Selected Word for Modal Inspector
  const [selectedModalWord, setSelectedModalWord] = useState<LexicalEntry | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Saved words mutation trigger
  const [savedUpdateCount, setSavedUpdateCount] = useState(0);

  // Initial load: Core (~5,000 words) for instant hydration + Manifest
  useEffect(() => {
    let mounted = true;
    (async () => {
      setIsLoading(true);
      try {
        await loadVocabularyCore();
        const m = await loadVocabularyManifest();
        if (mounted) {
          setManifest(m);
          setIsLoading(false);
        }
      } catch (err) {
        console.error('Failed to initialize vocabulary explorer:', err);
        if (mounted) setIsLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // When user types a specific search query or clicks to load full dataset
  const handleLoadFullDatabase = async () => {
    if (fullLoaded || isFullLoading) return;
    setIsFullLoading(true);
    playSound('click');
    try {
      await loadFullVocabulary();
      setFullLoaded(true);
      playSound('success');
    } catch (err) {
      console.error('Error loading full database:', err);
    } finally {
      setIsFullLoading(false);
    }
  };

  // Reset page when any filter changes
  useEffect(() => {
    setPage(1);
  }, [searchQuery, selectedCefr, selectedPos, selectedDomain, selectedFrequency, audioFilter, sortBy]);

  // Execute Search & Filter
  const searchResults = useMemo(() => {
    return searchVocabulary({
      searchQuery,
      cefr: selectedCefr,
      pos: selectedPos,
      domain: selectedDomain,
      frequencyTier: selectedFrequency,
      audioFilter,
      sortBy,
      page,
      pageSize,
    });
  }, [
    searchQuery,
    selectedCefr,
    selectedPos,
    selectedDomain,
    selectedFrequency,
    audioFilter,
    sortBy,
    page,
    pageSize,
    fullLoaded,
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
    setSelectedFrequency('all');
    setAudioFilter('all');
    setSortBy('popular');
  };

  const hasActiveFilters =
    searchQuery !== '' ||
    selectedCefr !== 'all' ||
    selectedPos !== 'all' ||
    selectedDomain !== 'all' ||
    selectedFrequency !== 'all' ||
    audioFilter !== 'all' ||
    sortBy !== 'popular';

  return (
    <div className="space-y-8 text-right">
      {/* Search & Dynamic Control Bar */}
      <section className="glass-panel p-5 sm:p-7 rounded-3xl border border-white/10 space-y-6">
        
        {/* Main Search Input */}
        <div className="relative">
          <Search className="w-5 h-5 text-[#41e7ff] absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            dir="auto"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="ابحث عن أي كلمة بالإنجليزية أو العربية (develop, project, يبتكر...)"
            className="w-full pl-12 pr-12 py-3.5 sm:py-4 rounded-2xl bg-[#09091a] border border-white/15 text-white placeholder-white/40 text-sm sm:text-base font-sans focus:outline-none focus:border-[#41e7ff] shadow-inner transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white/70 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Level Pills (CEFR) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-white/60 font-bold">
            <span>المستوى الأوروبي المرجعي (CEFR Level):</span>
            <span className="text-[11px] text-[#41e7ff]">A1 → C2</span>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            {CEFR_OPTIONS.map(c => (
              <button
                key={c.id}
                onClick={() => {
                  playSound('click');
                  setSelectedCefr(c.id);
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer border ${
                  selectedCefr === c.id
                    ? 'bg-[#c4ff55]/20 text-[#c4ff55] border-[#c4ff55]/50 shadow-sm'
                    : 'bg-white/5 text-white/70 hover:bg-white/10 border-white/5'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* Dropdowns Row: POS, Domain, Frequency, Audio, Sorting */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-1">
          {/* 1. Part of Speech */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-white/60">نوع الكلمة (POS)</label>
            <select
              value={selectedPos}
              onChange={e => setSelectedPos(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#09091a] border border-white/10 text-xs font-bold text-white focus:outline-none focus:border-[#41e7ff] cursor-pointer"
            >
              {POS_OPTIONS.map(p => (
                <option key={p.id} value={p.id} className="bg-[#121124] text-white">
                  {p.label}
                </option>
              ))}
            </select>
          </div>

          {/* 2. Domain Taxonomy */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-white/60">مجال الاستخدام (Domain)</label>
            <select
              value={selectedDomain}
              onChange={e => setSelectedDomain(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#09091a] border border-white/10 text-xs font-bold text-white focus:outline-none focus:border-[#41e7ff] cursor-pointer"
            >
              {DOMAIN_OPTIONS.map(d => (
                <option key={d.id} value={d.id} className="bg-[#121124] text-white">
                  {d.label}
                </option>
              ))}
            </select>
          </div>

          {/* 3. Frequency Tier */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-white/60">درجة الشيوع (Frequency)</label>
            <select
              value={selectedFrequency}
              onChange={e => setSelectedFrequency(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#09091a] border border-white/10 text-xs font-bold text-white focus:outline-none focus:border-[#41e7ff] cursor-pointer"
            >
              {FREQUENCY_OPTIONS.map(f => (
                <option key={f.id} value={f.id} className="bg-[#121124] text-white">
                  {f.label}
                </option>
              ))}
            </select>
          </div>

          {/* 4. Audio Availability Filter */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-white/60">الصوت والنطق (Audio)</label>
            <select
              value={audioFilter}
              onChange={e => setAudioFilter(e.target.value as any)}
              className="w-full px-3 py-2 rounded-xl bg-[#09091a] border border-white/10 text-xs font-bold text-white focus:outline-none focus:border-[#41e7ff] cursor-pointer"
            >
              <option value="all" className="bg-[#121124]">الكل (All Audio)</option>
              <option value="has_us" className="bg-[#121124]">صوت أمريكي 🇺🇸</option>
              <option value="has_uk" className="bg-[#121124]">صوت بريطاني 🇬🇧</option>
              <option value="has_both" className="bg-[#121124]">صوت مزدوج (US + UK)</option>
            </select>
          </div>

          {/* 5. Sort By */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-white/60">الترتيب (Sort By)</label>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="w-full px-3 py-2 rounded-xl bg-[#09091a] border border-white/10 text-xs font-bold text-white focus:outline-none focus:border-[#41e7ff] cursor-pointer"
            >
              <option value="popular" className="bg-[#121124]">الأكثر استخداماً (Default)</option>
              <option value="alpha_asc" className="bg-[#121124]">أبجدياً A → Z</option>
              <option value="alpha_desc" className="bg-[#121124]">أبجدياً Z → A</option>
              <option value="cefr_asc" className="bg-[#121124]">المستوى A1 → C2</option>
              <option value="cefr_desc" className="bg-[#121124]">المستوى C2 → A1</option>
            </select>
          </div>
        </div>

        {/* Active Filters Bar & View Switch */}
        <div className="pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            {hasActiveFilters && (
              <button
                onClick={handleClearFilters}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-black bg-red-500/15 text-red-400 border border-red-500/30 hover:bg-red-500/25 transition-all cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>إعادة ضبط الفلاتر</span>
              </button>
            )}

            <div className="text-xs text-white/70 font-bold">
              <span>تم العثور على: </span>
              <strong className="text-[#c4ff55] text-sm">
                {searchResults.totalMatches.toLocaleString()}
              </strong>
              <span> كلمة مطابقة</span>
              {manifest && (
                <span className="text-white/40 text-[11px] mr-2">
                  (من إجمالي {manifest.totalHeadwords.toLocaleString()} كلمة معتمدة)
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Load full database trigger if not loaded */}
            {!fullLoaded && (
              <button
                onClick={handleLoadFullDatabase}
                disabled={isFullLoading}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-[#ffd166]/15 text-[#ffd166] border border-[#ffd166]/30 hover:bg-[#ffd166]/25 transition-all cursor-pointer"
                title="تفعيل البحث في كامل قاعدة الـ 55,000 كلمة"
              >
                {isFullLoading ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Database className="w-3.5 h-3.5" />
                )}
                <span>بحث في كامل الـ 55,000 كلمة</span>
              </button>
            )}

            {/* View Mode Toggle */}
            <div className="flex items-center p-1 rounded-xl bg-white/5 border border-white/10">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                  viewMode === 'grid' ? 'bg-white/20 text-white' : 'text-white/40 hover:text-white'
                }`}
                title="عرض بطاقات شبكية"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                  viewMode === 'list' ? 'bg-white/20 text-white' : 'text-white/40 hover:text-white'
                }`}
                title="عرض قائمة مدمجة"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Words Grid / List Content */}
      {isLoading ? (
        <div className="p-16 rounded-3xl border border-white/10 text-center space-y-4">
          <Loader2 className="w-10 h-10 text-[#41e7ff] animate-spin mx-auto" />
          <p className="text-white/80 font-bold text-sm">
            جارٍ تحميل وفهرسة بنك المفردات الذكي...
          </p>
        </div>
      ) : searchResults.entries.length === 0 ? (
        <div className="glass-panel p-16 rounded-3xl border border-white/10 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-white/40">
            <Search className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-black text-white">لم يتم العثور على كلمات مطابقة</h3>
          <p className="text-sm text-white/60 max-w-md mx-auto">
            جرّب تغيير كلمات البحث، أو توسيع الفلاتر، أو اضغط زر إعادة الضبط لمشاهدة جميع الكلمات.
          </p>
          <button
            onClick={handleClearFilters}
            className="px-4 py-2 rounded-xl bg-[#41e7ff] text-[#09091a] text-xs font-black hover:bg-[#70efff] transition-all cursor-pointer"
          >
            إعادة ضبط الفلاتر
          </button>
        </div>
      ) : (
        <div className="space-y-8">
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
                onSavedChange={() => setSavedUpdateCount(c => c + 1)}
                viewMode={viewMode}
              />
            ))}
          </div>

          {/* Pagination Controls */}
          {searchResults.totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl glass-panel border border-white/10">
              <div className="text-xs text-white/60 font-bold">
                صفحة <strong className="text-white">{searchResults.page}</strong> من{' '}
                <strong className="text-white">{searchResults.totalPages}</strong> (
                {searchResults.totalMatches.toLocaleString()} كلمة)
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
                  <span>السابق</span>
                </button>

                {/* Page Numbers */}
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
                  <span>التالي</span>
                  <ChevronLeft className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
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

