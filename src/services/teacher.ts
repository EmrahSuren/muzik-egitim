interface TeacherService {
    // Video ve Ses
    initializeStream: () => Promise<void>;
    updateAvatar: (emotion: string) => Promise<void>;
    
    // AI Etkileşimi
    processUserInput: (input: string) => Promise<AIResponse>;
    generateLesson: (topic: string) => Promise<LessonPlan>;
    
    // İlerleme Takibi
    trackProgress: (performance: PerformanceData) => void;
    generateFeedback: () => Promise<string>;
  }
  