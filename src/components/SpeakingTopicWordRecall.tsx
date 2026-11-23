import React,{useState} from 'react';
import {useLanguage} from '../i18n/LanguageContext';

export function SpeakingTopicWordRecall({english,meaning}:{english:string;meaning:string}){
 const {t}=useLanguage();const [hidden,setHidden]=useState(false);
 return <div className="rounded-xl border border-white/15 p-3 space-y-2"><dt lang={hidden?undefined:'en'} dir={hidden?'auto':'ltr'} className="text-left text-base font-bold leading-8 text-white">{hidden?<span className="text-sm font-normal text-slate-400">{t('sp.topicRecall.hidden')}</span>:english}</dt><dd lang="ar" dir="rtl" className="text-right text-sm leading-8 text-slate-300">{meaning}</dd><dd><button type="button" aria-expanded={!hidden} onClick={()=>setHidden(value=>!value)} className="min-h-11 rounded-xl border border-cyan-200/30 px-3 py-2 text-xs font-bold text-cyan-100">{t(hidden?'sp.topicRecall.show':'sp.topicRecall.hide')}</button><p className="mt-2 text-xs leading-7 text-slate-400">{t('sp.topicRecall.note')}</p></dd></div>;
}
