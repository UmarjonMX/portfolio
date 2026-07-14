import { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

// ═══ HELPERS ═══════════════════════════════════════════════════════════════════
function randRange(a, b) { return a + Math.random() * (b - a); }
function easeOutQuart(t) { return 1 - Math.pow(1 - t, 4); }

// ═══ CONSTANTS ═════════════════════════════════════════════════════════════════
const ACCENT_COLOR  = new THREE.Color('#E07A5F');
const BREATHE_SPEED = 0.28;
const ORBIT_COUNT   = 50;
const DUST_COUNT    = 80;

// ═══ MODULE STATE ══════════════════════════════════════════════════════════════
let scrollProgress = 0;

// ═══ ORBIT DATA (module-level, avoids hook-mutation lint) ═══════════════════
const orbitSpeeds   = [];
const orbitOffsets  = [];
const orbitRadii    = [];
const orbitYOffsets = [];
const orbitPos      = new Float32Array(ORBIT_COUNT * 3);
for (let i = 0; i < ORBIT_COUNT; i++) {
  orbitSpeeds.push(0.15 + Math.random() * 0.5);
  orbitOffsets.push(Math.random() * Math.PI * 2);
  orbitRadii.push(2.8 + Math.random() * 1.0);
  orbitYOffsets.push((Math.random() - 0.5) * 0.8);
}

// ═══ DUST DATA ═════════════════════════════════════════════════════════════════
const dustPositions = new Float32Array(DUST_COUNT * 3);
const dustSpeeds    = new Float32Array(DUST_COUNT);
const dustPhases    = new Float32Array(DUST_COUNT);
for (let i = 0; i < DUST_COUNT; i++) {
  dustPositions[i * 3]     = randRange(-12, 12);
  dustPositions[i * 3 + 1] = randRange(-7, 7);
  dustPositions[i * 3 + 2] = randRange(-5, 3);
  dustSpeeds[i]  = randRange(0.3, 1.2);
  dustPhases[i]  = randRange(0, Math.PI * 2);
}

// ═══ MODULE-LEVEL UNIFORMS ═════════════════════════════════════════════════════
const bgU = {
  uTime:        { value: 0 },
  uMouse:       { value: new THREE.Vector2(0, 0) },
  uResolution:  { value: new THREE.Vector2(1, 1) },
  uIsDark:      { value: 0 },
  uAccentColor: { value: ACCENT_COLOR },
};

const crystalOuterU = {
  uColor:   { value: ACCENT_COLOR.clone() },
  uTime:    { value: 0 },
  uOpacity: { value: 0 },
  uGlow:    { value: 0 },
};

const crystalInnerU = {
  uColor:   { value: new THREE.Color(1, 1, 1) },
  uTime:    { value: 0 },
  uOpacity: { value: 0 },
  uGlow:    { value: 0 },
};

const coreU = {
  uColor:   { value: ACCENT_COLOR.clone() },
  uTime:    { value: 0 },
  uOpacity: { value: 0 },
};

const orbitU = {
  uColor:   { value: ACCENT_COLOR.clone() },
  uOpacity: { value: 0 },
};

const dustU = {
  uTime:    { value: 0 },
  uColor:   { value: new THREE.Color(1, 1, 1) },
  uOpacity: { value: 0 },
};

// ═══ SHADERS ═══════════════════════════════════════════════════════════════════

const BG_VERT = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.999, 1.0);
  }
