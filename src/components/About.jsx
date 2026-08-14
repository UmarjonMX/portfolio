import { useLanguage } from '../context/LanguageContext';
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

      {/* Editorial Split Layout */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 mt-16 lg:mt-24 items-start">
        
        {/* Left: Sticky Portrait */}
        <div className="lg:col-span-5 lg:sticky lg:top-32 w-full max-w-md mx-auto lg:max-w-full">
          <div className="relative w-full aspect-[4/5] sm:aspect-square lg:aspect-[3/4] rounded-2xl overflow-hidden group border border-primary-text/10 dark:border-primary-text-dark/10 shadow-sm">
            {/* The Image */}
            <img 
              src="/images/Umar.jpeg" 
              alt="Umar - Portrait" 
              className="absolute inset-0 w-full h-full object-cover object-center grayscale hover:grayscale-0 transition-all duration-700 ease-in-out transform group-hover:scale-105"
            />
            {/* Glass Vignette overlay for text integration / premium feel */}
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent dark:from-background-dark/80 opacity-60"></div>
          </div>
          
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between opacity-80 gap-4">
            <div className="font-josefin text-xs tracking-widest uppercase text-primary-text dark:text-primary-text-dark font-bold">
              PORTRAIT_01 // SYSTEM_ARCHITECT
            </div>
            <div className="h-[1px] flex-1 bg-primary-text/10 dark:bg-primary-text-dark/10 hidden sm:block mx-4"></div>
            <div className="font-host text-xs text-primary-text/60 dark:text-primary-text-dark/60">
              EST. 2026
            </div>
          </div>
        </div>
        
        {/* Right: Scrolling Narrative Timeline */}
        <div className="lg:col-span-7 flex flex-col gap-16 lg:gap-24 lg:pt-8">
          
          {/* Introduction Block */}
          <div className="prose prose-lg dark:prose-invert">
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-editorial leading-snug text-primary-text dark:text-primary-text-dark mb-8">
              {t('about.introduction')}
            </h3>
            <div className="w-12 h-1 bg-accent/50 rounded-full mb-8"></div>
          </div>

          {/* Timeline / Focus Areas */}
          <div className="flex flex-col gap-16 relative">
            {/* Minimal vertical line to anchor the storytelling */}
            <div className="absolute left-[11px] top-2 bottom-2 w-[2px] bg-gradient-to-b from-accent/30 via-primary-text/10 to-transparent dark:via-primary-text-dark/10 hidden sm:block"></div>

            {/* Focus 1 */}
            <div className="relative sm:pl-12 group">
              <div className="absolute left-0 top-1.5 w-6 h-6 rounded-full border-2 border-background dark:border-background-dark bg-accent shadow-[0_0_15px_rgba(224,122,95,0.4)] hidden sm:block transition-transform duration-300 group-hover:scale-125"></div>
              <div className="font-josefin text-xs font-bold text-accent uppercase tracking-widest mb-4">
                01. Core Principle
              </div>
              <h4 className="text-xl sm:text-2xl font-bold mb-4 text-primary-text dark:text-primary-text-dark font-host tracking-tight">
                {manifesto.focus1.title}
              </h4>
              <p className="text-base sm:text-lg text-primary-text/70 dark:text-primary-text-dark/70 leading-relaxed font-host max-w-2xl">
                {manifesto.focus1.description}
              </p>
            </div>

            {/* Focus 2 */}
            <div className="relative sm:pl-12 group">
              <div className="absolute left-0 top-1.5 w-6 h-6 rounded-full border-2 border-background dark:border-background-dark bg-accent/20 hidden sm:block transition-colors duration-300 group-hover:bg-accent group-hover:shadow-[0_0_15px_rgba(224,122,95,0.4)]"></div>
              <div className="font-josefin text-xs font-bold text-primary-text/40 dark:text-primary-text-dark/40 uppercase tracking-widest mb-4 group-hover:text-accent transition-colors duration-300">
                02. Engineering
              </div>
              <h4 className="text-xl sm:text-2xl font-bold mb-4 text-primary-text dark:text-primary-text-dark font-host tracking-tight">
                {manifesto.focus2.title}
              </h4>
              <p className="text-base sm:text-lg text-primary-text/70 dark:text-primary-text-dark/70 leading-relaxed font-host max-w-2xl">
                {manifesto.focus2.description}
              </p>
            </div>

            {/* Focus 3 */}
            <div className="relative sm:pl-12 group">
              <div className="absolute left-0 top-1.5 w-6 h-6 rounded-full border-2 border-background dark:border-background-dark bg-accent/20 hidden sm:block transition-colors duration-300 group-hover:bg-accent group-hover:shadow-[0_0_15px_rgba(224,122,95,0.4)]"></div>
              <div className="font-josefin text-xs font-bold text-primary-text/40 dark:text-primary-text-dark/40 uppercase tracking-widest mb-4 group-hover:text-accent transition-colors duration-300">
                03. User Experience
              </div>
              <h4 className="text-xl sm:text-2xl font-bold mb-4 text-primary-text dark:text-primary-text-dark font-host tracking-tight">
                {manifesto.focus3.title}
              </h4>
              <p className="text-base sm:text-lg text-primary-text/70 dark:text-primary-text-dark/70 leading-relaxed font-host max-w-2xl">
                {manifesto.focus3.description}
              </p>
            </div>

          </div>
        </div>
        
      </div>
    </section>
  );
}
