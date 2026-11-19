/**
 * Minimal History-API router.
 *
 * React Router was removed from this app earlier, and nothing here needs it
 * back: there are two route shapes (`/` and `/projects/:slug`), one link
 * target, and one Back button. Re-adding a router for that would be the
 * larger change, so this is the whole routing layer.
 *
 * It works with the existing Vite SPA setup because Vercel already rewrites
 * every path to /index.html (see vercel.json), and both `vite dev` and
 * `vite preview` fall back to index.html by default.
 */
import { useEffect, useState } from 'react';

function readLocation() {
  if (typeof window === 'undefined') return { pathname: '/', hash: '' };
  const { pathname, hash } = window.location;
  return {
    // Strip a trailing slash so `/projects/x/` and `/projects/x` are one route.
    pathname: pathname.replace(/\/+$/, '') || '/',
    hash,
  };
}

const listeners = new Set();

function emit() {
  const loc = readLocation();
  listeners.forEach((fn) => fn(loc));
}

if (typeof window !== 'undefined') {
  // Back/forward between routes also has to land on the right section: the
  // browser restores a scroll position it remembers for a URL, but it has
  // never seen `/#projects` as a loaded document, so it restores nothing.
  window.addEventListener('popstate', () => {
    emit();
    const loc = readLocation();
    if (loc.hash) scrollToHash(loc.hash, 'auto');
    else window.scrollTo(0, 0);
  });
}

/**
 * Scrolls a `#fragment` into view after a client-side navigation.
 *
 * `history.pushState` deliberately does not perform the browser's built-in
 * fragment scroll, so a link that changes both the path and the hash lands the
 * reader at the top of the new page with the target thousands of pixels below
 * them. It also cannot simply look the target up on arrival: the home page's
 * sections are code-split, so `#contact` does not exist yet at the moment the
 * route swaps. This waits for the element to appear, then scrolls to it once.
 *
 * Honours `prefers-reduced-motion` by jumping instead of animating.
 */
function scrollToHash(hash, behavior) {
  const id = hash.replace(/^#/, '');
  if (!id) {
    window.scrollTo(0, 0);
    return;
  }

  const reduced =
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const behaviorMode = reduced ? 'auto' : behavior || 'smooth';

  let tries = 0;
  let raf = 0;
  const attempt = () => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: behaviorMode, block: 'start' });
      return;
    }
    // ~1.5s of frames: long enough for a lazy chunk to mount and lay out.
    if (++tries < 90) raf = requestAnimationFrame(attempt);
  };
  raf = requestAnimationFrame(attempt);
  return () => cancelAnimationFrame(raf);
}

/** Programmatic navigation. `replace` avoids adding a history entry. */
export function navigate(to, { replace = false } = {}) {
  const url = new URL(to, window.location.origin);
  const before = readLocation();
  if (replace) window.history.replaceState({}, '', url);
  else window.history.pushState({}, '', url);
  emit();

  const after = readLocation();
  const changedPage = before.pathname !== after.pathname;
  if (after.hash && (changedPage || before.hash !== after.hash)) {
    scrollToHash(after.hash);
  } else if (changedPage && !after.hash) {
    window.scrollTo(0, 0);
  }
}

export function useRoute() {
  // `readLocation` is the lazy initialiser, so the first render already
  // reflects the real URL. The subscription only handles later changes.
  const [loc, setLoc] = useState(readLocation);

  useEffect(() => {
    const fn = (next) => setLoc(next);
    listeners.add(fn);
    return () => listeners.delete(fn);
  }, []);

  return loc;
}

export const PROJECT_PREFIX = '/projects/';

/** Returns the project slug when the current path is a project page. */
export function projectSlugFrom(pathname) {
  if (!pathname.startsWith(PROJECT_PREFIX)) return null;
  const slug = pathname.slice(PROJECT_PREFIX.length);
  return slug ? decodeURIComponent(slug) : null;
}

/**
 * Navbar links are plain `#anchor` hrefs, and the Navbar is deliberately
 * left untouched. On a project page those would resolve against the project
 * URL and scroll nowhere, so they are intercepted once, here, and rewritten
 * to the home page. On `/` the browser's native smooth scroll already works,
 * so this stays out of the way.
 *
 * `navigate` is what makes the rewrite land on the right section rather than
 * merely the right URL — see `scrollToHash` above.
 */
export function useHashLinkBridge() {
  useEffect(() => {
    const onClick = (e) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const anchor = e.target instanceof Element ? e.target.closest('a[href^="#"]') : null;
      if (!anchor) return;
      if (readLocation().pathname === '/') return; // native anchor scroll is fine

      const hash = anchor.getAttribute('href');
      e.preventDefault();
      navigate('/' + hash);
    };

    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);
}