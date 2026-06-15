import React from 'react';
import ScrollReveal from './ui/ScrollReveal';

const AboutSection = () => {
  return (
    <section className="w-full bg-bg-primary text-text-primary py-16 px-4 md:px-8 font-sans transition-colors duration-500">
      {/* Top Header */}
      <div className="flex justify-between items-start text-[10px] md:text-xs font-mono tracking-[0.2em] mb-6 uppercase">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-4">
            <span className="text-accent-metallic font-bold">03</span>
            <span className="w-12 md:w-16 h-[1px] bg-border-color"></span>
            <span className="text-text-secondary">ABOUT</span>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-metallic animate-pulse"></span>
            <span className="text-accent-metallic">REC · 24.976</span>
          </div>
        </div>
        
        <div className="flex flex-col items-end gap-2">
          <div className="text-text-secondary text-right">
            EMAD SHAIKH — PHOTOGRAPHER · VIDEOGRAPHER · CREATIVE
          </div>
          <div className="text-text-secondary opacity-60 mt-2">
            03 / 08
          </div>
        </div>
      </div>

      {/* Video Container */}
      <div className="relative w-full aspect-[21/9] md:aspect-[2.35/1] max-h-[55vh] bg-bg-secondary border border-border-color rounded-sm overflow-hidden mb-6 group cursor-pointer">
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
        <div className="absolute bottom-0 left-0 p-6 md:p-12 z-10 bg-gradient-to-t from-black/80 to-transparent w-full">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-4 drop-shadow-lg" style={{ fontFamily: "'Anton', sans-serif" }}>
            EMAD<br />SHAIKH
          </h1>
          <p className="font-mono text-[10px] md:text-xs tracking-[0.2em] text-zinc-300 drop-shadow-md">
            PHOTOGRAPHER · VIDEOGRAPHER · CREATIVE
          </p>
        </div>
      </div>

      {/* Glowing Divider */}
      <div className="w-full h-[2px] bg-accent-metallic shadow-[0_0_15px_var(--accent-glow)] mb-16"></div>

      {/* Content Section */}
      <div className="max-w-4xl">
        <ScrollReveal
          baseOpacity={0.05}
          enableBlur={true}
          baseRotation={2}
          blurStrength={10}
          containerClassName="mb-8"
          textClassName="text-2xl md:text-4xl lg:text-5xl text-text-primary leading-tight font-serif font-normal"
        >
          Concert photographer, videographer, and music marketing creative — with a unique blend of visual storytelling and industry expertise.
        </ScrollReveal>
        
        <ScrollReveal
          baseOpacity={0.05}
          enableBlur={true}
          baseRotation={1.5}
          blurStrength={6}
          containerClassName="mb-12 max-w-2xl"
          textClassName="text-text-secondary text-sm md:text-base leading-relaxed font-serif font-normal"
        >
          Published in Billboard and Variety Magazine. Touring experience with multiple artists. Media credentials at major festivals across North America. Worked with Warner Music and Atlantic Records.
        </ScrollReveal>

        {/* Subtle Divider */}
        <div className="w-64 h-[1px] bg-border-color mb-8"></div>

        {/* Columns */}
        <div className="flex flex-col md:flex-row gap-12 md:gap-32 font-mono text-xs tracking-widest">
          {/* Column 1 */}
          <div className="flex flex-col gap-3">
            <span className="text-accent-metallic mb-1">PUBLISHED IN</span>
            <span className="text-text-primary">BILLBOARD</span>
            <span className="text-text-primary">VARIETY MAGAZINE</span>
          </div>

          {/* Column 2 */}
          <div className="flex flex-col gap-3">
            <span className="text-accent-metallic mb-1">LABELS</span>
            <span className="text-text-primary">WARNER MUSIC</span>
            <span className="text-text-primary">ATLANTIC RECORDS</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
