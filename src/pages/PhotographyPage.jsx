import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTransitionNavigate } from '../context/TransitionContext';
import { AaryaNavigationDrawer } from '../components/AaryaNavigationDrawer';
import DynamicIslandNavbar from '../components/DynamicIslandNavbar';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';

const PHOTO_ITEMS = [
  {
    id: 1,
    src: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=1200',
    code: 'N · 0 0 1',
    orientation: 'portrait',
    aperture: 'f/1.4',
    shutter: '1/250s',
    iso: '1600',
    lens: '85MM GM'
  },
  {
    id: 2,
    src: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=1200',
    code: 'N · 0 1 7',
    orientation: 'portrait',
    aperture: 'f/1.2',
    shutter: '1/200s',
    iso: '6400',
    lens: '50MM APD'
  },
  {
    id: 3,
    src: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?q=80&w=1200',
    code: 'N · 8 6 6',
    orientation: 'landscape',
    aperture: 'f/2.8',
    shutter: '1/160s',
    iso: '3200',
    lens: '70-200MM GM'
  },
  {
    id: 4,
    src: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1200',
    code: 'N · 5 1 2',
    orientation: 'landscape',
    aperture: 'f/1.8',
    shutter: '1/500s',
    iso: '800',
    lens: '135MM F1.8'
  },
  {
    id: 5,
    src: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1200',
    code: 'N · 1 1 8',
    orientation: 'portrait',
    aperture: 'f/1.4',
    shutter: '1/320s',
    iso: '2000',
    lens: '35MM GM'
  },
  {
    id: 6,
    src: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1200',
    code: 'N · 2 0 4',
    orientation: 'portrait',
    aperture: 'f/1.2',
    shutter: '1/250s',
    iso: '4000',
    lens: '50MM GM'
  },
  {
    id: 7,
    src: 'https://images.unsplash.com/photo-1487180142328-054b783fc471?q=80&w=1200',
    code: 'N · 7 7 4',
    orientation: 'portrait',
    aperture: 'f/1.8',
    shutter: '1/125s',
    iso: '1600',
    lens: '85MM F1.8'
  },
  {
    id: 8,
    src: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=1200',
    code: 'N · 7 0 3',
    orientation: 'landscape',
    aperture: 'f/2.8',
    shutter: '1/200s',
    iso: '3200',
    lens: '24-70MM GM'
  },
  {
    id: 9,
    src: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=1200',
    code: 'N · 9 9 1',
    orientation: 'landscape',
    aperture: 'f/2.0',
    shutter: '1/400s',
    iso: '1600',
    lens: '50MM F2.0'
  },
  {
    id: 10,
    src: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1200',
    code: 'N · 3 4 1',
    orientation: 'landscape',
    aperture: 'f/1.4',
    shutter: '1/160s',
    iso: '6400',
    lens: '85MM GM'
  },
  {
    id: 11,
    src: 'https://images.unsplash.com/photo-1482440308425-276ad0f28b19?q=80&w=1200',
    code: 'N · 6 0 5',
    orientation: 'landscape',
    aperture: 'f/2.8',
    shutter: '1/250s',
    iso: '800',
    lens: '70-200MM GM'
  },
  {
    id: 12,
    src: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?q=80&w=1200',
    code: 'N · 4 8 2',
    orientation: 'portrait',
    aperture: 'f/1.2',
    shutter: '1/500s',
    iso: '3200',
    lens: '50MM GM'
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

const PolaroidCard = ({ item, index, onSelect }) => {
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
      onClick={onSelect}
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
        className="bg-[#f4f2eb] p-[3.5%] pb-[5.5%] shadow-[0_15px_40px_rgba(0,0,0,0.65)] hover:shadow-[0_28px_70px_rgba(0,0,0,0.9)] rounded-sm w-full flex flex-col cursor-pointer relative"
        style={{ 
          transition: 'box-shadow 400ms',
          willChange: 'transform'
        }}
      >
        {/* _photoWrap Container */}
        <div className={`relative w-full ${imageAspect} bg-zinc-950 overflow-hidden shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)]`}>
          {/* _shimmer Loading animation */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-[shimmer_2.5s_infinite] z-10 pointer-events-none" />
          
          <img
            src={item.src}
            alt=""
            loading="eager"
            decoding="async"
            fetchpriority="high"
            className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.02]"
            draggable="false"
          />
        </div>
        
        {/* _strip Bottom Caption container */}
        <div className="mt-3 flex items-center justify-center select-none pointer-events-none">
          <span 
            className="text-[#1a1a1a]/85 font-mono text-[10px] sm:text-[11px] font-bold tracking-[0.25em] block text-center"
            style={{ fontFamily: "'Space Mono', monospace" }}
          >
            {item.code}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

// Springy horizontal slide transition variants
const slideVariants = {
  enter: (direction) => ({
    x: direction > 0 ? '120%' : direction < 0 ? '-120%' : 0,
    opacity: 0,
    scale: 0.98,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
    transition: {
      x: { type: 'spring', stiffness: 280, damping: 28 },
      opacity: { duration: 0.28 },
      scale: { duration: 0.28 }
    }
  },
  exit: (direction) => ({
    x: direction < 0 ? '120%' : direction > 0 ? '-120%' : 0,
    opacity: 0,
    scale: 0.98,
    transition: {
      x: { type: 'spring', stiffness: 280, damping: 28 },
      opacity: { duration: 0.22 },
      scale: { duration: 0.22 }
    }
  })
};

export default function PhotographyPage() {
  const navigate = useTransitionNavigate();
  const [activePhotoIndex, setActivePhotoIndex] = useState(null);
  const [direction, setDirection] = useState(0);

  // Swipe gesture refs and handlers for mobile touch support
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const handleTouchStart = (e) => {
    touchStartX.current = e.targetTouches[0].clientX;
    touchEndX.current = e.targetTouches[0].clientX; // Reset end position on start
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    const swipeThreshold = 50; // Minimum swipe distance in px
    const diff = touchStartX.current - touchEndX.current;

    if (diff > swipeThreshold) {
      // Swiped left -> next photo
      setDirection(1);
      setActivePhotoIndex((prev) => (prev + 1) % PHOTO_ITEMS.length);
    } else if (diff < -swipeThreshold) {
      // Swiped right -> prev photo
      setDirection(-1);
      setActivePhotoIndex((prev) => (prev - 1 + PHOTO_ITEMS.length) % PHOTO_ITEMS.length);
    }
  };

  // Keyboard navigation for full screen view
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (activePhotoIndex === null) return;
      if (e.key === 'Escape') {
        setActivePhotoIndex(null);
      } else if (e.key === 'ArrowRight') {
        setDirection(1);
        setActivePhotoIndex((prev) => (prev + 1) % PHOTO_ITEMS.length);
      } else if (e.key === 'ArrowLeft') {
        setDirection(-1);
        setActivePhotoIndex((prev) => (prev - 1 + PHOTO_ITEMS.length) % PHOTO_ITEMS.length);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activePhotoIndex]);

  const handlePrev = (e) => {
    e.stopPropagation();
    setDirection(-1);
    setActivePhotoIndex((prev) => (prev - 1 + PHOTO_ITEMS.length) % PHOTO_ITEMS.length);
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setDirection(1);
    setActivePhotoIndex((prev) => (prev + 1) % PHOTO_ITEMS.length);
  };

  return (
    <div className="w-full min-h-screen bg-black text-white relative select-none overflow-x-hidden overflow-y-auto">
      
      {/* GLOBAL HUD NAVIGATION OVERLAY */}
      <header className={`fixed top-0 left-0 w-full h-18 px-6 sm:px-10 z-50 pointer-events-none text-white bg-transparent transition-opacity duration-300 ${activePhotoIndex !== null ? 'opacity-0' : 'opacity-100'}`}>
        
        {/* Global Slide-Out Navigation (Framer Motion) - Mobile Only */}
        <div className="block md:hidden">
          <AaryaNavigationDrawer />
        </div>

        {/* Dynamic Island Navigation Bar */}
        <DynamicIslandNavbar activePath="/photography" />

      </header>

      {/* VERTICAL MASONRY FEED */}
      <main className="w-full relative z-10 pt-36 pb-32 px-3 sm:px-4 md:px-5">
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 md:gap-8 [column-fill:balance]">
          {PHOTO_ITEMS.map((item, idx) => (
            <PolaroidCard
              key={item.id}
              item={item}
              index={idx}
              onSelect={() => setActivePhotoIndex(idx)}
            />
          ))}
        </div>
      </main>

      {/* INTERACTIVE FULL-SCREEN LIGHTBOX MODAL */}
      <AnimatePresence>
        {activePhotoIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100000] bg-black/95 flex flex-col justify-between overflow-hidden"
            onClick={() => setActivePhotoIndex(null)}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {/* Background 3-column collage (dimmed & blurred) */}
            <div className="absolute inset-0 z-0 flex pointer-events-none opacity-30 select-none">
              {/* Left Column: Previous image */}
              <div className="w-1/3 h-full overflow-hidden border-r border-white/5 opacity-30 blur-md scale-105">
                <img 
                  src={PHOTO_ITEMS[(activePhotoIndex - 1 + PHOTO_ITEMS.length) % PHOTO_ITEMS.length].src}
                  className="w-full h-full object-cover"
                  alt=""
                />
              </div>
              {/* Center Column: Current active image */}
              <div className="w-1/3 h-full overflow-hidden border-r border-white/5 opacity-15 blur-lg scale-110">
                <img 
                  src={PHOTO_ITEMS[activePhotoIndex].src}
                  className="w-full h-full object-cover"
                  alt=""
                />
              </div>
              {/* Right Column: Next image */}
              <div className="w-1/3 h-full overflow-hidden opacity-30 blur-md scale-105">
                <img 
                  src={PHOTO_ITEMS[(activePhotoIndex + 1) % PHOTO_ITEMS.length].src}
                  className="w-full h-full object-cover"
                  alt=""
                />
              </div>
            </div>

            {/* Top row controls */}
            <div 
              className="w-full px-4 py-4 sm:px-10 flex justify-between items-center z-20 relative"
              onClick={(e) => e.stopPropagation()}
            >
              <span className="font-mono text-[10px] tracking-[0.25em] text-white/50 select-none">
                {(activePhotoIndex + 1).toString().padStart(2, '0')} / {PHOTO_ITEMS.length.toString().padStart(2, '0')}
              </span>
              <button 
                onClick={() => setActivePhotoIndex(null)}
                className="text-white/60 hover:text-white font-mono text-[10px] font-bold tracking-[0.22em] cursor-pointer hover:opacity-85 transition-all uppercase"
              >
                CLOSE // [ESC]
              </button>
            </div>

            {/* Middle viewport: Left Arrow, Polaroid, Right Arrow */}
            <div className="flex-1 min-h-0 w-full max-w-7xl mx-auto flex items-center justify-center sm:justify-between px-4 sm:px-8 z-20 relative">
              
              {/* Left navigation trigger - hidden on phone viewports */}
              <button 
                onClick={handlePrev}
                className="hidden sm:flex w-12 h-12 items-center justify-center rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 text-white cursor-pointer transition-all hover:scale-105 select-none"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>

              {/* Active Polaroid display */}
              <div className="relative flex-1 h-full min-h-0 flex items-center justify-center overflow-hidden">
                <AnimatePresence initial={false} custom={direction} mode="popLayout">
                  <motion.div 
                    key={activePhotoIndex}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    className={`flex flex-col items-center justify-center select-none ${
                      PHOTO_ITEMS[activePhotoIndex].orientation === 'portrait' 
                        ? 'w-[32vh] max-w-[65vw] sm:w-[35vh] md:w-[38vh]' 
                        : 'w-[58vh] max-w-[78vw] sm:w-[64vh] md:w-[70vh]'
                    }`}
                    onClick={(e) => e.stopPropagation()} // Don't close when clicking inside the card
                  >
                    {/* Polaroid Frame */}
                    <div className="bg-[#f4f2eb] p-[3.5%] pb-[5.5%] shadow-[0_30px_70px_rgba(0,0,0,0.9)] rounded-sm w-full flex flex-col relative select-none">
                      <div className={`relative w-full ${PHOTO_ITEMS[activePhotoIndex].orientation === 'portrait' ? 'aspect-[9/16]' : 'aspect-[16/9]'} bg-zinc-950 overflow-hidden shadow-[inset_0_2px_10px_rgba(0,0,0,0.6)]`}>
                        <img
                          src={PHOTO_ITEMS[activePhotoIndex].src}
                          className="w-full h-full object-cover"
                          alt=""
                          draggable="false"
                        />
                      </div>
                      {/* Polaroid caption code */}
                      <div className="mt-3 flex items-center justify-center select-none pointer-events-none">
                        <span className="text-[#1a1a1a]/85 font-mono text-[10px] sm:text-[11px] font-bold tracking-[0.25em] block text-center" style={{ fontFamily: "'Space Mono', monospace" }}>
                          {PHOTO_ITEMS[activePhotoIndex].code}
                        </span>
                      </div>
                    </div>

                    {/* Camera metadata text row below polaroid card */}
                    <div className="mt-4 sm:mt-6 text-center font-mono text-[7.5px] sm:text-[9px] md:text-[10px] text-white/50 tracking-[0.12em] sm:tracking-[0.25em] uppercase select-none px-4 max-w-full leading-relaxed break-words">
                      <span className="inline-block">{PHOTO_ITEMS[activePhotoIndex].aperture}</span>
                      <span className="mx-1.5 opacity-50">·</span>
                      <span className="inline-block">{PHOTO_ITEMS[activePhotoIndex].shutter}</span>
                      <span className="mx-1.5 opacity-50">·</span>
                      <span className="inline-block">ISO {PHOTO_ITEMS[activePhotoIndex].iso}</span>
                      <span className="mx-1.5 opacity-50">·</span>
                      <span className="inline-block">{PHOTO_ITEMS[activePhotoIndex].lens}</span>
                      <span className="mx-1.5 opacity-50">·</span>
                      <span className="inline-block">{PHOTO_ITEMS[activePhotoIndex].code}</span>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Right navigation trigger - hidden on phone viewports */}
              <button 
                onClick={handleNext}
                className="hidden sm:flex w-12 h-12 items-center justify-center rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 text-white cursor-pointer transition-all hover:scale-105 select-none"
              >
                <ArrowRight className="w-5 h-5" />
              </button>

              {/* Mobile-only overlay arrow triggers aligned to this middle viewport */}
              <div className="absolute inset-x-3 top-1/2 -translate-y-1/2 flex justify-between pointer-events-none z-30 sm:hidden">
                <button 
                  onClick={handlePrev}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-black/50 border border-white/10 text-white cursor-pointer pointer-events-auto active:scale-95 select-none"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <button 
                  onClick={handleNext}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-black/50 border border-white/10 text-white cursor-pointer pointer-events-auto active:scale-95 select-none"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>

            {/* Bottom thumbnail ribbon */}
            <div 
              className="w-full flex-shrink-0 border-t border-white/5 bg-black/45 backdrop-blur-md py-4 z-20 relative flex justify-center overflow-x-auto select-none no-scrollbar"
              onClick={(e) => e.stopPropagation()}
            >
              <div 
                className="flex items-center gap-2 sm:gap-3 px-4 sm:px-6 max-w-full"
                onClick={(e) => e.stopPropagation()} // Don't close modal when clicking on the list container
              >
                {PHOTO_ITEMS.map((item, idx) => (
                  <div 
                    key={item.id}
                    onClick={() => {
                      if (idx === activePhotoIndex) return;
                      setDirection(idx > activePhotoIndex ? 1 : -1);
                      setActivePhotoIndex(idx);
                    }}
                    className={`w-9 h-9 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded overflow-hidden cursor-pointer transition-all duration-300 border-2 shrink-0 ${
                      idx === activePhotoIndex 
                        ? 'border-red-600 scale-105 opacity-100 shadow-[0_0_10px_rgba(239,68,68,0.5)]' 
                        : 'border-transparent opacity-35 hover:opacity-80 hover:scale-102'
                    }`}
                  >
                    <img 
                      src={item.src}
                      className="w-full h-full object-cover"
                      alt=""
                      draggable="false"
                    />
                  </div>
                ))}
              </div>
            </div>

          </motion.div>
        )}
      </AnimatePresence>

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
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />

    </div>
  );
}
