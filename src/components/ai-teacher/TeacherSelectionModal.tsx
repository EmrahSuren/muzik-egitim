'use client';
import { useState } from 'react';
import Image from 'next/image';

interface TeacherSelectionModalProps {
  onClose: () => void;
  onSelectTeacher: (teacher: Teacher) => void;
}

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

export function TeacherSelectionModal({ onClose, onSelectTeacher }: TeacherSelectionModalProps) {
  const [selectedTeacher, setSelectedTeacher] = useState<number | null>(null);

  const teachers: Teacher[] = [
    { 
      id: 1,
      name: "Sarah",
      country: "🇺🇸 USA",
      avatar: "/teacher1.png",
      language: "İngilizce",
      teachingStyle: "Detaylı ve sabırlı anlatım",
      specialFocus: "Temel teknikler ve müzik teorisi",
      backgroundColor: "bg-purple-100",
      gender: 'female'
    },
    { 
      id: 2,
      name: "Ayşe",
      country: "🇹🇷 Türkiye",
      avatar: "/teacher2.png",
      language: "Türkçe",
      teachingStyle: "Pratik odaklı eğitim",
      specialFocus: "Hızlı ilerleme ve modern teknikler",
      backgroundColor: "bg-blue-100",
      gender: 'male'
    }
  ];

  const handleConfirmSelection = () => {
    const teacher = teachers.find(t => t.id === selectedTeacher);
    if (teacher) {
      onSelectTeacher(teacher);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-auto p-6">
        {/* Close button */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">AI Öğretmeninizi Seçin</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Teacher grid */}
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
                    width={80}
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

        {/* Confirm button */}
        {selectedTeacher && (
          <div className="mt-6 flex justify-end">
            <button 
              onClick={handleConfirmSelection}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Bu Öğretmenle Başla
            </button>
          </div>
        )}
      </div>
    </div>
  );
}