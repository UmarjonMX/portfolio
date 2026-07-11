import { useEffect, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { ArrowRight, Mail } from 'lucide-react';

export default function Hero() {
  const { t, lang: language } = useLanguage();
  const heroRef = useRef(null);
  const decorativeLayerRef = useRef(null);

  useEffect(() => {
    const hero = heroRef.current;
    const decorativeLayer = decorativeLayerRef.current;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!hero || !decorativeLayer || prefersReducedMotion) return undefined;

    let frameId;
    let bounds = hero.getBoundingClientRect();
    const current = { x: 0, y: 0, glowX: bounds.width / 2, glowY: bounds.height / 2 };
    const target = { ...current };

    const updateBounds = () => {
      bounds = hero.getBoundingClientRect();
      target.glowX = Math.min(target.glowX, bounds.width);
      target.glowY = Math.min(target.glowY, bounds.height);
    };

    const updatePointer = (event) => {
      const x = (event.clientX - bounds.left) / bounds.width - 0.5;
      const y = (event.clientY - bounds.top) / bounds.height - 0.5;

      target.x = Math.max(-1, Math.min(1, x * 2));
      target.y = Math.max(-1, Math.min(1, y * 2));
      target.glowX = event.clientX - bounds.left;
      target.glowY = event.clientY - bounds.top;
    };

    const resetPointer = () => {
      target.x = 0;
      target.y = 0;
      target.glowX = bounds.width / 2;
      target.glowY = bounds.height / 2;
    };

    const animate = () => {
      current.x += (target.x - current.x) * 0.08;
      current.y += (target.y - current.y) * 0.08;
      current.glowX += (target.glowX - current.glowX) * 0.1;
      current.glowY += (target.glowY - current.glowY) * 0.1;

      decorativeLayer.style.setProperty('--hero-parallax-5-x', `${(current.x * 5).toFixed(2)}px`);
      decorativeLayer.style.setProperty('--hero-parallax-5-y', `${(current.y * 5).toFixed(2)}px`);
      decorativeLayer.style.setProperty('--hero-parallax-10-x', `${(current.x * 10).toFixed(2)}px`);
      decorativeLayer.style.setProperty('--hero-parallax-10-y', `${(current.y * 10).toFixed(2)}px`);
      decorativeLayer.style.setProperty('--hero-parallax-15-x', `${(current.x * 15).toFixed(2)}px`);
      decorativeLayer.style.setProperty('--hero-parallax-15-y', `${(current.y * 15).toFixed(2)}px`);
      decorativeLayer.style.setProperty('--hero-glow-x', `${current.glowX.toFixed(2)}px`);
      decorativeLayer.style.setProperty('--hero-glow-y', `${current.glowY.toFixed(2)}px`);
      frameId = requestAnimationFrame(animate);
    };

    hero.addEventListener('pointerenter', updateBounds);
    hero.addEventListener('pointermove', updatePointer);
    hero.addEventListener('pointerleave', resetPointer);
    window.addEventListener('resize', updateBounds);
    frameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(frameId);
      hero.removeEventListener('pointerenter', updateBounds);
      hero.removeEventListener('pointermove', updatePointer);
      hero.removeEventListener('pointerleave', resetPointer);
      window.removeEventListener('resize', updateBounds);
    };
  }, []);

  const tagline = t('hero.tagline');
  const headline = t('hero.headline');
  const supporting1 = t('hero.supporting1');
  const supporting2 = t('hero.supporting2');
  const primaryCTA = t('hero.primaryCTA');
  const secondaryCTA = t('hero.secondaryCTA');

  return (
    <section ref={heroRef} className="hero-ambient relative min-h-[100dvh] flex flex-col items-center justify-center overflow-hidden pt-16 z-10 w-full">
      <div ref={decorativeLayerRef} className="hero-decorative-layer" aria-hidden="true">
        <div className="hero-parallax-layer hero-parallax-background">
          <div className="hero-gradient" />
        </div>
        <div className="hero-mouse-glow" />
        <div className="hero-parallax-layer hero-parallax-middle">
          <div className="hero-geometry hero-geometry-orbit" />
        </div>
        <div className="hero-parallax-layer hero-parallax-foreground">
          <div className="hero-geometry hero-geometry-square" />
          <div className="hero-geometry hero-geometry-dot" />
        </div>
      </div>
      <div className="relative z-10 text-left px-6 sm:px-10 lg:px-16 w-full max-w-5xl mx-auto pointer-events-none flex flex-col items-start justify-center">
        
        {/* Tagline */}
        <p className="hero-enter hero-enter-title text-sm md:text-base font-martian font-bold tracking-[0.2em] uppercase text-accent mb-6 opacity-90">
          {tagline}
        </p>

        {/* Headline */}
        <h1 className="hero-enter hero-enter-heading text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-8 text-primary-text dark:text-primary-text-dark leading-[1.1] max-w-4xl">
          {headline}
        </h1>

        {/* Supporting Copy */}
        <div className="hero-enter hero-enter-subtitle space-y-4 mb-12 max-w-3xl">
          <p className="text-lg md:text-xl text-primary-text/80 dark:text-primary-text-dark/80 leading-relaxed font-funnel">
            {supporting1}
          </p>
          <p className="text-lg md:text-xl text-primary-text/70 dark:text-primary-text-dark/70 leading-relaxed font-funnel">
            {supporting2}
          </p>
        </div>
        
        {/* CTAs */}
        <div className="hero-enter hero-enter-actions flex flex-col sm:flex-row gap-4 w-full pointer-events-auto relative z-20">
          <a 
            href="#projects"
            className="inline-flex items-center gap-3 px-8 py-4 bg-primary-text dark:bg-primary-text-dark text-background dark:text-background-dark rounded-full font-funnel font-bold tracking-widest uppercase hover:bg-accent dark:hover:bg-accent hover:text-white dark:hover:text-background transition-all duration-300 shadow-[0_0_20px_rgba(0,0,0,0.08)] hover:shadow-[0_0_30px_rgba(8,203,0,0.3)] hover:-translate-y-0.5"
          >
            {primaryCTA}
            <ArrowRight size={18} />
          </a>
          <a 
            href="#contact"
            className="inline-flex items-center gap-3 px-8 py-4 bg-glass-light dark:bg-glass-dark border border-border-light dark:border-border-dark backdrop-blur-md rounded-full font-funnel font-bold tracking-widest uppercase hover:border-accent dark:hover:border-accent hover:text-accent dark:hover:text-accent transition-all duration-300"
          >
            <Mail size={18} />
            {secondaryCTA}
          </a>
        </div>
      </div>
    </section>
  );
}
