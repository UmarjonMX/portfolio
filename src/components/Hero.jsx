import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { Download } from 'lucide-react';
import ActivityStatus from './ActivityStatus';

export default function Hero() {
  const { t } = useLanguage();

  return (
    <section className="relative h-[100dvh] flex flex-col items-center justify-center overflow-hidden pt-16 z-10">
      <motion.div 
        className="absolute top-24 left-4 sm:left-10 lg:left-16 z-50 pointer-events-auto"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
      >
        <ActivityStatus />
      </motion.div>
      <div className="relative z-10 text-center px-4 w-full pointer-events-none">
        <h1 
          className="text-5xl sm:text-7xl lg:text-8xl font-bold tracking-tighter mb-6 text-primary-text dark:text-primary-text-dark opacity-0 animate-fadeInUp delay-100"
        >
          {t('hero.title')}
        </h1>
        <p 
          className="text-lg sm:text-xl lg:text-2xl text-primary-text/80 dark:text-primary-text-dark/80 max-w-2xl mx-auto font-medium leading-relaxed opacity-0 animate-fadeInUp delay-300"
        >
          {t('hero.subtitle')}
        </p>
        
        {/* Resume CV Download Button */}
        <div
           className="mt-12 flex justify-center w-full pointer-events-auto relative z-20 opacity-0 animate-fadeInUp delay-500"
        >
          <a 
            href="/resume.pdf" 
            download 
            className="inline-flex items-center gap-4 px-8 py-4 bg-glass-light dark:bg-glass-dark border border-white/10 dark:border-white/10 backdrop-blur-md rounded-full font-funnel font-bold tracking-widest uppercase hover:bg-accent dark:hover:bg-accent hover:border-accent hover:text-white dark:hover:text-background transition-all duration-300 shadow-[0_0_20px_rgba(0,0,0,0.05)] hover:shadow-[0_0_30px_rgba(8,203,0,0.3)] hover:-translate-y-1"
          >
            <Download size={20} />
            <span>Download CV</span>
          </a>
        </div>
      </div>
    </section>
  );
}
