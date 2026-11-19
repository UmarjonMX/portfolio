import { Mail } from 'lucide-react';
import toast from 'react-hot-toast';
import { copyToClipboard } from '../utils/clipboard';
import { EMAIL } from '../constants';
import { useLanguage } from '../context/LanguageContext';

const SOCIAL = [
  { href: 'https://github.com/UmarjonMX', icon: '/icons/github.png', ariaKey: 'github' },
  { href: 'https://www.linkedin.com/in/umarjon-muhammadjonov-4ba177281', icon: '/icons/linkedin.png', ariaKey: 'linkedin' },
  { href: 'https://t.me/UmarjonMX', icon: '/icons/telegram.png', ariaKey: 'telegram' },
  { href: 'https://instagram.com/umarjonmx', icon: '/icons/instagram.png', ariaKey: 'instagram' },
];

const SOCIAL_LINK =
  'p-2 bg-white dark:bg-[#1E1E20] border border-primary-text dark:text-primary-text-dark rounded-lg hover:border-accent dark:hover:border-accent shadow-hard-interactive-light dark:shadow-hard-interactive-dark transition-all';

export default function Footer({ compact = false }) {
  const { t } = useLanguage();

  const copyEmail = async () => {
    const ok = await copyToClipboard(EMAIL);
    if (ok) toast.success(t('contact.copied'));
    else toast.error(t('contact.copyFailed'));
  };

  const renderSocial = (size) =>
    SOCIAL.map((s) => (
      <a
        key={s.href}
        href={s.href}
        target="_blank"
        rel="noopener noreferrer"
        className={SOCIAL_LINK}
        aria-label={t(`contact.links.${s.ariaKey}.aria`)}
      >
        <img
          src={s.icon}
          alt=""
          width={size}
          height={size}
          className="object-contain dark:invert"
        />
      </a>
    ));

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
              aria-label={t('contact.links.email.aria')}
            >
              {EMAIL}
            </button>
            <div className="hidden sm:flex items-center gap-2">
              {renderSocial(16)}
            </div>
          </div>
          <p className="font-host text-[11px] text-primary-text/40 dark:text-primary-text-dark/40">
            © 2026 UmarjonMX — {t('footer.builtWith')}{' '}
            <span className="text-accent">🧡</span> {t('footer.fromWhere')}
          </p>
        </div>
      </div>
    );
  }

  return (
    <footer className="relative z-20 w-full border-t-2 border-primary-text dark:border-primary-text-dark bg-white dark:bg-card-bg-dark pt-16 pb-8 px-6 sm:px-10 lg:px-16 mt-32 blueprint-grid-light dark:blueprint-grid-dark">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12 mb-16">
        <div className="flex flex-col max-w-sm">
          <span className="font-editorial text-2xl font-bold tracking-tight text-primary-text dark:text-primary-text-dark mb-4">
            UmarjonMX
          </span>
          <p className="font-host text-primary-text/70 dark:text-primary-text-dark/70 text-lg leading-relaxed">
            {t('footer.tagline')}
          </p>
        </div>

        <div className="flex flex-col space-y-4">
          <h2 className="font-josefin font-bold text-sm tracking-widest uppercase mb-2 text-accent">
            {t('footer.explore')}
          </h2>
          {[
            { href: '#about', key: 'about' },
            { href: '#projects', key: 'projects' },
            { href: '#resume', key: 'resume' },
          ].map(({ href, key }) => (
            <a
              key={href}
              href={href}
              className="font-host text-primary-text/70 hover:text-accent dark:text-primary-text-dark/70 dark:hover:text-accent transition-colors"
            >
              {t(`nav.${key}`)}
            </a>
          ))}
        </div>

        <div className="flex flex-col space-y-4">
          <h2 className="font-josefin font-bold text-sm tracking-widest uppercase mb-2 text-accent">
            {t('footer.connect')}
          </h2>
          <button
            onClick={copyEmail}
            className="font-host flex items-center gap-3 text-primary-text/70 hover:text-accent dark:text-primary-text-dark/70 dark:hover:text-accent transition-colors cursor-pointer active:scale-[0.98]"
            aria-label={t('contact.links.email.aria')}
          >
            <Mail size={18} />
            {EMAIL}
          </button>

          <div className="flex items-center gap-4 mt-4">{renderSocial(20)}</div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-8 border-t border-primary-text/10 dark:border-primary-text-dark/10 flex flex-col md:flex-row items-center justify-between text-sm text-primary-text/50 dark:text-primary-text-dark/50 font-host">
        <p>© 2026 UmarjonMX. {t('footer.rights')}</p>
        <p className="mt-2 md:mt-0 flex items-center gap-2">
          {t('footer.builtWith')} <span className="text-accent block animate-pulse">🧡</span>{' '}
          {t('footer.fromWhere')}
        </p>
      </div>
    </footer>
  );
}