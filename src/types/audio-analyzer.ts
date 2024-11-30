// src/types/audio-analyzer.ts
export interface AudioAnalysis {
    buffer: Float32Array;
    pitch: number;
    rhythm: number;
    volume: number;
  }