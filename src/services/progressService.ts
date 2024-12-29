// src/services/progressService.ts
import { UserProgress, Lesson } from '@/types/lesson';

interface PracticeSession {
  date: string;
  duration: number;
  lessonId: string;
  performance?: {
    accuracy: number;
    tempo: number;
  };
}

export class ProgressService {
   static updateProgress(lessonId: string, progress: number): void {
    const currentProgress = this.getProgress();
    if (!currentProgress) return;
    
    const updatedProgress: UserProgress = {
      ...currentProgress,
      currentLesson: lessonId,  // currentLesson eklendi
      completedLessons: progress === 100 
        ? [...currentProgress.completedLessons, lessonId]
        : currentProgress.completedLessons,
      lastPracticeDate: new Date().toISOString()
    };

    localStorage.setItem('userProgress', JSON.stringify(updatedProgress));
}

  static addPracticeTime(minutes: number, performanceData?: PracticeSession['performance']): void {
    const currentProgress = this.getProgress();
    const today = new Date().toISOString().split('T')[0];
    
    const updatedProgress = {
      ...currentProgress,
      totalPracticeTime: (currentProgress?.totalPracticeTime || 0) + minutes,
      weeklyProgress: {
        ...(currentProgress?.weeklyProgress || {}),
        [today]: ((currentProgress?.weeklyProgress || {})[today] || 0) + minutes
      },
      performance: performanceData ? {
        ...(currentProgress?.performance || {}),
        lastSession: performanceData
      } : currentProgress?.performance
    };

    localStorage.setItem('userProgress', JSON.stringify(updatedProgress));
  }

  static getProgress(): UserProgress | null {
    const progress = localStorage.getItem('userProgress');
    return progress ? JSON.parse(progress) : null;
  }

  static calculateStreak(): number {
    const progress = this.getProgress();
    if (!progress?.lastPracticeDate) return 0;

    const lastPractice = new Date(progress.lastPracticeDate);
    const today = new Date();
    const diffDays = Math.floor((today.getTime() - lastPractice.getTime()) / (1000 * 60 * 60 * 24));

    return diffDays <= 1 ? (progress.streak || 0) + 1 : 0;
  }

  static getWeeklyStats(): { date: string; minutes: number }[] {
    const progress = this.getProgress();
    const lastWeek = new Array(7).fill(0).map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const date = d.toISOString().split('T')[0];
      return {
        date,
        minutes: (progress?.weeklyProgress || {})[date] || 0
      };
    }).reverse();

    return lastWeek;
  }
  static initializeProgress(userId: string): UserProgress {
    const initialProgress: UserProgress = {
      userId,
      currentLesson: '',
      completedLessons: [],
      totalPracticeTime: 0,
      weeklyProgress: {},
      streak: 0,
      performance: {
        level: 'beginner'
      },
      lastPracticeDate: new Date().toISOString()
    };

    localStorage.setItem('userProgress', JSON.stringify(initialProgress));
    return initialProgress;
}

  

  static resetProgress(): void {
    localStorage.removeItem('userProgress');
  }
}