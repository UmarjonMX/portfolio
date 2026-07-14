import { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Moon, Sun, Globe, Code, Mail, Search } from 'lucide-react';

export default function CommandPalette({ isDarkMode, toggleTheme }) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const { lang, toggleLanguage } = useLanguage();
  const inputRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 50);
    } else {
      setTimeout(() => {
        setSearch('');
      }, 0);
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
    }
  ];

  const filteredActions = actions.filter(action => 
    action.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/45">
      {/* Overlay to close when clicking outside */}
      <div 
        className="absolute inset-0 cursor-pointer" 
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      ></div>
      
      {/* Drafting Ledger Modal Console */}
      <div 
        className="relative w-full max-w-lg bg-white dark:bg-card-bg-dark rounded-xl shadow-hard-light dark:shadow-hard-dark border border-primary-text dark:border-primary-text-dark overflow-hidden flex flex-col transform transition-all font-martian text-primary-text dark:text-primary-text-dark"
        role="dialog"
        aria-modal="true"
      >
        {/* Search input header */}
        <div className="flex items-center px-4 border-b border-primary-text/10 dark:border-primary-text-dark/10 bg-[#FAFAFA] dark:bg-background-dark">
          <Search size={18} className="text-primary-text/40 dark:text-primary-text-dark/40 mr-3" />
          <input
            ref={inputRef}
            type="text"
            className="flex-1 bg-transparent py-4 outline-none text-primary-text dark:text-primary-text-dark placeholder-primary-text/40 dark:text-primary-text-dark/40 font-bold font-funnel"
            placeholder="Search console ledger commands..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <kbd className="hidden sm:inline-block px-2.5 py-1 text-[9px] font-martian font-bold text-primary-text/60 dark:text-primary-text-dark/60 bg-primary-text/5 dark:bg-primary-text-dark/5 rounded border border-primary-text/10 dark:border-primary-text-dark/10">
            ESC
          </kbd>
        </div>

        {/* Action list */}
        <div className="max-h-[50vh] overflow-y-auto p-2 bg-white dark:bg-card-bg-dark">
          {filteredActions.length > 0 ? (
            filteredActions.map((action) => (
              <button
                key={action.id}
                onClick={action.onSelect}
                className="w-full flex items-center px-4 py-3 text-left rounded-lg text-primary-text/75 dark:text-primary-text-dark/75 hover:bg-accent/15 hover:text-accent focus:bg-accent/15 focus:text-accent focus:outline-none transition-colors duration-150 font-bold font-funnel cursor-pointer"
              >
                <span className="mr-3 opacity-60">{action.icon}</span>
                <span>{action.title}</span>
              </button>
            ))
          ) : (
            <div className="p-6 text-center text-primary-text/40 dark:text-primary-text-dark/40 font-bold text-sm">
              No commands matched.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
