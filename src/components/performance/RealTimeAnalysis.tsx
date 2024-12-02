// src/components/performance/RealTimeAnalysis.tsx
'use client';

import React, { useRef, useEffect } from 'react';
import type { AudioAnalysis } from '@/types/audio-analyzer';
import type { PerformanceData } from '@/types/performance';

interface RealTimeAnalysisProps {
  audioData: AudioAnalysis;
  performance: PerformanceData;
}

const FrequencyVisualizer: React.FC<{ data: AudioAnalysis }> = ({ data }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const draw = () => {
      const width = canvas.width;
      const height = canvas.height;
      
      // Canvas'ı temizle
      ctx.fillStyle = 'rgb(17, 24, 39)'; // bg-gray-900
      ctx.fillRect(0, 0, width, height);

      // Frekans verisini çiz
      const bufferLength = data.buffer.length;
      const barWidth = width / bufferLength;
      
      ctx.fillStyle = '#60A5FA'; // bg-blue-400
      
      for (let i = 0; i < bufferLength; i++) {
        const barHeight = data.buffer[i] * height;
        ctx.fillRect(i * barWidth, height - barHeight, barWidth, barHeight);
      }
    };

    const animate = () => {
      draw();
      requestAnimationFrame(animate);
    };

    animate();
  }, [data]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full"
      width={800}
      height={200}
    />
  );
};

// Doğruluk ölçer komponenti
const AccuracyMeter: React.FC<{ value: number }> = ({ value }) => {
  return (
    <div className="w-full mt-4">
      <div className="flex justify-between mb-1">
        <span className="text-sm text-gray-300">Doğruluk</span>
        <span className="text-sm text-gray-300">{value}%</span>
      </div>
      <div className="w-full h-2 bg-gray-700 rounded">
        <div 
          className="h-full bg-green-500 rounded transition-all duration-300"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
};

// Ritim rehberi komponenti
const RhythmGuide: React.FC<{ currentBeat: number; tempo: number }> = ({ 
  currentBeat,
  tempo 
}) => {
  return (
    <div className="mt-4">
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-300">Tempo: {tempo} BPM</span>
        <div className="flex space-x-1">
          {[1,2,3,4].map(beat => (
            <div 
              key={beat}
              className={`w-3 h-3 rounded-full ${
                beat === currentBeat 
                  ? 'bg-blue-500' 
                  : 'bg-gray-600'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

// Ana komponent
export const RealTimeAnalysis: React.FC<RealTimeAnalysisProps> = ({ 
  audioData, 
  performance 
}) => {
  return (
    <div className="p-4 bg-gray-800 rounded-xl">
      <FrequencyVisualizer data={audioData} />
      <AccuracyMeter value={performance.accuracy} />
      <RhythmGuide 
        currentBeat={performance.currentBeat} 
        tempo={performance.tempo} 
      />
    </div>
  );
};

export default RealTimeAnalysis;