// src/components/ai-teacher/TeacherDialog.tsx
'use client';

import { useState, useRef, useEffect, ReactNode, JSX } from 'react';
import { Mic, Camera, Maximize, Send, Music, X } from 'lucide-react';
import type { Message, TeacherDialogProps } from '@/types/ai-teacher';
import type { Lesson } from '@/data/lessons';
import { d_idService } from '@/services/d-id';
import { openAIServiceInstance } from '@/services/openai';
import { musicAIServiceInstance } from '@/services/music-ai';
import { AudioAnalyzer } from '@/services/audio-analyzer';
import type { MusicAnalysis } from '@/types/music-analysis';
import { SpeechRecognitionService } from '@/services/speech-recognition';
import { TeacherVisual } from '@/components/interactive-teacher/TeacherVisual';

interface ExtendedTeacherDialogProps extends TeacherDialogProps {
  selectedLesson?: Lesson;
  onLessonComplete?: () => void;
}
interface LessonSegment {
  type: 'video' | 'exercise' | 'practice' | 'theory';
  content: {
    title: string;
    description: string;
    duration: number;
    visualAids: {
      type: 'notation' | 'fretboard' | 'keyboard' | 'sheet';
      content: string;
    }[];
    interactiveElements: {
      type: 'playAlong' | 'recordAndAnalyze' | 'quiz';
      config: any;
    }[];
  };
}
const RealTimeAnalysis = ({ analysis }: { analysis: MusicAnalysis }): JSX.Element => {
  return (
    <div className="absolute top-4 left-4 bg-black bg-opacity-75 p-4 rounded-lg text-white">
      <h3 className="text-sm font-bold mb-3">Performans Analizi</h3>
      
      <div className="space-y-3">
        {/* Ritim Analizi */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs opacity-70">Ritim Doğruluğu</span>
            <span className="text-xs font-medium">{analysis.rhythm.accuracy}%</span>
          </div>
          <div className="w-48 h-1.5 bg-gray-700 rounded-full">
            <div 
              className="h-full bg-green-500 rounded-full transition-all duration-300"
              style={{ width: `${analysis.rhythm.accuracy}%` }}
            />
          </div>
        </div>

        {/* Armoni Bilgisi */}
        <div>
          <span className="text-xs opacity-70">Tonalite</span>
          <p className="text-sm font-medium">{analysis.harmony.keySignature}</p>
        </div>

        {/* Genel Skor */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs opacity-70">Genel Performans</span>
            <span className="text-xs font-medium">{analysis.performance.score}/100</span>
          </div>
          <div className="w-48 h-1.5 bg-gray-700 rounded-full">
            <div 
              className="h-full bg-blue-500 rounded-full transition-all duration-300"
              style={{ width: `${analysis.performance.score}%` }}
            />
          </div>
        </div>

        {/* Öneriler */}
        {analysis.performance.improvements.length > 0 && (
          <div className="mt-2 pt-2 border-t border-gray-700">
            <span className="text-xs opacity-70 block mb-1">Öneriler</span>
            <ul className="text-xs space-y-1">
              {analysis.performance.improvements.slice(0, 2).map((improvement, index) => (
                <li key={index} className="flex items-start">
                  <span className="mr-1">•</span>
                  <span className="opacity-90">{improvement}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

const TeacherDialog: React.FC<ExtendedTeacherDialogProps> = ({ 
  studentName, 
  instrument, 
  teacherGender,
  onClose,
  selectedLesson,
  onLessonComplete 
}): JSX.Element => {
  // State tanımlamaları
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
  const [performanceAnalysis, setPerformanceAnalysis] = useState<MusicAnalysis | null>(null);
  const [audioAnalyzer] = useState(() => new AudioAnalyzer());
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [speechRecognition] = useState(() => new SpeechRecognitionService());
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [currentMessage, setCurrentMessage] = useState<Message | null>(null);

  // Ref tanımlamaları
  const videoRef = useRef<HTMLVideoElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Mount effect
useEffect(() => {
  setIsMounted(true);
  return () => setIsMounted(false);
}, []);

// Chat scroll effect
useEffect(() => {
  if (chatContainerRef.current) {
    chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
  }
}, [messages]);

// Teacher initialization effect
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

// Performance analysis effect
useEffect(() => {
  if (!selectedLesson) return;

  const analyzePerformance = async () => {
    try {
      const analysis = await musicAIServiceInstance.analyzePerformance(
        instrument as 'gitar' | 'piyano' | 'bateri',
        selectedLesson.level
      );
      setPerformanceAnalysis(analysis);
    } catch (error) {
      console.error('Performans analizi hatası:', error);
    }
  };

  analyzePerformance();
}, [selectedLesson, instrument]);

// Audio analysis loop effect
useEffect(() => {
  if (isAnalyzing && audioAnalyzer) {
    let animationFrameId: number;
    let isActive = true;

    const analyzeLoop = async () => {
      if (!isActive) return;

      try {
        const audioData = await audioAnalyzer.analyzeAudio();
        if (audioData && isActive) {
          const analysis = await musicAIServiceInstance.analyzePerformance(
            instrument as 'gitar' | 'piyano' | 'bateri',
            selectedLesson?.level || 'beginner',
            audioData.buffer
          );
          setPerformanceAnalysis(analysis);
        }
        animationFrameId = requestAnimationFrame(analyzeLoop);
      } catch (error) {
        console.error('Analiz hatası:', error);
      }
    };

    analyzeLoop();

    return () => {
      isActive = false;
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }
}, [isAnalyzing, audioAnalyzer, instrument, selectedLesson]);

  const getLessonPrompt = (userMessage: string) => {
    if (!selectedLesson) return userMessage;

    const analysisPrompt = performanceAnalysis ? `
      PERFORMANS ANALİZİ:
      Ritim:
      - Tempo: ${performanceAnalysis.rhythm.tempo} BPM
      - Doğruluk: ${performanceAnalysis.rhythm.accuracy}%
      - Öneriler: ${performanceAnalysis.rhythm.suggestions.join(', ')}

      Armoni:
      - Akor İlerleyişi: ${performanceAnalysis.harmony.chordProgression.join(' -> ')}
      - Tonalite: ${performanceAnalysis.harmony.keySignature}
      - Öneriler: ${performanceAnalysis.harmony.suggestions.join(', ')}
      
      Genel Performans:
      - Puan: ${performanceAnalysis.performance.score}/100
      - Geri Bildirim: ${performanceAnalysis.performance.feedback.join(', ')}
      - İyileştirme Önerileri: ${performanceAnalysis.performance.improvements.join(', ')}
    ` : '';

    return `
      Sen deneyimli bir ${instrument} öğretmenisin ve aşağıdaki özel bilgileri kullanarak yanıt vermelisin:

      DERS BİLGİLERİ:
      Ders: "${selectedLesson.title}"
      Seviye: ${selectedLesson.level}
      Mevcut Konu: ${selectedLesson.topics[topicIndex]}
      
      HEDEFLER:
      ${selectedLesson.objectives.join('\n')}

      ${analysisPrompt}

      MÜZİK TEORİSİ VE TEKNİK:
      1. Temel Müzik Bilgisi:
      - Nota okuma ve yazma
      - Ritim kalıpları
      - Temel müzik teorisi

      2. Enstrüman Teknikleri:
      - Doğru tutuş ve duruş
      - Temel çalım teknikleri
      - İleri seviye teknikler

      3. Performans Değerlendirmesi:
      - Ritim doğruluğu ve kontrol
      - Ton temizliği ve tını kalitesi
      - Müzikal ifade ve dinamikler

      4. Pratik Önerileri:
      - Metronom ile çalışma
      - Teknik egzersizler
      - Örnek parça çalışmaları

      Öğrenci sorusu: ${userMessage}

      Lütfen yanıtını:
      1. Teorik açıklama
      2. Pratik uygulama önerileri
      3. Performans değerlendirmesi
      4. Sonraki adım için öneriler
      şeklinde yapılandır.
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
      setCurrentMessage(aiMessage);
  
      await handleAIResponse(aiResponse);
      
      setIsTyping(false);
    } catch (error) {
      console.error('Mesaj gönderme hatası:', error);
      setError('Mesajınız gönderilemedi. Lütfen tekrar deneyin.');
      setIsTyping(false);
    }
  };
  
  const handleTopicChange = () => {
    if (!selectedLesson) return;
    const nextIndex = topicIndex + 1;
    
    if (nextIndex < selectedLesson.topics.length) {
      setTopicIndex(nextIndex);
      
      const topicMessage: Message = {
        id: Date.now(),
        content: `Harika! Şimdi "${selectedLesson.topics[nextIndex]}" konusuna geçiyoruz.`,
        sender: 'ai',
        type: 'text',
      };
      
      setMessages(prev => [...prev, topicMessage]);
      d_idService.sendNewText(topicMessage.content);
    } else if (nextIndex === selectedLesson.topics.length) {
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

        const toggleRecording = async () => {
          try {
            if (!isRecording) {
              setIsRecording(true);
              setIsTranscribing(true);
              
              // Önce ses analizi başlat
              const started = await audioAnalyzer.startRecording();
              if (!started) {
                throw new Error('Mikrofon başlatılamadı');
              }
        
              // Sonra ses tanıma başlat
              await speechRecognition.startListening((text) => {
                console.log('Recognized text:', text);
                // Yeni text'i input'a eklerken boşlukları düzgün yönet
                setInputMessage((prev) => {
                  const newText = prev.trim() + ' ' + text.trim();
                  // Cümle bittiyse otomatik gönder
                  if (text.match(/[.!?]$/)) {
                    setTimeout(() => handleSendMessage(), 500);
                  }
                  return newText;
                });
                
                // Dinleme animasyonunu göster
                setIsTranscribing(true);
              });
        
              startAnalysis();
            } else {
              audioAnalyzer.stopRecording();
              speechRecognition.stopListening();
              setIsRecording(false);
              setIsTranscribing(false);
              setIsAnalyzing(false);
            }
          } catch (error) {
            console.error('Mikrofon hatası:', error);
            setError('Mikrofon erişimi sağlanamadı. Lütfen izinleri kontrol edin.');
            setIsRecording(false);
            setIsTranscribing(false);
            setIsAnalyzing(false);
          }
        };

  const startAnalysis = () => {
    setIsAnalyzing(true);
    let animationFrameId: number;
  
    const analyzeLoop = async () => {
      if (!isAnalyzing) return;
  
      const audioData = await audioAnalyzer.analyzeAudio();
      if (audioData) {
        const analysis = await musicAIServiceInstance.analyzePerformance(
          instrument as 'gitar' | 'piyano' | 'bateri',
          selectedLesson?.level || 'beginner',
          audioData.buffer
        );
        setPerformanceAnalysis(analysis);
      }
  
      animationFrameId = requestAnimationFrame(analyzeLoop);
    };
  
    analyzeLoop();
  
    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  };

  const handleAIResponse = async (response: string) => {
    if (!isStreamActive) return;

    try {
      await Promise.all([
        d_idService.sendNewText(response),
        // Eğer ayrı bir ses servisi kullanacaksak:
        // audioService.playResponse(response)
      ]);
    } catch (error) {
      console.error('AI yanıt hatası:', error);
      setError('Öğretmen yanıtı gösterilirken bir hata oluştu.');
    }
  };

  if (!isMounted) return <></>;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
      <div className="container h-[90vh] max-w-7xl bg-white rounded-2xl overflow-hidden">
      </div>
      {/* Header */}
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

      {/* Video/Visual Container */}
      <div className="relative flex-1 bg-gray-900 video-container">
        {/* D-ID video stream'i */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className={`w-full h-full object-cover ${!isCameraActive || !isStreamActive ? 'hidden' : ''}`}
        />

        {/* TeacherVisual görünümü */}
        <div className={`absolute inset-0 ${!isCameraActive || isStreamActive ? 'hidden' : 'block'}`}>
          <TeacherVisual
            instrument={instrument as 'gitar' | 'piyano' | 'bateri'}
            currentAction={currentMessage?.action || ''}
            isTeaching={isTyping}
            lessonContent={selectedLesson?.content}
            currentPerformance={performanceAnalysis}
          />
        </div>

        {/* Loading State */}
        {!isStreamActive && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75">
            <div className="text-white flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mb-4" />
              <div className="text-lg">Öğretmen bağlanıyor...</div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="absolute top-16 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded-lg">
            {error}
          </div>
        )}

        {/* Recording Indicator */}
        {isTranscribing && (
          <div className="absolute bottom-28 left-4 bg-blue-500 text-white px-3 py-1 rounded-full text-sm">
            Sizi dinliyorum...
          </div>
        )}

        {/* Control Buttons */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-4">
          <button 
            onClick={toggleRecording}
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

        {/* Performance Analysis */}
        {performanceAnalysis && <RealTimeAnalysis analysis={performanceAnalysis} />}

        {/* Close Button */}
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

      {/* Chat Section */}
      <div className="h-1/3 border-t">
        <div className="flex flex-col h-full">
        <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4 h-[40vh]"> 
            {messages.map((message) => (
              <div 
                key={message.id}
                className={`flex ${message.sender === 'ai' ? 'justify-start' : 'justify-end'} mb-4 animate-slideIn`}
              >
                {message.sender === 'ai' && (
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center mr-2">
                    <Music className="w-4 h-4 text-white" />
                  </div>
                )}
                <div 
                  className={`p-4 rounded-lg max-w-[80%] ${
                    message.type === 'error' ? 'bg-red-100 text-red-700' :
                    message.sender === 'ai' ? 'bg-blue-100 text-gray-800' : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 border-t flex items-center">
            <input 
              type="text" 
              value={inputMessage} 
              onChange={(e) => setInputMessage(e.target.value)} 
              className="flex-1 p-2 border rounded-lg"
              placeholder="Mesajınızı yazın..."
            />
            <button 
              onClick={handleSendMessage}
              className="ml-2 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Send className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDialog;