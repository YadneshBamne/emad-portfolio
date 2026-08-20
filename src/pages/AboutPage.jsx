import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useTransitionNavigate } from '../context/TransitionContext';
import AboutSection from '../components/AboutSection';
import { AaryaNavigationDrawer } from '../components/AaryaNavigationDrawer';
import DynamicIslandNavbar from '../components/DynamicIslandNavbar';

export default function AboutPage() {
  const navigate = useTransitionNavigate();

  return (
    <div className="w-full min-h-screen bg-black text-white relative select-none overflow-x-hidden">
      
      {/* Global Slide-Out Navigation (Framer Motion) - Mobile Only */}
      <div className="block md:hidden">
        <AaryaNavigationDrawer />
      </div>

      {/* Dynamic Island Navigation Bar */}
      <DynamicIslandNavbar activePath="/about" />

      <div className="pt-36 pb-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-12" style={{ fontFamily: "'Anton', sans-serif" }}>ABOUT US</h1>
          <AboutSection />
        </div>
      </div>
    </div>
  );
}
