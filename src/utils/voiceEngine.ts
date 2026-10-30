export type VoiceGender = 'female' | 'male';
export type VoiceAccent = 'US' | 'UK';
export type SpeechSpeed = 0.75 | 0.92 | 1.0 | 1.25;

export interface VoiceSettings {
  gender: VoiceGender;
  accent: VoiceAccent;
  speed: SpeechSpeed;
  isMuted: boolean;
}

const STORAGE_KEY = 'henglish_voice_settings';

// Load stored settings or provide defaults (Female default preserved exactly as is)
export function getSavedVoiceSettings(): VoiceSettings {
  if (typeof window === 'undefined') {
    return { gender: 'female', accent: 'US', speed: 0.92, isMuted: false };
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {
    // fallback
  }
  return { gender: 'female', accent: 'US', speed: 0.92, isMuted: false };
}

export function saveVoiceSettings(settings: VoiceSettings): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch {
    // ignore
  }
}

let currentSettings: VoiceSettings = getSavedVoiceSettings();
let lastSpokenText: string = '';
let currentUtterance: SpeechSynthesisUtterance | null = null;
let speechStateListeners: Array<(isPlaying: boolean, text: string) => void> = [];

export function subscribeSpeechState(listener: (isPlaying: boolean, text: string) => void): () => void {
  speechStateListeners.push(listener);
  return () => {
    speechStateListeners = speechStateListeners.filter(l => l !== listener);
  };
}

function notifyState(isPlaying: boolean, text: string) {
  speechStateListeners.forEach(l => l(isPlaying, text));
}

// Ensure voices are loaded in Chromium/Safari/Firefox
let availableVoices: SpeechSynthesisVoice[] = [];
function loadVoices(): SpeechSynthesisVoice[] {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return [];
  availableVoices = window.speechSynthesis.getVoices();
  return availableVoices;
}

if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  loadVoices();
  window.speechSynthesis.onvoiceschanged = () => {
    loadVoices();
  };
}

/**
 * Female voice picker:
 * EXACT preservation of the original female voice logic that the user loves.
 */
function getPreservedFemaleVoice(accent: VoiceAccent): SpeechSynthesisVoice | null {
  const voices = availableVoices.length > 0 ? availableVoices : loadVoices();
  const langPrefix = accent === 'UK' ? 'en-GB' : 'en-US';

  // 1. Check for specific natural female voices
  const preferredFemale = voices.find(v => 
    (v.lang.startsWith(langPrefix) || v.lang.startsWith('en')) &&
    (v.name.includes('Samantha') || 
     v.name.includes('Google US English') || 
     v.name.includes('Zira') || 
     v.name.includes('Victoria') ||
     v.name.includes('Natural') && v.name.includes('Jenny') ||
     v.name.includes('Natural') && v.name.includes('Aria') ||
     v.name.toLowerCase().includes('female'))
  );
  if (preferredFemale) return preferredFemale;

  // Fallback to any en voice that isn't clearly male
  const anyNonMale = voices.find(v => 
    (v.lang.startsWith(langPrefix) || v.lang.startsWith('en')) &&
    !v.name.toLowerCase().includes('male') &&
    !v.name.toLowerCase().includes('david') &&
    !v.name.toLowerCase().includes('george')
  );

  return anyNonMale || voices.find(v => v.lang.startsWith('en')) || null;
}

/**
 * Male voice picker:
 * VASTLY IMPROVED natural, warm, native-sounding male pronunciation.
 * Priority: Microsoft Natural / Google High-Quality Male / Daniel Enhanced / Guy / Christopher / Oliver.
 */
