import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, Mic, Search, BookOpen, ArrowUpLeft } from 'lucide-react';
import { PageRoute } from '../types';
import { SPEAKING_LESSONS, type SpeakingLevel } from '../data/speakingAcademyData';
import { txText, useAppTextMap } from '../services/contentI18nService';
import { SpeakingPracticeStudio } from '../components/SpeakingPracticeStudio';
import { SpeakingLegacyPractice } from '../components/SpeakingLegacyPractice';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../i18n/LanguageContext';

interface SpeakingAcademyPageProps {
  onNavigate: (route: PageRoute) => void;
  onCompleteActivity?: (id: string, score: number, total: number) => void;
  completedActivityIds?: string[];
}
const levels: (SpeakingLevel | 'all')[] = ['all', 'A1', 'A2', 'B1', 'B2'];
const labels: Record<SpeakingLevel, string> = { A1: 'sa.levelDesc.A1', A2: 'sa.levelDesc.A2', B1: 'sa.levelDesc.B1', B2: 'sa.levelDesc.B2' };

export const SpeakingAcademyPage: React.FC<SpeakingAcademyPageProps> = (props) => {
  const { user } = useAuth();
  const storageKey = `henglish-speaking-v1:${user?.id || 'local'}`;
  // Account changes must discard the previous learner's in-memory lesson,
  // recorder and completion state before the new storage key can be written.
  return <LearnerSpeakingAcademy key={storageKey} {...props} storageKey={storageKey} />;
};

