// ==============================================================================
// Henglish Academy (HENGLISH) - EXAM VOCAB PANEL
// Shared browser for exam word lists (IELTS / TOEFL): whole list loaded once,
// most-common-first order, slim Filters bottom sheet, windowed rendering.
// ==============================================================================

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Search, RefreshCw, AlertTriangle, SlidersHorizontal } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { FilterSheet, ActiveFilterChips, FilterSection } from './FilterSheet';
import {
  ExamId,
  ExamVocabEntry,
  ExamSortMode,
  filterExamVocab,
  loadAllExamVocab,
  loadExamVocabIndex,
  sortExamVocab,
} from '../services/examVocabService';

const LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
const PAGE = 50;
const INITIAL = 40;

const POS_LABELS: Record<string, string> = {
  noun: 'اسم',
  verb: 'فعل',
  'modal verb': 'فعل ناقص',
  adjective: 'صفة',
  adverb: 'حال',
  pronoun: 'ضمير',
  preposition: 'حرف جر',
  determiner: 'أداة تعريف',
  conjunction: 'حرف عطف',
  number: 'عدد',
  interjection: 'تعجب',
  particle: 'أداة',
  'phrasal verb': 'فعل مركب',
};

const TOPIC_LABELS: Record<string, string> = {
  education: 'تعليم',
  health: 'صحة',
  environment: 'بيئة',
  technology: 'تكنولوجيا',
  work: 'عمل',
  travel: 'سفر',
  society: 'مجتمع',
  economy: 'اقتصاد',
  science: 'علوم',
  culture: 'ثقافة',
  media: 'إعلام',
  crime: 'جريمة وقانون',
  food: 'طعام',
  sport: 'رياضة',
  family: 'عيلة',
  housing: 'سكن',
  transport: 'مواصلات',
  nature: 'طبيعة',
  art: 'فن',
  general: 'عام',
};

interface ExamVocabPanelProps {
  exam: ExamId;
  titleAr: string;
  blurbAr: string;
}

