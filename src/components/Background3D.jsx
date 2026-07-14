import { useMemo, useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// ─── Tunables ────────────────────────────────────────────────────────────────
const LAYER_DEFS = [
  // { count, depth, speed, size, opacity }  — three depth layers
  { count: 55,  depth: 0,    speed: 1.0,  size: 0.055, opacity: 0.75 },
  { count: 35,  depth: -2.5, speed: 0.55, size: 0.035, opacity: 0.45 },
  { count: 22,  depth: -5.5, speed: 0.25, size: 0.022, opacity: 0.25 },
];

const CONNECTION_DIST   = 3.2;   // max distance for drawing edges
const MOUSE_ATTRACT_R   = 3.8;   // radius of cursor influence
const MOUSE_ATTRACT_K   = 0.018; // spring constant toward cursor
const MOUSE_DAMPEN      = 0.88;  // velocity damping per frame
const GLOW_DIST         = 2.2;   // radius for particle glow boost
const BREATHE_AMP       = 0.06;  // breathing scale amplitude
const BREATHE_SPEED     = 0.35;  // breathing cycles per second

// Accent warm-terracotta from design system
const ACCENT_HEX    = '#E07A5F';
const ACCENT_COLOR  = new THREE.Color(ACCENT_HEX);

// ─── Helpers ──────────────────────────────────────────────────────────────────
function randRange(a, b) { return a + Math.random() * (b - a); }

// ─── Node network scene ───────────────────────────────────────────────────────
function IntelligenceField({ isDark }) {

  // Mouse in normalised screen space [-1..1] shared across components
  const mouseNDC = useRef(new THREE.Vector2(9999, 9999));
  useEffect(() => {
    const onMove = (e) => {
      mouseNDC.current.set(
        (e.clientX / window.innerWidth)  * 2 - 1,
        -(e.clientY / window.innerHeight) * 2 + 1
      );
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, []);

  // ── Per-layer data (positions, velocities, refs) ──────────────────────────
  const layers = useMemo(() => {
    return LAYER_DEFS.map((def) => {
      const pos = [];
      const vel = [];
      const base = [];   // resting positions
      for (let i = 0; i < def.count; i++) {
        const x = randRange(-9, 9);
        const y = randRange(-5, 5);
        const z = def.depth + randRange(-0.5, 0.5);
        pos.push(x, y, z);
        vel.push(0, 0, 0);
        base.push(x, y);
      }
      return {
        ...def,
        pos: new Float32Array(pos),
        vel: new Float32Array(vel),
        base: new Float32Array(base),
      };
    });
  }, []);

  // ── Geometry / material refs for each layer ───────────────────────────────
  const dotGeoRefs  = useRef(LAYER_DEFS.map(() => null));
  const lineGeoRefs = useRef(LAYER_DEFS.map(() => null));
  const dotMatRefs  = useRef(LAYER_DEFS.map(() => null));
  const lineMatRefs = useRef(LAYER_DEFS.map(() => null));

  // Persistent buffers for line segments (reused every frame, no GC)
  const linePosBufs = useMemo(() =>
    layers.map(l => new Float32Array(l.count * l.count * 6)), [layers]);
  const lineColBufs = useMemo(() =>
    layers.map(l => new Float32Array(l.count * l.count * 6)), [layers]);

  // Temp vectors (no per-frame allocation)
  const _v3 = useMemo(() => new THREE.Vector3(), []);

  // ── Animation loop ────────────────────────────────────────────────────────
  useFrame((state) => {
    const time  = state.clock.getElapsedTime();
    const cam   = state.camera;

    // Unproject mouse NDC → world plane Z=0
    _v3.set(mouseNDC.current.x, mouseNDC.current.y, 0.5).unproject(cam);
    const dir  = _v3.sub(cam.position).normalize();
    const dist = -cam.position.z / dir.z;
    const mx   = cam.position.x + dir.x * dist;
    const my   = cam.position.y + dir.y * dist;

    // Global breathing scale (uniform sine)
    const breathe = 1 + Math.sin(time * BREATHE_SPEED * Math.PI * 2) * BREATHE_AMP;

    // Node and line colors based on theme
    const nodeBase  = isDark ? new THREE.Color(0xffffff) : new THREE.Color(0x1C1C1C);
    const edgeBase  = isDark ? new THREE.Color(0xffffff) : new THREE.Color(0x1C1C1C);

    layers.forEach((layer, li) => {
      const { pos, vel, base, count, speed, opacity, depth } = layer;

      // ─ Update positions with mouse attraction ─────────────────────────────
      for (let i = 0; i < count; i++) {
        const ix = i * 3, iy = ix + 1;

        // Breathing: nudge towards origin slightly
        const bx = base[i * 2] * breathe;
        const by = base[i * 2 + 1] * breathe;

        // Distance to cursor (world-space)
        const dx = mx - pos[ix];
        const dy = my - pos[iy];
        const d2 = dx * dx + dy * dy;

        if (d2 < MOUSE_ATTRACT_R * MOUSE_ATTRACT_R) {
          const f = MOUSE_ATTRACT_K * speed;
          vel[ix] += dx * f;
          vel[iy] += dy * f;
        }

        // Restore toward breathing base position
        vel[ix] += (bx - pos[ix]) * 0.003 * speed;
        vel[iy] += (by - pos[iy]) * 0.003 * speed;

        // Dampen
        vel[ix] *= MOUSE_DAMPEN;
        vel[iy] *= MOUSE_DAMPEN;

        // Integrate
        pos[ix] += vel[ix];
        pos[iy] += vel[iy];
      }

      // ─ Update dot geometry ────────────────────────────────────────────────
      const dGeo = dotGeoRefs.current[li];
      if (dGeo) {
        dGeo.attributes.position.array.set(pos);
        dGeo.attributes.position.needsUpdate = true;
      }

      // ─ Dot material opacity (breathe) ─────────────────────────────────────
      const dMat = dotMatRefs.current[li];
      if (dMat) {
        dMat.opacity = opacity * (0.85 + Math.sin(time * BREATHE_SPEED * Math.PI * 2 + li) * 0.15);
      }

      // ─ Build line segments ────────────────────────────────────────────────
      const lp = linePosBufs[li];
      const lc = lineColBufs[li];
      let lIdx = 0;

      const depthFade = 1 - Math.abs(depth) / 8; // far layers slightly dimmer

      for (let i = 0; i < count; i++) {
        const ix = i * 3, iy = ix + 1;
        const ax = pos[ix], ay = pos[iy], az = pos[ix + 2];

        // Per-node: cursor proximity → glow factor
        const ndx = ax - mx, ndy = ay - my;
        const nd2 = ndx * ndx + ndy * ndy;
        const glow = nd2 < GLOW_DIST * GLOW_DIST
          ? 1 - Math.sqrt(nd2) / GLOW_DIST
          : 0;

        for (let j = i + 1; j < count; j++) {
          const jx = j * 3, jy = jx + 1;
          const bx = pos[jx], by = pos[jy], bz = pos[jx + 2];

          const edx = bx - ax, edy = by - ay, edz = bz - az;
          const ed2 = edx * edx + edy * edy + edz * edz;

          if (ed2 > CONNECTION_DIST * CONNECTION_DIST) continue;

          const t = 1 - Math.sqrt(ed2) / CONNECTION_DIST;

          // Cursor proximity → edge brightens
          const midx = (ax + bx) * 0.5, midy = (ay + by) * 0.5;
          const cdx  = midx - mx, cdy = midy - my;
          const cd2  = cdx * cdx + cdy * cdy;
          const cursorBoost = cd2 < CONNECTION_DIST * CONNECTION_DIST
            ? (1 - Math.sqrt(cd2) / CONNECTION_DIST) * 0.8
            : 0;

          const alpha = t * opacity * depthFade * (0.55 + cursorBoost);

          // Blend node color with accent on cursor proximity
          const nodeColor = nodeBase.clone().lerp(ACCENT_COLOR, Math.max(glow, cursorBoost) * 0.6);
          const edgeColor = edgeBase.clone().lerp(ACCENT_COLOR, cursorBoost * 0.7);

          // Vertex A
          lp[lIdx]     = ax; lp[lIdx + 1] = ay; lp[lIdx + 2] = az;
          lc[lIdx]     = edgeColor.r * alpha;
          lc[lIdx + 1] = edgeColor.g * alpha;
          lc[lIdx + 2] = edgeColor.b * alpha;
          // Vertex B
          lp[lIdx + 3] = bx; lp[lIdx + 4] = by; lp[lIdx + 5] = bz;
          lc[lIdx + 3] = edgeColor.r * alpha;
          lc[lIdx + 4] = edgeColor.g * alpha;
          lc[lIdx + 5] = edgeColor.b * alpha;

          lIdx += 6;
          // Suppress unused var warning
          void nodeColor;
        }
      }

      // Upload line geometry
      const lGeo = lineGeoRefs.current[li];
      if (lGeo) {
        lGeo.attributes.position.array.set(lp);
        lGeo.attributes.position.needsUpdate = true;
        lGeo.attributes.color.array.set(lc);
        lGeo.attributes.color.needsUpdate = true;
        lGeo.setDrawRange(0, lIdx / 3);
      }

      // ─ Line material (breathe opacity) ────────────────────────────────────
      const lMat = lineMatRefs.current[li];
      if (lMat) {
        lMat.opacity = 0.92 + Math.sin(time * BREATHE_SPEED * Math.PI * 2) * 0.08;
      }
    });

    // ── Slow camera sway (not scroll-driven in this layer) ─────────────────
    state.camera.position.x += (state.pointer.x * 0.5 - state.camera.position.x) * 0.02;
    state.camera.position.y += (state.pointer.y * 0.3 - state.camera.position.y) * 0.02;
    state.camera.lookAt(0, 0, 0);
  });

  // ── JSX: one <group> per layer ────────────────────────────────────────────
  return (
    <>
      {layers.map((layer, li) => {
        const maxEdges = layer.count * layer.count;
        const dotColor = isDark ? '#ffffff' : '#1C1C1C';

        return (
          <group key={li}>
            {/* Nodes */}
            <points>
              <bufferGeometry
                ref={(g) => {
                  if (!g) return;
                  dotGeoRefs.current[li] = g;
                  g.setAttribute(
                    'position',
                    new THREE.BufferAttribute(layer.pos.slice(), 3)
                  );
                }}
              />
              <pointsMaterial
                ref={(m) => { dotMatRefs.current[li] = m; }}
                size={layer.size}
                color={dotColor}
                transparent
                opacity={layer.opacity}
                depthWrite={false}
                sizeAttenuation
              />
            </points>

            {/* Connections */}
            <lineSegments>
              <bufferGeometry
                ref={(g) => {
                  if (!g) return;
                  lineGeoRefs.current[li] = g;
                  const maxVerts = maxEdges * 2;
                  g.setAttribute(
                    'position',
                    new THREE.BufferAttribute(new Float32Array(maxVerts * 3), 3)
                  );
                  g.setAttribute(
                    'color',
                    new THREE.BufferAttribute(new Float32Array(maxVerts * 3), 3)
                  );
                  g.setDrawRange(0, 0);
                }}
              />
              <lineBasicMaterial
                ref={(m) => { lineMatRefs.current[li] = m; }}
                vertexColors
                transparent
                opacity={layer.opacity}
                depthWrite={false}
                blending={THREE.AdditiveBlending}
              />
            </lineSegments>
          </group>
        );
      })}
    </>
  );
}

// ─── Root export ──────────────────────────────────────────────────────────────
export default function Background3D() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const check = () => setIsDark(document.documentElement.classList.contains('dark'));
    check();
    const obs = new MutationObserver(check);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => obs.disconnect();
  }, []);

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: -20, pointerEvents: 'none' }}>
      <Canvas
        camera={{ position: [0, 0, 9], fov: 55 }}
        gl={{ alpha: true, antialias: true }}
        style={{ width: '100%', height: '100%', display: 'block' }}
        dpr={[1, 1.5]}
        performance={{ min: 0.5 }}
        frameloop="always"
      >
        <IntelligenceField isDark={isDark} />
      </Canvas>
    </div>
  );
}
