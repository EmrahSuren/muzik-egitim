// src/components/interactive-teacher/TeacherVisual.tsx
'use client';

import React from 'react';

interface TeacherVisualProps {
  instrument: 'gitar' | 'piyano' | 'bateri';
  currentAction: string;
  isTeaching: boolean;
}

const GuitarFretboard = ({ currentChord }: { currentChord: string }) => {
  // Gitar perdelerini gösteren SVG komponenti
  return (
    <div className="fretboard-container">
      <svg viewBox="0 0 800 200" className="w-full h-full">
        {/* Gitar telleri */}
        {[0, 1, 2, 3, 4, 5].map((string) => (
          <line
            key={`string-${string}`}
            x1="0"
            y1={20 + string * 30}
            x2="800"
            y2={20 + string * 30}
            stroke="gray"
            strokeWidth="2"
          />
        ))}
        
        {/* Perdeler */}
        {[0, 1, 2, 3, 4, 5, 6, 7].map((fret) => (
          <line
            key={`fret-${fret}`}
            x1={100 * fret}
            y1="0"
            x2={100 * fret}
            y2="200"
            stroke="gray"
            strokeWidth="4"
          />
        ))}
      </svg>
    </div>
  );
};

const PianoKeys = ({ highlightedKeys }: { highlightedKeys: string }) => {
  // Piyano tuşlarını gösteren SVG komponenti
  return (
    <div className="piano-container">
      <svg viewBox="0 0 800 200" className="w-full h-full">
        {/* Beyaz tuşlar */}
        {[0, 1, 2, 3, 4, 5, 6, 7].map((key) => (
          <rect
            key={`white-key-${key}`}
            x={key * 100}
            y="0"
            width="90"
            height="200"
            fill="white"
            stroke="black"
          />
        ))}
        
        {/* Siyah tuşlar */}
        {[0, 1, 3, 4, 5].map((key) => (
          <rect
            key={`black-key-${key}`}
            x={75 + key * 100}
            y="0"
            width="50"
            height="120"
            fill="black"
          />
        ))}
      </svg>
    </div>
  );
};

const DrumKit = ({ activeElements }: { activeElements: string }) => {
  // Davul setini gösteren SVG komponenti
  return (
    <div className="drumkit-container">
      <svg viewBox="0 0 800 600" className="w-full h-full">
        {/* Bateri elementleri */}
        <circle cx="400" cy="300" r="100" fill="none" stroke="gray" strokeWidth="2" /> {/* Bass drum */}
        <circle cx="200" cy="200" r="60" fill="none" stroke="gray" strokeWidth="2" /> {/* Tom */}
        <circle cx="600" cy="200" r="60" fill="none" stroke="gray" strokeWidth="2" /> {/* Tom */}
        <circle cx="300" cy="150" r="40" fill="none" stroke="gray" strokeWidth="2" /> {/* Snare */}
        <ellipse cx="650" cy="150" rx="40" ry="30" fill="none" stroke="gray" strokeWidth="2" /> {/* Hi-hat */}
      </svg>
    </div>
  );
};

export const TeacherVisual: React.FC<TeacherVisualProps> = ({
  instrument,
  currentAction,
  isTeaching
}) => {
  const renderInstrumentGuide = () => {
    switch(instrument) {
      case 'gitar':
        return <GuitarFretboard currentChord={currentAction} />;
      case 'piyano':
        return <PianoKeys highlightedKeys={currentAction} />;
      case 'bateri':
        return <DrumKit activeElements={currentAction} />;
      default:
        return null;
    }
  };
  
  return (
    <div className="relative w-full h-full bg-gray-900 rounded-xl overflow-hidden">
      <div className="teacher-visual p-4">
        {renderInstrumentGuide()}
      </div>
      {isTeaching && (
        <div className="absolute bottom-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm">
          Öğretmen açıklama yapıyor...
        </div>
      )}
    </div>
  );
};

export default TeacherVisual;