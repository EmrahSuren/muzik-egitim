'use client';
import { useState, useRef, useEffect } from 'react';
import { Mic, Camera, Maximize, Send, BookOpen } from 'lucide-react';
import type { Message, TeacherDialogProps } from '@/types/ai-teacher';
import type { Lesson } from '@/data/lessons';
import { d_idService } from '@/services/d-id';
import { openAIServiceInstance } from '@/services/openai';

interface ExtendedTeacherDialogProps extends TeacherDialogProps {
  selectedLesson?: Lesson;
  onLessonComplete?: () => void;
}

const TeacherDialog: React.FC<ExtendedTeacherDialogProps> = ({ 
  studentName, 
  instrument, 
  teacherGender,
  onClose,
  selectedLesson,
  onLessonComplete 
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isStreamActive, setIsStreamActive] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lessonProgress, setLessonProgress] = useState(0);
  const [topicIndex, setTopicIndex] = useState(0);

  const videoRef = useRef<HTMLVideoElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (!isMounted) return;

    const initializeTeacher = async () => {
      try {
        setError(null);
        let welcomeMessage: Message;

        if (selectedLesson) {
          welcomeMessage = {
            id: Date.now(),
            content: `Merhaba ${studentName}! "${selectedLesson.title}" dersine hoş geldin. 
                     Bu derste ${selectedLesson.objectives[0].toLowerCase()} konusunda çalışacağız. 
                     İlk konumuz: ${selectedLesson.topics[0]}. Başlamaya hazır mısın?`,
            sender: 'ai',
            type: 'text',
          };
        } else {
          welcomeMessage = {
            id: Date.now(),
            content: `Merhaba ${studentName}! Ben senin ${instrument} öğretmeninim.`,
            sender: 'ai',
            type: 'text',
          };
        }

        setMessages([welcomeMessage]);

        await d_idService.startStream(teacherGender, welcomeMessage.content);
        setIsStreamActive(true);
      } catch (error) {
        console.error('Başlatma hatası:', error);
        setError('Öğretmen bağlantısı kurulamadı. Lütfen tekrar deneyin.');
      }
    };

    initializeTeacher();

    return () => {
      d_idService.disconnect();
      setIsStreamActive(false);
    };
  }, [isMounted, studentName, instrument, teacherGender, selectedLesson]);

  const getLessonPrompt = (userMessage: string) => {
    if (!selectedLesson) return userMessage;

    return `
      Sen deneyimli bir ${instrument} öğretmenisin.
      Şu anki ders: "${selectedLesson.title}"
      
      Dersin hedefleri:
      ${selectedLesson.objectives.join('\n')}
      
      Mevcut konu: ${selectedLesson.topics[topicIndex]}
      
      Öğrenci sorusu: ${userMessage}
      
      Lütfen dersin hedeflerine odaklanarak ve mevcut konuya uygun şekilde yanıt ver.
    `;
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isTyping) return;

    try {
      const userMessage: Message = {
        id: Date.now(),
        content: inputMessage,
        sender: 'user',
        type: 'text',
      };
      setMessages(prev => [...prev, userMessage]);
      setInputMessage('');
      setIsTyping(true);

      const prompt = getLessonPrompt(inputMessage);
      const aiResponse = await openAIServiceInstance.getMusicTeacherResponse(instrument, prompt);

      const aiMessage: Message = {
        id: Date.now() + 1,
        content: aiResponse,
        sender: 'ai',
        type: 'text',
      };
      setMessages(prev => [...prev, aiMessage]);

      if (isStreamActive) {
        await d_idService.sendNewText(aiResponse);
      }

      if (selectedLesson) {
        const newProgress = Math.min(100, lessonProgress + 10);
        setLessonProgress(newProgress);
        
        // İlerleme belirli bir eşiğe ulaştığında topic değişimi
        if (lessonProgress < 90 && newProgress >= 90) {
          handleTopicChange();
        }

        if (newProgress >= 100 && onLessonComplete) {
          onLessonComplete();
        }
      }

    } catch (error) {
      console.error('Mesaj hatası:', error);
      const errorMessage: Message = {
        id: Date.now() + 1,
        content: 'Üzgünüm, bir hata oluştu. Lütfen tekrar deneyin.',
        sender: 'ai',
        type: 'error',
      };
      setMessages(prev => [...prev, errorMessage]);
      setError('Mesaj gönderilemedi. Lütfen tekrar deneyin.');
    } finally {
      setIsTyping(false);
    }
  };

  const handleTopicChange = () => {
    if (!selectedLesson) return;
    const nextIndex = topicIndex + 1;
    
    if (nextIndex < selectedLesson.topics.length) {
      setTopicIndex(nextIndex);
      
      // Yeni topic başladığında bilgilendirme mesajı
      const topicMessage: Message = {
        id: Date.now(),
        content: `Harika! Şimdi "${selectedLesson.topics[nextIndex]}" konusuna geçiyoruz.`,
        sender: 'ai',
        type: 'text',
      };
      
      setMessages(prev => [...prev, topicMessage]);
      d_idService.sendNewText(topicMessage.content);
    } else if (nextIndex === selectedLesson.topics.length) {
      // Tüm topicler tamamlandığında
      const completionMessage: Message = {
        id: Date.now(),
        content: `Tebrikler! "${selectedLesson.title}" dersini başarıyla tamamladın.`,
        sender: 'ai',
        type: 'text',
      };
      
      setMessages(prev => [...prev, completionMessage]);
      d_idService.sendNewText(completionMessage.content);
      onLessonComplete?.();
    }
  };

  const toggleCamera = () => {
    setIsCameraActive(prev => !prev);
    if (videoRef.current) {
      videoRef.current.style.display = isCameraActive ? 'none' : 'block';
    }
  };

  const toggleFullScreen = async () => {
    try {
      const videoContainer = document.querySelector('.video-container');
      if (!document.fullscreenElement && videoContainer?.requestFullscreen) {
        await videoContainer.requestFullscreen();
        setIsFullscreen(true);
      } else if (document.exitFullscreen) {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch (error) {
      console.error('Fullscreen hatası:', error);
    }
  };

  if (!isMounted) return null;

  return (
    <div className="flex flex-col h-[90vh] bg-white rounded-xl overflow-hidden">
      <div className="bg-blue-600 text-white p-4">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold">
              {selectedLesson?.title || `${instrument} Dersi`}
            </h2>
            <p className="text-sm opacity-90">
              {selectedLesson?.topics[topicIndex]}
            </p>
          </div>
          {selectedLesson && (
            <div className="flex items-center gap-2">
              <div className="text-sm">İlerleme:</div>
              <div className="w-32 h-2 bg-blue-800 rounded-full">
                <div 
                  className="h-full bg-white rounded-full transition-all duration-300"
                  style={{ width: `${lessonProgress}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="relative flex-1 bg-gray-900 video-container">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className={`w-full h-full object-cover ${!isCameraActive ? 'hidden' : ''}`}
        />

        {!isStreamActive && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75">
            <div className="text-white flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mb-4" />
              <div className="text-lg">Öğretmen bağlanıyor...</div>
            </div>
          </div>
        )}

        {error && (
          <div className="absolute top-16 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded-lg">
            {error}
          </div>
        )}

        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-4">
          <button 
            onClick={() => setIsRecording(!isRecording)}
            className={`p-3 ${isRecording ? 'bg-red-600' : 'bg-gray-800'} rounded-full hover:opacity-90 transition-opacity`}
            title={isRecording ? 'Kaydı Durdur' : 'Kayda Başla'}
          >
            <Mic className="w-6 h-6 text-white" />
          </button>
          <button 
            onClick={toggleCamera}
            className={`p-3 ${isCameraActive ? 'bg-blue-600' : 'bg-gray-800'} rounded-full hover:opacity-90 transition-opacity`}
            title={isCameraActive ? 'Kamerayı Kapat' : 'Kamerayı Aç'}
          >
            <Camera className="w-6 h-6 text-white" />
          </button>
          <button 
            onClick={toggleFullScreen}
            className="p-3 bg-gray-800 rounded-full hover:opacity-90 transition-opacity"
            title={isFullscreen ? 'Tam Ekrandan Çık' : 'Tam Ekran'}
          >
            <Maximize className="w-6 h-6 text-white" />
          </button>
        </div>

        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-gray-800 rounded-full hover:bg-gray-700 transition-colors"
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
      </div>

      <div className="h-1/3 border-t">
        <div className="flex flex-col h-full">
          <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4">
            {messages.map((message) => (
              <div 
                key={message.id}
                className={`flex ${message.sender === 'ai' ? 'justify-start' : 'justify-end'} mb-4`}
              >
                <div 
                  className={`p-3 rounded-lg max-w-[70%] ${
                    message.type === 'error' ? 'bg-red-100 text-red-700' :
                    message.sender === 'ai' ? 'bg-blue-100 text-gray-800' : 
                    'bg-blue-600 text-white'
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
                className="flex-1 p-2 border rounded-lg focus:outline-none focus:border-blue-600"
                disabled={isTyping}
              />
              <button 
                onClick={handleSendMessage}
                disabled={isTyping || !inputMessage.trim()}
                className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDialog;