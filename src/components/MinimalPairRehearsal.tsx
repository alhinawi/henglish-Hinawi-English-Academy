import React, { useEffect, useState } from 'react';
import { SpeakingRecorder } from './SpeakingPracticeStudio';
import { useLanguage } from '../i18n/LanguageContext';
import { stopSpeech } from '../utils/audio';
import type { MinimalPair } from '../data/skillsAcademyData';

// Optional local production practice, separate from the listening quiz.
export function MinimalPairRehearsal({ pair, onToggle }: { pair: MinimalPair; onToggle: () => void }) {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  useEffect(() => () => stopSpeech(), []);
  return <section aria-label={t('pa.pairRecord.title')} className="rounded-2xl border border-[#ffd166]/25 bg-[#151326] p-4 sm:p-6 space-y-4">
    <h3 className="text-lg font-bold text-[#ffd166]">{t('pa.pairRecord.title')}</h3>
    <p className="text-sm leading-7 text-slate-300">{t('pa.pairRecord.intro')}</p>
    <p dir="ltr" lang="en" className="text-center text-xl font-bold leading-9 text-white">{pair.wordA} · {pair.wordB} · {pair.wordA} · {pair.wordB}</p>
    <button type="button" aria-expanded={open} onClick={() => { onToggle(); setOpen(value => !value); }} className="min-h-11 rounded-xl border border-[#ffd166]/30 px-4 text-sm font-bold text-[#ffd166]">{t(open ? 'pa.pairRecord.close' : 'pa.pairRecord.open')}</button>
    {open && <div className="space-y-3"><SpeakingRecorder prompt={`${pair.wordA}, ${pair.wordB}. ${pair.wordA}, ${pair.wordB}.`} /><ul className="list-disc space-y-2 ps-5 text-sm leading-7 text-slate-300"><li>{t('pa.pairRecord.compare')}</li><li>{t('pa.pairRecord.repeat')}</li></ul><p className="text-xs leading-7 text-slate-400">{t('pa.pairRecord.note')}</p></div>}
  </section>;
}
