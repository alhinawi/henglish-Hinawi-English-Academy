import React from 'react';
import { Logo } from './Logo';
import { PageRoute } from '../types';
import { ArrowUp, Sparkles } from 'lucide-react';
import { playSound } from '../utils/audio';
import { useLanguage } from '../i18n/LanguageContext';
const SECTIONS: {title:string;links:{title:string;route:PageRoute}[]}[]=[
  {title:'ft.sec.build',links:[{title:'ft.link.vocabulary',route:'vocabulary'},{title:'ft.link.grammar',route:'grammar'},{title:'ft.link.listening',route:'listening'},{title:'ft.link.speaking',route:'speaking'},{title:'ft.link.reading',route:'reading'},{title:'ft.link.writing',route:'writing'},{title:'ft.link.pronunciation',route:'pronunciation'}]},
  {title:'ft.sec.live',links:[{title:'ft.link.realLife',route:'real-life'},{title:'ft.link.movies',route:'movies'},{title:'ft.link.games',route:'games'},{title:'ft.link.world3d',route:'world-3d'},{title:'ft.link.sentences',route:'sentences'},{title:'ft.link.translation',route:'translation'}]},
  {title:'ft.sec.journey',links:[{title:'ft.link.courses',route:'courses'},{title:'ft.link.exams',route:'exams'},{title:'ft.link.progress',route:'progress'},{title:'ft.link.resources',route:'resources'},{title:'ft.link.sources',route:'sources'},{title:'ft.link.certificates',route:'certificates'},{title:'ft.link.about',route:'about'}]},
];
export const Footer:React.FC<{onNavigate:(route:PageRoute)=>void}>=({onNavigate})=>{const {t}=useLanguage();return <footer dir="rtl" className="mt-24 border-t border-white/10 bg-[#09091a]">
  <div className="max-w-7xl mx-auto px-5 sm:px-8 py-12"><div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-[minmax(20rem,1.6fr)_repeat(3,minmax(0,1fr))] gap-9">
    <div className="min-w-0 space-y-4"><Logo size="lg"/><p className="text-sm text-[#b9b6d5] leading-8">{t('ft.tagline')}</p><div dir="ltr" className="flex items-center gap-2 text-xs text-[#c4ff55] font-bold"><Sparkles className="w-4 h-4"/>Learn it. Use it. Own it.</div></div>
    {SECTIONS.map(s=><nav key={s.title} className="min-w-0" aria-label={t(s.title)}><h2 className="text-base font-black text-[#ffd166] mb-4">{t(s.title)}</h2><ul className="grid grid-cols-2 md:grid-cols-1 gap-x-3 gap-y-3">{s.links.map(l=><li key={l.route}><button onClick={()=>{playSound('click');onNavigate(l.route);}} className="text-right text-sm leading-6 text-[#dedbf4] hover:text-[#41e7ff]">{t(l.title)}</button></li>)}</ul></nav>)}
  </div><div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-[#8f8cb0]"><span>© {new Date().getFullYear()} Henglish Academy. {t('ft.rights')}</span><button onClick={()=>window.scrollTo({top:0,behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'})} className="flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-[#41e7ff]">{t('ft.backTop')}<ArrowUp className="w-4 h-4"/></button></div></div>
</footer>;};
