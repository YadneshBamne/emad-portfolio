import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Check, ArrowUpRight, Send, Clock, Globe, Sparkles } from 'lucide-react';
import { AaryaNavigationDrawer } from '../components/AaryaNavigationDrawer';
import DynamicIslandNavbar from '../components/DynamicIslandNavbar';

// =========================================================================
// SMOOTH HORIZONTAL TEXT REVEAL COMPONENT
// =========================================================================
const HorizontalReveal = ({ 
  children, 
  className = '', 
  delay = 0, 
  duration = 0.9, 
  direction = 'left',
  style = {} 
}) => {
  const initialClip = direction === 'left' 
    ? 'polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)' 
    : 'polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%)';
  const targetClip = 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)';

  return (
    <motion.div
      initial={{ 
        clipPath: initialClip, 
        opacity: 0, 
        x: direction === 'left' ? -25 : 25,
        filter: 'blur(3px)'
      }}
      animate={{ 
        clipPath: targetClip, 
        opacity: 1, 
        x: 0,
        filter: 'blur(0px)'
      }}
      transition={{ 
        duration, 
        delay, 
        ease: [0.16, 1, 0.3, 1] 
      }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
};

const INQUIRY_TYPES = [
  'Tour Photography & Recaps',
  'Commercial Directing',
  'Music Videos & Films',
  'Automotive Cinematography',
  'Creative Direction',
  'Editorial Portraiture'
];

export default function AboutPage() {
  // Live Clock for Mumbai (IST)
  const [timeString, setTimeString] = useState('');
  const [copiedEmail, setCopiedEmail] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    service: 'Tour Photography & Recaps',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options = {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      };
      setTimeString(new Intl.DateTimeFormat('en-US', options).format(now));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleCopyEmail = (email) => {
    navigator.clipboard.writeText(email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1000);
  };

  return (
    <div className="w-full min-h-screen bg-[#000000] text-white relative select-none overflow-x-hidden font-sans">
      
      {/* Global Slide-Out Navigation (Mobile Only) */}
      <div className="block md:hidden">
        <AaryaNavigationDrawer />
      </div>

      {/* Dynamic Island / Desktop Navigation Bar */}
      <DynamicIslandNavbar activePath="/about" />

      {/* Main Content Area */}
      <main className="w-full pt-28 sm:pt-36 md:pt-40 pb-28 px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 mx-auto overflow-hidden">
        
        {/* ========================================================================= */}
        {/* 1. HERO SECTION: SPREAD ACROSS SCREEN HORIZONTALLY (EXACT REFERENCE) */}
        {/* ========================================================================= */}
        <section className="relative w-full mb-24 md:mb-32">
          
          {/* TOP-RIGHT EDITORIAL IMAGE (Sharp 90° corners, B&W) */}
          <div className="absolute top-0 right-0 w-[20vw] max-w-[280px] min-w-[140px] aspect-[3/4] z-0 overflow-hidden rounded-none bg-zinc-950 border border-white/10 shadow-2xl">
            <motion.img 
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.0, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              src="https://ik.imagekit.io/4no4se4zt/Emad%20Shaikh/photos/work/DSC-48%20(1).jpg?updatedAt=1787199008444" 
              alt="Editorial Direction" 
              className="w-full h-full object-cover grayscale contrast-125 rounded-none"
            />
          </div>

          {/* MAIN HEADLINE CONTAINER */}
          <div className="relative z-10 w-full space-y-1 sm:space-y-2 md:space-y-3">
            
            {/* ROW 1: THE pursuit THAT */}
            <div className="flex items-baseline gap-3 sm:gap-6 md:gap-8 flex-wrap">
              <HorizontalReveal direction="left" delay={0.1} duration={1.0}>
                <span 
                  className="text-[clamp(2.2rem,5.6vw,7rem)] font-black uppercase text-white tracking-tight leading-[0.92]"
                  style={{ fontFamily: "'Syne', 'Anton', sans-serif" }}
                >
                  THE
                </span>
              </HorizontalReveal>

              <HorizontalReveal direction="left" delay={0.2} duration={1.0}>
                <span 
                  className="text-[clamp(2.2rem,5.6vw,7rem)] italic font-normal text-[#b81d24] lowercase tracking-normal leading-[0.92]"
                  style={{ fontFamily: "'Instrument Serif', 'Playfair Display', serif" }}
                >
                  pursuit
                </span>
              </HorizontalReveal>

              <HorizontalReveal direction="left" delay={0.3} duration={1.0}>
                <span 
                  className="text-[clamp(2.2rem,5.6vw,7rem)] font-black uppercase text-white tracking-tight leading-[0.92]"
                  style={{ fontFamily: "'Syne', 'Anton', sans-serif" }}
                >
                  THAT
                </span>
              </HorizontalReveal>
            </div>

            {/* ROW 2: SHAPED TIMELESS */}
            <div className="pl-[8vw] sm:pl-[12vw] md:pl-[16vw]">
              <HorizontalReveal direction="left" delay={0.35} duration={1.0}>
                <h1 
                  className="text-[clamp(2.2rem,5.6vw,7rem)] font-black uppercase text-white tracking-tight leading-[0.92] whitespace-nowrap"
                  style={{ fontFamily: "'Syne', 'Anton', sans-serif" }}
                >
                  SHAPED TIMELESS
                </h1>
              </HorizontalReveal>
            </div>

            {/* LOWER SECTION: LEFT PORTRAIT + (balance AND / PHILOSOPHY / SUBTEXT) */}
            <div className="flex flex-col md:flex-row gap-6 md:gap-10 lg:gap-14 items-start pt-4 sm:pt-6">
              
              {/* LEFT SHARP PORTRAIT IMAGE (Starts under THE and spans down) */}
              <div className="w-[45vw] sm:w-[32vw] md:w-[24vw] max-w-[340px] min-w-[160px] aspect-[3/4] shrink-0 overflow-hidden rounded-none bg-zinc-950 border border-white/10 shadow-2xl">
                <motion.img 
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1.0, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
                  src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=800&auto=format&fit=crop" 
                  alt="Emad Shaikh Portrait" 
                  className="w-full h-full object-cover grayscale contrast-125 rounded-none"
                />
              </div>

              {/* RIGHT TEXT CONTENT (balance AND + PHILOSOPHY + SUBTEXT) */}
              <div className="flex-1 flex flex-col justify-between self-stretch pt-2">
                
                <div>
                  {/* ROW 3: balance AND */}
                  <div className="flex items-baseline gap-3 sm:gap-6 md:gap-8 flex-wrap">
                    <HorizontalReveal direction="left" delay={0.45} duration={1.0}>
                      <span 
                        className="text-[clamp(2.2rem,5.6vw,7rem)] italic font-normal text-[#b81d24] lowercase tracking-normal leading-[0.92]"
                        style={{ fontFamily: "'Instrument Serif', 'Playfair Display', serif" }}
                      >
                        balance
                      </span>
                    </HorizontalReveal>

                    <HorizontalReveal direction="left" delay={0.55} duration={1.0}>
                      <span 
                        className="text-[clamp(2.2rem,5.6vw,7rem)] font-black uppercase text-white tracking-tight leading-[0.92]"
                        style={{ fontFamily: "'Syne', 'Anton', sans-serif" }}
                      >
                        AND
                      </span>
                    </HorizontalReveal>
                  </div>

                  {/* ROW 4: PHILOSOPHY */}
                  <div className="pl-[6vw] sm:pl-[10vw] md:pl-[14vw] mt-1 sm:mt-2">
                    <HorizontalReveal direction="right" delay={0.65} duration={1.0}>
                      <h1 
                        className="text-[clamp(2.2rem,5.6vw,7rem)] font-black uppercase text-white tracking-tight leading-[0.92] whitespace-nowrap"
                        style={{ fontFamily: "'Syne', 'Anton', sans-serif" }}
                      >
                        PHILOSOPHY
                      </h1>
                    </HorizontalReveal>
                  </div>
                </div>

                {/* EXACT EDITORIAL SUBTEXT (Matching Reference Image) */}
                <div className="mt-8 sm:mt-12 md:mt-16 max-w-xl">
                  <HorizontalReveal direction="left" delay={0.75} duration={1.0}>
                    <p className="text-[10px] sm:text-xs md:text-sm font-sans tracking-wider text-zinc-400 uppercase leading-relaxed">
                      EMAD SHAIKH IS A CONCERT PHOTOGRAPHER, TOUR VIDEOGRAPHER, AND MUSIC MARKETING CREATIVE DEDICATED TO CRAFTING CINEMATIC VISUAL EXPERIENCES THAT EMBODY RAW EMOTION, TIMELESS AESTHETICS, AND BOLD NARRATIVE VISIONS.
                    </p>
                  </HorizontalReveal>
                </div>

              </div>

            </div>

          </div>

        </section>

        {/* ========================================================================= */}
        {/* 2. BIOGRAPHY & ARTISTIC MANIFESTO SECTION */}
        {/* ========================================================================= */}
        <section className="w-full border-t border-white/10 pt-14 sm:pt-20 pb-16 grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-16 items-start">
          
          {/* Left Column: Big Editorial Philosophy Quote */}
          <div className="md:col-span-6 space-y-6">
            <HorizontalReveal direction="left" delay={0.1} duration={0.9}>
              <span className="font-mono text-[10px] sm:text-xs tracking-[0.25em] text-[#b81d24] uppercase font-bold block">
                01 — THE VISION &amp; CRAFT
              </span>
            </HorizontalReveal>

            <HorizontalReveal direction="left" delay={0.2} duration={1.1}>
              <h2 className="text-xl sm:text-3xl lg:text-4xl font-serif italic text-zinc-100 font-normal leading-snug">
                "Light, velocity, and raw human emotion. Translating unseen atmospheres into timeless cinematic frames."
              </h2>
            </HorizontalReveal>

            <HorizontalReveal direction="left" delay={0.3} duration={1.1}>
              <p className="text-zinc-400 font-sans text-xs sm:text-sm md:text-base leading-relaxed">
                Specializing in large-scale arena concert tours, commercial automotive films, and high-impact music recaps. With a focus on kinetic camera movement, authentic low-light grain, and high-contrast color grading, every project is engineered with intentional weight and cinematic depth.
              </p>
            </HorizontalReveal>
          </div>

          {/* Right Column: Narrative Details & Stats */}
          <div className="md:col-span-6 space-y-8 md:border-l md:border-white/10 md:pl-8 lg:pl-12">
            <HorizontalReveal direction="left" delay={0.25} duration={0.9}>
              <span className="font-mono text-[10px] sm:text-xs tracking-[0.25em] text-zinc-400 uppercase font-bold block">
                02 — BACKGROUND &amp; REACH
              </span>
            </HorizontalReveal>

            <HorizontalReveal direction="left" delay={0.35} duration={1.1}>
              <p className="text-zinc-300 font-sans text-xs sm:text-sm md:text-base leading-relaxed">
                Published in <strong className="text-white">Billboard</strong> and <strong className="text-white">Variety Magazine</strong>. Emad has served as Lead Cinematographer and Visual Director on stadium-filling tours across North America, Europe, the Middle East, and Asia. Collaborating directly with premier artists like <strong className="text-white">Karan Aujla</strong> and major record labels including <strong className="text-white">Warner Music</strong>, <strong className="text-white">Atlantic Records</strong>, and <strong className="text-white">Sony Music</strong>.
              </p>
            </HorizontalReveal>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 gap-6 pt-4 border-t border-white/10">
              <HorizontalReveal direction="left" delay={0.45} duration={0.8}>
                <div>
                  <span className="text-2xl sm:text-3xl font-bold font-mono text-white block">50+</span>
                  <span className="text-[10px] font-mono tracking-[0.2em] text-zinc-500 uppercase">
                    ARENA &amp; STADIUM SHOWS
                  </span>
                </div>
              </HorizontalReveal>

              <HorizontalReveal direction="left" delay={0.5} duration={0.8}>
                <div>
                  <span className="text-2xl sm:text-3xl font-bold font-mono text-white block">100M+</span>
                  <span className="text-[10px] font-mono tracking-[0.2em] text-zinc-500 uppercase">
                    GLOBAL DIGITAL VIEWS
                  </span>
                </div>
              </HorizontalReveal>
            </div>
          </div>

        </section>

        {/* ========================================================================= */}
        {/* 3. CORE DISCIPLINES & TECHNICAL CAPABILITIES */}
        {/* ========================================================================= */}
        <section className="w-full border-t border-white/10 pt-14 sm:pt-20 pb-16">
          <HorizontalReveal direction="left" delay={0.1} duration={0.8}>
            <div className="flex items-center justify-between mb-10">
              <span className="font-mono text-[10px] sm:text-xs tracking-[0.25em] text-[#b81d24] uppercase font-bold">
                03 — CORE DISCIPLINES
              </span>
              <span className="font-mono text-[10px] sm:text-xs tracking-[0.25em] text-zinc-500 uppercase">
                TECHNICAL CAPABILITIES
              </span>
            </div>
          </HorizontalReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                num: '01',
                title: 'TOUR CINEMA & RECAPS',
                desc: 'Stadium-scale live performance cinematography, fast-turnaround tour recaps, and authentic artist backstage narratives.'
              },
              {
                num: '02',
                title: 'COMMERCIAL DIRECTING',
                desc: 'Automotive films, high-concept brand campaigns, and cinematic product releases with precision color grading.'
              },
              {
                num: '03',
                title: 'STAGE & LIGHTING DESIGN',
                desc: 'Creative direction for arena concert visuals, synchronized stage lighting, and bespoke anamorphic display experiences.'
              },
              {
                num: '04',
                title: 'EDITORIAL PORTRAITURE',
                desc: 'High-contrast monochrome and film-emulated editorial portraits for album artwork, Billboard features, and magazine covers.'
              }
            ].map((item, idx) => (
              <HorizontalReveal key={item.num} direction="left" delay={0.15 + idx * 0.07} duration={0.9}>
                <div className="p-6 border border-white/10 rounded-none bg-zinc-950/60 hover:border-white/30 transition-all duration-300 space-y-3 group">
                  <span className="font-mono text-xs text-[#b81d24] font-bold block">{item.num} /</span>
                  <h3 className="font-mono text-xs sm:text-sm tracking-wider text-white font-bold group-hover:text-red-400 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-zinc-400 font-sans text-xs leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </HorizontalReveal>
            ))}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 4. SELECT CLIENTS & COLLABORATORS ROSTER */}
        {/* ========================================================================= */}
        <section className="w-full border-t border-white/10 pt-14 sm:pt-16 pb-16">
          <HorizontalReveal direction="left" delay={0.1} duration={0.8}>
            <span className="font-mono text-[10px] sm:text-xs tracking-[0.25em] text-[#b81d24] uppercase font-bold block mb-8">
              04 — SELECTED COLLABORATORS &amp; LABELS
            </span>
          </HorizontalReveal>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 text-center">
            {[
              'BILLBOARD',
              'VARIETY MAGAZINE',
              'WARNER MUSIC',
              'ATLANTIC RECORDS',
              'KARAN AUJLA',
              'SONY MUSIC'
            ].map((brand, idx) => (
              <HorizontalReveal key={brand} direction="left" delay={0.1 + idx * 0.05} duration={0.8}>
                <div className="py-5 px-3 border border-white/10 rounded-none bg-zinc-950/40 hover:bg-white/5 transition-colors">
                  <span className="font-mono text-xs tracking-[0.15em] text-zinc-300 font-bold block">
                    {brand}
                  </span>
                </div>
              </HorizontalReveal>
            ))}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 5. DIRECT COMMISSIONS & CONTACT SECTION */}
        {/* ========================================================================= */}
        <section className="w-full border-t border-white/10 pt-14 sm:pt-20 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          
          {/* Left Column: Direct Details & Live Availability HUD */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <HorizontalReveal direction="left" delay={0.1} duration={0.8}>
                <span className="font-mono text-[10px] sm:text-xs tracking-[0.25em] text-[#b81d24] uppercase font-bold block mb-3">
                  05 — COMMISSIONS &amp; CONTACT
                </span>
                <h2 className="text-2xl sm:text-4xl font-light uppercase tracking-tight text-white mb-4" style={{ fontFamily: "'Syne', sans-serif" }}>
                  LET'S CREATE SOMETHING REAL.
                </h2>
              </HorizontalReveal>
            </div>

            {/* Direct Email Click-to-Copy */}
            <HorizontalReveal direction="left" delay={0.2} duration={0.8}>
              <div className="space-y-2">
                <span className="font-mono text-[10px] tracking-[0.2em] text-zinc-500 uppercase block">
                  DIRECT EMAIL INQUIRIES
                </span>
                <div 
                  onClick={() => handleCopyEmail('hello@emadshaikh.com')}
                  className="group inline-flex items-center gap-3 text-lg sm:text-xl font-mono text-zinc-100 hover:text-white cursor-pointer transition-colors"
                >
                  <span className="border-b border-white/30 group-hover:border-white transition-colors pb-0.5">
                    hello@emadshaikh.com
                  </span>
                  <button 
                    type="button"
                    aria-label="Copy email"
                    className="p-1.5 rounded-none bg-white/5 border border-white/10 group-hover:bg-white/20 transition-all text-zinc-400 group-hover:text-white"
                  >
                    {copiedEmail ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
                {copiedEmail && (
                  <span className="block font-mono text-[10px] text-emerald-400 tracking-wider">
                    Copied to clipboard
                  </span>
                )}
              </div>
            </HorizontalReveal>

            {/* Live Location Status */}
            <HorizontalReveal direction="left" delay={0.3} duration={0.8}>
              <div className="space-y-3 pt-6 border-t border-white/10 font-mono text-xs text-zinc-400">
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-white font-bold">STATUS: AVAILABLE WORLDWIDE</span>
                </div>
                <div className="flex items-center gap-3 text-zinc-400">
                  <Clock className="w-3.5 h-3.5 text-zinc-500" />
                  <span>MUMBAI (IST): {timeString || 'LIVE'}</span>
                </div>
              </div>
            </HorizontalReveal>

            {/* Social Links */}
            <HorizontalReveal direction="left" delay={0.4} duration={0.8}>
              <div className="pt-6 border-t border-white/10">
                <span className="font-mono text-[10px] tracking-[0.2em] text-zinc-500 uppercase block mb-3">
                  DIRECT SOCIAL NETWORKS
                </span>
                <div className="flex flex-wrap gap-4 font-mono text-xs">
                  {[
                    { name: 'INSTAGRAM', url: 'https://instagram.com/emadshaikh03' },
                    { name: 'YOUTUBE', url: 'https://youtube.com' },
                    { name: 'TWITTER / X', url: 'https://x.com' },
                    { name: 'LINKEDIN', url: 'https://linkedin.com' }
                  ].map((s) => (
                    <a
                      key={s.name}
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-zinc-400 hover:text-white transition-colors border-b border-transparent hover:border-white pb-0.5"
                    >
                      <span>{s.name}</span>
                      <ArrowUpRight className="w-3 h-3 text-zinc-600" />
                    </a>
                  ))}
                </div>
              </div>
            </HorizontalReveal>
          </div>

          {/* Right Column: Editorial Contact Form */}
          <div className="lg:col-span-7 bg-zinc-950 border border-white/10 p-6 sm:p-8 md:p-10 rounded-none">
            <AnimatePresence mode="wait">
              {isSubmitted ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="py-12 text-center flex flex-col items-center justify-center space-y-4"
                >
                  <div className="w-12 h-12 rounded-none bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold uppercase tracking-tight font-mono">
                    TRANSMISSION RECEIVED
                  </h3>
                  <p className="text-zinc-400 text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
                    Thank you for reaching out. Your project inquiry has been received directly. I will review the timeline and get back to you within 24 hours.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setIsSubmitted(false);
                      setFormData({ name: '', email: '', service: 'Tour Photography & Recaps', message: '' });
                    }}
                    className="mt-4 px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/15 text-xs font-mono tracking-widest uppercase transition-all rounded-none cursor-pointer"
                  >
                    Send Another Inquiry
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name & Email Fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div className="space-y-2">
                      <label className="block font-mono text-[10px] sm:text-xs tracking-[0.2em] text-zinc-400 uppercase">
                        01 / YOUR NAME <span className="text-[#b81d24]">*</span>
                      </label>
                      <input 
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="John Doe or Artist Name"
                        className="w-full bg-[#0d0d0d] border border-white/10 focus:border-white/40 focus:bg-[#141414] px-4 py-2.5 text-xs sm:text-sm text-white placeholder:text-zinc-600 outline-none transition-all rounded-none"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block font-mono text-[10px] sm:text-xs tracking-[0.2em] text-zinc-400 uppercase">
                        02 / EMAIL ADDRESS <span className="text-[#b81d24]">*</span>
                      </label>
                      <input 
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="name@agency.com"
                        className="w-full bg-[#0d0d0d] border border-white/10 focus:border-white/40 focus:bg-[#141414] px-4 py-2.5 text-xs sm:text-sm text-white placeholder:text-zinc-600 outline-none transition-all rounded-none"
                      />
                    </div>
                  </div>

                  {/* Inquiry Category Selector */}
                  <div className="space-y-2">
                    <label className="block font-mono text-[10px] sm:text-xs tracking-[0.2em] text-zinc-400 uppercase">
                      03 / PROJECT CATEGORY
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {INQUIRY_TYPES.map((type) => {
                        const isSelected = formData.service === type;
                        return (
                          <button
                            type="button"
                            key={type}
                            onClick={() => setFormData({ ...formData, service: type })}
                            className={`px-3 py-1 text-[11px] font-mono tracking-wider uppercase border transition-all rounded-none cursor-pointer ${
                              isSelected 
                                ? 'bg-white text-black border-white font-bold' 
                                : 'bg-[#0d0d0d] text-zinc-400 border-white/10 hover:border-white/30 hover:text-white'
                            }`}
                          >
                            {type}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Message Field */}
                  <div className="space-y-2">
                    <label className="block font-mono text-[10px] sm:text-xs tracking-[0.2em] text-zinc-400 uppercase">
                      04 / PROJECT SCOPE &amp; TIMELINE <span className="text-[#b81d24]">*</span>
                    </label>
                    <textarea 
                      required
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Tell me about the tour dates, commercial deliverables, location, or creative requirements..."
                      className="w-full bg-[#0d0d0d] border border-white/10 focus:border-white/40 focus:bg-[#141414] p-3 text-xs sm:text-sm text-white placeholder:text-zinc-600 outline-none transition-all resize-y rounded-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2 flex items-center justify-between">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="group inline-flex items-center gap-3 px-6 py-3 bg-white text-black hover:bg-zinc-200 text-xs font-mono font-bold tracking-[0.2em] uppercase transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed rounded-none"
                    >
                      <span>{isSubmitting ? 'TRANSMITTING...' : 'TRANSMIT INQUIRY'}</span>
                      <Send className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                    </button>

                    <span className="font-mono text-[10px] text-zinc-500 tracking-wider hidden sm:inline">
                      AVG RESPONSE TIME: &lt; 24 HOURS
                    </span>
                  </div>

                </form>
              )}
            </AnimatePresence>
          </div>

        </section>

      </main>

    </div>
  );
}
