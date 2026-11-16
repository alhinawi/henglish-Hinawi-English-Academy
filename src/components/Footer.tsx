import React from 'react';
import { Logo } from './Logo';
import { PageRoute } from '../types';
import { ArrowUp, Sparkles } from 'lucide-react';
import { playSound } from '../utils/audio';
const SECTIONS: {title:string;links:{title:string;route:PageRoute}[]}[]=[
  {title:'ابني لغتك',links:[{title:'الكلمات والتعبيرات',route:'vocabulary'},{title:'القواعد والجرامر',route:'grammar'},{title:'الاستماع',route:'listening'},{title:'المحادثة',route:'speaking'},{title:'القراءة',route:'reading'},{title:'الكتابة',route:'writing'},{title:'النطق والفونيتكس',route:'pronunciation'}]},
  {title:'عيش الإنجليزي',links:[{title:'مواقف الحياة الحقيقية',route:'real-life'},{title:'اتعلم من الأفلام',route:'movies'},{title:'ساحة الألعاب',route:'games'},{title:'العالم ثلاثي الأبعاد',route:'world-3d'},{title:'مكتبة الجمل',route:'sentences'},{title:'استوديو الترجمة',route:'translation'}]},
  {title:'كمّل رحلتك',links:[{title:'استكشف الكورسات',route:'courses'},{title:'الاختبارات وتحديد المستوى',route:'exams'},{title:'تقدمي وإنجازاتي',route:'progress'},{title:'الموارد والمذكرات',route:'resources'},{title:'الشهادات',route:'certificates'},{title:'عن هناوي إنجلش',route:'about'}]},
];
export const Footer:React.FC<{onNavigate:(route:PageRoute)=>void}>=({onNavigate})=><footer dir="rtl" className="mt-24 border-t border-white/10 bg-[#09091a]">
  <div className="max-w-7xl mx-auto px-5 sm:px-8 py-12"><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-9">
    <div className="space-y-4"><Logo size="lg"/><p className="text-sm text-[#b9b6d5] leading-8">هناوي إنجلش منصة شاملة تتعلم فيها الإنجليزي وتستخدمه: كلمات وقواعد، استماع ومحادثة، قراءة وكتابة ونطق. جرّب اللي اتعلمته في الأفلام والألعاب والمواقف والعالم ثلاثي الأبعاد، وتابع مستواك بالاختبارات.</p><div dir="ltr" className="flex items-center gap-2 text-xs text-[#c4ff55] font-bold"><Sparkles className="w-4 h-4"/>Learn it. Use it. Own it.</div></div>
    {SECTIONS.map(s=><nav key={s.title} aria-label={s.title}><h2 className="text-base font-black text-[#ffd166] mb-4">{s.title}</h2><ul className="grid grid-cols-2 md:grid-cols-1 gap-x-3 gap-y-3">{s.links.map(l=><li key={l.route}><button onClick={()=>{playSound('click');onNavigate(l.route);}} className="text-right text-sm leading-6 text-[#dedbf4] hover:text-[#41e7ff]">{l.title}</button></li>)}</ul></nav>)}
  </div><div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-[#8f8cb0]"><span>© {new Date().getFullYear()} Henglish Academy. جميع الحقوق محفوظة.</span><button onClick={()=>window.scrollTo({top:0,behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'})} className="flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-[#41e7ff]">العودة للأعلى<ArrowUp className="w-4 h-4"/></button></div></div>
</footer>;
