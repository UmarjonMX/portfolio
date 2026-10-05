import { useRef, useState } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, useTransform } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { ArrowRight, Mail } from 'lucide-react';
import {
  seg,
  useChapterProgress,
  useIsMobile,
  usePrefersReducedMotion,
} from './scroll/ScrollStage';

function Magnetic({ children, scale = 0.25, className = '' }) {
  const ref = useRef(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const onMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
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
        transition:
          pos.x === 0
            ? 'transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)'
            : 'transform 0.08s linear',
      }}
      className={className}
    >
      {children}
    </div>
  );
}

export default function Hero() {
  const { t } = useLanguage();
  const reduced = usePrefersReducedMotion();
  const isMobile = useIsMobile();

  // Chapter 01 is pinned, so its progress spans the whole sticky runway.
  const p = useChapterProgress('hero', 'pin');

  // ── Chapter 01 choreography ────────────────────────────────────────────
  // One master progress drives everything, so the composition always reads as a
  // single object passing through one transformation rather than several
  // unrelated animations.
  //
  // `reduced` zeroes every delta, so this same markup renders the static hero
  // with all content intact.
  const d = (fn) => (v) => (reduced ? 0 : fn(v));

  // Desktop walks the type out to the outer columns of the 12-column grid.
  // Mobile deliberately simplifies: no lateral spread, shorter travel.
  const spread = isMobile ? 0 : 1;
  const endScale = isMobile ? 0.4 : 0.24;
  const endX = 30; // vw
  const endY = -21; // vh
  // BUILDS sits 46–47vh below UMAR, so travelling a little over twice as far
  // lands both words on the same baseline. The hero resolves into a single-line
  // masthead — and leaves as one object instead of two at different moments.
  const buildsEndY = -67; // vh

  // Type leaves over the first 78% of the runway.
  const type = useTransform(p, d((v) => seg(v, 0.0, 0.78)));
  // Metadata and side columns clear early so the type owns the frame.
  const meta = useTransform(p, d((v) => seg(v, 0.0, 0.34)));

  const umarScale = useTransform(type, (v) => 1 - (1 - endScale) * v);
  const umarX = useTransform(type, (v) => `${-endX * spread * v}vw`);
  const umarY = useTransform(type, (v) => `${endY * v}vh`);
  const umarOpacity = useTransform(type, (v) => 1 - 0.45 * v);

  const buildsScale = useTransform(type, (v) => 1 - (1 - endScale) * v);
  const buildsX = useTransform(type, (v) => `${endX * spread * v}vw`);
  const buildsY = useTransform(type, (v) => `${buildsEndY * v}vh`);
  const buildsOpacity = useTransform(type, (v) => 1 - 0.45 * v);
  // Outlined → filled. The filled copy is a registered duplicate, so the two
  // states dissolve in place instead of cross-fading two separate objects.
  const buildsFill = useTransform(type, (v) => seg(v, 0.55, 1));

  const labelY = useTransform(meta, (v) => `${-6 * v}vh`);
  const labelOpacity = useTransform(meta, (v) => 1 - v);

  const sideOpacity = useTransform(meta, (v) => 1 - v);
  const leftX = useTransform(meta, (v) => `${-5 * spread * v}vw`);
  const rightX = useTransform(meta, (v) => `${5 * spread * v}vw`);

  // The tagline drops out of the centre as the type expands.
  const tagY = useTransform(meta, (v) => `${16 * v}vh`);
  const tagX = useTransform(meta, (v) => `${-14 * spread * v}vw`);
  const tagOpacity = useTransform(meta, (v) => 1 - v);

  // The centre measure opens outward as the composition expands.
  const ruleScale = useTransform(p, d((v) => 0.25 + 0.75 * seg(v, 0, 0.9)));
  const ruleOpacity = useTransform(meta, (v) => 1 - 0.85 * v);

  const barY = useTransform(meta, (v) => `${6 * v}vh`);
  const barOpacity = useTransform(meta, (v) => 1 - v);

  const tagline = t('hero.tagline');
  const supporting1 = t('hero.supporting1');
  const primaryCTA = t('hero.primaryCTA');
  const secondaryCTA = t('hero.secondaryCTA');

  return (
    <section
      id="hero"
      data-chapter="hero"
      // Forces the motion hooks to rebuild if the user flips the OS
      // reduced-motion preference mid-session.
      key={reduced ? 'static' : 'motion'}
      className="relative w-full select-none"
      // 190vh = one viewport of pinned runway + one viewport of release. The release
      // length always equals the stage height, so a taller section would only
      // add a longer empty stretch between this chapter handing over and the
      // next one arriving. At 190vh the manifesto starts arriving at the exact
      // scroll position the hero un-pins.
      style={{ height: reduced ? '100dvh' : '190vh' }}
      aria-label="Hero"
    >
      {/* ─── Pinned stage ─────────────────────────────────────────────────── */}
      <div className="sticky top-0 h-[100dvh] w-full overflow-hidden flex flex-col justify-center">
        {/* ─── Very subtle column rule grid ───────────────────────────────── */}
        <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.018] dark:opacity-[0.012]">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern
                id="col-grid"
                width="80"
                height="80"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 80 0 L 0 0 0 80"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="0.4"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#col-grid)" />
          </svg>
        </div>

        {/* ─── Main composition ────────────────────────────────────────────── */}
        <div className="relative z-10 w-full min-h-[100dvh] flex flex-col">
          {/* ── Top discipline label ───────────────────────────────────────── */}
          <motion.div
            style={{ y: labelY, opacity: labelOpacity }}
            className="hero-reveal flex items-center justify-between px-8 sm:px-12 lg:px-16 pt-28 pb-0 pointer-events-none"
          >
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
          </motion.div>

          {/* ── Main composition: UMAR / measure / BUILDS ─────────────────── */}
          <div className="flex-1 flex flex-col lg:flex-row items-center justify-center px-6 sm:px-10 lg:px-0 gap-0 lg:gap-0">
            {/* LEFT — editorial column (desktop only) */}
            <motion.div
              style={{ x: leftX, opacity: sideOpacity }}
              className="hidden lg:flex flex-col justify-between h-full py-12 pl-16 pr-8 w-[22%] flex-shrink-0"
            >
              <div className="hero-reveal" style={{ animationDelay: '0.4s' }}>
                <p className="font-josefin text-[10px] font-bold tracking-[0.25em] text-primary-text/35 dark:text-primary-text-dark/35 uppercase leading-loose">
                  Tashkent
                  <br />
                  Uzbekistan
                  <br />
                  UTC+05
                </p>
              </div>
              <div className="hero-reveal" style={{ animationDelay: '0.6s' }}>
                <div className="w-px h-24 bg-gradient-to-b from-transparent via-primary-text/20 dark:via-primary-text-dark/20 to-transparent mx-auto mb-6" />
                <p className="font-host text-[11px] leading-relaxed text-primary-text/45 dark:text-primary-text-dark/45 text-center">
                  Building at the intersection of engineering and product
                </p>
              </div>
            </motion.div>

            {/* CENTER — the typography is the visual object */}
            <div className="flex-1 flex flex-col items-center justify-center py-6 lg:py-0 w-full lg:w-auto">
              {/* UMAR — solid, walks out toward the left column */}
              <motion.div
                style={{
                  scale: umarScale,
                  x: umarX,
                  y: umarY,
                  opacity: umarOpacity,
                }}
                className="w-full"
              >
                <h1
                  className="hero-reveal w-full text-center leading-[0.88] tracking-[-0.04em] font-black font-base uppercase text-primary-text dark:text-primary-text-dark"
                  style={{
                    fontSize: 'clamp(6rem, 18vw, 18rem)',
                    lineHeight: 0.88,
                  }}
                >
                  UMAR
                </h1>
              </motion.div>

              {/* The former 3D window is now the horizontal measure of the
                  composition: the space the type opens into and out of. */}
              <div
                className="relative w-full flex-1 min-h-[clamp(90px,13vw,210px)] flex items-center justify-center"
                aria-hidden="true"
              >
                <motion.div
                  style={{ scaleX: ruleScale, opacity: ruleOpacity }}
                  className="absolute left-1/2 top-1/2 h-px w-[86%] -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-transparent via-accent/30 to-transparent origin-center"
                />
              </div>

              {/* BUILDS — outlined, walks out toward the right column and fills */}
              <motion.div
                style={{
                  scale: buildsScale,
                  x: buildsX,
                  y: buildsY,
                  opacity: buildsOpacity,
                }}
                className="relative w-full"
              >
                <div
                  className="hero-reveal w-full text-center leading-[0.88] tracking-[-0.04em] font-black font-base uppercase"
                  style={{
                    fontSize: 'clamp(6rem, 18vw, 18rem)',
                    lineHeight: 0.88,
                    animationDelay: '0.1s',
                    WebkitTextStroke: '2px var(--color-accent)',
                    color: 'transparent',
                  }}
                >
                  BUILDS
                </div>
                {/* filled state, registered exactly over the outlined one */}
                <motion.div
                  aria-hidden="true"
                  style={{ opacity: buildsFill }}
                  className="absolute inset-0 w-full text-center leading-[0.88] tracking-[-0.04em] font-black font-base uppercase text-accent pointer-events-none"
                >
                  <div
                    style={{
                      fontSize: 'clamp(6rem, 18vw, 18rem)',
                      lineHeight: 0.88,
                    }}
                  >
                    BUILDS
                  </div>
                </motion.div>
              </motion.div>
            </div>

            {/* RIGHT — CTAs + supporting (desktop) */}
            <motion.div
              style={{ x: rightX, opacity: sideOpacity }}
              className="hidden lg:flex flex-col justify-between h-full py-12 pr-16 pl-8 w-[22%] flex-shrink-0"
            >
              <div className="hero-reveal" style={{ animationDelay: '0.5s' }}>
                <p className="font-host text-xs text-primary-text/50 dark:text-primary-text-dark/50 leading-relaxed text-right">
                  {supporting1}
                </p>
              </div>
              <div
                className="hero-reveal flex flex-col gap-3 pointer-events-auto"
                style={{ animationDelay: '0.7s' }}
              >
                <Magnetic scale={0.15}>
                  <a
                    href="#projects"
                    className="group flex items-center justify-end gap-2 py-3 font-host font-bold text-xs tracking-widest uppercase text-primary-text dark:text-primary-text-dark hover:text-accent dark:hover:text-accent transition-colors duration-300"
                  >
                    {primaryCTA}
                    <ArrowRight
                      size={13}
                      className="group-hover:translate-x-1 transition-transform duration-300"
                    />
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
            </motion.div>
          </div>

          {/* ── Tagline — rides the measure, then exits ───────────────────── */}
          <motion.div
            style={{ y: tagY, x: tagX, opacity: tagOpacity }}
            className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-center px-6 pointer-events-none z-20"
          >
            <div
              className="hero-reveal flex flex-col items-center gap-1"
              style={{ animationDelay: '0.25s' }}
            >
              <span className="font-editorial italic text-sm sm:text-base lg:text-lg text-primary-text/75 dark:text-primary-text-dark/80 tracking-wide text-center px-6 py-2 rounded-full backdrop-blur-md bg-white/10 dark:bg-black/20 border border-primary-text/5 dark:border-primary-text-dark/10 shadow-sm">
                {tagline}
              </span>
            </div>
          </motion.div>

          {/* ── Mobile CTAs — below the composition ────────────────────────── */}
          <div
            className="hero-reveal lg:hidden flex flex-col sm:flex-row justify-center gap-4 px-6 pb-10 pointer-events-auto"
            style={{ animationDelay: '0.5s' }}
          >
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
                className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-7 py-3.5 border border-primary-text/20 dark:border-primary-text-dark/20 text-primary-text dark:text-primary-text-dark rounded-xl font-host font-bold tracking-widest uppercase text-xs hover:border-accent/50 hover:text-accent dark:hover:border-accent dark:hover:text-accent hover:-translate-y-0.5 transition-all duration-300 active:scale-[0.98]"
              >
                <Mail size={12} />
                {secondaryCTA}
              </a>
            </Magnetic>
          </div>

          {/* ── Bottom metadata bar ─────────────────────────────────────────── */}
          <motion.div
            style={{
              y: barY,
              opacity: barOpacity,
              animationDelay: '0.9s',
            }}
            className="hero-reveal flex items-end justify-between px-8 sm:px-12 lg:px-16 pb-7 pointer-events-none"
          >
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
          </motion.div>
        </div>
      </div>
    </section>
  );
}