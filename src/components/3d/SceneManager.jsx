import { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import AmbientMesh from './scenes/AmbientMesh';

/**
 * Background-only 3D layer.
 *
 * The Hero sculpture previously lived here as `HeroScene`. It was the reason
 * this file carried a camera rig, five lights and a remote HDR environment —
 * all of which existed to light a single mesh. With the sculpture gone, none of
 * that is load-bearing, so the layer is reduced to the AmbientMesh, which is a
 * raw fullscreen clip-space shader and needs neither camera, lights nor an
 * environment map.
 *
 * Dropping <Environment> also removes the only outbound network dependency
 * (the drei HDR CDN), which was the one failure that could take the entire
 * background down via SceneErrorBoundary.
 */
export default function SceneManager({ isDarkMode }) {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Generic scroll progress relative to viewport height — feeds the ambient field.
  const vh = typeof window !== 'undefined' ? window.innerHeight : 900;
  const scrollProgress = Math.max(0, scrollY / vh);

  return (
    /* Fixed behind everything — the AmbientMesh shader IS the background */
    <div className="fixed inset-0 pointer-events-none" style={{ zIndex: -1 }}>
      <Canvas
        dpr={[1, 1.5]}
        gl={{
          antialias: true,
          alpha: false, /* opaque — mesh drives ALL background color */
          powerPreference: 'high-performance',
        }}
      >
        <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={30} />

        <AmbientMesh scrollProgress={scrollProgress} isDarkMode={isDarkMode} />
      </Canvas>
    </div>
  );
}