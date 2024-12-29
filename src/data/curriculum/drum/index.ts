// data/curriculum/drum/index.ts
export const drumCurriculum = {
    beginner: {
      description: "Temel davul eğitimi",
      duration: "3 ay",
      requiredSkills: [],
      lessons: ['drum-101', 'drum-102', 'drum-103'],
      learningPath: [
        {
          week: 1,
          focus: "Davul seti tanıma ve temel vuruşlar",
          lessons: ['drum-101'],
          practiceGoals: "Günde 30 dakika temel vuruş teknikleri"
        },
        {
          week: 2,
          focus: "Temel ritim kalıpları",
          lessons: ['drum-102'],
          practiceGoals: "Günde 45 dakika ritim çalışması"
        },
        {
          week: 3,
          focus: "Fill-in ve geçişler",
          lessons: ['drum-103'],
          practiceGoals: "Günde 1 saat fill-in ve ritim çalışması"
        }
      ],
      outcomes: [
        "Temel vuruş tekniklerini uygulayabilme",
        "Basic beat pattern çalabilme",
        "Temel fill-in'leri yapabilme"
      ]
    }
  };