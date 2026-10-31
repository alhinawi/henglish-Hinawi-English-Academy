// ==============================================================================
// Henglish Academy (HENGLISH) - REAL BROWSER AUDIO RECORDER & WEBAUDIO ANALYZER
// Fully functional MediaDevices & MediaRecorder integration with live waveform
// ==============================================================================

export type RecordingState =
  | 'IDLE'
  | 'REQUESTING_PERMISSION'
  | 'RECORDING'
  | 'PAUSED'
  | 'PROCESSING'
  | 'EVALUATING'
  | 'COMPLETED'
  | 'PERMISSION_DENIED'
  | 'MICROPHONE_UNAVAILABLE'
  | 'RECORDING_ERROR'
  | 'PROCESSING_ERROR'
  | 'EVALUATION_FAILED';

export interface RecordedAudioData {
  blob: Blob;
  blobUrl: string;
  base64: string;
  mimeType: string;
  durationSeconds: number;
}

export class RealAudioRecorder {
  private mediaStream: MediaStream | null = null;
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private animFrameId: number | null = null;
  private startTime = 0;
  private durationSeconds = 0;
  private timerInterval: ReturnType<typeof setInterval> | null = null;

  public state: RecordingState = 'IDLE';
  public onStateChange?: (state: RecordingState) => void;
  public onDurationTick?: (seconds: number) => void;
  public onWaveformData?: (data: Uint8Array) => void;

  private setState(newState: RecordingState) {
    this.state = newState;
    if (this.onStateChange) {
      this.onStateChange(newState);
    }
  }

  /**
   * Request real microphone permission and start recording
   */
  public async start(): Promise<boolean> {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      this.setState('MICROPHONE_UNAVAILABLE');
      return false;
    }

    try {
      this.setState('REQUESTING_PERMISSION');
      this.audioChunks = [];

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      this.mediaStream = stream;

      // Select supported audio mimeType
      let mimeType = 'audio/webm;codecs=opus';
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        if (MediaRecorder.isTypeSupported('audio/webm')) {
          mimeType = 'audio/webm';
        } else if (MediaRecorder.isTypeSupported('audio/mp4')) {
          mimeType = 'audio/mp4';
        } else if (MediaRecorder.isTypeSupported('audio/ogg')) {
          mimeType = 'audio/ogg';
        } else {
          mimeType = '';
        }
      }

      this.mediaRecorder = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream);

      // Setup Web Audio API Analyzer for live waveform
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.audioContext = new AudioCtx();
      const source = this.audioContext.createMediaStreamSource(stream);
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 256;
      source.connect(this.analyser);

      // Listen for data
      this.mediaRecorder.ondataavailable = event => {
        if (event.data && event.data.size > 0) {
          this.audioChunks.push(event.data);
        }
      };

      this.mediaRecorder.onerror = () => {
        this.cleanup();
        this.setState('RECORDING_ERROR');
      };

      // Start recording
      this.mediaRecorder.start(100); // chunk every 100ms
      this.startTime = Date.now();
      this.durationSeconds = 0;
      this.setState('RECORDING');

      // Start duration ticker
      this.timerInterval = setInterval(() => {
        this.durationSeconds = Math.floor((Date.now() - this.startTime) / 1000);
        if (this.onDurationTick) {
          this.onDurationTick(this.durationSeconds);
        }
      }, 500);

      // Start live waveform visualizer loop
      this.startWaveformLoop();
      return true;
    } catch (err: unknown) {
      console.warn('Microphone access failed:', err);
      const error = err as { name?: string };
      if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
        this.setState('PERMISSION_DENIED');
      } else if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
        this.setState('MICROPHONE_UNAVAILABLE');
      } else {
        this.setState('RECORDING_ERROR');
      }
      this.cleanup();
      return false;
    }
  }

  private startWaveformLoop() {
    if (!this.analyser) return;
    const dataArray = new Uint8Array(this.analyser.frequencyBinCount);

    const updateWaveform = () => {
      if (this.state !== 'RECORDING' || !this.analyser) return;
      this.analyser.getByteFrequencyData(dataArray);

      if (this.onWaveformData) {
        this.onWaveformData(dataArray);
      }
      this.animFrameId = requestAnimationFrame(updateWaveform);
    };

    updateWaveform();
  }

  /**
   * Stop recording and package the audio blob
   */
  public async stop(): Promise<RecordedAudioData | null> {
    if (!this.mediaRecorder || this.state !== 'RECORDING') {
      this.cleanup();
      return null;
    }

    this.setState('PROCESSING');

    return new Promise(resolve => {
      if (!this.mediaRecorder) {
        this.cleanup();
        resolve(null);
        return;
      }

      this.mediaRecorder.onstop = async () => {
        const mimeType = this.mediaRecorder?.mimeType || 'audio/webm';
        const blob = new Blob(this.audioChunks, { type: mimeType });
        const blobUrl = URL.createObjectURL(blob);
        const durationSeconds = this.durationSeconds || Math.max(1, Math.round((Date.now() - this.startTime) / 1000));

        // Convert to base64 for API transmission
        const reader = new FileReader();
        reader.onloadend = () => {
          const resultStr = reader.result as string;
          const base64 = resultStr.includes(',') ? resultStr.split(',')[1] : resultStr;

          this.cleanup();
          this.setState('COMPLETED');

          resolve({
            blob,
            blobUrl,
            base64,
            mimeType,
            durationSeconds,
          });
        };

        reader.onerror = () => {
          this.cleanup();
          this.setState('PROCESSING_ERROR');
          resolve(null);
        };

        reader.readAsDataURL(blob);
      };

      this.mediaRecorder.stop();
    });
  }

  /**
   * Clean up all hardware streams and contexts
   */
  public cleanup() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }

    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }

    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(track => {
        try {
          track.stop();
        } catch {}
      });
      this.mediaStream = null;
    }

    if (this.audioContext && this.audioContext.state !== 'closed') {
      try {
        this.audioContext.close();
      } catch {}
      this.audioContext = null;
    }

    this.analyser = null;
    this.mediaRecorder = null;
  }
}
