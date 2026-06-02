import React, { useState, useEffect } from 'react';

const VhsRecorder = ({ children }) => {
  const [tvState, setTvState] = useState('off'); // 'off', 'turningOn', 'on'
  const [time, setTime] = useState('');
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    let timeInterval;
    let counterInterval;

    if (tvState === 'on' || tvState === 'turningOn') {
      const updateTime = () => {
        const today = new Date();
        const h = today.getHours().toString().padStart(2, '0');
        const m = today.getMinutes().toString().padStart(2, '0');
        const s = today.getSeconds().toString().padStart(2, '0');
        setTime(`${h}:${m}:${s}`);
      };
      
      updateTime(); // initial call
      timeInterval = setInterval(updateTime, 500);

      counterInterval = setInterval(() => {
        setCounter(prev => prev + 1);
      }, 1000);
    }

    // Lock body scrolling until the animation is fully complete and tv is 'on'
    if (tvState !== 'on') {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      clearInterval(timeInterval);
      clearInterval(counterInterval);
      document.body.style.overflow = ''; // Cleanup scroll lock on unmount
    };
  }, [tvState]);

  const handlePlay = () => {
    setTvState('turningOn');
    setTimeout(() => {
      setTvState('on');
    }, 800); // match animation duration
  };

  const pad = (val) => val.toString().padStart(2, '0');
  const minutes = pad(Math.floor(counter / 60));
  const seconds = pad(counter % 60);

  const text = "REC";

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black font-['Press_Start_2P'] text-white text-[2rem] flex items-center justify-center">
      <style>
        {`
          @import url('https://fonts.googleapis.com/css?family=Press+Start+2P');

          @keyframes noise {
            0%, 100% { background-position: 0 0; }
            10% { background-position: -5% -10%; }
            20% { background-position: -15% 5%; }
            30% { background-position: 7% -25%; }
            40% { background-position: 20% 25%; }
            50% { background-position: -25% 10%; }
            60% { background-position: 15% 5%; }
            70% { background-position: 0 15%; }
            80% { background-position: 25% 35%; }
            90% { background-position: -10% 10%; }
          }

          @keyframes linesOpacity {
            0% { opacity: 0.6; }
            20% { opacity: 0.3; }
            35% { opacity: 0.5; }
            50% { opacity: 0.8; }
            60% { opacity: 0.4; }
            80% { opacity: 0.7; }
            100% { opacity: 0.6; }
          }
          @keyframes rgbText {
            0%, 25%, 55% { text-shadow: -1px 1px 8px rgba(255, 255, 255, 0.6), 1px -1px 8px rgba(255, 255, 235, 0.7), 0px 0 3px rgba(251, 0, 231, 0.8), 0 0px 3px rgba(0, 233, 235, 0.8), 0px 0 3px rgba(0, 242, 14, 0.8), 0 0px 3px rgba(244, 45, 0, 0.8), 0px 0 3px rgba(59, 0, 226, 0.8); }
            45%, 90%, 100% { text-shadow: -1px 1px 8px rgba(255, 255, 255, 0.6), 1px -1px 8px rgba(255, 255, 235, 0.7), 5px 0 1px rgba(251, 0, 231, 0.8), 0 5px 1px rgba(0, 233, 235, 0.8), -5px 0 1px rgba(0, 242, 14, 0.8), 0 5px 1px rgba(244, 45, 0, 0.8), -5px 0 1px rgba(59, 0, 226, 0.8); }
            50% { text-shadow: -1px 1px 8px rgba(255, 255, 255, 0.6), 1px -1px 8px rgba(255, 255, 235, 0.7), -5px 0 1px rgba(251, 0, 231, 0.8), 0 -5px 1px rgba(0, 233, 235, 0.8), 5px 0 1px rgba(0, 242, 14, 0.8), 0 5px 1px rgba(244, 45, 0, 0.8), -5px 0 1px rgba(59, 0, 226, 0.8); }
          }
          @keyframes type {
            0%, 19% { opacity: 0; }
            20%, 100% { opacity: 1; }
          }
          @keyframes tvTurnOn {
            0% { transform: scale(0, 0.005) translate3d(0, 0, 0); filter: blur(20px); opacity: 0; }
            20% { transform: scale(1, 0.005) translate3d(0, 0, 0); filter: blur(10px); opacity: 1; }
            40% { transform: scale(1, 0.005) translate3d(0, 0, 0); filter: blur(10px); opacity: 1; }
            100% { transform: scale(1, 1) translate3d(0, 0, 0); filter: blur(0px); opacity: 1; }
          }
          .animate-noise::before {
            content: ''; position: absolute; inset: 0; pointer-events: none;
            background: url('https://ice-creme.de/images/background-noise.png');
            background-size: 150%;
            will-change: background-position; animation: noise 1s infinite alternate;
          }
          .animate-scanlines-wrapper {
            will-change: opacity; animation: linesOpacity 3s linear infinite;
          }
          .animate-scanlines::before {
            content: ''; position: absolute; inset: 0; pointer-events: none;
            will-change: background, background-size; animation: scanlines 0.2s linear infinite;
          }
          .animate-rgb-text { will-change: text-shadow; animation: rgbText 1s steps(9) 0s infinite alternate; }
          .animate-rgb-text-slow { will-change: text-shadow; animation: rgbText 2s steps(9) 0s infinite alternate; }
          
          .tv-turn-on {
            animation: tvTurnOn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          }
        `}
      </style>

      {tvState === 'off' && (
        <div className="fixed inset-0 z-[9999] bg-black flex items-center justify-center">
          <button 
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handlePlay();
            }}
            className="z-50 px-10 py-6 bg-transparent hover:bg-white/10 text-white text-4xl border-[4px] border-white/50 hover:border-white transition-all duration-300 animate-pulse hover:animate-none cursor-pointer tracking-widest"
          >
            &gt; PLAY
          </button>
        </div>
      )}

      {(tvState === 'turningOn' || tvState === 'on') && (
        <div className={`w-full h-full relative overflow-hidden origin-center ${tvState === 'turningOn' ? 'tv-turn-on' : ''}`}>
          
          {/* Render the wrapped content (like the Hero video) */}
          <div className="absolute inset-0 z-0">
            {children}
          </div>

          <div className="animate-noise absolute inset-0 z-[450] opacity-100 pointer-events-none" />
          
          <div className="animate-scanlines-wrapper absolute inset-0 z-[300] opacity-60 pointer-events-none">
            <div className="animate-scanlines absolute inset-0" />
          </div>

          {/* Time (Commented out for now) */}
          {/* <div className="absolute right-8 top-8 animate-rgb-text">
            <span>{time}</span>
          </div> */}

          <div className="absolute left-8 bottom-8 animate-rgb-text">
            REC <label>{minutes}</label>:<label>{seconds}</label>
          </div>

          {/* VHS Text & Recording Dot */}
          <div className="absolute right-8 bottom-8 flex items-center gap-4 animate-rgb-text-slow">
            <div className="w-5 h-5 rounded-full bg-red-600 animate-[pulse_2s_cubic-bezier(0.4,0,0.6,1)_infinite] drop-shadow-[0_0_8px_rgba(255,0,0,0.8)]"></div>
            <div className="flex">
              {text.split('').map((char, index) => (
                <span 
                  key={index} 
                  className="animate-[type_1.2s_infinite_alternate]"
                  style={{ animationDelay: `${index * 60}ms` }}
                >
                  {char}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VhsRecorder;
