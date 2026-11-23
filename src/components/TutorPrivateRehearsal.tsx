import React,{useId,useState} from 'react';
import {useLanguage} from '../i18n/LanguageContext';

// Independent local preparation. It never enters the message composer.
export function TutorPrivateRehearsal(){
 const {t}=useLanguage();const id=useId();const [draft,setDraft]=useState('');
 return <details className="rounded-xl border border-amber-200/25 p-3 text-start"><summary className="min-h-11 cursor-pointer text-sm font-bold leading-7 text-amber-100">{t('at.privateRehearsal.title')}</summary><div className="mt-3 space-y-3"><p className="text-xs leading-7 text-slate-300">{t('at.privateRehearsal.note')}</p><label htmlFor={id} className="block text-sm font-bold text-cyan-100">{t('at.privateRehearsal.label')}</label><textarea id={id} aria-describedby={`${id}-privacy`} lang="en" dir="ltr" rows={3} maxLength={700} value={draft} onChange={event=>setDraft(event.target.value)} className="w-full rounded-xl border border-white/20 bg-[#0c0b20] p-3 text-base leading-8 text-white focus:outline-none focus:ring-2 focus:ring-amber-200"/><button type="button" disabled={!draft} onClick={()=>{setDraft('');document.getElementById(id)?.focus();}} className="min-h-11 rounded-xl border border-amber-200/30 px-3 py-2 text-sm font-bold text-amber-100 disabled:opacity-40">{t('at.privateRehearsal.clear')}</button><p id={`${id}-privacy`} className="text-xs leading-7 text-slate-400">{t('at.privateRehearsal.privacy')}</p></div></details>;
}
