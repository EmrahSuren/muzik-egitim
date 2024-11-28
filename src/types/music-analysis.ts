// src/types/music-analysis.ts
export interface MusicAnalysis {
  rhythm: {
    tempo: number;
    accuracy: number;
    suggestions: string[];
  };
  harmony: {
    chordProgression: string[];
    keySignature: string;
    suggestions: string[];
  };
  performance: {
    score: number;
    feedback: string[];
    improvements: string[];
  };
}