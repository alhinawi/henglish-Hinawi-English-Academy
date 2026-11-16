import React, { useId, useState } from 'react';
import { Award, ArrowLeft, LockKeyhole, RefreshCw, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import type { AchievementBadge, PageRoute } from '../types';
import { useBadges } from '../utils/useBadges';

export function BadgeMedal({tier='bronze',unlocked=false,category='account'}:{tier?:AchievementBadge['tier'];unlocked?:boolean;category?:string}) {
 const id=useId().replace(/:/g,'');
 const colors={bronze:['#f7d3ac','#a56538'],silver:['#f3f6ff','#8d9bb5'],gold:['#fff0b2','#c18a24'],diamond:['#e3fcff','#6dcbd8']}[tier];
 return <svg viewBox="0 0 100 112" className="w-20 h-24 mx-auto" aria-hidden="true" style={{filter:unlocked?'drop-shadow(0 5px 12px #e0ae3d30)':'saturate(.35)',opacity:unlocked?1:.65}}>
  <defs><linearGradient id={id} x2="1" y2="1"><stop stopColor={colors[0]}/><stop offset=".48" stopColor={colors[1]}/><stop offset="1" stopColor={colors[0]}/></linearGradient></defs>
  <path d="M25 3h20l10 33-19 8zM55 3h20L64 44l-19-8z" fill="#31365b" stroke={colors[1]} strokeWidth="2"/>
  <path d="M50 24 61 29 73 28 80 39 91 46 89 59 94 70 84 79 80 92 66 94 56 103 44 98 31 101 24 90 12 85 13 71 6 60 15 50 19 37 33 35z" fill={`url(#${id})`} stroke={colors[0]} strokeWidth="1.5"/>
  <circle cx="50" cy="64" r="28" fill="#17172e" stroke={colors[0]} strokeWidth="2"/><circle cx="50" cy="64" r="23" fill="none" stroke={colors[1]} strokeWidth=".7"/>
  <g transform="translate(35 49) scale(1.25)" fill="none" stroke={colors[0]} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
   <path d={{account:'M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8M4 22v-3a8 8 0 0 1 16 0v3',streak:'M13 2c1 6-6 7-6 12a5 5 0 0 0 10 0c0-3-1-5-4-7 1 4-3 5-3 7',xp:'m13 2-9 12h7l-1 8 10-13h-8z',levels:'M3 20h6v-6h6V8h6V2M2 22h20',lessons:'M12 5Q5 1 2 5v15q5-3 10 0 5-3 10 0V5q-5-4-10 0v15',mastery:'m5 12 5 5L21 5M20 14v6H3V3h11',academies:'m2 7 10-5 10 5-10 5zM6 10v7q6 4 12 0v-7M22 7v10',vocabulary:'M3 3h18v18H3zM7 16l5-9 5 9M9 13h6',games:'M6 6h12l4 12-4 2-4-4h-4l-4 4-4-2zM6 10v4M4 12h4M16 11h1M18 14h1',certificates:'M4 2h16v15H4zM8 6h8M8 10h6M10 17l-2 5 4-2 4 2-2-5',community:'M8 3a3 3 0 1 0 0 6 3 3 0 0 0 0-6M17 5a2 2 0 1 0 0 4M2 20v-4a6 6 0 0 1 12 0v4M17 12q5 0 5 5v3'}[category]??'m12 2 3 7 7 1-5 5 1 7-6-4-6 4 1-7-5-5 7-1z'}/>
  </g>
  <path d="M21 65q0 24 20 27M79 65q0 24-20 27" fill="none" stroke={colors[0]} strokeWidth="2" strokeDasharray="3 3"/>
 </svg>;
}
function BadgeCard({badge:b}:{badge:AchievementBadge}) {
 const {t}=useLanguage();
 return <article className={`rounded-2xl border p-3 text-center ${b.unlocked?'border-[#d8b05e]/50 bg-linear-to-b from-[#a47829]/15 to-[#17162e]':'border-white/10 bg-[#18172c]'}`}>
  <BadgeMedal tier={b.tier} unlocked={b.unlocked} category={b.category}/>
  <div className="text-[10px] uppercase tracking-wider text-[#dbc28b] mb-1">{t('badges.tier.'+b.tier)}</div>
  <h3 className={`text-sm font-bold ${b.unlocked?'text-white':'text-[#b4b2c7]'}`}>{b.title}</h3>
  <p className="text-[11px] leading-relaxed text-[#a9a6c4] mt-2 min-h-12">{b.description}</p>
  <div className="mt-3 flex justify-center items-center gap-1 text-[10px] text-[#d6c293]">{b.unlocked?<ShieldCheck size={12}/>:<LockKeyhole size={12}/>} {t(b.unlocked?'badges.earned':'badges.locked')}</div>
  <div role="progressbar" aria-label={b.title} aria-valuenow={b.current??0} aria-valuemin={0} aria-valuemax={b.target??1} className="h-1 rounded-full bg-white/10 mt-3 overflow-hidden"><div className="bg-[#e8bd65] h-full" style={{width:`${b.progressPercentage??0}%`}}/></div>
  <p className="text-[10px] text-[#aaa7bd] mt-1" dir="ltr">{b.current??0} / {b.target??1}</p>
  {b.available===false&&<p className="text-[10px] leading-relaxed text-[#8d8aa6] mt-2">{t('badges.unavailable')}</p>}
 </article>;
}
export function BadgeCollection({badges,compact=false,onNavigate}:{badges:AchievementBadge[];compact?:boolean;onNavigate?:(route:PageRoute)=>void}) {
 const {t}=useLanguage();const [filter,setFilter]=useState('all');
 const categories=[...new Set(badges.map(b=>b.category??'account'))];
 return <section className="rounded-3xl bg-linear-to-br from-[#22203d] to-[#141329] border border-[#b9934c]/20 p-4 sm:p-7 space-y-5">
  <header className="flex flex-col sm:flex-row items-start justify-between gap-3"><div><Award className="text-[#e8bd65] mb-2" size={24}/><h2 className="text-xl font-black text-white">{t('badges.title')}</h2><p className="text-xs text-[#aaa7c2] mt-2 leading-relaxed">{t('badges.verified')}</p></div>{compact&&onNavigate&&<button onClick={()=>onNavigate('badges')} className="shrink-0 text-xs text-[#e8bd65] min-h-11">{t('badges.viewAll')} ({badges.length})</button>}</header>
  {!compact&&<div className="flex gap-2 overflow-x-auto pb-2 max-w-full">{['all',...categories].map(c=><button key={c} onClick={()=>setFilter(c)} aria-pressed={filter===c} className={`shrink-0 rounded-xl px-3 min-h-11 text-xs ${filter===c?'bg-[#d6ae5c] text-[#17152b]':'bg-white/5 text-[#c5c1da]'}`}>{t(c==='all'?'badges.all':'badges.category.'+c)}</button>)}</div>}
  {compact?<div className="grid grid-cols-2 sm:grid-cols-3 gap-3">{[...badges].sort((a,b)=>Number(b.unlocked)-Number(a.unlocked)).slice(0,6).map(b=><BadgeCard key={b.id} badge={b}/>)}</div>:categories.filter(c=>filter==='all'||filter===c).map(c=><section key={c} className="space-y-3"><h3 className="text-base text-[#e8cb90] font-bold pt-2">{t('badges.category.'+c)}</h3><div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">{badges.filter(b=>b.category===c).map(b=><BadgeCard key={b.id} badge={b}/>)}</div></section>)}
 </section>;
}
export function BadgesPage({onNavigate}:{onNavigate:(route:PageRoute)=>void}) {
 const {badges,status,refresh}=useBadges();const {t}=useLanguage();
 return <main className="max-w-6xl mx-auto space-y-5 pb-12"><div className="flex justify-between gap-3"><button onClick={()=>onNavigate('dashboard')} className="text-[#d9c18b] flex items-center gap-2 min-h-11"><ArrowLeft size={18}/>{t('badges.back')}</button><button onClick={()=>void refresh()} className="text-xs text-[#c3bddb] flex gap-2 items-center min-h-11"><RefreshCw size={15}/>{t('badges.refresh')}</button></div><p role="status" className="text-sm text-[#bdb7d4]">{status==='ready'?`${badges.filter(b=>b.unlocked).length} / ${badges.length} ${t('badges.earned')}`:t('badges.'+status)}</p><BadgeCollection badges={badges}/></main>;
}
