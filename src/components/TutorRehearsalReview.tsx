import React,{useState} from 'react';
import {useLanguage} from '../i18n/LanguageContext';
import {TUTOR_REHEARSAL_CHECKS} from '../data/tutorRehearsalChecks';
export function TutorRehearsalReview({mode}:{mode:string}){
 const {t}=useLanguage();const [checks,setChecks]=useState([false,false]);
 return <details className="rounded-xl border border-cyan-200/25 p-3 text-start"><summary className="min-h-11 cursor-pointer text-sm font-bold leading-7 text-cyan-100">{t('at.rehearsalReview.title')}</summary><div className="mt-3 space-y-3"><p className="text-xs leading-7 text-slate-300">{t('at.rehearsalReview.note')}</p>{TUTOR_REHEARSAL_CHECKS[mode]?.map((criterion,index)=><label key={criterion} className="flex min-h-11 items-start gap-3 rounded-xl border border-white/15 p-3"><input type="checkbox" checked={checks[index]} onChange={event=>setChecks(value=>value.map((checked,i)=>i===index?event.target.checked:checked))} className="mt-2 h-5 w-5 shrink-0 accent-cyan-200"/><span lang="en" dir="ltr" className="text-left text-sm leading-7 text-white">{criterion}</span></label>)}<button type="button" disabled={!checks.some(Boolean)} onClick={()=>setChecks([false,false])} className="min-h-11 rounded-xl border border-cyan-200/30 px-3 py-2 text-sm font-bold text-cyan-100 disabled:opacity-40">{t('at.rehearsalReview.clear')}</button></div></details>;
}
