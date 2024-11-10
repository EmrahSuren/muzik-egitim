'use client';
import React, { useRef, useState, useEffect } from 'react';
import { Mic, Camera, Maximize, Send, PlayCircle } from 'lucide-react';

interface Message {
  id: number;
  text: string;
  sender: 'ai' | 'user';
  type?: 'text' | 'link';
  url?: string;
}

interface TeacherDialogProps {
  onClose: () => void;
  teacherGender: 'male' | 'female';
  studentName: string;
  instrument: string;
}

export default function TeacherDialog({ onClose, teacherGender, studentName, instrument }: TeacherDialogProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isMicActive, setIsMicActive] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(true);

  // Mesaj gönderme fonksiyonu
  const sendMessage = () => {
    if (inputMessage.trim() === '') return; // Boş mesaj gönderilmesini engelle
    const newMessage = {
      id: messages.length + 1,
      text: inputMessage,
      sender: 'user',
      type: 'text',
    };
    setMessages((prev) => [...prev, newMessage]);
    setInputMessage('');
    
    // AI öğretmenine mesaj gönderme işlemini burada başlatabilirsiniz
    // örneğin, startStream fonksiyonunu tetikleyebilirsiniz.
  };

  // Stream başlatma fonksiyonu
  const startStream = async () => {
    try {
      const response = await fetch('https://api.d-id.com/talks/streams', {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${process.env.D_ID_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          source_url: teacherGender === 'male' ? 
            'URL_TO_MALE_TEACHER_IMAGE' : 
            'URL_TO_FEMALE_TEACHER_IMAGE',
          script: {
            type: 'text',
            input: `Merhaba ${studentName}! Ben senin ${instrument} öğretmenin olacağım.`,
            provider: {
              type: 'microsoft',
              voice_id: teacherGender === 'male' ? 
                'tr-TR-AhmetNeural' : 
                'tr-TR-EmelNeural'
            }
          }
        })
      });

      const data = await response.json();
      connectToStream(data.connection_details.session_id);
      setIsStreaming(true);
    } catch (error) {
      console.error('Stream başlatma hatası:', error);
    }
  };

   // useEffect ile akışı başlatma
   useEffect(() => {
    startStream();
    return () => {
      // Temizleme işlemi
      if (videoRef.current) {
        videoRef.current.src = '';
      }
    };
  }, []);

  // Mikrofon kontrolü
  const toggleMicrophone = () => {
    setIsMicActive(!isMicActive);
    // Burada mikrofon erişimi ve ses analizi eklenecek
  };

  // Kamera kontrolü
  const toggleCamera = () => {
    setIsCameraActive(!isCameraActive);
    if (videoRef.current) {
      videoRef.current.style.display = isCameraActive ? 'none' : 'block';
    }
  };

  // WebSocket bağlantısı
  const connectToStream = (sessionId: string) => {
    const ws = new WebSocket(`wss://api.d-id.com/talks/streams/${sessionId}`);
    
    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === 'video_data') {
        if (videoRef.current) {
          const blob = new Blob([message.data], { type: 'video/mp4' });
          videoRef.current.src = URL.createObjectURL(blob);
        }
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket hatası:', error);
      alert('Bir hata oluştu. Lütfen tekrar deneyin.'); // Kullanıcıya hata bildirimi
    };

    ws.onclose = () => {
      setIsStreaming(false);
    };
  };

  return (
    <div className="flex flex-col h-[90vh] bg-white rounded-xl overflow-hidden">
      {/* Video Alanı - Üst Kısım */}
      <div className="relative flex-1 bg-gray-900">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="w-full h-full object-cover"
        />
  
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
            onClick={() => setIsFullScreen(!isFullScreen)}
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
                        ? 'bg-gray-100' 
                        : 'bg-indigo-600 text-white'
                    }`}
                  >
                    {message.text}
                  </div>
                )}
              </div>
            ))}
          </div>
  
          {/* Input Alanı */}
          <div className="p-4 border-t">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
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