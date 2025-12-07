import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, RotateCw, Loader2, Sparkles } from 'lucide-react';
import { Canvas, useFrame } from '@react-three/fiber';
import { PresentationControls, Stage, Float, Sparkles as ThreeSparkles, Environment } from '@react-three/drei';
import * as THREE from 'three';

interface Product3DModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: {
    id: number;
    name: string;
    image: string;
    color: string;
  } | null;
}

// A placeholder model since we don't have the actual GLB files
// In a real app, this would be a <Gltf src={url} /> component
const ProductModel = ({ color, autoRotate }: { color: string; autoRotate: boolean }) => {
  const meshRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (meshRef.current && autoRotate) {
      meshRef.current.rotation.y += 0.005;
    }
  });

  return (
    <group ref={meshRef}>
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
        {/* Main Charm Body Shape - Abstract representation */}
        <mesh castShadow receiveShadow>
          <dodecahedronGeometry args={[1, 0]} />
          <meshStandardMaterial 
            color={color} 
            metalness={0.9} 
            roughness={0.1}
            envMapIntensity={2}
          />
        </mesh>
        
        {/* Decorative Ring */}
        <mesh position={[0, 1.2, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.3, 0.05, 16, 32]} />
          <meshStandardMaterial color="#C0C0C0" metalness={1} roughness={0.1} />
        </mesh>
      </Float>
    </group>
  );
};

export const Product3DModal: React.FC<Product3DModalProps> = ({ isOpen, onClose, product }) => {
  const [autoRotate, setAutoRotate] = useState(true);

  if (!product) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-white/90 backdrop-blur-md flex items-center justify-center"
        >
          {/* Close Button */}
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 z-10 p-3 bg-white rounded-full shadow-lg hover:bg-slate-50 transition-transform hover:scale-110"
          >
            <X className="w-6 h-6 text-slate-800" />
          </button>

          <div className="w-full h-full relative bg-gradient-to-b from-white via-pink-50 to-white">
             {/* 3D Scene */}
             <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 0, 8], fov: 45 }}>
                <ambientLight intensity={0.5} />
                <Environment preset="city" />
                <ThreeSparkles count={50} scale={10} size={4} speed={0.4} opacity={0.4} color="#FADADD" />
                
                <PresentationControls
                  global
                  zoom={0.8}
                  rotation={[0, 0, 0]}
                  polar={[-Math.PI / 4, Math.PI / 4]}
                  azimuth={[-Math.PI / 2, Math.PI / 2]}
                  config={{ mass: 2, tension: 400 }}
                  snap={true}
                >
                  <Stage environment={null} intensity={0.5} shadows="contact">
                    <ProductModel color={product.color} autoRotate={autoRotate} />
                  </Stage>
                </PresentationControls>
             </Canvas>

             {/* UI Controls */}
             <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-6 pointer-events-none">
                <div className="text-center pointer-events-auto">
                  <h2 className="text-3xl font-serif text-slate-900 mb-2">{product.name}</h2>
                  <p className="text-slate-500 font-light tracking-wider text-sm uppercase">Exclusive Collection</p>
                </div>

                <div className="flex gap-4 pointer-events-auto">
                   <button 
                     onClick={() => setAutoRotate(!autoRotate)}
                     className={`flex items-center gap-2 px-6 py-3 rounded-full shadow-lg transition-all ${
                       autoRotate ? 'bg-slate-900 text-white' : 'bg-white text-slate-900 border border-slate-200'
                     }`}
                   >
                     <RotateCw className={`w-4 h-4 ${autoRotate ? 'animate-spin' : ''}`} />
                     {autoRotate ? 'Auto-Rotate On' : 'Auto-Rotate Off'}
                   </button>
                   <button className="px-6 py-3 bg-brand-pink text-slate-900 font-semibold rounded-full shadow-lg hover:brightness-95 transition-colors">
                     Add to Collection
                   </button>
                </div>
             </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};