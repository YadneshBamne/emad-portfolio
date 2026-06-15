import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

// Sample polaroid data
const polaroidItems = [
  { id: 1, src: 'https://ik.imagekit.io/4no4se4zt/Emad%20Shaikh/photos/ISF-14.jpg', signature: 'Emad' },
  { id: 2, src: 'https://ik.imagekit.io/4no4se4zt/Emad%20Shaikh/photos/ISF-68.jpg', signature: 'Creative' },
  { id: 3, src: 'https://ik.imagekit.io/4no4se4zt/Emad%20Shaikh/photos/ISF-172.jpg', signature: 'Design' },
  { id: 4, src: 'https://ik.imagekit.io/4no4se4zt/Emad%20Shaikh/photos/credits_BARICCI_ES_75-6.jpg', signature: 'Vision' },
  { id: 5, src: 'https://ik.imagekit.io/4no4se4zt/Emad%20Shaikh/photos/ISF-147.jpg', signature: 'Motion' },
  { id: 6, src: 'https://ik.imagekit.io/4no4se4zt/Emad%20Shaikh/photos/credits_BARICCI_ES-65.jpg?updatedAt=1780411130453', signature: 'Art' },
  { id: 7, src: 'https://ik.imagekit.io/4no4se4zt/Emad%20Shaikh/photos/credits_BARICCI_ES-71.jpg', signature: 'Light' },
  { id: 8, src: 'https://ik.imagekit.io/4no4se4zt/Emad%20Shaikh/photos/credits_BARICCI_ES-75.jpg', signature: 'Moment' },
  { id: 9, src: 'https://ik.imagekit.io/4no4se4zt/Emad%20Shaikh/photos/ISF-8.jpg', signature: 'Frame' },
  { id: 10, src: 'https://ik.imagekit.io/4no4se4zt/Emad%20Shaikh/photos/ISF-11.jpg', signature: 'Shot' }
];

const scatterConfig = [
  { rotate: 8, x: -18, y: 12 },    // 1 top left
  { rotate: -6, x: 12, y: 35 },    // 2 top mid-left
  { rotate: -12, x: -8, y: -10 },  // 3 top middle
  { rotate: 5, x: 22, y: 25 },     // 4 top mid-right
  { rotate: 9, x: -12, y: -5 },    // 5 top right
  { rotate: -8, x: 14, y: -20 },   // 6 bottom left
  { rotate: 11, x: -22, y: 18 },   // 7 bottom mid-left
  { rotate: -4, x: 6, y: 40 },     // 8 bottom middle
  { rotate: -10, x: -14, y: 8 },   // 9 bottom mid-right
  { rotate: 7, x: 12, y: -12 },    // 10 bottom right
];

const PolaroidCard = ({ item, config }) => {
  const cardRef = useRef(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 250, damping: 25, mass: 1 });
  const mouseYSpring = useSpring(y, { stiffness: 250, damping: 25, mass: 1 });

  // Increased tilt bounds to 15deg for a stronger 3D perspective effect
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);
  
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

  const baseRotation = config?.rotate || 0;
  const baseTranslateX = config?.x || 0;
  const baseTranslateY = config?.y || 0;

  return (
    <motion.div
      ref={cardRef}
      // overflow-visible lets the 3D translated children extend past the card frame without clipping
      className="relative aspect-3/4 w-full max-w-70 bg-[#faf9f5] overflow-visible cursor-pointer shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{ 
        scale: 1.12, // slightly larger lift on hover
        zIndex: 50, 
        rotate: 0, 
        x: 0, 
        y: 0,
        // Deeper, softer shadow that gives a strong "floating" effect
        boxShadow: "0 40px 80px -20px rgba(0, 0, 0, 0.85), 0 0 40px rgba(0, 0, 0, 0.3)",
        transition: { duration: 0.3, type: 'spring', stiffness: 300, damping: 30 }
      }}
      initial={{ 
        scale: 1, 
        zIndex: 1, 
        rotate: baseRotation,
        x: baseTranslateX,
        y: baseTranslateY,
      }}
      transition={{ scale: { duration: 0.4 }, boxShadow: { duration: 0.4 }, rotate: { duration: 0.4, ease: 'easeOut' }, x: { duration: 0.4 }, y: { duration: 0.4 } }}
      style={{
        transformStyle: 'preserve-3d',
        perspective: '1200px',
        rotateX,
        rotateY
      }}
    >
      <div className="w-full h-full p-[3%] pb-[14%] bg-[#faf9f5] flex flex-col pointer-events-none">
        <div className="relative flex-1 bg-black overflow-hidden shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)]">
          <img
            src={item.src}
            alt={`Polaroid ${item.id}`}
            className="w-full h-full object-cover"
            loading="lazy"
            draggable="false"
          />
        </div>
      </div>
    </motion.div>
  );
};

const AaryaPolaroidGrid = () => {
  return (
    <section className="relative w-full bg-bg-primary py-24 border-t border-border-color transition-colors duration-500 overflow-hidden">
      {/* Header Section */}
      <div className="w-full border-b border-border-color bg-bg-secondary/50 py-5 px-6 md:px-12 flex flex-col md:flex-row justify-between items-center text-xs md:text-sm font-mono text-text-secondary mb-20 shadow-2xl relative z-10">
        <div className="mb-3 md:mb-0 tracking-widest flex items-center gap-4">
           <span className="text-accent-metallic font-bold">04</span>
           <span className="w-12 h-px bg-border-color"></span>
           <span>GALLERY</span>
        </div>
        <div className="mb-3 md:mb-0 text-center tracking-widest font-bold text-text-primary">POLAROID COLLECTION</div>
        <div className="flex items-center gap-3">
          <span className="w-2.5 h-2.5 rounded-full bg-accent-metallic shadow-[0_0_8px_var(--accent-glow)] animate-pulse"></span>
          <span className="tracking-widest text-text-primary">LIVE</span>
        </div>
      </div>

      <div className="max-w-400 mx-auto px-4 md:px-12">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 lg:gap-12 place-items-center">
          {polaroidItems.map((item, index) => (
             <div key={item.id} className="relative z-10 w-full flex justify-center items-center" style={{ zIndex: 10 }}>
                <PolaroidCard item={item} config={scatterConfig[index]} />
             </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AaryaPolaroidGrid;