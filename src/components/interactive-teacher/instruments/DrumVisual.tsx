'use client';

import React, { useState } from 'react';

interface DrumVisualProps {
  activeParts: string[];
  isPlaying: boolean;
  onDrumHit?: (part: string) => void;
}

const DRUM_PARTS = {
  hiHat: { cx: 650, cy: 150, rx: 40, ry: 30, label: 'Hi-Hat' },
  snare: { cx: 300, cy: 150, r: 40, label: 'Snare' },
  kick: { cx: 400, cy: 300, r: 100, label: 'Bass Drum' },
  tomHigh: { cx: 200, cy: 200, r: 60, label: 'High Tom' },
  tomLow: { cx: 600, cy: 200, r: 60, label: 'Low Tom' },
  crash: { cx: 100, cy: 100, rx: 45, ry: 35, label: 'Crash' },
  ride: { cx: 700, cy: 100, rx: 45, ry: 35, label: 'Ride' }
};

export const DrumVisual: React.FC<DrumVisualProps> = ({
  activeParts = [],
  isPlaying = false,
  onDrumHit
}) => {
  const [hoveredPart, setHoveredPart] = useState<string | null>(null);

  return (
    <div className="drum-container relative w-full max-w-4xl mx-auto">
      <svg viewBox="0 0 800 600" className="w-full h-full">
        {/* Ride ve Crash */}
        {['crash', 'ride'].map(part => (
          <g key={part}>
            <ellipse
              cx={DRUM_PARTS[part].cx}
              cy={DRUM_PARTS[part].cy}
              rx={DRUM_PARTS[part].rx}
              ry={DRUM_PARTS[part].ry}
              className={`
                fill-transparent stroke-2
                ${activeParts.includes(part) ? 'stroke-blue-500' : 'stroke-gray-400'}
                ${hoveredPart === part ? 'stroke-blue-300' : ''}
                cursor-pointer
                transition-colors
              `}
              onClick={() => onDrumHit?.(part)}
              onMouseEnter={() => setHoveredPart(part)}
              onMouseLeave={() => setHoveredPart(null)}
            />
            <text
              x={DRUM_PARTS[part].cx}
              y={DRUM_PARTS[part].cy}
              className="text-sm fill-gray-500 text-center"
              textAnchor="middle"
              dominantBaseline="middle"
            >
              {DRUM_PARTS[part].label}
            </text>
          </g>
        ))}

        {/* Hi-Hat */}
        <g>
          <ellipse
            cx={DRUM_PARTS.hiHat.cx}
            cy={DRUM_PARTS.hiHat.cy}
            rx={DRUM_PARTS.hiHat.rx}
            ry={DRUM_PARTS.hiHat.ry}
            className={`
              fill-transparent stroke-2
              ${activeParts.includes('hiHat') ? 'stroke-blue-500' : 'stroke-gray-400'}
              ${hoveredPart === 'hiHat' ? 'stroke-blue-300' : ''}
              cursor-pointer
              transition-colors
            `}
            onClick={() => onDrumHit?.('hiHat')}
            onMouseEnter={() => setHoveredPart('hiHat')}
            onMouseLeave={() => setHoveredPart(null)}
          />
          <text
            x={DRUM_PARTS.hiHat.cx}
            y={DRUM_PARTS.hiHat.cy}
            className="text-sm fill-gray-500 text-center"
            textAnchor="middle"
            dominantBaseline="middle"
          >
            Hi-Hat
          </text>
        </g>

        {/* Toms ve Snare */}
        {['tomHigh', 'tomLow', 'snare'].map(part => (
          <g key={part}>
            <circle
              cx={DRUM_PARTS[part].cx}
              cy={DRUM_PARTS[part].cy}
              r={DRUM_PARTS[part].r}
              className={`
                fill-transparent stroke-2
                ${activeParts.includes(part) ? 'stroke-blue-500' : 'stroke-gray-400'}
                ${hoveredPart === part ? 'stroke-blue-300' : ''}
                cursor-pointer
                transition-colors
              `}
              onClick={() => onDrumHit?.(part)}
              onMouseEnter={() => setHoveredPart(part)}
              onMouseLeave={() => setHoveredPart(null)}
            />
            <text
              x={DRUM_PARTS[part].cx}
              y={DRUM_PARTS[part].cy}
              className="text-sm fill-gray-500 text-center"
              textAnchor="middle"
              dominantBaseline="middle"
            >
              {DRUM_PARTS[part].label}
            </text>
          </g>
        ))}

        {/* Kick Drum */}
        <g>
          <circle
            cx={DRUM_PARTS.kick.cx}
            cy={DRUM_PARTS.kick.cy}
            r={DRUM_PARTS.kick.r}
            className={`
              fill-transparent stroke-2
              ${activeParts.includes('kick') ? 'stroke-blue-500' : 'stroke-gray-400'}
              ${hoveredPart === 'kick' ? 'stroke-blue-300' : ''}
              cursor-pointer
              transition-colors
            `}
            onClick={() => onDrumHit?.('kick')}
            onMouseEnter={() => setHoveredPart('kick')}
            onMouseLeave={() => setHoveredPart(null)}
          />
          <text
            x={DRUM_PARTS.kick.cx}
            y={DRUM_PARTS.kick.cy}
            className="text-sm fill-gray-500 text-center"
            textAnchor="middle"
            dominantBaseline="middle"
          >
            Bass Drum
          </text>
        </g>

        {/* Aktif parçalar için animasyon */}
        {activeParts.map(part => (
          <g key={`active-${part}`}>
            {DRUM_PARTS[part].r ? (
              <circle
                cx={DRUM_PARTS[part].cx}
                cy={DRUM_PARTS[part].cy}
                r={DRUM_PARTS[part].r}
                className="fill-blue-400 opacity-30 animate-ping"
              />
            ) : (
              <ellipse
                cx={DRUM_PARTS[part].cx}
                cy={DRUM_PARTS[part].cy}
                rx={DRUM_PARTS[part].rx}
                ry={DRUM_PARTS[part].ry}
                className="fill-blue-400 opacity-30 animate-ping"
              />
            )}
          </g>
        ))}
      </svg>

      {/* Ritim Göstergesi */}
      {isPlaying && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
          <div className="flex gap-2">
            {[1, 2, 3, 4].map(beat => (
              <div
                key={beat}
                className={`w-3 h-3 rounded-full ${
                  activeParts.length > 0 && beat === 1
                    ? 'bg-blue-500'
                    : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DrumVisual;