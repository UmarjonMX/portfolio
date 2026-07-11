import { useLanguage } from '../context/LanguageContext';
import BentoCard from './BentoCard';

export default function About() {
  const { t } = useLanguage();

  return (
    <section id="about" className="py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto" style={{ position: 'relative', zIndex: 10, isolation: 'isolate' }}>
      <div className="mb-16 max-w-3xl">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6 text-primary-text dark:text-primary-text-dark font-martian opacity-0 animate-fadeInUp delay-100">{t('about.title')}</h2>
        <p className="text-lg md:text-xl text-primary-text/70 dark:text-primary-text-dark/70 leading-relaxed font-funnel opacity-0 animate-fadeInUp delay-200">
          {t('about.introduction')}
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {t('about.principles').map((principle, index) => {
          const delayClass = ['delay-300', 'delay-400', 'delay-500', 'delay-600', 'delay-700', 'delay-800'][index];
          return (
            <BentoCard 
              key={index}
              containerClassName={`opacity-0 animate-fadeInUp ${delayClass}`}
              className="h-full p-8 sm:p-10 hover:bg-white/60 dark:hover:bg-slate-900/60 transition-colors duration-300"
            >
              <h3 className="text-xl font-semibold mb-4 text-primary-text dark:text-primary-text-dark font-martian tracking-tight">
                {principle.title}
              </h3>
              <p className="text-base text-primary-text/70 dark:text-primary-text-dark/70 leading-relaxed font-funnel">
                {principle.description}
              </p>
            </BentoCard>
          );
        })}
      </div>
    </section>
  );
}
