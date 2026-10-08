/* eslint-disable react-refresh/only-export-components */
/**
 * ScrollStage — the single scroll-progress system for the whole site.
 *
 * One scroll listener (framer-motion `useScroll`) writes to MotionValues.
 * Nothing in the narrative calls setState on scroll, so there is no
 * per-scroll React render and no layout thrash.
 *
 * Chapters are declared in the DOM as `data-chapter="<id>"`. Their absolute
 * offsets are measured once on mount and re-measured only on resize / lazy
 * content mutation, then exposed as per-chapter MotionValues clamped 0..1.
 */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useScroll, useTransform } from 'framer-motion';

const ScrollStageContext = createContext(null);

/** Normalised sub-range helper: remap p∈[0,1] onto the segment [a,b], clamped. */
export const seg = (p, a, b) => {
  if (b <= a) return p >= b ? 1 : 0;
  const v = (p - a) / (b - a);
  return v < 0 ? 0 : v > 1 ? 1 : v;
};

const MEASURE_TOLERANCE = 2; // px — ignore sub-2px measurement churn

function measure() {
  const vh = window.innerHeight || 900;
  const bounds = {};
  document.querySelectorAll('[data-chapter]').forEach((el) => {
    const id = el.dataset.chapter;
    if (!id) return;
    const rect = el.getBoundingClientRect();
    const start = rect.top + window.scrollY;
    const height = rect.height;
    bounds[id] = {
      start,
      height,
      // Progress range for a pinned (sticky) stage: the scroll distance the
      // element stays pinned for.
      pinEnd: start + Math.max(1, height - vh),
    };
  });
  return { vh, bounds };
}

function isEquivalent(a, b) {
  if (a.vh !== b.vh) return false;
  const keys = new Set([...Object.keys(a.bounds), ...Object.keys(b.bounds)]);
  for (const k of keys) {
    const x = a.bounds[k];
    const y = b.bounds[k];
    if (!x || !y) return false;
    if (
      Math.abs(x.start - y.start) > MEASURE_TOLERANCE ||
      Math.abs(x.height - y.height) > MEASURE_TOLERANCE
    ) {
      return false;
    }
  }
  return true;
}

const EMPTY = { vh: 900, bounds: {} };

export function ScrollStage({ children }) {
  const { scrollY, scrollYProgress } = useScroll();
  const [snapshot, setSnapshot] = useState(EMPTY);
  const frameRef = useRef(0);
  const mutateTimerRef = useRef(0);

  const remeasure = useCallback(() => {
    if (frameRef.current) cancelAnimationFrame(frameRef.current);
    frameRef.current = requestAnimationFrame(() => {
      frameRef.current = 0;
      setSnapshot((prev) => {
        const next = measure();
        return isEquivalent(prev, next) ? prev : next;
      });
    });
  }, []);

  useEffect(() => {
    remeasure();

    window.addEventListener('resize', remeasure);
    window.addEventListener('orientationchange', remeasure);

    // Lazily-loaded sections change document height after mount.
    let ro;
    if (typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(remeasure);
      ro.observe(document.documentElement);
    }

    // Catches lazy chunks inserting new [data-chapter] nodes.
    const mo = new MutationObserver(() => {
      if (mutateTimerRef.current) clearTimeout(mutateTimerRef.current);
      mutateTimerRef.current = setTimeout(remeasure, 150);
    });
    mo.observe(document.body, { childList: true, subtree: true });

    // Fonts and images change layout height after first paint.
    window.addEventListener('load', remeasure);

    return () => {
      window.removeEventListener('resize', remeasure);
      window.removeEventListener('orientationchange', remeasure);
      window.removeEventListener('load', remeasure);
      if (ro) ro.disconnect();
      mo.disconnect();
      if (mutateTimerRef.current) clearTimeout(mutateTimerRef.current);
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [remeasure]);

  const value = useMemo(
    () => ({ scrollY, scrollYProgress, ...snapshot }),
    [scrollY, scrollYProgress, snapshot]
  );

  return (
    <ScrollStageContext.Provider value={value}>
      {children}
    </ScrollStageContext.Provider>
  );
}

export function useScrollStage() {
  const ctx = useContext(ScrollStageContext);
  if (!ctx) {
    throw new Error('useScrollStage must be used inside <ScrollStage>');
  }
  return ctx;
}

/**
 * Progress of one chapter, as a MotionValue clamped to 0..1.
 *
 * mode 'travel' → 0 when the chapter's top reaches the viewport top,
 *                 1 when its bottom does. (default, for scrolling content)
 * mode 'pin'    → 0..1 across the distance a sticky stage stays pinned.
 * mode 'enter'  → 0 when the chapter's top is at the bottom of the viewport,
 *                 1 when it reaches the top. Use this for anything that must
 *                 happen while the chapter is arriving on screen — keying
 *                 arrival to 'travel' leaves the section invisible for the
 *                 whole time it is rising into view.
 */
export function useChapterProgress(id, mode = 'travel') {
  const { scrollY, bounds, vh } = useScrollStage();
  const b = bounds[id];
  const start = b ? b.start : 0;
  const end = b
    ? mode === 'pin'
      ? b.pinEnd
      : mode === 'enter'
        ? b.start
        : b.start + b.height
    : 1;
  const from = mode === 'enter' ? start - vh : start;
  return useTransform(scrollY, [from, Math.max(from + 1, end)], [0, 1], {
    clamp: true,
  });
}

/** Whole-document progress, 0..1. */
export function useGlobalProgress() {
  return useScrollStage().scrollYProgress;
}

/**
 * Any media query as a boolean. Exported so layout-critical components can
 * branch on the same breakpoints their own markup uses, instead of each
 * component inventing a second subscription.
 */
export function useMediaQuery(query) {
  const [matches, setMatches] = useState(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return false;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia(query);
    const onChange = () => setMatches(mq.matches);
    onChange();
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [query]);

  return matches;
}

export function usePrefersReducedMotion() {
  return useMediaQuery('(prefers-reduced-motion: reduce)');
}

/** Desktop narrative runs the full 12-column choreography. */
export function useIsMobile() {
  return useMediaQuery('(max-width: 1023px)');
}