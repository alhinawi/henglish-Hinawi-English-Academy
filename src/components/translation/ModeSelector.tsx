// ==============================================================================
// Henglish Academy (HENGLISH) - TRANSLATION STYLISTIC MODE SELECTOR
// Supports 10 contextual translation styles with descriptive hints
// ==============================================================================

import React from 'react';
import { TranslationMode, TRANSLATION_MODES } from '../../types/translation';
import { playSound } from '../../utils/audio';

interface ModeSelectorProps {
  currentMode: TranslationMode;
  onSelectMode: (mode: TranslationMode) => void;
}

export const ModeSelector: React.FC<ModeSelectorProps> = ({ currentMode, onSelectMode }) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between text-xs">
        <span className="text-[#b9b6d5] font-medium">نمط وأسلوب الترجمة (Translation Style):</span>
        <span className="text-slate-400">10 أنماط سياقية ذكية</span>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-thin">
        {TRANSLATION_MODES.map(mode => {
          const isActive = currentMode === mode.id;
          return (
            <button
              key={mode.id}
              type="button"
              onClick={() => {
                playSound('click');
                onSelectMode(mode.id);
              }}
              title={mode.descriptionAr}
              className={`shrink-0 flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-[#41e7ff]/20 to-[#a855f7]/20 border border-[#41e7ff] text-white shadow-md shadow-[#41e7ff]/10 font-bold'
                  : 'bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white'
              }`}
            >
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: mode.color }}
              />
              <span>{mode.titleAr}</span>
              <span className="text-[10px] opacity-75 font-normal px-1.5 py-0.5 rounded-md bg-black/30">
                {mode.badge}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
