// data/curriculum/guitar/lessons/lesson1.ts
export const guitarLesson1 = {
    id: 'guitar-lesson-1',
    title: 'Temel Tutuş ve İlk Akorlar',
    duration: '30min',
    objectives: [
      'Doğru gitar tutuş pozisyonu',
      'Em ve Am akorlarını öğrenme',
      'Temel parmak egzersizleri'
    ],
    steps: [
      {
        id: 'step-1',
        title: 'Gitar Tutuşu',
        content: 'Gitarı nasıl doğru tutacağımızı öğrenelim...',
        visualAid: 'guitar-posture-diagram',
        checkpoints: ['Oturuş pozisyonu', 'Gitar tutuş açısı']
      },
      // ... diğer adımlar
    ],
    exercises: [
      {
        id: 'ex-1',
        title: 'Em Akor Egzersizi',
        instructions: 'Em akorunu 4 vuruşta çalın...',
        duration: '5min'
      }
      // ... diğer egzersizler
    ],
    assessment: {
      criteria: ['Doğru tutuş', 'Temiz akor geçişleri'],
      minimumScore: 70
    }
  };