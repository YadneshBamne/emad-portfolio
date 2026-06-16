import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTransitionNavigate } from '../context/TransitionContext';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight, Camera, Video, Layers } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const AaryaCategoryAccordion = () => {
  const [hoveredPane, setHoveredPane] = useState(null);
  const [activeMobilePane, setActiveMobilePane] = useState(0); // 0: Photo, 1: Video, 2: Design
  const [isMobile, setIsMobile] = useState(false);
  
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const navigate = useTransitionNavigate();

  // Resize monitor for mobile stacking
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Manage videography playback loop
  useEffect(() => {
    if (!videoRef.current) return;
    const shouldPlay = isMobile ? activeMobilePane === 1 : (hoveredPane === 'right-top' || hoveredPane === null);
    
    if (shouldPlay) {
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn('Video loop autoplay block:', err);
        });
      }
    } else {
      videoRef.current.pause();
    }
  }, [hoveredPane, activeMobilePane, isMobile]);

  // GSAP Division Resizing handler on hover
  const handlePaneHover = (paneName) => {
    if (isMobile) return;
    setHoveredPane(paneName);

    // Dynamic width & height sliding division adjustments (optimized for ultra-soft expo easing)
    if (paneName === 'left') {
      gsap.to('.pane-left', { width: '58%', duration: 0.9, ease: 'expo.out', force3D: true });
      gsap.to('.pane-right', { width: '42%', duration: 0.9, ease: 'expo.out', force3D: true });
      gsap.to('.pane-right-top', { height: '50%', duration: 0.9, ease: 'expo.out', force3D: true });
      gsap.to('.pane-right-bottom', { height: '50%', duration: 0.9, ease: 'expo.out', force3D: true });
    } else if (paneName === 'right-top') {
      gsap.to('.pane-left', { width: '36%', duration: 0.9, ease: 'expo.out', force3D: true });
      gsap.to('.pane-right', { width: '64%', duration: 0.9, ease: 'expo.out', force3D: true });
      gsap.to('.pane-right-top', { height: '62%', duration: 0.9, ease: 'expo.out', force3D: true });
      gsap.to('.pane-right-bottom', { height: '38%', duration: 0.9, ease: 'expo.out', force3D: true });
    } else if (paneName === 'right-bottom') {
      gsap.to('.pane-left', { width: '36%', duration: 0.9, ease: 'expo.out', force3D: true });
      gsap.to('.pane-right', { width: '64%', duration: 0.9, ease: 'expo.out', force3D: true });
      gsap.to('.pane-right-top', { height: '36%', duration: 0.9, ease: 'expo.out', force3D: true });
      gsap.to('.pane-right-bottom', { height: '64%', duration: 0.9, ease: 'expo.out', force3D: true });
    }
  };

  const handlePaneLeave = () => {
    if (isMobile) return;
    setHoveredPane(null);

    // Reset back to system default ratios (optimized for ultra-soft expo easing)
    gsap.to('.pane-left', { width: '45%', duration: 0.9, ease: 'expo.out', force3D: true });
    gsap.to('.pane-right', { width: '55%', duration: 0.9, ease: 'expo.out', force3D: true });
    gsap.to('.pane-right-top', { height: '52%', duration: 0.9, ease: 'expo.out', force3D: true });
    gsap.to('.pane-right-bottom', { height: '48%', duration: 0.9, ease: 'expo.out', force3D: true });
  };

  // Section entrance reveal staggering timeline
  useEffect(() => {
    const panels = gsap.utils.toArray('.hud-pane');
    
    gsap.set(containerRef.current, { opacity: 0, y: 70 });
    gsap.set(panels, { opacity: 0, scale: 0.96 });

    const scrollTriggerObj = ScrollTrigger.create({
      trigger: containerRef.current,
      start: 'top bottom-=80',
      toggleActions: 'play none none reverse',
      onEnter: () => {
        const tl = gsap.timeline();
        tl.to(containerRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out'
        });
        tl.to(panels, {
          opacity: 1,
          scale: 1,
          duration: 0.6,
          stagger: 0.12,
          ease: 'power2.out',
          clearProps: 'scale,opacity' // clear properties for interactive hover styles
        }, '-=0.4');
      }
    });

    return () => {
      scrollTriggerObj.kill();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      onMouseLeave={handlePaneLeave}
      className="w-full max-w-[1400px] mx-auto my-16 bg-[#070707] border border-zinc-800/80 rounded-2xl overflow-hidden relative shadow-2xl"
    >
      
      {/* System Technical Top Bar */}
      <div className="w-full h-8 bg-black/60 border-b border-zinc-800/80 px-6 flex items-center justify-between font-mono text-[9px] tracking-widest text-zinc-500 select-none">
        <div className="flex items-center gap-1.5 text-red-500">
          <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse"></span>
          <span>CONSOLE: MULTI-MONITOR DIRECTING INTERFACE</span>
        </div>
        <div className="hidden sm:block">GRID_ALIGN: AUTO // COLOR: CMYK-D65</div>
        <div>SYS_STATUS: ONLINE</div>
      </div>

      {/* DASHBOARD GRID CONTAINER (Desktop layout vs Mobile layout) */}
      {isMobile ? (
        /* MOBILE VIEW: Staggered commands panels, expands on tap */
        <div className="flex flex-col divide-y divide-zinc-800/80 h-[700px]">
          
          {/* Mobile Panel 1: Photography */}
          <div
            onClick={() => setActiveMobilePane(0)}
            className={`hud-pane relative overflow-hidden flex flex-col justify-end p-6 transition-all duration-500 ease-out cursor-pointer
              ${activeMobilePane === 0 ? 'h-[50%]' : 'h-[25%] opacity-60'}
            `}
          >
            <img
              src="https://ik.imagekit.io/4no4se4zt/Emad%20Shaikh/photos/ISF-14.jpg"
              alt="Photography"
              className="absolute inset-0 w-full h-full object-cover scale-102 opacity-50"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/20 to-transparent z-10 pointer-events-none" />
            <div className="relative z-20">
              <span className="font-mono text-[9px] text-red-500 tracking-wider uppercase block mb-1">01 // STILLS.RAW</span>
              <h3 className="text-2xl font-black text-white uppercase" style={{ fontFamily: "'Anton', sans-serif" }}>PHOTOGRAPHY</h3>
              {activeMobilePane === 0 && (
                <p className="text-zinc-400 text-xs mt-2 leading-relaxed max-w-md animate-[fadeIn_0.5s_ease]">
                  Capturing details in raw light. Editorial shoots, portraits, and low-light street captures.
                </p>
              )}
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); navigate('/photography'); }}
              className={`absolute top-4 right-4 bg-white text-black p-2 rounded-full cursor-pointer transition-all duration-300 ${activeMobilePane === 0 ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}
            >
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile Panel 2: Videography */}
          <div
            onClick={() => setActiveMobilePane(1)}
            className={`hud-pane relative overflow-hidden flex flex-col justify-end p-6 transition-all duration-500 ease-out cursor-pointer
              ${activeMobilePane === 1 ? 'h-[50%]' : 'h-[25%] opacity-60'}
            `}
          >
            <video
              ref={videoRef}
              src="https://ik.imagekit.io/4no4se4zt/Emad%20Shaikh/Europe%20arc%20final.mov"
              loop
              muted
              playsInline
              className="absolute inset-0 w-full h-full object-cover opacity-50 scale-102"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/20 to-transparent z-10 pointer-events-none" />
            <div className="relative z-20">
              <span className="font-mono text-[9px] text-red-500 tracking-wider uppercase block mb-1">02 // MOTION.CINE</span>
              <h3 className="text-2xl font-black text-white uppercase" style={{ fontFamily: "'Anton', sans-serif" }}>VIDEOGRAPHY</h3>
              {activeMobilePane === 1 && (
                <p className="text-zinc-400 text-xs mt-2 leading-relaxed max-w-md animate-[fadeIn_0.5s_ease]">
                  Storytelling through moving images. Music videos, cinematic ads, and narrative shorts.
                </p>
              )}
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); navigate('/works'); }}
              className={`absolute top-4 right-4 bg-white text-black p-2 rounded-full cursor-pointer transition-all duration-300 ${activeMobilePane === 1 ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}
            >
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile Panel 3: Graphic Design */}
          <div
            onClick={() => setActiveMobilePane(2)}
            className={`hud-pane relative overflow-hidden flex flex-col justify-end p-6 transition-all duration-500 ease-out cursor-pointer
              ${activeMobilePane === 2 ? 'h-[50%]' : 'h-[25%] opacity-60'}
            `}
          >
            <img
              src="https://ik.imagekit.io/4no4se4zt/Emad%20Shaikh/photos/credits_BARICCI_ES-75.jpg"
              alt="Graphic Design"
              className="absolute inset-0 w-full h-full object-cover scale-102 opacity-50"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/20 to-transparent z-10 pointer-events-none" />
            <div className="relative z-20">
              <span className="font-mono text-[9px] text-red-500 tracking-wider uppercase block mb-1">03 // VECTOR.DPI</span>
              <h3 className="text-2xl font-black text-white uppercase" style={{ fontFamily: "'Anton', sans-serif" }}>GRAPHIC DESIGN</h3>
              {activeMobilePane === 2 && (
                <p className="text-zinc-400 text-xs mt-2 leading-relaxed max-w-md animate-[fadeIn_0.5s_ease]">
                  Geometric and typographic visual identities. Typographic systems, layout branding, posters.
                </p>
              )}
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); navigate('/works'); }}
              className={`absolute top-4 right-4 bg-white text-black p-2 rounded-full cursor-pointer transition-all duration-300 ${activeMobilePane === 2 ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}
            >
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      ) : (
        /* DESKTOP VIEW: Director's Multi-Monitor Console Dashboard */
        <div className="flex h-[600px] lg:h-[650px] divide-x divide-zinc-800/80 bg-black select-none">
          
          {/* LEFT MONITOR PANE: Photography (45% Width System Default) */}
          <div
            onMouseEnter={() => handlePaneHover('left')}
            className="pane-left w-[45%] h-full relative overflow-hidden group/pane hud-pane"
          >
            {/* Background Ken Burns Parallax */}
            <img
              src="https://ik.imagekit.io/4no4se4zt/Emad%20Shaikh/photos/ISF-14.jpg"
              alt="Photography"
              className={`absolute inset-0 w-full h-full object-cover origin-center z-0
                ${hoveredPane === 'left' 
                  ? 'scale-108 opacity-80 brightness-110' 
                  : 'scale-103 opacity-40 brightness-50 mix-blend-luminosity hover:opacity-50'
                }
              `}
              style={{ transition: 'transform 1.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 1.0s cubic-bezier(0.16, 1, 0.3, 1), filter 1.0s cubic-bezier(0.16, 1, 0.3, 1)' }}
            />
            {/* Color Hue & Gradient Fades */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/30 to-transparent opacity-90 z-10 pointer-events-none" />
            <div 
              className={`absolute inset-0 bg-[#050505] mix-blend-color pointer-events-none transition-opacity z-10 ${hoveredPane === 'left' ? 'opacity-0' : 'opacity-30'}`}
              style={{ transition: 'opacity 1.0s cubic-bezier(0.16, 1, 0.3, 1)' }}
            />

            {/* Viewfinder Frame overlay (Top & Bottom borders & focus boxes) */}
            <div 
              className={`absolute inset-0 border border-white/5 z-20 pointer-events-none ${hoveredPane === 'left' ? 'opacity-100' : 'opacity-35'}`}
              style={{ transition: 'opacity 1.0s cubic-bezier(0.16, 1, 0.3, 1)' }}
            >
              <div className="absolute top-4 left-4 w-3.5 h-3.5 border-t border-l border-white/30" />
              <div className="absolute top-4 right-4 w-3.5 h-3.5 border-t border-r border-white/30" />
              <div className="absolute bottom-4 left-4 w-3.5 h-3.5 border-b border-l border-white/30" />
              <div className="absolute bottom-4 right-4 w-3.5 h-3.5 border-b border-r border-white/30" />
            </div>



            {/* Top Info Tags */}
            <div className="absolute top-4 left-4 font-mono text-[9px] text-zinc-500 z-25 pointer-events-none flex items-center gap-1.5">
              <Camera className="w-3.5 h-3.5 text-zinc-400" />
              <span>FEED: STILLS_CAM_A</span>
            </div>

            <div className="absolute top-4 right-4 font-mono text-[9px] text-zinc-500 z-25 pointer-events-none">
              <span>LENS: FE 50MM F/1.2 GM</span>
            </div>

            {/* Bottom HUD Telemetry details */}
            <div className="absolute bottom-4 left-4 right-4 z-20 flex items-center justify-between font-mono text-[8px] tracking-wider text-zinc-500 pointer-events-none">
              <div>RAW.DNG // 14-BIT</div>
              <div>M // 1/250S // F1.2 // ISO 100</div>
            </div>

            {/* Expanded Center Text Details */}
            <div 
              className={`absolute bottom-16 left-6 right-6 z-25 select-none
                ${hoveredPane === 'left' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6 pointer-events-none'}
              `}
              style={{ transition: 'transform 1.0s cubic-bezier(0.16, 1, 0.3, 1), opacity 1.0s cubic-bezier(0.16, 1, 0.3, 1)' }}
            >
              <span className="font-mono text-[9px] text-red-500 tracking-[0.2em] uppercase block mb-1">01 // PHOTOGRAPHY</span>
              <h3 className="text-3xl font-black text-white uppercase mb-2 tracking-tight" style={{ fontFamily: "'Anton', sans-serif" }}>STILLS PORTFOLIO</h3>
              <p className="text-zinc-300 font-sans text-xs max-w-sm mb-4 leading-relaxed">
                Capturing details in raw light. Specializing in high-fashion editorial portraits, street essays, and low-light capturing.
              </p>
              <button 
                onClick={(e) => { e.stopPropagation(); navigate('/photography'); }}
                className="group/btn flex items-center gap-2 bg-white text-black font-mono text-[9px] font-bold tracking-widest px-4 py-2 rounded-lg hover:bg-red-600 hover:text-white transition-all duration-300 cursor-pointer"
              >
                <span>OPEN STILLS</span>
                <ArrowUpRight className="w-3 h-3 transition-transform duration-300 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
              </button>
            </div>

          </div>

          {/* RIGHT COLUMN WRAPPER: Splits into Top (Video) and Bottom (Design) (55% Width System Default) */}
          <div 
            className="pane-right w-[55%] h-full flex flex-col divide-y divide-zinc-800/80"
          >
            
            {/* TOP RIGHT MONITOR PANE: Videography (52% Height System Default) */}
            <div
              onMouseEnter={() => handlePaneHover('right-top')}
              className="pane-right-top h-[52%] relative overflow-hidden group/pane hud-pane"
            >
              {/* Loop Video Reel */}
              <video
                ref={videoRef}
                src="https://ik.imagekit.io/4no4se4zt/Emad%20Shaikh/Europe%20arc%20final.mov"
                preload="auto"
                loop
                muted
                playsInline
                className={`absolute inset-0 w-full h-full object-cover origin-center z-0 scale-102
                  ${hoveredPane === 'right-top' 
                    ? 'opacity-85 brightness-110' 
                    : 'opacity-40 brightness-50 mix-blend-luminosity hover:opacity-50'
                  }
                `}
                style={{ transition: 'transform 1.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 1.0s cubic-bezier(0.16, 1, 0.3, 1), filter 1.0s cubic-bezier(0.16, 1, 0.3, 1)' }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/30 to-transparent opacity-95 z-10 pointer-events-none" />
              <div 
                className={`absolute inset-0 bg-[#050505] mix-blend-color pointer-events-none transition-opacity z-10 ${hoveredPane === 'right-top' ? 'opacity-0' : 'opacity-30'}`}
                style={{ transition: 'opacity 1.0s cubic-bezier(0.16, 1, 0.3, 1)' }}
              />

              {/* Viewfinder Overlay Frame */}
              <div 
                className={`absolute inset-0 border border-white/5 z-20 pointer-events-none ${hoveredPane === 'right-top' ? 'opacity-100' : 'opacity-35'}`}
                style={{ transition: 'opacity 1.0s cubic-bezier(0.16, 1, 0.3, 1)' }}
              >
                <div className="absolute top-4 left-4 w-3.5 h-3.5 border-t border-l border-white/30" />
                <div className="absolute top-4 right-4 w-3.5 h-3.5 border-t border-r border-white/30" />
                <div className="absolute bottom-4 left-4 w-3.5 h-3.5 border-b border-l border-white/30" />
                <div className="absolute bottom-4 right-4 w-3.5 h-3.5 border-b border-r border-white/30" />
              </div>


              {/* Top Viewport details */}
              <div className="absolute top-4 left-4 font-mono text-[9px] text-zinc-500 z-25 pointer-events-none flex items-center gap-1.5">
                <Video className="w-3.5 h-3.5 text-zinc-400" />
                <span>FEED: CINEMA_CAM_B</span>
              </div>

              <div className="absolute top-4 right-4 font-mono text-[9px] text-zinc-500 z-25 pointer-events-none flex items-center gap-1 text-red-500 font-bold">
                <span className="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse"></span>
                <span>REC LIVE</span>
              </div>

              {/* Bottom Telemetry indicators */}
              <div className="absolute bottom-4 left-4 right-4 z-20 flex items-center justify-between font-mono text-[8px] tracking-wider text-zinc-500 pointer-events-none">
                <div>ProRes 4444 // UHD</div>
                <div>CINE // 24FPS // T2.0 // ISO 800</div>
              </div>

              {/* Expanded details */}
              <div 
                className={`absolute bottom-12 left-6 right-6 z-25 select-none
                  ${hoveredPane === 'right-top' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6 pointer-events-none'}
                `}
                style={{ transition: 'transform 1.0s cubic-bezier(0.16, 1, 0.3, 1), opacity 1.0s cubic-bezier(0.16, 1, 0.3, 1)' }}
              >
                <span className="font-mono text-[9px] text-red-500 tracking-[0.2em] uppercase block mb-1">02 // VIDEOGRAPHY</span>
                <h3 className="text-3xl font-black text-white uppercase mb-2 tracking-tight" style={{ fontFamily: "'Anton', sans-serif" }}>CINEMATIC REEL</h3>
                <p className="text-zinc-300 font-sans text-xs max-w-sm mb-4 leading-relaxed">
                  Narrative filmmaking & music videos. Directing, filming, and grading with heavy light play and anamorphic textures.
                </p>
                <button 
                  onClick={(e) => { e.stopPropagation(); navigate('/works'); }}
                  className="group/btn flex items-center gap-2 bg-white text-black font-mono text-[9px] font-bold tracking-widest px-4 py-2 rounded-lg hover:bg-red-600 hover:text-white transition-all duration-300 cursor-pointer"
                >
                  <span>PLAY CINEMAS</span>
                  <ArrowUpRight className="w-3 h-3 transition-transform duration-300 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                </button>
              </div>

            </div>

            {/* BOTTOM RIGHT MONITOR PANE: Graphic Design (48% Height System Default) */}
            <div
              onMouseEnter={() => handlePaneHover('right-bottom')}
              className="pane-right-bottom h-[48%] relative overflow-hidden group/pane hud-pane"
            >
              {/* Background Art Poster */}
              <img
                src="https://ik.imagekit.io/4no4se4zt/Emad%20Shaikh/photos/credits_BARICCI_ES-75.jpg"
                alt="Graphic Design"
                className={`absolute inset-0 w-full h-full object-cover origin-center z-0
                  ${hoveredPane === 'right-bottom' 
                    ? 'scale-108 opacity-80 brightness-110' 
                    : 'scale-103 opacity-40 brightness-50 mix-blend-luminosity hover:opacity-50'
                  }
                `}
                style={{ transition: 'transform 1.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 1.0s cubic-bezier(0.16, 1, 0.3, 1), filter 1.0s cubic-bezier(0.16, 1, 0.3, 1)' }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/30 to-transparent opacity-95 z-10 pointer-events-none" />
              <div 
                className={`absolute inset-0 bg-[#050505] mix-blend-color pointer-events-none transition-opacity z-10 ${hoveredPane === 'right-bottom' ? 'opacity-0' : 'opacity-30'}`}
                style={{ transition: 'opacity 1.0s cubic-bezier(0.16, 1, 0.3, 1)' }}
              />

              {/* Technical Design Grid Overlay */}
              <div 
                className={`absolute inset-0 bg-design-blueprint pointer-events-none z-15 transition-opacity ${hoveredPane === 'right-bottom' ? 'opacity-25' : 'opacity-10'}`}
                style={{ transition: 'opacity 1.0s cubic-bezier(0.16, 1, 0.3, 1)' }}
              />

              {/* Viewfinder corners */}
              <div 
                className={`absolute inset-0 border border-white/5 z-20 pointer-events-none ${hoveredPane === 'right-bottom' ? 'opacity-100' : 'opacity-35'}`}
                style={{ transition: 'opacity 1.0s cubic-bezier(0.16, 1, 0.3, 1)' }}
              >
                <div className="absolute top-4 left-4 w-3.5 h-3.5 border-t border-l border-white/30" />
                <div className="absolute top-4 right-4 w-3.5 h-3.5 border-t border-r border-white/30" />
                <div className="absolute bottom-4 left-4 w-3.5 h-3.5 border-b border-l border-white/30" />
                <div className="absolute bottom-4 right-4 w-3.5 h-3.5 border-b border-r border-white/30" />
              </div>

              {/* Top Details */}
              <div className="absolute top-4 left-4 font-mono text-[9px] text-zinc-500 z-25 pointer-events-none flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-zinc-400" />
                <span>RENDER: RASTER_GPU_01</span>
              </div>

              <div className="absolute top-4 right-4 font-mono text-[9px] text-zinc-500 z-25 pointer-events-none flex items-center gap-1.5">
                {/* Palette swatch displays */}
                <div className="flex gap-1 items-center font-mono text-[8px] text-zinc-500">
                  <span className="w-1.5 h-1.5 bg-[#FF0000] border border-white/10 rounded-sm"></span>
                  <span className="w-1.5 h-1.5 bg-[#FFFFFF] border border-white/10 rounded-sm"></span>
                  <span className="w-1.5 h-1.5 bg-[#94A3B8] border border-white/10 rounded-sm"></span>
                  <span className="w-1.5 h-1.5 bg-[#050505] border border-white/10 rounded-sm"></span>
                </div>
              </div>

              {/* Bottom HUD metrics */}
              <div className="absolute bottom-4 left-4 right-4 z-20 flex items-center justify-between font-mono text-[8px] tracking-wider text-zinc-500 pointer-events-none">
                <div>CMYK // vector.render</div>
                <div>ENGINE: RGB-OPENGL // PATHS: OK</div>
              </div>

              {/* Expanded details */}
              <div 
                className={`absolute bottom-12 left-6 right-6 z-25 select-none
                  ${hoveredPane === 'right-bottom' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6 pointer-events-none'}
                `}
                style={{ transition: 'transform 1.0s cubic-bezier(0.16, 1, 0.3, 1), opacity 1.0s cubic-bezier(0.16, 1, 0.3, 1)' }}
              >
                <span className="font-mono text-[9px] text-red-500 tracking-[0.2em] uppercase block mb-1">03 // GRAPHIC DESIGN</span>
                <h3 className="text-3xl font-black text-white uppercase mb-2 tracking-tight" style={{ fontFamily: "'Anton', sans-serif" }}>VISUAL SYSTEMS</h3>
                <p className="text-zinc-300 font-sans text-xs max-w-sm mb-4 leading-relaxed">
                  Translating identities into layouts. Typographic structures, editorial design, poster artwork, and vector styling.
                </p>
                <button 
                  onClick={(e) => { e.stopPropagation(); navigate('/works'); }}
                  className="group/btn flex items-center gap-2 bg-white text-black font-mono text-[9px] font-bold tracking-widest px-4 py-2 rounded-lg hover:bg-red-600 hover:text-white transition-all duration-300 cursor-pointer"
                >
                  <span>VIEW DESIGNS</span>
                  <ArrowUpRight className="w-3 h-3 transition-transform duration-300 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                </button>
              </div>

            </div>

          </div>

        </div>
      )}

      {/* Styled Blueprint grid patterns & Film grain SVG embedded */}
      <style dangerouslySetInnerHTML={{
        __html: `
        .bg-design-blueprint {
          background-size: 20px 20px;
          background-image: 
            linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
        }
      `}} />

    </div>
  );
};

export default AaryaCategoryAccordion;
