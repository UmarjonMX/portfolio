/**
 * Schematic preview frames.
 *
 * Drawn, not photographed — none of these projects has captured imagery, and
 * inventing a screenshot would misrepresent them. Each frame is a plain
 * description of the surface the product actually is: a phone carrying a
 * Telegram channel, a two-party conversation, a browser running a live WebGL
 * field, a publishing spread.
 *
 * They are art-directed rather than generic: every project gets geometry that
 * belongs to it, and every frame fills the space it is given instead of
 * floating inside it as a small centred object. The grid passes `md` (a wide,
 * short aperture) and the detail page passes `lg` (a full-measure plate), so
 * the same composition is described at two scales rather than redrawn twice.
 *
 * The frames carry no backdrop-filter and no fill of their own beyond hairlines
 * and small inner surfaces. The AmbientMesh is the background; a translucent
 * sheet at this size would read as haze over it.
 */
import { useId } from 'react';

const FRAME = {
  md: 'h-[300px] sm:h-[340px] lg:h-[380px]',
  lg: 'h-[360px] sm:h-[460px] lg:h-[600px]',
};

const HAIRLINE =
  'border-primary-text/12 dark:border-primary-text-dark/12';

/* Shared material tokens for the drawn chrome. */
const SURFACE = 'bg-primary-text/[0.035] dark:bg-primary-text-dark/[0.055]';
const SURFACE_2 = 'bg-primary-text/[0.06] dark:bg-primary-text-dark/[0.09]';
const EDGE = 'border-primary-text/10 dark:border-primary-text-dark/14';

/** A text line placeholder. `w` is a Tailwind width class. */
const Line = ({ w = 'w-full', h = 'h-[3px]', o = 'bg-primary-text/12 dark:bg-primary-text-dark/12' }) => (
  <div className={`${w} ${h} ${o} rounded-full`} />
);

/* ── Kitobiyot 12 — editorial / Telegram / literature ──────────────────────
   A phone carrying the channel, beside the editorial spread the post opens
   into. The phone is fixed-ratio and full-height; the spread takes whatever
   horizontal room is left, so the pair works at both scales. */
