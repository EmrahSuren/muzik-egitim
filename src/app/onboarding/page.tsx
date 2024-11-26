'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Guitar, Piano, Drum, ChevronRight } from 'lucide-react';
import { UserService } from '@/services/userService';
import type { UserData, InstrumentType } from '@/types/user';

export default function Onboarding() {
  const [step, setStep] = useState(1);
  const [selectedInstrument, setSelectedInstrument] = useState<InstrumentType | ''>('');
  const [practiceGoal, setPracticeGoal] = useState('');
  const [notifications, setNotifications] = useState(false);
  const [fullName, setFullName] = useState('');
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
    // Eğer kullanıcı zaten kayıtlı ise dashboard'a yönlendir
    const existingUser = UserService.getUserData();
    if (existingUser) {
      router.push('/dashboard');
    }
  }, [router]);

  const steps = [
    { id: 1, title: 'Enstrüman' },
    { id: 2, title: 'Hedef' },
    { id: 3, title: 'Bildirimler' },
    { id: 4, title: 'Profil' }
  ];

  const instruments = [
    { id: 'guitar' as InstrumentType, name: 'Gitar', icon: Guitar },
    { id: 'piano' as InstrumentType, name: 'Piyano', icon: Piano },
    { id: 'drums' as InstrumentType, name: 'Bateri', icon: Drum }
  ];

  const practiceGoals = [
    { 
      id: '10', 
      name: '10 dakika/gün', 
      description: 'Temel teknikleri öğrenmek için ideal başlangıç süresi'
    },
    { 
      id: '20', 
      name: '20 dakika/gün', 
      description: 'Düzenli pratik ile sürekli ilerleme sağlayın'
    },
    { 
      id: '30', 
      name: '30 dakika/gün', 
      description: 'Yoğun pratik ile hızlı gelişim gösterin'
    }
  ];

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      // Form validasyonu
      if (!fullName.trim()) {
        alert('Lütfen adınızı girin');
        return;
      }

      // Kullanıcı verilerini hazırla
      const userData: UserData = {
        instrument: selectedInstrument as InstrumentType,
        practiceGoal,
        notifications,
        fullName: fullName.trim(),
        registrationDate: new Date().toISOString(),
        lastLoginDate: new Date().toISOString()
      };

      try {
        // Verileri kaydet
        UserService.saveUserData(userData);

        // Başlangıç ilerleme verilerini oluştur
        UserService.updateUserProgress({
          totalPracticeTime: 0,
          weeklyGoalProgress: 0,
          completedLessons: 0,
          currentLevel: 'beginner'
        });

        // Dashboard'a yönlendir
        router.push('/dashboard');
      } catch (error) {
        console.error('Kayıt hatası:', error);
        alert('Bir hata oluştu. Lütfen tekrar deneyin.');
      }
    }
  };

  const isNextDisabled = () => {
    switch (step) {
      case 1:
        return !selectedInstrument;
      case 2:
        return !practiceGoal;
      case 4:
        return !fullName.trim();
      default:
        return false;
    }
  };

  if (!isClient) return null;

  // ... JSX kısmı aynı kalacak, sadece button disabled logic'i değişecek ...
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
                    <p className="text-center font-medium text-gray-700">{instrument.name}</p>
                  </button>
                ))}
              </div>
            </>
          )}

          {step === 2 && (
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
                    <p className="font-semibold text-gray-900">{goal.name}</p>
                    <p className="text-sm font-medium text-gray-700">{goal.description}</p>
                  </button>
                ))}
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Bildirimler</h2>
              <div className="space-y-4">
                <button
                  onClick={() => setNotifications(!notifications)}
                  className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                    notifications ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200 hover:border-indigo-300'
                  }`}
                >
                  <p className="font-medium">Bildirimleri {notifications ? 'Kapat' : 'Aç'}</p>
                  <p className="text-sm font-medium text-gray-700">
                    Günlük hatırlatmalar ile hedeflerine ulaş
                  </p>
                </button>
              </div>
            </>
          )}

          {step === 4 && (
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
            disabled={isNextDisabled()}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg flex items-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-indigo-700 transition-all"
          >
            {step === 4 ? 'Başla' : 'Devam Et'}
            <ChevronRight className="w-4 h-4 ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
}