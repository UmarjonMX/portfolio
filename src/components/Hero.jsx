import { useState, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { ArrowRight, Mail } from 'lucide-react';

// ─── Magnetic Proximity Interaction Wrapper ─────────────────────────────────
function Magnetic({ children, scale = 0.35 }) {
  const ref = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - (rect.left + rect.width / 2);
    const y = e.clientY - (rect.top + rect.height / 2);
    setPosition({ x: x * scale, y: y * scale });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
        transition: position.x === 0 ? 'transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)' : 'transform 0.1s linear',
      }}
      className="flex-1"
    >
      {children}
    </div>
  );
}

// ─── 3D Hover Tilt Composition Wrapper ───────────────────────────────────────
function Tilt({ children }) {
  const ref = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const xc = rect.width / 2;
    const yc = rect.height / 2;
    const rx = -((y - yc) / yc) * 6; // max 6 degrees rotation on X
    const ry = ((x - xc) / xc) * 6; // max 6 degrees rotation on Y
    
    setTilt({ x: rx, y: ry });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(1200px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        transition: tilt.x === 0 ? 'transform 0.8s cubic-bezier(0.25, 1, 0.5, 1)' : 'transform 0.1s ease-out',
        transformStyle: 'preserve-3d',
      }}
      className="w-full"
    >
      {children}
    </div>
  );
}