function Mobile() {
  return (
    <div className="flex h-full items-stretch justify-center gap-4 sm:gap-6 lg:gap-10 px-5 py-5 sm:py-6 lg:py-8">
      {/* Phone */}
      <div
        className={`h-full aspect-[9/19] shrink-0 rounded-[18px] border ${EDGE} ${SURFACE} overflow-hidden flex flex-col`}
      >
        <div className="flex items-center justify-between px-2.5 pt-2 pb-1.5">
          <div className="w-6 h-[3px] bg-primary-text/20 dark:bg-primary-text-dark/20 rounded-full" />
          <div className="w-8 h-[3px] bg-primary-text/20 dark:bg-primary-text-dark/20 rounded-full" />
        </div>

        {/* Channel header */}
        <div className="flex items-center gap-2 px-2.5 py-2 border-b border-primary-text/8 dark:border-primary-text-dark/10">
          <div className="w-6 h-6 rounded-full border border-accent/50 shrink-0" />
          <div className="min-w-0 flex-1 space-y-1.5">
            <Line w="w-3/4" h="h-[3px]" o="bg-primary-text/25 dark:bg-primary-text-dark/25" />
            <Line w="w-1/2" h="h-[2px]" />
          </div>
        </div>

        {/* Post: drop cap + headline + body */}
        <div className="flex-1 min-h-0 px-2.5 py-3 flex flex-col">
          <div className="flex gap-2">
            <div className="w-6 h-6 rounded-[3px] bg-accent/25 shrink-0" />
            <div className="flex-1 min-w-0 space-y-2 pt-0.5">
              <Line w="w-full" h="h-[3px]" o="bg-primary-text/30 dark:bg-primary-text-dark/30" />
              <Line w="w-2/3" h="h-[3px]" o="bg-primary-text/30 dark:bg-primary-text-dark/30" />
            </div>
          </div>

          <div className="mt-3 space-y-1.5 flex-1 min-h-0">
            <Line w="w-full" />
            <Line w="w-full" />
            <Line w="w-11/12" />
            <Line w="w-full" />
            <Line w="w-4/5" />
            <Line w="w-full" />
            <Line w="w-3/5" />
          </div>

          {/* "read more" rule */}
          <div className="mt-2 h-px w-full bg-accent/45" />
        </div>
      </div>

      {/* Editorial spread the post opens into. The channel's artifact is the
          written analysis, so the headline carries the weight here and the
          phone is the delivery mechanism beside it. */}
      <div className="flex-1 min-w-0 flex flex-col justify-center gap-3 sm:gap-4 lg:gap-5">
        <div className="flex items-center gap-3">
          <span className="font-josefin text-[9px] sm:text-[10px] font-bold tracking-[0.3em] uppercase text-accent/85 shrink-0">
            Tahlil
          </span>
          <div className="h-px flex-1 bg-primary-text/15 dark:bg-primary-text-dark/15" />
          <span className="font-josefin text-[9px] font-bold tracking-[0.2em] uppercase text-primary-text/30 dark:text-primary-text-dark/30 shrink-0 hidden sm:block">
            01
          </span>
        </div>

        {/* Headline, set at display scale — this is the artifact */}
        <div className="space-y-1.5 sm:space-y-2.5">
          <div className="h-4 sm:h-5.5 lg:h-8 w-full bg-primary-text/26 dark:bg-primary-text-dark/26 rounded-[2px]" />
          <div className="h-4 sm:h-5.5 lg:h-8 w-full bg-primary-text/26 dark:bg-primary-text-dark/26 rounded-[2px]" />
          <div className="h-4 sm:h-5.5 lg:h-8 w-3/5 bg-accent/45 rounded-[2px]" />
        </div>

        {/* Two-column body */}
        <div className="grid grid-cols-2 gap-3 sm:gap-5 pt-0.5">
          <div className="space-y-1.5">
            <Line w="w-full" h="h-[3px]" />
            <Line w="w-full" h="h-[3px]" />
            <Line w="w-10/11" h="h-[3px]" />
            <Line w="w-full" h="h-[3px]" />
            <Line w="w-3/4" h="h-[3px]" />
          </div>
          <div className="space-y-1.5">
            <Line w="w-full" h="h-[3px]" />
            <Line w="w-9/10" h="h-[3px]" />
            <Line w="w-full" h="h-[3px]" />
            <Line w="w-5/6" h="h-[3px]" />
            <Line w="w-full" h="h-[3px]" />
          </div>
        </div>

        {/* Byline */}
        <div className="flex items-center gap-2.5 pt-0.5">
          <div className="w-3.5 h-3.5 rounded-full border border-primary-text/20 dark:border-primary-text-dark/20 shrink-0" />
          <div className="h-px w-10 bg-primary-text/15 dark:bg-primary-text-dark/15" />
          <div className="h-px flex-1 bg-primary-text/10 dark:bg-primary-text-dark/10" />
          <div className="h-px w-6 bg-accent/40" />
        </div>
      </div>
    </div>
  );
}

/* ── Anonymous Chat — conversation / private messaging ─────────────────────
   The product is the exchange, so the frame is the exchange: it runs the full
   width of whatever aperture it is given and the bubbles carry the height. */
