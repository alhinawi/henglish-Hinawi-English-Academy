import React, { useEffect, useRef, useState } from 'react';
import { Square, Volume2 } from 'lucide-react';
import { getVoiceSettings, speakEnglish, speakMultilingualText, stopSpeech, subscribeSpeechState, type SpeechSpeed, type SpeakOptions } from '../utils/audio';
import { useLanguage } from '../i18n/LanguageContext';

export function LessonSpeechButton({ text, label, className, speed, iconOnly = false, language = 'en' }: { text: string; label: string; className: string; speed?: SpeechSpeed; iconOnly?: boolean; language?: string }) {
  const { t } = useLanguage();
  const [active, setActive] = useState(false);
  const [error, setError] = useState('');
  const ownsSpeech = useRef(false);
  useEffect(() => {
    const unsubscribe = subscribeSpeechState((playing, spoken) => {
      if (!playing || spoken !== text.trim()) { ownsSpeech.current = false; setActive(false); }
    });
    return () => { unsubscribe(); if (ownsSpeech.current) stopSpeech(); };
  }, [text, language]);
  function toggle() {
    if (active) { stopSpeech(); return; }
    setError('');
    if (getVoiceSettings().isMuted) { setError(t('w3.voice.muted')); return; }
    let settled = false;
    const speak = language === 'en' ? speakEnglish : (value: string, options?: SpeakOptions) => speakMultilingualText(value, language, options);
    speak(text, {
      speed,
      onEnd: () => { settled = true; ownsSpeech.current = false; setActive(false); },
      onError: () => { settled = true; ownsSpeech.current = false; setActive(false); setError(t('listen.audioError')); },
    });
    // The engine cancels the previous request synchronously before starting
    // synthesis. Keep a Stop control available during the new request too.
    ownsSpeech.current = !settled;
    setActive(!settled);
  }
  return <span className="inline-flex max-w-full flex-col items-start gap-2">
    <button type="button" className={className} onClick={toggle} aria-pressed={active} aria-label={active ? t('listen.stopAudio') : label} title={active ? t('listen.stopAudio') : label}>
      {active ? <Square size={16} className="inline" aria-hidden="true" /> : speed && iconOnly ? <span className="text-[9px]">{speed}x</span> : <Volume2 size={16} className="inline" aria-hidden="true" />} {!iconOnly && (active ? t('listen.stopAudio') : label)}
    </button>
    {error && <span role="status" className="max-w-40 text-xs leading-6 text-amber-200">{error}</span>}
  </span>;
}
