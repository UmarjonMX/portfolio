import { useState, useEffect } from 'react';
import { Moon, Sun, Globe } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function Navbar({ toggleTheme, isDarkMode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { lang, toggleLanguage, t } = useLanguage();

  const navLinks = [
    { title: t('nav.home'), href: '#' },
    { title: t('nav.about'), href: '#about' },
    { title: t('nav.projects'), href: '#projects' },
    { title: t('nav.resume'), href: '#resume' },
    { title: t('nav.contact'), href: '#contact' },
  ];

  // Monitor scroll height to make nav shrink or transition styles
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
      {/* Mobile Drawer Overlay */}
      <div 
        className={`fixed inset-0 bg-black/60 backdrop-blur-md transition-opacity duration-500 md:hidden z-40 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      />

      {/* Mobile Menu Panel */}
      <div 
        className={`fixed top-0 right-0 h-[100dvh] w-[80vw] max-w-sm bg-white/95 dark:bg-card-bg-dark/95 backdrop-blur-2xl border-l border-primary-text/10 dark:border-primary-text-dark/10 z-40 transform transition-transform duration-500 ease-out md:hidden flex flex-col pt-28 px-8 shadow-2xl ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex flex-col space-y-6">
          {navLinks.map((link, i) => (
            <a 
               key={i} 
               href={link.href} 
               onClick={() => setIsOpen(false)}
               className="text-xl font-host font-bold tracking-widest text-primary-text/80 dark:text-primary-text-dark/80 hover:text-accent dark:hover:text-accent transition-all duration-300 border-b border-primary-text/5 dark:border-primary-text-dark/5 pb-3"
            >
              {link.title}
            </a>
          ))}
        </div>
      </div>

      {/* Premium Floating Navigation Pill */}
      <nav 
        className={`fixed left-1/2 -translate-x-1/2 z-50 flex items-center justify-between px-6 rounded-2xl w-[92%] max-w-5xl transition-all duration-700 cubic-bezier(0.25, 1, 0.5, 1)
          ${scrolled 
            ? 'top-4 py-2 bg-[#FAF8F4]/60 dark:bg-card-bg-dark/80 backdrop-blur-2xl border border-white/50 dark:border-primary-text-dark/15 shadow-[0_8px_32px_-8px_rgba(224,122,95,0.08)] dark:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.4)]' 
            : 'top-6 py-4 bg-[#FAF8F4]/40 dark:bg-card-bg-dark/40 backdrop-blur-xl border border-white/30 dark:border-primary-text-dark/5 shadow-[0_4px_16px_-4px_rgba(224,122,95,0.04)] dark:shadow-sm'
          }
        `}
      >
          {/* Logo */}
          <div className="relative group">
            <img 
              src={isDarkMode ? '/images/logo_dark.png' : '/images/logo_light.png'} 
              alt="UMX Logo" 
              className={`h-10 md:h-11 w-auto object-contain transition-transform duration-700 ease-out group-hover:scale-105 ${scrolled ? '-rotate-3 scale-95' : 'rotate-0'}`} 
            />
            <div className="absolute -inset-2 rounded-lg bg-accent/10 opacity-0 group-hover:opacity-100 blur-md transition-opacity duration-500 pointer-events-none" />
          </div>

          {/* Desktop Nav Links (Hover-highlight Pill) */}
          <div className="hidden md:flex items-center space-x-1 bg-primary-text/[0.03] dark:bg-primary-text-dark/[0.03] p-1 rounded-xl border border-primary-text/5 dark:border-primary-text-dark/5">
            {navLinks.map((link, i) => (
              <a 
                 key={i} 
                 href={link.href} 
                 className="relative px-4 py-2 font-host font-bold tracking-widest text-xs text-primary-text/70 dark:text-primary-text-dark/70 hover:text-accent dark:hover:text-accent rounded-lg transition-all duration-300 hover:bg-white dark:hover:bg-card-bg-dark hover:shadow-sm"
              >
                {link.title}
              </a>
            ))}
          </div>

          {/* Controls */}
          <div className="flex items-center space-x-2 text-primary-text dark:text-primary-text-dark">
            <button
              onClick={toggleLanguage}
              aria-label="Change Language"
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border border-primary-text/10 dark:border-primary-text-dark/10 hover:bg-white dark:hover:bg-card-bg-dark hover:shadow-sm transition-all duration-300 font-host font-bold text-xs tracking-wider uppercase cursor-pointer"
            >
              <Globe size={13} className="text-primary-text/60 dark:text-primary-text-dark/60" />
              <span className="text-primary-text/80 dark:text-primary-text-dark/80">{lang}</span>
            </button>

            <button
              onClick={toggleTheme}
              aria-label="Toggle Theme"
              className="p-2.5 rounded-xl border border-primary-text/10 dark:border-primary-text-dark/10 hover:bg-white dark:hover:bg-card-bg-dark hover:shadow-sm transition-all duration-300 cursor-pointer"
            >
              {isDarkMode 
                ? <Sun size={14} className="text-accent transition-transform duration-500 hover:rotate-45" /> 
                : <Moon size={14} className="text-primary-text/75 transition-transform duration-500 hover:-rotate-12" />
              }
            </button>
            
            <kbd className="hidden lg:inline-block px-2.5 py-1.5 rounded-lg text-[9px] font-josefin font-bold bg-primary-text/[0.04] dark:bg-primary-text-dark/[0.04] text-primary-text/40 dark:text-primary-text-dark/40 border border-primary-text/5 dark:border-primary-text-dark/5 pointer-events-none select-none">
              Ctrl K
            </kbd>

            {/* Mobile Menu Toggle button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle Menu"
              className="md:hidden relative w-10 h-10 flex flex-col justify-center items-center rounded-xl hover:bg-white dark:hover:bg-card-bg-dark hover:shadow-sm transition-all duration-300 p-2 z-50 cursor-pointer"
            >
              <div className={`w-5 h-[1.5px] bg-primary-text dark:bg-primary-text-dark transition-all duration-300 ease-out absolute ${isOpen ? 'rotate-45' : '-translate-y-1.5'}`} />
              <div className={`w-5 h-[1.5px] bg-primary-text dark:bg-primary-text-dark transition-all duration-300 ease-out absolute ${isOpen ? 'opacity-0 scale-75' : 'opacity-100'}`} />
              <div className={`w-5 h-[1.5px] bg-primary-text dark:bg-primary-text-dark transition-all duration-300 ease-out absolute ${isOpen ? '-rotate-45' : 'translate-y-1.5'}`} />
            </button>
          </div>
      </nav>
    </>
  );
}
