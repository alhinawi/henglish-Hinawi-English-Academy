import React, { useEffect, useState } from 'react';
import { LessonSpeechButton } from './LessonSpeechButton';
import { SpeakingRecorder } from './SpeakingPracticeStudio';
import type { SpeakingLesson } from '../data/speakingAcademyData';
import { useLanguage } from '../i18n/LanguageContext';
import { stopSpeech } from '../utils/audio';

export function SpeakingRoleRehearsal({ lesson }: { lesson: SpeakingLesson }) {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [role, setRole] = useState('B');
  const [turn, setTurn] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const line = lesson.dialogue[turn];
  useEffect(() => () => stopSpeech(), []);
  const reset = (nextRole = role) => { stopSpeech(); setRole(nextRole); setTurn(0); setRevealed(false); };
  if (!line) return null;
  const yourTurn = line.role === role;
  return <section className="rounded-3xl border border-pink-200/25 bg-[#17152b] p-4 sm:p-6 space-y-4" aria-label={t('sp.roleplay.title')}>
    <div className="flex flex-wrap items-start justify-between gap-3"><div className="space-y-2"><h3 className="text-xl font-bold text-pink-100">{t('sp.roleplay.title')}</h3><p className="text-sm leading-7 text-slate-300">{t('sp.roleplay.intro')}</p></div><button type="button" aria-expanded={open} onClick={() => { reset(); setOpen(v => !v); }} className="min-h-11 rounded-xl border border-pink-200/30 px-4 text-sm font-bold text-pink-200">{t(open ? 'sp.roleplay.close' : 'sp.roleplay.open')}</button></div>
    {open && <div className="space-y-4">
      <div role="group" aria-label={t('sp.roleplay.choose')} className="flex flex-wrap gap-2">{['A','B'].map(value => <button key={value} type="button" aria-pressed={role === value} onClick={() => reset(value)} className={`min-h-11 rounded-xl border px-4 text-sm font-bold ${role === value ? 'border-pink-200 bg-pink-200 text-slate-950' : 'border-white/15 text-slate-200'}`}>{t('sp.roleplay.role')} {value}</button>)}</div>
      <p className="text-xs text-slate-400" role="status">{t('sp.roleplay.turn').replace('{current}', String(turn+1)).replace('{total}', String(lesson.dialogue.length))}</p>
      {yourTurn ? <div className="space-y-4"><p className="font-bold text-pink-100">{t('sp.roleplay.yourTurn')}</p><SpeakingRecorder key={`${role}:${turn}`} prompt={t('sp.roleplay.respond')}/><button type="button" aria-expanded={revealed} onClick={() => setRevealed(v => !v)} className="min-h-11 rounded-xl border border-white/15 px-4 text-sm text-cyan-200">{t(revealed ? 'sp.roleplay.hide' : 'sp.roleplay.reveal')}</button>{revealed && <div className="space-y-3 rounded-2xl bg-white/5 p-4"><p dir="ltr" lang="en" className="text-left leading-8">{line.en}</p><LessonSpeechButton key={`model:${role}:${turn}`} text={line.en} label={t('sp.roleplay.listenModel')} className="min-h-11 rounded-xl border border-white/15 px-4 text-sm text-cyan-200"/></div>}</div> : <div className="space-y-3 rounded-2xl bg-white/5 p-4"><p className="text-xs font-bold text-cyan-200">{t('sp.roleplay.partner')}</p><p dir="ltr" lang="en" className="text-left text-lg leading-8">{line.en}</p><LessonSpeechButton key={`partner:${role}:${turn}`} text={line.en} label={t('sp.roleplay.listenPartner')} className="min-h-11 rounded-xl border border-white/15 px-4 text-sm text-cyan-200"/></div>}
      <p className="text-xs leading-7 text-slate-400">{t('sp.roleplay.note')}</p>
      <div className="flex flex-wrap gap-2"><button type="button" onClick={() => { stopSpeech(); setTurn(i => (i+1)%lesson.dialogue.length); setRevealed(false); }} className="min-h-12 rounded-xl bg-pink-200 px-5 text-sm font-bold text-slate-950">{t(turn === lesson.dialogue.length-1 ? 'sp.roleplay.again' : 'sp.roleplay.next')}</button><button type="button" onClick={() => reset()} className="min-h-12 rounded-xl border border-white/15 px-4 text-sm text-slate-300">{t('sp.roleplay.restart')}</button></div>
    </div>}
  </section>;
}
