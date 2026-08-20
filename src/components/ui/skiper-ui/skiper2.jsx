import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { 
  Play, 
  Pause, 
  Music, 
  PhoneCall, 
  Compass, 
  Flame, 
  Sparkles, 
  Camera, 
  X, 
  ChevronRight
} from 'lucide-react';

// Physics spring config matching iOS Dynamic Island feel
const springTransition = {
  type: "spring",
  stiffness: 400,
  damping: 30,
  mass: 0.8,
};

/**
 * Animated Audio Equalizer Bar indicator
 */
export const AudioWaveform = ({ isPlaying = true, color = "bg-emerald-400" }) => {
  return (
    <div className="flex items-end gap-[2px] h-3.5 px-1">
      {[0.6, 1.2, 0.4, 0.9, 0.5].map((speed, i) => (
        <motion.span
          key={i}
          className={`w-[2.5px] rounded-full ${color}`}
          animate={isPlaying ? { height: ['20%', '100%', '35%', '85%', '20%'] } : { height: '25%' }}
          transition={isPlaying ? {
            duration: speed,
            repeat: Infinity,
            repeatType: "mirror",
            ease: "easeInOut"
          } : { duration: 0.3 }}
        />
      ))}
    </div>
  );
};

/**
 * Skiper2 Dynamic Island Core Component
 * Supports multiple views: 'idle', 'music', 'timer', 'call', 'expanded'
 */
