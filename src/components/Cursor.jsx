import { useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import useHoverPointerEvents from '../hooks/useHoverPointerEvents';

export default function Cursor() {
  const [isHovering, setIsHovering] = useState(false);
  
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  const springConfig = { damping: 25, stiffness: 400, mass: 0.1 };
  const mouseX = useSpring(cursorX, springConfig);
  const mouseY = useSpring(cursorY, springConfig);

  useHoverPointerEvents({
    mousemove: (e) => {
      // Offset calculated automatically in render step
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    },
    mouseover: (e) => {
      const target = e.target;
      const isClickable = target.closest('a') || target.closest('button') || target.closest('input') || target.closest('textarea') || target.closest('[data-hover="true"]');
      setIsHovering(!!isClickable);
    },
  });

  // Adjust radius
  const size = isHovering ? 48 : 12;

  return (
    <motion.div
      className="pointer-events-none fixed top-0 left-0 z-[9999] mix-blend-difference hidden md:block"
      style={{ x: mouseX, y: mouseY, marginLeft: -size/2, marginTop: -size/2 }}
      animate={{
        width: size,
        height: size,
        backgroundColor: "white",
        borderRadius: "50%",
      }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    />
  );
}
