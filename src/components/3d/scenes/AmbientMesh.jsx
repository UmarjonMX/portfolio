import { useRef, useMemo, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const vertexShader = /* glsl */`
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 1.0, 1.0); // fullscreen clip-space quad trick
  }
`;

const fragmentShader = /* glsl */`
  uniform float uTime;
  uniform float uScroll;
  uniform vec2 uPointer;
  uniform int uIsDark;
  
  varying vec2 vUv;

  // Smooth value noise for organic atmospheric fields
  float hash(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f); // Hermite curve
    return mix(
      mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), f.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x),
      f.y
    );
  }

  // 4-octave fBm for large, elegant continuous mesh movement
  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    mat2 rot = mat2(0.8, 0.6, -0.6, 0.8);
    for (int i = 0; i < 4; i++) {
      v += a * noise(p);
      p = rot * p * 2.02 + vec2(1.7, 9.2);
      a *= 0.5;
    }
    return v;
  }

  void main() {
    // Subtle pointer interaction (soft offset)
    vec2 uv = vUv;
    uv += uPointer * 0.02;
    
    // Smooth continuous movement
    float t = uTime * 0.025;
    
    // Parallax shift on scroll
    uv.y += uScroll * 0.15;

    // Organic fields moving across each other
    float field1 = fbm(uv * 1.5 + vec2(t * 0.8, -t * 0.5));
    float field2 = fbm(uv * 2.2 - vec2(t * 0.4, t * 0.7) + vec2(3.2, 1.8));
    
    float combined = field1 * 0.65 + field2 * 0.35;
    
    // Radial vignette calculation
    float distFromCenter = length(vUv - vec2(0.5, 0.45));
    float vignette = smoothstep(0.1, 0.95, distFromCenter);
    float centerCalm = 1.0 - smoothstep(0.0, 0.6, distFromCenter);
    
    // Soft warm atmospheric glow on the upper-right side
    float accentRadial = smoothstep(0.9, 0.15, length(vUv - vec2(0.72, 0.38)));
    float accentPool = accentRadial * (0.5 + 0.5 * field1);
    
    // Scroll smoothly tones down the accent intensity as visitor scrolls down
    float scrollFade = clamp(1.0 - uScroll * 0.5, 0.15, 1.0);

    vec3 color;

    if (uIsDark == 1) {
      // ─── DARK MODE ARCHITECTURAL PALETTE ────────────────────────────────
      vec3 deepBase   = vec3(0.035, 0.039, 0.047); // #090A0C pitch charcoal corners
      vec3 meshMid    = vec3(0.075, 0.086, 0.106); // #13161B mid graphite field
      vec3 meshHigh   = vec3(0.115, 0.130, 0.157); // #1D2128 elevated slate field
      vec3 warmAccent = vec3(0.878, 0.478, 0.369); // #E07A5F terracotta warm glow

      // Base mesh gradientdriven by fBm noise
      color = mix(deepBase, meshMid, smoothstep(0.25, 0.75, combined));
      
      // Gentle center elevation (calm atmospheric center behind UMAR)
      color = mix(color, meshHigh, centerCalm * 0.25 * smoothstep(0.3, 0.7, combined));
      
      // Warm terracotta ambient pool on upper right (subtle, expensive aura)
      color = mix(color, warmAccent, accentPool * 0.12 * scrollFade);
      
      // Smooth corner vignette for depth
      color = mix(color, deepBase * 0.6, vignette * 0.45);

    } else {
      // ─── LIGHT MODE ARCHITECTURAL PALETTE ───────────────────────────────
      vec3 paperBase  = vec3(0.968, 0.961, 0.945); // #F7F5F1 warm architectural paper
      vec3 meshStone  = vec3(0.915, 0.898, 0.875); // #EAE5DF soft graphite/stone field
      vec3 meshHigh   = vec3(0.875, 0.855, 0.828); // #DFDAD3 visible depth contours
      vec3 warmAccent = vec3(0.851, 0.430, 0.322); // #D96D52 subtle warm blush

      // Smooth stone mesh field
      color = mix(paperBase, meshStone, smoothstep(0.2, 0.8, combined));
      
      // Subtle depth variation
      color = mix(color, meshHigh, centerCalm * 0.2 * smoothstep(0.4, 0.8, combined));
      
      // Delicate warm atmospheric accent pool
      color = mix(color, warmAccent, accentPool * 0.075 * scrollFade);
      
      // Soft outer edge grounding
      color = mix(color, meshStone * 0.96, vignette * 0.3);
    }

    gl_FragColor = vec4(color, 1.0);
  }
`;

export default function AmbientMesh({ scrollProgress, isDarkMode }) {
  const materialRef = useRef();

  const [prefersReducedMotion] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
    return false;
  });

  const uniforms = useMemo(() => ({
    uTime:    { value: 0.0 },
    uScroll:  { value: 0.0 },
    uPointer: { value: new THREE.Vector2(0, 0) },
    uIsDark:  { value: isDarkMode ? 1 : 0 },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }), []);

  useEffect(() => {
    if (materialRef.current) {
      materialRef.current.uniforms.uIsDark.value = isDarkMode ? 1 : 0;
    }
  }, [isDarkMode]);

  useFrame((state, delta) => {
    if (!materialRef.current) return;
    const u = materialRef.current.uniforms;

    if (!prefersReducedMotion) {
      u.uTime.value = state.clock.elapsedTime;
    }

    u.uScroll.value = THREE.MathUtils.damp(u.uScroll.value, scrollProgress, 2.5, delta);
    u.uPointer.value.x = THREE.MathUtils.damp(u.uPointer.value.x, state.pointer.x, 2.0, delta);
    u.uPointer.value.y = THREE.MathUtils.damp(u.uPointer.value.y, state.pointer.y, 2.0, delta);
  });

  return (
    <mesh position={[0, 0, 0]} frustumCulled={false}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        depthWrite={false}
        depthTest={false}
        renderOrder={-100}
      />
    </mesh>
  );
}
