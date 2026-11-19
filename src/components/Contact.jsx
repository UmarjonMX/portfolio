import { useState } from 'react';
import toast from 'react-hot-toast';
import { Loader2, FileText } from 'lucide-react';
import { copyToClipboard } from '../utils/clipboard';
import { CV_PATH, CV_FILENAME } from '../utils/cv';
import { EMAIL } from '../constants';
import { useLanguage } from '../context/LanguageContext';
import SectionHeader from './SectionHeader';

/**
 * The social ledger.
 *
 * Six cells that were six hand-written near-identical blocks — each one a
 * slightly different copy of the same markup, which is why four of them had
 * drifted (a missing `alt`, a different hover fill) by the time anyone noticed.
 * One definition, one layout, one hover treatment.
 */
const SOCIAL = [
  { key: 'github', href: 'https://github.com/UmarjonMX', icon: '/icons/github.png', external: true },
  {
    key: 'linkedin',
    href: 'https://www.linkedin.com/in/umarjon-muhammadjonov-4ba177281',
    icon: '/icons/linkedin.png',
    external: true,
  },
  { key: 'instagram', href: 'https://instagram.com/umarjonmx', icon: '/icons/instagram.png', external: true },
  { key: 'telegram', href: 'https://t.me/UmarjonMX', icon: '/icons/telegram.png', external: true },
];

const CELL =
  'group flex items-center space-x-5 p-5 bg-background dark:bg-background-dark border border-primary-text/10 dark:border-primary-text-dark/10 rounded-xl hover:border-accent/50 dark:hover:border-accent/50 hover:bg-white dark:hover:bg-card-bg-dark transition-colors duration-300';
const BODY = 'flex flex-col overflow-hidden';
const NAME =
  'font-host font-bold text-base group-hover:text-accent transition-colors leading-tight truncate';
const HANDLE = 'text-xs font-josefin opacity-50 truncate';

function CellIcon({ src, alt }) {
  return (
    <img
      src={src}
      alt={alt}
      width={28}
      height={28}
      style={{ objectFit: 'contain' }}
      className="shrink-0 dark:invert group-hover:scale-105 transition-all duration-300"
    />
  );
}

