import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import {
  animate,
  useMotionValue,
  useMotionValueEvent,
  useTransform,
  motion as Motion,
} from 'framer-motion';
import { Moon, Sun, Globe } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import LiquidGlass from './LiquidGlass';
import {
  PANEL_HEIGHT,
  PANEL_PAD_X,
  PANEL_RADIUS,
  panelMaterial,
} from './floatingPanel';
import {
  seg,
  useChapterProgress,
  useMediaQuery,
  usePrefersReducedMotion,
  useScrollStage,
} from './scroll/ScrollStage';

/**
 * Floating navigation — one object that reorganises itself.
 *
 * There is only one set of nodes here and there are always the same three of
 * them. At the top of the Hero they sit flush against one another and share a
 * single surface, so they read as one bar: logo left, links centre, controls
 * right. Scrolling does not swap a bar for a cluster — it opens the gaps
 * between those same three elements and lets each one take on its own outline,
 * radius and shadow, so the bar separates into three coordinated objects:
 *
 *     [ LOGO ]      [ HOME ABOUT PROJECTS RESUME CONTACT ]      [ UZ ☼ ☰ ]
 *
 * Every continuous property is derived from the one scroll MotionValue
 * ScrollStage already maintains, through MotionValue transforms. There is no
 * scroll listener in this file, no per-frame React render and no second scroll
 * system: the whole morph is arithmetic on that single value.
 *
 * The unified state is not a separate surface that fades out. It is the sum of
 * the three capsules — at rest they are welded into one another, so their
 * identical backgrounds, square inner corners and coincident borders read as a
 * single rounded bar. Verified by walking a scanline across it: at the top of
 * the Hero it is one uninterrupted run of surface; past the Hero, three.
 *
 * `.glass3d` is still deliberately not used. Its `position: relative;
 * z-index: 4` and `.glass3d > * { position: relative; z-index: 6 }` are
 * unlayered rules that would rewrite the positioning of these capsules.
 * The material is `.liquid-glass` in `index.css`, with its optical layers
 * in `./LiquidGlass`: a filtered backdrop, a directional rim, a continuous
 * vertical light band and a pointer specular. Glass3D itself is unchanged.
 *
 * The separated state is not this file's private geometry: its height, radius,
 * padding, outline and elevation are read from `./floatingPanel`, the same
 * system the numbered chapter capsules are built from. The constants below
 * are therefore only the *unified* bar — its own state, welded shut — plus the
 * values the morph travels between.
 */

/* ── Geometry ─────────────────────────────────────────────────────────────
   Both states are declared here once, so the unified bar and the separated
   capsules cannot drift apart. */
const NAV_QUERY = '(min-width: 768px)';

/** The page's own content inset, so the capsules land on the same measure as
 *  everything below them (px-6 / sm:px-10 / lg:px-16). */
const insetFor = (w) => (w < 640 ? 24 : w < 1024 ? 40 : 64);

const WELD = 1; // how far each piece overlaps its neighbour while welded shut.
                 // The unified bar has no clear gap at all — the three surfaces
                 // are one surface, and the thin outline that runs across the
                 // whole bar is simply the sum of their shared edges.
const PAD_X_REST = 10; // capsule padding, unified → separated. The separated
                        // value is the shared panel's own padding.
const BAR_H_REST = 48; // bar height, unified → separated. The separated value is
                        // the shared panel's own height.
const RAIL_TOP_REST = 20; // distance from the viewport edge, unified → separated
const RAIL_TOP_SPLIT = 14;
const RADIUS_BAR = 16; // outer corner radius of the unified bar; a piece travels
                        // to the shared panel's radius as it becomes its own
                        // object
const LINKS_INSET = 12; // slack the centre tile keeps around the five links
const MENU_W = 36; // hamburger
const MENU_GAP = 6;
const PANEL_W = 360; // widest the disclosure may become
const PANEL_W_REST = 460;

/* ── The separation curve ────────────────────────────────────────────────
   One normalized progress value drives the whole morph; everything else is a
   response curve of it, never a second timeline. `travel` is that progress:
   the scroll window, eased so the pieces leave and arrive without a snap.

   The separation is staged the way iOS separates a notification from its
   actions. First the shared boundary cracks: the welded rim patch disappears
   while the gap is still a few pixels. Then `detach` takes over — the adjoining
   corners round off as each cut face gains its own outline and rim light, so
   they become the rounded ends of two independent surfaces rather than square
   slabs. Only after that do the pieces finish drifting to their resting
   places. The old code had this backwards: the pieces travelled for most of
   the morph with square inner corners and invisible side edges, which read as
   rectangular slabs sliding apart rather than one surface coming apart.

   All three curves are pure functions of the same normalized progress, so the
   separation is identical in both scroll directions and cannot drift. */
