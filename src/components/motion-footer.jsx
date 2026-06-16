import React from "react";
import { useTransitionNavigate } from "../context/TransitionContext";

export function CinematicFooter() {
  const navigate = useTransitionNavigate();

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@800;900&display=swap');
      ` }} />
      
      {/* 
        Normal Scrolling Footer:
        Joins and scrolls naturally at the bottom of all page content.
        Height is set to exactly 50vh (half the screen height).
      */}
      <footer
        className="relative w-full h-[50vh] flex flex-col justify-between overflow-hidden bg-[#050505] text-[#f8fafc] border-t border-white/5 z-20"
      >
        {/* 1. Spacious Clean Top Area */}
        <div className="flex-grow flex items-center justify-center pointer-events-none select-none" />

        {/* 2. Giant Lowercase Brand Name (Outfit Font) */}
        <div 
          className="w-full flex justify-center items-end select-none pointer-events-none pb-2 z-10"
        >
          <h1 
            className="text-[13vw] font-black lowercase leading-[0.8] text-[#FF0000] tracking-tighter text-center select-none"
            style={{ fontFamily: "'Outfit', sans-serif" }}
          >
            emad shaikh
          </h1>
        </div>

        {/* 3. Divider Line & Bottom Metadata Bar */}
        <div className="w-full px-6 md:px-12 pb-8 md:pb-10 z-20 flex flex-col items-center">
          {/* Horizontal Line sits perfectly under the text without overlapping */}
          <div className="w-full h-[1px] bg-white/10 mb-6 md:mb-8" />

          {/* Metadata Bar */}
          <div className="w-full flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] md:text-xs font-mono tracking-widest text-[#94a3b8] select-none">
            
            {/* Left Side: Prompt icon + Links */}
            <div className="flex items-center flex-wrap gap-4 md:gap-6 justify-center md:justify-start">
              <span className="text-[#FF0000] font-bold font-mono mr-1 select-none">&gt;_</span>
              <button onClick={() => navigate('/photography')} className="hover:text-white transition-colors cursor-pointer uppercase font-bold">STUDIO</button>
              <button onClick={() => navigate('/works')} className="hover:text-white transition-colors cursor-pointer uppercase font-bold">PROJECTS</button>
              <button onClick={() => navigate('/community')} className="hover:text-white transition-colors cursor-pointer uppercase font-bold">CONTACT</button>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors uppercase font-bold cursor-pointer">LINKEDIN</a>
            </div>

            {/* Right Side: Copyright */}
            <div className="text-[10px] md:text-xs text-[#94a3b8] opacity-80 uppercase">
              &copy; 2026 EMAD SHAIKH
            </div>

          </div>
        </div>
      </footer>
    </>
  );
}