// src/types/magenta.d.ts
declare module '@magenta/music' {
    export class Player {
      constructor();
      start(): void;
      stop(): void;
      resume(): void;
      pause(): void;
      seekTo(time: number): void;
      isPlaying(): boolean;
      getPlayState(): string;
    }
  
    export class MusicRNN {
      constructor(checkpointURL: string);
      initialize(): Promise<void>;
      continueSequence(
        sequence: NoteSequence,
        steps: number,
        temperature?: number
      ): Promise<NoteSequence>;
    }
  
    export class SoundFontPlayer {
      constructor(url: string);
      loadSamples(): Promise<void>;
    }
  
    export function transcribeFromAudioArray(audioData: Float32Array): Promise<NoteSequence>;
  
    export interface NoteSequence {
      notes: Array<{
        pitch: number;
        startTime: number;
        endTime: number;
        velocity: number;
      }>;
      totalTime: number;
      tempo: number;
      timeSignature: {
        numerator: number;
        denominator: number;
      };
    }
  }