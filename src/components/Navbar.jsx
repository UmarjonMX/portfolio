import { useState } from 'react';
import { Moon, Sun, Menu, X, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';

export default function Navbar({ toggleTheme, isDarkMode }) {
  const [isOpen, setIsOpen] = useState(false);
  const { lang, toggleLanguage, t } = useLanguage();

  const navLinks = [
    { title: t('nav.home'), href: '#' },
    { title: t('nav.about'), href: '#about' },
    { title: t('nav.projects'), href: '#projects' },
    { title: t('nav.resume'), href: '#resume' },
    { title: t('nav.contact'), href: '#contact' },
  ];

  const springConfig = { type: 'spring', stiffness: 300, damping: 30 };

  return (
    <nav className="fixed top-4 left-0 right-0 z-50 flex justify-center pointer-events-none">
      <motion.div
        layout
        transition={springConfig}
        className={`pointer-events-auto w-full max-w-7xl mx-4 flex flex-col overflow-hidden backdrop-blur-lg bg-white/20 dark:bg-black/30 border border-white/10 dark:border-black/20 shadow-lg transition-all duration-300 ${isOpen ? 'rounded-[2rem] px-6 py-3 pb-5' : 'rounded-full px-6 py-3'}`}
      >
        {/* Always-visible bar */}
        <motion.div layout className="flex items-center justify-between w-full h-10">
          {/* Logo */}
          <span className="font-bold text-lg sm:text-xl tracking-tight font-martian text-primary-text dark:text-primary-text-dark whitespace-nowrap">
            UmarjonMX
          </span>

          {/* Controls */}
          <div className="flex items-center space-x-1 text-primary-text dark:text-primary-text-dark">
            <button
              onClick={toggleLanguage}
              aria-label="Change Language"
              className="flex items-center space-x-1 px-2 sm:px-3 py-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors font-bold text-xs sm:text-sm tracking-wider uppercase"
            >
              <Globe size={15} />
              <span className="hidden sm:inline-block">{lang}</span>
            </button>

            <button
              onClick={toggleTheme}
              aria-label="Toggle Theme"
              className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
            >
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <button
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle Menu"
              className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
            >
              <motion.div layout transition={springConfig}>
                {isOpen ? <X size={20} /> : <Menu size={20} />}
              </motion.div>
            </button>
          </div>
        </motion.div>

        {/* Expanding menu */}
        <AnimatePresence mode="popLayout">
          {isOpen && (
            <motion.div
              layout
              key="menu"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={springConfig}
              className="flex flex-col items-center w-full px-4 pb-5"
            >
              <div className="w-full h-px bg-[#08CB00]/20 mb-4" />
              {navLinks.map((link, i) => (
                <motion.a
                  key={i}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0, transition: { delay: i * 0.05 } }}
                  whileHover={{ scale: 1.04, color: '#08CB00' }}
                  className="w-full text-center py-3 rounded-2xl font-funnel font-bold tracking-widest text-primary-text dark:text-primary-text-dark hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                >
                  {link.title}
                </motion.a>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </nav>
  );
}
