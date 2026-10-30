import React, { useState } from 'react';
import { PageRoute } from '../types';
import { ALL_GRAMMAR_RULES, GrammarRuleItem } from '../data/allGrammarRules';
import { ONLINE_IMAGES } from '../data/imageAssets';
import { playSound, speakEnglish, fireCelebration } from '../utils/audio';
import { 
  Sparkles, 
  Search, 
  BookOpen, 
  Volume2, 
  CheckCircle2, 
  AlertTriangle, 
  ChevronDown, 
  Filter, 
  ArrowRight,
  GraduationCap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface GrammarAcademyPageProps {
  onNavigate: (route: PageRoute, lessonId?: string) => void;
}

export const GrammarAcademyPage: React.FC<GrammarAcademyPageProps> = ({ onNavigate }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedLevel, setSelectedLevel] = useState<string>('All');
  const [expandedRuleId, setExpandedRuleId] = useState<string | null>('present-simple');
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});

  const categories = [
    'All',
    'أزمنة المضارع',
    'أزمنة الماضي',
    'أزمنة المستقبل',
    'حالات الشرط',
    'المبني للمجهول والتركيب'
  ];

  const levels = ['All', 'A1', 'A2', 'B1', 'B2', 'C1'];

  const filteredRules = ALL_GRAMMAR_RULES.filter(rule => {
    const matchesCategory = selectedCategory === 'All' || rule.category === selectedCategory;
    const matchesLevel = selectedLevel === 'All' || rule.level.startsWith(selectedLevel);
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q || 
      rule.titleAr.toLowerCase().includes(q) || 
      rule.titleEn.toLowerCase().includes(q) || 
      rule.summaryAr.toLowerCase().includes(q) ||
      rule.goldenFormula.toLowerCase().includes(q);

    return matchesCategory && matchesLevel && matchesSearch;
  });

  const handleAnswerMiniQuiz = (ruleId: string, qIdx: number, selectedOpt: number, correctOpt: number) => {
    const key = `${ruleId}-${qIdx}`;
    if (quizAnswers[key] !== undefined) return;

    setQuizAnswers(prev => ({ ...prev, [key]: selectedOpt }));
    if (selectedOpt === correctOpt) {
      playSound('correct');
      fireCelebration();
    } else {
      playSound('wrong');
    }
  };

  const toggleExpand = (id: string) => {
    playSound('click');
    setExpandedRuleId(prev => prev === id ? null : id);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      
      {/* ACADEMY HERO WITH REAL PHOTOGRAPHY */}
      <section className="relative rounded-3xl overflow-hidden border border-white/10 p-8 sm:p-14 min-h-[360px] flex items-center">
        {/* Background Online Photo with Dark Gradient Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src={ONLINE_IMAGES.modernClassroom} 
            alt="Modern English Grammar Academy Lecture Hall" 
            className="w-full h-full object-cover filter brightness-[0.25]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0c0b20] via-[#0c0b20]/90 to-transparent" />
        </div>

        <div className="relative z-10 max-w-3xl space-y-5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-black bg-[#ffd166]/20 text-[#ffd166] border border-[#ffd166]/40 shadow-sm">
            <GraduationCap className="w-4 h-4" />
            <span>HINAWI GRAMMAR ACADEMY • المنهج الأكاديمي الشامل</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight">
            أكاديمية قواعد اللغة الإنجليزية بالكامل 🦅
          </h1>

          <p className="text-sm sm:text-base text-[#dedbf4] leading-relaxed">
            منهج تفاعلي متكامل يغطي كافة قواعد الجرامر بالترتيب: من أزمنة المضارع والماضي والمستقبل، وحتى حالات الشرط والمبني للمجهول والتركيبات المتقدمة، بشرح مبسط بالمصري وأمثلة واقعية ونطق صوتي حي.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <span className="px-3 py-1.5 rounded-xl bg-white/10 text-white text-xs font-bold border border-white/15 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#c4ff55]" />
              ١٦ قاعدة أساسية مشروحة
            </span>
            <span className="px-3 py-1.5 rounded-xl bg-white/10 text-white text-xs font-bold border border-white/15 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#41e7ff]" />
              أمثلة صوتية لكل قاعدة
            </span>
            <span className="px-3 py-1.5 rounded-xl bg-white/10 text-white text-xs font-bold border border-white/15 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#ffd166]" />
              كويزات استيعاب فورية
            </span>
          </div>
        </div>
      </section>

      {/* FILTER & SEARCH CONTROLS */}
      <section className="space-y-4">
        {/* Search input */}
        <div className="relative">
          <Search className="w-5 h-5 absolute right-4 top-1/2 -translate-y-1/2 text-[#b9b6d5]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث عن أي زمن أو قاعدة (مثال: المضارع التام، will، passive، conditionals)..."
            className="w-full pr-12 pl-4 py-3.5 rounded-2xl bg-white/5 border border-white/10 focus:border-[#41e7ff] text-white placeholder-[#b9b6d5]/60 text-sm outline-none transition-colors"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
          <span className="text-xs text-[#b9b6d5] flex items-center gap-1 ml-2 font-bold shrink-0">
            <Filter className="w-3.5 h-3.5" />
            الأقسام:
          </span>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => {
                playSound('click');
                setSelectedCategory(cat);
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-gradient-to-r from-[#ffd166] to-[#ff9c66] text-[#21132c] font-black shadow-md'
                  : 'bg-white/5 text-[#dedbf4] hover:bg-white/10'
              }`}
            >
              {cat === 'All' ? 'جميع القواعد (16)' : cat}
            </button>
          ))}
        </div>

        {/* Level Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
          <span className="text-xs text-[#b9b6d5] font-bold ml-2 shrink-0">
            المستوى:
          </span>
          {levels.map(lvl => (
            <button
              key={lvl}
              onClick={() => {
                playSound('click');
                setSelectedLevel(lvl);
              }}
              className={`px-3 py-1 rounded-lg text-xs font-semibold shrink-0 transition-all cursor-pointer ${
                selectedLevel === lvl
                  ? 'bg-[#41e7ff] text-[#09091a] font-bold'
                  : 'bg-white/5 text-[#b9b6d5] hover:bg-white/10'
              }`}
            >
              {lvl === 'All' ? 'الكل' : lvl}
            </button>
          ))}
        </div>
      </section>

      {/* GRAMMAR SECTIONS LIST */}
      <section className="space-y-6">
        {filteredRules.length === 0 ? (
          <div className="p-12 text-center glass-panel rounded-3xl border border-white/10 space-y-3">
            <p className="text-lg font-bold text-white">لم نجد قواعد تطابق بحثك حالياً.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
                setSelectedLevel('All');
              }}
              className="text-xs text-[#ffd166] underline cursor-pointer"
            >
              إعادة تعيين فلاتر البحث
            </button>
          </div>
        ) : (
          filteredRules.map((rule: GrammarRuleItem) => {
            const isExpanded = expandedRuleId === rule.id;

            return (
              <div 
                key={rule.id}
                id={rule.id}
                className={`glass-panel rounded-3xl border transition-all overflow-hidden ${
                  isExpanded 
                    ? 'border-[#41e7ff]/40 shadow-[0_0_30px_rgba(65,231,255,0.1)] ring-1 ring-[#41e7ff]/20' 
                    : 'border-white/10 hover:border-white/20'
                }`}
              >
                {/* Rule Card Header Banner with Real Online Photo */}
                <div 
                  onClick={() => toggleExpand(rule.id)}
                  className="cursor-pointer relative overflow-hidden"
                >
                  <div className="flex flex-col md:flex-row items-stretch">
                    {/* Visual Photo Thumbnail */}
                    <div className="md:w-64 h-44 md:h-auto relative overflow-hidden shrink-0">
                      <img 
                        src={rule.imageUrl} 
                        alt={rule.imageAlt}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-l from-[#171632] via-transparent to-transparent" />
                      <div className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-[#09091a]/80 backdrop-blur-md border border-white/15 text-[11px] font-black text-[#ffd166]">
                        #{rule.order.toString().padStart(2, '0')}
                      </div>
                    </div>

                    {/* Card Summary Content */}
                    <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                          <div className="flex items-center gap-2">
                            <span className="px-2.5 py-0.5 rounded-md text-[11px] font-black bg-[#41e7ff]/15 text-[#41e7ff] border border-[#41e7ff]/30">
                              {rule.category}
                            </span>
                            <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-white/5 text-[#c4ff55]">
                              {rule.level}
                            </span>
                          </div>

                          <span className="text-xs text-[#b9b6d5] font-semibold flex items-center gap-1">
                            {isExpanded ? 'اضغط للطي' : 'اضغط للتفاصيل والتمرين'}
                            <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180 text-[#41e7ff]' : ''}`} />
                          </span>
                        </div>

                        <h3 className="text-xl sm:text-2xl font-black text-white hover:text-[#41e7ff] transition-colors">
                          {rule.titleAr}
                        </h3>
                        <span className="en block text-xs sm:text-sm font-bold text-[#ffd166] mt-0.5">
                          {rule.titleEn}
                        </span>

                        <p className="text-xs sm:text-sm text-[#dedbf4] mt-2.5 line-clamp-2 leading-relaxed">
                          {rule.summaryAr}
                        </p>
                      </div>

                      {/* Golden Formula Preview & Action Buttons */}
                      <div className="mt-4 pt-3 border-t border-white/5 flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-bold text-[#ffd166]">التركيبة:</span>
                          <code className="en text-xs font-black text-[#41e7ff] px-2.5 py-1 rounded-lg bg-black/40 border border-white/10">
                            {rule.goldenFormula}
                          </code>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              playSound('click');
                              window.location.hash = `grammar/${rule.id}`;
                              onNavigate('grammar-lesson', rule.id);
                            }}
                            className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-[#ffd166] via-[#ff9c66] to-[#41e7ff] text-[#0c0b20] text-xs font-black hover:brightness-110 flex items-center gap-1.5 shadow-md cursor-pointer transition-transform hover:-translate-y-0.5"
                          >
                            <BookOpen className="w-3.5 h-3.5" />
                            <span>ابدأ الدرس التعليمي الكامل 📖</span>
                          </button>

                          {rule.id === 'future-perfect' && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                playSound('click');
                                onNavigate('courses/grammar/future-perfect');
                              }}
                              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-[#ffd166] text-xs font-bold flex items-center gap-1 cursor-pointer border border-white/10"
                            >
                              <span>الكورس الرائد (8 دروس)</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* EXPANDABLE DEEP DIVE SECTION */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="border-t border-white/10 p-6 sm:p-8 bg-[#09091a]/60 space-y-8"
                    >
                      {/* Formulas Breakdown */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                          <span className="text-xs font-bold text-[#c4ff55] block mb-1">الإثبات (Affirmative):</span>
                          <code className="en text-xs sm:text-sm font-black text-white">{rule.goldenFormula}</code>
                        </div>
                        <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                          <span className="text-xs font-bold text-[#ff4f9a] block mb-1">النفي (Negative):</span>
                          <code className="en text-xs sm:text-sm font-black text-white">{rule.negativeFormula}</code>
                        </div>
                        <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                          <span className="text-xs font-bold text-[#41e7ff] block mb-1">السؤال (Interrogative):</span>
                          <code className="en text-xs sm:text-sm font-black text-white">{rule.questionFormula}</code>
                        </div>
                      </div>

                      {/* Timeline & Usage */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Usage Points */}
                        <div className="space-y-3">
                          <h4 className="text-sm font-black text-white flex items-center gap-2">
                            <BookOpen className="w-4 h-4 text-[#ffd166]" />
                            <span>متى نستخدم هذه القاعدة بالتحديد؟</span>
                          </h4>
                          <ul className="space-y-2 text-xs sm:text-sm text-[#dedbf4]">
                            {rule.keyUsagePoints.map((pt, pIdx) => (
                              <li key={pIdx} className="flex items-start gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#41e7ff] mt-2 shrink-0" />
                                <span>{pt}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Egyptian Tips & Secret */}
                        <div className="p-5 rounded-2xl bg-gradient-to-br from-[#ffd166]/10 to-[#ff4f9a]/10 border border-[#ffd166]/30 space-y-3">
                          <h4 className="text-sm font-black text-[#ffd166] flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-[#ffd166]" />
                            <span>سر فهم القاعدة بالمصري:</span>
                          </h4>
                          <ul className="space-y-2 text-xs sm:text-sm text-white leading-relaxed">
                            {rule.egyptianTips.map((tip, tIdx) => (
                              <li key={tIdx} className="flex items-start gap-2">
                                <span className="text-[#ffd166] font-black">💡</span>
                                <span>{tip}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Common Traps Callout */}
                      {rule.commonTraps.length > 0 && (
                        <div className="p-4 rounded-2xl bg-[#ff4f9a]/10 border border-[#ff4f9a]/30 space-y-2">
                          <div className="flex items-center gap-2 text-xs font-black text-[#ff4f9a]">
                            <AlertTriangle className="w-4 h-4" />
                            <span>فخاخ شائعة يقع فيها الكثيرون (احذر منها!):</span>
                          </div>
                          <ul className="space-y-1.5 text-xs text-[#dedbf4]">
                            {rule.commonTraps.map((trap, trapIdx) => (
                              <li key={trapIdx} className="flex items-start gap-2">
                                <span className="text-[#ff4f9a] font-bold">⚠️</span>
                                <span>{trap}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Audio Examples */}
                      <div className="space-y-3">
                        <h4 className="text-sm font-black text-white flex items-center gap-2">
                          <Volume2 className="w-4 h-4 text-[#41e7ff]" />
                          <span>أمثلة واقعية ونطق صوتي مباشر:</span>
                        </h4>

                        <div className="space-y-2.5">
                          {rule.examples.map((ex, exIdx) => (
                            <div 
                              key={exIdx} 
                              className="p-4 rounded-2xl bg-[#171632] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                            >
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white/5 text-[#b9b6d5]">
                                    {ex.context}
                                  </span>
                                </div>
                                <p className="en text-base sm:text-lg font-bold text-white mt-1">
                                  {ex.en}
                                </p>
                                <p className="text-xs sm:text-sm text-[#b9b6d5] mt-1">
                                  {ex.ar}
                                </p>
                              </div>

                              <button
                                onClick={() => {
                                  playSound('click');
                                  speakEnglish(ex.en);
                                }}
                                className="p-2.5 rounded-xl bg-white/5 hover:bg-white/15 text-[#41e7ff] hover:text-white transition-colors cursor-pointer shrink-0 self-start sm:self-center flex items-center gap-1.5 text-xs font-bold"
                                title="استمع للنطق الصوتي"
                              >
                                <Volume2 className="w-4 h-4" />
                                <span>نطق</span>
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Mini Quiz */}
                      {rule.miniQuiz.length > 0 && (
                        <div className="p-5 sm:p-6 rounded-2xl bg-[#09091a] border border-[#ffd166]/30 space-y-4">
                          <div className="flex items-center gap-2 text-xs font-black text-[#ffd166]">
                            <Sparkles className="w-4 h-4" />
                            <span>كويز استيعاب سريع على هذه القاعدة:</span>
                          </div>

                          {rule.miniQuiz.map((q, qIdx) => {
                            const qKey = `${rule.id}-${qIdx}`;
                            const answered = quizAnswers[qKey] !== undefined;
                            const chosen = quizAnswers[qKey];
                            const isCorrect = chosen === q.correct;

                            return (
                              <div key={qIdx} className="space-y-3">
                                <p className="en text-sm sm:text-base font-bold text-white">
                                  {q.question}
                                </p>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                  {q.options.map((opt, optIdx) => {
                                    let btnStyle = 'bg-[#171632] hover:bg-[#201d43] border-white/10 text-white';
                                    if (answered) {
                                      if (optIdx === q.correct) {
                                        btnStyle = 'bg-[#c4ff55]/20 border-[#c4ff55] text-[#c4ff55] font-black';
                                      } else if (chosen === optIdx) {
                                        btnStyle = 'bg-[#ff4f9a]/20 border-[#ff4f9a] text-[#ff4f9a]';
                                      } else {
                                        btnStyle = 'opacity-40 bg-[#171632] border-white/5';
                                      }
                                    }

                                    return (
                                      <button
                                        key={optIdx}
                                        onClick={() => handleAnswerMiniQuiz(rule.id, qIdx, optIdx, q.correct)}
                                        disabled={answered}
                                        className={`en p-3 rounded-xl border text-xs sm:text-sm font-bold text-left transition-all cursor-pointer flex items-center justify-between ${btnStyle}`}
                                      >
                                        <span>{opt}</span>
                                        {answered && optIdx === q.correct && (
                                          <CheckCircle2 className="w-4 h-4 text-[#c4ff55]" />
                                        )}
                                      </button>
                                    );
                                  })}
                                </div>

                                {answered && (
                                  <div className={`p-3 rounded-xl text-xs ${
                                    isCorrect 
                                      ? 'bg-[#c4ff55]/10 border border-[#c4ff55]/30 text-[#c4ff55]' 
                                      : 'bg-[#ff4f9a]/10 border border-[#ff4f9a]/30 text-[#ff8bb9]'
                                  }`}>
                                    <strong className="text-[#ffd166]">{isCorrect ? '✅ إجابة رائعة: ' : '💡 انتبه: '}</strong>
                                    {q.explanation}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}

                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })
        )}
      </section>

    </div>
  );
};
