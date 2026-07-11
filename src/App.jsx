import { useState, useEffect, Suspense, lazy } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Projects from './components/Projects';
import BuilderDashboard from './components/BuilderDashboard';
import Contact from './components/Contact';
import Footer from './components/Footer';
import CursorTrail from './components/CursorTrail';
import CommandPalette from './components/CommandPalette';
import { LanguageProvider } from './context/LanguageContext';

const Background3D = lazy(() => import('./components/Background3D'));

function AppContent() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  const [shouldMount3D, setShouldMount3D] = useState(false);

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  useEffect(() => {
    let timeoutId;
    let idleId;

    const mountBackground = () => {
      setShouldMount3D(true);
    };

    // Check motion preference first
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const queueMount = () => {
      if ('requestIdleCallback' in window) {
        idleId = requestIdleCallback(() => mountBackground(), { timeout: 2000 });
      } else {
        requestAnimationFrame(() => mountBackground());
      }
    };

    if (prefersReducedMotion) {
      queueMount();
    } else {
      // Delay mounting until after the Hero page-entry slide animations (~1200ms)
      timeoutId = setTimeout(queueMount, 1200);
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      if (idleId && 'cancelIdleCallback' in window) {
        cancelIdleCallback(idleId);
      }
    };
  }, []);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  return (
    <div className="min-h-screen relative selection:bg-accent selection:text-white bg-transparent text-primary-text dark:text-primary-text-dark flex flex-col overflow-x-hidden">
      <CursorTrail />
      <CommandPalette isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
      
      {shouldMount3D && (
        <Suspense fallback={null}>
          <div className="animate-fadeIn">
            <Background3D />
          </div>
        </Suspense>
      )}

      <Navbar isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
      
      <main style={{ position: 'relative', zIndex: 10 }} className="flex-grow pt-20 w-full overflow-x-hidden">
        <Hero />
        <About />
        <Projects />
        <BuilderDashboard />
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
