import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useParams, useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ArrowLeft, ArrowUpRight, Play, Volume2, VolumeX, Sparkles, ChevronRight } from 'lucide-react';
import DynamicIslandNavbar from '../components/DynamicIslandNavbar';
import { AaryaNavigationDrawer } from '../components/AaryaNavigationDrawer';

const PROJECTS = [
  {
    id: 'bmw',
    title: 'BMW Commercial',
    client: 'BMW Motorsports',
    year: '2025',
    category: 'AUTOMOTIVE COMMERCIAL',
    role: 'Director · Lead Cinematographer · Colorist',
    camera: 'ARRI Alexa Mini LF · Cooke Anamorphic /i',
    duration: '01:45',
    align: 'self-end',
    imageClass: 'w-[260px] sm:w-[310px] md:w-[350px] lg:w-[380px] h-[260px] sm:h-[310px] md:h-[350px] lg:h-[380px]',
    image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?q=80&w=1200&auto=format&fit=crop',
    videoUrl: 'https://ik.imagekit.io/4no4se4zt/Emad%20Shaikh/jason.mp4',
    synopsis: 'A high-octane commercial film capturing the aerodynamic precision and aggressive silhouette of BMW engineering.',
    description: 'Shot across winding high-altitude mountain passes at dawn, this piece blends high-framerate dynamic gimbal tracking with raw anamorphic glass. Every cut emphasizes the mechanical balance between pure speed, razor-sharp German craftsmanship, and deep high-contrast shadows.',
    credits: [
      { label: 'DIRECTOR', value: 'Emad Shaikh' },
      { label: 'CLIENT', value: 'BMW Performance' },
      { label: 'CINEMATOGRAPHY', value: 'Emad Shaikh & Crew' },
      { label: 'COLOR GRADE', value: 'DaVinci Resolve Studio (Film Print Emulation)' },
      { label: 'FORMAT', value: '4.5K Open Gate ProRes 4444 XQ' }
    ]
  },
  {
    id: 'venus',
    title: 'Venus',
    client: 'Venus Organic Skincare',
    year: '2025',
    category: 'LUXURY BEAUTY & PRODUCT',
    role: 'Creative Director & Macro Cinematographer',
    camera: 'RED V-Raptor 8K VV · Master Prime 100mm Macro',
    duration: '00:58',
    align: 'self-center',
    imageClass: 'w-[130px] sm:w-[155px] md:w-[175px] lg:w-[190px] h-[190px] sm:h-[225px] md:h-[255px] lg:h-[275px]',
    image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=800&auto=format&fit=crop',
    videoUrl: 'https://ik.imagekit.io/4no4se4zt/Emad%20Shaikh/Europe%20arc%20final.mov',
    synopsis: 'An ethereal macro beauty campaign exploring organic texture, fluid water refraction, and soft morning luminance.',
    description: 'Crafted with extreme high-speed macro optics, Venus explores the sensual fluidity of botanical oils meeting pure mineral water. The visual narrative combines gentle pastel hues, crystal ripples, and minimalist typographic pacing.',
    credits: [
      { label: 'CREATIVE DIRECTION', value: 'Emad Shaikh' },
      { label: 'CLIENT', value: 'Venus Skincare' },
      { label: 'LIGHTING DESIGN', value: 'Studio Softbox Diffusers' },
      { label: 'POST-PRODUCTION', value: 'Emad Shaikh Visuals' },
      { label: 'FORMAT', value: '8K RAW 120fps Macro' }
    ]
  },
  {
    id: 'dji',
    title: 'DJI Story',
    client: 'DJI Global',
    year: '2024',
    category: 'AERIAL EXPEDITION & DOC',
    role: 'Aerial Director & Expedition DP',
    camera: 'DJI Inspire 3 Cinema RAW 8K · Zenmuse X9-8K Air',
    duration: '02:30',
    align: 'self-end',
    imageClass: 'w-[270px] sm:w-[320px] md:w-[360px] lg:w-[390px] h-[270px] sm:h-[320px] md:h-[360px] lg:h-[390px]',
    image: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?q=80&w=1200&auto=format&fit=crop',
    videoUrl: 'https://ik.imagekit.io/4no4se4zt/Emad%20Shaikh/tyla%20live%202.mp4',
    synopsis: 'A breathtaking aerial odyssey tracing solitary volcanic coastlines, sea spray, and golden hour horizons.',
    description: 'Captured over a 14-day solo expedition across Nordic coastlines, this documentary short explores the raw majesty of untamed nature. Combining extreme long-range drone telemetry with golden hour light to demonstrate sensory depth and cinematic perspective.',
    credits: [
      { label: 'AERIAL DIRECTOR', value: 'Emad Shaikh' },
      { label: 'CLIENT', value: 'DJI Global' },
      { label: 'LOCATION', value: 'Nordic Coastlines & Fjords' },
      { label: 'SOUND DESIGN', value: 'Dolby Atmos Spatial Audio' },
      { label: 'FORMAT', value: 'CinemaDNG 8K 60fps' }
    ]
  },
  {
    id: 'audi',
    title: 'Audi',
    client: 'Audi Sport',
    year: '2025',
    category: 'AUTOMOTIVE BRAND FILM',
    role: 'Director & Motion Lead',
    camera: 'Sony FX9 · Zeiss Supreme Primes',
    duration: '01:15',
    align: 'self-center',
    imageClass: 'w-[160px] sm:w-[190px] md:w-[215px] lg:w-[235px] h-[100px] sm:h-[120px] md:h-[135px] lg:h-[145px]',
    image: 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?q=80&w=1000&auto=format&fit=crop',
    videoUrl: 'https://ik.imagekit.io/4no4se4zt/Emad%20Shaikh/anuv%20live%20cut.mp4',
    description: 'A nocturnal storm exploration emphasizing Quattro all-wheel precision in slick wet road conditions. Rich charcoal gradients, cutting headlight reflections, and visceral engine sound design.',
    synopsis: 'A nocturnal journey cutting through misty mountain passes with raw mechanical adrenaline.',
    credits: [
      { label: 'DIRECTOR', value: 'Emad Shaikh' },
      { label: 'CLIENT', value: 'Audi Sport' },
      { label: 'RIGGING', value: 'Car-to-Car Russian Arm' },
      { label: 'COLOR GRADE', value: 'Cool Charcoal & Steel Palette' },
      { label: 'FORMAT', value: '4K XAVC-I 10-Bit' }
    ]
  },
  {
    id: 'roux-robin',
    title: 'Roux & Robin',
    client: 'Roux & Robin Paris',
    year: '2025',
    category: 'HIGH FASHION & EDITORIAL',
    role: 'Fashion Film Director',
    camera: '16mm Kodak Vision3 & ARRI 35 · Hawk V-Lite Anamorphic',
    duration: '01:30',
    align: 'self-center',
    imageClass: 'w-[165px] sm:w-[195px] md:w-[220px] lg:w-[240px] h-[200px] sm:h-[235px] md:h-[265px] lg:h-[285px]',
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=1000&auto=format&fit=crop',
    videoUrl: 'https://ik.imagekit.io/4no4se4zt/Emad%20Shaikh/akon%20live%20cut.mp4',
    synopsis: 'Vibrant terracotta sunlight meets bold crimson silhouettes in a Parisian luxury capsule reveal.',
    description: 'Filmed in warm afternoon sunlight, Roux & Robin highlights the tactile textures of fine red leather craftsmanship against brutalist architectural backdrops. Shot on real 16mm film to produce organic grain and timeless editorial richness.',
    credits: [
      { label: 'DIRECTOR', value: 'Emad Shaikh' },
      { label: 'CLIENT', value: 'Roux & Robin' },
      { label: 'FILM STOCK', value: 'Kodak 500T / 250D 16mm' },
      { label: 'WARDROBE & STYLING', value: 'Paris Atelier Studio' },
      { label: 'FORMAT', value: 'Scanity 4K 16mm Film Scan' }
    ]
  },
  {
    id: 'sony',
    title: 'Sony',
    client: 'Sony Alpha Global',
    year: '2024',
    category: 'BRAND CAMPAIGN & SENSOR DEMO',
    role: 'Nocturnal Director & Cinematographer',
    camera: 'Sony Venice 2 · Sony G-Master Cine Primes',
    duration: '02:10',
    align: 'self-end',
    imageClass: 'w-[170px] sm:w-[200px] md:w-[225px] lg:w-[245px] h-[270px] sm:h-[320px] md:h-[360px] lg:h-[390px]',
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1000&auto=format&fit=crop',
    videoUrl: 'https://ik.imagekit.io/4no4se4zt/Emad%20Shaikh/tyla%20live%202.mp4',
    synopsis: 'Testing low-light sensor boundaries across rain-drenched neon alleys and high-contrast nightscapes.',
    description: 'An atmospheric masterclass testing the extreme sensitivity of Sony Venice dual-base ISO sensors. Filmed in pouring rain in metropolitan alleyways, revealing vivid neon reflections, deep skin tones, and rich unclipped highlights.',
    credits: [
      { label: 'DIRECTOR', value: 'Emad Shaikh' },
      { label: 'CLIENT', value: 'Sony Alpha' },
      { label: 'LENSES', value: 'Sony G-Master T1.5 Primes' },
      { label: 'COLOR GRADE', value: 'High Contrast Neon Cyan & Magenta' },
      { label: 'FORMAT', value: 'Sony RAW 8.6K 16-Bit' }
    ]
  }
];

