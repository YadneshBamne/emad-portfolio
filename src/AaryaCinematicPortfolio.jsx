import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import InfiniteGallery from './components/ui/3d-gallery-photography';
import { AaryaNavigationDrawer } from './components/AaryaNavigationDrawer';

gsap.registerPlugin(ScrollTrigger);

const sampleImages = [
  { src: 'https://images.unsplash.com/photo-1741332966416-414d8a5b8887?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw2fHx8ZW58MHx8fHx8', alt: 'Image 1' },
  { src: 'https://images.unsplash.com/photo-1754769440490-2eb64d715775?q=80&w=1113&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', alt: 'Image 2' },
  { src: 'https://images.unsplash.com/photo-1758640920659-0bb864175983?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwzNHx8fGVufDB8fHx8fA%3D%3D', alt: 'Image 3' },
  { src: 'https://plus.unsplash.com/premium_photo-1758367454070-731d3cc11774?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw0MXx8fGVufDB8fHx8fA%3D%3D', alt: 'Image 4' },
  { src: 'https://images.unsplash.com/photo-1746023841657-e5cd7cc90d2c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw0Nnx8fGVufDB8fHx8fA%3D%3D', alt: 'Image 5' },
  { src: 'https://images.unsplash.com/photo-1741715661559-6149723ea89a?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw1MHx8fGVufDB8fHx8fA%3D%3D', alt: 'Image 6' },
  { src: 'https://images.unsplash.com/photo-1725878746053-407492aa4034?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw1OHx8fGVufDB8fHx8fA%3D%3D', alt: 'Image 7' },
  { src: 'https://images.unsplash.com/photo-1752588975168-d2d7965a6d64?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw2M3x8fGVufDB8fHx8fA%3D%3D', alt: 'Image 8' },
  { src: 'https://images.unsplash.com/photo-1741332966416-414d8a5b8887?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw2fHx8ZW58MHx8fHx8', alt: 'Image 1' },
  { src: 'https://images.unsplash.com/photo-1754769440490-2eb64d715775?q=80&w=1113&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', alt: 'Image 2' },
  { src: 'https://images.unsplash.com/photo-1758640920659-0bb864175983?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwzNHx8fGVufDB8fHx8fA%3D%3D', alt: 'Image 3' },
  { src: 'https://plus.unsplash.com/premium_photo-1758367454070-731d3cc11774?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw0MXx8fGVufDB8fHx8fA%3D%3D', alt: 'Image 4' },
  { src: 'https://images.unsplash.com/photo-1746023841657-e5cd7cc90d2c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw0Nnx8fGVufDB8fHx8fA%3D%3D', alt: 'Image 5' },
  { src: 'https://images.unsplash.com/photo-1741715661559-6149723ea89a?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw1MHx8fGVufDB8fHx8fA%3D%3D', alt: 'Image 6' },
  { src: 'https://images.unsplash.com/photo-1725878746053-407492aa4034?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw1OHx8fGVufDB8fHx8fA%3D%3D', alt: 'Image 7' },
  { src: 'https://images.unsplash.com/photo-1752588975168-d2d7965a6d64?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw2M3x8fGVufDB8fHx8fA%3D%3D', alt: 'Image 8' },
];

