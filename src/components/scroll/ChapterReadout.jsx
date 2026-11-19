import { useEffect, useRef, useState, useMemo } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, useMotionValueEvent, useTransform } from 'framer-motion';
import {
  seg,
  useChapterProgress,
  useGlobalProgress,
  useIsMobile,
  usePrefersReducedMotion,
  useScrollStage,
} from './ScrollStage';
import { useLanguage } from '../../context/LanguageContext';

/**
 * A single live reference for the whole narrative: which chapter you are in,
 * and how far down the document you are.
 *
 * Everything shown here is measured, not invented. The progress hairline is a
 * transform on a MotionValue (no React render); only the numeric readout
 * re-renders, and only when the printed value actually changes.
 *
 * `aria-hidden`: this is a progress ornament. The same information is already
 * available as real headings and as the navigation's `aria-current`, and a
 * second live-updating region would only compete with them.
 */
export default function ChapterReadout() {
  const { scrollY, bounds } = useScrollStage();
  const global = useGlobalProgress();
  const reduced = usePrefersReducedMotion();
  const isMobile = useIsMobile();
  const { t } = useLanguage();

  const chapters = useMemo(
    () => [
      { id: 'hero', n: '01' },
      { id: 'about', n: '02' },
      { id: 'projects', n: '03' },
      { id: 'engineering', n: '04' },
      { id: 'contact', n: '05' },
      { id: 'finale', n: '06' },
    ],
    []
  );

  const [state, setState] = useState(() => ({ n: '01', key: 'hero', y: 0 }));
  const lastY = useRef(0);

  // Fades in once the hero has handed over, and out again at the very end so it
  // never sits on top of the closing statement.
  const aboutP = useChapterProgress('about');
  const finaleP = useChapterProgress('finale', 'pin');
  const opacity = useTransform([aboutP, finaleP], ([a, f]) =>
    reduced ? 0 : seg(a, 0.0, 0.06) * (1 - seg(f, 0.55, 0.8))
  );

  useMotionValueEvent(scrollY, 'change', (v) => {
    // Quantised so this leaf component re-renders a handful of times per
    // viewport, not once per scroll event.
    const q = Math.round(v / 8) * 8;
    if (q === lastY.current) return;
    lastY.current = q;

    let active = chapters[0];
    for (const c of chapters) {
      const b = bounds[c.id];
      if (b && v >= b.start - window.innerHeight * 0.4) active = c;
    }
    setState((prev) => (prev.n === active.n && prev.y === q ? prev : { n: active.n, key: active.id, y: q }));
  });

  useEffect(() => {
    // Prime the readout once measurements land.
    const id = requestAnimationFrame(() => {
      const v = window.scrollY;
      const q = Math.round(v / 8) * 8;
      lastY.current = q;
      setState({ n: '01', key: 'hero', y: q });
    });
    return () => cancelAnimationFrame(id);
  }, [bounds]);

  const label = t(`chapters.${state.key}`);

  if (isMobile || reduced) return null;

  return (
    <motion.div
      aria-hidden="true"
      style={{ opacity }}
      className="pointer-events-none fixed left-0 top-0 z-[5] hidden h-[100dvh] w-12 flex-col items-center justify-center xl:flex"
    >
      {/* live progress hairline — transform only */}
      <div className="absolute left-1/2 top-[12%] bottom-[12%] w-px -translate-x-1/2 bg-primary-text/10 dark:bg-primary-text-dark/10">
        <motion.div style={{ scaleY: global, originY: 0 }} className="absolute inset-0 w-px bg-accent/70" />
      </div>

      <div className="flex flex-col items-center gap-3 rotate-180 [writing-mode:vertical-rl]">
        <span className="font-josefin text-[10px] font-bold tracking-[0.35em] text-accent/80 uppercase">
          {state.n}
        </span>
        <span className="w-px h-8 bg-primary-text/20 dark:bg-primary-text-dark/20" />
        <span className="font-josefin text-[9px] font-bold tracking-[0.3em] text-primary-text/35 dark:text-primary-text-dark/35 uppercase">
          {label}
        </span>
      </div>

      <span className="absolute bottom-6 left-1/2 -translate-x-1/2 font-josefin text-[9px] font-bold tracking-[0.2em] text-primary-text/30 dark:text-primary-text-dark/30 tabular-nums">
        {String(state.y).padStart(5, '0')}
      </span>
    </motion.div>
  );
}