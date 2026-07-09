import { useMemo, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Timer } from 'three/addons/misc/Timer.js';

function StarField() {
  const groupRef = useRef(null);
  
  // Stars meshes
  const icosaMesh = useRef(null);
  const tetraMesh = useRef(null);
  const octaMesh = useRef(null);
  const sphereMesh = useRef(null);
  
  // Shooting star
  const shootingStarRef = useRef(null);
  
  // Dust particles
  const dustRef = useRef(null);
  
  const icosaGeometry = useMemo(() => new THREE.IcosahedronGeometry(0.3, 0), []);
  const tetraGeometry = useMemo(() => new THREE.TetrahedronGeometry(0.2, 0), []);
  const octaGeometry = useMemo(() => new THREE.OctahedronGeometry(0.25, 0), []);
  const sphereGeometry = useMemo(() => new THREE.SphereGeometry(0.15, 4, 4), []);
  
  const material = useMemo(() => new THREE.MeshBasicMaterial({ color: '#08CB00', wireframe: true, transparent: true, opacity: 0.3 }), []);

  const counts = { icosa: 60, tetra: 40, octa: 30, sphere: 20 };
  
  const generateData = (count) => {
    const pos = new Float32Array(count * 3);
    const rots = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
        pos[i * 3] = (Math.random() - 0.5) * 50;
        pos[i * 3 + 1] = (Math.random() - 0.5) * 50;
        pos[i * 3 + 2] = (Math.random() - 0.5) * 30 - 10;
        
        rots[i * 3] = Math.random() * Math.PI;
        rots[i * 3 + 1] = Math.random() * Math.PI;
        rots[i * 3 + 2] = Math.random() * Math.PI;
    }
    return { pos, rots };
  };

  const data = useMemo(() => ({
    icosa: generateData(counts.icosa),
    tetra: generateData(counts.tetra),
    octa: generateData(counts.octa),
    sphere: generateData(counts.sphere),
  }), []);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Shooting star state
  const shootingData = useRef({
    active: false,
    progress: 0,
    start: new THREE.Vector3(),
    end: new THREE.Vector3(),
    speed: 0
  });

  // Modern Timer instance
  const timer = useMemo(() => new Timer(), []);
  useEffect(() => {
    // connect timer to document to handle page visibility
    timer.connect(document);
    return () => timer.dispose();
  }, [timer]);

  // Dust configuration
  const dustCount = 5000;
  const dustPositions = useMemo(() => {
    const positions = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 100;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 100;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 100 - 20;
    }
    return positions;
  }, [dustCount]);

  useFrame((state) => {
    if (!groupRef.current) return;
    
    // Update Timer manually
    timer.update();
    const delta = timer.getDelta();
    const time = timer.getElapsed();

    // 1. Scroll Parallax (Vertical Position)
    const scrollYOffset = window.scrollY * 0.003;
    groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, scrollYOffset, 0.1);

    // 2. Mouse Parallax (Opposite Direction Rotation)
    const targetRotX = state.pointer.y * -0.15;
    const targetRotY = state.pointer.x * -0.15;
    
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRotX, 0.05);
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotY, 0.05);
    
    // Update all instanced meshes
    const updateMesh = (meshRef, meshData, count) => {
        if(!meshRef.current) return;
        for (let i = 0; i < count; i++) {
            dummy.position.set(
              meshData.pos[i * 3],
              meshData.pos[i * 3 + 1] + Math.sin(time * 0.2 + i) * 0.3,
              meshData.pos[i * 3 + 2]
            );
            dummy.rotation.set(
              meshData.rots[i * 3] + time * 0.1,
              meshData.rots[i * 3 + 1] + time * 0.1,
              meshData.rots[i * 3 + 2] + time * 0.1
            );
            dummy.updateMatrix();
            meshRef.current.setMatrixAt(i, dummy.matrix);
        }
        meshRef.current.instanceMatrix.needsUpdate = true;
    };
    
    updateMesh(icosaMesh, data.icosa, counts.icosa);
    updateMesh(tetraMesh, data.tetra, counts.tetra);
    updateMesh(octaMesh, data.octa, counts.octa);
    updateMesh(sphereMesh, data.sphere, counts.sphere);

    // Dust Animation: Flying towards the camera along Z axis
    if (dustRef.current) {
        const positions = dustRef.current.geometry.attributes.position.array;
        for (let i = 0; i < dustCount; i++) {
            // fly towards screen
            positions[i * 3 + 2] += delta * 15.0; 
            
            // Loop back when passing the camera
            if (positions[i * 3 + 2] > 20) {
                positions[i * 3 + 2] -= 100;
            }
        }
        dustRef.current.geometry.attributes.position.needsUpdate = true;
    }

    // Shooting Star Logic
    const sd = shootingData.current;
    if (!sd.active) {
        if (Math.random() < 0.003) { // Reduced frequency of spawning
            sd.active = true;
            sd.progress = 0;
            sd.speed = 1.5 + Math.random() * 2.0;
            sd.start.set((Math.random() - 0.5) * 40, 20 + Math.random() * 10, -5 - Math.random() * 10);
            sd.end.set((Math.random() - 0.5) * 40, -20 - Math.random() * 10, -5 - Math.random() * 10);
        }
    } else {
        sd.progress += delta * sd.speed;
        if (sd.progress > 1) {
            sd.active = false;
        } else {
            if (shootingStarRef.current) {
                shootingStarRef.current.position.lerpVectors(sd.start, sd.end, sd.progress);
                // Expand and thin out shooting star via scaling based on progress
                let scale = 1.0;
                if(sd.progress > 0.8) scale = (1.0 - sd.progress) * 5;
                shootingStarRef.current.scale.set(scale, scale, scale);
            }
        }
    }
  });

  return (
    <group ref={groupRef}>
      <instancedMesh ref={icosaMesh} args={[icosaGeometry, material, counts.icosa]} />
      <instancedMesh ref={tetraMesh} args={[tetraGeometry, material, counts.tetra]} />
      <instancedMesh ref={octaMesh} args={[octaGeometry, material, counts.octa]} />
      <instancedMesh ref={sphereMesh} args={[sphereGeometry, material, counts.sphere]} />
      
      <points ref={dustRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={dustCount}
            array={dustPositions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial size={0.06} color="#08CB00" transparent opacity={0.15} sizeAttenuation={true} />
      </points>

      <mesh ref={shootingStarRef} visible={shootingData.current.active}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
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
        performance={{ min: 0.5 }}
      >
        <StarField />
      </Canvas>
    </div>
  );
}
