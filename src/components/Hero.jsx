import { useState, useRef, useEffect, lazy, Suspense } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { ArrowRight, Mail } from 'lucide-react';
import SceneErrorBoundary from './3d/SceneErrorBoundary';

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
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const tagline      = t('hero.tagline');
  const supporting1  = t('hero.supporting1');
  const primaryCTA   = t('hero.primaryCTA');
  const secondaryCTA = t('hero.secondaryCTA');

  // Subtle parallax — text drifts up slower than scroll
  const scrollShift = scrollY * 0.12;

  return (
    <section
      className="relative min-h-[100dvh] flex flex-col justify-center overflow-hidden w-full select-none border-b border-primary-text/8 dark:border-primary-text-dark/8"
      aria-label="Hero"
    >
      {/* ─── 3D Scene — full-bleed behind composition ─────────────────── */}
      <div className="absolute inset-0 z-0 pointer-events-auto">
        <SceneErrorBoundary fallback={null}>
          <Suspense fallback={null}>
            <SceneManager isDarkMode={isDarkMode} />
          </Suspense>
        </SceneErrorBoundary>
      </div>

      {/* ─── Subtle paper texture grain ────────────────────────────────── */}
      <div
        className="absolute inset-0 z-0 pointer-events-none opacity-[0.035] dark:opacity-[0.06] mix-blend-overlay"
        style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.75\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")',
        }}
      />

      {/* ─── Very subtle column rule grid ───────────────────────────────── */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.018] dark:opacity-[0.012]">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="col-grid" width="80" height="80" patternUnits="userSpaceOnUse">
              <path d="M 80 0 L 0 0 0 80" fill="none" stroke="currentColor" strokeWidth="0.4" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#col-grid)" />
        </svg>
      </div>

      {/* ─── Main composition ────────────────────────────────────────────── */}
      <div
        style={{
          transform: `translateY(-${scrollShift}px)`,
          willChange: 'transform',
        }}
        className="relative z-10 w-full min-h-[100dvh] flex flex-col"
      >
        {/* ── Top discipline label ───────────────────────────────────────── */}
        <div className="hero-reveal flex items-center justify-between px-8 sm:px-12 lg:px-16 pt-28 pb-0 pointer-events-none">
          <div className="flex items-center gap-3">
            <span className="font-josefin text-[9px] font-bold tracking-[0.35em] text-primary-text/35 dark:text-primary-text-dark/35 uppercase">
              Software Engineer
            </span>
            <span className="w-8 h-px bg-primary-text/20 dark:bg-primary-text-dark/20" />
            <span className="font-josefin text-[9px] font-bold tracking-[0.35em] text-accent uppercase">
              Product &amp; AI
            </span>
          </div>
          <span className="hidden sm:block font-josefin text-[9px] font-bold tracking-[0.3em] text-primary-text/25 dark:text-primary-text-dark/25 uppercase">
            SH–01 // UZB
          </span>
        </div>

        {/* ── Main vertical composition: UMAR / 3D / BUILDS ─────────────── */}
        <div className="flex-1 flex flex-col lg:flex-row items-center justify-center px-6 sm:px-10 lg:px-0 gap-0 lg:gap-0">

          {/* LEFT — editorial column (desktop only) */}
          <div className="hidden lg:flex flex-col justify-between h-full py-12 pl-16 pr-8 w-[22%] flex-shrink-0">
            <div className="hero-reveal" style={{ animationDelay: '0.4s' }}>
              <p className="font-josefin text-[10px] font-bold tracking-[0.25em] text-primary-text/35 dark:text-primary-text-dark/35 uppercase leading-loose">
                Tashkent<br />
                Uzbekistan<br />
                UTC+05
              </p>
            </div>
            <div className="hero-reveal" style={{ animationDelay: '0.6s' }}>
              <div className="w-px h-24 bg-gradient-to-b from-transparent via-primary-text/20 dark:via-primary-text-dark/20 to-transparent mx-auto mb-6" />
              <p className="font-host text-[11px] leading-relaxed text-primary-text/45 dark:text-primary-text-dark/45 text-center">
                Building at the intersection of engineering and product
              </p>
            </div>
          </div>

          {/* CENTER — massive typography framing the 3D object */}
          <div className="flex-1 flex flex-col items-center justify-center py-6 lg:py-0 w-full lg:w-auto">

            {/* UMAR — massive, sits above 3D center */}
            <h1 className="hero-reveal w-full text-center leading-[0.88] tracking-[-0.04em] font-black font-base uppercase text-primary-text dark:text-primary-text-dark"
              style={{ fontSize: 'clamp(6rem, 18vw, 18rem)', lineHeight: 0.88 }}
            >
              UMAR
            </h1>

            {/* 3D Scene window — the icosahedron lives here, between UMAR and BUILDS */}
            <div
              className="relative w-full flex items-center justify-center"
              style={{ height: 'clamp(140px, 22vw, 320px)' }}
              aria-hidden="true"
            >
              {/* Thin accent rule — left */}
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[15%] h-px bg-gradient-to-r from-transparent to-accent/30" />
              {/* Thin accent rule — right */}
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[15%] h-px bg-gradient-to-l from-transparent to-accent/30" />

              {/* Tagline over the 3D space */}
              <div className="hero-reveal flex flex-col items-center gap-1 z-10 pointer-events-none" style={{ animationDelay: '0.25s' }}>
                <span className="font-editorial italic text-sm sm:text-base lg:text-lg text-primary-text/75 dark:text-primary-text-dark/80 tracking-wide text-center px-6 py-2 rounded-full backdrop-blur-md bg-white/10 dark:bg-black/20 border border-primary-text/5 dark:border-primary-text-dark/10 shadow-sm">
                  {tagline}
                </span>
              </div>
            </div>

            {/* BUILDS — accent color, same massive scale, outlined treatment */}
            <div
              className="hero-reveal w-full text-center leading-[0.88] tracking-[-0.04em] font-black font-base uppercase"
              style={{
                fontSize: 'clamp(6rem, 18vw, 18rem)',
                lineHeight: 0.88,
                animationDelay: '0.1s',
                WebkitTextStroke: '2px var(--color-accent)',
                color: 'transparent'
              }}
            >
              BUILDS
            </div>
          </div>

          {/* RIGHT — CTAs + supporting (desktop) */}
          <div className="hidden lg:flex flex-col justify-between h-full py-12 pr-16 pl-8 w-[22%] flex-shrink-0">
            <div className="hero-reveal" style={{ animationDelay: '0.5s' }}>
              <p className="font-host text-xs text-primary-text/50 dark:text-primary-text-dark/50 leading-relaxed text-right">
                {supporting1}
              </p>
            </div>
            <div className="hero-reveal flex flex-col gap-3 pointer-events-auto" style={{ animationDelay: '0.7s' }}>
              <Magnetic scale={0.15}>
                <a
                  href="#projects"
                  className="group flex items-center justify-end gap-2 py-3 font-host font-bold text-xs tracking-widest uppercase text-primary-text dark:text-primary-text-dark hover:text-accent dark:hover:text-accent transition-colors duration-300"
                >
                  {primaryCTA}
                  <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform duration-300" />
                </a>
              </Magnetic>
              <div className="w-full h-px bg-primary-text/10 dark:bg-primary-text-dark/10" />
              <Magnetic scale={0.15}>
                <a
                  href="#contact"
                  className="flex items-center justify-end gap-2 py-3 font-host font-bold text-xs tracking-widest uppercase text-primary-text/55 dark:text-primary-text-dark/55 hover:text-accent dark:hover:text-accent transition-colors duration-300"
                >
                  <Mail size={12} />
                  {secondaryCTA}
                </a>
              </Magnetic>
            </div>
          </div>
        </div>

        {/* ── Mobile CTAs — below the composition ────────────────────────── */}
        <div className="hero-reveal lg:hidden flex flex-col sm:flex-row justify-center gap-4 px-6 pb-10 pointer-events-auto" style={{ animationDelay: '0.5s' }}>
          <Magnetic scale={0.15} className="w-full sm:w-auto">
            <a
              href="#projects"
              className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-7 py-3.5 bg-accent text-white rounded-xl font-host font-bold tracking-widest uppercase text-xs hover:-translate-y-0.5 hover:shadow-[0_8px_24px_-6px_rgba(224,122,95,0.5)] transition-all duration-300 active:scale-[0.98]"
            >
              {primaryCTA}
              <ArrowRight size={13} />
            </a>
          </Magnetic>
          <Magnetic scale={0.15} className="w-full sm:w-auto">
            <a
              href="#contact"
              className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-7 py-3.5 border border-primary-text/20 dark:border-primary-text-dark/20 text-primary-text dark:text-primary-text-dark rounded-xl font-host font-bold tracking-widest uppercase text-xs hover:border-accent/50 hover:text-accent dark:hover:text-accent hover:-translate-y-0.5 transition-all duration-300 active:scale-[0.98]"
            >
              <Mail size={12} />
              {secondaryCTA}
            </a>
          </Magnetic>
        </div>

        {/* ── Bottom metadata bar ─────────────────────────────────────────── */}
        <div className="hero-reveal flex items-end justify-between px-8 sm:px-12 lg:px-16 pb-7 pointer-events-none" style={{ animationDelay: '0.9s' }}>
          <div className="flex items-center gap-4">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-60" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-accent" />
            </span>
            <span className="font-josefin text-[9px] font-bold tracking-[0.3em] text-primary-text/35 dark:text-primary-text-dark/35 uppercase">
              Available for work
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-6">
            <span className="font-josefin text-[9px] font-bold tracking-[0.3em] text-primary-text/25 dark:text-primary-text-dark/25 uppercase">
              Scroll to explore
            </span>
            <div className="flex flex-col gap-1">
              <div className="w-3 h-px bg-primary-text/20 dark:bg-primary-text-dark/20" />
              <div className="w-5 h-px bg-primary-text/30 dark:bg-primary-text-dark/30" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
