import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface AssessmentQuestion {
  id: string;
  question: string;
  type: 'theory' | 'practice' | 'listening';
  options?: string[];
  correctAnswer?: string;
}

interface AssessmentResult {
  level: 'beginner' | 'intermediate' | 'advanced';
  strengths: string[];
  areasToImprove: string[];
  recommendedPath: string;
}

const TeacherAssessment: React.FC = () => {
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [assessmentComplete, setAssessmentComplete] = useState<boolean>(false);
  const [result, setResult] = useState<AssessmentResult | null>(null);

  const assessmentQuestions: AssessmentQuestion[] = [

      {
        id: 'instrument',
        question: 'Hangi enstrümanı öğrenmek istiyorsunuz?',
        type: 'theory',
        options: [
          'Piyano 🎹',
          'Gitar 🎸',
          'Davul 🥁'
        ]
      },
      {
        id: 'experience',
        question: 'Müzik deneyiminiz nedir?',
        type: 'theory',
        options: [
          'Yeni başlıyorum',
          'Temel bilgilere sahibim',
          'Orta seviyedeyim',
          'İleri seviyedeyim'
        ]
      },
      {
        id: 'practice_time',
        question: 'Günlük pratik hedefiniz nedir?',
        type: 'practice',
        options: [
          '15-30 dakika',
          '30-60 dakika',
          '1-2 saat',
          '2 saatten fazla'
        ]
      },
      {
        id: 'learning_style',
        question: 'Tercih ettiğiniz öğrenme stili nedir?',
        type: 'practice',
        options: [
          'Temel teoriden başlamak istiyorum',
          'Direkt şarkı çalarak öğrenmek istiyorum',
          'Hem teori hem pratik dengeli olsun'
        ]
      }
  ];

  const handleAnswer = (questionId: string, answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));

    if (currentQuestion < assessmentQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      completeAssessment();
    }
  };

  const completeAssessment = () => {
    // Yanıtlara göre seviye belirleme mantığı
    const result = calculateAssessmentResult(answers);
    setResult(result);
    setAssessmentComplete(true);
  };

  const calculateAssessmentResult = (answers: Record<string, string>): AssessmentResult => {
    const instrumentMap = {
      'Piyano 🎹': 'piyano',
      'Gitar 🎸': 'gitar',
      'Davul 🥁': 'davul'
    };
  
    const selectedInstrument = instrumentMap[answers.instrument as keyof typeof instrumentMap];
    const experienceLevel = answers.experience;
    const practiceTime = answers.practice_time;
    const learningStyle = answers.learning_style;

    // Seviye belirleme
  let level: 'beginner' | 'intermediate' | 'advanced';
  if (experienceLevel === 'Yeni başlıyorum') {
    level = 'beginner';
  } else if (experienceLevel === 'Temel bilgilere sahibim') {
    level = 'beginner';
  } else if (experienceLevel === 'Orta seviyedeyim') {
    level = 'intermediate';
  } else {
    level = 'advanced';
  }

  // Enstrümana özel güçlü yönler ve gelişim alanları
  const instrumentSpecificAdvice = {
    piyano: {
      strengths: ['Müziğe olan ilginiz', 'Öğrenme isteğiniz'],
      areasToImprove: ['Nota okuma', 'El koordinasyonu', 'Ritim çalışması'],
      path: 'Piyano için temel teknikler ve nota okuma ile başlayacağız.'
    },
    gitar: {
      strengths: ['Müziğe olan ilginiz', 'Öğrenme isteğiniz'],
      areasToImprove: ['Temel akorlar', 'Parmak teknikleri', 'Ritim kalıpları'],
      path: 'Gitar için temel akorlar ve ritim kalıpları ile başlayacağız.'
    },
    davul: {
      strengths: ['Müziğe olan ilginiz', 'Öğrenme isteğiniz'],
      areasToImprove: ['Temel vuruş teknikleri', 'Ritim duygusu', 'Koordinasyon'],
      path: 'Davul için temel vuruş teknikleri ve ritim çalışmaları ile başlayacağız.'
    }
  };

  const advice = instrumentSpecificAdvice[selectedInstrument];

  // Pratik süresine göre ek öneriler
  let pathAddition = '';
  if (practiceTime === '15-30 dakika') {
    pathAddition = ' Kısa ama etkili günlük pratiklerle ilerleyeceğiz.';
  } else if (practiceTime === '30-60 dakika') {
    pathAddition = ' Düzenli pratiklerle hızlı ilerleme kaydedeceksiniz.';
  } else {
    pathAddition = ' Yoğun pratik programıyla hızlı gelişim göstereceksiniz.';
  }

  return {
    level,
    strengths: advice.strengths,
    areasToImprove: advice.areasToImprove,
    recommendedPath: advice.path + pathAddition
  };
};

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md p-8">
        {!assessmentComplete ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-6">
              <div className="text-sm text-gray-500 mb-2">
                Soru {currentQuestion + 1} / {assessmentQuestions.length}
              </div>
              <div className="h-2 bg-gray-200 rounded-full">
                <div 
                  className="h-2 bg-indigo-600 rounded-full transition-all"
                  style={{ width: `${((currentQuestion + 1) / assessmentQuestions.length) * 100}%` }}
                />
              </div>
            </div>

            <h2 className="text-2xl font-semibold mb-6">
              {assessmentQuestions[currentQuestion].question}
            </h2>

            <div className="space-y-4">
              {assessmentQuestions[currentQuestion].options?.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(assessmentQuestions[currentQuestion].id, option)}
                  className="w-full p-4 text-left border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  {option}
                </button>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h2 className="text-2xl font-semibold mb-6">Değerlendirme Sonucu</h2>
            <div className="mb-8">
              <div className="text-4xl font-bold text-indigo-600 mb-2">
                {result?.level === 'beginner' && 'Başlangıç Seviyesi'}
                {result?.level === 'intermediate' && 'Orta Seviye'}
                {result?.level === 'advanced' && 'İleri Seviye'}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-8">
              <div className="text-left">
                <h3 className="font-semibold mb-2">Güçlü Yönleriniz</h3>
                <ul className="list-disc list-inside">
                  {result?.strengths.map((strength, index) => (
                    <li key={index}>{strength}</li>
                  ))}
                </ul>
              </div>
              <div className="text-left">
                <h3 className="font-semibold mb-2">Gelişim Alanlarınız</h3>
                <ul className="list-disc list-inside">
                  {result?.areasToImprove.map((area, index) => (
                    <li key={index}>{area}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="bg-indigo-50 p-6 rounded-lg">
              <h3 className="font-semibold mb-2">Önerilen Eğitim Yolu</h3>
              <p>{result?.recommendedPath}</p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default TeacherAssessment;