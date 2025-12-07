import React, { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Float, PresentationControls, ContactShadows, Stars, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import { Charm } from '../types';

// Augment JSX namespace to recognize React Three Fiber intrinsic elements
declare global {
  namespace JSX {
    interface IntrinsicElements {
      group: any;
      mesh: any;
      torusGeometry: any;
      meshStandardMaterial: any;
      sphereGeometry: any;
      boxGeometry: any;
      dodecahedronGeometry: any;
      octahedronGeometry: any;
      cylinderGeometry: any;
      ambientLight: any;
      spotLight: any;
      pointLight: any;
    }
  }
}

const BraceletModel = ({ charms }: { charms: Charm[] }) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      // Gentle floating rotation
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.2;
    }
  });

  return (
    <group ref={groupRef} dispose={null}>
      {/* The Bracelet Ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow>
        <torusGeometry args={[3.2, 0.15, 16, 100]} />
        <meshStandardMaterial 
          color="#E8E8E8" 
          metalness={1} 
          roughness={0.1} 
          envMapIntensity={1.5}
        />
      </mesh>

      {/* Charms */}
      {charms.map((charm, index) => {
        // Calculate position on the torus
        const angle = (index / Math.max(charms.length, 1)) * Math.PI * 2;
        const radius = 3.2;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius; // On the flat plane initially due to rotation, need to adjust

        return (
          <group key={charm.id} position={[x, 0, z]} rotation={[0, -angle, 0]}>
             <CharmMesh charm={charm} />
          </group>
        );
      })}
    </group>
  );
};

const CharmMesh = ({ charm }: { charm: Charm }) => {
  const meshRef = useRef<THREE.Mesh>(null);

  // Animate charm flying in (simple scale up for now as "flying" logic requires complex state)
  useFrame((state) => {
    if (meshRef.current) {
       meshRef.current.rotation.y += 0.01;
    }
  });

  const materialProps = {
    color: charm.color,
    metalness: charm.metalness,
    roughness: charm.roughness,
    envMapIntensity: 2
  };

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.2}>
      <mesh ref={meshRef} castShadow>
        {charm.shape === 'sphere' && <sphereGeometry args={[0.35, 32, 32]} />}
        {charm.shape === 'cube' && <boxGeometry args={[0.5, 0.5, 0.5]} />}
        {charm.shape === 'heart' && <dodecahedronGeometry args={[0.35]} />} 
        {/* Using dodecahedron as a placeholder for complex heart shape to avoid loading ext models */}
        {charm.shape === 'star' && <octahedronGeometry args={[0.35]} />}
        
        <meshStandardMaterial {...materialProps} />
      </mesh>
      {/* Clasp connector */}
      <mesh position={[0, 0.4, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 0.2, 16]} />
        <meshStandardMaterial color="#C0C0C0" metalness={1} roughness={0.2} />
      </mesh>
    </Float>
  );
};

interface Experience3DProps {
  charms: Charm[];
  interactive?: boolean;
}

export const Experience3D: React.FC<Experience3DProps> = ({ charms, interactive = true }) => {
  return (
    <div className="w-full h-full absolute top-0 left-0 z-0">
      <Canvas shadows camera={{ position: [0, 0, 8], fov: 45 }} dpr={[1, 2]}>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} shadow-mapSize={2048} intensity={1.5} castShadow />
        <pointLight position={[-10, -10, -10]} intensity={1} color="#FADADD" />
        
        <Environment preset="city" />
        <Sparkles count={50} scale={10} size={2} speed={0.4} opacity={0.5} color="#FADADD" />
        
        <PresentationControls 
          global 
          zoom={0.8} 
          rotation={[0, 0, 0]} 
          polar={[-Math.PI / 4, Math.PI / 4]} 
          azimuth={[-Math.PI / 2, Math.PI / 2]}
          snap={interactive}
          enabled={interactive}
        >
          <Float rotationIntensity={0.4}>
            <BraceletModel charms={charms} />
          </Float>
        </PresentationControls>
        
        <ContactShadows position={[0, -2, 0]} opacity={0.4} scale={10} blur={2.5} far={4.5} />
      </Canvas>
    </div>
  );
};