import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import toast from 'react-hot-toast';
import { useLanguage } from '../context/LanguageContext';
import { Moon, Sun, Globe, Code, Mail, Search, Download, Copy } from 'lucide-react';
import { copyToClipboard } from '../utils/clipboard';
import { downloadCV } from '../utils/cv';
import { navigate } from '../router';
import { EMAIL } from '../constants';

/**
 * ⌘K / Ctrl+K command palette.
 *
 * Two behaviours here were wrong and are worth stating, because both look
 * correct in the markup:
 *
 *   1. Navigation used `document.getElementById(...).scrollIntoView(...)`.
 *      On a project detail page the home sections do not exist at all, so
 *      "Go to Projects" silently did nothing. It now goes through the router,
 *      which handles the lazy chunk and the fragment scroll.
 *   2. The "focus trap" called `preventDefault()` on Tab and nothing else,
 *      which does not trap focus — it just makes the keyboard user unable to
 *      leave the palette or reach the results. Tab now cycles inside the
 *      dialog, the way a modal is supposed to behave.
 */
export default function CommandPalette({ isDarkMode, toggleTheme }) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const { lang, toggleLanguage, t } = useLanguage();
  const inputRef = useRef(null);
  const dialogRef = useRef(null);
  const itemRefs = useRef([]);
  const previousFocusRef = useRef(null);

  const close = useCallback(() => setIsOpen(false), []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) {
          setIsOpen(false);
        } else {
          previousFocusRef.current = document.activeElement;
          setSearch('');
          setActiveIndex(0);
          setIsOpen(true);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      const id = requestAnimationFrame(() => inputRef.current?.focus());
      return () => cancelAnimationFrame(id);
    }
    // Restore focus to whatever opened the palette.
    const prevEl = previousFocusRef.current;
    if (prevEl && typeof prevEl.focus === 'function') {
      requestAnimationFrame(() => prevEl.focus());
    }
    return undefined;
  }, [isOpen]);

  const actions = useMemo(
    () => [
      {
        id: 'theme',
        title: t('palette.theme'),
        keywords: 'theme dark light mode',
        icon: isDarkMode ? <Sun size={18} /> : <Moon size={18} />,
        onSelect: () => toggleTheme(),
      },
      {
        id: 'language',
        title: t('palette.language', { to: lang === 'en' ? 'UZ' : 'EN' }),
        keywords: 'language uz en til',
        icon: <Globe size={18} />,
        onSelect: () => toggleLanguage(),
      },
      {
        id: 'projects',
        title: t('palette.projects'),
        keywords: 'projects work works loyihalar',
        icon: <Code size={18} />,
        onSelect: () => navigate('/#projects'),
      },
      {
        id: 'contact',
        title: t('palette.contact'),
        keywords: 'contact email aloqa',
        icon: <Mail size={18} />,
        onSelect: () => navigate('/#contact'),
      },
      {
        id: 'resume',
        title: t('palette.resume'),
        keywords: 'resume cv rezyume download',
        icon: <Download size={18} />,
        onSelect: () => navigate('/#resume'),
      },
      {
        id: 'download-resume',
        title: t('palette.downloadCv'),
        keywords: 'download cv resume pdf',
        icon: <Download size={18} />,
        onSelect: async () => {
          const ok = await downloadCV({ delay: 0 }).catch(() => false);
          if (ok) toast.success(t('resume.downloadSuccess'));
          else toast.error(t('resume.downloadError'));
        },
      },
      {
        id: 'copy-email',
        title: t('palette.copyEmail'),
        keywords: 'copy email clip pochta',
        icon: <Copy size={18} />,
        onSelect: async () => {
          const ok = await copyToClipboard(EMAIL);
          if (ok) toast.success(t('palette.copied'));
          else toast.error(t('palette.copyFailed'));
        },
      },
    ],
    [isDarkMode, lang, t, toggleLanguage, toggleTheme]
  );

  const filteredActions = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return actions;
    // Matches the visible title in either language, so the palette stays
    // usable when the site is in Uzbek and the reader types English.
    return actions.filter(
      (a) =>
        a.title.toLowerCase().includes(q) || a.keywords.toLowerCase().includes(q)
    );
  }, [actions, search]);

  // Keep the highlight inside the list as it shrinks under the query — done in
  // the change handler rather than an effect, so the reset and the new value
  // land in the same commit.
  const onSearchChange = (value) => {
    setSearch(value);
    setActiveIndex(0);
  };

  if (!isOpen) return null;

  const run = (action) => {
    close();
    action.onSelect();
  };

  const move = (delta) => {
    if (!filteredActions.length) return;
    setActiveIndex((i) => (i + delta + filteredActions.length) % filteredActions.length);
  };

  const handlePaletteKeyDown = (e) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      close();
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      move(1);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      move(-1);
    } else if (e.key === 'Enter' && filteredActions.length > 0) {
      e.preventDefault();
      const action = filteredActions[Math.min(activeIndex, filteredActions.length - 1)];
      if (action) run(action);
    } else if (e.key === 'Tab') {
      // A real trap: move focus to the next control inside the dialog instead
      // of letting Tab escape to the page behind it.
      const focusables = dialogRef.current?.querySelectorAll(
        'input, button, [href], [tabindex]:not([tabindex="-1"])'
      );
      if (!focusables || !focusables.length) return;
      const list = Array.from(focusables);
      const i = list.indexOf(document.activeElement);
      e.preventDefault();
      const next = list[(i + (e.shiftKey ? -1 : 1) + list.length) % list.length];
      next?.focus();
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/45"
      onKeyDown={handlePaletteKeyDown}
    >
      {/* Overlay to close when clicking outside */}
      <div
        className="absolute inset-0 cursor-pointer"
        onClick={close}
        aria-hidden="true"
      />

      <div
        ref={dialogRef}
        className="glass3d relative w-full max-w-lg bg-white dark:bg-card-bg-dark rounded-xl shadow-hard-light dark:shadow-hard-dark border border-primary-text dark:border-primary-text-dark overflow-hidden flex flex-col font-host text-primary-text dark:text-primary-text-dark"
        role="dialog"
        aria-modal="true"
        aria-label={t('palette.title')}
      >
        <div className="flex items-center px-4 border-b border-primary-text/10 dark:border-primary-text-dark/10 bg-[#FAFAFA] dark:bg-background-dark">
          <Search size={18} className="text-primary-text/40 dark:text-primary-text-dark/40 mr-3" />
          <input
            ref={inputRef}
            type="text"
            role="combobox"
            aria-expanded="true"
            aria-controls="palette-listbox"
            aria-activedescendant={
              filteredActions[activeIndex] ? `palette-opt-${filteredActions[activeIndex].id}` : undefined
            }
            aria-label={t('palette.searchLabel')}
            className="flex-1 bg-transparent py-4 outline-none text-primary-text dark:text-primary-text-dark placeholder-primary-text/40 dark:placeholder-primary-text-dark/40 font-bold font-host"
            placeholder={t('palette.placeholder')}
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          <kbd className="hidden sm:inline-block px-2.5 py-1 text-[9px] font-josefin font-bold text-primary-text/60 dark:text-primary-text-dark/60 bg-primary-text/5 dark:bg-primary-text-dark/5 rounded border border-primary-text/10 dark:border-primary-text-dark/10">
            ESC
          </kbd>
        </div>

        <div id="palette-listbox" className="max-h-[50vh] overflow-y-auto p-2 bg-white dark:bg-card-bg-dark" role="listbox">
          {filteredActions.length > 0 ? (
            filteredActions.map((action, index) => (
              <button
                key={action.id}
                id={`palette-opt-${action.id}`}
                ref={(el) => {
                  itemRefs.current[index] = el;
                }}
                onClick={() => run(action)}
                onMouseMove={() => setActiveIndex(index)}
                role="option"
                aria-selected={index === activeIndex}
                tabIndex={index === activeIndex ? 0 : -1}
                className={`w-full flex items-center px-4 py-3 text-left rounded-lg text-primary-text/75 dark:text-primary-text-dark/75 hover:bg-accent/15 hover:text-accent focus:bg-accent/15 focus:text-accent focus:outline-none transition-colors duration-150 font-bold font-host cursor-pointer ${
                  index === activeIndex ? 'bg-accent/15 text-accent' : ''
                }`}
              >
                <span className="mr-3 opacity-60">{action.icon}</span>
                <span>{action.title}</span>
              </button>
            ))
          ) : (
            <div className="p-6 text-center text-primary-text/40 dark:text-primary-text-dark/40 font-bold text-sm font-host">
              {t('palette.empty')}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}