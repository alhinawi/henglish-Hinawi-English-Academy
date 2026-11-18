// ==============================================================================
// Henglish Academy (HENGLISH) - MULTI-TIER VOICE SYNTHESIS & SEQUENTIAL AUDIO QUEUE
// Preserves beloved original female voice + upgraded natural male voice
// Supports Server-Side TTS (ElevenLabs, Google, Kokoro) with client SpeechSynthesis fallback
// Features Event-Driven Queue Playback (ended events, NO setTimeout gaps)
// ==============================================================================

// Ready-made English lesson audio is played synchronously from the user tap.
// Browser voices are not required. Extend only with verified local recordings.
export const STATIC_ENGLISH_AUDIO: Record<string, string> = {
  "What is your name?": "/audio/english/conversation-01-line-1.mp3",
  "My name is Salma. Nice to meet you.": "/audio/english/conversation-01-line-2.mp3",
  "Nice to meet you too. Are you a student?": "/audio/english/conversation-01-line-3.mp3",
  "Yes, I study English.": "/audio/english/conversation-01-line-4.mp3",
  "Who is this?": "/audio/english/conversation-02-line-1.mp3",
  "This is my friend Omar.": "/audio/english/conversation-02-line-2.mp3",
  "Hello, Omar. Where are you from?": "/audio/english/conversation-02-line-3.mp3",
  "I am from Cairo.": "/audio/english/conversation-02-line-4.mp3",
  "Can you spell your surname?": "/audio/english/conversation-03-line-1.mp3",
  "Yes. It is H-A-S-S-A-N.": "/audio/english/conversation-03-line-2.mp3",
  "Thank you. Please write it here.": "/audio/english/conversation-03-line-3.mp3",
  "Of course.": "/audio/english/conversation-03-line-4.mp3",
  "Please turn to page fourteen.": "/audio/english/conversation-04-line-1.mp3",
  "Could you say that again, please?": "/audio/english/conversation-04-line-2.mp3",
  "Page fourteen. One four.": "/audio/english/conversation-04-line-3.mp3",
  "Thank you. I understand now.": "/audio/english/conversation-04-line-4.mp3",
  "What time do you get up?": "/audio/english/conversation-05-line-1.mp3",
  "I get up at seven every day.": "/audio/english/conversation-05-line-2.mp3",
  "Do you have breakfast at home?": "/audio/english/conversation-05-line-3.mp3",
  "Yes, I usually have eggs.": "/audio/english/conversation-05-line-4.mp3",
  "What do you like reading?": "/audio/english/conversation-06-line-1.mp3",
  "I like reading short stories.": "/audio/english/conversation-06-line-2.mp3",
  "Do you read every evening?": "/audio/english/conversation-06-line-3.mp3",
  "Yes, before I go to bed.": "/audio/english/conversation-06-line-4.mp3",
  "Are you free this afternoon?": "/audio/english/conversation-07-line-1.mp3",
  "Yes. Shall we study together?": "/audio/english/conversation-07-line-2.mp3",
  "Good idea. At the library?": "/audio/english/conversation-07-line-3.mp3",
  "Yes, see you there at three.": "/audio/english/conversation-07-line-4.mp3",
  "What do you do in your free time?": "/audio/english/conversation-08-line-1.mp3",
  "I write stories in my notebook.": "/audio/english/conversation-08-line-2.mp3",
  "That sounds interesting. How often?": "/audio/english/conversation-08-line-3.mp3",
  "Every weekend.": "/audio/english/conversation-08-line-4.mp3",
  "May I see your passport, please?": "/audio/english/conversation-09-line-1.mp3",
  "Here you are. Is this the right queue?": "/audio/english/conversation-09-line-2.mp3",
  "Yes. Where are you flying today?": "/audio/english/conversation-09-line-3.mp3",
  "I am flying to London.": "/audio/english/conversation-09-line-4.mp3",
  "Excuse me, where is gate twelve?": "/audio/english/conversation-10-line-1.mp3",
  "Go straight ahead and turn left.": "/audio/english/conversation-10-line-2.mp3",
  "Is it near the coffee shop?": "/audio/english/conversation-10-line-3.mp3",
  "Yes, just past it.": "/audio/english/conversation-10-line-4.mp3",
  "Shall we meet in the city centre?": "/audio/english/conversation-11-line-1.mp3",
  "Could we meet at the station instead?": "/audio/english/conversation-11-line-2.mp3",
  "Sure. Would five o'clock suit you?": "/audio/english/conversation-11-line-3.mp3",
  "Yes, that works for me.": "/audio/english/conversation-11-line-4.mp3",
  "How much are these tomatoes?": "/audio/english/conversation-12-line-1.mp3",
  "They are twenty pounds a kilo.": "/audio/english/conversation-12-line-2.mp3",
  "I would like half a kilo, please.": "/audio/english/conversation-12-line-3.mp3",
  "Certainly. Anything else?": "/audio/english/conversation-12-line-4.mp3",
  "How long have you had this cough?": "/audio/english/conversation-13-line-1.mp3",
  "I have had it since Monday.": "/audio/english/conversation-13-line-2.mp3",
  "Do you have any other symptoms?": "/audio/english/conversation-13-line-3.mp3",
  "I also have a sore throat.": "/audio/english/conversation-13-line-4.mp3",
  "How was your weekend?": "/audio/english/conversation-14-line-1.mp3",
  "I visited a museum with my sister.": "/audio/english/conversation-14-line-2.mp3",
  "What did you enjoy most?": "/audio/english/conversation-14-line-3.mp3",
  "The old maps were amazing.": "/audio/english/conversation-14-line-4.mp3",
  "Have you finished your revision yet?": "/audio/english/conversation-15-line-1.mp3",
  "Not yet, but I have reviewed two chapters.": "/audio/english/conversation-15-line-2.mp3",
  "Would you like to revise together?": "/audio/english/conversation-15-line-3.mp3",
  "Yes, that would help.": "/audio/english/conversation-15-line-4.mp3",
  "What are you going to do after graduation?": "/audio/english/conversation-16-line-1.mp3",
  "I am going to apply for a teaching job.": "/audio/english/conversation-16-line-2.mp3",
  "That sounds exciting. Where?": "/audio/english/conversation-16-line-3.mp3",
  "At a local language school.": "/audio/english/conversation-16-line-4.mp3",
  "I started learning Italian last month.": "/audio/english/conversation-17-line-1.mp3",
  "Really? What made you choose Italian?": "/audio/english/conversation-17-line-2.mp3",
  "I want to visit my cousins in Rome.": "/audio/english/conversation-17-line-3.mp3",
  "That sounds like a good reason.": "/audio/english/conversation-17-line-4.mp3",
  "I find it hard to study after work.": "/audio/english/conversation-18-line-1.mp3",
  "Why don't you try a short session before work?": "/audio/english/conversation-18-line-2.mp3",
  "That might work. How long should I study?": "/audio/english/conversation-18-line-3.mp3",
  "Start with fifteen minutes.": "/audio/english/conversation-18-line-4.mp3",
  "You missed our meeting yesterday.": "/audio/english/conversation-19-line-1.mp3",
  "I am sorry. I should have let you know.": "/audio/english/conversation-19-line-2.mp3",
  "Thanks for saying that. Can we reschedule?": "/audio/english/conversation-19-line-3.mp3",
  "Yes. Would tomorrow afternoon work?": "/audio/english/conversation-19-line-4.mp3",
  "Why would you like to work here?": "/audio/english/conversation-20-line-1.mp3",
  "Your training programme matches my career goals.": "/audio/english/conversation-20-line-2.mp3",
  "Could you give us an example?": "/audio/english/conversation-20-line-3.mp3",
  "I want to develop my classroom skills.": "/audio/english/conversation-20-line-4.mp3",
  "How is the website coming along?": "/audio/english/conversation-21-line-1.mp3",
  "We have finished the design, but testing is still in progress.": "/audio/english/conversation-21-line-2.mp3",
  "What do you need from us?": "/audio/english/conversation-21-line-3.mp3",
  "Feedback on the mobile layout, please.": "/audio/english/conversation-21-line-4.mp3",
  "Could you take care of the slides?": "/audio/english/conversation-22-line-1.mp3",
  "Yes, as long as you send me the figures today.": "/audio/english/conversation-22-line-2.mp3",
  "That is fine. I will send them by noon.": "/audio/english/conversation-22-line-3.mp3",
  "Great. I will start after lunch.": "/audio/english/conversation-22-line-4.mp3",
  "Will the report be ready by Friday?": "/audio/english/conversation-23-line-1.mp3",
  "Yes. We will have completed it by Thursday evening.": "/audio/english/conversation-23-line-2.mp3",
  "Will there be time for a final check?": "/audio/english/conversation-23-line-3.mp3",
  "Yes, we have allowed an extra day.": "/audio/english/conversation-23-line-4.mp3",
  "What happens when you open the file?": "/audio/english/conversation-24-line-1.mp3",
  "An error message appears, and the screen goes blank.": "/audio/english/conversation-24-line-2.mp3",
  "Have you tried restarting the application?": "/audio/english/conversation-24-line-3.mp3",
  "Yes, but the problem is still there.": "/audio/english/conversation-24-line-4.mp3",
  "We should cancel all face-to-face meetings.": "/audio/english/conversation-25-line-1.mp3",
  "I see your point, but some discussions work better in person.": "/audio/english/conversation-25-line-2.mp3",
  "Which discussions do you have in mind?": "/audio/english/conversation-25-line-3.mp3",
  "Sensitive feedback and team planning.": "/audio/english/conversation-25-line-4.mp3",
  "The only solution is to hire more staff.": "/audio/english/conversation-26-line-1.mp3",
  "Have we considered improving the booking system first?": "/audio/english/conversation-26-line-2.mp3",
  "How would that help?": "/audio/english/conversation-26-line-3.mp3",
  "It could reduce the time spent on routine tasks.": "/audio/english/conversation-26-line-4.mp3",
  "Should we move the course online?": "/audio/english/conversation-27-line-1.mp3",
  "On the one hand, it is flexible; on the other hand, some learners need classroom support.": "/audio/english/conversation-27-line-2.mp3",
  "Could we offer both formats?": "/audio/english/conversation-27-line-3.mp3",
  "Yes, a mixed approach might work.": "/audio/english/conversation-27-line-4.mp3",
  "We need the whole budget for advertising.": "/audio/english/conversation-28-line-1.mp3",
  "What if we split it between advertising and training?": "/audio/english/conversation-28-line-2.mp3",
  "I could agree to that if we review the results next month.": "/audio/english/conversation-28-line-3.mp3",
  "That seems fair.": "/audio/english/conversation-28-line-4.mp3",
  "What will your presentation cover?": "/audio/english/conversation-29-line-1.mp3",
  "I will outline the problem, compare two options, and recommend a solution.": "/audio/english/conversation-29-line-2.mp3",
  "How will you involve the audience?": "/audio/english/conversation-29-line-3.mp3",
  "I will begin with a short question.": "/audio/english/conversation-29-line-4.mp3",
  "The new design is more accessible.": "/audio/english/conversation-30-line-1.mp3",
  "Could you explain what you mean by accessible in this context?": "/audio/english/conversation-30-line-2.mp3",
  "The text is easier to read, and the buttons work with a keyboard.": "/audio/english/conversation-30-line-3.mp3",
  "Thank you. That makes it clearer.": "/audio/english/conversation-30-line-4.mp3",
  "Tell us about a difficult project.": "/audio/english/conversation-31-line-1.mp3",
  "Although we missed the first deadline, we used the feedback to improve the final result.": "/audio/english/conversation-31-line-2.mp3",
  "What did you learn from it?": "/audio/english/conversation-31-line-3.mp3",
  "To test our assumptions earlier.": "/audio/english/conversation-31-line-4.mp3",
  "How would you sum up the discussion?": "/audio/english/conversation-32-line-1.mp3",
  "We agree on the goal, but we still need to compare the costs before deciding.": "/audio/english/conversation-32-line-2.mp3",
  "What is the next step?": "/audio/english/conversation-32-line-3.mp3",
  "Let us gather the figures and meet again on Monday.": "/audio/english/conversation-32-line-4.mp3"
};

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
  const playAudio = (src: string, onFailure = fallback) => {
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
    let failed = false;
    const failOnce = () => { if (failed || !isCurrent()) return; failed = true; onFailure(); };
    audio.onerror = failOnce;
    audio.play().catch(failOnce);
  };
  const requestServerAudio = () => {
    if (!isCurrent()) return;
    if (currentHtmlAudio) { currentHtmlAudio.pause(); currentHtmlAudio = null; }
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
  };
  const readyClip = STATIC_ENGLISH_AUDIO[trimmed];
  if (readyClip) { playAudio(readyClip, requestServerAudio); return; }
  requestServerAudio();
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
