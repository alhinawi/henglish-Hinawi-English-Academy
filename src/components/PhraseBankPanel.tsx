// ==============================================================================
// Henglish Academy (HENGLISH) - PHRASE BANK PANEL
// Shared browser for the phrase banks (idioms / slang / genz):
// search + register/origin filters over chunked lazy-loaded entries.
// ==============================================================================

import React, { useEffect, useMemo, useState } from 'react';
import { Search, RefreshCw, ChevronDown, AlertTriangle } from 'lucide-react';
import {
  PhraseBankId,
  PhraseEntry,
  PhraseOrigin,
  PhraseRegister,
  filterPhrases,
  loadAllPhrases,
  loadPhraseIndex,
  loadPhrasePrefix,
} from '../services/phraseBankService';

const REGISTER_LABELS: Record<PhraseRegister, string> = {
  formal: 'رسمي',
  neutral: 'محايد',
  informal: 'عامي',
  vulgar: 'مبتذل',
  offensive: 'مسيء',
};

const ORIGIN_LABELS: Record<PhraseOrigin, string> = {
  US: 'أمريكي',
  UK: 'بريطاني',
  both: 'مشترك',
  global: 'عالمي',
};

const REGISTER_BADGE: Record<PhraseRegister, string> = {
  formal: 'bg-[#6ecbff]/15 text-[#6ecbff] border-[#6ecbff]/30',
  neutral: 'bg-[#b9b6d5]/15 text-[#b9b6d5] border-[#b9b6d5]/30',
  informal: 'bg-[#c4ff55]/15 text-[#c4ff55] border-[#c4ff55]/30',
  vulgar: 'bg-[#ffb066]/15 text-[#ffb066] border-[#ffb066]/30',
  offensive: 'bg-[#ff4f9a]/15 text-[#ff4f9a] border-[#ff4f9a]/30',
};

interface PhraseBankPanelProps {
  bank: PhraseBankId;
  titleAr: string;
  blurbAr: string;
}

