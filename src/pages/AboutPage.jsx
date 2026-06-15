import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useTransitionNavigate } from '../context/TransitionContext';
import AboutSection from '../components/AboutSection';
import { AaryaNavigationDrawer } from '../components/AaryaNavigationDrawer';

export default function AboutPage() {
  const navigate = useTransitionNavigate();

  return (
    <div className="w-full min-h-screen bg-black text-white relative select-none overflow-x-hidden">
      
      {/* Global Slide-Out Navigation (Framer Motion) - Mobile Only */}
      <div className="block md:hidden">
        <AaryaNavigationDrawer />
      </div>

      {/* Desktop Navigation — always visible */}
      <nav className="desktop-nav hidden md:flex justify-center fixed top-0 left-0 w-full z-[10000] py-8 px-12 items-center pointer-events-auto" style={{ transition: 'none' }}>
        <div className="flex items-center gap-8 md:gap-12">
          {/* Left: Links */}
          <div className="nav-left-links flex items-center gap-10 font-sans text-base tracking-[0.15em] text-white font-bold">
            <button onClick={() => navigate('/about')} className="hover:opacity-70 transition-opacity duration-300 underline decoration-white underline-offset-4 decoration-2 cursor-pointer">ABOUT</button>
            <button onClick={() => navigate('/photography')} className="hover:opacity-70 transition-opacity duration-300 cursor-pointer">PHOTOGRAPHY</button>
          </div>
          
          {/* Center: Logo */}
          <div className="nav-logo flex justify-center items-center">
            <button onClick={() => navigate('/')} className="hover:scale-110 transition-transform duration-300 shrink-0 cursor-pointer">
              <img src="/logo.avif" alt="Logo" className="h-20 w-30" />
            </button>
          </div>

          {/* Right: Links */}
          <div className="nav-right-links flex items-center gap-10 font-sans text-base tracking-[0.15em] text-white font-bold">
            <button onClick={() => navigate('/works')} className="hover:opacity-70 transition-opacity duration-300 cursor-pointer">WORKS</button>
            <button onClick={() => navigate('/community')} className="hover:opacity-70 transition-opacity duration-300 cursor-pointer">COMMUNITY</button>
          </div>
        </div>
      </nav>

      <div className="pt-36 pb-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-12" style={{ fontFamily: "'Anton', sans-serif" }}>ABOUT US</h1>
          <AboutSection />
        </div>
      </div>
    </div>
  );
}
