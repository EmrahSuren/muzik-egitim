'use client';
import { useState, useRef, useEffect } from 'react';
import { Mic, Camera, Maximize, Send } from 'lucide-react';
import { Message, TeacherDialogProps } from '@/types/ai-teacher';
import { useAITeacher } from '@/hooks/useAITeacher';
import { d_idService } from '@/services/d-id';

export const TeacherDialog = ({ onClose, teacherGender, studentName, instrument }: TeacherDialogProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isStreamActive, setIsStreamActive] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);

  // AI Hook
  const {
    messages,
    isTyping,
    sendMessage,
    sendWelcomeMessage
  } = useAITeacher({ studentName, instrument });

  // Hook kullanımı
  useEffect(() => {
    sendWelcomeMessage();
  }, [sendWelcomeMessage]);

  // Mesaj gönderme işlemi
  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;
    
    try {
      // AI'ya mesaj gönder
      await sendMessage(inputMessage);
      
      // D-ID'ye mesaj gönder
      if (isStreamActive) {
        await d_idService.sendNewText(inputMessage);
      }
      
      setInputMessage('');
    } catch (error) {
      console.error('Mesaj gönderme hatası:', error);
    }
  };

   // D-ID Stream başlatma
   useEffect(() => {
    const initStream = async () => {
      try {
        const initialMessage = `Merhaba ${studentName}! Ben senin ${instrument} öğretmeninim.`;
        await d_idService.startStream('male', initialMessage);
        setIsStreamActive(true);
      } catch (error) {
        console.error('Stream başlatma hatası:', error);
        // Hata durumunda UI'da gösterilecek bir bildirim ekleyebiliriz
      }
    };

    initStream();

    // Cleanup
    return () => {
      d_idService.disconnect();
      setIsStreamActive(false);
    };
  }, [studentName, instrument]);

  

  // Video kontrolü güncellendi
  const toggleCamera = () => {
    setIsCameraActive(!isCameraActive);
    if (videoRef.current) {
      videoRef.current.style.display = isCameraActive ? 'none' : 'block';
    }
  };

  // Tam ekran kontrolü
  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      const videoContainer = document.querySelector('.video-container');
      if (videoContainer?.requestFullscreen) {
        videoContainer.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    setIsFullscreen(!isFullscreen);
  };


  return (
    <div className="flex flex-col h-[90vh] bg-white rounded-xl overflow-hidden">
      <div className="relative flex-1 bg-gray-900 video-container">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="w-full h-full object-cover"
        />

         {/* Loading State - Bunu ekleyin */}
         {!isStreamActive && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75">
            <div className="text-white flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mb-4"></div>
              <div className="text-lg">Öğretmen bağlanıyor...</div>
            </div>
          </div>
        )}

        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-gray-800 rounded-full"
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

        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-4">
          <button 
            onClick={() => setIsRecording(!isRecording)}
            className={`p-3 ${isRecording ? 'bg-indigo-600' : 'bg-gray-800'} rounded-full`}
          >
            <Mic className="w-6 h-6 text-white" />
          </button>
          <button 
            onClick={() => setIsCameraActive(!isCameraActive)}
            className={`p-3 ${isCameraActive ? 'bg-indigo-600' : 'bg-gray-800'} rounded-full`}
          >
            <Camera className="w-6 h-6 text-white" />
          </button>
          <button 
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-3 bg-gray-800 rounded-full"
          >
            <Maximize className="w-6 h-6 text-white" />
          </button>
        </div>
      </div>

      <div className="h-1/3 border-t">
        <div className="flex flex-col h-full">
          <div className="flex-1 overflow-y-auto p-4">
            {messages.map((message) => (
              <div 
                key={message.id} 
                className={`flex ${message.sender === 'ai' ? 'justify-start' : 'justify-end'} mb-4`}
              >
                <div 
                  className={`p-3 rounded-lg max-w-[70%] ${
                    message.sender === 'ai' 
                      ? 'bg-indigo-100 text-gray-800' 
                      : 'bg-indigo-600 text-white'
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex items-center space-x-2 text-gray-500">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '200ms' }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '400ms' }} />
              </div>
            )}
          </div>

          <div className="p-4 border-t">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder={`${studentName}, mesajınızı yazın...`}
                className="flex-1 p-2 border rounded-lg focus:outline-none focus:border-indigo-600"
              />
              <button 
                onClick={handleSendMessage}
                className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
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