import { useMemo, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function AmbientSynapse() {
  const groupRef = useRef(null);
  const pointsRef = useRef(null);
  const linesRef = useRef(null);

  // Configuration
  const nodeCount = 85;
  const maxLines = 450;
  
  // Custom Canvas Texture for a soft, out-of-focus bokeh dot glow
  const dotTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.2, 'rgba(255, 255, 255, 0.8)');
    gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.25)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 64, 64);
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    return texture;
  }, []);

  // Initialize nodes with random positions, drift speeds, phases, and colors
  const nodes = useMemo(() => {
    const list = [];
    for (let i = 0; i < nodeCount; i++) {
      list.push({
        x: (Math.random() - 0.5) * 35,
        y: (Math.random() - 0.5) * 25,
        z: (Math.random() - 0.5) * 18 - 8,
        baseX: 0,
        baseY: 0,
        baseZ: 0,
        speedX: 0.05 + Math.random() * 0.1,
        speedY: 0.05 + Math.random() * 0.1,
        phase: Math.random() * Math.PI * 2,
        colorType: Math.random() > 0.45 ? 'teal' : 'cream'
      });
      list[i].baseX = list[i].x;
      list[i].baseY = list[i].y;
      list[i].baseZ = list[i].z;
    }
    return list;
  }, []);

  // Pre-allocate buffer arrays to avoid garbage collection and GPU re-allocations
  const pointsPositions = useMemo(() => new Float32Array(nodeCount * 3), []);
  const pointsColors = useMemo(() => {
    const colors = new Float32Array(nodeCount * 3);
    for (let i = 0; i < nodeCount; i++) {
      const isTeal = nodes[i].colorType === 'teal';
      // Muted mint-teal: [0.35, 0.78, 0.62]
      // Soft warm cream: [0.93, 0.90, 0.82]
      colors[i * 3] = isTeal ? 0.35 : 0.93;
      colors[i * 3 + 1] = isTeal ? 0.78 : 0.90;
      colors[i * 3 + 2] = isTeal ? 0.62 : 0.82;
    }
    return colors;
  }, [nodes]);

  const linePositions = useMemo(() => new Float32Array(maxLines * 2 * 3), []);
  const lineColors = useMemo(() => new Float32Array(maxLines * 2 * 3), []);

  // Modern Timer instance
  const timer = useMemo(() => new THREE.Timer(), []);
  useEffect(() => {
    timer.connect(document);
    return () => timer.dispose();
  }, [timer]);

  // Track scroll position passively to prevent layout reflows inside the useFrame loop
  const scrollYRef = useRef(0);
  useEffect(() => {
    scrollYRef.current = window.scrollY;
    const handleScroll = () => {
      scrollYRef.current = window.scrollY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const mouse3D = useMemo(() => new THREE.Vector3(), []);
  const tempPos = useMemo(() => new THREE.Vector3(), []);

  useFrame((state) => {
    if (!groupRef.current || !pointsRef.current || !linesRef.current) return;
    
    timer.update();
    const time = timer.getElapsed();

    // Map 2D pointer coordinates to 3D space targets based on viewport dimensions
    mouse3D.set(
      (state.pointer.x * state.viewport.width) / 2,
      (state.pointer.y * state.viewport.height) / 2,
      -5
    );

    const positions = pointsRef.current.geometry.attributes.position.array;

    // 1. Update node coordinates
    for (let i = 0; i < nodeCount; i++) {
      const node = nodes[i];
      
      // Gentle floating drift
      const driftX = Math.sin(time * node.speedX + node.phase) * 1.5;
      const driftY = Math.cos(time * node.speedY + node.phase) * 1.5;
      
      let targetX = node.baseX + driftX;
      let targetY = node.baseY + driftY;
      let targetZ = node.baseZ;

      // Damped cursor attraction (thoughts drift towards attention)
      tempPos.set(targetX, targetY, targetZ);
      const distToMouse = tempPos.distanceTo(mouse3D);
      if (distToMouse < 9) {
        const pull = (9 - distToMouse) * 0.02; // Very soft attraction pull
        targetX = THREE.MathUtils.lerp(targetX, mouse3D.x, pull);
        targetY = THREE.MathUtils.lerp(targetY, mouse3D.y, pull);
      }

      // Smooth interpolation for physical lag
      positions[i * 3] = THREE.MathUtils.lerp(positions[i * 3] || targetX, targetX, 0.05);
      positions[i * 3 + 1] = THREE.MathUtils.lerp(positions[i * 3 + 1] || targetY, targetY, 0.05);
      positions[i * 3 + 2] = THREE.MathUtils.lerp(positions[i * 3 + 2] || targetZ, targetZ, 0.05);
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true;

    // 2. Build line segments dynamically (fade colors out based on distance)
    let lineIdx = 0;
    
    // Background color components: dark charcoal slate [0.04, 0.04, 0.05]
    const bgR = 0.04;
    const bgG = 0.04;
    const bgB = 0.05;
    
    // Line highlight color components: soft mint teal [0.22, 0.65, 0.52]
    const activeR = 0.22;
    const activeG = 0.65;
    const activeB = 0.52;

    for (let i = 0; i < nodeCount; i++) {
      const px = positions[i * 3];
      const py = positions[i * 3 + 1];
      const pz = positions[i * 3 + 2];
      
      for (let j = i + 1; j < nodeCount; j++) {
        if (lineIdx >= maxLines) break;
        
        const qx = positions[j * 3];
        const qy = positions[j * 3 + 1];
        const qz = positions[j * 3 + 2];
        
        const dx = px - qx;
        const dy = py - qy;
        const dz = pz - qz;
        const distSq = dx * dx + dy * dy + dz * dz;
        
        // Connect nodes within a maximum distance threshold of 7 units
        if (distSq < 49) {
          const dist = Math.sqrt(distSq);
          const alpha = Math.max(0, Math.min(1, 1.0 - dist / 7));
          
          // Blend with background color to simulate distance-fade
          const r = activeR * alpha + bgR * (1 - alpha);
          const g = activeG * alpha + bgG * (1 - alpha);
          const b = activeB * alpha + bgB * (1 - alpha);
          
          // Point A
          const idx1 = lineIdx * 2 * 3;
          linePositions[idx1] = px;
          linePositions[idx1 + 1] = py;
          linePositions[idx1 + 2] = pz;
          lineColors[idx1] = r;
          lineColors[idx1 + 1] = g;
          lineColors[idx1 + 2] = b;
          
          // Point B
          const idx2 = (lineIdx * 2 + 1) * 3;
          linePositions[idx2] = qx;
          linePositions[idx2 + 1] = qy;
          linePositions[idx2 + 2] = qz;
          lineColors[idx2] = r;
          lineColors[idx2 + 1] = g;
          lineColors[idx2 + 2] = b;
          
          lineIdx++;
        }
      }
    }

    linesRef.current.geometry.attributes.position.needsUpdate = true;
    linesRef.current.geometry.attributes.color.needsUpdate = true;
    linesRef.current.geometry.setDrawRange(0, lineIdx * 2);

    // 3. Scroll depth shift
    const targetY = scrollYRef.current * 0.0015;
    groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetY, 0.08);

    // 4. Subtle camera coordinate tilt (perspective rotation)
    const targetRotX = state.pointer.y * -0.06;
    const targetRotY = state.pointer.x * 0.06;
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRotX, 0.04);
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotY, 0.04);

    // 5. Breathing scale cycle (15-second loop, freq = 0.4 rad/s)
    const breath = 1.0 + Math.sin(time * 0.4) * 0.035;
    groupRef.current.scale.set(breath, breath, breath);
  });

  return (
    <group ref={groupRef}>
      {/* Neural thoughts */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={nodeCount}
            array={pointsPositions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={nodeCount}
            array={pointsColors}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={1.3}
          map={dotTexture}
          vertexColors={true}
          transparent={true}
          opacity={0.3}
          sizeAttenuation={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Filament connection segments */}
      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={maxLines * 2}
            array={linePositions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={maxLines * 2}
            array={lineColors}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial vertexColors={true} transparent={true} opacity={0.2} depthWrite={false} />
      </lineSegments>
    </group>
  );
}

export default function Background3D() {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: -20, pointerEvents: 'none' }}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 60 }}
        gl={{ alpha: true, antialias: true }}
        style={{ width: '100%', height: '100%', display: 'block' }}
        dpr={[1, 1.5]}
        performance={{ min: 0.6 }}
      >
        <ambientLight intensity={0.5} />
        <AmbientSynapse />
      </Canvas>
    </div>
  );
}
