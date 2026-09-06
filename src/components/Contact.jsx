import { useState } from 'react';
import toast from 'react-hot-toast';
import { Loader2 } from 'lucide-react';
import { copyToClipboard } from '../utils/clipboard';
import { useLanguage } from '../context/LanguageContext';
import SectionHeader from './SectionHeader';

export default function Contact() {
  const { t } = useLanguage();

  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [emailError, setEmailError] = useState('');
  const [sending, setSending] = useState(false);

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (name === 'email') {
      if (value && !validateEmail(value)) {
        setEmailError('Please enter a valid email address.');
      } else {
        setEmailError('');
      }
    }
  };

  const isFormValid = formData.name.trim() !== '' && 
                      formData.email.trim() !== '' && 
                      formData.message.trim() !== '' && 
                      !emailError;

  const handleEmailSend = (e) => {
    e.preventDefault();
    if (!isFormValid || sending) return;
    setSending(true);
    const subject = encodeURIComponent(`Message from ${formData.name}`);
    const body = encodeURIComponent(`Name: ${formData.name}\nEmail: ${formData.email}\nMessage: ${formData.message}`);
    window.location.href = `mailto:umarjonmx@gmail.com?subject=${subject}&body=${body}`;
    toast.success('Default mail client opened.');
    setFormData({ name: '', email: '', message: '' });
    setTimeout(() => setSending(false), 1500);
  };

  return (
    <section id="contact" className="py-32 relative z-10 w-full overflow-hidden">
      
      {/* Editorial Background: Signal Waves */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-20 dark:opacity-10 text-primary-text dark:text-primary-text-dark flex items-center justify-center">
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
        <div className="mb-16 bg-white/60 dark:bg-card-bg-dark/60 backdrop-blur-md p-8 sm:p-10 border border-primary-text/10 dark:border-primary-text-dark/10 rounded-[2rem] shadow-sm text-center max-w-2xl mx-auto">
          <p className="text-xl md:text-2xl text-primary-text/90 dark:text-primary-text-dark/90 leading-relaxed font-editorial">
            {t('contact.subtitle')}
          </p>
        </div>

        {/* Paper Ledger Form Sheet */}
        <div className="bg-white/70 dark:bg-card-bg-dark/70 backdrop-blur-xl border border-primary-text/10 dark:border-primary-text-dark/10 p-8 md:p-14 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] relative z-20">
          
          <form onSubmit={handleEmailSend} className="space-y-6 mb-12 relative z-30">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative">
              <div>
                <label className="block text-xs font-bold font-josefin tracking-wider uppercase mb-2 opacity-60">{t('contact.name')}</label>
                <input 
                  type="text" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleChange} 
                  aria-label="Name"
                  className="w-full bg-background/50 dark:bg-background-dark/50 backdrop-blur-sm border border-primary-text/10 dark:border-primary-text-dark/10 rounded-xl px-6 py-4 outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all text-primary-text dark:text-primary-text-dark font-host shadow-inner" 
                  placeholder="John Doe" 
                />
              </div>
              <div className="relative">
                <label className="block text-xs font-bold font-josefin tracking-wider uppercase mb-2 opacity-60">{t('contact.email')}</label>
                <input 
                  type="email" 
                  name="email" 
                  value={formData.email} 
                  onChange={handleChange} 
                  aria-label="Email Address"
                  className={`w-full bg-background/50 dark:bg-background-dark/50 backdrop-blur-sm border rounded-xl px-6 py-4 outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all text-primary-text dark:text-primary-text-dark font-host shadow-inner ${emailError ? 'border-red-500' : 'border-primary-text/10 dark:border-primary-text-dark/10'}`} 
                  placeholder="john@example.com" 
                />
                {emailError && <p className="text-red-500 text-xs font-bold mt-1 absolute -bottom-5 left-2">{emailError}</p>}
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold font-josefin tracking-wider uppercase mb-2 opacity-60">{t('contact.message')}</label>
              <textarea 
                rows="4" 
                name="message" 
                value={formData.message} 
                onChange={handleChange} 
                aria-label="Message"
                className="w-full bg-background/50 dark:bg-background-dark/50 backdrop-blur-sm border border-primary-text/10 dark:border-primary-text-dark/10 rounded-xl px-6 py-4 outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all text-primary-text dark:text-primary-text-dark font-host shadow-inner" 
                placeholder="Hello..."
              ></textarea>
            </div>
            <button 
              type="submit" 
              disabled={!isFormValid || sending} 
              aria-label="Send message"
              className={`relative z-40 w-full font-bold py-4 rounded-xl tracking-[0.2em] uppercase text-xs font-host transition-all active:scale-[0.98] ${
                isFormValid && !sending
                  ? 'bg-accent text-white dark:text-[#1C1C1D] shadow-[0_8px_30px_-8px_rgba(224,122,95,0.4)] hover:-translate-y-1 cursor-pointer' 
                  : 'bg-primary-text/5 dark:bg-primary-text-dark/5 text-primary-text/30 dark:text-primary-text-dark/30 border border-primary-text/10 dark:border-primary-text-dark/10 cursor-not-allowed'
              }`}
            >
              {sending ? (
                <span className="inline-flex items-center justify-center gap-2">
                  <Loader2 size={14} className="animate-spin" /> 
                  Opening mail client...
                </span>
              ) : (
                t('contact.send')
              )}
            </button>
          </form>

          {/* Social Links Network Ledger */}
          <div className="pt-10 border-t border-primary-text/10 dark:border-primary-text-dark/10 relative z-40">
            <h3 className="text-center font-bold text-lg mb-8 font-josefin tracking-wider opacity-85 uppercase">Connect Network</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              
                <a 
                href="https://github.com/UmarjonMX" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center space-x-5 p-5 bg-background/50 dark:bg-background-dark/50 backdrop-blur-sm border border-primary-text/10 dark:border-primary-text-dark/10 rounded-xl hover:border-accent/50 dark:hover:border-accent/50 hover:bg-white dark:hover:bg-card-bg-dark hover:shadow-lg transition-all group cursor-pointer"
              >
                <img src="/icons/github.png" alt="GitHub" style={{ width: 28, height: 28, objectFit: 'contain' }} className="dark:invert group-hover:scale-105 transition-all duration-300" />
                <div className="flex flex-col overflow-hidden">
                  <span className="font-host font-bold text-base group-hover:text-accent transition-colors leading-tight truncate">GitHub</span>
                  <span className="text-xs font-josefin opacity-50 truncate">UmarjonMX</span>
                </div>
              </a>

              <a 
                href="https://www.linkedin.com/in/umarjon-muhammadjonov-4ba177281" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center space-x-5 p-5 bg-background/50 dark:bg-background-dark/50 backdrop-blur-sm border border-primary-text/10 dark:border-primary-text-dark/10 rounded-xl hover:border-accent/50 dark:hover:border-accent/50 hover:bg-white dark:hover:bg-card-bg-dark hover:shadow-lg transition-all group cursor-pointer"
              >
                <img src="/icons/linkedin.png" alt="LinkedIn" style={{ width: 28, height: 28, objectFit: 'contain' }} className="dark:invert group-hover:scale-105 transition-all duration-300" />
                <div className="flex flex-col overflow-hidden">
                  <span className="font-host font-bold text-base group-hover:text-accent transition-colors leading-tight truncate">LinkedIn</span>
                  <span className="text-xs font-josefin opacity-50 truncate">Umarjon Muhammadjonov</span>
                </div>
              </a>

              <a 
                href="https://instagram.com/umarjonmx" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center space-x-5 p-5 bg-background/50 dark:bg-background-dark/50 backdrop-blur-sm border border-primary-text/10 dark:border-primary-text-dark/10 rounded-xl hover:border-accent/50 dark:hover:border-accent/50 hover:bg-white dark:hover:bg-card-bg-dark hover:shadow-lg transition-all group cursor-pointer"
              >
                <img src="/icons/instagram.png" alt="Instagram" style={{ width: 28, height: 28, objectFit: 'contain' }} className="dark:invert group-hover:scale-105 transition-all duration-300" />
                <div className="flex flex-col overflow-hidden">
                  <span className="font-host font-bold text-base group-hover:text-accent transition-colors leading-tight truncate">Instagram</span>
                  <span className="text-xs font-josefin opacity-50 truncate">@umarjonmx</span>
                </div>
              </a>

              <a 
                href="https://t.me/UmarjonMX" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center space-x-5 p-5 bg-background/50 dark:bg-background-dark/50 backdrop-blur-sm border border-primary-text/10 dark:border-primary-text-dark/10 rounded-xl hover:border-accent/50 dark:hover:border-accent/50 hover:bg-white dark:hover:bg-card-bg-dark hover:shadow-lg transition-all group cursor-pointer"
              >
                <img src="/icons/telegram.png" alt="Telegram" style={{ width: 28, height: 28, objectFit: 'contain' }} className="dark:invert group-hover:scale-105 transition-all duration-300" />
                <div className="flex flex-col overflow-hidden">
                  <span className="font-host font-bold text-base group-hover:text-accent transition-colors leading-tight truncate">Telegram</span>
                  <span className="text-xs font-josefin opacity-50 truncate">@UmarjonMX</span>
                </div>
              </a>

              <a 
                href="tel:+998971233667" 
                className="flex items-center space-x-5 p-5 bg-background/50 dark:bg-background-dark/50 backdrop-blur-sm border border-primary-text/10 dark:border-primary-text-dark/10 rounded-xl hover:border-accent/50 dark:hover:border-accent/50 hover:bg-white dark:hover:bg-card-bg-dark hover:shadow-lg transition-all group cursor-pointer"
              >
                <img src="/icons/phone.png" alt="Phone" style={{ width: 28, height: 28, objectFit: 'contain' }} className="dark:invert group-hover:scale-105 transition-all duration-300" />
                <div className="flex flex-col overflow-hidden">
                  <span className="font-host font-bold text-base group-hover:text-accent transition-colors leading-tight truncate">Phone</span>
                  <span className="text-xs font-josefin opacity-50 truncate">+998 97 123 36 67</span>
                </div>
              </a>

              <button 
                type="button"
                onClick={async () => { const ok = await copyToClipboard('umarjonmx@gmail.com'); ok ? toast.success('Email address copied to clipboard.') : toast.error('Failed to copy email address.'); }}
                className="flex items-center text-left space-x-5 p-5 bg-background/50 dark:bg-background-dark/50 backdrop-blur-sm border border-primary-text/10 dark:border-primary-text-dark/10 rounded-xl hover:border-accent/50 dark:hover:border-accent/50 hover:bg-white dark:hover:bg-card-bg-dark hover:shadow-lg transition-all group cursor-pointer active:scale-[0.98]"
                aria-label="Copy email address"
              >
                <img src="/icons/mail.png" alt="Email" style={{ width: 28, height: 28, objectFit: 'contain' }} className="dark:invert group-hover:scale-105 transition-all duration-300" />
                <div className="flex flex-col overflow-hidden">
                  <span className="font-host font-bold text-base group-hover:text-accent transition-colors leading-tight truncate">Email</span>
                  <span className="text-xs font-josefin opacity-50 truncate">umarjonmx@gmail.com</span>
                </div>
              </button>
              
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
