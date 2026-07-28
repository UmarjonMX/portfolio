import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { MeshTransmissionMaterial, Edges } from '@react-three/drei';
import * as THREE from 'three';

function KineticRing({ radius, tube, speed, scrollProgress, isDarkMode, axis = 'x', offset = 0 }) {
  const meshRef = useRef();

  useFrame((state, delta) => {
    const time = state.clock.elapsedTime;
    
    if (meshRef.current) {
      // Base rotation
      if (axis === 'x') meshRef.current.rotation.x = time * speed;
      if (axis === 'y') meshRef.current.rotation.y = time * speed;
      if (axis === 'z') meshRef.current.rotation.z = time * speed;

      // Deconstruct on scroll
      const easeProgress = Math.pow(scrollProgress, 1.5);
      
      const targetZ = offset * easeProgress * 5.0; // expand outward
      const targetScale = 1.0 + easeProgress * 1.5;
      
      meshRef.current.position.z = THREE.MathUtils.damp(meshRef.current.position.z, targetZ, 4, delta);
      meshRef.current.scale.setScalar(THREE.MathUtils.damp(meshRef.current.scale.x, targetScale, 4, delta));
    }
  });

  return (
    <mesh ref={meshRef}>
      <torusGeometry args={[radius, tube, 64, 100]} />
      {isDarkMode ? (
        <meshStandardMaterial 
          color="#111111" 
          metalness={0.9} 
          roughness={0.2}
          emissive="#a0c0ff"
          emissiveIntensity={0.05}
          transparent
          opacity={0.2}
        />
      ) : (
        <MeshTransmissionMaterial 
          color="#ffffff"
          transmission={0.8}
          thickness={0.1}
          roughness={0.1}
          ior={1.2}
          transparent
          opacity={0.2}
        />
      )}
    </mesh>
  );
}

function WireframeShell({ scrollProgress, isDarkMode }) {
  const meshRef = useRef();

  useFrame((state, delta) => {
    const time = state.clock.elapsedTime;
    if (meshRef.current) {
      meshRef.current.rotation.y = time * 0.05;
      meshRef.current.rotation.x = time * 0.025;
      
      const easeProgress = Math.pow(scrollProgress, 1.5);
      const targetScale = 1.0 + easeProgress * 2.0;
      meshRef.current.scale.setScalar(THREE.MathUtils.damp(meshRef.current.scale.x, targetScale, 3, delta));
      
      // Move up slightly on scroll
      const targetY = easeProgress * 2.0;
      meshRef.current.position.y = THREE.MathUtils.damp(meshRef.current.position.y, targetY, 3, delta);
    }
  });

  return (
    <mesh ref={meshRef}>
      <icosahedronGeometry args={[2.5, 1]} />
      <meshBasicMaterial color="transparent" opacity={0} transparent />
      <Edges 
        linewidth={1} 
        threshold={15} 
        color={isDarkMode ? "#FAFAFA" : "#1C1C1C"} 
        transparent 
        opacity={0.10} 
      />
    </mesh>
  );
}

function CentralCore({ scrollProgress, isDarkMode }) {
  const meshRef = useRef();
  
  useFrame((state, delta) => {
    const time = state.clock.elapsedTime;
    if (meshRef.current) {
      meshRef.current.rotation.y = -time * 0.1;
      meshRef.current.rotation.z = time * 0.05;
      
      const easeProgress = Math.pow(scrollProgress, 1.5);
      // Core drops down and shrinks slightly on scroll
      const targetY = -easeProgress * 3.0;
      const targetScale = 1.0 - easeProgress * 0.5;
      
      meshRef.current.position.y = THREE.MathUtils.damp(meshRef.current.position.y, targetY, 4, delta);
      meshRef.current.scale.setScalar(THREE.MathUtils.damp(meshRef.current.scale.x, Math.max(0.1, targetScale), 4, delta));
    }
  });

  return (
    <mesh ref={meshRef}>
      <torusKnotGeometry args={[0.9, 0.3, 128, 32]} />
      {isDarkMode ? (
        <meshPhysicalMaterial 
          color="#050505" 
          metalness={1.0} 
          roughness={0.1}
          clearcoat={1.0}
          clearcoatRoughness={0.1}
          envMapIntensity={2.5}
        />
      ) : (
        <meshPhysicalMaterial 
          color="#222222" 
          metalness={0.9} 
          roughness={0.2}
          clearcoat={1.0}
          envMapIntensity={2.0}
        />
      )}
    </mesh>
  );
}

export default function HeroScene({ scrollProgress, isDarkMode }) {
  const groupRef = useRef();
  const pointLightRef = useRef();

  useFrame((state, delta) => {
    const ptr = state.pointer;

    // Smooth inertia for mouse interaction
    const targetRotX = ptr.y * 0.05;
    const targetRotY = ptr.x * 0.1;

    if (groupRef.current) {
      // Damped rotation for physical weight
      groupRef.current.rotation.x = THREE.MathUtils.damp(groupRef.current.rotation.x, targetRotX, 3, delta);
      groupRef.current.rotation.y = THREE.MathUtils.damp(groupRef.current.rotation.y, targetRotY, 3, delta);
      
      // Camera zoom-out cinematic effect on scroll
      state.camera.position.z = THREE.MathUtils.damp(
        state.camera.position.z,
        8 + scrollProgress * 5.0,
        2,
        delta
      );
      
      // Camera pan
      state.camera.position.x = THREE.MathUtils.damp(
        state.camera.position.x,
        scrollProgress * 2.0,
        2,
        delta
      );
    }
    
    if (pointLightRef.current) {
      pointLightRef.current.position.x = ptr.x * 4;
      pointLightRef.current.position.y = ptr.y * 4;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      
      <WireframeShell scrollProgress={scrollProgress} isDarkMode={isDarkMode} />
      
      <CentralCore scrollProgress={scrollProgress} isDarkMode={isDarkMode} />

      <KineticRing radius={1.6} tube={0.02} speed={0.4} scrollProgress={scrollProgress} isDarkMode={isDarkMode} axis="x" offset={1} />
      <KineticRing radius={1.8} tube={0.015} speed={0.3} scrollProgress={scrollProgress} isDarkMode={isDarkMode} axis="y" offset={-1} />
      <KineticRing radius={2.0} tube={0.01} speed={0.2} scrollProgress={scrollProgress} isDarkMode={isDarkMode} axis="z" offset={2} />

      {/* Interactive Cursor Light */}
      <pointLight 
        ref={pointLightRef}
        position={[0, 0, 2]} 
        intensity={isDarkMode ? 1.0 : 0.5} 
        color="#E07A5F" 
        distance={6}
      />
    </group>
  );
}
