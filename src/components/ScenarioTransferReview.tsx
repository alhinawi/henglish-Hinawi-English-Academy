import React,{useState} from 'react';
import {useLanguage} from '../i18n/LanguageContext';

// Private reflection, not an assessment or a completion requirement.
export function ScenarioTransferReview({scenarioId}:{scenarioId:string}) {
 const {t}=useLanguage();const [checks,setChecks]=useState([false,false,false]);const [target,setTarget]=useState('');
 return <details className="rounded-2xl border border-pink-200/25 bg-[#0c0b20] p-4 text-start">
  <summary className="min-h-11 cursor-pointer text-sm font-bold leading-7 text-pink-100">{t('rle.transferReview.title')}</summary>
  <div className="mt-4 space-y-4"><p className="text-xs leading-7 text-slate-300">{t('rle.transferReview.note')}</p>
   {[0,1,2].map(index=><label key={index} className="flex items-start gap-3 rounded-xl border border-white/10 p-3 text-sm leading-7 text-white"><input type="checkbox" checked={checks[index]} onChange={event=>setChecks(value=>value.map((checked,i)=>i===index?event.target.checked:checked))} className="mt-2 h-5 w-5 shrink-0 accent-pink-200"/>{t(`rle.transferReview.${scenarioId}.${index}`)}</label>)}
   <label htmlFor="scenario-transfer-target" className="block text-sm font-bold text-cyan-100">{t('rle.transferReview.target')}</label><textarea id="scenario-transfer-target" dir="auto" rows={2} maxLength={300} aria-describedby="scenario-transfer-target-note" value={target} onChange={event=>setTarget(event.target.value)} className="w-full rounded-xl border border-white/20 bg-[#12152b] p-3 text-base leading-8 text-white focus:outline-none focus:ring-2 focus:ring-pink-200"/>
   <p id="scenario-transfer-target-note" className="text-xs leading-7 text-slate-400">{t('rle.transferReview.next')}</p>
  </div>
 </details>;
}
