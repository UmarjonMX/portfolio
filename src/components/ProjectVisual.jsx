/**
 * Schematic preview frames.
 *
 * These are drawn, not photographed — the projects have no captured imagery
 * yet, and inventing a screenshot would misrepresent them. Each frame is a
 * plain description of the surface: a phone for the Telegram channel, a
 * conversation for the bot, a browser for the web projects.
 *
 * Shared by the Projects grid and the project detail page so the two never
 * drift apart.
 */
export default function ProjectVisual({ previewType, scale = 'md' }) {
  const dim =
    scale === 'lg'
      ? { w: 'w-[190px] h-[380px]', pad: 'p-8 lg:p-12', h: 'h-[300px]', bar: 'h-14', hero: 'h-28' }
      : { w: 'w-[120px] h-[240px]', pad: 'p-5', h: 'h-[190px]', bar: 'h-10', hero: 'h-16' };

  return (
    <div
      className={`relative w-full ${dim.h} flex items-center justify-center ${dim.pad} bg-gradient-to-br from-primary-text/[0.03] to-transparent dark:from-primary-text-dark/[0.04] border border-primary-text/10 dark:border-primary-text-dark/10 overflow-hidden`}
      aria-hidden="true"
    >
      {/* Mobile — Telegram channel */}
      {previewType === 'mobile' && (
        <div
          className={`${dim.w} rounded-[20px] border-[5px] border-primary-text/10 dark:border-primary-text-dark/20 bg-white dark:bg-[#0A0A0B] shadow-2xl relative overflow-hidden flex flex-col`}
        >
          <div className="absolute top-0 w-full h-4 bg-primary-text/5 dark:bg-primary-text-dark/10 flex justify-center">
            <div className="w-10 h-1 bg-primary-text/20 dark:bg-primary-text-dark/30 rounded-b-lg" />
          </div>
          <div className="mt-8 px-2.5 space-y-2.5">
            <div className="w-full h-14 sm:h-20 bg-primary-text/5 dark:bg-primary-text-dark/10 rounded-lg" />
            <div className="w-3/4 h-2 bg-primary-text/10 dark:bg-primary-text-dark/20 rounded" />
            <div className="w-1/2 h-2 bg-primary-text/10 dark:bg-primary-text-dark/20 rounded" />
          </div>
        </div>
      )}

      {/* Chat — Anonymous bot */}
      {previewType === 'chat' && (
        <div
          className={`w-full max-w-sm ${dim.h} rounded-xl border border-primary-text/10 dark:border-primary-text-dark/20 bg-white dark:bg-[#0A0A0B] shadow-2xl flex flex-col overflow-hidden`}
        >
          <div
            className={`${dim.bar} border-b border-primary-text/5 dark:border-primary-text-dark/10 flex items-center px-4`}
          >
            <div className="w-7 h-7 rounded-full bg-accent/20" />
            <div className="ml-3 w-24 h-2 bg-primary-text/20 dark:bg-primary-text-dark/30 rounded" />
          </div>
          <div className="flex-1 p-4 space-y-3">
            <div className="flex gap-3">
              <div className="w-7 h-7 rounded-full bg-primary-text/10 dark:bg-primary-text-dark/20 shrink-0" />
              <div className="w-3/4 h-12 bg-primary-text/5 dark:bg-primary-text-dark/10 rounded-r-xl rounded-bl-xl" />
            </div>
            <div className="flex gap-3 flex-row-reverse">
              <div className="w-2/3 h-10 bg-accent/10 rounded-l-xl rounded-br-xl" />
            </div>
          </div>
        </div>
      )}

      {/* Browser — web projects */}
      {(previewType === 'browser' || !previewType) && (
        <div
          className={`w-full max-w-sm ${dim.h} rounded-xl border border-primary-text/10 dark:border-primary-text-dark/20 bg-white dark:bg-[#0A0A0B] shadow-2xl flex flex-col overflow-hidden`}
        >
          <div
            className={`${dim.bar} border-b border-primary-text/5 dark:border-primary-text-dark/10 flex items-center px-3 gap-1.5`}
          >
            <div className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-400/80" />
          </div>
          <div className="flex-1 p-5 space-y-4">
            <div className={`w-full ${dim.hero} bg-primary-text/5 dark:bg-primary-text-dark/10 rounded-lg`} />
            <div className="flex gap-3">
              <div className="w-1/3 h-10 bg-primary-text/5 dark:bg-primary-text-dark/10 rounded-lg" />
              <div className="w-1/3 h-10 bg-primary-text/5 dark:bg-primary-text-dark/10 rounded-lg" />
              <div className="w-1/3 h-10 bg-primary-text/5 dark:bg-primary-text-dark/10 rounded-lg" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}