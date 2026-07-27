import { useLanguage } from '../context/LanguageContext';
import BentoCard from './BentoCard';
import SectionHeader from './SectionHeader';

export default function About() {
  const { t } = useLanguage();
  const manifesto = t('about.manifesto');
  
  return (
    <section id="about" className="relative py-32 px-6 sm:px-10 lg:px-16 max-w-7xl mx-auto z-10 border-b border-primary-text/10 dark:border-primary-text-dark/10">
      
      {/* Editorial Background: Neural Paths / System Diagram */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-20 dark:opacity-10 text-primary-text dark:text-primary-text-dark flex items-center justify-center overflow-hidden">
        <svg className="w-[120%] h-[120%] opacity-50" viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg">
          <g stroke="currentColor" strokeWidth="0.5" fill="none" strokeOpacity="0.6">
            <circle cx="400" cy="300" r="200" strokeDasharray="2 4" />
            <circle cx="400" cy="300" r="150" />
            <path d="M 200 300 Q 400 100 600 300 T 800 300" strokeDasharray="4 4" />
            <path d="M 0 300 Q 200 500 400 300 T 600 300" />
            <line x1="400" y1="0" x2="400" y2="600" strokeOpacity="0.2" />
            <line x1="0" y1="300" x2="800" y2="300" strokeOpacity="0.2" />
          </g>
        </svg>
      </div>

      <SectionHeader title={t('about.title')} number="02" />

      {/* Editorial Layout */}
      <div className="relative z-10 max-w-4xl mx-auto mt-12">
        <div className="mb-16 bg-white/60 dark:bg-card-bg-dark/60 backdrop-blur-md p-8 sm:p-12 border border-primary-text/10 dark:border-primary-text-dark/10 rounded-[2rem] shadow-sm">
          <p className="text-xl md:text-2xl text-primary-text/90 dark:text-primary-text-dark/90 leading-relaxed font-editorial">
            {t('about.introduction')}
          </p>
        </div>
        
        {/* Bento Grid for Manifesto */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          <BentoCard className="h-full p-8 sm:p-10">
            <div className="font-josefin text-[10px] font-bold text-accent uppercase tracking-widest mb-6 border-b border-primary-text/5 dark:border-primary-text-dark/10 pb-3 flex items-center gap-3">
              <span className="w-1.5 h-1.5 bg-accent rounded-full"></span>
              Focus Area 01
            </div>
            <h3 className="text-2xl font-bold mb-3 text-primary-text dark:text-primary-text-dark font-host tracking-tight">
              {manifesto.focus1.title}
            </h3>
            <p className="text-base text-primary-text/75 dark:text-primary-text-dark/75 leading-relaxed font-host">
              {manifesto.focus1.description}
            </p>
          </BentoCard>

          <BentoCard className="h-full p-8 sm:p-10">
            <div className="font-josefin text-[10px] font-bold text-accent uppercase tracking-widest mb-6 border-b border-primary-text/5 dark:border-primary-text-dark/10 pb-3 flex items-center gap-3">
              <span className="w-1.5 h-1.5 bg-accent rounded-full"></span>
              Focus Area 02
            </div>
            <h3 className="text-2xl font-bold mb-3 text-primary-text dark:text-primary-text-dark font-host tracking-tight">
              {manifesto.focus2.title}
            </h3>
            <p className="text-base text-primary-text/75 dark:text-primary-text-dark/75 leading-relaxed font-host">
              {manifesto.focus2.description}
            </p>
          </BentoCard>

          <BentoCard className="h-full p-8 sm:p-10 md:col-span-1">
            <div className="font-josefin text-[10px] font-bold text-accent uppercase tracking-widest mb-6 border-b border-primary-text/5 dark:border-primary-text-dark/10 pb-3 flex items-center gap-3">
              <span className="w-1.5 h-1.5 bg-accent rounded-full"></span>
              Focus Area 03
            </div>
            <h3 className="text-2xl font-bold mb-3 text-primary-text dark:text-primary-text-dark font-host tracking-tight">
              {manifesto.focus3.title}
            </h3>
            <p className="text-base text-primary-text/75 dark:text-primary-text-dark/75 leading-relaxed font-host">
              {manifesto.focus3.description}
            </p>
          </BentoCard>

          <BentoCard className="h-full p-8 sm:p-10 md:col-span-1 bg-accent/5 dark:bg-accent/5 border-accent/20 dark:border-accent/20">
            <div className="font-josefin text-[10px] font-bold text-accent uppercase tracking-widest mb-6 border-b border-accent/20 pb-3 flex items-center gap-3">
              <span className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse"></span>
              Base of Operations
            </div>
            <h3 className="text-2xl font-bold mb-3 text-primary-text dark:text-primary-text-dark font-host tracking-tight">
              {manifesto.location.title}
            </h3>
            <p className="text-base text-primary-text/90 dark:text-primary-text-dark/90 font-bold leading-relaxed font-host">
              {manifesto.location.description}
            </p>
          </BentoCard>

        </div>
      </div>
    </section>
  );
}
