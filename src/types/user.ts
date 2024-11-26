export type InstrumentType = 'guitar' | 'piano' | 'drums';

export interface UserData {
  instrument: InstrumentType;
  practiceGoal: string;
  notifications: boolean;
  fullName: string;
  registrationDate: string;
  lastLoginDate?: string;
}

export interface UserProgress {
  totalPracticeTime: number;
  weeklyGoalProgress: number;
  completedLessons: number;
  currentLevel: 'beginner' | 'intermediate' | 'advanced';
}