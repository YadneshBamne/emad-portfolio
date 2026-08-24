"use client";

import * as React from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

const InstagramIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

export interface AnimatedFooterProps {
  /** Left image URL, sampled into ASCII art. Must be same-origin or CORS-enabled. */
  leftImage?: string;
  /** Right image URL, sampled into ASCII art. Must be same-origin or CORS-enabled. */
  rightImage?: string;

  /** Footer background color. Defaults to "transparent". */
  background?: string;
  /** Text color for links, copy and headings. Defaults to "#ffffff". */
  textColor?: string;

  /** Character ramp, ordered dark → light, used to render the ASCII art. */
  asciiChars?: string;
  /** Color of the ASCII glyphs. Defaults to "#d13c3c". */
  charColor?: string;
  /** Fill color of a highlighted (hovered) cell. Defaults to "#ff2222". */
  hoverColor?: string;
  /** Glyph color inside a highlighted cell. Defaults to "#ffffff". */
  hoverCharColor?: string;
  /** Primary action button color. Defaults to "#e11d48". */
  accentColor?: string;
  /** Number of columns each image is sampled to. Defaults to 80. */
  columns?: number;
  /** Pixel size of each ASCII cell. Defaults to 20. */
  cellSize?: number;
  /** Font size (px) of the ASCII glyphs. Defaults to 18. */
  fontSize?: number;

  /** Pointer parallax strength in px; set to 0 to disable. Defaults to 20. */
  parallaxStrength?: number;
  /** Cursor influence radius, in cells, for the hover highlight. Defaults to 8. */
  hoverRadius?: number;

  /** Play the reveal when the footer scrolls into view. Defaults to true. */
  revealOnScroll?: boolean;
  /** Controlled reveal. */
  revealed?: boolean;

  /** Extra class names for the root element. */
  className?: string;
}

const DEFAULT_ASCII_CHARS = "........:::=+xX#0369";
const HIGHLIGHT_LIFETIME = 300;
const CLUSTER_SIZE = 10;
const PARALLAX_EASE = 0.05;

interface Cell {
  col: number;
  row: number;
  char: string;
  highlightEndTime: number;
}

interface Hand {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  cells: Map<string, Cell>;
  cellList: Cell[];
  rows: number;
  columns: number;
  cellSize: number;
  baselineOffset: number;
  direction: 1 | -1;
}

/** Build the ASCII cell grid for one image by sampling its brightness. */
function buildHandCells(
  image: HTMLImageElement,
  columns: number,
  asciiChars: string,
): { rows: number; cells: Map<string, Cell> } {
  const rows = Math.max(
    1,
    Math.round(columns / (image.naturalWidth / image.naturalHeight || 1)),
  );

  const sampler = document.createElement("canvas");
  sampler.width = columns;
  sampler.height = rows;
  const sampleCtx = sampler.getContext("2d");
  const cells = new Map<string, Cell>();
  if (!sampleCtx) return { rows, cells };

  sampleCtx.drawImage(image, 0, 0, columns, rows);
  const pixels = sampleCtx.getImageData(0, 0, columns, rows).data;
  const backgroundCharIndex = asciiChars.lastIndexOf(".");

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < columns; col++) {
      const offset = (row * columns + col) * 4;
      const brightness =
        (pixels[offset] * 0.299 +
          pixels[offset + 1] * 0.587 +
          pixels[offset + 2] * 0.114) /
        255;
      const charIndex = Math.min(
        asciiChars.length - 1,
        Math.floor((1 - brightness) * asciiChars.length),
      );
      if (charIndex <= backgroundCharIndex) continue;

      cells.set(`${col},${row}`, {
        col,
        row,
        char: asciiChars[charIndex],
        highlightEndTime: 0,
      });
    }
  }

  return { rows, cells };
}

