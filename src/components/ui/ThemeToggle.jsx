import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function ThemeToggle({ className = '', variant = 'default' }) {
  const { theme, toggleTheme } = useTheme();
  const isLight = theme === 'light';

  return (
    <button
      onClick={(e) => toggleTheme(e)}
      type="button"
      aria-label={`Switch to ${isLight ? 'Dark' : 'Light'} Mode`}
      title={`Switch to ${isLight ? 'Dark' : 'Light'} Mode`}
      className={`relative inline-flex items-center justify-center p-2.5 rounded-full transition-all duration-300 cursor-pointer overflow-hidden group ${
        isLight
          ? 'bg-zinc-100 text-zinc-900 border border-black/10 hover:bg-zinc-200 hover:border-black/20 shadow-md'
          : 'bg-zinc-900/80 text-zinc-100 border border-white/10 hover:bg-zinc-800 hover:border-white/25 shadow-2xl backdrop-blur-md'
      } ${className}`}
    >
      <div className="relative w-5 h-5 flex items-center justify-center">
        <AnimatePresence mode="wait" initial={false}>
          {isLight ? (
            <motion.div
              key="sun"
              initial={{ scale: 0.3, opacity: 0, rotate: -70 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              exit={{ scale: 0.3, opacity: 0, rotate: 70 }}
              transition={{ type: 'spring', stiffness: 180, damping: 16 }}
              className="absolute text-amber-500"
            >
              <Sun className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
            </motion.div>
          ) : (
            <motion.div
              key="moon"
              initial={{ scale: 0.3, opacity: 0, rotate: 70 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              exit={{ scale: 0.3, opacity: 0, rotate: -70 }}
              transition={{ type: 'spring', stiffness: 180, damping: 16 }}
              className="absolute text-zinc-300 group-hover:text-white"
            >
              <Moon className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </button>
  );
}
