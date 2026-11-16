// Procedural sound design, generated locally with WebAudio. No samples or paid APIs.
export class WorldAudio {
  private context?: AudioContext;
  private master?: GainNode;
  private muted = false;
  private stepTime = 0;
  private ambient?: AudioBufferSourceNode;
  async start() {
    if (!this.context) {
      this.context = new AudioContext();
      this.master = this.context.createGain(); this.master.gain.value = this.muted ? 0 : 0.25;
      this.master.connect(this.context.destination);
      const buffer = this.context.createBuffer(1, this.context.sampleRate * 4, this.context.sampleRate);
      const data = buffer.getChannelData(0);
      let previous = 0;
      for (let i = 0; i < data.length; i++) { previous = (previous + (Math.random() * 2 - 1) * 0.02) / 1.02; data[i] = previous; }
      this.ambient = this.context.createBufferSource(); this.ambient.buffer = buffer; this.ambient.loop = true;
      const filter = this.context.createBiquadFilter(); filter.type = 'lowpass'; filter.frequency.value = 500;
      const gain = this.context.createGain(); gain.gain.value = 0.22;
      this.ambient.connect(filter).connect(gain).connect(this.master); this.ambient.start();
    }
    await this.context.resume();
  }
  mute(value: boolean) {
    this.muted = value;
    if (this.master && this.context) this.master.gain.setTargetAtTime(value ? 0 : 0.25, this.context.currentTime, 0.04);
  }
  private tone(frequency: number, length: number, volume: number, type: OscillatorType, end?: number) {
    if (!this.context || !this.master || this.context.state !== 'running') return;
    const time = this.context.currentTime; const osc = this.context.createOscillator(); const gain = this.context.createGain();
    osc.type = type; osc.frequency.setValueAtTime(frequency, time); if(end) osc.frequency.exponentialRampToValueAtTime(end,time+length);
    gain.gain.setValueAtTime(0.001,time);gain.gain.linearRampToValueAtTime(volume,time+0.008);gain.gain.exponentialRampToValueAtTime(0.001,time+length);
    osc.connect(gain).connect(this.master); osc.start(time); osc.stop(time+length);
  }
  step(delta: number, moving: boolean) {
    if (!moving) { this.stepTime = 0; return; }
    this.stepTime -= delta;
    if(this.stepTime <= 0){ this.tone(155,0.09,0.15,'triangle',65); this.stepTime = 0.36; }
  }
  door(){ this.tone(210,0.24,0.12,'triangle',85); }
  chime(){ this.tone(660,0.18,0.1,'sine',880); }
  stop(){ void this.context?.suspend(); }
  dispose(){ this.ambient?.stop(); void this.context?.close(); }
}
