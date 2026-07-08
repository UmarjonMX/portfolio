import { useState, useEffect, Suspense, lazy } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Projects from './components/Projects';
import Resume from './components/Resume';
import Contact from './components/Contact';
import Footer from './components/Footer';
import CursorTrail from './components/CursorTrail';
import CommandPalette from './components/CommandPalette';
import ErrorBoundary from './components/ErrorBoundary';
import { LanguageProvider } from './context/LanguageContext';
import { getStoredValue, setStoredValue } from './utils/safeStorage';

const Background3D = lazy(() => import('./components/Background3D'));

function AppContent() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = getStoredValue('theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
      setStoredValue('theme', 'dark');
    } else {
      root.classList.remove('dark');
      setStoredValue('theme', 'light');
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  return (
    <div className="min-h-screen relative selection:bg-accent selection:text-white bg-transparent text-primary-text dark:text-primary-text-dark flex flex-col overflow-x-hidden">
      <CursorTrail />
      <CommandPalette isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
      <ErrorBoundary fallback={null}>
        <Suspense fallback={null}>
          <Background3D />
        </Suspense>
      </ErrorBoundary>
      <Navbar isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
      
      <main style={{ position: 'relative', zIndex: 10 }} className="flex-grow pt-20 w-full overflow-x-hidden">
        <Hero />
        <About />
        <Projects />
        <Resume />
        <Contact />
      </main>
      
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}
