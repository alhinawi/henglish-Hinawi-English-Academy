import React, { useMemo, useState, useEffect } from 'react';
import {
  Play,
  Smartphone,
  Globe,
  MessagesSquare,
  Mic,
  BookOpen,
  GraduationCap,
  Library,
  Headphones,
  Flag,
  Search,
  ExternalLink,
  Sparkles,
  Lightbulb,
  Bookmark,
  ShieldCheck,
  SlidersHorizontal,
} from 'lucide-react';
import {
  LEARNING_SOURCES,
  SOURCE_CATEGORIES,
  EGYPTIAN_TIPS,
  LEVELS,
  SourceCategoryId,
  SourceCost,
  LearningSource,
} from '../data/sourcesData';
import { playSound } from '../utils/audio';

const CATEGORY_ICONS: Record<SourceCategoryId, React.ReactNode> = {
  youtube: <Play className="w-5 h-5" />,
  apps: <Smartphone className="w-5 h-5" />,
  websites: <Globe className="w-5 h-5" />,
  native: <MessagesSquare className="w-5 h-5" />,
  podcasts: <Mic className="w-5 h-5" />,
  dictionaries: <BookOpen className="w-5 h-5" />,
  exams: <GraduationCap className="w-5 h-5" />,
  books: <Library className="w-5 h-5" />,
  readers: <Headphones className="w-5 h-5" />,
  arabic: <Flag className="w-5 h-5" />,
};

const COST_LABELS: Record<SourceCost, string> = {
  free: 'مجاني',
  freemium: 'مجاني وفيه مدفوع',
  paid: 'مدفوع',
};

const COST_STYLES: Record<SourceCost, string> = {
  free: 'bg-emerald-400/15 text-emerald-300 border-emerald-400/30',
  freemium: 'bg-[#ffd166]/15 text-[#ffd166] border-[#ffd166]/30',
  paid: 'bg-rose-400/15 text-rose-300 border-rose-400/30',
};

const BOOKMARKS_KEY = 'henglish-source-bookmarks';

