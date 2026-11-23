import React,{useId,useState} from 'react';
import {useLanguage} from '../i18n/LanguageContext';

export function ScenarioVariationAttempt(){
 const {t}=useLanguage();const id=useId();const [draft,setDraft]=useState('');
 return <details className="mt-3 rounded-xl border border-amber-200/25 p-3 text-start"><summary className="min-h-11 cursor-pointer text-sm font-bold leading-7 text-amber-100">{t('rle.variationAttempt.title')}</summary><div className="mt-3 space-y-3"><label htmlFor={id} className="block text-sm font-bold text-cyan-100">{t('rle.variationAttempt.label')}</label><textarea id={id} aria-describedby={`${id}-note`} lang="en" dir="ltr" rows={3} maxLength={700} value={draft} onChange={event=>setDraft(event.target.value)} className="w-full rounded-xl border border-white/20 bg-[#0c0b20] p-3 text-base leading-8 text-white focus:outline-none focus:ring-2 focus:ring-amber-200"/><button type="button" disabled={!draft} onClick={()=>setDraft('')} className="min-h-11 rounded-xl border border-amber-200/30 px-3 py-2 text-xs font-bold text-amber-100 disabled:opacity-40">{t('rle.variationAttempt.clear')}</button><p id={`${id}-note`} className="text-xs leading-7 text-slate-400">{t('rle.variationAttempt.note')}</p></div></details>;
}
