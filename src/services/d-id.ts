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

const config: D_ID_CONFIG = {
  apiKey: process.env.NEXT_PUBLIC_D_ID_API_KEY!,
  avatars: {
    male: process.env.NEXT_PUBLIC_MALE_TEACHER_IMAGE!,
    female: process.env.NEXT_PUBLIC_FEMALE_TEACHER_IMAGE!
  },
  voices: {
    male: 'tr-TR-AhmetNeural',
    female: 'tr-TR-EmelNeural'
  }
};

interface StreamResponse {
  status: string;
  session_id: string;
  connection_details: {
    ice_servers: Array<any>;
  };
}

export class D_IDService {
  private webSocket: WebSocket | null = null;

  async startStream(gender: 'male' | 'female', initialText: string) {
    try {
      console.log('Starting stream with config:', {
        gender,
        avatar: config.avatars[gender],
        voice: config.voices[gender]
      });

      const response = await fetch(`${BASE_URL}/talks/streams`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${btoa(config.apiKey)}`,
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

      console.log('Stream response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Stream error response:', errorText);
        throw new Error(`D-ID API Error: ${response.status}`);
      }

      const data: StreamResponse = await response.json();
      console.log('Stream created successfully:', data);
      return this.connectToStream(data.session_id);

    } catch (error) {
      console.error('Stream başlatma hatası:', error);
      throw error;
    }
  }

  private connectToStream(sessionId: string) {
    return new Promise<WebSocket>((resolve, reject) => {
      try {
        console.log('Connecting to WebSocket with session:', sessionId);
        
        this.webSocket = new WebSocket(
          `wss://api.d-id.com/talks/streams/${sessionId}`
        );

        this.webSocket.onopen = () => {
          console.log('WebSocket connection opened');
          resolve(this.webSocket!);
        };

        this.webSocket.onerror = (error) => {
          console.error('WebSocket error:', error);
          reject(error);
        };

        this.webSocket.onmessage = (event) => {
          try {
            const message = JSON.parse(event.data);
            if (message.type === 'video_data') {
              this.handleVideoData(message.data);
            }
          } catch (error) {
            console.error('Video data processing error:', error);
          }
        };

        this.webSocket.onclose = () => {
          console.log('WebSocket connection closed');
        };

      } catch (error) {
        console.error('WebSocket connection error:', error);
        reject(error);
      }
    });
  }

  private handleVideoData(data: ArrayBuffer) {
    try {
      const blob = new Blob([data], { type: 'video/mp4' });
      return URL.createObjectURL(blob);
    } catch (error) {
      console.error('Video data conversion error:', error);
      throw error;
    }
  }

  async sendNewText(text: string) {
    if (!this.webSocket) {
      throw new Error('No active stream connection');
    }

    try {
      const streamId = this.webSocket.url.split('/').pop();
      
      console.log('Sending new text to stream:', {
        streamId,
        text
      });

      const response = await fetch(`${BASE_URL}/talks/streams/${streamId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${btoa(config.apiKey)}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          script: {
            type: 'text',
            input: text,
            provider: {
              type: 'microsoft',
              voice_id: config.voices.male
            }
          }
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Send text error response:', errorText);
        throw new Error(`Send text error: ${response.status}`);
      }

      console.log('Text sent successfully');

    } catch (error) {
      console.error('Send text error:', error);
      throw error;
    }
  }

  disconnect() {
    if (this.webSocket) {
      try {
        this.webSocket.close();
        this.webSocket = null;
        console.log('WebSocket connection closed successfully');
      } catch (error) {
        console.error('WebSocket close error:', error);
      }
    }
  }
}

export const d_idService = new D_IDService();