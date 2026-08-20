import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTransitionNavigate } from '../context/TransitionContext';
import { Sparkles, Camera, Compass, Flame, X, ChevronRight } from 'lucide-react';

/**
 * Realistic iPhone Dynamic Island Camera Lens Detail (Matching User Reference Image)
 */
function CameraLens() {
  return (
    <div className="relative w-4 h-4 rounded-full bg-[#0d0f14] border border-[#1f2430] flex items-center justify-center shadow-inner shrink-0">
      {/* Outer Reflection Ring */}
      <div className="w-3 h-3 rounded-full bg-gradient-to-tr from-[#151b28] via-[#2d3854] to-[#121622] flex items-center justify-center">
        {/* Inner Dark Lens Element */}
        <div className="w-1.5 h-1.5 rounded-full bg-[#050608] relative">
          {/* Blue/Purple Glare Dot */}
          <div className="absolute top-[1px] right-[1px] w-0.5 h-0.5 rounded-full bg-[#708ad4] opacity-80" />
        </div>
      </div>
    </div>
  );
}

export default function DynamicIslandNavbar({ activePath = '/' }) {
  const navigate = useTransitionNavigate();
  const [isScrolling, setIsScrolling] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const scrollTimeoutRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      // Clear any pending decompress timer
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      // If user is scrolled down, activate compressed dynamic island
      if (window.scrollY > 30) {
        setIsScrolling(true);

        // Decompress after user stops scrolling for 2 seconds (if not hovered or expanded)
        scrollTimeoutRef.current = setTimeout(() => {
          setIsScrolling(false);
        }, 2000);
      } else {
        // At top of page, stay as original full navbar
        setIsScrolling(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  const handleNavigate = (path) => {
    navigate(path);
    setIsExpanded(false);
    setIsScrolling(false);
  };

  // Compressed if actively scrolling, hovered, or expanded
  const isCompressed = (isScrolling || isHovered || isExpanded) && typeof window !== 'undefined' && window.scrollY > 30;

  return (
    <div className="hidden md:flex fixed top-0 left-0 right-0 z-[10000] pointer-events-none justify-center">
      {/* 1. ORIGINAL FULL NAVBAR */}
      <motion.nav
        initial={{ opacity: 1, y: 0 }}
        animate={{
          opacity: isCompressed ? 0 : 1,
          y: isCompressed ? -15 : 0,
          pointerEvents: isCompressed ? 'none' : 'auto',
        }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="desktop-nav hidden md:flex justify-center w-full py-8 px-12 items-center"
        style={{ transition: 'none' }}
      >
        <div className="flex items-center gap-8 md:gap-12">
          {/* Left: Links */}
          <div className="nav-left-links flex items-center gap-10 font-sans text-base tracking-[0.15em] text-white font-bold">
            <button
              onClick={() => handleNavigate('/about')}
              className={`hover:opacity-70 transition-opacity duration-300 cursor-pointer ${
                activePath === '/about' ? 'underline decoration-white underline-offset-4 decoration-2' : ''
              }`}
            >
              ABOUT
            </button>
            <button
              onClick={() => handleNavigate('/photography')}
              className={`hover:opacity-70 transition-opacity duration-300 cursor-pointer ${
                activePath === '/photography' ? 'underline decoration-white underline-offset-4 decoration-2' : ''
              }`}
            >
              PHOTOGRAPHY
            </button>
          </div>

          {/* Center: Logo */}
          <div className="nav-logo flex justify-center items-center">
            <button
              onClick={() => handleNavigate('/')}
              className="hover:scale-110 transition-transform duration-300 shrink-0 cursor-pointer"
            >
              <img src="/logo.avif" alt="Logo" className="h-20 w-30" />
            </button>
          </div>

          {/* Right: Links */}
          <div className="nav-right-links flex items-center gap-10 font-sans text-base tracking-[0.15em] text-white font-bold">
            <button
              onClick={() => handleNavigate('/works')}
              className={`hover:opacity-70 transition-opacity duration-300 cursor-pointer ${
                activePath === '/works' ? 'underline decoration-white underline-offset-4 decoration-2' : ''
              }`}
            >
              WORKS
            </button>
            <button
              onClick={() => handleNavigate('/community')}
              className={`hover:opacity-70 transition-opacity duration-300 cursor-pointer ${
                activePath === '/community' ? 'underline decoration-white underline-offset-4 decoration-2' : ''
              }`}
            >
              COMMUNITY
            </button>
          </div>
        </div>
      </motion.nav>

      {/* 2. DYNAMIC ISLAND PILL (SLIDES DOWN AS CIRCLE -> EXPANDS TO PILL -> DECOMPRESSES BACK TO CIRCLE) */}
      <AnimatePresence>
        {isCompressed && (
          <motion.div
            key="dynamic-island-pill"
            initial={{
              y: -60,
              width: 38,
              height: 38,
              borderRadius: 9999,
              opacity: 0,
            }}
            animate={{
              y: 16,
              width: isExpanded ? 360 : 220,
              height: isExpanded ? 'auto' : 38,
              borderRadius: isExpanded ? 32 : 9999,
              opacity: 1,
            }}
            exit={{
              width: 38,
              y: -60,
              opacity: 0,
              transition: {
                width: { type: 'spring', stiffness: 450, damping: 30, duration: 0.22 },
                y: { type: 'spring', stiffness: 450, damping: 30, delay: 0.18 },
                opacity: { duration: 0.18, delay: 0.18 },
              },
            }}
            transition={{
              y: { type: 'spring', stiffness: 480, damping: 30, mass: 0.6 },
              opacity: { duration: 0.15 },
              width: {
                type: 'spring',
                stiffness: 320,
                damping: 25,
                mass: 0.8,
                delay: isExpanded ? 0 : 0.14, // Drops as circle first, then expands to horizontal pill!
              },
              height: { type: 'spring', stiffness: 350, damping: 28 },
            }}
            onMouseEnter={() => {
              setIsHovered(true);
              if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
            }}
            onMouseLeave={() => {
              setIsHovered(false);
              if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
              scrollTimeoutRef.current = setTimeout(() => {
                setIsScrolling(false);
              }, 1500);
            }}
            onClick={() => setIsExpanded(!isExpanded)}
            className={`fixed top-0 pointer-events-auto bg-black text-white shadow-[0_15px_40px_rgba(0,0,0,0.95)] border border-white/10 cursor-pointer overflow-hidden backdrop-blur-2xl transition-colors duration-300 z-[10001] ${
              isExpanded ? 'p-5' : 'flex items-center justify-end pr-2.5'
            }`}
          >
            <AnimatePresence mode="wait">
              {!isExpanded ? (
                /* COMPACT REALISTIC DYNAMIC ISLAND PILL */
                <motion.div
                  key="compact-island-inner"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="w-full h-full flex items-center justify-end"
                >
                  <CameraLens />
                </motion.div>
              ) : (
                /* EXPANDED DYNAMIC ISLAND MENU OVERLAY */
                <motion.div
                  key="expanded-island-inner"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.92 }}
                  transition={{ duration: 0.2 }}
                  className="w-full flex flex-col gap-4 text-white"
                >
                  {/* Header */}
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <div className="flex items-center gap-2.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_#34d399]" />
                      <h4 className="text-xs font-bold font-sans uppercase tracking-wider text-white">EMAD SHAIKH</h4>
                    </div>

                    <div className="flex items-center gap-2">
                      <CameraLens />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsExpanded(false);
                        }}
                        className="w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Quick Nav Links */}
                  <div className="grid grid-cols-2 gap-2 font-mono text-xs">
                    {[
                      { label: 'ABOUT', path: '/about', icon: Sparkles },
                      { label: 'PHOTOGRAPHY', path: '/photography', icon: Camera },
                      { label: 'WORKS', path: '/works', icon: Compass },
                      { label: 'COMMUNITY', path: '/community', icon: Flame },
                    ].map((item) => {
                      const Icon = item.icon;
                      const isActive = activePath === item.path;
                      return (
                        <button
                          key={item.path}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleNavigate(item.path);
                          }}
                          className={`flex items-center justify-between p-2.5 rounded-xl border transition-all duration-300 group cursor-pointer ${
                            isActive
                              ? 'bg-white text-black border-white font-bold'
                              : 'bg-white/5 border-white/10 text-white/90 hover:bg-white/15'
                          }`}
                        >
                          <span className="flex items-center gap-2 tracking-widest text-[10px]">
                            <Icon className={`w-3 h-3 ${isActive ? 'text-black' : 'text-amber-400'}`} />
                            {item.label}
                          </span>
                          <ChevronRight className={`w-3 h-3 opacity-60 group-hover:translate-x-0.5 transition-transform ${isActive ? 'text-black' : 'text-white'}`} />
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
