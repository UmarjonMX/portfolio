import { useState } from 'react';
import { Download, GitCommit, LayoutTemplate, Database, PenTool, Flame } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function ShipLog() {
  const { t } = useLanguage();
  const [activeFilter, setActiveFilter] = useState('all');
  const items = t('resume.items') || [];

  const filteredItems = items.filter(item => {
    if (activeFilter === 'all') return true;
    return item.type === activeFilter;
  });

  return (
    <section id="resume" style={{ position: 'relative', zIndex: 10 }} className="py-32 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      {/* Section Header */}
      <div className="mb-20 border-t border-border-light dark:border-border-dark pt-16 text-center">
        <h2 className="text-4xl font-bold tracking-tight mb-4">{t('resume.title')}</h2>
        <p className="text-primary-text/60 dark:text-primary-text-dark/60 text-lg max-w-xl mx-auto">{t('resume.subtitle')}</p>
      </div>

      {/* Interactive Filters */}
      <div className="flex justify-center gap-3 mb-16">
        {['all', 'build', 'learn'].map((category) => (
          <button
            key={category}
            onClick={() => setActiveFilter(category)}
            className={`px-6 py-2.5 rounded-full font-funnel font-bold tracking-widest text-xs uppercase border transition-all duration-300 ${
              activeFilter === category
                ? 'bg-accent border-accent text-background dark:text-background-dark shadow-[0_0_15px_rgba(8,203,0,0.3)] scale-105'
                : 'bg-glass-light dark:bg-glass-dark border-border-light dark:border-border-dark text-primary-text/70 dark:text-primary-text-dark/70 hover:border-accent hover:text-accent'
            }`}
          >
            {category === 'all' && 'All activity'}
            {category === 'build' && 'shipped builds'}
            {category === 'learn' && 'learning log'}
          </button>
        ))}
      </div>

      {/* Changelog Timeline */}
      <div className="relative border-l-2 border-border-light dark:border-border-dark ml-4 md:ml-6 mb-24">
        {filteredItems.map((item, i) => (
          <div key={i} className="relative pl-10 mb-12 group transition-all duration-300 last:mb-0">
            {/* Timeline Dot Indicator */}
            <div className={`absolute -left-[11px] top-1.5 flex items-center justify-center w-5 h-5 rounded-full border-2 bg-background dark:bg-background-dark transition-all duration-300 group-hover:scale-125 ${
              item.type === 'build' 
                ? 'border-accent text-accent shadow-[0_0_8px_rgba(8,203,0,0.4)]' 
                : 'border-blue-500 text-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.4)]'
            }`}>
              <div className={`w-1.5 h-1.5 rounded-full ${item.type === 'build' ? 'bg-accent' : 'bg-blue-500'}`} />
            </div>

            {/* Content Container */}
            <div className="bg-glass-light dark:bg-glass-dark border border-border-light dark:border-border-dark p-8 rounded-[2rem] shadow-sm backdrop-blur-xl hover:border-accent dark:hover:border-accent transition-colors duration-300">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
                <div className="flex items-center gap-3">
                  <h3 className="font-bold text-2xl tracking-tight">{item.title}</h3>
                  <span className={`font-martian text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full ${
                    item.type === 'build' 
                      ? 'bg-accent/10 text-accent border border-accent/20' 
                      : 'bg-blue-500/10 text-blue-500 border border-blue-500/20'
                  }`}>
                    #{item.type}
                  </span>
                </div>
                <span className="font-martian text-xs font-bold text-accent uppercase tracking-widest bg-accent/10 px-3 py-1 rounded-full shrink-0 w-fit">
                  {item.date}
                </span>
              </div>

              <p className="font-martian text-sm font-bold opacity-60 mb-4 uppercase tracking-wider">{item.company}</p>
              <p className="text-[15px] text-primary-text/80 dark:text-primary-text-dark/80 leading-relaxed font-funnel">{item.desc}</p>
            </div>
          </div>
        ))}

        {filteredItems.length === 0 && (
          <div className="text-center py-12 text-primary-text/50 dark:text-primary-text-dark/50 font-funnel">
            No entries found in this category.
          </div>
        )}
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
