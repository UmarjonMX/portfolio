import { useState, useEffect, useRef, lazy, Suspense } from 'react';

import Navbar from './components/Navbar';
import Hero from './components/Hero';
const About = lazy(() => import('./components/About'));
const Projects = lazy(() => import('./components/Projects'));
const BuilderDashboard = lazy(() => import('./components/BuilderDashboard'));
const Contact = lazy(() => import('./components/Contact'));
import Footer from './components/Footer';
import CommandPalette from './components/CommandPalette';
import ToastProvider from './components/ToastProvider';
import ErrorBoundary from './components/ErrorBoundary';

import { LanguageProvider } from './context/LanguageContext';

function FadeSection({ children }) {
  const ref = useRef(null);
  const [style, setStyle] = useState({ opacity: 0, transform: 'translateY(15px)' });

  useEffect(() => {
    let isVisible = false;
    const currentRef = ref.current;

    const handleScroll = () => {
      if (!isVisible || !currentRef) return;
      const rect = currentRef.getBoundingClientRect();
      const viewHeight = window.innerHeight;
      
      const threshold = 180; // boundary limit for progressive fading
      let opacity = 1;
      let translateY = 0;

      if (rect.top > viewHeight - threshold) {
        const factor = Math.max(0, Math.min(1, (viewHeight - rect.top) / threshold));
        opacity = factor;
        translateY = (1 - factor) * 15;
      } else if (rect.bottom < threshold) {
        const factor = Math.max(0, Math.min(1, rect.bottom / threshold));
        opacity = factor;
        translateY = (1 - factor) * -15;
      }

      setStyle({
        opacity: opacity,
        transform: `translateY(${translateY}px)`,
        transition: 'opacity 0.25s ease-out, transform 0.25s ease-out'
      });
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible) {
          handleScroll();
        } else {
          setStyle({ opacity: 0, transform: 'translateY(15px)' });
        }
      },
      { rootMargin: '50px 0px' }
    );

    if (currentRef) observer.observe(currentRef);
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      if (currentRef) observer.unobserve(currentRef);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div ref={ref} style={style} className="w-full">
      {children}
    </div>
  );
}

function AppContent() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  const [pulse, setPulse] = useState(null);

  useEffect(() => {
    const handleFirstInteraction = (e) => {
      let clientX, clientY;
      if (e.type === 'touchstart') {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else {
        clientX = e.clientX;
        clientY = e.clientY;
      }
      setPulse({ x: clientX, y: clientY });
      window.removeEventListener('mousemove', handleFirstInteraction);
      window.removeEventListener('touchstart', handleFirstInteraction);
    };
    window.addEventListener('mousemove', handleFirstInteraction, { passive: true });
    window.addEventListener('touchstart', handleFirstInteraction, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleFirstInteraction);
      window.removeEventListener('touchstart', handleFirstInteraction);
    };
  }, []);

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

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  return (
    <div className="min-h-screen relative selection:bg-accent selection:text-white bg-transparent text-primary-text dark:text-primary-text-dark flex flex-col overflow-x-hidden">
      <CommandPalette isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
      
      {/* Moment 1: Resonating Pulse */}
      {pulse && (
        <div className="fixed inset-0 pointer-events-none z-[100] mix-blend-screen">
          <svg className="w-full h-full">
            <circle
              cx={pulse.x}
              cy={pulse.y}
              className="fill-none stroke-accent stroke-[1.5] animate-[pulseRing_1.5s_cubic-bezier(0.1,0.8,0.3,1)_forwards]"
            />
          </svg>
        </div>
      )}
      
      {/* Global 3D background removed as per EPIC-15 */}
      <Navbar isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
      
      <main style={{ position: 'relative', zIndex: 10 }} className="flex-grow pt-20 w-full overflow-x-hidden">
        <Hero isDarkMode={isDarkMode} />
        <FadeSection>
          <Suspense fallback={<div>Loading...</div>}>
            <About />
          </Suspense>
        </FadeSection>
        <FadeSection>
          <Suspense fallback={<div>Loading...</div>}>
            <Projects />
          </Suspense>
        </FadeSection>
        <FadeSection>
          <Suspense fallback={<div>Loading...</div>}>
            <BuilderDashboard />
          </Suspense>
        </FadeSection>
        <FadeSection>
          <Suspense fallback={<div>Loading...</div>}>
            <Contact />
          </Suspense>
        </FadeSection>
      </main>
      
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <ErrorBoundary>
        <ToastProvider />
        <AppContent />
      </ErrorBoundary>
    </LanguageProvider>
  );
}