export const ExamVocabPanel: React.FC<ExamVocabPanelProps> = ({ exam, titleAr, blurbAr }) => {
  const { t } = useLanguage();
  const [total, setTotal] = useState<number | null>(null);
  const [entries, setEntries] = useState<ExamVocabEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [level, setLevel] = useState('all');
  const [topic, setTopic] = useState('all');
  const [pos, setPos] = useState('all');
  const [sortMode, setSortMode] = useState<ExamSortMode>('popularity');
  const [sheetOpen, setSheetOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(INITIAL);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    Promise.all([loadExamVocabIndex(exam), loadAllExamVocab(exam)])
      .then(([index, all]) => {
        if (cancelled) return;
        setTotal(index.totalEntries);
        setEntries(all);
        setLoading(false);
      })
      .catch(() => {
        if (cancelled) return;
        setError('load');
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [exam]);

  const topics = useMemo(
    () => Array.from(new Set(entries.map((e) => e.topic))).sort(),
    [entries]
  );
  const posList = useMemo(
    () => Array.from(new Set(entries.map((e) => e.partOfSpeech))).sort(),
    [entries]
  );

  const visible = useMemo(
    () => sortExamVocab(filterExamVocab(entries, query, level, topic, pos), sortMode),
    [entries, query, level, topic, pos, sortMode]
  );

  useEffect(() => {
    setVisibleCount(INITIAL);
  }, [query, level, topic, pos, sortMode, exam]);

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      (observed) => {
        if (observed.some((o) => o.isIntersecting)) {
          setVisibleCount((c) => Math.min(c + PAGE, visible.length));
        }
      },
      { rootMargin: '1200px' }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [visible.length]);

  const topicLabel = (topicKey: string) => TOPIC_LABELS[topicKey] ?? topicKey;
  const posLabel = (posKey: string) => POS_LABELS[posKey] ?? posKey;

  const activeChips = [
    ...(level !== 'all' ? [{ key: 'level', label: level, onRemove: () => setLevel('all') }] : []),
    ...(topic !== 'all' ? [{ key: 'topic', label: topicLabel(topic), onRemove: () => setTopic('all') }] : []),
    ...(pos !== 'all' ? [{ key: 'pos', label: posLabel(pos), onRemove: () => setPos('all') }] : []),
    ...(sortMode !== 'popularity'
      ? [{ key: 'sort', label: t('pb.sort.alpha'), onRemove: () => setSortMode('popularity') }]
      : []),
  ];

  const sections: FilterSection[] = [
    {
      key: 'sort',
      title: t('pb.sort'),
      options: [
        { value: 'popularity', label: t('pb.sort.popularity') },
        { value: 'alpha', label: t('pb.sort.alpha') },
      ],
      selected: sortMode,
      onSelect: (v) => setSortMode(v as ExamSortMode),
    },
    {
      key: 'level',
      title: t('ev.level'),
      options: [{ value: 'all', label: t('common.all') }, ...LEVELS.map((l) => ({ value: l, label: l }))],
      selected: level,
      onSelect: setLevel,
    },
    {
      key: 'topic',
      title: t('ev.topic'),
      options: [{ value: 'all', label: t('common.all') }, ...topics.map((tp) => ({ value: tp, label: topicLabel(tp) }))],
      selected: topic,
      onSelect: setTopic,
    },
    {
      key: 'pos',
      title: t('ev.pos'),
      options: [{ value: 'all', label: t('common.all') }, ...posList.map((p) => ({ value: p, label: posLabel(p) }))],
      selected: pos,
      onSelect: setPos,
    },
  ];

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <h1 className="text-3xl sm:text-4xl font-black text-white font-['Cairo',sans-serif]">{titleAr}</h1>
        <p className="text-sm text-[#b9b6d5] leading-relaxed">{blurbAr}</p>
        {total !== null && (
          <p className="text-xs font-bold text-[#ffd166]">
            {total.toLocaleString('en')} {exam === 'ielts' ? 'IELTS' : 'TOEFL'} {t('ev.wordSuffix')}
          </p>
        )}
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#b9b6d5]" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('ev.searchPlaceholder')}
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pr-11 pl-4 text-sm text-white placeholder:text-[#b9b6d5]/60 focus:outline-none focus:border-[#ffd166]/50"
          />
        </div>
        <button
          onClick={() => setSheetOpen(true)}
          className="shrink-0 flex items-center gap-1.5 px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-sm font-black text-white hover:border-[#ffd166]/50 transition-all"
        >
          <SlidersHorizontal className="w-4 h-4 text-[#ffd166]" />
          {t('pb.filters')}
          {activeChips.length > 0 && (
            <span className="min-w-5 h-5 px-1 rounded-full bg-[#ffd166] text-[#1a1836] text-[11px] font-black flex items-center justify-center">
              {activeChips.length}
            </span>
          )}
        </button>
      </div>

      <ActiveFilterChips chips={activeChips} resultCount={visible.length} />

      {loading && (
        <div className="flex items-center justify-center gap-2 py-16 text-[#b9b6d5]">
          <RefreshCw className="w-5 h-5 animate-spin" />
          <span className="text-sm font-bold">{t('ev.loadingBank')}</span>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 p-4 rounded-2xl bg-[#ff4f9a]/15 border border-[#ff4f9a]/40 text-[#ff4f9a] text-sm font-bold">
          <AlertTriangle className="w-4 h-4" />
          {t('ev.loadError')}
        </div>
      )}

      {!loading && !error && total === 0 && (
        <div className="text-center py-16 space-y-2">
          <p className="text-lg font-black text-white">{t('ev.empty')}</p>
          <p className="text-sm text-[#b9b6d5]">{t('ev.emptyHint')}</p>
        </div>
      )}

      {!loading && !error && total !== null && total > 0 && visible.length === 0 && (
        <div className="text-center py-16 text-sm text-[#b9b6d5] font-bold">
          {t('ev.noResults')}
        </div>
      )}

      <div className="grid gap-4">
        {visible.slice(0, visibleCount).map((e) => (
          <article
            key={e.id}
            className="glass-panel p-5 rounded-2xl border border-white/10 bg-linear-to-br from-[#121128] to-[#1a1836] space-y-3"
          >
            <div className="flex flex-wrap items-center gap-2 justify-between">
              <h3 className="text-lg font-black text-[#ffd166] font-mono" dir="ltr">{e.word}</h3>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black border bg-[#6ecbff]/15 text-[#6ecbff] border-[#6ecbff]/30">
                  {e.level}
                </span>
                {e.band && (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black border bg-[#c4ff55]/15 text-[#c4ff55] border-[#c4ff55]/30" dir="ltr">
                    Band {e.band}
                  </span>
                )}
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black border bg-white/5 text-[#b9b6d5] border-white/10">
                  {posLabel(e.partOfSpeech)}
                </span>
              </div>
            </div>
            <p className="text-base font-bold text-white leading-relaxed">{e.meaningAr}</p>
            {e.collocation && (
              <p className="text-xs text-[#41e7ff]" dir="ltr">
                {e.collocation}
              </p>
            )}
            <div className="space-y-1 border-r-2 border-[#ffd166]/30 pr-3">
              <p className="text-sm text-[#b9b6d5]" dir="ltr">{e.exampleEn}</p>
              <p className="text-sm text-white/80">{e.exampleAr}</p>
            </div>
          </article>
        ))}
      </div>
      <div ref={sentinelRef} className="h-1" />

      <FilterSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        sections={sections}
        onClearAll={() => {
          setLevel('all');
          setTopic('all');
          setPos('all');
          setSortMode('popularity');
        }}
      />
    </div>
  );
};
