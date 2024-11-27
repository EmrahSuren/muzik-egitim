// src/services/audio-analyzer.ts
export class AudioAnalyzer {
  private audioContext: AudioContext;
  private analyzer: AnalyserNode;
  private microphone: MediaStreamAudioSourceNode | null = null;
  private stream: MediaStream | null = null;

  constructor() {
    this.audioContext = new AudioContext();
    this.analyzer = this.audioContext.createAnalyser();
  }

  async startRecording(): Promise<boolean> {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.microphone = this.audioContext.createMediaStreamSource(this.stream);
      this.microphone.connect(this.analyzer);
      return true;
    } catch (error) {
      console.error('Mikrofon başlatma hatası:', error);
      return false;
    }
  }

  stopRecording(): void {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
    if (this.microphone) {
      this.microphone.disconnect();
      this.microphone = null;
    }
  }

  private detectPitch(dataArray: Float32Array): number {
    // Basit bir pitch detection implementasyonu
    let sum = 0;
    for (let i = 0; i < dataArray.length; i++) {
      sum += Math.abs(dataArray[i]);
    }
    return sum / dataArray.length;
  }

  private detectRhythm(dataArray: Float32Array): number {
    // Basit bir ritim detection implementasyonu
    let peakCount = 0;
    const threshold = 0.5;
    for (let i = 1; i < dataArray.length - 1; i++) {
      if (dataArray[i] > threshold && 
          dataArray[i] > dataArray[i-1] && 
          dataArray[i] > dataArray[i+1]) {
        peakCount++;
      }
    }
    return peakCount;
  }

  private detectVolume(dataArray: Float32Array): number {
    // RMS (Root Mean Square) volume calculation
    let sum = 0;
    for (let i = 0; i < dataArray.length; i++) {
      sum += dataArray[i] * dataArray[i];
    }
    return Math.sqrt(sum / dataArray.length);
  }

  async analyzeAudio() {
    if (!this.microphone) return null;

    const dataArray = new Float32Array(this.analyzer.frequencyBinCount);
    this.analyzer.getFloatTimeDomainData(dataArray);

    return {
      pitch: this.detectPitch(dataArray),
      rhythm: this.detectRhythm(dataArray),
      volume: this.detectVolume(dataArray)
    };
  }
}