import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, CheckCircle2, ArrowLeft } from 'lucide-react';
import { useTransitionNavigate } from '../context/TransitionContext';

export default function CommunityPage() {
  const [email, setEmail] = useState('');
  const [portfolio, setPortfolio] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const navigate = useTransitionNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email && portfolio) {
      setSubmitted(true);
      // Backend integration goes here later
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#0a0a0a] text-white relative select-none overflow-x-hidden overflow-hidden">
      
      {/* GLOBAL HUD NAVIGATION OVERLAY */}
      <header className="fixed top-0 left-0 w-full h-18 px-6 sm:px-10 flex items-center justify-between z-50 pointer-events-none mix-blend-difference text-white bg-transparent">
        
        {/* Return link */}
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-2 font-mono text-[10px] font-bold tracking-[0.2em] cursor-pointer pointer-events-auto hover:opacity-85 transition-opacity"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>EMAD SHAIKH.</span>
        </button>

        {/* Middle indicator */}
        <div className="font-mono text-[9px] tracking-[0.3em] uppercase hidden sm:block">
          COMMUNITY // ECOSYSTEM
        </div>

        {/* Global links */}
        <div className="flex items-center gap-8 font-mono text-[10px] font-bold tracking-widest pointer-events-auto">
          <button onClick={() => navigate('/')} className="hover:opacity-75 cursor-pointer transition-opacity">HOME</button>
          <button onClick={() => navigate('/photography')} className="hover:opacity-75 cursor-pointer transition-opacity">PHOTOGRAPHY</button>
          <button onClick={() => navigate('/works')} className="hover:opacity-75 cursor-pointer transition-opacity">WORKS</button>
          <button onClick={() => navigate('/about')} className="hover:opacity-75 cursor-pointer transition-opacity">ABOUT</button>
        </div>

      </header>

      <div className="pt-32 pb-24 px-4 md:px-12 relative">
        {/* Background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] bg-red-900/10 rounded-full blur-[120px] pointer-events-none z-0"></div>
        
          <header className="mb-16 text-center">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-7xl font-bold uppercase tracking-tighter mb-6" 
              style={{ fontFamily: "'Anton', sans-serif" }}
            >
              The Ecosystem
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-zinc-400 font-mono text-sm md:text-base tracking-widest uppercase max-w-2xl mx-auto leading-relaxed"
            >
              Join a globally recognized creative community. Gain access to insider blogs, exclusive future merch drops, and our private curated WhatsApp group for trusted creators.
            </motion.p>
          </header>

        <div className="grid md:grid-cols-2 gap-12 mt-20">
          
          {/* Perks Section */}
          <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
            <div className="bg-[#111] border border-zinc-800 p-8 rounded-lg hover:border-red-900/50 transition-colors">
              <h3 className="text-xl font-bold font-mono tracking-widest text-red-500 mb-2">INSIDER BLOGS</h3>
              <p className="text-zinc-400 text-sm">Behind the scenes of major festivals, industry insights, and creative breakdowns.</p>
            </div>
            <div className="bg-[#111] border border-zinc-800 p-8 rounded-lg hover:border-red-900/50 transition-colors">
              <h3 className="text-xl font-bold font-mono tracking-widest text-red-500 mb-2">EXCLUSIVE MERCH</h3>
              <p className="text-zinc-400 text-sm">Early access to limited edition drops designed for the community.</p>
            </div>
            <div className="bg-[#111] border border-zinc-800 p-8 rounded-lg hover:border-red-900/50 transition-colors">
              <h3 className="text-xl font-bold font-mono tracking-widest text-red-500 mb-2">PRIVATE NETWORK</h3>
              <p className="text-zinc-400 text-sm">Access to our trusted WhatsApp group based on portfolio review. Collaborate globally.</p>
            </div>
          </motion.div>

          {/* Registration Form */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="bg-[#111] border border-zinc-800 p-8 rounded-lg h-full relative overflow-hidden">
              <AnimatePresence mode="wait">
                {!submitted ? (
                  <motion.form 
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, x: -20 }}
                    onSubmit={handleSubmit}
                    className="flex flex-col gap-6"
                  >
                    <div>
                      <h2 className="text-2xl font-bold mb-2 tracking-wide font-mono">APPLY TO JOIN</h2>
                      <p className="text-zinc-500 text-xs tracking-widest uppercase mb-8">Strictly curated. Portfolio required.</p>
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-xs tracking-widest text-zinc-400">EMAIL ADDRESS</label>
                      <input 
                        type="email" 
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="bg-black border border-zinc-800 p-4 text-white focus:outline-none focus:border-red-600 transition-colors font-mono text-sm"
                        placeholder="you@domain.com"
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-xs tracking-widest text-zinc-400">PORTFOLIO LINK</label>
                      <input 
                        type="url" 
                        required
                        value={portfolio}
                        onChange={(e) => setPortfolio(e.target.value)}
                        className="bg-black border border-zinc-800 p-4 text-white focus:outline-none focus:border-red-600 transition-colors font-mono text-sm"
                        placeholder="https://your-work.com"
                      />
                    </div>

                    <button 
                      type="submit"
                      className="mt-4 bg-white text-black font-bold tracking-widest py-4 px-6 hover:bg-zinc-200 transition-colors flex items-center justify-between group"
                    >
                      SUBMIT APPLICATION
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                    </button>
                  </motion.form>
                ) : (
                  <motion.div 
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center h-full text-center gap-4 py-12"
                  >
                    <CheckCircle2 className="w-16 h-16 text-red-600" />
                    <h2 className="text-2xl font-bold tracking-widest font-mono mt-4">APPLICATION RECEIVED</h2>
                    <p className="text-zinc-400 text-sm">We will review your portfolio and be in touch soon.</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
