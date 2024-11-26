import { Lesson } from '@/types/lesson';

export const lessons: { [key: string]: Lesson[] } = {
  guitar: [
    {
      id: 'guitar-101',
      title: 'Gitara Giriş',
      description: 'Temel gitar teknikleri ve duruş pozisyonu',
      duration: 30,
      level: 'beginner',
      type: 'theory',
      instrument: 'guitar',
      topics: ['Gitar parçaları', 'Doğru duruş', 'Temel akorlar'],
      progress: 0
    },
    {
      id: 'guitar-102',
      title: 'İlk Akorlarımız',
      description: 'Em ve Am akorları ile çalışma',
      duration: 45,
      level: 'beginner',
      type: 'practice',
      instrument: 'guitar',
      prerequisites: ['guitar-101'],
      topics: ['Em akoru', 'Am akoru', 'Akor geçişleri'],
      progress: 0
    }
  ],
  piano: [
    {
      id: 'piano-101',
      title: 'Piyano Temelleri',
      description: 'Tuş dizilimi ve temel notalar',
      duration: 30,
      level: 'beginner',
      type: 'theory',
      instrument: 'piano',
      topics: ['Klavye tanıtımı', 'Nota yerleri', 'Duruş pozisyonu'],
      progress: 0
    }
  ],
  drums: [
    {
      id: 'drums-101',
      title: 'Bateri Setupı',
      description: 'Bateri düzeni ve temel vuruşlar',
      duration: 30,
      level: 'beginner',
      type: 'theory',
      instrument: 'drums',
      topics: ['Bateri parçaları', 'Tutuş teknikleri', 'Temel ritimler'],
      progress: 0
    }
  ]
};