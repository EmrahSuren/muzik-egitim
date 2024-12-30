// src/types/user.ts
export type InstrumentType = 'gitar' | 'piyano' | 'bateri';
export type PracticeGoalType = '10' | '20' | '30';
export type UserLevel = 'beginner' | 'intermediate' | 'advanced';

export interface UserProfile {
  id?: string;
  fullName?: string;
  email?: string;
  instrument: InstrumentType;
  level: UserLevel;
  practiceGoal: PracticeGoalType;
  isOnboardingComplete: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface UserProgress {
  totalPracticeTime: number;
  weeklyProgress: {
    [date: string]: number;
  };
  completedLessons: string[];
  currentLesson: string;
  level: UserLevel;
  streak: number;
  lastPracticeDate?: string;
  performance?: {
    lastSession?: {
      accuracy: number;
      tempo: number;
    };
  };
}

export interface UserSettings {
  notifications: boolean;
  theme: 'light' | 'dark';
  language: 'tr' | 'en';
}