`;

const BG_FRAG = `
  uniform float uTime;
  uniform vec2  uMouse;
  uniform vec2  uResolution;
  uniform float uIsDark;
  uniform vec3  uAccentColor;
  varying vec2  vUv;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }
  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1.0,0.0)), u.x),
               mix(hash(i + vec2(0.0,1.0)), hash(i + vec2(1.0,1.0)), u.x), u.y);
  }
  void main() {
    vec2 uv = (vUv - 0.5) * 2.0;
    float aspect = uResolution.x / uResolution.y;
    uv.x *= aspect;

    vec2 focal = vec2(0.55 * aspect, 0.0);
    vec2 mouse = uMouse * vec2(aspect, 1.0);

    float dFocal = length(uv - focal);
    float dMouse = length(uv - mouse);

    float angle = atan(uv.y - focal.y, uv.x - focal.x);

    float rays = noise(vec2(angle * 4.0 + uTime * 0.15, uTime * 0.08)) * 0.5;
    rays += noise(vec2(angle * 8.0 - uTime * 0.3,  uTime * 0.1))  * 0.3;
    rays += noise(vec2(angle * 16.0 + uTime * 0.5, uTime * 0.18)) * 0.2;

    float rayStr = smoothstep(3.5, 0.0, dFocal) * (0.3 + 0.7 * rays);

    float glow = 0.50 / (0.3 + dFocal * dFocal * 0.8);
    glow += 0.25 / (0.4 + dMouse * dMouse * 1.5);

    float vol = rayStr * 0.5 + glow * 0.5;
    float breathe = 0.85 + 0.15 * sin(uTime * ${BREATHE_SPEED} * 6.28318);
    vol *= breathe;

    vec3 bgL  = vec3(0.996, 0.992, 0.941);
    vec3 bgD  = vec3(0.071, 0.071, 0.082);
    vec3 base = mix(bgL, bgD, uIsDark);

    vec3 glowC = mix(vec3(0.96, 0.88, 0.82), uAccentColor, 0.4);
    if (uIsDark > 0.5) {
      glowC = mix(vec3(0.06, 0.04, 0.05), uAccentColor, 0.3);
    }

    vec3 col = mix(base, glowC, vol * (uIsDark > 0.5 ? 0.45 : 0.18));

    vec2 v = vUv * (1.0 - vUv.yx);
    float vig = clamp(pow(v.x * v.y * 18.0, 0.22), 0.0, 1.0);
    col = mix(base * 0.85, col, vig);

    gl_FragColor = vec4(col, 1.0);
  }
`;

// Shared vertex shader for crystal meshes (fresnel + core)
const CRYSTAL_VERT = `
  varying vec3 vNormal;
  varying vec3 vViewDir;
  void main() {
    vNormal  = normalize(normalMatrix * normal);
    vec4 mv  = modelViewMatrix * vec4(position, 1.0);
    vViewDir = normalize(-mv.xyz);
    gl_Position = projectionMatrix * mv;
  }
`;

const FRESNEL_FRAG = `
  uniform vec3  uColor;
  uniform float uTime;
  uniform float uOpacity;
  uniform float uGlow;
  varying vec3  vNormal;
  varying vec3  vViewDir;
  void main() {
    float fresnel = pow(1.0 - abs(dot(vNormal, vViewDir)), 3.0);
    float pulse   = 0.88 + 0.12 * sin(uTime * 1.5);
    vec3  col     = uColor * (0.25 + fresnel * 1.5) * pulse;
    col          += uColor * uGlow * 0.5;
    float alpha   = (0.03 + fresnel * 0.97) * uOpacity;
    gl_FragColor  = vec4(col, alpha);
  }
`;

const CORE_FRAG = `
  uniform vec3  uColor;
  uniform float uTime;
  uniform float uOpacity;
  varying vec3  vNormal;
  varying vec3  vViewDir;
  void main() {
    float facing = max(0.0, dot(vNormal, vViewDir));
    float glow   = pow(facing, 0.5);
    float pulse  = 0.7 + 0.3 * sin(uTime * 2.5);
    vec3  col    = uColor * glow * pulse * 2.5;
    float alpha  = glow * pulse * uOpacity;
    gl_FragColor = vec4(col, alpha);
  }
`;

const ORBIT_VERT = `
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_Position  = projectionMatrix * mv;
    gl_PointSize = 120.0 / -mv.z;
  }
`;

const ORBIT_FRAG = `
  uniform vec3  uColor;
  uniform float uOpacity;
  void main() {
    float d = length(gl_PointCoord - vec2(0.5));
    if (d > 0.5) discard;
    float a = smoothstep(0.5, 0.0, d);
    gl_FragColor = vec4(uColor, a * uOpacity * 0.6);
  }
`;

const DUST_VERT = `
  uniform float uTime;
  attribute float aSpeed;
  attribute float aPhase;
  varying float vAlpha;
  void main() {
    vec3 pos = position;
    pos.x += sin(uTime * aSpeed * 0.3 + aPhase) * 0.15;
    pos.y += cos(uTime * aSpeed * 0.25 + aPhase) * 0.15;
    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_Position  = projectionMatrix * mv;
    gl_PointSize = 80.0 / -mv.z;
    vAlpha = 0.5 + 0.5 * sin(uTime * aSpeed + aPhase);
  }
