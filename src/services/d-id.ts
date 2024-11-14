// services/d-id.ts
const BASE_URL = 'https://api.d-id.com';

interface D_ID_CONFIG {
  apiKey: string;
  avatars: {
    male: string;
    female: string;
  };
  voices: {
    male: string;
    female: string;
  };
}

// Yapılandırma
const config: D_ID_CONFIG = {
  apiKey: process.env.D_ID_API_KEY || '',
  avatars: {
    male: "https://create-images-results.d-id.com/DefaultPresenters/William_m/image.jpeg",
    female: "https://create-images-results.d-id.com/DefaultPresenters/Emma_f/image.jpeg"
  },
  voices: {
    male: 'tr-TR-AhmetNeural',
    female: 'tr-TR-EmelNeural'
  }
};

// Stream oluşturma ve yönetme
interface StreamResponse {
  status: string;
  session_id: string;
  connection_details: {
    ice_servers: Array<any>;
  };
}

export class D_IDService {
  private webSocket: WebSocket | null = null;

  // Stream başlatma
  async startStream(gender: 'male' | 'female', initialText: string) {
    try {
      const response = await fetch(`${BASE_URL}/talks/streams`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${config.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          source_url: config.avatars[gender],
          script: {
            type: 'text',
            input: initialText,
            provider: {
              type: 'microsoft',
              voice_id: config.voices[gender]
            }
          }
        })
      });

      if (!response.ok) {
        throw new Error(`D-ID API Hatası: ${response.status}`);
      }

      const data: StreamResponse = await response.json();
      return this.connectToStream(data.session_id);
    } catch (error) {
      console.error('Stream başlatma hatası:', error);
      throw error;
    }
  }

  // WebSocket bağlantısı
  private connectToStream(sessionId: string) {
    return new Promise<WebSocket>((resolve, reject) => {
      this.webSocket = new WebSocket(
        `wss://api.d-id.com/talks/streams/${sessionId}`
      );

      this.webSocket.onopen = () => resolve(this.webSocket!);
      this.webSocket.onerror = (error) => reject(error);

      this.webSocket.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          if (message.type === 'video_data') {
            // Video verisi geldiğinde işle
            this.handleVideoData(message.data);
          }
        } catch (error) {
          console.error('Video verisi işleme hatası:', error);
        }
      };
    });
  }

  // Video verisi işleme
  private handleVideoData(data: any) {
    // Video verisini işle ve UI'a gönder
    const blob = new Blob([data], { type: 'video/mp4' });
    return URL.createObjectURL(blob);
  }

  // Yeni metin gönderme
  async sendNewText(text: string) {
    if (!this.webSocket) throw new Error('Stream bağlantısı yok');

    try {
      await fetch(`${BASE_URL}/talks/streams/${this.webSocket.url.split('/').pop()}`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${config.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          script: {
            type: 'text',
            input: text,
            provider: {
              type: 'microsoft',
              voice_id: config.voices.male // veya female, duruma göre
            }
          }
        })
      });
    } catch (error) {
      console.error('Metin gönderme hatası:', error);
      throw error;
    }
  }

  // Bağlantıyı kapat
  disconnect() {
    if (this.webSocket) {
      this.webSocket.close();
      this.webSocket = null;
    }
  }
}

export const d_idService = new D_IDService();