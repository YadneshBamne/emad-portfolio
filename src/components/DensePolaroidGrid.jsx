import React from 'react';
import { motion } from 'framer-motion';

// Sample polaroid data for the dense grid
const denseItems = [
  { id: 1, src: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=2071&auto=format&fit=crop', signature: 'Emad' },
  { id: 2, src: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=2070&auto=format&fit=crop', signature: 'Creative' },
  { id: 3, src: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=2000&auto=format&fit=crop', signature: 'Design' },
  { id: 4, src: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?q=80&w=2070&auto=format&fit=crop', signature: 'Vision' },
  { id: 5, src: 'https://images.unsplash.com/photo-1511692277506-3be3a7ab1686?q=80&w=2000&auto=format&fit=crop', signature: 'Motion' },
  { id: 6, src: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=2070&auto=format&fit=crop', signature: 'Art' },
  { id: 7, src: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=2070&auto=format&fit=crop', signature: 'Light' },
  { id: 8, src: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=2000&auto=format&fit=crop', signature: 'Moment' },
  { id: 9, src: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=2071&auto=format&fit=crop', signature: 'Frame' },
  { id: 10, src: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=2070&auto=format&fit=crop', signature: 'Shot' },
  { id: 11, src: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?q=80&w=2070&auto=format&fit=crop', signature: 'Reel' },
  { id: 12, src: 'https://images.unsplash.com/photo-1511692277506-3be3a7ab1686?q=80&w=2000&auto=format&fit=crop', signature: 'Epic' },
  { id: 13, src: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=2071&auto=format&fit=crop', signature: 'Focus' },
  { id: 14, src: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=2070&auto=format&fit=crop', signature: 'Scale' },
  { id: 15, src: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=2000&auto=format&fit=crop', signature: 'Color' },
  { id: 16, src: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?q=80&w=2070&auto=format&fit=crop', signature: 'Lens' },
  { id: 17, src: 'https://images.unsplash.com/photo-1511692277506-3be3a7ab1686?q=80&w=2000&auto=format&fit=crop', signature: 'Glow' },
  { id: 18, src: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=2070&auto=format&fit=crop', signature: 'Depth' }
];

const DensePolaroidCard = ({ item }) => {
  const textRotation = Math.sin(item.id * 0.5) * 2; // subtle random rotation

  return (
    <motion.div
      className="relative aspect-[3/4] w-full bg-[#faf9f5] overflow-hidden cursor-pointer group"
      whileHover={{ 
        scale: 1.05, 
        zIndex: 50,
        boxShadow: "0 20px 40px rgba(0,0,0,0.5)"
      }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      <div className="w-full h-full p-[6%] pb-[14%] bg-[#faf9f5] flex flex-col pointer-events-none">
        <div className="relative flex-1 bg-black overflow-hidden shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)]">
          <img
            src={item.src}
            alt={`Polaroid ${item.signature}`}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            loading="lazy"
            draggable="false"
          />
        </div>
        <div className="h-[10%] mt-[6%] flex items-center justify-center">
          <span 
            className="text-black font-bold opacity-80"
            style={{
              fontFamily: "'Caveat', cursive",
              transform: `rotate(${textRotation}deg)`,
              display: "inline-block",
              fontSize: "clamp(1.2rem, 1.5vw, 2rem)"
            }}
          >
            {item.signature}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

const DensePolaroidGrid = () => {
  return (
    <div className="w-full bg-black py-12 border-t border-zinc-900 overflow-hidden">
      <div className="w-full max-w-[1800px] mx-auto px-2 md:px-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 place-items-center">
          {denseItems.map((item) => (
             <div key={item.id} className="relative z-10 w-full h-full flex justify-center items-center">
                <DensePolaroidCard item={item} />
             </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DensePolaroidGrid;
