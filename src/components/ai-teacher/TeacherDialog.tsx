'use client';
import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Mic, Camera, Maximize, Send, PlayCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface Message {
  id: number;
  text: string;
  sender: 'ai' | 'user';
  type?: 'text' | 'link' | 'error';
  url?: string;
}

interface TeacherDialogProps {
  onClose: () => void;
  teacherGender: 'male' | 'female';
  studentName: string;
  instrument: string;
  apiKey?: string;
}
interface StreamResponse {
  status: string;
  connection_details: {
    session_id: string;
    ice_servers: {
      urls: string[];
      username?: string;
      credential?: string;
    }[];
  };
}

export default function TeacherDialog({ 
  onClose, 
  teacherGender, 
  studentName, 
  instrument,
  apiKey 
}: TeacherDialogProps) {
  // State tanımlamaları
  const videoRef = useRef<HTMLVideoElement>(null);
  const webSocketRef = useRef<WebSocket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isMicActive, setIsMicActive] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // D-ID API yapılandırması
  const D_ID_API_CONFIG = {
    baseUrl: 'https://api.d-id.com',
    apiKey: apiKey || process.env.NEXT_PUBLIC_D_ID_API_KEY,
    teacherImages: {
      male: process.env.NEXT_PUBLIC_MALE_TEACHER_IMAGE,
      female: process.env.NEXT_PUBLIC_FEMALE_TEACHER_IMAGE
    }
  };

  // Stream başlatma fonksiyonu
  const startStream = async () => {
    try {
      if (!D_ID_API_CONFIG.apiKey) {
        throw new Error('D-ID API anahtarı bulunamadı');
      }

      const response = await fetch(`${D_ID_API_CONFIG.baseUrl}/talks/streams`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${D_ID_API_CONFIG.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          source_url: teacherGender === 'male' 
            ? D_ID_API_CONFIG.teacherImages.male 
            : D_ID_API_CONFIG.teacherImages.female,
          script: {
            type: 'text',
            input: `Merhaba ${studentName}! Ben senin ${instrument} öğretmenin olacağım.`,
            provider: {
              type: 'microsoft',
              voice_id: teacherGender === 'male' 
                ? 'tr-TR-AhmetNeural' 
                : 'tr-TR-EmelNeural'
            }
          }
        })
      });

      if (!response.ok) {
        throw new Error(`D-ID API Hatası: ${response.status}`);
      }

      const data: StreamResponse = await response.json();
      connectToStream(data.connection_details.session_id);
      setIsStreaming(true);
      toast.success('Görüşme başlatıldı');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Bilinmeyen bir hata oluştu';
      console.error('Stream başlatma hatası:', errorMessage);
      toast.error(`Bağlantı hatası: ${errorMessage}`);
      
      setMessages(prev => [...prev, {
        id: Date.now(),
        text: `Bağlantı hatası oluştu. Lütfen tekrar deneyin. (${errorMessage})`,
        sender: 'ai',
        type: 'error'
      }]);
    }
  };

  // WebSocket bağlantısı
  const connectToStream = (sessionId: string) => {
    webSocketRef.current = new WebSocket(
      `wss://api.d-id.com/talks/streams/${sessionId}`
    );
    
    webSocketRef.current.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        if (message.type === 'video_data' && videoRef.current) {
          const blob = new Blob([message.data], { type: 'video/mp4' });
          videoRef.current.src = URL.createObjectURL(blob);
        }
      } catch (error) {
        console.error('Video verisi işleme hatası:', error);
      }
    };

    webSocketRef.current.onerror = (error) => {
      console.error('WebSocket hatası:', error);
      toast.error('Bağlantı hatası oluştu');
    };

    webSocketRef.current.onclose = () => {
      setIsStreaming(false);
      toast.info('Görüşme sonlandı');
    };
  };

  // Ses kaydı başlatma
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        audioChunksRef.current = [];
        await processAudioInput(audioBlob);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      toast.success('Ses kaydı başlatıldı');
    } catch (error) {
      console.error('Mikrofon erişim hatası:', error);
      toast.error('Mikrofon erişimi sağlanamadı');
    }
  };

  // Ses kaydını durdurma
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      toast.success('Ses kaydı tamamlandı');
    }
  };

  // Ses girişini işleme
  const processAudioInput = async (audioBlob: Blob) => {
    try {
      // Burada ses tanıma API'si entegrasyonu yapılacak
      // Örnek olarak Web Speech API kullanılabilir
      toast.info('Ses işleniyor...');
    } catch (error) {
      console.error('Ses işleme hatası:', error);
      toast.error('Ses işlenemedi');
    }
  };

  // Mikrofon kontrolü
  const toggleMicrophone = () => {
    if (!isMicActive) {
      startRecording();
    } else {
      stopRecording();
    }
    setIsMicActive(!isMicActive);
  };

  // Kamera kontrolü
  const toggleCamera = () => {
    setIsCameraActive(!isCameraActive);
    if (videoRef.current) {
      videoRef.current.style.display = isCameraActive ? 'none' : 'block';
    }
  };

  // Tam ekran kontrolü
