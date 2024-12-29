// src/data/teacherDialogs.ts
export const teacherDialogs = {
  lessons: {
    gitar: {
      beginner: {
        intro: [
          {
            id: 'lesson-1',
            title: 'Gitar Tutuşu ve Temel Akorlar',
            steps: [
              {
                id: 'greeting-1',
                teacherId: 'guitar-f-1',
                type: 'greeting',
                content: 'Merhaba! Gitar öğrenme yolculuğuna hoş geldiniz.',
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
              {
                id: 'assessment-1',
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
              {
                id: 'begin-basics',
                type: 'instruction',
                content: 'Harika! İlk olarak gitarı nasıl tutacağımızı öğreneceğiz.',
                action: 'show_posture',
                nextDialogId: 'posture-check'
              }
            ]
          }
        ]
      }
    },
    piyano: {
      // Piyano için benzer yapı
    },
    bateri: {
      // Davul için benzer yapı
    }
  }
};