`;

const DUST_FRAG = `
  uniform vec3  uColor;
  uniform float uOpacity;
  varying float vAlpha;
  void main() {
    float d = length(gl_PointCoord - vec2(0.5));
    if (d > 0.5) discard;
    float a = smoothstep(0.5, 0.05, d);
    gl_FragColor = vec4(uColor, a * vAlpha * uOpacity * 0.5);
  }
`;

// ═══ SCENE COMPONENTS ══════════════════════════════════════════════════════════

function VolumetricBg({ isDark }) {
  const { size } = useThree();

  useEffect(() => { bgU.uResolution.value.set(size.width, size.height); }, [size]);
  useEffect(() => { bgU.uIsDark.value = isDark ? 1 : 0; }, [isDark]);

  useFrame((state) => {
    bgU.uTime.value = state.clock.getElapsedTime();
    bgU.uMouse.value.lerp(state.pointer, 0.06);
  });

  return (
    <mesh>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        vertexShader={BG_VERT}
        fragmentShader={BG_FRAG}
        uniforms={bgU}
        depthWrite={false}
        depthTest={false}
      />
    </mesh>
  );
}

// ─── Signature 3D Object: Neural Crystal ────────────────────────────────────
function NeuralCrystal({ isDark }) {
  const groupRef    = useRef(null);
  const outerRef    = useRef(null);
  const innerRef    = useRef(null);
  const orbitGeoRef = useRef(null);

  useEffect(() => {
    crystalInnerU.uColor.value.set(isDark ? 0xffffff : 0x2a2a2a);
  }, [isDark]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const ptr  = state.pointer;

    // ── Entrance animation ──────────────────────────────────────────────────
    const entrance = easeOutQuart(Math.min(1, time / 1.5));
    const scrollFade = Math.max(0, 1 - scrollProgress * 1.5);
    const opacity = entrance * scrollFade;

    // ── Uniforms ────────────────────────────────────────────────────────────
    const pointerDist = Math.sqrt(ptr.x * ptr.x + ptr.y * ptr.y);
    const glowAmount  = (1 - Math.min(1, pointerDist)) * 0.5;

    crystalOuterU.uTime.value    = time;
    crystalOuterU.uOpacity.value = opacity;
    crystalOuterU.uGlow.value    = glowAmount;

    crystalInnerU.uTime.value    = time;
    crystalInnerU.uOpacity.value = opacity * 0.7;
    crystalInnerU.uGlow.value    = glowAmount * 0.5;

    coreU.uTime.value    = time;
    coreU.uOpacity.value = opacity;

    orbitU.uOpacity.value = opacity * 0.8;

    // ── Group transforms ────────────────────────────────────────────────────
    if (groupRef.current) {
      const s = entrance * (1 - scrollProgress * 0.3);
      groupRef.current.scale.setScalar(s);
      groupRef.current.position.y = -scrollProgress * 4;
      groupRef.current.position.z = -scrollProgress * 3;
    }

    // ── Rotate shells ───────────────────────────────────────────────────────
    if (outerRef.current) {
      outerRef.current.rotation.x = time * 0.12 + ptr.y * 0.8;
      outerRef.current.rotation.y = time * 0.18 + ptr.x * 0.8;
    }
    if (innerRef.current) {
      innerRef.current.rotation.x = -time * 0.22 + ptr.y * 0.5;
      innerRef.current.rotation.y = -time * 0.15 - ptr.x * 0.5;
      innerRef.current.rotation.z = time * 0.08;
    }

    // ── Orbit particles ─────────────────────────────────────────────────────
    for (let i = 0; i < ORBIT_COUNT; i++) {
      const angle = orbitOffsets[i] + time * orbitSpeeds[i];
      const r     = orbitRadii[i];
      orbitPos[i * 3]     = Math.cos(angle) * r;
      orbitPos[i * 3 + 1] = orbitYOffsets[i] + Math.sin(time * 0.5 + orbitOffsets[i]) * 0.2;
      orbitPos[i * 3 + 2] = Math.sin(angle) * r;
    }
    if (orbitGeoRef.current) {
      orbitGeoRef.current.attributes.position.needsUpdate = true;
    }
  });

  return (
    <group ref={groupRef} position={[3, 0.2, 0]}>
      {/* Outer icosahedron — fresnel edge-glow */}
      <mesh ref={outerRef}>
        <icosahedronGeometry args={[2.2, 1]} />
        <shaderMaterial
          vertexShader={CRYSTAL_VERT}
          fragmentShader={FRESNEL_FRAG}
          uniforms={crystalOuterU}
          transparent
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Inner octahedron — wireframe structure */}
      <mesh ref={innerRef}>
        <octahedronGeometry args={[1.3]} />
        <shaderMaterial
          vertexShader={CRYSTAL_VERT}
          fragmentShader={FRESNEL_FRAG}
          uniforms={crystalInnerU}
          transparent
          depthWrite={false}
          wireframe
        />
      </mesh>

      {/* Glowing core */}
      <mesh>
        <sphereGeometry args={[0.35, 20, 20]} />
        <shaderMaterial
          vertexShader={CRYSTAL_VERT}
          fragmentShader={CORE_FRAG}
          uniforms={coreU}
          transparent
          depthWrite={false}
        />
      </mesh>

      {/* Orbiting particle ring (tilted) */}
      <group rotation={[0.3, 0, 0.15]}>
        <points>
          <bufferGeometry
            ref={(g) => {
              if (!g || orbitGeoRef.current === g) return;
              orbitGeoRef.current = g;
              g.setAttribute('position', new THREE.BufferAttribute(orbitPos, 3));
            }}
          />
          <shaderMaterial
            vertexShader={ORBIT_VERT}
            fragmentShader={ORBIT_FRAG}
            uniforms={orbitU}
            transparent
            depthWrite={false}
          />
        </points>
      </group>
    </group>
  );
}

// ─── Ambient Dust Field ─────────────────────────────────────────────────────
function DustField({ isDark }) {
  useEffect(() => { dustU.uColor.value.set(isDark ? 0xffffff : 0x1c1c1c); }, [isDark]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    dustU.uTime.value = time;
    const entrance = Math.min(1, time / 2.0);
    const scrollFade = Math.max(0, 1 - scrollProgress * 2);
    dustU.uOpacity.value = entrance * scrollFade;
  });

  return (
    <points>
      <bufferGeometry
        ref={(g) => {
          if (!g || g.attributes.position) return;
          g.setAttribute('position', new THREE.BufferAttribute(dustPositions, 3));
          g.setAttribute('aSpeed',   new THREE.BufferAttribute(dustSpeeds, 1));
          g.setAttribute('aPhase',   new THREE.BufferAttribute(dustPhases, 1));
        }}
      />
      <shaderMaterial
        vertexShader={DUST_VERT}
        fragmentShader={DUST_FRAG}
        uniforms={dustU}
        transparent
        depthWrite={false}
      />
    </points>
  );
}

// ─── Cinematic Camera Controller ────────────────────────────────────────────
function CameraController() {
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const ptr  = state.pointer;

    const targetX = Math.sin(time * 0.1) * 0.8 + ptr.x * 1.5;
    const targetY = Math.cos(time * 0.14) * 0.5 + ptr.y * 0.8;
    const targetZ = 8.5 + Math.sin(time * 0.06) * 0.3 + scrollProgress * 3;

    state.camera.position.x += (targetX - state.camera.position.x) * 0.04;
    state.camera.position.y += (targetY - state.camera.position.y) * 0.04;
    state.camera.position.z += (targetZ - state.camera.position.z) * 0.04;

    state.camera.lookAt(1.0 + ptr.x * 0.5, ptr.y * 0.3, 0);
  });

  return null;
}

// ═══ MAIN EXPORT ═══════════════════════════════════════════════════════════════
export default function Background3D() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const check = () => setIsDark(document.documentElement.classList.contains('dark'));
    check();
    const obs = new MutationObserver(check);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const onScroll = () => {
      scrollProgress = Math.min(1, window.scrollY / window.innerHeight);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: -20, pointerEvents: 'none' }}>
      <Canvas
        camera={{ position: [0, 0, 8.5], fov: 55 }}
        gl={{ alpha: false, antialias: true, powerPreference: 'high-performance' }}
        style={{ width: '100%', height: '100%', display: 'block' }}
        dpr={[1, 1.5]}
        performance={{ min: 0.6 }}
        frameloop="always"
      >
        <VolumetricBg isDark={isDark} />
        <NeuralCrystal isDark={isDark} />
        <DustField isDark={isDark} />
        <CameraController />
      </Canvas>
    </div>
  );
}
