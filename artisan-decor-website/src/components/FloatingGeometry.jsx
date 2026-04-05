import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Float, PresentationControls } from '@react-three/drei';

const AbstractShape = () => {
  const meshRef = useRef();

  useFrame((state, delta) => {
    meshRef.current.rotation.x += delta * 0.1;
    meshRef.current.rotation.y += delta * 0.15;
  });

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2}>
      <mesh ref={meshRef} scale={1.5}>
        <torusKnotGeometry args={[1, 0.3, 128, 64]} />
        <meshPhysicalMaterial 
          color="#d4ad65" 
          metalness={0.9} 
          roughness={0.2} 
          envMapIntensity={1}
          clearcoat={1}
          clearcoatRoughness={0.1}
        />
      </mesh>
    </Float>
  );
};

const FloatingGeometry = () => {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none opacity-40 md:opacity-60 mix-blend-luminosity dark:mix-blend-lighten">
      <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} />
        <Environment preset="city" />
        <PresentationControls 
          global 
          rotation={[0, 0, 0]} 
          polar={[-0.4, 0.2]} 
          azimuth={[-1, 0.75]} 
          config={{ mass: 2, tension: 400 }}
          snap={{ mass: 4, tension: 400 }}
        >
          <AbstractShape />
        </PresentationControls>
      </Canvas>
    </div>
  );
};

export default FloatingGeometry;
