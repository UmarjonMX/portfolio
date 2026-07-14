import { useRef, useEffect, useState } from 'react';
import { useMotionValue, useSpring } from 'framer-motion';

export default function SignatureText({ text, className = '' }) {
  const containerRef = useRef(null);
  
  // Motion values for smooth cursor tracking
  const mouseX = useMotionValue(-1000);
  const mouseY = useMotionValue(-1000);
  
  // Spring physics for elegant, laggy movement
  const springConfig = { damping: 30, stiffness: 150, mass: 1 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  const [hasInteracted, setHasInteracted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const unsubX = smoothX.on('change', (latest) => {
      if (containerRef.current) containerRef.current.style.setProperty('--mask-x', `${latest}px`);
    });
    const unsubY = smoothY.on('change', (latest) => {
      if (containerRef.current) containerRef.current.style.setProperty('--mask-y', `${latest}px`);
    });
    return () => {
      unsubX();
      unsubY();
    };
  }, [smoothX, smoothY]);

  useEffect(() => {
    // Check if device is touch/mobile
    const checkMobile = () => {
      setIsMobile(window.matchMedia('(hover: none) or (max-width: 768px)').matches);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (isMobile) return; // Only initial sweep on mobile

    // Initial entrance sweep animation
    let animationFrame;
    let startTime;
    
    const sweepAnimation = (time) => {
      if (!startTime) startTime = time;
      const progress = (time - startTime) / 1500; // 1.5s sweep

      if (progress < 1 && !hasInteracted) {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        // Sweep from left to right
        const x = (rect.width * 1.5) * progress - (rect.width * 0.25);
        const y = rect.height / 2;
        mouseX.set(x);
        mouseY.set(y);
        animationFrame = requestAnimationFrame(sweepAnimation);
      } else if (!hasInteracted) {
        // Hide beam off-screen after sweep
        mouseX.set(-1000);
        mouseY.set(-1000);
      }
    };

    // Delay sweep slightly for entrance sequence
    const timeoutId = setTimeout(() => {
      animationFrame = requestAnimationFrame(sweepAnimation);
    }, 1000);

    return () => {
      clearTimeout(timeoutId);
      if (animationFrame) cancelAnimationFrame(animationFrame);
    };
  }, [hasInteracted, isMobile, mouseX, mouseY]);

  const handleMouseMove = (e) => {
    if (isMobile) return; // No cursor tracking on mobile
    if (!hasInteracted) setHasInteracted(true);
    
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    
    // Calculate local position relative to container
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  const handleMouseLeave = () => {
    if (isMobile) return;
    // Hide beam when cursor leaves
    mouseX.set(-1000);
    mouseY.set(-1000);
  };

  return (
    <div 
      ref={containerRef}
      className={`relative inline-block ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Base Text (Matte, Low Contrast) */}
      <span className="text-primary-text/30 dark:text-primary-text-dark/30 transition-colors duration-500">
        {text}
      </span>

      {/* Illuminated Text Layer (Orange, Glow, Depth) */}
      <span 
        className="absolute inset-0 text-accent dark:text-accent drop-shadow-[0_2px_8px_rgba(224,122,95,0.6)]"
        style={{
          color: '#E07A5F', // Our brand orange
          textShadow: '0 1px 2px rgba(0,0,0,0.5), 0 0 15px rgba(224,122,95,0.4)',
          WebkitMaskImage: 'radial-gradient(150% 100% at var(--mask-x) var(--mask-y), black 0%, rgba(0,0,0,0.5) 30%, transparent 70%)',
          maskImage: 'radial-gradient(150% 100% at var(--mask-x) var(--mask-y), black 0%, rgba(0,0,0,0.5) 30%, transparent 70%)',
          WebkitMaskRepeat: 'no-repeat',
          maskRepeat: 'no-repeat',
        }}
      >
        {text}
      </span>
    </div>
  );
}
