import React, { useLayoutEffect, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

// ─── Global ScrollTrigger perf config (set once at module level) ───────────
ScrollTrigger.config({
  limitCallbacks: true,    // avoid firing callbacks more than necessary
  syncInterval: 150,       // ms between internal refresh syncs
  ignoreMobileResize: true // skip refresh on mobile virtual keyboard
});

export function AaryaLensReveal() {
  const containerRef      = useRef(null);
  const videoContainerRef = useRef(null);
  const lensUIRef         = useRef(null);
  const textLeftRef       = useRef(null);
  const textRightRef      = useRef(null);

  // ─── Perf fix: use refs for live display values instead of React state ───
  // setInterval + useState triggers a React re-render every second.
  // During scroll, that reconciliation overhead causes jank. Direct DOM
  // mutation via ref.current.textContent costs essentially zero.
  const counterRef = useRef(null);

  useEffect(() => {
    let count = 0;
    const updateCounter = () => {
      count++;
      if (counterRef.current) {
        const m = Math.floor(count / 60).toString().padStart(2, '0');
        const s = (count % 60).toString().padStart(2, '0');
        counterRef.current.textContent = `REC ${m}:${s}`;
      }
    };
    const ci = setInterval(updateCounter, 1000);
    return () => clearInterval(ci);
  }, []);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {

      // ─── GPU layer promotion ────────────────────────────────────────────
      // force3D writes a matrix3d transform which promotes to a dedicated
      // GPU compositor layer — transforms/opacity then cost zero paint.
      gsap.set(lensUIRef.current, {
        xPercent: -50, yPercent: -50, x: 0, y: 0,
        opacity: 1, visibility: 'visible',
        willChange: 'transform, opacity',
        force3D: true,
      });

      // will-change: clip-path tells Chrome to composite the clip-path circle
      // animation on the GPU (supported since Chrome 94). Without this, the
      // browser rasterizes the masked content in software every scroll tick.
      gsap.set(videoContainerRef.current, {
        willChange: 'clip-path, opacity',
        force3D: true,
      });

      gsap.set([textLeftRef.current, textRightRef.current], {
        willChange: 'transform, opacity, filter',
        filter: 'blur(0px)',
        force3D: true,
      });

      // Pre-promote viewfinder to GPU layer before we animate its opacity.
      // Without will-change, opacity animation falls back to software compositing.
      gsap.set('.viewfinder-ui', { willChange: 'opacity', force3D: true });

      // Reveal center text on load
      gsap.fromTo('.scroll-center-text',
        { opacity: 0 },
        { opacity: 0.8, duration: 2, ease: 'power2.out', delay: 0.5 }
      );

      // A separate timeline for the lens that is triggered by scroll but plays
      // automatically over 2.5 seconds, so the lens disappears smoothly without scrubbing.
      const lensTimeline = gsap.timeline({ paused: true });
      lensTimeline
        .to(lensUIRef.current, {
          scale: 3.2,
          opacity: 0,
          duration: 2.5,
          ease: 'power2.inOut',
          force3D: true,
        })
        .to('.lens-glass-layer', {
          opacity: 0,
          duration: 1.75,
          ease: 'power2.inOut',
          force3D: true,
        }, '<')
        .to('.viewfinder-ui', {
          opacity: 0,
          duration: 1.5,
          ease: 'power2.inOut',
          force3D: true,
        }, '<');

      let lensFaded = false;

      // ─── Main ScrollTrigger timeline ────────────────────────────────────
      // scrub: 0.5 → half-second catchup = highly responsive scroll control.
      // pin: true → pins the hero section during the scroll reveal.
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: '+=120%',
          pin: true,
          scrub: 0.5,
          anticipatePin: 1,
          onUpdate: (self) => {
            // Trigger the lens zoom/fade automatically over 2.5 seconds when scroll starts
            if (self.progress > 0.05) {
              if (!lensFaded) {
                lensFaded = true;
                gsap.killTweensOf(lensTimeline);
                gsap.to(lensTimeline, { progress: 1, duration: 2.5, ease: 'power1.out', overwrite: 'auto' });
              }
            } else {
              // Revert the lens back to original state if scrolled back to the top (brings the lens back in over 0.5 seconds)
              if (lensFaded) {
                lensFaded = false;
                gsap.killTweensOf(lensTimeline);
                gsap.to(lensTimeline, { progress: 0, duration: 0.5, ease: 'power1.out', overwrite: 'auto' });
              }
            }
          }
        }
      });

      // 1. The Reveal — clip-path circle expanding (GPU-composited via will-change)
      tl.fromTo(videoContainerRef.current, {
        clipPath: 'circle(25.8vmin at 50% 50%)',
        opacity: 0.85,
      }, {
        clipPath: 'circle(150vmin at 50% 50%)',
        opacity: 1,
        duration: 1,
        ease: 'sine.inOut',
        force3D: true,
      }, '<0.3')

      // 2. Center scroll text rises up
      .to('.scroll-center-text', {
        y: -1000,
        opacity: 0,
        duration: 0.9,
        ease: 'sine.inOut',
        force3D: true,
      }, '<0')

      // 3. EMAD flies upward — function-based dynamic pixel value guarantees resize responsiveness
      .to(textLeftRef.current, {
        y: () => -(window.innerHeight * 1.2),
        opacity: 0,
        filter: 'blur(20px)',
        duration: 0.55,
        ease: 'power2.in',
        force3D: true,
      }, 0)

      // 3b. SHAIKH flies downward — function-based dynamic pixel value
      .to(textRightRef.current, {
        y: () => window.innerHeight * 1.2,
        opacity: 0,
        filter: 'blur(20px)',
        duration: 0.55,
        ease: 'power2.in',
        force3D: true,
      }, 0);

      // 7. Cleanup — We intentionally do not use .set(..., { visibility: 'hidden' })
      //    or clear the will-change properties on completion. By avoiding abrupt visibility
      //    toggles and keeping GPU layers promoted, the animation remains perfectly smooth
      //    with zero style-recalculation lag when scrolling in and out in both directions.

      // ─── Mouse Parallax ─────────────────────────────────────────────────
      const container = containerRef.current;
      let rafId = null;
      const st = tl.scrollTrigger;

      const handleMouseMove = (e) => {
        // Kill parallax once scroll animation starts — prevents two animation
        // systems fighting each other on the same elements
        if (st && st.progress > 0.05) return;
        if (rafId) cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(() => {
          const xPos = (e.clientX / window.innerWidth) - 0.5;
          const yPos = (e.clientY / window.innerHeight) - 0.5;
          gsap.to('.giant-text-container', { x: xPos * -10, y: yPos * -10, duration: 0.6, ease: 'sine.out', overwrite: 'auto', force3D: true });
          gsap.to(lensUIRef.current,        { x: xPos *   4, y: yPos *   4, duration: 0.6, ease: 'sine.out', overwrite: 'auto', force3D: true });
          gsap.to(videoContainerRef.current,{ x: xPos *   2, y: yPos *   2, duration: 0.6, ease: 'sine.out', overwrite: 'auto', force3D: true });
          gsap.to('.viewfinder-ui',         { x: xPos *   6, y: yPos *   6, duration: 0.6, ease: 'sine.out', overwrite: 'auto', force3D: true });
        });
      };

      const handleMouseLeave = () => {
        if (rafId) cancelAnimationFrame(rafId);
        gsap.to(['.giant-text-container', lensUIRef.current, videoContainerRef.current, '.viewfinder-ui'], {
          x: 0, y: 0, duration: 0.6, ease: 'sine.out', overwrite: 'auto', force3D: true
        });
      };

      container.addEventListener('mousemove', handleMouseMove, { passive: true });
      container.addEventListener('mouseleave', handleMouseLeave);

      return () => {
        if (rafId) cancelAnimationFrame(rafId);
        container.removeEventListener('mousemove', handleMouseMove);
        container.removeEventListener('mouseleave', handleMouseLeave);
        gsap.killTweensOf(lensTimeline);
        lensTimeline.kill();
      };

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-screen bg-[#090909] overflow-hidden text-white font-sans selection:bg-red-600 selection:text-white"
      style={{
        // contain:layout+style+paint isolates this section as a self-contained
        // rendering root — scroll/style changes inside don't cascade out to
        // the rest of the DOM, eliminating cross-tree layout recalculations.
        contain: 'layout style paint',
        transform: 'translateZ(0)', // promote to own GPU compositing layer
      }}
    >

      {/* ── Giant Typography ─────────────────────────────────────────────── */}
      <div className="giant-text-container absolute inset-0 z-[60] pointer-events-none px-4 md:px-10">
        <div className="flex justify-between w-full relative h-full">

          <div ref={textLeftRef} className="absolute top-[10%] left-[2%] z-0">
            <h1
              className="text-[24vw] md:text-[17vw] leading-[0.8] font-black text-[#FF0000]"
              style={{
                fontFamily: "'Impact', 'Oswald', 'Anton', sans-serif",
                // PERF: CSS filter:drop-shadow() on an animated element creates a
                // new stacking context and forces software rasterization every frame.
                // textShadow is compositor-friendly and achieves the identical glow look.
                textShadow: '0px 0px 15px rgba(255, 0, 0, 0.45), 0px 0px 30px rgba(255, 0, 0, 0.18)',
              }}
            >
              EMAD
            </h1>
          </div>

          <div ref={textRightRef} className="absolute bottom-[10%] right-[2%] text-right z-0">
            <h1
              className="text-[24vw] md:text-[17vw] leading-[0.8] font-black text-[#FF0000]"
              style={{
                fontFamily: "'Impact', 'Oswald', 'Anton', sans-serif",
                textShadow: '0px 0px 15px rgba(255, 0, 0, 0.45), 0px 0px 30px rgba(255, 0, 0, 0.18)',
              }}
            >
              SHAIKH
            </h1>
          </div>

        </div>
      </div>

      {/* ── Viewfinder UI ────────────────────────────────────────────────── */}
      <div className="viewfinder-ui absolute inset-0 z-30 pointer-events-none p-6 md:p-10 flex flex-col justify-between text-[10px] md:text-xs text-white/80 font-mono tracking-[0.2em] uppercase">
        {/* Calibration axis lines */}
        <div className="absolute top-1/2 left-12 right-12 h-[1px] border-t border-dashed border-white/10 -translate-y-1/2 pointer-events-none" />
        <div className="absolute left-1/2 top-12 bottom-12 w-[1px] border-l border-dashed border-white/10 -translate-x-1/2 pointer-events-none" />

        {/* Concentric guide circles */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[76vmin] h-[76vmin] rounded-full border border-dashed border-white/15 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vmin] h-[80vmin] rounded-full border border-dashed border-white/5 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[84vmin] h-[84vmin] rounded-full border border-dashed border-white/10 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[92vmin] h-[92vmin] rounded-full border border-dashed border-white/5 pointer-events-none" />

        {/* Top Row */}
        <div className="flex justify-between items-start">
          <div className="flex flex-col gap-1 leading-relaxed z-10">
            <span>50MM LENS</span>
            <span>f/1.4 APERTURE</span>
          </div>
          {/* PERF: Removed backdrop-blur-sm — blur filters create separate compositor
              layers and re-composite on every repaint. Solid bg looks identical. */}
          <div className="hidden md:flex items-center gap-2 text-[#FF0000] font-bold bg-black/60 px-2 py-1 rounded z-10">
            <div className="w-2.5 h-2.5 rounded-full bg-[#FF0000] animate-pulse" />
            <span>[REC]</span>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="flex justify-between items-end">
          <div className="flex flex-col gap-1 leading-relaxed z-10">
            <span>SHUTTER: 1/2500</span>
            <span>ISO: 3200</span>
            <span>AWB: AUTO</span>
          </div>
          {/* Mobile-only REC badge on bottom right */}
          <div className="flex md:hidden items-center gap-2 text-[#FF0000] font-bold bg-black/60 px-2 py-1 rounded z-10">
            <div className="w-2.5 h-2.5 rounded-full bg-[#FF0000] animate-pulse" />
            <span>[REC]</span>
          </div>
        </div>
      </div>

      {/* ── Center Element (Lens Cap + Video Sensor) ─────────────────────── */}
      <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">

        {/* Video Container — clip-path composited on GPU via will-change: clip-path */}
        <div
          ref={videoContainerRef}
          className="absolute inset-0 w-full h-full overflow-hidden bg-neutral-900 pointer-events-auto"
          style={{ willChange: 'clip-path, opacity' }}
        >
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover opacity-90"
          > 
            {/* <source src="https://www.pexels.com/download/video/37898716/" type="video/mp4" /> */}
          </video>

          {/* Dark overlay — PERF: removed mix-blend-multiply which forces the browser
              to execute a full compositing merge pass on every repaint. Plain bg-black/20
              renders identically since both just darken the underlying image. */}
          <div className="absolute inset-0 bg-black/20 pointer-events-none" />

          {/* Inner shadow for physical depth */}
          <div className="absolute inset-0 shadow-[inset_0_0_60px_rgba(0,0,0,0.9)] pointer-events-none" />

          {/* Retro VHS overlay */}
          <div className="absolute inset-0 z-40 pointer-events-none p-8 md:p-12">
            <style dangerouslySetInnerHTML={{__html: `
              @import url('https://fonts.googleapis.com/css?family=Press+Start+2P');
              @keyframes rgbText {
                0%, 25%, 55% { text-shadow: -1px 1px 8px rgba(255,255,255,0.6), 1px -1px 8px rgba(255,255,235,0.7), 0px 0 3px rgba(251,0,231,0.8), 0 0px 3px rgba(0,233,235,0.8), 0px 0 3px rgba(0,242,14,0.8), 0 0px 3px rgba(244,45,0,0.8), 0px 0 3px rgba(59,0,226,0.8); }
                45%, 90%, 100% { text-shadow: -1px 1px 8px rgba(255,255,255,0.6), 1px -1px 8px rgba(255,255,235,0.7), 5px 0 1px rgba(251,0,231,0.8), 0 5px 1px rgba(0,233,235,0.8), -5px 0 1px rgba(0,242,14,0.8), 0 5px 1px rgba(244,45,0,0.8), -5px 0 1px rgba(59,0,226,0.8); }
                50% { text-shadow: -1px 1px 8px rgba(255,255,255,0.6), 1px -1px 8px rgba(255,255,235,0.7), -5px 0 1px rgba(251,0,231,0.8), 0 -5px 1px rgba(0,233,235,0.8), 5px 0 1px rgba(0,242,14,0.8), 0 5px 1px rgba(244,45,0,0.8), -5px 0 1px rgba(59,0,226,0.8); }
              }
              @keyframes type {
                0%, 19% { opacity: 0; }
                20%, 100% { opacity: 1; }
              }
              .vhs-rgb-text {
                font-family: 'Press Start 2P', monospace;
                will-change: text-shadow;
                color: white;
                font-size: 12px;
                letter-spacing: 0.1em;
                animation: rgbText 1s steps(9) 0s infinite alternate;
              }
              .vhs-rgb-text-slow {
                font-family: 'Press Start 2P', monospace;
                will-change: text-shadow;
                color: white;
                font-size: 12px;
                letter-spacing: 0.1em;
                animation: rgbText 2s steps(9) 0s infinite alternate;
              }
              @media (min-width: 768px) {
                .vhs-rgb-text, .vhs-rgb-text-slow { font-size: 16px; }
              }
            `}} />

            {/* PERF: ref-driven DOM update — zero React re-renders on every tick */}
            <div ref={counterRef} className="absolute left-6 bottom-6 md:left-8 md:bottom-8 vhs-rgb-text">
              REC 00:00
            </div>

            <div className="absolute right-6 bottom-6 md:right-8 md:bottom-8 flex items-center gap-2 md:gap-4 vhs-rgb-text-slow">
              <div className="w-3 h-3 md:w-5 md:h-5 rounded-full bg-red-600 animate-[pulse_2s_cubic-bezier(0.4,0,0.6,1)_infinite] drop-shadow-[0_0_8px_rgba(255,0,0,0.8)]" />
              <div className="flex">
                {"REC".split('').map((char, index) => (
                  <span
                    key={index}
                    className="animate-[type_1.2s_infinite_alternate]"
                    style={{ animationDelay: `${index * 60}ms` }}
                  >
                    {char}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Hero typography inside the video sensor */}
          <div className="absolute inset-x-0 bottom-[15%] md:bottom-[10%] z-50 flex flex-col items-center justify-center pointer-events-auto px-4">
            <h1
              className="text-[16vw] md:text-[9vw] leading-none text-white text-center mb-4 md:mb-6 pointer-events-none"
              style={{
                fontFamily: "'Ephesis', cursive",
                fontWeight: 400,
                textShadow: '0px 4px 20px rgba(0, 0, 0, 0.8)'
              }}
            >
              Emad Shaikh
            </h1>
            {/* PERF: removed backdrop-blur-sm — see viewfinder note above */}
            <button className="flex items-center gap-2 px-6 py-2 rounded-full bg-black/40 border border-white/10 text-white font-sans text-xs md:text-sm font-semibold tracking-widest hover:bg-black/60 transition-all duration-300 uppercase shadow-lg">
              LET'S CREATE <ArrowUpRight className="w-4 h-4 md:w-5 md:h-5" />
            </button>
          </div>
        </div>

        {/* ── Cinematic Lens SVG ──────────────────────────────────────────── */}
        <div
          ref={lensUIRef}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[75vmin] h-[75vmin] pointer-events-none z-10 overflow-visible"
        >
          {/* PERF: removed drop-shadow-[...] Tailwind class from svg element.
              CSS filter:drop-shadow on a scaled SVG forces the browser to re-rasterize
              the entire SVG at each new scale value during the zoom animation. */}
          <svg viewBox="0 0 800 800" className="w-full h-full overflow-visible">
            <defs>
              {/* PERF: feGaussianBlur SVG filter REMOVED.
                  SVG filters are rasterized in software — when the lens SVG scales
                  to 20x during scroll, the browser would re-rasterize a 20x-sized
                  blurred element every single frame. Visual parity kept via slightly
                  brighter stroke color on the inner ring. */}
              <linearGradient id="barrelGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%"   stopColor="#2a2a2a" />
                <stop offset="30%"  stopColor="#0a0a0a" />
                <stop offset="70%"  stopColor="#050505" />
                <stop offset="100%" stopColor="#1a1a1a" />
              </linearGradient>
              <radialGradient id="coatingReflect" cx="35%" cy="35%" r="65%">
                <stop offset="0%"   stopColor="#a855f7" stopOpacity="0.25" />
                <stop offset="40%"  stopColor="#3b82f6" stopOpacity="0.18" />
                <stop offset="75%"  stopColor="#14b8a6" stopOpacity="0.08" />
                <stop offset="100%" stopColor="#000000" stopOpacity="0.45" />
              </radialGradient>
              <linearGradient id="flareGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%"   stopColor="#06b6d4" stopOpacity="0.2" />
                <stop offset="50%"  stopColor="#3b82f6" stopOpacity="0.02" />
                <stop offset="100%" stopColor="#ec4899" stopOpacity="0.12" />
              </linearGradient>
              <radialGradient id="innerDepth" cx="60%" cy="60%" r="40%">
                <stop offset="0%"   stopColor="#ffffff" stopOpacity="0.08" />
                <stop offset="100%" stopColor="#000000" stopOpacity="0.0"  />
              </radialGradient>
            </defs>

            {/* Gear teeth */}
            <circle cx="400" cy="400" r="385" fill="none" stroke="#0a0a0a" strokeWidth="15" strokeDasharray="4 6" />

            {/* Outer barrel */}
            <circle cx="400" cy="400" r="305" fill="none" stroke="url(#barrelGrad)" strokeWidth="150" />

            <g className="lens-details-to-hide">
              <circle cx="400" cy="400" r="370" fill="none" stroke="#222222" strokeWidth="1" />
              <circle cx="400" cy="400" r="368" fill="none" stroke="#111111" strokeWidth="1" />
              <circle cx="400" cy="400" r="360" fill="none" stroke="#333333" strokeWidth="0.5" />
              <circle cx="400" cy="400" r="350" fill="none" stroke="#222222" strokeWidth="1" />
              <circle cx="400" cy="400" r="315" fill="none" stroke="#1c1c1c" strokeWidth="2" />
              <circle cx="400" cy="400" r="280" fill="none" stroke="#333333" strokeWidth="0.5" />

              <g fill="#888888" fontSize="7.5" fontWeight="bold" fontFamily="monospace" letterSpacing="0.15em" textAnchor="middle">
                <text x="400" y="70">FE 50mm F1.4 GM</text>
              </g>
              <g fill="#666666" fontSize="7" fontWeight="bold" fontFamily="monospace" letterSpacing="0.1em" textAnchor="middle">
                <text x="400" y="730">MADE IN JAPAN · S/N 9031804</text>
                <text x="400" y="742" fill="#444444" fontSize="6" letterSpacing="0.2em">E-MOUNT SYSTEM</text>
              </g>

              <g fill="#666666" fontSize="8" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
                <g transform="rotate(-40 400 400)"><text x="400" y="325">f/1.4</text></g>
                <g transform="rotate(-25 400 400)"><text x="400" y="325">2</text></g>
                <g transform="rotate(-10 400 400)"><text x="400" y="325">2.8</text></g>
                <g transform="rotate(5 400 400)">
                  <text x="400" y="325" fill="#ffffff">4</text>
                  <line x1="400" y1="332" x2="400" y2="340" stroke="#888888" strokeWidth="1.5" />
                </g>
                <g transform="rotate(20 400 400)"><text x="400" y="325">5.6</text></g>
                <g transform="rotate(35 400 400)"><text x="400" y="325">8</text></g>
                <g transform="rotate(50 400 400)"><text x="400" y="325">11</text></g>
                <g transform="rotate(65 400 400)"><text x="400" y="325">16</text></g>
              </g>

              <g transform="translate(350, 110)" opacity="0.8">
                <rect x="0" y="0" width="100" height="22" fill="#080808" stroke="#222222" strokeWidth="1.5" rx="3" />
                <line x1="50" y1="0" x2="50" y2="22" stroke="#666666" strokeWidth="1" />
                <text x="15" y="14" fill="#888888" fontSize="8" fontWeight="bold" fontFamily="monospace">1.5m</text>
                <text x="50" y="14" fill="#ffffff" fontSize="8" fontWeight="bold" fontFamily="monospace" textAnchor="middle">3m</text>
                <text x="85" y="14" fill="#666666" fontSize="8" fontWeight="bold" fontFamily="monospace" textAnchor="end">∞</text>
              </g>
            </g>

            <g className="lens-glass-layer">
              <circle cx="400" cy="400" r="230" fill="url(#coatingReflect)" />
              <circle cx="400" cy="400" r="230" fill="url(#flareGrad)" />

              {/* PERF: Removed inline filter="blur()" from these paths.
                  Inline SVG filter blur on individual paths forces a software raster
                  pass per element. Slightly lower opacity preserves the soft look. */}
              <path d="M 237 280 A 230 230 0 0 1 563 280 A 220 220 0 0 0 237 280 Z" fill="#ffffff" opacity="0.13" />
              <path d="M 270 230 A 230 230 0 0 1 430 180 A 224 224 0 0 0 270 230 Z" fill="#ffffff" opacity="0.22" />
              <path d="M 370 620 A 230 230 0 0 1 570 530 A 226 226 0 0 0 370 620 Z" fill="#ec4899" opacity="0.11" />

              <circle cx="400" cy="400" r="160" fill="none" stroke="#ffffff" strokeWidth="0.5" opacity="0.12" />
              <circle cx="400" cy="400" r="100" fill="none" stroke="#ffffff" strokeWidth="0.5" opacity="0.08" />
              <circle cx="360" cy="360" r="120" fill="url(#innerDepth)" />
            </g>

            {/* Inner blue rings — filter="url(#glow)" REMOVED (feGaussianBlur, see above).
                Compensated with slightly brighter stroke #2d5a6e vs original #254252. */}
            <circle cx="400" cy="400" r="230" fill="none" stroke="#2d5a6e" strokeWidth="2.5" />
            <circle cx="400" cy="400" r="235" fill="none" stroke="#254252" strokeWidth="1" opacity="0.5" />
            <circle cx="400" cy="400" r="240" fill="none" stroke="#1c3341" strokeWidth="4" />

            <circle cx="400" cy="400" r="242" fill="none" stroke="#333" strokeWidth="4" />
            <circle cx="400" cy="400" r="245" fill="none" stroke="#000" strokeWidth="2" />
            <circle cx="400" cy="400" r="338" fill="none" stroke="#000" strokeWidth="3" />
            <circle cx="400" cy="400" r="340" fill="none" stroke="#444" strokeWidth="2" />
            <circle cx="400" cy="400" r="345" fill="none" stroke="#333" strokeWidth="1" />
            <circle cx="400" cy="400" r="375" fill="none" stroke="#222" strokeWidth="1" />

            {/* Tick marks & distances */}
            <g fill="none" stroke="#666" strokeWidth="1" fontSize="10" fontFamily="monospace" textAnchor="middle" dominantBaseline="middle">
              <line x1="400" y1="25"  x2="400" y2="40"  stroke="#FF0000" strokeWidth="2" />
              <line x1="400" y1="760" x2="400" y2="775" stroke="#FF0000" strokeWidth="2" />
              <line x1="25"  y1="400" x2="40"  y2="400" stroke="#FF0000" strokeWidth="2" />
              <line x1="760" y1="400" x2="775" y2="400" stroke="#FF0000" strokeWidth="2" />
              <g transform="rotate(30 400 400)"><line x1="400" y1="35" x2="400" y2="40" /><text x="400" y="22" fill="#888" transform="rotate(-30 400 22)">3m</text></g>
              <g transform="rotate(60 400 400)"><line x1="400" y1="35" x2="400" y2="40" /><text x="400" y="22" fill="#888" transform="rotate(-60 400 22)">2m</text></g>
              <g transform="rotate(120 400 400)"><line x1="400" y1="35" x2="400" y2="40" /><text x="400" y="22" fill="#888" transform="rotate(-120 400 22)">1m</text></g>
              <g transform="rotate(210 400 400)"><line x1="400" y1="35" x2="400" y2="40" /><text x="400" y="22" fill="#888" transform="rotate(-210 400 22)">.8</text></g>
              <g transform="rotate(240 400 400)"><line x1="400" y1="35" x2="400" y2="40" /><text x="400" y="22" fill="#888" transform="rotate(-240 400 22)">.6</text></g>
              <g transform="rotate(290 400 400)"><line x1="400" y1="35" x2="400" y2="40" /><text x="400" y="22" fill="#888" transform="rotate(-290 400 22)">.4</text></g>
              <g transform="rotate(-30 400 400)"><line x1="400" y1="35" x2="400" y2="40" /><text x="400" y="22" fill="#888" transform="rotate(30 400 22)">5m</text></g>
              <g transform="rotate(-60 400 400)"><line x1="400" y1="35" x2="400" y2="40" /><text x="400" y="22" fill="#888" transform="rotate(60 400 22)">∞</text></g>
            </g>

            <text x="120" y="404" fill="#666" fontSize="10" fontFamily="monospace" letterSpacing="0.1em" textAnchor="middle">50MM · SUMMILUX</text>
            <text x="680" y="404" fill="#666" fontSize="10" fontFamily="monospace" letterSpacing="0.1em" textAnchor="middle">F/1.4 · 1/250S · ISO 3</text>
            <text x="400" y="790" fill="#666" fontSize="10" fontFamily="monospace" letterSpacing="0.1em" textAnchor="middle">SONY · FE 50mm · f/1.4 GM · Ø82</text>

            {/* Scroll to begin — breathing animation */}
            <g className="scroll-center-text" style={{ transformOrigin: '400px 400px' }}>
              <style dangerouslySetInnerHTML={{__html: `
                @keyframes breatheRefined {
                  0%   { transform: scale(0.97); opacity: 0.45; }
                  100% { transform: scale(1.02); opacity: 0.85; }
                }
                .breathe-group {
                  transform-origin: 400px 395px;
                  animation: breatheRefined 3s ease-in-out infinite alternate;
                }
              `}} />
              <g className="breathe-group">
                <circle cx="400" cy="380" r="14" fill="none" stroke="#ffffff" strokeWidth="1" strokeDasharray="2 3" opacity="0.5" />
                <circle cx="400" cy="380" r="1.5" fill="#ffffff" opacity="0.6" />
                <text
                  x="400" y="415"
                  fill="#ffffff" fillOpacity="0.7"
                  fontSize="9" fontWeight="bold"
                  fontFamily="monospace" letterSpacing="0.3em"
                  textAnchor="middle" dominantBaseline="middle"
                  style={{ textShadow: '0 0 8px rgba(255,255,255,0.4)' }}
                >
                  SCROLL TO BEGIN
                </text>
              </g>
            </g>
          </svg>
        </div>

        {/* Vignette overlay — PERF: removed mix-blend-multiply.
            mix-blend-multiply forces the browser to execute a full compositor
            blend pass on every repaint of anything underneath. Since the blend
            color is pure black, the visual result is identical without it. */}
        <div className="absolute inset-0 z-45 pointer-events-none shadow-[inset_0_0_100px_rgba(0,0,0,0.7)] opacity-90" />

        {/* Film grain — contained + slowed cadence for lower compositing budget */}
        <div className="absolute inset-0 z-45 pointer-events-none overflow-hidden" style={{ contain: 'strict' }}>
          <style dangerouslySetInnerHTML={{__html: `
            @keyframes grainAnim {
              0%   { transform: translate(0,    0)   }
              25%  { transform: translate(-4%,  3%)  }
              50%  { transform: translate( 3%, -5%)  }
              75%  { transform: translate(-2%,  6%)  }
              100% { transform: translate( 5%, -2%)  }
            }
            .grain-overlay {
              position: absolute;
              top: -50%; left: -50%;
              width: 200%; height: 200%;
              background: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
              opacity: 0.04;
              pointer-events: none;
              will-change: transform;
              animation: grainAnim 1.2s steps(4) infinite;
            }
          `}} />
          <div className="grain-overlay" />
        </div>

      </div>
    </div>
  );
}
