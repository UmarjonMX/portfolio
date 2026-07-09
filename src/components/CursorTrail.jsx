import { useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function CursorTrail() {
  const slowX = useMotionValue(-100);
  const slowY = useMotionValue(-100);

  // Extremely responsive spring configuration for zero perceived delay
  const fastSpring = { stiffness: 1000, damping: 25, mass: 0.1 };
  const smoothSpring = { stiffness: 800, damping: 30, mass: 0.1 };

  const slowMouseX = useSpring(slowX, fastSpring);
  const slowMouseY = useSpring(slowY, fastSpring);

  const extraSlowX = useSpring(slowX, smoothSpring);
  const extraSlowY = useSpring(slowY, smoothSpring);

  useEffect(() => {
    const handleMouseMove = (e) => {
      // Offset by radius (24px) to center the 48px/96px circles
      slowX.set(e.clientX - 24);
      slowY.set(e.clientY - 24);
    };
    
    // Only bind on non-touch devices
    if (window.matchMedia("(hover: hover)").matches) {
      window.addEventListener("mousemove", handleMouseMove);
    }
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [slowX, slowY]);

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden hidden md:block">
      {/* We do NOT include the solid sharp dot, so the user relies on their native system cursor. 
          This only renders the beautiful aesthetic liquid blur flowing behind the native pointer. */}
      
      {/* Slower, large blurry ripple trail */}
      <motion.div
        className="absolute w-12 h-12 bg-accent/30 rounded-full blur-md mix-blend-difference"
        style={{ x: slowMouseX, y: slowMouseY }}
      />
      {/* Extra soft global ripple */}
       <motion.div
        className="absolute w-24 h-24 bg-accent/10 rounded-full blur-xl mix-blend-multiply dark:mix-blend-screen"
        style={{ x: extraSlowX, y: extraSlowY, marginLeft: -24, marginTop: -24 }}
      />
    </div>
  );
}
