import { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

export default function Contact() {
  const { t } = useLanguage();

  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [emailError, setEmailError] = useState('');

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
    if (!isFormValid) return;
    const subject = encodeURIComponent(`Message from ${formData.name}`);
    const body = encodeURIComponent(`Name: ${formData.name}\nEmail: ${formData.email}\nMessage: ${formData.message}`);
    window.location.href = `mailto:umarjonmx@gmail.com?subject=${subject}&body=${body}`;
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <section id="contact" className="py-32 relative z-10 w-full">
      <div className="max-w-4xl mx-auto px-6 sm:px-10 lg:px-16">
        <div className="mb-16 border-l-2 border-accent/30 pl-6">
          <div className="mb-4 inline-flex items-center gap-2 px-3 py-1 bg-accent/10 border border-accent/25 rounded-md text-accent text-[10px] font-martian font-bold uppercase tracking-wider">
            Sheet 05 // Connection
          </div>
          <h2 className="text-4xl font-bold tracking-tight mb-4 text-primary-text dark:text-primary-text-dark font-martian">
            {t('contact.title')}
          </h2>
          <p className="text-lg text-primary-text/75 dark:text-primary-text-dark/75 font-funnel max-w-xl">
            {t('contact.subtitle')}
          </p>
        </div>

        {/* Paper Ledger Form Sheet */}
        <div className="bg-white dark:bg-card-bg-dark border border-primary-text dark:border-primary-text-dark p-8 md:p-14 rounded-2xl shadow-hard-light dark:shadow-hard-dark relative z-20">
          
          <form onSubmit={handleEmailSend} className="space-y-6 mb-12 relative z-30">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative">
              <div>
                <label className="block text-xs font-bold font-martian tracking-wider uppercase mb-2 opacity-80">{t('contact.name')}</label>
                <input 
                  type="text" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleChange} 
                  className="w-full bg-[#FAFAFA] dark:bg-background-dark border border-primary-text dark:border-primary-text-dark rounded-xl px-6 py-4 outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all recess-inset-light dark:recess-inset-dark text-primary-text dark:text-primary-text-dark font-funnel" 
                  placeholder="John Doe" 
                />
              </div>
              <div className="relative">
                <label className="block text-xs font-bold font-martian tracking-wider uppercase mb-2 opacity-80">{t('contact.email')}</label>
                <input 
                  type="email" 
                  name="email" 
                  value={formData.email} 
                  onChange={handleChange} 
                  className={`w-full bg-[#FAFAFA] dark:bg-background-dark border rounded-xl px-6 py-4 outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all recess-inset-light dark:recess-inset-dark text-primary-text dark:text-primary-text-dark font-funnel ${emailError ? 'border-red-500' : 'border-primary-text dark:border-primary-text-dark'}`} 
                  placeholder="john@example.com" 
                />
                {emailError && <p className="text-red-500 text-xs font-bold mt-1 absolute -bottom-5 left-2">{emailError}</p>}
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold font-martian tracking-wider uppercase mb-2 opacity-80">{t('contact.message')}</label>
              <textarea 
                rows="4" 
                name="message" 
                value={formData.message} 
                onChange={handleChange} 
                className="w-full bg-[#FAFAFA] dark:bg-background-dark border border-primary-text dark:border-primary-text-dark rounded-xl px-6 py-4 outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all recess-inset-light dark:recess-inset-dark text-primary-text dark:text-primary-text-dark font-funnel" 
                placeholder="Hello..."
              ></textarea>
            </div>
            <button 
              type="submit" 
              disabled={!isFormValid} 
              className={`relative z-40 w-full font-bold py-4 rounded-xl border border-primary-text dark:border-primary-text-dark tracking-widest uppercase text-xs transition-all ${
                isFormValid 
                  ? 'bg-accent text-white dark:text-[#1C1C1D] shadow-hard-interactive-light dark:shadow-hard-interactive-dark cursor-pointer' 
                  : 'bg-primary-text/10 dark:bg-primary-text-dark/10 text-primary-text/30 dark:text-primary-text-dark/30 cursor-not-allowed'
              }`}
            >
              {t('contact.send')}
            </button>
          </form>

          {/* Social Links Network Ledger */}
          <div className="pt-10 border-t border-primary-text/10 dark:border-primary-text-dark/10 relative z-40">
            <h3 className="text-center font-bold text-lg mb-8 font-martian tracking-wider opacity-85 uppercase">Connect Network</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              
              <a 
                href="https://github.com/UmarjonMX" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center space-x-5 p-5 bg-white dark:bg-card-bg-dark border border-primary-text dark:border-primary-text-dark rounded-xl hover:border-accent dark:hover:border-accent shadow-hard-interactive-light dark:shadow-hard-interactive-dark transition-all group cursor-pointer"
              >
                <img src="/icons/github.png" alt="GitHub" style={{ width: 28, height: 28, objectFit: 'contain' }} className="dark:invert group-hover:scale-105 transition-all duration-300" />
                <div className="flex flex-col overflow-hidden">
                  <span className="font-martian font-bold text-base group-hover:text-accent transition-colors leading-tight truncate">GitHub</span>
                  <span className="text-[10px] font-martian opacity-50 truncate">UmarjonMX</span>
                </div>
              </a>

              <a 
                href="https://www.linkedin.com/in/umarjon-muhammadjonov-4ba177281" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center space-x-5 p-5 bg-white dark:bg-card-bg-dark border border-primary-text dark:border-primary-text-dark rounded-xl hover:border-accent dark:hover:border-accent shadow-hard-interactive-light dark:shadow-hard-interactive-dark transition-all group cursor-pointer"
              >
                <img src="/icons/linkedin.png" alt="LinkedIn" style={{ width: 28, height: 28, objectFit: 'contain' }} className="dark:invert group-hover:scale-105 transition-all duration-300" />
                <div className="flex flex-col overflow-hidden">
                  <span className="font-martian font-bold text-base group-hover:text-accent transition-colors leading-tight truncate">LinkedIn</span>
                  <span className="text-[10px] font-martian opacity-50 truncate">Umarjon Muhammadjonov</span>
                </div>
              </a>

              <a 
                href="https://instagram.com/umarjonmx" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center space-x-5 p-5 bg-white dark:bg-card-bg-dark border border-primary-text dark:border-primary-text-dark rounded-xl hover:border-accent dark:hover:border-accent shadow-hard-interactive-light dark:shadow-hard-interactive-dark transition-all group cursor-pointer"
              >
                <img src="/icons/instagram.png" alt="Instagram" style={{ width: 28, height: 28, objectFit: 'contain' }} className="dark:invert group-hover:scale-105 transition-all duration-300" />
                <div className="flex flex-col overflow-hidden">
                  <span className="font-martian font-bold text-base group-hover:text-accent transition-colors leading-tight truncate">Instagram</span>
                  <span className="text-[10px] font-martian opacity-50 truncate">@umarjonmx</span>
                </div>
              </a>

              <a 
                href="https://t.me/UmarjonMX" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center space-x-5 p-5 bg-white dark:bg-card-bg-dark border border-primary-text dark:border-primary-text-dark rounded-xl hover:border-accent dark:hover:border-accent shadow-hard-interactive-light dark:shadow-hard-interactive-dark transition-all group cursor-pointer"
              >
                <img src="/icons/telegram.png" alt="Telegram" style={{ width: 28, height: 28, objectFit: 'contain' }} className="dark:invert group-hover:scale-105 transition-all duration-300" />
                <div className="flex flex-col overflow-hidden">
                  <span className="font-martian font-bold text-base group-hover:text-accent transition-colors leading-tight truncate">Telegram</span>
                  <span className="text-[10px] font-martian opacity-50 truncate">@UmarjonMX</span>
                </div>
              </a>

              <a 
                href="tel:+998971233667" 
                className="flex items-center space-x-5 p-5 bg-white dark:bg-card-bg-dark border border-primary-text dark:border-primary-text-dark rounded-xl hover:border-accent dark:hover:border-accent shadow-hard-interactive-light dark:shadow-hard-interactive-dark transition-all group cursor-pointer"
              >
                <img src="/icons/phone.png" alt="Phone" style={{ width: 28, height: 28, objectFit: 'contain' }} className="dark:invert group-hover:scale-105 transition-all duration-300" />
                <div className="flex flex-col overflow-hidden">
                  <span className="font-martian font-bold text-base group-hover:text-accent transition-colors leading-tight truncate">Phone</span>
                  <span className="text-[10px] font-martian opacity-50 truncate">+998 97 123 36 67</span>
                </div>
              </a>

              <a 
                href="mailto:umarmx2008@gmail.com" 
                className="flex items-center space-x-5 p-5 bg-white dark:bg-card-bg-dark border border-primary-text dark:border-primary-text-dark rounded-xl hover:border-accent dark:hover:border-accent shadow-hard-interactive-light dark:shadow-hard-interactive-dark transition-all group cursor-pointer"
              >
                <img src="/icons/mail.png" alt="Email" style={{ width: 28, height: 28, objectFit: 'contain' }} className="dark:invert group-hover:scale-105 transition-all duration-300" />
                <div className="flex flex-col overflow-hidden">
                  <span className="font-martian font-bold text-base group-hover:text-accent transition-colors leading-tight truncate">Email</span>
                  <span className="text-[10px] font-martian opacity-50 truncate">umarmx2008@gmail.com</span>
                </div>
              </a>
              
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