function Chat() {
  return (
    <div className="flex h-full flex-col px-4 sm:px-6 lg:px-10 py-4 sm:py-6 lg:py-8">
      {/* Session bar */}
      <div className="flex items-center gap-3 sm:gap-5 shrink-0 pb-3 sm:pb-5 border-b border-primary-text/12 dark:border-primary-text-dark/12">
        {/* Masked identity: a circle struck through */}
        <div className={`relative w-9 h-9 sm:w-12 sm:h-12 rounded-full border ${EDGE} shrink-0`}>
          <div className="absolute left-1/2 top-1/2 w-[140%] h-px -translate-x-1/2 -translate-y-1/2 -rotate-45 bg-accent/60" />
        </div>
        <div className="min-w-0 flex-1 space-y-2">
          <div className="w-[60%] max-w-[18rem]"><Line w="w-full" h="h-[5px] sm:h-[7px]" o="bg-primary-text/28 dark:bg-primary-text-dark/28" /></div>
          <div className="w-[32%] max-w-[9rem]"><Line w="w-full" h="h-[3px] sm:h-[4px]" /></div>
        </div>
        <div className="hidden sm:flex items-center gap-2 shrink-0 rounded-full border border-accent/40 px-3.5 py-2">
          <div className="w-1.5 h-1.5 rounded-full bg-accent/70" />
          <span className="font-josefin text-[9px] font-bold tracking-[0.2em] uppercase text-accent/90">
            Anonymous
          </span>
        </div>
        {/* Session expiry */}
        <div className="hidden lg:flex flex-col items-end gap-2 shrink-0 w-40">
          <Line w="w-full" h="h-[3px] sm:h-[4px]" o="bg-primary-text/12 dark:bg-primary-text-dark/12" />
          <div className="h-[3px] w-full bg-primary-text/12 dark:bg-primary-text-dark/12 rounded-full overflow-hidden">
            <div className="h-full w-2/3 bg-accent/45" />
          </div>
        </div>
      </div>

      {/* Exchange — the product is the conversation, so the bubbles carry the
          available height. Heights are tuned per breakpoint because the `md`
          aperture (a wide, short card) and the `lg` aperture (a tall plate)
          have very different budgets. */}
      <div className="flex-1 min-h-0 flex flex-col justify-center gap-1.5 sm:gap-5 py-1.5 sm:py-8">
        <div className="flex items-end gap-2 sm:gap-3.5">
          <div className="w-5 h-5 sm:w-9 sm:h-9 rounded-full border border-primary-text/12 dark:border-primary-text-dark/16 shrink-0" />
          <div className={`w-[72%] sm:w-[42%] rounded-2xl rounded-bl-md px-2.5 sm:px-6 py-1 sm:py-4 ${SURFACE_2}`}>
            <div className="space-y-1 sm:space-y-2.5">
              <Line w="w-full" h="h-[3px] sm:h-[5px]" />
              <Line w="w-2/3" h="h-[3px] sm:h-[5px]" />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <div className="w-[68%] sm:w-[36%] rounded-2xl rounded-br-md px-2.5 sm:px-6 py-1 sm:py-4 bg-accent/12 border border-accent/20">
            <div className="space-y-1 sm:space-y-2.5">
              <Line w="w-full" h="h-[3px] sm:h-[5px]" o="bg-primary-text/22 dark:bg-primary-text-dark/22" />
              <Line w="w-1/2" h="h-[3px] sm:h-[5px]" o="bg-primary-text/22 dark:bg-primary-text-dark/22" />
            </div>
          </div>
        </div>

        <div className="flex items-end gap-2 sm:gap-3.5">
          <div className="w-5 h-5 sm:w-9 sm:h-9 rounded-full border border-primary-text/12 dark:border-primary-text-dark/16 shrink-0" />
          <div className={`w-[78%] sm:w-[48%] rounded-2xl rounded-bl-md px-2.5 sm:px-6 py-1 sm:py-4 ${SURFACE_2}`}>
            <div className="space-y-1 sm:space-y-2.5">
              <Line w="w-full" h="h-[3px] sm:h-[5px]" />
              <Line w="w-3/4" h="h-[3px] sm:h-[5px]" />
              <div className="hidden sm:block"><Line w="w-5/6" h="h-[3px] sm:h-[5px]" /></div>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <div className="w-[56%] sm:w-[30%] rounded-2xl rounded-br-md px-2.5 sm:px-6 py-1 sm:py-4 bg-accent/12 border border-accent/20">
            <Line w="w-full" h="h-[3px] sm:h-[5px]" o="bg-primary-text/22 dark:bg-primary-text-dark/22" />
          </div>
        </div>

        {/* Session disposal — the feature the case study is about */}
        <div className="flex items-center gap-3 pt-0.5 sm:pt-2">
          <div className="h-px flex-1 bg-primary-text/10 dark:bg-primary-text-dark/10" />
          <span className="font-josefin text-[8px] sm:text-[9px] font-bold tracking-[0.25em] uppercase text-primary-text/30 dark:text-primary-text-dark/30 shrink-0">
            Session discarded
          </span>
          <div className="h-px flex-1 bg-primary-text/10 dark:bg-primary-text-dark/10" />
        </div>
      </div>

      {/* Composer */}
      <div className="shrink-0 flex items-center gap-3 sm:gap-4 border-t border-primary-text/12 dark:border-primary-text-dark/12 pt-3 sm:pt-5">
        <div className="flex-1 h-8 sm:h-12 rounded-full border border-primary-text/10 dark:border-primary-text-dark/14" />
        <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-accent/30 shrink-0" />
      </div>
    </div>
  );
}

