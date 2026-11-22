import React, { useState } from 'react';
import { Mic } from 'lucide-react';
import { SpeakingRecorder } from './SpeakingPracticeStudio';
import type { TimedSubtitle } from '../data/movieScenesData';
import { useLanguage } from '../i18n/LanguageContext';

/** Uses only reviewed cues supplied by the player, never generated dialogue. */
export function MovieCueSpeaking({ cues, onPause }: { cues: TimedSubtitle[]; onPause: () => void }) {
  const { t, dir } = useLanguage();
  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(cues[0]?.id || '');
  const cue = cues.find(item => item.id === selectedId) || cues[0];
  if (!cue) return null;
  return <section dir={dir} aria-label={t('ms.echoTitle')} className="mt-6 space-y-4 rounded-3xl border border-cyan-200/20 bg-[#11182a] p-5 text-start sm:p-7">
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div className="space-y-2"><h3 className="flex items-center gap-2 text-lg font-black text-cyan-100"><Mic size={20} aria-hidden="true"/>{t('ms.echoTitle')}</h3><p className="max-w-xl text-xs leading-7 text-slate-300">{t('ms.echoIntro')}</p></div>
      <button type="button" aria-expanded={open} onClick={() => { onPause(); setOpen(value => !value); }} className="min-h-11 rounded-xl border border-cyan-200/30 px-4 text-sm font-bold text-cyan-200">{t(open ? 'ms.echoClose' : 'ms.echoOpen')}</button>
    </div>
    {open && <div className="space-y-4" onClickCapture={onPause}>
      <label className="block space-y-2 text-xs font-bold text-slate-300"><span>{t('ms.echoChoose')}</span><select aria-label={t('ms.echoChoose')} value={cue.id} onChange={event => { onPause(); setSelectedId(event.target.value); }} className="min-h-12 w-full min-w-0 rounded-xl border border-white/20 bg-[#151329] p-3 text-sm text-white" dir="ltr">{cues.map((item, index) => <option key={item.id} value={item.id}>{index + 1}. {item.en}</option>)}</select></label>
      <p className="text-xs leading-7 text-slate-300">{t('ms.echoSteps')}</p>
      <SpeakingRecorder key={cue.id} prompt={cue.en}/>
      <p className="text-xs leading-7 text-slate-400">{t('ms.echoNote')}</p>
    </div>}
  </section>;
}
