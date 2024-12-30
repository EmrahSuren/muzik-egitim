// src/types/lesson.ts
import { InstrumentType } from './user';

export interface Lesson {
 id: string;
 title: string;
 description: string;
 type: string;
 instrument: InstrumentType;
 level: string;
 content: string;
 objectives: string[];
}

export interface UserProgress {
 userId: string;
 currentLesson: string;
 completedLessons: string[];
 totalPracticeTime: number;
 weeklyProgress: {
   [key: string]: number;
 };
 performance?: {
   lastSession?: {
     accuracy: number;
     tempo: number;
   };
   level: 'beginner' | 'intermediate' | 'advanced';
 };
 streak: number;
 lastPracticeDate?: string;
}

export interface Achievement {
 id: string;
 title: string;
 description: string;
 icon: string;
 unlockedAt?: string;
}