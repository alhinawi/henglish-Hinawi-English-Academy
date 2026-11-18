import { useMicrosoftVoice } from '../../hooks/useMicrosoftVoice';
// ==============================================================================
// Henglish Academy (HENGLISH) - DUAL PRONUNCIATION AUDIO BUTTON
// American (Cyan #22D3EE) & British (Purple #A78BFA) Audio Playback Component
// ==============================================================================

import React, { useEffect, useRef, useState } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { Volume2, Loader2, Square } from 'lucide-react';
import { audioPlayback, PlaybackState, PronunciationAccent } from '../../services/audioPlaybackManager';

interface PronunciationButtonProps {
  wordId: string;
  wordText: string;
  accent: PronunciationAccent;
  ipa?: string;
  audioUrl?: string;
  size?: 'sm' | 'md' | 'lg';
  showIpa?: boolean;
}

export const PronunciationButton: React.FC<PronunciationButtonProps> = ({
  wordId,
  wordText,
  accent,
  ipa,
  audioUrl,
  size = 'md',
  showIpa = true,
}) => {
  const { t } = useLanguage();
  const browserVoiceAvailable = useMicrosoftVoice();
  const [playbackState, setPlaybackState] = useState<PlaybackState>(() => audioPlayback.getState());

  const owner = useRef(Symbol('pronunciation-button'));
  useEffect(() => {
    const unsubscribe = audioPlayback.subscribe(setPlaybackState);
    return () => { unsubscribe(); audioPlayback.stopOwned(owner.current); };
  }, [wordId, wordText, accent, audioUrl]);

  const isCurrent = playbackState.wordId === wordId && playbackState.accent === accent;
  const isPlaying = isCurrent && playbackState.status === 'playing';
  const isLoading = isCurrent && playbackState.status === 'loading';

  const isError = isCurrent && playbackState.status === 'error';
  const active = isPlaying || isLoading;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    audioPlayback.playPronunciation(wordId, wordText, accent, audioUrl, owner.current);
  };

  const isUS = accent === 'US';

  // Styling specifications from Prompt:
  // US (Cyan): #22D3EE, hover #67E8F9, bg rgba(34,211,238,0.10), border rgba(34,211,238,0.35)
  // UK (Purple): #A78BFA, hover #C4B5FD, bg rgba(167,139,250,0.10), border rgba(167,139,250,0.35)
  const colorStyles = isUS
    ? {
        idleBg: 'bg-[rgba(34,211,238,0.10)]',
        border: 'border-[rgba(34,211,238,0.35)]',
        hoverBorder: 'hover:border-[#67E8F9]',
        text: 'text-[#22D3EE]',
        hoverText: 'hover:text-[#67E8F9]',
        activeBg: 'bg-[#22D3EE] text-[#09091a]',
        badgeBg: 'bg-[#22D3EE]/20 text-[#22D3EE]',
        barBg: 'bg-[#22D3EE]',
      }
    : {
        idleBg: 'bg-[rgba(167,139,250,0.10)]',
        border: 'border-[rgba(167,139,250,0.35)]',
        hoverBorder: 'hover:border-[#C4B5FD]',
        text: 'text-[#A78BFA]',
        hoverText: 'hover:text-[#C4B5FD]',
        activeBg: 'bg-[#A78BFA] text-[#09091a]',
        badgeBg: 'bg-[#A78BFA]/20 text-[#A78BFA]',
        barBg: 'bg-[#A78BFA]',
      };

  return (
    <span className="inline-flex max-w-full flex-col items-start gap-1">
    <button
      type="button"
      disabled={isError && !browserVoiceAvailable}
      onClick={handleClick}
      title={t(active ? 'pr.stop' : isUS ? 'pr.us' : 'pr.uk')}
      aria-label={t(active ? 'pr.stop' : isUS ? 'pr.us' : 'pr.uk')}
      aria-pressed={active}
      className={`inline-flex items-center gap-1.5 rounded-xl border transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed font-sans select-none ${
        size === 'sm'
          ? 'px-2 py-1 text-[11px]'
          : size === 'lg'
          ? 'px-3.5 py-2 text-sm'
          : 'px-2.5 py-1.5 text-xs'
      } ${
        isPlaying
          ? `${colorStyles.activeBg} font-black shadow-lg scale-102`
          : `${colorStyles.idleBg} ${colorStyles.border} ${colorStyles.text} ${colorStyles.hoverBorder} ${colorStyles.hoverText}`
      }`}
    >
      {/* Accent Tag */}
      <span
        className={`font-black uppercase tracking-wider rounded px-1 py-0.5 text-[9px] ${
          isPlaying ? 'bg-black/25 text-white' : colorStyles.badgeBg
        }`}
      >
        {isUS ? 'US' : 'UK'}
      </span>

      {/* Play/Loading/Waveform Icon */}
      {active && <Square className="w-3 h-3 shrink-0" aria-hidden="true" />}
      {isLoading ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
      ) : isPlaying ? (
        <div className="flex items-center gap-0.5 h-3.5 px-0.5">
          <span className={`w-0.75 h-full ${isPlaying ? 'bg-current' : colorStyles.barBg} rounded-full animate-bounce`} style={{ animationDelay: '0ms' }} />
          <span className={`w-0.75 h-2/3 ${isPlaying ? 'bg-current' : colorStyles.barBg} rounded-full animate-bounce`} style={{ animationDelay: '150ms' }} />
          <span className={`w-0.75 h-full ${isPlaying ? 'bg-current' : colorStyles.barBg} rounded-full animate-bounce`} style={{ animationDelay: '300ms' }} />
        </div>
      ) : (
        <Volume2 className="w-3.5 h-3.5 shrink-0" />
      )}

      {/* IPA phonetic text */}
      {showIpa && ipa && (
        <span
          dir="ltr"
          className={`font-mono text-[11px] tracking-tight ${
            isPlaying ? 'text-black/80 font-bold' : 'opacity-85'
          }`}
        >
          {ipa}
        </span>
      )}
    </button>
    {isError && <span role="status" className="max-w-64 text-xs leading-5 text-amber-200">{t('listen.audioError')}</span>}
    </span>
  );
};

