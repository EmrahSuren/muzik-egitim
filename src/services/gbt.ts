// services/gpt.ts
interface GPT_CONFIG {
    model: string;
    temperature: number;
    maxTokens: number;
  }
  
  // Müzik eğitimi için özel prompt yapısı
  interface MusicPrompt {
    instrument: string;
    level: 'beginner' | 'intermediate' | 'advanced';
    lesson: {
      topic: string;
      objective: string;
      previousFeedback?: string;
    }
  }
  