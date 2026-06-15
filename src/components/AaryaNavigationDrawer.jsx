import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sun, Moon } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useTransitionNavigate } from '../context/TransitionContext';
import { useTheme } from '../context/ThemeContext';

const navLinks = [
  { id: 'about', title: 'ABOUT', href: '/about' },
  { id: 'photography', title: 'PHOTOGRAPHY', href: '/photography' },
  { id: 'works', title: 'WORKS', href: '/works' },
  { id: 'community', title: 'COMMUNITY', href: '/community' },
];

const menuVariants = {
  closed: {
    x: '100%',
    transition: {
      type: 'spring',
      stiffness: 280,
      damping: 25,
      when: 'afterChildren',
      staggerChildren: 0.02,
      staggerDirection: -1,
    },
  },
  open: {
    x: 0,
    transition: {
      type: 'spring',
      stiffness: 280,
      damping: 25,
      when: 'beforeChildren',
      staggerChildren: 0.05,
    },
  },
};

const linkVariants = {
  closed: { y: 20, opacity: 0 },
  open: { 
    y: 0, 
    opacity: 1,
    transition: { type: 'spring', stiffness: 240, damping: 18 }
  },
};

export function AaryaNavigationDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useTransitionNavigate();
  const { theme, toggleTheme } = useTheme();

  const handleNavigation = (href) => {
    setIsOpen(false);
    navigate(href);
  };

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
              transition={{ duration: 0.15 }}
              className="text-text-secondary hidden md:flex items-center gap-2"
              style={{ fontFamily: "'Dancing Script', 'Caveat', cursive", fontSize: '1.2rem', transform: 'translateZ(0)' }}
            >
              <span>click me</span>
              <span className="text-xl">→</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* The Main Toggle Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-center bg-bg-secondary/80 backdrop-blur-md border border-border-color/10 hover:bg-bg-secondary transition-colors text-text-primary w-12 h-12 rounded-full shadow-2xl overflow-hidden group cursor-pointer"
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
                  transition={{ type: 'spring', stiffness: 240, damping: 14 }}
                  className="absolute"
                  style={{ transform: 'translateZ(0)' }}
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
                className="absolute top-0 right-0 h-full w-[70%] bg-[#E6E0D5]/30 dark:bg-zinc-700/30 rounded-l-[2rem] z-10"
              />
              {/* Panel 2 — middle */}
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', stiffness: 280, damping: 32, delay: 0.02 }}
                className="absolute top-0 right-0 h-full w-[70%] bg-[#DED7CA]/60 dark:bg-zinc-800/60 rounded-l-[2rem] z-20"
              />
              {/* Panel 1 — front, main nav surface */}
              <motion.nav
                variants={menuVariants}
                initial="closed"
                animate="open"
                exit="closed"
                className="absolute top-0 right-0 h-full w-[70%] bg-bg-secondary dark:bg-zinc-900 rounded-l-[2rem] border-l border-border-color/10 dark:border-white/5 shadow-2xl z-30 flex flex-col justify-center px-8 md:px-16 overflow-y-auto"
              >
                <ul className="flex flex-col gap-4">
                  {/* Global Home Link */}
                  <motion.li variants={linkVariants} className="">
                    <button
                      onClick={() => handleNavigation('/')}
                      className="block group relative w-fit text-left cursor-pointer"
                    >
                      <motion.span 
                        className="text-5xl md:text-7xl lg:text-8xl font-black text-text-primary uppercase leading-[0.85] hover:text-accent-metallic transition-colors"
                        style={{ fontFamily: "'Anton', 'Oswald', sans-serif" }}
                        whileHover={{ x: 12 }}
                        transition={{ type: 'spring', stiffness: 320, damping: 18 }}
                      >
                        HOME
                      </motion.span>
                      <span className="absolute -bottom-2 left-0 w-0 h-1 bg-accent-metallic/30 group-hover:w-full transition-all duration-200 ease-out" style={{ willChange: 'width' }}></span>
                    </button>
                  </motion.li>

                  {navLinks.map((link) => (
                    <motion.li key={link.id} variants={linkVariants} className="">
                      <button
                        onClick={() => handleNavigation(link.href)}
                        className="block group relative w-fit text-left cursor-pointer"
                      >
                        <motion.span 
                          className="text-5xl md:text-7xl lg:text-8xl font-black text-text-primary uppercase leading-[0.85] hover:text-accent-metallic transition-colors"
                          style={{ fontFamily: "'Anton', 'Oswald', sans-serif" }}
                          whileHover={{ x: 12 }}
                          transition={{ type: 'spring', stiffness: 320, damping: 18 }}
                        >
                          {link.title}
                        </motion.span>
                        <span className="absolute -bottom-2 left-0 w-0 h-1 bg-accent-metallic/30 group-hover:w-full transition-all duration-200 ease-out" style={{ willChange: 'width' }}></span>
                      </button>
                    </motion.li>
                  ))}
                </ul>

                {/* Theme Toggle Option */}
                <motion.div variants={linkVariants} className="mt-10 flex items-center gap-3">
                  <span className="text-[10px] font-mono tracking-wider text-text-secondary">THEME:</span>
                  <button 
                    onClick={toggleTheme} 
                    className="flex items-center gap-2 bg-bg-primary hover:bg-bg-secondary/80 py-1.5 px-4 rounded-full text-xs font-mono tracking-wider border border-border-color/20 text-text-primary transition-colors cursor-pointer active:scale-95 shadow-sm"
                  >
                    {theme === 'dark' ? (
                      <>
                        <Sun size={12} className="text-yellow-500 fill-yellow-500" />
                        <span>LIGHT MODE</span>
                      </>
                    ) : (
                      <>
                        <Moon size={12} className="text-accent-metallic fill-accent-metallic" />
                        <span>DARK MODE</span>
                      </>
                    )}
                  </button>
                </motion.div>

                {/* Footer Info inside Menu */}
                <motion.div variants={linkVariants} className="mt-10 flex flex-col gap-2 text-text-secondary font-mono text-xs uppercase tracking-widest">
                  <p>CRAFTED WITH ❤ BY EMAD</p>
                  <p>SOCIALS: <a href="#" className="hover:text-text-primary transition-colors">INSTAGRAM</a> / <a href="#" className="hover:text-text-primary transition-colors">LINKEDIN</a></p>
                  <p className="mt-4 text-text-secondary/60">© 2026 EMAD. ALL RIGHTS RESERVED.</p>
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

