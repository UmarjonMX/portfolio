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
  window.addEventListener('popstate', emit);
}

/** Programmatic navigation. `replace` avoids adding a history entry. */
export function navigate(to, { replace = false } = {}) {
  const url = new URL(to, window.location.origin);
  if (replace) window.history.replaceState({}, '', url);
  else window.history.pushState({}, '', url);
  emit();
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