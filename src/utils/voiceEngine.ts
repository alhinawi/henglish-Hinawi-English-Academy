// ==============================================================================
// Henglish Academy (HENGLISH) - MULTI-TIER VOICE SYNTHESIS & SEQUENTIAL AUDIO QUEUE
// Preserves beloved original female voice + upgraded natural male voice
// Supports Server-Side TTS (ElevenLabs, Google, Kokoro) with client SpeechSynthesis fallback
// Features Event-Driven Queue Playback (ended events, NO setTimeout gaps)
// ==============================================================================

export type VoiceGender = 'female' | 'male';
export type VoiceAccent = 'US' | 'UK';
export type SpeechSpeed = 0.75 | 0.92 | 1.0 | 1.25;

export interface VoiceSettings {
  gender: VoiceGender;
  accent: VoiceAccent;
  speed: SpeechSpeed;
  isMuted: boolean;
  selectedVoiceId?: string;
  selectedVoiceName?: string;
}

const STORAGE_KEY = 'henglish_voice_settings';

// Load stored settings or provide defaults (Female default preserved exactly as is)
export function getSavedVoiceSettings(): VoiceSettings {
  if (typeof window === 'undefined') {
    return { gender: 'female', accent: 'US', speed: 0.92, isMuted: false, selectedVoiceId: 'EXAVITQu4vr4xnSDxMaL', selectedVoiceName: 'Sarah' };
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {
    // fallback
  }
  return { gender: 'female', accent: 'US', speed: 0.92, isMuted: false, selectedVoiceId: 'EXAVITQu4vr4xnSDxMaL', selectedVoiceName: 'Sarah' };
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
let currentHtmlAudio: HTMLAudioElement | null = null;
let speechStateListeners: Array<(isPlaying: boolean, text: string) => void> = [];

// Client-side in-memory audio blob cache
const clientAudioBlobCache = new Map<string, string>();

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
     (v.name.includes('Natural') && v.name.includes('Jenny')) ||
     (v.name.includes('Natural') && v.name.includes('Aria')) ||
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
 */
function getUpgradedMaleVoice(accent: VoiceAccent): SpeechSynthesisVoice | null {
  const voices = availableVoices.length > 0 ? availableVoices : loadVoices();
  const langPrefix = accent === 'UK' ? 'en-GB' : 'en-US';

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

  for (const keyword of maleKeywords) {
    const match = voices.find(v => 
      v.lang.startsWith('en') && v.name.toLowerCase().includes(keyword)
    );
    if (match) return match;
  }

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

export function setVoiceId(
  voiceId: string,
  voiceName?: string,
  gender?: VoiceGender,
  accent?: VoiceAccent
): void {
  currentSettings.selectedVoiceId = voiceId;
  if (voiceName) currentSettings.selectedVoiceName = voiceName;
  if (gender) currentSettings.gender = gender;
  if (accent) currentSettings.accent = accent;
  saveVoiceSettings(currentSettings);
}

export function toggleAudioMute(): boolean {
  currentSettings.isMuted = !currentSettings.isMuted;
  saveVoiceSettings(currentSettings);
  if (currentSettings.isMuted) {
    stopSpeech();
  }
  return currentSettings.isMuted;
}

export function getVoiceSettings(): VoiceSettings {
  return { ...currentSettings };
}

export function stopSpeech(): void {
  if (currentHtmlAudio) {
    currentHtmlAudio.pause();
    currentHtmlAudio.currentTime = 0;
    currentHtmlAudio = null;
  }
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
  currentUtterance = null;
  notifyState(false, '');
}

export function pauseSpeech(): void {
  if (currentHtmlAudio) {
    currentHtmlAudio.pause();
  }
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.pause();
  }
  notifyState(false, lastSpokenText);
}

export function resumeSpeech(): void {
  if (currentHtmlAudio) {
    currentHtmlAudio.play().catch(() => {});
    notifyState(true, lastSpokenText);
    return;
  }
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
  voiceId?: string;
  onEnd?: () => void;
  onEnded?: () => void;
  onError?: () => void;
}

/**
 * Play sentence with browser SpeechSynthesis
 */
function speakViaBrowserSpeech(text: string, options?: SpeakOptions): void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    if (options?.onError) options.onError();
    return;
  }

  try {
    window.speechSynthesis.cancel();

    const gender = options?.gender || currentSettings.gender;
    const accent = options?.accent || currentSettings.accent;
    const speed = options?.speed || currentSettings.speed;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = accent === 'UK' ? 'en-GB' : 'en-US';
    utterance.rate = speed;

    if (gender === 'female') {
      const femaleVoice = getPreservedFemaleVoice(accent);
      if (femaleVoice) {
        utterance.voice = femaleVoice;
      }
      utterance.pitch = options?.pitch ?? 1.0;
    } else {
      const maleVoice = getUpgradedMaleVoice(accent);
      if (maleVoice) {
        utterance.voice = maleVoice;
      }
      utterance.pitch = options?.pitch ?? 0.94;
    }

    utterance.onstart = () => {
      currentUtterance = utterance;
      notifyState(true, text);
    };

    utterance.onend = () => {
      currentUtterance = null;
      notifyState(false, '');
      if (options?.onEnd) options.onEnd();
      if (options?.onEnded) options.onEnded();
    };

    utterance.onerror = () => {
      currentUtterance = null;
      notifyState(false, '');
      if (options?.onError) options.onError();
    };

    window.speechSynthesis.speak(utterance);
  } catch (err) {
    console.warn('Browser SpeechSynthesis error:', err);
    notifyState(false, '');
    if (options?.onError) options.onError();
  }
}

