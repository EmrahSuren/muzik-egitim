'use client';

import React, { useState, useEffect } from 'react';

interface GuitarVisualProps {
  currentChord?: string;
  isPlaying?: boolean;
  highlightedFrets?: {
    string: number;
    fret: number;
  }[];
  onNotePlay?: (string: number, fret: number) => void;
}

const STRINGS = 6;
const FRETS = 12;

const CHORD_POSITIONS: Record<string, { string: number; fret: number }[]> = {
  'Em': [
    { string: 6, fret: 0 },
    { string: 5, fret: 2 },
    { string: 4, fret: 2 },
    { string: 3, fret: 0 },
    { string: 2, fret: 0 },
    { string: 1, fret: 0 }
  ],
  'Am': [
    { string: 6, fret: -1 },
    { string: 5, fret: 0 },
    { string: 4, fret: 2 },
    { string: 3, fret: 2 },
    { string: 2, fret: 1 },
    { string: 1, fret: 0 }
  ],
  'C': [
    { string: 6, fret: -1 },
    { string: 5, fret: 3 },
    { string: 4, fret: 2 },
    { string: 3, fret: 0 },
    { string: 2, fret: 1 },
    { string: 1, fret: 0 }
  ],
  'G': [
    { string: 6, fret: 3 },
    { string: 5, fret: 2 },
    { string: 4, fret: 0 },
    { string: 3, fret: 0 },
    { string: 2, fret: 0 },
    { string: 1, fret: 3 }
  ],
  'D': [
    { string: 6, fret: -1 },
    { string: 5, fret: -1 },
    { string: 4, fret: 0 },
    { string: 3, fret: 2 },
    { string: 2, fret: 3 },
    { string: 1, fret: 2 }
  ]
};

export const GuitarVisual: React.FC<GuitarVisualProps> = ({
  currentChord,
  isPlaying = false,
  highlightedFrets = [],
  onNotePlay
}) => {
  const [activePositions, setActivePositions] = useState<{ string: number; fret: number }[]>([]);
  const [hoveredPosition, setHoveredPosition] = useState<{ string: number; fret: number } | null>(null);

  useEffect(() => {
    if (currentChord && CHORD_POSITIONS[currentChord]) {
      setActivePositions(CHORD_POSITIONS[currentChord]);
    } else {
      setActivePositions(highlightedFrets);
    }
  }, [currentChord, highlightedFrets]);

  return (
    <div className="relative w-full">
      <svg viewBox="0 0 1000 300" className="w-full max-w-3xl mx-auto">
        {/* Klavye arkaplanı */}
        <rect x="50" y="20" width="900" height="260" fill="#4a3728" rx="2" />

        {/* Perdeler */}
        {Array.from({ length: FRETS + 1 }).map((_, i) => (
          <line
            key={`fret-${i}`}
            x1={50 + (i * 900) / FRETS}
            y1="20"
            x2={50 + (i * 900) / FRETS}
            y2="280"
            stroke="#C0C0C0"
            strokeWidth="3"
          />
        ))}

        {/* Perde işaretleri */}
        {[3, 5, 7, 9, 12].map(fret => (
          <circle
            key={`marker-${fret}`}
            cx={50 + (fret - 0.5) * (900 / FRETS)}
            cy="150"
            r="8"
            fill="#C0C0C0"
          />
        ))}

        {/* Teller */}
        {Array.from({ length: STRINGS }).map((_, i) => (
          <line
            key={`string-${i}`}
            x1="50"
            y1={40 + i * 44}
            x2="950"
            y2={40 + i * 44}
            stroke={i < 3 ? "#CCB78D" : "#7E685A"}
            strokeWidth={6 - i}
          />
        ))}

        {/* Etkileşimli alanlar */}
        {Array.from({ length: STRINGS }).map((_, stringIndex) => (
          Array.from({ length: FRETS + 1 }).map((_, fretIndex) => (
            <rect
              key={`fret-area-${stringIndex}-${fretIndex}`}
              x={50 + (fretIndex * 900) / FRETS - 30}
              y={40 + stringIndex * 44 - 20}
              width={(900 / FRETS) + 10}
              height="40"
              fill="transparent"
              className="cursor-pointer hover:fill-white hover:fill-opacity-10 transition-all duration-200"
              onClick={() => onNotePlay?.(stringIndex + 1, fretIndex)}
              onMouseEnter={() => setHoveredPosition({ string: stringIndex + 1, fret: fretIndex })}
              onMouseLeave={() => setHoveredPosition(null)}
            />
          ))
        ))}

        {/* Aktif pozisyonlar */}
        {activePositions.map((pos, i) => pos.fret !== -1 && (
          <g key={`pos-${i}`}>
            <circle
              cx={50 + (pos.fret + 0.5) * (900 / FRETS)}
              cy={40 + (pos.string - 1) * 44}
              r="18"
              fill={isPlaying ? "#4CAF50" : "#60A5FA"}
              className="transition-all duration-200"
            >
              {isPlaying && (
                <animate
                  attributeName="opacity"
                  values="1;0.5;1"
                  dur="1s"
                  repeatCount="indefinite"
                />
              )}
            </circle>
          </g>
        ))}

        {/* X işaretleri */}
        {activePositions
          .filter(pos => pos.fret === -1)
          .map((pos, i) => (
            <g key={`x-${i}`}>
              <line
                x1="20"
                y1={30 + (pos.string - 1) * 44}
                x2="40"
                y2={50 + (pos.string - 1) * 44}
                stroke="#EF4444"
                strokeWidth="3"
              />
              <line
                x1="40"
                y1={30 + (pos.string - 1) * 44}
                x2="20"
                y2={50 + (pos.string - 1) * 44}
                stroke="#EF4444"
                strokeWidth="3"
              />
            </g>
          ))}
      </svg>

      {currentChord && (
        <div className="absolute top-2 right-2 bg-blue-600 text-white px-3 py-1 rounded-full text-sm">
          {currentChord}
        </div>
      )}
    </div>
  );
};

export default GuitarVisual;