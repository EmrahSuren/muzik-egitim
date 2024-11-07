import React from 'react';
import Image from 'next/image';
import { Teacher } from '@/types/teacher';

interface TeacherCardProps {
  teacher: Teacher;
  isSelected: boolean;
  onSelect: (teacherId: string) => void;
}

const TeacherCard: React.FC<TeacherCardProps> = ({ teacher, isSelected, onSelect }) => {
  return (
    <div
      onClick={() => onSelect(teacher.id)}
      className={`p-6 rounded-xl cursor-pointer transition-all duration-300 ${
        isSelected
          ? 'border-2 border-blue-500 shadow-lg transform scale-[1.02]'
          : 'border-2 border-transparent hover:border-blue-200'
      }`}
    >
      <div className="flex items-center gap-4">
        {/* Öğretmen Avatarı */}
        <div className={`w-20 h-20 rounded-full overflow-hidden ${teacher.backgroundColor} flex items-center justify-center`}>
          <Image 
            src={teacher.avatar}
            alt={teacher.name}
            width={80}
            height={80}
            className="w-full h-full object-cover rounded-full"
          />
        </div>

        {/* Öğretmen Bilgileri */}
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-semibold">{teacher.name}</h3>
            <span className="text-sm text-gray-500">{teacher.language}</span>
          </div>
          <p className="text-gray-600 text-sm mt-1">{teacher.personality.teachingStyle}</p>
        </div>
      </div>

      {/* Uzmanlık Alanları */}
      <div className="mt-4 pt-4 border-t">
        <p className="text-sm text-gray-600">
          <span className="font-medium">Uzmanlık: </span>
          {teacher.expertise.join(', ')}
        </p>
      </div>

      {/* Seçim Durumu */}
      <div className={`mt-4 text-center py-2 rounded-lg transition-colors ${
        isSelected ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
      }`}>
        {isSelected ? 'Seçildi' : 'Seç'}
      </div>
    </div>
  );
};

export default TeacherCard;