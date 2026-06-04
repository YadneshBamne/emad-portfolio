import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

const PHOTO_ITEMS = [
  {
    id: 1,
    src: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=1200',
    code: 'N · 0 0 1',
    orientation: 'portrait'
  },
  {
    id: 2,
    src: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=1200',
    code: 'N · 0 1 7',
    orientation: 'portrait'
  },
  {
    id: 3,
    src: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?q=80&w=1200',
    code: 'N · 8 6 6',
    orientation: 'landscape'
  },
  {
    id: 4,
    src: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1200',
    code: 'N · 5 1 2',
    orientation: 'landscape'
  },
  {
    id: 5,
    src: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1200',
    code: 'N · 1 1 8',
    orientation: 'portrait'
  },
  {
    id: 6,
    src: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1200',
    code: 'N · 2 0 4',
    orientation: 'portrait'
  },
  {
    id: 7,
    src: 'https://images.unsplash.com/photo-1487180142328-054b783fc471?q=80&w=1200',
    code: 'N · 7 7 4',
    orientation: 'portrait'
  },
  {
    id: 8,
    src: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=1200',
    code: 'N · 7 0 3',
    orientation: 'landscape'
  },
  {
    id: 9,
    src: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=1200',
    code: 'N · 9 9 1',
    orientation: 'landscape'
  },
  {
    id: 10,
    src: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1200',
    code: 'N · 3 4 1',
    orientation: 'landscape'
  },
  {
    id: 11,
    src: 'https://images.unsplash.com/photo-1482440308425-276ad0f28b19?q=80&w=1200',
    code: 'N · 6 0 5',
    orientation: 'landscape'
  },
  {
    id: 12,
    src: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?q=80&w=1200',
    code: 'N · 4 8 2',
    orientation: 'portrait'
  }
];

// Physical tilt styles to look like laid-out prints
const TILTS = [
  'rotate-[0.6deg]',
  'rotate-[-1.5deg]',
  'rotate-[0.8deg]',
  'rotate-[-1.0deg]',
  'rotate-[1.2deg]',
  'rotate-[-1.2deg]',
  'rotate-[0.5deg]'
];

const PolaroidCard = ({ item, index }) => {
  const cardRef = useRef(null);
  const tiltClass = TILTS[index % TILTS.length];
  
  // Interactive 3D mouse movement states
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30, mass: 2 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30, mass: 2 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["30deg", "-30deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-30deg", "30deg"]);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = (mouseX / rect.width) - 0.5;
    const yPct = (mouseY / rect.height) - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  // Apply strict aspect ratios (9:16 for portrait, 16:9 for landscape)
  const imageAspect = item.orientation === 'portrait'
    ? 'aspect-[9/16]'
    : 'aspect-[16/9]';

  // Alternate layer depth to mimic stacked layout cards
  const zIndexClass = index % 2 === 0 ? 'z-10' : 'z-20';

  return (
    <motion.div 
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`w-full max-w-[420px] md:max-w-none mb-10 break-inside-avoid flex items-center justify-center transition-all group ${zIndexClass} ${tiltClass}`}
      style={{
        transformStyle: 'preserve-3d',
        perspective: '800px',
        rotateX,
        rotateY
      }}
    >
      {/* _frame Container */}
      <div 
        className="bg-[#f4f2eb] p-[3.5%] pb-[5.5%] shadow-[0_15px_40px_rgba(0,0,0,0.65)] hover:shadow-[0_28px_70px_rgba(0,0,0,0.9)] rounded-sm w-full flex flex-col cursor-pointer relative _frame_9l0vv_47 _revealed_9l0vv_81"
        style={{ 
          transition: 'box-shadow 400ms',
          willChange: 'transform'
        }}
      >
        {/* _photoWrap Container */}
        <div className={`relative w-full ${imageAspect} bg-zinc-950 overflow-hidden shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)] _photoWrap_9l0vv_87`}>
          {/* _shimmer Loading animation */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-[shimmer_2.5s_infinite] z-10 pointer-events-none _shimmer_9l0vv_95 _shimmerOut_9l0vv_114" />
          
          <img
            src={item.src}
            alt=""
            loading="eager"
            decoding="async"
            fetchpriority="high"
            className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.02] _photo_9l0vv_87 _photoIn_9l0vv_127"
            draggable="false"
          />
        </div>
        
        {/* _strip Bottom Caption container */}
        <div className="mt-3 flex items-center justify-center select-none pointer-events-none _strip_9l0vv_145">
          <span 
            className="text-[#1a1a1a]/85 font-mono text-[10px] sm:text-[11px] font-bold tracking-[0.25em] block text-center _caption_9l0vv_152"
            style={{ fontFamily: "'Space Mono', monospace" }}
          >
            {item.code}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default function PhotographyPage() {
  const navigate = useNavigate();

  return (
    <div className="w-full min-h-screen bg-black text-white relative select-none overflow-x-hidden overflow-y-auto">
      
      {/* GLOBAL HUD NAVIGATION OVERLAY (Positioned fixed with mix-blend-difference) */}
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
          GALLERY FEED // RAW DATABASE
        </div>

        {/* Global links */}
        <div className="flex items-center gap-8 font-mono text-[10px] font-bold tracking-widest pointer-events-auto">
          <button onClick={() => navigate('/')} className="hover:opacity-75 cursor-pointer transition-opacity">HOME</button>
          <button onClick={() => navigate('/photography')} className="underline decoration-white underline-offset-4 cursor-pointer">PHOTOGRAPHY</button>
          <button onClick={() => navigate('/works')} className="hover:opacity-75 cursor-pointer transition-opacity">WORKS</button>
          <button onClick={() => navigate('/about')} className="hover:opacity-75 cursor-pointer transition-opacity">ABOUT</button>
        </div>

      </header>

      {/* VERTICAL MASONRY FEED */}
      <main className="w-full relative z-10 pt-36 pb-32 px-3 sm:px-4 md:px-5">
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 md:gap-8 [column-fill:balance]">
          {PHOTO_ITEMS.map((item, idx) => (
            <PolaroidCard
              key={item.id}
              item={item}
              index={idx}
            />
          ))}
        </div>
      </main>

      {/* Background sensor layout grids (Fixed to viewport) */}
      <div className="fixed inset-0 bg-page-sensor-grid opacity-10 pointer-events-none z-0" />

      {/* Embedded SVG grid blueprint styles */}
      <style dangerouslySetInnerHTML={{
        __html: `
        .bg-page-sensor-grid {
          background-size: 80px 80px;
          background-image: 
            linear-gradient(to right, rgba(255, 255, 255, 0.02) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.02) 1px, transparent 1px);
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}} />

    </div>
  );
}
