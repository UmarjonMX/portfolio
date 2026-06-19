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
      // Check for Cmd+K (Mac) or Ctrl+K (Windows/Linux)
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
      // Small timeout to ensure the modal is rendered before focusing
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 50);
    } else {
      setSearch('');
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
        window.location.hash = '#projects';
        setIsOpen(false);
      }
    },
    {
      id: 'contact',
      title: 'Contact Me',
      icon: <Mail size={18} />,
      onSelect: () => {
        window.location.hash = '#contact';
        setIsOpen(false);
      }
    }
  ];

  const filteredActions = actions.filter(action => 
    action.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 dark:bg-black/60 backdrop-blur-sm">
      {/* Overlay to close when clicking outside */}
      <div 
        className="absolute inset-0" 
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      ></div>
      
      {/* Modal container */}
      <div 
        className="relative w-full max-w-lg bg-white dark:bg-zinc-900 rounded-xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden flex flex-col transform transition-all"
        role="dialog"
        aria-modal="true"
      >
        {/* Search input header */}
        <div className="flex items-center px-4 border-b border-zinc-200 dark:border-zinc-800">
          <Search size={20} className="text-zinc-500 mr-3" />
          <input
            ref={inputRef}
            type="text"
            className="flex-1 bg-transparent py-4 outline-none text-zinc-900 dark:text-zinc-100 placeholder-zinc-500 font-medium"
            placeholder="Search commands..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <kbd className="hidden sm:inline-block px-2 py-1 text-xs font-semibold text-zinc-500 bg-zinc-100 dark:bg-zinc-800 rounded border border-zinc-200 dark:border-zinc-700">
            ESC
          </kbd>
        </div>

        {/* Action list */}
        <div className="max-h-[60vh] overflow-y-auto p-2">
          {filteredActions.length > 0 ? (
            filteredActions.map((action) => (
              <button
                key={action.id}
                onClick={action.onSelect}
                className="w-full flex items-center px-4 py-3 text-left rounded-lg text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors focus:bg-zinc-100 dark:focus:bg-zinc-800 focus:outline-none"
              >
                <span className="mr-3 text-zinc-500">{action.icon}</span>
                <span className="font-medium">{action.title}</span>
              </button>
            ))
          ) : (
            <div className="p-6 text-center text-zinc-500 font-medium">
              No commands found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
