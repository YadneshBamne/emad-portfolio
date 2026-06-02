import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const extraImages = [
  "https://picsum.photos/300/300?grayscale&random=7",
  "https://picsum.photos/300/300?grayscale&random=8",
  "https://picsum.photos/300/300?grayscale&random=9",
  "https://picsum.photos/300/300?grayscale&random=10",
  "https://picsum.photos/300/300?grayscale&random=11",
  "https://picsum.photos/300/300?grayscale&random=12",
  "https://picsum.photos/300/300?grayscale&random=13",
  "https://picsum.photos/300/300?grayscale&random=14",
  "https://picsum.photos/300/300?grayscale&random=15",
  "https://picsum.photos/300/300?grayscale&random=16",
];

export default function BlackHoleDebris({ active = true }) {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    if (!active) return;
    
    let idCounter = 0;
    const spawnParticle = () => {
      const src = extraImages[Math.floor(Math.random() * extraImages.length)];
      const startAngle = Math.random() * 360;
      // Spawn at various distances outside the main orbit
      const startRadius = 250 + Math.random() * 300; 
      // It accelerates as it falls in, duration between 1.2s and 2.5s
      const duration = 1.2 + Math.random() * 1.3; 
      const size = 30 + Math.random() * 40;
      // Spirals inward by rotating as it falls
      const rotationSpin = 180 + Math.random() * 270; 

      const newParticle = { id: idCounter++, src, startAngle, startRadius, duration, size, rotationSpin };
      
      setParticles(prev => [...prev, newParticle]);

      // Cleanup particle after it falls into the center
      setTimeout(() => {
        setParticles(prev => prev.filter(p => p.id !== newParticle.id));
      }, duration * 1000);
    };

    // Initial burst
    for(let i = 0; i < 4; i++) spawnParticle();

    // Continuous spawn
    const interval = setInterval(spawnParticle, 200); // 5 particles per second

    return () => clearInterval(interval);
  }, [active]);

  return (
    <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden z-10">
      <AnimatePresence>
        {particles.map(p => (
          <motion.div
            key={p.id}
            className="absolute flex items-center justify-center will-change-transform"
            initial={{ rotate: p.startAngle }}
            animate={{ rotate: p.startAngle + p.rotationSpin }}
            transition={{ duration: p.duration, ease: "easeIn" }}
          >
            <motion.img
              src={p.src}
              className="object-contain"
              style={{ width: p.size, height: p.size }}
              initial={{ x: p.startRadius, scale: 0.2, opacity: 0 }}
              animate={{ 
                x: 0, 
                scale: [0.2, 1, 0], 
                opacity: [0, 0.6, 0] 
              }}
              transition={{ 
                duration: p.duration, 
                ease: "easeIn",
                scale: { times: [0, 0.2, 1] },
                opacity: { times: [0, 0.2, 1] }
              }}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
