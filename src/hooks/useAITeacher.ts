// hooks/useAITeacher.ts
import { useState, useCallback } from 'react';
import { openAIService } from '@/services/openai';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  type: 'text' | 'error';
}

export function useAITeacher({ studentName, instrument }: { studentName: string; instrument: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  const addMessage = useCallback((message: Message) => {
    setMessages(prev => [...prev, message]);
  }, []);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) {
      throw new Error('Mesaj içeriği boş olamaz');
    }

    setIsTyping(true);

    try {
      // Kullanıcı mesajını ekle
      const userMessage: Message = {
        id: Date.now().toString(),
        content,
        sender: 'user',
        type: 'text'
      };
      addMessage(userMessage);

      // AI yanıtını al
      const aiResponse = await openAIService.getMusicTeacherResponse(instrument, content);
      
      // AI mesajını ekle
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponse,
        sender: 'ai',
        type: 'text'
      };
      addMessage(aiMessage);

      return aiMessage;

    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Mesaj işlenirken bir hata oluştu';

      // Hata mesajını ekle
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        content: errorMessage,
        sender: 'ai',
        type: 'error'
      };
      addMessage(errorMsg);

      throw error;
    } finally {
      setIsTyping(false);
    }
  }, [instrument, addMessage]);

  const sendWelcomeMessage = useCallback(() => {
    const welcomeMessage: Message = {
      id: Date.now().toString(),
      content: `Merhaba ${studentName}! Ben senin ${instrument} öğretmeninim. Nasıl yardımcı olabilirim?`,
      sender: 'ai',
      type: 'text'
    };
    addMessage(welcomeMessage);
  }, [studentName, instrument, addMessage]);

  return {
    messages,
    isTyping,
    sendMessage,
    sendWelcomeMessage
  };
}