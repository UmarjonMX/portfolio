import { Download, Briefcase, GraduationCap, LayoutTemplate, Database, PenTool } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function Resume() {
  const { t } = useLanguage();
  const experiences = t('resume.items') || [];

  return (
    <section id="resume" style={{ position: 'relative', zIndex: 10 }} className="py-32 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      <div className="mb-16 border-t border-border-light dark:border-border-dark pt-16 text-center">
        <h2 className="text-4xl font-bold tracking-tight mb-4">{t('resume.title')}</h2>
        <p className="text-primary-text/60 dark:text-primary-text-dark/60">{t('resume.subtitle')}</p>
      </div>
      
      <div className="relative border-l-2 border-border-light dark:border-border-dark ml-4 md:mx-auto md:w-full md:border-none">
        {/* Central line for desktop */}
        <div className="hidden md:block absolute top-0 bottom-0 left-1/2 w-0.5 bg-border-light dark:bg-border-dark -ml-[1px]"></div>
        
        {experiences.map((exp, i) => (
          <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group mb-12">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-background dark:bg-background-dark border-2 border-accent text-accent shadow-lg shrink-0 absolute -left-6 md:static md:mx-auto z-10 transition-transform hover:scale-110">
              {exp.type === 'work' ? <Briefcase size={20} /> : <GraduationCap size={20} />}
            </div>
            
            <div className="ml-10 md:ml-0 w-[calc(100%-1rem)] md:w-[calc(50%-3rem)] bg-glass-light dark:bg-glass-dark border border-border-light dark:border-border-dark p-8 rounded-[2rem] shadow-sm backdrop-blur-xl hover:border-accent transition-colors">
              <div className="flex flex-col xl:flex-row xl:items-center justify-between mb-4">
                <h3 className="font-bold text-2xl mb-2 xl:mb-0">{exp.title}</h3>
                <span className="font-martian text-xs font-bold text-accent uppercase tracking-widest bg-accent/10 px-3 py-1 rounded-full">{exp.date}</span>
              </div>
              <p className="font-martian text-sm font-bold opacity-70 mb-4 uppercase tracking-wider">{exp.company}</p>
              <p className="text-[15px] text-primary-text/80 dark:text-primary-text-dark/80 leading-relaxed">{exp.desc}</p>
            </div>
          </div>
        ))}
      </div>
      
      {/* Skills Section */}
      <div className="mt-24 max-w-4xl mx-auto">
        <h3 className="text-3xl font-bold mb-10 text-center tracking-tight">{t('resume.skillsTitle')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-glass-light dark:bg-glass-dark border border-border-light dark:border-border-dark p-8 rounded-[2rem] backdrop-blur-md shadow-sm text-center hover:border-accent transition-colors group">
            <LayoutTemplate className="w-10 h-10 mx-auto mb-4 text-accent group-hover:scale-110 transition-transform" />
            <h4 className="font-bold text-lg mb-2">{t('resume.frontend')}</h4>
            <p className="font-martian text-sm text-primary-text/70 dark:text-primary-text-dark/70">{t('resume.frontendTech')}</p>
          </div>
          <div className="bg-glass-light dark:bg-glass-dark border border-border-light dark:border-border-dark p-8 rounded-[2rem] backdrop-blur-md shadow-sm text-center hover:border-accent transition-colors group">
            <Database className="w-10 h-10 mx-auto mb-4 text-accent group-hover:scale-110 transition-transform" />
            <h4 className="font-bold text-lg mb-2">{t('resume.backend')}</h4>
            <p className="font-martian text-sm text-primary-text/70 dark:text-primary-text-dark/70">{t('resume.backendTech')}</p>
          </div>
          <div className="bg-glass-light dark:bg-glass-dark border border-border-light dark:border-border-dark p-8 rounded-[2rem] backdrop-blur-md shadow-sm text-center hover:border-accent transition-colors group">
            <PenTool className="w-10 h-10 mx-auto mb-4 text-accent group-hover:scale-110 transition-transform" />
            <h4 className="font-bold text-lg mb-2">{t('resume.otherTools')}</h4>
            <p className="font-martian text-sm text-primary-text/70 dark:text-primary-text-dark/70">{t('resume.otherTech')}</p>
          </div>
        </div>
      </div>
      
      {/* Infinite Tech Marquee */}
      <div className="mt-32 w-full overflow-hidden py-8 relative rounded-3xl bg-glass-light dark:bg-glass-dark border border-border-light dark:border-border-dark shadow-sm">
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-background dark:from-background-dark to-transparent z-10 pointer-events-none"></div>
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-background dark:from-background-dark to-transparent z-10 pointer-events-none"></div>
        <div className="flex w-max animate-marquee flex-nowrap">
          <div className="flex justify-around flex-nowrap px-4">
            <span className="font-martian text-xl md:text-2xl font-bold opacity-30 whitespace-nowrap">React • Python • Django • Three.js • Framer Motion • C++ • Tailwind • AI • JavaScript • </span>
          </div>
          <div className="flex justify-around flex-nowrap px-4">
            <span className="font-martian text-xl md:text-2xl font-bold opacity-30 whitespace-nowrap">React • Python • Django • Three.js • Framer Motion • C++ • Tailwind • AI • JavaScript • </span>
          </div>
        </div>
      </div>
      
      <div className="mt-20 text-center">
        <button className="inline-flex items-center justify-center space-x-3 px-8 py-4 bg-accent hover:bg-[#069e00] text-white font-bold uppercase tracking-widest rounded-full transition-transform hover:scale-105 shadow-[0_10px_30px_rgba(8,203,0,0.3)]">
          <Download size={20} />
          <span>{t('resume.downloadText')}</span>
        </button>
      </div>
    </section>
  );
}
