import { useSyncExternalStore } from 'react';

/**
 * The floating-panel system.
 *
 * One geometry and one material, shared by every floating capsule in the
 * interface: the three Navbar capsules and the numbered chapter capsules
 * (02 / 03 / 04 / 05). The panels are not the same width — width belongs to
 * their content — but they are the same physical object, so a chapter marker
 * and a navigation capsule share one height, one radius, one border, one
 * padding rhythm, one surface, one sheen and one elevation.
 *
 * The values here are the Navbar's own separated-capsule geometry, which was
 * already the system's baseline: 44px tall, radius 22 (a true capsule, half the
 * height), 1px outline, 13px of side padding. Nothing below invents a second
 * number — `Navbar.jsx` reads its geometry from these constants, and
 * `SectionHeader.jsx` reads its box and material from the same constants.
 */

/* ── Geometry ─────────────────────────────────────────────────────────────
   Declared once so the capsules cannot drift apart at any breakpoint. */
export const PANEL_HEIGHT = 44;
export const PANEL_RADIUS = PANEL_HEIGHT / 2;
export const PANEL_BORDER = 1;
export const PANEL_PAD_X = 13;
export const PANEL_GAP = 12; // number · divider · title

/* ── Material ─────────────────────────────────────────────────────────────
   A hard, nearly opaque surface rather than glass: at 44px the blur buys
   nothing, and opacity is what stops a heading passing underneath from staying
   readable through a capsule. One outline for every panel; one inner highlight
   along the top edge; one elevation. Welded or separated, Navbar or chapter. */
const LIGHT = {
  surface: 'rgba(255, 255, 255, 0.93)',
  /* The disclosure only: it sits directly on the capsule it unfolds from, so it
     carries a touch more body. */
  panelSurface: 'rgba(255, 255, 255, 0.98)',
  tone: '28, 28, 28',
  edgeAlpha: 0.12,
  edge: 'rgba(28, 28, 28, 0.12)',
  sheen: 'inset 0 1px 0 rgba(255, 255, 255, 0.45)',
  elevation:
    '0 1px 2px rgba(28, 28, 28, 0.05), 0 2px 6px -2px rgba(28, 28, 28, 0.10), 0 14px 32px -20px rgba(28, 28, 28, 0.35)',
};

const DARK = {
  surface: 'rgba(20, 20, 22, 0.94)',
  panelSurface: 'rgba(20, 20, 22, 0.97)',
  tone: '250, 250, 250',
  edgeAlpha: 0.14,
  edge: 'rgba(250, 250, 250, 0.14)',
  sheen: 'inset 0 1px 0 rgba(255, 255, 255, 0.07)',
  elevation: '0 2px 8px -2px rgba(0, 0, 0, 0.5), 0 16px 38px -22px rgba(0, 0, 0, 1)',
};

/** The surface, outline, highlight and elevation for one theme. */
export const panelMaterial = (isDark) => (isDark ? DARK : LIGHT);

/**
 * The app's single theme switch is the `dark` class on <html>, which App
 * mirrors from its own state. Components handed `isDarkMode` as a prop use the
 * prop; the chapter capsules are rendered from four separate sections deep in
 * the tree and are given no theme, so they read the class itself — the same
 * single source, without threading a prop through components this change has no
 * business touching.
 */
const readDark = () =>
  typeof document !== 'undefined' && document.documentElement.classList.contains('dark');

const subscribeDark = (onChange) => {
  if (typeof MutationObserver === 'undefined') return () => {};
  const mo = new MutationObserver(onChange);
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
  return () => mo.disconnect();
};

export function useIsDarkMode() {
  return useSyncExternalStore(subscribeDark, readDark, () => false);
}