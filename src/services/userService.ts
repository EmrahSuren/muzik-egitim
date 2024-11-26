import type { UserData, UserProgress } from '@/types/user';

export class UserService {
  static saveUserData(data: UserData): void {
    localStorage.setItem('userData', JSON.stringify(data));
  }

  static getUserData(): UserData | null {
    const data = localStorage.getItem('userData');
    return data ? JSON.parse(data) : null;
  }

  static updateUserProgress(progress: Partial<UserProgress>): void {
    const currentProgress = localStorage.getItem('userProgress');
    const updatedProgress = {
      ...(currentProgress ? JSON.parse(currentProgress) : {}),
      ...progress
    };
    localStorage.setItem('userProgress', JSON.stringify(updatedProgress));
  }

  static getUserProgress(): UserProgress | null {
    const progress = localStorage.getItem('userProgress');
    return progress ? JSON.parse(progress) : null;
  }
}