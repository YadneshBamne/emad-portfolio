import React, { useState, useEffect, useRef } from "react";
import { Hexagon } from "lucide-react";
import { useTransitionNavigate } from "../context/TransitionContext";

// 5x4 Bold Pixel Font definition for LETS GET STARTED characters (2-dot thick strokes)
const BOLD_FONT = {
  'A': [
    [0,1,1,0],
    [1,1,1,1],
    [1,1,1,1],
    [1,1,0,1],
    [1,1,0,1]
  ],
  'D': [
    [1,1,1,0],
    [1,1,0,1],
    [1,1,0,1],
    [1,1,0,1],
    [1,1,1,0]
  ],
  'E': [
    [1,1,1,1],
    [1,1,0,0],
    [1,1,1,1],
    [1,1,0,0],
    [1,1,1,1]
  ],
  'G': [
    [0,1,1,1],
    [1,1,0,0],
    [1,1,0,1],
    [1,1,0,1],
    [0,1,1,1]
  ],
  'L': [
    [1,1,0,0],
    [1,1,0,0],
    [1,1,0,0],
    [1,1,0,0],
    [1,1,1,1]
  ],
  'R': [
    [1,1,1,0],
    [1,1,0,1],
    [1,1,1,0],
    [1,1,1,1],
    [1,1,0,1]
  ],
  'S': [
    [0,1,1,1],
    [1,1,0,0],
    [0,1,1,0],
    [0,0,1,1],
    [1,1,1,0]
  ],
  'T': [
    [1,1,1,1],
    [0,1,1,0],
    [0,1,1,0],
    [0,1,1,0],
    [0,1,1,0]
  ]
};

