import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

// Sample polaroid data with vertical/portrait orientation (taller aspect ratio) and random signatures
const polaroidItems = [
  { id: 1, src: './ISF-14.jpg', signature: 'Emad' },
  { id: 2, src: './ISF-68.jpg', signature: 'Creative' },
  { id: 3, src: './ISF-172.jpg', signature: 'Design' },
  { id: 4, src: './credits_BARICCI_ES_75-6.jpg', signature: 'Vision' },
  { id: 5, src: './ISF-147.jpg', signature: 'Motion' },
  { id: 6, src: './credits_BARICCI_ES-65.jpg', signature: 'Art' },
  { id: 7, src: './credits_BARICCI_ES-71.jpg', signature: 'Light' },
  { id: 8, src: './credits_BARICCI_ES-75.jpg', signature: 'Moment' },
  { id: 9, src: './ISF-8.jpg', signature: 'Frame' },
  { id: 10, src: './ISF-11.jpg', signature: 'Shot' },
  { id: 11, src: './ISF-16.jpg', signature: 'Reel' },
  { id: 12, src: './ISF-27.jpg', signature: 'Epic' },
  { id: 13, src: './ISF-37.jpg', signature: 'Mood' },
  { id: 14, src: './ISF-52.jpg', signature: 'Focus' },
  { id: 15, src: './ISF-74.jpg', signature: 'Vibe' },
  { id: 16, src: './ISF-136.jpg', signature: 'Soul' },
  { id: 17, src: './ISF-148.jpg', signature: 'Style' },
  { id: 18, src: './ISF-154.jpg', signature: 'Aura' },
];

const PolaroidCard = ({ item }) => {
  const cardRef = useRef(null);

  // Motion values for capturing mouse position
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Springs for smooth animation
  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30, mass: 2 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30, mass: 2 });

  // Interpret mouse position to tilt angles
  // When cursor is at top (yPct = -0.5), we tilt card up (rotateX = 15deg)
  // When cursor is at left (xPct = -0.5), we tilt card left (rotateY = -15deg)
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);
  
  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    
    // Calculate cursor position relative to the element (0 to width/height)
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    // Normalize to percentage from center (-0.5 to 0.5)
    const xPct = (mouseX / rect.width) - 0.5;
    const yPct = (mouseY / rect.height) - 0.5;
    
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  // Randomized rotation for the polaroid text to look handwritten
  const textRotation = Math.sin(item.id * 0.5) * 4;

  // Base rotation and translation for organic, contact-sheet misalignment
  // Slightly reduced for subtle realism without looking too messy
  const baseRotation = (item.id % 3 === 0 ? 1 : item.id % 2 === 0 ? -1 : 0.5) + Math.sin(item.id) * 0.3;
  const baseTranslateX = Math.cos(item.id) * 2;
  const baseTranslateY = Math.sin(item.id * 1.5) * 2;

  return (
    <motion.div
      ref={cardRef}
      className="relative aspect-[3/4] bg-[#faf9f5] overflow-hidden cursor-pointer shadow-[0_4px_12px_rgba(0,0,0,0.15)]"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{ 
        scale: 1.08, 
        zIndex: 50, 
        rotate: 0, 
        x: 0, 
        y: 0,
        boxShadow: "0 30px 60px -15px rgba(0, 0, 0, 0.6)" 
      }}
      initial={{ 
        scale: 1, 
        zIndex: 1, 
        rotate: baseRotation,
        x: baseTranslateX,
        y: baseTranslateY,
      }}
      transition={{ scale: { duration: 0.3 }, boxShadow: { duration: 0.3 }, rotate: { duration: 0.3, ease: 'easeOut' }, x: { duration: 0.3 }, y: { duration: 0.3 } }}
      style={{
        transformStyle: 'preserve-3d',
        perspective: '1000px',
        rotateX,
        rotateY
      }}
    >
      {/* Polaroid Frame Container */}
      <div className="w-full h-full p-[6%] pb-[14%] bg-[#faf9f5] flex flex-col pointer-events-none">
        {/* Photo Area */}
        <div className="relative flex-1 bg-neutral-900 overflow-hidden shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)] bg-black">
          <img
            src={item.src}
            alt={`Polaroid ${item.id}`}
            className="w-full h-full object-cover"
            loading="lazy"
            draggable="false"
          />
        </div>

        {/* Polaroid Text Area */}
        <div className="h-[10%] mt-[2%] flex items-center justify-center">
          <span 
            className="text-black text-2xl font-bold opacity-80"
            style={{
              fontFamily: "'Caveat', cursive",
              transform: `rotate(${textRotation}deg)`,
              display: "inline-block",
              fontSize: "clamp(1rem, 1.8vw, 2.2rem)"
            }}
          >
            {item.signature}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

const AaryaPolaroidGrid = () => {
  return (
    <section className="relative w-full bg-[var(--color-bg-primary)] pb-24 border-t border-[var(--color-border-color)] transition-colors duration-500">
      {/* Header Section */}
      <div className="w-full border-b border-[var(--color-border-color)] bg-[var(--color-bg-secondary)] py-5 px-6 md:px-12 flex flex-col md:flex-row justify-between items-center text-xs md:text-sm font-mono text-[var(--color-text-secondary)] mb-12 shadow-2xl relative z-10 transition-colors duration-500">
        <div className="mb-3 md:mb-0 tracking-widest text-[var(--color-text-secondary)]">03 — PORTRAITS</div>
        <div className="mb-3 md:mb-0 text-center tracking-widest font-bold text-[var(--color-text-primary)]">POLAROID COLLECTION</div>
        <div className="flex items-center gap-3">
          <span className="w-2.5 h-2.5 rounded-full bg-[var(--color-accent-metallic)] shadow-[0_0_8px_var(--color-accent-glow)] animate-pulse"></span>
          <span className="tracking-widest text-[var(--color-text-primary)]">LIVE</span>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-2 md:px-6">
        {/* CSS Grid for Layout - Contact Sheet Style */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-[4px] md:gap-[6px] bg-[var(--color-border-color)] p-[4px] md:p-[6px] border-[6px] border-[var(--color-border-color)] transition-colors duration-500">
          {polaroidItems.map((item) => (
             <div key={item.id} className="relative">
                <PolaroidCard item={item} />
             </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AaryaPolaroidGrid;