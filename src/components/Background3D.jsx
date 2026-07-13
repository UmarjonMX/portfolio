import { useMemo, useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function DraftingTable() {
  const groupRef = useRef(null);
  const ringsRef = useRef(null);
  const meshRef = useRef(null);
  const meshInnerRef = useRef(null);

  // Check if dark mode is active
  const [isDark, setIsDark] = useState(false);
  useEffect(() => {
    const checkDark = () => {
      setIsDark(document.documentElement.classList.contains('dark'));
    };
    checkDark();
    const observer = new MutationObserver(checkDark);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  // Concentric compass drafting rings
  const ringsGeometry = useMemo(() => {
    const points = [];
    const ringCount = 3;
    const segments = 80;
    for (let r = 0; r < ringCount; r++) {
      const radius = 2.0 + r * 1.0;
      for (let i = 0; i < segments; i++) {
        const theta = (i / segments) * Math.PI * 2;
        const nextTheta = ((i + 1) / segments) * Math.PI * 2;
        // Segment start
        points.push(new THREE.Vector3(Math.cos(theta) * radius, 0, Math.sin(theta) * radius));
        // Segment end
        points.push(new THREE.Vector3(Math.cos(nextTheta) * radius, 0, Math.sin(nextTheta) * radius));
      }
    }
    return new THREE.BufferGeometry().setFromPoints(points);
  }, []);

  // Track scroll position passively to adjust cameras
  const scrollPercentRef = useRef(0);
  useEffect(() => {
    const handleScroll = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      scrollPercentRef.current = maxScroll > 0 ? window.scrollY / maxScroll : 0;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Temporary vectors to avoid allocation overhead in useFrame
  const targetCam = useMemo(() => new THREE.Vector3(), []);
  const targetLookAt = useMemo(() => new THREE.Vector3(), []);
  const tempCam = useMemo(() => new THREE.Vector3(), []);
  const tempLook = useMemo(() => new THREE.Vector3(1.6, -0.2, 0), []);

  useFrame((state) => {
    if (!groupRef.current) return;

    const time = state.clock.getElapsedTime();
    const sp = scrollPercentRef.current;

    // 1. Rotate the blueprint structures like a rotating mechanical template
    if (meshRef.current) {
      meshRef.current.rotation.x = time * 0.08;
      meshRef.current.rotation.y = time * 0.12;
    }
    if (meshInnerRef.current) {
      meshInnerRef.current.rotation.y = -time * 0.15;
      meshInnerRef.current.rotation.z = time * 0.06;
    }

    // 2. Spline interpolation for camera positions and focus points
    if (sp <= 0.25) {
      // Hero (Side layout view looking at right-aligned drafting structure) -> About (Axonometric center view)
      const t = sp / 0.25;
      targetCam.set(
        THREE.MathUtils.lerp(1.5, 2.2, t),
        THREE.MathUtils.lerp(3.2, 4.0, t),
        THREE.MathUtils.lerp(3.5, 4.0, t)
      );
      targetLookAt.set(
        THREE.MathUtils.lerp(1.6, 0, t),
        THREE.MathUtils.lerp(-0.2, 0, t),
        0
      );
    } else if (sp <= 0.6) {
      // About -> Projects (Lateral slide looking up at structural grid)
      const t = (sp - 0.25) / 0.35;
      targetCam.set(
        THREE.MathUtils.lerp(2.2, -4.5, t),
        THREE.MathUtils.lerp(4.0, 1.8, t),
        THREE.MathUtils.lerp(4.0, 5.0, t)
      );
      targetLookAt.set(0, -0.6, 0);
    } else if (sp <= 0.85) {
      // Projects -> Dashboard (Side profile elevation chart)
      const t = (sp - 0.6) / 0.25;
      targetCam.set(
        THREE.MathUtils.lerp(-4.5, 5.5, t),
        THREE.MathUtils.lerp(1.8, 0.8, t),
        THREE.MathUtils.lerp(5.0, 3.8, t)
      );
      targetLookAt.set(0, -0.4, 0);
    } else {
      // Dashboard -> Footer (Close dolly zooming down onto blueprint sheet)
      const t = (sp - 0.85) / 0.15;
      targetCam.set(
        THREE.MathUtils.lerp(5.5, 0, t),
        THREE.MathUtils.lerp(0.8, 0.3, t),
        THREE.MathUtils.lerp(3.8, 1.4, t)
      );
      targetLookAt.set(0, 0, -1);
    }

    // Dynamic cursor mouse sway for three-dimensional blueprint parallax depth
    const mouseOffsetX = state.pointer.x * 0.9;
    const mouseOffsetY = state.pointer.y * 0.7;

    tempCam.set(targetCam.x + mouseOffsetX, targetCam.y + mouseOffsetY, targetCam.z);
    state.camera.position.lerp(tempCam, 0.05);

    // Smooth focus lerp
    tempLook.lerp(targetLookAt, 0.05);
    state.camera.lookAt(tempLook);
  });

  const accentColor = '#E07A5F';
  const structuralColor = isDark ? '#FFFFFF' : '#1C1C1C';
  const gridColor = isDark ? '#333333' : '#E0E0E0';

  return (
    <group ref={groupRef}>
      {/* Blueprint Grid Floor (Divisions aligned at 1 unit blocks) */}
      <gridHelper args={[80, 80, accentColor, gridColor]} rotation={[0, 0, 0]} position={[0, -1.5, 0]} />

      {/* Dynamic compass drafting rings shifted right to fit Hero V2 layout */}
      <lineSegments ref={ringsRef} geometry={ringsGeometry} position={[1.6, -1.48, 0]}>
        <lineBasicMaterial 
          color={structuralColor} 
          transparent={true} 
          opacity={isDark ? 0.06 : 0.1} 
        />
      </lineSegments>

      {/* Primary Drafting Construction Wireframes shifted right to fit Hero V2 layout */}
      <group position={[1.6, 0, 0]}>
        {/* Outer frame (Terracotta grid box) */}
        <mesh ref={meshRef}>
          <boxGeometry args={[2.5, 2.5, 2.5]} />
          <meshBasicMaterial 
            wireframe={true} 
            color={accentColor} 
            transparent={true} 
            opacity={isDark ? 0.25 : 0.4} 
          />
        </mesh>

        {/* Inner frame (Rotated structure) */}
        <mesh ref={meshInnerRef}>
          <octahedronGeometry args={[1.5]} />
          <meshBasicMaterial 
            wireframe={true} 
            color={structuralColor} 
            transparent={true} 
            opacity={isDark ? 0.15 : 0.25} 
          />
        </mesh>
      </group>
    </group>
  );
}

export default function Background3D() {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: -20, pointerEvents: 'none' }}>
      <Canvas
        camera={{ position: [1.5, 3.2, 3.5], fov: 60 }}
        gl={{ alpha: true, antialias: true }}
        style={{ width: '100%', height: '100%', display: 'block' }}
        dpr={[1, 1.5]}
        performance={{ min: 0.6 }}
      >
        <DraftingTable />
      </Canvas>
    </div>
  );
}
