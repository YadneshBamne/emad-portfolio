import React, { useEffect } from 'react';
import { useTransitionNavigate } from '../context/TransitionContext';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';
import gsap from 'gsap';

export default function AaryaNavbar({ activePage = '', isHome = false }) {
  const navigate = useTransitionNavigate();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    if (isHome) {
      // Home page specific behavior: nav starts hidden and slides in on scroll
      gsap.set('.nav-left-links', { x: -40, opacity: 0 });
      gsap.set('.nav-right-links', { x: 40, opacity: 0 });
      gsap.set('.nav-logo', { y: -30, opacity: 0 });
      gsap.set('.nav-theme-toggle', { y: -30, opacity: 0 });

      let hasAppeared = false;
      let rafId = null;

      const showNav = () => {
        if (hasAppeared) return;
        hasAppeared = true;
        gsap.timeline()
          .to('.nav-logo',        { y: 0, opacity: 1, duration: 0.5, ease: 'power3.out', force3D: true })
          .to('.nav-left-links',  { x: 0, opacity: 1, duration: 0.5, ease: 'power3.out', force3D: true }, '-=0.3')
          .to('.nav-right-links', { x: 0, opacity: 1, duration: 0.5, ease: 'power3.out', force3D: true }, '-=0.45')
          .to('.nav-theme-toggle', { y: 0, opacity: 1, duration: 0.5, ease: 'power3.out', force3D: true }, '-=0.45');
        
        window.removeEventListener('scroll', onScroll);
      };

      const onScroll = () => {
        if (rafId) cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(() => {
          if (window.scrollY > window.innerHeight * 0.9) {
            showNav();
          }
        });
      };

      window.addEventListener('scroll', onScroll, { passive: true });
      return () => {
        window.removeEventListener('scroll', onScroll);
        if (rafId) cancelAnimationFrame(rafId);
      };
    }
  }, [isHome]);

  const linkClass = (pageName) => {
    const base = "hover:opacity-70 transition-opacity duration-300 cursor-pointer uppercase tracking-[0.15em]";
    if (activePage === pageName) {
      return `${base} underline decoration-accent-metallic underline-offset-8 decoration-2`;
    }
    return base;
  };

  return (
    <nav className="desktop-nav hidden md:flex justify-center fixed top-0 left-0 w-full z-[10000] py-8 px-12 items-center pointer-events-auto bg-transparent">
      <div className="flex items-center gap-8 md:gap-12">
        {/* Left: Links */}
        <div 
          className="nav-left-links flex items-center gap-10 font-sans text-xs tracking-[0.15em] text-text-primary font-bold" 
          style={isHome ? { opacity: 0 } : undefined}
        >
          <button onClick={() => navigate('/about')} className={linkClass('about')}>ABOUT</button>
          <button onClick={() => navigate('/photography')} className={linkClass('photography')}>PHOTOGRAPHY</button>
        </div>

        {/* Center: Logo */}
        <div 
          className="nav-logo flex justify-center items-center" 
          style={isHome ? { opacity: 0 } : undefined}
        >
          <button onClick={() => navigate('/')} className="hover:scale-110 transition-transform duration-300 shrink-0 cursor-pointer">
            <img 
              src="/logo.avif" 
              alt="Logo" 
              className="h-20 w-30 dark:invert-0 invert transition-all duration-500" 
            />
          </button>
        </div>

        {/* Right: Links */}
        <div 
          className="nav-right-links flex items-center gap-10 font-sans text-xs tracking-[0.15em] text-text-primary font-bold" 
          style={isHome ? { opacity: 0 } : undefined}
        >
          <button onClick={() => navigate('/works')} className={linkClass('works')}>WORKS</button>
          <button onClick={() => navigate('/community')} className={linkClass('community')}>COMMUNITY</button>
        </div>

        {/* Theme Toggle Button */}
        <div 
          className="nav-theme-toggle flex items-center" 
          style={isHome ? { opacity: 0 } : undefined}
        >
          <button 
            onClick={toggleTheme}
            className="w-10 h-10 rounded-full flex items-center justify-center bg-bg-secondary/40 backdrop-blur-md border border-border-color/20 text-text-primary hover:bg-bg-secondary/80 transition-all duration-300 cursor-pointer active:scale-95 shadow-md"
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? (
              <Sun size={15} className="text-yellow-500 fill-yellow-500" />
            ) : (
              <Moon size={15} className="text-accent-metallic fill-accent-metallic" />
            )}
          </button>
        </div>
      </div>
    </nav>
  );
}
