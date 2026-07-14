import { useMemo, useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

// ─── Constants & Tunables ───────────────────────────────────────────────────
const LAYER_DEFS = [
  // { count, depth, speed, size, opacity }
  { count: 70,  depth: 2.0,  speed: 1.2,  size: 0.11, opacity: 0.85 },
  { count: 50,  depth: -1.0, speed: 0.8,  size: 0.08, opacity: 0.60 },
  { count: 35,  depth: -4.0, speed: 0.5,  size: 0.06, opacity: 0.40 },
  { count: 20,  depth: -8.0, speed: 0.2,  size: 0.04, opacity: 0.20 },
];

const CONNECTION_DIST   = 2.8;   // max distance for drawing edges
const MOUSE_ATTRACT_R   = 4.2;   // radius of cursor influence
const MOUSE_ATTRACT_K   = 0.022; // spring constant toward cursor
const MOUSE_DAMPEN      = 0.90;  // velocity damping per frame
const GLOW_DIST         = 2.5;   // radius for particle glow boost
const BREATHE_AMP       = 0.08;  // breathing scale amplitude
const BREATHE_SPEED     = 0.28;  // breathing cycles per second

const ACCENT_COLOR      = new THREE.Color('#E07A5F');

// ─── Custom Shaders ──────────────────────────────────────────────────────────

// Volumetric background shader creating atmospheric shafts and light rays
const VolumetricShader = {
  uniforms: {
    uTime: { value: 0 },
    uMouse: { value: new THREE.Vector2(0, 0) },
    uResolution: { value: new THREE.Vector2(1, 1) },
    uIsDark: { value: 0 },
    uAccentColor: { value: ACCENT_COLOR },
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = vec4(position.xy, 0.999, 1.0);
    }
  `,
  fragmentShader: `
    uniform float uTime;
    uniform vec2 uMouse;
    uniform vec2 uResolution;
    uniform float uIsDark;
    uniform vec3 uAccentColor;
    varying vec2 vUv;

    float hash(vec2 p) {
      return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
    }

    float noise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      vec2 u = f * f * (3.0 - 2.0 * f);
      return mix(mix(hash(i + vec2(0.0,0.0)), hash(i + vec2(1.0,0.0)), u.x),
                 mix(hash(i + vec2(0.0,1.0)), hash(i + vec2(1.0,1.0)), u.x), u.y);
    }

    void main() {
      // Correct aspect ratio
      vec2 uv = (vUv - 0.5) * 2.0;
      uv.x *= uResolution.x / uResolution.y;

      vec2 mouse = uMouse * vec2(uResolution.x / uResolution.y, 1.0);

      // Radial distances
      float distToMouse = length(uv - mouse);
      float distToCenter = length(uv - vec2(0.2, -0.1));

      // Calculate angle relative to mouse position for volumetric rays
      float angle = atan(uv.y - mouse.y, uv.x - mouse.x);
      
      // Layered volumetric noise shafts
      float rayNoise = noise(vec2(angle * 3.5 + uTime * 0.18, uTime * 0.08)) * 0.5;
      rayNoise += noise(vec2(angle * 7.0 - uTime * 0.35, uTime * 0.12)) * 0.3;
      rayNoise += noise(vec2(angle * 14.0 + uTime * 0.65, uTime * 0.22)) * 0.2;
      
      // Falloff of rays
      float rayStrength = smoothstep(3.0, 0.0, distToMouse) * (0.35 + 0.65 * rayNoise);
      
      // Volumetric soft glows
      float glow = 0.40 / (0.45 + distToMouse * distToMouse * 1.2);
      glow += 0.20 / (0.35 + distToCenter * distToCenter * 1.8);

      float volumetric = (rayStrength * 0.55 + glow * 0.45);

      // Breath cycles
      float breathe = 0.88 + 0.12 * sin(uTime * ${BREATHE_SPEED} * 3.14159 * 2.0);
      volumetric *= breathe;

      // Theme background colors
      vec3 bgLight = vec3(0.99, 0.99, 0.95); // #FFFDF0
      vec3 bgDark = vec3(0.10, 0.10, 0.115); // #1C1C1D
      vec3 baseBg = mix(bgLight, bgDark, uIsDark);

      // Subtle atmospheric volumetric color gradient
      vec3 glowColor = mix(vec3(0.96, 0.86, 0.80), uAccentColor, 0.35);
      if (uIsDark > 0.5) {
        glowColor = mix(vec3(0.08, 0.05, 0.06), uAccentColor, 0.25);
      }

      vec3 col = mix(baseBg, glowColor, volumetric * (uIsDark > 0.5 ? 0.38 : 0.16));

      // Fine screen vignette
      vec2 uvNorm = vUv * (1.0 - vUv.yx);
      float vig = uvNorm.x * uvNorm.y * 15.0;
      vig = clamp(pow(vig, 0.24), 0.0, 1.0);
      col = mix(baseBg * 0.88, col, vig);

      gl_FragColor = vec4(col, 1.0);
    }
  `
};

// Custom shader for round glowing particles
const ParticleShader = {
  uniforms: {
    uTime: { value: 0 },
    uColor: { value: new THREE.Color(1, 1, 1) },
    uIsDark: { value: 0 },
    uAccentColor: { value: ACCENT_COLOR },
  },
  vertexShader: `
    uniform float uTime;
    attribute float aSpeed;
    attribute float aPhase;
    varying float vGlow;
    varying vec3 vColor;
    void main() {
      vec3 pos = position;
      // Add drift
      pos.x += sin(uTime * aSpeed * 0.5 + aPhase) * 0.12;
      pos.y += cos(uTime * aSpeed * 0.4 + aPhase) * 0.12;

      vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
      gl_Position = projectionMatrix * mvPosition;
      
      // Dynamic point size scaling based on perspective
      gl_PointSize = (180.0 / -mvPosition.z);
      
      vGlow = 0.5 + 0.5 * sin(uTime * aSpeed + aPhase);
    }
  `,
  fragmentShader: `
    uniform vec3 uColor;
    uniform vec3 uAccentColor;
    uniform float uIsDark;
    varying float vGlow;
    void main() {
      vec2 coord = gl_PointCoord - vec2(0.5);
      float dist = length(coord);
      if (dist > 0.5) discard;

      float alpha = smoothstep(0.5, 0.05, dist);
      
      // Blend accent color slightly into glow particles
      vec3 col = mix(uColor, uAccentColor, 0.25 + 0.2 * vGlow);
      
      gl_FragColor = vec4(col, alpha * (0.7 + 0.3 * vGlow));
    }
  `
};

// ─── Background Mesh ─────────────────────────────────────────────────────────
function VolumetricBackground({ isDark }) {
  const meshRef = useRef(null);
  const { size } = useThree();

  // Store mutable uniforms in useRef to bypass eslint/react-hooks/immutability
  const uniformsRef = useRef({
    uTime: { value: 0 },
    uMouse: { value: new THREE.Vector2(0, 0) },
    uResolution: { value: new THREE.Vector2(size.width, size.height) },
    uIsDark: { value: isDark ? 1 : 0 },
    uAccentColor: { value: ACCENT_COLOR },
  });

  useEffect(() => {
    uniformsRef.current.uResolution.value.set(size.width, size.height);
  }, [size]);

  useEffect(() => {
    uniformsRef.current.uIsDark.value = isDark ? 1 : 0;
  }, [isDark]);

  useFrame((state) => {
    if (!meshRef.current) return;
    uniformsRef.current.uTime.value = state.clock.getElapsedTime();
    
    // Smooth pointer lerp
    uniformsRef.current.uMouse.value.lerp(state.pointer, 0.08);
  });

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        vertexShader={VolumetricShader.vertexShader}
        fragmentShader={VolumetricShader.fragmentShader}
        uniforms={uniformsRef.current}
        depthWrite={false}
        depthTest={false}
      />
    </mesh>
  );
}

// ─── Intelligent Interactive Field ──────────────────────────────────────────
function IntelligenceField({ isDark }) {
  const mouseNDC = useRef(new THREE.Vector2(0, 0));

  useEffect(() => {
    const onMove = (e) => {
      mouseNDC.current.set(
        (e.clientX / window.innerWidth) * 2 - 1,
        -(e.clientY / window.innerHeight) * 2 + 1
      );
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, []);

  const layers = useMemo(() => {
    return LAYER_DEFS.map((def) => {
      const pos = [];
      const vel = [];
      const base = [];
      const speed = [];
      const phase = [];
      
      for (let i = 0; i < def.count; i++) {
        const x = randRange(-8.5, 8.5);
        const y = randRange(-5.0, 5.0);
        const z = def.depth + randRange(-0.4, 0.4);
        pos.push(x, y, z);
        vel.push(0, 0, 0);
        base.push(x, y);
        speed.push(randRange(0.4, 1.4));
        phase.push(randRange(0, Math.PI * 2));
      }
      return {
        ...def,
        pos: new Float32Array(pos),
        vel: new Float32Array(vel),
        base: new Float32Array(base),
        speed: new Float32Array(speed),
        phase: new Float32Array(phase),
      };
    });
  }, []);

  const dotGeoRefs  = useRef(LAYER_DEFS.map(() => null));
  const lineGeoRefs = useRef(LAYER_DEFS.map(() => null));
  const dotMatRefs  = useRef(LAYER_DEFS.map(() => null));
  const lineMatRefs = useRef(LAYER_DEFS.map(() => null));

  const linePosBufs = useMemo(() => layers.map(l => new Float32Array(l.count * l.count * 6)), [layers]);
  const lineColBufs = useMemo(() => layers.map(l => new Float32Array(l.count * l.count * 6)), [layers]);

  const _v3 = useMemo(() => new THREE.Vector3(), []);
  
  // Store mutable uniforms inside useRef to bypass eslint/react-hooks/immutability
  const uniformsRef = useRef(LAYER_DEFS.map(() => ({
    uTime: { value: 0 },
    uColor: { value: new THREE.Color(isDark ? 0xffffff : 0x1c1c1c) },
    uIsDark: { value: isDark ? 1 : 0 },
    uAccentColor: { value: ACCENT_COLOR },
  })));

  useEffect(() => {
    uniformsRef.current.forEach(u => {
      u.uColor.value.set(isDark ? 0xffffff : 0x1c1c1c);
      u.uIsDark.value = isDark ? 1 : 0;
    });
  }, [isDark]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const cam = state.camera;

    // Unproject pointer position into 3D world space
    _v3.set(mouseNDC.current.x, mouseNDC.current.y, 0.5).unproject(cam);
    const dir = _v3.sub(cam.position).normalize();
    const dist = -cam.position.z / dir.z;
    const mx = cam.position.x + dir.x * dist;
    const my = cam.position.y + dir.y * dist;

    // Slow ambient breathing
    const breathe = 1.0 + Math.sin(time * BREATHE_SPEED * Math.PI * 2) * BREATHE_AMP;

    const baseColor = isDark ? new THREE.Color(0xffffff) : new THREE.Color(0x1C1C1C);

    layers.forEach((layer, li) => {
      const { pos, vel, base, count, speed, opacity, depth } = layer;

      // Update particle uniforms safely via useRef mutable reference
      uniformsRef.current[li].uTime.value = time;

      // Calculate particle mechanics
      for (let i = 0; i < count; i++) {
        const ix = i * 3, iy = ix + 1;

        // Breathe base position
        const bx = base[i * 2] * breathe;
        const by = base[i * 2 + 1] * breathe;

        // Gravity pull toward cursor
        const dx = mx - pos[ix];
        const dy = my - pos[iy];
        const d2 = dx * dx + dy * dy;

        if (d2 < MOUSE_ATTRACT_R * MOUSE_ATTRACT_R) {
          const f = MOUSE_ATTRACT_K * speed[i];
          vel[ix] += dx * f;
          vel[iy] += dy * f;
        }

        // Return forces
        vel[ix] += (bx - pos[ix]) * 0.004 * speed[i];
        vel[iy] += (by - pos[iy]) * 0.004 * speed[i];

        vel[ix] *= MOUSE_DAMPEN;
        vel[iy] *= MOUSE_DAMPEN;

        pos[ix] += vel[ix];
        pos[iy] += vel[iy];
      }

      // Sync position buffers
      const dGeo = dotGeoRefs.current[li];
      if (dGeo) {
        dGeo.attributes.position.array.set(pos);
        dGeo.attributes.position.needsUpdate = true;
      }

      // Generate Connection Edges
      const lp = linePosBufs[li];
      const lc = lineColBufs[li];
      let lIdx = 0;

      const depthFade = 1.0 - Math.abs(depth) / 10.0;

      for (let i = 0; i < count; i++) {
        const ix = i * 3, iy = ix + 1;
        const ax = pos[ix], ay = pos[iy], az = pos[ix + 2];

        // Cursor proximity
        const ndx = ax - mx, ndy = ay - my;
        const nd2 = ndx * ndx + ndy * ndy;
        const glow = nd2 < GLOW_DIST * GLOW_DIST ? 1.0 - Math.sqrt(nd2) / GLOW_DIST : 0.0;

        for (let j = i + 1; j < count; j++) {
          const jx = j * 3, jy = jx + 1;
          const bx = pos[jx], by = pos[jy], bz = pos[jx + 2];

          const edx = bx - ax, edy = by - ay, edz = bz - az;
          const ed2 = edx * edx + edy * edy + edz * edz;

          if (ed2 > CONNECTION_DIST * CONNECTION_DIST) continue;

          const t = 1.0 - Math.sqrt(ed2) / CONNECTION_DIST;

          // Connection glow factor
          const midx = (ax + bx) * 0.5, midy = (ay + by) * 0.5;
          const cdx = midx - mx, cdy = midy - my;
          const cd2 = cdx * cdx + cdy * cdy;
          const cursorBoost = cd2 < CONNECTION_DIST * CONNECTION_DIST
            ? (1.0 - Math.sqrt(cd2) / CONNECTION_DIST) * 1.2
            : 0.0;

          const edgeOpacity = t * opacity * depthFade * (0.45 + cursorBoost * 0.8);
          const edgeColor = baseColor.clone().lerp(ACCENT_COLOR, Math.max(glow, cursorBoost) * 0.75);

          // Vertex A
          lp[lIdx]     = ax; lp[lIdx + 1] = ay; lp[lIdx + 2] = az;
          lc[lIdx]     = edgeColor.r * edgeOpacity;
          lc[lIdx + 1] = edgeColor.g * edgeOpacity;
          lc[lIdx + 2] = edgeColor.b * edgeOpacity;
          // Vertex B
          lp[lIdx + 3] = bx; lp[lIdx + 4] = by; lp[lIdx + 5] = bz;
          lc[lIdx + 3] = edgeColor.r * edgeOpacity;
          lc[lIdx + 4] = edgeColor.g * edgeOpacity;
          lc[lIdx + 5] = edgeColor.b * edgeOpacity;

          lIdx += 6;
        }
      }

      // Sync line segments
      const lGeo = lineGeoRefs.current[li];
      if (lGeo) {
        lGeo.attributes.position.array.set(lp);
        lGeo.attributes.position.needsUpdate = true;
        lGeo.attributes.color.array.set(lc);
        lGeo.attributes.color.needsUpdate = true;
        lGeo.setDrawRange(0, lIdx / 3);
      }

      // Soft connection breathing
      const lMat = lineMatRefs.current[li];
      if (lMat) {
        lMat.opacity = 0.90 + Math.sin(time * BREATHE_SPEED * Math.PI * 2 + li) * 0.10;
      }
    });

    // ── Cinematic Camera movement & sway ─────────────────────────────────────
    // Slow float movement
    const targetX = Math.sin(time * 0.12) * 1.2 + state.pointer.x * 2.2;
    const targetY = Math.cos(time * 0.16) * 0.8 + state.pointer.y * 1.4;
    const targetZ = 8.5 + Math.sin(time * 0.08) * 0.5;

    state.camera.position.x += (targetX - state.camera.position.x) * 0.035;
    state.camera.position.y += (targetY - state.camera.position.y) * 0.035;
    state.camera.position.z += (targetZ - state.camera.position.z) * 0.035;

    // Slight camera tilt/rotation targeting center
    state.camera.lookAt(
      state.pointer.x * 0.6,
      state.pointer.y * 0.4,
      0
    );
  });

  return (
    <>
      {layers.map((layer, li) => {
        const maxEdges = layer.count * layer.count;
        return (
          <group key={li}>
            {/* Particles */}
            <points>
              <bufferGeometry
                ref={(g) => {
                  if (!g) return;
                  dotGeoRefs.current[li] = g;
                  g.setAttribute('position', new THREE.BufferAttribute(layer.pos.slice(), 3));
                  g.setAttribute('aSpeed', new THREE.BufferAttribute(layer.speed, 1));
                  g.setAttribute('aPhase', new THREE.BufferAttribute(layer.phase, 1));
                }}
              />
              <shaderMaterial
                ref={(m) => { dotMatRefs.current[li] = m; }}
                vertexShader={ParticleShader.vertexShader}
                fragmentShader={ParticleShader.fragmentShader}
                uniforms={uniformsRef.current[li]}
                transparent
                depthWrite={false}
                blending={THREE.AdditiveBlending}
              />
            </points>

            {/* Connection Edges */}
            <lineSegments>
              <bufferGeometry
                ref={(g) => {
                  if (!g) return;
                  lineGeoRefs.current[li] = g;
                  const maxVerts = maxEdges * 2;
                  g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(maxVerts * 3), 3));
                  g.setAttribute('color', new THREE.BufferAttribute(new Float32Array(maxVerts * 3), 3));
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

function randRange(a, b) {
  return a + Math.random() * (b - a);
}

// ─── Main Canvas ─────────────────────────────────────────────────────────────
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
        camera={{ position: [0, 0, 8.5], fov: 55 }}
        gl={{ alpha: false, antialias: true, powerPreference: "high-performance" }}
        style={{ width: '100%', height: '100%', display: 'block' }}
        dpr={[1, 1.5]}
        performance={{ min: 0.6 }}
        frameloop="always"
      >
        <VolumetricBackground isDark={isDark} />
        <IntelligenceField isDark={isDark} />
      </Canvas>
    </div>
  );
}
