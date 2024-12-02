// src/types/ai-teacher.ts



// Message interface'i
export interface Message {
  id: number;
  content: string;
  sender: 'ai' | 'user';
  type: 'text' | 'link' | 'error';
  url?: string;
  timestamp?: string;
  action?: string;
}

// TeacherDialog Props interface'i
export interface TeacherDialogProps {
  studentName: string;
  instrument: string;
  teacherGender: 'male' | 'female';  // teacherGender eklendi
  onClose: () => void;
}

// TeacherSelection Props interface'i
export interface TeacherSelectionProps {
  onClose: () => void;
  onSelectTeacher: (teacher: Teacher) => void;
}

// Teacher interface'i
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

// src/types/ai-teacher.ts

// Existing interfaces remain the same...

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
