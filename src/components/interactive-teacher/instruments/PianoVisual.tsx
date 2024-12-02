'use client';

import React, { useState } from 'react';

interface PianoVisualProps {
  activeKeys: string[];
  isPlaying: boolean;
  onKeyPress?: (note: string) => void;
}

const PIANO_KEYS = {
  white: [
    { note: 'C', key: 'a' },
    { note: 'D', key: 's' },
    { note: 'E', key: 'd' },
    { note: 'F', key: 'f' },
    { note: 'G', key: 'g' },
    { note: 'A', key: 'h' },
    { note: 'B', key: 'j' }
  ],
  black: [
    { note: 'C#', key: 'w' },
    { note: 'D#', key: 'e' },
    { note: 'F#', key: 't' },
    { note: 'G#', key: 'y' },
    { note: 'A#', key: 'u' }
  ]
};

export const PianoVisual: React.FC<PianoVisualProps> = ({
  activeKeys = [],
  isPlaying = false,
  onKeyPress
}) => {
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);

  return (
    <div className="piano-container relative w-full max-w-4xl mx-auto h-64">
      {/* Beyaz tuşlar */}
      <div className="white-keys flex relative h-full">
        {PIANO_KEYS.white.map(({ note, key }) => (
          <div
            key={note}
            className={`
              white-key relative 
              flex-1 border border-gray-300 
              ${activeKeys.includes(note) ? 'bg-blue-200' : 'bg-white'}
              ${hoveredKey === note ? 'bg-gray-100' : ''}
              hover:bg-gray-100 
              cursor-pointer
              transition-colors
            `}
            onClick={() => onKeyPress?.(note)}
            onMouseEnter={() => setHoveredKey(note)}
            onMouseLeave={() => setHoveredKey(null)}
          >
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-gray-500 text-sm">
              {note}
              <span className="block text-xs text-gray-400">({key})</span>
            </div>
            {activeKeys.includes(note) && isPlaying && (
              <div className="absolute inset-0 bg-blue-400 opacity-30 animate-pulse" />
            )}
          </div>
        ))}
      </div>

      {/* Siyah tuşlar */}
      <div className="black-keys absolute top-0 left-0 w-full">
        {PIANO_KEYS.black.map(({ note, key }, index) => (
          <div
            key={note}
            className={`
              black-key absolute 
              w-8 h-40 
              ${activeKeys.includes(note) ? 'bg-blue-700' : 'bg-gray-800'}
              ${hoveredKey === note ? 'bg-gray-700' : ''}
              hover:bg-gray-700 
              cursor-pointer
              transition-colors
            `}
            style={{
              left: `${index * 14.28 + (index > 1 ? 14.28 : 0) + (index > 3 ? 14.28 : 0) + 10}%`,
              marginLeft: '-1rem'
            }}
            onClick={() => onKeyPress?.(note)}
            onMouseEnter={() => setHoveredKey(note)}
            onMouseLeave={() => setHoveredKey(null)}
          >
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm">
              {note}
              <span className="block text-xs opacity-75">({key})</span>
            </div>
            {activeKeys.includes(note) && isPlaying && (
              <div className="absolute inset-0 bg-blue-400 opacity-30 animate-pulse" />
            )}
          </div>
        ))}
      </div>

      {/* Notasyon Rehberi */}
      <div className="notation-guide absolute -bottom-24 left-0 right-0 bg-gray-50 p-4 rounded-lg">
        <div className="flex justify-between text-sm text-gray-600">
          {PIANO_KEYS.white.map(({ note, key }) => (
            <div key={note} className="text-center">
              <div className="font-medium">{note}</div>
              <div className="text-xs text-gray-400">{key}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PianoVisual;