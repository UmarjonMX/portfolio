// eslint-disable-next-line no-unused-vars
import { motion, useTransform } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import Footer from './Footer';
import {
  seg,
  useChapterProgress,
  useIsMobile,
  usePrefersReducedMotion,
} from './scroll/ScrollStage';

/**
 * Chapter 06 — the closing composition.
 *
 * Everything the site has been showing — the grid, the rules, the outlined
 * hero type — collapses into a single statement. The whole chapter is one
 * pinned stage driven by one progress value, so it reads as the end of one
 * continuous film rather than a section with an animation on it.
 *
 * Copy completes the hero's own sentence. The site opens on `UMAR / BUILDS`;
 * this is the object of that verb.
 */
export default function FinalStatement() {
  const { t } = useLanguage();
  const reduced = usePrefersReducedMotion();
  const isMobile = useIsMobile();

  const p = useChapterProgress('finale', 'pin');

  // `reduced` returns the resting state from every mapping, so the full
  // statement is present and readable with no cinematic movement at all.
  const d = (fn) => (v) => (reduced ? fn(1) : fn(v));

  // ── The accumulated grid collapses toward the centre ──────────────────
  const gridOpacity = useTransform(p, d((v) => 0.4 * (1 - seg(v, 0.0, 0.3))));
  const ruleX = useTransform(p, d((v) => 1 - 0.97 * seg(v, 0.0, 0.42)));
  const ruleY = useTransform(p, d((v) => 1 - 0.96 * seg(v, 0.0, 0.42)));

  // ── The echo of the opening ───────────────────────────────────────────
  const echoOpacity = useTransform(p, d((v) => seg(v, 0.05, 0.26)));

  // ── Line 1 — arrives clipped from the left, tracking tightening ───────
  const l1Clip = useTransform(
    p,
    d((v) => `inset(0 ${100 - 100 * seg(v, 0.24, 0.52)}% 0 0)`)
  );
  const l1Track = useTransform(
    p,
    d((v) => `${0.22 - 0.21 * seg(v, 0.24, 0.62)}em`)
  );
  const l1Y = useTransform(p, d((v) => 40 * (1 - seg(v, 0.24, 0.56))));

  // ── Line 2 — same gesture, offset so the two lines read as one object ─
  const l2Clip = useTransform(
    p,
    d((v) => `inset(0 ${100 - 100 * seg(v, 0.42, 0.72)}% 0 0)`)
  );
  const l2Track = useTransform(
    p,
    d((v) => `${0.22 - 0.21 * seg(v, 0.42, 0.8)}em`)
  );
  const l2Y = useTransform(p, d((v) => 40 * (1 - seg(v, 0.42, 0.74))));

  // ── Closure: one accent measure, then the line and the way to reply ───
  const markScale = useTransform(p, d((v) => seg(v, 0.62, 0.86)));
  const kickerOpacity = useTransform(p, d((v) => seg(v, 0.72, 0.95)));
  const kickerY = useTransform(p, d((v) => 18 * (1 - seg(v, 0.72, 0.96))));

  const size = isMobile
    ? 'clamp(2.6rem, 15vw, 6rem)'
    : 'clamp(3.4rem, 11.5vw, 11rem)';

  return (
    <section
      id="finale"
      data-chapter="finale"
      key={reduced ? 'static' : 'motion'}
      className="relative w-full"
      style={{ height: reduced ? 'auto' : '340vh' }}
      aria-label={t('finale.chapter')}
    >
      <div
        className={
          reduced
            ? 'relative w-full flex flex-col'
            : 'sticky top-0 h-[100dvh] w-full flex items-center overflow-hidden'
        }
      >
        {/* ── Collapsing grid ─────────────────────────────────────────────── */}
        <div
          aria-hidden="true"
          className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center"
        >
          <motion.div
            style={{ opacity: gridOpacity }}
            className="absolute inset-0 opacity-[0.05] dark:opacity-[0.07]"
          >
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern
                  id="finale-grid"
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
              <rect
                width="100%"
                height="100%"
                fill="url(#finale-grid)"
                className="text-primary-text dark:text-primary-text-dark"
              />
            </svg>
          </motion.div>

          {/* horizontal + vertical measures converging on one point */}
          <motion.div
            style={{ scaleX: ruleX, opacity: gridOpacity }}
            className="absolute left-0 right-0 top-1/2 h-px bg-primary-text/40 dark:bg-primary-text-dark/40 origin-center"
          />
          <motion.div
            style={{ scaleY: ruleY, opacity: gridOpacity }}
            className="absolute top-0 bottom-0 left-1/2 w-px bg-primary-text/25 dark:bg-primary-text-dark/25 origin-center"
          />
        </div>

        {/* ── Final composition ──────────────────────────────────────────── */}
        <div className="relative z-10 w-full max-w-[90rem] mx-auto px-6 sm:px-10 lg:px-16 pb-24">
          <div className="max-w-6xl">
            <motion.div style={{ opacity: echoOpacity }} className="mb-6 sm:mb-10">
              <span className="font-josefin text-[10px] font-bold tracking-[0.4em] text-primary-text/40 dark:text-primary-text-dark/40 uppercase">
                {t('finale.echo')}
              </span>
            </motion.div>

            <h2
              style={{ fontSize: size }}
              className="font-black font-base uppercase leading-[0.86] tracking-[-0.02em] text-primary-text dark:text-primary-text-dark"
            >
              <motion.span
                style={{ clipPath: l1Clip, letterSpacing: l1Track, y: l1Y }}
                className="block"
              >
                {t('finale.line1')}
              </motion.span>
              <motion.span
                style={{ clipPath: l2Clip, letterSpacing: l2Track, y: l2Y }}
                className="block text-accent"
              >
                {t('finale.line2')}
              </motion.span>
            </h2>

            <motion.div
              aria-hidden="true"
              style={{ scaleX: markScale }}
              className="mt-10 sm:mt-14 h-px w-full max-w-md origin-left bg-accent/60"
            />

            <motion.div
              style={{ opacity: kickerOpacity, y: kickerY }}
              className="mt-8 sm:mt-10 flex flex-col md:flex-row md:items-end md:justify-between gap-6"
            >
              <p className="font-editorial italic text-lg sm:text-xl text-primary-text/70 dark:text-primary-text-dark/70 max-w-md">
                {t('finale.kicker')}
              </p>
              <a
                href={`mailto:${t('contact.emailValue')}`}
                className="font-josefin text-xs font-bold tracking-[0.25em] uppercase text-accent hover:opacity-70 transition-opacity duration-300"
              >
                {t('contact.emailValue')}
              </a>
            </motion.div>
          </div>
        </div>

        {/* The colophon lives inside the pinned composition rather than after
            it. A full-viewport sticky stage that is the last element on the
            page pins all the way to the final scroll position, so anything
            placed after it in flow could never be reached. */}
        {!reduced && (
          <div className="absolute inset-x-0 bottom-0 z-20">
            <Footer compact />
          </div>
        )}
      </div>

      {reduced && <Footer />}
    </section>
  );
}