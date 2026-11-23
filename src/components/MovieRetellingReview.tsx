import React,{useState} from 'react';
import {useLanguage} from '../i18n/LanguageContext';

export function MovieRetellingReview(){
 const {t}=useLanguage();const [checks,setChecks]=useState([false,false,false]);
 return <details className="rounded-xl border border-amber-200/25 p-3 text-start"><summary className="min-h-11 cursor-pointer text-sm font-bold leading-7 text-amber-100">{t('ms.retellingReview.title')}</summary><div className="mt-3 space-y-3"><p className="text-xs leading-7 text-slate-300">{t('ms.retellingReview.note')}</p>{[0,1,2].map(index=><label key={index} className="flex min-h-11 items-start gap-3 rounded-xl border border-white/15 p-3"><input type="checkbox" checked={checks[index]} onChange={event=>setChecks(value=>value.map((checked,i)=>i===index?event.target.checked:checked))} className="mt-2 h-5 w-5 shrink-0 accent-amber-200"/><span className="text-sm leading-7 text-white">{t(`ms.retellingReview.check.${index}`)}</span></label>)}<button type="button" disabled={!checks.some(Boolean)} onClick={()=>setChecks([false,false,false])} className="min-h-11 rounded-xl border border-amber-200/30 px-3 py-2 text-sm font-bold text-amber-100 disabled:opacity-40">{t('ms.retellingReview.clear')}</button></div></details>;
}
