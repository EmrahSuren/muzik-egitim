'use client';
import { useState } from 'react';
import { Guitar, Piano, ChevronRight } from 'lucide-react';

export default function Onboarding() {
  const [step, setStep] = useState(1);
  const [selectedInstrument, setSelectedInstrument] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  const [practiceGoal, setPracticeGoal] = useState('');
  const [notifications, setNotifications] = useState(false);
  const [fullName, setFullName] = useState('');
  // Yeni teacher state'i ekleyelim
  const [selectedTeacher, setSelectedTeacher] = useState('');

  // Adım başlıklarını tanımlayalım
  const steps = [
    { id: 1, title: 'Enstrüman' },
    { id: 2, title: 'Öğretmen' },
    { id: 3, title: 'Hedef' },
    { id: 4, title: 'Bildirimler' },
    { id: 5, title: 'Profil' }
  ];

  const instruments = [
    { id: 'guitar', name: 'Gitar', icon: Guitar },
    { id: 'piano', name: 'Piyano', icon: Piano },
    { id: 'drums', name: 'Bateri', icon: Piano },
    { id: 'violin', name: 'Keman', icon: Piano }
];

  const levels = [
    { id: 'beginner', name: 'Yeni Başlayan', description: 'Hiç deneyimim yok veya çok az' },
    { id: 'intermediate', name: 'Orta Seviye', description: 'Temel bilgilere sahibim' },
    { id: 'advanced', name: 'İleri Seviye', description: 'Düzenli olarak çalıyorum' }
  ];

  const practiceGoals = [
    { id: '10', name: '10 dakika/gün', description: 'Başlangıç için ideal' },
    { id: '20', name: '20 dakika/gün', description: 'Düzenli ilerleme' },
    { id: '30', name: '30 dakika/gün', description: 'Hızlı gelişim' }
  ];

  const handleNext = () => {
    if (step < 5) {
      setStep(step + 1);
    } else {
      // Tüm seçimler yapıldı, dashboard'a yönlendir
      window.location.href = '/dashboard';
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-600 to-indigo-900 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8">
        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-8">
  {steps.map((stepItem, index) => (
    <div key={stepItem.id} className="flex items-center">
      <div className="flex flex-col items-center">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
          step >= stepItem.id ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-600'
        }`}>
          {stepItem.id}
        </div>
        <span className="text-xs mt-1 text-gray-600">{stepItem.title}</span>
      </div>
      {index < steps.length - 1 && (
        <div className={`w-16 h-1 mx-2 ${
          step > stepItem.id ? 'bg-indigo-600' : 'bg-gray-200'
        }`} />
      )}
    </div>
  ))}
</div>

        {/* Step Content */}
        <div className="mb-8">
          {step === 1 && (
            <>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Enstrümanınızı Seçin</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {instruments.map((instrument) => (
                  <button
                    key={instrument.id}
                    onClick={() => setSelectedInstrument(instrument.id)}
                    className={`p-6 rounded-xl border-2 transition-all ${
                      selectedInstrument === instrument.id
                        ? 'border-indigo-600 bg-indigo-50'
                        : 'border-gray-200 hover:border-indigo-300'
                    }`}
                  >
                    <instrument.icon className="w-12 h-12 mx-auto mb-4 text-indigo-600" />
                    <p className="text-center font-medium">{instrument.name}</p>
                  </button>
                ))}
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Seviyenizi Belirleyin</h2>
              <div className="space-y-4">
                {levels.map((level) => (
                  <button
                    key={level.id}
                    onClick={() => setSelectedLevel(level.id)}
                    className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                      selectedLevel === level.id
                        ? 'border-indigo-600 bg-indigo-50'
                        : 'border-gray-200 hover:border-indigo-300'
                    }`}
                  >
                    <p className="font-medium">{level.name}</p>
                    <p className="text-sm text-gray-600">{level.description}</p>
                  </button>
                ))}
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Günlük Hedefiniz</h2>
              <div className="space-y-4">
                {practiceGoals.map((goal) => (
                  <button
                    key={goal.id}
                    onClick={() => setPracticeGoal(goal.id)}
                    className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                      practiceGoal === goal.id
                        ? 'border-indigo-600 bg-indigo-50'
                        : 'border-gray-200 hover:border-indigo-300'
                    }`}
                  >
                    <p className="font-medium">{goal.name}</p>
                    <p className="text-sm text-gray-600">{goal.description}</p>
                  </button>
                ))}
              </div>
            </>
          )}

{step === 4 && (
  <>
    <h2 className="text-2xl font-bold text-gray-800 mb-4">Bildirimler</h2>
    <div className="space-y-4">
      <button
        onClick={() => setNotifications(true)}
        className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
          notifications ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200 hover:border-indigo-300'
        }`}
      >
        <p className="font-medium">Bildirimleri Aç</p>
        <p className="text-sm text-gray-600">Günlük hatırlatmalar ile hedeflerine ulaş</p>
      </button>
    </div>
  </>
)}

{step === 5 && (
  <>
    <h2 className="text-2xl font-bold text-gray-800 mb-4">Kişisel Bilgiler</h2>
    <div className="space-y-4">
      <input
        type="text"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        placeholder="Adınız Soyadınız"
        className="w-full p-4 rounded-xl border-2 text-gray-800 focus:border-indigo-600 focus:ring-0"
      />
    </div>
  </>
)}
        </div>

        {/* Navigation */}
        <div className="flex justify-end">
          <button
            onClick={handleNext}
            disabled={
              (step === 1 && !selectedInstrument) ||
              (step === 2 && !selectedLevel) ||
              (step === 3 && !practiceGoal)
            }
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg flex items-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-indigo-700"
          >
            {step === 3 ? 'Başla' : 'Devam Et'}
            <ChevronRight className="w-4 h-4 ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
}