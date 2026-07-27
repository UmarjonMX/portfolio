export default function SectionHeader({ title, number }) {
  return (
    <div className="sticky top-6 z-[60] flex justify-center w-full mb-16 pointer-events-none">
      <div className="pointer-events-auto flex items-center gap-4 px-8 py-3.5 bg-white/70 dark:bg-[#1E1E20]/70 backdrop-blur-lg border border-white/80 dark:border-primary-text-dark/10 rounded-full shadow-[0_8px_32px_-8px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_32px_-8px_rgba(0,0,0,0.5)] transition-all duration-300">
        <span className="font-josefin text-xs font-bold text-accent tracking-[0.2em] uppercase">
          {number}
        </span>
        <div className="w-px h-3 bg-primary-text/20 dark:bg-primary-text-dark/20"></div>
        <span className="font-josefin text-sm font-bold tracking-[0.25em] text-primary-text dark:text-primary-text-dark uppercase">
          {title}
        </span>
      </div>
    </div>
  );
}
