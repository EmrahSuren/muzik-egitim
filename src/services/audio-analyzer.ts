// src/services/audio-analyzer.ts

// AudioData tipi için özel interface tanımlaması
type AudioDataBuffer = Float32Array & {
  BYTES_PER_ELEMENT: number;
  byteLength: number;
  byteOffset: number;
  copyWithin: (target: number, start: number, end?: number) => Float32Array;
  set: (array: ArrayLike<number>, offset?: number) => void;
  slice: (start?: number, end?: number) => Float32Array;
  subarray: (begin?: number, end?: number) => Float32Array;
};

interface AudioAnalysis {
  buffer: AudioDataBuffer;
  pitch: number;
  rhythm: number;
  volume: number;
}

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

  async analyzeAudio(): Promise<AudioAnalysis | null> {
    if (!this.microphone) return null;

    const bufferLength = this.analyzer.frequencyBinCount;
    const dataArray = new Float32Array(bufferLength) as AudioDataBuffer;
    
    this.analyzer.getFloatTimeDomainData(dataArray);

    return {
      buffer: dataArray,
      pitch: this.detectPitch(dataArray),
      rhythm: this.detectRhythm(dataArray),
      volume: this.detectVolume(dataArray)
    };
  }

  private detectPitch(dataArray: Float32Array): number {
    let sum = 0;
    for (let i = 0; i < dataArray.length; i++) {
      sum += Math.abs(dataArray[i]);
    }
    return sum / dataArray.length;
  }

  private detectRhythm(dataArray: Float32Array): number {
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
    let sum = 0;
    for (let i = 0; i < dataArray.length; i++) {
      sum += dataArray[i] * dataArray[i];
    }
    return Math.sqrt(sum / dataArray.length);
  }
}