import { Teacher } from '../types/teacher';

export const teachers: Teacher[] = [
  {
    id: 'guitar-f-1',
    name: 'Sarah',
    gender: 'female',
    instrument: 'guitar',
    language: 'TR',
    avatar: '/teachers/sarah.png', // Avatar dosyasını daha sonra ekleyeceğiz
    backgroundColor: 'bg-purple-100',
    personality: {
      teachingStyle: 'Sabırlı ve detaylı anlatım',
      communication: 'Arkadaşça ve motive edici',
      motivation: 'Kişiselleştirilmiş öğrenme hedefleri'
    },
    expertise: [
      'Klasik Gitar',
      'Parmak Stili',
      'Temel Teknikler',
      'Akor Geçişleri'
    ],
    introduction: 'Merhaba! Ben Sarah. Gitar yolculuğunuzda size rehberlik edeceğim. Başlangıç seviyesinden ileri seviyeye kadar, adım adım ilerleyeceğiz.'
  },
  {
    id: 'guitar-m-1',
    name: 'Ahmet',
    gender: 'male',
    instrument: 'guitar',
    language: 'TR',
    avatar: '/teachers/ahmet.png',
    backgroundColor: 'bg-blue-100',
    personality: {
      teachingStyle: 'Pratik odaklı öğretim',
      communication: 'Enerjik ve destekleyici',
      motivation: 'Hızlı ilerleme ve başarı odaklı'
    },
    expertise: [
      'Elektro Gitar',
      'Ritim Teknikleri',
      'Popüler Müzik',
      'İleri Teknikler'
    ],
    introduction: 'Selam! Ben Ahmet. Gitar çalmayı eğlenceli ve etkileyici hale getireceğiz. Modern teknikler ve pratik yaklaşımlarla hızlıca ilerleyeceksiniz.'
  }
];