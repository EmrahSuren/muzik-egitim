// src/types/user.ts

// Core types that define the possible values
export type InstrumentType = 'gitar' | 'piyano' | 'bateri';
export type PracticeGoalType = '10' | '20' | '30';
export type UserLevel = 'beginner' | 'intermediate' | 'advanced';

// Core user profile data
export interface UserProfile {
  id?: string;
  fullName: string;  // Made required since it's essential
  email?: string;
  instrument: InstrumentType;  // Made required for onboarding
  level: UserLevel;  // Made required for proper progression tracking
  practiceGoal: PracticeGoalType;  // Made required for goal setting
  isOnboardingComplete: boolean;  // Made required for flow control
  createdAt: string;  // Made required for tracking
  updatedAt?: string;
  notifications?: boolean;  // Moved from UserData
}

// Progress tracking interface
export interface UserProgress {
  totalPracticeTime: number;
  weeklyProgress: {
    [date: string]: number;  // Daily practice minutes
  };
  completedLessons: string[];  // Store lesson IDs
  currentLesson: string;
  level: UserLevel;  // Matches with UserProfile level
  streak: number;  // Consecutive practice days
  lastPracticeDate?: string;
}

// Settings interface for user preferences
export interface UserSettings {
  notifications: boolean;
  theme: 'light' | 'dark';
  language: 'tr' | 'en';
}