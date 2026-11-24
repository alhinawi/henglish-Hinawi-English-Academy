import {MoviePrivateRetelling} from './MoviePrivateRetelling';
import {MovieOwnWordsReview} from './MovieOwnWordsReview';
import React, { useState } from 'react';
import { Mic } from 'lucide-react';
import { SpeakingRecorder } from './SpeakingPracticeStudio';
import type { TimedSubtitle } from '../data/movieScenesData';
import { useLanguage } from '../i18n/LanguageContext';

/** Uses only reviewed cues supplied by the player, never generated dialogue. */
export function MovieCueSpeaking({ cues, onPause }: { cues: TimedSubtitle[]; onPause: () => void }) {
  const { t, dir } = useLanguage();
  const [open, setOpen] = useState(false);
  const [mode,setMode]=useState<'echo'|'own'>('echo');
  const [plan,setPlan]=useState('');
  const [sourceHidden,setSourceHidden]=useState(false);
  const [selectedId, setSelectedId] = useState(cues[0]?.id || '');
  const cue = cues.find(item => item.id === selectedId) || cues[0];
  if (!cue) return null;
  return <section dir={dir} aria-label={t('ms.echoTitle')} className="mt-6 space-y-4 rounded-3xl border border-cyan-200/20 bg-[#11182a] p-2 text-start sm:p-7">
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div className="space-y-2"><h3 className="flex items-center gap-2 text-lg font-black text-cyan-100"><Mic size={20} aria-hidden="true"/>{t('ms.echoTitle')}</h3><p className="max-w-xl text-xs leading-7 text-slate-300">{t('ms.echoIntro')}</p></div>
      <button type="button" aria-expanded={open} onClick={() => { onPause(); setOpen(value => !value); setMode('echo'); setPlan(''); setSourceHidden(false); }} className="min-h-11 rounded-xl border border-cyan-200/30 px-4 text-sm font-bold text-cyan-200">{t(open ? 'ms.echoClose' : 'ms.echoOpen')}</button>
    </div>
    {open && <div className="space-y-4" onClickCapture={onPause}>
      <label className="block space-y-2 text-xs font-bold text-slate-300"><span>{t('ms.echoChoose')}</span><select aria-label={t('ms.echoChoose')} value={cue.id} onChange={event => { onPause(); setSelectedId(event.target.value); setMode('echo'); setPlan(''); setSourceHidden(false); }} className="min-h-12 w-full min-w-0 rounded-xl border border-white/20 bg-[#151329] p-3 text-sm text-white" dir="ltr">{cues.map((item, index) => <option key={item.id} value={item.id}>{index + 1}. {mode==='own'&&sourceHidden?t('ms.own.sourceCue'):item.en}</option>)}</select></label>
      <p className="text-xs leading-7 text-slate-300">{t('ms.echoSteps')}</p>
      <div role="group" aria-label={t('ms.own.choose')} className="flex flex-wrap gap-3">{(['echo','own'] as const).map(value=><button type="button" key={value} aria-pressed={mode===value} onClick={()=>{ onPause(); setMode(value); setPlan(''); setSourceHidden(false); }} className={`min-h-11 rounded-xl border px-4 text-sm font-bold ${mode===value?'border-cyan-200 bg-cyan-200/15 text-cyan-100':'border-white/20 text-slate-200'}`}>{t(`ms.own.${value}`)}</button>)}</div>
      {mode==='own'&&<div className="space-y-3 rounded-2xl border border-amber-200/25 p-2 sm:p-4"><h4 className="text-base font-bold text-amber-100">{t('ms.own.title')}</h4><p className="text-sm leading-8 text-slate-200">{t('ms.own.task')}</p><div className="space-y-3 rounded-xl border border-white/10 p-2 sm:p-3"><button type="button" aria-pressed={sourceHidden} onClick={()=>{onPause();setSourceHidden(value=>!value);}} className="min-h-11 rounded-xl border border-amber-200/30 px-4 py-2 text-sm font-bold text-amber-100">{t(sourceHidden?'ms.own.sourceShow':'ms.own.sourceHide')}</button><p role="status" className="text-xs leading-7 text-slate-300">{t(sourceHidden?'ms.own.sourceHidden':'ms.own.sourceVisible')}</p>{!sourceHidden&&<p dir="ltr" lang="en" className="text-sm leading-8 text-white">{cue.en}</p>}</div><label htmlFor="movie-own-plan" className="block text-sm font-bold text-cyan-100">{t('ms.own.plan')}</label><textarea id="movie-own-plan" aria-describedby="movie-own-note" rows={3} maxLength={1500} dir="auto" value={plan} onChange={event=>setPlan(event.target.value)} className="w-full rounded-xl border border-white/20 bg-[#0c0b20] p-4 text-base leading-8 text-white focus:outline-none focus:ring-2 focus:ring-cyan-200"/><p id="movie-own-note" className="text-xs leading-7 text-slate-400">{t('ms.own.note')}</p></div>}
      {cue.arEg.trim()&&!(mode==='own'&&sourceHidden)&&<details key={`speaking-meaning:${cue.id}:${mode}:${sourceHidden}`} className="rounded-xl border border-cyan-200/20 border-0 p-0 sm:border sm:p-4 text-start"><summary className="min-h-11 cursor-pointer text-sm font-bold leading-7 text-cyan-100">{t('ms.speakingMeaning.title')}</summary><p className="text-xs leading-7 text-slate-400">{t('ms.speakingMeaning.note')}</p><p lang="ar" dir="rtl" className="text-right text-base leading-8 text-white">{cue.arEg}</p></details>}
      {mode==='own'&&<MoviePrivateRetelling key={`retelling:${cue.id}`}/>}
      <SpeakingRecorder key={`${cue.id}:${mode}`} prompt={mode==='echo'?cue.en:t('ms.own.record')}/>

      {mode==='own'&&<MovieOwnWordsReview key={cue.id}/>}
      <p className="text-xs leading-7 text-slate-400">{t('ms.echoNote')}</p>
    </div>}
  </section>;
}
