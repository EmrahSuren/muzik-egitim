// src/types/user.ts
export interface UserProfile {
  id?: string;
  fullName?: string;
  email?: string;
  instrument?: 'gitar' | 'piyano' | 'bateri';
  level?: 'beginner' | 'intermediate' | 'advanced';
  practiceGoal?: '10' | '20' | '30';
  isOnboardingComplete?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface UserSettings {
  notifications: boolean;
  theme: 'light' | 'dark';
  language: 'tr' | 'en';
}

export interface UserProgress {
  totalPracticeTime: number;
  weeklyProgress: {
    [date: string]: number;  // günlük pratik süreleri
  };
  completedLessons: string[];
  currentLesson: string;
  streak: number; // ardışık pratik günleri
  lastPracticeDate?: string;
}

// src/services/userService.ts
export class UserService {
  private static readonly PROFILE_KEY = (userId: string) => `user_profile_${userId}`;
  private static readonly SETTINGS_KEY = (userId: string) => `user_settings_${userId}`;
  private static readonly PROGRESS_KEY = (userId: string) => `user_progress_${userId}`;

  // Profil yönetimi
  static getUserProfile(userId: string): UserProfile | null {
    try {
      const profile = localStorage.getItem(this.PROFILE_KEY(userId));
      return profile ? JSON.parse(profile) : null;
    } catch (error) {
      console.error('Profil getirme hatası:', error);
      return null;
    }
  }

  static updateUserProfile(userId: string, data: Partial<UserProfile>): UserProfile {
    try {
      const currentProfile = this.getUserProfile(userId) || {};
      const updatedProfile: UserProfile = {
        ...currentProfile,
        ...data,
        updatedAt: new Date().toISOString()
      };

      localStorage.setItem(
        this.PROFILE_KEY(userId),
        JSON.stringify(updatedProfile)
      );

      return updatedProfile;
    } catch (error) {
      throw new Error('Profil güncelleme hatası');
    }
  }

  // İlerleme takibi
  static getUserProgress(userId: string): UserProgress | null {
    try {
      const progress = localStorage.getItem(this.PROGRESS_KEY(userId));
      return progress ? JSON.parse(progress) : null;
    } catch (error) {
      console.error('İlerleme getirme hatası:', error);
      return null;
    }
  }

  static updateUserProgress(userId: string, progress: Partial<UserProgress>): UserProgress {
    try {
      const currentProgress = this.getUserProgress(userId) || {
        totalPracticeTime: 0,
        weeklyProgress: {},
        completedLessons: [],
        currentLesson: '',
        streak: 0,
        lastPracticeDate: new Date().toISOString()
      };

      const updatedProgress = {
        ...currentProgress,
        ...progress
      };

      localStorage.setItem(
        this.PROGRESS_KEY(userId),
        JSON.stringify(updatedProgress)
      );

      return updatedProgress;
    } catch (error) {
      throw new Error('İlerleme güncelleme hatası');
    }
  }

  // Ayarlar yönetimi
  static updateUserSettings(userId: string, settings: Partial<UserSettings>): UserSettings {
    try {
      const currentSettings = localStorage.getItem(this.SETTINGS_KEY(userId));
      const updatedSettings = {
        ...(currentSettings ? JSON.parse(currentSettings) : {
          notifications: true,
          theme: 'light',
          language: 'tr'
        }),
        ...settings
      };

      localStorage.setItem(
        this.SETTINGS_KEY(userId),
        JSON.stringify(updatedSettings)
      );

      return updatedSettings;
    } catch (error) {
      throw new Error('Ayar güncelleme hatası');
    }
  }

  // Hesap yönetimi
  static deleteAccount(userId: string): void {
    try {
      localStorage.removeItem(this.PROFILE_KEY(userId));
      localStorage.removeItem(this.SETTINGS_KEY(userId));
      localStorage.removeItem(this.PROGRESS_KEY(userId));
    } catch (error) {
      throw new Error('Hesap silme hatası');
    }
  }
}