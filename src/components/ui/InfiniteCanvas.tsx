"use client"

import React, { useEffect, useRef, useState, useCallback } from "react"
import gsap from "gsap"

export type CanvasItem = {
  id?: string | number
  src?: string
  image?: { src?: string; srcSet?: string; alt?: string }
  alt?: string
  code?: string
  title?: string
  aperture?: string
  shutter?: string
  iso?: string
  lens?: string
  orientation?: string
}

export interface InfiniteCanvasProps {
  items: CanvasItem[]
  itemWidth?: number
  itemHeight?: number
  gap?: number
  onItemClick?: (item: CanvasItem, index: number) => void
  enableWheel?: boolean
  enableMotionBlur?: boolean
  className?: string
  style?: React.CSSProperties
}

export default function InfiniteCanvas({
  items,
  itemWidth = 275,
  itemHeight = 360,
  gap = 55,
  onItemClick,
  enableWheel = true,
  enableMotionBlur = true,
  className = "",
  style,
}: InfiniteCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  // Grid layout state
  const [gridConfig, setGridConfig] = useState({
    cols: 6,
    rows: 5,
    tileW: itemWidth,
    tileH: itemHeight,
    cellW: itemWidth + gap,
    cellH: itemHeight + gap,
    totalW: 6 * (itemWidth + gap),
    totalH: 5 * (itemHeight + gap),
    totalTiles: 30,
  })

  const [isDraggingState, setIsDraggingState] = useState(false)
  const isDraggingRef = useRef(false)
  const hasMovedRef = useRef(false)
  const dragStartRef = useRef({ x: 0, y: 0, time: 0 })
  const lastPointerRef = useRef({ x: 0, y: 0, time: 0 })

  // Physics states: target (cursor position) vs current (interpolated with smooth weight/delay)
  const targetPosRef = useRef({ x: 0, y: 0 })
  const currentPosRef = useRef({ x: 0, y: 0 })
  const velRef = useRef({ x: 0, y: 0 })

  const tilesRef = useRef<HTMLDivElement[]>([])
  const quickSettersRef = useRef<{ setX: gsap.QuickSetterFunction; setY: gsap.QuickSetterFunction }[]>([])
  const reqIdRef = useRef<number | null>(null)

  // Resize handler to compute optimal column/row counts based on viewport
  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const updateGrid = () => {
      const rect = el.getBoundingClientRect()
      const vw = rect.width || window.innerWidth
      const vh = rect.height || window.innerHeight

      const isMobile = vw < 768
      const currentItemW = isMobile ? Math.min(220, vw * 0.58) : itemWidth
      const currentItemH = isMobile ? currentItemW * 1.35 : itemHeight
      const currentGap = isMobile ? Math.max(36, Math.round(gap * 0.55)) : gap

      const cellW = currentItemW + currentGap
      const cellH = currentItemH + currentGap

      const cols = Math.max(5, Math.ceil(vw / cellW) + 2)
      const rows = Math.max(4, Math.ceil(vh / cellH) + 2)
      const totalW = cols * cellW
      const totalH = rows * cellH
      const totalTiles = cols * rows

      setGridConfig({
        cols,
        rows,
        tileW: currentItemW,
        tileH: currentItemH,
        cellW,
        cellH,
        totalW,
        totalH,
        totalTiles,
      })
    }

    updateGrid()
    window.addEventListener("resize", updateGrid)
    return () => window.removeEventListener("resize", updateGrid)
  }, [itemWidth, itemHeight, gap])

  // Setup high-performance GSAP quickSetters whenever grid configuration changes
  useEffect(() => {
    quickSettersRef.current = tilesRef.current.map((el) => {
      if (!el) return { setX: () => {}, setY: () => {} }
      return {
        setX: gsap.quickSetter(el, "x", "px"),
        setY: gsap.quickSetter(el, "y", "px"),
      }
    })
  }, [gridConfig.totalTiles])

  // High-performance physics loop (60fps/120fps direct hardware-accelerated transformation)
  useEffect(() => {
    const { cols, cellW, cellH, totalW, totalH, totalTiles } = gridConfig
    const wrapX = gsap.utils.wrap(-cellW, totalW - cellW)
    const wrapY = gsap.utils.wrap(-cellH, totalH - cellH)

    let lastTime = performance.now()

    const tick = (now: number) => {
      const dt = Math.min(32, now - lastTime) / 16.67
      lastTime = now

      if (!isDraggingRef.current) {
        // Friction decay on momentum release
        velRef.current.x *= Math.pow(0.94, dt)
        velRef.current.y *= Math.pow(0.94, dt)

        if (Math.abs(velRef.current.x) < 0.005) velRef.current.x = 0
        if (Math.abs(velRef.current.y) < 0.005) velRef.current.y = 0

        targetPosRef.current.x += velRef.current.x * dt
        targetPosRef.current.y += velRef.current.y * dt
      }

      // Smooth weighted linear interpolation (the minute drag delay that gives realistic physical weight)
      const lerpFactor = isDraggingRef.current ? 0.095 * dt : 0.085 * dt
      currentPosRef.current.x += (targetPosRef.current.x - currentPosRef.current.x) * lerpFactor
      currentPosRef.current.y += (targetPosRef.current.y - currentPosRef.current.y) * lerpFactor

      const curX = currentPosRef.current.x
      const curY = currentPosRef.current.y

      // Update positions of all tiles with seamless 2D wrapping
      const setters = quickSettersRef.current
      for (let i = 0; i < totalTiles; i++) {
        const setter = setters[i]
        if (!setter) continue

        const col = i % cols
        const row = Math.floor(i / cols)

        const rawX = col * cellW + curX
        const rawY = row * cellH + curY

        const wrappedX = wrapX(rawX)
        const wrappedY = wrapY(rawY)

        setter.setX(wrappedX)
        setter.setY(wrappedY)
      }

      reqIdRef.current = requestAnimationFrame(tick)
    }

    reqIdRef.current = requestAnimationFrame(tick)
    return () => {
      if (reqIdRef.current) cancelAnimationFrame(reqIdRef.current)
    }
  }, [gridConfig])

  // Mouse Wheel navigation with smooth momentum accumulation
  useEffect(() => {
    if (!enableWheel) return
    const el = containerRef.current
    if (!el) return

    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      targetPosRef.current.x -= e.deltaX * 0.9
      targetPosRef.current.y -= e.deltaY * 0.9
      velRef.current.x = -e.deltaX * 0.4
      velRef.current.y = -e.deltaY * 0.4
    }

    el.addEventListener("wheel", onWheel, { passive: false })
    return () => el.removeEventListener("wheel", onWheel)
  }, [enableWheel])

  // Global pointer movement listener for seamless drag across entire screen
  useEffect(() => {
    const handleGlobalPointerMove = (e: PointerEvent) => {
      if (!isDraggingRef.current) return

      const dx = e.clientX - lastPointerRef.current.x
      const dy = e.clientY - lastPointerRef.current.y

      const totalDist = Math.hypot(e.clientX - dragStartRef.current.x, e.clientY - dragStartRef.current.y)
      if (totalDist > 6) {
        hasMovedRef.current = true
      }

      targetPosRef.current.x += dx
      targetPosRef.current.y += dy

      const now = performance.now()
      const dt = Math.max(1, now - lastPointerRef.current.time)
      velRef.current.x = (dx / dt) * 16.67
      velRef.current.y = (dy / dt) * 16.67

      lastPointerRef.current = { x: e.clientX, y: e.clientY, time: now }
    }

    const handleGlobalPointerUp = () => {
      isDraggingRef.current = false
      setIsDraggingState(false)
    }

    window.addEventListener("pointermove", handleGlobalPointerMove)
    window.addEventListener("pointerup", handleGlobalPointerUp)
    window.addEventListener("pointercancel", handleGlobalPointerUp)

    return () => {
      window.removeEventListener("pointermove", handleGlobalPointerMove)
      window.removeEventListener("pointerup", handleGlobalPointerUp)
      window.removeEventListener("pointercancel", handleGlobalPointerUp)
    }
  }, [])

  // Canvas background pointer down handler
  const handleContainerPointerDown = useCallback((e: React.PointerEvent) => {
    if (e.button !== 0) return
    isDraggingRef.current = true
    setIsDraggingState(true)
    hasMovedRef.current = false
    dragStartRef.current = { x: e.clientX, y: e.clientY, time: Date.now() }
    lastPointerRef.current = { x: e.clientX, y: e.clientY, time: performance.now() }
    velRef.current = { x: 0, y: 0 }
  }, [])

  // Tile pointer down handler
  const handleTilePointerDown = useCallback((e: React.PointerEvent) => {
    if (e.button !== 0) return
    isDraggingRef.current = true
    setIsDraggingState(true)
    hasMovedRef.current = false
    dragStartRef.current = { x: e.clientX, y: e.clientY, time: Date.now() }
    lastPointerRef.current = { x: e.clientX, y: e.clientY, time: performance.now() }
    velRef.current = { x: 0, y: 0 }
  }, [])

  // Tile pointer up handler — checks distance moved to trigger click accurately
  const handleTilePointerUp = useCallback(
    (e: React.PointerEvent, item: CanvasItem, index: number) => {
      const dist = Math.hypot(e.clientX - dragStartRef.current.x, e.clientY - dragStartRef.current.y)
      const duration = Date.now() - dragStartRef.current.time

      isDraggingRef.current = false
      setIsDraggingState(false)

      if (dist < 8 && duration < 600) {
        onItemClick?.(item, index)
      }
    },
    [onItemClick]
  )

  const handleTileClick = useCallback(
    (e: React.MouseEvent, item: CanvasItem, index: number) => {
      e.stopPropagation()
      if (!hasMovedRef.current) {
        onItemClick?.(item, index)
      }
    },
    [onItemClick]
  )

  if (!items || items.length === 0) return null

  const { tileW, tileH } = gridConfig

  return (
    <div
      ref={containerRef}
      onPointerDown={handleContainerPointerDown}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        overflow: "hidden",
        touchAction: "none",
        userSelect: "none",
        cursor: isDraggingState ? "grabbing" : "grab",
        backgroundColor: "#070707",
        ...style,
      }}
      className={`relative w-full h-full select-none ${className}`}
    >
      {/* Grid Container */}
      <div className="absolute inset-0 w-full h-full pointer-events-none">
        {Array.from({ length: gridConfig.totalTiles }).map((_, index) => {
          const item = items[index % items.length]
          const src = item?.src ?? item?.image?.src
          const alt = item?.alt ?? item?.title ?? item?.code ?? `Photo ${index + 1}`

          return (
            <div
              key={index}
              ref={(el) => {
                if (el) tilesRef.current[index] = el
              }}
              onPointerDown={handleTilePointerDown}
              onPointerUp={(e) => handleTilePointerUp(e, item, index)}
              onClick={(e) => handleTileClick(e, item, index)}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: `${tileW}px`,
                height: `${tileH}px`,
                willChange: "transform",
                contain: "layout paint",
                pointerEvents: "auto",
              }}
              className="group cursor-pointer rounded-none overflow-hidden bg-[#111114] border border-white/5 hover:border-white/25 transition-colors duration-200"
            >
              {/* Sharp image container (exact aspect ratio, clean sharp corners) */}
              <div className="relative w-full h-full overflow-hidden bg-[#0a0a0c]">
                {src ? (
                  <img
                    src={src}
                    alt={alt}
                    draggable={false}
                    loading="lazy"
                    className="w-full h-full object-cover rounded-none transition-transform duration-500 ease-out group-hover:scale-104 group-hover:brightness-110 select-none pointer-events-none"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center font-mono text-xs text-zinc-600">
                    {index + 1}
                  </div>
                )}

                {/* Subtle dark ambient gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                {/* Minimalist HUD bottom label on hover */}
                {item.code && (
                  <div className="absolute bottom-2.5 left-2.5 right-2.5 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                    <span className="font-mono text-[9px] tracking-widest text-white/90 bg-black/70 backdrop-blur-sm px-2 py-0.5 rounded-none border border-white/10">
                      {item.code}
                    </span>
                    {item.lens && (
                      <span className="font-mono text-[8.5px] tracking-wider text-zinc-300 bg-black/70 backdrop-blur-sm px-2 py-0.5 rounded-none border border-white/10 hidden sm:inline">
                        {item.lens}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
