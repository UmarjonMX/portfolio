import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { MeshTransmissionMaterial } from '@react-three/drei';
import * as THREE from 'three';

function EngineeredSculpture({ scrollProgress, isDarkMode }) {
  const groupRef = useRef();
  const coreRef = useRef();
  const ringRef = useRef();
  const outerRingRef = useRef();
  
  useFrame((state, delta) => {
    const time = state.clock.elapsedTime;
    
    if (groupRef.current) {
      const easeProgress = Math.pow(scrollProgress, 1.5);
      
      // Sink back and down slightly on scroll to support typography
      // Base Z moved deeper (-2.5) and scale reduced (0.75) so it never overlaps BUILDS
      const targetZ = -2.5 - easeProgress * 4.0; 
      const targetY = -0.5 - easeProgress * 1.5; 
      const targetScale = 0.75 - easeProgress * 0.2;
      
      groupRef.current.position.z = THREE.MathUtils.damp(groupRef.current.position.z, targetZ, 3, delta);
      groupRef.current.position.y = THREE.MathUtils.damp(groupRef.current.position.y, targetY, 3, delta);
      groupRef.current.scale.setScalar(THREE.MathUtils.damp(groupRef.current.scale.x, Math.max(0.4, targetScale), 3, delta));
    }
    
    if (coreRef.current) {
      coreRef.current.rotation.y = time * 0.08;
      coreRef.current.rotation.x = time * 0.05;
    }
    
    if (ringRef.current) {
      ringRef.current.rotation.x = -time * 0.04;
      ringRef.current.rotation.y = time * 0.06;
    }

    if (outerRingRef.current) {
      outerRingRef.current.rotation.z = time * 0.03;
      outerRingRef.current.rotation.x = time * 0.05;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Central Faceted Engineered Core */}
      <mesh ref={coreRef}>
        <icosahedronGeometry args={[2.0, 0]} />
        {isDarkMode ? (
          <meshPhysicalMaterial 
            color="#050505" 
            metalness={1.0} 
            roughness={0.12}
            clearcoat={1.0}
            clearcoatRoughness={0.1}
            envMapIntensity={2.5}
            flatShading={true}
          />
        ) : (
          <MeshTransmissionMaterial 
            color="#fcfcfc"
            transmission={0.9}
            thickness={1.0}
            roughness={0.18}
            ior={1.4}
            clearcoat={1.0}
            clearcoatRoughness={0.1}
            envMapIntensity={1.5}
            flatShading={true}
          />
        )}
      </mesh>
      
      {/* Minimal Intersecting Structural Rings */}
      <mesh ref={ringRef} rotation={[Math.PI/4, 0, 0]}>
        <torusGeometry args={[2.6, 0.015, 16, 100]} />
        {isDarkMode ? (
          <meshStandardMaterial color="#E07A5F" emissive="#E07A5F" emissiveIntensity={0.2} metalness={0.8} roughness={0.2} />
        ) : (
          <meshStandardMaterial color="#E07A5F" metalness={0.5} roughness={0.5} />
        )}
      </mesh>

      <mesh ref={outerRingRef} rotation={[-Math.PI/6, Math.PI/3, 0]}>
        <torusGeometry args={[3.2, 0.008, 16, 100]} />
        {isDarkMode ? (
          <meshStandardMaterial color="#FAFAFA" emissive="#FAFAFA" emissiveIntensity={0.1} transparent opacity={0.3} />
        ) : (
          <meshStandardMaterial color="#1C1C1C" transparent opacity={0.15} />
        )}
      </mesh>
    </group>
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
      // Light follows cursor closely
      pointLightRef.current.position.x = ptr.x * 5;
      pointLightRef.current.position.y = ptr.y * 5;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      <EngineeredSculpture scrollProgress={scrollProgress} isDarkMode={isDarkMode} />

      {/* Interactive Cursor Light (Provides the orange reflections) */}
      <pointLight 
        ref={pointLightRef}
        position={[0, 0, 3]} 
        intensity={isDarkMode ? 1.5 : 0.8} 
        color="#E07A5F" 
        distance={8}
      />
    </group>
  );
}
