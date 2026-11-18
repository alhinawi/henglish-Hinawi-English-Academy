import { useEffect, useState } from 'react';
import { hasMicrosoftBrowserVoice } from '../utils/voiceEngine';

// Cloud/recorded audio remains usable even on devices with no Microsoft voice.
// Controls use this only after their normal audio request has failed.
export function useMicrosoftVoice(language = 'en'): boolean {
  const [available, setAvailable] = useState(() => hasMicrosoftBrowserVoice(language));
  useEffect(() => {
    const update = () => setAvailable(hasMicrosoftBrowserVoice(language));
    update();
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    window.speechSynthesis.addEventListener('voiceschanged', update);
    return () => window.speechSynthesis.removeEventListener('voiceschanged', update);
  }, [language]);
  return available;
}
