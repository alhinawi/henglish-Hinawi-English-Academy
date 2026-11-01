// ==============================================================================
// HENGLISH ACADEMY - GAMEVERSE UNIFIED HEADS-UP DISPLAY (HUD)
// ==============================================================================

import React, { useState } from 'react';
import { Timer, Flame, Volume2, VolumeX, LogOut, Trophy } from 'lucide-react';
import { playSound } from '../../utils/audio';

interface GameHudProps {
  title: string;
  category: string;
  currentRound: number;
  totalRounds: number;
  timeRemaining?: number;
  maxTime?: number;
  score: number;
  streak: number;
  onExit: () => void;
  soundEnabled?: boolean;
  onToggleSound?: () => void;
}

export const GameHud: React.FC<GameHudProps> = ({
  title,
  category,
  currentRound,
  totalRounds,
  timeRemaining,
  maxTime = 30,
  score,
  streak,
  onExit,
  soundEnabled = true,
  onToggleSound,
}) => {
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  const timeRatio = timeRemaining !== undefined ? timeRemaining / maxTime : 1;
  const timerColor =
    timeRemaining !== undefined
      ? timeRemaining <= 5
        ? 'text-rose-400 border-rose-500/50 bg-rose-500/10 animate-pulse'
        : timeRemaining <= 10
        ? 'text-amber-400 border-amber-500/50 bg-amber-500/10'
        : 'text-[#41e7ff] border-[#41e7ff]/30 bg-[#41e7ff]/10'
      : '';

  return (
    <div className="w-full space-y-3">
      {/* Top HUD Bar */}
      <div className="flex items-center justify-between gap-4 p-3.5 sm:p-4 rounded-2xl bg-[#121124]/90 border border-white/10 backdrop-blur-md shadow-xl">
        {/* Game Info & Round */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              playSound('click');
              setShowExitConfirm(true);
            }}
            className="p-2 rounded-xl bg-white/5 hover:bg-rose-500/20 text-[#b9b6d5] hover:text-rose-300 border border-white/10 transition-colors cursor-pointer"
            title="الخروج من اللعبة"
          >
            <LogOut className="w-4 h-4" />
          </button>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#ffd166] uppercase tracking-wider">
                {category}
              </span>
              <span className="text-white/30">•</span>
              <span className="text-xs text-[#b9b6d5]">
                جولة {currentRound} / {totalRounds}
              </span>
            </div>
            <h2 className="text-sm sm:text-base font-black text-white">{title}</h2>
          </div>
        </div>

        {/* Center Timer (if timed) */}
        {timeRemaining !== undefined && (
          <div
            className={`px-3 sm:px-4 py-1.5 rounded-xl border flex items-center gap-1.5 font-['Outfit',sans-serif] font-black text-sm sm:text-base transition-colors ${timerColor}`}
          >
            <Timer className="w-4 h-4" />
            <span>{timeRemaining}s</span>
          </div>
        )}

        {/* Score & Streak */}
        <div className="flex items-center gap-3">
          {streak >= 2 && (
            <div className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-xl bg-linear-to-r from-amber-500/20 to-rose-500/20 border border-amber-500/30 text-amber-300 text-xs font-black animate-bounce">
              <Flame className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>x{streak} كومبو!</span>
            </div>
          )}

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#c4ff55]/10 border border-[#c4ff55]/30 text-[#c4ff55] font-black text-sm sm:text-base">
            <Trophy className="w-4 h-4" />
            <span>{score} XP</span>
          </div>

          {onToggleSound && (
            <button
              onClick={() => {
                playSound('click');
                onToggleSound();
              }}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-[#b9b6d5] border border-white/10 transition-colors cursor-pointer"
              title={soundEnabled ? 'كتم الصوت' : 'تشغيل الصوت'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
          )}
        </div>
      </div>

      {/* Timer Progress Bar */}
      {timeRemaining !== undefined && (
        <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden">
          <div
            className="h-full bg-linear-to-r from-[#41e7ff] via-[#ffd166] to-[#ff4f9a] transition-all duration-300"
            style={{ width: `${Math.max(0, Math.min(100, timeRatio * 100))}%` }}
          />
        </div>
      )}

      {/* Exit Confirmation Modal */}
      {showExitConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="glass-panel p-6 sm:p-8 rounded-3xl max-w-sm w-full border border-white/10 text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto border border-rose-500/30 text-2xl">
              ⚠️
            </div>
            <h3 className="text-lg font-black text-white">هل تريد مغادرة التحدي؟</h3>
            <p className="text-xs text-[#b9b6d5] leading-relaxed">
              إذا غادرت الآن فلن يتم احتساب النقاط الكاملة لهذه الجولة. هل ترغب بالتأكيد؟
            </p>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => setShowExitConfirm(false)}
                className="py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs cursor-pointer transition-colors"
              >
                متابعة اللعب
              </button>
              <button
                onClick={() => {
                  setShowExitConfirm(false);
                  onExit();
                }}
                className="py-2.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-300 font-black text-xs cursor-pointer transition-colors"
              >
                تأكيد الخروج
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

