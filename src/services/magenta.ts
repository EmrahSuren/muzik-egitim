// src/services/magenta.ts
import * as mm from '@magenta/music';

export class MagentaService {
  private model: mm.SoundFontPlayer | null = null;
  private rnnPlayer: mm.Player | null = null;

  async initialize() {
    try {
      // Magenta modelini yükle
      this.model = new mm.SoundFontPlayer('https://storage.googleapis.com/magentadata/js/soundfonts/sgm_plus');
      
      // RNN modelini yükle
      const musicRNN = new mm.MusicRNN('https://storage.googleapis.com/magentadata/js/checkpoints/music_rnn/basic_rnn');
      await musicRNN.initialize();
      
      this.rnnPlayer = new mm.Player();
      return true;
    } catch (error) {
      console.error('Magenta initialization error:', error);
      return false;
    }
  }

  async analyzePerformance(audioData: Float32Array) {
    // Ses verisinden nota ve ritim analizi
    const result = await mm.transcribeFromAudioArray(audioData);
    return {
      notes: result.notes,
      tempo: result.tempo,
      timeSignature: result.timeSignature
    };
  }
}