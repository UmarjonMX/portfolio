import { useState } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import BentoCard from './BentoCard';
import CodeSnippet from './CodeSnippet';

export default function Projects() {
  const [selectedProject, setSelectedProject] = useState(null);
  const { t } = useLanguage();
  const projects = t('projects.items') || [];

  return (
    <section
      id="projects"
      style={{ position: 'relative', zIndex: 50, isolation: 'isolate' }}
      className="py-32 px-6 sm:px-10 lg:px-16 max-w-7xl mx-auto"
    >
      {/* Section Header */}
      <div className="mb-16 border-l-2 border-accent/30 pl-6">
        <div className="mb-4 inline-flex items-center gap-2 px-3 py-1 bg-accent/10 border border-accent/25 rounded-md text-accent text-[10px] font-martian font-bold uppercase tracking-wider">
          Sheet 03 // Shipped Works
        </div>
        <h2 className="text-4xl font-bold tracking-tight mb-4 text-primary-text dark:text-primary-text-dark font-martian">
          {t('projects.title')}
        </h2>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((project, index) => {
          return (
            <BentoCard
              key={index}
              containerClassName="h-full"
              className="flex flex-col justify-between h-full p-6 sm:p-8 bg-white dark:bg-card-bg-dark border border-primary-text dark:border-primary-text-dark"
            >
              <div className="flex flex-col h-full justify-between">
                <div>
                  <div className="font-martian text-[9px] font-bold text-accent/60 uppercase tracking-widest mb-4">
                    FILE // SH-03_0{index + 1}
                  </div>
                  <h3 className="text-2xl font-bold mb-4 font-martian tracking-tight text-primary-text dark:text-primary-text-dark">
                    {project.title}
                  </h3>
                  
                  {/* Problem */}
                  <div className="mb-4">
                    <p className="text-[10px] font-martian font-bold tracking-widest uppercase text-accent mb-1">Problem</p>
                    <p className="text-sm text-primary-text/80 dark:text-primary-text-dark/80 leading-relaxed font-funnel">
                      {project.problem}
                    </p>
                  </div>

                  {/* Solution */}
                  <div className="mb-4">
                    <p className="text-[10px] font-martian font-bold tracking-widest uppercase text-primary-text/50 dark:text-primary-text-dark/50 mb-1">Solution</p>
                    <p className="text-sm text-primary-text/80 dark:text-primary-text-dark/80 leading-relaxed font-funnel">
                      {project.solution}
                    </p>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-primary-text/5 dark:border-primary-text-dark/5">
                  {/* Technology Badges */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {(project.tech || []).map((tItem, i) => (
                      <span
                        key={i}
                        className="font-martian text-[9px] font-semibold tracking-widest uppercase px-2 py-0.5 bg-primary-text/5 dark:bg-primary-text-dark/5 rounded border border-primary-text/10 dark:border-primary-text-dark/10 text-primary-text/60 dark:text-primary-text-dark/60"
                      >
                        {tItem}
                      </span>
                    ))}
                  </div>

                  <button
                    onClick={() => setSelectedProject(project)}
                    className="w-full py-3 rounded-lg border border-primary-text dark:border-primary-text-dark bg-white dark:bg-card-bg-dark text-primary-text dark:text-primary-text-dark font-funnel font-bold tracking-widest uppercase text-xs shadow-hard-interactive-light dark:shadow-hard-interactive-dark transition-all cursor-pointer"
                  >
                    {t('projects.viewDetails')}
                  </button>
                </div>
              </div>
            </BentoCard>
          );
        })}
      </div>

      {/* Cabinet Drawer Side-Drawer Modal */}
      <AnimatePresence>
        {selectedProject && (
          <>
            {/* Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProject(null)}
              className="fixed inset-0 z-[240] bg-black cursor-pointer"
            />

            {/* Sidebar drawer sliding from the right */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 220 }}
              className="fixed top-0 right-0 h-full w-full max-w-xl bg-white dark:bg-card-bg-dark border-l-2 border-primary-text dark:border-primary-text-dark z-[250] shadow-2xl p-8 sm:p-12 overflow-y-auto blueprint-grid-light dark:blueprint-grid-dark text-primary-text dark:text-primary-text-dark"
            >
              {/* Header inside drawer */}
              <div className="flex justify-between items-center border-b border-primary-text/10 dark:border-primary-text-dark/10 pb-6 mb-8">
                <div>
                  <span className="font-martian text-[10px] font-bold text-accent tracking-[0.2em] uppercase">
                    Ledger Sheet Detail // Shipped Project
                  </span>
                  <h3 className="text-3xl font-bold font-martian tracking-tight mt-1">{selectedProject.title}</h3>
                </div>
                <button
                  onClick={() => setSelectedProject(null)}
                  className="p-2 border border-primary-text dark:border-primary-text-dark rounded-lg bg-white dark:bg-card-bg-dark shadow-hard-interactive-light dark:shadow-hard-interactive-dark transition-all cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Problem */}
              <div className="mb-8 border-b border-primary-text/5 dark:border-primary-text-dark/5 pb-6">
                <p className="text-xs font-martian font-bold tracking-widest uppercase text-accent mb-2">Problem Statement</p>
                <p className="text-base text-primary-text/90 dark:text-primary-text-dark/90 leading-relaxed font-funnel">
                  {selectedProject.problem}
                </p>
              </div>

              {/* Solution */}
              <div className="mb-8 border-b border-primary-text/5 dark:border-primary-text-dark/5 pb-6">
                <p className="text-xs font-martian font-bold tracking-widest uppercase text-primary-text/50 dark:text-primary-text-dark/50 mb-2">Solution Implementation</p>
                <p className="text-base text-primary-text/90 dark:text-primary-text-dark/90 leading-relaxed font-funnel">
                  {selectedProject.solution}
                </p>
              </div>

              {/* Impact */}
              <div className="mb-8 border-b border-primary-text/5 dark:border-primary-text-dark/5 pb-6">
                <p className="text-xs font-martian font-bold tracking-widest uppercase text-primary-text/50 dark:text-primary-text-dark/50 mb-2">Quantified Impact</p>
                <p className="text-base text-primary-text/80 dark:text-primary-text-dark/80 leading-relaxed font-funnel">
                  {selectedProject.impact}
                </p>
              </div>

              {/* Engineering (Recessed panel) */}
              {selectedProject.engineering && (
                <div className="mb-8 p-6 recess-inset-light dark:recess-inset-dark border border-primary-text/10 dark:border-primary-text-dark/10 rounded-xl">
                  <p className="text-xs font-martian font-bold tracking-widest uppercase text-accent mb-3">Engineering Highlights</p>
                  <p className="text-sm text-primary-text/80 dark:text-primary-text-dark/80 leading-relaxed font-funnel">
                    {selectedProject.engineering}
                  </p>
                </div>
              )}

              {/* Technology Badges */}
              <div className="mb-8">
                <p className="text-xs font-martian font-bold tracking-widest uppercase text-primary-text/40 dark:text-primary-text-dark/40 mb-3">Built With</p>
                <div className="flex flex-wrap gap-2">
                  {(selectedProject.tech || []).map((tItem, i) => (
                    <span 
                      key={i} 
                      className="font-martian text-[10px] font-bold uppercase px-3 py-1 bg-accent/10 border border-accent/20 text-accent rounded-md"
                    >
                      {tItem}
                    </span>
                  ))}
                </div>
              </div>

              {selectedProject.link && (
                <div className="mb-8 pt-4">
                  <a 
                    href={selectedProject.link} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="inline-flex items-center space-x-3 bg-accent text-white dark:text-[#1C1C1D] border border-primary-text dark:border-primary-text-dark px-6 py-3 rounded-lg font-bold font-funnel tracking-widest uppercase text-xs shadow-hard-interactive-light dark:shadow-hard-interactive-dark hover:translate-y-0.5 active:translate-y-1 transition-all"
                  >
                    <span>Visit Live Project</span>
                    <ExternalLink size={14} />
                  </a>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <CodeSnippet />
    </section>
  );
}
