import { TeacherDialog } from '../types/teacher';

export const teacherDialogs: TeacherDialog[] = [
  // İlk tanışma diyalogları
  {
    id: 'greeting-1',
    teacherId: 'guitar-f-1',
    type: 'greeting',
    content: 'Merhaba! Gitar öğrenme yolculuğuna hoş geldiniz. Size nasıl yardımcı olabilirim?',
    options: [
      {
        id: 'start-learning',
        text: 'Hemen öğrenmeye başlamak istiyorum',
        next: 'assessment-1'
      },
      {
        id: 'ask-questions',
        text: 'Önce birkaç sorum var',
        next: 'questions-1'
      }
    ]
  },
  
  // Değerlendirme diyalogları
  {
    id: 'assessment-1',
    teacherId: 'guitar-f-1',
    type: 'assessment',
    content: 'Daha önce hiç gitar çaldınız mı?',
    options: [
      {
        id: 'complete-beginner',
        text: 'Hayır, yeni başlıyorum',
        next: 'begin-basics'
      },
      {
        id: 'some-experience',
        text: 'Biraz deneyimim var',
        next: 'assess-level'
      }
    ]
  },

  // Eğitim diyalogları
  {
    id: 'begin-basics',
    teacherId: 'guitar-f-1',
    type: 'instruction',
    content: 'Harika! İlk olarak gitarı nasıl tutacağımızı öğreneceğiz. Rahat bir pozisyonda oturun ve gitarınızı kucağınıza alın.',
    nextDialogId: 'posture-check'
  },
  
  // Geri bildirim diyalogları
  {
    id: 'posture-check',
    teacherId: 'guitar-f-1',
    type: 'feedback',
    content: 'Gitarı tutuş pozisyonunuz nasıl? Rahat hissediyor musunuz?',
    options: [
      {
        id: 'comfortable',
        text: 'Evet, rahatım',
        next: 'first-chord'
      },
      {
        id: 'uncomfortable',
        text: 'Hayır, biraz rahatsız',
        next: 'adjust-posture'
      }
    ]
  }
];