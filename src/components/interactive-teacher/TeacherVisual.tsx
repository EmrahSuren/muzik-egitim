// src/components/interactive-teacher/TeacherVisual.tsx
'use client';

import React from 'react';
import { GuitarVisual } from './instruments/GuitarVisual';
import { PianoVisual } from './instruments/PianoVisual';
import { DrumVisual } from './instruments/DrumVisual';

interface TeacherVisualProps {
  instrument: 'gitar' | 'piyano' | 'bateri';
  currentAction?: string;
  isTeaching: boolean;
  lessonContent?: {
    type: 'notation' | 'chord' | 'exercise';
    title: string;
    content: any;
    visualAids?: string[];
  };
  currentPerformance?: {
    accuracy: number;
    rhythm: number;
    tempo: number;
    suggestions?: string[];
  };
}

export const TeacherVisual: React.FC<TeacherVisualProps> = ({
  instrument,
  currentAction,
  isTeaching,
  lessonContent,
  currentPerformance
}) => {
  const renderInstrumentVisual = () => {
    switch(instrument) {
      case 'gitar':
        return <GuitarVisual 
          currentChord={currentAction} 
          isPlaying={isTeaching}
          highlightedFrets={lessonContent?.type === 'chord' ? lessonContent.content : []}
        />;
      case 'piyano':
        return <PianoVisual 
          activeKeys={lessonContent?.type === 'notation' ? lessonContent.content : []}
          isPlaying={isTeaching}
        />;
      case 'bateri':
        return <DrumVisual 
          activeParts={lessonContent?.type === 'exercise' ? lessonContent.content : []}
          isPlaying={isTeaching}
        />;
    }
  };

  return (
    <div className="relative w-full h-full">
      <div className="instrument-container border rounded-lg overflow-hidden">
        {renderInstrumentVisual()}
      </div>

      {isTeaching && (
        <div className="absolute top-4 right-4 bg-blue-500 text-white px-3 py-1 rounded-full text-sm">
          Öğretmen açıklama yapıyor...
        </div>
      )}

      {currentPerformance && (
        <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur p-4 rounded-xl text-white">
          <div className="space-y-2">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm">Doğruluk</span>
                <span className="text-sm">{currentPerformance.accuracy}%</span>
              </div>
              <div className="w-48 h-1.5 bg-gray-700 rounded-full">
                <div 
                  className="h-full bg-green-500 rounded-full transition-all"
                  style={{ width: `${currentPerformance.accuracy}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm">Ritim</span>
                <span className="text-sm">{currentPerformance.rhythm}%</span>
              </div>
              <div className="w-48 h-1.5 bg-gray-700 rounded-full">
                <div 
                  className="h-full bg-blue-500 rounded-full transition-all"
                  style={{ width: `${currentPerformance.rhythm}%` }}
                />
              </div>
            </div>

            {currentPerformance.suggestions && (
              <div className="mt-2 text-sm">
                <span className="text-gray-300">Öneriler:</span>
                <ul className="mt-1 space-y-1">
                  {currentPerformance.suggestions.map((suggestion, index) => (
                    <li key={index} className="text-xs text-gray-300">• {suggestion}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherVisual;