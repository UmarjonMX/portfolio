import { useState, useRef } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { X, ExternalLink } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import BentoCard from './BentoCard';
import BuilderConsole from './BuilderConsole';

function ProjectCard({ project, index, onClick }) {
  const ref = useRef(null);
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 40 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 40 });
  
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["3deg", "-3deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-3deg", "3deg"]);
  const glareX = useTransform(mouseXSpring, [-0.5, 0.5], ["100%", "0%"]);
  const glareY = useTransform(mouseYSpring, [-0.5, 0.5], ["100%", "0%"]);

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    const xPct = (mouseX / width) - 0.5;
    const yPct = (mouseY / height) - 0.5;
    x.set(xPct);
    y.set(yPct);
  };
  
  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const getBentoClasses = (idx) => {
    if (idx === 0) return 'md:col-span-2 lg:col-span-3'; // Hero
    if (idx === 1) return 'md:col-span-2 lg:col-span-2'; // Large supporting
    if (idx === 2) return 'md:col-span-1 lg:col-span-1'; // Small supporting
    if (idx === 3) return 'md:col-span-2 lg:col-span-3'; // Wide supporting
    return 'col-span-1';
  };

  const isWide = index === 0 || index === 1 || index === 3;

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d"
      }}
      className={`relative group cursor-pointer ${getBentoClasses(index)} z-10 transition-shadow duration-500 hover:z-20`}
    >
      {/* Dynamic Cursor Shadow */}
      <motion.div 
        className="absolute inset-0 rounded-2xl bg-black/5 dark:bg-black/40 blur-2xl -z-10 transition-opacity opacity-0 group-hover:opacity-100"
        style={{
          x: useTransform(mouseXSpring, [-0.5, 0.5], [-20, 20]),
          y: useTransform(mouseYSpring, [-0.5, 0.5], [-20, 20]),
        }}
      />
      
      <BentoCard containerClassName="h-full" className="h-full relative overflow-hidden flex flex-col p-6 sm:p-10 bg-white/70 dark:bg-card-bg-dark border border-primary-text/10 dark:border-primary-text-dark/20 shadow-hard-light dark:shadow-hard-dark">
        {/* Dynamic Glare */}
        <motion.div 
          style={{ left: glareX, top: glareY }}
          className="absolute pointer-events-none w-[800px] h-[800px] bg-white/40 dark:bg-white/10 blur-[100px] rounded-full -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-30" 
        />

        <div className="flex flex-col h-full z-10 relative pointer-events-none group-hover:pointer-events-auto">
          {/* Status & Timeline Header */}
          <div className="flex items-center gap-4 mb-8">
            <span className="px-3 py-1 bg-primary-text/5 dark:bg-primary-text-dark/5 border border-primary-text/10 dark:border-primary-text-dark/10 rounded-full font-martian text-[9px] font-bold uppercase tracking-widest flex items-center gap-2">
              {project.status === 'Building' || project.status === 'Qurilmoqda' ? (
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              ) : (
                <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
              )}
              {project.status}
            </span>
            <span className="font-funnel text-[10px] font-bold text-primary-text/40 dark:text-primary-text-dark/40 tracking-widest uppercase">
              {project.timeline}
            </span>
          </div>

          <h3 className="text-3xl lg:text-4xl font-bold mb-8 font-martian tracking-tight text-primary-text dark:text-primary-text-dark">
            {project.title}
          </h3>
          
          <div className={`grid grid-cols-1 ${isWide ? 'lg:grid-cols-2 gap-12' : 'gap-8'} flex-1`}>
            {/* Information Column */}
            <div className="flex flex-col space-y-6 justify-center">
              <div>
                <h4 className="font-martian text-[9px] font-bold text-accent uppercase tracking-widest mb-2 flex items-center before:content-[''] before:w-3 before:h-[2px] before:bg-accent before:mr-2">
                  Problem
                </h4>
                <p className="font-funnel text-sm text-primary-text/80 dark:text-primary-text-dark/80 leading-relaxed">
                  {project.problem}
                </p>
              </div>
              <div>
                <h4 className="font-martian text-[9px] font-bold text-primary-text/50 dark:text-primary-text-dark/50 uppercase tracking-widest mb-2 flex items-center before:content-[''] before:w-3 before:h-[2px] before:bg-primary-text/20 dark:before:bg-primary-text-dark/20 before:mr-2">
                  Solution
                </h4>
                <p className="font-funnel text-sm text-primary-text/80 dark:text-primary-text-dark/80 leading-relaxed">
                  {project.solution}
                </p>
              </div>
              <div>
                <h4 className="font-martian text-[9px] font-bold text-primary-text/50 dark:text-primary-text-dark/50 uppercase tracking-widest mb-2 flex items-center before:content-[''] before:w-3 before:h-[2px] before:bg-primary-text/20 dark:before:bg-primary-text-dark/20 before:mr-2">
                  Impact
                </h4>
                <p className="font-funnel text-sm font-bold text-primary-text/90 dark:text-primary-text-dark/90 leading-relaxed">
                  {project.impact}
                </p>
              </div>
            </div>

            {/* Preview Frame Column */}
            <div className="relative h-full min-h-[200px] w-full rounded-2xl bg-gradient-to-br from-primary-text/[0.03] to-transparent dark:from-primary-text-dark/[0.03] border border-primary-text/10 dark:border-primary-text-dark/10 flex items-center justify-center p-6 lg:p-10 group-hover:border-accent/30 transition-colors duration-500 overflow-hidden shadow-inner">
              
              {/* Conditional Previews based on type */}
              {project.previewType === 'mobile' && (
                <div className="w-[140px] h-[280px] rounded-[24px] border-[6px] border-primary-text/10 dark:border-primary-text-dark/20 bg-white dark:bg-[#0A0A0B] shadow-2xl relative overflow-hidden flex flex-col group-hover:scale-105 transition-transform duration-700 ease-out">
                  <div className="absolute top-0 w-full h-4 bg-primary-text/5 dark:bg-primary-text-dark/10 flex justify-center"><div className="w-12 h-1 bg-primary-text/20 dark:bg-primary-text-dark/30 rounded-b-lg"></div></div>
                  <div className="mt-8 px-3 space-y-3">
                    <div className="w-full h-24 bg-primary-text/5 dark:bg-primary-text-dark/10 rounded-lg"></div>
                    <div className="w-3/4 h-2 bg-primary-text/10 dark:bg-primary-text-dark/20 rounded"></div>
                    <div className="w-1/2 h-2 bg-primary-text/10 dark:bg-primary-text-dark/20 rounded"></div>
                  </div>
                </div>
              )}

              {project.previewType === 'chat' && (
                <div className="w-full max-w-sm h-64 rounded-xl border border-primary-text/10 dark:border-primary-text-dark/20 bg-white dark:bg-[#0A0A0B] shadow-2xl flex flex-col overflow-hidden group-hover:scale-105 transition-transform duration-700 ease-out">
                  <div className="h-12 border-b border-primary-text/5 dark:border-primary-text-dark/10 flex items-center px-4 bg-primary-text/[0.02] dark:bg-primary-text-dark/[0.02]">
                    <div className="w-8 h-8 rounded-full bg-accent/20"></div>
                    <div className="ml-3 w-24 h-2 bg-primary-text/20 dark:bg-primary-text-dark/30 rounded"></div>
                  </div>
                  <div className="flex-1 p-4 space-y-4">
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary-text/10 dark:bg-primary-text-dark/20 shrink-0"></div>
                      <div className="w-3/4 h-16 bg-primary-text/5 dark:bg-primary-text-dark/10 rounded-r-xl rounded-bl-xl"></div>
                    </div>
                    <div className="flex gap-3 flex-row-reverse">
                      <div className="w-2/3 h-12 bg-accent/10 rounded-l-xl rounded-br-xl"></div>
                    </div>
                  </div>
                </div>
              )}

              {(project.previewType === 'browser' || !project.previewType) && (
                <div className="w-full max-w-sm h-56 rounded-xl border border-primary-text/10 dark:border-primary-text-dark/20 bg-white dark:bg-[#0A0A0B] shadow-2xl flex flex-col overflow-hidden group-hover:scale-105 transition-transform duration-700 ease-out">
                  <div className="h-8 border-b border-primary-text/5 dark:border-primary-text-dark/10 flex items-center px-3 gap-1.5 bg-primary-text/[0.02] dark:bg-primary-text-dark/[0.02]">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-400/80"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/80"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-green-400/80"></div>
                  </div>
                  <div className="flex-1 p-5 space-y-4">
                    <div className="w-full h-20 bg-primary-text/5 dark:bg-primary-text-dark/10 rounded-lg"></div>
                    <div className="flex gap-3">
                      <div className="w-1/3 h-12 bg-primary-text/5 dark:bg-primary-text-dark/10 rounded-lg"></div>
                      <div className="w-1/3 h-12 bg-primary-text/5 dark:bg-primary-text-dark/10 rounded-lg"></div>
                      <div className="w-1/3 h-12 bg-primary-text/5 dark:bg-primary-text-dark/10 rounded-lg"></div>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-primary-text/5 dark:border-primary-text-dark/10 flex flex-col md:flex-row md:items-center justify-between gap-6 pointer-events-auto">
            {/* Technology Badges */}
            <div className="flex flex-wrap gap-2">
              <span className="font-martian text-[8px] font-bold tracking-widest uppercase text-primary-text/40 dark:text-primary-text-dark/40 mr-2 flex items-center">Tech Stack</span>
              {(project.tech || []).map((tItem, i) => (
                <span
                  key={i}
                  className="font-martian text-[9px] font-bold tracking-widest uppercase px-3 py-1 bg-primary-text/[0.03] dark:bg-primary-text-dark/[0.05] rounded-md border border-primary-text/10 dark:border-primary-text-dark/10 text-primary-text/70 dark:text-primary-text-dark/70"
                >
                  {tItem}
                </span>
              ))}
            </div>
            
            <div className="font-funnel text-xs font-bold uppercase tracking-widest text-accent flex items-center gap-2 group-hover:translate-x-2 transition-transform duration-300 cursor-pointer">
              View Details <ExternalLink size={14} />
            </div>
          </div>
        </div>
      </BentoCard>
    </motion.div>
  );
}

