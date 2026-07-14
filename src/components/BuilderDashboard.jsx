import { Download, LayoutTemplate, Database, PenTool } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import BentoCard from './BentoCard';

export default function BuilderDashboard() {
  const { t } = useLanguage();

  return (
    <section id="resume" className="py-32 px-6 sm:px-10 lg:px-16 max-w-6xl mx-auto relative z-10">
      {/* Section Header */}
      <div className="mb-20 border-l-2 border-accent/30 pl-6">
        <div className="mb-4 inline-flex items-center gap-2 px-3 py-1 bg-accent/10 border border-accent/25 rounded-md text-accent text-[10px] font-martian font-bold uppercase tracking-wider">
          Sheet 04 // Workbench
        </div>
        <h2 className="text-4xl font-bold tracking-tight mb-4 text-primary-text dark:text-primary-text-dark font-martian">
          {t('resume.title')}
        </h2>
        <p className="text-primary-text/60 dark:text-primary-text-dark/60 text-lg max-w-xl font-funnel">
          {t('resume.subtitle')}
        </p>
      </div>

      {/* 4-Quadrant Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
        {/* Card 1: What I'm building (Double Width) */}
        <BentoCard containerClassName="md:col-span-2" className="p-8 sm:p-10 h-full flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-accent"></span>
              </span>
              <span className="font-martian text-[10px] font-bold uppercase tracking-widest text-accent">
                {t('resume.activeBuild.label')}
              </span>
            </div>
            <h3 className="text-3xl font-bold mb-4 tracking-tight font-martian text-primary-text dark:text-primary-text-dark">
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
            <span className="font-martian text-[10px] font-bold uppercase tracking-widest text-[#E07A5F] block mb-6">
              {t('resume.activeFocus.label')}
            </span>
            <h3 className="text-2xl font-bold mb-4 tracking-tight font-martian text-primary-text dark:text-primary-text-dark">
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
            <span className="font-martian text-[10px] font-bold uppercase tracking-widest text-accent block mb-6">
              {t('resume.sandbox.label')}
            </span>
            <h3 className="text-2xl font-bold mb-4 tracking-tight font-martian text-primary-text dark:text-primary-text-dark">
              {t('resume.sandbox.title')}
            </h3>
            <p className="text-base text-primary-text/80 dark:text-primary-text-dark/80 leading-relaxed font-funnel italic">
              “{t('resume.sandbox.desc')}”
            </p>
          </div>
        </BentoCard>

        {/* Card 4: Long-Term Mission (Double Width) */}
        <BentoCard containerClassName="md:col-span-2" className="p-8 sm:p-10 h-full flex flex-col justify-between">
          <div>
            <span className="font-martian text-[10px] font-bold uppercase tracking-widest text-accent block mb-6">
              {t('resume.mission.label')}
            </span>
            <h3 className="text-3xl font-bold mb-4 tracking-tight font-martian text-primary-text dark:text-primary-text-dark">
              {t('resume.mission.title')}
            </h3>
            <p className="text-xl font-bold text-primary-text/90 dark:text-primary-text-dark/90 leading-relaxed font-funnel tracking-wide border-l-2 border-accent/30 pl-4 py-1">
              {t('resume.mission.desc')}
            </p>
          </div>
        </BentoCard>
      </div>

      {/* Skills Section */}
      <div className="mt-24 max-w-4xl mx-auto">
        <h3 className="text-3xl font-bold mb-10 text-center tracking-tight font-martian">{t('resume.skillsTitle')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <BentoCard className="p-8 text-center hover:border-accent">
            <LayoutTemplate className="w-10 h-10 mx-auto mb-4 text-accent" />
            <h4 className="font-bold font-martian text-lg mb-2">{t('resume.frontend')}</h4>
            <p className="font-martian text-xs text-primary-text/60 dark:text-primary-text-dark/60 leading-relaxed">{t('resume.frontendTech')}</p>
          </BentoCard>
          
          <BentoCard className="p-8 text-center hover:border-accent">
            <Database className="w-10 h-10 mx-auto mb-4 text-accent" />
            <h4 className="font-bold font-martian text-lg mb-2">{t('resume.backend')}</h4>
            <p className="font-martian text-xs text-primary-text/60 dark:text-primary-text-dark/60 leading-relaxed">{t('resume.backendTech')}</p>
          </BentoCard>

          <BentoCard className="p-8 text-center hover:border-accent">
            <PenTool className="w-10 h-10 mx-auto mb-4 text-accent" />
            <h4 className="font-bold font-martian text-lg mb-2">{t('resume.otherTools')}</h4>
            <p className="font-martian text-xs text-primary-text/60 dark:text-primary-text-dark/60 leading-relaxed">{t('resume.otherTech')}</p>
          </BentoCard>
        </div>
      </div>

      {/* Infinite Tech Marquee (Blueprint Strip Format) */}
      <div className="mt-32 w-full overflow-hidden py-8 relative rounded-xl bg-white dark:bg-card-bg-dark border border-primary-text dark:border-primary-text-dark shadow-hard-light dark:shadow-hard-dark">
        <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background dark:from-background-dark to-transparent z-10 pointer-events-none"></div>
        <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background dark:from-background-dark to-transparent z-10 pointer-events-none"></div>
        <div className="flex w-max animate-marquee flex-nowrap">
          <div className="flex justify-around flex-nowrap px-4">
            <span className="font-martian text-lg md:text-xl font-bold opacity-30 whitespace-nowrap">React • Python • Django • Three.js • Framer Motion • C++ • Tailwind • AI • JavaScript • </span>
          </div>
          <div className="flex justify-around flex-nowrap px-4">
            <span className="font-martian text-lg md:text-xl font-bold opacity-30 whitespace-nowrap">React • Python • Django • Three.js • Framer Motion • C++ • Tailwind • AI • JavaScript • </span>
          </div>
        </div>
      </div>

      {/* Action CTA */}
      <div className="mt-20 text-center">
        <button className="inline-flex items-center justify-center space-x-3 px-8 py-4 bg-accent text-white dark:text-[#1C1C1D] border border-primary-text dark:border-primary-text-dark font-funnel font-bold uppercase tracking-widest rounded-xl shadow-hard-interactive-light dark:shadow-hard-interactive-dark transition-all cursor-pointer">
          <Download size={18} />
          <span>{t('resume.downloadText')}</span>
        </button>
      </div>
    </section>
  );
}