export const SourcesPage: React.FC = () => {
  const [query, setQuery] = useState('');
  const [costFilter, setCostFilter] = useState<'all' | SourceCost>('all');
  const [levelFilter, setLevelFilter] = useState<string>('all');
  const [bookmarksOnly, setBookmarksOnly] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [bookmarks, setBookmarks] = useState<string[]>([]);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(BOOKMARKS_KEY);
      if (raw) setBookmarks(JSON.parse(raw));
    } catch {
      // ignore corrupt storage
    }
  }, []);

  const toggleBookmark = (id: string) => {
    playSound('click');
    setBookmarks(prev => {
      const next = prev.includes(id) ? prev.filter(b => b !== id) : [...prev, id];
      try {
        window.localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(next));
      } catch {
        // storage unavailable
      }
      return next;
    });
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return LEARNING_SOURCES.filter(s => {
      if (bookmarksOnly && !bookmarks.includes(s.id)) return false;
      if (costFilter !== 'all' && s.cost !== costFilter) return false;
      if (levelFilter !== 'all' && !s.levels.includes('ALL') && !s.levels.includes(levelFilter)) return false;
      if (
        q &&
        !s.name.toLowerCase().includes(q) &&
        !s.descriptionAr.includes(query.trim()) &&
        !(s.subcategory || '').includes(query.trim())
      )
        return false;
      return true;
    });
  }, [query, costFilter, levelFilter, bookmarksOnly, bookmarks]);

  const totalShown = filtered.length;

  const renderCard = (source: LearningSource) => {
    const isBookmarked = bookmarks.includes(source.id);
    return (
      <div
        key={source.id}
        className="glass-panel rounded-2xl border border-white/10 hover:border-[#41e7ff]/50 transition-all p-4 flex flex-col gap-3 group"
      >
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <span className="shrink-0 w-9 h-9 rounded-xl bg-[#41e7ff]/10 text-[#41e7ff] border border-[#41e7ff]/25 flex items-center justify-center">
              {CATEGORY_ICONS[source.category]}
            </span>
            <div className="min-w-0">
              <h3 className="text-white font-black text-sm leading-snug truncate" dir="ltr">
                {source.name}
              </h3>
              {source.subcategory && (
                <span className="text-[11px] text-[#b9b6d5]">{source.subcategory}</span>
              )}
            </div>
          </div>
          <button
            onClick={() => toggleBookmark(source.id)}
            aria-label={isBookmarked ? 'إزالة من المحفوظات' : 'حفظ المصدر'}
            className={`shrink-0 p-1.5 rounded-lg transition-colors cursor-pointer ${
              isBookmarked ? 'text-[#ffd166]' : 'text-[#b9b6d5] hover:text-white'
            }`}
          >
            <Bookmark className="w-4 h-4" fill={isBookmarked ? 'currentColor' : 'none'} />
          </button>
        </div>

        <p className="text-[13px] leading-relaxed text-[#dedbf4]">{source.descriptionAr}</p>

        <div className="mt-auto flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className={`px-2 py-0.5 rounded-full text-[11px] font-black border ${COST_STYLES[source.cost]}`}>
              {COST_LABELS[source.cost]}
            </span>
            {(source.levels.includes('ALL') ? ['A1-C2'] : source.levels).map(lv => (
              <span
                key={lv}
                dir="ltr"
                className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-white/5 text-[#b9b6d5] border border-white/10"
              >
                {lv}
              </span>
            ))}
          </div>
          <a
            href={source.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => playSound('click')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#41e7ff]/10 text-[#41e7ff] border border-[#41e7ff]/30 text-xs font-black hover:bg-[#41e7ff]/20 transition-colors"
          >
            <span>افتح</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black bg-[#ffd166]/15 text-[#ffd166] border border-[#ffd166]/30">
          <Sparkles className="w-3.5 h-3.5" />
          <span dir="ltr">TOP RESOURCES</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white">أهم المصادر</h1>
        <p className="text-base text-[#b9b6d5] max-w-3xl leading-relaxed">
          دستة المصادر المختارة بعناية: أهم القنوات، أهم الكتب لكل مستوى، أهم التطبيقات والمواقع للتعلم،
          وأهم أماكن الممارسة مع النيتيف. كل لينك رسمي ومتحقق منه، من غير إعلانات ولا روابط مدفوعة.
        </p>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="px-3 py-1 rounded-full text-xs font-black bg-white/5 text-white border border-white/10" dir="ltr">
            {LEARNING_SOURCES.length}+ مصدر
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-black bg-white/5 text-white border border-white/10">
            {SOURCE_CATEGORIES.length} أقسام
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-emerald-400/10 text-emerald-300 border border-emerald-400/30">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>لينكات رسمية متحقق منها</span>
          </span>
        </div>
      </div>

      {/* Filters: slim sticky bar + collapsible panel (never overlaps cards) */}
      <div className="sticky top-24 z-40 glass-panel rounded-2xl border border-white/10 bg-[#0c0b20]/95 backdrop-blur-xl p-2.5 flex items-center gap-2">
          <div className="relative flex-1 min-w-0">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#b9b6d5]" />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="ابحث عن مصدر..."
              className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pr-9 pl-3 text-white text-sm placeholder:text-[#b9b6d5]/60 focus:outline-none focus:border-[#41e7ff]/50"
            />
          </div>
          <button
            onClick={() => {
              playSound('click');
              setFiltersOpen(o => !o);
            }}
            aria-expanded={filtersOpen}
            className={`shrink-0 inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-black border transition-colors cursor-pointer ${
              filtersOpen || costFilter !== 'all' || levelFilter !== 'all'
                ? 'bg-[#41e7ff]/20 text-[#41e7ff] border-[#41e7ff]/50'
                : 'bg-white/5 text-[#b9b6d5] border-white/10 hover:text-white'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>الفلاتر</span>
          </button>
          <button
            onClick={() => {
              playSound('click');
              setBookmarksOnly(b => !b);
            }}
            className={`shrink-0 inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-black border transition-colors cursor-pointer ${
              bookmarksOnly
                ? 'bg-[#ffd166]/20 text-[#ffd166] border-[#ffd166]/50'
                : 'bg-white/5 text-[#b9b6d5] border-white/10 hover:text-white'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" fill={bookmarksOnly ? 'currentColor' : 'none'} />
            <span dir="ltr">{bookmarks.length}</span>
          </button>
        </div>

        {filtersOpen && (
          <div className="glass-panel rounded-2xl border border-white/10 p-4 space-y-4">
            <div className="flex items-center gap-2 flex-wrap">
              {(['all', 'free', 'freemium', 'paid'] as const).map(c => (
                <button
                  key={c}
                  onClick={() => {
                    playSound('click');
                    setCostFilter(c);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black border transition-colors cursor-pointer ${
                    costFilter === c
                      ? 'bg-[#41e7ff]/20 text-[#41e7ff] border-[#41e7ff]/50'
                      : 'bg-white/5 text-[#b9b6d5] border-white/10 hover:text-white'
                  }`}
                >
                  {c === 'all' ? 'الكل' : COST_LABELS[c]}
                </button>
              ))}
              <span className="w-px h-5 bg-white/10 hidden sm:block" />
              {['all', ...LEVELS].map(lv => (
                <button
                  key={lv}
                  onClick={() => {
                    playSound('click');
                    setLevelFilter(lv);
                  }}
                  dir="ltr"
                  className={`px-3 py-1.5 rounded-xl text-xs font-black border transition-colors cursor-pointer ${
                    levelFilter === lv
                      ? 'bg-[#ffd166]/20 text-[#ffd166] border-[#ffd166]/50'
                      : 'bg-white/5 text-[#b9b6d5] border-white/10 hover:text-white'
                  }`}
                >
                  {lv === 'all' ? 'كل المستويات' : lv}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-1.5 flex-wrap text-[11px] text-[#b9b6d5]">
              <span>الأقسام:</span>
              {SOURCE_CATEGORIES.map(cat => (
                <a
                  key={cat.id}
                  href={`#sources-${cat.id}`}
                  className="px-2 py-0.5 rounded-lg hover:bg-white/5 hover:text-[#41e7ff] transition-colors"
                >
                  {cat.labelAr}
                </a>
              ))}
            </div>
          </div>
        )}

      {totalShown === 0 && (
        <div className="glass-panel rounded-3xl border border-white/10 p-10 text-center space-y-2">
          <p className="text-white font-black text-lg">مفيش نتائج مطابقة</p>
          <p className="text-[#b9b6d5] text-sm">جرب كلمة بحث تانية أو غير الفلاتر.</p>
        </div>
      )}

      {/* Category sections */}
      {SOURCE_CATEGORIES.map(cat => {
        const items = filtered.filter(s => s.category === cat.id);
        if (items.length === 0) return null;
        return (
          <section key={cat.id} id={`sources-${cat.id}`} className="space-y-6 scroll-mt-40">
            <div className="relative rounded-3xl overflow-hidden border border-white/10 h-40 sm:h-48">
              <img
                src={cat.imageUrl}
                alt={cat.imageAlt}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-l from-[#0c0b20]/95 via-[#0c0b20]/70 to-[#0c0b20]/40" />
              <div className="relative h-full flex flex-col justify-center px-5 sm:px-8 space-y-2">
                <div className="flex items-center gap-2 text-[#41e7ff]">
                  {CATEGORY_ICONS[cat.id]}
                  <span className="text-xs font-black tracking-wide" dir="ltr">
                    {cat.labelEn}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-black bg-white/10 text-white border border-white/20" dir="ltr">
                    {items.length}
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-white">{cat.labelAr}</h2>
                <p className="text-sm text-[#dedbf4] max-w-2xl">{cat.descriptionAr}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">{items.map(renderCard)}</div>
          </section>
        );
      })}

      {/* Egyptian learner tips */}
      <section id="sources-tips" className="space-y-6 scroll-mt-40">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 text-[#ffd166]">
            <Lightbulb className="w-5 h-5" />
            <span className="text-xs font-black tracking-wide" dir="ltr">
              PRO TIPS
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white">نصايح للمتعلم المصري</h2>
          <p className="text-sm text-[#b9b6d5] max-w-2xl">
            خلاصة تجارب آلاف المتعلمين: القواعد الصغيرة اللي بتفرق بين واحد بيتعلم سنين وواحد بيتقدم بجد.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {EGYPTIAN_TIPS.map(tip => (
            <div
              key={tip.id}
              className="glass-panel rounded-2xl border border-white/10 p-4 space-y-2 hover:border-[#ffd166]/40 transition-colors"
            >
              <h3 className="text-[#ffd166] font-black text-sm">{tip.title}</h3>
              <p className="text-[13px] leading-relaxed text-[#dedbf4]">{tip.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Honesty note */}
      <div className="glass-panel rounded-3xl border border-white/10 p-5 sm:p-6">
        <p className="text-[13px] leading-relaxed text-[#b9b6d5]">
          <span className="text-white font-black">ملحوظة بصراحة: </span>
          القايمة دي اختيار شخصي من فريق Henglish Academy، مش تصنيف رسمي لأي جهة، ومفيش فيها روابط
          إعلانية أو عمولات. علامة مجاني ومدفوع بتعكس وضع المصدر وقت الإضافة، وممكن الأسعار تتغير عند
          أصحابها. لقيت لينك مش شغال؟ قولنا ونصلحه.
        </p>
      </div>
    </div>
  );
};

export default SourcesPage;
