export interface Lesson {
    id: string;
    title: string;
    description: string;
    duration: number; // dakika cinsinden
    level: 'beginner' | 'intermediate' | 'advanced';
    type: 'theory' | 'practice' | 'exercise';
    completed?: boolean;
    progress?: number; // 0-100 arası
    instrument: 'guitar' | 'piano' | 'drums';
    prerequisites?: string[];
    topics: string[];
  }
  
  export interface UserProgress {
    userId: string;
    currentLesson: string;
    completedLessons: string[];
    totalPracticeTime: number;
    weeklyProgress: {
      [key: string]: number; // günlük pratik süreleri
    };
    performance?: {  // Performance özelliğini ekliyoruz
      lastSession?: {
        accuracy: number;
        tempo: number;
      };
      level: 'beginner' | 'intermediate' | 'advanced';
    };
    streak: number; // ardışık pratik günleri
    lastPracticeDate?: string;
  }
  
  export interface Achievement {
    id: string;
    title: string;
    description: string;
    icon: string;
    unlockedAt?: string;
  }