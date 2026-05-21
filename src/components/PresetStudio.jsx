import React, { useState } from 'react';
import { 
  MousePointer2, 
  Square, 
  Target, 
  Eye, 
  Minus,
  Settings2
} from 'lucide-react';
import { ImageComparison } from './ui/image-comparison-slider';

// Dummy data for presets
const PRESETS = [
  { id: 'purple', name: 'PURPLE', filter: 'hue-rotate(45deg) saturate(150%)', img: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=600&auto=format&fit=crop' },
  { id: 'blue', name: 'BLUE', filter: 'hue-rotate(-45deg) saturate(120%)', img: 'https://images.unsplash.com/photo-1493225457124-a1a2a5f30777?q=80&w=600&auto=format&fit=crop' },
  { id: 'labyrinth', name: 'LABYRINTH', filter: 'contrast(120%) brightness(90%)', img: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=600&auto=format&fit=crop' },
  { id: 'red', name: 'RED', filter: 'sepia(100%) saturate(300%) hue-rotate(-50deg)', img: 'https://images.unsplash.com/photo-1542204165-65bf26472b9b?q=80&w=600&auto=format&fit=crop' },
  { id: 'blue2', name: 'BLUE II', filter: 'hue-rotate(-90deg) contrast(150%)', img: 'https://images.unsplash.com/photo-1521336575822-6da63fb45455?q=80&w=600&auto=format&fit=crop' },
  { id: 'chappell', name: 'CHAPPELL ROAN', filter: 'saturate(200%) contrast(110%)', img: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=600&auto=format&fit=crop' },
  { id: 'purple2', name: 'PURPLE II', filter: 'hue-rotate(60deg) brightness(1.2)', img: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=600&auto=format&fit=crop' },
  { id: 'pink', name: 'PINK', filter: 'hue-rotate(-30deg) saturate(150%)', img: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=600&auto=format&fit=crop' },
];

const CustomSlider = ({ label, value, min, max, onChange }) => {
  return (
    <div className="flex items-center justify-between mb-3 group">
      <span className="text-zinc-500 font-mono text-[10px] w-20">{label}</span>
      <div className="relative flex-1 mx-3 h-[2px] bg-zinc-800 rounded flex items-center">
        {/* Track highlight (red if positive, gray if negative just to look cool, or just grey) */}
        <div 
          className="absolute h-[2px] bg-zinc-600 rounded" 
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
          className="absolute w-1.5 h-1.5 bg-white rounded-full pointer-events-none group-hover:scale-150 transition-transform"
          style={{ left: `calc(${((value - min) / (max - min)) * 100}% - 3px)` }}
        />
      </div>
      <span className="text-zinc-500 font-mono text-[10px] w-6 text-right">{value > 0 ? `+${value}` : value}</span>
    </div>
  );
};

export const PresetStudio = () => {
  const [activePreset, setActivePreset] = useState(PRESETS[0]);
  
  // Fake state for sliders just for interactivity
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

  // Generate fake histogram data
  const histogramBars = Array.from({ length: 30 }, (_, i) => {
    // Normal distribution curve roughly
    const x = (i - 15) / 5;
    const height = Math.exp(-(x * x) / 2) * 100 + Math.random() * 20;
    return Math.min(100, Math.max(5, height));
  });

  return (
    <section className="w-full bg-black py-16 px-4 md:px-8 font-sans flex items-center justify-center min-h-[90vh]">
      <div 
        className="w-full max-w-[1400px] h-[85vh] bg-[#111111] rounded-2xl border border-zinc-800 flex flex-col overflow-hidden shadow-2xl relative"
        style={{ transform: 'translateZ(0)' }} // Enforce WebKit corner clipping
      >
        
        {/* Mac OS Window Header */}
        <div className="h-10 border-b border-zinc-800 flex items-center justify-between px-4 bg-[#141414] shrink-0 rounded-t-2xl">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
          </div>
          <div className="font-mono text-[10px] text-zinc-500 tracking-[0.2em] uppercase hidden md:block">
            PRESET STUDIO · {activePreset.name} / COLOR CORRECTION
          </div>
          <div className="flex gap-1.5 opacity-30">
            <div className="w-4 h-4 border border-white rounded-[2px]"></div>
            <div className="w-4 h-4 border border-white rounded-[2px]"></div>
            <div className="w-4 h-4 border border-white rounded-[2px]"></div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex flex-1 overflow-hidden">
          
          {/* Left Sidebar (Tools) */}
          <div className="w-12 border-r border-zinc-800 bg-[#111111] flex flex-col items-center py-4 gap-6 shrink-0 z-10">
            <button className="w-8 h-8 rounded bg-red-900/30 text-red-500 flex items-center justify-center hover:bg-red-900/50 transition-colors">
              <MousePointer2 size={16} strokeWidth={1.5} />
            </button>
            <button className="w-8 h-8 rounded text-zinc-500 hover:text-zinc-300 flex items-center justify-center transition-colors">
              <Square size={16} strokeWidth={1.5} />
            </button>
            <button className="w-8 h-8 rounded text-zinc-500 hover:text-zinc-300 flex items-center justify-center transition-colors">
              <Target size={16} strokeWidth={1.5} />
            </button>
            <button className="w-8 h-8 rounded text-zinc-500 hover:text-zinc-300 flex items-center justify-center transition-colors">
              <Eye size={16} strokeWidth={1.5} />
            </button>
            <div className="w-4 h-[1px] bg-zinc-800 my-2"></div>
            <button className="w-8 h-8 rounded text-zinc-500 hover:text-zinc-300 flex items-center justify-center transition-colors">
              <Minus size={16} strokeWidth={1.5} />
            </button>
          </div>

          {/* Center Canvas (Image Comparison) */}
          <div className="flex-1 bg-[#0a0a0a] relative flex items-center justify-center overflow-hidden">
             {/* Using absolute positioning and aspect ratio to ensure portrait fit */}
             <div className="relative w-full h-full max-w-[500px] aspect-[4/5] md:aspect-auto md:h-[95%]">
               {/* 
                  Since we are using Unsplash images and applying CSS filters for the 'after' effect, 
                  we need a specialized wrapper or simply pass the same image twice and use CSS on the 'after' one.
                  Wait, ImageComparison doesn't currently support passing custom styles to the after image wrapper. 
                  So we will just pass two different unsplash images or rely on passing a div with a CSS filter to ImageComparison.
                  Actually, a simpler trick: use a component that takes `afterImage` but here I'll just supply two different images from Unsplash.
               */}
               <ImageComparison 
                 beforeImage={activePreset.img}
                 afterImage={PRESETS[(PRESETS.findIndex(p => p.id === activePreset.id) + 1) % PRESETS.length].img} 
                 className="h-full w-full"
               />
             </div>
          </div>

          {/* Right Sidebar (Controls) */}
          <div className="w-72 border-l border-zinc-800 bg-[#111111] flex flex-col shrink-0 overflow-y-auto hidden lg:flex custom-scrollbar">
            
            {/* Histogram */}
            <div className="p-5 border-b border-zinc-800/50">
              <div className="text-zinc-600 font-mono text-[9px] tracking-widest mb-4 uppercase">Histogram</div>
              <div className="h-16 flex items-end justify-between gap-[1px]">
                {histogramBars.map((height, i) => (
                  <div 
                    key={i} 
                    className="w-full rounded-t-[1px]" 
                    style={{ 
                      height: `${height}%`,
                      background: i < 10 ? '#4A6984' : i < 20 ? '#788282' : '#8A5A44'
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Light Controls */}
            <div className="p-5 border-b border-zinc-800/50">
              <div className="text-red-600 font-mono text-[9px] tracking-widest mb-4 uppercase">Light</div>
              <CustomSlider label="Exposure" value={exposure} min={-50} max={50} onChange={setExposure} />
              <CustomSlider label="Contrast" value={contrast} min={-50} max={50} onChange={setContrast} />
              <CustomSlider label="Highlights" value={highlights} min={-50} max={50} onChange={setHighlights} />
              <CustomSlider label="Shadows" value={shadows} min={-50} max={50} onChange={setShadows} />
              <CustomSlider label="Whites" value={whites} min={-50} max={50} onChange={setWhites} />
              <CustomSlider label="Blacks" value={blacks} min={-50} max={50} onChange={setBlacks} />
            </div>

            {/* Color Controls */}
            <div className="p-5">
              <div className="text-red-600 font-mono text-[9px] tracking-widest mb-4 uppercase">Color</div>
              <CustomSlider label="Temp" value={temp} min={-50} max={50} onChange={setTemp} />
              <CustomSlider label="Tint" value={tint} min={-50} max={50} onChange={setTint} />
              <CustomSlider label="Vibrance" value={vibrance} min={-50} max={50} onChange={setVibrance} />
              <CustomSlider label="Saturation" value={saturation} min={-50} max={50} onChange={setSaturation} />
            </div>
          </div>
        </div>

        {/* Bottom Bar (Presets Carousel) */}
        <div className="h-24 border-t border-zinc-800 bg-[#141414] shrink-0 flex items-center px-4 justify-between rounded-b-2xl">
          
          <div className="flex gap-3 overflow-x-auto h-full items-center py-2 no-scrollbar pr-4 flex-1">
            {PRESETS.map((preset) => (
              <div 
                key={preset.id}
                onClick={() => setActivePreset(preset)}
                className={`relative h-16 min-w-[100px] rounded overflow-hidden cursor-pointer shrink-0 border-2 transition-colors ${activePreset.id === preset.id ? 'border-red-600' : 'border-transparent hover:border-zinc-700'}`}
              >
                <img src={preset.img} alt={preset.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 flex items-end p-1.5">
                  <span className="text-[8px] font-mono text-white tracking-widest uppercase truncate w-full text-center drop-shadow-md">
                    {preset.name}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="pl-4 shrink-0 border-l border-zinc-800/50 h-full flex items-center">
            <button className="bg-red-600 hover:bg-red-700 text-white font-mono text-[10px] tracking-widest uppercase px-6 py-2.5 rounded shadow-[0_0_15px_rgba(220,38,38,0.3)] hover:shadow-[0_0_20px_rgba(220,38,38,0.5)] transition-all">
              Visit Store →
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
          background: #333;
          border-radius: 4px;
        }
      `}} />
    </section>
  );
};
