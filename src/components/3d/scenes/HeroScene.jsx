import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { MeshTransmissionMaterial, Float, Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

const DUST_COUNT = 150;

export default function HeroScene({ scrollProgress }) {
  const outerRef = useRef();
  const innerRef = useRef();
  const dustRef = useRef();

  // Create dust particles once
  const [dustPositions] = useState(() => {
    const pos = new Float32Array(DUST_COUNT * 3);
    for (let i = 0; i < DUST_COUNT; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10 - 2;
    }
    return pos;
  });

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const ptr = state.pointer;

    // Outer Glass rotation and morphing based on scroll
    if (outerRef.current) {
      outerRef.current.rotation.y = time * 0.15 + ptr.x * 0.5;
      outerRef.current.rotation.x = time * 0.1 + ptr.y * 0.5;
      // Morph scale and position based on scroll progress to transition out of hero
      outerRef.current.scale.setScalar(1 + scrollProgress * 0.5);
      outerRef.current.position.y = -scrollProgress * 4;
      outerRef.current.position.z = scrollProgress * 2;
    }

    // Inner neural structure counter-rotation
    if (innerRef.current) {
      innerRef.current.rotation.y = -time * 0.2 - ptr.x * 0.3;
      innerRef.current.rotation.x = -time * 0.15 - ptr.y * 0.3;
    }

    // Floating dust movement
    if (dustRef.current) {
      dustRef.current.rotation.y = time * 0.05;
      dustRef.current.position.y = Math.sin(time * 0.2) * 0.5;
    }
  });

  return (
    <group position={[3.5, 0, 0]}>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
        {/* Outer Glass Shell */}
        <mesh ref={outerRef}>
          <icosahedronGeometry args={[2.8, 1]} />
          <MeshTransmissionMaterial
            backside
            samples={4}
            thickness={2}
            chromaticAberration={0.8}
            anisotropy={0.3}
            distortion={0.5}
            distortionScale={0.5}
            temporalDistortion={0.2}
            color="#ffffff"
            transmission={1}
            roughness={0.1}
            clearcoat={1}
          />
        </mesh>

        {/* Inner Neural Wireframe */}
        <mesh ref={innerRef}>
          <octahedronGeometry args={[1.6, 2]} />
          <meshPhysicalMaterial
            color="#E07A5F"
            emissive="#E07A5F"
            emissiveIntensity={2}
            wireframe
            transparent
            opacity={0.8}
          />
        </mesh>

        {/* Energy Core Light */}
        <pointLight color="#E07A5F" intensity={50} distance={10} decay={2} />
      </Float>

      {/* Ambient Dust Field */}
      <Points ref={dustRef} positions={dustPositions} stride={3}>
        <PointMaterial
          transparent
          color="#ffffff"
          size={0.05}
          sizeAttenuation={true}
          depthWrite={false}
          opacity={0.4}
        />
      </Points>
    </group>
  );
}
