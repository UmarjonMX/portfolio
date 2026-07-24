import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { ArrowRight, Mail } from 'lucide-react';
import SignatureText from './SignatureText';
import SceneManager from './3d/SceneManager';

function Magnetic({ children, scale = 0.25, className = '' }) {
  const ref = useRef(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const onMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top  + rect.height / 2;
    setPos({ x: (e.clientX - cx) * scale, y: (e.clientY - cy) * scale });
  };

  const onLeave = () => setPos({ x: 0, y: 0 });

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{
        transform: `translate3d(${pos.x}px, ${pos.y}px, 0)`,
        transition: pos.x === 0
          ? 'transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)'
          : 'transform 0.08s linear',
      }}
      className={className}
    >
      {children}
    </div>
  );
}

export default function Hero({ isDarkMode }) {
  const { t } = useLanguage();
  const [scrollY, setScrollY] = useState(0);
  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', onScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  const tagline      = t('hero.tagline');
  const headline     = t('hero.headline');
  const supporting1  = t('hero.supporting1');
  const primaryCTA   = t('hero.primaryCTA');
  const secondaryCTA = t('hero.secondaryCTA');

  const vh = typeof window !== 'undefined' ? window.innerHeight : 900;
  const scrollFade  = Math.max(0, 1 - scrollY / (vh * 0.55));
  const scrollShift = scrollY * 0.15;

  return (
    <section className="relative min-h-[100dvh] flex flex-col justify-center overflow-hidden w-full select-none pt-10 lg:pt-0 border-b border-primary-text/5 dark:border-primary-text-dark/5">

      {/* Ultra-Minimal Drafting Grid */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.03] dark:opacity-[0.02] text-primary-text dark:text-primary-text-dark">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
           <defs>
              <pattern id="drafting-grid-hero" width="60" height="60" patternUnits="userSpaceOnUse">
                 <path d="M 60 0 L 0 0 0 60" fill="none" stroke="currentColor" strokeWidth="0.5" strokeOpacity="0.5"/>
              </pattern>
           </defs>
           <rect width="100%" height="100%" fill="url(#drafting-grid-hero)" />
        </svg>
      </div>

      <div
        style={{
          opacity: scrollFade,
          transform: `translateY(-${scrollShift}px)`,
          willChange: 'transform, opacity',
        }}
        className="relative z-10 w-full max-w-[90rem] mx-auto px-6 lg:px-16 flex flex-col lg:flex-row items-center justify-between min-h-[85vh] lg:min-h-[90vh]"
      >
        
        {/* Left Column: Typography */}
        <div className="relative z-20 flex flex-col items-start text-left pointer-events-none w-full lg:w-[45%] mt-20 lg:mt-0">
          <div className="hero-reveal mb-8 inline-flex items-center gap-3 px-4 py-1.5 bg-background/80 dark:bg-card-bg-dark/80 backdrop-blur-md border border-primary-text/10 dark:border-primary-text-dark/20 rounded-full text-accent text-[9px] font-martian font-bold uppercase tracking-[0.25em] shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
            </span>
            SYSTEM ONLINE
          </div>
          
          <h1 className="hero-reveal text-6xl sm:text-[6.5rem] lg:text-[8rem] font-black tracking-tighter leading-[0.85] text-primary-text dark:text-primary-text-dark font-martian uppercase drop-shadow-sm">
            UMAR<br />
            <span className="text-accent">BUILDS</span>
          </h1>
          
          <div className="hero-reveal mt-12 w-full pointer-events-auto">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight leading-tight font-martian mb-6">
              <SignatureText text={headline} />
            </h2>
            <p className="text-[10px] font-martian font-bold tracking-[0.3em] uppercase text-primary-text/40 dark:text-primary-text-dark/40 mb-3">
              {tagline}
            </p>
            <p className="text-base sm:text-lg text-primary-text/75 dark:text-primary-text-dark/75 leading-relaxed font-funnel mb-10 max-w-lg">
              {supporting1}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full max-w-lg">
              <Magnetic scale={0.2} className="flex-1 w-full">
                <a
                  href="#projects"
                  className="btn-sweep inline-flex items-center justify-center gap-3 w-full px-6 py-4 bg-primary-text dark:bg-primary-text-dark text-white dark:text-[#1C1C1D] rounded-xl font-funnel font-bold tracking-widest uppercase shadow-hard-interactive-light dark:shadow-hard-interactive-dark transition-all duration-300 cursor-pointer text-xs"
                >
                  {primaryCTA}
                  <ArrowRight size={14} />
                </a>
              </Magnetic>

              <Magnetic scale={0.2} className="flex-1 w-full">
                <a
                  href="#contact"
                  className="btn-sweep inline-flex items-center justify-center gap-3 w-full px-6 py-4 bg-transparent backdrop-blur-xl text-primary-text dark:text-primary-text-dark border border-primary-text/20 dark:border-primary-text-dark/20 rounded-xl font-funnel font-bold tracking-widest uppercase hover:bg-white/50 dark:hover:bg-[#1E1E20]/90 transition-all duration-300 cursor-pointer text-xs"
                >
                  <Mail size={14} className="text-primary-text/50 dark:text-primary-text-dark/50" />
                  {secondaryCTA}
                </a>
              </Magnetic>
            </div>
          </div>
        </div>

        {/* Right Column: 3D Scene */}
        <div className="absolute inset-0 lg:static lg:flex-1 h-[60vh] lg:h-full z-0 lg:z-10 flex items-center justify-center mix-blend-normal pointer-events-auto opacity-30 lg:opacity-100">
          <div className="w-full h-[100dvh] relative">
            <SceneManager isDarkMode={isDarkMode} />
          </div>
        </div>
      </div>

      <div className="absolute bottom-6 left-6 lg:bottom-12 lg:left-12 pointer-events-none z-20">
        <span
          className="hero-reveal font-martian text-[9px] font-bold tracking-[0.3em] text-primary-text/30 dark:text-primary-text-dark/30 uppercase"
          style={{ animationDelay: '1.1s' }}
        >
          SH–01 // PORTFOLIO_SYSTEM
        </span>
      </div>
    </section>
  );
}