const MORPH_WINDOW = [0.06, 0.6];
/* Corners begin to turn after the crack has opened (so a radius never cuts a
   notch into the welded bar) and are fully round as the capsules detach. */
const DETACH_WINDOW = [0.02, 0.45];
/* The 1px welded rim patch dissolves naturally across the opening of the crack. */
const SEAM_WINDOW = [0, 0.08];
/* The disclosure trigger grows into the right capsule once the three pieces
   are already independent, so the controls settle last. */
const MENU_WINDOW = [0.55, 0.9];

/** Smoothstep: no overshoot, no bounce — the pieces settle, they do not snap. */
const smooth = (v) => v * v * (3 - 2 * v);

/**
 * Width of a piece's content, as a MotionValue.
 *
 * The capsules are sized from their own contents rather than from constants,
 * because those contents are not fixed: the logo is an image, the links change
 * language, and both tighten at narrower widths. Sub-pixel churn is ignored so
 * a font swap cannot ripple through the geometry chain.
 */
function useContentWidth(ref, mv) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    let live = true;
    const read = () => {
      if (!live || !el.isConnected) return;
      const next = Math.round(el.offsetWidth);
      if (Math.abs(mv.get() - next) > 0.5) mv.set(next);
    };
    read();
    let ro;
    if (typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(read);
      ro.observe(el);
    }
    // The display faces load after first paint; measure again once they are in.
    if (typeof document !== 'undefined' && document.fonts?.ready) {
      document.fonts.ready.then(read, () => {});
    }
    return () => {
      live = false;
      if (ro) ro.disconnect();
    };
  }, [mv, ref]);
}

