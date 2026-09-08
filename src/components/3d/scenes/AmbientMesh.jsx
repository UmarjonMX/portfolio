import { useRef, useMemo, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const vertexShader = /* glsl */`
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 1.0, 1.0); // Fullscreen clip-space quad
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
    f = f * f * (3.0 - 2.0 * f); // Hermite smoothstep curve
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
    // Subtle pointer interaction (soft 1-1.5% offset on desktop)
    vec2 uv = vUv;
    uv += uPointer * 0.015;
    
    // Extremely slow, continuous movement (25–35 second visual cycles)
    float t = uTime * 0.010;
    
    // Subtle parallax shift on scroll
    uv.y += uScroll * 0.12;

    // Organic atmospheric fields drifting across each other
    float field1 = fbm(uv * 1.3 + vec2(t * 0.6, -t * 0.4));
    float field2 = fbm(uv * 1.9 - vec2(t * 0.3, t * 0.5) + vec2(4.1, 2.3));
    
    float combined = field1 * 0.65 + field2 * 0.35;
    
    // Radial center calm — center around UMAR and 3D sculpture stays clean and calm
    float distFromCenter = length(vUv - vec2(0.5, 0.45));
    float vignette = smoothstep(0.15, 0.95, distFromCenter);
    float centerCalm = 1.0 - smoothstep(0.0, 0.55, distFromCenter);
    
    // Soft, restrained environmental warmth situated in the upper-right corner area
    // Away from UMAR and the center 3D sculpture
    float accentRadial = smoothstep(0.85, 0.2, length(vUv - vec2(0.82, 0.22)));
    float accentPool = accentRadial * (0.4 + 0.6 * field1);
    
    // Section-aware scroll warmth modulation:
    // Hero (scroll 0.0): richer warmth (1.0)
    // Projects (scroll 1.0): cleaner, calmer graphite (0.35)
    // About (scroll 2.0): neutral (0.25)
    // Contact (scroll 3.0+): gentle warm return (0.55)
    float scrollWarmth = 1.0;
    if (uScroll < 1.0) {
      scrollWarmth = mix(1.0, 0.35, smoothstep(0.0, 1.0, uScroll));
    } else if (uScroll < 2.0) {
      scrollWarmth = mix(0.35, 0.25, smoothstep(1.0, 2.0, uScroll));
    } else {
      scrollWarmth = mix(0.25, 0.55, smoothstep(2.0, 3.2, uScroll));
    }

    vec3 color;

    if (uIsDark == 1) {
      // ─── DARK MODE ARCHITECTURAL PALETTE ────────────────────────────────
      // Base: #090A0C
      vec3 base09     = vec3(0.035, 0.039, 0.047); 
      // Graphite shades: #11141A, #15181E, #1B1F26
      vec3 graphite11 = vec3(0.067, 0.078, 0.102); 
      vec3 graphite15 = vec3(0.082, 0.094, 0.118); 
      vec3 graphite1B = vec3(0.106, 0.122, 0.149); 
      // Warm terracotta: #E07A5F (restrained)
      vec3 warmAccent = vec3(0.878, 0.478, 0.369); 

      // Primary graphite terrain driven by smooth noise
      color = mix(base09, graphite11, smoothstep(0.2, 0.8, combined));
      
      // Subtle depth contours toward upper corners
      color = mix(color, graphite15, smoothstep(0.4, 0.85, combined) * 0.5);
      
      // Center remains calm (kept close to base/graphite11, no bright glow behind UMAR)
      color = mix(color, graphite1B, centerCalm * 0.15 * smoothstep(0.3, 0.7, combined));
      
      // Restrained upper-right environmental warmth (looks monochrome at first, reveals warmth gradually)
      color = mix(color, warmAccent, accentPool * 0.065 * scrollWarmth);
      
      // Deep corner vignette
      color = mix(color, base09 * 0.7, vignette * 0.4);

    } else {
      // ─── LIGHT MODE ARCHITECTURAL PALETTE ───────────────────────────────
      // Base: #F7F5F1 (warm paper)
      vec3 paperBase  = vec3(0.968, 0.961, 0.945); 
      // Stone shades: #EAE5DF, #E4DED7
      vec3 stoneEAE   = vec3(0.918, 0.898, 0.875); 
      vec3 stoneE4D   = vec3(0.894, 0.871, 0.843); 
      // Warm blush: #E07A5F (delicate tint)
      vec3 warmBlush  = vec3(0.878, 0.478, 0.369); 

      // Soft stone paper field
      color = mix(paperBase, stoneEAE, smoothstep(0.2, 0.8, combined));
      
      // Architectural depth contours
      color = mix(color, stoneE4D, smoothstep(0.45, 0.85, combined) * 0.4);
      
      // Center remains clean paper
      color = mix(color, paperBase, centerCalm * 0.25);
      
      // Extremely subtle warm environmental blush on upper right
      color = mix(color, warmBlush, accentPool * 0.038 * scrollWarmth);
      
      // Gentle edge grounding
      color = mix(color, stoneEAE * 0.97, vignette * 0.25);
    }

    gl_FragColor = vec4(color, 1.0);
  }
`;

export default function AmbientMesh({ scrollProgress, isDarkMode }) {
  const materialRef = useRef();

  const [isMobile] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 768 || ('ontouchstart' in window);
    }
    return false;
  });

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

    if (!isMobile) {
      u.uPointer.value.x = THREE.MathUtils.damp(u.uPointer.value.x, state.pointer.x, 2.0, delta);
      u.uPointer.value.y = THREE.MathUtils.damp(u.uPointer.value.y, state.pointer.y, 2.0, delta);
    } else {
      u.uPointer.value.set(0, 0);
    }
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
