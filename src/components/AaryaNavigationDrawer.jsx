import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';

const navLinks = [
  { id: 'about', title: 'ABOUT US', href: '#' },
  { id: 'work', title: 'OUR WORK', href: '#work' },
  { id: 'services', title: 'SERVICES', href: '#' },
  { id: 'blog', title: 'BLOG', href: '#' },
  { id: 'contact', title: 'CONTACT US', href: '#' },
];

const menuVariants = {
  closed: {
    x: '100%',
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 40,
      when: 'afterChildren',
      staggerChildren: 0.05,
      staggerDirection: -1,
    },
  },
  open: {
    x: 0,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 40,
      when: 'beforeChildren',
      staggerChildren: 0.1,
    },
  },
};

const linkVariants = {
  closed: { y: 20, opacity: 0 },
  open: { 
    y: 0, 
    opacity: 1,
    transition: { type: 'spring', stiffness: 300, damping: 24 }
  },
};

export function AaryaNavigationDrawer() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Fixed Toggle Button Container */}
      <div className="fixed top-6 right-6 z-[100] flex items-center gap-4 pointer-events-auto">
        
        {/* Playful 'click me' hint */}
        <AnimatePresence>
          {!isOpen && (
            <motion.div
              key="hint"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 0.7, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.3 }}
              className="text-zinc-400 hidden md:flex items-center gap-2"
              style={{ fontFamily: "'Dancing Script', 'Caveat', cursive", fontSize: '1.2rem' }}
            >
              <span>click me</span>
              <span className="text-xl">→</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* The Main Toggle Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-3 bg-zinc-900/80 backdrop-blur-md border border-white/10 hover:bg-zinc-800 transition-colors text-zinc-100 px-5 py-3 rounded-full shadow-2xl overflow-hidden group"
          aria-label="Toggle Navigation"
        >
          {/* Menu / Close Text */}
          <div className="relative w-12 h-5 font-bold uppercase tracking-widest text-sm overflow-hidden flex items-center justify-center">
            <AnimatePresence mode="popLayout">
              {isOpen ? (
                <motion.span
                  key="close"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  className="absolute"
                >
                  CLOSE
                </motion.span>
              ) : (
                <motion.span
                  key="menu"
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 20, opacity: 0 }}
                  className="absolute"
                >
                  MENU
                </motion.span>
              )}
            </AnimatePresence>
          </div>

          {/* Plus / Cross Icon */}
          <motion.div
            animate={{ rotate: isOpen ? 45 : 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="flex items-center justify-center w-5 h-5 text-white"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          </motion.div>
        </button>
      </div>

      {/* Portal: render overlay+drawer directly into body to avoid insertBefore errors */}
      {typeof document !== 'undefined' && ReactDOM.createPortal(
        <AnimatePresence>
          {isOpen && (
            <motion.div
              key="nav-portal"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[80]"
            >
              {/* Backdrop */}
              <div
                className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                onClick={() => setIsOpen(false)}
              />

              {/* ── Staggered sliding panels (decorative layers) ── */}
              {/* Panel 3 — furthest back, lightest */}
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', stiffness: 320, damping: 38, delay: 0.06 }}
                className="absolute top-0 right-0 h-full w-[70%] bg-zinc-700/30 rounded-l-[2rem] z-10"
              />
              {/* Panel 2 — middle */}
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', stiffness: 340, damping: 38, delay: 0.03 }}
                className="absolute top-0 right-0 h-full w-[70%] bg-zinc-800/60 rounded-l-[2rem] z-20"
              />
              {/* Panel 1 — front, main nav surface */}
              <motion.nav
                variants={menuVariants}
                initial="closed"
                animate="open"
                exit="closed"
                className="absolute top-0 right-0 h-full w-[70%] bg-zinc-900 rounded-l-[2rem] border-l border-white/5 shadow-2xl z-30 flex flex-col justify-center px-8 md:px-16 overflow-y-auto"
              >
                <ul className="flex flex-col gap-4">
                  {navLinks.map((link) => (
                    <motion.li key={link.id} variants={linkVariants} className="overflow-hidden">
                      <a
                        href={link.href}
                        onClick={() => setIsOpen(false)}
                        className="block group relative w-fit"
                      >
                        <motion.span 
                          className="block text-5xl md:text-7xl lg:text-8xl font-black text-zinc-100 uppercase tracking-tighter leading-[0.85] hover:text-white transition-colors"
                          style={{ fontFamily: "'Anton', 'Oswald', sans-serif" }}
                          whileHover={{ x: 20 }}
                          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                        >
                          {link.title}
                        </motion.span>
                        <span className="absolute -bottom-2 left-0 w-0 h-1 bg-white/30 group-hover:w-full transition-all duration-300 ease-out"></span>
                      </a>
                    </motion.li>
                  ))}
                </ul>

                {/* Footer Info inside Menu */}
                <motion.div variants={linkVariants} className="mt-20 flex flex-col gap-2 text-zinc-500 font-mono text-xs uppercase tracking-widest">
                  <p>CRAFTED WITH ❤ BY EMAD</p>
                  <p>SOCIALS: <a href="#" className="hover:text-zinc-300 transition-colors">INSTAGRAM</a> / <a href="#" className="hover:text-zinc-300 transition-colors">LINKEDIN</a></p>
                  <p className="mt-4 text-zinc-600">© 2026 EMAD. ALL RIGHTS RESERVED.</p>
                </motion.div>
              </motion.nav>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}

