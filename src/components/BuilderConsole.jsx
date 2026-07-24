import { useState, useEffect } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Activity, GitCommit, CheckCircle2, Clock, Globe } from 'lucide-react';

const BOOT_SEQUENCE = [
  { id: 1, text: 'Initializing Portfolio' },
  { id: 2, text: 'Loading AI Engine' },
  { id: 3, text: 'Connecting Redis' },
  { id: 4, text: 'Building Frontend' },
  { id: 5, text: 'Running Tests' },
  { id: 6, text: 'Deploying to Vercel' },
  { id: 7, text: 'Production Ready' },
];

export default function BuilderConsole() {
  const [completedSteps, setCompletedSteps] = useState([]);

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < BOOT_SEQUENCE.length) {
        const currentId = BOOT_SEQUENCE[index].id;
        setCompletedSteps((prev) => {
          if (!prev.includes(currentId)) {
            return [...prev, currentId];
          }
          return prev;
        });
        index++;
      } else {
        clearInterval(interval);
      }
    }, 800);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-4xl mx-auto mt-20 p-1 rounded-2xl bg-gradient-to-b from-primary-text/10 to-transparent dark:from-primary-text-dark/10 shadow-hard-light dark:shadow-hard-dark">
      <div className="bg-white/80 dark:bg-[#0A0A0B]/90 backdrop-blur-3xl rounded-xl overflow-hidden border border-primary-text/10 dark:border-primary-text-dark/10">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-primary-text/5 dark:border-primary-text-dark/10 bg-primary-text/5 dark:bg-primary-text-dark/5">
          <div className="flex items-center gap-3">
            <Terminal size={16} className="text-accent" />
            <span className="font-martian text-[10px] font-bold tracking-[0.2em] uppercase text-primary-text/60 dark:text-primary-text-dark/60">
              Builder Console
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span className="font-funnel text-xs font-bold text-green-600 dark:text-green-400 uppercase tracking-widest">
              Live
            </span>
          </div>
        </div>

        <div className="p-6 md:p-10 grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Left Column: Boot Sequence */}
          <div>
            <h4 className="font-martian text-[10px] font-bold tracking-widest uppercase text-primary-text/40 dark:text-primary-text-dark/40 mb-6 flex items-center gap-2">
              <Activity size={12} />
              Boot Sequence
            </h4>
            
            <div className="space-y-4">
              <AnimatePresence>
                {BOOT_SEQUENCE.map((step, index) => {
                  const isCompleted = completedSteps.includes(step.id);
                  const isCurrent = completedSteps.length === index;
                  const isPending = completedSteps.length < index;

                  if (isPending && !isCurrent) return null;

                  return (
                    <motion.div
                      key={step.id}
                      initial={{ opacity: 0, scale: 0.95, y: 5 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      className={`flex items-center gap-3 font-funnel text-sm ${
                        isCompleted 
                          ? 'text-primary-text/90 dark:text-primary-text-dark/90 drop-shadow-[0_0_8px_rgba(224,122,95,0.2)] dark:drop-shadow-[0_0_8px_rgba(224,122,95,0.4)]' 
                          : 'text-primary-text/40 dark:text-primary-text-dark/40'
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle2 size={16} className="text-accent" />
                      ) : (
                        <motion.div 
                          animate={{ rotate: 360 }}
                          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                          className="w-4 h-4 border-2 border-accent/30 border-t-accent rounded-full"
                        />
                      )}
                      <span className={isCompleted ? 'font-bold' : ''}>{step.text}</span>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>

          {/* Right Column: Status Panels */}
          <div className="space-y-6">
            <h4 className="font-martian text-[10px] font-bold tracking-widest uppercase text-primary-text/40 dark:text-primary-text-dark/40 mb-6">
              System Status
            </h4>

            <div className="grid grid-cols-2 gap-4">
              {/* Current Mission */}
              <div className="col-span-2 p-4 rounded-xl border border-primary-text/5 dark:border-primary-text-dark/10 bg-primary-text/[0.02] dark:bg-primary-text-dark/[0.02]">
                <p className="font-martian text-[9px] uppercase tracking-widest text-accent mb-1">Current Mission</p>
                <p className="font-funnel text-sm font-bold text-primary-text dark:text-primary-text-dark">Building AI Products</p>
              </div>

              {/* Status */}
              <div className="p-4 rounded-xl border border-primary-text/5 dark:border-primary-text-dark/10 bg-primary-text/[0.02] dark:bg-primary-text-dark/[0.02]">
                <div className="flex items-center gap-2 mb-1">
                  <Activity size={12} className="text-primary-text/40 dark:text-primary-text-dark/40" />
                  <p className="font-martian text-[9px] uppercase tracking-widest text-primary-text/50 dark:text-primary-text-dark/50">Status</p>
                </div>
                <p className="font-funnel text-sm font-bold text-primary-text dark:text-primary-text-dark flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                  Building
                </p>
              </div>

              {/* Location */}
              <div className="p-4 rounded-xl border border-primary-text/5 dark:border-primary-text-dark/10 bg-primary-text/[0.02] dark:bg-primary-text-dark/[0.02]">
                <div className="flex items-center gap-2 mb-1">
                  <Globe size={12} className="text-primary-text/40 dark:text-primary-text-dark/40" />
                  <p className="font-martian text-[9px] uppercase tracking-widest text-primary-text/50 dark:text-primary-text-dark/50">Location</p>
                </div>
                <p className="font-funnel text-sm font-bold text-primary-text dark:text-primary-text-dark">Uzbekistan</p>
              </div>

              {/* Focus */}
              <div className="col-span-2 p-4 rounded-xl border border-primary-text/5 dark:border-primary-text-dark/10 bg-primary-text/[0.02] dark:bg-primary-text-dark/[0.02]">
                <p className="font-martian text-[9px] uppercase tracking-widest text-primary-text/50 dark:text-primary-text-dark/50 mb-2">Focus Areas</p>
                <div className="flex flex-wrap gap-2">
                  {['Developer Tools', 'Education', 'AI'].map(focus => (
                    <span key={focus} className="px-2 py-1 rounded border border-accent/20 bg-accent/5 text-accent font-martian text-[9px] font-bold uppercase tracking-widest">
                      {focus}
                    </span>
                  ))}
                </div>
              </div>

              {/* Latest Deployment */}
              <div className="col-span-2 flex items-center justify-between p-4 rounded-xl border border-accent/20 bg-accent/5">
                <div className="flex items-center gap-3">
                  <GitCommit size={14} className="text-accent" />
                  <div>
                    <p className="font-martian text-[9px] uppercase tracking-widest text-accent mb-1">Latest Build</p>
                    <p className="font-funnel text-sm font-bold text-primary-text dark:text-primary-text-dark">85eaf6e</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-martian text-[9px] uppercase tracking-widest text-primary-text/50 dark:text-primary-text-dark/50 flex items-center justify-end gap-1 mb-1">
                    <Clock size={10}/> Deployed
                  </p>
                  <p className="font-funnel text-sm text-green-600 dark:text-green-400 font-bold">Production</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
