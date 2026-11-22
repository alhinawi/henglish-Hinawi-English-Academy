import React, { useState } from 'react';
import type { DialogueOption, SimulationScenario } from '../data/realLifeSimulationsData';
import { useLanguage } from '../i18n/LanguageContext';

export const ScenarioConversationReview: React.FC<{scenario:SimulationScenario; choices:Record<string,DialogueOption>; meaning:(text:string)=>string}> = ({scenario,choices,meaning}) => {
 const {t,dir}=useLanguage();
 const [opened,setOpened]=useState<string|null>(null);
 return <section aria-label={t('rle.review.title')} className="rounded-2xl border border-cyan-200/20 bg-[#0c0b20] p-4 text-start space-y-4" dir={dir}>
  <h3 className="text-xl font-black text-cyan-100">{t('rle.review.title')}</h3>
  <p className="text-sm leading-7 text-slate-300">{t('rle.review.note')}</p>
  {scenario.turns.map((turn,index)=>{
   const chosen=choices[turn.id];const model=turn.options.find(option=>option.isOptimal);
   return <div key={turn.id} className="rounded-xl border border-white/15 p-4 space-y-3">
    <button type="button" aria-expanded={opened===turn.id} aria-controls={`review-${turn.id}`} onClick={()=>setOpened(value=>value===turn.id?null:turn.id)} className="min-h-11 w-full text-start text-sm font-bold text-cyan-100">{t('rle.review.turn').replace('{number}',String(index+1))} · {turn.speaker}</button>
    {opened===turn.id&&<div id={`review-${turn.id}`} className="space-y-4">
     <div><h4 className="text-xs text-slate-400">{t('rle.review.prompt')}</h4><p dir="ltr" lang="en" className="text-left text-sm leading-7 text-white">{turn.textEn}</p></div>
     {chosen&&<div className="rounded-xl border border-white/15 p-3 space-y-2"><h4 className="text-xs font-bold text-cyan-100">{t('rle.review.chosen')}</h4><p dir="ltr" lang="en" className="text-left text-sm leading-7 text-white">{chosen.textEn}</p><p className="text-xs leading-7 text-slate-300">{meaning(chosen.feedbackAr)}</p></div>}
     {chosen&&!chosen.isOptimal&&model&&<div className="rounded-xl border border-emerald-200/20 p-3 space-y-2"><h4 className="text-xs font-bold text-emerald-200">{t('rle.review.model')}</h4><p dir="ltr" lang="en" className="text-left text-sm leading-7 text-white">{model.textEn}</p><p className="text-xs leading-7 text-slate-300">{meaning(model.feedbackAr)}</p></div>}
    </div>}
   </div>;
  })}
 </section>;
};
