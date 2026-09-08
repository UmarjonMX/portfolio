import { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, PerspectiveCamera } from '@react-three/drei';
import HeroScene from './scenes/HeroScene';
import AmbientMesh from './scenes/AmbientMesh';

export default function SceneManager({ isDarkMode }) {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Calculate generic scroll progress relative to viewport height
  const vh = typeof window !== 'undefined' ? window.innerHeight : 900;
  // Let progress go beyond 1.0 to support continuous transitions
  const scrollProgress = Math.max(0, scrollY / vh);

  return (
    /* Fixed behind everything — the AmbientMesh shader IS the background */
    <div className="fixed inset-0 pointer-events-none" style={{ zIndex: -1 }}>
      <Canvas
        dpr={[1, 1.5]}
        gl={{
          antialias: true,
          alpha: false,          /* opaque — mesh drives ALL background color */
          powerPreference: "high-performance",
        }}
      >
        
        <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={30} />
        
        {/* Cinematic Lighting Setup */}
        <directionalLight 
          position={[5, 5, 2]} 
          intensity={isDarkMode ? 2.5 : 4.0} 
          color="#ffffff" 
        />
        
        {/* Soft rim light for contouring */}
        <directionalLight 
          position={[-5, 5, -5]} 
          intensity={isDarkMode ? 1.5 : 2.5} 
          color={isDarkMode ? "#a0c0ff" : "#ffeedd"} 
        />

        {/* Deep background fill */}
        <pointLight 
          position={[0, -5, -5]} 
          intensity={isDarkMode ? 0.4 : 0.8} 
          color={isDarkMode ? "#4060ff" : "#ffccaa"} 
        />

        {/* Warm accent fill for shaping */}
        <pointLight
          position={[3, 2, 4]}
          intensity={isDarkMode ? 0.6 : 0.5}
          color={isDarkMode ? "#E07A5F" : "#ffd4b8"}
        />
        
        <Environment preset={isDarkMode ? "city" : "studio"} />

        <AmbientMesh scrollProgress={scrollProgress} isDarkMode={isDarkMode} />
        <HeroScene scrollProgress={scrollProgress} isDarkMode={isDarkMode} />
        
      </Canvas>
    </div>
  );
}