// =========================================================================
// HORIZONTAL SMOOTH TEXT REVEAL COMPONENTS
// =========================================================================
const HorizontalReveal = ({ 
  children, 
  className = '', 
  delay = 0, 
  duration = 1.0, 
  direction = 'left',
  style = {} 
}) => {
  const initialClip = direction === 'left' 
    ? 'polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)' 
    : 'polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%)';
  const targetClip = 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)';

  return (
    <motion.div
      initial={{ 
        clipPath: initialClip, 
        opacity: 0, 
        x: direction === 'left' ? -35 : 35,
        filter: 'blur(4px)'
      }}
      animate={{ 
        clipPath: targetClip, 
        opacity: 1, 
        x: 0,
        filter: 'blur(0px)'
      }}
      transition={{ 
        duration, 
        delay, 
        ease: [0.16, 1, 0.3, 1] 
      }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
};

export default function WorksPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Active project state (either from URL param or state)
  const [selectedProject, setSelectedProject] = useState(null);

  // Sync with URL param if navigated to /works/:id
  useEffect(() => {
    if (id) {
      const match = PROJECTS.find((p) => p.id === id);
      if (match) {
        setSelectedProject(match);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else {
      setSelectedProject(null);
    }
  }, [id]);

  // =========================================================================
  // HIGH-PERFORMANCE GSAP PHYSICS ENGINE (IDENTICAL TO PHOTOGRAPHY PAGE)
  // =========================================================================
  const containerRef = useRef(null);
  const trackRef = useRef(null);

  const targetXRef = useRef(0);
  const currentXRef = useRef(0);
  const velXRef = useRef(0);

  const isDraggingRef = useRef(false);
  const hasMovedRef = useRef(false);
  const dragStartRef = useRef({ x: 0, targetX: 0, time: 0 });
  const lastPointerRef = useRef({ x: 0, time: 0 });
  const maxDragRef = useRef(0);
  const reqIdRef = useRef(null);

  // Measure container and scroll bounds
  const updateBounds = useCallback(() => {
    if (containerRef.current && trackRef.current) {
      const containerWidth = containerRef.current.offsetWidth;
      const trackWidth = trackRef.current.scrollWidth;
      const maxDrag = Math.max(0, trackWidth - containerWidth + 60);
      maxDragRef.current = maxDrag;
    }
  }, []);

  useEffect(() => {
    updateBounds();
    window.addEventListener('resize', updateBounds);
    return () => window.removeEventListener('resize', updateBounds);
  }, [updateBounds, selectedProject]);

  // RequestAnimationFrame physics loop with friction decay, weighted lerp & rubber-banding
  useEffect(() => {
    if (selectedProject) return; // Pause loop when in detail view
    const trackEl = trackRef.current;
    if (!trackEl) return;

    const quickSetX = gsap.quickSetter(trackEl, 'x', 'px');
    let lastTime = performance.now();

    const tick = (now) => {
      const dt = Math.min(32, now - lastTime) / 16.67;
      lastTime = now;

      const maxDrag = maxDragRef.current;

      if (!isDraggingRef.current) {
        // Friction decay on momentum release
        velXRef.current *= Math.pow(0.93, dt);
        if (Math.abs(velXRef.current) < 0.005) velXRef.current = 0;

        targetXRef.current += velXRef.current * dt;

        // Rubber-band elastic snapback when out of bounds
        if (targetXRef.current > 0) {
          targetXRef.current += (0 - targetXRef.current) * 0.14 * dt;
        } else if (targetXRef.current < -maxDrag) {
          targetXRef.current += (-maxDrag - targetXRef.current) * 0.14 * dt;
        }
      }

      // Smooth weighted linear interpolation (creates the signature physical inertia and delay)
      const lerpFactor = isDraggingRef.current ? 0.095 * dt : 0.085 * dt;
      currentXRef.current += (targetXRef.current - currentXRef.current) * lerpFactor;

      quickSetX(currentXRef.current);

      reqIdRef.current = requestAnimationFrame(tick);
    };

    reqIdRef.current = requestAnimationFrame(tick);

    return () => {
      if (reqIdRef.current) cancelAnimationFrame(reqIdRef.current);
    };
  }, [selectedProject]);

  // Pointer event listeners with smooth drag capture & window tracking
  const handlePointerDown = (e) => {
    if (e.button !== 0 && e.pointerType === 'mouse') return; // Left click only
    isDraggingRef.current = true;
    hasMovedRef.current = false;
    dragStartRef.current = {
      x: e.clientX,
      targetX: targetXRef.current,
      time: performance.now()
    };
    lastPointerRef.current = { x: e.clientX, time: performance.now() };
    velXRef.current = 0;

    const onPointerMove = (moveEvent) => {
      if (!isDraggingRef.current) return;
      const dx = moveEvent.clientX - dragStartRef.current.x;

      if (Math.abs(dx) > 6) {
        hasMovedRef.current = true;
      }

      const maxDrag = maxDragRef.current;
      let nextTarget = dragStartRef.current.targetX + dx;

      // Elastic resistance when dragging past boundaries
      if (nextTarget > 0) {
        nextTarget = nextTarget * 0.35;
      } else if (nextTarget < -maxDrag) {
        const over = nextTarget - (-maxDrag);
        nextTarget = -maxDrag + over * 0.35;
      }

      // Measure instantaneous physical velocity
      const now = performance.now();
      const pdt = Math.max(1, now - lastPointerRef.current.time);
      const pdx = moveEvent.clientX - lastPointerRef.current.x;
      velXRef.current = (pdx / pdt) * 14;

      lastPointerRef.current = { x: moveEvent.clientX, time: now };
      targetXRef.current = nextTarget;
    };

    const onPointerUp = () => {
      isDraggingRef.current = false;
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerUp);
      // Small timeout to reset hasMoved so click handler can evaluate it cleanly
      setTimeout(() => {
        hasMovedRef.current = false;
      }, 50);
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointercancel', onPointerUp);
  };

  const handleWheel = (e) => {
    const delta = e.deltaX !== 0 ? e.deltaX : e.deltaY;
    const maxDrag = maxDragRef.current;
    targetXRef.current = Math.max(-maxDrag - 40, Math.min(40, targetXRef.current - delta * 0.85));
  };

  const handleOpenProject = (project) => {
    if (hasMovedRef.current) return; // Ignore click if user was dragging
    setSelectedProject(project);
    navigate(`/works/${project.id}`, { replace: false });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToGallery = () => {
    setSelectedProject(null);
    navigate('/works', { replace: false });
  };

  const handleNextProject = () => {
    if (!selectedProject) return;
    const currentIndex = PROJECTS.findIndex((p) => p.id === selectedProject.id);
    const nextIndex = (currentIndex + 1) % PROJECTS.length;
    const nextProj = PROJECTS[nextIndex];
    setSelectedProject(nextProj);
    navigate(`/works/${nextProj.id}`, { replace: false });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="w-full min-h-screen bg-[#000000] text-white relative select-none overflow-x-hidden font-sans">
      
      {/* Mobile Global Navigation Drawer */}
      <div className="block md:hidden">
        <AaryaNavigationDrawer />
      </div>

      {/* Dynamic Island Global Navbar */}
      <DynamicIslandNavbar activePath="/works" />

      <AnimatePresence mode="wait">
        {!selectedProject ? (
          /* ========================================================================= */
          /* 1. MAIN WORKS GALLERY VIEW */
          /* ========================================================================= */
          <motion.main 
            key="gallery-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="w-full pt-28 sm:pt-36 md:pt-40 pb-20 px-6 sm:px-10 md:px-14 lg:px-20 flex flex-col justify-between"
          >
            
            {/* ========================================================================= */}
            {/* HERO HEADER: CINEMATIC [Center Sharp Image] ARTISTRY */}
            {/* ========================================================================= */}
            <section className="w-full mb-8 sm:mb-12 md:mb-16">
              <div className="w-full flex items-center justify-center gap-3 sm:gap-5 md:gap-8 lg:gap-10">
                
                {/* Left Word: CINEMATIC with Smooth Horizontal Reveal */}
                <HorizontalReveal direction="left" delay={0.1} duration={1.1}>
                  <h1 
                    className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-light tracking-[0.04em] text-white whitespace-nowrap"
                    style={{ fontFamily: "'Syne', 'Inter', sans-serif" }}
                  >
                    CINEMATIC
                  </h1>
                </HorizontalReveal>

                {/* Center Sharp Image with Smooth Reveal */}
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9, clipPath: 'inset(0% 50% 0% 50%)' }}
                  animate={{ opacity: 1, scale: 1, clipPath: 'inset(0% 0% 0% 0%)' }}
                  transition={{ duration: 1.0, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
                  className="w-20 sm:w-32 md:w-44 lg:w-56 xl:w-64 h-12 sm:h-20 md:h-28 lg:h-34 xl:h-38 rounded-none overflow-hidden shrink-0"
                >
                  <img 
                    src="https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=1200&auto=format&fit=crop" 
                    alt="Cinematic Director" 
                    className="w-full h-full object-cover"
                  />
                </motion.div>

                {/* Right Word: ARTISTRY with Smooth Horizontal Reveal */}
                <HorizontalReveal direction="right" delay={0.2} duration={1.1}>
                  <h1 
                    className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-light tracking-[0.04em] text-white whitespace-nowrap"
                    style={{ fontFamily: "'Syne', 'Inter', sans-serif" }}
                  >
                    ARTISTRY
                  </h1>
                </HorizontalReveal>
              </div>

              {/* Editorial Intro Statement with Smooth Horizontal Wipe */}
              <div className="mt-6 sm:mt-8 md:mt-12 max-w-lg text-left">
                <HorizontalReveal direction="left" delay={0.35} duration={1.2}>
                  <p className="text-zinc-300 font-serif text-xs sm:text-sm md:text-base leading-relaxed tracking-normal">
                    A curated showcase of cinematic films, commercial campaigns, and live visual experiences. Driven by a passion for bold visual storytelling, raw emotion, and high-impact creative direction to bring unique stories to life.
                  </p>
                </HorizontalReveal>
              </div>
            </section>

            {/* ========================================================================= */}
            {/* SILKY SMOOTH LERP DRAGGABLE GALLERY TRACK */}
            {/* ========================================================================= */}
            <motion.section 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
              ref={containerRef}
              onPointerDown={handlePointerDown}
              onWheel={handleWheel}
              className="w-full mt-8 sm:mt-12 md:mt-16 overflow-hidden pb-8 pt-2 cursor-grab active:cursor-grabbing relative touch-none select-none"
            >
              <div
                ref={trackRef}
                className="flex items-center h-[320px] sm:h-[370px] md:h-[420px] lg:h-[450px] gap-6 sm:gap-8 md:gap-10 lg:gap-12 min-w-max select-none will-change-transform"
              >
                {PROJECTS.map((project, idx) => (
                  <div 
                    key={project.id} 
                    onClick={() => handleOpenProject(project)}
                    className={`flex flex-col justify-end shrink-0 select-none group cursor-pointer ${project.align}`}
                  >
                    {/* Sharp Image Container */}
                    <div className={`overflow-hidden rounded-none bg-zinc-950 border border-transparent group-hover:border-white/20 transition-all duration-300 shadow-2xl ${project.imageClass}`}>
                      <img 
                        src={project.image} 
                        alt={project.title} 
                        draggable={false}
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 pointer-events-none"
                      />
                    </div>

                    {/* Minimal Underlined Label Directly Below Card with Horizontal Reveal */}
                    <HorizontalReveal direction="left" delay={0.5 + idx * 0.06} duration={0.8}>
                      <div className="mt-2.5 flex items-center justify-between w-full">
                        <span className="text-[11px] sm:text-xs md:text-sm font-sans tracking-tight text-zinc-300 group-hover:text-white border-b border-white pb-0.5 transition-colors">
                          {project.title}
                        </span>
                        <ArrowUpRight className="w-3 h-3 text-zinc-500 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all opacity-0 group-hover:opacity-100" />
                      </div>
                    </HorizontalReveal>
                  </div>
                ))}
              </div>
            </motion.section>

          </motion.main>
        ) : (
          /* ========================================================================= */
          /* 2. FULL-PAGE EDITORIAL PROJECT DETAIL VIEW */
          /* ========================================================================= */
          <motion.div 
            key={`detail-${selectedProject.id}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="w-full min-h-screen pt-6 sm:pt-8 md:pt-20 pb-20 px-4 sm:px-8 md:px-14 lg:px-20 flex flex-col"
          >
            {/* Top Return Button with Horizontal Reveal */}
            <div className="w-full flex items-center justify-between mb-4 sm:mb-6 border-b border-white/10 pb-3">
              <HorizontalReveal direction="left" delay={0.05} duration={0.8}>
                <button 
                  onClick={handleBackToGallery}
                  className="flex items-center gap-3 text-xs sm:text-sm font-mono tracking-[0.2em] text-zinc-400 hover:text-white transition-colors uppercase group cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                  <span className="border-b border-transparent group-hover:border-white pb-0.5">BACK TO WORKS</span>
                </button>
              </HorizontalReveal>

              <HorizontalReveal direction="right" delay={0.08} duration={0.8}>
                <span className="text-[10px] sm:text-xs font-mono tracking-[0.2em] text-zinc-500 uppercase">
                  {selectedProject.category} · {selectedProject.year}
                </span>
              </HorizontalReveal>
            </div>

            {/* Big Headline Header with Cinematic Horizontal Reveal */}
            <div className="w-full mb-6 sm:mb-8">
              <HorizontalReveal direction="left" delay={0.12} duration={1.1}>
                <h1 
                  className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-light tracking-[0.03em] uppercase text-white leading-none mb-3"
                  style={{ fontFamily: "'Syne', 'Inter', sans-serif" }}
                >
                  {selectedProject.title}
                </h1>
              </HorizontalReveal>

              <HorizontalReveal direction="left" delay={0.22} duration={0.9}>
                <p className="font-mono text-xs sm:text-sm tracking-[0.18em] text-zinc-400 uppercase">
                  {selectedProject.role}
                </p>
              </HorizontalReveal>
            </div>

            {/* Cinema-Grade Widescreen Video Player */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.98, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="w-full aspect-video md:aspect-[2.35/1] bg-zinc-950 border border-white/15 rounded-none overflow-hidden shadow-2xl relative mb-12 sm:mb-16"
            >
              <video 
                src={selectedProject.videoUrl} 
                controls 
                autoPlay 
                muted
                defaultMuted
                playsInline
                loop
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_80px_rgba(0,0,0,0.6)]" />
            </motion.div>

            {/* Unique Editorial Project Breakdown Section */}
            <div className="w-full grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-16 items-start border-t border-white/10 pt-10 sm:pt-14">
              
              {/* Left Column: Editorial Synopsis & Narrative */}
              <div className="md:col-span-7 space-y-6">
                <HorizontalReveal direction="left" delay={0.35} duration={0.9}>
                  <h3 className="font-mono text-xs tracking-[0.2em] font-bold text-zinc-400 uppercase">
                    PROJECT SYNOPSIS &amp; CREATIVE DIRECTION
                  </h3>
                </HorizontalReveal>
                
                <HorizontalReveal direction="left" delay={0.42} duration={1.1}>
                  <p className="text-xl sm:text-2xl font-serif text-zinc-100 leading-snug font-normal">
                    "{selectedProject.synopsis}"
                  </p>
                </HorizontalReveal>

                <HorizontalReveal direction="left" delay={0.5} duration={1.1}>
                  <p className="text-zinc-400 font-sans text-xs sm:text-sm md:text-base leading-relaxed tracking-normal">
                    {selectedProject.description}
                  </p>
                </HorizontalReveal>

                <HorizontalReveal direction="left" delay={0.58} duration={0.9}>
                  <div className="pt-4 flex items-center gap-4">
                    <a 
                      href="/about"
                      className="px-6 py-3 bg-white text-black font-mono font-bold text-xs tracking-[0.2em] uppercase rounded-none hover:bg-zinc-200 transition-colors flex items-center gap-3 cursor-pointer"
                    >
                      <span>COMMISSION SIMILAR FILM</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </a>
                  </div>
                </HorizontalReveal>
              </div>

              {/* Right Column: Credits & Technical Specifications */}
              <div className="md:col-span-5 space-y-6 font-mono border-l border-white/10 pl-6 md:pl-10">
                <HorizontalReveal direction="left" delay={0.38} duration={0.9}>
                  <h3 className="text-xs tracking-[0.2em] font-bold text-zinc-400 uppercase">
                    CREDITS &amp; SPECIFICATIONS
                  </h3>
                </HorizontalReveal>

                <div className="space-y-4 text-xs sm:text-sm">
                  {selectedProject.credits.map((item, i) => (
                    <HorizontalReveal key={i} direction="left" delay={0.44 + i * 0.07} duration={0.85}>
                      <div className="space-y-1 border-b border-white/5 pb-2">
                        <span className="text-[10px] tracking-[0.2em] text-zinc-500 uppercase block">
                          {item.label}
                        </span>
                        <span className="text-zinc-200 block font-sans">
                          {item.value}
                        </span>
                      </div>
                    </HorizontalReveal>
                  ))}
                </div>
              </div>

            </div>

            {/* Bottom Next Project Navigator */}
            <div className="w-full mt-16 sm:mt-24 pt-8 border-t border-white/10 flex items-center justify-between">
              <HorizontalReveal direction="left" delay={0.65} duration={0.8}>
                <button 
                  onClick={handleBackToGallery}
                  className="font-mono text-xs tracking-[0.2em] text-zinc-500 hover:text-white uppercase transition-colors cursor-pointer"
                >
                  ← RETURN TO ARCHIVE
                </button>
              </HorizontalReveal>

              <HorizontalReveal direction="right" delay={0.65} duration={0.8}>
                <button 
                  onClick={handleNextProject}
                  className="flex items-center gap-3 font-mono text-xs tracking-[0.2em] text-zinc-300 hover:text-white uppercase transition-colors group cursor-pointer"
                >
                  <span>NEXT PROJECT</span>
                  <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>
              </HorizontalReveal>
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
