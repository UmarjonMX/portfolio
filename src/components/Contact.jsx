import { useLanguage } from '../context/LanguageContext';
import { motion } from 'framer-motion';

export default function Contact() {
  const { t } = useLanguage();

  return (
    <section id="contact" className="py-24 relative z-10 w-full">
      <div className="max-w-4xl mx-auto px-6 sm:px-10 lg:px-16">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">{t('contact.title')}</h2>
          <p className="text-lg opacity-70 max-w-2xl mx-auto">{t('contact.subtitle')}</p>
        </div>

        <div className="bg-glass-light dark:bg-glass-dark border border-border-light dark:border-border-dark p-8 md:p-14 rounded-[2.5rem] shadow-sm backdrop-blur-xl relative z-20">
          
          <form className="space-y-6 mb-12 relative z-30">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold mb-2 opacity-80">{t('contact.name')}</label>
                <input type="text" className="w-full bg-black/5 dark:bg-white/5 border border-border-light dark:border-border-dark rounded-2xl px-6 py-4 outline-none focus:border-accent transition-colors relative z-40" placeholder="John Doe" />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2 opacity-80">{t('contact.email')}</label>
                <input type="email" className="w-full bg-black/5 dark:bg-white/5 border border-border-light dark:border-border-dark rounded-2xl px-6 py-4 outline-none focus:border-accent transition-colors relative z-40" placeholder="john@example.com" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold mb-2 opacity-80">{t('contact.message')}</label>
              <textarea rows="4" className="w-full bg-black/5 dark:bg-white/5 border border-border-light dark:border-border-dark rounded-2xl px-6 py-4 outline-none focus:border-accent transition-colors relative z-40" placeholder="Hello..."></textarea>
            </div>
            <button type="submit" className="relative z-40 w-full bg-primary-text dark:bg-primary-text-dark text-background dark:text-background-dark font-bold py-4 rounded-2xl hover:bg-accent dark:hover:bg-accent hover:text-white transition-colors cursor-pointer">
              {t('contact.send')}
            </button>
          </form>

          {/* Bento Grid Social Links */}
          <div className="pt-10 border-t border-border-light dark:border-border-dark relative z-40">
            <h3 className="text-center font-bold text-xl mb-8 font-martian tracking-wider opacity-80 uppercase">Connect Network</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              <motion.a 
                whileHover={{ y: -4, scale: 1.02 }} 
                href="https://github.com/UmarjonMX" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center space-x-5 p-5 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl hover:border-[#08CB00] dark:hover:border-[#08CB00] hover:shadow-[0_0_20px_rgba(8,203,0,0.2)] transition-all group backdrop-blur-md cursor-pointer"
              >
                <img src="/icons/github.png" alt="GitHub" style={{ width: 32, height: 32, objectFit: 'contain' }} className="group-hover:drop-shadow-[0_0_8px_#08CB00] dark:invert transition-all duration-300" />
                <div className="flex flex-col overflow-hidden">
                  <span className="font-martian font-bold text-lg group-hover:text-[#08CB00] transition-colors duration-300 leading-tight truncate">GitHub</span>
                  <span className="text-xs font-medium opacity-60 truncate">UmarjonMX</span>
                </div>
              </motion.a>

              <motion.a 
                whileHover={{ y: -4, scale: 1.02 }} 
                href="https://www.linkedin.com/in/umarjon-muhammadjonov-4ba177281" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center space-x-5 p-5 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl hover:border-[#08CB00] dark:hover:border-[#08CB00] hover:shadow-[0_0_20px_rgba(8,203,0,0.2)] transition-all group backdrop-blur-md cursor-pointer"
              >
                <img src="/icons/linkedin.png" alt="LinkedIn" style={{ width: 32, height: 32, objectFit: 'contain' }} className="group-hover:drop-shadow-[0_0_8px_#08CB00] dark:invert transition-all duration-300" />
                <div className="flex flex-col overflow-hidden">
                  <span className="font-martian font-bold text-lg group-hover:text-[#08CB00] transition-colors duration-300 leading-tight truncate">LinkedIn</span>
                  <span className="text-xs font-medium opacity-60 truncate">Umarjon Muhammadjonov</span>
                </div>
              </motion.a>

              <motion.a 
                whileHover={{ y: -4, scale: 1.02 }} 
                href="https://instagram.com/umarjonmx" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center space-x-5 p-5 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl hover:border-[#08CB00] dark:hover:border-[#08CB00] hover:shadow-[0_0_20px_rgba(8,203,0,0.2)] transition-all group backdrop-blur-md cursor-pointer"
              >
                <img src="/icons/instagram.png" alt="Instagram" style={{ width: 32, height: 32, objectFit: 'contain' }} className="group-hover:drop-shadow-[0_0_8px_#08CB00] dark:invert transition-all duration-300" />
                <div className="flex flex-col overflow-hidden">
                  <span className="font-martian font-bold text-lg group-hover:text-[#08CB00] transition-colors duration-300 leading-tight truncate">Instagram</span>
                  <span className="text-xs font-medium opacity-60 truncate">@umarjonmx</span>
                </div>
              </motion.a>

              <motion.a 
                whileHover={{ y: -4, scale: 1.02 }} 
                href="https://t.me/UmarjonMX" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center space-x-5 p-5 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl hover:border-[#08CB00] dark:hover:border-[#08CB00] hover:shadow-[0_0_20px_rgba(8,203,0,0.2)] transition-all group backdrop-blur-md cursor-pointer"
              >
                <img src="/icons/telegram.png" alt="Telegram" style={{ width: 32, height: 32, objectFit: 'contain' }} className="group-hover:drop-shadow-[0_0_8px_#08CB00] dark:invert transition-all duration-300" />
                <div className="flex flex-col overflow-hidden">
                  <span className="font-martian font-bold text-lg group-hover:text-[#08CB00] transition-colors duration-300 leading-tight truncate">Telegram</span>
                  <span className="text-xs font-medium opacity-60 truncate">@UmarjonMX</span>
                </div>
              </motion.a>

              <motion.a 
                whileHover={{ y: -4, scale: 1.02 }} 
                href="tel:+998971233667" 
                className="flex items-center space-x-5 p-5 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl hover:border-[#08CB00] dark:hover:border-[#08CB00] hover:shadow-[0_0_20px_rgba(8,203,0,0.2)] transition-all group backdrop-blur-md cursor-pointer sm:col-span-2 md:col-span-1"
              >
                <img src="/icons/phone.png" alt="Phone" style={{ width: 32, height: 32, objectFit: 'contain' }} className="group-hover:drop-shadow-[0_0_8px_#08CB00] dark:invert transition-all duration-300" />
                <div className="flex flex-col overflow-hidden">
                  <span className="font-martian font-bold text-lg group-hover:text-[#08CB00] transition-colors duration-300 leading-tight truncate">Phone</span>
                  <span className="text-xs font-medium opacity-60 truncate">+998 97 123 36 67</span>
                </div>
              </motion.a>
              
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