function getUpgradedMaleVoice(accent: VoiceAccent): SpeechSynthesisVoice | null {
  const voices = availableVoices.length > 0 ? availableVoices : loadVoices();
  const langPrefix = accent === 'UK' ? 'en-GB' : 'en-US';

  // High-priority male voices (Natural, Neural, Studio quality)
  const maleKeywords = [
    'guy online (natural)',
    'christopher online (natural)',
    'ryan online (natural)',
    'guyneural',
    'ryanneural',
    'georgeneural',
    'google uk english male',
    'google us english male',
    'daniel (enhanced)',
    'daniel',
    'oliver',
    'george',
    'arthur',
    'microsoft david',
    'alex',
    'fred',
    'male'
  ];

  for (const keyword of maleKeywords) {
    const match = voices.find(v => 
      v.lang.startsWith(langPrefix) && v.name.toLowerCase().includes(keyword)
    );
    if (match) return match;
  }

  // Check any english voice matching keyword if accent-specific didn't match
  for (const keyword of maleKeywords) {
    const match = voices.find(v => 
      v.lang.startsWith('en') && v.name.toLowerCase().includes(keyword)
    );
    if (match) return match;
  }

  // Fallback to generic male
  const genericMale = voices.find(v => 
    v.lang.startsWith('en') && v.name.toLowerCase().includes('male')
  );
  if (genericMale) return genericMale;

  return voices.find(v => v.lang.startsWith('en')) || null;
}

export function setVoiceGender(gender: VoiceGender): void {
  currentSettings.gender = gender;
  saveVoiceSettings(currentSettings);
}

export function setVoiceAccent(accent: VoiceAccent): void {
  currentSettings.accent = accent;
  saveVoiceSettings(currentSettings);
}

export function setVoiceSpeed(speed: SpeechSpeed): void {
  currentSettings.speed = speed;
  saveVoiceSettings(currentSettings);
}

export function toggleAudioMute(): boolean {
  currentSettings.isMuted = !currentSettings.isMuted;
  saveVoiceSettings(currentSettings);
  if (currentSettings.isMuted && typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    notifyState(false, '');
  }
  return currentSettings.isMuted;
}

export function getVoiceSettings(): VoiceSettings {
  return { ...currentSettings };
}

export function stopSpeech(): void {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    notifyState(false, '');
  }
}

export function pauseSpeech(): void {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.pause();
    notifyState(false, lastSpokenText);
  }
}

export function resumeSpeech(): void {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.resume();
    notifyState(true, lastSpokenText);
  }
}

export function replaySpeech(): void {
  if (lastSpokenText) {
    speakEnglishVoice(lastSpokenText);
  }
}

export interface SpeakOptions {
  gender?: VoiceGender;
  accent?: VoiceAccent;
  speed?: SpeechSpeed;
  pitch?: number;
  onEnd?: () => void;
}

export function speakEnglishVoice(text: string, options?: SpeakOptions): void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return;
  }

  if (currentSettings.isMuted) {
    return;
  }

  try {
    window.speechSynthesis.cancel(); // Stop active playback

    const trimmed = text.trim();
    if (!trimmed) return;
    lastSpokenText = trimmed;

    const gender = options?.gender || currentSettings.gender;
    const accent = options?.accent || currentSettings.accent;
    const speed = options?.speed || currentSettings.speed;

    const utterance = new SpeechSynthesisUtterance(trimmed);
    utterance.lang = accent === 'UK' ? 'en-GB' : 'en-US';
    utterance.rate = speed;

    if (gender === 'female') {
      // PRESERVED FEMALE VOICE: exactly as previous implementation
      const femaleVoice = getPreservedFemaleVoice(accent);
      if (femaleVoice) {
        utterance.voice = femaleVoice;
      }
      utterance.pitch = options?.pitch ?? 1.0;
    } else {
      // UPGRADED MALE VOICE: natural, warm acoustic balance
      const maleVoice = getUpgradedMaleVoice(accent);
      if (maleVoice) {
        utterance.voice = maleVoice;
      }
      // Tune pitch slightly warmer (0.94) to eliminate mechanical tone
      utterance.pitch = options?.pitch ?? 0.94;
    }

    utterance.onstart = () => {
      currentUtterance = utterance;
      notifyState(true, trimmed);
    };

    utterance.onend = () => {
      currentUtterance = null;
      notifyState(false, '');
      if (options?.onEnd) options.onEnd();
    };

    utterance.onerror = () => {
      currentUtterance = null;
      notifyState(false, '');
    };

    window.speechSynthesis.speak(utterance);
  } catch (err) {
    console.warn('SpeechSynthesis error:', err);
    notifyState(false, '');
  }
}
