import { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { ArrowRight, Mail } from 'lucide-react';

export default function Hero() {
  const { t } = useLanguage();
  const [coords, setCoords] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setCoords({ x: Math.round(x), y: Math.round(y) });
  };

  const tagline = t('hero.tagline');
  const headline = t('hero.headline');
  const supporting1 = t('hero.supporting1');
  const supporting2 = t('hero.supporting2');
  const primaryCTA = t('hero.primaryCTA');
  const secondaryCTA = t('hero.secondaryCTA');

  return (
    <section 
      onMouseMove={handleMouseMove}
      className="relative min-h-[100dvh] flex flex-col justify-center overflow-hidden pt-16 z-10 w-full blueprint-grid-light dark:blueprint-grid-dark select-none"
    >
      {/* Dynamic Grid Alignment Outline */}
      <div className="absolute inset-x-6 sm:inset-x-10 lg:inset-x-16 top-24 bottom-10 border-2 border-dashed border-primary-text/10 dark:border-primary-text-dark/10 pointer-events-none z-0"></div>

      {/* Top Ledger Header (Telemetry) */}
      <div className="absolute top-24 left-6 sm:left-10 lg:left-16 right-6 sm:right-10 lg:right-16 flex justify-between items-center border-b border-primary-text/20 dark:border-primary-text-dark/20 pb-4 pointer-events-none z-10 px-4">
        <span className="font-martian text-[10px] font-bold tracking-[0.25em] text-primary-text/50 dark:text-primary-text-dark/50">
          PROJECT // PORTFOLIO_V2.0
        </span>
        <span className="font-martian text-[10px] font-bold tracking-[0.25em] text-accent">
          [ 41.0044° N, 71.6726° E // NAMANGAN ]
        </span>
      </div>

      {/* Asymmetric Split Layout Container */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-10 sm:px-16 lg:px-24 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center h-full my-auto">
        
        {/* Left Side: Dense Typography & Coordinate stamp (7 columns) */}
        <div className="lg:col-span-7 flex flex-col items-start justify-center">
          
          {/* Active sheet indicator */}
          <div className="mb-8 inline-flex items-center gap-3 px-4 py-1.5 bg-accent/15 border-2 border-accent rounded-lg text-accent text-xs font-martian font-bold uppercase tracking-widest shadow-[2px_2px_0px_rgba(224,122,95,0.3)]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
            </span>
            SHEET 01 // CORE_DRAFT
          </div>

          {/* Tagline */}
          <p className="text-xs md:text-sm font-martian font-black tracking-[0.3em] uppercase text-primary-text/40 dark:text-primary-text-dark/40 mb-4">
            {tagline}
          </p>

          {/* Title block with double border and solid stamp feel */}
          <div className="border-4 border-primary-text dark:border-primary-text-dark p-6 sm:p-8 bg-white dark:bg-card-bg-dark shadow-hard-light dark:shadow-hard-dark mb-8 w-full">
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tighter leading-none text-primary-text dark:text-primary-text-dark font-martian uppercase mb-2">
              Umar <span className="text-accent">Builds</span>
            </h1>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight leading-tight text-primary-text/80 dark:text-primary-text-dark/80 font-martian">
              {headline}
            </h2>
          </div>

          {/* Width-capped technical details */}
          <div className="space-y-4 mb-10 max-w-xl border-l-4 border-accent pl-6 py-2 bg-accent/5">
            <p className="text-base sm:text-lg text-primary-text/75 dark:text-primary-text-dark/75 leading-relaxed font-funnel">
              {supporting1}
            </p>
            <p className="text-sm sm:text-base text-primary-text/60 dark:text-primary-text-dark/60 leading-relaxed font-funnel">
              {supporting2}
            </p>
          </div>
          
          {/* Woodblock CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 w-full max-w-md">
            <a 
              href="#projects"
              className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-accent text-white dark:text-[#1C1C1D] border-2 border-primary-text dark:border-primary-text-dark rounded-xl font-funnel font-bold tracking-widest uppercase shadow-hard-interactive-light dark:shadow-hard-interactive-dark transition-all cursor-pointer flex-1"
            >
              {primaryCTA}
              <ArrowRight size={18} />
            </a>
            <a 
              href="#contact"
              className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-white dark:bg-card-bg-dark text-primary-text dark:text-primary-text-dark border-2 border-primary-text dark:border-primary-text-dark rounded-xl font-funnel font-bold tracking-widest uppercase shadow-hard-interactive-light dark:shadow-hard-interactive-dark transition-all cursor-pointer flex-1"
            >
              <Mail size={18} />
              {secondaryCTA}
            </a>
          </div>
        </div>

        {/* Right Side: Spacer for 3D layout integration (5 columns) */}
        <div className="lg:col-span-5 h-[300px] lg:h-full w-full pointer-events-none"></div>

      </div>

      {/* Dynamic Cursor Tracker & Technical Specs footer bar */}
      <div className="absolute bottom-10 left-6 sm:left-10 lg:left-16 right-6 sm:right-10 lg:right-16 flex justify-between items-center pointer-events-none text-primary-text/40 dark:text-primary-text-dark/40 font-martian text-[9px] px-4">
        <span>SCALE: 1:1</span>
        <span className="bg-primary-text/5 dark:bg-primary-text-dark/5 px-2 py-0.5 rounded border border-primary-text/10 dark:border-primary-text-dark/10">
          SYS_LOC_X: {coords.x}px // SYS_LOC_Y: {coords.y}px
        </span>
        <span>INDEX REF: SH-01_LEDGER</span>
      </div>
    </section>
  );
}
