import React, { useState, useEffect } from 'react';
import Image from 'next/image';

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

interface TeacherSelectionModalProps {
 onClose: () => void;
 onSelectTeacher: (teacher: Teacher) => void;
}

const TeacherSelectionModal: React.FC<TeacherSelectionModalProps> = ({ onClose, onSelectTeacher }) => {
 const [selectedTeacher, setSelectedTeacher] = useState<number | null>(null);
 const [isClient, setIsClient] = useState(false);

 useEffect(() => {
   setIsClient(true);
 }, []);

 if (!isClient) {
   return null;
 }

 const teachers: Teacher[] = [
   { 
     id: 1,
     name: "Sarah",
     country: "🇺🇸 USA",
     avatar: "https://studio.d-id.com/share?id=4af25df39f8bc46ce625e84b25a2a392&utm_source=copy",
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
     avatar: "https://studio.d-id.com/share?id=627cc33464ce70c4cbb4108a8eca81ff&utm_source=copy",
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
     <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-auto relative p-6">
       <button 
         onClick={onClose}
         className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
       >
         <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
         </svg>
       </button>
       <h2 className="text-2xl font-bold text-gray-800 mb-4">Öğretmen Seçimi</h2>
       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
         {teachers.map(teacher => (
           <div 
             key={teacher.id}
             className={`p-4 rounded-lg cursor-pointer ${teacher.backgroundColor} ${selectedTeacher === teacher.id ? 'ring-2 ring-indigo-500' : ''}`}
             onClick={() => setSelectedTeacher(teacher.id)}
           >
             <Image src={teacher.avatar} alt={teacher.name} width={64} height={64} className="w-16 h-16 rounded-full mb-2" />
             <h3 className="text-lg font-medium text-gray-800">{teacher.name}</h3>
             <p className="text-sm text-gray-600">{teacher.country}</p>
             <p className="text-sm text-gray-600">{teacher.language}</p>
             <p className="text-sm text-gray-600">{teacher.teachingStyle}</p>
             <p className="text-sm text-gray-600">{teacher.specialFocus}</p>
           </div>
         ))}
       </div>
       <div className="mt-4 flex justify-end">
         <button 
           onClick={handleConfirmSelection}
           className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
         >
           Seçimi Onayla
         </button>
       </div>
     </div>
   </div>
 );
};

export default TeacherSelectionModal;