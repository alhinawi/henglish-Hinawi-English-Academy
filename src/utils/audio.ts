import confetti from 'canvas-confetti';
import { 
  speakEnglishVoice, 
  getVoiceSettings, 
  stopSpeech, 
  pauseSpeech, 
  resumeSpeech, 
  replaySpeech, 
  setVoiceGender, 
  setVoiceAccent, 
  setVoiceSpeed, 
  toggleAudioMute, 
  subscribeSpeechState,
  type VoiceGender,
  type VoiceAccent,
  type SpeechSpeed,
  type VoiceSettings,
  type SpeakOptions
} from './voiceEngine';

export {
  speakEnglishVoice,
  getVoiceSettings,
  stopSpeech,
  pauseSpeech,
  resumeSpeech,
  replaySpeech,
  setVoiceGender,
  setVoiceAccent,
  setVoiceSpeed,
  toggleAudioMute,
  subscribeSpeechState,
  type VoiceGender,
  type VoiceAccent,
  type SpeechSpeed,
  type VoiceSettings,
  type SpeakOptions
};

// Audio Context Singleton for instant feedback sound effects
let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function playSound(type: 'correct' | 'wrong' | 'click' | 'fanfare' | 'flip'): void {
  const settings = getVoiceSettings();
  if (settings.isMuted) return;

  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    if (type === 'correct') {
      // Pleasant high double chime (E5 -> G#5)
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = 'sine';
      osc2.type = 'sine';

      osc1.frequency.setValueAtTime(659.25, now); // E5
      osc1.frequency.setValueAtTime(830.61, now + 0.1); // G#5

      osc2.frequency.setValueAtTime(1318.51, now + 0.1); // E6 harmonic

      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start(now);
      osc2.start(now + 0.1);
      osc1.stop(now + 0.45);
      osc2.stop(now + 0.45);
    } else if (type === 'wrong') {
      // Gentle low double-thud buzz (not harsh)
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.setValueAtTime(180, now + 0.12);

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.35);
    } else if (type === 'click') {
      // Crisp subtle UI pop
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(400, now + 0.04);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.05);
    } else if (type === 'flip') {
      // Soft swoosh for cards
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(350, now);
      osc.frequency.exponentialRampToValueAtTime(700, now + 0.1);

      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.12);
    } else if (type === 'fanfare') {
      // Major chord victory arpeggio: C5, E5, G5, C6
      const notes = [523.25, 659.25, 783.99, 1046.50];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const start = now + idx * 0.08;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, start);

        gain.gain.setValueAtTime(0.15, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.4);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(start);
        osc.stop(start + 0.4);
      });
    }
  } catch {
    // Graceful fallback if audio is not permitted
  }
}

// Web Speech API text-to-speech for English practice (backward-compatible)
export function speakEnglish(text: string, options?: SpeakOptions): void {
  speakEnglishVoice(text, options);
}

// Celebration Confetti
export function fireCelebration(): void {
  try {
    playSound('fanfare');
    confetti({
      particleCount: 70,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#ffd166', '#41e7ff', '#ff4f9a', '#c4ff55', '#9b7bff'],
      disableForReducedMotion: true,
    });
  } catch {
    // Fail silently if canvas is not ready
  }
}

