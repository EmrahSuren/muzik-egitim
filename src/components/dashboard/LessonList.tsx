// src/components/dashboard/LessonList.tsx
'use client';
import { BookOpen, CheckCircle, Lock } from 'lucide-react';
import { lessons } from '@/data/lessons';
import type { Lesson } from '@/data/lessons';

type InstrumentType = keyof typeof lessons;
type LessonLevel = 'beginner' | 'intermediate' | 'advanced';

interface LessonListProps {
  instrument: InstrumentType;  // string yerine lessons objesindeki keyleri kullanıyoruz
  level: LessonLevel;
  completedLessons: string[];
  onLessonSelect: (lesson: Lesson) => void;
}

export function LessonList({ 
  instrument, 
  level, 
  completedLessons, 
  onLessonSelect 
}: LessonListProps) {
  const instrumentLessons = lessons[instrument]?.[level] || [];

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Dersler</h2>
      <div className="grid gap-4">
        {instrumentLessons.map((lesson: Lesson, index: number) => {
          const isCompleted = completedLessons.includes(lesson.id);
          const isLocked = index > 0 && !completedLessons.includes(instrumentLessons[index - 1].id);

          return (
            <div
              key={lesson.id}
              className={`p-4 rounded-lg border ${
                isCompleted ? 'border-green-200 bg-green-50' : 
                isLocked ? 'border-gray-200 bg-gray-50 opacity-75' : 
                'border-indigo-200 bg-white hover:bg-indigo-50'
              } transition-all`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {isCompleted ? (
                    <CheckCircle className="w-6 h-6 text-green-500" />
                  ) : isLocked ? (
                    <Lock className="w-6 h-6 text-gray-400" />
                  ) : (
                    <BookOpen className="w-6 h-6 text-indigo-500" />
                  )}
                  <div>
                    <h3 className="font-semibold text-gray-800">{lesson.title}</h3>
                    <p className="text-sm text-gray-600">
                      {lesson.duration} dakika • {lesson.topics.length} konu
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => !isLocked && onLessonSelect(lesson)}
                  disabled={isLocked}
                  className={`px-4 py-2 rounded-lg ${
                    isCompleted
                      ? 'bg-green-500 text-white'
                      : isLocked
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      : 'bg-indigo-600 text-white hover:bg-indigo-700'
                  } transition-colors`}
                >
                  {isCompleted ? 'Tekrar Et' : isLocked ? 'Kilitli' : 'Başla'}
                </button>
              </div>
              <div className="mt-2">
                <p className="text-sm text-gray-600">{lesson.objectives[0]}...</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}