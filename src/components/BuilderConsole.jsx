import { useState, useEffect } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Activity, GitCommit, CheckCircle2, Clock, Globe } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

/** The commit this build came from, injected by vite.config.js at build time. */
const COMMIT = __COMMIT__;

export default function BuilderConsole() {
  const { t } = useLanguage();
  const steps = t('console.steps');

  // One index rather than an array of ids: the sequence is strictly ordered,
  // so "how far along am I" is the only state there is.
  const [completedSteps, setCompletedSteps] = useState(0);
  const [runFor, setRunFor] = useState(steps);

  // Changing language changes the number of steps, so the run starts over.
  // Adjusting during render is React's own pattern for "reset state when an
  // input changes" — doing it in an effect would render the old count once
  // with the new copy.
  if (runFor !== steps) {
    setRunFor(steps);
    setCompletedSteps(0);
  }

  useEffect(() => {
    if (completedSteps >= steps.length) return undefined;
    const timer = setTimeout(() => setCompletedSteps((n) => n + 1), 800);
    return () => clearTimeout(timer);
  }, [completedSteps, steps.length]);

  /* NOTE: the console is the largest surface in the Projects chapter, so it
     paints its own background rather than blurring whatever is behind it.
     `backdrop-blur-3xl` under a 90%-opaque dark fill was measured as the
     single biggest contributor to a hazy sheet over the ambient field — the
     blur was sampling it and re-compositing it as a flat brown film.
     The gradient ring outside it is kept: it reads as a printed edge. */
  return (
    <div className="max-w-4xl mx-auto mt-20 p-1 rounded-2xl bg-gradient-to-b from-primary-text/10 to-transparent dark:from-primary-text-dark/10 shadow-hard-light dark:shadow-hard-dark">
      <div className="bg-white dark:bg-card-bg-dark rounded-xl overflow-hidden border border-primary-text/10 dark:border-primary-text-dark/10">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-primary-text/5 dark:border-primary-text-dark/10 bg-primary-text/5 dark:bg-primary-text-dark/5">
          <div className="flex items-center gap-3">
            <Terminal size={16} className="text-accent" />
            <span className="font-josefin text-xs font-bold tracking-[0.2em] uppercase text-primary-text/60 dark:text-primary-text-dark/60">
              {t('console.title')}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
            </span>
            <span className="font-josefin text-xs font-bold text-green-600 dark:text-green-400 uppercase tracking-widest">
              {t('console.live')}
            </span>
          </div>
        </div>

        <div className="p-6 md:p-10 grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Left Column: Boot Sequence */}
          <div>
            <h4 className="font-josefin text-xs font-bold tracking-widest uppercase text-primary-text/40 dark:text-primary-text-dark/40 mb-6 flex items-center gap-2">
              <Activity size={12} />
              {t('console.boot')}
            </h4>

            <div className="space-y-4">
              <AnimatePresence>
                {steps.map((step, index) => {
                  const isCompleted = index < completedSteps;
                  const isCurrent = index === completedSteps;
                  if (!isCompleted && !isCurrent) return null;

                  return (
                    <motion.div
                      key={step}
                      initial={{ opacity: 0, scale: 0.95, y: 5 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      className={`flex items-center gap-3 font-host text-sm ${
                        isCompleted
                          ? 'text-primary-text/90 dark:text-primary-text-dark/90'
                          : 'text-primary-text/40 dark:text-primary-text-dark/40'
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle2 size={16} className="text-accent shrink-0" />
                      ) : (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                          className="w-4 h-4 shrink-0 border-2 border-accent/30 border-t-accent rounded-full"
                        />
                      )}
                      <span className={isCompleted ? 'font-bold' : ''}>{step}</span>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>

          {/* Right Column: Status Panels */}
          <div className="space-y-6">
            <h4 className="font-josefin text-xs font-bold tracking-widest uppercase text-primary-text/40 dark:text-primary-text-dark/40 mb-6">
              {t('console.status')}
            </h4>

            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 p-4 rounded-xl border border-primary-text/5 dark:border-primary-text-dark/10 bg-primary-text/[0.02] dark:bg-primary-text-dark/[0.02]">
                <p className="font-josefin text-[10px] font-bold uppercase tracking-widest text-accent mb-1">
                  {t('console.missionLabel')}
                </p>
                <p className="font-host text-sm font-bold text-primary-text dark:text-primary-text-dark">
                  {t('console.mission')}
                </p>
              </div>

              <div className="p-4 rounded-xl border border-primary-text/5 dark:border-primary-text-dark/10 bg-primary-text/[0.02] dark:bg-primary-text-dark/[0.02]">
                <div className="flex items-center gap-2 mb-1">
                  <Activity size={12} className="text-primary-text/40 dark:text-primary-text-dark/40" />
                  <p className="font-josefin text-[10px] font-bold uppercase tracking-widest text-primary-text/50 dark:text-primary-text-dark/50">
                    {t('console.statusLabel')}
                  </p>
                </div>
                <p className="font-host text-sm font-bold text-primary-text dark:text-primary-text-dark flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  {t('console.building')}
                </p>
              </div>

              <div className="p-4 rounded-xl border border-primary-text/5 dark:border-primary-text-dark/10 bg-primary-text/[0.02] dark:bg-primary-text-dark/[0.02]">
                <div className="flex items-center gap-2 mb-1">
                  <Globe size={12} className="text-primary-text/40 dark:text-primary-text-dark/40" />
                  <p className="font-josefin text-[10px] font-bold uppercase tracking-widest text-primary-text/50 dark:text-primary-text-dark/50">
                    {t('console.locationLabel')}
                  </p>
                </div>
                <p className="font-host text-sm font-bold text-primary-text dark:text-primary-text-dark">
                  {t('hero.location')}
                </p>
              </div>

              <div className="col-span-2 p-4 rounded-xl border border-primary-text/5 dark:border-primary-text-dark/10 bg-primary-text/[0.02] dark:bg-primary-text-dark/[0.02]">
                <p className="font-josefin text-[10px] font-bold uppercase tracking-widest text-primary-text/50 dark:text-primary-text-dark/50 mb-2">
                  {t('console.focusLabel')}
                </p>
                <div className="flex flex-wrap gap-2">
                  {t('console.focus').map((focus) => (
                    <span
                      key={focus}
                      className="px-2 py-1 rounded border border-accent/20 bg-accent/5 text-accent font-josefin text-[10px] font-bold uppercase tracking-widest"
                    >
                      {focus}
                    </span>
                  ))}
                </div>
              </div>

              {/* The commit is read from git at build time (see vite.config.js).
                  It was a hardcoded string before, and not one that existed in
                  this repository — a fabricated fact on a page about shipping
                  real work. */}
              <div className="col-span-2 flex items-center justify-between p-4 rounded-xl border border-accent/20 bg-accent/5">
                <div className="flex items-center gap-3">
                  <GitCommit size={14} className="text-accent shrink-0" />
                  <div>
                    <p className="font-josefin text-[10px] font-bold uppercase tracking-widest text-accent mb-1">
                      {t('console.buildLabel')}
                    </p>
                    <p className="font-host text-sm font-bold text-primary-text dark:text-primary-text-dark tabular-nums">
                      {COMMIT}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-josefin text-[10px] font-bold uppercase tracking-widest text-primary-text/50 dark:text-primary-text-dark/50 flex items-center justify-end gap-1 mb-1">
                    <Clock size={10} /> {t('console.deployedLabel')}
                  </p>
                  <p className="font-host text-sm text-green-600 dark:text-green-400 font-bold">
                    {t('console.production')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}