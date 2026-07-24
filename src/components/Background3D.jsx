import { useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

function randRange(a, b) { return a + Math.random() * (b - a); }

const ACCENT_COLOR  = new THREE.Color('#E07A5F');
const BREATHE_SPEED = 0.28;
const DUST_COUNT    = 50;

let scrollProgress = 0;

const dustPositions = new Float32Array(DUST_COUNT * 3);
const dustSpeeds    = new Float32Array(DUST_COUNT);
const dustPhases    = new Float32Array(DUST_COUNT);
for (let i = 0; i < DUST_COUNT; i++) {
  dustPositions[i * 3]     = randRange(-12, 12);
  dustPositions[i * 3 + 1] = randRange(-7, 7);
  dustPositions[i * 3 + 2] = randRange(-5, 3);
  dustSpeeds[i]  = randRange(0.1, 0.4);
  dustPhases[i]  = randRange(0, Math.PI * 2);
}

const bgU = {
  uTime:        { value: 0 },
  uMouse:       { value: new THREE.Vector2(0, 0) },
  uResolution:  { value: new THREE.Vector2(1, 1) },
  uIsDark:      { value: 0 },
  uAccentColor: { value: ACCENT_COLOR },
};

const dustU = {
  uTime:    { value: 0 },
  uColor:   { value: new THREE.Color(1, 1, 1) },
  uOpacity: { value: 0 },
};

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

    float rays = noise(vec2(angle * 3.0 + uTime * 0.1, uTime * 0.05)) * 0.4;
    rays += noise(vec2(angle * 6.0 - uTime * 0.2,  uTime * 0.08)) * 0.3;
    rays += noise(vec2(angle * 12.0 + uTime * 0.3, uTime * 0.12)) * 0.2;
    rays += noise(vec2(angle * 24.0 - uTime * 0.4, uTime * 0.15)) * 0.1;

    float rayStr = smoothstep(3.5, 0.0, dFocal) * (0.2 + 0.8 * rays);

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
    float a = smoothstep(0.5, 0.1, d);
    gl_FragColor = vec4(uColor, a * vAlpha * uOpacity * 0.25);
  }
`;

function VolumetricBg({ isDark }) {
  const { size } = useThree();

  useEffect(() => { bgU.uResolution.value.set(size.width, size.height); }, [size]);
  useEffect(() => { bgU.uIsDark.value = isDark ? 1 : 0; }, [isDark]);

  useFrame((state) => {
    bgU.uTime.value = state.clock.elapsedTime;
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

function DustField({ isDark }) {
  useEffect(() => { dustU.uColor.value.set(isDark ? 0xffffff : 0x1c1c1c); }, [isDark]);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    dustU.uTime.value = time;
    const entrance = Math.min(1, time / 2.0);
    const scrollFade = Math.max(0, 1 - scrollProgress * 0.5);
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
        gl={{ alpha: false, antialias: true, powerPreference: 'low-power' }}
        style={{ width: '100%', height: '100%', display: 'block' }}
        dpr={[1, 1.5]}
        frameloop="always"
      >
        <VolumetricBg isDark={isDark} />
        <DustField isDark={isDark} />
      </Canvas>
    </div>
  );
}
