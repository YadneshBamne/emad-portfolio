import React, { useLayoutEffect, useRef, useState, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export function AaryaLensReveal() {
  const containerRef = useRef(null);
  const videoContainerRef = useRef(null);
  const lensUIRef = useRef(null);
  const textLeftRef = useRef(null);
  const textRightRef = useRef(null);

  const [time, setTime] = useState('');
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    const updateTime = () => {
      const today = new Date();
      const h = today.getHours().toString().padStart(2, '0');
      const m = today.getMinutes().toString().padStart(2, '0');
      const s = today.getSeconds().toString().padStart(2, '0');
      setTime(`${h}:${m}:${s}`);
    };
    
    updateTime();
    const timeInterval = setInterval(updateTime, 1000);
    const counterInterval = setInterval(() => {
      setCounter(prev => prev + 1);
    }, 1000);

    return () => {
      clearInterval(timeInterval);
      clearInterval(counterInterval);
    };
  }, []);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Pre-set GPU acceleration and centering translations for animated elements
      gsap.set(lensUIRef.current, { xPercent: -50, yPercent: -50, x: 0, y: 0 });
      gsap.set([videoContainerRef.current, textLeftRef.current, textRightRef.current], {
        willChange: 'transform, opacity, filter',
        force3D: true,
        backfaceVisibility: 'hidden'
      });

      // Reveal center text on load (only opacity so we don't overwrite SVG scale)
      gsap.fromTo('.scroll-center-text', {
        opacity: 0,
      }, {
        opacity: 0.8,
        duration: 2,
        ease: "power2.out",
        delay: 0.5
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=120%",
          pin: true,
          scrub: 3, // Smoother scrolling
          fastScrollEnd: true,
        }
      });

        // 1. The Reveal (Video container expanding - optimized)
        tl.fromTo(videoContainerRef.current, {
          clipPath: "circle(25.8vmin at 50% 50%)",
          filter: "blur(16px)"
        }, {
          clipPath: "circle(150vmin at 50% 50%)",
          filter: "blur(0px)",
          duration: 1.1,
          ease: "sine.inOut",
        }, "<0.3")

        // 3. The Lens UI scaling up with the circle (optimized) and fading out
        .fromTo(lensUIRef.current, {
          scale: 1,
          opacity: 1,
        }, {
          scale: 8.695,
          opacity: 0,
          duration: 1.1,
          ease: "sine.inOut",
        }, "<")
      
        // Fade out the glass tint smoothly
        .to('.lens-glass-layer', {
          opacity: 0,
          duration: 0.8,
          ease: "power2.inOut",
        }, "<0.1")

        // Fade out the viewfinder UI smoothly
        .to('.viewfinder-ui', {
          opacity: 0,
          duration: 0.8,
          ease: "power2.inOut",
        }, "<")

        // Make the center text physically scroll up and fade out to simulate standard scrolling
        .to('.scroll-center-text', {
          y: -1000,
          opacity: 0,
          duration: 1.1,
          ease: "power1.inOut",
        }, "<0")

        // 4. Parallax for the giant text (disappears early and recedes backward)
        .to(textLeftRef.current, {
          x: "-12vw",
          scale: 0.7,
          opacity: 0,
          filter: "blur(30px)",
          duration: 0.45,
          ease: "power2.out",
        }, "<")
        .to(textRightRef.current, {
          x: "12vw",
          scale: 0.7,
          opacity: 0,
          filter: "blur(30px)",
          duration: 0.45,
          ease: "power2.out",
        }, "<");

      // Cleanup willChange after animation
      tl.eventCallback("onComplete", () => {
        gsap.set([videoContainerRef.current, lensUIRef.current, textLeftRef.current, textRightRef.current], {
          willChange: 'auto'
        });
      });

      // Hover Parallax Effect on Mouse Move
      const container = containerRef.current;
      const handleMouseMove = (e) => {
        // Calculate normalized offset from center of screen (-0.5 to 0.5)
        const xPos = (e.clientX / window.innerWidth) - 0.5;
        const yPos = (e.clientY / window.innerHeight) - 0.5;

        // Apply ultra-subtle shifting for realistic 3D depth layering
        gsap.to('.giant-text-container', { x: xPos * -10, y: yPos * -10, duration: 0.8, ease: 'power2.out', overwrite: 'auto' });
        gsap.to(lensUIRef.current, { x: xPos * 4, y: yPos * 4, duration: 0.8, ease: 'power2.out', overwrite: 'auto' });
        gsap.to(videoContainerRef.current, { x: xPos * 2, y: yPos * 2, duration: 0.8, ease: 'power2.out', overwrite: 'auto' });
        gsap.to('.viewfinder-ui', { x: xPos * 6, y: yPos * 6, duration: 0.8, ease: 'power2.out', overwrite: 'auto' });
      };

      const handleMouseLeave = () => {
        // Return layers back to center coordinates
        gsap.to(['.giant-text-container', lensUIRef.current, videoContainerRef.current, '.viewfinder-ui'], {
          x: 0,
          y: 0,
          duration: 0.8,
          ease: 'power2.out',
          overwrite: 'auto'
        });
      };

      container.addEventListener('mousemove', handleMouseMove);
      container.addEventListener('mouseleave', handleMouseLeave);

      // Cleanup event listeners
      return () => {
        container.removeEventListener('mousemove', handleMouseMove);
        container.removeEventListener('mouseleave', handleMouseLeave);
      };

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-screen bg-[#090909] overflow-hidden text-white font-sans selection:bg-red-600 selection:text-white"
    >
      {/* --- 2. Giant Typography --- */}
      <div className="giant-text-container absolute inset-0 z-40 pointer-events-none px-4 md:px-10">
        <div className="flex justify-between w-full relative h-full">
          {/* EMAR or EMAD based on user instruction (I'll use EMAD per context, but user prompt says "EMAR" in top-left, I will use EMAD because of the screenshot) */}
          <div ref={textLeftRef} className="absolute top-[10%] left-[2%] z-0">
            <h1
              className="text-[24vw] md:text-[17vw] leading-[0.8] font-black text-[#FF0000]"
              style={{
                fontFamily: "'Impact', 'Oswald', 'Anton', sans-serif",
                filter: 'drop-shadow(0px 0px 12px rgba(255, 0, 0, 0.4)) drop-shadow(0px 0px 25px rgba(255, 0, 0, 0.15))',
                textShadow: '0px 0px 15px rgba(255, 0, 0, 0.3), 0px 0px 30px rgba(255, 0, 0, 0.1)'
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
                filter: 'drop-shadow(0px 0px 12px rgba(255, 0, 0, 0.4)) drop-shadow(0px 0px 25px rgba(255, 0, 0, 0.15))',
                textShadow: '0px 0px 15px rgba(255, 0, 0, 0.3), 0px 0px 30px rgba(255, 0, 0, 0.1)'
              }}
            >
              SHAIKH
            </h1>
          </div>
        </div>
      </div>

      {/* --- 3. The Viewfinder UI --- */}
      <div className="viewfinder-ui absolute inset-0 z-30 pointer-events-none p-6 md:p-10 flex flex-col justify-between text-[10px] md:text-xs text-white/80 font-mono tracking-[0.2em] uppercase">
        {/* Horizontal and Vertical Calibration Grid Axis Lines */}
        <div className="absolute top-1/2 left-12 right-12 h-[1px] border-t border-dashed border-white/10 -translate-y-1/2 pointer-events-none"></div>
        <div className="absolute left-1/2 top-12 bottom-12 w-[1px] border-l border-dashed border-white/10 -translate-x-1/2 pointer-events-none"></div>

        {/* Concentric Calibration Guide Circles outside the lens */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[76vmin] h-[76vmin] rounded-full border border-dashed border-white/15 pointer-events-none"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vmin] h-[80vmin] rounded-full border border-dashed border-white/5 pointer-events-none"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[84vmin] h-[84vmin] rounded-full border border-dashed border-white/10 pointer-events-none"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[92vmin] h-[92vmin] rounded-full border border-dashed border-white/5 pointer-events-none"></div>

        {/* Top Row */}
        <div className="flex justify-between items-start">
          <div className="flex flex-col gap-1 leading-relaxed z-10">
            <span>50MM LENS</span>
            <span>f/1.4 APERTURE</span>
          </div>

          <div className="flex items-center gap-2 text-[#FF0000] font-bold bg-black/40 px-2 py-1 rounded backdrop-blur-sm z-10">
            <div className="w-2.5 h-2.5 rounded-full bg-[#FF0000] animate-pulse"></div>
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
        </div>
      </div>

      {/* --- 4. The Center Element (Lens Cap & Video Sensor) --- */}
      <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">

        {/* Video Container (The "Sensor" behind the cap) */}
        <div
          ref={videoContainerRef}
          className="absolute inset-0 w-full h-full overflow-hidden bg-neutral-900 pointer-events-auto"
        >
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover opacity-90"
          >
            <source src="https://k68-gray.vercel.app/main.mp4" type="video/mp4" />
          </video>

          {/* Overlay to darken the background slightly */}
          <div className="absolute inset-0 bg-black/20 mix-blend-multiply pointer-events-none"></div>

          {/* Inner shadow for physical depth */}
          <div className="absolute inset-0 shadow-[inset_0_0_60px_rgba(0,0,0,0.9)] pointer-events-none"></div>

          {/* Retro VHS Overlay from VhsRecorder */}
          <div className="absolute inset-0 z-40 pointer-events-none p-8 md:p-12">
            <style dangerouslySetInnerHTML={{__html: `
              @import url('https://fonts.googleapis.com/css?family=Press+Start+2P');
              @keyframes rgbText {
                0%, 25%, 55% { text-shadow: -1px 1px 8px rgba(255, 255, 255, 0.6), 1px -1px 8px rgba(255, 255, 235, 0.7), 0px 0 3px rgba(251, 0, 231, 0.8), 0 0px 3px rgba(0, 233, 235, 0.8), 0px 0 3px rgba(0, 242, 14, 0.8), 0 0px 3px rgba(244, 45, 0, 0.8), 0px 0 3px rgba(59, 0, 226, 0.8); }
                45%, 90%, 100% { text-shadow: -1px 1px 8px rgba(255, 255, 255, 0.6), 1px -1px 8px rgba(255, 255, 235, 0.7), 5px 0 1px rgba(251, 0, 231, 0.8), 0 5px 1px rgba(0, 233, 235, 0.8), -5px 0 1px rgba(0, 242, 14, 0.8), 0 5px 1px rgba(244, 45, 0, 0.8), -5px 0 1px rgba(59, 0, 226, 0.8); }
                50% { text-shadow: -1px 1px 8px rgba(255, 255, 255, 0.6), 1px -1px 8px rgba(255, 255, 235, 0.7), -5px 0 1px rgba(251, 0, 231, 0.8), 0 -5px 1px rgba(0, 233, 235, 0.8), 5px 0 1px rgba(0, 242, 14, 0.8), 0 5px 1px rgba(244, 45, 0, 0.8), -5px 0 1px rgba(59, 0, 226, 0.8); }
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
                .vhs-rgb-text, .vhs-rgb-text-slow {
                  font-size: 16px;
                }
              }
            `}} />

            {/* Left Counter */}
            <div className="absolute left-6 bottom-6 md:left-8 md:bottom-8 vhs-rgb-text">
              REC {Math.floor(counter / 60).toString().padStart(2, '0')}:{(counter % 60).toString().padStart(2, '0')}
            </div>

            {/* Right blinking dot + REC */}
            <div className="absolute right-6 bottom-6 md:right-8 md:bottom-8 flex items-center gap-2 md:gap-4 vhs-rgb-text-slow">
              <div className="w-3 h-3 md:w-5 md:h-5 rounded-full bg-red-600 animate-[pulse_2s_cubic-bezier(0.4,0,0.6,1)_infinite] drop-shadow-[0_0_8px_rgba(255,0,0,0.8)]"></div>
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

          {/* Giant Typography (Logo Section) from Hero */}
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
            <button className="flex items-center gap-2 px-6 py-2 rounded-full bg-black/30 backdrop-blur-sm border border-white/10 text-white font-sans text-xs md:text-sm font-semibold tracking-widest hover:bg-black/50 transition-all duration-300 uppercase shadow-lg">
              LET'S CREATE <ArrowUpRight className="w-4 h-4 md:w-5 md:h-5" />
            </button>
          </div>
        </div>

        {/* --- The New Cinematic Lens UI --- */}
        <div
          ref={lensUIRef}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[75vmin] h-[75vmin] pointer-events-none z-10 overflow-visible"
        >
          <svg viewBox="0 0 800 800" className="w-full h-full drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-visible">
            <defs>
              <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <linearGradient id="barrelGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#2a2a2a" />
                <stop offset="30%" stopColor="#0a0a0a" />
                <stop offset="70%" stopColor="#050505" />
                <stop offset="100%" stopColor="#1a1a1a" />
              </linearGradient>
              {/* Multi-layer anti-reflective coating gradient */}
              <radialGradient id="coatingReflect" cx="35%" cy="35%" r="65%">
                <stop offset="0%" stopColor="#a855f7" stopOpacity="0.25" /> {/* Purple sheen */}
                <stop offset="40%" stopColor="#3b82f6" stopOpacity="0.18" /> {/* Indigo blue */}
                <stop offset="75%" stopColor="#14b8a6" stopOpacity="0.08" /> {/* Cyan/Teal sheen */}
                <stop offset="100%" stopColor="#000000" stopOpacity="0.45" /> {/* Vignette border */}
              </radialGradient>

              {/* Cyan/Magenta optical flare sheen */}
              <linearGradient id="flareGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.2" />
                <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.02" />
                <stop offset="100%" stopColor="#ec4899" stopOpacity="0.12" />
              </linearGradient>

              {/* Soft center bulb reflection */}
              <radialGradient id="innerDepth" cx="60%" cy="60%" r="40%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.08" />
                <stop offset="100%" stopColor="#000000" stopOpacity="0.0" />
              </radialGradient>
            </defs>

            {/* Gear Teeth / Focus Ring Texture on the very outer edge */}
            <circle cx="400" cy="400" r="385" fill="none" stroke="#0a0a0a" strokeWidth="15" strokeDasharray="4 6" />

            {/* Solid background for the outer barrel with metallic shading */}
            <circle cx="400" cy="400" r="305" fill="none" stroke="url(#barrelGrad)" strokeWidth="150" />

            {/* Overlapping Concentric Mechanical Rings for realistic barrel texture */}
            <circle cx="400" cy="400" r="370" fill="none" stroke="#222222" strokeWidth="1" />
            <circle cx="400" cy="400" r="368" fill="none" stroke="#111111" strokeWidth="1" />
            <circle cx="400" cy="400" r="360" fill="none" stroke="#333333" strokeWidth="0.5" />
            <circle cx="400" cy="400" r="350" fill="none" stroke="#222222" strokeWidth="1" />
            <circle cx="400" cy="400" r="315" fill="none" stroke="#1c1c1c" strokeWidth="2" />
            <circle cx="400" cy="400" r="280" fill="none" stroke="#333333" strokeWidth="0.5" />

            {/* Technical text details printed in clean white/gray on the barrel */}
            {/* Top Text Markings */}
            <g fill="#888888" fontSize="7.5" fontWeight="bold" fontFamily="monospace" letterSpacing="0.15em" textAnchor="middle">
              <text x="400" y="70">FE 50mm F1.4 GM</text>
            </g>

            {/* Bottom Text Markings */}
            <g fill="#666666" fontSize="7" fontWeight="bold" fontFamily="monospace" letterSpacing="0.1em" textAnchor="middle">
              <text x="400" y="730">MADE IN JAPAN · S/N 9031804</text>
              <text x="400" y="742" fill="#444444" fontSize="6" letterSpacing="0.2em">E-MOUNT SYSTEM</text>
            </g>

            {/* Aperture Selection Markings on the outer barrel (monochromatic) */}
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

            {/* Focus Distance Scale Panel (Monochromatic Gray style) */}
            <g transform="translate(350, 110)" opacity="0.8">
              <rect x="0" y="0" width="100" height="22" fill="#080808" stroke="#222222" strokeWidth="1.5" rx="3" />
              <line x1="50" y1="0" x2="50" y2="22" stroke="#666666" strokeWidth="1" />
              <text x="15" y="14" fill="#888888" fontSize="8" fontWeight="bold" fontFamily="monospace">1.5m</text>
              <text x="50" y="14" fill="#ffffff" fontSize="8" fontWeight="bold" fontFamily="monospace" textAnchor="middle">3m</text>
              <text x="85" y="14" fill="#666666" fontSize="8" fontWeight="bold" fontFamily="monospace" textAnchor="end">∞</text>
            </g>

            <g className="lens-glass-layer">
              {/* Deep anti-reflective coating sheen */}
              <circle cx="400" cy="400" r="230" fill="url(#coatingReflect)" />
              
              {/* Linear flare gradient overlay */}
              <circle cx="400" cy="400" r="230" fill="url(#flareGrad)" />

              {/* Large Soft Crescent Reflection (Top-Left) */}
              <path 
                d="M 237 280 A 230 230 0 0 1 563 280 A 220 220 0 0 0 237 280 Z" 
                fill="#ffffff" 
                opacity="0.15" 
                filter="blur(3px)"
              />
              
              {/* Sharp Specular Accent Highlight (Near Top-Left Edge) */}
              <path 
                d="M 270 230 A 230 230 0 0 1 430 180 A 224 224 0 0 0 270 230 Z" 
                fill="#ffffff" 
                opacity="0.25" 
                filter="blur(1px)"
              />
              
              {/* Soft Violet/Pink Accent Reflection (Bottom-Right) */}
              <path 
                d="M 370 620 A 230 230 0 0 1 570 530 A 226 226 0 0 0 370 620 Z" 
                fill="#ec4899" 
                opacity="0.12" 
                filter="blur(2px)"
              />

              {/* Concentric glass elements inside */}
              <circle cx="400" cy="400" r="160" fill="none" stroke="#ffffff" strokeWidth="0.5" opacity="0.12" />
              <circle cx="400" cy="400" r="100" fill="none" stroke="#ffffff" strokeWidth="0.5" opacity="0.08" />

              {/* Soft bulb glow */}
              <circle cx="360" cy="360" r="120" fill="url(#innerDepth)" />
            </g>

            {/* Inner Blue Rings */}
            <circle cx="400" cy="400" r="230" fill="none" stroke="#254252" strokeWidth="2" filter="url(#glow)" />
            <circle cx="400" cy="400" r="235" fill="none" stroke="#254252" strokeWidth="1" opacity="0.5" />
            <circle cx="400" cy="400" r="240" fill="none" stroke="#1c3341" strokeWidth="4" />



            {/* Thick Dark Barrel Inner/Outer borders for 3D bevel effect */}
            <circle cx="400" cy="400" r="242" fill="none" stroke="#333" strokeWidth="4" />
            <circle cx="400" cy="400" r="245" fill="none" stroke="#000" strokeWidth="2" />

            <circle cx="400" cy="400" r="338" fill="none" stroke="#000" strokeWidth="3" />
            <circle cx="400" cy="400" r="340" fill="none" stroke="#444" strokeWidth="2" />

            {/* Outer Rings */}
            <circle cx="400" cy="400" r="345" fill="none" stroke="#333" strokeWidth="1" />
            <circle cx="400" cy="400" r="375" fill="none" stroke="#222" strokeWidth="1" />

            {/* Tick Marks & Distances */}
            <g fill="none" stroke="#666" strokeWidth="1" fontSize="10" fontFamily="monospace" textAnchor="middle" dominantBaseline="middle">
              {/* Red Cardinal Ticks */}
              <line x1="400" y1="25" x2="400" y2="40" stroke="#FF0000" strokeWidth="2" />
              <line x1="400" y1="760" x2="400" y2="775" stroke="#FF0000" strokeWidth="2" />
              <line x1="25" y1="400" x2="40" y2="400" stroke="#FF0000" strokeWidth="2" />
              <line x1="760" y1="400" x2="775" y2="400" stroke="#FF0000" strokeWidth="2" />

              {/* Distances (Rotated) */}
              <g transform="rotate(30 400 400)"><line x1="400" y1="35" x2="400" y2="40" /><text x="400" y="22" fill="#888" transform="rotate(-30 400 22)">3m</text></g>
              <g transform="rotate(60 400 400)"><line x1="400" y1="35" x2="400" y2="40" /><text x="400" y="22" fill="#888" transform="rotate(-60 400 22)">2m</text></g>
              <g transform="rotate(120 400 400)"><line x1="400" y1="35" x2="400" y2="40" /><text x="400" y="22" fill="#888" transform="rotate(-120 400 22)">1m</text></g>
              <g transform="rotate(210 400 400)"><line x1="400" y1="35" x2="400" y2="40" /><text x="400" y="22" fill="#888" transform="rotate(-210 400 22)">.8</text></g>
              <g transform="rotate(240 400 400)"><line x1="400" y1="35" x2="400" y2="40" /><text x="400" y="22" fill="#888" transform="rotate(-240 400 22)">.6</text></g>
              <g transform="rotate(290 400 400)"><line x1="400" y1="35" x2="400" y2="40" /><text x="400" y="22" fill="#888" transform="rotate(-290 400 22)">.4</text></g>
              <g transform="rotate(-30 400 400)"><line x1="400" y1="35" x2="400" y2="40" /><text x="400" y="22" fill="#888" transform="rotate(30 400 22)">5m</text></g>
              <g transform="rotate(-60 400 400)"><line x1="400" y1="35" x2="400" y2="40" /><text x="400" y="22" fill="#888" transform="rotate(60 400 22)">∞</text></g>
            </g>

            {/* Horizontal Texts */}
            <text x="120" y="404" fill="#666" fontSize="10" fontFamily="monospace" letterSpacing="0.1em" textAnchor="middle">50MM · SUMMILUX</text>
            <text x="680" y="404" fill="#666" fontSize="10" fontFamily="monospace" letterSpacing="0.1em" textAnchor="middle">F/1.4 · 1/250S · ISO 3</text>
            <text x="400" y="790" fill="#666" fontSize="10" fontFamily="monospace" letterSpacing="0.1em" textAnchor="middle">SONY · FE 50mm · f/1.4 GM · Ø82</text>

            {/* Scroll to begin text and circular indicator in the center of the lens */}
            <g className="scroll-center-text" style={{ transformOrigin: "400px 400px" }}>
              <style dangerouslySetInnerHTML={{__html: `
                @keyframes breatheRefined {
                  0% { transform: scale(0.97); opacity: 0.45; }
                  100% { transform: scale(1.02); opacity: 0.85; }
                }
                .breathe-group {
                  transform-origin: 400px 395px;
                  animation: breatheRefined 3s ease-in-out infinite alternate;
                }
              `}} />
              
              <g className="breathe-group">
                {/* Thin, dashed focus circle matching the crosshair grid */}
                <circle cx="400" cy="380" r="14" fill="none" stroke="#ffffff" strokeWidth="1" strokeDasharray="2 3" opacity="0.5" />
                {/* Tiny center focus dot */}
                <circle cx="400" cy="380" r="1.5" fill="#ffffff" opacity="0.6" />
                
                {/* Small Scroll to begin text below focus reticle */}
                <text 
                  x="400" 
                  y="415" 
                  fill="#ffffff" 
                  fillOpacity="0.7"
                  fontSize="9" 
                  fontWeight="bold"
                  fontFamily="monospace" 
                  letterSpacing="0.3em" 
                  textAnchor="middle" 
                  dominantBaseline="middle"
                  style={{ textShadow: '0 0 8px rgba(255,255,255,0.4)' }}
                >
                  SCROLL TO BEGIN
                </text>
              </g>
            </g>
          </svg>
        </div>

        {/* Global Vignette Falloff Overlay for Lens Realism */}
        <div className="absolute inset-0 z-45 pointer-events-none shadow-[inset_0_0_100px_rgba(0,0,0,0.7)] mix-blend-multiply opacity-90" />

        {/* High-Fidelity Animated Film Grain / Sensor Noise Overlay */}
        <div className="absolute inset-0 z-45 pointer-events-none overflow-hidden">
          <style dangerouslySetInnerHTML={{__html: `
            @keyframes grainAnim {
              0%, 100% { transform:translate(0, 0) }
              10% { transform:translate(-2%, -5%) }
              20% { transform:translate(-6%, 2%) }
              30% { transform:translate(3%, -8%) }
              40% { transform:translate(-2%, 8%) }
              50% { transform:translate(-6%, 4%) }
              60% { transform:translate(5%, 0%) }
              70% { transform:translate(0, 5%) }
              80% { transform:translate(1%, 10%) }
              90% { transform:translate(-4%, 4%) }
            }
            .grain-overlay {
              position: absolute;
              top: -50%;
              left: -50%;
              width: 200%;
              height: 200%;
              background: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
              opacity: 0.045;
              pointer-events: none;
              animation: grainAnim 0.8s steps(6) infinite;
            }
          `}} />
          <div className="grain-overlay" />
        </div>

      </div>
    </div>
  );
}
