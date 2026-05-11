import { useState, useEffect } from 'react';
import { Moon, Sun, Globe } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function Navbar({ toggleTheme, isDarkMode }) {
  const [isOpen, setIsOpen] = useState(false);
  const { lang, toggleLanguage, t } = useLanguage();

  const navLinks = [
    { title: t('nav.home'), href: '#' },
    { title: t('nav.about'), href: '#about' },
    { title: t('nav.projects'), href: '#projects' },
    { title: t('nav.resume'), href: '/resume.pdf' },
    { title: t('nav.contact'), href: '#contact' },
  ];

  // Prevent background scrolling when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <>
      {/* Mobile Overlay */}
      <div 
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 md:hidden z-40 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      />

      {/* Mobile Menu Panel */}
      <div 
        className={`fixed top-0 right-0 h-[100dvh] w-[80vw] max-w-sm backdrop-blur-lg bg-white/50 dark:bg-black/50 border-l border-white/10 dark:border-black/20 z-40 transform transition-transform duration-300 ease-out md:hidden flex flex-col pt-24 px-8 shadow-2xl ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex flex-col space-y-6">
          {navLinks.map((link, i) => (
            <a 
               key={i} 
               href={link.href} 
               onClick={() => setIsOpen(false)}
               className="text-2xl font-funnel font-bold tracking-widest text-primary-text dark:text-primary-text-dark hover:text-accent dark:hover:text-accent transition-colors border-b border-primary-text/10 dark:border-primary-text-dark/10 pb-4"
            >
              {link.title}
            </a>
          ))}
        </div>
      </div>

      {/* Top Navbar */}
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center justify-between px-6 py-3 rounded-full w-[90%] max-w-5xl bg-white/5 dark:bg-black/10 backdrop-blur-3xl backdrop-saturate-150 border border-white/20 dark:border-white/10 shadow-2xl transition-all duration-300">
          
          {/* Logo */}
          <img src={isDarkMode ? '/images/logo_light.png' : '/images/logo_dark.png'} alt='UMX Logo' className='h-8 md:h-10 w-auto object-contain' />

          {/* Desktop Nav Links (Hidden on mobile) */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link, i) => (
              <a 
                 key={i} 
                 href={link.href} 
                 className="font-funnel font-bold tracking-widest text-sm text-black dark:text-white hover:text-accent dark:hover:text-accent transition-colors"
              >
                {link.title}
              </a>
            ))}
          </div>

          {/* Controls */}
          <div className="flex items-center space-x-1 sm:space-x-2 text-black dark:text-white">
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

            {/* iOS-Style Burger Icon (Hidden on md) */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle Menu"
              className="md:hidden relative w-10 h-10 flex flex-col justify-center items-center rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors p-2 z-50"
            >
              <div className={`w-5 h-[2px] bg-black dark:bg-white transition-all duration-300 ease-out absolute ${isOpen ? 'rotate-45' : '-translate-y-1.5'}`} />
              <div className={`w-5 h-[2px] bg-black dark:bg-white transition-all duration-300 ease-out absolute ${isOpen ? 'opacity-0 scale-75' : 'opacity-100'}`} />
              <div className={`w-5 h-[2px] bg-black dark:bg-white transition-all duration-300 ease-out absolute ${isOpen ? '-rotate-45' : 'translate-y-1.5'}`} />
            </button>
          </div>
      </nav>
    </>
  );
}
