import React, { useState } from 'react';
import { 
  MousePointer2, 
  Square, 
  Target, 
  Eye, 
  Minus
} from 'lucide-react';
import { ImageComparison } from './ui/image-comparison-slider';

// Reliable high-contrast concert & editorial presets matching reference
const PRESETS = [
  { 
    id: 'purple', 
    name: 'PURPLE', 
    orientation: 'portrait',
    aspectRatio: '3/4',
    filter: 'hue-rotate(45deg) saturate(160%) contrast(115%) brightness(105%)', 
    img: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=800&auto=format&fit=crop' 
  },
  { 
    id: 'blue', 
    name: 'BLUE', 
    orientation: 'portrait',
    aspectRatio: '3/4',
    filter: 'hue-rotate(-45deg) saturate(140%) contrast(120%)', 
    img: 'https://images.unsplash.com/photo-1493225457124-a1a2a5f30777?q=80&w=800&auto=format&fit=crop' 
  },
  { 
    id: 'labyrinth', 
    name: 'LABRINTH', 
    orientation: 'landscape',
    aspectRatio: '16/10',
    filter: 'contrast(130%) brightness(85%) saturate(120%)', 
    img: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=800&auto=format&fit=crop' 
  },
  { 
    id: 'red', 
    name: 'RED', 
    orientation: 'portrait',
    aspectRatio: '3/4',
    filter: 'sepia(100%) saturate(320%) hue-rotate(-50deg) contrast(120%)', 
    img: 'https://images.unsplash.com/photo-1542204165-65bf26472b9b?q=80&w=800&auto=format&fit=crop' 
  },
  { 
    id: 'blue2', 
    name: 'BLUE II', 
    orientation: 'portrait',
    aspectRatio: '3/4',
    filter: 'hue-rotate(-90deg) contrast(160%) saturate(150%)', 
    img: 'https://images.unsplash.com/photo-1521336575822-6da63fb45455?q=80&w=800&auto=format&fit=crop' 
  },
  { 
    id: 'chappell', 
    name: 'CHAPPELL ROAN', 
    orientation: 'landscape',
    aspectRatio: '16/10',
    filter: 'saturate(220%) contrast(115%) brightness(110%)', 
    img: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=800&auto=format&fit=crop' 
  },
  { 
    id: 'purple2', 
    name: 'PURPLE II', 
    orientation: 'landscape',
    aspectRatio: '16/10',
    filter: 'hue-rotate(60deg) brightness(1.25) saturate(180%)', 
    img: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=800&auto=format&fit=crop' 
  },
  { 
    id: 'pink', 
    name: 'PINK', 
    orientation: 'portrait',
    aspectRatio: '3/4',
    filter: 'hue-rotate(-30deg) saturate(180%) contrast(115%)', 
    img: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=800&auto=format&fit=crop' 
  },
];

const CustomSlider = ({ label, value, min, max, onChange }) => {
  return (
    <div className="flex items-center justify-between mb-3 group">
      <span className="preset-slider-label text-zinc-400 font-mono text-[10px] w-20">{label}</span>
      <div className="relative flex-1 mx-3 h-[2px] bg-white/15 rounded-none flex items-center preset-slider-track">
        {/* Track highlight */}
        <div 
          className="absolute h-[2px] bg-red-600 rounded-none" 
          style={{ 
            left: value < 0 ? `${((value - min) / (max - min)) * 100}%` : '50%',
            right: value > 0 ? `${100 - (((value - min) / (max - min)) * 100)}%` : '50%'
          }} 
        />
        {/* Thumb */}
        <input 
          type="range" 
          min={min} 
          max={max} 
          value={value} 
          onChange={(e) => onChange(parseInt(e.target.value))}
          className="absolute w-full h-full opacity-0 cursor-pointer"
        />
        <div 
          className="absolute w-2 h-2 bg-white rounded-full pointer-events-none group-hover:scale-150 transition-transform shadow-md preset-slider-thumb"
          style={{ left: `calc(${((value - min) / (max - min)) * 100}% - 4px)` }}
        />
      </div>
      <span className="preset-slider-val text-zinc-300 font-mono text-[10px] w-6 text-right">{value > 0 ? `+${value}` : value}</span>
    </div>
  );
};

