import React, { useState, useEffect, useMemo } from 'react';
import { Search, X, ArrowRight, Clock, Compass } from 'lucide-react';
import { FUTURE_PERFECT_LESSONS } from '../data/futurePerfectCourse';
import { VERB_TOOLKIT } from '../data/verbsData';
import { ALL_GRAMMAR_RULES } from '../data/allGrammarRules';
import { VOCABULARY_ACADEMY_WORDS } from '../data/vocabularyAcademyData';
import { PageRoute } from '../types';
import { playSound } from '../utils/audio';
interface Props { isOpen:boolean; onClose:()=>void; onNavigate:(route:PageRoute,lessonId?:string)=>void; userLevel?:string; }
interface Entry { id:string; title:string; subtitle:string; route:PageRoute; target?:string; group:string; level?:string; keywords?:string; }
const RECENT_KEY='henglish_search_recent_v1';
const ACADEMIES:Entry[]=[
  {id:'grammar',title:'أكاديمية الجرامر',subtitle:'قواعد وأمثلة وتدريبات',route:'grammar',group:'الأكاديميات'},
  {id:'vocabulary',title:'أكاديمية الكلمات',subtitle:'المعاني والنطق والأمثلة',route:'vocabulary',group:'الأكاديميات'},
  {id:'listening',title:'أكاديمية الاستماع',subtitle:'اسمع وافهم وتدرب',route:'listening',group:'الأكاديميات'},
  {id:'speaking',title:'أكاديمية المحادثة',subtitle:'ممارسة الكلام والمواقف',route:'speaking',group:'الأكاديميات'},
  {id:'reading',title:'أكاديمية القراءة',subtitle:'نصوص وفهم المقروء',route:'reading',group:'الأكاديميات'},
  {id:'writing',title:'أكاديمية الكتابة',subtitle:'اكتب وراجع مهاراتك',route:'writing',group:'الأكاديميات'},
  {id:'translation',title:'استوديو الترجمة',subtitle:'ترجمة وشرح لغوي ومستندات',route:'translation',group:'الأكاديميات'},
  {id:'sentences',title:'مكتبة الجمل',subtitle:'المعنى المصري والنطق',route:'sentences',group:'الأكاديميات'},
  {id:'movies',title:'اتعلم من الأفلام',subtitle:'مشاهد وحوار وتدريبات',route:'movies',group:'الأكاديميات'},
  {id:'games',title:'ساحة الألعاب',subtitle:'تحديات الكلمات والجمل',route:'games',group:'الأكاديميات'},
];
const norm=(s:string)=>s.toLowerCase().normalize('NFKC').replace(/[أإآ]/g,'ا').replace(/[\u064B-\u065F]/g,'');
export const GlobalSearchModal:React.FC<Props>=({isOpen,onClose,onNavigate,userLevel='A1'})=>{
  const [query,setQuery]=useState(''); const [recent,setRecent]=useState<string[]>(()=>{try{const p=JSON.parse(localStorage.getItem(RECENT_KEY)||'[]');return Array.isArray(p)?p.filter(x=>typeof x==='string').slice(0,5):[];}catch{return [];}});
  useEffect(()=>{if(!isOpen)return;setQuery('');const handle=(e:KeyboardEvent)=>{if(e.key==='Escape')onClose();};window.addEventListener('keydown',handle);return()=>window.removeEventListener('keydown',handle);},[isOpen,onClose]);
  const index=useMemo<Entry[]>(()=>[
    ...ACADEMIES,
    ...ALL_GRAMMAR_RULES.map(r=>({id:`grammar:${r.id}`,title:r.titleAr,subtitle:r.titleEn,keywords:r.summaryAr,level:r.level.split(' ')[0],route:'grammar-lesson' as PageRoute,target:r.id,group:'قواعد الإنجليزية'})),
    ...VOCABULARY_ACADEMY_WORDS.map(w=>({id:`word:${w.id}`,title:w.word,subtitle:w.meaningAr,keywords:w.exampleEn,level:w.level,route:'vocabulary' as PageRoute,group:'كلمات وأمثلة'})),
    ...VERB_TOOLKIT.map(v=>({id:`verb:${v.v1}`,title:`${v.v1} · ${v.v2} · ${v.v3}`,subtitle:v.meaningAr,route:'vocabulary' as PageRoute,group:'الأفعال وتصريفاتها'})),
    ...FUTURE_PERFECT_LESSONS.map(l=>({id:`course:${l.id}`,title:l.title,subtitle:l.subtitle,keywords:`future perfect المستقبل التام ${l.description}`,route:'lesson' as PageRoute,target:l.id,group:'دروس متخصصة',level:'B2'})),
  ],[]);
  if(!isOpen)return null;
  const q=norm(query.trim());
  const select=(e:Entry)=>{const ids=[e.id,...recent.filter(id=>id!==e.id)].slice(0,5);setRecent(ids);try{localStorage.setItem(RECENT_KEY,JSON.stringify(ids));}catch{/* Private mode */}playSound('click');onNavigate(e.route,e.target);onClose();};
  const matches=q?index.filter(e=>norm(`${e.title} ${e.subtitle} ${e.keywords||''}`).includes(q)):[];
  // Per-group caps prevent a long specialist course or vocabulary list taking over.
  const groups=q?['الأكاديميات','قواعد الإنجليزية','كلمات وأمثلة','الأفعال وتصريفاتها','دروس متخصصة'].map(group=>({title:group,entries:matches.filter(e=>e.group===group).slice(0,group==='دروس متخصصة'?2:3)})).filter(g=>g.entries.length):[
    {title:'كمل من آخر زيارة',entries:recent.map(id=>index.find(e=>e.id===id)).filter((e):e is Entry=>!!e)},
    {title:`اقتراحات لمستوى ${userLevel}`,entries:[...index.filter(e=>e.group==='قواعد الإنجليزية'&&e.level===userLevel).slice(0,2),...index.filter(e=>e.group==='كلمات وأمثلة'&&e.level===userLevel).slice(0,2)]},
    {title:'استكشف الأكاديميات',entries:ACADEMIES},
  ].filter(g=>g.entries.length);
  return <div role="dialog" aria-modal="true" aria-label="البحث في الأكاديمية" dir="rtl" className="fixed inset-0 z-[100] flex items-start justify-center pt-10 sm:pt-20 px-3 bg-black/80 backdrop-blur-md" onClick={onClose}>
    <div className="w-full max-w-2xl rounded-3xl border border-white/20 bg-[#171632] shadow-2xl overflow-hidden flex flex-col max-h-[85dvh]" onClick={e=>e.stopPropagation()}>
      <div className="p-4 border-b border-white/10 flex items-center gap-2 bg-[#0c0b20]"><Search className="w-5 h-5 text-[#41e7ff] shrink-0"/><input aria-label="ابحث في الأكاديمية" dir="auto" value={query} onChange={e=>setQuery(e.target.value)} placeholder="ابحث عن درس، كلمة، أو مهارة..." className="no-focus-ring min-w-0 w-full bg-transparent text-white placeholder-[#b9b6d5] text-sm focus:outline-none" autoFocus/>{query&&<button aria-label="مسح البحث" onClick={()=>setQuery('')} className="p-1 text-[#b9b6d5]"><X className="w-4 h-4"/></button>}<button onClick={onClose} aria-label="إغلاق البحث" className="shrink-0 rounded-lg bg-white/10 p-2 text-xs text-[#dedbf4]">ESC</button></div>
      <div className="p-4 overflow-y-auto space-y-5">{groups.map(g=><section key={g.title}><h2 className="flex items-center gap-2 text-xs font-bold text-[#ffd166] mb-3">{g.title==='كمل من آخر زيارة'?<Clock className="w-4 h-4"/>:<Compass className="w-4 h-4"/>}{g.title}</h2><div className={g.title==='استكشف الأكاديميات'?'grid grid-cols-2 gap-2':'space-y-2'}>{g.entries.map(e=><button key={e.id} onClick={()=>select(e)} className="w-full min-w-0 text-right rounded-2xl border border-white/10 bg-white/5 hover:border-[#41e7ff]/40 p-3 flex justify-between items-center gap-2"><div className="min-w-0"><p dir="auto" className="text-sm font-bold text-white break-words">{e.title}</p><p dir="auto" className="text-xs text-[#b9b6d5] mt-1 leading-6 break-words">{e.subtitle}{e.level?` · ${e.level}`:''}</p></div><ArrowRight className="w-3.5 h-3.5 shrink-0 text-[#41e7ff] rotate-180"/></button>)}</div></section>)}{q&&groups.length===0&&<div role="status" className="py-8 text-center text-[#b9b6d5]"><p>مفيش نتيجة مطابقة لـ "{query}"</p><p className="text-xs mt-2">جرّب كلمة أو مهارة: سفر، استماع، present simple، food</p></div>}</div>
    </div>
  </div>;
};
