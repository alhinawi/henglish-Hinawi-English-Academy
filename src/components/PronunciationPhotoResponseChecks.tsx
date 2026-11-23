import React,{useState} from 'react';
import {useLanguage} from '../i18n/LanguageContext';
import {PRONUNCIATION_PHOTO_RESPONSE_CHECKS} from '../data/pronunciationPhotoResponseChecks';

export function PronunciationPhotoResponseChecks({sceneId}:{sceneId:string}){
 const {t}=useLanguage();const [checks,setChecks]=useState([false,false]);
 return <details className="rounded-xl border border-cyan-200/25 p-3 text-start"><summary className="min-h-11 cursor-pointer text-sm font-bold leading-7 text-cyan-100">{t('pa.responseChecks.title')}</summary><div className="mt-3 space-y-3"><p className="text-xs leading-7 text-slate-300">{t('pa.responseChecks.note')}</p>{PRONUNCIATION_PHOTO_RESPONSE_CHECKS[sceneId]?.map((criterion,index)=><label key={criterion} className="flex min-h-11 items-start gap-3 rounded-xl border border-white/15 p-3"><input type="checkbox" checked={checks[index]} onChange={event=>setChecks(value=>value.map((checked,i)=>i===index?event.target.checked:checked))} className="mt-2 h-5 w-5 shrink-0 accent-cyan-200"/><span lang="en" dir="ltr" className="text-left text-sm leading-7 text-white">{criterion}</span></label>)}<button type="button" disabled={!checks.some(Boolean)} onClick={()=>setChecks([false,false])} className="min-h-11 rounded-xl border border-cyan-200/30 px-3 py-2 text-sm font-bold text-cyan-100 disabled:opacity-40">{t('pa.responseChecks.clear')}</button></div></details>;
}
