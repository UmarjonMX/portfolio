import { memo, useCallback, useRef } from 'react';

/**
 * A card cell.
 *
 * Both the cell and its surface are `h-full`, so a row of cards shares one
 * height: the grid stretches the cells, and the surface fills the cell instead
 * of stopping at its own content. Without the second `h-full` the cell would
 * stretch while the surface inside it stayed content-height, which is exactly
 * the uneven row this component is used to avoid.
 *
 * Cells stack naturally on a single-column grid, where there is no row to match.
 *
 * The offset shadow follows the cursor. It used to be React state written on
 * every `mousemove`, which re-rendered the card and its whole subtree up to 60
 * times a second; there are seven of these on the page. The geometry is now
 * written straight to the element's inline style, so moving the pointer costs
 * one `style.transform` assignment and no render at all.
 */
const REST = { x: 4, y: 4 };

const BentoCard = memo(function BentoCard({ children, className = '', containerClassName = '' }) {
  const divRef = useRef(null);

  // Reflected in refs rather than state: a pointer-move loop must never enter
  // React's render path.
  const hoverRef = useRef(false);
  const pressRef = useRef(false);
  const offsetRef = useRef(REST);

  const paint = useCallback(() => {
    const el = divRef.current;
    if (!el) return;
    const { x, y } = offsetRef.current;

    if (pressRef.current) {
      el.style.transition = 'none';
      el.style.transform = `translate(${REST.x}px, ${REST.y}px)`;
      el.style.boxShadow = '0px 0px 0px 0px rgba(0,0,0,0)';
      return;
    }

    el.style.transition =
      'transform 0.15s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.15s cubic-bezier(0.16, 1, 0.3, 1)';
    el.style.transform = hoverRef.current
      ? `translate(${(2 - x / 2).toFixed(2)}px, ${(2 - y / 2).toFixed(2)}px)`
      : 'translate(0px, 0px)';
    el.style.boxShadow = hoverRef.current
      ? `${x.toFixed(1)}px ${y.toFixed(1)}px var(--shadow-blur, 0px) var(--shadow-spread, 0px) var(--shadow-color)`
      : `${REST.x}px ${REST.y}px var(--shadow-blur, 0px) var(--shadow-spread, 0px) var(--shadow-color)`;
  }, []);

  const handleMouseMove = useCallback(
    (e) => {
      const el = divRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      if (!rect.width || !rect.height) return;

      // Normalised coordinates relative to the card centre (-1..1).
      const normX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const normY = ((e.clientY - rect.top) / rect.height) * 2 - 1;

      // Shadow shifts away from the cursor: ranges from 1px to 7px.
      offsetRef.current = { x: 4 - normX * 3, y: 4 - normY * 3 };
      paint();
    },
    [paint]
  );

  const handleMouseEnter = useCallback(() => {
    hoverRef.current = true;
    paint();
  }, [paint]);

  const handleMouseLeave = useCallback(() => {
    hoverRef.current = false;
    pressRef.current = false;
    offsetRef.current = REST;
    paint();
  }, [paint]);

  const handleMouseDown = useCallback(() => {
    pressRef.current = true;
    paint();
  }, [paint]);

  const handleMouseUp = useCallback(() => {
    pressRef.current = false;
    paint();
  }, [paint]);

  return (
    <div className={`h-full w-full ${containerClassName}`}>
      <div
        ref={divRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        style={{
          transform: 'translate(0px, 0px)',
          boxShadow: '4px 4px var(--shadow-blur, 0px) var(--shadow-spread, 0px) var(--shadow-color)',
        }}
        className={`glass3d relative h-full overflow-hidden group rounded-2xl bg-white/70 dark:bg-card-bg-dark backdrop-blur-2xl border border-white/60 dark:border-primary-text-dark [--shadow-color:rgba(224,122,95,0.06)] [--shadow-blur:24px] [--shadow-spread:-4px] dark:[--shadow-color:rgba(250,250,250,0.95)] dark:[--shadow-blur:0px] dark:[--shadow-spread:0px] text-primary-text dark:text-primary-text-dark shadow-[inset_0_1px_1px_rgba(255,255,255,0.8)] dark:shadow-none ${className}`}
      >
        <div className="relative z-10 h-full w-full">{children}</div>
      </div>
    </div>
  );
});

export default BentoCard;