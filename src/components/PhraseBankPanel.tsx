// ==============================================================================
// Henglish Academy (HENGLISH) - PHRASE BANK PANEL
// Shared browser for the phrase banks (idioms / slang / genz):
// whole bank loaded once (small JSON) -> zero scroll gap, most-common-first
// order, slim Filters bottom sheet, tap a card for the 10-sentence detail
// view (deep linkable via #<bank>/<id>, lazy per-100-ids data).
// ==============================================================================

import { copyText } from '../services/copyText';
import React, { useCallback, useEffect, useMemo, useRef, useState, useId } from 'react';
import { Search, RefreshCw, AlertTriangle, SlidersHorizontal, Copy, Check, X } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { FilterSheet, ActiveFilterChips, FilterSection } from './FilterSheet';
import PronounceButton from './PronounceButton';
import {
  PhraseBankId,
  PhraseEntry,
  PhraseOrigin,
  PhraseRegister,
  PhraseSentence,
  PhraseSortMode,
  filterPhrases,
  loadAllPhrases,
  loadPhraseIndex,
  loadPhraseSentences,
  sortPhrases,
} from '../services/phraseBankService';
import {
  loadSentenceOverlay,
  needsContentTranslation,
  txExample,
  txMeaning,
  useContentMap,
  ContentMap,
} from '../services/contentI18nService';

const REGISTER_BADGE: Record<PhraseRegister, string> = {
  formal: 'bg-[#6ecbff]/15 text-[#6ecbff] border-[#6ecbff]/30',
  neutral: 'bg-[#b9b6d5]/15 text-[#b9b6d5] border-[#b9b6d5]/30',
  informal: 'bg-[#c4ff55]/15 text-[#c4ff55] border-[#c4ff55]/30',
  vulgar: 'bg-[#ffb066]/15 text-[#ffb066] border-[#ffb066]/30',
  offensive: 'bg-[#ff4f9a]/15 text-[#ff4f9a] border-[#ff4f9a]/30',
};

const REGISTERS: PhraseRegister[] = ['formal', 'neutral', 'informal', 'vulgar', 'offensive'];
const ORIGINS: PhraseOrigin[] = ['US', 'UK', 'both', 'global'];
const TIERS = [1, 2, 3, 4, 5];
const PAGE = 50;
const INITIAL = 40;

interface PhraseBankPanelProps {
  bank: PhraseBankId;
  titleAr: string;
  blurbAr: string;
}

