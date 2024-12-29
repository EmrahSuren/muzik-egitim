// src/types/ai-teacher.ts

// Base Message Types
export interface Message {
  id: number;
  content: string;
  sender: 'ai' | 'user';
  type: 'text' | 'link' | 'error' | 'option';
  url?: string;
  timestamp?: string;
  action?: string;
  optionId?: string;
  next?: string;
}

// Dialog Types
export interface DialogOption {
  id: string;
  text: string;
  next: string;
}

export interface DialogStep {
  id: string;
  type: string;
  content: string;
  options?: DialogOption[];
  action?: string;
  nextDialogId?: string;
}

// Teacher Types
export interface TeacherDialogProps {
  studentName: string;
  instrument: 'gitar' | 'piyano' | 'bateri';
  teacherGender: 'male' | 'female';
  onClose: () => void;
}

export interface ExtendedTeacherDialogProps extends TeacherDialogProps {
  selectedLesson?: Lesson;
  onLessonComplete?: () => void;
}

export interface TeacherSelectionProps {
  onClose: () => void;
  onSelectTeacher: (teacher: Teacher) => void;
}

export interface Teacher {
  id: number;
  name: string;
  country: string;
  avatar: string;
  language: string;
  teachingStyle: string;
  specialFocus: string;
  backgroundColor: string;
  gender: 'male' | 'female';
}

// Lesson Types
export interface Lesson {
  id: number;
  title: string;
  topics: string[];
  level: 'beginner' | 'intermediate' | 'advanced';
  instrument: string;
  content: LessonContent;
  objectives: string[];
}

export interface LessonContent {
  theory: {
    text: string;
    visualAids: VisualAid[];
  };
  exercises: Exercise[];
  practiceGoals: PracticeGoals;
}

export interface VisualAid {
  type: 'image' | 'notation' | 'chord' | 'video';
  url: string;
  description?: string;
}

export interface Exercise {
  title: string;
  description: string;
  duration: number;
  difficulty: 1 | 2 | 3;
  requirements?: string[];
}

export interface PracticeGoals {
  daily: number;  // minutes
  weekly: number; // minutes
}