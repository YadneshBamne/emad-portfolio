import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useTransitionNavigate } from '../context/TransitionContext';
import AboutSection from '../components/AboutSection';

export default function AboutPage() {
  const navigate = useTransitionNavigate();

  return (
    <div className="w-full min-h-screen bg-black text-white relative select-none overflow-x-hidden">
      
      {/* GLOBAL HUD NAVIGATION OVERLAY */}
      <header className="fixed top-0 left-0 w-full h-18 px-6 sm:px-10 flex items-center justify-between z-50 pointer-events-none mix-blend-difference text-white bg-transparent">
        
        {/* Return link */}
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-2 font-mono text-[10px] font-bold tracking-[0.2em] cursor-pointer pointer-events-auto hover:opacity-85 transition-opacity"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>EMAD SHAIKH.</span>
        </button>

        {/* Middle indicator */}
        <div className="font-mono text-[9px] tracking-[0.3em] uppercase hidden sm:block">
          ABOUT // INFORMATION
        </div>

        {/* Global links */}
        <div className="flex items-center gap-8 font-mono text-[10px] font-bold tracking-widest pointer-events-auto">
          <button onClick={() => navigate('/')} className="hover:opacity-75 cursor-pointer transition-opacity">HOME</button>
          <button onClick={() => navigate('/photography')} className="hover:opacity-75 cursor-pointer transition-opacity">PHOTOGRAPHY</button>
          <button onClick={() => navigate('/works')} className="hover:opacity-75 cursor-pointer transition-opacity">WORKS</button>
          <button onClick={() => navigate('/about')} className="underline decoration-white underline-offset-4 cursor-pointer">ABOUT</button>
        </div>

      </header>

      <div className="pt-24 pb-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-12" style={{ fontFamily: "'Anton', sans-serif" }}>ABOUT US</h1>
          <AboutSection />
        </div>
      </div>
    </div>
  );
}
