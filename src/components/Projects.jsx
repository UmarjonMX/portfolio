import { useState } from 'react';
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
      className="py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
    >
      <div className="mb-16 border-t border-border-light dark:border-border-dark pt-16">
        <h2
          className="text-4xl font-bold tracking-tight mb-4 opacity-0 animate-fadeInUp delay-100"
        >
          {t('projects.title')}
        </h2>
      </div>

      {/* Cards — using animate (not whileInView) so they ALWAYS render */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project, index) => {
          const delayClass = ['delay-100', 'delay-200', 'delay-300', 'delay-500', 'delay-700', 'delay-1000'][index % 6];
          return (
          <div
            key={index}
            className={`opacity-0 animate-fadeInUp ${delayClass}`}
            style={{ position: 'relative', zIndex: 10, isolation: 'isolate' }}
          >
            <div
              className="flex flex-col justify-between h-full bg-white/50 dark:bg-slate-900/50 backdrop-blur-md rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-all"
            >
              <div>
                <h3 className="text-2xl font-semibold mb-3">{project.title}</h3>
                
                {/* Problem */}
                <div className="mb-4">
                  <p className="text-xs font-martian font-bold tracking-widest uppercase text-accent mb-2">Problem</p>
                  <p className="text-sm text-primary-text/80 dark:text-primary-text-dark/80 leading-relaxed">
                    {project.problem}
                  </p>
                </div>

                {/* Solution */}
                <div className="mb-4">
                  <p className="text-xs font-martian font-bold tracking-widest uppercase text-primary-text/60 dark:text-primary-text-dark/60 mb-2">Solution</p>
                  <p className="text-sm text-primary-text/80 dark:text-primary-text-dark/80 leading-relaxed">
                    {project.solution}
                  </p>
                </div>

                {/* Impact */}
                <div className="mb-4">
                  <p className="text-xs font-martian font-bold tracking-widest uppercase text-primary-text/60 dark:text-primary-text-dark/60 mb-2">Impact</p>
                  <p className="text-sm text-primary-text/70 dark:text-primary-text-dark/70 leading-relaxed">
                    {project.impact}
                  </p>
                </div>
              </div>

              <div className="mt-auto flex flex-col gap-4">
                {/* Engineering Highlight */}
                {project.engineering && (
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
                    <p className="text-xs font-martian font-bold tracking-widest uppercase text-primary-text/50 dark:text-primary-text-dark/50 mb-2">Engineering</p>
                    <p className="text-xs text-primary-text/60 dark:text-primary-text-dark/60 leading-relaxed">
                      {project.engineering}
                    </p>
                  </div>
                )}

                {/* Technology Badges (Secondary) */}
                <div className="flex flex-wrap gap-2">
                  {(project.tech || []).map((tItem, i) => (
                    <span
                      key={i}
                      className="font-martian text-[9px] font-bold tracking-widest uppercase px-2 py-1 bg-black/3 dark:bg-white/5 rounded-full text-primary-text/40 dark:text-primary-text-dark/40"
                    >
                      {tItem}
                    </span>
                  ))}
                </div>

                <button
                  onClick={() => setSelectedProject(project)}
                  className="w-full py-3 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-accent hover:text-white dark:hover:text-background transition-colors text-sm font-semibold"
                >
                  {t('projects.viewDetails')}
                </button>
              </div>
            </div>
          </div>
        )})}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-background/80 dark:bg-background-dark/80 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full max-w-2xl bg-background dark:bg-background-dark border border-border-light dark:border-border-dark rounded-[2rem] p-8 shadow-2xl"
            >
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-6 right-6 p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
              >
                <X size={24} />
              </button>

              <h3 className="text-3xl font-bold mb-6 pr-12">{selectedProject.title}</h3>
              
              {/* Problem */}
              <div className="mb-6">
                <p className="text-xs font-martian font-bold tracking-widest uppercase text-accent mb-3">Problem</p>
                <p className="text-base text-primary-text/90 dark:text-primary-text-dark/90 leading-relaxed">
                  {selectedProject.problem}
                </p>
              </div>

              {/* Solution */}
              <div className="mb-6">
                <p className="text-xs font-martian font-bold tracking-widest uppercase text-primary-text/60 dark:text-primary-text-dark/60 mb-3">Solution</p>
                <p className="text-base text-primary-text/90 dark:text-primary-text-dark/90 leading-relaxed">
                  {selectedProject.solution}
                </p>
              </div>

              {/* Impact */}
              <div className="mb-6">
                <p className="text-xs font-martian font-bold tracking-widest uppercase text-primary-text/60 dark:text-primary-text-dark/60 mb-3">Impact</p>
                <p className="text-base text-primary-text/80 dark:text-primary-text-dark/80 leading-relaxed">
                  {selectedProject.impact}
                </p>
              </div>

              {/* Engineering */}
              {selectedProject.engineering && (
                <div className="mb-8 pt-6 border-t border-border-light dark:border-border-dark">
                  <p className="text-xs font-martian font-bold tracking-widest uppercase text-primary-text/50 dark:text-primary-text-dark/50 mb-3">Engineering</p>
                  <p className="text-sm text-primary-text/70 dark:text-primary-text-dark/70 leading-relaxed">
                    {selectedProject.engineering}
                  </p>
                </div>
              )}

              {/* Technology */}
              <div className="flex flex-wrap gap-2 mb-8">
                {(selectedProject.tech || []).map((tItem, i) => (
                  <span key={i} className="font-martian text-xs font-bold uppercase px-3 py-1 bg-accent/20 text-accent rounded-full">
                    {tItem}
                  </span>
                ))}
              </div>

              {selectedProject.link && (
                <div className="mb-8">
                  <a 
                    href={selectedProject.link} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="inline-flex items-center space-x-3 bg-primary-text dark:bg-primary-text-dark text-background dark:text-background-dark px-6 py-3 rounded-xl font-bold font-funnel hover:scale-105 hover:bg-accent dark:hover:bg-accent hover:text-white dark:hover:text-background transition-all shadow-md active:scale-95"
                  >
                    <span>Visit Project</span>
                    <ExternalLink size={18} />
                  </a>
                </div>
              )}

              <div className="w-full h-64 bg-black/5 dark:bg-white/5 rounded-2xl border border-border-light dark:border-border-dark flex items-center justify-center">
                <span className="font-martian text-primary-text/40 dark:text-primary-text-dark/40 font-medium tracking-widest uppercase text-sm">
                  {t('projects.mockupPlaceholder')}
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <CodeSnippet />
    </section>
  );
}
