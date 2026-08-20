import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft } from 'lucide-react';
import { useTransitionNavigate } from '../context/TransitionContext';
import { AaryaNavigationDrawer } from '../components/AaryaNavigationDrawer';
import DynamicIslandNavbar from '../components/DynamicIslandNavbar';

const categories = [
  { id: '3d', title: '3D & MOTION', image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop' },
  { id: 'aftermovie', title: 'AFTERMOVIES', image: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=2070&auto=format&fit=crop' },
  { id: 'ai', title: 'AI GENERATED', image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=2070&auto=format&fit=crop' },
  { id: 'creative', title: 'CREATIVE DIRECTION', image: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2070&auto=format&fit=crop' }
];

export default function WorksPage() {
  const navigate = useTransitionNavigate();

  return (
    <div className="w-full min-h-screen bg-[#0a0a0a] text-white relative select-none overflow-x-hidden">
      
      {/* Global Slide-Out Navigation (Framer Motion) - Mobile Only */}
      <div className="block md:hidden">
        <AaryaNavigationDrawer />
      </div>

      {/* Dynamic Island Navigation Bar */}
      <DynamicIslandNavbar activePath="/works" />

      <div className="pt-36 pb-24 px-4 md:px-12">
        <div className="max-w-7xl mx-auto">
          <header className="mb-16">
            <h1 className="text-5xl md:text-8xl font-bold uppercase tracking-tighter mb-4" style={{ fontFamily: "'Anton', sans-serif" }}>Selected Works</h1>
            <p className="text-zinc-400 font-mono text-sm md:text-base tracking-widest uppercase max-w-2xl">
              A showcase of multidisciplinary projects spanning 3D, live events, AI, and comprehensive creative direction.
            </p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {categories.map((category, index) => (
              <motion.div 
                key={category.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group relative h-[40vh] md:h-[50vh] overflow-hidden rounded-sm cursor-pointer"
              >
                <div className="absolute inset-0 bg-black z-0">
                  <img 
                    src={category.image} 
                    alt={category.title} 
                    className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 ease-out mix-blend-luminosity group-hover:mix-blend-normal"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80 z-10" />
                <div className="absolute bottom-0 left-0 p-8 z-20 w-full transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <h2 className="text-3xl md:text-5xl font-bold uppercase tracking-wide drop-shadow-lg" style={{ fontFamily: "'Anton', sans-serif" }}>
                    {category.title}
                  </h2>
                  <div className="h-[2px] w-0 bg-red-600 mt-4 transition-all duration-500 group-hover:w-full"></div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
