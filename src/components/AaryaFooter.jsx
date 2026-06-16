import React, { useState } from "react";
import { useTransitionNavigate } from "../context/TransitionContext";

export default function AaryaFooter() {
  const navigate = useTransitionNavigate();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@800;900&display=swap');
      ` }} />

      <footer className="relative w-full z-20 font-sans select-none flex flex-col justify-between overflow-hidden">
        
        {/* 1. The Top Section (Dark Grid with Increased Height) */}
        <div className="relative w-full bg-black text-stone-200 pt-24 md:pt-36 pb-48 md:pb-64 px-6 md:px-16 lg:px-24">
          
          <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-16 lg:gap-8">
            
            {/* Column 1: The Hook */}
            <div className="flex flex-col justify-between min-h-[140px]">
              <div>
                <h2 
                  className="text-5xl md:text-7xl font-light uppercase tracking-tight leading-none text-white mb-4"
                  style={{ fontFamily: "'Outfit', sans-serif" }}
                >
                  LIFE IN<br />MOTION
                </h2>
                <p className="text-zinc-500 font-mono text-xs uppercase tracking-widest">
                  Based in Mumbai, IN
                </p>
              </div>
            </div>

            {/* Column 2: Contact & Location */}
            <div className="flex flex-col gap-8">
              <div>
                <span className="text-[9px] font-mono tracking-[0.25em] text-zinc-500 uppercase block mb-2.5">LET'S TALK</span>
                <a 
                  href="mailto:hello@emadshaikh.com" 
                  className="text-sm font-medium hover:text-[#FF0000] transition-colors relative pb-1 group w-fit block font-mono"
                >
                  hello@emadshaikh.com
                  <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#FF0000] transition-all duration-300 group-hover:w-full"></span>
                </a>
              </div>
              <div>
                <span className="text-[9px] font-mono tracking-[0.25em] text-zinc-500 uppercase block mb-2.5">FIND US</span>
                <p className="text-xs font-semibold text-stone-400 leading-relaxed font-mono">
                  Creative Hub, Bandra West<br />
                  Mumbai, MH, India
                </p>
                <a 
                  href="https://maps.google.com" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-[10px] font-mono tracking-wider hover:text-[#FF0000] transition-colors mt-2 inline-flex items-center gap-1 group"
                >
                  Map <span className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200">↗</span>
                </a>
              </div>
            </div>

            {/* Column 3: Partner Links */}
            <div className="flex flex-col gap-4">
              <span className="text-[9px] font-mono tracking-[0.25em] text-zinc-500 uppercase block mb-1.5">PARTNER LINKS</span>
              <div className="flex flex-col gap-3 items-start">
                <button 
                  onClick={() => navigate('/photography')} 
                  className="text-xs font-semibold hover:text-[#FF0000] transition-colors uppercase font-mono tracking-wider relative pb-1 group w-fit cursor-pointer text-left"
                >
                  STUDIO
                  <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#FF0000] transition-all duration-300 group-hover:w-full"></span>
                </button>
                <button 
                  onClick={() => navigate('/works')} 
                  className="text-xs font-semibold hover:text-[#FF0000] transition-colors uppercase font-mono tracking-wider relative pb-1 group w-fit cursor-pointer text-left"
                >
                  PROJECTS
                  <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#FF0000] transition-all duration-300 group-hover:w-full"></span>
                </button>
                <button 
                  onClick={() => navigate('/community')} 
                  className="text-xs font-semibold hover:text-[#FF0000] transition-colors uppercase font-mono tracking-wider relative pb-1 group w-fit cursor-pointer text-left"
                >
                  CONTACT
                  <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#FF0000] transition-all duration-300 group-hover:w-full"></span>
                </button>
              </div>
            </div>

            {/* Column 4: Newsletter & Social */}
            <div className="flex flex-col gap-6">
              <div>
                <span className="text-[9px] font-mono tracking-[0.25em] text-zinc-500 uppercase block mb-2.5">STAY IN THE LOOP</span>
                <p className="text-xs text-stone-400 leading-relaxed mb-4 font-mono uppercase tracking-wider">
                  Sign up for preset releases, film projects, and news.
                </p>
                <form onSubmit={handleSubscribe} className="relative w-full border-b border-stone-200/30 pb-2 flex items-center justify-between">
                  {subscribed ? (
                    <span className="text-[10px] text-[#FF0000] font-mono uppercase tracking-widest">Subscribed!</span>
                  ) : (
                    <>
                      <input 
                        type="email" 
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email Address" 
                        className="bg-transparent text-xs text-white placeholder-stone-600 focus:outline-none w-full pr-8 font-sans"
                      />
                      <button type="submit" className="hover:text-white transition-colors cursor-pointer absolute right-0 group">
                        <span className="inline-block transform transition-transform duration-200 group-hover:translate-x-1">→</span>
                      </button>
                    </>
                  )}
                </form>
              </div>
              <div>
                <span className="text-[9px] font-mono tracking-[0.25em] text-zinc-500 uppercase block mb-2">LET'S GET SOCIAL ↘</span>
                <a 
                  href="https://instagram.com" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-sm font-bold uppercase tracking-widest hover:text-[#FF0000] transition-colors relative pb-1 group w-fit block font-sans"
                >
                  @EMADSHAIKH
                  <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#FF0000] transition-all duration-300 group-hover:w-full"></span>
                </a>
              </div>
            </div>

          </div>

          {/* SVG Wave Boundary Mask (Brand Red fill) */}
          <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-10 pointer-events-none">
            <svg 
              className="relative block w-full h-[60px] md:h-[100px]" 
              viewBox="0 0 1200 120" 
              preserveAspectRatio="none"
              style={{ fill: "#FF0000" }}
            >
              <path d="M0,60 C150,110 350,110 500,60 C650,10 850,10 1000,60 C1100,85 1150,85 1200,60 L1200,120 L0,120 Z"></path>
            </svg>
          </div>

          {/* Giant melting text (Brand Red) resting on the bottom wave line */}
          <div className="absolute bottom-0 left-0 w-full flex justify-center z-0 select-none pointer-events-none translate-y-[-12%] md:translate-y-[-8%]">
            <h1 
              className="text-[9vw] sm:text-[10vw] md:text-[11vw] font-black uppercase text-[#FF0000] leading-none tracking-tighter whitespace-nowrap"
              style={{ fontFamily: "'Outfit', sans-serif" }}
            >
              emad shaikh
            </h1>
          </div>

        </div>

        {/* 3. The Sub-Footer (Light Section - Brand Red background with black text) */}
        <div className="w-full bg-[#FF0000] text-black py-8 md:py-12 px-6 md:px-16 lg:px-24 flex flex-col md:flex-row justify-between items-center gap-6 z-20 relative select-none">
          
          {/* Left: Brand mark */}
          <div 
            className="text-base md:text-lg font-black tracking-[0.35em] uppercase"
            style={{ fontFamily: "'Outfit', sans-serif" }}
          >
            EMAD
          </div>

          {/* Center: Legal links & Copyright */}
          <div className="flex flex-col items-center gap-2">
            <div 
              className="flex gap-6 text-[9px] sm:text-[10px] font-black tracking-[0.3em] uppercase"
              style={{ fontFamily: "'Outfit', sans-serif" }}
            >
              <a href="#" className="hover:opacity-60 transition-opacity">TERMS</a>
              <a href="#" className="hover:opacity-60 transition-opacity">PRIVACY</a>
            </div>
            <span 
              className="text-[9px] sm:text-[10px] font-bold tracking-[0.25em] uppercase text-zinc-900 text-center opacity-85"
              style={{ fontFamily: "'Outfit', sans-serif" }}
            >
              &copy; 2026 EMAD SHAIKH. ALL RIGHTS RESERVED
            </span>
          </div>

          {/* Right: Creator Credit */}
          <div 
            className="text-[9px] sm:text-[10px] font-black tracking-[0.25em] uppercase text-zinc-900 opacity-85"
            style={{ fontFamily: "'Outfit', sans-serif" }}
          >
            SITE BY ANTIGRAVITY
          </div>

        </div>

      </footer>
    </>
  );
}
