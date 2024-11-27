'use client';
import { useState, useEffect } from 'react';
import { Bell, Settings, User, LogOut, Music } from 'lucide-react';
import Image from 'next/image';
import TeacherDialog from "@/components/ai-teacher/TeacherDialog";
import TeacherSelectionModal from "@/components/ai-teacher/TeacherSelectionModal";
import { UserService } from '@/services/userService';
import { ProgressService } from '@/services/progressService';
import type { UserData } from '@/types/user';
import type { UserProgress } from '@/types/lesson';
import { LessonList } from '@/components/dashboard/LessonList';

interface Teacher {
  id: number;
  name: string;
  country: string;
  avatar: string;
  language: string;
  teachingStyle: string;
  specialFocus: string;
  backgroundColor: string;
  gender: 'male' | 'female';
}

export default function Dashboard() {
  // UI States
  const [showTeacherSelection, setShowTeacherSelection] = useState(false);
  const [showTeacherDialog, setShowTeacherDialog] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);

  // User and Progress States
  const [userData, setUserData] = useState<UserData | null>(null);
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    setIsClient(true);
    if (typeof window !== 'undefined') {
      const user = UserService.getUserData();
      const userProgress = ProgressService.getProgress();
      const currentStreak = ProgressService.calculateStreak();
      
      setUserData(user);
      setProgress(userProgress);
      setStreak(currentStreak);
    }
  }, []);

  if (!isClient) {
    return null;
  }

  const handleStartLesson = () => {
    setShowTeacherSelection(true);
  };

  const handleTeacherSelect = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
    setShowTeacherSelection(false);
    setShowTeacherDialog(true);
  };

  const totalPracticeTime = progress?.totalPracticeTime || 0;
  const dailyGoalProgress = Math.min((totalPracticeTime / (45 * 60)) * 100, 100);
  const completedLessons = progress?.completedLessons?.length || 0;
  const weeklyProgress = progress?.weeklyProgress || {};

  const handleLessonSelect = (lesson: Lesson) => {
    // Dersi başlatmadan önce AI öğretmeni hazırla
    setShowTeacherSelection(true);
    // Seçilen dersi state'e kaydet
    setSelectedLesson(lesson);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Music className="w-8 h-8 text-indigo-600" />
              <span className="ml-2 text-xl font-bold text-gray-800">MusicMaster</span>
            </div>

            <div className="flex items-center gap-4">
              <button className="p-2 text-gray-600 hover:text-gray-900 relative">
                <Bell className="w-6 h-6" />
                <span className="absolute top-1 right-1 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                  {completedLessons > 0 ? completedLessons : 0}
                </span>
              </button>

              <button className="p-2 text-gray-600 hover:text-gray-900">
                <Settings className="w-6 h-6" />
              </button>

              <div className="relative">
                <button 
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100"
                >
                  <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-indigo-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    {userData?.fullName || 'Kullanıcı'}
                  </span>
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-10">
                    <a href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Profil
                    </a>
                    <a href="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Ayarlar
                    </a>
                    <hr className="my-1" />
                    <button 
                      onClick={() => window.location.href = '/login'}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      Çıkış Yap
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-lg font-medium text-gray-800 mb-2">Günlük Hedef</h3>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center">
                <span className="text-2xl font-bold text-indigo-600">
                  {Math.floor(totalPracticeTime / 60)}
                </span>
              </div>
              <div>
                <p className="text-gray-600">Dakika pratik yapıldı</p>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                  <div 
                    className="bg-indigo-600 h-2.5 rounded-full" 
                    style={{ width: `${dailyGoalProgress}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-lg font-medium text-gray-800 mb-2">Haftalık İlerleme</h3>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                <span className="text-2xl font-bold text-green-600">{streak}/7</span>
              </div>
              <div className="flex-1">
                <p className="text-gray-600">Gün hedefi tamamlandı</p>
                <div className="flex gap-1 mt-2">
                  {[1, 2, 3, 4, 5, 6, 7].map((day) => (
                    <div 
                      key={day}
                      className={`h-2 flex-1 rounded-full ${
                        day <= streak ? 'bg-green-500' : 'bg-gray-200'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-lg font-medium text-gray-800 mb-2">Toplam Pratik</h3>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center">
                <span className="text-2xl font-bold text-purple-600">
                  {Math.floor(totalPracticeTime / 3600)}
                </span>
              </div>
              <div>
                <p className="text-gray-600">Saat harcandı</p>
                <p className="text-sm text-gray-500 mt-1">Son 30 günde</p>
              </div>
            </div>
          </div>
        </div>

        {/* AI Teacher Section */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
              <Music className="w-10 h-10 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">AI Öğretmeniniz</h2>
              <p className="text-gray-600">
                {userData?.instrument ? `${userData.instrument} dersiniz için hazırım!` : 'Günlük öneriniz hazır!'} Hadi birlikte çalışalım.
              </p>
            </div>
            <button 
              onClick={handleStartLesson}
              className="ml-auto bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Derse Başla
            </button>
          </div>
        </div>

        {/* Ders Listesi */}
        {userData && (
          <LessonList
            instrument={userData.instrument}
            level={userData.level || 'beginner'}
            completedLessons={progress?.completedLessons || []}
            onLessonSelect={handleLessonSelect}
          />
        )}

        {/* Modal bölümleri */}
        {showTeacherSelection && (
          <TeacherSelectionModal
            onClose={() => setShowTeacherSelection(false)}
            onSelectTeacher={handleTeacherSelect}
          />
        )}

        {showTeacherDialog && selectedTeacher && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-auto relative p-6">
              <button 
                onClick={() => setShowTeacherDialog(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <TeacherDialog
                onClose={() => setShowTeacherDialog(false)}
                teacherGender={selectedTeacher.gender}
                studentName={userData?.fullName || 'Öğrenci'}
                instrument={userData?.instrument || 'Gitar'}
              />
            </div>
          </div> 
        )}
      </main>
    </div>
  );
}