const AaryaCinematicPortfolio = () => {
  const containerRef = useRef(null);
  const heroRef = useRef(null);
  const circleRef = useRef(null);
  const bgTextTopRef = useRef(null);
  const bgTextBottomRef = useRef(null);
  const videoRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    // We create a GSAP context to ensure proper cleanup in React strict mode
    const ctx = gsap.context(() => {

      // The main scroll timeline for Hero
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: '+=250%', // Pinned for 2.5 viewport heights
          pin: true,
          scrub: 0.5, // Smooth scrubbing
        }
      });

      // Subtle parallax on the background text as we scroll
      tl.to(bgTextTopRef.current, { y: '-10vh', ease: 'none', duration: 1 }, 0);
      tl.to(bgTextBottomRef.current, { y: '10vh', ease: 'none', duration: 1 }, 0);

      // 1. Scale the circle up until it covers the screen and animate blur (camera focus effect)
      tl.fromTo(circleRef.current,
        { clipPath: 'circle(15vh at 50% 50%)', filter: 'blur(4px)' },
        { clipPath: 'circle(150vh at 50% 50%)', filter: 'blur(0px)', ease: 'power1.inOut', duration: 1 },
        0
      );

      // 2. Montage effect inside the video container
      // This happens after the circle expands (time = 1)
      const images = gsap.utils.toArray('.montage-img');
      if (images.length > 0) {
        images.forEach((img, i) => {
          tl.to(img, { opacity: 1, duration: 0.05, ease: 'none' }, `>`);
          // Hide it right after, except for the last one
          if (i < images.length - 1) {
            tl.to(img, { opacity: 0, duration: 0.05, ease: 'none' }, `>`);
          }
        });
      }

      // Cards entrance animations
      const cards = gsap.utils.toArray('.work-card');
      cards.forEach((card, index) => {
        gsap.fromTo(card,
          { y: 100, opacity: 0, filter: 'blur(10px)' },
          {
            y: 0,
            opacity: 1,
            filter: 'blur(0px)',
            duration: 1.2,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: card,
              start: 'top bottom-=50', // Trigger when card comes into view
              toggleActions: 'play none none reverse'
            }
          }
        );
      });

    }, containerRef); // Scope to container

    return () => ctx.revert(); // Cleanup!
  }, []);

  return (
    <div ref={containerRef} className=" text-white min-h-screen selection:bg-red-600 selection:text-white overflow-x-hidden">

      {/* Global Slide-Out Navigation (Framer Motion) - Mobile Only */}
      <div className="block md:hidden">
        <AaryaNavigationDrawer />
      </div>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex fixed top-0 left-0 w-full z-50 py-8 px-12 items-center justify-center mix-blend-difference pointer-events-none">
        <div className="flex gap-16 font-mono text-sm tracking-[0.2em] uppercase text-white/80 pointer-events-auto">
          <a href="#" className="hover:text-white hover:scale-105 transition-all duration-300">About</a>
          <a href="#" className="hover:text-white hover:scale-105 transition-all duration-300">Work</a>
          <a href="#" className="hover:text-white hover:scale-105 transition-all duration-300">Contact</a>
        </div>
      </nav>

      {/* 2. The Hero Section */}
      <section ref={heroRef} className="relative h-screen w-full overflow-hidden flex items-center justify-center bg-black z-10">

        {/* Background Text */}
        <div className="absolute inset-0 p-10 z-0 pointer-events-none select-none text-[#FF0000] font-bold leading-none tracking-tighter" style={{ fontFamily: "'Anton', sans-serif" }}>
          <h1 ref={bgTextTopRef} className="absolute top-[10%] left-[5%] text-[15vw] md:text-[19vw] uppercase m-0 leading-none">Emad</h1>
          <h1 ref={bgTextBottomRef} className="absolute bottom-[10%] right-[5%] text-[15vw] md:text-[19vw] uppercase m-0 leading-none">Shaikh </h1>
        </div>

        {/* The Center Mask (The Lens) */}
        <div
          ref={circleRef}
          className="absolute z-10 w-full h-full flex items-center justify-center"
        >
          {/* Default background (video or image) inside the circle */}
          <div className="relative w-full h-full bg-neutral-900">
            <video
              ref={videoRef}
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
            <div className="absolute inset-0 bg-black/20 mix-blend-multiply"></div>
          </div>
        </div>

        {/* The Camera UI */}
        <div className="absolute inset-0 z-20 pointer-events-none font-mono text-[10px] md:text-xs text-white/80 p-6 md:p-10 flex flex-col justify-between" style={{ fontFamily: "'Space Mono', monospace" }}>
          <div className="flex justify-between items-start">
            <div className="flex flex-col gap-1">
              <span>50MM LENS</span>
              <span>f/1.4 APERTURE</span>
            </div>
            <div className="flex items-center gap-2 bg-black/40 px-2 py-1 rounded backdrop-blur-sm">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FF0000] animate-pulse"></span>
              <span className="text-[#FF0000] font-bold">[REC]</span>
            </div>
          </div>

          <div className="flex justify-between items-end">
            <div className="flex flex-col gap-1">
              <span>SHUTTER: 1/2500</span>
              <span>ISO: 3200</span>
              <span>AWB: AUTO</span>
            </div>
            <div className="text-white/60 tracking-[0.3em] animate-pulse">
              SCROLL TO FOCUS
            </div>
          </div>

          {/* Crosshairs */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40vw] h-[40vw] md:w-[20vw] md:h-[20vw] border border-white/10 rounded-full flex items-center justify-center opacity-50">
            <div className="w-full h-[1px] bg-white/20 absolute"></div>
            <div className="h-full w-[1px] bg-white/20 absolute"></div>
            <div className="w-[120%] h-[120%] border border-white/5 rounded-full absolute"></div>
            {/* Center dot for focus */}
            <div className="w-1 h-1 bg-[#FF0000] rounded-full absolute"></div>
          </div>

          {/* Rule of thirds grid subtle lines */}
          <div className="absolute top-1/3 left-0 w-full h-[1px] bg-white/5"></div>
          <div className="absolute top-2/3 left-0 w-full h-[1px] bg-white/5"></div>
          <div className="absolute left-1/3 top-0 w-[1px] h-full bg-white/5"></div>
          <div className="absolute left-2/3 top-0 w-[1px] h-full bg-white/5"></div>
        </div>
      </section>

      {/* 4. The Navigation / Divider Bar */}
      <div className="w-full border-t border-white/20 bg-[#0a0a0a] py-5 px-6 md:px-12 flex flex-col md:flex-row justify-between items-center text-xs md:text-sm font-mono text-white/80 z-20 relative shadow-2xl" style={{ fontFamily: "'Space Mono', monospace" }}>
        <div className="mb-3 md:mb-0 tracking-widest text-white/60">02 — SELECT WORK</div>
        <div className="mb-3 md:mb-0 text-center tracking-widest">REEL — EMAD SHAIKH — MULTIDISCIPLINARY CREATIVE</div>
        <div className="flex items-center gap-3">
          <span className="w-2.5 h-2.5 rounded-full bg-[#FF0000] shadow-[0_0_8px_#FF0000] animate-pulse"></span>
          <span className="tracking-widest">REC — HD01</span>
        </div>
      </div>

      {/* 5. The Cards Section */}
      <section className="relative w-full bg-[#050505] py-24 px-4 md:px-8 z-20 overflow-hidden">

        {/* Filmstrip Top Border */}
        <div className="absolute top-0 left-0 w-full h-8 flex items-center overflow-hidden opacity-30 bg-black border-b border-white/10">
          <div className="flex gap-4 px-2 w-[200%] animate-[slide_20s_linear_infinite]">
            {[...Array(50)].map((_, i) => (
              <div key={i} className="w-6 h-4 border-2 border-white/40 rounded-sm shrink-0"></div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 max-w-[1400px] mx-auto mt-8 mb-8">

          {/* Card 1: Photography */}
          <div className="work-card group relative h-[60vh] md:h-[75vh] overflow-hidden bg-neutral-900 border border-white/10 flex items-end">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/e/e9/Photograph_of_a_Photographer.jpg"
              alt="Photography"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 grayscale group-hover:grayscale-0"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-500"></div>
            <div className="relative z-10 p-8 w-full transform transition-transform duration-500 group-hover:-translate-y-4">
              <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white tracking-tighter uppercase" style={{ fontFamily: "'Anton', sans-serif" }}>PHOTOGRAPHY</h2>
              <p className="text-white/70 font-mono text-sm mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 uppercase tracking-widest">Capturing light & moments</p>
              <div className="h-[2px] w-0 bg-[#FF0000] mt-4 transition-all duration-500 group-hover:w-full"></div>
            </div>
          </div>

          {/* Card 2: Videography */}
          <div className="work-card group relative h-[60vh] md:h-[75vh] overflow-hidden bg-neutral-900 border border-white/10 flex items-end">
            <img
              src="https://images.pexels.com/photos/34612064/pexels-photo-34612064.jpeg"
              alt="Videography"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 grayscale group-hover:grayscale-0"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-500"></div>
            <div className="relative z-10 p-8 w-full transform transition-transform duration-500 group-hover:-translate-y-4">
              <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white tracking-tighter uppercase" style={{ fontFamily: "'Anton', sans-serif" }}>VIDEOGRAPHY</h2>
              <p className="text-white/70 font-mono text-sm mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 uppercase tracking-widest">Motion & storytelling</p>
              <div className="h-[2px] w-0 bg-[#FF0000] mt-4 transition-all duration-500 group-hover:w-full"></div>
            </div>
          </div>

          {/* Card 3: Graphic Design */}
          <div className="work-card group relative h-[60vh] md:h-[75vh] overflow-hidden bg-neutral-900 border border-white/10 flex items-end">
            <img
              src="https://images.unsplash.com/photo-1626785774573-4b799315345d?q=80&w=2071&auto=format&fit=crop"
              alt="Graphic Design"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 grayscale group-hover:grayscale-0"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-500"></div>
            <div className="relative z-10 p-8 w-full transform transition-transform duration-500 group-hover:-translate-y-4">
              <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white tracking-tighter uppercase" style={{ fontFamily: "'Anton', sans-serif" }}>GRAPHIC DESIGN</h2>
              <p className="text-white/70 font-mono text-sm mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 uppercase tracking-widest">Visual communication</p>
              <div className="h-[2px] w-0 bg-[#FF0000] mt-4 transition-all duration-500 group-hover:w-full"></div>
            </div>
          </div>

        </div>

        {/* Filmstrip Bottom Border */}
        <div className="absolute bottom-0 left-0 w-full h-8 flex items-center overflow-hidden opacity-30 bg-black border-t border-white/10">
          <div className="flex gap-4 px-2 w-[200%] animate-[slide_20s_linear_infinite_reverse]">
            {[...Array(50)].map((_, i) => (
              <div key={i} className="w-6 h-4 border-2 border-white/40 rounded-sm shrink-0"></div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Infinite 3D Gallery Section */}
      <section className="relative w-full h-screen bg-[#050505] rounded-b-[2.5rem] z-20 flex flex-col overflow-hidden shadow-2xl">
        <div className="w-full  border-t border-white/20 bg-[#0a0a0a] py-5 px-6 md:px-12 flex flex-col md:flex-row justify-between items-center text-xs md:text-sm font-mono text-white/80 z-20 relative shadow-2xl shrink-0" style={{ fontFamily: "'Space Mono', monospace" }}>
          <div className="mb-3 md:mb-0 tracking-widest text-white/60">03 — ARCHIVE</div>
          <div className="mb-3 md:mb-0 text-center tracking-widest">INTERACTIVE 3D GALLERY</div>
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FF0000] shadow-[0_0_8px_#FF0000] animate-pulse"></span>
            <span className="tracking-widest">LIVE</span>
          </div>
        </div>
        <div className="flex-1 relative w-full p-4 md:p-6 lg:p-8 min-h-0">
          <div className="relative w-full h-full bg-[#0a0a0a] rounded-[2rem] border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden">
            <InfiniteGallery
              images={sampleImages}
              speed={1.2}
              zSpacing={3}
              visibleCount={12}
              falloff={{ near: 0.8, far: 14 }}
              className="w-full h-full"
              onImageClick={() => navigate('/gallery')}
            />
            {/* <div className="absolute inset-0 pointer-events-none flex items-center justify-center text-center px-3 mix-blend-difference text-white opacity-20">
              <h1 className="font-serif text-5xl md:text-8xl tracking-tighter uppercase font-bold" style={{ fontFamily: "'Anton', sans-serif" }}>
                Memories
              </h1>
            </div> */}
            <div className="text-center absolute bottom-8 left-0 right-0 font-mono uppercase text-[10px] md:text-xs font-semibold text-white/60 pointer-events-none tracking-widest">
              <p>Use mouse wheel, arrow keys, or touch to navigate. Click to enter full gallery.</p>
            </div>
          </div>
        </div>
      </section>

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

