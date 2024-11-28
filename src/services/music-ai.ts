// src/services/music-ai.ts
import { MagentaService } from '@/services/magenta';
import type { MusicAnalysis } from '@/types/music-analysis';

export class MusicAIService {
  private static instance: MusicAIService;
  private magentaService: MagentaService;

  private constructor() {
    this.magentaService = new MagentaService();
    this.magentaService.initialize().catch(error => {
      console.error('MagentaService initialization error:', error);
    });
  }

  public static getInstance(): MusicAIService {
    if (!this.instance) {
      this.instance = new MusicAIService();
    }
    return this.instance;
  }

  public async analyzePerformance(
    instrument: 'gitar' | 'piyano' | 'bateri',
    level: 'beginner' | 'intermediate' | 'advanced',
    audioData?: Float32Array
  ): Promise<MusicAnalysis> {
    let magentaAnalysis = null;
    try {
      if (audioData) {
        magentaAnalysis = await this.magentaService.analyzePerformance(audioData);
      }

      return {
        rhythm: {
          tempo: magentaAnalysis?.tempo || 120,
          accuracy: 85, // Geçici değer
          suggestions: ['Metronom ile çalışmayı deneyin']
        },
        harmony: {
          chordProgression: ['Em', 'Am', 'D', 'G'],
          keySignature: 'E minor',
          suggestions: ['Akor geçişlerini daha temiz yapın']
        },
        performance: {
          score: 80, // Geçici değer
          feedback: ['Ritim doğruluğu iyi'],
          improvements: ['Akor geçişlerini yavaşça pratik edin']
        }
      };
    } catch (error) {
      console.error('Performance analysis error:', error);
      // Hata durumunda varsayılan değerler
      return {
        rhythm: {
          tempo: 120,
          accuracy: 0,
          suggestions: []
        },
        harmony: {
          chordProgression: [],
          keySignature: '',
          suggestions: []
        },
        performance: {
          score: 0,
          feedback: [],
          improvements: []
        }
      };
    }
  }
}

export const musicAIServiceInstance = MusicAIService.getInstance();