import { useEffect, useRef, useState } from "react";

const FONT_FAMILY =
  "var(--font-geist-sans), -apple-system, BlinkMacSystemFont, sans-serif";

const DEFAULT_ITEMS = [
  "/5.png",
  "/6.png",
  "/7.png",
  "/8.png",
  "/9.png",
  "/10.png",
  "/11.png",
  "/12.png",
  "/13.png",
  "/14.png",
  "/15.png",
  "/16.png",
  "/17.png",
  "/18.png",
  "/19.png",
];

export function PerspectiveMarqueeAdapted({
  items = DEFAULT_ITEMS,
  logoWidth = 120,
  logoHeight = 120,
  pixelsPerFrame = 2,
  rotateY = -28,
  rotateX = 8,
  perspective = 1200,
  fadeColor = "#050505",
  background = "#050505",
  speed = 1,
  className,
  durationInFrames = 240,
  fps = 30,
}) {
  const containerRef = useRef(null);
  const [frame, setFrame] = useState(0);
  const frameRef = useRef(0);

  useEffect(() => {
    let animationFrameId;
    const frameDuration = 1000 / fps; // milliseconds per frame
    let lastTime = Date.now();

    const animate = () => {
      const currentTime = Date.now();
      const deltaTime = currentTime - lastTime;

      if (deltaTime >= frameDuration) {
        frameRef.current = (frameRef.current + 1) % durationInFrames;
        setFrame(frameRef.current);
        lastTime = currentTime;
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrameId);
  }, [fps, durationInFrames]);

  const itemPadding = logoWidth * 0.5;
  const approxItemWidth = items.reduce(
    (acc) => acc + logoWidth + itemPadding,
    0
  );

  const offset = -((frame * pixelsPerFrame * speed) % approxItemWidth);
  const rendered = [...items, ...items, ...items];

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        position: "relative",
        width: "100%",
        height: "280px",
        background,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        perspective: `${perspective}px`,
      }}>
      <div
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
          transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
          transformStyle: "preserve-3d",
        }}>
        <div
          style={{
            display: "flex",
            whiteSpace: "nowrap",
            transform: `translateX(${offset}px)`,
            gap: `${itemPadding / 2}px`,
          }}>
          {rendered.map((item, i) => {
            const itemCenter =
              i * (approxItemWidth / items.length) +
              approxItemWidth / items.length / 2 +
              offset;
            const norm = (itemCenter - 640) / 640;
            const distance = Math.min(1, Math.abs(norm));
            const blurPx = distance * 6;
            const opacity = 1 - distance * 0.4;

            return (
              <div
                key={i}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  width: logoWidth,
                  height: logoHeight,
                  filter: `blur(${blurPx}px)`,
                  opacity,
                }}>
                <img
                  src={item}
                  alt={`Logo ${i}`}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>
      {/* Horizontal fade gradient */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background: `linear-gradient(90deg, ${fadeColor} 0%, transparent 18%, transparent 82%, ${fadeColor} 100%)`,
        }} />
      {/* Vertical fade gradient */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background: `linear-gradient(180deg, ${fadeColor} 0%, transparent 25%, transparent 75%, ${fadeColor} 100%)`,
        }} />
    </div>
  );
}
