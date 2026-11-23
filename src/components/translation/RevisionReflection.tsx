import React from 'react';
import {useLanguage} from '../../i18n/LanguageContext';

// Private in-memory reflection. Not a grade or evidence of proficiency.
export function RevisionReflection({value,onChange}:{value:string;onChange:(value:string)=>void}){
 const {t}=useLanguage();
 return <div className="space-y-3 rounded-xl border border-amber-200/25 p-4 text-start"><label htmlFor="translation-revision-reason" className="block text-sm font-bold text-amber-100">{t('tpr.reflection.label')}</label><p id="translation-revision-reason-note" className="text-xs leading-7 text-slate-300">{t('tpr.reflection.note')}</p><textarea id="translation-revision-reason" aria-describedby="translation-revision-reason-note" dir="auto" rows={3} maxLength={500} value={value} onChange={event=>onChange(event.target.value)} className="w-full rounded-xl border border-white/20 bg-[#080619] p-3 text-base leading-8 text-white focus:outline-none focus:ring-2 focus:ring-amber-200"/><p className="text-xs leading-7 text-slate-400">{t('tpr.reflection.privacy')}</p></div>;
}
