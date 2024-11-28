// src/services/speech-recognition.ts

// Tarayıcı API'lerinin tip tanımlamaları
interface SpeechRecognitionAlternative {
    transcript: string;
    confidence: number;
   }
   
   interface SpeechRecognitionResult {
    isFinal: boolean;
    [index: number]: SpeechRecognitionAlternative;
    length: number;
   }
   
   interface SpeechRecognitionResultList {
    [index: number]: SpeechRecognitionResult;
    length: number;
   }
   
   interface SpeechRecognitionEvent extends Event {
    resultIndex: number; 
    results: SpeechRecognitionResultList;
   }
   
   interface SpeechRecognitionErrorEvent extends Event {
    error: string;
    message: string;
   }
   
   // Temel SpeechRecognition sınıfı tanımı
   declare class SpeechRecognition extends EventTarget {
    continuous: boolean;
    interimResults: boolean;
    lang: string;
    onresult: ((event: SpeechRecognitionEvent) => void) | null;
    onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
    start(): void;
    stop(): void;
   }
   
   // Global tip tanımlaması
   declare global {
    interface Window {
      SpeechRecognition: typeof SpeechRecognition;
      webkitSpeechRecognition: typeof SpeechRecognition;
    }
   }
   
   // Ana servis sınıfı
   export class SpeechRecognitionService {
    private recognition: SpeechRecognition | null = null;
   
    constructor() {
      if (typeof window !== 'undefined') {
        const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognitionAPI) {
          this.recognition = new SpeechRecognitionAPI();
          this.recognition.continuous = true;
          this.recognition.interimResults = true;
          this.recognition.lang = 'tr-TR';
        }
      }
    }
   
    startListening(onResult: (text: string) => void): void {
      if (!this.recognition) return;
   
      this.recognition.onresult = (event: SpeechRecognitionEvent) => {
        const results = event.results;
        if (results.length > 0) {
          const lastResult = results[results.length - 1];
          if (lastResult.isFinal) {
            const text = lastResult[0].transcript;
            onResult(text);
          }
        }
      };
   
      this.recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error('Speech recognition error:', event.error, event.message);
      };
   
      try {
        this.recognition.start();
      } catch (error) {
        console.error('Failed to start speech recognition:', error);
      }
    }
   
    stopListening(): void {
      if (this.recognition) {
        try {
          this.recognition.stop();
        } catch (error) {
          console.error('Failed to stop speech recognition:', error);
        }
      }
    }
   }