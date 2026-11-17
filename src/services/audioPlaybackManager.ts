// ==============================================================================
// Henglish Academy (HENGLISH) - DUAL PRONUNCIATION AUDIO PLAYBACK MANAGER
// Singleton Audio Controller for American (US) and British (UK) Voice Playback
// Guaranteed non-overlapping playback, remote audio caching, Web Speech fallback
// ==============================================================================

import { getVoiceSettings, speakEnglishVoice, stopSpeech, subscribeSpeechState } from '../utils/audio';

export type PronunciationAccent = 'US' | 'UK';

export interface PlaybackState {
  wordId: string | null;
  accent: PronunciationAccent | null;
  status: 'idle' | 'loading' | 'playing' | 'error';
  source: 'remote-audio' | 'speech-synthesis' | null;
}

type Listener = (state: PlaybackState) => void;

class AudioPlaybackManager {
  private static instance: AudioPlaybackManager;
  private generation = 0;
  private fallbackGeneration = -1;
  private releaseSpeech: (() => void) | null = null;
  private currentOwner: symbol | undefined;
  private currentAudio: HTMLAudioElement | null = null;
  private state: PlaybackState = {
    wordId: null,
    accent: null,
    status: 'idle',
    source: null,
  };
  private listeners: Set<Listener> = new Set();

  private constructor() {}

  public static getInstance(): AudioPlaybackManager {
    if (!AudioPlaybackManager.instance) {
      AudioPlaybackManager.instance = new AudioPlaybackManager();
    }
    return AudioPlaybackManager.instance;
  }

  public getState(): PlaybackState {
    return { ...this.state };
  }

  public subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    listener(this.getState());
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify(newState: Partial<PlaybackState>): void {
    this.state = { ...this.state, ...newState };
    this.listeners.forEach(l => l(this.getState()));
  }

  /**
   * Stop any running audio immediately
   */
  public stop(): void {
    this.generation++;
    this.releaseSpeech?.();
    this.releaseSpeech = null;
    this.currentOwner = undefined;
    if (this.currentAudio) {
      try {
        this.currentAudio.pause();
        this.currentAudio.currentTime = 0;
      } catch {
        // ignore
      }
      this.currentAudio = null;
    }

    stopSpeech();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch {
        // ignore
      }
    }

    this.notify({
      wordId: null,
      accent: null,
      status: 'idle',
      source: null,
    });
  }

  public stopOwned(owner: symbol): void {
    if (this.currentOwner === owner) this.stop();
  }

  /**
   * Play pronunciation for a given word and accent
   * Attempts remote audio URL first, falling back cleanly to client SpeechSynthesis
   */
  public async playPronunciation(
    wordId: string,
    wordText: string,
    accent: PronunciationAccent,
    remoteUrl?: string,
    owner?: symbol
  ): Promise<void> {
    // If already playing this exact item, toggle stop
    if (this.state.wordId === wordId && this.state.accent === accent && (this.state.status === 'playing' || this.state.status === 'loading')) {
      this.stop();
      return;
    }

    // Cancel any previous playback
    this.stop();
    const generation = this.generation;
    this.currentOwner = owner;

    this.notify({
      wordId,
      accent,
      status: 'loading',
      source: remoteUrl ? 'remote-audio' : 'speech-synthesis',
    });

    if (remoteUrl && remoteUrl.startsWith('http')) {
      try {
        const audio = new Audio(remoteUrl);
        this.currentAudio = audio;

        audio.addEventListener('play', () => {
          if (generation !== this.generation || this.currentAudio !== audio) return;
          this.notify({ status: 'playing', source: 'remote-audio' });
        });

        audio.addEventListener('ended', () => {
          if (generation !== this.generation || this.currentAudio !== audio) return;
          this.notify({ status: 'idle', wordId: null, accent: null, source: null });
          this.currentAudio = null;
          this.currentOwner = undefined;
        });

        audio.addEventListener('error', () => {
          if (this.currentAudio !== audio) return;
          // Gracefully fallback to Web Speech API
          this.fallbackSpeechSynthesis(wordId, wordText, accent, generation);
        });

        await audio.play();
        return;
      } catch {
        // Fallback to speech synthesis
        this.fallbackSpeechSynthesis(wordId, wordText, accent, generation);
        return;
      }
    }

    // Directly use speech synthesis if no remote URL
    this.fallbackSpeechSynthesis(wordId, wordText, accent, generation);
  }

  private fallbackSpeechSynthesis(wordId: string, text: string, accent: PronunciationAccent, generation: number): void {
    if (generation !== this.generation || this.fallbackGeneration === generation) return;
    this.fallbackGeneration = generation;
    // A remote error event and rejected play promise must not synthesize twice.
    if (this.currentAudio) {
      try { this.currentAudio.pause(); } catch { /* already stopped */ }
      this.currentAudio = null;
    }
    this.notify({ status: 'loading', source: 'speech-synthesis' });
    let settled = false;
    let armed = false;
    const finish = (error = false) => {
      if (generation !== this.generation || settled) return;
      settled = true;
      this.releaseSpeech?.(); this.releaseSpeech = null;
      this.currentOwner = undefined;
      this.notify(error ? { status: 'error', source: null } : { status: 'idle', wordId: null, accent: null, source: null });
    };
    this.releaseSpeech = subscribeSpeechState((playing, spoken) => {
      if (!armed || generation !== this.generation) return;
      if (playing && spoken === text.trim()) this.notify({ status: 'playing', source: 'speech-synthesis' });
      else queueMicrotask(() => finish()); // Allow onError to set the specific failure first.
    });
    try {
      if (getVoiceSettings().isMuted || !text.trim()) { finish(true); return; }
      // This engine can use server audio even without browser SpeechSynthesis.
      speakEnglishVoice(text, { accent, onEnd: () => finish(), onError: () => finish(true) });
      armed = true;
    } catch {
      finish(true);
    }
  }
}

export const audioPlayback = AudioPlaybackManager.getInstance();

