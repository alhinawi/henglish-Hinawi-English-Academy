import {SPEAKING_TOPIC_REVIEW} from '../data/speakingTopicReview';
import React, { useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';

// Private self-review only. Never changes completion or awards points.
export function SpeakingTransferReview({lessonId}:{lessonId:string}) {
  const { t } = useLanguage();
  const [checks, setChecks] = useState<boolean[]>([false, false, false]);
  const [target, setTarget] = useState('');
  const [topicChecks,setTopicChecks]=useState([false,false,false]);
  return <details className="rounded-2xl border border-cyan-200/25 bg-[#0c0b20] p-4 text-start">
    <summary className="min-h-11 cursor-pointer text-sm font-bold leading-7 text-cyan-100">{t('sp.transferReview.title')}</summary>
    <div className="mt-4 space-y-4">
      <p className="text-xs leading-7 text-slate-300">{t('sp.transferReview.note')}</p>
      {[0,1,2].map((index)=><label key={index} className="flex items-start gap-3 rounded-xl border border-white/10 p-3 text-sm leading-7 text-white"><input type="checkbox" checked={checks[index]} onChange={event=>setChecks(value=>value.map((checked,i)=>i===index?event.target.checked:checked))} className="mt-2 h-5 w-5 shrink-0 accent-cyan-200"/>{t(`sp.transferReview.check.${index}`)}</label>)}
      <fieldset className="space-y-3 rounded-xl border border-pink-200/25 p-3"><legend className="px-2 text-sm font-bold text-pink-100">{t('sp.topicReview.title')}</legend><p className="text-xs leading-7 text-slate-300">{t('sp.topicReview.note')}</p>{SPEAKING_TOPIC_REVIEW[lessonId]?.map((criterion,index)=><label key={criterion} className="flex items-start gap-3 rounded-xl border border-white/10 p-3"><input type="checkbox" checked={topicChecks[index]} onChange={event=>setTopicChecks(value=>value.map((checked,i)=>i===index?event.target.checked:checked))} className="mt-2 h-5 w-5 shrink-0 accent-pink-200"/><span lang="en" dir="ltr" className="text-left text-sm leading-7 text-white">{criterion}</span></label>)}</fieldset>
      <label htmlFor="speaking-transfer-target" className="block text-sm font-bold text-cyan-100">{t('sp.transferReview.target')}</label>
      <textarea id="speaking-transfer-target" dir="auto" rows={2} maxLength={300} aria-describedby="speaking-transfer-target-note" value={target} onChange={event=>setTarget(event.target.value)} className="w-full rounded-xl border border-white/20 bg-[#12152b] p-3 text-base leading-8 text-white focus:outline-none focus:ring-2 focus:ring-cyan-200"/>
      <p id="speaking-transfer-target-note" className="text-xs leading-7 text-slate-400">{t('sp.transferReview.next')}</p>
    </div>
  </details>;
}
