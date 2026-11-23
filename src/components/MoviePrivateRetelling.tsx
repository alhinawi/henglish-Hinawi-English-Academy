import React,{useState} from 'react';
import {useLanguage} from '../i18n/LanguageContext';

// A private written attempt, separate from planning and audio. No model or grade.
export function MoviePrivateRetelling(){
 const {t}=useLanguage();const [draft,setDraft]=useState('');
 return <details className="rounded-2xl border border-cyan-200/25 p-4 text-start"><summary className="min-h-11 cursor-pointer text-sm font-bold leading-7 text-cyan-100">{t('ms.retelling.title')}</summary><div className="mt-4 space-y-3"><p id="movie-retelling-note" className="text-xs leading-7 text-slate-300">{t('ms.retelling.note')}</p><label htmlFor="movie-retelling-draft" className="block text-sm font-bold text-pink-100">{t('ms.retelling.label')}</label><textarea id="movie-retelling-draft" aria-describedby="movie-retelling-note movie-retelling-privacy" lang="en" dir="ltr" rows={4} maxLength={1500} value={draft} onChange={event=>setDraft(event.target.value)} className="w-full rounded-xl border border-white/20 bg-[#0c0b20] p-4 text-base leading-8 text-white focus:outline-none focus:ring-2 focus:ring-cyan-200"/><p id="movie-retelling-privacy" className="text-xs leading-7 text-slate-400">{t('ms.retelling.privacy')}</p></div></details>;
}
