import React, { useEffect, useState, useRef } from 'react';

const SECTIONS = [
  { id: 'section-lens', label: 'LENS' },
  { id: 'section-work', label: 'WORK' },
  { id: 'section-about', label: 'ABOUT' },
  { id: 'section-gallery', label: 'GALLERY' },
  { id: 'section-showcase', label: 'SHOWCASE' },
  { id: 'section-studio', label: 'STUDIO' }
];

export function ScrollProgressIndicator() {
  const [activeSection, setActiveSection] = useState('section-lens');
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeout = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolling(true);
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
      scrollTimeout.current = setTimeout(() => {
        setIsScrolling(false);
      }, 1500); // Hide after 1.5 seconds of no scrolling
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Initial trigger to show it briefly on load
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
    };
  }, []);

  useEffect(() => {
    // We'll keep track of intersection ratios to find the most visible section
    const visibilityMap = new Map();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          visibilityMap.set(entry.target.id, entry.intersectionRatio);
        });

        // Find the section with the highest intersection ratio
        let maxRatio = 0;
        let mostVisibleId = null;

        visibilityMap.forEach((ratio, id) => {
          if (ratio > maxRatio) {
            maxRatio = ratio;
            mostVisibleId = id;
          }
        });

        if (mostVisibleId) {
          setActiveSection(mostVisibleId);
        }
      },
      {
        // Use a small threshold array to get frequent updates on ratio
        threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0],
        // Root margin to bias towards the center of the screen
        rootMargin: '-10% 0px -10% 0px'
      }
    );

    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div 
      className={`fixed right-4 md:right-8 top-1/2 -translate-y-1/2 z-[100] flex flex-col items-end gap-4 pointer-events-none mix-blend-difference transition-all duration-700 ease-in-out ${
        isScrolling ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'
      }`}
    >
      {SECTIONS.map(({ id, label }) => {
        const isActive = activeSection === id;
        return (
          <div key={id} className="relative flex items-center justify-end h-4 w-32 transition-all duration-300">
            {isActive ? (
              <div className="absolute right-0 flex items-center gap-3">
                <span className="text-[10px] font-mono tracking-[0.2em] text-zinc-400 uppercase font-bold">{label}</span>
                <span className="w-8 h-[2px] bg-red-600 shadow-[0_0_8px_rgba(220,38,38,0.6)] rounded-sm"></span>
              </div>
            ) : (
              <div className="absolute right-0 flex items-center justify-end w-8 pr-[3px]">
                {/* 3px padding-right centers the 4px dot within the 8px line space approximately */}
                <div className="w-[4px] h-[4px] rounded-full bg-zinc-600/80"></div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
