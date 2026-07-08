import { motion } from 'framer-motion';
import { Mail } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { footerSocialLinks } from '../data/socialLinks';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="relative z-20 w-full border-t border-white/10 dark:border-white/10 bg-glass-light dark:bg-glass-dark backdrop-blur-md pt-16 pb-8 px-6 sm:px-10 lg:px-16 mt-32">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12 mb-16">
        
        {/* Left Column - Brand */}
        <div className="flex flex-col max-w-sm">
          <span className="font-martian text-2xl font-bold tracking-tight text-primary-text dark:text-primary-text-dark mb-4">
            UmarjonMX
          </span>
          <p className="font-funnel text-primary-text/70 dark:text-primary-text-dark/70 text-lg leading-relaxed">
            Blending code, AI, and minimalist design.
          </p>
        </div>

        {/* Middle Column - Quick Links */}
        <div className="flex flex-col space-y-4">
          <h4 className="font-martian font-bold text-sm tracking-widest uppercase mb-2">Explore</h4>
          <a href="#about" className="font-funnel text-primary-text/70 hover:text-[#08CB00] dark:text-primary-text-dark/70 dark:hover:text-[#08CB00] transition-colors">{t('nav.about') || 'About'}</a>
          <a href="#projects" className="font-funnel text-primary-text/70 hover:text-[#08CB00] dark:text-primary-text-dark/70 dark:hover:text-[#08CB00] transition-colors">{t('nav.projects') || 'Projects'}</a>
          <a href="#resume" className="font-funnel text-primary-text/70 hover:text-[#08CB00] dark:text-primary-text-dark/70 dark:hover:text-[#08CB00] transition-colors">{t('nav.resume') || 'Arsenal'}</a>
        </div>

        {/* Right Column - Connect */}
        <div className="flex flex-col space-y-4">
          <h4 className="font-martian font-bold text-sm tracking-widest uppercase mb-2">Connect</h4>
          <a href="mailto:hi@umarjonmx.com" className="font-funnel flex items-center gap-3 text-primary-text/70 hover:text-[#08CB00] dark:text-primary-text-dark/70 dark:hover:text-[#08CB00] transition-colors">
            <Mail size={18} />
            hi@umarjonmx.com
          </a>
          
          <div className="flex items-center gap-4 mt-4">
            {footerSocialLinks.map((link) => (
              <motion.a
                key={link.id}
                whileHover={{ y: -3, scale: 1.1 }}
                href={link.href}
                {...(link.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                className="p-2 bg-black/5 dark:bg-white/5 rounded-full hover:bg-accent/20 transition-colors"
              >
                <img src={link.icon} alt={link.label} className="w-5 h-5 object-contain" />
              </motion.a>
            ))}
          </div>
        </div>

      </div>

      {/* Bottom - Copyright */}
      <div className="max-w-7xl mx-auto pt-8 border-t border-black/5 dark:border-white/5 flex flex-col md:flex-row items-center justify-between text-sm text-primary-text/50 dark:text-primary-text-dark/50 font-funnel">
        <p>© 2026 UmarjonMX. All rights reserved.</p>
        <p className="mt-2 md:mt-0 flex items-center gap-2">Built with <span className="text-[#08CB00] block animate-pulse">💚</span> from Namangan</p>
      </div>
    </footer>
  );
}
