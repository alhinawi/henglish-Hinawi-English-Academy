// ==============================================================================
// Henglish Academy (HENGLISH) - 10,000+ EXPRESSIONS, IDIOMS & PHRASAL VERBS TAB
// Specialized explorer for phrasal verbs, idioms, collocations, and business phrases
// ==============================================================================

import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  Volume2,
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
} from 'lucide-react';
import { ExpressionEntry, loadExpressions } from '../../services/vocabularyService';
import { speakEnglishVoice } from '../../utils/audio';
import { playSound } from '../../utils/audio';

const CATEGORIES = [
  { id: 'all', label: 'جميع التعابير (All 10,000+)' },
  { id: 'phrasal_verb', label: 'الأفعال المركبة (Phrasal Verbs)' },
  { id: 'idiom', label: 'التعبيرات الاصطلاحية (Idioms)' },
  { id: 'collocation', label: 'المتلازمات اللفظية (Collocations)' },
  { id: 'conversational', label: 'محادثات وحوارات (Conversational)' },
  { id: 'business_tech', label: 'الشركات والتقنية (Business & Tech)' },
  { id: 'common_expression', label: 'تعبيرات شائعة (Common)' },
];

export const ExpressionsTab: React.FC = () => {
  const [expressions, setExpressions] = useState<ExpressionEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedCefr, setSelectedCefr] = useState<string>('all');
  const [page, setPage] = useState(1);
  const pageSize = 24;

  useEffect(() => {
    let mounted = true;
    (async () => {
      setIsLoading(true);
      try {
        const data = await loadExpressions();
        if (mounted) {
          setExpressions(data);
          setIsLoading(false);
        }
      } catch (err) {
        console.error('Error loading expressions:', err);
        if (mounted) setIsLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    setPage(1);
  }, [searchQuery, selectedCategory, selectedCefr]);

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return expressions.filter(item => {
      if (q) {
        const matchExpr = item.expression.toLowerCase().includes(q);
        const matchAr = item.meaningAr.toLowerCase().includes(q);
        const matchDef = item.definitionEn.toLowerCase().includes(q);
        if (!matchExpr && !matchAr && !matchDef) return false;
      }
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }
      if (selectedCefr !== 'all' && item.cefr !== selectedCefr) {
        return false;
      }
      return true;
    });
  }, [expressions, searchQuery, selectedCategory, selectedCefr]);

  const totalMatches = filtered.length;
  const totalPages = Math.ceil(totalMatches / pageSize) || 1;
  const currentPage = Math.max(1, Math.min(page, totalPages));
  const offset = (currentPage - 1) * pageSize;
  const pagedItems = filtered.slice(offset, offset + pageSize);

  const handleSpeak = (text: string, accent: 'US' | 'UK', e: React.MouseEvent) => {
    e.stopPropagation();
    speakEnglishVoice(text, { accent });
  };

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
            placeholder="ابحث عن تعبير، مصطلح اصطلاحي، أو فعل مركب (give up, piece of cake, يستسلم...)"
            className="w-full pl-12 pr-12 py-3.5 rounded-2xl bg-[#09091a] border border-white/15 text-white placeholder-white/40 text-sm font-sans focus:outline-none focus:border-[#ffd166]"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
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
              {cat.label}
            </button>
          ))}
        </div>

        {/* Count overview */}
        <div className="text-xs text-white/60 font-bold flex items-center justify-between pt-2 border-t border-white/10">
          <div>
            <span>تم العثور على: </span>
            <strong className="text-[#ffd166] text-sm">
              {totalMatches.toLocaleString()}
            </strong>
            <span> تعبير وعبارة اصطلاحية</span>
          </div>

          <span className="text-[11px] text-white/40">
            مجموعة معتمدة تضم 10,000 تعبير جاهز للحفظ والاستخدام
          </span>
        </div>
      </section>

      {/* Grid of Expressions */}
      {isLoading ? (
        <div className="p-16 rounded-3xl border border-white/10 text-center space-y-4">
          <Loader2 className="w-10 h-10 text-[#ffd166] animate-spin mx-auto" />
          <p className="text-white/80 font-bold text-sm">جارٍ تحميل مجموعة التعابير والمصطلحات (10,000+)...</p>
        </div>
      ) : pagedItems.length === 0 ? (
        <div className="glass-panel p-16 rounded-3xl border border-white/10 text-center space-y-3">
          <BookOpen className="w-10 h-10 text-white/30 mx-auto" />
          <h4 className="text-lg font-black text-white">لم يتم العثور على نتائج</h4>
          <p className="text-xs text-white/60">جرّب البحث بكلمة مختلفة أو اختر فئة أخرى.</p>
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
                    <button
                      onClick={e => handleSpeak(item.expression, 'US', e)}
                      className="px-2 py-1 rounded-lg text-[10px] font-black uppercase bg-[#22D3EE]/15 text-[#22D3EE] border border-[#22D3EE]/30 hover:bg-[#22D3EE]/25 transition-all flex items-center gap-1"
                      title="استمع بالنطق الأمريكي 🇺🇸"
                    >
                      <Volume2 className="w-3 h-3" />
                      <span>US</span>
                    </button>
                    <button
                      onClick={e => handleSpeak(item.expression, 'UK', e)}
                      className="px-2 py-1 rounded-lg text-[10px] font-black uppercase bg-[#A78BFA]/15 text-[#A78BFA] border border-[#A78BFA]/30 hover:bg-[#A78BFA]/25 transition-all flex items-center gap-1"
                      title="استمع بالنطق البريطاني 🇬🇧"
                    >
                      <Volume2 className="w-3 h-3" />
                      <span>UK</span>
                    </button>
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
                    {item.meaningAr}
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
                      {item.exampleAr}
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
                صفحة <strong className="text-white">{currentPage}</strong> من{' '}
                <strong className="text-white">{totalPages}</strong> ({totalMatches.toLocaleString()} تعبير)
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
                  <span>السابق</span>
                </button>

                <button
                  onClick={() => {
                    playSound('click');
                    setPage(p => Math.min(totalPages, p + 1));
                  }}
                  disabled={currentPage >= totalPages}
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
    </div>
  );
};

