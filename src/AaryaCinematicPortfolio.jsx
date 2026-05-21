import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import AaryaPolaroidGrid from './components/AaryaPolaroidGrid';
import { AaryaNavigationDrawer } from './components/AaryaNavigationDrawer';
import { AaryaLensReveal } from './components/AaryaLensReveal';
import { AnimatedCarousel } from './components/ui/logo-carousel';
import AboutSection from './components/AboutSection';
import { PresetStudio } from './components/PresetStudio';
import AaryaVideoShowcase from './components/AaryaVideoShowcase';

gsap.registerPlugin(ScrollTrigger);
// Optimize GSAP globally for better performance
gsap.defaults({ overwrite: 'auto' });

const AaryaCinematicPortfolio = () => {
  const containerRef = useRef(null);
  const navigate = useNavigate();
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    // Sync theme on mount
    if (document.documentElement.classList.contains('dark')) {
      setIsDark(true);
    } else {
      document.documentElement.classList.add('dark');
      setIsDark(true);
    }
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      setIsDark(true);
    }
  };

  useEffect(() => {
    let lastScrollY = 0;
    let isHidden = false;
    let scrollTimeout;
    
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const nav = document.querySelector('nav.desktop-nav');
      
      if (!nav) return;
      
      // Scrolling down - hide navigation
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        if (!isHidden) {
          gsap.killTweensOf(nav);
          gsap.to(nav, {
            y: -120,
            opacity: 0,
            pointerEvents: 'none',
            duration: 0.35,
            ease: 'sine.out',
          });
          isHidden = true;
        }
      } 
      // Scrolling up - show navigation
      else if (currentScrollY < lastScrollY) {
        if (isHidden) {
          gsap.killTweensOf(nav);
          gsap.to(nav, {
            y: 0,
            opacity: 1,
            pointerEvents: 'auto',
            duration: 0.35,
            ease: 'sine.out',
          });
          isHidden = false;
        }
      }
      
      lastScrollY = currentScrollY;
      
      // Clear previous timeout
      clearTimeout(scrollTimeout);
      // Show nav on scroll stop (after 1 second)
      scrollTimeout = setTimeout(() => {
        if (!isHidden) return;
        gsap.killTweensOf(nav);
        gsap.to(nav, {
          y: 0,
          opacity: 1,
          pointerEvents: 'auto',
          duration: 0.35,
          ease: 'sine.out',
        });
        isHidden = false;
      }, 1000);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, []);

  useEffect(() => {
    // We create a GSAP context to ensure proper cleanup in React strict mode
    const ctx = gsap.context(() => {

      // Cards entrance animations - optimized for performance
      const cards = gsap.utils.toArray('.work-card');
      cards.forEach((card, index) => {
        gsap.set(card, { willChange: 'transform, opacity' });
        gsap.fromTo(card,
          { y: 100, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            ease: 'sine.out',
            scrollTrigger: {
              trigger: card,
              start: 'top bottom-=50',
              toggleActions: 'play none none reverse',
              markers: false
            },
            onComplete: () => {
              gsap.set(card, { willChange: 'auto' });
            }
          }
        );
      });

    }, containerRef); // Scope to container

    return () => ctx.revert(); // Cleanup!
  }, []);

  return (
    <div ref={containerRef} className="bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] min-h-screen selection:bg-[var(--color-accent-metallic)] selection:text-[var(--color-bg-primary)] rounded-b-[3rem] overflow-x-hidden transition-colors duration-500">

      {/* Theme Toggle Button */}
      <button 
        onClick={toggleTheme}
        className="fixed bottom-6 right-6 z-[100] w-12 h-12 rounded-full bg-[var(--color-bg-secondary)] border border-[var(--color-border-color)] flex items-center justify-center shadow-lg transition-transform hover:scale-110 active:scale-95"
        aria-label="Toggle Theme"
      >
        {isDark ? (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-[var(--color-text-primary)]">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-[var(--color-text-primary)]">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
          </svg>
        )}
      </button>

      {/* Global Slide-Out Navigation (Framer Motion) - Mobile Only */}
      <div className="block md:hidden">
        <AaryaNavigationDrawer />
      </div>

      {/* Desktop Navigation - Hide on Scroll */}
      <nav className="desktop-nav hidden md:flex fixed top-0 left-0 w-full z-50 py-8 px-12 items-center justify-center mix-blend-difference pointer-events-auto" style={{ transition: 'none' }}>
        <div className="flex gap-16 font-mono text-sm tracking-[0.2em] uppercase text-white/80 pointer-events-auto">
          <a href="#" className="hover:text-white hover:scale-105 transition-all duration-300">About</a>
          <a href="#" className="hover:text-white hover:scale-105 transition-all duration-300">Work</a>
          <a href="#" className="hover:text-white hover:scale-105 transition-all duration-300">Contact</a>
        </div>
      </nav>

      {/* 2. The Hero Section (Lens Reveal) */}
      <AaryaLensReveal />

      {/* 4. The Navigation / Divider Bar */}
      <div className="w-full border-t border-[var(--color-border-color)] bg-[var(--color-bg-secondary)] py-5 px-6 md:px-12 flex flex-col md:flex-row justify-between items-center text-xs md:text-sm font-mono text-[var(--color-text-secondary)] z-20 relative shadow-2xl transition-colors duration-500" style={{ fontFamily: "'Space Mono', monospace" }}>
        <div className="mb-3 md:mb-0 tracking-widest text-[var(--color-text-secondary)]">02 — SELECT WORK</div>
        <div className="mb-3 md:mb-0 text-center tracking-widest text-[var(--color-text-primary)]">REEL — EMAD SHAIKH — MULTIDISCIPLINARY CREATIVE</div>
        <div className="flex items-center gap-3">
          <span className="w-2.5 h-2.5 rounded-full bg-[var(--color-accent-metallic)] shadow-[0_0_8px_var(--color-accent-glow)] animate-pulse"></span>
          <span className="tracking-widest text-[var(--color-text-primary)]">REC — HD01</span>
        </div>
      </div>

      {/* 5. The Cards Section */}
      <section className="relative w-full bg-[var(--color-bg-primary)] py-24 px-4 md:px-8 z-20 overflow-hidden transition-colors duration-500" style={{ backfaceVisibility: 'hidden' }}>

        {/* Animated Logo Carousel - ABOVE Cards */}
        <div className="mb-16 md:mb-24">
          <AnimatedCarousel 
            title="CREATIVE PARTNERS" 
            logoContainerHeight="h-16 md:h-20" 
            logoContainerWidth="w-full"
            logoImageHeight="h-10 md:h-12"
            itemsPerViewMobile={3}
            itemsPerViewDesktop={5}
          />
        </div>

        {/* Filmstrip Top Border */}
        <div className="absolute top-0 left-0 w-full h-8 flex items-center overflow-hidden opacity-30 bg-[var(--color-bg-primary)] border-b border-[var(--color-border-color)]">
          <div className="flex gap-4 px-2 w-[200%] animate-[slide_20s_linear_infinite]">
            {[...Array(50)].map((_, i) => (
              <div key={i} className="w-6 h-4 border-2 border-[var(--color-border-color)] rounded-sm shrink-0"></div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 max-w-[1400px] mx-auto mt-8 mb-8">

          {/* Card 1: Photography */}
          <div className="work-card group relative h-[45vh] md:h-[55vh] overflow-hidden bg-[var(--color-bg-secondary)] border border-[var(--color-border-color)] flex items-end" style={{ backfaceVisibility: 'hidden', perspective: 1000 }}>
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/e/e9/Photograph_of_a_Photographer.jpg"
              alt="Photography"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 group-hover:brightness-100 brightness-75 mix-blend-luminosity opacity-80"
              style={{ willChange: 'transform' }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-bg-primary)] via-transparent to-transparent opacity-90 group-hover:opacity-60 transition-opacity duration-500" style={{ willChange: 'opacity' }}></div>
            <div className="relative z-10 p-8 w-full transform transition-transform duration-500 group-hover:-translate-y-4" style={{ willChange: 'transform' }}>
              <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold text-[var(--color-text-primary)] tracking-tighter uppercase drop-shadow-md" style={{ fontFamily: "'Anton', sans-serif" }}>PHOTOGRAPHY</h2>
              <p className="text-[var(--color-text-secondary)] font-mono text-sm mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 uppercase tracking-widest bg-[var(--color-bg-primary)]/80 inline-block px-2 py-1 backdrop-blur-sm">Capturing light & moments</p>
              <div className="h-[2px] w-0 bg-[var(--color-accent-metallic)] mt-4 transition-all duration-500 group-hover:w-full" style={{ willChange: 'width' }}></div>
            </div>
          </div>

          {/* Card 2: Videography */}
          <div className="work-card group relative h-[45vh] md:h-[55vh] overflow-hidden bg-[var(--color-bg-secondary)] border border-[var(--color-border-color)] flex items-end" style={{ backfaceVisibility: 'hidden', perspective: 1000 }}>
            <img
              src="https://images.pexels.com/photos/34612064/pexels-photo-34612064.jpeg"
              alt="Videography"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 group-hover:brightness-100 brightness-75 mix-blend-luminosity opacity-80"
              style={{ willChange: 'transform' }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-bg-primary)] via-transparent to-transparent opacity-90 group-hover:opacity-60 transition-opacity duration-500" style={{ willChange: 'opacity' }}></div>
            <div className="relative z-10 p-8 w-full transform transition-transform duration-500 group-hover:-translate-y-4" style={{ willChange: 'transform' }}>
              <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold text-[var(--color-text-primary)] tracking-tighter uppercase drop-shadow-md" style={{ fontFamily: "'Anton', sans-serif" }}>VIDEOGRAPHY</h2>
              <p className="text-[var(--color-text-secondary)] font-mono text-sm mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 uppercase tracking-widest bg-[var(--color-bg-primary)]/80 inline-block px-2 py-1 backdrop-blur-sm">Motion & storytelling</p>
              <div className="h-[2px] w-0 bg-[var(--color-accent-metallic)] mt-4 transition-all duration-500 group-hover:w-full" style={{ willChange: 'width' }}></div>
            </div>
          </div>

          {/* Card 3: Graphic Design */}
          <div className="work-card group relative h-[45vh] md:h-[55vh] overflow-hidden bg-[var(--color-bg-secondary)] border border-[var(--color-border-color)] flex items-end" style={{ backfaceVisibility: 'hidden', perspective: 1000 }}>
            <img
              src="https://images.unsplash.com/photo-1626785774573-4b799315345d?q=80&w=2071&auto=format&fit=crop"
              alt="Graphic Design"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 group-hover:brightness-100 brightness-75 mix-blend-luminosity opacity-80"
              style={{ willChange: 'transform' }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-bg-primary)] via-transparent to-transparent opacity-90 group-hover:opacity-60 transition-opacity duration-500" style={{ willChange: 'opacity' }}></div>
            <div className="relative z-10 p-8 w-full transform transition-transform duration-500 group-hover:-translate-y-4" style={{ willChange: 'transform' }}>
              <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold text-[var(--color-text-primary)] tracking-tighter uppercase drop-shadow-md" style={{ fontFamily: "'Anton', sans-serif" }}>GRAPHIC DESIGN</h2>
              <p className="text-[var(--color-text-secondary)] font-mono text-sm mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 uppercase tracking-widest bg-[var(--color-bg-primary)]/80 inline-block px-2 py-1 backdrop-blur-sm">Visual communication</p>
              <div className="h-[2px] w-0 bg-[var(--color-accent-metallic)] mt-4 transition-all duration-500 group-hover:w-full" style={{ willChange: 'width' }}></div>
            </div>
          </div>

        </div>

        {/* Filmstrip Bottom Border */}
        <div className="absolute bottom-0 left-0 w-full h-8 flex items-center overflow-hidden opacity-30 bg-[var(--color-bg-primary)] border-t border-[var(--color-border-color)]">
          <div className="flex gap-4 px-2 w-[200%] animate-[slide_20s_linear_infinite_reverse]">
            {[...Array(50)].map((_, i) => (
              <div key={i} className="w-6 h-4 border-2 border-[var(--color-border-color)] rounded-sm shrink-0"></div>
            ))}
          </div>
        </div>
      </section>

      {/* 5.5 About Section */}
      <AboutSection />

      {/* 6. Polaroid Grid Gallery Section */}
      <AaryaPolaroidGrid />

      {/* 6.5 Video Showcase Section */}
      <AaryaVideoShowcase />

      {/* 7. Preset Studio Color Correction Feature */}
      <PresetStudio />

      {/* Custom Styles for animations */}
      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes slide {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}} />
    </div>
  );
};

export default AaryaCinematicPortfolio;

