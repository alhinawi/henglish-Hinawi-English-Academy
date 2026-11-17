import React, { useEffect, useId, useRef, useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { Loader2, Square, Volume2 } from 'lucide-react';
import { getVoiceSettings } from '../utils/audio';
import { audioPlayback, type PlaybackState } from '../services/audioPlaybackManager';

/**
 * Icon-only pronunciation button for word/phrase cards.
 * Uses the shared voice engine: pre-cached audio -> server TTS ->
 * browser speech synthesis (the OS/Edge/Google natural voices) automatically,
 * so playback keeps working when the paid voice quota runs out.
 * Rendered as a span with button semantics so it can live inside card buttons.
 */
const PronounceButton: React.FC<{ text: string; className?: string }> = ({ text, className = '' }) => {
  const { t } = useLanguage();
  const id = useId();
  const owner = useRef(Symbol('phrase-pronunciation'));
  const [state, setState] = useState<PlaybackState>(() => audioPlayback.getState());
  const isCurrent = state.wordId === id;
  const playing = isCurrent && (state.status === 'loading' || state.status === 'playing');
  const loading = isCurrent && state.status === 'loading';
  const error = isCurrent && state.status === 'error';
  useEffect(() => {
    const unsubscribe = audioPlayback.subscribe(setState);
    return () => { unsubscribe(); audioPlayback.stopOwned(owner.current); };
  }, [text]);

  const handle = (e: React.SyntheticEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (playing) {
      audioPlayback.stopOwned(owner.current);
    } else {
      void audioPlayback.playPronunciation(id, text, getVoiceSettings().accent, undefined, owner.current);
    }
  };

  return (
    <span className={`inline-flex max-w-full items-start gap-2 ${error ? 'w-full' : ''}`}>
    <span
      role="button"
      tabIndex={0}
      aria-pressed={playing}
      aria-label={t(playing ? 'pr.stop' : 'pr.play')}
      title={t(playing ? 'pr.stop' : 'pr.play')}
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
      {loading ? <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" /> : playing ? <Square className="w-4 h-4" aria-hidden="true" /> : <Volume2 className="w-4 h-4" aria-hidden="true" />}
    </span>
    {error && <span role="status" className="max-w-64 text-xs leading-5 text-amber-200">{t('listen.audioError')}</span>}
    </span>
  );
};

export default PronounceButton;