export const PresetStudio = () => {
  const [activePreset, setActivePreset] = useState(PRESETS[0]);
  const [naturalAspect, setNaturalAspect] = useState(null);
  
  const [exposure, setExposure] = useState(2);
  const [contrast, setContrast] = useState(0);
  const [highlights, setHighlights] = useState(-10);
  const [shadows, setShadows] = useState(10);
  const [whites, setWhites] = useState(0);
  const [blacks, setBlacks] = useState(0);

  const [temp, setTemp] = useState(6);
  const [tint, setTint] = useState(-8);
  const [vibrance, setVibrance] = useState(12);
  const [saturation, setSaturation] = useState(6);

  // Auto-detect image natural aspect ratio on active preset change
  React.useEffect(() => {
    if (!activePreset?.img) return;
    const img = new window.Image();
    img.src = activePreset.img;
    img.onload = () => {
      if (img.naturalWidth && img.naturalHeight) {
        setNaturalAspect(img.naturalWidth / img.naturalHeight);
      }
    };
  }, [activePreset?.img]);

  // Reset sliders to default
  const handleReset = () => {
    setExposure(2);
    setContrast(0);
    setHighlights(-10);
    setShadows(10);
    setWhites(0);
    setBlacks(0);
    setTemp(6);
    setTint(-8);
    setVibrance(12);
    setSaturation(6);
  };

  // Normal distribution curve for histogram
  const histogramBars = Array.from({ length: 30 }, (_, i) => {
    const x = (i - 15) / 5;
    const height = Math.exp(-(x * x) / 2) * 100 + Math.random() * 20;
    return Math.min(100, Math.max(5, height));
  });

  // Combine preset base filter with real-time sliders
  const computedFilter = `
    ${activePreset.filter || ''}
    brightness(${100 + exposure + highlights * 0.4 + whites * 0.4}%)
    contrast(${100 + contrast}%)
    saturate(${100 + saturation + vibrance}%)
    hue-rotate(${tint * 1.5}deg)
    sepia(${temp > 0 ? temp * 0.7 : 0}%)
  `.trim();

  const isLandscape = (naturalAspect && naturalAspect > 1.1) || activePreset.orientation === 'landscape';

  return (
    <section className="preset-studio-section w-full bg-black py-16 px-4 md:px-8 font-sans flex items-center justify-center min-h-[90vh]">
      <div 
        className="preset-studio-container w-full max-w-[1400px] h-[85vh] bg-[#111111] rounded-2xl border border-white/10 flex flex-col overflow-hidden shadow-2xl relative"
        style={{ transform: 'translateZ(0)' }}
      >
        
        {/* Window Header */}
        <div className="preset-studio-header h-10 border-b border-white/10 flex items-center justify-between px-4 bg-[#141414] shrink-0 rounded-t-2xl">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500/90"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500/90"></div>
            <div className="w-3 h-3 rounded-full bg-green-500/90"></div>
          </div>
          <div className="preset-studio-title font-mono text-[10px] text-zinc-300 tracking-[0.2em] uppercase hidden md:block">
            PRESET STUDIO · <span className="text-red-500 font-bold">{activePreset.name}</span> / COLOR CORRECTION
          </div>
          <div className="flex gap-1.5 opacity-40">
            <div className="w-3.5 h-3.5 border border-white/60 rounded-[2px]"></div>
            <div className="w-3.5 h-3.5 border border-white/60 rounded-[2px]"></div>
            <div className="w-3.5 h-3.5 border border-white/60 rounded-[2px]"></div>
          </div>
        </div>

        {/* Main Workspace Area */}
        <div className="flex flex-1 overflow-hidden">
          
          {/* Left Toolbar */}
          <div className="preset-studio-sidebar w-12 border-r border-white/10 bg-[#111111] flex flex-col items-center py-4 gap-6 shrink-0 z-10">
            <button 
              type="button" 
              aria-label="Selection Tool"
              className="w-8 h-8 rounded-none bg-red-900/30 text-red-500 flex items-center justify-center hover:bg-red-900/50 transition-colors cursor-pointer"
            >
              <MousePointer2 size={16} strokeWidth={1.5} />
            </button>
            <button 
              type="button" 
              aria-label="Crop Tool"
              className="w-8 h-8 rounded-none text-zinc-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <Square size={16} strokeWidth={1.5} />
            </button>
            <button 
              type="button" 
              aria-label="Target Tool"
              className="w-8 h-8 rounded-none text-zinc-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <Target size={16} strokeWidth={1.5} />
            </button>
            <button 
              type="button" 
              aria-label="Preview Tool"
              className="w-8 h-8 rounded-none text-zinc-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <Eye size={16} strokeWidth={1.5} />
            </button>
            <div className="w-4 h-[1px] bg-white/10 my-1"></div>
            <button 
              type="button" 
              aria-label="Adjustment Tool"
              className="w-8 h-8 rounded-none text-zinc-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <Minus size={16} strokeWidth={1.5} />
            </button>
          </div>

          {/* Center Canvas (Image Comparison with Auto-Adjusting Orientation Dimensions) */}
          <div className="preset-studio-canvas flex-1 bg-[#0a0a0a] relative flex items-center justify-center overflow-hidden p-3 sm:p-6">
             <div 
               className="relative h-full flex items-center justify-center shadow-2xl transition-all duration-500 ease-out overflow-hidden"
               style={{ 
                 aspectRatio: naturalAspect || (isLandscape ? 1.6 : 0.75),
                 maxWidth: isLandscape ? '100%' : '520px',
                 maxHeight: '94%',
                 width: 'auto'
               }}
             >
               <ImageComparison 
                 beforeImage={activePreset.img}
                 afterFilter={computedFilter} 
                 className="h-full w-full rounded-sm"
               />
             </div>
          </div>

          {/* Right Sidebar (Color & Light Controls) */}
          <div className="preset-studio-controls w-72 border-l border-white/10 bg-[#111111] flex flex-col shrink-0 overflow-y-auto hidden lg:flex custom-scrollbar">
            
            {/* Histogram */}
            <div className="p-5 border-b border-white/10">
              <div className="text-zinc-400 font-mono text-[9px] tracking-widest mb-4 uppercase">Histogram</div>
              <div className="h-16 flex items-end justify-between gap-[1px]">
                {histogramBars.map((height, i) => (
                  <div 
                    key={i} 
                    className="w-full rounded-t-[1px]" 
                    style={{ 
                      height: `${height}%`,
                      background: i < 10 ? '#3b82f6' : i < 20 ? '#a855f7' : '#ef4444'
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Light Controls */}
            <div className="p-5 border-b border-white/10">
              <div className="text-red-500 font-mono text-[9px] tracking-widest mb-4 uppercase font-bold">Light</div>
              <CustomSlider label="Exposure" value={exposure} min={-50} max={50} onChange={setExposure} />
              <CustomSlider label="Contrast" value={contrast} min={-50} max={50} onChange={setContrast} />
              <CustomSlider label="Highlights" value={highlights} min={-50} max={50} onChange={setHighlights} />
              <CustomSlider label="Shadows" value={shadows} min={-50} max={50} onChange={setShadows} />
              <CustomSlider label="Whites" value={whites} min={-50} max={50} onChange={setWhites} />
              <CustomSlider label="Blacks" value={blacks} min={-50} max={50} onChange={setBlacks} />
            </div>

            {/* Color Controls */}
            <div className="p-5">
              <div className="text-red-500 font-mono text-[9px] tracking-widest mb-4 uppercase font-bold">Color</div>
              <CustomSlider label="Temp" value={temp} min={-50} max={50} onChange={setTemp} />
              <CustomSlider label="Tint" value={tint} min={-50} max={50} onChange={setTint} />
              <CustomSlider label="Vibrance" value={vibrance} min={-50} max={50} onChange={setVibrance} />
              <CustomSlider label="Saturation" value={saturation} min={-50} max={50} onChange={setSaturation} />
            </div>
          </div>
        </div>

        {/* Bottom Bar (Presets Swatches Filmstrip + Action Button) */}
        <div className="preset-studio-bottom h-20 sm:h-22 border-t border-white/10 bg-[#141414] shrink-0 flex items-center px-4 justify-between rounded-b-2xl">
          <div className="flex gap-2 sm:gap-3 overflow-x-auto h-full items-center py-2 no-scrollbar pr-4 flex-1">
            {PRESETS.map((preset) => {
              const isSelected = activePreset.id === preset.id;
              return (
                <button
                  type="button"
                  key={preset.id}
                  onClick={() => setActivePreset(preset)}
                  className={`preset-studio-swatch relative h-12 sm:h-14 w-[74px] sm:w-[84px] md:w-[92px] rounded-none overflow-hidden cursor-pointer shrink-0 border-2 transition-all duration-200 select-none ${
                    isSelected 
                      ? 'border-red-600 scale-105 shadow-[0_0_12px_rgba(220,38,38,0.6)] z-10' 
                      : 'border-white/15 hover:border-white/40 opacity-75 hover:opacity-100'
                  }`}
                >
                  <img 
                    src={preset.img} 
                    alt={preset.name} 
                    className="w-full h-full object-cover pointer-events-none" 
                    style={{ filter: preset.filter }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent flex items-end justify-center p-1 pointer-events-none">
                    <span className="text-[7.5px] sm:text-[8px] font-mono text-white tracking-widest uppercase font-bold text-center truncate w-full drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]">
                      {preset.name}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Action / Reset Button on the right as shown in reference */}
          <div className="pl-4 shrink-0 border-l border-white/10 h-full flex items-center gap-2">
            <button 
              type="button"
              onClick={handleReset}
              className="bg-red-600 hover:bg-red-700 text-white font-mono text-[9px] sm:text-[10px] font-bold tracking-widest uppercase px-4 sm:px-5 py-2 sm:py-2.5 rounded shadow-[0_0_15px_rgba(220,38,38,0.3)] hover:shadow-[0_0_20px_rgba(220,38,38,0.5)] transition-all cursor-pointer select-none whitespace-nowrap"
            >
              RESET STORE
            </button>
          </div>
        </div>
        
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #555;
          border-radius: 4px;
        }
      `}} />
    </section>
  );
};
