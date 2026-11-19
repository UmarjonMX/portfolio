import { motion as Motion } from 'framer-motion';

/**
 * The optical layers of the Liquid Glass material.
 *
 * The capsule itself carries `.liquid-glass` (backdrop filter + tint + edge
 * colours). These spans sit on top of that surface and do the rest of the
 * optics: light bands under the rims, a slow diagonal reflection, the pointer
 * specular, and the one-pixel edge light. They are inert: no layout, no
 * pointer events, no React state.
 *
 * `sheen` is the Navbar's existing 0.25 → 1 MotionValue for the separated
 * state, so the specular gains presence as the bar becomes three objects
 * without any new animation system. `edge` is the same idea for the side
 * rims and the diagonal reflection: both are per-capsule optics, invisible
 * while the bar is welded shut and present once it splits. `seam` drives the
 * 1px joint patch, which exists only while the pieces are welded together.
 */
export default function LiquidGlass({ sheen, edge, seam }) {
  return (
    <span aria-hidden="true" className="liquid-glass__layers">
      <span className="liquid-glass__refract" />
      <Motion.span className="liquid-glass__sheen" style={{ opacity: edge }} />
      <Motion.span className="liquid-glass__specular-wrap" style={{ opacity: sheen }}>
        <span className="liquid-glass__specular" />
      </Motion.span>
      <Motion.span className="liquid-glass__side" style={{ opacity: edge }} />
      <span className="liquid-glass__edge" />
      <Motion.span className="liquid-glass__seam" style={{ opacity: seam }} />
    </span>
  );
}
