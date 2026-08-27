import React from 'react';
import ScrollReveal from './ui/ScrollReveal';

const AboutSection = () => {
  return (
    <section className="w-full bg-black text-white py-16 px-4 md:px-8 font-sans">
      {/* Top Header */}
      <div className="flex justify-between items-start text-[10px] md:text-xs font-mono tracking-[0.2em] mb-6 uppercase">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-4">
            <span className="text-red-600 font-bold">03</span>
            <span className="w-12 md:w-16 h-[1px] bg-zinc-600"></span>
            <span className="text-zinc-400">ABOUT</span>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse"></span>
            <span className="text-red-600">REC · 24.976</span>
          </div>
        </div>
        
        <div className="flex flex-col items-end gap-2">
          <div className="text-zinc-400 text-right">
            EMAD SHAIKH — PHOTOGRAPHER · VIDEOGRAPHER · CREATIVE
          </div>
          <div className="text-zinc-500 mt-2">
            03 / 08
          </div>
        </div>
      </div>

      {/* Video Container */}
      <div className="relative w-full aspect-[21/9] md:aspect-[2.35/1] max-h-[55vh] bg-zinc-900 border border-zinc-800 rounded-sm overflow-hidden mb-6 group cursor-pointer">
        {/* Actual Video Element */}
        <div className="absolute inset-0 w-full h-full">
          <video 
            src="https://www.pexels.com/download/video/19070096/" 
            className="w-full h-full object-cover"
            autoPlay 
            loop 
            muted 
            playsInline
          />
        </div>
        
        {/* Bottom Left Text Over Video */}
        <div className="about-video-overlay-text absolute bottom-0 left-0 p-6 md:p-12 z-10 bg-gradient-to-t from-black/80 via-black/40 to-transparent w-full pointer-events-none">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-4 drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)] !text-white" style={{ fontFamily: "'Anton', sans-serif", color: '#ffffff' }}>
            EMAD<br />SHAIKH
          </h1>
          <p className="font-mono text-[10px] md:text-xs tracking-[0.2em] !text-zinc-200 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]" style={{ color: '#e4e4e7' }}>
            PHOTOGRAPHER · VIDEOGRAPHER · CREATIVE
          </p>
        </div>
      </div>

      {/* Glowing Red Divider */}
      <div className="w-full h-[2px] bg-red-600 shadow-[0_0_15px_rgba(220,38,38,0.8)] mb-16"></div>

      {/* Content Section */}
      <div className="max-w-4xl">
        <ScrollReveal
          baseOpacity={0.05}
          enableBlur={true}
          baseRotation={2}
          blurStrength={10}
          containerClassName="mb-8"
          textClassName="text-2xl md:text-4xl lg:text-5xl text-zinc-200 leading-tight font-serif font-normal"
        >
          Concert photographer, videographer, and music marketing creative — with a unique blend of visual storytelling and industry expertise.
        </ScrollReveal>
        
        <ScrollReveal
          baseOpacity={0.05}
          enableBlur={true}
          baseRotation={1.5}
          blurStrength={6}
          containerClassName="mb-12 max-w-2xl"
          textClassName="text-zinc-400 text-sm md:text-base leading-relaxed font-serif font-normal"
        >
          Published in Billboard and Variety Magazine. Touring experience with multiple artists. Media credentials at major festivals across North America. Worked with Warner Music and Atlantic Records.
        </ScrollReveal>

        {/* Subtle Divider */}
        <div className="w-64 h-[1px] bg-zinc-800 mb-8"></div>

        {/* Columns */}
        <div className="flex flex-col md:flex-row gap-12 md:gap-32 font-mono text-xs tracking-widest">
          {/* Column 1 */}
          <div className="flex flex-col gap-3">
            <span className="text-red-600 mb-1">PUBLISHED IN</span>
            <span className="text-zinc-300">BILLBOARD</span>
            <span className="text-zinc-300">VARIETY MAGAZINE</span>
          </div>

          {/* Column 2 */}
          <div className="flex flex-col gap-3">
            <span className="text-red-600 mb-1">LABELS</span>
            <span className="text-zinc-300">WARNER MUSIC</span>
            <span className="text-zinc-300">ATLANTIC RECORDS</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
