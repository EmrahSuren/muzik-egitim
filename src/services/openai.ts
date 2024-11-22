import axios from 'axios';

export const OPENAI_CONFIG = {
  model: 'gpt-3.5-turbo-instruct',
  baseUrl: 'https://api.openai.com/v1',
  temperature: 0.7,
  maxTokens: 150,
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY || ''
} as const;

export enum OpenAIModel {
  GPT35Turbo = 'gpt-3.5-turbo',
  GPT35TurboInstruct = 'gpt-3.5-turbo-instruct'
}

export const openAIService = {
  async getResponse(prompt: string): Promise<string> {
    try {
      const response = await axios.post(
        `${OPENAI_CONFIG.baseUrl}/engines/${OPENAI_CONFIG.model}/completions`,
        {
          prompt,
          max_tokens: OPENAI_CONFIG.maxTokens,
          temperature: OPENAI_CONFIG.temperature,
        },
        {
          headers: {
            'Authorization': `Bearer ${OPENAI_CONFIG.apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data.choices[0].text.trim();
    } catch (error) {
      console.error('OpenAI API error:', error);
      throw new Error('OpenAI API error');
    }
  },
};

interface TestResult {
  success: boolean;
  message?: string;
  error?: string;
  details: {
    model: string;
    apiKeyPresent: boolean;
  };
}

export class OpenAIService {
  async getResponse(prompt: string): Promise<string> {
    return openAIService.getResponse(prompt);
  }

  private async createCompletion(prompt: string): Promise<string> {
    if (!OPENAI_CONFIG.apiKey) {
      throw new Error('OpenAI API anahtarı bulunamadı.');
    }

    try {
      console.log('API İsteği gönderiliyor:', {
        model: OPENAI_CONFIG.model,
        prompt: prompt.substring(0, 50) + '...',
        maxTokens: OPENAI_CONFIG.maxTokens
      });

      const response = await fetch(`${OPENAI_CONFIG.baseUrl}/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENAI_CONFIG.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: OPENAI_CONFIG.model,
          prompt: prompt,
          temperature: OPENAI_CONFIG.temperature,
          max_tokens: OPENAI_CONFIG.maxTokens,
          top_p: 1,
          frequency_penalty: 0,
          presence_penalty: 0
        })
      });

      const responseData = await response.json();

      console.log('API Yanıtı:', {
        status: response.status,
        ok: response.ok,
        data: responseData
      });

      if (!response.ok) {
        throw new Error(`OpenAI API Hatası: ${responseData.error?.message || response.statusText}`);
      }

      return responseData.choices[0].text.trim();

    } catch (error) {
      console.error('OpenAI Detaylı Hata:', {
        error,
        apiKey: OPENAI_CONFIG.apiKey ? 'Mevcut (İlk 5 karakter): ' + OPENAI_CONFIG.apiKey.substring(0, 5) : 'Yok',
        model: OPENAI_CONFIG.model
      });
      throw error;
    }
  }

  async getMusicTeacherResponse(instrument: string, message: string): Promise<string> {
    if (!message?.trim()) {
      throw new Error('Mesaj içeriği boş olamaz');
    }

    const prompt = `Sen deneyimli bir ${instrument} öğretmenisin.
    Öğrenci soru: "${message}"
    Lütfen nazik ve motive edici bir şekilde yanıt ver. Yanıtın kısa ve öz olsun.`;

    try {
      return await this.createCompletion(prompt);
    } catch (error) {
      console.error('Müzik öğretmeni yanıt hatası:', error);
      
      // Spesifik hata kontrolü
      if (error instanceof Error) {
        const errorMessage = error.message.toLowerCase();
        
        if (errorMessage.includes('api key')) {
          return 'API anahtarı geçersiz veya eksik. Lütfen ayarlarınızı kontrol edin.';
        }
        
        if (errorMessage.includes('quota') || errorMessage.includes('limit')) {
          return 'API kullanım limiti aşıldı. Lütfen daha sonra tekrar deneyin.';
        }

        if (errorMessage.includes('model')) {
          return 'Model kullanımında bir sorun oluştu. Lütfen sistem yöneticinize başvurun.';
        }
        
        return `Hata: ${error.message}`;
      }
      
      return 'Üzgünüm, şu anda yanıt veremiyorum. Lütfen tekrar deneyin.';
    }
  }

  async testConnection(): Promise<TestResult> {
    try {
      console.log('Bağlantı testi başlıyor...', {
        model: OPENAI_CONFIG.model,
        apiKeyPresent: !!OPENAI_CONFIG.apiKey
      });

      const response = await this.getMusicTeacherResponse('gitar', 'Merhaba');
      
      return {
        success: true,
        message: response,
        details: {
          model: OPENAI_CONFIG.model,
          apiKeyPresent: !!OPENAI_CONFIG.apiKey
        }
      };
    } catch (error) {
      console.error('Test bağlantı hatası:', error);
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Bilinmeyen bir hata oluştu',
        details: {
          model: OPENAI_CONFIG.model,
          apiKeyPresent: !!OPENAI_CONFIG.apiKey
        }
      };
    }
  }
}

export const openAIServiceInstance = new OpenAIService();