import { useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const ACCENT_COLOR = new THREE.Color('#E07A5F');

function easeOutQuart(t) { return 1 - Math.pow(1 - t, 4); }

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

function NeuralCrystal({ isDark, scrollY }) {
  const groupRef    = useRef(null);
  const outerRef    = useRef(null);
  const innerRef    = useRef(null);

  useEffect(() => {
    crystalInnerU.uColor.value.set(isDark ? 0xffffff : 0x2a2a2a);
  }, [isDark]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const ptr  = state.pointer;
    const vh = window.innerHeight;
    const scrollProgress = Math.min(1, scrollY / (vh * 0.8));

    const entrance = easeOutQuart(Math.min(1, time / 1.5));
    const scrollFade = Math.max(0, 1 - scrollProgress * 1.5);
    const opacity = entrance * scrollFade;

    const pointerDist = Math.sqrt(ptr.x * ptr.x + ptr.y * ptr.y);
    const glowAmount  = (1 - Math.min(1, pointerDist)) * 0.5;

    crystalOuterU.uTime.value    = time;
    crystalOuterU.uOpacity.value = opacity;
    crystalOuterU.uGlow.value    = glowAmount;

    crystalInnerU.uTime.value    = time;
    crystalInnerU.uOpacity.value = opacity * 0.7;
    crystalInnerU.uGlow.value    = glowAmount * 0.5;

    if (groupRef.current) {
      const s = entrance * (1 - scrollProgress * 0.3);
      groupRef.current.scale.setScalar(s);
      groupRef.current.position.y = -scrollProgress * 2;
    }

    if (outerRef.current) {
      outerRef.current.rotation.x = time * 0.12 + ptr.y * 0.5;
      outerRef.current.rotation.y = time * 0.18 + ptr.x * 0.5;
    }
    if (innerRef.current) {
      innerRef.current.rotation.x = -time * 0.22 + ptr.y * 0.3;
      innerRef.current.rotation.y = -time * 0.15 - ptr.x * 0.3;
      innerRef.current.rotation.z = time * 0.08;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      <mesh ref={outerRef}>
        <icosahedronGeometry args={[2.5, 1]} />
        <shaderMaterial
          vertexShader={CRYSTAL_VERT}
          fragmentShader={FRESNEL_FRAG}
          uniforms={crystalOuterU}
          transparent
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh ref={innerRef}>
        <octahedronGeometry args={[1.5]} />
        <shaderMaterial
          vertexShader={CRYSTAL_VERT}
          fragmentShader={FRESNEL_FRAG}
          uniforms={crystalInnerU}
          transparent
          depthWrite={false}
          wireframe
        />
      </mesh>
    </group>
  );
}

export default function HeroCanvas({ isDark, scrollY }) {
  return (
    <div className="w-full h-[300px] lg:h-[600px] xl:h-[700px] z-0 pointer-events-auto">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 50 }}
        gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
        style={{ width: '100%', height: '100%', display: 'block' }}
        dpr={[1, 1.5]}
      >
        <ambientLight intensity={0.5} />
        <NeuralCrystal isDark={isDark} scrollY={scrollY} />
      </Canvas>
    </div>
  );
}
