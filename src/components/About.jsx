import { useLanguage } from '../context/LanguageContext';
import BentoCard from './BentoCard';
import { motion, useMotionValue, useTransform } from 'framer-motion';

export default function About() {
  const { t } = useLanguage();

  // 3D Parallax Tilt Logic
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-150, 150], [15, -15]);
  const rotateY = useTransform(x, [-150, 150], [-15, 15]);

  function handleMouseMove(event) {
    const rect = event.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set(event.clientX - centerX);
    y.set(event.clientY - centerY);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <section id="about" className="py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto" style={{ position: 'relative', zIndex: 10, isolation: 'isolate' }}>
      <div className="mb-16">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 text-primary-text dark:text-primary-text-dark font-martian opacity-0 animate-fadeInUp delay-100">{t('about.title')}</h2>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* iOS Liquid Glass Portrait Card (3D Tilt) */}
        <motion.div
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
          className="col-span-1 lg:col-span-1 flex flex-col items-center justify-center relative group cursor-crosshair h-full mx-auto w-full max-w-sm lg:max-w-none justify-self-center opacity-0 animate-fadeInUp delay-300"
        >
          <BentoCard 
            containerClassName="w-full h-full relative" 
            className="w-full h-full p-8 flex flex-col items-center justify-center overflow-hidden bg-glass-light dark:bg-glass-dark backdrop-blur-[24px] border border-white/20 dark:border-white/10 group-hover:shadow-[0_0_40px_rgba(8,203,0,0.25)] transition-shadow duration-500 rounded-[2.5rem] md:rounded-[3rem]"
          >
            {/* Soft Green Ambient Backlight inside the card */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#08CB00]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>

            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              style={{ transform: "translateZ(50px)" }} 
              className="relative w-full max-w-[200px] md:max-w-[240px] xl:max-w-[280px] aspect-square mb-8 mt-2 drop-shadow-[0_0_20px_rgba(8,203,0,0.4)] mx-auto"
            >
              {/* Rotating outer ring for depth */}
              <div className="absolute inset-0 rounded-full border border-[#08CB00]/20 animate-[spin_8s_linear_infinite] border-t-[#08CB00] border-b-[#08CB00]"></div>
              
              {/* Strict circular mask container to hide checkered edges */}
              <div 
                className="absolute inset-[3px] rounded-full overflow-hidden bg-background dark:bg-background-dark shadow-inner"
                style={{ clipPath: 'circle(50% at 50% 50%)' }}
              >
                <motion.img 
                  src="/images/Umar.jpeg" 
                  alt="Muhammad Umar"
                  loading="lazy"
                  className="w-full max-w-lg h-auto aspect-square object-cover scale-110 transition-all duration-300" 
                  whileHover={{ scale: 1.15 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                />
              </div>
            </motion.div>

            <div style={{ transform: "translateZ(30px)" }} className="text-center relative z-10 mt-auto">
              <h3 className="font-martian text-xl xl:text-2xl font-bold text-primary-text dark:text-primary-text-dark tracking-tight mb-2">
                Muhammad Umar
              </h3>
              <p className="font-funnel text-[11px] xl:text-xs text-[#08CB00] font-bold tracking-[0.2em] uppercase">
                Full-Stack Developer
              </p>
            </div>
          </BentoCard>
        </motion.div>

        {/* Bio Text */}
        <BentoCard containerClassName="col-span-1 lg:col-span-2 opacity-0 animate-fadeInUp delay-500" className="h-full p-8 sm:p-10">
          <h3 className="text-2xl font-semibold mb-6 text-primary-text dark:text-primary-text-dark font-martian">{t('about.bioTitle')}</h3>
          <p className="text-primary-text/80 dark:text-primary-text-dark/80 leading-relaxed text-lg mb-6 font-funnel">
            {t('about.bio1')}
          </p>
          <p className="text-primary-text/80 dark:text-primary-text-dark/80 leading-relaxed text-lg font-funnel">
            {t('about.bio2')}
          </p>
        </BentoCard>
        
        {/* Hobbies / Interests */}
        <BentoCard containerClassName="col-span-1 lg:col-span-1 opacity-0 animate-fadeInUp delay-700" className="h-full p-8 sm:p-10">
          <h3 className="text-2xl font-semibold mb-8 text-primary-text dark:text-primary-text-dark font-martian">{t('about.hobbiesTitle')}</h3>
          <ul className="space-y-5 text-primary-text/80 dark:text-primary-text-dark/80 font-medium font-funnel text-base">
            <li className="flex items-center"><span className="w-2 h-2 rounded-full bg-[#08CB00] mr-4 shadow-[0_0_8px_rgba(8,203,0,0.6)]"></span>{t('about.hobby1')}</li>
            <li className="flex flex-col">
              <div className="flex items-center"><span className="w-2 h-2 rounded-full bg-[#08CB00] mr-4 shadow-[0_0_8px_rgba(8,203,0,0.6)]"></span>{t('about.hobby2')}</div>
              <span className="text-xs ml-6 mt-1 opacity-50 tracking-wide font-martian uppercase">{t('about.hobby2Hint')}</span>
            </li>
            <li className="flex items-center"><span className="w-2 h-2 rounded-full bg-[#08CB00] mr-4 shadow-[0_0_8px_rgba(8,203,0,0.6)]"></span>{t('about.hobby3')}</li>
            <li className="flex items-center"><span className="w-2 h-2 rounded-full bg-[#08CB00] mr-4 shadow-[0_0_8px_rgba(8,203,0,0.6)]"></span>{t('about.hobby4')}</li>
            <li className="flex items-center"><span className="w-2 h-2 rounded-full bg-[#08CB00] mr-4 shadow-[0_0_8px_rgba(8,203,0,0.6)]"></span>{t('about.hobby5')}</li>
            <li className="flex items-center"><span className="w-2 h-2 rounded-full bg-[#08CB00] mr-4 shadow-[0_0_8px_rgba(8,203,0,0.6)]"></span>{t('about.hobby6')}</li>
            <li className="flex items-center"><span className="w-2 h-2 rounded-full bg-[#08CB00] mr-4 shadow-[0_0_8px_rgba(8,203,0,0.6)]"></span>{t('about.hobby7')}</li>
          </ul>
        </BentoCard>

      </div>
    </section>
  );
}
