import React from 'react';
import { ArrowUpRight } from 'lucide-react';
export function AaryaHero() {
  return (
    <div className="relative w-full h-screen bg-black overflow-hidden text-white font-sans selection:bg-red-600 selection:text-white">
      {/* Video Background */}
      <div className="absolute inset-0 w-full h-full overflow-hidden bg-neutral-900 pointer-events-none">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-90"
        >
          <source src="https://k68-gray.vercel.app/main.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/20 mix-blend-multiply pointer-events-none"></div>
        <div className="absolute inset-0 shadow-[inset_0_0_60px_rgba(0,0,0,0.9)] pointer-events-none"></div>
      </div>

      {/* Giant Typography (Logo Section) */}
      <div className="absolute inset-x-0 bottom-[15%] md:bottom-[10%] z-50 flex flex-col items-center justify-center pointer-events-auto px-4">
        <h1
          className="text-[16vw] md:text-[9vw] leading-none text-white text-center mb-4 md:mb-6 pointer-events-none"
          style={{
            fontFamily: "'Ephesis', cursive",
            fontWeight: 400,
            textShadow: '0px 4px 20px rgba(0, 0, 0, 0.8)'
          }}
        >
          Emad Shaikh
        </h1>
        <button className="flex items-center gap-2 px-6 py-2 rounded-full bg-black/30 backdrop-blur-sm border border-white/10 text-white font-sans text-xs md:text-sm font-semibold tracking-widest hover:bg-black/50 transition-all duration-300 uppercase shadow-lg">
          LET'S CREATE <ArrowUpRight className="w-4 h-4 md:w-5 md:h-5" />
        </button>
      </div>
    </div>
  );
}
