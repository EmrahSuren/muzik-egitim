import { UserProgress, Lesson } from '@/types/lesson';

export class ProgressService {
  static updateProgress(lessonId: string, progress: number): void {
    const currentProgress = this.getProgress();
    const updatedProgress = {
      ...currentProgress,
      completedLessons: progress === 100 
        ? [...(currentProgress?.completedLessons || []), lessonId]
        : currentProgress?.completedLessons || [],
      lastPracticeDate: new Date().toISOString()
    };

    localStorage.setItem('userProgress', JSON.stringify(updatedProgress));
  }

  static addPracticeTime(minutes: number): void {
    const currentProgress = this.getProgress();
    const today = new Date().toISOString().split('T')[0];
    
    const updatedProgress = {
      ...currentProgress,
      totalPracticeTime: (currentProgress?.totalPracticeTime || 0) + minutes,
      weeklyProgress: {
        ...(currentProgress?.weeklyProgress || {}),
        [today]: ((currentProgress?.weeklyProgress || {})[today] || 0) + minutes
      }
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
}
