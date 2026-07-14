/* eslint-disable */
import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";

export default function SmoothScroll({ children }) {
  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, {
    mass: 0.2,
    stiffness: 80,
    damping: 20,
    restDelta: 0.001
  });

  const contentRef = useRef(null);
  const [contentHeight, setContentHeight] = useState(0);
  const [windowHeight, setWindowHeight] = useState(0);

  useEffect(() => {
    setWindowHeight(window.innerHeight);
    const handleResize = () => setWindowHeight(window.innerHeight);
    window.addEventListener('resize', handleResize);

    if (!contentRef.current) return;
    const resizeObserver = new ResizeObserver((entries) => {
      setContentHeight(entries[0].contentRect.height);
    });
    resizeObserver.observe(contentRef.current);

    return () => {
      window.removeEventListener('resize', handleResize);
      resizeObserver.disconnect();
    };
  }, []);

  // Compute the max scroll distance
  const maxScroll = Math.max(0, contentHeight - windowHeight);
  const y = useTransform(smoothProgress, [0, 1], [0, -maxScroll]);

  return (
    <>
      <div style={{ height: contentHeight }} className="w-full opacity-0 pointer-events-none" />
      <motion.div
        ref={contentRef}
        className="fixed top-0 left-0 w-full overflow-hidden will-change-transform z-10"
        style={{ y }}
      >
        {children}
      </motion.div>
    </>
  );
}
