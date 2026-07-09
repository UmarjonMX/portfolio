import { useState, useRef } from 'react';
import { motion } from 'framer-motion';

export default function BentoCard({ children, className = '', containerClassName = '' }) {
  const divRef = useRef(null);
  const [isFocused, setIsFocused] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    if (!divRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <motion.div
      variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
      whileHover={{ y: -5 }}
      className={containerClassName}
    >
      <div
        ref={divRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsFocused(true)}
        onMouseLeave={() => setIsFocused(false)}
        className={`relative overflow-hidden group rounded-[2.5rem] bg-glass-light dark:bg-glass-dark border border-border-light dark:border-border-dark shadow-sm backdrop-blur-xl hover:border-accent transition-colors duration-300 ${className}`}
      >
        {/* Spotlight Follow Glow */}
        <div
          className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-300 group-hover:opacity-100 z-0"
          style={{
            background: `radial-gradient(800px circle at ${position.x}px ${position.y}px, rgba(8, 203, 0, 0.15), transparent 40%)`,
          }}
        />
        
        {/* Content Wrapper */}
        <div className="relative z-10 h-full w-full">
          {children}
        </div>
      </div>
    </motion.div>
  );
}
