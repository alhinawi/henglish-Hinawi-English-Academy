import React, { useState } from 'react';
import { PageRoute } from '../types';
import { REAL_LIFE_DIALOGUES } from '../data/dialoguesData';
import { txText, useAppTextMap } from '../services/contentI18nService';
import { playSound } from '../utils/audio';
import { LessonSpeechButton } from './LessonSpeechButton';
import { SpeakingRecorder } from './SpeakingPracticeStudio';
import { useLanguage } from '../i18n/LanguageContext';
import {
  Mic,
  Volume2,
  Sparkles,
  MessageSquare,
  Play,
  RotateCcw,
  CheckCircle2,
  Flame,
} from 'lucide-react';

interface SpeakingLegacyPracticeProps {
  onNavigate: (route: PageRoute) => void;
}

export const SpeakingLegacyPractice: React.FC<SpeakingLegacyPracticeProps> = ({ onNavigate }) => {
  const { t } = useLanguage();
  const [activeScenarioIdx, setActiveScenarioIdx] = useState(0);
  const appText = useAppTextMap('dialoguesData');
  const [shadowingLineIdx, setShadowingLineIdx] = useState(0);
  const [customPrompt, setCustomPrompt] = useState<string | null>(null);

  const scenario = REAL_LIFE_DIALOGUES[activeScenarioIdx] || REAL_LIFE_DIALOGUES[0];
  const activeTargetLine = customPrompt || scenario.lines[shadowingLineIdx]?.en || 'Omar, will you have finished revising the grammar units by Thursday night?';
  const activeTargetLineAr = customPrompt ? t('slp.freeDesc') : scenario.lines[shadowingLineIdx]?.ar;

  const speakingPrompts = [
    {
      topic: t('slp.topic.0'),
      q: 'What major professional milestone will you have achieved before 2028?',
      hintAr: t('slp.hint.0'),
      starter: 'Before 2028, I will have...',
    },
    {
      topic: t('slp.topic.1'),
      q: 'Which countries will you have visited by the time you turn thirty-five?',
      hintAr: t('slp.hint.1'),
      starter: 'By the time I turn 35, I will have visited...',
    },
    {
      topic: t('slp.topic.2'),
      q: 'Will your team have delivered the complete client report by 6 PM today?',
      hintAr: t('slp.hint.2'),
      starter: 'Yes, we will have delivered it because...',
    },
    {
      topic: t('slp.topic.3'),
      q: 'How many English words will you have mastered by the end of this academic year?',
      hintAr: t('slp.hint.3'),
      starter: 'By the end of this year, I will have mastered...',
    },
    {
      topic: t('slp.topic.4'),
      q: 'What special preparations will your family have made before the next big gathering?',
      hintAr: t('slp.hint.4'),
      starter: 'Before the gathering, my family will have...',
    },
    {
      topic: t('slp.topic.5'),
      q: 'Which daily habits will technology have changed by 2035?',
      hintAr: t('slp.hint.5'),
      starter: 'By 2035, technology will have changed...',
    },
    {
      topic: t('slp.topic.6'),
      q: 'What fitness goals will you have achieved by the end of this year?',
      hintAr: t('slp.hint.6'),
      starter: 'By the end of this year, I will have...',
    },
    {
      topic: t('slp.topic.7'),
      q: 'How much money will you have saved before your next big purchase?',
      hintAr: t('slp.hint.7'),
      starter: 'Before my next big purchase, I will have saved...',
    },
    {
      topic: t('slp.topic.8'),
      q: 'What positive changes will your neighborhood have seen by 2030?',
      hintAr: t('slp.hint.8'),
      starter: 'By 2030, my neighborhood will have...',
    },
  ];

  return (
    <div className="space-y-10 pb-16 text-right">
      
      {/* Academy Hero */}
      <section className="relative rounded-3xl overflow-hidden border border-white/10 p-6 sm:p-12 bg-linear-to-br from-[#121128] via-[#171632] to-[#0c0b20] shadow-2xl">
        <div className="absolute top-0 right-10 w-80 h-80 bg-[#ff4f9a]/10 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-black bg-[#ff4f9a]/20 text-[#ff8bb9] border border-[#ff4f9a]/40 shadow-sm">
            <Mic className="w-4 h-4" />
            <span>HENGLISH SPEAKING ACADEMY • {t('slp.badge')}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight font-['Cairo',sans-serif]">
            {t('slp.heroTitle')}
          </h1>

          <p className="text-sm sm:text-base text-[#dedbf4] leading-relaxed">
            {t('slp.heroBody')}
          </p>
        </div>
      </section>

      {/* 1. SCENARIO SELECTOR */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar">
        {REAL_LIFE_DIALOGUES.map((d, idx) => (
          <button
            key={d.id}
            onClick={() => {
              playSound('click');
              setActiveScenarioIdx(idx);
              setShadowingLineIdx(0);
              setCustomPrompt(null);
            }}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold shrink-0 transition-all cursor-pointer flex items-center gap-2 ${
              activeScenarioIdx === idx
                ? 'bg-linear-to-r from-[#ffd166] to-[#41e7ff] text-[#0c0b20] font-black shadow-lg'
                : 'bg-white/5 text-[#dedbf4] hover:bg-white/10 border border-white/10'
            }`}
          >
            <span>{txText(appText, d.title)}</span>
            <span className="text-[10px] opacity-80">({d.difficulty})</span>
          </button>
        ))}
      </div>

      {/* 2. MAIN DIALOGUE PLAYER & SHADOWING STUDIO */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Dialogue Stream */}
        <div className="lg:col-span-7 glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 space-y-6">
          <div className="flex flex-wrap items-start justify-between gap-3 pb-3 border-b border-white/10">
            <div>
              <h2 className="text-xl font-black text-white">{txText(appText, scenario.title)}</h2>
              <p className="text-xs text-[#b9b6d5]">{txText(appText, scenario.description)}</p>
            </div>
            <LessonSpeechButton key={scenario.id} text={scenario.lines.map(l => `${l.speaker}: ${l.en}`).join('. ')} label={t('slp.playFull')}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-[#41e7ff] text-xs font-bold flex items-center gap-1.5 cursor-pointer" />
          </div>

          <div className="space-y-4">
            {scenario.lines.map((line, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-2xl border transition-all ${
                  shadowingLineIdx === idx
                    ? 'bg-[#ffd166]/10 border-[#ffd166]/40 shadow-sm'
                    : 'bg-white/5 border-white/5'
                }`}
              >
                <div className="flex flex-wrap items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2 font-bold text-xs text-[#ffd166]">
                    {line.avatarUrl && <img src={line.avatarUrl} alt="" loading="lazy" width={40} height={40} className="h-10 w-10 shrink-0 rounded-full object-cover" />}
                    <span>{line.speaker}</span>
                  </div>
                  <div className="flex flex-wrap items-start gap-2">
                    <span onClickCapture={() => { setShadowingLineIdx(idx); setCustomPrompt(null); }}>
                      <LessonSpeechButton key={line.en} text={line.en} label={`${t('slp.listenTitle')} ${idx + 1}`} iconOnly
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-[#41e7ff] cursor-pointer" />
                    </span>
                    <button
                      onClick={() => { setShadowingLineIdx(idx); setCustomPrompt(null); }}
                      className="text-[10px] text-[#b9b6d5] hover:text-white underline cursor-pointer"
                    >
                      {t('slp.selectShadow')}
                    </button>
                  </div>
                </div>

                <p className="en text-sm sm:text-base font-bold text-white mb-1">
                  {line.en}
                </p>
                <p className="text-xs text-[#b9b6d5]">
                  {txText(appText, line.ar)}
                </p>

                {line.targetStructure && (
                  <div className="mt-2 inline-flex items-center gap-1 text-[11px] font-mono text-[#c4ff55] bg-[#c4ff55]/10 px-2 py-0.5 rounded">
                    <span>{t('slp.targetStructure')}: {line.targetStructure}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Real Pronunciation Assessment Engine */}
        <div className="lg:col-span-6">
          <SpeakingRecorder
            key={activeTargetLine}
            prompt={activeTargetLine}
            description={activeTargetLineAr}
          />
        </div>

      </section>

      {/* 3. SPEAKING CHALLENGES & PROMPTS */}
      <section className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 space-y-6">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-[#ffd166]" />
            {t('slp.challengesTitle')}
          </h2>
          <p className="text-xs sm:text-sm text-[#b9b6d5] mt-1">
            {t('slp.challengesBody')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {speakingPrompts.map((p, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-[#09091a] border border-white/10 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <span className="text-[10px] font-black text-[#ffd166] uppercase tracking-wider">
                  {p.topic}
                </span>
                <p className="en text-sm sm:text-base font-bold text-white">
                  {p.q}
                </p>
                <p className="text-xs text-[#b9b6d5]">
                  {p.hintAr}
                </p>
              </div>

              <div className="pt-3 border-t border-white/5 space-y-2">
                <div className="text-[11px] text-[#41e7ff] font-mono">
                  {t('slp.starterPrefix')}: <span className="en font-bold">{p.starter}</span>
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() => {
                      playSound('click');
                      setCustomPrompt(p.starter);
                    }}
                    className="flex-1 py-1.5 px-2 rounded-lg bg-[#ff4f9a]/20 hover:bg-[#ff4f9a]/30 text-[#ff8bb9] text-[11px] font-bold flex items-center justify-center gap-1 cursor-pointer transition-colors"
                  >
                    <Mic className="w-3 h-3" />
                    <span>{t('slp.record')}</span>
                  </button>
                  <LessonSpeechButton text={p.q} label={`${t('slp.pronounceTitle')} ${idx + 1}`} iconOnly
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[#b9b6d5] hover:text-white cursor-pointer" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};