export default function Navbar({ toggleTheme, isDarkMode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeId, setActiveId] = useState('hero');
  const { lang, toggleLanguage, t } = useLanguage();
  const { scrollY, bounds } = useScrollStage();
  const reduced = usePrefersReducedMotion();

  /* Below 768px there is no room for a centre capsule at all, so the same
     spatial idea is reduced to two pieces and the five links live in the
     disclosure. This mirrors the `md:` classes on the markup exactly. */
  const isSplit = useMediaQuery(NAV_QUERY);

  const menuRef = useRef(null);
  const toggleRef = useRef(null);
  const headerRef = useRef(null);
  const firstLinkRef = useRef(null);
  const linksRef = useRef(null);
  const logoRef = useRef(null);
  const controlsRef = useRef(null);
  const linkRefs = useRef([]);

  /* Memoised so the label list is stable between renders: it is both a render
     input and an effect dependency, and a fresh array each render would restart
     the measurement work below every frame. `t` is a new function identity on
     every render and reads nothing but `lang`, so `lang` is the real input. */
  const navLinks = useMemo(
    () => [
      { id: 'hero', title: t('nav.home'), href: '#' },
      { id: 'about', title: t('nav.about'), href: '#about' },
      { id: 'projects', title: t('nav.projects'), href: '#projects' },
      { id: 'engineering', title: t('nav.resume'), href: '#resume' },
      { id: 'contact', title: t('nav.contact'), href: '#contact' },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [lang]
  );

  /**
   * Active section, read from the offsets ScrollStage already measured —
   * no second observer and no per-scroll render. State is only written when
   * the section actually changes, so scrolling within a chapter costs nothing.
   */
  useMotionValueEvent(scrollY, 'change', (v) => {
    let next = navLinks[0].id;
    for (const l of navLinks) {
      const b = bounds[l.id];
      if (b && v >= b.start - window.innerHeight * 0.4) next = l.id;
    }
    setActiveId((prev) => (prev === next ? prev : next));
  });

  /* ── Morph driver ──────────────────────────────────────────────────────
     One progress value for the whole navbar, read from the Hero's own pinned
     runway so the separation happens while the hero is still leaving. A page
     without a hero has no runway to read, so it falls back to a short fixed
     lead-in; nothing else about the morph changes. */
  const heroProgress = useChapterProgress('hero', 'pin');
  const leadIn = useTransform(scrollY, [0, 320], [0, 1], { clamp: true });
  const source = bounds.hero ? heroProgress : leadIn;

  /* Reduced motion quantises the morph to its two resting states instead of
     travelling between them: the same object, the same content, no large
     spatial animation. */
  const morph = useTransform(source, (v) => (reduced ? (v > 0.5 ? 1 : 0) : v));
  /* The one normalized progress every part of the morph reads. */
  const travel = useTransform(morph, (v) =>
    smooth(seg(v, MORPH_WINDOW[0], MORPH_WINDOW[1]))
  );
  /* The detachment response: radii, cut-face outlines and the side rims all
     come from this, so the boundary opens, the corners round and the optics
     become per-capsule as one event rather than three that drift apart. */
  const detach = useTransform(travel, (v) =>
    smooth(seg(v, DETACH_WINDOW[0], DETACH_WINDOW[1]))
  );
  /* The disclosure trigger has its own curve of the same progress: it belongs
     to the settled right capsule, not to the separation. */
  const menuReveal = useTransform(travel, (v) =>
    smooth(seg(v, MENU_WINDOW[0], MENU_WINDOW[1]))
  );

  /* ── Viewport ───────────────────────────────────────────────────────────
     A MotionValue rather than state: it feeds the geometry chain and never
     re-renders the tree. */
  const vw = useMotionValue(typeof window === 'undefined' ? 1280 : window.innerWidth);
  useEffect(() => {
    const onResize = () => vw.set(window.innerWidth);
    window.addEventListener('resize', onResize);
    window.addEventListener('orientationchange', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('orientationchange', onResize);
    };
  }, [vw]);

  /* ── Pointer specular ──────────────────────────────────────────────────
     The glass reflection follows the pointer without touching React: one
     passive listener on the header, one rAF, three CSS-variable writes. Fine
     pointers only, and never under reduced motion. */
  const finePointer = useMediaQuery('(hover: hover) and (pointer: fine)');
  useEffect(() => {
    const header = headerRef.current;
    if (!header || reduced || !finePointer) return undefined;
    const pieces = [...header.querySelectorAll('.liquid-glass')];
    if (!pieces.length) return undefined;
    let raf = 0;
    let clientX = 0;
    let clientY = 0;
    const apply = () => {
      raf = 0;
      for (const el of pieces) {
        const r = el.getBoundingClientRect();
        if (r.width < 1 || r.height < 1) continue;
        const x = Math.min(1, Math.max(0, (clientX - r.left) / r.width));
        const y = Math.min(1, Math.max(0, (clientY - r.top) / r.height));
        const inside =
          clientX >= r.left && clientX <= r.right && clientY >= r.top && clientY <= r.bottom;
        el.style.setProperty('--lg-mx', x.toFixed(3));
        el.style.setProperty('--lg-my', y.toFixed(3));
        el.style.setProperty('--lg-lit', inside ? '1' : '0');
      }
    };
    const onMove = (e) => {
      clientX = e.clientX;
      clientY = e.clientY;
      if (!raf) raf = requestAnimationFrame(apply);
    };
    const onLeave = () => {
      if (raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
      for (const el of pieces) el.style.setProperty('--lg-lit', '0');
    };
    /* `pointerleave` does not bubble, and the header itself is
       `pointer-events: none`, so the direct leaves have to be caught on the
       capsules. Without this the last capsule under the pointer would keep its
       frozen highlight after the pointer had already gone. */
    const onLeavePiece = (e) => {
      e.currentTarget.style.setProperty('--lg-lit', '0');
    };
    for (const el of pieces) el.addEventListener('pointerleave', onLeavePiece);
    header.addEventListener('pointermove', onMove, { passive: true });
    header.addEventListener('pointerleave', onLeave);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      for (const el of pieces) el.removeEventListener('pointerleave', onLeavePiece);
      header.removeEventListener('pointermove', onMove);
      header.removeEventListener('pointerleave', onLeave);
    };
  }, [finePointer, reduced]);

  /* ── Measured content ───────────────────────────────────────────────────
     Three widths: the logo row, the five links, and the always-present
     language/theme controls. */
  const logoW = useMotionValue(0);
  const linksW = useMotionValue(0);
  const controlsW = useMotionValue(0);
  useContentWidth(logoRef, logoW);
  useContentWidth(linksRef, linksW);
  useContentWidth(controlsRef, controlsW);

  /* ── Geometry ─────────────────────────────────────────────────────────
     The two layouts are computed independently and then blended by a single
     factor, so the resting composition is always exactly centred and the
     separated composition is always exactly on the content measure. */

  const padX = useTransform(travel, (v) => PAD_X_REST + (PANEL_PAD_X - PAD_X_REST) * v);
  const barH = useTransform(travel, (v) => BAR_H_REST + (PANEL_HEIGHT - BAR_H_REST) * v);
  const railTop = useTransform(travel, (v) => RAIL_TOP_REST + (RAIL_TOP_SPLIT - RAIL_TOP_REST) * v);
  const inset = useTransform(vw, (w) => insetFor(w));

  /* The hamburger belongs to the right capsule only once the pieces have
     separated — while they are one bar, its five links are already on screen. */
  const menuW = useTransform(menuReveal, (v) => (isSplit ? MENU_W * v : MENU_W));
  const menuGap = useTransform(menuReveal, (v) => (isSplit ? MENU_GAP * v : MENU_GAP));

  /* Widths. The centre tile is the five links plus its own border plus the
     slack that turns them from an inner pill into a capsule. */
  const wLeft = useTransform(
    [travel, logoW],
    ([e, l]) => l + 2 * (PAD_X_REST + (PANEL_PAD_X - PAD_X_REST) * e) + 2
  );
  const wLinks = useTransform(linksW, (c) => (c > 20 ? c + LINKS_INSET : 0));
  const wRight = useTransform(
    [menuReveal, travel, controlsW],
    ([m, e, c]) =>
      c + MENU_GAP * m + MENU_W * m + 2 * (PAD_X_REST + (PANEL_PAD_X - PAD_X_REST) * e) + 2
  );

  /* Unified geometry — the same three pieces, welded into one surface and
     centred as a single bar. There is no gap between them here: the pieces
     overlap by WELD so their borders coincide and read as a single outline,
     and the 1px outline across the top and bottom of the bar is the sum of
     three shared edges rather than three separate ones. */
  const restSpan = useTransform(
    [wLeft, wLinks, wRight],
    ([l, c, r]) => l + c + r - (c > 20 ? 2 * WELD : WELD)
  );
  const restLeft = useTransform([vw, restSpan], ([v, s]) => (v - s) / 2);
  const restLinks = useTransform(
    [restLeft, wLeft, wLinks],
    ([x, l, c]) => x + l - (c > 20 ? WELD : 0)
  );
  const restRight = useTransform(
    [restLinks, wLinks, restLeft, wLeft],
    ([x, c, rl, wl]) => (c > 20 ? x + c - WELD : rl + wl - WELD)
  );

  /* Separated geometry — left capsule on the page inset, centre capsule on the
     viewport's centre line, right capsule on the right inset. */
  const splitLinks = useTransform([vw, wLinks], ([v, c]) => (c > 20 ? (v - c) / 2 : -600));
  const splitRight = useTransform([vw, inset, wRight], ([v, p, r]) => v - p - r);

  /* One blend factor for all three, so the pieces move as one system. */
  const xLeft = useTransform([restLeft, inset, travel], ([a, b, e]) => a + (b - a) * e);
  const xLinks = useTransform([restLinks, splitLinks, travel], ([a, b, e]) => a + (b - a) * e);
  const xRight = useTransform([restRight, splitRight, travel], ([a, b, e]) => a + (b - a) * e);

  /* ── Material ──────────────────────────────────────────────────────────
     Every material response is a curve of `detach`, never a second timeline:
     the crack opens (SEAM_WINDOW), the adjoining corners round (`detach`),
     and each cut face takes on its own outline and rim light at the same
     moment, so the three events cannot drift apart or step. */
  const outerRadius = useTransform(
    detach,
    (v) => RADIUS_BAR + (PANEL_RADIUS - RADIUS_BAR) * v
  );
  const innerRadius = useTransform(detach, (v) => PANEL_RADIUS * v);
  const sheen = useTransform(travel, (v) => 0.25 + 0.75 * v);
  const edgeLight = useTransform(detach, (v) => smooth(v));
  /* The 1px joint patch is a welded-state device: it fills the border-width
     gap between two neighbouring pieces' optical layers. It exists only for
     the first pixels of the crack, and is gone before the capsule gap reads. */
  const seamPatch = useTransform(travel, (v) =>
    1 - smooth(seg(v, SEAM_WINDOW[0], SEAM_WINDOW[1]))
  );

  /* Outline and elevation are the shared panel's, for all three pieces: the
     separated composition still reads as three objects of the same kind, and
     those are the same objects as the chapter capsules. The body of the glass
     is `.liquid-glass`; it is deliberately lighter than the shared opaque
     `surface`, because the backdrop filter and the optics do the rest. */
  const { panelSurface, edge, tone, edgeAlpha, elevation } =
    panelMaterial(isDarkMode);

  /* Shadows emerge progressively: subtle grounded bar elevation while welded,
     blooming into independent floating elevations as capsules detach. */
  const restElevation = isDarkMode
    ? '0 1px 4px -1px rgba(0, 0, 0, 0.4), 0 8px 20px -14px rgba(0, 0, 0, 0.7)'
    : '0 1px 2px rgba(28, 28, 28, 0.04), 0 2px 6px -2px rgba(28, 28, 28, 0.08), 0 8px 18px -12px rgba(28, 28, 28, 0.20)';
  const splitElevation = elevation;
  const capsuleShadow = useTransform(
    detach,
    [0, 1],
    [restElevation, splitElevation]
  );

  /* Every piece carries the same 1px outline, welded or separated, so the bar
     reads as one object. The seams between the pieces are the exception: at
     rest the three pieces overlap, and a dark hairline on each shared edge
     would draw two vertical lines through the unified bar. `seamColor` follows
     `detach`, the same curve that rounds the cut faces, so an outline appears
     exactly as the surfaces stop sharing an edge. */
  const seamColor = useTransform(detach, (v) => {
    const a = edgeAlpha * smooth(v);
    return `rgba(${tone}, ${a.toFixed(3)})`;
  });
  /* And its mirror: the inner outline around the five links, which is what
     marks them as part of the bar until the capsule takes over. */
  const linkSeam = useTransform(
    travel,
    (v) => `rgba(${tone}, ${(edgeAlpha * 0.7 * (1 - smooth(seg(v, 0.1, 0.55)))).toFixed(3)})`
  );
  /* The five links spread by a couple of pixels as the capsule forms — a real
     width change in the piece, not an effect painted over it. */
  const linkGap = useTransform(travel, (v) => 2 + 2 * v);
  const linkScale = useTransform(travel, (v) => 0.985 + 0.015 * v);
  const menuOpacity = useTransform(menuReveal, (v) => v);

  /* One surface, one border and one shadow for all three pieces, so the
     separated composition still reads as three objects of the same kind. */
  const pieceClass =
    'liquid-glass pointer-events-auto absolute left-0 top-0 flex items-center border';
  /* The centre and controls pieces each have a neighbour on their left, so
     they carry the joint patch that keeps the rim continuous across the 1px
     seam. The logo has no left-hand neighbour and must not paint outside the
     bar. */
  const seamLeftClass = 'liquid-glass--seam-left';

  /* ── Disclosure ────────────────────────────────────────────────────────
     The menu hangs from the right capsule: it starts exactly that capsule's
     width and opens to a compact panel still flush with its right edge, so it
     reads as the same object unfolding rather than a sheet appearing. */
  const panelW = useTransform(
    [wRight, travel, vw],
    ([r, e, v]) => {
      const max = Math.min(PANEL_W, v - 2 * insetFor(v));
      const rest = Math.min(r, PANEL_W_REST);
      return rest + (max - rest) * e;
    }
  );
  const panelX = useTransform([xRight, wRight, panelW], ([x, r, w]) => x + r - w);

  /* ── Active state ──────────────────────────────────────────────────────
     One marker travels between the links instead of five separate marks.
     Measured on the few events that can move a link's box, never on scroll. */
  const chipX = useMotionValue(0);
  const chipW = useMotionValue(0);
  const [chipReady, setChipReady] = useState(false);
  const chipAnimations = useRef([]);

  useEffect(() => {
    const ul = linksRef.current;
    const index = navLinks.findIndex((l) => l.id === activeId);
    const el = index >= 0 ? linkRefs.current[index] : null;
    if (!ul || !el) return undefined;

    const stop = () => chipAnimations.current.forEach((a) => a.stop());
    stop();
    chipAnimations.current = [];

    if (reduced) {
      chipX.set(el.offsetLeft);
      chipW.set(el.offsetWidth);
      setChipReady(true);
      return undefined;
    }
    const options = { type: 'spring', stiffness: 420, damping: 38, mass: 0.7 };
    chipAnimations.current = [
      animate(chipX, el.offsetLeft, options),
      animate(chipW, el.offsetWidth, options),
    ];
    setChipReady(true);
    return stop;
  }, [activeId, navLinks, reduced, chipX, chipW]);

  /**
   * `splitState` is the only boolean the morph needs and it changes once per
   * crossing. It exists so the hamburger — which sits in the right capsule the
   * whole time but only has width once the pieces have separated — never
   * becomes a half-sized or invisible focus stop.
   */
  const [splitState, setSplitState] = useState(false);
  useMotionValueEvent(morph, 'change', (v) => {
    const next = v > 0.5;
    setSplitState((prev) => (prev === next ? prev : next));
  });
  useEffect(() => {
    setSplitState(morph.get() > 0.5);
  }, [morph]);
  const menuReachable = !isSplit || splitState;

  const closeMenu = useCallback(() => setIsOpen(false), []);
  const openMenu = useCallback(() => setIsOpen(true), []);

  // Escape closes the menu and returns focus to its trigger.
  useEffect(() => {
    if (!isOpen) return undefined;
    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        closeMenu();
        toggleRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, closeMenu]);

  // Move focus into the panel as it opens, so the links are one Tab away
  // rather than several Tabs past the trigger.
  useEffect(() => {
    if (isOpen) firstLinkRef.current?.focus();
  }, [isOpen]);

  // Click anywhere outside dismisses the menu.
  useEffect(() => {
    if (!isOpen) return undefined;
    const onPointerDown = (e) => {
      if (menuRef.current?.contains(e.target)) return;
      if (toggleRef.current?.contains(e.target)) return;
      closeMenu();
    };
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [isOpen, closeMenu]);

  return (
    /* Real floating UI: fixed, and above every in-page layer, so no section
       marker can ever paint across it. pointer-events-none here; the pieces
       and the disclosure re-enable it. */
    <header ref={headerRef} className="fixed inset-x-0 top-0 z-[70] pointer-events-none">
      <Motion.nav
        aria-label={t('meta.primaryNav')}
        style={{ paddingTop: railTop }}
        className="relative w-full"
      >
        {/* The rail is exactly as tall as the capsules, so the disclosure always
            hangs from their bottom edge. */}
        <Motion.div className="relative w-full" style={{ height: barH }}>
          {/* ── LEFT · the logo, its own capsule ─────────────────────────── */}
          <Motion.div
            style={{
              x: xLeft,
              width: wLeft,
              height: barH,
              boxShadow: capsuleShadow,
              paddingLeft: padX,
              paddingRight: padX,
              borderTopLeftRadius: outerRadius,
              borderBottomLeftRadius: outerRadius,
              borderTopRightRadius: innerRadius,
              borderBottomRightRadius: innerRadius,
              borderTopColor: edge,
              borderBottomColor: edge,
              borderLeftColor: edge,
              borderRightColor: seamColor,
            }}
            className={`${pieceClass} justify-start`}
          >
            <LiquidGlass sheen={sheen} edge={edgeLight} seam={seamPatch} />
            <a
              href="#"
              aria-label={`${t('nav.home')} — Umar`}
              className="relative z-10 -m-1 rounded-lg p-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-white transition-opacity duration-200 hover:opacity-70 dark:focus-visible:ring-offset-[#141416]"
            >
              {/* The mark's own box. Both logo PNGs are a 483×517 canvas whose ink
                  occupies only 345×355 of it — 69px of air left and right, 65
                  above and 97 below — so sizing the <img> by height sizes the
                  canvas, not the mark, and the `inline-flex` wrapper that used
                  to hold it sat on the text baseline, whose descender pushed
                  the visible ink ~4.6px above the middle of the capsule.
                  This wrapper *is* the ink box, and the canvas is laid over it
                  at the one scale that makes the ink fill it, as percentages of
                  the wrapper so the ratio holds at every breakpoint. The element
                  that flex centres, and that measures this capsule's width, is
                  then the mark itself. */}
              <div ref={logoRef} className="relative aspect-[345/355] h-[26px] sm:h-[30px]">
                <img
                  src={isDarkMode ? '/images/logo_dark.png' : '/images/logo_light.png'}
                  alt="UMX"
                  className="absolute left-[-20%] top-[-18.31%] h-[145.63%] w-[140%] max-w-none"
                />
              </div>
            </a>
          </Motion.div>

          {/* ── CENTRE · the five links, in one shared capsule ───────────── */}
          <Motion.div
            style={{
              x: xLinks,
              width: wLinks,
              height: barH,
              boxShadow: capsuleShadow,
              borderTopLeftRadius: innerRadius,
              borderTopRightRadius: innerRadius,
              borderBottomLeftRadius: innerRadius,
              borderBottomRightRadius: innerRadius,
              borderTopColor: edge,
              borderBottomColor: edge,
              borderLeftColor: seamColor,
              borderRightColor: seamColor,
            }}
            className={`${pieceClass} ${seamLeftClass} hidden shrink-0 justify-center md:flex`}
          >
            <LiquidGlass sheen={sheen} edge={edgeLight} seam={seamPatch} />

            {/* The links themselves: one pill, one gap rhythm. shrink-0 and
                nowrap keep the measured width independent of the tile, so the
                capsule can be sized without ever squeezing the type. */}
            <Motion.ul
              ref={linksRef}
              aria-label={t('meta.sections')}
              style={{ gap: linkGap, scale: linkScale, borderColor: linkSeam }}
              className="relative z-10 m-0 flex min-w-max shrink-0 list-none items-center whitespace-nowrap rounded-full border px-0 py-0"
            >
              {/* Active marker — one shared object that travels between links. */}
              <Motion.span
                aria-hidden="true"
                style={{ x: chipX, width: chipW, opacity: chipReady ? 1 : 0 }}
                className="absolute inset-y-1 left-0 rounded-full bg-primary-text/[0.06] dark:bg-white/[0.07]"
              />
              {navLinks.map((link, i) => {
                const isActive = activeId === link.id;
                return (
                  <li key={link.id} ref={(el) => { linkRefs.current[i] = el; }}>
                    <a
                      href={link.href}
                      aria-current={isActive ? 'page' : undefined}
                      className={`relative block rounded-full px-2.5 py-2 font-host text-[10px] font-bold uppercase leading-[1.05] tracking-[0.06em] transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-white md:px-2 lg:px-3 lg:text-[11px] lg:tracking-[0.12em] dark:focus-visible:ring-offset-[#141416] ${
                        isActive
                          ? 'text-primary-text dark:text-primary-text-dark'
                          : 'text-primary-text/55 hover:text-accent dark:text-primary-text-dark/55 dark:hover:text-accent'
                      }`}
                    >
                      {link.title}
                    </a>
                  </li>
                );
              })}
            </Motion.ul>
          </Motion.div>

          {/* ── RIGHT · language, theme, menu ───────────────────────────── */}
          <Motion.div
            style={{
              x: xRight,
              width: wRight,
              height: barH,
              boxShadow: capsuleShadow,
              paddingLeft: padX,
              paddingRight: padX,
              borderTopLeftRadius: innerRadius,
              borderBottomLeftRadius: innerRadius,
              borderTopRightRadius: outerRadius,
              borderBottomRightRadius: outerRadius,
              borderTopColor: edge,
              borderBottomColor: edge,
              borderRightColor: edge,
              borderLeftColor: seamColor,
            }}
            className={`${pieceClass} ${seamLeftClass} justify-start`}
          >
            <LiquidGlass sheen={sheen} edge={edgeLight} seam={seamPatch} />

            <div ref={controlsRef} className="relative z-10 inline-flex min-w-max shrink-0 items-center gap-1.5">
              <button
                type="button"
                onClick={toggleLanguage}
                aria-label={t('meta.changeLanguage', { lang: lang.toUpperCase() })}
                className="flex h-9 items-center gap-1.5 rounded-lg border border-transparent px-2 font-host text-[11px] font-bold uppercase tracking-[0.12em] text-primary-text/65 transition-colors duration-200 hover:border-primary-text/10 hover:text-primary-text dark:text-primary-text-dark/65 dark:hover:border-white/10 dark:hover:text-primary-text-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent cursor-pointer"
              >
                <Globe size={12} className="shrink-0 opacity-60" />
                <span>{lang}</span>
              </button>

              <button
                type="button"
                onClick={toggleTheme}
                aria-label={isDarkMode ? t('meta.changeTheme.toLight') : t('meta.changeTheme.toDark')}
                aria-pressed={isDarkMode}
                className="rounded-lg border border-transparent p-2 text-primary-text/65 transition-colors duration-200 hover:border-primary-text/10 hover:text-primary-text dark:text-primary-text-dark/65 dark:hover:border-white/10 dark:hover:text-primary-text-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent cursor-pointer"
              >
                {isDarkMode ? (
                  <Sun size={14} className="text-accent" />
                ) : (
                  <Moon size={14} className="text-primary-text/70 dark:text-primary-text-dark/70" />
                )}
              </button>
            </div>

            {/* The menu trigger is part of the right capsule, and gets its width
                only once the pieces have separated — while they are one bar the
                five links are already on screen. Below 768px it is always there,
                because the centre capsule never is. */}
            <Motion.span
              aria-hidden={!menuReachable}
              style={{ width: menuW, marginLeft: menuGap, opacity: menuOpacity }}
              className="relative z-10 inline-flex shrink-0 justify-end overflow-hidden"
            >
              <button
                ref={toggleRef}
                type="button"
                onClick={() => (isOpen ? (closeMenu(), toggleRef.current?.focus()) : openMenu())}
                aria-label={isOpen ? t('meta.closeMenu') : t('meta.openMenu')}
                aria-expanded={isOpen}
                aria-controls="navbar-menu"
                tabIndex={menuReachable ? 0 : -1}
                style={menuReachable ? undefined : { pointerEvents: 'none' }}
                className="relative h-9 w-9 shrink-0 rounded-lg border border-transparent transition-colors duration-200 hover:border-primary-text/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-[#141416] cursor-pointer"
              >
                <span
                  aria-hidden="true"
                  className={`absolute h-px w-4 bg-primary-text dark:bg-primary-text-dark transition-all duration-200 ${
                    isOpen ? 'rotate-45' : '-translate-y-[3px]'
                  }`}
                />
                <span
                  aria-hidden="true"
                  className={`absolute h-px w-4 bg-primary-text dark:bg-primary-text-dark transition-all duration-200 ${
                    isOpen ? 'opacity-0' : 'opacity-100'
                  }`}
                />
                <span
                  aria-hidden="true"
                  className={`absolute h-px w-4 bg-primary-text dark:bg-primary-text-dark transition-all duration-200 ${
                    isOpen ? '-rotate-45' : 'translate-y-[3px]'
                  }`}
                />
              </button>
            </Motion.span>
          </Motion.div>
        </Motion.div>

        {/* ── The disclosure ────────────────────────────────────────────────
            Hung from the right capsule's edge and opening to a compact panel,
            not a full-screen sheet. It serves the mobile composition and the
            separated desktop one alike — there is no second navigation. */}
        <Motion.div
          ref={menuRef}
          id="navbar-menu"
          hidden={!isOpen}
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: isOpen ? 1 : 0, y: isOpen ? 0 : -6 }}
          transition={{ duration: reduced ? 0 : 0.18, ease: [0.16, 1, 0.3, 1] }}
          style={{ x: panelX, width: panelW }}
          className="pointer-events-auto absolute left-0 top-full z-10 mt-2 overflow-hidden rounded-2xl border border-primary-text/10 shadow-[0_16px_36px_-18px_rgba(28,28,28,0.35)] dark:border-white/10 dark:shadow-[0_18px_40px_-20px_rgba(0,0,0,1)]"
        >
          <div style={{ backgroundColor: panelSurface }}>
            <ul className="p-1.5">
              {navLinks.map((link, i) => {
                const isActive = activeId === link.id;
                return (
                  <li key={link.id}>
                    <a
                      ref={i === 0 ? firstLinkRef : null}
                      href={link.href}
                      onClick={closeMenu}
                      aria-current={isActive ? 'page' : undefined}
                      className={`flex items-center justify-between gap-3 rounded-xl px-3.5 py-3 font-host text-xs font-bold uppercase tracking-[0.16em] transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                        isActive
                          ? 'bg-primary-text/[0.04] text-primary-text dark:bg-white/[0.05] dark:text-primary-text-dark'
                          : 'text-primary-text/60 hover:bg-primary-text/[0.03] hover:text-accent dark:text-primary-text-dark/60 dark:hover:bg-white/[0.04]'
                      }`}
                    >
                      <span className="flex items-center gap-3">
                        <span
                          aria-hidden="true"
                          className={`font-josefin text-[10px] tabular-nums ${
                            isActive
                              ? 'text-accent'
                              : 'text-primary-text/30 dark:text-primary-text-dark/30'
                          }`}
                        >
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        {link.title}
                      </span>
                      {isActive && (
                        <span aria-hidden="true" className="h-1 w-1 rounded-full bg-accent" />
                      )}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </Motion.div>
      </Motion.nav>
    </header>
  );
}