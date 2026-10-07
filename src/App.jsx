import { useState, useEffect, lazy, Suspense } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, useTransform } from 'framer-motion';

import Navbar from './components/Navbar';
import Hero from './components/Hero';
const About = lazy(() => import('./components/About'));
const Projects = lazy(() => import('./components/Projects'));
const BuilderDashboard = lazy(() => import('./components/BuilderDashboard'));
const Contact = lazy(() => import('./components/Contact'));
import CommandPalette from './components/CommandPalette';
import ToastProvider from './components/ToastProvider';
import ErrorBoundary from './components/ErrorBoundary';
import SceneErrorBoundary from './components/3d/SceneErrorBoundary';
import FinalStatement from './components/FinalStatement';

import {
  ScrollStage,
  seg,
  useChapterProgress,
  usePrefersReducedMotion,
} from './components/scroll/ScrollStage';
import ChapterReadout from './components/scroll/ChapterReadout';

const SceneManager = lazy(() => import('./components/3d/SceneManager'));
const ProjectDetail = lazy(() =>
  import('./components/ProjectDetail').then((m) => ({ default: m.default }))
);
const ProjectNotFound = lazy(() =>
  import('./components/ProjectDetail').then((m) => ({ default: m.ProjectNotFound }))
);

import { LanguageProvider } from './context/LanguageContext';
import { useRoute, useHashLinkBridge, projectSlugFrom } from './router';
import { useLanguage } from './context/LanguageContext';

/**
 * Chapter entry.
 *
 * Previously each section owned an IntersectionObserver plus a scroll listener
 * and called setState on every scroll event. Now the whole page shares one
 * scroll MotionValue, and a section's arrival is a transform on that value —
 * no observers, no per-scroll renders, and no exit fade that would break the
 * sense of one continuous composition.
 */
function Chapter({ id, children }) {
  const p = useChapterProgress(id, 'enter');
  const reduced = usePrefersReducedMotion();

  // Arrival is keyed to the section entering the viewport, and begins
  // immediately — the previous chapter is still scrolling out at that point,
  // so a late fade would leave a dead frame between the two.
  const opacity = useTransform(p, (v) => (reduced ? 1 : seg(v, 0.02, 0.5)));
  const y = useTransform(p, (v) => (reduced ? 0 : 30 * (1 - seg(v, 0.02, 0.55))));

  return (
    <motion.div style={{ opacity, y }} className="w-full">
      {children}
    </motion.div>
  );
}

function AppContent() {
  const { pathname } = useRoute();
  useHashLinkBridge();

  const { t } = useLanguage();
  const projects = t('projects.items') || [];
  const slug = projectSlugFrom(pathname);
  const project = slug ? projects.find((p) => p.slug === slug) : null;

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
    <div className="min-h-screen relative selection:bg-accent selection:text-white bg-transparent text-primary-text dark:text-primary-text-dark flex flex-col overflow-x-clip">
      {/* Skip to content link for keyboard accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[200] focus:px-4 focus:py-2 focus:bg-accent focus:text-white focus:rounded-lg focus:font-bold focus:text-sm focus:outline-none"
      >
        Skip to main content
      </a>
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
      
      {/* Global 3D Ambient Mesh Background — SceneManager positions itself fixed z-[-1] */}
      <SceneErrorBoundary fallback={null}>
        <Suspense fallback={null}>
          <SceneManager isDarkMode={isDarkMode} />
        </Suspense>
      </SceneErrorBoundary>
      
      <ChapterReadout />

      <Navbar isDarkMode={isDarkMode} toggleTheme={toggleTheme} />

      {slug ? (
        /* A project page replaces the narrative rather than layering over it —
           one background, one scroll position, one document. */
        <main
          id="main-content"
          style={{ position: 'relative', zIndex: 10 }}
          className="flex-grow pt-20 w-full overflow-x-clip"
        >
          <Suspense fallback={<div />}>
            {project ? <ProjectDetail project={project} /> : <ProjectNotFound />}
          </Suspense>
        </main>
      ) : (
        <main
          id="main-content"
          style={{ position: 'relative', zIndex: 10 }}
          className="flex-grow pt-20 w-full overflow-x-clip"
        >
          <Hero isDarkMode={isDarkMode} />
          <Chapter id="about">
            <Suspense fallback={<div />}>
              <About />
            </Suspense>
          </Chapter>
          <Chapter id="projects">
            <Suspense fallback={<div />}>
              <Projects />
            </Suspense>
          </Chapter>
          <Chapter id="engineering">
            <Suspense fallback={<div />}>
              <BuilderDashboard />
            </Suspense>
          </Chapter>
          <Chapter id="contact">
            <Suspense fallback={<div />}>
              <Contact />
            </Suspense>
          </Chapter>
          <FinalStatement />
        </main>
      )}
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <ErrorBoundary>
        <ScrollStage>
          <ToastProvider />
          <AppContent />
        </ScrollStage>
      </ErrorBoundary>
    </LanguageProvider>
  );
}