export const PhraseBankPanel: React.FC<PhraseBankPanelProps> = ({ bank, titleAr, blurbAr }) => {
  const [total, setTotal] = useState<number | null>(null);
  const [entries, setEntries] = useState<PhraseEntry[]>([]);
  const [loadedChunks, setLoadedChunks] = useState(0);
  const [totalChunks, setTotalChunks] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [register, setRegister] = useState<PhraseRegister | 'all'>('all');
  const [origin, setOrigin] = useState<PhraseOrigin | 'all'>('all');

  const searching = query.trim().length > 0 || register !== 'all' || origin !== 'all';

  // Initial load: index + first chunk.
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    loadPhraseIndex(bank)
      .then(async (index) => {
        if (cancelled) return;
        setTotal(index.totalEntries);
        setTotalChunks(index.chunks.length);
        if (index.chunks.length === 0) {
          setEntries([]);
          setLoadedChunks(0);
          setLoading(false);
          return;
        }
        const first = await loadPhrasePrefix(bank, 1);
        if (cancelled) return;
        setEntries(first);
        setLoadedChunks(1);
        setLoading(false);
      })
      .catch(() => {
        if (cancelled) return;
        setError('تعذر تحميل البنك حالياً. حاول مرة أخرى.');
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [bank]);

  // Searching/filtering needs the whole bank.
  useEffect(() => {
    if (!searching) return;
    let cancelled = false;
    loadAllPhrases(bank).then((all) => {
      if (cancelled) return;
      setEntries(all);
      setLoadedChunks(totalChunks);
    }).catch(() => {
      if (!cancelled) setError('تعذر تحميل البنك حالياً. حاول مرة أخرى.');
    });
    return () => {
      cancelled = true;
    };
  }, [searching, bank, totalChunks]);

  const visible = useMemo(
    () => filterPhrases(entries, query, register, origin),
    [entries, query, register, origin]
  );

  const hasMore = !searching && loadedChunks < totalChunks;

  const loadMore = () => {
    const next = loadedChunks + 1;
    loadPhrasePrefix(bank, next).then((all) => {
      setEntries(all);
      setLoadedChunks(next);
    });
  };

  const chip = (active: boolean) =>
    `px-3.5 py-1.5 rounded-full text-xs font-bold border transition-all ${
      active
        ? 'bg-[#ffd166] text-[#1a1836] border-[#ffd166]'
        : 'bg-white/5 text-[#b9b6d5] border-white/10 hover:border-[#ffd166]/40'
    }`;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl sm:text-4xl font-black text-white font-['Cairo',sans-serif]">{titleAr}</h1>
        <p className="text-sm text-[#b9b6d5] leading-relaxed">{blurbAr}</p>
        {total !== null && (
          <p className="text-xs font-bold text-[#ffd166]">
            {total.toLocaleString('en')} {bank === 'idioms' ? 'تعبير اصطلاحي' : 'تعبير'} موثق
          </p>
        )}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#b9b6d5]" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="ابحث بالإنجليزي أو بالمصري..."
          className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pr-11 pl-4 text-sm text-white placeholder:text-[#b9b6d5]/60 focus:outline-none focus:border-[#ffd166]/50"
        />
      </div>

      {/* Filters */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-black text-[#b9b6d5]">السياق:</span>
          <button className={chip(register === 'all')} onClick={() => setRegister('all')}>الكل</button>
          {(Object.keys(REGISTER_LABELS) as PhraseRegister[]).map((r) => (
            <button key={r} className={chip(register === r)} onClick={() => setRegister(r)}>
              {REGISTER_LABELS[r]}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-black text-[#b9b6d5]">الأصل:</span>
          <button className={chip(origin === 'all')} onClick={() => setOrigin('all')}>الكل</button>
          {(Object.keys(ORIGIN_LABELS) as PhraseOrigin[]).map((o) => (
            <button key={o} className={chip(origin === o)} onClick={() => setOrigin(o)}>
              {ORIGIN_LABELS[o]}
            </button>
          ))}
        </div>
      </div>

      {/* States */}
      {loading && (
        <div className="flex items-center justify-center gap-2 py-16 text-[#b9b6d5]">
          <RefreshCw className="w-5 h-5 animate-spin" />
          <span className="text-sm font-bold">جاري تحميل البنك...</span>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 p-4 rounded-2xl bg-[#ff4f9a]/15 border border-[#ff4f9a]/40 text-[#ff4f9a] text-sm font-bold">
          <AlertTriangle className="w-4 h-4" />
          {error}
        </div>
      )}

      {!loading && !error && total === 0 && (
        <div className="text-center py-16 space-y-2">
          <p className="text-lg font-black text-white">البنك قيد الإعداد</p>
          <p className="text-sm text-[#b9b6d5]">تُضاف العبارات الموثقة تباعاً. ارجع قريباً.</p>
        </div>
      )}

      {!loading && !error && total !== null && total > 0 && visible.length === 0 && (
        <div className="text-center py-16 text-sm text-[#b9b6d5] font-bold">
          لا نتائج مطابقة للبحث أو الفلاتر الحالية.
        </div>
      )}

      {/* Cards */}
      <div className="grid gap-4">
        {visible.map((e) => (
          <article
            key={e.id}
            className="glass-panel p-5 rounded-2xl border border-white/10 bg-linear-to-br from-[#121128] to-[#1a1836] space-y-3"
          >
            <div className="flex flex-wrap items-center gap-2 justify-between">
              <h3 className="text-lg font-black text-[#ffd166] font-mono" dir="ltr">{e.phrase}</h3>
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black border ${REGISTER_BADGE[e.register]}`}>
                  {REGISTER_LABELS[e.register]}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black border bg-white/5 text-[#b9b6d5] border-white/10">
                  {ORIGIN_LABELS[e.origin]}
                </span>
              </div>
            </div>
            <p className="text-base font-bold text-white leading-relaxed">{e.meaningAr}</p>
            <div className="space-y-1 border-r-2 border-[#ffd166]/30 pr-3">
              <p className="text-sm text-[#b9b6d5]" dir="ltr">{e.exampleEn}</p>
              <p className="text-sm text-white/80">{e.exampleAr}</p>
            </div>
          </article>
        ))}
      </div>

      {hasMore && (
        <div className="flex justify-center pt-2">
          <button
            onClick={loadMore}
            className="flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 border border-white/15 text-sm font-black text-white hover:border-[#ffd166]/50 transition-all"
          >
            <ChevronDown className="w-4 h-4" />
            عرض المزيد ({entries.length.toLocaleString('en')} من {total?.toLocaleString('en')})
          </button>
        </div>
      )}
    </div>
  );
};
