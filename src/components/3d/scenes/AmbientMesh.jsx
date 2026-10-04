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
    // Subtle pointer interaction (soft 1.1% offset on desktop)
    vec2 uv = vUv;
    uv += uPointer * 0.011;

    // Slow, continuous movement (~20–28 second visual cycles)
    float t = uTime * 0.014;

    // Subtle parallax shift on scroll
    uv.y += uScroll * 0.12;

    // Organic atmospheric fields drifting across each other.
    // Lower spatial frequency keeps the structure large, smooth and stone-like.
    float field1 = fbm(uv * 1.15 + vec2(t * 0.6, -t * 0.4));
    float field2 = fbm(uv * 1.70 - vec2(t * 0.3, t * 0.5) + vec2(4.1, 2.3));

    float combined = field1 * 0.65 + field2 * 0.35;

    // ── CONTRAST NORMALISATION ────────────────────────────────────────────
    // The 4-octave fBm naturally occupies only ~0.10–0.49, so gates tuned to a
    // 0–1 assumption collapsed the whole palette into a few flat levels.
    // Stretch the field's real range across the full unit interval, then apply a
    // gentle S-curve for organic falloff. Same noise, full tonal separation.
    float field = clamp((combined - 0.10) / 0.39, 0.0, 1.0);
    field = field * field * (3.0 - 2.0 * field);

    // Radial center calm — center around UMAR and 3D sculpture stays clean and calm
    float distFromCenter = length(vUv - vec2(0.5, 0.45));
    float vignette = smoothstep(0.18, 1.00, distFromCenter);
    float centerCalm = 1.0 - smoothstep(0.0, 0.52, distFromCenter);

    // Soft, restrained environmental warmth — broad and gentle in the upper-right,
    // never a tight glowing blob. Away from UMAR and the center 3D sculpture.
    float accentRadial = smoothstep(1.15, 0.15, length((vUv - vec2(0.72, 0.26)) * vec2(0.85, 1.25)));
    float accentPool = accentRadial * (0.45 + 0.55 * field);

    // Section-aware scroll warmth modulation:
    // Hero: richer warmth · Projects/About: calmer graphite · Contact: gentle warm return
    float scrollWarmth = 1.0;
    if (uScroll < 1.0) {
      scrollWarmth = mix(1.0, 0.55, smoothstep(0.0, 1.0, uScroll));
    } else if (uScroll < 2.0) {
      scrollWarmth = mix(0.55, 0.45, smoothstep(1.0, 2.0, uScroll));
    } else {
      scrollWarmth = mix(0.45, 0.65, smoothstep(2.0, 3.2, uScroll));
    }

    // Atmospheric edges carry more structure than the reading center
    float edgePresence = 0.55 + 0.45 * vignette;

    vec3 color;

    if (uIsDark == 1) {
      // ─── DARK MODE ARCHITECTURAL PALETTE ────────────────────────────────
      // Deep graphite base through warm mineral stone — no neon, no glow blobs
      vec3 base09     = vec3(0.024, 0.028, 0.034); // deepest graphite
      vec3 graphite11 = vec3(0.041, 0.048, 0.063);
      vec3 graphite15 = vec3(0.056, 0.064, 0.081);
      vec3 graphite1B = vec3(0.072, 0.082, 0.102);
      vec3 mineral    = vec3(0.104, 0.113, 0.132); // warm stone highlight
      // Warm terracotta: #E07A5F (restrained)
      vec3 warmAccent = vec3(0.878, 0.478, 0.369);

      // Stacked graphite terrain — each stop gated on the normalised field
      color = mix(base09, graphite11, smoothstep(0.0, 0.55, field) * edgePresence);
      color = mix(color, graphite15, smoothstep(0.38, 1.0, field) * 0.80 * edgePresence);
      color = mix(color, graphite1B, smoothstep(0.62, 1.0, field) * 0.90);
      color = mix(color, mineral, smoothstep(0.82, 1.0, field) * 0.85);

      // Restrained environmental warmth (reads near-monochrome, reveals warmth slowly)
      color = mix(color, warmAccent, accentPool * 0.15 * scrollWarmth);

      // Gentle corner vignette — atmospheric framing, not a black crush
      color = mix(color, base09 * 0.80, vignette * 0.20);

      // Center settles back toward graphite11 to keep UMAR legible
      color = mix(color, graphite11, centerCalm * 0.28);

    } else {
      // ─── LIGHT MODE ARCHITECTURAL PALETTE ───────────────────────────────
      // Warm paper base through soft stone — editorial, never washed-out white
      vec3 paperBase  = vec3(0.984, 0.980, 0.969);
      vec3 stoneEAE   = vec3(0.958, 0.947, 0.930);
      vec3 stoneE4D   = vec3(0.934, 0.918, 0.896);
      vec3 stoneDeep  = vec3(0.903, 0.882, 0.856);
      // Warm blush: #E07A5F (delicate tint)
      vec3 warmBlush  = vec3(0.878, 0.478, 0.369);

      // Soft stone paper field with real tonal separation
      color = mix(paperBase, stoneEAE, smoothstep(0.0, 0.55, field) * edgePresence);
      color = mix(color, stoneE4D, smoothstep(0.38, 1.0, field) * 0.85 * edgePresence);
      color = mix(color, stoneDeep, smoothstep(0.62, 1.0, field) * 0.95);

      // Extremely subtle warm environmental blush on upper right
      color = mix(color, warmBlush, accentPool * 0.085 * scrollWarmth);

      // Gentle edge grounding
      color = mix(color, stoneDeep * 0.99, vignette * 0.14);

      // Center returns to clean paper for maximum text contrast
      color = mix(color, paperBase, centerCalm * 0.24);
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
