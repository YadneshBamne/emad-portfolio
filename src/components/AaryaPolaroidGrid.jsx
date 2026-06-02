import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

// Sample polaroid data
const polaroidItems = [
  { id: 1, src: 'https://ik.imagekit.io/4no4se4zt/Emad%20Shaikh/photos/ISF-14.jpg', signature: 'Emad' },
  { id: 2, src: 'https://ik.imagekit.io/4no4se4zt/Emad%20Shaikh/photos/ISF-68.jpg', signature: 'Creative' },
  { id: 3, src: 'https://ik.imagekit.io/4no4se4zt/Emad%20Shaikh/photos/ISF-172.jpg', signature: 'Design' },
  { id: 4, src: 'https://ik.imagekit.io/4no4se4zt/Emad%20Shaikh/photos/credits_BARICCI_ES_75-6.jpg', signature: 'Vision' },
  { id: 5, src: 'https://ik.imagekit.io/4no4se4zt/Emad%20Shaikh/photos/ISF-147.jpg', signature: 'Motion' },
  { id: 6, src: 'https://ik.imagekit.io/4no4se4zt/Emad%20Shaikh/photos/credits_BARICCI_ES-65.jpg', signature: 'Art' },
  { id: 7, src: 'https://ik.imagekit.io/4no4se4zt/Emad%20Shaikh/photos/credits_BARICCI_ES-71.jpg', signature: 'Light' },
  { id: 8, src: 'https://ik.imagekit.io/4no4se4zt/Emad%20Shaikh/photos/credits_BARICCI_ES-75.jpg', signature: 'Moment' },
  { id: 9, src: 'https://ik.imagekit.io/4no4se4zt/Emad%20Shaikh/photos/ISF-8.jpg', signature: 'Frame' },
  { id: 10, src: 'https://ik.imagekit.io/4no4se4zt/Emad%20Shaikh/photos/ISF-11.jpg', signature: 'Shot' }
];

const scatterConfig = [
  { rotate: 12, y: 15 },    // 1 top left
  { rotate: -8, y: 45 },    // 2 top mid-left
  { rotate: -12, y: -15 },  // 3 top middle
  { rotate: 8, y: 35 },     // 4 top mid-right
  { rotate: 10, y: 0 },     // 5 top right
  { rotate: -10, y: -25 },  // 6 bottom left
  { rotate: 10, y: 25 },    // 7 bottom mid-left
  { rotate: -6, y: 50 },    // 8 bottom middle
  { rotate: -12, y: 15 },   // 9 bottom mid-right
  { rotate: 8, y: -15 },    // 10 bottom right
];

const PolaroidCard = ({ item, config }) => {
  const cardRef = useRef(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30, mass: 2 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30, mass: 2 });

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

  const textRotation = Math.sin(item.id * 0.5) * 4;

  const baseRotation = config?.rotate || 0;
  const baseTranslateY = config?.y || 0;

  return (
    <motion.div
      ref={cardRef}
      className="relative aspect-[3/4] w-full max-w-[280px] bg-[#faf9f5] overflow-hidden cursor-pointer shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{ 
        scale: 1.15, 
        zIndex: 50, 
        rotate: 0, 
        x: 0, 
        y: 0,
        boxShadow: "0 40px 80px -20px rgba(0, 0, 0, 0.8)" 
      }}
      initial={{ 
        scale: 1, 
        zIndex: 1, 
        rotate: baseRotation,
        x: 0,
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
      <div className="w-full h-full p-[6%] pb-[14%] bg-[#faf9f5] flex flex-col pointer-events-none">
        <div className="relative flex-1 bg-black overflow-hidden shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)]">
          <img
            src={item.src}
            alt={`Polaroid ${item.id}`}
            className="w-full h-full object-cover"
            loading="lazy"
            draggable="false"
          />
        </div>
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
    <section className="relative w-full bg-black py-24 border-t border-zinc-900 transition-colors duration-500 overflow-hidden">
      {/* Header Section */}
      <div className="w-full border-b border-zinc-900 bg-black/50 py-5 px-6 md:px-12 flex flex-col md:flex-row justify-between items-center text-xs md:text-sm font-mono text-zinc-500 mb-20 shadow-2xl relative z-10">
        <div className="mb-3 md:mb-0 tracking-widest flex items-center gap-4">
           <span className="text-red-600 font-bold">04</span>
           <span className="w-12 h-[1px] bg-zinc-600"></span>
           <span>GALLERY</span>
        </div>
        <div className="mb-3 md:mb-0 text-center tracking-widest font-bold text-zinc-200">POLAROID COLLECTION</div>
        <div className="flex items-center gap-3">
          <span className="w-2.5 h-2.5 rounded-full bg-red-600 shadow-[0_0_8px_rgba(220,38,38,0.8)] animate-pulse"></span>
          <span className="tracking-widest text-zinc-200">LIVE</span>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-4 md:px-12">
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