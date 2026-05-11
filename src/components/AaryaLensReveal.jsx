import React, { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function AaryaLensReveal() {
  const containerRef = useRef(null);
  const lensCapRef = useRef(null);
  const videoContainerRef = useRef(null);
  const lensUIRef = useRef(null);
  const textLeftRef = useRef(null);
  const textRightRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Pre-set GPU acceleration for animated elements
      gsap.set([lensCapRef.current, videoContainerRef.current, lensUIRef.current, textLeftRef.current, textRightRef.current], {
        willChange: 'transform, opacity',
        force3D: true,
        backfaceVisibility: 'hidden'
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=200%",
          pin: true,
          scrub: 3, // Smoother scrolling
          fastScrollEnd: true,
        }
      });

      // 1. The Pop & Drop of the Lens Cap (optimized)
      tl.to(lensCapRef.current, {
        scale: 1.12,
        rotationZ: -12,
        duration: 0.35,
        ease: "sine.out",
      })
        .to(lensCapRef.current, {
          y: "150vh",
          rotationX: 40,
          rotationY: 30,
          duration: 1.1,
          ease: "sine.in",
        }, "+=0.06")

        // 2. The Reveal (Video container expanding - optimized)
        .fromTo(videoContainerRef.current, {
          clipPath: "circle(17.25vmin at 50% 50%)"
        }, {
          clipPath: "circle(150vmin at 50% 50%)",
          duration: 1.1,
          ease: "sine.inOut",
        }, "<0.3")

        // 3. The Lens UI scaling up with the circle (optimized)
        .fromTo(lensUIRef.current, {
          scale: 1,
        }, {
          scale: 8.695,
          duration: 1.1,
          ease: "sine.inOut",
        }, "<")

        // 4. Parallax for the giant text (optimized)
        .to(textLeftRef.current, {
          x: "-8vw",
          opacity: 0,
          duration: 1.1,
          ease: "sine.inOut",
        }, "<")
        .to(textRightRef.current, {
          x: "8vw",
          opacity: 0,
          duration: 1.1,
          ease: "sine.inOut",
        }, "<");

      // 4. Optimized montage effect
      const images = gsap.utils.toArray('.montage-img', containerRef.current);
      if (images.length > 0) {
        images.forEach((img, i) => {
          gsap.set(img, { willChange: 'opacity' });
          tl.to(img, { opacity: 1, duration: 0.04, ease: 'none' }, `>`);
          if (i < images.length - 1) {
            tl.to(img, { opacity: 0, duration: 0.04, ease: 'none' }, `>`);
          }
        });
      }

      // Cleanup willChange after animation
      tl.eventCallback("onComplete", () => {
        gsap.set([lensCapRef.current, videoContainerRef.current, lensUIRef.current, textLeftRef.current, textRightRef.current], {
          willChange: 'auto'
        });
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-screen bg-black overflow-hidden text-white font-sans selection:bg-red-600 selection:text-white"
    >
      {/* --- 2. Giant Typography --- */}
      <div className="absolute inset-0 z-0 flex flex-col justify-center pointer-events-none px-4 md:px-10">
        <div className="flex justify-between w-full relative h-full">
          {/* EMAR or EMAD based on user instruction (I'll use EMAD per context, but user prompt says "EMAR" in top-left, I will use EMAD because of the screenshot) */}
          <h1
            ref={textLeftRef}
            className="absolute top-[10%] left-[2%] text-[24vw] md:text-[17vw] leading-[0.8] font-black text-[#FF0000]"
            style={{
              fontFamily: "'Impact', 'Oswald', 'Anton', sans-serif",
              filter: 'drop-shadow(0px 0px 12px rgba(255, 0, 0, 0.4)) drop-shadow(0px 0px 25px rgba(255, 0, 0, 0.15))',
              textShadow: '0px 0px 15px rgba(255, 0, 0, 0.3), 0px 0px 30px rgba(255, 0, 0, 0.1)'
            }}
          >
            EMAD
          </h1>
          <h1
            ref={textRightRef}
            className="absolute bottom-[10%] right-[2%] text-[24vw] md:text-[17vw] leading-[0.8] font-black text-[#FF0000] text-right"
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

      {/* --- 3. The Viewfinder UI --- */}
      <div className="absolute inset-0 z-30 pointer-events-none p-6 md:p-10 flex flex-col justify-between text-[10px] md:text-xs text-white/80 font-mono tracking-[0.2em] uppercase">
        {/* Top Row */}
        <div className="flex justify-between items-start">
          <div className="flex flex-col gap-1 leading-relaxed">
            <span>50MM LENS</span>
            <span>f/1.4 APERTURE</span>
          </div>

          <div className="flex items-center gap-2 text-[#FF0000] font-bold bg-black/40 px-2 py-1 rounded backdrop-blur-sm">
            <div className="w-2.5 h-2.5 rounded-full bg-[#FF0000] animate-pulse"></div>
            <span>[REC]</span>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="flex justify-between items-end">
          <div className="flex flex-col gap-1 leading-relaxed">
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
            <source src="https://www.pexels.com/download/video/13082773/" type="video/mp4" />
          </video>

          {/* Montage Images (Hidden initially) */}
          <div className="absolute inset-0 w-full h-full pointer-events-none">
            <img src="https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=2070&auto=format&fit=crop" className="montage-img absolute inset-0 w-full h-full object-cover opacity-0" alt="Montage 1" />
            <img src="https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=2070&auto=format&fit=crop" className="montage-img absolute inset-0 w-full h-full object-cover opacity-0" alt="Montage 2" />
            <img src="https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=2070&auto=format&fit=crop" className="montage-img absolute inset-0 w-full h-full object-cover opacity-0" alt="Montage 3" />
            <img src="https://images.unsplash.com/photo-1470229722913-7c092fb46d69?q=80&w=2070&auto=format&fit=crop" className="montage-img absolute inset-0 w-full h-full object-cover opacity-0" alt="Montage 4" />
            <img src="https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?q=80&w=2070&auto=format&fit=crop" className="montage-img absolute inset-0 w-full h-full object-cover opacity-0" alt="Montage 5" />
          </div>

          {/* Overlay to darken the background slightly */}
          <div className="absolute inset-0 bg-black/20 mix-blend-multiply pointer-events-none"></div>

          {/* Inner shadow for physical depth */}
          <div className="absolute inset-0 shadow-[inset_0_0_60px_rgba(0,0,0,0.9)] pointer-events-none"></div>
        </div>

        {/* --- The New Cinematic Lens UI --- */}
        <div
          ref={lensUIRef}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50vmin] h-[50vmin] pointer-events-none z-10"
        >
          <svg viewBox="0 0 800 800" className="w-full h-full drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
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
              <linearGradient id="glassReflect" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.15" />
                <stop offset="40%" stopColor="#ffffff" stopOpacity="0.0" />
                <stop offset="60%" stopColor="#ffffff" stopOpacity="0.0" />
                <stop offset="100%" stopColor="#ffffff" stopOpacity="0.05" />
              </linearGradient>
            </defs>

            {/* Gear Teeth / Focus Ring Texture on the very outer edge */}
            <circle cx="400" cy="400" r="385" fill="none" stroke="#0a0a0a" strokeWidth="15" strokeDasharray="4 6" />

            {/* Solid background for the outer barrel with metallic shading */}
            <circle cx="400" cy="400" r="305" fill="none" stroke="url(#barrelGrad)" strokeWidth="150" />

            {/* Subtle glass reflection over the center hole */}
            <circle cx="400" cy="400" r="230" fill="url(#glassReflect)" />

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
          </svg>
        </div>

        {/* Photorealistic Lens Cap */}
        <img
          ref={lensCapRef}
          // Using a high-res placeholder transparent Canon Lens Cap PNG from a free source
          src="./pngegg3.png"
          alt="Canon Lens Cap"
          className="w-[54vmin] h-[54vmin] object-contain drop-shadow-[0_25px_35px_rgba(0,0,0,0.95)] z-20 pointer-events-auto"
        />
      </div>
    </div>
  );
}