export default function AaryaDotMatrixFooter() {
  const navigate = useTransitionNavigate();
  const [cols, setCols] = useState(89);
  const [rows, setRows] = useState(15);

  const gridRef = useRef(null);
  const dotMatrixRef = useRef([]); // 2D array [row][col] of DOM nodes
  const lastActiveDots = useRef([]); // tracks currently scaled elements

  // Responsive columns calculation to keep dots circular and fit viewport edge-to-edge
  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      if (w < 640) {
        setCols(41); // fit 38-dot wide text wrapped
        setRows(13); // wrapped two-line layout requires 13 rows
      } else if (w < 1024) {
        setCols(81); // fit 77-dot wide single line
        setRows(15);
      } else {
        setCols(89); // spacious desktop grid
        setRows(15);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Pre-index the DOM nodes for 0ms lookup latency during hover tracking
  useEffect(() => {
    if (gridRef.current) {
      const allDots = gridRef.current.querySelectorAll(".dot-matrix-dot");
      const matrix = [];
      allDots.forEach((dot) => {
        const r = parseInt(dot.getAttribute("data-row"), 10);
        const c = parseInt(dot.getAttribute("data-col"), 10);
        if (!matrix[r]) matrix[r] = [];
        matrix[r][c] = dot;
      });
      dotMatrixRef.current = matrix;
    }
  }, [cols, rows]);

  // Evaluates if a coordinate is part of the text "LETS GET STARTED" using bold font
  const isShapePoint = (col, row, totalCols, totalRows) => {
    // Mobile Viewport (Wrapped Layout)
    if (totalCols <= 41) {
      const line1 = "LETS GET";
      const line2 = "STARTED";
      
      const getLineWidth = (text) => {
        const letters = text.split("");
        let w = 0;
        letters.forEach((char, i) => {
          w += char === " " ? 3 : 4;
          if (i < letters.length - 1) w += 1;
        });
        return w;
      };
      
      const w1 = getLineWidth(line1);
      const w2 = getLineWidth(line2);
      
      const startCol1 = Math.floor((totalCols - w1) / 2);
      const startCol2 = Math.floor((totalCols - w2) / 2);
      
      // Total text layout height = 5 (line1) + 1 (gap) + 5 (line2) = 11 rows
      const startRow = Math.floor((totalRows - 11) / 2);
      
      // Line 1 evaluation
      if (row >= startRow && row < startRow + 5) {
        if (col < startCol1 || col >= startCol1 + w1) return false;
        let currentOffset = startCol1;
        const letters = line1.split("");
        for (let i = 0; i < letters.length; i++) {
          const char = letters[i];
          const width = char === " " ? 3 : 4;
          if (col >= currentOffset && col < currentOffset + width) {
            if (char === " ") return false;
            const fontChar = BOLD_FONT[char];
            return fontChar ? fontChar[row - startRow][col - currentOffset] === 1 : false;
          }
          currentOffset += width + 1;
        }
      }
      
      // Line 2 evaluation
      if (row >= startRow + 6 && row < startRow + 11) {
        if (col < startCol2 || col >= startCol2 + w2) return false;
        let currentOffset = startCol2;
        const letters = line2.split("");
        for (let i = 0; i < letters.length; i++) {
          const char = letters[i];
          const width = char === " " ? 3 : 4;
          if (col >= currentOffset && col < currentOffset + width) {
            if (char === " ") return false;
            const fontChar = BOLD_FONT[char];
            return fontChar ? fontChar[row - (startRow + 6)][col - currentOffset] === 1 : false;
          }
          currentOffset += width + 1;
        }
      }
      
      return false;
    } else {
      // Tablet and Desktop Viewports (Single Line Layout)
      const text = "LETS GET STARTED";
      const letters = text.split("");
      
      let totalWidth = 0;
      letters.forEach((char, i) => {
        totalWidth += char === " " ? 3 : 4;
        if (i < letters.length - 1) totalWidth += 1;
      });
      
      const startCol = Math.floor((totalCols - totalWidth) / 2);
      const startRow = Math.floor((totalRows - 5) / 2);
      
      if (row < startRow || row >= startRow + 5) return false;
      if (col < startCol || col >= startCol + totalWidth) return false;
      
      let currentOffset = startCol;
      for (let i = 0; i < letters.length; i++) {
        const char = letters[i];
        const width = char === " " ? 3 : 4;
        
        if (col >= currentOffset && col < currentOffset + width) {
          if (char === " ") return false;
          const fontChar = BOLD_FONT[char];
          return fontChar ? fontChar[row - startRow][col - currentOffset] === 1 : false;
        }
        
        currentOffset += width + 1;
      }
      
      return false;
    }
  };

  // Ultra low-latency mouse tracking that updates styles directly in the DOM
  const handleMouseEnter = (activeC, activeR) => {
    // Disable hover scale and hover color changes on mobile screens (cols <= 41)
    if (cols <= 41) return;

    // 1. Revert previous active elements
    lastActiveDots.current.forEach((dot) => {
      if (dot) {
        const isShape = dot.getAttribute("data-shape") === "true";
        dot.style.transform = "scale(1.0)";
        dot.style.backgroundColor = isShape ? "#FF0000" : "#27272A";
      }
    });

    // 2. Fetch and style 3x3 adjacent elements
    const nextActiveDots = [];
    for (let r = activeR - 1; r <= activeR + 1; r++) {
      for (let c = activeC - 1; c <= activeC + 1; c++) {
        const dot = dotMatrixRef.current[r]?.[c];
        if (dot) {
          dot.style.transform = "scale(1.4)";
          dot.style.backgroundColor = "#FF0000";
          nextActiveDots.push(dot);
        }
      }
    }

    lastActiveDots.current = nextActiveDots;
  };

  // Resets the grid layout when the cursor leaves
  const handleMouseLeave = () => {
    if (cols <= 41) return; // ignore on mobile

    lastActiveDots.current.forEach((dot) => {
      if (dot) {
        const isShape = dot.getAttribute("data-shape") === "true";
        dot.style.transform = "scale(1.0)";
        dot.style.backgroundColor = isShape ? "#FF0000" : "#27272A";
      }
    });
    lastActiveDots.current = [];
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@500;700;900&display=swap');
      ` }} />

      <footer 
        className="w-full bg-black text-white  pt-10 md:pt-16 lg:pt-24 pb-6 select-none relative z-20 font-sans border-t border-zinc-900"
        style={{ fontFamily: "'Outfit', sans-serif" }}
      >
        {/* 1. Top Section (Branding & Links) */}
        <div className="flex flex-col lg:flex-row justify-between items-start gap-12 lg:gap-8 pb-16 border-b border-zinc-900 px-10 md:px-16 lg:px-24">
          
          {/* Left Side: Branding */}
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate("/")}>
            <span className="text-4xl md:text-5xl font-black tracking-tighter text-white lowercase">
              emad shaikh<span className="text-[#FF0000]">.</span>
            </span>
          </div>

          {/* Right Side: Navigation */}
          <div className="grid grid-cols-2 gap-12 sm:gap-24">
            
            {/* Column 1: Navigation Links */}
            <div className="flex flex-col gap-6">
              <span className="text-[9px] font-mono tracking-[0.25em] text-zinc-500 uppercase block mb-1">NAVIGATION</span>
              <div className="flex flex-col gap-2">
                <button 
                  onClick={() => navigate("/photography")}
                  className="text-left font-bold text-white hover:text-[#FF0000] transition-colors cursor-pointer uppercase text-xs tracking-widest"
                >
                  STUDIO
                </button>
                <button 
                  onClick={() => navigate("/works")}
                  className="text-left font-bold text-white hover:text-[#FF0000] transition-colors cursor-pointer uppercase text-xs tracking-widest"
                >
                  PROJECTS
                </button>
                <button 
                  onClick={() => navigate("/community")}
                  className="text-left font-bold text-white hover:text-[#FF0000] transition-colors cursor-pointer uppercase text-xs tracking-widest"
                >
                  CONTACT
                </button>
                <button 
                  onClick={() => navigate("/gallery")}
                  className="text-left font-bold text-white hover:text-[#FF0000] transition-colors cursor-pointer uppercase text-xs tracking-widest"
                >
                  GALLERY
                </button>
              </div>
            </div>

            {/* Column 2: Brand Info */}
            <div className="flex flex-col gap-6">
              <span className="text-[9px] font-mono tracking-[0.25em] text-zinc-500 uppercase block mb-1">CONNECT & FIND US</span>
              <div className="flex flex-col gap-2 text-stone-400 text-xs font-semibold leading-relaxed">
                <a 
                  href="mailto:hello@emadshaikh.com"
                  className="hover:text-[#FF0000] transition-colors block"
                >
                  hello@emadshaikh.com
                </a>
                <a 
                  href="https://instagram.com" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-[#FF0000] transition-colors block uppercase tracking-wider"
                >
                  @EMADSHAIKH
                </a>
                <p className="text-zinc-500 mt-2 text-[10px] leading-relaxed uppercase tracking-wider">
                  Bandra West, Mumbai<br />
                  MH, India
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* 2. Middle Section (The Interactive Dot Matrix Grid) - Full Width */}
        <div 
          ref={gridRef}
          className="w-full flex flex-col items-center py-12 overflow-hidden border-b border-zinc-900 px-2 sm:px-4"
          onMouseLeave={handleMouseLeave}
        >
          {/* Expanded Grid */}
          <div 
            className="grid gap-1.5 md:gap-2 justify-center mx-auto"
            style={{ 
              gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
              width: "fit-content"
            }}
          >
            {Array.from({ length: rows }).map((_, r) => (
              Array.from({ length: cols }).map((_, c) => {
                const isShape = isShapePoint(c, r, cols, rows);

                return (
                  <div
                    key={`${r}-${c}`}
                    data-col={c}
                    data-row={r}
                    data-shape={isShape ? "true" : "false"}
                    onMouseEnter={() => handleMouseEnter(c, r)}
                    className={`dot-matrix-dot w-1.5 h-1.5 sm:w-2 sm:h-2 md:w-2.5 md:h-2.5 rounded-full ${cols > 41 ? "cursor-pointer" : "cursor-default"}`}
                    style={{
                      backgroundColor: isShape ? "#FF0000" : "#27272A",
                      transform: "scale(1.0)",
                      transition: "transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), background-color 0.4s ease"
                    }}
                  />
                );
              })
            ))}
          </div>
        </div>

        {/* 3. Bottom Section (Metadata) */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-10 text-xs text-zinc-500 font-semibold tracking-wider uppercase px-10 md:px-16 lg:px-24">
          <p className="text-center sm:text-left">
            &copy; 2026 EMAD SHAIKH. ALL RIGHTS RESERVED
          </p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">TERMS</a>
            <a href="#" className="hover:text-white transition-colors">PRIVACY</a>
          </div>
        </div>

      </footer>
    </>
  );
}
