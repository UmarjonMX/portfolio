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
    <section className="relative min-h-[100dvh] flex flex-col justify-center overflow-hidden z-10 w-full select-none pt-10 border-b border-primary-text/10 dark:border-primary-text-dark/10">

      {/* Editorial Background: Technical Drafting Grid */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-20 dark:opacity-10 text-primary-text dark:text-primary-text-dark">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
           <defs>
              <pattern id="drafting-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                 <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" strokeOpacity="0.5"/>
              </pattern>
              <pattern id="drafting-grid-large" width="200" height="200" patternUnits="userSpaceOnUse">
                 <rect width="200" height="200" fill="url(#drafting-grid)" />
                 <path d="M 200 0 L 0 0 0 200" fill="none" stroke="currentColor" strokeWidth="1" strokeOpacity="0.8"/>
              </pattern>
           </defs>
           <rect width="100%" height="100%" fill="url(#drafting-grid-large)" />
           {/* Converging lines */}
           <line x1="0" y1="100%" x2="50%" y2="0" stroke="currentColor" strokeWidth="0.5" strokeOpacity="0.3" strokeDasharray="4 4" />
           <line x1="100%" y1="100%" x2="50%" y2="0" stroke="currentColor" strokeWidth="0.5" strokeOpacity="0.3" strokeDasharray="4 4" />
        </svg>
      </div>

      <div
        style={{
          opacity: scrollFade,
          transform: `translateY(-${scrollShift}px)`,
          willChange: 'transform, opacity',
        }}
        className="relative z-10 w-full max-w-[90rem] mx-auto px-6 flex flex-col items-center justify-center min-h-[85vh]"
      >

        {/* 3D Scene Embedded behind text */}
        <div className="absolute inset-0 z-0 flex items-center justify-center mix-blend-normal pointer-events-auto">
          <div className="w-full max-w-5xl h-[70vh] relative opacity-90 dark:opacity-100">
            <SceneManager isDarkMode={isDarkMode} />
          </div>
        </div>

        {/* Text Composition over the Scene */}
        <div className="relative z-20 flex flex-col items-center text-center pointer-events-none w-full">
          <div className="hero-reveal mb-8 inline-flex items-center gap-3 px-4 py-1.5 bg-background/80 dark:bg-card-bg-dark/80 backdrop-blur-md border border-primary-text/10 dark:border-primary-text-dark/20 rounded-full text-accent text-[10px] font-martian font-bold uppercase tracking-[0.25em] shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
            </span>
            ONLINE // ACTIVE
          </div>
          
          <h1 className="hero-reveal text-6xl sm:text-[7rem] lg:text-[10rem] font-black tracking-tighter leading-[0.85] text-primary-text dark:text-primary-text-dark font-martian uppercase drop-shadow-2xl">
            UMAR
          </h1>
          <h1 className="hero-reveal text-6xl sm:text-[7rem] lg:text-[10rem] font-black tracking-tighter leading-[0.85] text-accent font-martian uppercase drop-shadow-2xl mt-2">
            BUILDS
          </h1>
          
          <div className="hero-reveal mt-16 bg-white/70 dark:bg-card-bg-dark/60 backdrop-blur-xl px-8 sm:px-12 py-8 border border-primary-text/10 dark:border-primary-text-dark/20 rounded-[2rem] max-w-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] pointer-events-auto">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight leading-tight font-martian mb-6">
              <SignatureText text={headline} />
            </h2>
            <p className="text-[10px] font-martian font-bold tracking-[0.3em] uppercase text-primary-text/40 dark:text-primary-text-dark/40 mb-3">
              {tagline}
            </p>
            <p className="text-base sm:text-lg text-primary-text/80 dark:text-primary-text-dark/80 leading-relaxed font-funnel">
              {supporting1}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mt-10 w-full justify-center">
              <Magnetic scale={0.25} className="flex-1 w-full max-w-[240px]">
                <a
                  href="#projects"
                  className="btn-sweep inline-flex items-center justify-center gap-3 w-full px-8 py-4 bg-white dark:bg-accent hover:bg-white/90 dark:hover:bg-accent/90 text-primary-text dark:text-[#1C1C1D] rounded-2xl font-funnel font-bold tracking-wider uppercase shadow-[0_8px_30px_-8px_rgba(224,122,95,0.2)] dark:shadow-[0_12px_30px_-8px_rgba(224,122,95,0.35)] hover:shadow-[0_12px_40px_-8px_rgba(224,122,95,0.3)] dark:hover:shadow-[0_16px_40px_-8px_rgba(224,122,95,0.45)] transition-all duration-300 cursor-pointer border border-primary-text/5 dark:border-accent/20"
                >
                  {primaryCTA}
                  <ArrowRight size={16} />
                </a>
              </Magnetic>

              <Magnetic scale={0.25} className="flex-1 w-full max-w-[240px]">
                <a
                  href="#contact"
                  className="btn-sweep inline-flex items-center justify-center gap-3 w-full px-8 py-4 bg-transparent backdrop-blur-xl text-primary-text dark:text-primary-text-dark border border-primary-text/10 dark:border-primary-text-dark/20 rounded-2xl font-funnel font-bold tracking-wider uppercase hover:bg-white/50 dark:hover:bg-[#1E1E20]/90 shadow-sm transition-all duration-300 cursor-pointer"
                >
                  <Mail size={16} className="text-primary-text/50 dark:text-primary-text-dark/50" />
                  {secondaryCTA}
                </a>
              </Magnetic>
            </div>
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
