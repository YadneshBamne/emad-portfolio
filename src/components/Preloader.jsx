import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const words1 = ["CINEMATIC", "AESTHETIC", "DYNAMIC", "BEAUTIFUL"];
const words2 = ["ARTISTRY", "MOTION", "DESIGN", "CRAFT"];
const words3 = ["IMMERSIVE", "ELEVATED", "REFINED", "STUNNING"];
const words4 = ["VISION", "EXPERIENCE", "JOURNEY", "CREATIVITY"];

const CyclingWord = ({ words, interval = 2500, offset = 0, align = "center" }) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIndex((prev) => (prev + 1) % words.length);
      const id = setInterval(() => {
        setIndex((prev) => (prev + 1) % words.length);
      }, interval);
      return () => clearInterval(id);
    }, offset);
    return () => clearTimeout(timer);
  }, [words, interval, offset]);

  const alignClass = align === "left" ? "justify-start md:justify-start" : align === "right" ? "justify-end md:justify-end" : "justify-center";

  return (
    <div className={`relative flex items-center ${alignClass} h-4 md:h-5 w-full`}>
      <AnimatePresence>
        <motion.span
          key={words[index]}
          initial={{ opacity: 0, filter: "blur(4px)" }}
          animate={{ opacity: 1, filter: "blur(0px)" }}
          exit={{ opacity: 0, filter: "blur(4px)" }}
          transition={{ duration: 1, ease: "easeInOut" }}
          className="absolute text-white/40 text-[10px] md:text-xs font-light tracking-[0.4em] md:tracking-[0.8em] uppercase whitespace-nowrap"
        >
          {words[index]}
        </motion.span>
      </AnimatePresence>
    </div>
  );
};

const updateBrowserThemeColor = (color) => {
  let metaTheme = document.querySelector('meta[name="theme-color"]');
  if (!metaTheme) {
    metaTheme = document.createElement('meta');
    metaTheme.setAttribute('name', 'theme-color');
    document.head.appendChild(metaTheme);
  }
  metaTheme.setAttribute('content', color);

  const metaTile = document.querySelector('meta[name="msapplication-TileColor"]');
  if (metaTile) {
    metaTile.setAttribute('content', color);
  }

  if (document.body) {
    document.body.style.backgroundColor = color;
  }
  if (document.documentElement) {
    document.documentElement.style.backgroundColor = color;
  }
};

export default function Preloader({ children }) {
  const [progress, setProgress] = useState(0);
  const [loadingComplete, setLoadingComplete] = useState(false);
  const [showContent, setShowContent] = useState(() => {
    // Skip preloader if not on the home page
    return window.location.pathname !== '/';
  });

  useEffect(() => {
    if (showContent) return;
    updateBrowserThemeColor('#0D0D0C');
  }, [showContent]);

  useEffect(() => {
    if (showContent) return; // Don't run animation if we're skipping
    
    const duration = 4000; // Smooth 4-second progress transition
    const startTime = performance.now();
    let animationFrameId;

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progressRatio = Math.min(elapsed / duration, 1);
      
      // Smooth cubic ease-out curve for fluid acceleration and gentle deceleration
      const easedProgress = (1 - Math.pow(1 - progressRatio, 2.5)) * 100;
      const nextVal = Math.min(Math.round(easedProgress), 100);

      // Only update state when integer value changes to maintain 60fps smoothness without dropped frames
      setProgress((prev) => (prev !== nextVal ? nextVal : prev));

      if (progressRatio < 1) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrameId);
  }, [showContent]);

  useEffect(() => {
    if (progress === 100) {
      setTimeout(() => {
        setLoadingComplete(true);
        updateBrowserThemeColor('#050505');
        setTimeout(() => setShowContent(true), 1000);
      }, 300);
    }
  }, [progress]);

  if (showContent) {
    return <>{children}</>;
  }

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center bg-[#0D0D0C] transition-opacity duration-1000 ${loadingComplete ? 'opacity-0' : 'opacity-100'} overflow-hidden`}>
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@100;200;300;400&display=swap');
        
        @keyframes noiseShift {
          0% { transform: translate(0, 0); }
          10% { transform: translate(-1%, -1%); }
          20% { transform: translate(-2%, 1%); }
          30% { transform: translate(1%, -2%); }
          40% { transform: translate(-1%, 3%); }
          50% { transform: translate(-2%, 1%); }
          60% { transform: translate(1%, 2%); }
          70% { transform: translate(3%, -1%); }
          80% { transform: translate(-2%, 1%); }
          90% { transform: translate(1%, 3%); }
          100% { transform: translate(0, 0); }
        }
      `}} />

      {/* Dynamic Animated Film Grain Noise overlay */}
      <div 
        className="absolute pointer-events-none opacity-[0.24] mix-blend-overlay z-20"
        style={{
          width: '120%',
          height: '120%',
          top: '-10%',
          left: '-10%',
          backgroundImage: `url('data:image/svg+xml;utf8,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')`,
          animation: 'noiseShift 0.15s infinite steps(6)'
        }}
      />

      {/* Inspiring Words Background */}
      <div className="absolute inset-0 flex flex-col md:flex-row items-center justify-between py-[12vh] md:py-0 px-0 md:px-24 pointer-events-none z-0">
        <motion.div 
          className="flex flex-col gap-3 md:gap-4 items-center md:items-start w-64"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 2, ease: "easeOut", delay: 0.2 }}
        >
          <CyclingWord words={words1} interval={3000} offset={0} align="center" />
          <CyclingWord words={words2} interval={3000} offset={1500} align="center" />
        </motion.div>

        <motion.div 
          className="flex flex-col gap-3 md:gap-4 items-center md:items-end w-64"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 2, ease: "easeOut", delay: 0.8 }}
        >
          <CyclingWord words={words3} interval={3000} offset={750} align="center" />
          <CyclingWord words={words4} interval={3000} offset={2250} align="center" />
        </motion.div>
      </div>
      
      <div className="relative w-full max-w-[800px] h-[60vh] md:h-[500px] flex items-center justify-center px-4 z-10">
        
        {/* Central Ultra-Smooth Counting Percentage Display */}
        <div className="flex items-center justify-center pointer-events-none select-none">
          <div 
            className="text-white/25 text-[25vw] sm:text-[22vw] md:text-[180px] lg:text-[220px] font-thin tracking-tighter leading-none flex items-baseline"
            style={{ 
              fontFamily: "'Outfit', sans-serif",
              fontWeight: 100,
              transform: 'scaleY(1.3)',
              fontVariantNumeric: 'tabular-nums',
              textShadow: '0 0 30px rgba(255,255,255,0.06)'
            }}
          >
            <span>{progress}</span>
            <span className="text-[0.55em] font-extralight ml-1 opacity-70">%</span>
          </div>
        </div>

      </div>
    </div>
  );
}
