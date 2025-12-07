import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Loader2, Plus, RefreshCcw } from 'lucide-react';
import { generateCharmDesign } from '../services/geminiService';
import { Charm } from '../types';
import { Canvas } from '@react-three/fiber';
import { Float, Environment, ContactShadows } from '@react-three/drei';

// Augment JSX namespace to recognize React Three Fiber intrinsic elements
declare global {
  namespace JSX {
    interface IntrinsicElements {
      mesh: any;
      sphereGeometry: any;
      boxGeometry: any;
      dodecahedronGeometry: any;
      octahedronGeometry: any;
      meshStandardMaterial: any;
      ambientLight: any;
      spotLight: any;
    }
  }
}

interface CharmBuilderProps {
  isOpen: boolean;
  onClose: () => void;
  onAddCharm: (charm: Charm) => void;
}

// Simple preview component for the builder
const CharmPreview = ({ charm }: { charm: Charm | null }) => {
  if (!charm) return null;
  return (
    <Canvas camera={{ position: [0, 0, 4], fov: 45 }}>
      <ambientLight intensity={0.5} />
      <spotLight position={[5, 5, 5]} intensity={1} />
      <Environment preset="studio" />
      <Float>
        <mesh>
          {charm.shape === 'sphere' && <sphereGeometry args={[1, 32, 32]} />}
          {charm.shape === 'cube' && <boxGeometry args={[1.3, 1.3, 1.3]} />}
          {charm.shape === 'heart' && <dodecahedronGeometry args={[1]} />}
          {charm.shape === 'star' && <octahedronGeometry args={[1]} />}
          <meshStandardMaterial 
            color={charm.color} 
            metalness={0.8} 
            roughness={0.2} 
          />
        </mesh>
      </Float>
      <ContactShadows position={[0, -1.5, 0]} opacity={0.4} scale={5} blur={2} />
    </Canvas>
  );
};

export const CharmBuilder: React.FC<CharmBuilderProps> = ({ isOpen, onClose, onAddCharm }) => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [generatedCharm, setGeneratedCharm] = useState<Charm | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    
    // Simulate thinking time for better UX
    const design = await generateCharmDesign(prompt);
    
    setGeneratedCharm({
      id: Date.now().toString(),
      name: design.name,
      color: design.color,
      shape: design.shape,
      metalness: 0.8,
      roughness: 0.2,
      description: design.description
    });
    setLoading(false);
  };

  const handleAttach = () => {
    if (generatedCharm) {
      onAddCharm(generatedCharm);
      setGeneratedCharm(null);
      setPrompt('');
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
        >
          <motion.div 
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col md:flex-row h-[80vh] md:h-[600px]"
          >
            {/* Left Side - 3D Preview */}
            <div className="w-full md:w-1/2 bg-gradient-to-br from-slate-50 to-slate-200 relative flex items-center justify-center">
              {generatedCharm ? (
                 <div className="w-full h-full">
                    <CharmPreview charm={generatedCharm} />
                 </div>
              ) : (
                <div className="text-center p-8 opacity-40">
                  <div className="w-32 h-32 rounded-full border-4 border-dashed border-gray-300 mx-auto mb-4 flex items-center justify-center">
                    <Sparkles className="w-12 h-12 text-gray-400" />
                  </div>
                  <p className="font-serif">Your creation will appear here</p>
                </div>
              )}
              
              {/* Overlay info */}
              {generatedCharm && (
                <div className="absolute bottom-6 left-6 right-6 glass-panel p-4 rounded-xl">
                  <h3 className="font-serif text-lg font-bold text-slate-800">{generatedCharm.name}</h3>
                  <p className="text-xs text-slate-500 mt-1">{generatedCharm.description}</p>
                </div>
              )}
            </div>

            {/* Right Side - Controls */}
            <div className="w-full md:w-1/2 p-8 flex flex-col relative">
              <button 
                onClick={onClose}
                className="absolute top-6 right-6 p-2 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-slate-500" />
              </button>

              <div className="mb-6">
                <h2 className="text-2xl font-serif font-bold text-slate-900 mb-2">Pandora AI Lab</h2>
                <p className="text-slate-500 text-sm">Describe your dream charm, and our AI will forge it instantly.</p>
              </div>

              <div className="flex-grow flex flex-col gap-4">
                <textarea 
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="E.g., A glowing blue crystal heart wrapped in silver vines..."
                  className="w-full h-32 p-4 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-brand-pink focus:border-transparent outline-none resize-none transition-all text-sm font-sans"
                />

                <button 
                  onClick={handleGenerate}
                  disabled={loading || !prompt.trim()}
                  className="w-full py-4 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Forging...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      Generate Design
                    </>
                  )}
                </button>
              </div>

              {generatedCharm && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 pt-6 border-t border-slate-100"
                >
                  <div className="flex gap-3">
                    <button 
                      onClick={() => setGeneratedCharm(null)}
                      className="flex-1 py-3 border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-colors flex items-center justify-center gap-2 text-sm"
                    >
                      <RefreshCcw className="w-4 h-4" />
                      Discard
                    </button>
                    <button 
                      onClick={handleAttach}
                      className="flex-[2] py-3 bg-brand-pink text-slate-900 rounded-xl hover:brightness-95 transition-colors flex items-center justify-center gap-2 text-sm font-semibold"
                    >
                      <Plus className="w-4 h-4" />
                      Attach to Bracelet
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};