export function DynamicIsland({
  view = 'idle',
  setView,
  activePath = '/',
  onNavigate,
  className = ""
}) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [timerSeconds, setTimerSeconds] = useState(42);

  // Timer counter simulation
  useEffect(() => {
    if (view === 'timer') {
      const interval = setInterval(() => {
        setTimerSeconds((prev) => prev + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [view]);

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <LayoutGroup id="skiper2-dynamic-island">
      <motion.div
        layout
        transition={springTransition}
        className={`relative z-[10000] mx-auto overflow-hidden bg-black border border-white/20 text-white shadow-[0_20px_50px_rgba(0,0,0,0.9)] backdrop-blur-2xl ${className}`}
        style={{
          borderRadius: view === 'expanded' ? '32px' : '9999px',
        }}
      >
        {/* Camera Lens / Sensor Detail (iPhone Island Realism) */}
        <div className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5 opacity-30 z-20">
          <div className="w-2.5 h-2.5 rounded-full bg-blue-950 border border-blue-800/40 shadow-inner" />
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-950/60" />
        </div>

        {/* Interactive Content Container */}
        <motion.div 
          layout 
          className="relative z-10 w-full h-full flex items-center justify-between"
        >
          <AnimatePresence mode="wait">
            {/* VIEW: EXPANDED */}
            {view === 'expanded' && (
              <motion.div
                key="expanded-view"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.92 }}
                transition={{ duration: 0.2 }}
                className="w-full p-5 md:p-6 flex flex-col gap-5 text-white"
              >
                {/* Header Row */}
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-400 to-orange-600 p-[1px] shadow-lg">
                      <img 
                        src="/logo.avif" 
                        alt="Emad Shaikh" 
                        className="w-full h-full object-cover rounded-full bg-black"
                      />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold tracking-wider text-white font-sans uppercase">
                        EMAD SHAIKH
                      </h4>
                      <p className="text-[11px] font-mono text-emerald-400 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                        MULTIDISCIPLINARY CREATIVE
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (setView) setView('idle');
                    }}
                    className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                    aria-label="Close Dynamic Island"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Quick Navigation Links */}
                <div className="grid grid-cols-2 gap-2 font-mono text-xs">
                  {[
                    { label: 'ABOUT', path: '/about', icon: Sparkles },
                    { label: 'PHOTOGRAPHY', path: '/photography', icon: Camera },
                    { label: 'WORKS', path: '/works', icon: Compass },
                    { label: 'COMMUNITY', path: '/community', icon: Flame },
                  ].map((item) => {
                    const Icon = item.icon;
                    const isActive = activePath === item.path;
                    return (
                      <button
                        key={item.path}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onNavigate) onNavigate(item.path);
                          if (setView) setView('idle');
                        }}
                        className={`flex items-center justify-between p-3 rounded-2xl border transition-all duration-300 group cursor-pointer ${
                          isActive 
                            ? 'bg-white text-black border-white font-bold shadow-lg' 
                            : 'bg-white/5 border-white/10 text-white/90 hover:bg-white/15 hover:border-white/20'
                        }`}
                      >
                        <span className="flex items-center gap-2 tracking-widest text-[11px]">
                          <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-black' : 'text-amber-400'}`} />
                          {item.label}
                        </span>
                        <ChevronRight className={`w-3.5 h-3.5 opacity-60 group-hover:translate-x-0.5 transition-transform ${isActive ? 'text-black' : 'text-white'}`} />
                      </button>
                    );
                  })}
                </div>

                {/* Media Player Widget Bar inside Expanded Island */}
                <div className="flex items-center justify-between bg-white/5 border border-white/10 rounded-2xl p-3.5">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 via-pink-600 to-amber-500 flex items-center justify-center shadow-md">
                      <Music className="w-4 h-4 text-white" />
                    </div>
                    <div className="text-left">
                      <p className="text-xs font-semibold text-white tracking-wide">Cinematic Reel Audio</p>
                      <p className="text-[10px] font-mono text-white/50">Emad Shaikh — Studio Mix</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <AudioWaveform isPlaying={isPlaying} color="bg-amber-400" />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsPlaying(!isPlaying);
                      }}
                      className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition-transform cursor-pointer"
                    >
                      {isPlaying ? <Pause className="w-3.5 h-3.5 fill-black" /> : <Play className="w-3.5 h-3.5 fill-black ml-0.5" />}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* VIEW: MUSIC / WAVE */}
            {view === 'music' && (
              <motion.div
                key="music-view"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="w-full h-full px-4 flex items-center justify-between gap-3 font-mono text-xs cursor-pointer"
                onClick={() => setView && setView('expanded')}
              >
                <div className="flex items-center gap-2 pl-6">
                  <div className="w-6 h-6 rounded-md bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center">
                    <Music className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-[11px] font-medium text-white/90 truncate max-w-[100px] md:max-w-[130px]">
                    Cinematic Mix
                  </span>
                </div>
                <AudioWaveform isPlaying={isPlaying} color="bg-purple-400" />
              </motion.div>
            )}

            {/* VIEW: TIMER / RECORDING */}
            {view === 'timer' && (
              <motion.div
                key="timer-view"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="w-full h-full px-4 flex items-center justify-between gap-3 font-mono text-xs cursor-pointer"
                onClick={() => setView && setView('expanded')}
              >
                <div className="flex items-center gap-2 pl-6">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_#ef4444]" />
                  <span className="text-red-400 font-bold tracking-widest text-[11px]">REC</span>
                </div>
                <span className="text-white/80 font-mono text-xs font-semibold pr-2">
                  {formatTime(timerSeconds)}
                </span>
              </motion.div>
            )}

            {/* VIEW: CALL / RING */}
            {view === 'call' && (
              <motion.div
                key="call-view"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="w-full h-full px-4 flex items-center justify-between gap-3 font-mono text-xs cursor-pointer"
                onClick={() => setView && setView('expanded')}
              >
                <div className="flex items-center gap-2 pl-6">
                  <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center animate-bounce">
                    <PhoneCall className="w-3 h-3 text-black" />
                  </div>
                  <span className="text-emerald-400 font-medium text-[11px]">
                    Studio Line Active
                  </span>
                </div>
                <AudioWaveform isPlaying={true} color="bg-emerald-400" />
              </motion.div>
            )}

            {/* VIEW: IDLE / COMPACT (Default collapsed state) */}
            {view === 'idle' && (
              <motion.div
                key="idle-view"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="w-full h-full px-3 py-1.5 flex items-center justify-between gap-3 cursor-pointer group"
                onClick={() => setView && setView('expanded')}
              >
                {/* Left Side: Avatar / Logo */}
                <div className="flex items-center gap-2 pl-6">
                  <div className="w-6 h-6 rounded-full bg-white/10 p-[1px] overflow-hidden border border-white/20 shrink-0">
                    <img 
                      src="/logo.avif" 
                      alt="Logo" 
                      className="w-full h-full object-cover rounded-full" 
                    />
                  </div>
                  <span className="font-mono text-[11px] font-semibold text-white/90 tracking-widest uppercase hidden sm:inline-block">
                    EMAD SHAIKH
                  </span>
                </div>

                {/* Right Side: Visual Indicator */}
                <div className="flex items-center gap-2 pr-1">
                  <AudioWaveform isPlaying={true} color="bg-amber-400" />
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_#34d399]" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </LayoutGroup>
  );
}

/**
 * Options Bar to control dynamic island state (used in Demo/Previews)
 */
export function Options({ view, setView }) {
  return (
    <div className="flex items-center justify-center gap-2 p-2 bg-black/40 border border-white/10 rounded-full backdrop-blur-md">
      {['idle', 'music', 'timer', 'call', 'expanded'].map((mode) => (
        <button
          key={mode}
          onClick={() => setView(mode)}
          className={`px-3 py-1 text-[10px] font-mono rounded-full uppercase transition-all ${
            view === mode 
              ? 'bg-white text-black font-bold' 
              : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
          }`}
        >
          {mode}
        </button>
      ))}
    </div>
  );
}
