import { Mail } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="relative z-20 w-full border-t-2 border-primary-text dark:border-primary-text-dark bg-white dark:bg-card-bg-dark pt-16 pb-8 px-6 sm:px-10 lg:px-16 mt-32 blueprint-grid-light dark:blueprint-grid-dark">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12 mb-16">
        
        {/* Left Column - Brand */}
        <div className="flex flex-col max-w-sm">
          <span className="font-editorial text-2xl font-bold tracking-tight text-primary-text dark:text-primary-text-dark mb-4">
            UmarjonMX
          </span>
          <p className="font-host text-primary-text/70 dark:text-primary-text-dark/70 text-lg leading-relaxed">
            Blending code, AI, and minimalist design.
          </p>
        </div>

        {/* Middle Column - Quick Links */}
        <div className="flex flex-col space-y-4">
          <h4 className="font-josefin font-bold text-sm tracking-widest uppercase mb-2 text-accent">Explore</h4>
          <a href="#about" className="font-host text-primary-text/70 hover:text-accent dark:text-primary-text-dark/70 dark:hover:text-accent transition-colors">{t('nav.about') || 'About'}</a>
          <a href="#projects" className="font-host text-primary-text/70 hover:text-accent dark:text-primary-text-dark/70 dark:hover:text-accent transition-colors">{t('nav.projects') || 'Projects'}</a>
          <a href="#resume" className="font-host text-primary-text/70 hover:text-accent dark:text-primary-text-dark/70 dark:hover:text-accent transition-colors">{t('nav.resume') || 'Arsenal'}</a>
        </div>

        {/* Right Column - Connect */}
        <div className="flex flex-col space-y-4">
          <h4 className="font-josefin font-bold text-sm tracking-widest uppercase mb-2 text-accent">Connect</h4>
          <a href="mailto:umarjonmx@gmail.com" className="font-host flex items-center gap-3 text-primary-text/70 hover:text-accent dark:text-primary-text-dark/70 dark:hover:text-accent transition-colors">
            <Mail size={18} />
            umarjonmx@gmail.com
          </a>
          
          <div className="flex items-center gap-4 mt-4">
            <a href="https://github.com/UmarjonMX" target="_blank" rel="noopener noreferrer" className="p-2 bg-white dark:bg-[#1E1E20] border border-primary-text dark:border-primary-text-dark rounded-lg hover:border-accent dark:hover:border-accent shadow-hard-interactive-light dark:shadow-hard-interactive-dark transition-all">
              <img src="/icons/github.png" alt="GitHub" className="w-5 h-5 object-contain dark:invert" />
            </a>
            <a href="https://www.linkedin.com/in/umarjon-muhammadjonov-4ba177281" target="_blank" rel="noopener noreferrer" className="p-2 bg-white dark:bg-[#1E1E20] border border-primary-text dark:border-primary-text-dark rounded-lg hover:border-accent dark:hover:border-accent shadow-hard-interactive-light dark:shadow-hard-interactive-dark transition-all">
              <img src="/icons/linkedin.png" alt="LinkedIn" className="w-5 h-5 object-contain dark:invert" />
            </a>
            <a href="https://t.me/UmarjonMX" target="_blank" rel="noopener noreferrer" className="p-2 bg-white dark:bg-[#1E1E20] border border-primary-text dark:border-primary-text-dark rounded-lg hover:border-accent dark:hover:border-accent shadow-hard-interactive-light dark:shadow-hard-interactive-dark transition-all">
              <img src="/icons/telegram.png" alt="Telegram" className="w-5 h-5 object-contain dark:invert" />
            </a>
            <a href="https://instagram.com/umarjonmx" target="_blank" rel="noopener noreferrer" className="p-2 bg-white dark:bg-[#1E1E20] border border-primary-text dark:border-primary-text-dark rounded-lg hover:border-accent dark:hover:border-accent shadow-hard-interactive-light dark:shadow-hard-interactive-dark transition-all">
              <img src="/icons/instagram.png" alt="Instagram" className="w-5 h-5 object-contain dark:invert" />
            </a>
          </div>
        </div>

      </div>

      {/* Bottom - Copyright */}
      <div className="max-w-7xl mx-auto pt-8 border-t border-primary-text/10 dark:border-primary-text-dark/10 flex flex-col md:flex-row items-center justify-between text-sm text-primary-text/50 dark:text-primary-text-dark/50 font-host">
        <p>© 2026 UmarjonMX. All rights reserved.</p>
        <p className="mt-2 md:mt-0 flex items-center gap-2">Built with <span className="text-accent block animate-pulse">🧡</span> from Namangan</p>
      </div>
    </footer>
  );
}
