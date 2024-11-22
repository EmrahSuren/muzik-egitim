// src/types/ai-teacher.ts

// Message interface'i
export interface Message {
  id: number;
  content: string;
  sender: 'ai' | 'user';
  type: 'text' | 'link' | 'error';
  url?: string;
  timestamp?: string;
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