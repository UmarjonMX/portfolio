import { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { motion } from 'framer-motion';
import { socialLinks } from '../data/socialLinks';

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
    window.location.href = `mailto:umarmx2008@gmail.com?subject=${subject}&body=${body}`;
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <section id="contact" className="py-24 relative z-10 w-full">
      <div className="max-w-4xl mx-auto px-6 sm:px-10 lg:px-16">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">{t('contact.title')}</h2>
          <p className="text-lg opacity-70 max-w-2xl mx-auto">{t('contact.subtitle')}</p>
        </div>

        <div className="bg-glass-light dark:bg-glass-dark border border-border-light dark:border-border-dark p-8 md:p-14 rounded-[2.5rem] shadow-sm backdrop-blur-xl relative z-20">
          
          <form onSubmit={handleEmailSend} className="space-y-6 mb-12 relative z-30">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
              <div>
                <label className="block text-sm font-bold mb-2 opacity-80">{t('contact.name')}</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full bg-black/5 dark:bg-white/5 border border-border-light dark:border-border-dark rounded-2xl px-6 py-4 outline-none focus:border-accent transition-colors relative z-40" placeholder="John Doe" />
              </div>
              <div className="relative">
                <label className="block text-sm font-bold mb-2 opacity-80">{t('contact.email')}</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} className={`w-full bg-black/5 dark:bg-white/5 border rounded-2xl px-6 py-4 outline-none focus:border-accent transition-colors relative z-40 ${emailError ? 'border-red-500' : 'border-border-light dark:border-border-dark'}`} placeholder="john@example.com" />
                {emailError && <p className="text-red-500 text-xs font-bold mt-1 absolute -bottom-5 left-2">{emailError}</p>}
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold mb-2 opacity-80">{t('contact.message')}</label>
              <textarea rows="4" name="message" value={formData.message} onChange={handleChange} className="w-full bg-black/5 dark:bg-white/5 border border-border-light dark:border-border-dark rounded-2xl px-6 py-4 outline-none focus:border-accent transition-colors relative z-40" placeholder="Hello..."></textarea>
            </div>
            <button type="submit" disabled={!isFormValid} className={`relative z-40 w-full font-bold py-4 rounded-2xl transition-all ${isFormValid ? 'bg-primary-text dark:bg-primary-text-dark text-background dark:text-background-dark hover:bg-accent dark:hover:bg-accent hover:text-white cursor-pointer' : 'bg-primary-text/50 dark:bg-primary-text-dark/50 text-background/50 dark:text-background-dark/50 cursor-not-allowed'}`}>
              {t('contact.send')}
            </button>
          </form>

          {/* Bento Grid Social Links */}
          <div className="pt-10 border-t border-border-light dark:border-border-dark relative z-40">
            <h3 className="text-center font-bold text-xl mb-8 font-martian tracking-wider opacity-80 uppercase">Connect Network</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {socialLinks.map((link) => (
                <motion.a
                  key={link.id}
                  whileHover={{ y: -4, scale: 1.02 }}
                  href={link.href}
                  {...(link.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  className="flex items-center space-x-5 p-5 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl hover:border-[#08CB00] dark:hover:border-[#08CB00] hover:shadow-[0_0_20px_rgba(8,203,0,0.2)] transition-all group backdrop-blur-md cursor-pointer"
                >
                  <img src={link.icon} alt={link.label} style={{ width: 32, height: 32, objectFit: 'contain' }} className="group-hover:drop-shadow-[0_0_8px_#08CB00] dark:invert transition-all duration-300" />
                  <div className="flex flex-col overflow-hidden">
                    <span className="font-martian font-bold text-lg group-hover:text-[#08CB00] transition-colors duration-300 leading-tight truncate">{link.label}</span>
                    <span className="text-xs font-medium opacity-60 truncate">{link.username}</span>
                  </div>
                </motion.a>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
