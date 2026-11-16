import React from 'react';
import { PageRoute } from '../types';
import { BookOpen, Headphones, Mic, PenTool, Languages, Gamepad2, Film, Globe, ArrowLeft, GraduationCap, Volume2, Compass } from 'lucide-react';
import { ALL_GRAMMAR_RULES } from '../data/allGrammarRules';
import { txText, useAppTextMap } from '../services/contentI18nService';
import { useLanguage } from '../i18n/LanguageContext';
const AREAS=[
  {title:'hp.area.vocabulary.title',desc:'hp.area.vocabulary.desc',route:'vocabulary',Icon:Languages},
  {title:'hp.area.grammar.title',desc:'hp.area.grammar.desc',route:'grammar',Icon:GraduationCap},
  {title:'hp.area.listening.title',desc:'hp.area.listening.desc',route:'listening',Icon:Headphones},
  {title:'hp.area.speaking.title',desc:'hp.area.speaking.desc',route:'speaking',Icon:Mic},
  {title:'hp.area.reading.title',desc:'hp.area.reading.desc',route:'reading',Icon:BookOpen},
  {title:'hp.area.writing.title',desc:'hp.area.writing.desc',route:'writing',Icon:PenTool},
  {title:'hp.area.pronunciation.title',desc:'hp.area.pronunciation.desc',route:'pronunciation',Icon:Volume2},
  {title:'hp.area.movies.title',desc:'hp.area.movies.desc',route:'movies',Icon:Film},
  {title:'hp.area.games.title',desc:'hp.area.games.desc',route:'games',Icon:Gamepad2},
  {title:'hp.area.real-life.title',desc:'hp.area.real-life.desc',route:'real-life',Icon:Compass},
  {title:'hp.area.world-3d.title',desc:'hp.area.world-3d.desc',route:'world-3d',Icon:Globe},
  {title:'hp.area.exams.title',desc:'hp.area.exams.desc',route:'exams',Icon:GraduationCap},
] as const;
export const HomePage:React.FC<{onNavigate:(route:PageRoute,lessonId?:string)=>void;completionPercentage:number}>=({onNavigate})=>{const appText=useAppTextMap('allGrammarRules');const {t}=useLanguage();return(<div dir="rtl" className="space-y-10 pb-8">
  <section className="rounded-3xl border border-[#41e7ff]/25 bg-gradient-to-bl from-[#27203f] via-[#171632] to-[#0c0b20] p-6 sm:p-12 space-y-5"><p dir="ltr" className="text-xs tracking-widest text-[#c4ff55]">HENGLISH ACADEMY</p><h1 className="text-4xl sm:text-6xl font-black text-white leading-tight">{t('hp.heroTitleA')}<br/><span className="text-[#ffd166]">{t('hp.heroTitleB')}</span></h1><p className="max-w-2xl text-base leading-8 text-[#c5c0db]">{t('hp.heroSub')}</p><div className="flex flex-wrap gap-3"><button onClick={()=>onNavigate('courses')} className="rounded-2xl bg-[#c4ff55] px-5 py-3 font-black text-[#0c0b20] flex items-center gap-2">{t('hp.ctaStart')}<ArrowLeft className="w-4 h-4"/></button><button onClick={()=>onNavigate('exams')} className="rounded-2xl border border-white/20 px-5 py-3 font-bold text-white">{t('hp.ctaLevel')}</button></div><p className="text-xs text-[#9b7bff]">Learn it. Use it. Own it.</p></section>
  <section><h2 className="text-2xl font-black text-white mb-5">{t('hp.skillsTitle')}</h2><div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">{AREAS.map(({title,desc,route,Icon})=><button key={route} onClick={()=>onNavigate(route)} className="rounded-3xl border border-white/10 bg-[#121124] p-5 text-right space-y-3 hover:border-[#41e7ff]/40"><Icon className="w-7 h-7 text-[#41e7ff]"/><h3 className="text-lg font-black text-white">{t(title)}</h3><p className="text-sm leading-7 text-[#b9b6d5]">{t(desc)}</p></button>)}</div></section>
  <section className="rounded-3xl border border-white/10 p-5 space-y-4"><h2 className="text-xl font-black text-white">{t('hp.grammarTitle')}</h2><p className="text-sm text-[#b9b6d5]">{t('hp.grammarSub')}</p><div className="grid sm:grid-cols-3 gap-3">{['present-simple','past-simple','first-conditional'].map(id=>ALL_GRAMMAR_RULES.find(r=>r.id===id)).filter(Boolean).map(r=><button key={r!.id} onClick={()=>onNavigate('grammar-lesson',r!.id)} className="rounded-2xl bg-white/5 p-4 text-right space-y-2"><p className="text-xs text-[#9b7bff]">{r!.level}</p><h3 className="font-bold text-white">{txText(appText,r!.titleAr)}</h3><p dir="ltr" className="text-xs text-[#b9b6d5]">{r!.titleEn}</p></button>)}</div></section>
</div>);};