/** Light up a wandering cluster of cells starting from `startCell`. */
function highlightCluster(cells: Map<string, Cell>, startCell: Cell) {
  const now = Date.now();
  startCell.highlightEndTime = now + HIGHLIGHT_LIFETIME;

  const steps = Math.floor(Math.random() * CLUSTER_SIZE) + 1;
  const litCells = [startCell];
  let current = startCell;

  for (let step = 0; step < steps; step++) {
    const neighbours: Cell[] = [];
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        if (dx === 0 && dy === 0) continue;
        const neighbour = cells.get(`${current.col + dx},${current.row + dy}`);
        if (neighbour && !litCells.includes(neighbour)) neighbours.push(neighbour);
      }
    }
    if (neighbours.length === 0) break;

    const next = neighbours[Math.floor(Math.random() * neighbours.length)];
    next.highlightEndTime = now + HIGHLIGHT_LIFETIME + step * 10;
    litCells.push(next);
    current = next;
  }
}

/** Nearest scrollable ancestor */
function getScrollParent(node: HTMLElement | null): HTMLElement | null {
  let el = node?.parentElement ?? null;
  while (el) {
    const overflowY = getComputedStyle(el).overflowY;
    if (overflowY === "auto" || overflowY === "scroll" || overflowY === "overlay") return el;
    el = el.parentElement;
  }
  return null;
}

