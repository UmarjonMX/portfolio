import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { MeshTransmissionMaterial, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

// A single module in the inner core
function CoreModule({ position, size, emissive }) {
  return (
    <mesh position={position}>
      <boxGeometry args={size} />
      <meshPhysicalMaterial 
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
          targetY: y + (Math.random() - 0.5) * 2.0 // Y-axis expansion target
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
      
      // Individual modules expand/reorganize
      coreRef.current.children.forEach((child, i) => {
        const mod = modules[i];
        if (mod) {
          // As it opens, modules shift on Y axis slightly
          const targetY = mod.pos[1] + (mod.targetY - mod.pos[1]) * easeProgress;
          child.position.y = THREE.MathUtils.damp(child.position.y, targetY, 4, delta);
        }
      });
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
          />
        ))}
      </group>
    </group>
  );
}
