import { useLanguage } from '../context/LanguageContext';
import BentoCard from './BentoCard';

export default function About() {
  const { t } = useLanguage();

  return (
    <section id="about" className="py-32 px-6 sm:px-10 lg:px-16 max-w-7xl mx-auto relative z-10">
      {/* Editorial Header */}
      <div className="mb-16 max-w-3xl border-l-2 border-accent/30 pl-6">
        <div className="mb-4 inline-flex items-center gap-2 px-3 py-1 bg-accent/10 border border-accent/25 rounded-md text-accent text-[10px] font-martian font-bold uppercase tracking-wider">
          Sheet 02 // Principles
        </div>
        <h2 className="text-4xl font-bold tracking-tight mb-6 text-primary-text dark:text-primary-text-dark font-martian">
          {t('about.title')}
        </h2>
        <p className="text-lg md:text-xl text-primary-text/70 dark:text-primary-text-dark/70 leading-relaxed font-funnel">
          {t('about.introduction')}
        </p>
      </div>
      
      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {t('about.principles').map((principle, index) => {
          return (
            <BentoCard 
              key={index}
              className="h-full p-8 sm:p-10 hover:bg-white/90 dark:hover:bg-card-bg-dark transition-colors duration-300"
            >
              {/* Card Index Marker */}
              <div className="font-martian text-[9px] font-bold text-accent/60 uppercase tracking-widest mb-6 border-b border-primary-text/5 dark:border-primary-text-dark/5 pb-2">
                REF_NO. P-0{index + 1}
              </div>
              <h3 className="text-xl font-bold mb-4 text-primary-text dark:text-primary-text-dark font-martian tracking-tight">
                {principle.title}
              </h3>
              <p className="text-base text-primary-text/75 dark:text-primary-text-dark/75 leading-relaxed font-funnel">
                {principle.description}
              </p>
            </BentoCard>
          );
        })}
      </div>
    </section>
  );
}
