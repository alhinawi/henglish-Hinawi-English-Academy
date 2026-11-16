import React, { useEffect, useState } from 'react';
import { Volume2 } from 'lucide-react';
import { speakEnglishVoice, stopSpeech, subscribeSpeechState } from '../utils/audio';

/**
 * Icon-only pronunciation button for word/phrase cards.
 * Uses the shared voice engine: pre-cached audio -> server TTS ->
 * browser speech synthesis (the OS/Edge/Google natural voices) automatically,
 * so playback keeps working when the paid voice quota runs out.
 * Rendered as a span with button semantics so it can live inside card buttons.
 */
const PronounceButton: React.FC<{ text: string; className?: string }> = ({ text, className = '' }) => {
  const [playing, setPlaying] = useState(false);

  useEffect(
    () =>
      subscribeSpeechState((isPlaying, spoken) => {
        setPlaying(isPlaying && spoken === text.trim());
      }),
    [text]
  );

  const handle = (e: React.SyntheticEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (playing) {
      stopSpeech();
    } else {
      speakEnglishVoice(text);
    }
  };

  return (
    <span
      role="button"
      tabIndex={0}
      aria-label="تشغيل النطق"
      title="تشغيل النطق"
      onClick={handle}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') handle(e);
      }}
      className={`inline-flex items-center justify-center w-8 h-8 rounded-full border transition-all cursor-pointer shrink-0 ${
        playing
          ? 'bg-[#ffd166]/30 text-[#ffd166] border-[#ffd166]/70 shadow-[0_0_12px_rgba(255,209,102,0.45)] animate-pulse'
          : 'bg-[#ffd166]/10 text-[#ffd166] border-[#ffd166]/30 hover:bg-[#ffd166]/20 hover:border-[#ffd166]/60 hover:shadow-[0_0_10px_rgba(255,209,102,0.3)]'
      } ${className}`}
    >
      <Volume2 className="w-4 h-4" />
    </span>
  );
};

export default PronounceButton;
