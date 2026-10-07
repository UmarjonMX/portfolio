// eslint-disable-next-line no-unused-vars
import { motion, useTransform } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { navigate } from '../router';
import ProjectVisual from './ProjectVisual';
import BuilderConsole from './BuilderConsole';
import SectionHeader from './SectionHeader';
import {
  seg,
  useChapterProgress,
  usePrefersReducedMotion,
} from './scroll/ScrollStage';

/**
 * Chapter 04 — Selected Works.
 *
 * The grid is deliberately two columns at desktop and one on mobile: a
 * project is a case study, and a case study needs room for a number, a name,
 * a sentence of framing, a preview and a link. Three columns compressed this
 * into dashboard tiles.
 *
 * Cards are not rounded containers. Each one is an editorial block separated
 * by a rule, so the grid reads as a page rather than a deck of cards.
 */
function GridReveal({ index, total, children }) {
  const p = useChapterProgress('projects', 'enter');
  const reduced = usePrefersReducedMotion();

  const start = 0.5 + (total > 1 ? (index / (total - 1)) * 0.16 : 0);
  const end = Math.min(0.99, start + 0.26);

  const opacity = useTransform(p, (v) => (reduced ? 1 : seg(v, start, end)));
  const y = useTransform(p, (v) => (reduced ? 0 : 40 * (1 - seg(v, start, end))));

  return (
    <motion.div style={{ opacity, y }} className="h-full">
      {children}
    </motion.div>
  );
}

function ProjectCard({ project, index, onOpen }) {
  return (
    <article className="group h-full flex flex-col">
      {/* Number + status — the project's own coordinate in the ledger */}
      {/* Number sits in the left gutter on desktop and aligns with the
          section's own measure, rather than floating above the title. */}
      <div className="flex items-baseline gap-5 lg:gap-8 pb-4">
        <span className="font-josefin text-[11px] font-bold tracking-[0.3em] text-accent uppercase tabular-nums shrink-0 w-8">
          {String(index + 1).padStart(2, '0')}
        </span>
        <span className="font-josefin text-[10px] font-bold tracking-[0.2em] text-primary-text/40 dark:text-primary-text-dark/40 uppercase">
          {project.timeline}
        </span>
      </div>

      <h3 className="font-editorial font-bold tracking-tight text-3xl sm:text-4xl lg:text-[2.75rem] lg:leading-[1.05] text-primary-text dark:text-primary-text-dark">
        {project.title}
      </h3>

      <p className="mt-5 font-host text-base lg:text-lg leading-relaxed text-primary-text/70 dark:text-primary-text-dark/70">
        {project.summary}
      </p>

      <div className="mt-8 overflow-hidden border border-primary-text/10 dark:border-primary-text-dark/10">
        <div className="transition-colors duration-500 group-hover:border-accent/40">
          <ProjectVisual previewType={project.previewType} />
        </div>
      </div>

      <div className="mt-auto pt-8">
        {/* Technology — plain text, not pills */}
        <p className="font-josefin text-[10px] font-bold tracking-[0.2em] uppercase text-primary-text/45 dark:text-primary-text-dark/45">
          {(project.tech || []).join(' · ')}
        </p>

        <button
          type="button"
          onClick={onOpen}
          aria-label={`View project: ${project.title}`}
          className="mt-5 inline-flex items-center gap-2 font-josefin text-[11px] font-bold tracking-[0.25em] uppercase text-accent group/link cursor-pointer hover:opacity-75 transition-opacity duration-300"
        >
          View Project
          <ArrowUpRight
            size={14}
            className="transition-transform duration-300 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5"
          />
        </button>
      </div>
    </article>
  );
}

export default function Projects() {
  const { t } = useLanguage();
  const projects = t('projects.items') || [];

  return (
    <section
      id="projects"
      data-chapter="projects"
      style={{ position: 'relative', zIndex: 50, isolation: 'isolate' }}
      className="relative py-32 px-6 sm:px-10 lg:px-16 max-w-[90rem] mx-auto border-b border-primary-text/10 dark:border-primary-text-dark/10"
    >
      {/* Editorial Background: Architecture Wireframes */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-20 dark:opacity-10 text-primary-text dark:text-primary-text-dark flex justify-center overflow-hidden">
        <svg className="w-full h-full opacity-40" xmlns="http://www.w3.org/2000/svg">
          <pattern id="arch-grid" width="100" height="100" patternUnits="userSpaceOnUse">
            <rect width="100" height="100" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 2" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#arch-grid)" />
          <path d="M 100 100 L 300 100 L 300 300 L 100 300 Z" fill="none" stroke="currentColor" strokeWidth="1" />
          <path d="M 500 200 L 800 200 L 800 500 L 500 500 Z" fill="none" stroke="currentColor" strokeWidth="1" />
          <line x1="300" y1="200" x2="500" y2="350" stroke="currentColor" strokeWidth="0.5" strokeDasharray="4 4" />
        </svg>
      </div>

      <SectionHeader title={t('projects.title')} number="03" />

      {/* ── The ledger ───────────────────────────────────────────────────
          Projects and Engineering are read as one continuous ledger, so this
          row carries the coordinate line forward: the chapter number sits in
          a fixed gutter and the rule between the two chapters is drawn once,
          here, rather than each section closing itself off. */}
      <div className="relative z-10 mb-16 flex items-baseline gap-5 sm:gap-8">
        <span className="font-josefin text-[11px] font-bold tracking-[0.3em] text-accent uppercase tabular-nums">
          01 — 04
        </span>
        <span className="hidden sm:block flex-1 h-px bg-primary-text/15 dark:bg-primary-text-dark/15" />
        <span className="font-josefin text-[10px] font-bold tracking-[0.25em] text-primary-text/40 dark:text-primary-text-dark/40 uppercase">
          {projects.length} works
        </span>
      </div>

      {/* Two columns at desktop, one on mobile. */}
      {/* Two columns from `lg` (1024px) up. Between 640 and 1024 the card
          is already ~600px wide, so splitting there would put two
          constrained previews side by side — one full-width column reads
          better at tablet. */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-x-16 lg:gap-x-20 gap-y-20 lg:gap-y-28 mb-24">
        {projects.map((project, index) => (
          <GridReveal key={project.slug || project.title} index={index} total={projects.length}>
            <ProjectCard
              project={project}
              index={index}
              onOpen={() => navigate(`/projects/${project.slug}`)}
            />
          </GridReveal>
        ))}
      </div>

      {/* ── Connector to the next chapter ──────────────────────────────────
          A single rule and the next chapter's number. Enough to say the
          ledger continues; not enough to become its own animation. */}
      <div aria-hidden="true" className="relative z-10 flex items-center gap-6 mb-32">
        <span className="font-josefin text-[10px] font-bold tracking-[0.3em] text-primary-text/30 dark:text-primary-text-dark/30 uppercase tabular-nums">
          04
        </span>
        <span className="flex-1 h-px bg-gradient-to-r from-primary-text/25 dark:from-primary-text-dark/25 to-transparent" />
      </div>

      {/* Living Builder Console */}
      <div className="mt-8">
        <BuilderConsole />
      </div>
    </section>
  );
}