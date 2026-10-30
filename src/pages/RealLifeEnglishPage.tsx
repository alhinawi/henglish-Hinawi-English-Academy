import React, { useState } from 'react';
import { PageRoute } from '../types';
import { REAL_LIFE_MODULES, RealLifeModule } from '../data/skillsAcademyData';
import { playSound, speakEnglish } from '../utils/audio';
import {
  Compass,
  Volume2,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  MessageSquare,
  Building2,
} from 'lucide-react';

interface RealLifeEnglishPageProps {
  onNavigate: (route: PageRoute) => void;
}

export const RealLifeEnglishPage: React.FC<RealLifeEnglishPageProps> = ({ onNavigate }) => {
  const [selectedModuleIdx, setSelectedModuleIdx] = useState(0);

  const currentMod = REAL_LIFE_MODULES[selectedModuleIdx] || REAL_LIFE_MODULES[0];

  return (
    <div className="space-y-10 pb-16 text-right">
      
      {/* Academy Hero */}
      <section className="relative rounded-3xl overflow-hidden border border-white/10 p-6 sm:p-12 bg-gradient-to-br from-[#121128] via-[#171632] to-[#0c0b20] shadow-2xl">
        <div className="absolute top-0 right-10 w-80 h-80 bg-[#ff4f9a]/10 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-black bg-[#ff4f9a]/20 text-[#ff8bb9] border border-[#ff4f9a]/40 shadow-sm">
            <Compass className="w-4 h-4" />
            <span>PRACTICAL SURVIVAL ENGLISH • إنجليزي المواقف الحقيقية اليومية</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight font-['Cairo',sans-serif]">
            إنجليزي الحياة الواقعية والمواقف اليومية 🌍
          </h1>

          <p className="text-sm sm:text-base text-[#dedbf4] leading-relaxed">
            تعلم كيف تتصرف كمتحدث أصلي في مواقف السفر الحقيقية: في المطار، الفندق، المطعم، المستشفى، البنك، ومقابلات العمل، مع أهم الجمل التلقائية والمحادثات الجاهزة.
          </p>
        </div>
      </section>

      {/* 1. MODULE TABS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {REAL_LIFE_MODULES.map((mod, idx) => (
          <button
            key={mod.id}
            onClick={() => {
              playSound('click');
              setSelectedModuleIdx(idx);
            }}
            className={`p-5 rounded-2xl border text-right transition-all cursor-pointer flex items-center justify-between ${
              selectedModuleIdx === idx
                ? 'bg-gradient-to-r from-[#ffd166]/20 to-[#41e7ff]/20 border-[#ffd166] shadow-lg'
                : 'glass-panel border-white/10 hover:border-white/20'
            }`}
          >
            <div className="space-y-1">
              <div className="text-sm font-black text-white flex items-center gap-2">
                <span>{mod.icon}</span>
                <span>{mod.titleAr}</span>
              </div>
              <div className="en text-xs font-mono text-[#b9b6d5]">{mod.title}</div>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-white/10 font-mono text-[#ffd166]">
              {mod.level}
            </span>
          </button>
        ))}
      </div>

      {/* 2. ACTIVE MODULE CONTENT */}
      <section className="glass-panel rounded-3xl p-6 sm:p-10 border border-white/10 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div className="space-y-1">
            <div className="text-xs font-bold text-[#ffd166]">الموديول المختار: {currentMod.category}</div>
            <h2 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2">
              <span>{currentMod.icon}</span>
              <span>{currentMod.titleAr}</span>
            </h2>
            <p className="text-xs text-[#b9b6d5] max-w-xl">{currentMod.scenarioSummaryAr}</p>
          </div>

          <button
            onClick={() => onNavigate('speaking')}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-[#41e7ff] text-xs font-bold flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
          >
            <MessageSquare className="w-4 h-4" />
            <span>فتح حوارات المحادثة الحية</span>
          </button>
        </div>

        {/* Essential Phrases */}
        <div className="space-y-4">
          <h3 className="text-lg font-black text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#ffd166]" />
            الجمل والتعبيرات السحرية الأكثر استخداماً:
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentMod.keyPhrases.map((phrase, pIdx) => (
              <div
                key={pIdx}
                className="p-4 rounded-2xl bg-[#09091a] border border-white/10 flex items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <p className="en text-sm font-bold text-white leading-snug">
                    "{phrase.en}"
                  </p>
                  <p className="text-xs text-[#b9b6d5]">
                    {phrase.ar}
                  </p>
                </div>

                <button
                  onClick={() => speakEnglish(phrase.en)}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/15 text-[#41e7ff] shrink-0 cursor-pointer"
                  title="استمع للنطق"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Dialogue Scene Preview */}
        <div className="p-6 rounded-2xl bg-black/40 border border-white/10 space-y-4">
          <h3 className="text-base font-black text-white">🎭 سيناريو الحوار في الموقف الحقيقي:</h3>
          
          <div className="space-y-3">
            {currentMod.dialoguePreview.map((line, lIdx) => (
              <div key={lIdx} className="p-3.5 rounded-xl bg-white/5 border border-white/5 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#ffd166]">{line.speaker}:</span>
                  <button
                    onClick={() => speakEnglish(line.textEn)}
                    className="text-[#41e7ff] hover:text-white"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="en text-sm font-semibold text-white">{line.textEn}</p>
                <p className="text-xs text-[#b9b6d5]">{line.textAr}</p>
              </div>
            ))}
          </div>
        </div>

      </section>

    </div>
  );
};
