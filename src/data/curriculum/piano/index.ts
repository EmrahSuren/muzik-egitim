// data/curriculum/piano/index.ts
export const pianoCurriculum = {
    beginner: {
      description: "Temel piyano eğitimi",
      duration: "3 ay",
      requiredSkills: [],
      lessons: ['piano-101', 'piano-102', 'piano-103'],
      learningPath: [
        {
          week: 1,
          focus: "Piyano anatomisi ve temel el pozisyonu",
          lessons: ['piano-101'],
          practiceGoals: "Günde 30 dakika el pozisyonu ve temel nota çalışması"
        },
        {
          week: 2,
          focus: "Temel nota okuma ve çalma",
          lessons: ['piano-102'],
          practiceGoals: "Günde 45 dakika nota okuma ve çalma pratiği"
        },
        {
          week: 3,
          focus: "İki el koordinasyonu",
          lessons: ['piano-103'],
          practiceGoals: "Günde 1 saat koordinasyon çalışması"
        }
      ],
      outcomes: [
        "Temel notaları çalabilme",
        "İki el koordinasyonunu sağlayabilme",
        "Basit melodileri çalabilme"
      ]
    }
  };