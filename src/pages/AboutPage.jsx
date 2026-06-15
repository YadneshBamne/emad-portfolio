import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useTransitionNavigate } from '../context/TransitionContext';
import AboutSection from '../components/AboutSection';
import { AaryaNavigationDrawer } from '../components/AaryaNavigationDrawer';
import AaryaNavbar from '../components/AaryaNavbar';

export default function AboutPage() {
  const navigate = useTransitionNavigate();

  return (
    <div className="w-full min-h-screen bg-bg-primary text-text-primary relative select-none overflow-x-hidden transition-colors duration-500">
      
      {/* Global Slide-Out Navigation (Framer Motion) - Mobile Only */}
      <div className="block md:hidden">
        <AaryaNavigationDrawer />
      </div>

      {/* Desktop Navigation */}
      <AaryaNavbar activePage="about" isHome={false} />

      <div className="pt-36 pb-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-12" style={{ fontFamily: "'Anton', sans-serif" }}>ABOUT US</h1>
          <AboutSection />
        </div>
      </div>
    </div>
  );
}