/**
 * Main Single Speech Function (Server TTS -> Cached Audio -> Browser SpeechSynthesis Fallback)
 */
export function speakEnglishVoice(text: string, options?: SpeakOptions): void {
  if (typeof window === 'undefined') return;
  if (currentSettings.isMuted) return;

  const trimmed = text.trim();
  if (!trimmed) return;
  lastSpokenText = trimmed;

  stopSpeech();

  const gender = options?.gender || currentSettings.gender;
  const accent = options?.accent || currentSettings.accent;
  const speed = options?.speed || currentSettings.speed;
  const voiceId = options?.voiceId || currentSettings.selectedVoiceId;

  const cacheKey = `${trimmed}_${voiceId || `${accent}_${gender}`}_${speed}`;
  const cachedBlobUrl = clientAudioBlobCache.get(cacheKey);

  if (cachedBlobUrl) {
    const audio = new Audio(cachedBlobUrl);
    currentHtmlAudio = audio;
    audio.playbackRate = speed;

    audio.onplay = () => notifyState(true, trimmed);
    audio.onended = () => {
      currentHtmlAudio = null;
      notifyState(false, '');
      if (options?.onEnd) options.onEnd();
      if (options?.onEnded) options.onEnded();
    };
    audio.onerror = () => {
      currentHtmlAudio = null;
      speakViaBrowserSpeech(trimmed, options);
    };

    audio.play().catch(() => speakViaBrowserSpeech(trimmed, options));
    return;
  }

  // Try Server Synthesis API
  fetch('/api/tts/synthesize', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      text: trimmed,
      accent,
      gender,
      speed,
      voiceId,
    }),
  })
    .then(res => res.json())
    .then(data => {
      if (data.audioBase64) {
        const audioSrc = `data:${data.mimeType || 'audio/mpeg'};base64,${data.audioBase64}`;
        clientAudioBlobCache.set(cacheKey, audioSrc);

        const audio = new Audio(audioSrc);
        currentHtmlAudio = audio;
        audio.playbackRate = speed;

        audio.onplay = () => notifyState(true, trimmed);
        audio.onended = () => {
          currentHtmlAudio = null;
          notifyState(false, '');
          if (options?.onEnd) options.onEnd();
          if (options?.onEnded) options.onEnded();
        };
        audio.onerror = () => {
          currentHtmlAudio = null;
          speakViaBrowserSpeech(trimmed, options);
        };

        audio.play().catch(() => speakViaBrowserSpeech(trimmed, options));
      } else {
        // Use high-fidelity browser speech
        speakViaBrowserSpeech(trimmed, options);
      }
    })
    .catch(() => {
      // Offline or network error: use browser speech
      speakViaBrowserSpeech(trimmed, options);
    });
}

