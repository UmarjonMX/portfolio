/**
 * The ambient background field — one fullscreen quad, one fragment shader.
 *
 * This used to be a Three.js scene: `SceneManager` mounted a `<Canvas>` from
 * `@react-three/fiber` with a `<PerspectiveCamera>` from `@react-three/drei`, and
 * `AmbientMesh` rendered a single 2×2 plane through it. That cost 876 KB of
 * JavaScript (234 KB gzipped) — by far the heaviest payload on the site — for a
 * shader that never touches the scene graph, the camera, the lights or a single
 * texture. The vertex stage writes straight to clip space:
 *
 *     gl_Position = vec4(position.xy, 1.0, 1.0);
 *
 * so the camera was never consulted, and three's geometry, material and matrix
 * systems were being driven only to throw their results away.
 *
 * What is left is ~120 lines of WebGL that draw the same pixels. The whole
 * background layer is now 4 KB gzipped instead of 234 KB, and `three`,
 * `@react-three/fiber` and `@react-three/drei` are no longer dependencies.
 *
 * Two behaviours carried over deliberately:
 *
 *   · Every failure mode (no WebGL, context creation refused, shader compile
 *     error, context loss) resolves to the same outcome the old
 *     `SceneErrorBoundary` gave: remove the background and leave the page
 *     intact. `body` paints the theme colour, so the site stays legible.
 *   · `prefers-reduced-motion` freezes the time uniform, so the field renders
 *     a still frame instead of a moving one.
 *
 * It is also drawn a second time, with `veil`, as a 176px strip pinned to the
 * top of the viewport: the surface the fixed Navbar and the pinned chapter
 * capsule sit on. That copy is cropped from the same shader rather than tinted
 * with a sampled colour, so it stays identical to the field when the field
 * drifts with time, pointer or scroll.
 */
import { useEffect, useRef, useState } from 'react';
import { usePrefersReducedMotion } from '../scroll/ScrollStage';

const VERTEX_SHADER = /* glsl */ `
  attribute vec2 aPosition;
  varying vec2 vUv;
  void main() {
    vUv = aPosition * 0.5 + 0.5;
    gl_Position = vec4(aPosition, 1.0, 1.0); // Fullscreen clip-space quad
  }
`;

const FRAGMENT_SHADER = /* glsl */ `
  precision highp float;

  uniform float uTime;
  uniform float uScroll;
  uniform vec2 uPointer;
  uniform int uIsDark;
  // Maps this canvas's vUv back into full-viewport uv. Both are identity for
  // the background quad; for the top veil — a short canvas that shows only the
  // top of the field — they crop to that band so its pixels are the same
  // pixels the background would have drawn there.
  uniform vec2 uUvScale;
  uniform vec2 uUvOffset;

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
    // Where this pixel sits on the viewport. For the background quad this is
    // vUv itself; the top veil is a short canvas pinned to the top of the
    // viewport, so it remaps its own vUv onto the same screen position. Every
    // term below reads screenUv: the radial structure is a function of screen
    // position, so using the cropped vUv there would shift the vignette and the
    // accent pool and the copy would no longer match the field it covers.
    vec2 screenUv = vUv * uUvScale + uUvOffset;

    // Subtle pointer interaction (soft 1.1% offset on desktop)
    vec2 uv = screenUv;
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

    // CONTRAST NORMALISATION — the 4-octave fBm naturally occupies only
    // ~0.10–0.49, so gates tuned to a 0–1 assumption collapse the palette into
    // a few flat levels. Stretch the field's real range across the full unit
    // interval, then apply a gentle S-curve for organic falloff.
    float field = clamp((combined - 0.10) / 0.39, 0.0, 1.0);
    field = field * field * (3.0 - 2.0 * field);

    // Radial centre calm — the centre stays clean so the hero type reads
    float distFromCenter = length(screenUv - vec2(0.5, 0.45));
    float vignette = smoothstep(0.18, 1.00, distFromCenter);
    float centerCalm = 1.0 - smoothstep(0.0, 0.52, distFromCenter);

    // Soft, restrained environmental warmth — broad and gentle in the upper-right,
    // never a tight glowing blob.
    float accentRadial = smoothstep(1.15, 0.15, length((screenUv - vec2(0.72, 0.26)) * vec2(0.85, 1.25)));
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

    // Atmospheric edges carry more structure than the reading centre
    float edgePresence = 0.55 + 0.45 * vignette;

    vec3 color;

    if (uIsDark == 1) {
      // DARK MODE ARCHITECTURAL PALETTE — deep graphite through warm mineral
      // stone. No neon, no glow blobs.
      vec3 base09     = vec3(0.024, 0.028, 0.034); // deepest graphite
      vec3 graphite11 = vec3(0.041, 0.048, 0.063);
      vec3 graphite15 = vec3(0.056, 0.064, 0.081);
      vec3 graphite1B = vec3(0.072, 0.082, 0.102);
      vec3 mineral    = vec3(0.104, 0.113, 0.132); // warm stone highlight
      vec3 warmAccent = vec3(0.878, 0.478, 0.369); // #E07A5F, restrained

      color = mix(base09, graphite11, smoothstep(0.0, 0.55, field) * edgePresence);
      color = mix(color, graphite15, smoothstep(0.38, 1.0, field) * 0.80 * edgePresence);
      color = mix(color, graphite1B, smoothstep(0.62, 1.0, field) * 0.90);
      color = mix(color, mineral, smoothstep(0.82, 1.0, field) * 0.85);

      color = mix(color, warmAccent, accentPool * 0.15 * scrollWarmth);
      color = mix(color, base09 * 0.80, vignette * 0.20);   // corner framing
      color = mix(color, graphite11, centerCalm * 0.28);    // hero legibility
    } else {
      // LIGHT MODE ARCHITECTURAL PALETTE — warm paper through soft stone.
      // Editorial, never washed-out white.
      vec3 paperBase  = vec3(0.984, 0.980, 0.969);
      vec3 stoneEAE   = vec3(0.958, 0.947, 0.930);
      vec3 stoneE4D   = vec3(0.934, 0.918, 0.896);
      vec3 stoneDeep  = vec3(0.903, 0.882, 0.856);
      vec3 warmBlush  = vec3(0.878, 0.478, 0.369); // #E07A5F, delicate tint

      color = mix(paperBase, stoneEAE, smoothstep(0.0, 0.55, field) * edgePresence);
      color = mix(color, stoneE4D, smoothstep(0.38, 1.0, field) * 0.85 * edgePresence);
      color = mix(color, stoneDeep, smoothstep(0.62, 1.0, field) * 0.95);

      color = mix(color, warmBlush, accentPool * 0.085 * scrollWarmth);
      color = mix(color, stoneDeep * 0.99, vignette * 0.14);
      color = mix(color, paperBase, centerCalm * 0.24);
    }

    gl_FragColor = vec4(color, 1.0);
  }
`;

