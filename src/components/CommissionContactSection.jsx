import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Check, ArrowUpRight, Send, Clock, Sparkles } from 'lucide-react';

const INQUIRY_TYPES = [
  'Tour Photography & Recaps',
  'Commercial Directing',
  'Music Videos & Films',
  'Automotive Cinematography',
  'Creative Direction',
  'Editorial Portraiture'
];

export default function CommissionContactSection({ className = '' }) {
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
    <section id="section-contact" className={`w-full bg-black border-t border-white/10 py-16 sm:py-24 px-4 sm:px-8 md:px-12 lg:px-16 text-white font-sans ${className}`}>
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
        
        {/* Left Column: Direct Details & Live Availability HUD */}
        <div className="lg:col-span-5 space-y-8">
          <div>
            <span className="font-mono text-[10px] sm:text-xs tracking-[0.25em] text-[#b81d24] uppercase font-bold block mb-3">
              05 — COMMISSIONS &amp; CONTACT
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light uppercase tracking-tight text-white mb-4" style={{ fontFamily: "'Syne', sans-serif" }}>
              LET'S MAKE SOMETHING WORTH WATCHING.
            </h2>
            <p className="text-zinc-400 font-sans text-xs sm:text-sm leading-relaxed max-w-md">
              Available for international concert tours, commercial directing, brand campaigns, and creative direction worldwide.
            </p>
          </div>

          {/* Direct Email Click-to-Copy */}
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
                className="p-1.5 rounded-none bg-white/5 border border-white/10 group-hover:bg-white/20 transition-all text-zinc-400 group-hover:text-white cursor-pointer"
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

          {/* Live Location Status */}
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

          {/* Social Links */}
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
        </div>

        {/* Right Column: Editorial Contact Form */}
        <div className="lg:col-span-7 bg-zinc-950 border border-white/10 p-6 sm:p-8 md:p-10 rounded-none shadow-2xl">
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

      </div>
    </section>
  );
}
