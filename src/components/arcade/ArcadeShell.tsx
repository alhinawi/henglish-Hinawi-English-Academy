// ==============================================================================
// Henglish Academy - Arcade shared UI: intro card, HUD header, end screen
// ==============================================================================

import React from 'react';
import { Trophy, RotateCcw, ArrowRight, Zap, Flame, Star } from 'lucide-react';
import { playSound } from '../../utils/audio';

export interface ArcadeGameMeta {
  id: string;
  title: string;
  icon: string;
  tagline: string;
}

interface IntroProps {
  meta: ArcadeGameMeta;
  best: number;
  plays: number;
  onStart: () => void;
  onBack: () => void;
}

export const ArcadeIntro: React.FC<IntroProps> = ({ meta, best, plays, onStart, onBack }) => (
  <div className="max-w-md mx-auto text-center space-y-6 py-8">
    <div className="text-6xl">{meta.icon}</div>
    <h2 className="text-3xl font-black text-white font-['Cairo',sans-serif]">{meta.title}</h2>
    <p className="text-[#b9b6d5] text-sm leading-relaxed">{meta.tagline}</p>
    <div className="flex items-center justify-center gap-3 text-xs">
      <span className="px-3 py-1.5 rounded-full bg-[#ffd166]/15 text-[#ffd166] border border-[#ffd166]/30 font-black flex items-center gap-1">
        <Trophy className="w-3.5 h-3.5" /> أفضل نتيجة: {best}
      </span>
      <span className="px-3 py-1.5 rounded-full bg-white/5 text-[#b9b6d5] border border-white/10 font-black">
        لعبتها {plays} {plays === 1 ? 'مرة' : 'مرات'}
      </span>
    </div>
    <button
      onClick={() => {
        playSound('click');
        onStart();
      }}
      className="w-full py-4 rounded-2xl bg-[#c4ff55] text-[#0c0b20] text-lg font-black shadow-lg shadow-[#c4ff55]/20 hover:brightness-110 transition-all cursor-pointer"
    >
      ابدأ اللعب
    </button>
    <button
      onClick={() => {
        playSound('click');
        onBack();
      }}
      className="text-xs text-[#8f8cb0] hover:text-white transition-colors cursor-pointer"
    >
      رجوع لمركز الألعاب
    </button>
  </div>
);

interface HudProps {
  title: string;
  round?: number;
  totalRounds?: number;
  score: number;
  timeLeft?: number;
  onQuit: () => void;
}

export const ArcadeHud: React.FC<HudProps> = ({ title, round, totalRounds, score, timeLeft, onQuit }) => (
  <div className="flex items-center justify-between gap-2 p-3 rounded-2xl bg-[#121124]/90 border border-white/10 mb-6">
    <button
      onClick={() => {
        playSound('click');
        onQuit();
      }}
      className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-rose-500/20 text-[#b9b6d5] hover:text-rose-300 border border-white/10 text-xs font-black transition-colors cursor-pointer"
    >
      خروج
    </button>
    <div className="text-center min-w-0">
      <div className="text-white font-black text-sm truncate">{title}</div>
      {round !== undefined && totalRounds !== undefined && (
        <div className="text-[10px] text-[#8f8cb0] font-bold">
          جولة {round} من {totalRounds}
        </div>
      )}
    </div>
    <div className="flex items-center gap-2 shrink-0">
      {timeLeft !== undefined && (
        <span
          className={`px-2.5 py-1 rounded-full text-xs font-black border ${
            timeLeft <= 5
              ? 'text-rose-400 border-rose-500/50 bg-rose-500/10 animate-pulse'
              : 'text-[#41e7ff] border-[#41e7ff]/30 bg-[#41e7ff]/10'
          }`}
        >
          {timeLeft} ث
        </span>
      )}
      <span className="px-2.5 py-1 rounded-full text-xs font-black text-[#c4ff55] border border-[#c4ff55]/30 bg-[#c4ff55]/10">
        {score} نقطة
      </span>
    </div>
  </div>
);

interface EndProps {
  meta: ArcadeGameMeta;
  score: number;
  xpEarned: number;
  newBest: boolean;
  best: number;
  onReplay: () => void;
  onBack: () => void;
  extra?: React.ReactNode;
}

export const ArcadeEnd: React.FC<EndProps> = ({ meta, score, xpEarned, newBest, best, onReplay, onBack, extra }) => (
  <div className="max-w-md mx-auto text-center space-y-5 py-8">
    <div className="text-6xl">{newBest ? '🏆' : meta.icon}</div>
    <h2 className="text-2xl font-black text-white font-['Cairo',sans-serif]">
      {newBest ? 'رقم قياسي جديد!' : 'خلصت الجولة!'}
    </h2>
    <div className="grid grid-cols-3 gap-2">
      <div className="p-3 rounded-2xl bg-[#121124] border border-white/10">
        <div className="text-xl font-black text-[#c4ff55]">{score}</div>
        <div className="text-[10px] text-[#8f8cb0] font-bold mt-1">نتيجتك</div>
      </div>
      <div className="p-3 rounded-2xl bg-[#121124] border border-white/10">
        <div className="text-xl font-black text-[#ffd166]">{best}</div>
        <div className="text-[10px] text-[#8f8cb0] font-bold mt-1">أفضل نتيجة</div>
      </div>
      <div className="p-3 rounded-2xl bg-[#121124] border border-white/10">
        <div className="text-xl font-black text-[#41e7ff] flex items-center justify-center gap-1">
          <Zap className="w-4 h-4" />
          {xpEarned}
        </div>
        <div className="text-[10px] text-[#8f8cb0] font-bold mt-1">XP الجولة</div>
      </div>
    </div>
    {extra}
    <div className="flex gap-2">
      <button
        onClick={() => {
          playSound('click');
          onReplay();
        }}
        className="flex-1 py-3.5 rounded-2xl bg-[#c4ff55] text-[#0c0b20] font-black shadow-lg shadow-[#c4ff55]/20 hover:brightness-110 transition-all cursor-pointer flex items-center justify-center gap-2"
      >
        <RotateCcw className="w-4 h-4" /> العب تاني
      </button>
      <button
        onClick={() => {
          playSound('click');
          onBack();
        }}
        className="flex-1 py-3.5 rounded-2xl bg-white/5 text-white font-black border border-white/10 hover:bg-white/10 transition-all cursor-pointer flex items-center justify-center gap-2"
      >
        مركز الألعاب <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  </div>
);

export const ArcadeStatChip: React.FC<{ icon: React.ReactNode; value: string; label: string; tone: string }> = ({
  icon,
  value,
  label,
  tone,
}) => (
  <div className={`flex-1 p-3 rounded-2xl border text-center ${tone}`}>
    <div className="flex items-center justify-center gap-1.5 text-lg font-black">
      {icon}
      <span>{value}</span>
    </div>
    <div className="text-[10px] font-bold opacity-80 mt-0.5">{label}</div>
  </div>
);

export const streakIcon = <Flame className="w-4 h-4" />;
export const xpIcon = <Zap className="w-4 h-4" />;
export const starIcon = <Star className="w-4 h-4" />;
