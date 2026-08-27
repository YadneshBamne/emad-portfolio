import React, { useState, useRef, useCallback, useEffect } from 'react';

// This component takes two image URLs (or one image with a custom afterFilter) and creates a slider to compare them.
export const ImageComparison = ({ 
    beforeImage, 
    afterImage, 
    afterFilter,
    altBefore = 'Before', 
    altAfter = 'After',
    className = ""
}) => {
    // State to track the slider's position (from 0 to 100)
    const [sliderPosition, setSliderPosition] = useState(50);
    // State to track if the user is currently dragging the slider
    const [isDragging, setIsDragging] = useState(false);

    // Ref to the main container element to get its dimensions
    const containerRef = useRef(null);

    // Function to handle the slider movement (for both mouse and touch)
    const handleMove = useCallback((clientX) => {
        // If not dragging or no container ref, do nothing
        if (!isDragging || !containerRef.current) return;
        
        // Get the bounding box of the container
        const rect = containerRef.current.getBoundingClientRect();
        // Calculate the new slider position as a percentage
        let newPosition = ((clientX - rect.left) / rect.width) * 100;

        // Clamp the position to be between 0 and 100 to prevent it from going out of bounds
        newPosition = Math.max(0, Math.min(100, newPosition));
        
        setSliderPosition(newPosition);
    }, [isDragging]);

    // Mouse event handlers
    const handleMouseDown = () => setIsDragging(true);
    const handleMouseUp = () => setIsDragging(false);
    const handleMouseMove = (e) => handleMove(e.clientX);
    
    // Touch event handlers
    const handleTouchStart = () => setIsDragging(true);
    const handleTouchEnd = () => setIsDragging(false);
    const handleTouchMove = (e) => handleMove(e.touches[0].clientX);

    // Effect to add and clean up global event listeners for mouse up/leave
    // This ensures dragging stops even if the cursor leaves the component area
    useEffect(() => {
        window.addEventListener('mouseup', handleMouseUp);
        // Clean up the event listener when the component unmounts
        return () => {
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [handleMouseUp]);

    return (
        <div 
            ref={containerRef}
            className={`relative w-full h-full select-none overflow-hidden ${className}`}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseUp}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
        >
            {/* Before Image (Bottom Layer - Raw Original) */}
            <img
                src={beforeImage}
                alt={altBefore}
                className="absolute inset-0 block h-full w-full object-cover"
                draggable="false"
                onError={(e) => {
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=800&auto=format&fit=crop';
                }}
            />

            {/* After Image (Top Layer - Color Graded) - Controlled by clip-path */}
            <div
                className="absolute top-0 left-0 h-full w-full overflow-hidden"
                style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
            >
                <img
                    src={afterImage || beforeImage}
                    alt={altAfter}
                    style={afterFilter ? { filter: afterFilter } : undefined}
                    className="absolute inset-0 h-full w-full object-cover"
                    draggable="false"
                    onError={(e) => {
                      e.currentTarget.src = beforeImage || 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=800&auto=format&fit=crop';
                    }}
                />
            </div>

            {/* Labels - Before and After */}
            <div className="absolute top-4 left-4 z-10 pointer-events-none">
                <span className="bg-black/60 text-white/90 text-[10px] font-mono tracking-widest px-2.5 py-1 rounded-none border border-white/10 backdrop-blur-md uppercase">Before</span>
            </div>
            
            <div className="absolute top-4 right-4 z-10 pointer-events-none">
                <span className="bg-black/60 text-white/90 text-[10px] font-mono tracking-widest px-2.5 py-1 rounded-none border border-white/10 backdrop-blur-md uppercase">After</span>
            </div>

            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 pointer-events-none opacity-70">
                <span className="bg-black/70 border border-white/15 text-white/90 text-[9px] font-mono tracking-[0.2em] px-3 py-1.5 rounded-none backdrop-blur-md uppercase shadow-lg">DRAG TO COMPARE</span>
            </div>

            {/* Slider Handle */}
            <div
                className="absolute top-0 bottom-0 w-[1px] bg-white cursor-ew-resize flex items-center justify-center z-20"
                style={{ left: `calc(${sliderPosition}%)` }} 
                onMouseDown={handleMouseDown}
                onTouchStart={handleTouchStart}
            >
                <div className={`bg-white rounded-full h-7 w-7 flex items-center justify-center shadow-[0_0_15px_rgba(0,0,0,0.6)] transition-transform duration-200 ease-in-out cursor-ew-resize ${isDragging ? 'scale-110 shadow-2xl' : ''}`}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-black">
                        <path d="M15 18l-6-6 6-6" />
                        <path d="M9 18l6-6-6-6" />
                    </svg>
                </div>
            </div>
        </div>
    );
};
