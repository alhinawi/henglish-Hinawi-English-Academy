import React, { useState } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { CEFRLevel } from '../../types';
import { TRANSLATION_PRACTICE_CHALLENGES } from '../../services/translationService';
import { speakMultilingualText } from '../../utils/audio';

interface PracticeModeTabProps { userLevel?: CEFRLevel; onAwardXp?: (amount: number) => void }

// Self-study only. No free-text scoring, claimed proficiency or automatic XP.
export const PracticeModeTab: React.FC<PracticeModeTabProps> = () => {
  const { t } = useLanguage();
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const challenge = TRANSLATION_PRACTICE_CHALLENGES[index];
  if (!challenge) return null;
  return <section className="rounded-3xl border border-white/10 bg-[#0e0c26] p-5 space-y-5 text-right">
    <h3 className="font-bold text-xl text-white">{t('tpr.title')}</h3>
    <p className="text-sm text-slate-300 leading-7">{t('tpr.intro')}</p>
    <div className="flex items-center justify-between text-xs text-cyan-200"><span>{challenge.direction === 'en-to-ar' ? t('tpr.enAr') : t('tpr.arEn')}</span><bdi>{challenge.difficulty}</bdi></div>
    <p dir={challenge.direction === 'en-to-ar' ? 'ltr' : 'rtl'} className="text-xl leading-9 rounded-2xl p-5 bg-white/5 text-white">{challenge.sourceSentence}</p>
    <button className="min-h-11 px-4 rounded-xl bg-white/10 text-white" onClick={() => speakMultilingualText(challenge.sourceSentence, challenge.direction === 'en-to-ar' ? 'en' : 'ar')}>{t('tpr.listen')}</button>
    <button className="block min-h-12 px-5 rounded-xl bg-cyan-200 text-slate-950 font-bold" onClick={() => setRevealed(value => !value)}>{revealed ? t('tpr.hide') : t('tpr.show')}</button>
    {revealed && <div className="rounded-2xl p-5 bg-white/5 space-y-3"><h4 className="text-cyan-100 font-bold">{t('tpr.answers')}</h4>{challenge.modelTranslations.map(answer => <p key={answer} dir={challenge.direction === 'ar-to-en' ? 'ltr' : 'rtl'} className="text-white leading-8">{answer}</p>)}</div>}
    <div className="flex gap-3"><button className="min-h-11 px-4 rounded-xl bg-white/10 text-white" onClick={() => { setIndex(value => (value - 1 + TRANSLATION_PRACTICE_CHALLENGES.length) % TRANSLATION_PRACTICE_CHALLENGES.length); setRevealed(false); }}>{t('tpr.previous')}</button><button className="min-h-11 px-4 rounded-xl bg-white/10 text-white" onClick={() => { setIndex(value => (value + 1) % TRANSLATION_PRACTICE_CHALLENGES.length); setRevealed(false); }}>{t('tpr.next')}</button></div>
  </section>;
};
