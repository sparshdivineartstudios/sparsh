import React, { useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { MeshDistortMaterial, Environment } from '@react-three/drei';

const FluidPlane = () => {
  const meshRef = useRef();

  return (
    <mesh ref={meshRef} position={[0, 0, -2]} scale={10}>
      <planeGeometry args={[5, 5, 64, 64]} />
      <MeshDistortMaterial
        color="#080808"
        roughness={0.4}
        metalness={0.8}
        distort={0.4}
        speed={1.5}
        clearcoat={1}
        clearcoatRoughness={0.1}
      />
    </mesh>
  );
};

const LiquidBackground = () => {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none w-full h-full">
      <Canvas camera={{ position: [0, 0, 3], fov: 50 }} gl={{ antialias: true, alpha: true }}>
        <ambientLight intensity={0.5} />
        {/* Subtle gold lighting grazing the surface */}
        <directionalLight position={[5, 5, 2]} intensity={2} color="#B89A58" />
        <directionalLight position={[-5, -5, -2]} intensity={0.5} color="#4a4a4a" />
        
        <Environment preset="city" />
        
        <FluidPlane />
      </Canvas>
    </div>
  );
};

export default LiquidBackground;
