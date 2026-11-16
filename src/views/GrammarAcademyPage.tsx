import React, { useState } from 'react';
import { PageRoute } from '../types';
import { ALL_GRAMMAR_RULES, GrammarRuleItem } from '../data/allGrammarRules';
import { txText, useAppTextMap } from '../services/contentI18nService';
import { useLanguage } from '../i18n/LanguageContext';
import { ONLINE_IMAGES } from '../data/imageAssets';
import { playSound } from '../utils/audio';
import { 
  Search, 
  BookOpen, 
  Filter, 
  ArrowRight,
  GraduationCap
} from 'lucide-react';

interface GrammarAcademyPageProps {
  onNavigate: (route: PageRoute, lessonId?: string) => void;
}

export const GrammarAcademyPage: React.FC<GrammarAcademyPageProps> = ({ onNavigate }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const appText = useAppTextMap('allGrammarRules');
  const { t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedLevel, setSelectedLevel] = useState<string>('All');

  const categories = [
    'All',
    'أزمنة المضارع',
    'أزمنة الماضي',
    'أزمنة المستقبل',
    'مواضيع وقواعد أخرى',
    'الأساسيات والتركيب اللغوي',
  ];

  const levels = ['All', 'A1', 'A2', 'B1', 'B2', 'C1'];

  const filteredRules = ALL_GRAMMAR_RULES.filter(rule => {
    const matchesCategory =
      selectedCategory === 'All' ||
      rule.category === selectedCategory ||
      (selectedCategory === 'مواضيع وقواعد أخرى' && (rule.category === 'حالات الشرط' || rule.category === 'المبني للمجهول والتركيب' || rule.category === 'مواضيع وقواعد أخرى'));
    const matchesLevel = selectedLevel === 'All' || rule.level.startsWith(selectedLevel);
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q || 
      rule.titleAr.toLowerCase().includes(q) || 
      rule.titleEn.toLowerCase().includes(q) || 
      rule.summaryAr.toLowerCase().includes(q) ||
      rule.goldenFormula.toLowerCase().includes(q);

    return matchesCategory && matchesLevel && matchesSearch;
  });

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
          <div className="absolute inset-0 bg-linear-to-r from-[#0c0b20] via-[#0c0b20]/90 to-transparent" />
        </div>

        <div className="relative z-10 max-w-3xl space-y-5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-black bg-[#ffd166]/20 text-[#ffd166] border border-[#ffd166]/40 shadow-sm">
            <GraduationCap className="w-4 h-4" />
            <span>{t('grammar.heroBadge')}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight">
            {t('grammar.heroTitle')}
          </h1>

          <p className="text-sm sm:text-base text-[#dedbf4] leading-relaxed">
            {t('grammar.heroSub')}
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <span className="px-3 py-1.5 rounded-xl bg-white/10 text-white text-xs font-bold border border-white/15 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#c4ff55]" />
              {t('grammar.heroRulesBadge').replace('{count}', String(ALL_GRAMMAR_RULES.length))}
            </span>
            <span className="px-3 py-1.5 rounded-xl bg-white/10 text-white text-xs font-bold border border-white/15 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#41e7ff]" />
              {t('grammar.heroAudioBadge')}
            </span>
            <span className="px-3 py-1.5 rounded-xl bg-white/10 text-white text-xs font-bold border border-white/15 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#ffd166]" />
              {t('grammar.heroQuizBadge')}
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
            dir="auto"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('grammar.searchPlaceholder')}
            className="w-full pr-12 pl-4 py-3.5 rounded-2xl bg-white/5 border border-white/10 focus:border-[#41e7ff] text-white placeholder-[#b9b6d5]/60 text-sm outline-none transition-colors"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
          <span className="text-xs text-[#b9b6d5] flex items-center gap-1 ml-2 font-bold shrink-0">
            <Filter className="w-3.5 h-3.5" />
            {t('grammar.sectionsLabel')}
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
                  ? 'bg-linear-to-r from-[#ffd166] to-[#ff9c66] text-[#21132c] font-black shadow-md'
                  : 'bg-white/5 text-[#dedbf4] hover:bg-white/10'
              }`}
            >
              {cat === 'All' ? t('grammar.allRules').replace('{count}', String(ALL_GRAMMAR_RULES.length)) : txText(appText, cat)}
            </button>
          ))}
        </div>

        {/* Level Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
          <span className="text-xs text-[#b9b6d5] font-bold ml-2 shrink-0">
            {t('grammar.levelLabel')}
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
              {lvl === 'All' ? t('grammar.levelAll') : lvl}
            </button>
          ))}
        </div>
      </section>

      {/* GRAMMAR SECTIONS LIST */}
      <section className="space-y-6">
        {filteredRules.length === 0 ? (
          <div className="p-12 text-center glass-panel rounded-3xl border border-white/10 space-y-3">
            <p className="text-lg font-bold text-white">{t('grammar.noResults')}</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
                setSelectedLevel('All');
              }}
              className="text-xs text-[#ffd166] underline cursor-pointer"
            >
              {t('grammar.resetFilters')}
            </button>
          </div>
        ) : (
          filteredRules.map((rule: GrammarRuleItem) => {
            return (
              <div 
                key={rule.id}
                id={rule.id}
                className="glass-panel rounded-3xl border border-white/10 hover:border-[#41e7ff]/40 hover:shadow-[0_0_30px_rgba(65,231,255,0.08)] transition-all overflow-hidden"
              >
                {/* Rule Card - tapping anywhere opens the full lesson on its own page */}
                <div 
                  onClick={() => {
                    playSound('click');
                    sessionStorage.setItem('henglish:grammarScrollY', String(window.scrollY));
                    onNavigate('grammar-lesson', rule.id);
                  }}
                  className="cursor-pointer relative overflow-hidden"
                >
                  <div className="flex flex-col md:flex-row items-stretch">
                    {/* Visual Photo Thumbnail */}
                    <div className="md:w-64 h-44 md:h-auto relative overflow-hidden shrink-0">
                      <img 
                        src={rule.imageUrl} 
                        alt={rule.imageAlt}
                        loading="lazy"
                        decoding="async"
                        width={800}
                        height={450}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" 
                      />
                      <div className="absolute inset-0 bg-linear-to-t md:bg-linear-to-l from-[#171632] via-transparent to-transparent" />
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
                              {txText(appText, rule.category)}
                            </span>
                            <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-white/5 text-[#c4ff55]">
                              {rule.level}
                            </span>
                          </div>

                          <span className="text-xs text-[#b9b6d5] font-semibold flex items-center gap-1">
                            <span>{t('grammar.enterLesson')}</span>
                            <ArrowRight className="w-4 h-4 rotate-180 text-[#41e7ff]" />
                          </span>
                        </div>

                        <h3 className="text-xl sm:text-2xl font-black text-white hover:text-[#41e7ff] transition-colors">
                          {txText(appText, rule.titleAr)}
                        </h3>
                        <span className="en block text-xs sm:text-sm font-bold text-[#ffd166] mt-0.5">
                          {rule.titleEn}
                        </span>

                        <p className="text-xs sm:text-sm text-[#dedbf4] mt-2.5 line-clamp-2 leading-relaxed">
                          {txText(appText, rule.summaryAr)}
                        </p>
                      </div>

                      {/* Golden Formula Preview & Action Buttons */}
                      <div className="mt-4 pt-3 border-t border-white/5 flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-bold text-[#ffd166]">{t('grammar.structureLabel')}</span>
                          <code className="en text-xs font-black text-[#41e7ff] px-2.5 py-1 rounded-lg bg-black/40 border border-white/10">
                            {txText(appText, rule.goldenFormula)}
                          </code>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              playSound('click');
                              sessionStorage.setItem('henglish:grammarScrollY', String(window.scrollY));
                              window.location.hash = `grammar/${rule.id}`;
                              onNavigate('grammar-lesson', rule.id);
                            }}
                            className="px-4 py-1.5 rounded-xl bg-linear-to-r from-[#ffd166] via-[#ff9c66] to-[#41e7ff] text-[#0c0b20] text-xs font-black hover:brightness-110 flex items-center gap-1.5 shadow-md cursor-pointer transition-transform hover:-translate-y-0.5"
                          >
                            <BookOpen className="w-3.5 h-3.5" />
                            <span>{t('grammar.startLesson')}</span>
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
                              <span>{t('grammar.flagshipCourse')}</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            );
          })
        )}
      </section>

    </div>
  );
};
