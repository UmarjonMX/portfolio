import { Mail } from 'lucide-react';
import toast from 'react-hot-toast';
import { copyToClipboard } from '../utils/clipboard';
import { useLanguage } from '../context/LanguageContext';

export default function Footer({ compact = false }) {
  const { t } = useLanguage();

  const copyEmail = async () => {
    const ok = await copyToClipboard('umarjonmx@gmail.com');
    ok
      ? toast.success('Email address copied to clipboard.')
      : toast.error('Failed to copy email address.');
  };

  const social = [
    {
      href: 'https://github.com/UmarjonMX',
      label: 'Visit GitHub profile',
      icon: '/icons/github.png',
    },
    {
      href: 'https://www.linkedin.com/in/umarjon-muhammadjonov-4ba177281',
      label: 'Visit LinkedIn profile',
      icon: '/icons/linkedin.png',
    },
    {
      href: 'https://t.me/UmarjonMX',
      label: 'Contact via Telegram',
      icon: '/icons/telegram.png',
    },
    {
      href: 'https://instagram.com/umarjonmx',
      label: 'Visit Instagram profile',
      icon: '/icons/instagram.png',
    },
  ];

  const socialLinkClass =
    'p-2 bg-white dark:bg-[#1E1E20] border border-primary-text dark:text-primary-text-dark rounded-lg hover:border-accent dark:hover:border-accent shadow-hard-interactive-light dark:shadow-hard-interactive-dark transition-all';

  // Compact colophon — used inside the closing composition, where a full
  // footer block would compete with the final statement. Same actions, same
  // links, one quiet row.
  if (compact) {
    return (
      <div className="w-full px-6 sm:px-10 lg:px-16 pb-6">
        <div className="max-w-[90rem] mx-auto pt-5 border-t border-primary-text/10 dark:border-primary-text-dark/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 sm:gap-5">
            <button
              onClick={copyEmail}
              className="font-host text-[11px] text-primary-text/60 dark:text-primary-text-dark/60 hover:text-accent transition-colors cursor-pointer"
              aria-label="Copy email address"
            >
              {t('contact.emailValue')}
            </button>
            <div className="hidden sm:flex items-center gap-2">
              {social.map((s) => (
                <a
                  key={s.href}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={socialLinkClass}
                  aria-label={s.label}
                >
                  <img
                    src={s.icon}
                    alt=""
                    className="w-4 h-4 object-contain dark:invert"
                  />
                </a>
              ))}
            </div>
          </div>
          <p className="font-host text-[11px] text-primary-text/40 dark:text-primary-text-dark/40">
            © 2026 UmarjonMX — Built with{' '}
            <span className="text-accent">🧡</span> from Namangan
          </p>
        </div>
      </div>
    );
  }

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
          <h4 className="font-josefin font-bold text-sm tracking-widest uppercase mb-2 text-accent">
            Explore
          </h4>
          <a
            href="#about"
            className="font-host text-primary-text/70 hover:text-accent dark:text-primary-text-dark/70 dark:hover:text-accent transition-colors"
          >
            {t('nav.about') || 'About'}
          </a>
          <a
            href="#projects"
            className="font-host text-primary-text/70 hover:text-accent dark:text-primary-text-dark/70 dark:hover:text-accent transition-colors"
          >
            {t('nav.projects') || 'Projects'}
          </a>
          <a
            href="#resume"
            className="font-host text-primary-text/70 hover:text-accent dark:text-primary-text-dark/70 dark:hover:text-accent transition-colors"
          >
            {t('nav.resume') || 'Arsenal'}
          </a>
        </div>

        {/* Right Column - Connect */}
        <div className="flex flex-col space-y-4">
          <h4 className="font-josefin font-bold text-sm tracking-widest uppercase mb-2 text-accent">
            Connect
          </h4>
          <button
            onClick={copyEmail}
            className="font-host flex items-center gap-3 text-primary-text/70 hover:text-accent dark:text-primary-text-dark/70 dark:hover:text-accent transition-colors cursor-pointer active:scale-[0.98]"
            aria-label="Copy email address"
          >
            <Mail size={18} />
            umarjonmx@gmail.com
          </button>

          <div className="flex items-center gap-4 mt-4">
            {social.map((s) => (
              <a
                key={s.href}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className={socialLinkClass}
                aria-label={s.label}
              >
                <img
                  src={s.icon}
                  alt=""
                  className="w-5 h-5 object-contain dark:invert"
                />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom - Copyright */}
      <div className="max-w-7xl mx-auto pt-8 border-t border-primary-text/10 dark:border-primary-text-dark/10 flex flex-col md:flex-row items-center justify-between text-sm text-primary-text/50 dark:text-primary-text-dark/50 font-host">
        <p>© 2026 UmarjonMX. All rights reserved.</p>
        <p className="mt-2 md:mt-0 flex items-center gap-2">
          Built with <span className="text-accent block animate-pulse">🧡</span>{' '}
          from Namangan
        </p>
      </div>
    </footer>
  );
}