export function AnimatedFooter({
  leftImage = "/animated-footer/hand-left.jpg",
  rightImage = "/animated-footer/hand-right.jpg",
  background = "#000000",
  textColor = "#ffffff",
  charColor = "#d13c3c",
  hoverColor = "#ef4444",
  hoverCharColor = "#ffffff",
  accentColor = "#e11d48",
  asciiChars = DEFAULT_ASCII_CHARS,
  columns = 80,
  cellSize = 20,
  fontSize = 18,
  parallaxStrength = 20,
  hoverRadius = 8,
  revealOnScroll = true,
  revealed,
  className,
}: AnimatedFooterProps) {
  const rootRef = useRef<HTMLElement>(null);
  const leftWrapRef = useRef<HTMLDivElement>(null);
  const rightWrapRef = useRef<HTMLDivElement>(null);
  const leftCanvasRef = useRef<HTMLCanvasElement>(null);
  const rightCanvasRef = useRef<HTMLCanvasElement>(null);

  // Newsletter Form State
  const [emailInput, setEmailInput] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput || !agreed) return;
    setIsSubscribed(true);
  };

  // Reveal animations
  const animateInRef = useRef<() => void>(() => {});
  const animateOutRef = useRef<() => void>(() => {});

  let isDark = true;
  try {
    const themeObj = useTheme();
    if (themeObj && themeObj.resolvedTheme) {
      isDark = themeObj.resolvedTheme === "dark";
    }
  } catch {
    isDark = true;
  }

  const cc = charColor ?? (isDark ? "#d13c3c" : "#e6b093");
  const hc = hoverColor ?? "#ef4444";
  const hcc = hoverCharColor ?? (isDark ? "#ffffff" : "#ffffff");

  const liveRef = useRef({ charColor: cc, hoverColor: hc, hoverCharColor: hcc, parallaxStrength, hoverRadius });
  useEffect(() => {
    liveRef.current = { charColor: cc, hoverColor: hc, hoverCharColor: hcc, parallaxStrength, hoverRadius };
  }, [cc, hc, hcc, parallaxStrength, hoverRadius]);

  const sig = useMemo(
    () =>
      JSON.stringify({
        leftImage,
        rightImage,
        columns,
        cellSize,
        fontSize,
        asciiChars,
        revealOnScroll,
      }),
    [leftImage, rightImage, columns, cellSize, fontSize, asciiChars, revealOnScroll],
  );

  useEffect(() => {
    const root = rootRef.current;
    const leftWrap = leftWrapRef.current;
    const rightWrap = rightWrapRef.current;
    if (!root || !leftWrap || !rightWrap) return;

    const hands: Hand[] = [];

    const setupHand = (
      image: HTMLImageElement,
      canvas: HTMLCanvasElement,
      direction: 1 | -1,
    ) => {
      const { rows, cells } = buildHandCells(image, columns, asciiChars);
      if (cells.size === 0) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = columns * cellSize * dpr;
      canvas.height = rows * cellSize * dpr;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.font = `${fontSize}px monospace`;
      ctx.textAlign = "center";
      ctx.textBaseline = "alphabetic";

      const metrics = ctx.measureText("X");
      const glyphHeight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
      const baselineOffset = cellSize / 2 + glyphHeight / 2 - metrics.actualBoundingBoxDescent;

      hands.push({
        canvas,
        ctx,
        cells,
        cellList: [...cells.values()],
        rows,
        columns,
        cellSize,
        baselineOffset,
        direction,
      });
    };

    const loadHand = (src: string, canvas: HTMLCanvasElement, direction: 1 | -1) => {
      if (!src) return;
      const image = new Image();
      image.crossOrigin = "anonymous";
      let initialized = false;
      const init = () => {
        if (initialized) return;
        initialized = true;
        setupHand(image, canvas, direction);
      };
      image.onload = init;
      image.src = src;
      if (image.complete && image.naturalWidth) init();
    };
    loadHand(leftImage, leftCanvasRef.current!, 1);
    loadHand(rightImage, rightCanvasRef.current!, -1);

    const renderHand = (hand: Hand, now: number) => {
      const { ctx, cellList, cellSize: cs, baselineOffset, columns: cols, rows } = hand;
      const { charColor: cc, hoverColor: hc, hoverCharColor: hcc } = liveRef.current;
      ctx.clearRect(0, 0, cols * cs, rows * cs);

      for (const cell of cellList) {
        const x = cell.col * cs;
        const y = cell.row * cs;
        const isHighlighted = cell.highlightEndTime > now;

        if (isHighlighted) {
          ctx.fillStyle = hc;
          ctx.fillRect(x, y, cs, cs);
        }
        ctx.fillStyle = isHighlighted ? hcc : cc;
        ctx.fillText(cell.char, x + cs / 2, y + baselineOffset);
      }
    };

    const pointer = { x: 0, y: 0 };
    const drift = { x: 0, y: 0 };
    const curtain = { offset: revealOnScroll ? 125 : 0 };

    const hoverHand = (hand: Hand, clientX: number, clientY: number) => {
      const rect = hand.canvas.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      const mouseCol = ((clientX - rect.left) / rect.width) * hand.columns;
      const mouseRow = ((clientY - rect.top) / rect.height) * hand.rows;

      let closest: Cell | null = null;
      let closestDist = Infinity;
      for (const cell of hand.cellList) {
        const dx = mouseCol - cell.col;
        const dy = mouseRow - cell.row;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < closestDist) {
          closestDist = dist;
          closest = cell;
        }
      }
      if (closest && closestDist <= liveRef.current.hoverRadius) {
        highlightCluster(hand.cells, closest);
      }
    };

    const onMouseMove = (event: MouseEvent) => {
      const strength = liveRef.current.parallaxStrength;
      const rect = root.getBoundingClientRect();
      const w = rect.width || 1;
      const h = rect.height || 1;
      pointer.x = ((event.clientX - rect.left) / w - 0.5) * strength * 2;
      pointer.y = ((event.clientY - rect.top) / h - 0.5) * strength * 2;
      for (const hand of hands) hoverHand(hand, event.clientX, event.clientY);
    };
    window.addEventListener("mousemove", onMouseMove);

    let rafId = 0;
    const frame = () => {
      const now = Date.now();
      for (const hand of hands) renderHand(hand, now);

      drift.x += (pointer.x - drift.x) * PARALLAX_EASE;
      drift.y += (pointer.y - drift.y) * PARALLAX_EASE;
      const strength = liveRef.current.parallaxStrength;
      const scale = 1 + (strength * 2) / 200;

      const wrappers = [leftWrapRef.current, rightWrapRef.current];
      wrappers.forEach((wrapper, i) => {
        if (!wrapper) return;
        const dir = i === 0 ? 1 : -1;
        const revealX = i === 0 ? -curtain.offset : curtain.offset;
        const x = drift.x * dir || 0;
        const y = -drift.y || 0;
        wrapper.style.transform = `translateX(${revealX}%) translate(${x}px, ${y}px) scale(${scale})`;
      });

      rafId = requestAnimationFrame(frame);
    };
    rafId = requestAnimationFrame(frame);

    const animateIn = () => {
      gsap.to(curtain, { offset: 0, duration: 1, ease: "power3.out", overwrite: true });
    };

    const animateOut = () => {
      gsap.to(curtain, { offset: 125, duration: 0.4, ease: "power2.in", overwrite: true });
    };

    animateInRef.current = animateIn;
    animateOutRef.current = animateOut;

    let observer: IntersectionObserver | null = null;

    if (revealed !== undefined) {
      curtain.offset = revealed ? 0 : 125;
    } else if (revealOnScroll) {
      let isRevealed = false;
      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting && !isRevealed) {
              isRevealed = true;
              animateIn();
            } else if (!entry.isIntersecting && isRevealed) {
              isRevealed = false;
              animateOut();
            }
          }
        },
        { root: getScrollParent(root), threshold: 0.2 },
      );
      observer.observe(root);
    }

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", onMouseMove);
      observer?.disconnect();
      gsap.killTweensOf([curtain]);
    };
  }, [sig]);

  useEffect(() => {
    if (revealed === undefined) return;
    if (revealed) animateInRef.current();
    else animateOutRef.current();
  }, [revealed]);

  const startsHidden = revealed !== undefined ? !revealed : revealOnScroll;
  const offEdge = startsHidden ? 125 : 0;

  return (
    <footer
      ref={rootRef}
      className={cn(
        "relative w-full overflow-hidden select-none bg-[#000000] flex flex-col pt-8 sm:pt-10 md:pt-28 lg:pt-32 pb-4 md:pb-2",
        !textColor && "text-white",
        className
      )}
      style={{ backgroundColor: background || "#000000", color: textColor, containerType: "inline-size" }}
    >
      {/* Top Content Grid: Spread across full screen width */}
      <div className="w-full px-6 sm:px-10 md:px-12 lg:px-16 z-20 relative mb-0">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-10 items-start w-full">
          
          {/* Column 1: Contact (Far Left) */}
          <div className="md:col-span-4 lg:col-span-3 space-y-3 font-mono">
            <h3 className="text-xs sm:text-sm tracking-[0.2em] font-bold text-zinc-300 uppercase">
              CONTACT
            </h3>
            
            <div className="space-y-2.5 text-xs sm:text-sm text-zinc-400">
              <div className="space-y-0.5">
                <p className="text-zinc-200">Main Studio · Bandra West</p>
                <p>Mumbai 400050, India</p>
              </div>

              <div className="space-y-1 pt-0.5">
                <a 
                  href="mailto:hello@emadshaikh.com" 
                  className="block text-zinc-200 hover:text-white hover:underline transition-colors"
                >
                  hello@emadshaikh.com
                </a>
                <a 
                  href="tel:+919820012345" 
                  className="block text-zinc-400 hover:text-white transition-colors"
                >
                  +91 98200 12345
                </a>
              </div>
            </div>
          </div>

          {/* Column 2: Newsletter / Campaign Signup (Center) */}
          <div className="md:col-span-5 lg:col-span-6 space-y-3.5 max-w-xl mx-auto w-full">
            <h3 className="font-mono text-xs sm:text-sm tracking-[0.18em] font-bold text-zinc-300 uppercase leading-snug">
              WOULD YOU LIKE TO RECEIVE EXCLUSIVE PRESETS &amp; TOUR ANNOUNCEMENTS?
            </h3>

            {isSubscribed ? (
              <div className="py-3 px-4 bg-white/5 border border-emerald-500/30 rounded-none flex items-center gap-3 text-emerald-400 font-mono text-xs tracking-wider">
                <Check className="w-4 h-4" />
                <span>YOU ARE ON THE VIP LIST. CHECK YOUR INBOX SHORTLY.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-3">
                {/* Underlined Minimal Input with Inline Register Button */}
                <div className="relative flex items-center border-b border-white/20 focus-within:border-white transition-colors pb-1 gap-3">
                  <input
                    type="email"
                    required
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="Enter your email address here"
                    className="w-full bg-transparent px-0 py-1.5 text-xs sm:text-sm text-white placeholder:text-zinc-500 outline-none font-mono"
                  />
                  <button
                    type="submit"
                    style={{ backgroundColor: accentColor }}
                    className="shrink-0 px-4 sm:px-5 py-2 text-black font-mono font-bold text-[11px] tracking-[0.2em] uppercase rounded-none hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-between gap-2.5 cursor-pointer shadow-[0_2px_14px_rgba(225,29,72,0.35)]"
                  >
                    <span>REGISTER</span>
                    <span className="w-1.5 h-1.5 bg-black" />
                  </button>
                </div>

                {/* Confirmation Checkbox */}
                <label className="flex items-start gap-2.5 cursor-pointer group select-none pt-0.5">
                  <input
                    type="checkbox"
                    required
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    className="sr-only"
                  />
                  <div className={`w-3.5 h-3.5 mt-0.5 rounded-none border flex items-center justify-center transition-colors ${
                    agreed 
                      ? 'bg-white border-white text-black' 
                      : 'border-white/30 bg-transparent group-hover:border-white/60'
                  }`}>
                    {agreed && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                  <span className="text-[11px] sm:text-xs text-zinc-400 font-mono leading-relaxed">
                    I hereby confirm that I have read the{" "}
                    <a href="/about" className="underline text-zinc-300 hover:text-white">
                      privacy policy
                    </a>
                    .
                  </span>
                </label>
              </form>
            )}
          </div>

          {/* Column 3: Quick Links & Social (Far Right) */}
          <div className="md:col-span-3 lg:col-span-3 space-y-3 font-mono md:text-right flex flex-col md:items-end">
            <div className="flex items-center gap-4 justify-between md:justify-end w-full">
              <h3 className="text-xs sm:text-sm tracking-[0.2em] font-bold text-zinc-300 uppercase">
                QUICK LINKS
              </h3>
              <a
                href="https://instagram.com/emadshaikh03"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 flex items-center justify-center text-zinc-300 hover:text-white transition-all hover:scale-105"
              >
                <InstagramIcon />
              </a>
            </div>

            <ul className="space-y-1.5 text-xs sm:text-sm text-zinc-400">
              <li>
                <a href="/about" className="hover:text-white hover:underline transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="/about" className="hover:text-white hover:underline transition-colors">
                  Contact
                </a>
              </li>
              <li>
                <a href="/photography" className="hover:text-white hover:underline transition-colors">
                  Photography Gallery
                </a>
              </li>
              <li>
                <a href="/works" className="hover:text-white hover:underline transition-colors">
                  Selected Works
                </a>
              </li>
              <li>
                <a href="/#section-studio" className="hover:text-white hover:underline transition-colors">
                  Preset Studio
                </a>
              </li>
              <li>
                <a href="/about" className="hover:text-white hover:underline transition-colors">
                  Terms &amp; Conditions
                </a>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* ASCII Hands Section: Clean clearance on mobile, pulled up on desktop */}
      <div className="w-full flex items-end justify-center md:justify-between z-10 relative overflow-hidden mt-3 sm:mt-4 md:-mt-32 lg:-mt-40 mb-2 md:-mb-6 px-2 sm:px-6 pointer-events-none gap-2 md:gap-0">
        <div
          ref={leftWrapRef}
          className="relative w-[48%] max-w-[210px] sm:max-w-[280px] md:w-[42%] md:max-w-none md:min-w-[280px] will-change-transform flex justify-end md:block"
          style={{ transform: `translateX(-${offEdge}%)` }}
        >
          <canvas ref={leftCanvasRef} className="block h-auto w-full pointer-events-auto opacity-90" />
        </div>
        <div
          ref={rightWrapRef}
          className="relative w-[48%] max-w-[210px] sm:max-w-[280px] md:w-[42%] md:max-w-none md:min-w-[280px] will-change-transform flex justify-start md:block"
          style={{ transform: `translateX(${offEdge}%)` }}
        >
          <canvas ref={rightCanvasRef} className="block h-auto w-full pointer-events-auto opacity-90" />
        </div>
      </div>

      {/* Bottom Sub-bar / Legal line: Cleanly and tightly below the hands */}
      <div className="w-full px-6 sm:px-10 md:px-12 lg:px-16 pt-0 pb-1 md:pb-0 z-20 relative flex flex-wrap justify-between items-center gap-4 text-[10px] sm:text-xs font-mono tracking-[0.2em] text-zinc-500 uppercase">
        <span>© {new Date().getFullYear()} EMAD SHAIKH. ALL RIGHTS RESERVED.</span>
        <span className="text-zinc-600">CRAFTED FOR VISUAL EXCELLENCE</span>
      </div>

    </footer>
  );
}

export default AnimatedFooter;
