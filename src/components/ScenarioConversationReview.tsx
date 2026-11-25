import { LessonSpeechButton } from './LessonSpeechButton';
import React, { useState } from 'react';
import type { DialogueOption, SimulationScenario } from '../data/realLifeSimulationsData';
import { useLanguage } from '../i18n/LanguageContext';

export const ScenarioConversationReview: React.FC<{scenario:SimulationScenario; choices:Record<string,DialogueOption>; meaning:(text:string)=>string}> = ({scenario,choices,meaning}) => {
 const {t,dir}=useLanguage();
 const [opened,setOpened]=useState<string|null>(null);
 const [revisions,setRevisions]=useState<Record<string,string>>({});
 return <section aria-label={t('rle.review.title')} className="rounded-2xl border-0 border-cyan-200/20 bg-transparent p-0 sm:border sm:bg-[#0c0b20] sm:p-4 text-start space-y-4" dir={dir}>
  <h3 className="text-xl font-black text-cyan-100">{t('rle.review.title')}</h3>
  <p className="text-sm leading-7 text-slate-300">{t('rle.review.note')}</p>
  {scenario.turns.map((turn,index)=>{
   const chosen=choices[turn.id];const model=turn.options.find(option=>option.isOptimal);
   return <div key={turn.id} className="rounded-xl border-0 sm:border border-white/15 p-0 sm:p-4 space-y-3">
    <button type="button" aria-expanded={opened===turn.id} aria-controls={`review-${turn.id}`} onClick={()=>setOpened(value=>value===turn.id?null:turn.id)} className="min-h-11 w-full text-start text-sm font-bold text-cyan-100">{t('rle.review.turn').replace('{number}',String(index+1))} · {turn.speaker}</button>
    {opened===turn.id&&<div id={`review-${turn.id}`} className="space-y-4">
     <div><h4 className="text-xs text-slate-400">{t('rle.review.prompt')}</h4><p dir="ltr" lang="en" className="text-left text-sm leading-7 text-white">{turn.textEn}</p><LessonSpeechButton key={`review-audio:${turn.textEn}`} text={turn.textEn} label={t('rle.review.listen.prompt')} className="min-h-11 rounded-xl border border-cyan-200/30 px-3 text-xs font-bold text-cyan-100"/></div>
     {chosen&&<div className="rounded-xl border border-white/15 p-2 sm:p-3 space-y-2"><h4 className="text-xs font-bold text-cyan-100">{t('rle.review.chosen')}</h4><p dir="ltr" lang="en" className="text-left text-sm leading-7 text-white">{chosen.textEn}</p><LessonSpeechButton key={`review-audio:${chosen.textEn}`} text={chosen.textEn} label={t('rle.review.listen.chosen')} className="min-h-11 rounded-xl border border-cyan-200/30 px-3 text-xs font-bold text-cyan-100"/><p className="text-xs leading-7 text-slate-300">{meaning(chosen.feedbackAr)}</p></div>}
     {chosen&&!chosen.isOptimal&&model&&<div className="rounded-xl border border-emerald-200/20 p-2 sm:p-3 space-y-2"><h4 className="text-xs font-bold text-emerald-200">{t('rle.review.model')}</h4><p dir="ltr" lang="en" className="text-left text-sm leading-7 text-white">{model.textEn}</p><LessonSpeechButton key={`review-audio:${model.textEn}`} text={model.textEn} label={t('rle.review.listen.model')} className="min-h-11 rounded-xl border border-cyan-200/30 px-3 text-xs font-bold text-cyan-100"/><p className="text-xs leading-7 text-slate-300">{meaning(model.feedbackAr)}</p></div>}
     <div className="rounded-xl border border-cyan-200/20 border-0 p-0 sm:border sm:p-3 space-y-3"><label htmlFor={`review-rewrite-${turn.id}`} className="block text-sm font-bold text-cyan-100">{t('rle.review.rewrite')}</label><p id={`review-rewrite-note-${turn.id}`} className="text-xs leading-7 text-slate-300">{t('rle.review.rewriteNote')}</p><textarea id={`review-rewrite-${turn.id}`} aria-describedby={`review-rewrite-note-${turn.id}`} dir="ltr" lang="en" rows={3} maxLength={500} value={revisions[turn.id] || ''} onChange={event=>setRevisions(value=>({...value,[turn.id]:event.target.value}))} className="w-full rounded-xl border border-white/20 bg-[#12152b] px-2 py-3 sm:px-3 text-base leading-8 text-white focus:outline-none focus:ring-2 focus:ring-cyan-200"/><p className="text-xs leading-7 text-slate-400">{t('rle.review.rewritePrivacy')}</p></div>
    </div>}
   </div>;
  })}
 </section>;
};
