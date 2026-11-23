import React,{useState} from 'react';
import {SCENARIO_VARIATION_CHECKS} from '../data/scenarioVariationChecks';
import {useLanguage} from '../i18n/LanguageContext';

export function ScenarioVariationReview({scenarioId,index}:{scenarioId:string;index:number}){
 const {t}=useLanguage();const [checks,setChecks]=useState([false,false]);
 return <details className="mt-3 rounded-xl border border-cyan-200/25 p-3 text-start"><summary className="min-h-11 cursor-pointer text-sm font-bold leading-7 text-cyan-100">{t('rle.variationReview.title')}</summary><div className="mt-3 space-y-3"><p className="text-xs leading-7 text-slate-400">{t('rle.variationReview.note')}</p>{SCENARIO_VARIATION_CHECKS[scenarioId]?.[index]?.map((criterion,i)=><label key={criterion} className="flex min-h-11 items-start gap-3 rounded-xl border border-white/15 p-3"><input type="checkbox" checked={checks[i]} onChange={event=>setChecks(value=>value.map((checked,n)=>n===i?event.target.checked:checked))} className="mt-2 h-5 w-5 shrink-0 accent-cyan-200"/><span lang="en" dir="ltr" className="text-left text-sm leading-7 text-white">{criterion}</span></label>)}</div></details>;
}