/** Exponential smoothing, frame-rate independent. Matches MathUtils.damp. */
function damp(current, target, lambda, dt) {
  return current + (target - current) * (1 - Math.exp(-lambda * dt));
}

function compile(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(shader);
    gl.deleteShader(shader);
    return { shader: null, log };
  }
  return { shader, log: null };
}

export default function AmbientField({ isDarkMode, veil = false }) {
  const canvasRef = useRef(null);
  const wrapRef = useRef(null);
  const glRef = useRef(null);
  const darkUniformRef = useRef(null);
  const paintedRef = useRef(false);
  const [painted, setPainted] = useState(false);
  const reduced = usePrefersReducedMotion();

  // Theme is a single uniform. Flipping it must not tear down and rebuild the
  // whole GL context, so it is pushed from its own effect below.
  useEffect(() => {
    const gl = glRef.current;
    const loc = darkUniformRef.current;
    if (gl && loc) gl.uniform1i(loc, isDarkMode ? 1 : 0);
  }, [isDarkMode]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    // Every failure resolves to "no background". For the veil that has to be
    // literal: an empty 176px strip would still paint its grain, so the whole
    // wrapper is removed (not just the canvas).
    const hide = () => {
      canvas.remove();
      if (wrapRef.current) wrapRef.current.hidden = true;
    };

    const gl =
      canvas.getContext('webgl', {
        alpha: false,
        antialias: false,
        depth: false,
        stencil: false,
        powerPreference: 'high-performance',
      }) ||
      canvas.getContext('experimental-webgl');

    if (!gl) {
      // No WebGL: leave the background off. `body` paints the theme colour.
      hide();
      return undefined;
    }

    const vs = compile(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
    if (!vs.shader || !fs.shader) {
      if (vs.shader) gl.deleteShader(vs.shader);
      if (fs.shader) gl.deleteShader(fs.shader);
      console.warn('AmbientField: shader compilation failed', vs.log || fs.log);
      hide();
      return undefined;
    }

    const program = gl.createProgram();
    gl.attachShader(program, vs.shader);
    gl.attachShader(program, fs.shader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.warn('AmbientField: program link failed', gl.getProgramInfoLog(program));
      hide();
      return undefined;
    }
    gl.deleteShader(vs.shader);
    gl.deleteShader(fs.shader);
    gl.useProgram(program);

    // One clip-space triangle strip covering NDC: two triangles, no matrices.
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW
    );
    const aPosition = gl.getAttribLocation(program, 'aPosition');
    gl.enableVertexAttribArray(aPosition);
    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);

    const u = {
      time: gl.getUniformLocation(program, 'uTime'),
      scroll: gl.getUniformLocation(program, 'uScroll'),
      pointer: gl.getUniformLocation(program, 'uPointer'),
      isDark: gl.getUniformLocation(program, 'uIsDark'),
      uvScale: gl.getUniformLocation(program, 'uUvScale'),
      uvOffset: gl.getUniformLocation(program, 'uUvOffset'),
    };
    gl.uniform1i(u.isDark, isDarkMode ? 1 : 0);
    // Identity unless this is the veil; set explicitly because a vec2 uniform
    // otherwise defaults to (0, 0), which would collapse the whole field.
    gl.uniform2f(u.uvScale, 1, 1);
    gl.uniform2f(u.uvOffset, 0, 0);
    glRef.current = gl;
    darkUniformRef.current = u.isDark;

    let width = 0;
    let height = 0;
    const resize = () => {
      // The veil is a crop of the same field, so its canvas maps onto the top
      // `clientHeight / innerHeight` of the viewport. This is recomputed on
      // every frame because the viewport height moves when a mobile URL bar
      // collapses, without a window resize.
      if (veil) {
        const sy = Math.min(
          1,
          Math.max(canvas.clientHeight, 1) / (window.innerHeight || 1)
        );
        gl.uniform2f(u.uvScale, 1, sy);
        gl.uniform2f(u.uvOffset, 0, 1 - sy);
      }
      // Cap the backing store at 1.5× DPR: this is a smooth, low-frequency
      // field, so the extra samples are invisible and cost real fill rate.
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const w = Math.max(1, Math.round(canvas.clientWidth * dpr));
      const h = Math.max(1, Math.round(canvas.clientHeight * dpr));
      if (w === width && h === height) return;
      width = w;
      height = h;
      canvas.width = w;
      canvas.height = h;
      gl.viewport(0, 0, w, h);
    };

    const scroll = { y: 0, target: 0 };
    const onScroll = () => {
      // Read the shared scroll MotionValue rather than window.scrollY, so the
      // background follows the same source of truth as the rest of the page.
      scroll.target = window.scrollY / (window.innerHeight || 1);
    };
    const onPointer = (e) => {
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    const pointer = { x: 0, y: 0 };
    const coarsePointer =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(hover: none)').matches;

    // Context loss is recoverable: stop the loop, wait for restore, resume.
    let lost = false;
    const onLost = (e) => {
      e.preventDefault();
      lost = true;
    };
    const onRestored = () => {
      lost = false;
      resize();
    };

    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('orientationchange', resize);
    window.addEventListener('scroll', onScroll, { passive: true });
    if (!coarsePointer) window.addEventListener('pointermove', onPointer, { passive: true });
    canvas.addEventListener('webglcontextlost', onLost);
    canvas.addEventListener('webglcontextrestored', onRestored);

    // A page nobody is looking at should not be rendering the background.
    const onVisibility = () => {
      if (document.hidden) running = false;
      else if (!running) {
        running = true;
        last = performance.now();
        raf = requestAnimationFrame(frame);
      }
    };

    let raf = 0;
    let running = !document.hidden;
    let last = performance.now();
    const start = last;
    let px = 0;
    let py = 0;

    const frame = (now) => {
      if (lost) return;
      if (!running) {
        raf = requestAnimationFrame(frame);
        return;
      }
      const dt = Math.min((now - last) / 1000, 0.1);
      last = now;

      resize();
      gl.uniform1f(u.time, reduced ? 0 : (now - start) / 1000);
      scroll.y = damp(scroll.y, scroll.target, 2.5, dt);
      gl.uniform1f(u.scroll, scroll.y);

      if (coarsePointer) {
        px = damp(px, 0, 2, dt);
        py = damp(py, 0, 2, dt);
      } else {
        px = damp(px, pointer.x, 2.0, dt);
        py = damp(py, pointer.y, 2.0, dt);
      }
      gl.uniform2f(u.pointer, px, py);

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      // A WebGL canvas that has not drawn yet is opaque black (the context is
      // created with `alpha: false`), so the veil stays hidden until its first
      // real frame. The frame behind it is the full-viewport field at the same
      // coordinates, so revealing it changes no pixel.
      if (!paintedRef.current) {
        paintedRef.current = true;
        setPainted(true);
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('orientationchange', resize);
      window.removeEventListener('scroll', onScroll);
      if (!coarsePointer) window.removeEventListener('pointermove', onPointer);
      window.removeEventListener('visibilitychange', onVisibility);
      canvas.removeEventListener('webglcontextlost', onLost);
      canvas.removeEventListener('webglcontextrestored', onRestored);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      glRef.current = null;
      darkUniformRef.current = null;
    };
    // `isDarkMode` is deliberately not a dependency: it is pushed through the
    // effect above as a single uniform, so a theme toggle costs one int write
    // rather than a context rebuild.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced]);

  return (
    <div
      ref={wrapRef}
      aria-hidden="true"
      className={veil ? 'ambient-veil' : 'fixed inset-0 pointer-events-none'}
      style={
        veil
          ? {
              // Above the sections, below the chapter capsule (z-66) and the
              // Navbar (z-70). Hidden until the first frame has drawn.
              zIndex: 65,
              visibility: painted ? 'visible' : 'hidden',
            }
          : { zIndex: -1 }
      }
    >
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
}