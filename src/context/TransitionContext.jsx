import React, { createContext, useContext, useEffect, useLayoutEffect, useRef } from 'react';
import { useBlocker, useLocation, useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const TransitionContext = createContext(null);

const updateBrowserThemeColor = (color) => {
  let metaTheme = document.querySelector('meta[name="theme-color"]');
  if (!metaTheme) {
    metaTheme = document.createElement('meta');
    metaTheme.setAttribute('name', 'theme-color');
    document.head.appendChild(metaTheme);
  }
  metaTheme.setAttribute('content', color);

  const metaTile = document.querySelector('meta[name="msapplication-TileColor"]');
  if (metaTile) {
    metaTile.setAttribute('content', color);
  }

  if (document.body) {
    document.body.style.backgroundColor = color;
  }
  if (document.documentElement) {
    document.documentElement.style.backgroundColor = color;
  }
};

export const useTransitionNavigate = () => {
  const context = useContext(TransitionContext);
  if (!context) {
    throw new Error('useTransitionNavigate must be used within a TransitionProvider');
  }
  return context.transitionNavigate;
};

export const TransitionProvider = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const overlay1Ref = useRef(null);
  const overlay2Ref = useRef(null);
  const overlay3Ref = useRef(null);
  const overlay4Ref = useRef(null);
  const overlay5Ref = useRef(null);
  const textRef = useRef(null);
  
  const isTransitioningRef = useRef(false);

  // Set up a global React Router Blocker to intercept ANY route change
  const blocker = useBlocker(({ currentLocation, nextLocation }) => {
    // Block if path is changing, and we are not already in the middle of executing a transition.
    return currentLocation.pathname !== nextLocation.pathname && !isTransitioningRef.current;
  });

  // Set initial state of the overlays on mount synchronously before paint
  useLayoutEffect(() => {
    gsap.set([
      overlay1Ref.current,
      overlay2Ref.current,
      overlay3Ref.current,
      overlay4Ref.current,
      overlay5Ref.current
    ], { yPercent: 100 });
    gsap.set(textRef.current, { opacity: 0, scale: 1.15, letterSpacing: '0.05em' });
    
    // Set initial theme color to dark page background on clean mount
    updateBrowserThemeColor('#050505');
  }, []);

  // Leave Hook (Exit Animation): Triggered whenever a route change is blocked
  useEffect(() => {
    if (blocker.state === 'blocked') {
      isTransitioningRef.current = true;
      window.isRouteTransition = true;

      // Set browser theme color to match the red transition overlay immediately
      updateBrowserThemeColor('#FF0000');

      // Reset styles and clear any active tweens for animation stability
      gsap.killTweensOf([
        overlay1Ref.current,
        overlay2Ref.current,
        overlay3Ref.current,
        overlay4Ref.current,
        overlay5Ref.current,
        textRef.current
      ]);
      gsap.set([
        overlay1Ref.current,
        overlay2Ref.current,
        overlay3Ref.current,
        overlay4Ref.current,
        overlay5Ref.current
      ], { yPercent: 100 });
      gsap.set(textRef.current, { opacity: 0, scale: 1.15, letterSpacing: '0.05em' });

      const tl = gsap.timeline({
        onComplete: () => {
          // Proceed with the blocked navigation once the viewport is completely covered
          blocker.proceed();
          window.scrollTo(0, 0);
        }
      });

      // 1. Staggered slide up of the 5 transition panels
      tl.to(overlay1Ref.current, {
        yPercent: 0,
        duration: 0.65,
        ease: 'power3.inOut',
        force3D: true,
      })
      .to(overlay2Ref.current, {
        yPercent: 0,
        duration: 0.65,
        ease: 'power3.inOut',
        force3D: true,
      }, '-=0.52')
      .to(overlay3Ref.current, {
        yPercent: 0,
        duration: 0.65,
        ease: 'power3.inOut',
        force3D: true,
      }, '-=0.52')
      .to(overlay4Ref.current, {
        yPercent: 0,
        duration: 0.65,
        ease: 'power3.inOut',
        force3D: true,
      }, '-=0.52')
      .to(overlay5Ref.current, {
        yPercent: 0,
        duration: 0.65,
        ease: 'power3.inOut',
        force3D: true,
      }, '-=0.52')

      // 2. Fluidic Entrance: Stagger text fade-in, scale-down, and letter-spacing contraction
      .to(textRef.current, {
        opacity: 1,
        scale: 1,
        letterSpacing: '-0.05em',
        duration: 0.5,
        ease: 'power2.out',
        force3D: true
      }, '-=0.35'); // Overlap with curtain slide for dynamic pacing
    }
  }, [blocker.state]);

  // Enter Hook (Entry Animation): Triggers after navigation proceeds and location updates in the DOM
  useEffect(() => {
    if (isTransitioningRef.current) {
      // Delay the entry transition by a short period (100ms) to guarantee
      // that the new route components are fully mounted, painted, and ready.
      const delayTimer = setTimeout(() => {
        gsap.killTweensOf([
          overlay1Ref.current,
          overlay2Ref.current,
          overlay3Ref.current,
          overlay4Ref.current,
          overlay5Ref.current,
          textRef.current
        ]);
        
        const tl = gsap.timeline({
          onComplete: () => {
            // Reset overlays back to yPercent: 100 so they are ready for the next click
            gsap.set([
              overlay1Ref.current,
              overlay2Ref.current,
              overlay3Ref.current,
              overlay4Ref.current,
              overlay5Ref.current
            ], { yPercent: 100 });
            isTransitioningRef.current = false;
            window.isRouteTransition = false;
            
            // Restore theme color back to dark page background when transition finishes
            updateBrowserThemeColor('#050505');
            
            // Reset blocker state so it can block the next navigation
            if (blocker.reset) {
              blocker.reset();
            }

            // Force ScrollTrigger to recalculate and refresh triggers based on the new page layout
            ScrollTrigger.refresh();
          }
        });

        // 1. Fade out the branding text and expand letter spacing fluidly
        tl.to(textRef.current, {
          opacity: 0,
          scale: 0.95,
          letterSpacing: '0.05em',
          duration: 0.3,
          ease: 'power2.in',
          force3D: true
        });

        // 2. Staggered slide up and away of the 5 transition panels (out off the top)
        tl.to(overlay5Ref.current, {
          yPercent: -100,
          duration: 0.65,
          ease: 'power3.inOut',
          force3D: true,
        }, '-=0.15')
        .to(overlay4Ref.current, {
          yPercent: -100,
          duration: 0.65,
          ease: 'power3.inOut',
          force3D: true,
        }, '-=0.52')
        .to(overlay3Ref.current, {
          yPercent: -100,
          duration: 0.65,
          ease: 'power3.inOut',
          force3D: true,
        }, '-=0.52')
        .to(overlay2Ref.current, {
          yPercent: -100,
          duration: 0.65,
          ease: 'power3.inOut',
          force3D: true,
        }, '-=0.52')
        .to(overlay1Ref.current, {
          yPercent: -100,
          duration: 0.65,
          ease: 'power3.inOut',
          force3D: true,
        }, '-=0.52');
      }, 100);

      return () => clearTimeout(delayTimer);
    }
  }, [location.pathname]);

  // Fallback function for context consumers
  const transitionNavigate = (to) => {
    if (!isTransitioningRef.current) {
      navigate(to);
    }
  };

  return (
    <TransitionContext.Provider value={{ transitionNavigate }}>
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@800;900&display=swap');
      ` }} />
      {children}
      
      {/* Layer 1: Extremely dark cherry/black-red (Stagger Start) */}
      <div 
        ref={overlay1Ref}
        className="transition-overlay-1 fixed top-0 left-0 w-screen h-screen bg-[#150002] z-[999995] pointer-events-none"
      />

      {/* Layer 2: Deep maroon-burgundy */}
      <div 
        ref={overlay2Ref}
        className="transition-overlay-2 fixed top-0 left-0 w-screen h-screen bg-[#420005] z-[999996] pointer-events-none"
      />

      {/* Layer 3: Rich classic crimson */}
      <div 
        ref={overlay3Ref}
        className="transition-overlay-3 fixed top-0 left-0 w-screen h-screen bg-[#78000b] z-[999997] pointer-events-none"
      />

      {/* Layer 4: Strong scarlet red */}
      <div 
        ref={overlay4Ref}
        className="transition-overlay-4 fixed top-0 left-0 w-screen h-screen bg-[#b80010] z-[999998] pointer-events-none"
      />

      {/* Layer 5: Vibrant brand scarlet red (Foreground with signature) */}
      <div 
        ref={overlay5Ref}
        className="transition-overlay-5 fixed top-0 left-0 w-screen h-screen bg-[#FF0000] z-[999999] flex flex-col items-center justify-center pointer-events-none"
      >
        {/* Subtle scanline/noise effect overlay on the transition panel to make it feel tactile */}
        <div className="absolute inset-0 bg-black/5 pointer-events-none mix-blend-overlay" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-black/10 pointer-events-none" />

        <h1 
          ref={textRef}
          className="branding-text text-white text-[12vw] md:text-[8vw] font-black lowercase tracking-tighter opacity-0 leading-none select-none" 
          style={{ 
            fontFamily: "'Outfit', sans-serif",
            fontWeight: 900,
            textShadow: '0 0 20px rgba(255,255,255,0.35)',
          }}
        >
          emad shaikh.
        </h1>
      </div>
    </TransitionContext.Provider>
  );
};
