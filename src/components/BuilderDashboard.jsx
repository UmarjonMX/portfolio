import { useState } from 'react';
import toast from 'react-hot-toast';
import { useLanguage } from '../context/LanguageContext';
import BentoCard from './BentoCard';
import SectionHeader from './SectionHeader';
import { LayoutTemplate, Database, PenTool, Download, Loader2 } from 'lucide-react';

export default function BuilderDashboard() {
  const { t } = useLanguage();
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    if (downloading) return;
    setDownloading(true);
    try {
      const res = await fetch('/resume.pdf', { method: 'HEAD' });
      await new Promise(r => setTimeout(r, 700));
      if (res.ok) {
        const link = document.createElement('a');
        link.href = '/resume.pdf';
        link.download = 'Umarjon_MX_Resume.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success('Resume downloaded successfully.');
      } else {
        toast.error('Resume document is currently unavailable.');
      }
    } catch {
      toast.error('Resume document is currently unavailable.');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <section id="resume" className="relative py-32 px-6 sm:px-10 lg:px-16 max-w-[90rem] mx-auto z-10 border-b border-primary-text/10 dark:border-primary-text-dark/10">
      
      {/* Editorial Background: Logic / PCB Lines */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-20 dark:opacity-10 text-primary-text dark:text-primary-text-dark flex items-center justify-center overflow-hidden">
        <svg className="w-full h-full opacity-40" xmlns="http://www.w3.org/2000/svg">
           <g stroke="currentColor" strokeWidth="0.5" fill="none" strokeOpacity="0.8">
              <path d="M 0 100 L 150 100 L 200 150 L 1000 150" />
              <path d="M 0 300 L 300 300 L 350 250 L 1000 250" />
              <path d="M 0 500 L 400 500 L 450 550 L 1000 550" />
              <circle cx="150" cy="100" r="3" fill="currentColor" />
              <circle cx="300" cy="300" r="3" fill="currentColor" />
              <circle cx="400" cy="500" r="3" fill="currentColor" />
           </g>
        </svg>
      </div>

      <SectionHeader title={t('resume.title')} number="04" />
      
      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Intro text */}
        <div className="mb-16 bg-white/60 dark:bg-card-bg-dark/60 backdrop-blur-md p-8 sm:p-12 border border-primary-text/10 dark:border-primary-text-dark/10 rounded-[2rem] shadow-sm text-center max-w-3xl mx-auto">
          <p className="text-xl md:text-2xl text-primary-text/90 dark:text-primary-text-dark/90 leading-relaxed font-editorial">
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
              <span className="font-josefin text-xs font-bold uppercase tracking-widest text-accent">
                {t('resume.activeBuild.label')}
              </span>
            </div>
            <h3 className="text-3xl font-bold mb-4 tracking-tight font-host text-primary-text dark:text-primary-text-dark">
              {t('resume.activeBuild.title')}
            </h3>
            <p className="text-lg text-primary-text/80 dark:text-primary-text-dark/80 leading-relaxed font-host">
              {t('resume.activeBuild.desc')}
            </p>
          </div>
        </BentoCard>

        {/* Card 2: What I'm learning (Single Width) */}
        <BentoCard containerClassName="md:col-span-1" className="p-8 sm:p-10 h-full flex flex-col justify-between">
          <div>
            <span className="font-josefin text-xs font-bold uppercase tracking-widest text-[#E07A5F] block mb-6">
              {t('resume.activeFocus.label')}
            </span>
            <h3 className="text-2xl font-bold mb-4 tracking-tight font-host text-primary-text dark:text-primary-text-dark">
              {t('resume.activeFocus.title')}
            </h3>
            <p className="text-base text-primary-text/80 dark:text-primary-text-dark/80 leading-relaxed font-host">
              {t('resume.activeFocus.desc')}
            </p>
          </div>
        </BentoCard>

        {/* Card 3: What I'm thinking about (Single Width) */}
        <BentoCard containerClassName="md:col-span-1" className="p-8 sm:p-10 h-full flex flex-col justify-between">
          <div>
            <span className="font-josefin text-xs font-bold uppercase tracking-widest text-accent block mb-6">
              {t('resume.sandbox.label')}
            </span>
            <h3 className="text-2xl font-bold mb-4 tracking-tight font-host text-primary-text dark:text-primary-text-dark">
              {t('resume.sandbox.title')}
            </h3>
            <p className="text-base text-primary-text/80 dark:text-primary-text-dark/80 leading-relaxed font-editorial italic">
              “{t('resume.sandbox.desc')}”
            </p>
          </div>
        </BentoCard>

        <BentoCard containerClassName="md:col-span-2" className="p-8 sm:p-10 h-full flex flex-col justify-between bg-accent/5 dark:bg-accent/5 border-accent/20 dark:border-accent/20">
          <div>
            <span className="font-josefin text-xs font-bold uppercase tracking-widest text-accent block mb-6">
              {t('resume.mission.label')}
            </span>
            <h3 className="text-3xl font-bold mb-4 tracking-tight font-host text-primary-text dark:text-primary-text-dark">
              {t('resume.mission.title')}
            </h3>
            <p className="text-xl font-bold text-primary-text/90 dark:text-primary-text-dark/90 leading-relaxed font-host tracking-wide border-l-2 border-accent/30 pl-4 py-1">
              {t('resume.mission.desc')}
            </p>
          </div>
        </BentoCard>
      </div>

      {/* Skills Section */}
      <div className="mt-24 max-w-4xl mx-auto relative z-10">
        <h3 className="text-2xl font-bold mb-10 text-center tracking-tight font-josefin uppercase">{t('resume.skillsTitle')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <BentoCard className="p-8 text-center hover:border-accent">
            <LayoutTemplate className="w-8 h-8 mx-auto mb-4 text-accent" />
            <h4 className="font-bold font-josefin text-lg mb-2">{t('resume.frontend')}</h4>
            <p className="font-host text-xs tracking-wider text-primary-text/60 dark:text-primary-text-dark/60 leading-relaxed">{t('resume.frontendTech')}</p>
          </BentoCard>
          
          <BentoCard className="p-8 text-center hover:border-accent">
            <Database className="w-8 h-8 mx-auto mb-4 text-accent" />
            <h4 className="font-bold font-josefin text-lg mb-2">{t('resume.backend')}</h4>
            <p className="font-host text-xs tracking-wider text-primary-text/60 dark:text-primary-text-dark/60 leading-relaxed">{t('resume.backendTech')}</p>
          </BentoCard>

          <BentoCard className="p-8 text-center hover:border-accent">
            <PenTool className="w-8 h-8 mx-auto mb-4 text-accent" />
            <h4 className="font-bold font-josefin text-lg mb-2">{t('resume.otherTools')}</h4>
            <p className="font-host text-xs tracking-wider text-primary-text/60 dark:text-primary-text-dark/60 leading-relaxed">{t('resume.otherTech')}</p>
          </BentoCard>
        </div>
      </div>

      {/* Infinite Tech Marquee (Blueprint Strip Format) */}
      <div className="mt-32 w-full overflow-hidden py-8 relative rounded-xl bg-white dark:bg-card-bg-dark border border-primary-text dark:border-primary-text-dark shadow-hard-light dark:shadow-hard-dark">
        <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background dark:from-background-dark to-transparent z-10 pointer-events-none"></div>
        <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background dark:from-background-dark to-transparent z-10 pointer-events-none"></div>
        <div className="flex w-max animate-marquee flex-nowrap">
          <div className="flex justify-around flex-nowrap px-4">
            <span className="font-josefin text-lg md:text-xl font-bold opacity-40 whitespace-nowrap tracking-widest uppercase">React • Python • Django • Three.js • Framer Motion • C++ • Tailwind • AI • JavaScript • </span>
          </div>
          <div className="flex justify-around flex-nowrap px-4">
            <span className="font-josefin text-lg md:text-xl font-bold opacity-40 whitespace-nowrap tracking-widest uppercase">React • Python • Django • Three.js • Framer Motion • C++ • Tailwind • AI • JavaScript • </span>
          </div>
        </div>
      </div>

      {/* Action CTA */}
      <div className="mt-20 text-center relative z-10">
        <button 
          onClick={handleDownload}
          disabled={downloading}
          aria-label="Download resume"
          className={`inline-flex items-center justify-center space-x-3 px-8 py-4 bg-accent text-white dark:text-[#1C1C1D] border border-primary-text dark:border-primary-text-dark font-host font-bold uppercase tracking-widest rounded-xl shadow-[0_8px_30px_-8px_rgba(224,122,95,0.4)] transition-all cursor-pointer hover:-translate-y-1 active:scale-[0.98] ${downloading ? 'opacity-75 cursor-wait' : ''}`}
        >
          {downloading ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} />}
          <span>{downloading ? 'Preparing Document...' : t('resume.downloadText')}</span>
        </button>
      </div>
      
      </div>
    </section>
  );
}
