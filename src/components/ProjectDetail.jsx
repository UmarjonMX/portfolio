import { useEffect } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowUpRight, ExternalLink } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { navigate } from '../router';
import ProjectVisual from './ProjectVisual';
import { usePrefersReducedMotion } from './scroll/ScrollStage';

/**
 * A project, on its own page and its own URL.
 *
 * Deliberately not a drawer or a modal: this is the same editorial register
 * as the rest of the site, running at case-study length. Large type, real
 * whitespace, horizontal rules between sections, and a numbered coordinate.
 *
 * Copy is drawn only from what the project record actually contains. Where a
 * project has no repository or no published link, that is stated plainly
 * rather than filled in.
 */

/** One labelled band. A rule, a small caps label, then the content. */
function Section({ label, children, className = '' }) {
  return (
    <section className={`pt-12 mt-12 border-t border-primary-text/15 dark:border-primary-text-dark/15 ${className}`}>
      {/* Label in the left gutter, body in the measure — the same
          two-column editorial grid used throughout the site. */}
      <div className="grid md:grid-cols-12 gap-4 md:gap-8 lg:gap-10">
        <h2 className="font-josefin text-[10px] font-bold tracking-[0.35em] uppercase text-accent md:col-span-4 lg:col-span-3">
          {label}
        </h2>
        <div className="font-host text-lg sm:text-xl leading-relaxed text-primary-text/80 dark:text-primary-text-dark/80 md:col-span-8 lg:col-span-7">
          {children}
        </div>
      </div>
    </section>
  );
}

/** A small label/value pair — used for metadata, not for content sections. */
function Row({ label, value }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="font-josefin text-[10px] font-bold tracking-[0.25em] uppercase text-primary-text/40 dark:text-primary-text-dark/40">
        {label}
      </span>
      <span className="font-host text-base text-primary-text dark:text-primary-text-dark">{value}</span>
    </div>
  );
}

