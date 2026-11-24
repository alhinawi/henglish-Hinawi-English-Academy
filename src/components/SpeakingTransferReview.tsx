import {SPEAKING_TOPIC_REVIEW_AR} from '../data/speakingTopicReviewAr';
import {SPEAKING_TOPIC_REVIEW} from '../data/speakingTopicReview';
import React, { useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';

// Private self-review only. Never changes completion or awards points.
export function SpeakingTransferReview({lessonId}:{lessonId:string}) {
  const { t } = useLanguage();
  const [checks, setChecks] = useState<boolean[]>([false, false, false]);
  const [target, setTarget] = useState('');
  const [topicChecks,setTopicChecks]=useState([false,false,false]);
  return <details className="rounded-2xl border-0 border-cyan-200/25 bg-transparent p-0 text-start sm:border sm:bg-[#0c0b20] sm:p-4">
    <summary className="min-h-11 cursor-pointer text-sm font-bold leading-7 text-cyan-100">{t('sp.transferReview.title')}</summary>
    <div className="mt-4 space-y-4">
      <p className="text-xs leading-7 text-slate-300">{t('sp.transferReview.note')}</p>
      {[0,1,2].map((index)=><label key={index} className="flex items-start gap-3 rounded-xl border border-white/10 p-2 sm:p-3 text-sm leading-7 text-white"><input type="checkbox" checked={checks[index]} onChange={event=>setChecks(value=>value.map((checked,i)=>i===index?event.target.checked:checked))} className="mt-2 h-5 w-5 shrink-0 accent-cyan-200"/>{t(`sp.transferReview.check.${index}`)}</label>)}
      <fieldset className="space-y-3 rounded-xl border-0 border-pink-200/25 p-0 sm:border sm:p-3"><legend className="px-2 text-sm font-bold text-pink-100">{t('sp.topicReview.title')}</legend><p className="text-xs leading-7 text-slate-300">{t('sp.topicReview.note')}</p>{SPEAKING_TOPIC_REVIEW[lessonId]?.map((criterion,index)=><div key={criterion} className="space-y-2"><label className="flex items-start gap-3 rounded-xl border border-white/10 p-2 sm:p-3"><input type="checkbox" checked={topicChecks[index]} onChange={event=>setTopicChecks(value=>value.map((checked,i)=>i===index?event.target.checked:checked))} className="mt-2 h-5 w-5 shrink-0 accent-pink-200"/><span lang="en" dir="ltr" className="text-left text-sm leading-7 text-white">{criterion}</span></label><details className="rounded-xl border-0 border-amber-200/20 p-0 sm:border sm:p-3"><summary className="min-h-11 cursor-pointer text-xs font-bold leading-7 text-amber-100">{t('sp.topicReviewArabic.title')}</summary><p className="mt-2 text-xs leading-7 text-slate-400">{t('sp.topicReviewArabic.note')}</p><p lang="ar" dir="rtl" className="mt-2 text-right text-base leading-8 text-white">{SPEAKING_TOPIC_REVIEW_AR[lessonId]?.[index]}</p></details></div>)}</fieldset>
      <button type="button" disabled={!checks.some(Boolean)&&!topicChecks.some(Boolean)} onClick={()=>{setChecks([false,false,false]);setTopicChecks([false,false,false]);}} className="min-h-11 rounded-xl border border-pink-200/30 px-3 py-2 text-sm font-bold text-pink-100 disabled:opacity-40">{t('sp.transferReview.clearChecks')}</button><label htmlFor="speaking-transfer-target" className="block text-sm font-bold text-cyan-100">{t('sp.transferReview.target')}</label>
      <textarea id="speaking-transfer-target" dir="auto" rows={2} maxLength={300} aria-describedby="speaking-transfer-target-note" value={target} onChange={event=>setTarget(event.target.value)} className="w-full rounded-xl border border-white/20 bg-[#12152b] p-3 text-base leading-8 text-white focus:outline-none focus:ring-2 focus:ring-cyan-200"/>
      <button type="button" disabled={!target} onClick={()=>{setTarget('');document.getElementById('speaking-transfer-target')?.focus();}} className="min-h-11 rounded-xl border border-cyan-200/30 px-3 py-2 text-sm font-bold text-cyan-100 disabled:opacity-40">{t('sp.transferReview.clearTarget')}</button><p id="speaking-transfer-target-note" className="text-xs leading-7 text-slate-400">{t('sp.transferReview.next')}</p>
    </div>
  </details>;
}
