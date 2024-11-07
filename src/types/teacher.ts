export interface Teacher {
    id: string;
    name: string;
    gender: 'male' | 'female';
    instrument: 'guitar' | 'piano' | 'drums';
    language: 'TR' | 'EN' | 'ES' | 'AR';  // Desteklenen diller
    avatar: string;
    backgroundColor: string;  // Avatar arka plan rengi
    personality: {
      teachingStyle: string;     // Öğretim stili
      communication: string;     // İletişim tarzı
      motivation: string;        // Motivasyon yaklaşımı
    };
    expertise: string[];         // Uzmanlık alanları
    introduction: string;        // İlk tanışma metni
  }
  
  export interface TeacherDialog {
    id: string;
    teacherId: string;          // Hangi öğretmene ait
    type: 'greeting' | 'assessment' | 'instruction' | 'feedback';
    content: string;
    options?: {                 // Öğrenci cevap seçenekleri
      id: string;
      text: string;
      next: string;            // Sonraki diyalog ID'si
    }[];
    nextDialogId?: string;     // Sonraki otomatik diyalog
  }