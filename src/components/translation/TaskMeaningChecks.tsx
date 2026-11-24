import {TRANSLATION_MEANING_CHECKS_AR} from '../../data/translationMeaningChecksAr';
import React,{useState} from 'react';
import {TRANSLATION_MEANING_CHECKS} from '../../data/translationMeaningChecks';
import {useLanguage} from '../../i18n/LanguageContext';

export function TaskMeaningChecks({taskId}:{taskId:string}){
 const {t}=useLanguage();const [checks,setChecks]=useState([false,false]);
 return <details className="rounded-xl border border-amber-200/25 p-4 text-start"><summary className="min-h-11 cursor-pointer text-sm font-bold leading-7 text-amber-100">{t('tpr.meaningChecks.title')}</summary><div className="mt-3 space-y-3"><p className="text-xs leading-7 text-slate-300">{t('tpr.meaningChecks.note')}</p>{TRANSLATION_MEANING_CHECKS[taskId]?.map((criterion,i)=><div key={criterion} className="space-y-2"><label className="flex min-h-11 items-start gap-3 rounded-xl border border-white/15 p-3"><input type="checkbox" checked={checks[i]} onChange={event=>setChecks(value=>value.map((checked,n)=>n===i?event.target.checked:checked))} className="mt-2 h-5 w-5 shrink-0 accent-amber-200"/><span lang="en" dir="ltr" className="text-left text-sm leading-7 text-white">{criterion}</span></label><details className="rounded-xl border border-cyan-200/20 p-3"><summary className="min-h-11 cursor-pointer text-xs font-bold leading-7 text-cyan-100">{t('tpr.meaningChecksArabic.title')}</summary><p className="mt-2 text-xs leading-7 text-slate-400">{t('tpr.meaningChecksArabic.note')}</p><p lang="ar" dir="rtl" className="mt-2 text-right text-base leading-8 text-white">{TRANSLATION_MEANING_CHECKS_AR[taskId]?.[i]}</p></details></div>)}</div></details>;
}