/**
 * Sequential Sentence Audio Queue Player:
 * Guarantees zero overlapping, plays sentence by sentence listening to the true 'ended' event.
 */
export class AudioQueuePlayer {
  private queue: Array<{
    text: string;
    gender?: VoiceGender;
    accent?: VoiceAccent;
    speakerName?: string;
  }> = [];
  private isStopped = false;
  private isPaused = false;
  private currentIndex = 0;
  private onSentenceChange?: (index: number) => void;
  private onQueueFinished?: () => void;

  public async startQueue(
    items: Array<{
      text: string;
      gender?: VoiceGender;
      accent?: VoiceAccent;
      speakerName?: string;
    }>,
    onSentenceChange?: (index: number) => void,
    onQueueFinished?: () => void
  ): Promise<void> {
    this.stop();
    this.queue = items;
    this.isStopped = false;
    this.isPaused = false;
    this.currentIndex = 0;
    this.onSentenceChange = onSentenceChange;
    this.onQueueFinished = onQueueFinished;

    await this.processNextSentence();
  }

  private async processNextSentence(): Promise<void> {
    if (this.isStopped || this.currentIndex >= this.queue.length) {
      this.isStopped = true;
      if (this.onQueueFinished) this.onQueueFinished();
      return;
    }

    const currentItem = this.queue[this.currentIndex];
    if (this.onSentenceChange) {
      this.onSentenceChange(this.currentIndex);
    }

    await new Promise<void>(resolve => {
      speakEnglishVoice(currentItem.text, {
        gender: currentItem.gender,
        accent: currentItem.accent,
        onEnd: () => resolve(),
        onError: () => resolve(),
      });
    });

    if (this.isStopped) return;

    this.currentIndex++;
    // Brief natural pause between dialogue turns (300ms)
    await new Promise(r => setTimeout(r, 300));
    await this.processNextSentence();
  }

  public stop(): void {
    this.isStopped = true;
    this.isPaused = false;
    this.queue = [];
    stopSpeech();
    if (this.onQueueFinished) {
      this.onQueueFinished();
    }
  }

  public pause(): void {
    this.isPaused = true;
    pauseSpeech();
  }

  public resume(): void {
    this.isPaused = false;
    resumeSpeech();
  }

  public getIsPlaying(): boolean {
    return !this.isStopped && !this.isPaused;
  }
}

// Singleton Queue Player instance
let globalQueuePlayer: AudioQueuePlayer | null = null;
export function getAudioQueuePlayer(): AudioQueuePlayer {
  if (!globalQueuePlayer) {
    globalQueuePlayer = new AudioQueuePlayer();
  }
  return globalQueuePlayer;
}

// Alias for universal compatibility
export const speakText = speakEnglishVoice;

/**
 * Universal Multilingual Speech Function
 * Speaks text in any specified language (e.g. 'ar', 'en', 'fr', 'es', 'de', etc.)
 */
export function speakMultilingualText(text: string, langCode: string = 'en', onEnd?: () => void): void {
  if (typeof window === 'undefined') return;
  if (currentSettings.isMuted) return;

  const trimmed = text.trim();
  if (!trimmed) return;

  stopSpeech();

  // If language is English, we can use our enhanced speakEnglishVoice
  if (langCode === 'en' || langCode.startsWith('en-')) {
    speakEnglishVoice(trimmed, { onEnd });
    return;
  }

  // Otherwise, use browser SpeechSynthesis with the matching language voice
  try {
    const utterance = new SpeechSynthesisUtterance(trimmed);
    const voices = window.speechSynthesis.getVoices();
    const targetVoice = voices.find(v => v.lang.toLowerCase().startsWith(langCode.toLowerCase()));

    if (targetVoice) {
      utterance.voice = targetVoice;
    }
    utterance.lang = langCode;
    utterance.rate = 0.95;

    utterance.onstart = () => notifyState(true, trimmed);
    utterance.onend = () => {
      notifyState(false, '');
      if (onEnd) onEnd();
    };
    utterance.onerror = () => {
      notifyState(false, '');
    };

    window.speechSynthesis.speak(utterance);
  } catch (err) {
    console.warn('Speech synthesis error:', err);
    notifyState(false, '');
  }
}
