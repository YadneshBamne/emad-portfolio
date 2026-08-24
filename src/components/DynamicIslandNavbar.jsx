import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { useTransitionNavigate } from '../context/TransitionContext';

export default function DynamicIslandNavbar({ activePath = '/' }) {
  const navigate = useTransitionNavigate();
  const [isContracted, setIsContracted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const lastScrollYRef = useRef(0);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.pageYOffset || document.documentElement.scrollTop || 0;
          const diff = currentScrollY - lastScrollYRef.current;

          // Always fully expand when near the top of the page
          if (currentScrollY < 30) {
            setIsContracted(false);
          } else if (diff > 5) {
            // Scrolling down -> contract navigation links into the logo
            setIsContracted(true);
          } else if (diff < -5) {
            // Scrolling up -> expand navigation links back out
            setIsContracted(false);
          }

          lastScrollYRef.current = Math.max(0, currentScrollY);
          ticking = false;
        });
        ticking = true;
      }
    };

    const handleWheel = (e) => {
      const currentScrollY = window.pageYOffset || document.documentElement.scrollTop || 0;
      if (currentScrollY < 30) {
        setIsContracted(false);
      } else if (e.deltaY > 8) {
        setIsContracted(true);
      } else if (e.deltaY < -8) {
        setIsContracted(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('wheel', handleWheel, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('wheel', handleWheel);
    };
  }, []);

  const handleNavigate = (path) => {
    navigate(path);
  };

  const showNav = !isContracted || isHovered;

  return (
    <div className="hidden md:block fixed top-4 sm:top-6 md:top-8 left-0 right-0 z-[10000] pointer-events-none">
      <nav 
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="desktop-nav relative w-full py-4 sm:py-6 px-12 flex justify-center items-center pointer-events-auto"
      >
        {/* DEAD CENTER LOGO - Mathematically locked, never moves or resizes */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center shrink-0 z-20 pointer-events-auto">
          <button
            onClick={() => handleNavigate('/')}
            className="hover:scale-105 transition-transform duration-300 shrink-0 cursor-pointer flex items-center justify-center"
          >
            <img 
              src="/logo.avif" 
              alt="Logo" 
              className="h-20 w-30 object-contain" 
            />
          </button>
        </div>

        {/* Links Container - Left & Right aligned around the static center logo */}
        <div className="w-full flex items-center justify-center gap-10 md:gap-14 pointer-events-none">
          
          {/* Left Links: Slides right towards the logo on scroll down */}
          <motion.div 
            initial={false}
            animate={{ 
              opacity: showNav ? 1 : 0, 
              x: showNav ? 0 : 45,
              filter: showNav ? 'blur(0px)' : 'blur(4px)',
            }}
            transition={{ type: 'spring', bounce: 0.16, duration: 0.45 }}
            style={{ pointerEvents: showNav ? 'auto' : 'none' }}
            className="nav-left-links flex items-center gap-10 font-sans text-base tracking-[0.15em] text-white font-bold whitespace-nowrap"
          >
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
          </motion.div>

          {/* Exact Logo Width Spacer so left and right links are balanced */}
          <div className="w-30 shrink-0 pointer-events-none" />

          {/* Right Links: Slides left towards the logo on scroll down */}
          <motion.div 
            initial={false}
            animate={{ 
              opacity: showNav ? 1 : 0, 
              x: showNav ? 0 : -45,
              filter: showNav ? 'blur(0px)' : 'blur(4px)',
            }}
            transition={{ type: 'spring', bounce: 0.16, duration: 0.45 }}
            style={{ pointerEvents: showNav ? 'auto' : 'none' }}
            className="nav-right-links flex items-center gap-10 font-sans text-base tracking-[0.15em] text-white font-bold whitespace-nowrap"
          >
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
          </motion.div>

        </div>
      </nav>
    </div>
  );
}
