# Umarjon MX — Portfolio

An editorial portfolio built as one continuous scroll narrative: a pinned hero
that resolves into a masthead, chapters that hand over to one another, and a
closing statement that collapses the whole thing back into a line of type.

Live: [umarjonmx.uz](https://umarjonmx.uz)

---

## Stack

| Concern | Choice | Why |
|---|---|---|
| Build | Vite 8 + `@vitejs/plugin-react` | Fast HMR, simple static output |
| UI | React 19 | — |
| Styling | Tailwind CSS v4 (CSS-first `@theme`) | Tokens live in `src/index.css`; there is no JS config |
| Motion | Framer Motion | MotionValues, not scroll listeners |
| Icons | lucide-react | Tree-shaken |
| Toasts | react-hot-toast | — |
| Background | **Raw WebGL** | See below |

### Why there is no 3D library

The background is a single fullscreen quad running one fragment shader. It was
originally a Three.js scene (`<Canvas>` + `<PerspectiveCamera>` + a 2×2 plane),
which cost **876 KB of JavaScript — 234 KB gzipped, ~64 % of the entire JS
payload** — to draw a shader whose vertex stage writes straight to clip space:

```glsl
gl_Position = vec4(position.xy, 1.0, 1.0);
```

The camera was never consulted. `src/components/3d/AmbientField.jsx` is now
~120 lines of plain WebGL that produce identical pixels, and `three`,
`@react-three/fiber` and `@react-three/drei` are no longer dependencies.

---

## Architecture notes

**One scroll system.** `src/components/scroll/ScrollStage.jsx` owns a single
`scrollY` MotionValue and measures every `[data-chapter]` section once on mount
(and on resize / lazy-content mutation). Every section derives its animation
from that one value. No component calls `setState` on scroll. This is why the
Navbar's morph, the hero choreography and the closing statement all stay in
step without a single per-frame React render.

**Reduced motion is a first-class path,** not a media query bolted on the end.
The same markup renders statically: the hero drops its pinned runway, the
Navbar quantises its morph to its two resting states, and the closing chapter
renders as an ordinary document. See `usePrefersReducedMotion()`.

**One floating-panel system.** Every floating capsule on the site — the three
Navbar pieces and the numbered chapter markers — reads its geometry, surface,
outline, highlight and elevation from `src/components/floatingPanel.jsx`. Width
is the only thing that varies, because width belongs to content.

**No routing library.** Two route shapes (`/` and `/projects/:slug`) and one
link target do not justify React Router. `src/router.jsx` is the whole routing
layer, and it handles the one thing a History-API router must: `pushState` does
not scroll to a fragment, and the home sections are code-split, so `navigate()`
waits for the target to mount and then scrolls to it.

---

## Commands

```bash
npm install
npm run dev       # dev server
npm run build     # production build → dist/
npm run preview   # serve the production build
npm run lint      # eslint
npm run og        # regenerate public/images/og.png (1200×630 social card)
```

### QA scripts

`qa/` holds browser-driven checks used during development. They are not wired
into CI and not part of the shipped site. Start a preview server first:

```bash
npm run build && npm run preview -- --port 4177
node qa/visual.cjs       http://localhost:4177/   # screenshots, both themes, all breakpoints
node qa/sweep.cjs        http://localhost:4177/   # every viewport × scroll position
node qa/hashnav.cjs      http://localhost:4177/   # navbar → section from a project page
node qa/finale-fit.cjs   http://localhost:4177/   # closing headline vs. its measure
node qa/audit.cjs        http://localhost:4177/   # skip link, headings, i18n leaks, overflow
```

---

## Layout

```
src/
  App.jsx                 route switch, theme, the one-time pointer pulse
  router.jsx              History-API router + fragment scrolling
  translations.js         every user-visible string, en + uz
  constants.js            contact details, single source
  components/
    Navbar.jsx            the morphing floating bar
    Hero.jsx              pinned opening chapter
    About/Projects/…      one component per chapter
    scroll/ScrollStage    the single scroll-progress system
    3d/AmbientField.jsx   the WebGL background
    floatingPanel.js      the shared panel system
public/
  fonts/base-neue/        the only self-hosted family
  images/                 portrait, logo, favicons, og.png
scripts/generate-og.mjs   renders the social card with Puppeteer
qa/                       browser checks (dev only)
docs/                     design and architecture decisions
```

---

## Deployment

`vercel.json` sets the SPA rewrite, a content-security policy, long-lived
immutable caching for hashed assets, and the usual security headers.

The Builder Console's "Latest Build" field is the real commit, injected at build
time by `vite.config.js` (`git rev-parse --short HEAD`, falling back to
`VERCEL_GIT_COMMIT_SHA`, then to `dev`). It is never a hand-written string.

---

## Content

Every claim on the site is either taken from a real record or stated as absent —
a project with no published link says so rather than inventing a repository. If
you add a project, add it to **both** language blocks in `src/translations.js`;
a missing key renders as its own path, so omissions are visible rather than
silent.