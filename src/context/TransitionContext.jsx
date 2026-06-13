import React, { createContext, useContext, useEffect, useRef } from 'react';
import { useBlocker, useLocation, useNavigate } from 'react-router-dom';
import gsap from 'gsap';

const TransitionContext = createContext(null);

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
  
  const overlayRef = useRef(null);
  const textRef = useRef(null);
  
  const isTransitioningRef = useRef(false);

  // Set up a global React Router Blocker to intercept ANY route change
  // This captures browser back/forward buttons, mouse navigation, link tags, and programmatic clicks.
  const blocker = useBlocker(({ currentLocation, nextLocation }) => {
    // Block if path is changing, and we are not already in the middle of executing a transition.
    return currentLocation.pathname !== nextLocation.pathname && !isTransitioningRef.current;
  });

  // Set initial state of the overlay on mount
  useEffect(() => {
    if (overlayRef.current) {
      gsap.set(overlayRef.current, { yPercent: 100 });
    }
    if (textRef.current) {
      gsap.set(textRef.current, { opacity: 0, scale: 1.15, letterSpacing: '0.35em' });
    }
  }, []);

  // Leave Hook (Exit Animation): Triggered whenever a route change is blocked
  useEffect(() => {
    if (blocker.state === 'blocked') {
      isTransitioningRef.current = true;
      window.isRouteTransition = true;

      // Reset styles and clear any active tweens for animation stability
      gsap.killTweensOf([overlayRef.current, textRef.current]);
      gsap.set(overlayRef.current, { yPercent: 100 });
      gsap.set(textRef.current, { opacity: 0, scale: 1.15, letterSpacing: '0.35em' });

      const tl = gsap.timeline({
        onComplete: () => {
          // Proceed with the blocked navigation once the viewport is completely covered
          blocker.proceed();
          window.scrollTo(0, 0);
        }
      });

      // 1. Slide the solid red curtain up to cover the screen (yPercent: 0)
      tl.to(overlayRef.current, {
        yPercent: 0,
        duration: 0.7,
        ease: 'sine.inOut',
        force3D: true,
        backfaceVisibility: 'hidden'
      });

      // 2. Fluidic Entrance: Stagger text fade-in, scale-down, and letter-spacing contraction
      tl.to(textRef.current, {
        opacity: 1,
        scale: 1,
        letterSpacing: '0.15em',
        duration: 0.5,
        ease: 'sine.out',
        force3D: true
      }, '-=0.3'); // Overlap with curtain slide for dynamic pacing
    }
  }, [blocker.state]);

  // Enter Hook (Entry Animation): Triggers after navigation proceeds and location updates in the DOM
  useEffect(() => {
    if (isTransitioningRef.current) {
      // Delay the entry transition by a short period (100ms) to guarantee
      // that the new route components are fully mounted, painted, and ready.
      const delayTimer = setTimeout(() => {
        gsap.killTweensOf([overlayRef.current, textRef.current]);
        
        const tl = gsap.timeline({
          onComplete: () => {
            // Reset overlay back to yPercent: 100 so it is ready for the next click
            gsap.set(overlayRef.current, { yPercent: 100 });
            isTransitioningRef.current = false;
            window.isRouteTransition = false;
            
            // Reset blocker state so it can block the next navigation
            if (blocker.reset) {
              blocker.reset();
            }
          }
        });

        // 1. Fade out the branding text and expand letter spacing fluidly
        tl.to(textRef.current, {
          opacity: 0,
          scale: 0.95,
          letterSpacing: '0.35em',
          duration: 0.3,
          ease: 'sine.in',
          force3D: true
        });

        // 2. Animate the overlay sliding up out of view off the top (yPercent: -100)
        tl.to(overlayRef.current, {
          yPercent: -100,
          duration: 0.7,
          ease: 'sine.inOut',
          force3D: true,
          backfaceVisibility: 'hidden'
        }, '-=0.1');
      }, 100);

      return () => clearTimeout(delayTimer);
    }
  }, [location.pathname]);

  // Fallback function for context consumers
  const transitionNavigate = (to) => {
    navigate(to);
  };

  return (
    <TransitionContext.Provider value={{ transitionNavigate }}>
      {children}
      
      {/* 
        Fixed Full-Screen Red Transition Overlay 
        Sits at a very high z-index (999999) to cover all page content and headers.
        Crucial: No inline 'transform' styles inside JSX so React re-renders on route change 
        do not overwrite GSAP's in-flight animations.
      */}
      <div 
        ref={overlayRef}
        className="transition-overlay fixed top-0 left-0 w-screen h-screen bg-[#FF0000] z-[999999] flex items-center justify-center pointer-events-none"
      >
        <h1 
          ref={textRef}
          className="branding-text text-white text-[7vw] md:text-[6vw] font-black opacity-0 leading-none select-none font-sans" 
          style={{ fontFamily: "'Anton', 'Impact', sans-serif" }}
        >
          EMAD SHAIKH
        </h1>
      </div>
    </TransitionContext.Provider>
  );
};
