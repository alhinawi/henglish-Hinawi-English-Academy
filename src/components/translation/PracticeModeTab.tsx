import React, { useState } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { CEFRLevel } from '../../types';
import { TRANSLATION_PRACTICE_CHALLENGES } from '../../services/translationService';
import { LessonSpeechButton } from '../LessonSpeechButton';

interface PracticeModeTabProps { userLevel?: CEFRLevel; onAwardXp?: (amount: number) => void }

// Self-study only. No free-text scoring, claimed proficiency or automatic XP.
export const PracticeModeTab: React.FC<PracticeModeTabProps> = () => {
  const { t } = useLanguage();
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [reviews, setReviews] = useState<Record<string, string[]>>({});
  const challenge = TRANSLATION_PRACTICE_CHALLENGES[index];
  if (!challenge) return null;
  return <section className="rounded-3xl border border-white/10 bg-[#0e0c26] p-5 space-y-5 text-right">
    <h3 className="font-bold text-xl text-white">{t('tpr.title')}</h3>
    <p className="text-sm text-slate-300 leading-7">{t('tpr.intro')}</p>
    <div className="flex items-center justify-between text-xs text-cyan-200"><span>{challenge.direction === 'en-to-ar' ? t('tpr.enAr') : t('tpr.arEn')}</span><bdi>{challenge.difficulty}</bdi></div>
    <p dir={challenge.direction === 'en-to-ar' ? 'ltr' : 'rtl'} className="text-xl leading-9 rounded-2xl p-5 bg-white/5 text-white">{challenge.sourceSentence}</p>
    <LessonSpeechButton key={challenge.id} text={challenge.sourceSentence} language={challenge.direction === 'en-to-ar' ? 'en' : 'ar'} label={t('tpr.listen')} className="min-h-11 px-4 rounded-xl bg-white/10 text-white" />
    <div className="space-y-2 text-start"><label htmlFor="translation-practice-draft" className="block text-sm font-bold text-cyan-100">{t('tpr.draft')}</label><textarea id="translation-practice-draft" aria-describedby="translation-practice-privacy" dir={challenge.direction === 'ar-to-en' ? 'ltr' : 'rtl'} lang={challenge.direction === 'ar-to-en' ? 'en' : 'ar'} rows={4} maxLength={3000} value={drafts[challenge.id] || ''} onChange={event => { setDrafts(value => ({ ...value, [challenge.id]: event.target.value })); setReviews(value => ({ ...value, [challenge.id]: [] })); }} className="w-full rounded-2xl border border-cyan-200/25 bg-[#080619] p-4 text-base leading-8 text-white focus:outline-none focus:ring-2 focus:ring-cyan-200" /><p id="translation-practice-privacy" className="text-xs leading-6 text-slate-400">{t('tpr.draftNote')}</p></div>
    <button aria-expanded={revealed} className="block min-h-12 px-5 rounded-xl bg-cyan-200 text-slate-950 font-bold" onClick={() => setRevealed(value => !value)}>{revealed ? t('tpr.hide') : t('tpr.show')}</button>
    {revealed && <div className="rounded-2xl p-5 bg-white/5 space-y-3"><h4 className="text-cyan-100 font-bold">{t('tpr.answers')}</h4>{challenge.modelTranslations.map(answer => <p key={answer} dir={challenge.direction === 'ar-to-en' ? 'ltr' : 'rtl'} className="text-white leading-8">{answer}</p>)}<fieldset className="space-y-3 border-t border-white/15 pt-4 text-start"><legend className="pt-4 text-sm font-bold text-cyan-100">{t('tpr.checkTitle')}</legend>{['meaning','tense','natural'].map(item => <label key={item} className="flex min-h-11 items-start gap-3 text-sm leading-7 text-slate-200"><input type="checkbox" className="mt-1.5 h-5 w-5 shrink-0 accent-cyan-200" checked={(reviews[challenge.id] || []).includes(item)} onChange={event => setReviews(value => ({ ...value, [challenge.id]: event.target.checked ? [...(value[challenge.id] || []), item] : (value[challenge.id] || []).filter(check => check !== item) }))} />{t(`tpr.check.${item}`)}</label>)}<p className="text-xs leading-7 text-slate-400">{t('tpr.checkNote')}</p></fieldset></div>}
    <div className="flex gap-3"><button className="min-h-11 px-4 rounded-xl bg-white/10 text-white" onClick={() => { setIndex(value => (value - 1 + TRANSLATION_PRACTICE_CHALLENGES.length) % TRANSLATION_PRACTICE_CHALLENGES.length); setRevealed(false); }}>{t('tpr.previous')}</button><button className="min-h-11 px-4 rounded-xl bg-white/10 text-white" onClick={() => { setIndex(value => (value + 1) % TRANSLATION_PRACTICE_CHALLENGES.length); setRevealed(false); }}>{t('tpr.next')}</button></div>
  </section>;
};
