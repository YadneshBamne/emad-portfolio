import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import OrbitImages from './OrbitImages';

const images = [
  "https://picsum.photos/300/300?grayscale&random=1",
  "https://picsum.photos/300/300?grayscale&random=2",
  "https://picsum.photos/300/300?grayscale&random=3",
  "https://picsum.photos/300/300?grayscale&random=4",
  "https://picsum.photos/300/300?grayscale&random=5",
  "https://picsum.photos/300/300?grayscale&random=6",
];

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

  // Adjust alignment class based on prop to keep text from jumping
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

export default function Preloader({ children }) {
  const [progress, setProgress] = useState(0);
  const [loadingComplete, setLoadingComplete] = useState(false);
  const [showContent, setShowContent] = useState(() => {
    // Skip preloader if not on the home page
    return window.location.pathname !== '/';
  });

  useEffect(() => {
    if (showContent) return; // Don't run animation if we're skipping
    
    let currentProgress = 0;
    let lastTime = performance.now();
    let animationFrameId;

    const updateProgress = (time) => {
      const deltaTime = time - lastTime;
      lastTime = time;
      
      const increment = 15 * (deltaTime / 1000); 

      currentProgress = Math.min(currentProgress + increment, 100);
      setProgress(currentProgress);

      if (currentProgress < 100) {
        animationFrameId = requestAnimationFrame(updateProgress);
      }
    };

    animationFrameId = requestAnimationFrame(updateProgress);

    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  useEffect(() => {
    if (progress === 100) {
      setTimeout(() => {
        setLoadingComplete(true);
        setTimeout(() => setShowContent(true), 1000);
      }, 800);
    }
  }, [progress]);

  if (showContent) {
    return <>{children}</>;
  }

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center bg-[#000000] transition-opacity duration-1000 ${loadingComplete ? 'opacity-0' : 'opacity-100'} overflow-hidden`}>
      {/* Noise overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.15] mix-blend-overlay z-20"
        style={{
          backgroundImage: `url('data:image/svg+xml;utf8,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')`
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
      
      <div className="relative w-full max-w-[800px] h-[500px] flex items-center justify-center px-4 z-10">
        
        {/* Intact Main Orbit with larger mobile scaling */}
        <div 
          className="absolute inset-0 w-full h-full pointer-events-none flex items-center justify-center scale-[1.65] md:scale-100"
        >
          <OrbitImages
            images={images}
            shape="ellipse"
            radiusX={340}
            radiusY={80}
            rotation={-8}
            duration={30}
            itemSize={80}
            showPath={true}
            pathColor="rgba(255,255,255,0.2)"
            responsive={true}
            className="w-full"
            absorbingProgress={0}
          />
        </div>

        {/* Center Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-white/60 text-sm font-light tracking-[0.2em]" style={{ fontVariantNumeric: 'tabular-nums' }}>
            {Math.round(progress)}%
          </span>
        </div>
        
      </div>
    </div>
  );
}
