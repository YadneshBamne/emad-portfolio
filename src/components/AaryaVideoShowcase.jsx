import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ARTISTS = [
  { id: '1', name: 'TYLA', url: 'https://ik.imagekit.io/4no4se4zt/Emad%20Shaikh/tyla%20live%202.mp4' },
  { id: '2', name: 'JASON DERULA', url: 'https://ik.imagekit.io/4no4se4zt/Emad%20Shaikh/jason.mp4' },
  { id: '3', name: 'SHANA', url: 'https://ik.imagekit.io/4no4se4zt/Emad%20Shaikh/Europe%20arc%20final.mov' },
  { id: '4', name: 'WIZKID', url: 'https://ik.imagekit.io/4no4se4zt/Emad%20Shaikh/anuv%20live%20cut.mp4' },
  { id: '5', name: 'AKON', url: 'https://ik.imagekit.io/4no4se4zt/Emad%20Shaikh/akon%20live%20cut.mp4' },
  { id: '6', name: 'SLIMANE', url: 'https://ik.imagekit.io/4no4se4zt/Emad%20Shaikh/tyla%20live%202.mp4' },
];

const AaryaVideoShowcase = () => {
  const [activeArtist, setActiveArtist] = useState(ARTISTS[0]);
  const [hoveredArtist, setHoveredArtist] = useState(null);
  const scrollContainerRef = useRef(null);
  const activeItemRef = useRef(null);

  useEffect(() => {
    // Only scroll if it's a mobile view (using a simple check or just applying it since desktop hides the container)
    // The container is hidden on desktop, so scrollIntoView will safely do nothing or just scroll the hidden container.
    if (activeItemRef.current && scrollContainerRef.current) {
      activeItemRef.current.scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest'
      });
    }
  }, [activeArtist]);

  // The currently displayed artist is the hovered one, falling back to the active one
  const displayArtist = hoveredArtist || activeArtist;

  return (
    <section className="w-full h-screen bg-black overflow-hidden flex flex-col md:flex-row text-white font-sans">
      
      {/* Left Column (25%) */}
      <div className="w-full md:w-[25%] h-full flex flex-col justify-between p-8 md:p-12 relative z-10">
        
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
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="text-8xl font-black uppercase leading-none"
                style={{ fontFamily: "'Anton', 'Impact', sans-serif" }}
              >
                {displayArtist.name.split(' ').map((word, i) => (
                  <span key={i} className="block">{word}</span>
                ))}
              </motion.h1>
            </AnimatePresence>
          </div>

          {/* Mobile: Horizontal Scrollable Artist List */}
          <div 
            ref={scrollContainerRef}
            className="md:hidden w-full flex overflow-x-auto gap-8 items-end pb-2 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
          >
            {ARTISTS.map((artist) => {
              const isActive = activeArtist.id === artist.id;
              return (
                <button
                  key={artist.id}
                  ref={isActive ? activeItemRef : null}
                  onClick={() => setActiveArtist(artist)}
                  className={`snap-center shrink-0 text-6xl font-black uppercase leading-none transition-colors ${
                    isActive ? 'text-white' : 'text-zinc-800'
                  }`}
                  style={{ fontFamily: "'Anton', 'Impact', sans-serif" }}
                >
                  {artist.name.split(' ').map((word, i) => (
                    <span key={i} className="block text-left">{word}</span>
                  ))}
                </button>
              );
            })}
            {/* Spacer for right padding in scroll area */}
            <div className="w-4 shrink-0"></div>
          </div>
          
          <button className="flex items-center gap-2 text-xs font-mono tracking-widest text-red-600 hover:text-white transition-colors uppercase w-fit group">
            <span className="w-4 h-[1px] bg-red-600 group-hover:bg-white transition-colors"></span>
            View All Films
          </button>
        </div>
      </div>

      {/* Center Column (40%) */}
      <div className="w-full md:w-[40%] h-full flex items-center justify-center p-4 md:p-0 relative z-0">
        <div className="relative w-full max-w-[400px] aspect-[9/16] overflow-hidden bg-zinc-900 shadow-2xl">
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
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            </motion.div>
          </AnimatePresence>
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
                className="relative group w-fit focus:outline-none pr-8 py-1"
                aria-label={`Select ${artist.name}`}
              >
                <motion.span
                  animate={{
                    color: isHighlighted ? '#FFFFFF' : '#52525B', // zinc-600
                    scale: isHighlighted ? 1.1 : 1,
                  }}
                  transition={{ duration: 0.3 }}
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
