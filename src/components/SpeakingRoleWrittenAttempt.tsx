import React,{useState} from 'react';
import {useLanguage} from '../i18n/LanguageContext';

// Private optional rehearsal, separate from the model and microphone.
export function SpeakingRoleWrittenAttempt(){
 const {t}=useLanguage();const [draft,setDraft]=useState('');
 return <details className="rounded-2xl border border-cyan-200/25 p-4 text-start"><summary className="min-h-11 cursor-pointer text-sm font-bold leading-7 text-cyan-100">{t('sp.roleDraft.title')}</summary><div className="mt-4 space-y-3"><p id="speaking-role-draft-note" className="text-xs leading-7 text-slate-300">{t('sp.roleDraft.note')}</p><label htmlFor="speaking-role-draft" className="block text-sm font-bold text-pink-100">{t('sp.roleDraft.label')}</label><textarea id="speaking-role-draft" aria-describedby="speaking-role-draft-note speaking-role-draft-privacy" lang="en" dir="ltr" rows={3} maxLength={500} value={draft} onChange={event=>setDraft(event.target.value)} className="w-full rounded-xl border border-white/20 bg-[#0c0b20] p-3 text-base leading-8 text-white focus:outline-none focus:ring-2 focus:ring-cyan-200"/><p id="speaking-role-draft-privacy" className="text-xs leading-7 text-slate-400">{t('sp.roleDraft.privacy')}</p></div></details>;
}
