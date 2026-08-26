import React, { useState } from 'react';
import { 
  MousePointer2, 
  Square, 
  Target, 
  Eye, 
  Minus
} from 'lucide-react';
import { ImageComparison } from './ui/image-comparison-slider';

// Reliable high-contrast concert & editorial presets
const PRESETS = [
  { 
    id: 'purple', 
    name: 'PURPLE STAGE', 
    img: 'https://ik.imagekit.io/4no4se4zt/Emad%20Shaikh/photos/work/DSC-8.jpg?updatedAt=1787198975283',
    afterImg: 'https://ik.imagekit.io/4no4se4zt/Emad%20Shaikh/photos/work/Credits_@emadshaikh03-31.jpg?updatedAt=1787199255482'
  },
  { 
    id: 'blue', 
    name: 'BLUE NEON', 
    img: 'https://ik.imagekit.io/4no4se4zt/Emad%20Shaikh/photos/work/DSC-40(1).jpg?updatedAt=1787198959091',
    afterImg: 'https://ik.imagekit.io/4no4se4zt/Emad%20Shaikh/photos/work/DSC-48%20(1).jpg?updatedAt=1787199008444'
  },
  { 
    id: 'labyrinth', 
    name: 'CINEMA 35', 
    img: 'https://ik.imagekit.io/4no4se4zt/Emad%20Shaikh/photos/work/sequenceCredits@emadshaikh03_KM-43%20(1).jpg?updatedAt=1787199247781',
    afterImg: 'https://ik.imagekit.io/4no4se4zt/Emad%20Shaikh/photos/work/credits_@emadshaikh03-34.jpg?updatedAt=1787199321895'
  },
  { 
    id: 'red', 
    name: 'CRIMSON FLARE', 
    img: 'https://ik.imagekit.io/4no4se4zt/Emad%20Shaikh/photos/work/hanumankind_02.jpg?updatedAt=1787198869718',
    afterImg: 'https://ik.imagekit.io/4no4se4zt/Emad%20Shaikh/photos/work/DSC-9.jpg?updatedAt=1787198996020'
  },
  { 
    id: 'nordic', 
    name: 'NORDIC GOLD', 
    img: 'https://ik.imagekit.io/4no4se4zt/Emad%20Shaikh/photos/work/20251209_184430.jpg?updatedAt=1787198957580',
    afterImg: 'https://ik.imagekit.io/4no4se4zt/Emad%20Shaikh/photos/ISF-14.jpg'
  },
  { 
    id: 'vogue', 
    name: 'EDITORIAL B&W', 
    img: 'https://ik.imagekit.io/4no4se4zt/Emad%20Shaikh/photos/work/VOGUE-2.jpg?updatedAt=1787199298801',
    afterImg: 'https://ik.imagekit.io/4no4se4zt/Emad%20Shaikh/photos/credits_BARICCI_ES_75-6.jpg'
  }
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

  // Normal distribution curve for histogram
  const histogramBars = Array.from({ length: 30 }, (_, i) => {
    const x = (i - 15) / 5;
    const height = Math.exp(-(x * x) / 2) * 100 + Math.random() * 20;
    return Math.min(100, Math.max(5, height));
  });

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

          {/* Center Canvas (Image Comparison) */}
          <div className="preset-studio-canvas flex-1 bg-[#0a0a0a] relative flex items-center justify-center overflow-hidden p-4 sm:p-6">
             <div className="relative w-full h-full max-w-[580px] flex items-center justify-center shadow-2xl">
               <ImageComparison 
                 beforeImage={activePreset.img}
                 afterImage={activePreset.afterImg} 
                 className="h-full w-full max-h-[92%]"
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

        {/* Bottom Bar (Presets Swatches) */}
        <div className="preset-studio-bottom h-24 border-t border-white/10 bg-[#141414] shrink-0 flex items-center px-4 justify-between rounded-b-2xl">
          <div className="flex gap-3 overflow-x-auto h-full items-center py-2 no-scrollbar pr-4 flex-1">
            {PRESETS.map((preset) => {
              const isSelected = activePreset.id === preset.id;
              return (
                <div 
                  key={preset.id}
                  onClick={() => setActivePreset(preset)}
                  className={`preset-studio-swatch relative h-16 min-w-[110px] rounded-none overflow-hidden cursor-pointer shrink-0 border-2 transition-all duration-200 ${
                    isSelected ? 'border-red-600 scale-102 shadow-lg' : 'border-white/10 hover:border-white/40'
                  }`}
                >
                  <img src={preset.img} alt={preset.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 flex items-end p-1.5">
                    <span className="text-[8px] font-mono text-white tracking-widest uppercase truncate w-full text-center drop-shadow-md">
                      {preset.name}
                    </span>
                  </div>
                </div>
              );
            })}
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
