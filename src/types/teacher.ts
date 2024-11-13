interface AITeacher {
  id: string;
  context: {
    studentName: string;
    instrument: string;
    currentLevel: 'beginner' | 'intermediate' | 'advanced';
    lessonState: 'assessment' | 'learning' | 'practice' | 'feedback';
  };
  
  conversationHistory: {
    messages: Message[];
    currentTopic: string;
    lessonProgress: number;
  };

  capabilities: {
    canDetectAudio: boolean;
    canProcessVideo: boolean;
    canProvideRealTimeFeedback: boolean;
  };
}

interface Message {
  id: string;
  type: 'text' | 'audio' | 'visualization' | 'exercise';
  sender: 'ai' | 'student';
  content: string;
  timestamp: Date;
  metadata?: {
    exerciseType?: string;
    audioUrl?: string;
    visualData?: any;
    feedback?: {
      accuracy: number;
      suggestions: string[];
    };
  };
}