export default function Projects() {
  const [selectedProject, setSelectedProject] = useState(null);
  const { t } = useLanguage();
  const projects = t('projects.items') || [];

  return (
    <section
      id="projects"
      style={{ position: 'relative', zIndex: 50, isolation: 'isolate', perspective: '1200px' }}
      className="py-32 px-6 sm:px-10 lg:px-16 max-w-[90rem] mx-auto"
    >
      {/* Section Header */}
      <div className="mb-20 border-l-2 border-accent/30 pl-6">
        <div className="mb-4 inline-flex items-center gap-2 px-3 py-1 bg-accent/10 border border-accent/25 rounded-md text-accent text-[10px] font-martian font-bold uppercase tracking-wider">
          Sheet 03 // Shipped Works
        </div>
        <h2 className="text-4xl font-bold tracking-tight mb-4 text-primary-text dark:text-primary-text-dark font-martian">
          {t('projects.title')}
        </h2>
      </div>

      {/* 3D Bento Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-32">
        {projects.map((project, index) => (
          <ProjectCard 
            key={index} 
            project={project} 
            index={index} 
            onClick={() => setSelectedProject(project)} 
          />
        ))}
      </div>

      {/* Living Builder Console (Replaces generic terminal) */}
      <div className="mt-32">
        <BuilderConsole />
      </div>

      {/* Cabinet Drawer Side-Drawer Modal */}
      <AnimatePresence>
        {selectedProject && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProject(null)}
              className="fixed inset-0 z-[240] bg-black cursor-pointer"
            />

            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 220 }}
              className="fixed top-0 right-0 h-full w-full max-w-xl bg-white dark:bg-card-bg-dark border-l-2 border-primary-text dark:border-primary-text-dark z-[250] shadow-2xl p-8 sm:p-12 overflow-y-auto text-primary-text dark:text-primary-text-dark"
            >
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

              <div className="mb-8 border-b border-primary-text/5 dark:border-primary-text-dark/5 pb-6">
                <p className="text-xs font-martian font-bold tracking-widest uppercase text-accent mb-2">Problem Statement</p>
                <p className="text-base text-primary-text/90 dark:text-primary-text-dark/90 leading-relaxed font-funnel">
                  {selectedProject.problem}
                </p>
              </div>

              <div className="mb-8 border-b border-primary-text/5 dark:border-primary-text-dark/5 pb-6">
                <p className="text-xs font-martian font-bold tracking-widest uppercase text-primary-text/50 dark:text-primary-text-dark/50 mb-2">Solution Implementation</p>
                <p className="text-base text-primary-text/90 dark:text-primary-text-dark/90 leading-relaxed font-funnel">
                  {selectedProject.solution}
                </p>
              </div>

              <div className="mb-8 border-b border-primary-text/5 dark:border-primary-text-dark/5 pb-6">
                <p className="text-xs font-martian font-bold tracking-widest uppercase text-primary-text/50 dark:text-primary-text-dark/50 mb-2">Quantified Impact</p>
                <p className="text-base text-primary-text/80 dark:text-primary-text-dark/80 leading-relaxed font-funnel">
                  {selectedProject.impact}
                </p>
              </div>

              {selectedProject.engineering && (
                <div className="mb-8 p-6 recess-inset-light dark:recess-inset-dark border border-primary-text/10 dark:border-primary-text-dark/10 rounded-xl">
                  <p className="text-xs font-martian font-bold tracking-widest uppercase text-accent mb-3">Engineering Highlights</p>
                  <p className="text-sm text-primary-text/80 dark:text-primary-text-dark/80 leading-relaxed font-funnel">
                    {selectedProject.engineering}
                  </p>
                </div>
              )}

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
    </section>
  );
}
