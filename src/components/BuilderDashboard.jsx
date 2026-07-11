import { Download, LayoutTemplate, Database, PenTool } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import BentoCard from './BentoCard';

export default function BuilderDashboard() {
  const { t } = useLanguage();

  return (
    <section id="resume" style={{ position: 'relative', zIndex: 10 }} className="py-32 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      {/* Section Header */}
      <div className="mb-20 border-t border-border-light dark:border-border-dark pt-16 text-center">
        <h2 className="text-4xl font-bold tracking-tight mb-4">{t('resume.title')}</h2>
        <p className="text-primary-text/60 dark:text-primary-text-dark/60 text-lg max-w-xl mx-auto font-funnel">{t('resume.subtitle')}</p>
      </div>

      {/* 4-Quadrant Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-24">
        {/* Card 1: What I'm building (Double Width) */}
        <BentoCard containerClassName="md:col-span-2" className="p-8 sm:p-10 h-full flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-accent"></span>
              </span>
              <span className="font-martian text-xs font-bold uppercase tracking-widest text-accent">
                {t('resume.activeBuild.label')}
              </span>
            </div>
            <h3 className="text-3xl font-bold mb-4 tracking-tight">
              {t('resume.activeBuild.title')}
            </h3>
            <p className="text-lg text-primary-text/80 dark:text-primary-text-dark/80 leading-relaxed font-funnel">
              {t('resume.activeBuild.desc')}
            </p>
          </div>
        </BentoCard>

        {/* Card 2: What I'm learning (Single Width) */}
        <BentoCard containerClassName="md:col-span-1" className="p-8 sm:p-10 h-full flex flex-col justify-between">
          <div>
            <span className="font-martian text-xs font-bold uppercase tracking-widest text-blue-500 block mb-6">
              {t('resume.activeFocus.label')}
            </span>
            <h3 className="text-2xl font-bold mb-4 tracking-tight">
              {t('resume.activeFocus.title')}
            </h3>
            <p className="text-base text-primary-text/80 dark:text-primary-text-dark/80 leading-relaxed font-funnel">
              {t('resume.activeFocus.desc')}
            </p>
          </div>
        </BentoCard>

        {/* Card 3: What I'm thinking about (Single Width) */}
        <BentoCard containerClassName="md:col-span-1" className="p-8 sm:p-10 h-full flex flex-col justify-between">
          <div>
            <span className="font-martian text-xs font-bold uppercase tracking-widest text-[#08CB00] block mb-6">
              {t('resume.sandbox.label')}
            </span>
            <h3 className="text-2xl font-bold mb-4 tracking-tight">
              {t('resume.sandbox.title')}
            </h3>
            <p className="text-base text-primary-text/80 dark:text-primary-text-dark/80 leading-relaxed font-funnel italic">
              “{t('resume.sandbox.desc')}”
            </p>
          </div>
        </BentoCard>

        {/* Card 4: Long-Term Mission (Double Width) */}
        <BentoCard containerClassName="md:col-span-2" className="p-8 sm:p-10 h-full flex flex-col justify-between bg-gradient-to-br from-glass-light to-transparent dark:from-glass-dark dark:to-transparent">
          <div>
            <span className="font-martian text-xs font-bold uppercase tracking-widest text-accent block mb-6">
              {t('resume.mission.label')}
            </span>
            <h3 className="text-3xl font-bold mb-4 tracking-tight">
              {t('resume.mission.title')}
            </h3>
            <p className="text-xl font-bold text-primary-text/90 dark:text-primary-text-dark/90 leading-relaxed font-funnel tracking-wide">
              {t('resume.mission.desc')}
            </p>
          </div>
        </BentoCard>
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

      {/* Action CTA */}
      <div className="mt-20 text-center">
        <button className="inline-flex items-center justify-center space-x-3 px-8 py-4 bg-accent hover:bg-[#069e00] text-[#1C1C1C] font-bold uppercase tracking-widest rounded-full transition-transform hover:scale-105 shadow-[0_10px_30px_rgba(8,203,0,0.3)]">
          <Download size={20} />
          <span>{t('resume.downloadText')}</span>
        </button>
      </div>
    </section>
  );
}
