// src/data/lessons.ts
export interface Lesson {
  id: string;
  title: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  duration: number; // dakika
  topics: string[];
  objectives: string[];
  prerequisites?: string[];
  practiceGoals: {
    minimum: number;
    recommended: number;
  };
}

export const lessons = {
  gitar: {
    beginner: [
      {
        id: 'gitar-101',
        title: 'gitara Giriş',
        level: 'beginner',
        duration: 30,
        topics: [
          'Gitar anatomisi',
          'Doğru oturuş pozisyonu',
          'Temel pena tutuşu',
          'Boş tellerin tanınması'
        ],
        objectives: [
          'Gitarın bölümlerini tanıma',
          'Doğru oturuş pozisyonunu uygulama',
          'Penayı doğru tutabilme',
          'Boş telleri tanıyabilme'
        ],
        practiceGoals: {
          minimum: 15,
          recommended: 30
        }
      },
      {
        id: 'gitar-102',
        title: 'Temel Akorlar - 1',
        level: 'beginner',
        duration: 45,
        topics: [
          'Em akoru',
          'Am akoru',
          'Akor geçişleri',
          'Ritim kalıpları'
        ],
        objectives: [
          'Em ve Am akorlarını doğru basabilme',
          'Akorlar arası geçişleri temiz yapabilme',
          'Basit ritim kalıplarını uygulayabilme'
        ],
        prerequisites: ['gitar-101'],
        practiceGoals: {
          minimum: 20,
          recommended: 45
        }
      },
      {
        id: 'gitar-103',
        title: 'Temel Akorlar - 2',
        level: 'beginner',
        duration: 45,
        topics: [
          'D akoru',
          'G akoru',
          'Dört akorlu geçişler',
          'Şarkı yapısı'
        ],
        objectives: [
          'D ve G akorlarını doğru basabilme',
          'Dört akor kullanarak şarkı eşlik edebilme',
          'Temel şarkı yapısını anlayabilme'
        ],
        prerequisites: ['gitar-102'],
        practiceGoals: {
          minimum: 25,
          recommended: 50
        }
      }
    ]
  },
  piyano: {
    beginner: [
      {
        id: 'piyano-101',
        title: 'Piyano ile Tanışma',
        level: 'beginner',
        duration: 30,
        topics: [
          'Piyanonun yapısı',
          'Doğru oturuş',
          'El pozisyonu',
          'Temel notalar: Do pozisyonu'
        ],
        objectives: [
          'Piyanonun temel bölümlerini tanıma',
          'Doğru oturuş pozisyonunu uygulama',
          'Doğru el pozisyonunu koruma',
          'Do pozisyonunda notaları çalabilme'
        ],
        practiceGoals: {
          minimum: 20,
          recommended: 40
        }
      },
      {
        id: 'piyano-102',
        title: 'Temel Nota Okuma',
        level: 'beginner',
        duration: 40,
        topics: [
          'Sol anahtarı',
          'Nota değerleri',
          'Porte üzerinde notalar',
          'Basit ezgiler'
        ],
        objectives: [
          'Nota değerlerini tanıyabilme',
          'Portede notaları okuyabilme',
          'Basit ezgileri çalabilme'
        ],
        prerequisites: ['piyano-101'],
        practiceGoals: {
          minimum: 25,
          recommended: 45
        }
      },
      {
        id: 'piyano-103',
        title: 'İki El Koordinasyonu',
        level: 'beginner',
        duration: 45,
        topics: [
          'Sol el eşlik',
          'Sağ el melodi',
          'El geçişleri',
          'Basit parçalar'
        ],
        objectives: [
          'İki eli koordineli kullanabilme',
          'Sol el ile basit eşlik yapabilme',
          'Sağ el ile melodi çalabilme'
        ],
        prerequisites: ['piyano-102'],
        practiceGoals: {
          minimum: 30,
          recommended: 60
        }
      }
    ]
  },
  bateri: {
    beginner: [
      {
        id: 'bateri-101',
        title: 'Bateri Temelleri',
        level: 'beginner',
        duration: 30,
        topics: [
          'Bateri seti tanıtımı',
          'Bagetlerin tutuluşu',
          'Temel vuruş teknikleri',
          'Basit ritim kalıpları'
        ],
        objectives: [
          'Bateri setinin bölümlerini tanıma',
          'Bagetleri doğru tutabilme',
          'Temel vuruş tekniklerini uygulama',
          'Basit ritim kalıplarını çalabilme'
        ],
        practiceGoals: {
          minimum: 15,
          recommended: 30
        }
      },
      {
        id: 'bateri-102',
        title: 'Temel Ritim Kalıpları',
        level: 'beginner',
        duration: 40,
        topics: [
          'Metronom kullanımı',
          'Sekizlik notalar',
          'Hi-hat teknikleri',
          'Basic grooves'
        ],
        objectives: [
          'Metronom ile çalabilme',
          'Sekizlik nota kalıplarını uygulayabilme',
          'Temel grooveları çalabilme'
        ],
        prerequisites: ['bateri-101'],
        practiceGoals: {
          minimum: 20,
          recommended: 40
        }
      },
      {
        id: 'bateri-103',
        title: 'Fill-in Teknikleri',
        level: 'beginner',
        duration: 45,
        topics: [
          'Temel fill-inler',
          'Tom geçişleri',
          'Ritim değişimleri',
          'Şarkı yapısı'
        ],
        objectives: [
          'Basit fill-inleri uygulayabilme',
          'Tomlar arası geçiş yapabilme',
          'Şarkı yapısına uygun fill-inler çalabilme'
        ],
        prerequisites: ['bateri-102'],
        practiceGoals: {
          minimum: 25,
          recommended: 50
        }
      }
    ]
  }
};