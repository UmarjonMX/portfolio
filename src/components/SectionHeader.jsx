import {
  PANEL_BORDER,
  PANEL_GAP,
  PANEL_HEIGHT,
  PANEL_PAD_X,
  PANEL_RADIUS,
  panelMaterial,
  useIsDarkMode,
} from './floatingPanel';

/**
 * The numbered chapter capsule — 02, 03, 04, 05.
 *
 * Not a marker drawn beside the chapters: the same floating panel the Navbar's
 * three capsules are made of, at the same height, radius, border, padding
 * rhythm, surface, highlight and elevation. Width is the only thing that varies,
 * because it belongs to the title; a longer title buys a wider capsule and
 * never a taller one, so all four chapters stay on one horizontal line and read
 * as the same object wherever they appear.
 */
export default function SectionHeader({ title, number }) {
  const material = panelMaterial(useIsDarkMode());

  return (
    /* The Navbar is fixed and sits above this in the stacking order, so the
       marker pins *below* it rather than across it. The offset clears the
       Navbar's tallest state — the unified bar, 68px — with room to breathe,
       and is far smaller than the page's own section padding. No spacer, and
       no change to any page-wide spacing. */
    <div className="sticky top-[88px] z-20 flex justify-center w-full mb-16 pointer-events-none">
      <div
        style={{
          height: PANEL_HEIGHT,
          gap: PANEL_GAP,
          paddingLeft: PANEL_PAD_X,
          paddingRight: PANEL_PAD_X,
          borderWidth: PANEL_BORDER,
          borderRadius: PANEL_RADIUS,
          backgroundColor: material.surface,
          borderColor: material.edge,
          boxShadow: material.elevation,
        }}
        className="pointer-events-auto relative flex items-center overflow-hidden border backdrop-blur-md transition-colors duration-300"
      >
        {/* The one shared top-edge highlight — the same hairline that keeps the
            Navbar capsules reading as solid objects rather than flat washes. */}
        <span
          aria-hidden="true"
          style={{ boxShadow: material.sheen }}
          className="pointer-events-none absolute inset-0 rounded-[inherit]"
        />

        <span className="relative font-josefin text-xs font-bold text-accent tracking-[0.2em] uppercase">
          {number}
        </span>
        <span
          aria-hidden="true"
          className="relative w-px h-3 bg-primary-text/20 dark:bg-primary-text-dark/20"
        />
        {/* `whitespace-nowrap` is the guarantee behind the shared height: a long
            title in a second language widens the capsule, it never wraps into
            the box. */}
        <span className="relative font-josefin text-sm font-bold tracking-[0.25em] text-primary-text dark:text-primary-text-dark uppercase whitespace-nowrap">
          {title}
        </span>
      </div>
    </div>
  );
}
