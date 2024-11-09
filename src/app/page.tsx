'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function Home() {
  const [selectedLang, setSelectedLang] = useState('tr');

  return (
    <main className="min-h-screen bg-gradient-to-b from-indigo-600 to-indigo-900 flex flex-col items-center justify-between p-8">
      {/* Navbar */}
      <nav className="w-full">
        <div className="container mx-auto flex justify-end items-center">
          <div className="flex items-center gap-4">
            <select 
              value={selectedLang}
              onChange={(e) => setSelectedLang(e.target.value)}
              className="bg-transparent text-white border border-white/30 rounded-lg px-3 py-1"
            >
              <option value="tr">🇹🇷 TR</option>
              <option value="en">🇬🇧 EN</option>
              <option value="ar">🇸🇦 AR</option>
              <option value="es">🇪🇸 ES</option>
            </select>
            
          </div>
        </div>
      </nav>

      {/* Logo Section */}
      <div className="w-full text-center mb-8">
        <h1 className="text-white text-4xl font-bold">MusicMaster</h1>
        <p className="text-white/80 mt-2">müzik eğitiminde yeni dönem</p>
      </div>

      {/* Circular Elements */}
      <div className="relative w-full max-w-2xl aspect-square">
        {/* Center Circle */}
        <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-white rounded-full flex items-center justify-center">
          <img 
            src="/api/placeholder/128/128" 
            alt="musician" 
            className="w-full h-full rounded-full object-cover"
          />
        </div>
        
        {/* Instrument Circles */}
        <div className="absolute left-[20%] top-[20%] w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
          <span className="text-white">Gitar</span>
        </div>
        <div className="absolute right-[20%] top-[30%] w-24 h-24 bg-white/20 rounded-full flex items-center justify-center">
          <span className="text-white">Piyano</span>
        </div>
        <div className="absolute left-[30%] bottom-[20%] w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
          <span className="text-white">Bateri</span>
        </div>
        <div className="absolute right-[25%] bottom-[25%] w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
          <span className="text-white">Keman</span>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="w-full max-w-md text-center">
        <h2 className="text-white text-3xl font-bold mb-8">
          Günde sadece 15 dakika çalışarak enstrüman öğren
        </h2>
        
        {/* Progress Dots */}
        <div className="flex justify-center gap-2 mb-8">
          <div className="w-2 h-2 rounded-full bg-white"></div>
          <div className="w-2 h-2 rounded-full bg-white/50"></div>
          <div className="w-2 h-2 rounded-full bg-white/50"></div>
        </div>

        {/* CTA Button */}
        <Link href="/signup">
          <button className="w-full bg-emerald-400 text-white py-4 rounded-full text-xl font-semibold hover:bg-emerald-500 transition-all">
            Öğrenmeye başla
          </button>
        </Link>

        {/* Login Link */}
        <div className="mt-6 text-white">
          Hesabın var mı?{' '}
          <Link href="/login" className="underline hover:text-gray-200 transition-colors">
            Oturum aç
          </Link>
        </div>
      </div>
    </main>
  );
}