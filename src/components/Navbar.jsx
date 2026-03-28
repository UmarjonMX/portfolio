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
    <div className="sticky top-0 z-50 w-full bg-white/10 dark:bg-black/10 backdrop-blur-sm transition-all duration-500 ease-in-out">
      <motion.nav
        layout
        transition={springConfig}
        className={`w-full max-w-[1200px] mx-auto flex flex-col overflow-hidden transition-shadow duration-300 ${isOpen ? 'pb-2' : ''}`}
      >
        {/* Always-visible bar */}
        <motion.div layout className="flex items-center justify-between px-6 md:px-8 h-14 w-full">
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
      </motion.nav>
    </div>
  );
}