/* ── 3D Portfolio — browser / WebGL ───────────────────────────────────────
   The artifact is the live field. It gets the majority of the aperture and is
   drawn as an actual mesh — a triangulated wireframe — rather than a generic
   grey rectangle, so the frame says WebGL without a screenshot. */
function Browser() {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '');
  const meshId = `mesh-${uid}`;
  const fieldId = `field-${uid}`;

  return (
    <div className="flex h-full flex-col">
      {/* Browser chrome */}
      <div className={`shrink-0 flex items-center gap-2 sm:gap-3 px-3 sm:px-5 py-2 sm:py-3 border-b ${EDGE}`}>
        <div className="flex gap-1.5 shrink-0">
          <div className="w-2 h-2 rounded-full bg-accent/45" />
          <div className="w-2 h-2 rounded-full bg-primary-text/15 dark:bg-primary-text-dark/15" />
          <div className="w-2 h-2 rounded-full bg-primary-text/15 dark:bg-primary-text-dark/15" />
        </div>
        <div className={`flex-1 max-w-md h-6 sm:h-8 rounded-full border ${EDGE} ${SURFACE} flex items-center px-3.5`}>
          <div className="w-[45%]"><Line w="w-full" h="h-[3px]" /></div>
        </div>
        <div className="hidden sm:flex gap-2.5 shrink-0">
          <div className="w-10"><Line w="w-full" h="h-[3px]" /></div>
          <div className="w-6"><Line w="w-full" h="h-[3px]" /></div>
        </div>
      </div>

      {/* Viewport — the WebGL field, dominant */}
      <div className="relative flex-1 min-h-0">
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 100 60"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id={fieldId} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="currentColor" stopOpacity="0.09" />
              <stop offset="55%" stopColor="currentColor" stopOpacity="0.025" />
              <stop offset="100%" stopColor="currentColor" stopOpacity="0.08" />
            </linearGradient>
            {/* The wireframe has to stay a texture at any aperture. Stretched
                across a 1310px plate a coarse grid reads as a zigzag, so the
                cell is kept small and faint instead of large and bold. */}
            <pattern id={meshId} width="4" height="2.4" patternUnits="userSpaceOnUse">
              <path d="M0 0 L4 2.4 M4 0 L0 2.4 M2 0 L2 2.4" stroke="currentColor" strokeWidth="0.05" fill="none" opacity="0.4" />
            </pattern>
            <radialGradient id={`${fieldId}-r`} cx="0.72" cy="0.28" r="0.85">
              <stop offset="0%" stopColor="currentColor" stopOpacity="0.07" />
              <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
            </radialGradient>
          </defs>
          <rect width="100" height="60" fill={`url(#${fieldId})`} />
          <rect width="100" height="60" fill={`url(#${fieldId}-r)`} />
          <rect width="100" height="60" fill={`url(#${meshId})`} />
        </svg>

        {/* Type sitting on the field */}
        <div className="absolute inset-0 flex flex-col justify-center gap-2.5 sm:gap-4 px-5 sm:px-8 lg:px-12">
          <div className="space-y-2 sm:space-y-3 lg:space-y-4">
            <div className="h-4 sm:h-7 lg:h-12 w-3/5 bg-primary-text/30 dark:bg-primary-text-dark/30 rounded-[2px]" />
            <div className="h-4 sm:h-7 lg:h-12 w-2/5 bg-accent/45 rounded-[2px]" />
          </div>
          <div className="flex items-center gap-3 sm:gap-5 pt-1 sm:pt-2">
            <div className="h-px w-12 sm:w-20 bg-primary-text/20 dark:bg-primary-text-dark/20" />
            <div className="w-40 sm:w-72"><Line w="w-full" h="h-[3px] sm:h-[4px]" /></div>
          </div>
        </div>

        {/* Scroll ticks */}
        <div className="absolute right-3 sm:right-5 bottom-3 sm:bottom-5 flex flex-col gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-accent/60" />
          <div className="w-1.5 h-1.5 rounded-full bg-primary-text/15 dark:bg-primary-text-dark/15" />
          <div className="w-1.5 h-1.5 rounded-full bg-primary-text/15 dark:bg-primary-text-dark/15" />
        </div>
      </div>
    </div>
  );
}

/* ── Muhammad Umar's Blog — editorial publishing / article ────────────────
   A publishing spread: masthead, kicker, a large headline set in the
   editorial face, a hero plate and two columns of body. */
