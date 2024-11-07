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
      id: 'q1',
      question: 'Daha önce hiç müzik aleti çaldınız mı?',
      type: 'theory',
      options: [
        'Hayır, hiç çalmadım',
        'Biraz deneyimim var',
        'Evet, düzenli çalıyorum'
      ]
    },
    {
      id: 'q2',
      question: 'Günde kaç saat pratik yapmayı planlıyorsunuz?',
      type: 'practice',
      options: [
        '30 dakikadan az',
        '30-60 dakika',
        '1 saatten fazla'
      ]
    },
    {
      id: 'q3',
      question: 'Hangi tür müzikle ilgileniyorsunuz?',
      type: 'theory',
      options: [
        'Klasik Müzik',
        'Pop/Rock',
        'Jazz',
        'Hepsi'
      ]
    },
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
    // Burada yanıtlara göre seviye belirleme algoritması olacak
    return {
      level: 'beginner',
      strengths: ['Müziğe olan ilgi', 'Öğrenme motivasyonu'],
      areasToImprove: ['Temel müzik teorisi', 'Ritim algısı'],
      recommendedPath: 'Temel Seviye Başlangıç Programı'
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
                  className="h-2 bg-blue-500 rounded-full transition-all"
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
              <div className="text-4xl font-bold text-blue-600 mb-2">
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

            <div className="bg-blue-50 p-6 rounded-lg">
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