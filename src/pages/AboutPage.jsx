import React from 'react';
import AboutSection from '../components/AboutSection';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl md:text-6xl font-bold mb-12" style={{ fontFamily: "'Anton', sans-serif" }}>ABOUT US</h1>
        <AboutSection />
      </div>
    </div>
  );
}
