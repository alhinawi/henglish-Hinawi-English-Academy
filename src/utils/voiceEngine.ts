// ==============================================================================
// Henglish Academy (HENGLISH) - MULTI-TIER VOICE SYNTHESIS & SEQUENTIAL AUDIO QUEUE
// Preserves beloved original female voice + upgraded natural male voice
// Manifest-gated ElevenLabs proxy, then an explicit same-language Microsoft browser voice
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
let speechGeneration = 0;
let synthesisController: AbortController | null = null;
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
  availableVoices = window.speechSynthesis.getVoices().filter(v => /\bmicrosoft\b/i.test(v.name) && !/google/i.test(v.name));
  return availableVoices;
}

export function hasMicrosoftBrowserVoice(language = 'en'): boolean {
  const requested = language.toLowerCase().split(/[-_]/)[0];
  return loadVoices().some(voice => voice.lang.toLowerCase().split(/[-_]/)[0] === requested);
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
  speechGeneration++;
  synthesisController?.abort();
  synthesisController = null;
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
function speakViaBrowserSpeech(text: string, options?: SpeakOptions, generation = speechGeneration): void {
  if (generation !== speechGeneration) return;
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

    const voice = gender === 'female' ? getPreservedFemaleVoice(accent) : getUpgradedMaleVoice(accent);
    // Never leave voice unset: the OS default may be Google or an unknown vendor.
    if (!voice) { notifyState(false, ''); options?.onError?.(); return; }
    utterance.voice = voice;
    utterance.pitch = options?.pitch ?? (gender === 'female' ? 1.0 : 0.94);

    utterance.onstart = () => {
      if (generation !== speechGeneration) return;
      currentUtterance = utterance;
      notifyState(true, text);
    };

    utterance.onend = () => {
      if (generation !== speechGeneration) return;
      currentUtterance = null;
      notifyState(false, '');
      if (options?.onEnd) options.onEnd();
      if (options?.onEnded) options.onEnded();
    };

    utterance.onerror = () => {
      if (generation !== speechGeneration) return;
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
  if (typeof window === 'undefined' || currentSettings.isMuted) return;
  const trimmed = text.trim();
  if (!trimmed) return;
  lastSpokenText = trimmed;
  stopSpeech();
  const generation = speechGeneration;
  const isCurrent = () => generation === speechGeneration;
  const gender = options?.gender || currentSettings.gender;
  const accent = options?.accent || currentSettings.accent;
  const speed = options?.speed || currentSettings.speed;
  const voiceId = options?.voiceId || currentSettings.selectedVoiceId;
  const cacheKey = `${trimmed}_${voiceId || `${accent}_${gender}`}_${speed}`;
  let fallbackStarted = false;
  const fallback = () => {
    if (!isCurrent() || fallbackStarted) return;
    fallbackStarted = true;
    if (currentHtmlAudio) { currentHtmlAudio.pause(); currentHtmlAudio = null; }
    speakViaBrowserSpeech(trimmed, options, generation);
  };
  const playAudio = (src: string) => {
    if (!isCurrent()) return;
    const audio = new Audio(src);
    currentHtmlAudio = audio;
    audio.playbackRate = speed;
    audio.onplay = () => { if (isCurrent() && currentHtmlAudio === audio) notifyState(true, trimmed); };
    audio.onended = () => {
      if (!isCurrent() || currentHtmlAudio !== audio) return;
      currentHtmlAudio = null;
      notifyState(false, '');
      options?.onEnd?.();
      options?.onEnded?.();
    };
    audio.onerror = fallback;
    audio.play().catch(fallback);
  };
  const cached = clientAudioBlobCache.get(cacheKey);
  if (cached) { playAudio(cached); return; }
  const controller = new AbortController();
  synthesisController = controller;
  fetch('/api/tts/synthesize', {
    signal: controller.signal,
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: trimmed, accent, gender, speed, voiceId }),
  })
    .then(res => { if (!isCurrent()) return null; return res.json(); })
    .then(data => {
      if (!isCurrent()) return;
      synthesisController = null;
      if (data?.audioBase64) {
        const src = `data:${data.mimeType || 'audio/mpeg'};base64,${data.audioBase64}`;
        clientAudioBlobCache.set(cacheKey, src);
        playAudio(src);
      } else fallback();
    })
    .catch(() => { if (isCurrent()) { synthesisController = null; fallback(); } });
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
  private isStopped = true;
  private generation = 0;
  private releaseWait: (() => void) | null = null;
  private resumeWait: (() => void) | null = null;
  private gapTimer: ReturnType<typeof setTimeout> | null = null;
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

    await this.processNextSentence(this.generation);
  }

  private async processNextSentence(generation: number): Promise<void> {
    const isCurrent = () => generation === this.generation && !this.isStopped;
    while (isCurrent() && this.currentIndex < this.queue.length) {
      if (this.isPaused) await new Promise<void>(resolve => { this.resumeWait = resolve; });
      if (!isCurrent()) return;
      const currentItem = this.queue[this.currentIndex];
      this.onSentenceChange?.(this.currentIndex);
      await new Promise<void>(resolve => {
        const finish = () => { if (this.releaseWait === finish) this.releaseWait = null; resolve(); };
        this.releaseWait = finish;
        speakEnglishVoice(currentItem.text, {
          gender: currentItem.gender, accent: currentItem.accent,
          onEnd: finish, onError: finish,
        });
      });
      if (!isCurrent()) return;
      this.currentIndex++;
      // Preserve the existing natural pause, but let Stop settle it immediately.
      await new Promise<void>(resolve => {
        const finish = () => { if (this.releaseWait === finish) this.releaseWait = null; resolve(); };
        this.releaseWait = finish;
        this.gapTimer = setTimeout(() => { this.gapTimer = null; finish(); }, 300);
      });
    }
    if (!isCurrent()) return;
    this.isStopped = true;
    const finished = this.onQueueFinished;
    this.onQueueFinished = undefined;
    finished?.();
  }

  public stop(): void {
    this.generation++;
    const wasActive = !this.isStopped;
    this.isStopped = true;
    this.isPaused = false;
    this.queue = [];
    if (this.gapTimer !== null) clearTimeout(this.gapTimer);
    this.gapTimer = null;
    this.releaseWait?.();
    this.releaseWait = null;
    this.resumeWait?.();
    this.resumeWait = null;
    stopSpeech();
    const finished = this.onQueueFinished;
    this.onQueueFinished = undefined;
    if (wasActive) finished?.();
  }

  public pause(): void {
    if (this.isStopped) return;
    this.isPaused = true;
    pauseSpeech();
  }

  public resume(): void {
    if (this.isStopped || !this.isPaused) return;
    this.isPaused = false;
    this.resumeWait?.();
    this.resumeWait = null;
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
export function speakMultilingualText(text: string, langCode: string = 'en', onEndOrOptions?: (() => void) | SpeakOptions): void {
  const options = typeof onEndOrOptions === 'function' ? { onEnd: onEndOrOptions } : onEndOrOptions;
  if (typeof window === 'undefined') { options?.onError?.(); return; }
  if (currentSettings.isMuted) return;

  const trimmed = text.trim();
  if (!trimmed) return;

  stopSpeech();

  // If language is English, we can use our enhanced speakEnglishVoice
  if (langCode === 'en' || langCode.startsWith('en-')) {
    speakEnglishVoice(trimmed, options);
    return;
  }

  const generation = speechGeneration;
  // Otherwise, use browser SpeechSynthesis with the matching language voice
  try {
    const utterance = new SpeechSynthesisUtterance(trimmed);
    const voices = loadVoices();
    const language = langCode.toLowerCase().replace('_', '-');
    const targetVoice = voices.find(v => v.lang.toLowerCase().replace('_', '-') === language)
      || voices.find(v => v.lang.toLowerCase().split(/[-_]/)[0] === language.split('-')[0]);
    if (!targetVoice) { notifyState(false, ''); options?.onError?.(); return; }
    utterance.voice = targetVoice;
    utterance.lang = langCode;
    utterance.rate = options?.speed ?? 0.95;

    utterance.onstart = () => { if (generation === speechGeneration) notifyState(true, trimmed); };
    utterance.onend = () => {
      if (generation !== speechGeneration) return;
      notifyState(false, '');
      options?.onEnd?.();
      options?.onEnded?.();
    };
    utterance.onerror = () => {
      if (generation !== speechGeneration) return;
      notifyState(false, '');
      options?.onError?.();
    };

    window.speechSynthesis.speak(utterance);
  } catch (err) {
    console.warn('Speech synthesis error:', err);
    notifyState(false, '');
    options?.onError?.();
  }
}
