import { useState, useRef, memo } from 'react';

const BentoCard = memo(function BentoCard({ children, className = '', containerClassName = '' }) {
  const divRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [shadowOffset, setShadowOffset] = useState({ x: 4, y: 4 });

  const handleMouseMove = (e) => {
    if (!divRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    // Normalized coordinates relative to card center (-1 to 1)
    const normX = ((e.clientX - rect.left) / width) * 2 - 1;
    const normY = ((e.clientY - rect.top) / height) * 2 - 1;
    
    // Shadow shifts away from cursor: ranges from 1px to 7px
    const sx = 4 - normX * 3;
    const sy = 4 - normY * 3;
    
    setShadowOffset({ x: sx, y: sy });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setIsPressed(false);
    setShadowOffset({ x: 4, y: 4 });
  };

  return (
    <div className={`w-full ${containerClassName}`}>
      <div
        ref={divRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        onMouseDown={() => setIsPressed(true)}
        onMouseUp={() => setIsPressed(false)}
        style={{
          transform: isPressed 
            ? 'translate(4px, 4px)' 
            : isHovered 
              ? `translate(${2 - shadowOffset.x/2}px, ${2 - shadowOffset.y/2}px)` 
              : 'translate(0px, 0px)',
          boxShadow: isPressed 
            ? '0px 0px 0px 0px rgba(0,0,0,0)' 
            : `${shadowOffset.x.toFixed(1)}px ${shadowOffset.y.toFixed(1)}px var(--shadow-blur, 0px) var(--shadow-spread, 0px) var(--shadow-color)`,
          transition: isPressed ? 'none' : 'transform 0.15s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.15s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        className={`relative overflow-hidden group rounded-2xl bg-white/70 dark:bg-card-bg-dark backdrop-blur-2xl border border-white/60 dark:border-primary-text-dark [--shadow-color:rgba(224,122,95,0.06)] [--shadow-blur:24px] [--shadow-spread:-4px] dark:[--shadow-color:rgba(250,250,250,0.95)] dark:[--shadow-blur:0px] dark:[--shadow-spread:0px] text-primary-text dark:text-primary-text-dark shadow-[inset_0_1px_1px_rgba(255,255,255,0.8)] dark:shadow-none ${className}`}
      >
        {/* Content Wrapper */}
        <div className="relative z-10 h-full w-full">
          {children}
        </div>
      </div>
    </div>
  );
});

export default BentoCard;
