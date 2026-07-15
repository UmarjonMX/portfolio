import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { MeshTransmissionMaterial, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

// A single module in the inner core
function CoreModule({ position, size, emissive, seed, targetY, easeProgress }) {
  const meshRef = useRef();
  const materialRef = useRef();

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();
    const ptr = state.pointer;
    
    // Breathing light and energy pulses
    if (emissive && materialRef.current) {
      const breathe = 1.0 + Math.sin(time * 2.0 + seed * 10) * 0.5;
      const pulsePhase = (time * 0.8 + seed * 2.0) % 1.0;
      const pulse = pulsePhase < 0.05 ? 3.0 : 0.0;
      materialRef.current.emissiveIntensity = breathe + pulse;
    }

    if (meshRef.current) {
      // Base opened position
      const tY = position[1] + (targetY - position[1]) * easeProgress;
      
      // Mouse influence on geometry
      const dx = position[0] - ptr.x * 1.5;
      const dy = position[1] - ptr.y * 1.5;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const repel = Math.max(0, 1 - dist) * 0.1;
      
      const targetPosX = position[0] + (dx * repel);
      const targetPosY = tY + (dy * repel);
      
      meshRef.current.position.x = THREE.MathUtils.damp(meshRef.current.position.x, targetPosX, 4, delta);
      meshRef.current.position.y = THREE.MathUtils.damp(meshRef.current.position.y, targetPosY, 4, delta);
      
      // Subtle independent rotation
      meshRef.current.rotation.x = Math.sin(time * 0.5 + seed * 5) * 0.1;
      meshRef.current.rotation.y = Math.cos(time * 0.6 + seed * 5) * 0.1;
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <boxGeometry args={size} />
      <meshPhysicalMaterial 
        ref={materialRef}
        color="#111111" 
        metalness={0.9} 
        roughness={0.1}
        emissive={emissive ? "#a0c0ff" : "#000000"}
        emissiveIntensity={emissive ? 2 : 0}
      />
    </mesh>
  );
}

export default function HeroScene({ scrollProgress }) {
  const groupRef = useRef();
  const leftShellRef = useRef();
  const rightShellRef = useRef();
  const coreRef = useRef();
  const pointLightRef = useRef();

  // Create an array of core modules to form an architectural framework
  const [modules] = useState(() => {
    const mods = [];
    const rows = 8;
    const cols = 4;
    for(let r = 0; r < rows; r++) {
      for(let c = 0; c < cols; c++) {
        const x = (c - cols / 2 + 0.5) * 0.4;
        const y = (r - rows / 2 + 0.5) * 0.48;
        const isEmissive = Math.random() > 0.85;
        mods.push({
          key: `mod-${r}-${c}`,
          pos: [x, y, 0],
          size: [0.35, 0.43, 0.8],
          emissive: isEmissive,
          targetY: y + (Math.random() - 0.5) * 2.0, // Y-axis expansion target
          seed: Math.random() // Unique seed for offset animations
        });
      }
    }
    return mods;
  });

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();
    const ptr = state.pointer;

    // Smooth inertia for mouse interaction
    const targetRotX = ptr.y * 0.2;
    const targetRotY = ptr.x * 0.4;

    if (groupRef.current) {
      // Damped rotation for physical weight
      groupRef.current.rotation.x = THREE.MathUtils.damp(groupRef.current.rotation.x, targetRotX, 3, delta);
      groupRef.current.rotation.y = THREE.MathUtils.damp(groupRef.current.rotation.y, targetRotY, 3, delta);
      
      // Gentle breathing
      const breath = Math.sin(time * 0.8) * 0.05;
      groupRef.current.position.y = THREE.MathUtils.damp(
        groupRef.current.position.y,
        breath - scrollProgress * 0.5,
        2, 
        delta
      );
      
      // Camera zoom-in cinematic effect
      state.camera.position.z = THREE.MathUtils.damp(
        state.camera.position.z,
        10 - scrollProgress * 3.5,
        2,
        delta
      );
      
      // Camera pan
      state.camera.position.x = THREE.MathUtils.damp(
        state.camera.position.x,
        scrollProgress * 1.5,
        2,
        delta
      );
    }

    // Scroll-driven scene transformation
    // Eased scroll progress
    const easeProgress = Math.pow(scrollProgress, 1.5);

    if (leftShellRef.current && rightShellRef.current) {
      const splitAmount = easeProgress * 1.5;
      leftShellRef.current.position.x = THREE.MathUtils.damp(leftShellRef.current.position.x, -0.75 - splitAmount, 4, delta);
      rightShellRef.current.position.x = THREE.MathUtils.damp(rightShellRef.current.position.x, 0.75 + splitAmount, 4, delta);
    }

    if (coreRef.current) {
      // The core rotates slightly to show complexity when opened
      coreRef.current.rotation.y = THREE.MathUtils.damp(
        coreRef.current.rotation.y,
        easeProgress * Math.PI * 0.15,
        3, 
        delta
      );
    }
    
    if (pointLightRef.current) {
      pointLightRef.current.position.x = ptr.x * 3;
      pointLightRef.current.position.y = ptr.y * 3;
    }
  });

  return (
    <group ref={groupRef} position={[3.5, 0, 0]}>
      {/* Outer Frosted Shell */}
      <group>
        <RoundedBox ref={leftShellRef} args={[1.5, 4.5, 1.2]} radius={0.15} smoothness={4} position={[-0.75, 0, 0]}>
          <MeshTransmissionMaterial
            backside
            samples={4}
            thickness={2}
            chromaticAberration={0.8}
            anisotropy={0.1}
            distortion={0.1}
            distortionScale={0.1}
            temporalDistortion={0.0}
            color="#ffffff"
            transmission={1}
            roughness={0.25}
            clearcoat={1}
          />
        </RoundedBox>
        <RoundedBox ref={rightShellRef} args={[1.5, 4.5, 1.2]} radius={0.15} smoothness={4} position={[0.75, 0, 0]}>
          <MeshTransmissionMaterial
            backside
            samples={4}
            thickness={2}
            chromaticAberration={0.8}
            anisotropy={0.1}
            distortion={0.1}
            distortionScale={0.1}
            temporalDistortion={0.0}
            color="#ffffff"
            transmission={1}
            roughness={0.25}
            clearcoat={1}
          />
        </RoundedBox>
      </group>

      {/* Inner Engineered Core */}
      <group ref={coreRef}>
        {modules.map(mod => (
          <CoreModule 
            key={mod.key} 
            position={mod.pos} 
            size={mod.size} 
            emissive={mod.emissive}
            seed={mod.seed}
            targetY={mod.targetY}
            easeProgress={Math.pow(scrollProgress, 1.5)}
          />
        ))}
      </group>
      
      {/* Interactive Cursor Light */}
      <pointLight 
        ref={pointLightRef}
        position={[0, 0, 1.5]} 
        intensity={0.5} 
        color="#ffffff" 
        distance={4}
      />
    </group>
  );
}
