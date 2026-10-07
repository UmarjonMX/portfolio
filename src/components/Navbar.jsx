import { useState, useEffect, useRef, useCallback } from 'react';
import { useMotionValueEvent } from 'framer-motion';
import { Moon, Sun, Globe } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useScrollStage, usePrefersReducedMotion } from './scroll/ScrollStage';

/**
 * Floating navigation.
 *
 * Three zones — logo, one shared link pill, controls — inside a single
 * surface that is inset from the viewport edge on the same measure as the
 * page's own content grid (max-w-[90rem], px-6 / sm:px-10 / lg:px-16), so the
 * navbar lines up with the Hero below it rather than floating arbitrarily.
 *
 * Separation from the moving ambient field comes from surface, a thin border
 * and a short shadow — not from a large blur sheet. This element deliberately
 * opts out of `.glass3d`: at full width that treatment stacks a 48px backdrop
 * blur with the class's own 8px one and reads as a glass slab rather than a
 * piece of hardware.
 */
export default function Navbar({ toggleTheme, isDarkMode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeId, setActiveId] = useState('hero');
  const { lang, toggleLanguage, t } = useLanguage();
  const { scrollY, bounds } = useScrollStage();
  const reduced = usePrefersReducedMotion();

  const toggleRef = useRef(null);
  const panelRef = useRef(null);
  const firstLinkRef = useRef(null);

  const navLinks = [
    { id: 'hero', title: t('nav.home'), href: '#' },
    { id: 'about', title: t('nav.about'), href: '#about' },
    { id: 'projects', title: t('nav.projects'), href: '#projects' },
    { id: 'engineering', title: t('nav.resume'), href: '#resume' },
    { id: 'contact', title: t('nav.contact'), href: '#contact' },
  ];

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

  const closeMenu = useCallback(() => setIsOpen(false), []);

  // Escape closes the mobile menu and returns focus to its trigger.
  useEffect(() => {
    if (!isOpen) return;
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
    if (!isOpen) return;
    const onPointerDown = (e) => {
      if (panelRef.current?.contains(e.target)) return;
      if (toggleRef.current?.contains(e.target)) return;
      closeMenu();
    };
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [isOpen, closeMenu]);

  const openMenu = () => setIsOpen(true);

  const duration = reduced ? 0 : 200;

  return (
    <header className="fixed inset-x-0 top-0 z-50 pointer-events-none">
      {/* Centred and capped well inside the viewport so the bar reads as a
          discrete object on the page rather than a strip attached to the top
          edge. The measure matches the Hero's own content column. */}
      <div className="mx-auto w-full max-w-5xl px-6 pt-6 sm:px-8 sm:pt-7 lg:pt-8">
        <nav
          aria-label="Primary"
          className="pointer-events-auto flex items-center justify-between gap-3 rounded-2xl border border-primary-text/[0.12] bg-white/80 py-1.5 pl-2.5 pr-2 backdrop-blur-md dark:border-white/[0.12] dark:bg-[#161618]/85 dark:backdrop-blur-md shadow-[0_1px_2px_rgba(28,28,28,0.05),0_2px_6px_-2px_rgba(28,28,28,0.10),0_16px_36px_-18px_rgba(28,28,28,0.35)] dark:shadow-[0_1px_0_rgba(255,255,255,0.05)_inset,0_2px_8px_-2px_rgba(0,0,0,0.5),0_18px_40px_-20px_rgba(0,0,0,1)]"
        >
          {/* ── LEFT · logo ─────────────────────────────────────────────── */}
          <a
            href="#"
            aria-label="Umar — home"
            className="shrink-0 -m-1.5 p-1.5 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-[#141416] transition-opacity duration-200 hover:opacity-70"
          >
            <img
              src={isDarkMode ? '/images/logo_dark.png' : '/images/logo_light.png'}
              alt="UMX"
              className="h-8 w-auto object-contain sm:h-9"
            />
          </a>

          {/* ── CENTER · one shared link pill ──────────────────────────── */}
          <ul className="hidden md:flex items-center gap-0.5 rounded-full border border-primary-text/[0.07] bg-primary-text/[0.025] p-1 dark:border-white/[0.07] dark:bg-white/[0.03]">
            {navLinks.map((link) => {
              const isActive = activeId === link.id;
              return (
                <li key={link.id}>
                  <a
                    href={link.href}
                    aria-current={isActive ? 'page' : undefined}
                    className={`relative block rounded-full px-3.5 py-1.5 font-host text-[11px] font-bold uppercase tracking-[0.14em] transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-[#141416] ${
                      isActive
                        ? 'text-primary-text dark:text-primary-text-dark'
                        : 'text-primary-text/55 hover:text-accent dark:text-primary-text-dark/55 dark:hover:text-accent'
                    }`}
                  >
                    {link.title}
                    {/* Active marker — a short accent rule, not a filled chip. */}
                    <span
                      aria-hidden="true"
                      className={`absolute inset-x-3 -bottom-px h-px origin-center bg-accent transition-transform duration-200 ${
                        isActive ? 'scale-x-100' : 'scale-x-0'
                      }`}
                    />
                  </a>
                </li>
              );
            })}
          </ul>

          {/* ── RIGHT · language, theme, menu ──────────────────────────── */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={toggleLanguage}
              aria-label={`Change language, current ${lang.toUpperCase()}`}
              className="flex items-center gap-1.5 rounded-lg border border-transparent px-2 py-1.5 font-host text-[11px] font-bold uppercase tracking-[0.12em] text-primary-text/65 transition-colors duration-200 hover:border-primary-text/10 hover:text-primary-text dark:text-primary-text-dark/65 dark:hover:border-white/10 dark:hover:text-primary-text-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent cursor-pointer"
            >
              <Globe size={12} className="shrink-0 opacity-60" />
              <span>{lang}</span>
            </button>

            <button
              type="button"
              onClick={toggleTheme}
              aria-label={isDarkMode ? 'Switch to light theme' : 'Switch to dark theme'}
              aria-pressed={isDarkMode}
              className="rounded-lg border border-transparent p-2 text-primary-text/65 transition-colors duration-200 hover:border-primary-text/10 hover:text-primary-text dark:text-primary-text-dark/65 dark:hover:border-white/10 dark:hover:text-primary-text-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent cursor-pointer"
            >
              {isDarkMode ? (
                <Sun size={14} className="text-accent" />
              ) : (
                <Moon size={14} className="text-primary-text/70 dark:text-primary-text-dark/70" />
              )}
            </button>

            <button
              ref={toggleRef}
              type="button"
              onClick={() => (isOpen ? (closeMenu(), toggleRef.current?.focus()) : openMenu())}
              aria-label={isOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
              className="relative -mr-1 flex h-9 w-9 flex-col items-center justify-center rounded-lg border border-transparent transition-colors duration-200 hover:border-primary-text/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent md:hidden cursor-pointer"
            >
              <span className="sr-only">Menu</span>
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
          </div>
        </nav>

        {/* ── Mobile menu — a compact sheet, not a full-page drawer ──────── */}
        <div
          id="mobile-menu"
          ref={panelRef}
          hidden={!isOpen}
          className="pointer-events-auto md:hidden mt-2 overflow-hidden rounded-2xl border border-primary-text/10 bg-white shadow-[0_16px_36px_-18px_rgba(28,28,28,0.35)] dark:border-white/10 dark:bg-[#161618] dark:shadow-[0_18px_40px_-20px_rgba(0,0,0,1)]"
          style={{ opacity: isOpen ? 1 : 0, transition: `opacity ${duration}ms ease` }}
        >
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
                        className={`font-josefin text-[10px] tabular-nums ${isActive ? 'text-accent' : 'text-primary-text/30 dark:text-primary-text-dark/30'}`}
                      >
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      {link.title}
                    </span>
                    {isActive && <span aria-hidden="true" className="h-1 w-1 rounded-full bg-accent" />}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </header>
  );
}