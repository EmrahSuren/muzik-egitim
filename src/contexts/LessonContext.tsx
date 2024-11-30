// src/contexts/LessonContext.tsx
'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { curriculum, type CurriculumContent } from '@/data/curriculum';

export type LessonContextType = {
  currentLevel: 'beginner' | 'intermediate' | 'advanced';
  currentLessonIndex: number;
  currentContent: CurriculumContent | null;
  progress: {
    completedLessons: string[];
    dailyPractice: number;
    weeklyPractice: number;
  };
  setCurrentLevel: (level: 'beginner' | 'intermediate' | 'advanced') => void;
  setCurrentLessonIndex: (index: number) => void;
  updateProgress: (practiceTime: number) => void;
  markLessonComplete: (lessonId: string) => void;
};

export const LessonContext = createContext<LessonContextType | null>(null);

export function LessonProvider({ children }: { children: ReactNode }) {
  const [currentLevel, setCurrentLevel] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [progress, setProgress] = useState<{
    completedLessons: string[];
    dailyPractice: number;
    weeklyPractice: number;
  }>({
    completedLessons: [], // string[] olarak başlatıyoruz
    dailyPractice: 0,
    weeklyPractice: 0
  });

  const updateProgress = (practiceTime: number) => {
    setProgress(prev => ({
      ...prev,
      dailyPractice: prev.dailyPractice + practiceTime,
      weeklyPractice: prev.weeklyPractice + practiceTime
    }));
  };

  const markLessonComplete = (lessonId: string) => {
    setProgress(prev => ({
      ...prev,
      completedLessons: [...prev.completedLessons, lessonId]
    }));
  };

  const value = {
    currentLevel,
    currentLessonIndex,
    currentContent: curriculum.gitar[currentLevel][currentLessonIndex] || null,
    progress,
    setCurrentLevel,
    setCurrentLessonIndex,
    updateProgress,
    markLessonComplete
  };

  return (
    <LessonContext.Provider value={value}>
      {children}
    </LessonContext.Provider>
  );
}

export function useLessonContext() {
  const context = useContext(LessonContext);
  if (!context) {
    throw new Error('useLessonContext must be used within a LessonProvider');
  }
  return context;
}