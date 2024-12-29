// src/components/ai-teacher/TeacherDialog.tsx
'use client';

import { useState, useRef, useEffect, ReactNode, JSX } from 'react';
import { Mic, Camera, Maximize, Send, Music, X } from 'lucide-react';
import type { Lesson } from '@/data/lessons';
import { d_idService } from '@/services/d-id';
import { openAIServiceInstance } from '@/services/openai';
import { musicAIServiceInstance } from '@/services/music-ai';
import { AudioAnalyzer } from '@/services/audio-analyzer';
import type { MusicAnalysis } from '@/types/music-analysis';
import { SpeechRecognitionService } from '@/services/speech-recognition';
import { TeacherVisual } from '@/components/interactive-teacher/TeacherVisual';
import { curriculum } from '@/data/curriculum';
import { teacherDialogs } from '@/data/teacherDialogs';
import type { Message, TeacherDialogProps, DialogOption, DialogStep } from '@/types/ai-teacher';



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
  const [currentDialogId, setCurrentDialogId] = useState('greeting-1');
  const [currentStep, setCurrentStep] = useState(0);
  const [lessonStarted, setLessonStarted] = useState(false);
  const [currentDialog, setCurrentDialog] = useState<DialogStep | null>(null);
  const [selectedInstrument, setSelectedInstrument] = useState<'gitar' | 'piyano' | 'bateri'>(instrument);
  const [userLevel, setUserLevel] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');
  
  

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

    // Müfredat ve ders bilgilerini al
    const curriculumData = curriculum[instrument as keyof typeof curriculum];
    const currentLesson = curriculumData?.beginner.lessons.find(
        lesson => lesson === selectedLesson.id
    );
    
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
      Sen şu anda bir ${instrument} öğretmenisin. Öğrencinin şu anki durumu:

      DERS DETAYLARI:
      - Ders: ${selectedLesson.title}
      - Seviye: ${selectedLesson.level}
      - Mevcut Konu: ${selectedLesson.topics[topicIndex]}
      
      HEDEFLER:
      ${selectedLesson.objectives.map(obj => `- ${obj}`).join('\n')}

      MÜFREDAT YAPISI:
      ${curriculumData?.beginner.description}
      Öğrenme Yolu: ${curriculumData?.beginner.learningPath[topicIndex].focus}
      Pratik Hedefi: ${curriculumData?.beginner.learningPath[topicIndex].practiceGoals}

      ${analysisPrompt}

      ÖĞRETMEN NOTLARI:
      - Öğrencinin seviyesine uygun açıklamalar yap
      - Her açıklamadan sonra pratik önerileri ver
      - Hataları nazikçe düzelt
      - Motive edici ol

      Öğrenci sorusu/mesajı: "${userMessage}"

      Lütfen cevabını:
      1. Nazik bir açıklama
      2. Pratik önerisi
      3. Motive edici bir kapanış
      şeklinde yapılandır.
    `;
  };

  const handleDialogFlow = async () => {
    console.log('Dialog Flow Started - Current Step:', currentStep);
    console.log('Selected Instrument:', selectedInstrument);
    console.log('User Level:', userLevel);
    
    const dialogData = teacherDialogs.lessons?.[selectedInstrument];
    if (!dialogData || !dialogData[userLevel]) {
        console.log('No dialog data found for instrument/level');
        return;
    }
 
    const currentDialogSteps = dialogData[userLevel]?.intro[0]?.steps;
    console.log('Current Dialog Steps:', currentDialogSteps);
 
    const dialogStep = currentDialogSteps?.[currentStep];
    
    if (!dialogStep) {
        console.log('No dialog step found, returning');
        return;
    }
 
    setCurrentDialog(dialogStep);
    console.log('Setting Current Dialog:', dialogStep);
    
    const aiMessage: Message = {
        id: Date.now(),
        content: dialogStep.content,
        sender: 'ai',
        type: 'text',
        action: dialogStep.action
    };
    console.log('Created AI Message:', aiMessage);
 
    if (dialogStep.options) {
        console.log('Dialog has options:', dialogStep.options);
        const optionMessages: Message[] = dialogStep.options.map((opt: DialogOption) => ({
            id: Date.now() + Math.random(),
            content: opt.text,
            sender: 'ai',
            type: 'option',
            optionId: opt.id,
            next: opt.next
        }));
        
        console.log('Created Option Messages:', optionMessages);
        setMessages(prev => [...prev, aiMessage, ...optionMessages]);
    } else {
        console.log('No options, setting single message');
        setMessages(prev => [...prev, aiMessage]);
    }
 
    setCurrentMessage(aiMessage);
    console.log('Set Current Message');
    
    await handleAIResponse(aiMessage.content);
    console.log('Handled AI Response');
 
    if (dialogStep.nextDialogId) {
        console.log('Found next dialog, will proceed in 3 seconds:', dialogStep.nextDialogId);
        setTimeout(() => {
            setCurrentStep(prev => prev + 1);
            console.log('Moved to next step');
        }, 3000);
    }
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
  
      if (!lessonStarted && inputMessage.toLowerCase().match(/hazır|başla|evet|öğret/)) {
        setLessonStarted(true);
        await handleDialogFlow();
      } else if (currentDialog?.options) {
        const selectedOption = currentDialog.options.find(
          opt => inputMessage.toLowerCase().includes(opt.text.toLowerCase())
        );
        if (selectedOption) {
          setCurrentStep(prev => prev + 1);
          await handleDialogFlow();
        }
      } else {
        const prompt = getLessonPrompt(inputMessage);
        const aiResponse = await openAIServiceInstance.getMusicTeacherResponse(
          instrument as 'gitar' | 'piyano' | 'bateri',
          prompt
        );
  
        const aiMessage: Message = {
          id: Date.now() + 1,
          content: aiResponse,
          sender: 'ai',
          type: 'text',
        };
        
        setMessages(prev => [...prev, aiMessage]);
        setCurrentMessage(aiMessage);
        await handleAIResponse(aiResponse);
      }
      
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
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center">
      <div className="container max-w-7xl h-[90vh] bg-white rounded-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <header className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white p-4 shrink-0">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold">
                {selectedLesson?.title || `${instrument} Dersi`}
              </h2>
              <p className="text-sm opacity-90">
                {selectedLesson?.topics[topicIndex]}
              </p>
            </div>
            <div className="flex items-center gap-4">
              {selectedLesson && (
                <div className="flex items-center gap-2">
                  <span className="text-sm">İlerleme:</span>
                  <div className="w-32 h-2 bg-indigo-800/50 rounded-full">
                    <div 
                      className="h-full bg-white rounded-full transition-all"
                      style={{ width: `${lessonProgress}%` }}
                    />
                  </div>
                </div>
              )}
              <button 
                onClick={onClose}
                className="p-2 hover:bg-black/20 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>
        </header>
  
        {/* Main Content - 3 Column Layout */}
        <main className="flex-1 grid grid-cols-[1fr,1fr,1fr] gap-4 p-4 min-h-0">
          {/* AI Teacher Video */}
          <div className="relative bg-gray-900 rounded-xl overflow-hidden">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className={`w-full h-full object-cover ${!isCameraActive || !isStreamActive ? 'hidden' : ''}`}
            />
            
            <div className={`absolute inset-0 ${!isCameraActive || isStreamActive ? 'hidden' : 'block'}`}>
              <TeacherVisual
                instrument={instrument}
                currentAction={currentMessage?.action || ''}
                isTeaching={isTyping}
                lessonContent={{
                  type: 'exercise',
                  title: selectedLesson?.title || '',
                  content: selectedLesson?.objectives[0] || '',
                  visualAids: []
                }}
                currentPerformance={performanceAnalysis ? {
                 accuracy: performanceAnalysis.rhythm.accuracy,
                 rhythm: performanceAnalysis.rhythm.accuracy,
                 tempo: performanceAnalysis.rhythm.tempo,
                 suggestions: performanceAnalysis.performance.improvements
                } : undefined}
               />
            </div>
  
            {/* Controls */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-3">
              <button 
                onMouseDown={() => toggleRecording()}
                onMouseUp={() => {
                  if (isRecording) {
                    handleSendMessage();
                    toggleRecording();
                  }
                }}
                className={`p-3 rounded-full hover:opacity-90 transition-colors ${
                  isRecording ? 'bg-red-600' : 'bg-gray-800'
                }`}
                title={isRecording ? 'Kaydı Durdur' : 'Basılı Tutarak Konuşun'}
              >
                <Mic className="w-6 h-6 text-white" />
              </button>
              <button 
                onClick={toggleCamera} 
                className={`p-3 rounded-full hover:opacity-90 transition-colors ${
                  isCameraActive ? 'bg-indigo-600' : 'bg-gray-800'
                }`}
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
  
            {performanceAnalysis && <RealTimeAnalysis analysis={performanceAnalysis} />}
          </div>
  
          {/* Visual Content Area */}
          <div className="bg-gray-50 rounded-xl overflow-hidden p-4">
            {/* Visual content will be here */}
          </div>
  
          {/* Chat Section */}
          <div className="flex flex-col bg-white rounded-xl overflow-hidden border">
            <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((message) => (
                <div 
                  key={message.id}
                  className={`flex ${message.sender === 'ai' ? 'justify-start' : 'justify-end'}`}
                >
                  {message.sender === 'ai' && (
                    <div className="w-8 h-8 rounded-full bg-indigo-600 flex-shrink-0 flex items-center justify-center mr-2">
                      <Music className="w-4 h-4 text-white" />
                    </div>
                  )}
                  <div className={`p-3 rounded-lg max-w-[80%] shadow-sm ${
                    message.sender === 'ai' 
                      ? 'bg-gray-100 text-gray-900 font-medium' 
                      : 'bg-indigo-600 text-white font-medium'
                  }`}>
                    {message.content}
                  </div>
                </div>
              ))}
  
              {isTyping && (
                <div className="flex items-center space-x-2 p-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                </div>
              )}
            </div>
            
            <div className="p-4 bg-white border-t flex gap-2">
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
                className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 font-medium"
                placeholder="Mesajınızı yazın..."
              />
              <button
                onClick={handleSendMessage}
                disabled={isTyping || !inputMessage.trim()}
                className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
              >
                <Send className="w-6 h-6" />
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default TeacherDialog;