const LearnerSpeakingAcademy: React.FC<SpeakingAcademyPageProps & { storageKey: string }> = ({ onNavigate, onCompleteActivity, completedActivityIds = [], storageKey }) => {
  const { t } = useLanguage();
  const [localDone, setDone] = useState<string[]>(() => {
    try { const saved: unknown = JSON.parse(localStorage.getItem(storageKey) || '[]'); return Array.isArray(saved) ? saved.filter((s): s is string => typeof s === 'string' && SPEAKING_LESSONS.some(l=>l.id===s)) : []; } catch { return []; }
  });
  const done = [...new Set([...localDone, ...SPEAKING_LESSONS.filter(l => completedActivityIds.includes(`speaking-${l.id}`)).map(l=>l.id)])];
  const [level, setLevel] = useState<SpeakingLevel | 'all'>('all');
  const [search, setSearch] = useState('');
  const [activeId, setActiveId] = useState<string | null>(null);
  const [saveError, setSaveError] = useState('');
  const active = SPEAKING_LESSONS.find(l => l.id === activeId);
  const appText = useAppTextMap('speakingAcademyData');
  const filtered = SPEAKING_LESSONS.filter(l => (level === 'all' || l.level === level) && `${l.title} ${l.titleEn} ${l.unit}`.toLowerCase().includes(search.toLowerCase()));
  const units = [...new Set(filtered.map(l=>l.unit))];
  function finish() {
    if (!active || done.includes(active.id)) return;
    const next = [...done, active.id];
    try {
      localStorage.setItem(storageKey, JSON.stringify(next));
      onCompleteActivity?.(`speaking-${active.id}`, 3, 3);
      setDone(next); setSaveError('');
    } catch { setSaveError(t('sa.saveError')); }
  }
  const open = (id: string | null) => { setActiveId(id); window.scrollTo({ top: 0, behavior: 'instant' }); };
  return <div className="space-y-7 pb-20 text-white text-right" dir="rtl">
    {active ? <>
      <button onClick={()=>open(null)} className="min-h-12 flex items-center gap-2 text-pink-200"><ArrowRight size={18}/>{t('sa.allUnits')}</button>
      <section className="rounded-3xl overflow-hidden border border-white/10 bg-[#13152b]">
        <img src={active.image} alt={active.imageAlt} className="w-full h-48 sm:h-72 object-cover"/>
        <div className="p-5 sm:p-8 space-y-3"><span className="text-xs font-bold text-pink-200">{active.level} · {active.unit}</span><h1 className="text-3xl font-black leading-snug">{active.title}</h1><p dir="ltr" className="text-right text-slate-300">{active.titleEn}</p><p className="text-sm text-slate-400 leading-7">{t('sa.stages')}</p></div>
      </section>
      <SpeakingPracticeStudio key={active.id} lesson={active} completed={done.includes(active.id)} onComplete={finish}/>
      {saveError && <p role="alert" className="text-amber-200">{saveError}</p>}
      <details className="rounded-2xl border border-white/10 p-5 text-sm text-slate-300 leading-8"><summary className="cursor-pointer font-bold text-white">{t('sa.about')}</summary><p>{t('sa.aboutP1')}</p><p>{t('sa.aboutP2')}</p><p>{t('sa.refs')}</p><a className="block underline text-cyan-200" href="https://learnenglish.britishcouncil.org/free-resources/speaking/a1/checking-understanding" target="_blank" rel="noreferrer">British Council: Checking understanding</a><a className="block underline text-cyan-200" href="https://learnenglish.britishcouncil.org/free-resources/speaking/b1/keeping-conversation-going" target="_blank" rel="noreferrer">British Council: Keeping a conversation going</a><a className="block underline text-cyan-200" href="https://learnenglish.britishcouncil.org/free-resources/speaking/b2/challenging-someones-ideas" target="_blank" rel="noreferrer">British Council: Challenging ideas</a></details>
      <button onClick={()=> {const next=SPEAKING_LESSONS[SPEAKING_LESSONS.indexOf(active)+1];open(next?.id || null);}} className="min-h-14 w-full rounded-2xl bg-pink-200 text-slate-950 font-bold">{SPEAKING_LESSONS.indexOf(active)<SPEAKING_LESSONS.length-1?t('sa.nextLesson'):t('sa.backToMap')}</button>
    </> : <>
      <section className="relative overflow-hidden rounded-[28px] border border-pink-200/20 bg-[#13152b]">
        <img src="/images/speaking/conversation-01.webp" alt={t('sa.heroAlt')} className="w-full h-52 sm:h-72 object-cover opacity-65"/>
        <div className="p-5 sm:p-9 space-y-5"><div className="inline-flex items-center gap-2 text-[11px] tracking-widest text-pink-200" dir="ltr"><Mic size={16}/>THE CONVERSATION CLUB</div><h1 className="text-3xl sm:text-5xl font-black leading-snug">{t('sa.heroTitleA')}<br/><span className="text-pink-200">{t('sa.heroTitleB')}</span></h1><p className="text-sm sm:text-base leading-8 text-slate-300 max-w-2xl">{t('sa.heroSub')}</p>
        <div className="grid grid-cols-3 gap-2">{[[String(new Set(SPEAKING_LESSONS.map(l=>l.unit)).size),t('sa.statUnits')],[String(SPEAKING_LESSONS.length),t('sa.statLessons')],[String(SPEAKING_LESSONS.length*3),t('sa.statActivities')]].map(([n,label])=><div key={label} className="rounded-2xl bg-white/5 border border-white/10 px-2 py-4 text-center"><strong className="block text-2xl text-pink-100">{n}</strong><span className="text-[10px] sm:text-xs text-slate-300">{label}</span></div>)}</div>
        <button onClick={()=>open(SPEAKING_LESSONS.find(l=>!done.includes(l.id))?.id || SPEAKING_LESSONS[0].id)} className="min-h-14 rounded-2xl px-5 bg-pink-200 text-slate-950 font-bold flex items-center gap-2">{done.length?t('sa.continue'):t('sa.startFirst')}<ArrowUpLeft size={18}/></button></div>
      </section>
      <section className="rounded-2xl border border-white/10 bg-white/5 p-5 space-y-3"><div className="flex items-center justify-between text-sm"><span>{t('sa.journey')}</span><span dir="ltr">{done.length} / {SPEAKING_LESSONS.length}</span></div><div className="h-2 rounded-full bg-white/10 overflow-hidden"><div className="h-full bg-pink-200 rounded-full" style={{width:`${done.length/SPEAKING_LESSONS.length*100}%`}}/></div><p className="text-xs text-slate-400 leading-6">{t('sa.progressNote')}</p></section>
      <div className="space-y-4"><label className="flex items-center gap-3 rounded-2xl border border-white/15 bg-[#13152b] px-4"><Search size={18} className="shrink-0 text-slate-400"/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder={t('sa.searchPh')} aria-label={t('sa.searchAria')} className="w-full bg-transparent py-4 outline-none text-sm"/></label><div className="grid grid-cols-5 gap-1.5">{levels.map(l=><button key={l} aria-pressed={l===level} onClick={()=>setLevel(l)} className={`min-h-12 rounded-xl text-sm font-bold border ${l===level?'bg-pink-200 text-slate-950 border-pink-200':'bg-white/5 border-white/10 text-slate-300'}`}>{l === 'all' ? t('sa.all') : l}</button>)}</div></div>
      {units.length===0 && <p className="p-6 rounded-2xl bg-white/5">{t('sa.noMatch')}</p>}
      {units.map((unit,i)=><section key={unit} className="space-y-4"><div className="flex gap-3 items-center"><span className="grid place-items-center w-11 h-11 rounded-xl border border-pink-200/20 text-pink-200 font-bold">{i+1}</span><div><p className="text-xs text-slate-400 mb-1">{filtered.find(l=>l.unit===unit)?.level} · {t(labels[filtered.find(l=>l.unit===unit)!.level])}</p><h2 className="text-xl font-black">{txText(appText, unit)}</h2></div></div><div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">{filtered.filter(l=>l.unit===unit).map(l=><button key={l.id} onClick={()=>open(l.id)} className="overflow-hidden rounded-3xl border border-white/10 bg-[#13152b] text-right group focus-visible:outline-2 focus-visible:outline-pink-200"><div className="relative"><img loading="lazy" src={l.image} alt={l.imageAlt} className="h-44 w-full object-cover"/><span className="absolute top-3 right-3 rounded-lg bg-slate-950/85 px-3 py-1 text-xs font-bold">{l.level}</span>{done.includes(l.id)&&<span className="absolute bottom-3 left-3 rounded-full bg-emerald-200 text-slate-950 p-1"><CheckCircle2 size={20}/></span>}</div><div className="p-5 space-y-2"><h3 className="font-bold text-lg">{txText(appText, l.title)}</h3><p dir="ltr" className="text-right text-xs text-slate-400">{l.titleEn}</p><div className="pt-3 flex justify-between text-xs text-pink-200"><span>{t('sa.cardMeta')}</span><ArrowUpLeft size={16}/></div></div></button>)}</div></section>)}
      <details className="rounded-3xl border border-white/10 p-5"><summary className="font-bold flex gap-2 items-center cursor-pointer"><BookOpen size={18}/>{t('sa.legacy')}</summary><p className="text-sm text-slate-400 leading-7 mt-3">{t('sa.legacySub')}</p><div className="mt-6"><SpeakingLegacyPractice onNavigate={onNavigate}/></div></details>
      <p className="text-xs text-slate-400 leading-7">{t('sa.levelsNote')}</p>
    </>}
  </div>;
};