export default function ProjectDetail({ project }) {
  const { t } = useLanguage();
  const reduced = usePrefersReducedMotion();
  const projects = t('projects.items') || [];
  const detail = t('projects.detail');

  const index = projects.findIndex((p) => p.slug === project.slug);
  const next = projects.length ? projects[(index + 1) % projects.length] : null;

  // A detail page is a new document — always open at the top.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [project.slug]);

  // Sections arrive with one restrained gesture, reused throughout.
  const reveal = (delay = 0) => ({
    initial: reduced ? false : { opacity: 0, y: 18 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-12% 0px' },
    transition: { duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] },
  });

  return (
    <article className="relative w-full pb-32">
      {/* ── Back ──────────────────────────────────────────────────────── */}
      <div className="max-w-[90rem] mx-auto px-6 sm:px-10 lg:px-16 pt-32">
        <button
          type="button"
          onClick={() => navigate('/#projects')}
          className="inline-flex items-center gap-2 font-josefin text-[10px] font-bold tracking-[0.3em] uppercase text-primary-text/50 dark:text-primary-text-dark/50 hover:text-accent transition-colors duration-300 cursor-pointer"
        >
          <ArrowLeft size={13} />
          {t('projects.detail.back')}
        </button>
      </div>

      {/* ── Masthead ───────────────────────────────────────────────────── */}
      <header className="max-w-[90rem] mx-auto px-6 sm:px-10 lg:px-16 pt-14 sm:pt-20">
        <motion.div {...reveal()}>
          <span className="font-josefin text-[11px] font-bold tracking-[0.35em] text-accent uppercase tabular-nums">
            {String(index + 1).padStart(2, '0')}
            <span className="mx-3 text-primary-text/25 dark:text-primary-text-dark/25">/</span>
            <span className="text-primary-text/40 dark:text-primary-text-dark/40">
              {String(projects.length).padStart(2, '0')}
            </span>
          </span>
        </motion.div>

        <motion.h1
          {...reveal(0.05)}
          className="mt-6 font-editorial font-bold tracking-tight text-[clamp(2.75rem,8vw,6.5rem)] leading-[0.95] text-primary-text dark:text-primary-text-dark max-w-5xl"
        >
          {project.title}
        </motion.h1>

        <motion.p
          {...reveal(0.1)}
          className="mt-8 font-editorial italic text-xl sm:text-2xl leading-relaxed text-primary-text/70 dark:text-primary-text-dark/70 max-w-3xl"
        >
          {project.summary}
        </motion.p>

        <motion.div
          {...reveal(0.15)}
          className="mt-12 grid grid-cols-2 sm:grid-cols-3 gap-8 sm:gap-12 max-w-3xl"
        >
          <Row label={detail.year} value={project.timeline} />
          <Row label={detail.status} value={project.status} />
          <Row label={detail.category} value={(project.tech || [])[0] || '—'} />
        </motion.div>
      </header>

      {/* ── The artifact ─────────────────────────────────────────────────
          The visual is the case study's main object, so it runs the full
          measure at `lg` rather than sitting small inside a wide frame.
          It carries its own hairline; no wrapper fill or blur, which would
          read as haze over the ambient background. */}
      <motion.div {...reveal(0.2)} className="max-w-[90rem] mx-auto px-6 sm:px-10 lg:px-16 mt-16">
        <ProjectVisual previewType={project.previewType} scale="lg" />
      </motion.div>

      {/* ── Case study ─────────────────────────────────────────────────── */}
      <div className="max-w-[90rem] mx-auto px-6 sm:px-10 lg:px-16">
        <motion.div {...reveal()}>
          <Section label={detail.overview}>{project.overview}</Section>

          <Section label={detail.problem}>{project.problem}</Section>

          <Section label={detail.solution}>{project.solution}</Section>

          <Section label={detail.how}>{project.how}</Section>
        </motion.div>

        {/* Technology — verified list only, plain text rather than pills. */}
        <motion.div {...reveal()}>
          <section className="pt-12 mt-12 border-t border-primary-text/15 dark:border-primary-text-dark/15">
            <div className="grid md:grid-cols-12 gap-4 md:gap-8 lg:gap-10">
              <h2 className="font-josefin text-[10px] font-bold tracking-[0.35em] uppercase text-accent md:col-span-4 lg:col-span-3">
                {detail.technology}
              </h2>
              <ul className="flex flex-wrap gap-x-8 gap-y-3 md:col-span-8 lg:col-span-7">
                {(project.tech || []).map((item) => (
                  <li
                    key={item}
                    className="font-josefin text-xs font-bold tracking-[0.15em] uppercase text-primary-text/70 dark:text-primary-text-dark/70"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </motion.div>

        <motion.div {...reveal()}>
          <Section label={detail.outcome}>{project.impact}</Section>

          <Section label={detail.learnings}>{project.learnings}</Section>

          <Section label={detail.next}>{project.next}</Section>
        </motion.div>

        {/* ── Links ──────────────────────────────────────────────────────
            Only what is actually recorded. The blog has a published link;
            the others do not, and the row says so rather than inventing a
            repository. */}
        <motion.div {...reveal()}>
          <section className="pt-12 mt-12 border-t border-primary-text/15 dark:border-primary-text-dark/15">
            <div className="grid md:grid-cols-12 gap-4 md:gap-8 lg:gap-10">
              <h2 className="font-josefin text-[10px] font-bold tracking-[0.35em] uppercase text-accent md:col-span-4 lg:col-span-3">
                {detail.links}
              </h2>
              <div className="md:col-span-8 lg:col-span-7">
                {project.link ? (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 font-josefin text-[11px] font-bold tracking-[0.25em] uppercase text-accent hover:opacity-75 transition-opacity duration-300"
                  >
                    <ExternalLink size={13} />
                    {detail.live}
                  </a>
                ) : (
                  <p className="font-host text-lg text-primary-text/60 dark:text-primary-text-dark/60">
                    {detail.noLink}
                  </p>
                )}
              </div>
            </div>
          </section>
        </motion.div>
      </div>

      {/* ── Next project ───────────────────────────────────────────────── */}
      {next && (
        <motion.div {...reveal()} className="max-w-[90rem] mx-auto px-6 sm:px-10 lg:px-16 mt-24">
          <button
            type="button"
            onClick={() => navigate(`/projects/${next.slug}`)}
            className="group w-full text-left cursor-pointer border-t border-primary-text/20 dark:border-primary-text-dark/20 pt-10"
          >
            <span className="font-josefin text-[10px] font-bold tracking-[0.35em] uppercase text-primary-text/40 dark:text-primary-text-dark/40">
              {t('projects.detail.nextProject')}
            </span>
            <span className="mt-4 flex items-center justify-between gap-6">
              <span className="font-editorial font-bold text-3xl sm:text-5xl tracking-tight text-primary-text dark:text-primary-text-dark transition-colors duration-300 group-hover:text-accent">
                {next.title}
              </span>
              <ArrowUpRight
                size={28}
                className="shrink-0 text-accent transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
              />
            </span>
          </button>
        </motion.div>
      )}
    </article>
  );
}

/** Shown for a URL that matches /projects/:slug but no known project. */
export function ProjectNotFound() {
  const { t } = useLanguage();
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6">
      <div className="text-center">
        <h1 className="font-editorial text-4xl sm:text-5xl font-bold tracking-tight text-primary-text dark:text-primary-text-dark">
          {t('projects.detail.notFound')}
        </h1>
        <p className="mt-4 font-host text-primary-text/70 dark:text-primary-text-dark/70">
          {t('projects.detail.notFoundBody')}
        </p>
        <button
          type="button"
          onClick={() => navigate('/#projects')}
          className="mt-10 inline-flex items-center gap-2 font-josefin text-[11px] font-bold tracking-[0.25em] uppercase text-accent hover:opacity-75 transition-opacity cursor-pointer"
        >
          <ArrowLeft size={13} />
          {t('projects.detail.back')}
        </button>
      </div>
    </div>
  );
}