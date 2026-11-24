import {SpeakingFollowupAttempt} from './SpeakingFollowupAttempt';
import {SPEAKING_TRANSFER_MEANINGS} from '../data/speakingTransferMeanings';
import {SpeakingTopicWordRecall} from './SpeakingTopicWordRecall';
import {SPEAKING_TOPIC_WORDS} from '../data/speakingTopicWords';
import {SPEAKING_TRANSFER_PROMPTS} from '../data/speakingTransferPrompts';
import { SpeakingTransferReview } from './SpeakingTransferReview';
import React, { useState } from 'react';
import type { SpeakingLesson } from '../data/speakingAcademyData';
import { SpeakingRecorder } from './SpeakingPracticeStudio';
import { useLanguage } from '../i18n/LanguageContext';
import { stopSpeech } from '../utils/audio';

export function SpeakingTransferPractice({ lesson }: { lesson: SpeakingLesson }) {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [task, setTask] = useState(0);
  const [plan, setPlan] = useState('');
  return <section aria-label={t('sp.transfer.title')} className="rounded-3xl border border-cyan-200/25 bg-[#12152b] p-2 sm:p-6 space-y-4">
    <h3 className="text-xl font-bold text-cyan-100">{t('sp.transfer.title')}</h3>
    <p className="text-sm leading-7 text-slate-300">{t('sp.transfer.intro')}</p>
    <button type="button" aria-expanded={open} onClick={() => { stopSpeech(); setOpen(value => !value); setTask(0); setPlan(''); }} className="min-h-11 rounded-xl border border-cyan-200/35 px-4 font-bold text-sm text-cyan-100">{t(open ? 'sp.transfer.close' : 'sp.transfer.open')}</button>
    {open && <div className="space-y-4"><p dir="ltr" lang="en" className="text-sm leading-7 text-pink-100">{lesson.titleEn}</p><div role="group" aria-label={t('sp.transfer.choose')} className="flex flex-wrap gap-3">{[0,1].map(value => <button type="button" key={value} aria-pressed={task === value} onClick={() => { stopSpeech(); setTask(value); setPlan(''); }} className={`min-h-11 rounded-xl border px-4 text-sm font-bold ${task === value ? 'border-cyan-200 bg-cyan-200/15 text-cyan-100' : 'border-white/20 text-white'}`}>{t(`sp.transfer.choice.${value}`)}</button>)}</div><p className="text-sm leading-8 text-white">{t(`sp.transfer.task.${lesson.level}.${task}`)}</p><details key={`lesson-prompt:${lesson.id}:${task}`} className="rounded-2xl border border-pink-200/25 border-0 p-0 sm:border sm:p-4 text-start"><summary className="min-h-11 cursor-pointer text-sm font-bold leading-7 text-pink-100">{t('sp.lessonPrompt.title')}</summary><p className="mt-3 text-xs leading-7 text-slate-300">{t('sp.lessonPrompt.note')}</p><p lang="en" dir="ltr" className="mt-3 text-left text-base leading-8 text-white">{SPEAKING_TRANSFER_PROMPTS[lesson.id]?.[task]}</p><details key={`lesson-prompt-meaning:${lesson.id}:${task}`} className="mt-3 rounded-xl border border-cyan-200/20 border-0 p-0 sm:border sm:p-3 text-start"><summary className="min-h-11 cursor-pointer text-sm font-bold leading-7 text-cyan-100">{t('sp.followupMeaning.title')}</summary><p className="text-xs leading-7 text-slate-400">{t('sp.followupMeaning.note')}</p><p lang="ar" dir="rtl" className="text-right text-base leading-8 text-white">{SPEAKING_TRANSFER_MEANINGS[lesson.id]?.[task]}</p></details><SpeakingFollowupAttempt key={`followup-attempt:${lesson.id}:${task}`}/></details><details key={`topic-words:${lesson.id}:${task}`} className="rounded-2xl border border-cyan-200/25 p-2 sm:p-4 text-start"><summary className="min-h-11 cursor-pointer text-sm font-bold leading-7 text-cyan-100">{t('sp.topicWords.title')}</summary><p className="mt-3 text-xs leading-7 text-slate-300">{t('sp.topicWords.note')}</p><dl className="mt-4 space-y-3">{SPEAKING_TOPIC_WORDS[lesson.id]?.map(word=><SpeakingTopicWordRecall key={word.en} english={word.en} meaning={word.ar}/>)}</dl></details><label htmlFor="speaking-transfer-plan" className="block text-sm font-bold text-cyan-100">{t('sp.transfer.plan')}</label><textarea id="speaking-transfer-plan" aria-describedby="speaking-transfer-note" dir="auto" rows={3} maxLength={1500} value={plan} onChange={event => setPlan(event.target.value)} className="w-full rounded-xl border border-white/20 bg-[#0c0b20] p-4 text-base leading-8 text-white focus:outline-none focus:ring-2 focus:ring-cyan-200"/><p id="speaking-transfer-note" className="text-xs leading-7 text-slate-400">{t('sp.transfer.note')}</p><SpeakingRecorder key={`${lesson.id}:${task}`} prompt={t(`sp.transfer.record.${task}`)}/><SpeakingTransferReview key={`review:${lesson.id}:${task}`} lessonId={lesson.id}/></div>}
  </section>;
}
