import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, CheckCircle2, ArrowLeft } from 'lucide-react';
import { useTransitionNavigate } from '../context/TransitionContext';
import { AaryaNavigationDrawer } from '../components/AaryaNavigationDrawer';
import AaryaNavbar from '../components/AaryaNavbar';

export default function CommunityPage() {
  const [email, setEmail] = useState('');
  const [portfolio, setPortfolio] = useState('');
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const navigate = useTransitionNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email && portfolio && country && city) {
      setSubmitted(true);
      // Backend integration goes here later
    }
  };

  return (
    <div className="w-full min-h-screen md:h-screen bg-bg-primary text-text-primary relative select-none overflow-y-auto md:overflow-hidden flex flex-col transition-colors duration-500">
      
      {/* Global Slide-Out Navigation (Framer Motion) - Mobile Only */}
      <div className="block md:hidden">
        <AaryaNavigationDrawer />
      </div>

      {/* Desktop Navigation */}
      <AaryaNavbar activePage="community" isHome={false} />

      <div className="pt-28 pb-8 px-6 md:px-12 relative z-10 w-full max-w-6xl mx-auto flex flex-col justify-center flex-grow">
        
        {/* Header */}
        <header className="mb-8 md:mb-12 text-left">
          <motion.h1 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-bold uppercase tracking-tighter mb-2" 
            style={{ fontFamily: "'Anton', sans-serif" }}
          >
            THE ECOSYSTEM
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-text-secondary font-mono text-[10px] sm:text-xs tracking-[0.2em] uppercase max-w-2xl leading-relaxed"
          >
            A private network linking international concert filmmakers, photographers, and music marketing creatives.
          </motion.p>
        </header>

        <div className="grid md:grid-cols-12 gap-10 md:gap-16 items-center">
          
          {/* Perks Column (5 cols) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="md:col-span-5 flex flex-col gap-6"
          >
            <div>
              <span className="text-[10px] font-mono tracking-[0.25em] text-accent-metallic uppercase font-bold">01 / ACCESS & BENEFITS</span>
            </div>

            <div className="flex flex-col gap-6">
              <div className="flex gap-4">
                <span className="text-accent-metallic font-mono text-xs font-bold">01.</span>
                <div>
                  <h3 className="text-text-primary font-mono text-xs tracking-widest uppercase mb-1">Insider Diaries</h3>
                  <p className="text-text-secondary text-[11px] sm:text-xs leading-relaxed font-serif">
                    Raw post-production breakdowns, festival media sheets, and tour diaries.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <span className="text-accent-metallic font-mono text-xs font-bold">02.</span>
                <div>
                  <h3 className="text-text-primary font-mono text-xs tracking-widest uppercase mb-1">Priority Claims</h3>
                  <p className="text-text-secondary text-[11px] sm:text-xs leading-relaxed font-serif">
                    First claims on limited merchandise, preset packs, and asset archives.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <span className="text-accent-metallic font-mono text-xs font-bold">03.</span>
                <div>
                  <h3 className="text-text-primary font-mono text-xs tracking-widest uppercase mb-1">WhatsApp Workspace</h3>
                  <p className="text-text-secondary text-[11px] sm:text-xs leading-relaxed font-serif">
                    Direct access to our private network of active creators on tour.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Form Column (7 cols) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="md:col-span-7"
          >
            <div className="relative">
              <AnimatePresence mode="wait">
                {!submitted ? (
                  <motion.form 
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, y: -10 }}
                    onSubmit={handleSubmit}
                    className="flex flex-col gap-5"
                  >
                    <div>
                      <span className="text-[10px] font-mono tracking-[0.25em] text-accent-metallic uppercase font-bold">02 / APPLICATION</span>
                      <h2 className="text-xl font-bold font-mono tracking-wider text-text-primary mt-1 uppercase">Request Admission</h2>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[9px] tracking-[0.15em] font-mono text-text-secondary uppercase">EMAIL ADDRESS</label>
                      <input 
                        type="email" 
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="bg-transparent border-b border-border-color focus:border-accent-metallic py-2 text-text-primary focus:outline-none transition-colors font-mono text-xs tracking-wider"
                        placeholder="you@domain.com"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[9px] tracking-[0.15em] font-mono text-text-secondary uppercase">PORTFOLIO URL</label>
                      <input 
                        type="url" 
                        required
                        value={portfolio}
                        onChange={(e) => setPortfolio(e.target.value)}
                        className="bg-transparent border-b border-border-color focus:border-accent-metallic py-2 text-text-primary focus:outline-none transition-colors font-mono text-xs tracking-wider"
                        placeholder="https://your-work.com"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[9px] tracking-[0.15em] font-mono text-text-secondary uppercase">COUNTRY</label>
                        <input 
                          type="text" 
                          required
                          value={country}
                          onChange={(e) => setCountry(e.target.value)}
                          className="bg-transparent border-b border-border-color focus:border-accent-metallic py-2 text-text-primary focus:outline-none transition-colors font-mono text-xs tracking-wider"
                          placeholder="e.g. USA"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[9px] tracking-[0.15em] font-mono text-text-secondary uppercase">CITY</label>
                        <input 
                          type="text" 
                          required
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          className="bg-transparent border-b border-border-color focus:border-accent-metallic py-2 text-text-primary focus:outline-none transition-colors font-mono text-xs tracking-wider"
                          placeholder="e.g. Los Angeles"
                        />
                      </div>
                    </div>

                    <button 
                      type="submit"
                      className="mt-4 bg-text-primary text-bg-primary font-bold tracking-[0.2em] font-mono py-3.5 px-6 hover:bg-text-secondary/90 transition-colors flex items-center justify-between group cursor-pointer text-xs"
                    >
                      SUBMIT APPLICATION
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                    </button>
                  </motion.form>
                ) : (
                  <motion.div 
                    key="success"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col gap-5 py-6 text-left"
                  >
                    <CheckCircle2 className="w-10 h-10 text-accent-metallic" />
                    
                    <div>
                      <h2 className="text-lg font-bold font-mono tracking-widest text-text-primary uppercase">Application Submitted</h2>
                      <p className="text-text-secondary font-mono text-xs mt-2 uppercase tracking-wider leading-relaxed">
                        Awaiting curatorial sign-off. Approved members will receive an invite token to their registered email.
                      </p>
                    </div>
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