function Editorial() {
  return (
    <div className="flex h-full flex-col px-4 sm:px-7 lg:px-12 py-4 sm:py-6 lg:py-8">
      {/* Masthead */}
      <div className="flex items-center gap-3 sm:gap-5 shrink-0 pb-3 sm:pb-4">
        <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-sm bg-accent/45 shrink-0" />
        <div className="h-4 sm:h-5 w-24 sm:w-40 bg-primary-text/25 dark:bg-primary-text-dark/25 rounded-[2px]" />
        <div className="h-px flex-1 bg-primary-text/10 dark:bg-primary-text-dark/10" />
        <div className="hidden sm:flex items-center gap-4 shrink-0">
          <Line w="w-12" h="h-[3px]" />
          <Line w="w-12" h="h-[3px]" />
          <Line w="w-12" h="h-[3px]" />
        </div>
      </div>

      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 lg:gap-8">
        {/* Article column */}
        <div className="lg:col-span-7 flex flex-col justify-center gap-3 sm:gap-4 min-w-0">
          <div className="flex items-center gap-2.5">
            <span className="font-josefin text-[9px] font-bold tracking-[0.3em] uppercase text-accent/85 shrink-0">
              Essay
            </span>
            <div className="h-px flex-1 bg-primary-text/12 dark:bg-primary-text-dark/12" />
            <Line w="w-16 sm:w-24" h="h-[3px]" />
          </div>

          {/* Headline, set in the editorial weight */}
          <div className="space-y-2 lg:space-y-3">
            <div className="h-3 sm:h-4.5 lg:h-6 w-full bg-primary-text/26 dark:bg-primary-text-dark/26 rounded-[2px]" />
            <div className="h-3 sm:h-4.5 lg:h-6 w-full bg-primary-text/26 dark:bg-primary-text-dark/26 rounded-[2px]" />
            <div className="h-3 sm:h-4.5 lg:h-6 w-2/3 bg-primary-text/26 dark:bg-primary-text-dark/26 rounded-[2px]" />
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-5 pt-0.5">
            <div className="space-y-1.5">
              <Line w="w-full" />
              <Line w="w-full" />
              <Line w="w-4/5" />
              <Line w="w-full" />
            </div>
            <div className="space-y-1.5">
              <Line w="w-full" />
              <Line w="w-11/12" />
              <Line w="w-full" />
              <Line w="w-3/4" />
            </div>
          </div>

          {/* Byline */}
          <div className="flex items-center gap-2.5 pt-0.5">
            <div className="w-4 h-4 rounded-full border border-primary-text/20 dark:border-primary-text-dark/20 shrink-0" />
            <Line w="w-20 sm:w-28" h="h-[3px]" />
            <div className="h-px w-6 bg-primary-text/15 dark:bg-primary-text-dark/15" />
            <Line w="w-10 sm:w-16" h="h-[3px]" />
          </div>
        </div>

        {/* Hero plate */}
        <div className="hidden lg:flex lg:col-span-5 flex-col gap-3 min-w-0 justify-center">
          <div className={`relative flex-1 min-h-0 rounded-md border ${EDGE} overflow-hidden`}>
            <svg className="absolute inset-0 w-full h-full" aria-hidden="true">
              <defs>
                <pattern id="plate-hatch" width="6" height="6" patternUnits="userSpaceOnUse">
                  <path d="M0 6 L6 0" stroke="currentColor" strokeWidth="0.3" opacity="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill={`url(#plate-hatch)`} />
            </svg>
            <div className="absolute inset-0 flex items-end p-4">
              <div className="h-px w-full bg-accent/40" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-accent/60" />
            <Line w="w-24" h="h-[3px]" />
          </div>
        </div>
      </div>
    </div>
  );
}

const VARIANTS = {
  mobile: Mobile,
  chat: Chat,
  browser: Browser,
  editorial: Editorial,
};

export default function ProjectVisual({ previewType, scale = 'md' }) {
  const Variant = VARIANTS[previewType] || Browser;

  /* Deliberately NOT a flex container: as a flex row the child would be sized
     by its own content, which is how the detail plate ended up with a small
     composition parked in a very wide empty frame. Block layout makes the
     variant fill the aperture at both scales. */
  return (
    <div
      className={`relative w-full ${FRAME[scale]} border ${HAIRLINE} overflow-hidden`}
      aria-hidden="true"
    >
      <Variant />
    </div>
  );
}
