import {MinimalPairOwnSentences} from './MinimalPairOwnSentences';
import { LessonSpeechButton } from './LessonSpeechButton';
import { MINIMAL_PAIR_CONTEXT } from '../data/minimalPairContextData';
import React, { useEffect, useState } from 'react';
import { SpeakingRecorder } from './SpeakingPracticeStudio';
import { useLanguage } from '../i18n/LanguageContext';
import { stopSpeech } from '../utils/audio';
import type { MinimalPair } from '../data/skillsAcademyData';

// Optional local production practice, separate from the listening quiz.
export function MinimalPairRehearsal({ pair, onToggle }: { pair: MinimalPair; onToggle: () => void }) {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [contextMode, setContextMode] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const context = MINIMAL_PAIR_CONTEXT[pair.id];
  const prompt = contextMode && context ? `${context.a} ${context.b}` : `${pair.wordA}, ${pair.wordB}. ${pair.wordA}, ${pair.wordB}.`;
  useEffect(() => () => stopSpeech(), []);
  return <section aria-label={t('pa.pairRecord.title')} className="rounded-2xl border-0 sm:border border-[#ffd166]/25 sm:bg-[#151326] p-0 sm:p-6 space-y-4">
    <h3 className="text-lg font-bold text-[#ffd166]">{t('pa.pairRecord.title')}</h3>
    <p className="text-sm leading-7 text-slate-300">{t('pa.pairRecord.intro')}</p>
    <p dir="ltr" lang="en" className="text-center text-xl font-bold leading-9 text-white">{pair.wordA} · {pair.wordB} · {pair.wordA} · {pair.wordB}</p>
    {context && <div className="space-y-4 rounded-xl border-0 border-white/10 p-0 sm:border sm:p-4"><h4 className="font-bold text-cyan-100">{t('pa.context.title')}</h4><p className="text-xs leading-7 text-slate-300">{t('pa.context.note')}</p><p className="text-xs leading-7 text-slate-400">{t('pa.context.listenNote')}</p>{(['a','b'] as const).map(side => { const sentence = context[side]; const word = side === 'a' ? pair.wordA : pair.wordB; const chosen = answers[side]; const gap = sentence.replace(new RegExp(`\\b${word}\\b`, 'i'), '_____'); return <div key={side} className="space-y-3"><p dir="ltr" lang="en" className="text-base leading-8">{chosen === word ? sentence : gap}</p><div className="flex flex-wrap gap-3">{[pair.wordA,pair.wordB].map(option => <button type="button" key={option} dir="ltr" aria-pressed={chosen === option} onClick={() => setAnswers(value => ({...value,[side]:option}))} className={`min-h-11 rounded-xl border px-4 font-bold ${chosen === option ? 'border-cyan-200 bg-cyan-200/15 text-cyan-100' : 'border-white/20 text-white'}`}>{option}</button>)}</div>{chosen === word && !open && <LessonSpeechButton key={`${pair.id}:${side}`} text={sentence} label={`${t('pa.context.listen')}: ${word}`} className="min-h-11 rounded-xl border border-cyan-200/30 px-4 text-sm font-bold text-cyan-100"/>}{chosen && <p role="status" className="text-xs leading-7 text-slate-300">{t(chosen === word ? 'pa.context.correct' : 'pa.context.retry')}</p>}</div>; })}<button type="button" aria-pressed={contextMode} onClick={() => { onToggle(); setContextMode(value => !value); }} className="min-h-11 rounded-xl border border-cyan-200/40 px-4 text-sm font-bold text-cyan-100">{t(contextMode ? 'pa.context.words' : 'pa.context.sentences')}</button><p className="text-xs leading-7 text-slate-400">{t(contextMode ? 'pa.context.sentenceNote' : 'pa.context.wordNote')}</p></div>}
    <MinimalPairOwnSentences key={`own-sentences:${pair.id}`} wordA={pair.wordA} wordB={pair.wordB}/>
    <button type="button" aria-expanded={open} onClick={() => { onToggle(); setOpen(value => !value); }} className="min-h-11 rounded-xl border border-[#ffd166]/30 px-4 text-sm font-bold text-[#ffd166]">{t(open ? 'pa.pairRecord.close' : 'pa.pairRecord.open')}</button>
    {open && <div className="space-y-3"><SpeakingRecorder key={contextMode ? 'sentences' : 'words'} prompt={prompt} /><ul className="list-disc space-y-2 ps-5 text-sm leading-7 text-slate-300"><li>{t('pa.pairRecord.compare')}</li><li>{t('pa.pairRecord.repeat')}</li></ul><p className="text-xs leading-7 text-slate-400">{t('pa.pairRecord.note')}</p></div>}
  </section>;
}
