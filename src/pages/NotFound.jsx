import { Link } from 'react-router-dom';
import { ArrowLeft, Code } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-background dark:bg-background-dark text-primary-text dark:text-primary-text-dark relative overflow-hidden">
      
      {/* Subtle grid background */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.02] dark:opacity-[0.015]">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid-404" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="currentColor" strokeWidth="0.5" strokeOpacity="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid-404)" />
        </svg>
      </div>

      <div className="relative z-10 text-center max-w-lg hero-reveal">
        {/* Sheet label */}
        <span className="font-josefin text-[10px] font-bold tracking-[0.3em] text-accent uppercase mb-8 block">
          SH–ERR // PAGE_NOT_FOUND
        </span>

        {/* 404 */}
        <h1 className="text-[28vw] sm:text-[18vw] lg:text-[14vw] font-black tracking-tighter leading-[0.8] font-base uppercase text-primary-text/10 dark:text-primary-text-dark/10 select-none">
          404
        </h1>

        {/* Copy */}
        <div className="mt-8 mb-4">
          <h2 className="text-2xl sm:text-3xl font-bold font-editorial tracking-tight leading-snug">
            Looks like you&rsquo;re exploring
            <br />
            <span className="text-accent">uncharted territory.</span>
          </h2>
        </div>

        <p className="text-base text-primary-text/60 dark:text-primary-text-dark/60 font-host mb-12">
          This page doesn&rsquo;t exist.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="btn-sweep inline-flex items-center justify-center gap-3 px-8 py-4 bg-primary-text dark:bg-primary-text-dark text-white dark:text-[#1C1C1D] rounded-xl font-host font-bold tracking-widest uppercase text-xs transition-all duration-300 cursor-pointer active:scale-[0.98]"
            aria-label="Go back to home page"
          >
            <ArrowLeft size={14} />
            Back Home
          </Link>

          <Link
            to="/#projects"
            className="btn-sweep inline-flex items-center justify-center gap-3 px-8 py-4 bg-transparent text-primary-text dark:text-primary-text-dark border border-primary-text/30 dark:border-primary-text-dark/30 rounded-xl font-host font-bold tracking-widest uppercase text-xs hover:bg-black/5 dark:hover:bg-white/5 transition-all duration-300 cursor-pointer active:scale-[0.98]"
            aria-label="Explore projects"
          >
            <Code size={14} />
            Explore Projects
          </Link>
        </div>
      </div>
    </div>
  );
}