const toggleFullScreen = () => {
  if (!document.fullscreenElement) {
    // Tam ekrana geç
    const videoContainer = document.querySelector('.video-container');
    if (videoContainer?.requestFullscreen) {
      videoContainer.requestFullscreen();
    }
  } else {
    // Tam ekrandan çık
    if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  }
  setIsFullScreen(!isFullScreen);
};

  // Mesaj gönderme fonksiyonu
const sendMessage = async () => {
  if (!inputMessage.trim()) return;

    // Kullanıcı mesajını ekle
    const userMessage: Message = {
      id: messages.length + 1,
      text: inputMessage,
      sender: 'user',
      type: 'text'
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    
    // AI yazıyor efekti
    setIsTyping(true);
  
    // AI yanıtını simüle et
    setTimeout(() => {
      const aiResponse: Message = {
        id: messages.length + 2,
        text: `Merhaba! ${instrument} eğitiminiz için size nasıl yardımcı olabilirim? Temel tekniklerden başlayıp, adım adım ilerleyebiliriz. Önce duruş ve tutuş pozisyonlarını öğreneceğiz.`,
        sender: 'ai',
        type: 'text'
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

// useEffect

useEffect(() => {
  messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
}, [messages]);

useEffect(() => {
  startStream();
  
  return () => {
    if (webSocketRef.current) {
      webSocketRef.current.close();
    }
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
    if (videoRef.current) {
      videoRef.current.src = '';
    }
  };
}, []);

  return (
    <div className="flex flex-col h-[90vh] bg-white rounded-xl overflow-hidden">
      {/* Video Alanı - Üst Kısım */}
      <div className="relative flex-1 bg-gray-900 video-container">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="w-full h-full object-cover"
        />

        {/* Kapatma Butonu */}
  <button 
    onClick={onClose}
    className="absolute top-4 right-4 z-50 p-2 bg-gray-800 rounded-full hover:bg-gray-700 transition-colors"
  >
    <svg 
      className="w-6 h-6 text-white" 
      fill="none" 
      stroke="currentColor" 
      viewBox="0 0 24 24"
    >
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        strokeWidth={2} 
        d="M6 18L18 6M6 6l12 12" 
      />
    </svg>
  </button>

        {/* Kontrol Butonları */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-4">
          <button 
            onClick={toggleMicrophone}
            className={`p-3 ${isMicActive ? 'bg-indigo-600' : 'bg-gray-800'} rounded-full hover:opacity-90 transition-colors`}
          >
            <Mic className="w-6 h-6 text-white" />
          </button>
          <button 
            onClick={toggleCamera}
            className={`p-3 ${isCameraActive ? 'bg-indigo-600' : 'bg-gray-800'} rounded-full hover:opacity-90 transition-colors`}
          >
            <Camera className="w-6 h-6 text-white" />
          </button>
          <button 
            onClick={toggleFullScreen}
            className="p-3 bg-gray-800 rounded-full hover:opacity-90 transition-colors"
          >
            <Maximize className="w-6 h-6 text-white" />
          </button>
        </div>
      </div> {/* Eksik kapanış etiketi eklendi */}
  
      {/* Chat Alanı - Alt Kısım */}
      <div className="h-1/3 border-t">
        <div className="h-full flex flex-col">
          {/* Mesajlar */}
          <div className="flex-1 overflow-y-auto p-4">
            {messages.map((message) => (
              <div 
                key={message.id} 
                className={`flex ${message.sender === 'ai' ? 'justify-start' : 'justify-end'} mb-4`}
              >
                {message.type === 'link' ? (
                  <a 
                    href={message.url} 
                    className="flex items-center space-x-2 p-3 bg-indigo-100 rounded-lg hover:bg-indigo-200 transition-colors"
                  >
                    <PlayCircle className="w-4 h-4 text-indigo-600" />
                    <span>{message.text}</span>
                  </a>
                ) : (
                  <div 
                    className={`p-3 rounded-lg max-w-[70%] ${
                      message.sender === 'ai' 
                        ? 'bg-indigo-100 text-gray-800 shadow-sm font-medium' // Rengi, gölgeyi ve yazı kalınlığını güncelledik
                        : 'bg-indigo-600 text-white'
                    }`}
                  >
                    {message.text}
                  </div>
                )}
              </div>
            ))}
            
            {isTyping && (
              <div className="flex items-center space-x-2 text-gray-500">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '200ms' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '400ms' }}></div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
  
          {/* Input Alanı */}
          <div className="p-4 border-t">
            <div className="flex space-x-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              placeholder="Mesajınızı yazın..."
              className="flex-1 p-2 border rounded-lg focus:outline-none focus:border-indigo-600"
            />
              <button 
                className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                onClick={sendMessage}
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
   ); 
  } 