import { useState, useRef, useEffect, lazy, Suspense } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { ArrowRight, Mail } from 'lucide-react';
const SceneManager = lazy(() => import('./3d/SceneManager'));

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
  const supporting1  = t('hero.supporting1');
  const primaryCTA   = t('hero.primaryCTA');
  const secondaryCTA = t('hero.secondaryCTA');
  const scrollShift = scrollY * 0.15;

  return (
    <section className="relative min-h-[100dvh] flex flex-col justify-center items-center overflow-hidden w-full select-none border-b border-primary-text/5 dark:border-primary-text-dark/5">

      {/* 3D Scene - Unified Background/Centerpiece */}
      <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-auto mix-blend-normal opacity-90 dark:opacity-100">
        <Suspense fallback={null}>
          <SceneManager isDarkMode={isDarkMode} />
        </Suspense>
      </div>

      {/* Ultra-Minimal Drafting Grid */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.02] dark:opacity-[0.015] text-primary-text dark:text-primary-text-dark">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
           <defs>
              <pattern id="drafting-grid-hero" width="60" height="60" patternUnits="userSpaceOnUse">
                 <path d="M 60 0 L 0 0 0 60" fill="none" stroke="currentColor" strokeWidth="0.5" strokeOpacity="0.5"/>
              </pattern>
           </defs>
           <rect width="100%" height="100%" fill="url(#drafting-grid-hero)" />
        </svg>
      </div>

      {/* Cinematic Vignette & Grain */}
      <div className="absolute inset-0 z-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.2)_100%)] dark:bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.6)_100%)] mix-blend-multiply" />
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.04] dark:opacity-[0.08] mix-blend-overlay" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }} />

      <div
        style={{
          transform: `translateY(-${scrollShift}px)`,
          willChange: 'transform',
        }}
        className="relative z-10 w-full max-w-7xl mx-auto px-4 flex flex-col items-center text-center justify-center min-h-[100dvh] pointer-events-none"
      >
        <div className="hero-reveal mb-6 inline-flex items-center gap-3 px-4 py-1.5 rounded-full text-accent text-xs font-josefin font-bold uppercase tracking-[0.3em] pointer-events-auto">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
          </span>
          SYSTEM ONLINE
        </div>
        
        <h1 className="hero-reveal text-[20vw] sm:text-[16vw] lg:text-[14vw] font-black tracking-tighter leading-none font-base uppercase drop-shadow-xl flex flex-col items-center justify-center gap-5 sm:gap-6 mt-4">
          <span className="text-[#161616] dark:text-[#F5F5F5]">UMAR</span>
          <span className="text-[#E07A5F]">BUILDS</span>
        </h1>
        
        <div className="hero-reveal mt-6 w-full max-w-2xl flex flex-col items-center pointer-events-auto">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight leading-tight font-editorial mb-6 text-[#2F2F2F] dark:text-[rgba(245,245,245,0.85)] drop-shadow-md">
            {tagline}
          </h2>
          <p className="text-base sm:text-lg text-[#5C5C5C] dark:text-[rgba(245,245,245,0.65)] leading-loose font-host mb-12 max-w-[600px] drop-shadow-md mx-auto">
            {supporting1}
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-8 w-full max-w-lg mx-auto">
            <Magnetic scale={0.2} className="w-full sm:w-auto flex-1">
              <a
                href="#projects"
                className="inline-flex items-center justify-center gap-3 w-full px-8 py-4 bg-[#E07A5F] text-white rounded-xl font-host font-bold tracking-widest uppercase hover:-translate-y-1 hover:shadow-[0_10px_30px_-10px_rgba(224,122,95,0.6)] transition-all duration-300 cursor-pointer text-xs active:scale-[0.98]"
              >
                {primaryCTA}
                <ArrowRight size={14} />
              </a>
            </Magnetic>

            <Magnetic scale={0.2} className="w-full sm:w-auto flex-1">
              <a
                href="#contact"
                className="inline-flex items-center justify-center gap-3 w-full px-8 py-4 bg-transparent text-[#161616] dark:text-[#F5F5F5] border border-[#161616]/80 dark:border-[#F5F5F5]/80 hover:border-[#161616] dark:hover:border-[#F5F5F5] rounded-xl font-host font-bold tracking-widest uppercase hover:bg-black/5 dark:hover:bg-white/10 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 cursor-pointer text-xs active:scale-[0.98]"
              >
                <Mail size={14} className="text-[#161616] dark:text-[#F5F5F5]" />
                {secondaryCTA}
              </a>
            </Magnetic>
          </div>
        </div>
      </div>

      <div className="absolute bottom-6 left-6 lg:bottom-10 lg:left-10 pointer-events-none z-20">
        <span
          className="hero-reveal font-josefin text-[10px] font-bold tracking-[0.3em] text-primary-text/40 dark:text-primary-text-dark/40 uppercase"
          style={{ animationDelay: '1.1s' }}
        >
          SH–01 // PORTFOLIO_SYSTEM
        </span>
      </div>
    </section>
  );
}