export const PhraseBankPanel: React.FC<PhraseBankPanelProps> = ({ bank, titleAr, blurbAr }) => {
  const { t, lang } = useLanguage();
  const txMap = useContentMap(bank);
  const [total, setTotal] = useState<number | null>(null);
  const [entries, setEntries] = useState<PhraseEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadAttempt, setLoadAttempt] = useState(0);
  const [query, setQuery] = useState('');
  const [register, setRegister] = useState<PhraseRegister | 'all'>('all');
  const [origin, setOrigin] = useState<PhraseOrigin | 'all'>('all');
  const [tier, setTier] = useState<number | 'all'>('all');
  const [sortMode, setSortMode] = useState<PhraseSortMode>('popularity');
  const [sheetOpen, setSheetOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(INITIAL);
  const [selected, setSelected] = useState<PhraseEntry | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  // Load the whole bank once: the JSON is small, and having every entry in
  // memory is what kills the visible loading gap while scrolling.
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    Promise.all([loadPhraseIndex(bank), loadAllPhrases(bank)])
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
  }, [bank, loadAttempt]);

  const visible = useMemo(
    () => sortPhrases(filterPhrases(entries, query, register, origin, tier), sortMode),
    [entries, query, register, origin, tier, sortMode]
  );

  // Windowed rendering: an IntersectionObserver sentinel grows the rendered
  // window well before the user reaches the end. All data is already in
  // memory, so appending is instant - no network gap at chunk boundaries.
  useEffect(() => {
    setVisibleCount(INITIAL);
  }, [query, register, origin, tier, sortMode, bank]);

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node || typeof IntersectionObserver === 'undefined') return;
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

  // Deep links: #<bank>/<entry-id> opens the detail sheet; closing restores
  // the plain bank hash.
  const openDetail = useCallback(
    (entry: PhraseEntry) => {
      setSelected(entry);
      if (window.location.hash !== `#${bank}/${entry.id}`) {
        window.location.hash = `${bank}/${entry.id}`;
      }
    },
    [bank]
  );

  const closeDetail = useCallback(() => {
    setSelected(null);
    if (window.location.hash.startsWith(`#${bank}/`)) {
      window.location.hash = bank;
    }
  }, [bank]);

  useEffect(() => {
    const fromHash = () => {
      const hash = window.location.hash.replace(/^#/, '');
      if (hash.startsWith(`${bank}/`)) {
        const id = hash.slice(bank.length + 1);
        const entry = entries.find((e) => e.id === id);
        setSelected(entry ?? null);
      } else {
        setSelected(null);
      }
    };
    fromHash();
    window.addEventListener('hashchange', fromHash);
    return () => window.removeEventListener('hashchange', fromHash);
  }, [bank, entries]);

  const activeChips = [
    ...(register !== 'all'
      ? [{ key: 'reg', label: t(`pb.reg.${register}`), onRemove: () => setRegister('all') }]
      : []),
    ...(origin !== 'all'
      ? [{ key: 'orig', label: t(`pb.orig.${origin}`), onRemove: () => setOrigin('all') }]
      : []),
    ...(tier !== 'all'
      ? [{ key: 'tier', label: t(`pb.tier.${tier}`), onRemove: () => setTier('all') }]
      : []),
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
      onSelect: (v) => setSortMode(v as PhraseSortMode),
    },
    {
      key: 'tier',
      title: t('pb.tier'),
      options: [{ value: 'all', label: t('common.all') }, ...TIERS.map((n) => ({ value: String(n), label: t(`pb.tier.${n}`) }))],
      selected: String(tier),
      onSelect: (v) => setTier(v === 'all' ? 'all' : (Number(v) as number)),
    },
    {
      key: 'register',
      title: t('pb.register'),
      options: [{ value: 'all', label: t('common.all') }, ...REGISTERS.map((r) => ({ value: r, label: t(`pb.reg.${r}`) }))],
      selected: register,
      onSelect: (v) => setRegister(v as PhraseRegister | 'all'),
    },
    {
      key: 'origin',
      title: t('pb.origin'),
      options: [{ value: 'all', label: t('common.all') }, ...ORIGINS.map((o) => ({ value: o, label: t(`pb.orig.${o}`) }))],
      selected: origin,
      onSelect: (v) => setOrigin(v as PhraseOrigin | 'all'),
    },
  ];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="space-y-2">
        <h1 dir="auto" className="text-3xl sm:text-4xl font-black text-white font-['Cairo',sans-serif]" style={{ textAlign: 'start' }}>{titleAr}</h1>
        <p dir="auto" className="text-sm text-[#b9b6d5] leading-relaxed" style={{ textAlign: 'start' }}>{blurbAr}</p>
        {total !== null && total > 0 && (
          <p className="text-xs font-bold text-[#ffd166]">
            {total.toLocaleString('en')} {bank === 'idioms' ? 'Idiom' : bank === 'slang' ? 'Slang' : 'Gen Z'} {t('pb.verifiedSuffix')}
          </p>
        )}
      </div>

      {/* Search + slim filters button (hidden while the bank is still empty) */}
      {total !== 0 && (
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#b9b6d5]" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label={t('pb.searchPlaceholder')}
              placeholder={t('pb.searchPlaceholder')}
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
      )}

      {total !== 0 && <ActiveFilterChips chips={activeChips} resultCount={visible.length} />}

      {/* States */}
      {loading && (
        <div className="flex items-center justify-center gap-2 py-16 text-[#b9b6d5]">
          <RefreshCw className="w-5 h-5 animate-spin" />
          <span className="text-sm font-bold">{t('pb.loadingBank')}</span>
        </div>
      )}

      {error && (
        <div role="alert" className="flex flex-wrap items-center gap-2 p-4 rounded-2xl bg-[#ff4f9a]/15 border border-[#ff4f9a]/40 text-[#ff4f9a] text-sm font-bold">
          <AlertTriangle className="w-4 h-4" />
          {t('pb.loadError')}
          <button onClick={() => setLoadAttempt(attempt => attempt + 1)} className="rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-white hover:bg-white/15 cursor-pointer">{t('ex.retry')}</button>
        </div>
      )}

      {!loading && !error && total === 0 && (
        <div className="text-center py-16 space-y-2">
          <p className="text-lg font-black text-white">{t('pb.empty')}</p>
          <p className="text-sm text-[#b9b6d5]">{t('pb.emptyHint')}</p>
        </div>
      )}

      {!loading && !error && total !== null && total > 0 && visible.length === 0 && (
        <div className="text-center py-16 text-sm text-[#b9b6d5] font-bold">
          {t('pb.noResults')}
        </div>
      )}

      {/* Cards (windowed) */}
      <div className="grid gap-4">
        {visible.slice(0, visibleCount).map((e) => (
          <button
            key={e.id}
            onClick={() => openDetail(e)}
            className="text-right glass-panel p-5 rounded-2xl border border-white/10 bg-linear-to-br from-[#121128] to-[#1a1836] space-y-3 hover:border-[#ffd166]/40 transition-all w-full"
          >
            <div className="flex flex-wrap items-center gap-2 justify-between">
              <span className="flex items-center gap-2">
                <h3 className="text-lg font-black text-[#ffd166] font-mono" dir="ltr">{e.phrase}</h3>
                <PronounceButton text={e.phrase} />
              </span>
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black border ${REGISTER_BADGE[e.register]}`}>
                  {t(`pb.reg.${e.register}`)}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black border bg-white/5 text-[#b9b6d5] border-white/10">
                  {t(`pb.orig.${e.origin}`)}
                </span>
              </div>
            </div>
            <p dir="auto" className="text-base font-bold text-white leading-relaxed" style={{ textAlign: 'start' }}>{txMeaning(txMap, e.id, e.meaningAr)}</p>
            <div className="space-y-1 border-r-2 border-[#ffd166]/30 pr-3">
              <p className="text-sm text-[#b9b6d5]" dir="ltr">{e.exampleEn}</p>
              <p dir="auto" className="text-sm text-white/80" style={{ textAlign: 'start' }}>{txExample(txMap, e.id, e.exampleAr)}</p>
            </div>
          </button>
        ))}
      </div>
      {!loading && !error && visibleCount < visible.length && (
        <button onClick={() => setVisibleCount(count => Math.min(count + PAGE, visible.length))} className="w-full rounded-2xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-bold text-white hover:bg-white/10 cursor-pointer">
          {t('pb.loadMore')}
        </button>
      )}
      <div ref={sentinelRef} className="h-1" />

      <FilterSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        sections={sections}
        onClearAll={() => {
          setRegister('all');
          setOrigin('all');
          setTier('all');
          setSortMode('popularity');
        }}
      />

      {selected && (
        <PhraseDetailSheet bank={bank} entry={selected} onClose={closeDetail} txMap={txMap} />
      )}
    </div>
  );
};

// -------------------------------------------------------------------------------
// Detail sheet: 10 example sentences (EN + Egyptian), lazy-loaded per 100 ids,
// copy button, falls back to the entry's built-in example when no file exists.
// -------------------------------------------------------------------------------

const PhraseDetailSheet: React.FC<{
  bank: PhraseBankId;
  entry: PhraseEntry;
  onClose: () => void;
  txMap: ContentMap | null;
}> = ({
  bank,
  entry,
  onClose,
  txMap,
}) => {
  const { t, lang } = useLanguage();
  const [sentences, setSentences] = useState<PhraseSentence[] | null>(null);
  const [sentencesLoading, setSentencesLoading] = useState(true);
  const [overlay, setOverlay] = useState<string[] | null>(null);
  const [copied, setCopied] = useState(false);
  const [copyFailed, setCopyFailed] = useState(false);
  const copyVersion = useRef(0);
  const copyTimer = useRef<number | null>(null);
  useEffect(() => {
    copyVersion.current += 1;
    setCopied(false);
    setCopyFailed(false);
    return () => {
      copyVersion.current += 1;
      if (copyTimer.current !== null) window.clearTimeout(copyTimer.current);
      copyTimer.current = null;
    };
  }, [entry.id, lang]);

  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();

  useEffect(() => {
    const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const dialog = dialogRef.current;
    const focusable = () => Array.from(dialog?.querySelectorAll<HTMLElement>(
      'button:not([disabled]):not([tabindex="-1"]), a[href], input:not([disabled]), [tabindex="0"]'
    ) ?? []).filter(el => el.getClientRects().length > 0);
    closeRef.current?.focus();
    const trap = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return;
      const items = focusable(), first = items[0], last = items[items.length - 1];
      if (!first) { event.preventDefault(); dialog?.focus(); return; }
      if (!dialog?.contains(document.activeElement) || event.shiftKey && document.activeElement === first) {
        event.preventDefault(); (event.shiftKey ? last : first).focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault(); first.focus();
      }
    };
    document.addEventListener('keydown', trap);
    return () => {
      document.removeEventListener('keydown', trap);
      if (opener?.isConnected) opener.focus();
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  useEffect(() => {
    let cancelled = false;
    setSentencesLoading(true);
    loadPhraseSentences(bank, entry.id).then((s) => {
      if (cancelled) return;
      setSentences(s);
      setSentencesLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [bank, entry.id]);

  // Translated sentence lines for non-ar/en UI languages, index-aligned with
  // the source pack.
  useEffect(() => {
    let cancelled = false;
    setOverlay(null);
    if (!needsContentTranslation(lang)) return;
    const idPrefix = entry.id.split('-')[0];
    loadSentenceOverlay(bank, lang, idPrefix, entry.id).then((o) => {
      if (!cancelled) setOverlay(o);
    });
    return () => {
      cancelled = true;
    };
  }, [bank, entry.id, lang]);

  const shown = sentences
    ? sentences.map((s, i) => ({ en: s.en, ar: overlay?.[i] ?? s.ar }))
    : [{ en: entry.exampleEn, ar: txExample(txMap, entry.id, entry.exampleAr) }];
  const shownMeaning = txMeaning(txMap, entry.id, entry.meaningAr);

  const copyAll = async () => {
    const lines: string[] = [`${entry.phrase}`, shownMeaning, ''];
    shown.forEach((s, i) => {
      lines.push(`${i + 1}. ${s.en}`);
      lines.push(`   ${s.ar}`);
    });
    const version = ++copyVersion.current;
    if (copyTimer.current !== null) window.clearTimeout(copyTimer.current);
    copyTimer.current = null;
    setCopied(false);
    setCopyFailed(false);
    let success = await copyText(lines.join('\n'));
    if (version !== copyVersion.current) return;
    if (!success) {
      const area = document.createElement('textarea');
      try {
        area.value = lines.join('\n');
        area.style.position = 'fixed';
        area.style.opacity = '0';
        document.body.appendChild(area);
        area.select();
        success = document.execCommand('copy');
      } catch {
        success = false;
      } finally {
        area.remove();
        closeRef.current?.focus();
      }
    }
    if (!success) { setCopyFailed(true); return; }
    setCopied(true);
    copyTimer.current = window.setTimeout(() => {
      if (version === copyVersion.current) setCopied(false);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" role="dialog" aria-modal="true" aria-labelledby={titleId} ref={dialogRef} tabIndex={-1}>
      <button tabIndex={-1} aria-label={t('fs.close')} onClick={onClose} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div className="relative w-full max-w-lg bg-[#16142e] border-t border-white/15 rounded-t-3xl max-h-[85vh] overflow-y-auto pb-6 animate-[slideUp_.25s_ease-out]">
        <div className="sticky top-0 bg-[#16142e] pt-3 pb-3 px-5 border-b border-white/10 z-10">
          <span className="w-10 h-1 rounded-full bg-white/20 absolute top-2 left-1/2 -translate-x-1/2" />
          <div className="flex items-start justify-between gap-3 mt-2">
            <div className="space-y-1">
              <span className="flex items-center gap-2">
                <h2 id={titleId} className="text-xl font-black text-[#ffd166] font-mono" dir="ltr">{entry.phrase}</h2>
                <PronounceButton text={entry.phrase} />
              </span>
              <p dir="auto" className="text-sm font-bold text-white leading-relaxed" style={{ textAlign: 'start' }}>{shownMeaning}</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={copyAll}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-black text-white hover:border-[#ffd166]/50 transition-all"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-[#c4ff55]" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? t('pb.detail.copied') : t('pb.detail.copy')}
              </button>
              <button
                ref={closeRef}
                onClick={onClose}
                aria-label={t('fs.close')}
                className="p-2 rounded-full bg-white/5 text-white hover:bg-white/15 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black border ${REGISTER_BADGE[entry.register]}`}>
              {t(`pb.reg.${entry.register}`)}
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black border bg-white/5 text-[#b9b6d5] border-white/10">
              {t(`pb.orig.${entry.origin}`)}
            </span>
          </div>
        </div>

        <div className="px-5 py-4 space-y-4">
          {copyFailed && <p role="status" className="text-sm text-amber-200">{t('copy.failed')}</p>}
          <p className="text-xs font-black text-[#b9b6d5]">{t('pb.detail.sentences')}</p>
          {sentencesLoading && (
            <div className="flex items-center gap-2 py-6 justify-center text-[#b9b6d5]">
              <RefreshCw className="w-4 h-4 animate-spin" />
            </div>
          )}
          {!sentencesLoading &&
            shown.map((s, i) => (
              <div key={i} className="space-y-1 border-r-2 border-[#ffd166]/30 pr-3">
                <p className="text-sm text-white leading-relaxed" dir="ltr">
                  <span className="text-[#ffd166] font-black ml-1">{i + 1}.</span> {s.en}
                </p>
                <p dir="auto" className="text-sm text-[#b9b6d5]" style={{ textAlign: 'start' }}>{s.ar}</p>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};
