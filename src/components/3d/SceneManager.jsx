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
    <div className="fixed inset-0 pointer-events-none z-[-20] bg-gradient-to-b from-background to-card-bg dark:from-background-dark dark:to-card-bg-dark">
      <Canvas dpr={[1, 2]} gl={{ antialias: true, alpha: true }}>
        <PerspectiveCamera makeDefault position={[0, 0, 8.5]} fov={50} />
        
        {/* Soft studio lighting setup */}
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <directionalLight position={[-10, -10, -5]} intensity={0.5} color="#E07A5F" />
        
        {/* Environment map for realistic glass refractions */}
        <Environment preset="city" />

        {/* Global Scenes driven by scroll progress */}
        <HeroScene scrollProgress={scrollProgress} />
        
      </Canvas>
    </div>
  );
}