// ─── Hero Component ─────────────────────────────────────────────────────────
export default function Hero() {
  const { t } = useLanguage();
  const [coords, setCoords] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setCoords({ x: Math.round(x), y: Math.round(y) });
  };

  const tagline = t('hero.tagline');
  const headline = t('hero.headline');
  const supporting1 = t('hero.supporting1');
  const supporting2 = t('hero.supporting2');
  const primaryCTA = t('hero.primaryCTA');
  const secondaryCTA = t('hero.secondaryCTA');

  return (
    <section 
      onMouseMove={handleMouseMove}
      className="relative min-h-[100dvh] flex flex-col justify-center overflow-hidden pt-16 z-10 w-full select-none"
    >
      {/* Sleek Dashed Tech Grid Borders */}
      <div className="absolute inset-x-6 sm:inset-x-10 lg:inset-x-16 top-24 bottom-10 border border-dashed border-primary-text/10 dark:border-primary-text-dark/10 pointer-events-none z-0 rounded-3xl" />

      {/* Top Telemetry Ledger Header */}
      <div className="absolute top-24 left-6 sm:left-10 lg:left-16 right-6 sm:right-10 lg:right-16 flex justify-between items-center border-b border-primary-text/10 dark:border-primary-text-dark/10 pb-4 pointer-events-none z-10 px-4">
        <span className="font-martian text-[9px] font-bold tracking-[0.3em] text-primary-text/40 dark:text-primary-text-dark/40">
          PROJECT // SYSTEM_V3.0
        </span>
        <span className="font-martian text-[9px] font-bold tracking-[0.3em] text-accent/80">
          [ 41.0044° N, 71.6726° E // NAMANGAN ]
        </span>
      </div>

      {/* Hero Container */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-10 sm:px-16 lg:px-24 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center h-full my-auto">
        
        {/* Main Content Pane */}
        <div className="lg:col-span-8 flex flex-col items-start justify-center">
          
          {/* Active Blueprint Tag */}
          <div className="mb-6 inline-flex items-center gap-3 px-4 py-1.5 bg-accent/10 border border-accent/25 rounded-xl text-accent text-[10px] font-martian font-bold uppercase tracking-widest shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
            </span>
            SHEET 01 // INTERACTIVE_CORE
          </div>

          <Tilt>
            {/* Title card - Premium Glassmorphic Design */}
            <div 
              style={{ transformStyle: 'preserve-3d' }}
              className="border border-primary-text/10 dark:border-primary-text-dark/10 p-8 sm:p-10 bg-white/55 dark:bg-[#1f1f22]/55 backdrop-blur-2xl rounded-3xl shadow-[0_30px_70px_-15px_rgba(0,0,0,0.08)] dark:shadow-[0_30px_70px_-15px_rgba(0,0,0,0.35)] mb-8 w-full transition-all duration-300 hover:border-accent/25"
            >
              {/* Dynamic light reflection effect */}
              <div 
                style={{ transform: 'translateZ(30px)' }}
                className="text-xs md:text-sm font-martian font-bold tracking-[0.3em] uppercase text-primary-text/40 dark:text-primary-text-dark/40 mb-4"
              >
                {tagline}
              </div>

              <h1 
                style={{ transform: 'translateZ(55px)' }}
                className="text-5xl sm:text-6xl md:text-7.5xl font-black tracking-tighter leading-none text-primary-text dark:text-primary-text-dark font-martian uppercase mb-3"
              >
                Umar <span className="text-accent hover:opacity-90 transition-opacity">Builds</span>
              </h1>
              
              <h2 
                style={{ transform: 'translateZ(40px)' }}
                className="text-xl sm:text-2xl md:text-3.5xl font-bold tracking-tight leading-tight text-primary-text/75 dark:text-primary-text-dark/75 font-martian"
              >
                {headline}
              </h2>
            </div>
          </Tilt>

          {/* Width-capped technical details */}
          <div className="space-y-4 mb-10 max-w-2xl border-l-2 border-accent/40 pl-6 py-2 bg-accent/[0.02] rounded-r-xl">
            <p className="text-base sm:text-lg text-primary-text/70 dark:text-primary-text-dark/70 leading-relaxed font-funnel">
              {supporting1}
            </p>
            <p className="text-sm sm:text-base text-primary-text/50 dark:text-primary-text-dark/50 leading-relaxed font-funnel">
              {supporting2}
            </p>
          </div>
          
          {/* CTA Buttons with Magnetic Attraction */}
          <div className="flex flex-col sm:flex-row gap-5 w-full max-w-lg">
            <Magnetic scale={0.3}>
              <a 
                href="#projects"
                className="inline-flex items-center justify-center gap-3 w-full px-8 py-4 bg-accent hover:bg-accent/90 text-white dark:text-[#1C1C1D] rounded-2xl font-funnel font-bold tracking-wider uppercase shadow-[0_12px_24px_-6px_rgba(224,122,95,0.3)] hover:shadow-[0_16px_32px_-6px_rgba(224,122,95,0.4)] transition-all cursor-pointer border border-accent/20"
              >
                {primaryCTA}
                <ArrowRight size={16} />
              </a>
            </Magnetic>
            
            <Magnetic scale={0.3}>
              <a 
                href="#contact"
                className="inline-flex items-center justify-center gap-3 w-full px-8 py-4 bg-white/50 dark:bg-[#1E1E20]/50 backdrop-blur-md text-primary-text dark:text-primary-text-dark border border-primary-text/10 dark:border-primary-text-dark/10 rounded-2xl font-funnel font-bold tracking-wider uppercase hover:bg-white/80 dark:hover:bg-[#1E1E20]/80 shadow-[0_10px_20px_-8px_rgba(0,0,0,0.05)] hover:shadow-[0_12px_24px_-8px_rgba(0,0,0,0.1)] transition-all cursor-pointer"
              >
                <Mail size={16} className="text-primary-text/60 dark:text-primary-text-dark/60" />
                {secondaryCTA}
              </a>
            </Magnetic>
          </div>
        </div>

        {/* Right side alignment spacing */}
        <div className="lg:col-span-4 h-[100px] lg:h-full w-full pointer-events-none" />

      </div>

      {/* Technical Specs Footer */}
      <div className="absolute bottom-10 left-6 sm:left-10 lg:left-16 right-6 sm:right-10 lg:right-16 flex justify-between items-center pointer-events-none text-primary-text/30 dark:text-primary-text-dark/30 font-martian text-[8px] px-4">
        <span>SCALE: 1:1</span>
        <span className="bg-primary-text/[0.03] dark:bg-primary-text-dark/[0.03] px-3 py-1 rounded-lg border border-primary-text/5 dark:border-primary-text-dark/5">
          COORDS_X: {coords.x} // COORDS_Y: {coords.y}
        </span>
        <span>INDEX REF: SH-01_SYS</span>
      </div>
    </section>
  );
}