export default function Contact() {
  const { t } = useLanguage();

  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [emailError, setEmailError] = useState('');
  const [sending, setSending] = useState(false);

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === 'email') {
      setEmailError(value && !validateEmail(value) ? t('contact.emailInvalid') : '');
    }
  };

  const isFormValid =
    formData.name.trim() !== '' &&
    formData.email.trim() !== '' &&
    formData.message.trim() !== '' &&
    !emailError;

  const handleEmailSend = (e) => {
    e.preventDefault();
    if (!isFormValid || sending) return;
    setSending(true);
    const subject = encodeURIComponent(`Message from ${formData.name}`);
    const body = encodeURIComponent(
      `Name: ${formData.name}\nEmail: ${formData.email}\nMessage: ${formData.message}`
    );
    window.location.href = `mailto:${EMAIL}?subject=${subject}&body=${body}`;
    toast.success(t('contact.mailOpened'));
    setFormData({ name: '', email: '', message: '' });
    setTimeout(() => setSending(false), 1500);
  };

  const copyEmail = async () => {
    const ok = await copyToClipboard(EMAIL);
    if (ok) toast.success(t('contact.copied'));
    else toast.error(t('contact.copyFailed'));
  };

  return (
    <section id="contact" data-chapter="contact" className="py-32 relative w-full">

      {/* Editorial Background: Signal Waves */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-20 dark:opacity-10 text-primary-text dark:text-primary-text-dark flex items-center justify-center overflow-hidden">
        <svg className="w-full h-full opacity-50" xmlns="http://www.w3.org/2000/svg">
          <g stroke="currentColor" strokeWidth="0.5" fill="none">
            <circle cx="50%" cy="50%" r="200" strokeDasharray="1 6" strokeOpacity="0.4" />
            <circle cx="50%" cy="50%" r="400" strokeDasharray="1 8" strokeOpacity="0.3" />
            <circle cx="50%" cy="50%" r="600" strokeDasharray="1 10" strokeOpacity="0.2" />
            <path d="M 0 50 Q 25 40 50 50 T 100 50" strokeOpacity="0.5" />
          </g>
        </svg>
      </div>

      <SectionHeader title={t('contact.title')} number="05" />

      <div className="max-w-4xl mx-auto px-6 sm:px-10 lg:px-16 relative z-10">
        <div className="mb-16 bg-white dark:bg-card-bg-dark p-8 sm:p-10 border border-primary-text/10 dark:border-primary-text-dark/10 rounded-[2rem] shadow-sm text-center max-w-2xl mx-auto">
          <p className="text-xl md:text-2xl text-primary-text/90 dark:text-primary-text-dark/90 leading-relaxed font-editorial">
            {t('contact.subtitle')}
          </p>
        </div>

        {/* Paper Ledger Form Sheet.

            NOTE: no backdrop-filter here, and none on anything inside.
            This is the largest painted surface on the site; stacking
            `backdrop-blur-xl` with `.glass3d`'s own backdrop blur turned it
            into a hazy panel floating over the ambient background. Painting
            the surface instead of blurring it keeps the background reading
            as one continuous field. */}
        <div className="bg-white dark:bg-card-bg-dark border border-primary-text/10 dark:border-primary-text-dark/10 p-8 md:p-14 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] relative z-20">

          <form onSubmit={handleEmailSend} className="space-y-6 mb-12 relative z-30" noValidate>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative">
              <div>
                <label htmlFor="contact-name" className="block text-xs font-bold font-josefin tracking-wider uppercase mb-2 opacity-60">
                  {t('contact.name')}
                </label>
                <input
                  id="contact-name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  autoComplete="name"
                  className="w-full bg-background dark:bg-background-dark border border-primary-text/10 dark:border-primary-text-dark/10 rounded-xl px-6 py-4 outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all text-primary-text dark:text-primary-text-dark font-host shadow-inner"
                  placeholder="John Doe"
                />
              </div>
              <div className="relative">
                <label htmlFor="contact-email" className="block text-xs font-bold font-josefin tracking-wider uppercase mb-2 opacity-60">
                  {t('contact.email')}
                </label>
                <input
                  id="contact-email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="email"
                  aria-invalid={emailError ? 'true' : undefined}
                  aria-describedby={emailError ? 'contact-email-error' : undefined}
                  className={`w-full bg-background dark:bg-background-dark border rounded-xl px-6 py-4 outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all text-primary-text dark:text-primary-text-dark font-host shadow-inner ${emailError ? 'border-red-500' : 'border-primary-text/10 dark:border-primary-text-dark/10'}`}
                  placeholder="john@example.com"
                />
                {/* Reserved space so the error appearing never shifts the layout. */}
                {emailError && (
                  <p
                    id="contact-email-error"
                    role="alert"
                    className="text-red-500 text-xs font-bold mt-1 absolute -bottom-5 left-2"
                  >
                    {emailError}
                  </p>
                )}
              </div>
            </div>
            <div>
              <label htmlFor="contact-message" className="block text-xs font-bold font-josefin tracking-wider uppercase mb-2 opacity-60">
                {t('contact.message')}
              </label>
              <textarea
                id="contact-message"
                rows="4"
                name="message"
                value={formData.message}
                onChange={handleChange}
                className="w-full bg-background dark:bg-background-dark border border-primary-text/10 dark:border-primary-text-dark/10 rounded-xl px-6 py-4 outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all text-primary-text dark:text-primary-text-dark font-host shadow-inner"
                placeholder="Hello..."
              />
            </div>
            <button
              type="submit"
              disabled={!isFormValid || sending}
              className={`relative z-40 w-full font-bold py-4 rounded-xl tracking-[0.2em] uppercase text-xs font-host transition-all active:scale-[0.98] ${
                isFormValid && !sending
                  ? 'bg-accent text-white dark:text-[#1C1C1D] shadow-[0_8px_30px_-8px_rgba(224,122,95,0.4)] hover:-translate-y-1 cursor-pointer'
                  : 'bg-primary-text/5 dark:bg-primary-text-dark/5 text-primary-text/30 dark:text-primary-text-dark/30 border border-primary-text/10 dark:border-primary-text-dark/10 cursor-not-allowed'
              }`}
            >
              {sending ? (
                <span className="inline-flex items-center justify-center gap-2">
                  <Loader2 size={14} className="animate-spin" />
                  {t('contact.sending')}
                </span>
              ) : (
                t('contact.send')
              )}
            </button>
          </form>

          {/* Social Links Network Ledger — six items, laid out 3 × 2 at
              desktop and 2 × 3 from `sm` up, so no cell is ever left empty
              and mobile stacks one per row. */}
          <div className="pt-10 border-t border-primary-text/10 dark:border-primary-text-dark/10 relative z-40">
            <h3 className="text-center font-bold text-lg mb-8 font-josefin tracking-wider opacity-85 uppercase">
              {t('contact.network')}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {SOCIAL.map(({ key, href, icon, external }) => {
                const item = t(`contact.links.${key}`);
                return (
                  <a
                    key={key}
                    href={href}
                    {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    className={`${CELL} cursor-pointer`}
                    aria-label={item.aria}
                  >
                    <CellIcon src={icon} alt="" />
                    <div className={BODY}>
                      <span className={NAME}>{item.label}</span>
                      <span className={HANDLE}>{item.handle}</span>
                    </div>
                  </a>
                );
              })}

              <a
                href={CV_PATH}
                download={CV_FILENAME}
                aria-label={t('contact.links.cv.aria')}
                className={`${CELL} cursor-pointer`}
              >
                <FileText
                  size={28}
                  className="shrink-0 text-primary-text dark:text-primary-text-dark group-hover:scale-105 group-hover:text-accent transition-all duration-300"
                />
                <div className={BODY}>
                  <span className={NAME}>{t('contact.links.cv.label')}</span>
                  <span className={HANDLE}>{CV_FILENAME}</span>
                </div>
              </a>

              <button
                type="button"
                onClick={copyEmail}
                aria-label={t('contact.links.email.aria')}
                className={`${CELL} text-left cursor-pointer active:scale-[0.98]`}
              >
                <CellIcon src="/icons/mail.png" alt="" />
                <div className={BODY}>
                  <span className={NAME}>{t('contact.links.email.label')}</span>
                  <span className={HANDLE}>{EMAIL}</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}