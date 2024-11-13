import { useState, useCallback } from 'react';
import { Message } from '@/types/ai-teacher';

interface UseAITeacherProps {
  studentName: string;
  instrument: string;
}

export function useAITeacher({ studentName, instrument }: UseAITeacherProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  // AI yanıtı oluşturma
  const generateAIResponse = useCallback(async (message: string) => {
    // Kullanıcının mesajına göre kişiselleştirilmiş yanıtlar
    const responses = [
      `"${message}" hakkında ${instrument} çalışırken dikkat etmeniz gereken nokta...`,
      `${studentName}, ${message} konusunda haklısınız. Bir sonraki adımda şunu yapacağız...`,
      `${instrument} çalarken ${message} tekniğini doğru uygulamanız çok önemli...`,
      `Harika bir soru! ${message} konusunda ilerlemeniz çok iyi, şimdi şunu deneyelim...`,
    ];

    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    
    return {
      id: Date.now(),
      content: randomResponse,
      sender: 'ai' as const,
      type: 'text' as const
    };
  }, [instrument, studentName]);

  // Mesaj gönderme işlemi
  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;

    // Kullanıcı mesajını ekle
    const userMessage: Message = {
      id: Date.now(),
      content,
      sender: 'user',
      type: 'text'
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    try {
      // AI yanıtı al
      const aiResponse = await generateAIResponse(content);
      
      // Gerçekçi bir gecikme ekle
      setTimeout(() => {
        setMessages(prev => [...prev, aiResponse]);
        setIsTyping(false);
      }, 1500);

    } catch (error) {
      console.error('AI yanıt hatası:', error);
      setIsTyping(false);
    }
  }, [generateAIResponse]);

  // İlk karşılama mesajı
  const sendWelcomeMessage = useCallback(() => {
    const welcomeMessage: Message = {
      id: Date.now(),
      content: `Merhaba ${studentName}! Ben senin ${instrument} öğretmeninim. Bugün neler öğrenmek istersin?`,
      sender: 'ai',
      type: 'text'
    };
    setMessages([welcomeMessage]);
  }, [studentName, instrument]);

  return {
    messages,
    isTyping,
    sendMessage,
    sendWelcomeMessage
  };
}