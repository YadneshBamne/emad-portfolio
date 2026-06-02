import React from 'react';
import DensePolaroidGrid from '../components/DensePolaroidGrid';

export default function PhotographyPage() {
  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-12 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 mb-8">
        <h1 className="text-4xl md:text-6xl font-bold uppercase tracking-tighter" style={{ fontFamily: "'Anton', sans-serif" }}>Photography</h1>
        <p className="text-zinc-400 font-mono text-sm tracking-widest mt-2 uppercase">Capturing the moment</p>
      </div>
      <div className="w-full">
        <DensePolaroidGrid />
      </div>
    </div>
  );
}
