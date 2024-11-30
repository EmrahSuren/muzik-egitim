// src/services/magenta.ts
import * as mm from '@magenta/music';

export class MagentaService {
  private model: mm.SoundFontPlayer | null = null;
  private rnnPlayer: mm.MusicRNN | null = null;

  async initialize() {
    try {
      this.model = new mm.SoundFontPlayer(
        'https://storage.googleapis.com/magentadata/js/soundfonts/sgm_plus'
      );
      this.rnnPlayer = new mm.MusicRNN(
        'https://storage.googleapis.com/magentadata/js/checkpoints/music_rnn/basic_rnn'
      );
      await this.rnnPlayer.initialize();
      return true;
    } catch (error) {
      console.error('Magenta başlatma hatası:', error);
      return false;
    }
  }

  async analyzePerformance(audioData: Float32Array) {
    try {
      const result = await mm.transcribeFromAudioArray(audioData);
      
      return {
        notes: result.notes,
        tempo: result.tempo,
        key: this.detectKey(result.notes),
        rhythmAccuracy: this.calculateRhythmAccuracy(result.notes)
      };
    } catch (error) {
      console.error('Performans analizi hatası:', error);
      return null;
    }
  }

  async generateAccompaniment(notes: mm.NoteSequence) {
    if (!this.rnnPlayer) return null;

    try {
      // totalTime'ı da içeren bir NoteSequence oluşturuyoruz
      const sequence: mm.NoteSequence = {
        ...notes,
        totalTime: notes.notes[notes.notes.length - 1]?.endTime || 4.0,
        timeSignature: notes.timeSignature || { numerator: 4, denominator: 4 }
      };
      
      const continuation = await this.rnnPlayer.continueSequence(sequence, 16);
      return continuation;
    } catch (error) {
      console.error('Eşlik üretme hatası:', error);
      return null;
    }
  }

  private detectKey(notes: mm.NoteSequence['notes']): string {
    const noteHistogram = new Array(12).fill(0);
    notes.forEach(note => {
      noteHistogram[note.pitch % 12]++;
    });

    const maxIndex = noteHistogram.indexOf(Math.max(...noteHistogram));
    const keys = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    return keys[maxIndex];
  }

  private calculateRhythmAccuracy(notes: mm.NoteSequence['notes']): number {
    if (notes.length < 2) return 100;

    let totalDeviation = 0;
    for (let i = 1; i < notes.length; i++) {
      const expectedInterval = 0.25;
      const actualInterval = notes[i].startTime - notes[i-1].startTime;
      totalDeviation += Math.abs(actualInterval - expectedInterval);
    }

    const accuracy = Math.max(0, 100 - (totalDeviation * 100));
    return Math.round(accuracy);
  }
}