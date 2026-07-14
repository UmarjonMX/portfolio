import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { ArrowRight, Mail } from 'lucide-react';

// ─── Magnetic Proximity Wrapper ─────────────────────────────────────────────
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

// ─── Hero Component ─────────────────────────────────────────────────────────
export default function Hero() {
  const { t } = useLanguage();
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const tagline      = t('hero.tagline');
  const headline     = t('hero.headline');
  const supporting1  = t('hero.supporting1');
  const primaryCTA   = t('hero.primaryCTA');
  const secondaryCTA = t('hero.secondaryCTA');

  // Scroll-driven parallax
  const vh = typeof window !== 'undefined' ? window.innerHeight : 900;
  const scrollFade  = Math.max(0, 1 - scrollY / (vh * 0.55));
  const scrollShift = scrollY * 0.15;

  return (
    <section className="relative min-h-[100dvh] flex flex-col justify-center overflow-hidden z-10 w-full select-none">

      {/* Scroll-driven content wrapper */}
      <div
        style={{
          opacity: scrollFade,
          transform: `translateY(-${scrollShift}px)`,
          willChange: 'transform, opacity',
        }}
        className="relative z-10 w-full max-w-7xl mx-auto px-8 sm:px-14 lg:px-20 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center"
      >

        {/* ── LEFT: Text Content (55%) ─────────────────────────────────── */}
        <div className="lg:col-span-7 flex flex-col items-start justify-center">

          {/* Status indicator */}
          <div
            className="hero-reveal mb-8 inline-flex items-center gap-3 px-4 py-1.5 bg-accent/10 border border-accent/25 rounded-full text-accent text-[10px] font-martian font-bold uppercase tracking-[0.25em]"
            style={{ animationDelay: '0.1s' }}
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
            </span>
            ONLINE // ACTIVE
          </div>

          {/* HEADLINE — staggered word-by-word */}
          <div
            className="hero-reveal"
            style={{ animationDelay: '0.3s' }}
          >
            <h1 className="text-7xl sm:text-8xl lg:text-[7rem] xl:text-[8.5rem] font-black tracking-tighter leading-[0.85] text-primary-text dark:text-primary-text-dark font-martian uppercase">
              UMAR
            </h1>
          </div>

          <div
            className="hero-reveal"
            style={{ animationDelay: '0.45s' }}
          >
            <h1 className="text-7xl sm:text-8xl lg:text-[7rem] xl:text-[8.5rem] font-black tracking-tighter leading-[0.85] text-accent font-martian uppercase mt-1">
              BUILDS
            </h1>
          </div>

          {/* Subtitle */}
          <div
            className="hero-reveal mt-6"
            style={{ animationDelay: '0.6s' }}
          >
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight leading-tight text-primary-text/70 dark:text-primary-text-dark/70 font-martian">
              {headline}
            </h2>
          </div>

          {/* Tagline + Supporting */}
          <div
            className="hero-reveal mt-4"
            style={{ animationDelay: '0.75s' }}
          >
            <p className="text-xs font-martian font-bold tracking-[0.3em] uppercase text-primary-text/40 dark:text-primary-text-dark/40 mb-3">
              {tagline}
            </p>
            <p className="text-base sm:text-lg text-primary-text/60 dark:text-primary-text-dark/60 leading-relaxed font-funnel max-w-xl">
              {supporting1}
            </p>
          </div>

          {/* CTA Buttons */}
          <div
            className="hero-reveal flex flex-col sm:flex-row gap-4 mt-10 w-full max-w-md"
            style={{ animationDelay: '0.9s' }}
          >
            <Magnetic scale={0.25} className="flex-1">
              <a
                href="#projects"
                className="btn-sweep inline-flex items-center justify-center gap-3 w-full px-8 py-4 bg-accent hover:bg-accent/90 text-white dark:text-[#1C1C1D] rounded-2xl font-funnel font-bold tracking-wider uppercase shadow-[0_12px_30px_-8px_rgba(224,122,95,0.35)] hover:shadow-[0_16px_40px_-8px_rgba(224,122,95,0.45)] transition-all duration-300 cursor-pointer border border-accent/20"
              >
                {primaryCTA}
                <ArrowRight size={16} />
              </a>
            </Magnetic>

            <Magnetic scale={0.25} className="flex-1">
              <a
                href="#contact"
                className="btn-sweep inline-flex items-center justify-center gap-3 w-full px-8 py-4 bg-white/50 dark:bg-[#1E1E20]/50 backdrop-blur-md text-primary-text dark:text-primary-text-dark border border-primary-text/10 dark:border-primary-text-dark/10 rounded-2xl font-funnel font-bold tracking-wider uppercase hover:bg-white/80 dark:hover:bg-[#1E1E20]/80 shadow-[0_10px_24px_-8px_rgba(0,0,0,0.06)] hover:shadow-[0_14px_32px_-8px_rgba(0,0,0,0.12)] transition-all duration-300 cursor-pointer"
              >
                <Mail size={16} className="text-primary-text/50 dark:text-primary-text-dark/50" />
                {secondaryCTA}
              </a>
            </Magnetic>
          </div>
        </div>

        {/* ── RIGHT: Space for 3D Crystal (45%) ────────────────────────── */}
        <div className="lg:col-span-5 h-[120px] lg:h-full w-full pointer-events-none" aria-hidden="true" />

      </div>

      {/* Minimal sheet label */}
      <div className="absolute bottom-8 left-8 sm:left-14 lg:left-20 pointer-events-none">
        <span
          className="hero-reveal font-martian text-[8px] font-bold tracking-[0.3em] text-primary-text/20 dark:text-primary-text-dark/20 uppercase"
          style={{ animationDelay: '1.1s' }}
        >
          SH–01 // PORTFOLIO_SYSTEM
        </span>
      </div>
    </section>
  );
}
