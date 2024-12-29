// data/curriculum/guitar/index.ts
export const guitarCurriculum = {
    beginner: {
      description: "Temel gitar eğitimi",
      duration: "3 ay",
      requiredSkills: [],
      lessons: ['guitar-101', 'guitar-102', 'guitar-103'],
      learningPath: [
        {
          week: 1,
          focus: "Gitar anatomisi ve temel tutuş",
          lessons: ['guitar-101'],
          practiceGoals: "Günde 30 dakika temel pozisyon çalışması"
        },
        {
          week: 2,
          focus: "İlk akorlar ve ritim",
          lessons: ['guitar-102'],
          practiceGoals: "Günde 45 dakika akor geçişleri"
        },
        {
          week: 3,
          focus: "Şarkı eşlik teknikleri",
          lessons: ['guitar-103'],
          practiceGoals: "Günde 1 saat şarkı çalışması"
        }
      ],
      outcomes: [
        "Temel akorları çalabilme",
        "Basit şarkılara eşlik edebilme",
        "Temel ritim kalıplarını uygulayabilme"
      ]
    },
    intermediate: {
      // Benzer yapı orta seviye için...
    }
  };