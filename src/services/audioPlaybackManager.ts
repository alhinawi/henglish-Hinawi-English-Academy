// ==============================================================================
// Henglish Academy (HENGLISH) - DUAL PRONUNCIATION AUDIO PLAYBACK MANAGER
// Singleton Audio Controller for American (US) and British (UK) Voice Playback
// Guaranteed non-overlapping playback, remote audio caching, Web Speech fallback
// ==============================================================================

import { speakEnglishVoice } from '../utils/audio';

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
    if (this.currentAudio) {
      try {
        this.currentAudio.pause();
        this.currentAudio.currentTime = 0;
      } catch {
        // ignore
      }
      this.currentAudio = null;
    }

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

  /**
   * Play pronunciation for a given word and accent
   * Attempts remote audio URL first, falling back cleanly to client SpeechSynthesis
   */
  public async playPronunciation(
    wordId: string,
    wordText: string,
    accent: PronunciationAccent,
    remoteUrl?: string
  ): Promise<void> {
    // If already playing this exact item, toggle stop
    if (this.state.wordId === wordId && this.state.accent === accent && this.state.status === 'playing') {
      this.stop();
      return;
    }

    // Cancel any previous playback
    this.stop();

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
          this.notify({ status: 'playing', source: 'remote-audio' });
        });

        audio.addEventListener('ended', () => {
          this.notify({ status: 'idle', wordId: null, accent: null, source: null });
          this.currentAudio = null;
        });

        audio.addEventListener('error', () => {
          // Gracefully fallback to Web Speech API
          this.fallbackSpeechSynthesis(wordId, wordText, accent);
        });

        await audio.play();
        return;
      } catch {
        // Fallback to speech synthesis
        this.fallbackSpeechSynthesis(wordId, wordText, accent);
        return;
      }
    }

    // Directly use speech synthesis if no remote URL
    this.fallbackSpeechSynthesis(wordId, wordText, accent);
  }

  private fallbackSpeechSynthesis(wordId: string, text: string, accent: PronunciationAccent): void {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      this.notify({ status: 'error', source: null });
      setTimeout(() => this.stop(), 1500);
      return;
    }

    try {
      this.notify({ status: 'playing', source: 'speech-synthesis' });
      // Use existing speakEnglishVoice with the explicit accent
      speakEnglishVoice(text, { accent });

      // Automatically reset status after approximate duration based on word length
      const durationMs = Math.max(1200, text.length * 90);
      setTimeout(() => {
        if (this.state.wordId === wordId && this.state.accent === accent) {
          this.notify({ status: 'idle', wordId: null, accent: null, source: null });
        }
      }, durationMs);
    } catch {
      this.notify({ status: 'error', source: null });
      setTimeout(() => this.stop(), 1500);
    }
  }
}

export const audioPlayback = AudioPlaybackManager.getInstance();

