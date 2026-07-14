import { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, PerspectiveCamera } from '@react-three/drei';
import HeroScene from './scenes/HeroScene';

export default function SceneManager() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Calculate generic scroll progress (0 to 1 based on first few viewports)
  const vh = typeof window !== 'undefined' ? window.innerHeight : 900;
  const scrollProgress = Math.min(1, Math.max(0, scrollY / (vh * 1.5)));

  return (
    <div className="fixed inset-0 pointer-events-none z-[-20] bg-black">
      <Canvas dpr={[1, 2]} gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}>
        <color attach="background" args={['#050505']} />
        
        <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={35} />
        
        {/* Cinematic Lighting Setup - No ambient light, highly directional */}
        <directionalLight 
          position={[5, 5, 2]} 
          intensity={2.5} 
          color="#ffffff" 
          castShadow
        />
        
        {/* Soft rim light for contouring */}
        <directionalLight 
          position={[-5, 5, -5]} 
          intensity={1.5} 
          color="#a0c0ff" 
        />

        {/* Deep background fill */}
        <pointLight position={[0, -5, -5]} intensity={0.5} color="#4060ff" />
        
        {/* Environment map for realistic glass refractions */}
        <Environment preset="city" />

        {/* Global Scenes driven by scroll progress */}
        <HeroScene scrollProgress={scrollProgress} />
        
      </Canvas>
    </div>
  );
}
