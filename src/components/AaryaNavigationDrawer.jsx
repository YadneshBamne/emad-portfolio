import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

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
      stiffness: 300, // Lower = smoother
      damping: 30,
      when: 'afterChildren',
      staggerChildren: 0.02,
      staggerDirection: -1,
    },
  },
  open: {
    x: 0,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 30,
      when: 'beforeChildren',
      staggerChildren: 0.06,
    },
  },
};

const linkVariants = {
  closed: { y: 20, opacity: 0 },
  open: { 
    y: 0, 
    opacity: 1,
    transition: { type: 'spring', stiffness: 260, damping: 20 }
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
              transition={{ duration: 0.2 }}
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
          className="flex items-center justify-center bg-zinc-900/80 backdrop-blur-md border border-white/10 hover:bg-zinc-800 transition-colors text-zinc-100 w-12 h-12 rounded-full shadow-2xl overflow-hidden group"
          aria-label="Toggle Navigation"
        >
          {/* Menu / Close Icon */}
          <div className="relative flex items-center justify-center">
            <AnimatePresence mode="popLayout">
              {isOpen ? (
                <motion.div
                  key="close"
                  initial={{ scale: 0.5, opacity: 0, rotate: -90 }}
                  animate={{ scale: 1, opacity: 1, rotate: 0 }}
                  exit={{ scale: 0.5, opacity: 0, rotate: 90 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 16 }}
                  className="absolute"
                >
                  <X className="w-6 h-6" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ scale: 0.5, opacity: 0, rotate: 90 }}
                  animate={{ scale: 1, opacity: 1, rotate: 0 }}
                  exit={{ scale: 0.5, opacity: 0, rotate: -90 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 16 }}
                  className="absolute"
                >
                  <Menu className="w-6 h-6" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
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
                transition={{ type: 'spring', stiffness: 260, damping: 30, delay: 0.04 }}
                className="absolute top-0 right-0 h-full w-[70%] bg-zinc-700/30 rounded-l-[2rem] z-10"
              />
              {/* Panel 2 — middle */}
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', stiffness: 280, damping: 32, delay: 0.02 }}
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
                    <motion.li key={link.id} variants={linkVariants} className="">
                      <a
                        href={link.href}
                        onClick={() => setIsOpen(false)}
                        className="block group relative w-fit"
                      >
                        <motion.span 
                          className=" text-5xl md:text-7xl lg:text-8xl font-black text-zinc-100 uppercase leading-[0.85] hover:text-white transition-colors"
                          style={{ fontFamily: "'Anton', 'Oswald', sans-serif" }}
                          whileHover={{ x: 12 }}
                          transition={{ type: 'spring', stiffness: 320, damping: 18 }}
                        >
                          {link.title}
                        </motion.span>
                        <span className="absolute -bottom-2 left-0 w-0 h-1 bg-white/30 group-hover:w-full transition-all duration-200 ease-out" style={{ willChange: 'width' }}></span>
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

