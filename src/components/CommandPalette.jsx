import { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import { useLanguage } from '../context/LanguageContext';
import { Moon, Sun, Globe, Code, Mail, Search, Download, Copy } from 'lucide-react';
import { copyToClipboard } from '../utils/clipboard';

export default function CommandPalette({ isDarkMode, toggleTheme }) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const { lang, toggleLanguage } = useLanguage();
  const inputRef = useRef(null);
  const listRef = useRef(null);
  const previousFocusRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
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
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 50);
    } else {
      // Restore focus to the element that was focused before opening
      const prevEl = previousFocusRef.current;
      if (prevEl && typeof prevEl.focus === 'function') {
        requestAnimationFrame(() => prevEl.focus());
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const actions = [
    {
      id: 'theme',
      title: 'Toggle Dark/Light Mode',
      icon: isDarkMode ? <Sun size={18} /> : <Moon size={18} />,
      onSelect: () => {
        toggleTheme();
        setIsOpen(false);
      }
    },
    {
      id: 'language',
      title: `Switch Language (${lang === 'en' ? 'UZ' : 'EN'})`,
      icon: <Globe size={18} />,
      onSelect: () => {
        toggleLanguage();
        setIsOpen(false);
      }
    },
    {
      id: 'projects',
      title: 'Go to Projects',
      icon: <Code size={18} />,
      onSelect: () => {
        const el = document.getElementById('projects');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
        setIsOpen(false);
      }
    },
    {
      id: 'contact',
      title: 'Contact Me',
      icon: <Mail size={18} />,
      onSelect: () => {
        const el = document.getElementById('contact');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
        setIsOpen(false);
      }
    },
    {
      id: 'download-resume',
      title: 'Download Resume',
      icon: <Download size={18} />,
      onSelect: async () => {
        setIsOpen(false);
        try {
          const res = await fetch('/resume.pdf', { method: 'HEAD' });
          if (res.ok) {
            const link = document.createElement('a');
            link.href = '/resume.pdf';
            link.download = 'Umarjon_MX_Resume.pdf';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            toast.success('Resume downloaded successfully.');
          } else {
            toast.error('Resume document is currently unavailable.');
          }
        } catch {
          toast.error('Resume document is currently unavailable.');
        }
      }
    },
    {
      id: 'copy-email',
      title: 'Copy Email Address',
      icon: <Copy size={18} />,
      onSelect: async () => {
        const ok = await copyToClipboard('umarjonmx@gmail.com');
        ok ? toast.success('Email address copied to clipboard.') : toast.error('Failed to copy email address.');
        setIsOpen(false);
      }
    }
  ];

  const filteredActions = actions.filter(action => 
    action.title.toLowerCase().includes(search.toLowerCase())
  );

  // Keyboard navigation handler for the palette
  const handlePaletteKeyDown = (e) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      setIsOpen(false);
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex(i => (i + 1) % Math.max(filteredActions.length, 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex(i => (i - 1 + filteredActions.length) % Math.max(filteredActions.length, 1));
    } else if (e.key === 'Enter' && filteredActions.length > 0) {
      e.preventDefault();
      filteredActions[activeIndex]?.onSelect();
    } else if (e.key === 'Tab') {
      // Focus trap: keep focus within the palette
      e.preventDefault();
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
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      ></div>
      
      {/* Drafting Ledger Modal Console */}
      <div 
        className="relative w-full max-w-lg bg-white dark:bg-card-bg-dark rounded-xl shadow-hard-light dark:shadow-hard-dark border border-primary-text dark:border-primary-text-dark overflow-hidden flex flex-col transform transition-all font-host text-primary-text dark:text-primary-text-dark"
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
      >
        {/* Search input header */}
        <div className="flex items-center px-4 border-b border-primary-text/10 dark:border-primary-text-dark/10 bg-[#FAFAFA] dark:bg-background-dark">
          <Search size={18} className="text-primary-text/40 dark:text-primary-text-dark/40 mr-3" />
          <input
            ref={inputRef}
            type="text"
            className="flex-1 bg-transparent py-4 outline-none text-primary-text dark:text-primary-text-dark placeholder-primary-text/40 dark:text-primary-text-dark/40 font-bold font-host"
            placeholder="Search console ledger commands..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setActiveIndex(0); }}
          />
          <kbd className="hidden sm:inline-block px-2.5 py-1 text-[9px] font-josefin font-bold text-primary-text/60 dark:text-primary-text-dark/60 bg-primary-text/5 dark:bg-primary-text-dark/5 rounded border border-primary-text/10 dark:border-primary-text-dark/10">
            ESC
          </kbd>
        </div>

        {/* Action list */}
        <div ref={listRef} className="max-h-[50vh] overflow-y-auto p-2 bg-white dark:bg-card-bg-dark" role="listbox">
          {filteredActions.length > 0 ? (
            filteredActions.map((action, index) => (
              <button
                key={action.id}
                onClick={action.onSelect}
                role="option"
                aria-selected={index === activeIndex}
                className={`w-full flex items-center px-4 py-3 text-left rounded-lg text-primary-text/75 dark:text-primary-text-dark/75 hover:bg-accent/15 hover:text-accent focus:bg-accent/15 focus:text-accent focus:outline-none transition-colors duration-150 font-bold font-host cursor-pointer ${index === activeIndex ? 'bg-accent/15 text-accent' : ''}`}
              >
                <span className="mr-3 opacity-60">{action.icon}</span>
                <span>{action.title}</span>
              </button>
            ))
          ) : (
            <div className="p-6 text-center text-primary-text/40 dark:text-primary-text-dark/40 font-bold text-sm font-host">
              No commands matched.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
