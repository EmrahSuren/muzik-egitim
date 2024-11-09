'use client';
import { useState } from 'react';
import { Bell, Settings, User, LogOut, Music } from 'lucide-react';
import Image from 'next/image';
import { TeacherDialog } from "@/components/ai-teacher"; 


// TeacherSelection Component
const TeacherSelection = () => {
  const [selectedTeacher, setSelectedTeacher] = useState(null);

  const teachers = [
    { 
      id: 1,
      name: "Sarah",
      country: "🇺🇸 USA",
      avatar: "/teacher1.png",
      language: "İngilizce",
      teachingStyle: "Detaylı ve sabırlı anlatım",
      specialFocus: "Temel teknikler ve müzik teorisi",
      backgroundColor: "bg-purple-100"
    },
    { 
      id: 2,
      name: "Ayşe",
      country: "🇹🇷 Türkiye",
      avatar: "/teacher2.png",
      language: "Türkçe",
      teachingStyle: "Pratik odaklı eğitim",
      specialFocus: "Hızlı ilerleme ve modern teknikler",
      backgroundColor: "bg-blue-100"
    }
  ];

  return (
    <div className="p-6 bg-white rounded-xl shadow-sm mb-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">AI Öğretmeninizi Seçin</h2>
      <div className="grid md:grid-cols-2 gap-6">
        {teachers.map((teacher) => (
          <div
            key={teacher.id}
            onClick={() => setSelectedTeacher(teacher.id)}
            className={`p-6 rounded-xl cursor-pointer transition-all duration-300 ${
              selectedTeacher === teacher.id
                ? 'border-2 border-blue-500 shadow-lg transform scale-[1.02]'
                : 'border-2 border-transparent hover:border-blue-200'
            }`}
          >
            <div className="flex items-center gap-4">
              <div className={`w-20 h-20 rounded-full overflow-hidden ${teacher.backgroundColor} flex items-center justify-center`}>
              <Image
  src={teacher.avatar}
  alt={teacher.name}
  width={80}   // Profil fotoğrafı için uygun genişlik ve yükseklik belirleyin
  height={80}
  className="w-full h-full object-cover"
/>
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-semibold">{teacher.name}</h3>
                  <span className="text-sm">{teacher.country}</span>
                </div>
                <p className="text-gray-600 text-sm mt-1">{teacher.language}</p>
                <p className="text-gray-500 text-sm mt-2">{teacher.teachingStyle}</p>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t">
              <p className="text-sm text-gray-600">
                <span className="font-medium">Odak Noktası:</span> {teacher.specialFocus}
              </p>
            </div>

            <button 
              className={`mt-4 w-full py-2 rounded-lg transition-colors ${
                selectedTeacher === teacher.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {selectedTeacher === teacher.id ? 'Seçildi' : 'Seç'}
            </button>
          </div>
        ))}
      </div>

      {selectedTeacher && (
        <div className="mt-6 flex justify-end">
          <button 
            onClick={() => {/* Burada ilk tanışma diyaloğunu açacağız */}}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Öğretmeninle Tanış
          </button>
        </div>
      )}
    </div>
  );
};
export default function Dashboard() {
  const [showTeacherDialog, setShowTeacherDialog] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo & Brand */}
            <div className="flex items-center">
              <Music className="w-8 h-8 text-indigo-600" />
              <span className="ml-2 text-xl font-bold text-gray-800">MusicMaster</span>
            </div>

            {/* Right Navigation Items */}
            <div className="flex items-center gap-4">
              {/* Notifications */}
              <button className="p-2 text-gray-600 hover:text-gray-900 relative">
                <Bell className="w-6 h-6" />
                <span className="absolute top-1 right-1 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                  2
                </span>
              </button>

              {/* Settings */}
              <button className="p-2 text-gray-600 hover:text-gray-900">
                <Settings className="w-6 h-6" />
              </button>

              {/* Profile Dropdown */}
              <div className="relative">
                <button 
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100"
                >
                  <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-indigo-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">Kullanıcı Adı</span>
                </button>

                {/* Dropdown Menu */}
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

      {/* Main Content Area - buraya diğer bölümleri ekleyeceğiz */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
  {/* Progress Overview */}
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <h3 className="text-lg font-medium text-gray-800 mb-2">Günlük Hedef</h3>
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center">
          <span className="text-2xl font-bold text-indigo-600">45</span>
        </div>
        <div>
          <p className="text-gray-600">Dakika pratik yapıldı</p>
          <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
            <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: '75%' }}></div>
          </div>
        </div>
      </div>
    </div>

    <div className="bg-white p-6 rounded-xl shadow-sm">
      <h3 className="text-lg font-medium text-gray-800 mb-2">Haftalık İlerleme</h3>
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
          <span className="text-2xl font-bold text-green-600">5/7</span>
        </div>
        <div className="flex-1">
          <p className="text-gray-600">Gün hedefi tamamlandı</p>
          <div className="flex gap-1 mt-2">
            {[1, 2, 3, 4, 5, 6, 7].map((day) => (
              <div 
                key={day}
                className={`h-2 flex-1 rounded-full ${
                  day <= 5 ? 'bg-green-500' : 'bg-gray-200'
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
          <span className="text-2xl font-bold text-purple-600">12</span>
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
      <p className="text-gray-600">Günlük öneriniz hazır! Hadi birlikte çalışalım.</p>
    </div>
    <button 
      onClick={() => setShowTeacherDialog(true)}  // setShowAssessment yerine setShowTeacherDialog
      className="ml-auto bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
    >
      Derse Başla
    </button>
  </div>
</div>

  <TeacherSelection /> 

  {/* Daily Tasks & Recommended Lessons */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  {/* Daily Tasks */}
  <div className="bg-white rounded-xl shadow-sm p-6">
    <h2 className="text-xl font-bold text-gray-800 mb-4">Günlük Görevler</h2>
    <div className="space-y-4">
      <div className="flex items-center p-3 bg-gray-50 rounded-lg">
        <input type="checkbox" className="w-5 h-5 text-indigo-600 rounded" />
        <div className="ml-4 flex-1">
          <h4 className="text-sm font-medium text-gray-800">Temel Akorları Tekrarla</h4>
          <p className="text-xs text-gray-500">15 dakika</p>
        </div>
        <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded">+10 XP</span>
      </div>

      <div className="flex items-center p-3 bg-gray-50 rounded-lg">
        <input type="checkbox" className="w-5 h-5 text-indigo-600 rounded" />
        <div className="ml-4 flex-1">
          <h4 className="text-sm font-medium text-gray-800">Ritim Egzersizi</h4>
          <p className="text-xs text-gray-500">10 dakika</p>
        </div>
        <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded">+15 XP</span>
      </div>

      <div className="flex items-center p-3 bg-gray-50 rounded-lg">
        <input type="checkbox" className="w-5 h-5 text-indigo-600 rounded" />
        <div className="ml-4 flex-1">
          <h4 className="text-sm font-medium text-gray-800">Yeni Şarkı Öğren</h4>
          <p className="text-xs text-gray-500">20 dakika</p>
        </div>
        <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded">+25 XP</span>
      </div>
    </div>
  </div>

  {/* Recommended Lessons */}
  <div className="bg-white rounded-xl shadow-sm p-6">
    <h2 className="text-xl font-bold text-gray-800 mb-4">Önerilen Dersler</h2>
    <div className="space-y-4">
      <div className="group cursor-pointer">
        <div className="flex items-center p-3 bg-gray-50 rounded-lg group-hover:bg-gray-100 transition-colors">
          <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
            <Music className="w-6 h-6 text-indigo-600" />
          </div>
          <div className="ml-4 flex-1">
            <h4 className="text-sm font-medium text-gray-800">Temel Gitar Akorları</h4>
            <p className="text-xs text-gray-500">Seviye 1 • 15 dakika</p>
          </div>
          <button className="px-3 py-1 text-sm text-indigo-600 border border-indigo-600 rounded-lg hover:bg-indigo-50">
            Başla
          </button>
        </div>
      </div>

      <div className="group cursor-pointer">
        <div className="flex items-center p-3 bg-gray-50 rounded-lg group-hover:bg-gray-100 transition-colors">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
            <Music className="w-6 h-6 text-purple-600" />
          </div>
          <div className="ml-4 flex-1">
            <h4 className="text-sm font-medium text-gray-800">Ritim Kalıpları</h4>
            <p className="text-xs text-gray-500">Seviye 2 • 20 dakika</p>
          </div>
          <button className="px-3 py-1 text-sm text-indigo-600 border border-indigo-600 rounded-lg hover:bg-indigo-50">
            Başla
          </button>
        </div>
      </div>

      <div className="group cursor-pointer">
        <div className="flex items-center p-3 bg-gray-50 rounded-lg group-hover:bg-gray-100 transition-colors">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
            <Music className="w-6 h-6 text-green-600" />
          </div>
          <div className="ml-4 flex-1">
            <h4 className="text-sm font-medium text-gray-800">Pena Teknikleri</h4>
            <p className="text-xs text-gray-500">Seviye 1 • 10 dakika</p>
          </div>
          <button className="px-3 py-1 text-sm text-indigo-600 border border-indigo-600 rounded-lg hover:bg-indigo-50">
            Başla
          </button>
        </div>
      </div>
    </div>
  </div>
</div>
</main>

  {/* TeacherDialog Modal */}
  {showTeacherDialog && (
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
          teacherGender="male"  // Şimdilik statik
          studentName="Test Kullanıcı"  // Şimdilik statik
          instrument="Gitar"  // Şimdilik statik
        />
      </div>
    </div>
  )}
    </div>
  );
}