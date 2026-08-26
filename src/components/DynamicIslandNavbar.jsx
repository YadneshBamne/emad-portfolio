import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { useTransitionNavigate } from '../context/TransitionContext';
import ThemeToggle from './ui/ThemeToggle';

const STAGGER = 0.025;

const TextRoll = ({ children, center = false }) => {
  return (
    <motion.span
      initial="initial"
      whileHover="hovered"
      className="relative inline-block overflow-hidden"
      style={{
        lineHeight: 1.15,
      }}
    >
      <span className="flex items-center">
        {children.split('').map((l, i) => {
          const delay = center
            ? STAGGER * Math.abs(i - (children.length - 1) / 2)
            : STAGGER * i;

          return (
            <motion.span
              variants={{
                initial: { y: 0 },
                hovered: { y: '-100%' },
              }}
              transition={{
                duration: 0.32,
                ease: [0.33, 1, 0.68, 1],
                delay,
              }}
              className="inline-block"
              key={i}
            >
              {l === ' ' ? '\u00A0' : l}
            </motion.span>
          );
        })}
      </span>
      <span className="absolute inset-0 flex items-center">
        {children.split('').map((l, i) => {
          const delay = center
            ? STAGGER * Math.abs(i - (children.length - 1) / 2)
            : STAGGER * i;

          return (
            <motion.span
              variants={{
                initial: { y: '100%' },
                hovered: { y: 0 },
              }}
              transition={{
                duration: 0.32,
                ease: [0.33, 1, 0.68, 1],
                delay,
              }}
              className="inline-block"
              key={i}
            >
              {l === ' ' ? '\u00A0' : l}
            </motion.span>
          );
        })}
      </span>
    </motion.span>
  );
};

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
    if (path === '/') {
      if (window.location.pathname === '/') {
        const el = document.getElementById('section-work') || document.getElementById('section-about');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
          return;
        }
      }
    }
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
              className={`cursor-pointer ${
                activePath === '/about' ? 'underline decoration-white underline-offset-4 decoration-2' : ''
              }`}
            >
              <TextRoll>ABOUT</TextRoll>
            </button>
            <button
              onClick={() => handleNavigate('/photography')}
              className={`cursor-pointer ${
                activePath === '/photography' ? 'underline decoration-white underline-offset-4 decoration-2' : ''
              }`}
            >
              <TextRoll>PHOTOGRAPHY</TextRoll>
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
              className={`cursor-pointer ${
                activePath === '/works' ? 'underline decoration-white underline-offset-4 decoration-2' : ''
              }`}
            >
              <TextRoll>WORKS</TextRoll>
            </button>
            <button
              onClick={() => handleNavigate('/community')}
              className={`cursor-pointer ${
                activePath === '/community' ? 'underline decoration-white underline-offset-4 decoration-2' : ''
              }`}
            >
              <TextRoll>COMMUNITY</TextRoll>
            </button>
          </motion.div>

        </div>

        {/* Floating Right HUD Theme Toggle - Perfectly centered with navbar axis */}
        <div className="absolute right-8 sm:right-12 top-1/2 -translate-y-1/2 z-30 pointer-events-auto flex items-center">
          <ThemeToggle />
        </div>
      </nav>
    </div>
  );
}
