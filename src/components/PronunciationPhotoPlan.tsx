import React,{useState} from 'react';
import {useLanguage} from '../i18n/LanguageContext';

export function PronunciationPhotoPlan(){
 const {t}=useLanguage();const [draft,setDraft]=useState('');
 return <details className="rounded-2xl border border-cyan-200/25 p-4 text-start"><summary className="min-h-11 cursor-pointer text-sm font-bold leading-7 text-cyan-100">{t('pa.photoPlan.title')}</summary><div className="mt-4 space-y-3"><p id="pronunciation-photo-plan-note" className="text-xs leading-7 text-slate-300">{t('pa.photoPlan.note')}</p><label htmlFor="pronunciation-photo-plan" className="block text-sm font-bold text-pink-100">{t('pa.photoPlan.label')}</label><textarea id="pronunciation-photo-plan" aria-describedby="pronunciation-photo-plan-note" lang="en" dir="ltr" rows={3} maxLength={500} value={draft} onChange={event=>setDraft(event.target.value)} className="w-full rounded-xl border border-white/20 bg-[#0c0b20] p-3 text-base leading-8 text-white focus:outline-none focus:ring-2 focus:ring-cyan-200"/><button type="button" disabled={!draft} onClick={()=>setDraft('')} className="min-h-11 rounded-xl border border-cyan-200/30 px-4 text-sm font-bold text-cyan-100 disabled:opacity-50">{t('pa.photoPlan.clear')}</button><p className="text-xs leading-7 text-slate-400">{t('pa.photoPlan.next')}</p></div></details>;
}
