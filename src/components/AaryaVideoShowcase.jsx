import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

const ARTISTS = [
  { id: '1', name: 'TYLA', url: 'https://ik.imagekit.io/4no4se4zt/Emad%20Shaikh/tyla%20live%202.mp4' },
  { id: '2', name: 'JASON DERULA', url: 'https://ik.imagekit.io/4no4se4zt/Emad%20Shaikh/jason.mp4' },
  { id: '3', name: 'SHANA', url: 'https://ik.imagekit.io/4no4se4zt/Emad%20Shaikh/Europe%20arc%20final.mov' },
  { id: '4', name: 'WIZKID', url: 'https://ik.imagekit.io/4no4se4zt/Emad%20Shaikh/anuv%20live%20cut.mp4' },
  { id: '5', name: 'AKON', url: 'https://ik.imagekit.io/4no4se4zt/Emad%20Shaikh/akon%20live%20cut.mp4' },
  { id: '6', name: 'SLIMANE', url: 'https://ik.imagekit.io/4no4se4zt/Emad%20Shaikh/tyla%20live%202.mp4' },
];

const AaryaVideoShowcase = () => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const [activeArtist, setActiveArtist] = useState(ARTISTS[0]);
  const [hoveredArtist, setHoveredArtist] = useState(null);
  const scrollContainerRef = useRef(null);
  const itemRefs = useRef({});
  const isProgrammaticScroll = useRef(false);
  const scrollTimeoutRef = useRef(null);

  const isInitialMount = useRef(true);

  // Center an artist in the mobile reel container
  const scrollToArtist = (artist, smooth = true) => {
    const container = scrollContainerRef.current;
    const item = itemRefs.current[artist.id];
    if (container && item) {
      isProgrammaticScroll.current = true;
      const targetScroll = item.offsetLeft - (container.clientWidth / 2) + (item.offsetWidth / 2);
      
      container.scrollTo({
        left: targetScroll,
        behavior: smooth ? 'smooth' : 'auto'
      });

      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
      scrollTimeoutRef.current = setTimeout(() => {
        isProgrammaticScroll.current = false;
      }, smooth ? 450 : 50);
    }
  };

  // Scroll to active artist on initial mount or when active artist changes from desktop
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      // Slight delay to ensure DOM dimensions are ready
      const t = setTimeout(() => {
        scrollToArtist(activeArtist, false);
      }, 100);
      return () => clearTimeout(t);
    } else if (!isProgrammaticScroll.current) {
      scrollToArtist(activeArtist, true);
    }
  }, [activeArtist]);

  // Handle user scroll on mobile: whichever item is closest to middle becomes active
  const handleScroll = () => {
    if (isProgrammaticScroll.current || !scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const containerCenter = container.scrollLeft + (container.clientWidth / 2);

    let closestArtist = activeArtist;
    let minDistance = Infinity;

    ARTISTS.forEach((artist) => {
      const el = itemRefs.current[artist.id];
      if (el) {
        const itemCenter = el.offsetLeft + (el.offsetWidth / 2);
        const distance = Math.abs(containerCenter - itemCenter);
        if (distance < minDistance) {
          minDistance = distance;
          closestArtist = artist;
        }
      }
    });

    if (closestArtist && closestArtist.id !== activeArtist.id) {
      setActiveArtist(closestArtist);
    }
  };

  // The currently displayed artist is the hovered one, falling back to the active one
  const displayArtist = hoveredArtist || activeArtist;

  return (
    <section className="w-full h-screen bg-black overflow-hidden flex flex-col md:flex-row text-white font-sans">
      
      {/* Left Column (25%) */}
      <div className="w-full md:w-[25%] h-auto md:h-full flex flex-col justify-between gap-8 md:gap-0 p-4 md:p-12 relative z-10">
        
        {/* Top Left Details */}
        <div className="flex flex-col gap-2 font-mono text-xs tracking-[0.2em] uppercase">
          <div className="flex items-center gap-4">
            <span className="text-red-600 font-bold">04</span>
            <span className="w-8 h-[1px] bg-zinc-700"></span>
            <span className="text-zinc-400">FILM</span>
          </div>
          <div className="flex items-center gap-2 mt-4">
            <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
            <span className="text-red-600">PLAYING</span>
          </div>
        </div>

        {/* Bottom Left Artist Name */}
        <div className="flex flex-col gap-6">
          {/* Desktop: Active Artist Name */}
          <div className="hidden md:flex h-[190px] overflow-hidden relative items-end">
            <AnimatePresence mode="wait">
              <motion.h1
                key={displayArtist.id}
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -40, opacity: 0 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="text-8xl font-black uppercase leading-none"
                style={{ fontFamily: "'Anton', 'Impact', sans-serif", transform: 'translateZ(0)' }}
              >
                {displayArtist.name.split(' ').map((word, i) => (
                  <span key={i} className="block">{word}</span>
                ))}
              </motion.h1>
            </AnimatePresence>
          </div>

          {/* Mobile: Active Artist Name Display */}
          <div className="flex md:hidden h-10 overflow-hidden relative items-end">
            <AnimatePresence mode="wait">
              <motion.h1
                key={displayArtist.id}
                initial={{ y: 25, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -25, opacity: 0 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="text-4xl font-black uppercase leading-none"
                style={{ fontFamily: "'Anton', 'Impact', sans-serif" }}
              >
                {displayArtist.name}
              </motion.h1>
            </AnimatePresence>
          </div>
          
          <button className="flex items-center gap-2 text-xs font-mono tracking-widest text-red-600 hover:text-white transition-colors uppercase w-fit group">
            <span className="w-4 h-[1px] bg-red-600 group-hover:bg-white transition-colors"></span>
            View All Films
          </button>
        </div>
      </div>

      {/* Center Column (40%) */}
      <div className="w-full md:w-[40%] flex-1 md:h-full flex items-center justify-center p-0 relative z-0">
        <div className="relative w-auto h-full max-h-full aspect-[9/16] md:w-full md:max-w-[400px] md:h-auto overflow-hidden bg-zinc-900 shadow-2xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={displayArtist.id}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="absolute inset-0 w-full h-full"
            >
              <video 
                src={displayArtist.url} 
                className="w-full h-full object-cover"
                autoPlay
                loop
                muted
                playsInline
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30"></div>
            </motion.div>
          </AnimatePresence>

          {/* Mobile Overlay: Horizontal Centered Reel Wheel Selector */}
          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black via-black/70 to-transparent pt-12 pb-5 px-2 z-20 md:hidden flex flex-col gap-2.5">
            <div className="text-[9px] font-mono tracking-[0.3em] text-red-500 uppercase text-center opacity-80">
              SELECT DIRECT REEL
            </div>

            {/* Container with Fixed Center Highlight Pill */}
            <div className="relative w-full flex items-center justify-center">
              {/* Fixed Highlight Capsule in the exact Middle */}
              <div className={`pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[130px] h-[34px] rounded-full z-0 backdrop-blur-md ${
                isLight
                  ? 'border border-black/30 bg-black/5 shadow-[0_0_12px_rgba(0,0,0,0.06)]'
                  : 'border border-white/80 bg-white/10 shadow-[0_0_16px_rgba(255,255,255,0.2)]'
              }`} />

              {/* Horizontal Scroll Track */}
              <div 
                ref={scrollContainerRef}
                onScroll={handleScroll}
                className="w-full flex overflow-x-auto gap-4 items-center justify-start py-1 snap-x snap-mandatory relative z-10 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
              >
                {/* Left padding spacer to allow first item to be centered */}
                <div className="w-[calc(50%-65px)] shrink-0 pointer-events-none" />

                {ARTISTS.map((artist) => {
                  const isActive = activeArtist.id === artist.id;
                  return (
                    <button
                      key={artist.id}
                      ref={(el) => (itemRefs.current[artist.id] = el)}
                      onClick={() => {
                        setActiveArtist(artist);
                        scrollToArtist(artist, true);
                      }}
                      className={`snap-center shrink-0 w-[130px] font-mono text-[10px] tracking-[0.2em] font-bold uppercase transition-all duration-300 py-1.5 px-2 text-center rounded-full select-none ${
                        isActive 
                          ? (isLight ? 'text-[#12100e] scale-100 opacity-100 font-black' : 'text-white scale-100 opacity-100 font-black')
                          : (isLight ? 'text-[#8c7b70] scale-95 opacity-60 hover:opacity-95' : 'text-zinc-400 scale-95 opacity-50 hover:opacity-80')
                      }`}
                    >
                      {artist.name}
                    </button>
                  );
                })}

                {/* Right padding spacer to allow last item to be centered */}
                <div className="w-[calc(50%-65px)] shrink-0 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column (35%) */}
      <div className="hidden md:flex w-full md:w-[35%] h-full items-center justify-end p-8 md:p-16 relative z-10">
        <div 
          className="flex flex-col gap-6 text-right w-full items-end"
          onMouseLeave={() => setHoveredArtist(null)}
        >
          {ARTISTS.map((artist) => {
            const isHovered = hoveredArtist?.id === artist.id;
            const isActive = activeArtist.id === artist.id;
            // The item is visually "highlighted" if it's currently hovered, or if nothing is hovered and it's active.
            const isHighlighted = hoveredArtist ? isHovered : isActive;

            return (
              <button
                key={artist.id}
                onClick={() => setActiveArtist(artist)}
                onMouseEnter={() => setHoveredArtist(artist)}
                className="relative group w-fit focus:outline-none pr-8 py-1 cursor-pointer"
                aria-label={`Select ${artist.name}`}
              >
                <motion.span
                  animate={{
                    color: isHighlighted 
                      ? (isLight ? '#12100e' : '#FFFFFF') 
                      : (isLight ? '#8c7b70' : '#52525B'),
                    scale: isHighlighted ? 1.08 : 1,
                  }}
                  transition={{ duration: 0.25 }}
                  className="block text-3xl md:text-5xl font-black uppercase origin-right"
                  style={{ fontFamily: "'Anton', 'Impact', sans-serif" }}
                >
                  {artist.name}
                </motion.span>

                {/* Vertical Right Indicator Line */}
                <div className="absolute top-0 right-0 w-1.5 h-full flex items-center">
                   {isHighlighted && (
                     <motion.div
                       layoutId="verticalActiveLine"
                       transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                       className="w-full h-full bg-red-600 shadow-[0_0_10px_rgba(220,38,38,0.8)]"
                     />
                   )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

    </section>
  );
};

export default AaryaVideoShowcase;
