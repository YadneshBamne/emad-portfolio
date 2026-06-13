import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTransitionNavigate } from './context/TransitionContext';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import AaryaPolaroidGrid from './components/AaryaPolaroidGrid';
import { AaryaNavigationDrawer } from './components/AaryaNavigationDrawer';
import { AaryaLensReveal } from './components/AaryaLensReveal';
// import { AaryaHero } from './components/AaryaHero';
// import VhsRecorder from './components/VhsRecorder';
import { AnimatedCarousel } from './components/ui/logo-carousel';
import AboutSection from './components/AboutSection';
import { PresetStudio } from './components/PresetStudio';
import AaryaVideoShowcase from './components/AaryaVideoShowcase';
import { ScrollProgressIndicator } from './components/ScrollProgressIndicator';
import AaryaCategoryAccordion from './components/AaryaCategoryAccordion';

gsap.registerPlugin(ScrollTrigger);
// Optimize GSAP globally for better performance
gsap.defaults({ overwrite: 'auto' });

const AaryaCinematicPortfolio = () => {
  const containerRef = useRef(null);
  const navigate = useTransitionNavigate();
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
    // Nav is hidden on the lens reveal hero section and slides in
    // once the user scrolls past it — then stays visible permanently.
    gsap.set('.nav-left-links', { x: -40, opacity: 0 });
    gsap.set('.nav-right-links', { x: 40, opacity: 0 });
    gsap.set('.nav-logo', { y: -30, opacity: 0 });

    let hasAppeared = false;
    let rafId = null;

    const showNav = () => {
      if (hasAppeared) return;
      hasAppeared = true;
      gsap.timeline()
        .to('.nav-logo',        { y: 0, opacity: 1, duration: 0.5, ease: 'power3.out', force3D: true })
        .to('.nav-left-links',  { x: 0, opacity: 1, duration: 0.5, ease: 'power3.out', force3D: true }, '-=0.3')
        .to('.nav-right-links', { x: 0, opacity: 1, duration: 0.5, ease: 'power3.out', force3D: true }, '-=0.45');
      // No longer need the scroll listener once nav is visible
      window.removeEventListener('scroll', onScroll);
    };

    const onScroll = () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        // Lens reveal is pinned for ~1.5× viewport height (end: +=120% in ScrollTrigger)
        // Show nav once user has scrolled past the hero pin region
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
  }, []);

  useEffect(() => {
    // We create a GSAP context to ensure proper cleanup in React strict mode
    const ctx = gsap.context(() => {
      // If we are mid-route-transition, instantly hide the black overlay
      if (window.isRouteTransition) {
        gsap.set('.hero-fade-overlay', { display: 'none' });
      } else {
        // Otherwise, this is a clean initial site load, play the smooth fade-in
        gsap.fromTo('.hero-fade-overlay', {
          opacity: 1,
          willChange: 'opacity'
        }, {
          opacity: 0,
          duration: 1.8,
          ease: "power3.out",
          onComplete: () => {
            gsap.set('.hero-fade-overlay', { display: 'none', willChange: 'auto' });
          }
        });
      }
    }, containerRef); // Scope to container

    return () => ctx.revert(); // Cleanup!
  }, []);

  return (
    <div ref={containerRef} className="bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] min-h-screen selection:bg-[var(--color-accent-metallic)] selection:text-[var(--color-bg-primary)] rounded-b-[3rem] overflow-x-hidden transition-colors duration-500">

      {/* Solid Black Page Transition Mask Overlay for Dark Fade-in */}
      <div className="hero-fade-overlay fixed inset-0 bg-[#000000] z-[100000] pointer-events-none" />



      {/* Global Slide-Out Navigation (Framer Motion) - Mobile Only */}
      <div className="block md:hidden">
        <AaryaNavigationDrawer />
      </div>

      {/* <ScrollProgressIndicator /> */}

      {/* Desktop Navigation — always visible, animates in on load */}
      <nav className="desktop-nav hidden md:flex justify-center fixed top-0 left-0 w-full z-[10000] py-8 px-12 items-center pointer-events-auto" style={{ transition: 'none' }}>
        <div className="flex items-center gap-8 md:gap-12">
          {/* Left: Links */}
          <div className="nav-left-links flex items-center gap-10 font-sans text-base tracking-[0.15em] text-white font-bold" style={{ opacity: 0 }}>
            <button onClick={() => navigate('/about')} className="hover:opacity-70 transition-opacity duration-300">ABOUT</button>
            <button onClick={() => navigate('/photography')} className="hover:opacity-70 transition-opacity duration-300">PHOTOGRAPHY</button>
          </div>
          
          {/* Center: Logo */}
          <div className="nav-logo flex justify-center items-center" style={{ opacity: 0 }}>
            <button onClick={() => navigate('/')} className="hover:scale-110 transition-transform duration-300 shrink-0">
              <img src="/logo.avif" alt="Logo" className="h-20 w-30" />
            </button>
          </div>

          {/* Right: Links */}
          <div className="nav-right-links flex items-center gap-10 font-sans text-base tracking-[0.15em] text-white font-bold" style={{ opacity: 0 }}>
            <button onClick={() => navigate('/works')} className="hover:opacity-70 transition-opacity duration-300">WORKS</button>
            <button onClick={() => navigate('/community')} className="hover:opacity-70 transition-opacity duration-300">COMMUNITY</button>
          </div>
        </div>
      </nav>

      {/* 2. The Hero Section (Lens Reveal) */}
      <div id="section-hero-top">
        <AaryaLensReveal />
      </div>

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
      <section id="section-work" className="relative w-full bg-[var(--color-bg-primary)] py-24 px-4 md:px-8 z-20 overflow-hidden transition-colors duration-500" style={{ backfaceVisibility: 'hidden' }}>

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

        <AaryaCategoryAccordion />

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
      <div id="section-about">
        <AboutSection />
      </div>

      {/* 6. Polaroid Grid Gallery Section */}
      <div id="section-gallery">
        <AaryaPolaroidGrid />
      </div>

      {/* 6.5 Video Showcase Section */}
      <div id="section-showcase">
        <AaryaVideoShowcase />
      </div>


      {/* 7. Preset Studio Color Correction Feature */}
      <div id="section-studio">
        <PresetStudio />
      </div>

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

