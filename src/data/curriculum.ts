// src/data/curriculum.ts

export interface CurriculumContent {
    title: string;
    description: string;
    objectives: string[];
    exercises: {
      title: string;
      description: string;
      duration: number;  // dakika
      difficulty: 1 | 2 | 3;  // 1: kolay, 2: orta, 3: zor
    }[];
    practiceGoals: {
      daily: number;     // dakika
      weekly: number;    // dakika
    };
  }
  
  export interface InstrumentCurriculum {
    beginner: CurriculumContent[];
    intermediate: CurriculumContent[];
    advanced: CurriculumContent[];
  }
  
  export const curriculum: Record<string, InstrumentCurriculum> = {
    gitar: {
      beginner: [
        {
          title: "Gitara Giriş ve Temel Tutuş",
          description: "Gitar anatomisi, doğru duruş ve tutuş pozisyonları, temel pena kullanımı",
          objectives: [
            "Gitar parçalarını ve işlevlerini öğrenme",
            "Doğru oturuş pozisyonunu kavrama",
            "Pena tutuş tekniklerini öğrenme"
          ],
          exercises: [
            {
              title: "Pena Egzersizi",
              description: "Boş tellerde pena vuruş teknikleri",
              duration: 15,
              difficulty: 1
            },
            {
              title: "Duruş Kontrolü",
              description: "Ayna karşısında duruş kontrolü",
              duration: 10,
              difficulty: 1
            }
          ],
          practiceGoals: {
            daily: 30,
            weekly: 180
          }
        }
      ],
      intermediate: [/* ... */],
      advanced: [/* ... */]
    }
    // Diğer enstrümanlar...
  };