import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import {
  ShoppingBag,
  User,
  Menu,
  MessageCircle,
  ArrowRight,
  Package,
  ChevronDown,
  Loader2,
  Box,
  RotateCw,
  X
} from 'lucide-react';
import { Canvas, useFrame } from '@react-three/fiber';
import {
  PresentationControls,
  Stage,
  Float,
  Sparkles as ThreeSparkles,
  Environment,
  useGLTF
} from '@react-three/drei';
import * as THREE from 'three';

import { Logo } from './components/Logo';
import { Experience3D } from './components/Experience3D';
import { CharmBuilder } from './components/CharmBuilder';
import { Quiz } from './components/Quiz';
import { AuthModal } from './components/AuthModal';
import { CartModal } from './components/CartModal';
import { CraftSection } from './components/CraftSection';
import { Charm, CartItem } from './types';
import { chatWithPandora } from './services/geminiService';
import { cartService } from './services/cartService';

/* ===================== Tipler ===================== */

type Product = {
  id: number;
  name: string;
  image: string;
  fallback: string;
  color: string;
  model?: string; // her ürün için glb dosya adı
};

interface Product3DModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  onAddToCart: (product: Product) => void;
}

/* ===================== 3D Modeller ===================== */

// Genel GLTF model (her ürün için)
const GLTFModel = ({ model, autoRotate }: { model: string; autoRotate: boolean }) => {
  const groupRef = useRef<THREE.Group>(null);

  // Boşluklu isimler için encodeURIComponent
  const url = `/models/${encodeURIComponent(model)}`;
  const gltf = useGLTF(url) as any;

  useFrame(() => {
    if (groupRef.current && autoRotate) {
      groupRef.current.rotation.y += 0.01;
    }
  });

  return (
    <group ref={groupRef} scale={1.6} position={[0, -1, 0]}>
      <primitive object={gltf.scene} />
    </group>
  );
};

// Her ihtimale karşı placeholder model
const PlaceholderModel = ({ color, autoRotate }: { color: string; autoRotate: boolean }) => {
  const meshRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (meshRef.current && autoRotate) {
      meshRef.current.rotation.y += 0.005;
    }
  });

  return (
    <group ref={meshRef}>
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
        <mesh castShadow receiveShadow>
          <dodecahedronGeometry args={[1, 0]} />
          <meshStandardMaterial
            color={color}
            metalness={0.9}
            roughness={0.1}
            envMapIntensity={2}
          />
        </mesh>
        <mesh position={[0, 1.2, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.3, 0.05, 16, 32]} />
          <meshStandardMaterial color="#C0C0C0" metalness={1} roughness={0.1} />
        </mesh>
      </Float>
    </group>
  );
};

// Performans için elimizde olan 3 modeli preload edelim
useGLTF.preload('/models/Blue_penguin.glb');
useGLTF.preload('/models/pink%20trii.glb');
useGLTF.preload('/models/021.glb');

/* ===================== Product 3D Modal ===================== */

const Product3DModal: React.FC<Product3DModalProps> = ({ isOpen, onClose, product, onAddToCart }) => {
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
              <ThreeSparkles
                count={50}
                scale={10}
                size={4}
                speed={0.4}
                opacity={0.4}
                color="#FADADD"
              />

              <PresentationControls
                global
                zoom={0.8}
                rotation={[0, 0, 0]}
                polar={[-Math.PI / 4, Math.PI / 4]}
                azimuth={[-Math.PI / 2, Math.PI / 2]}
                config={{ mass: 2, tension: 400 }}
                snap
              >
                <Stage environment={null} intensity={0.5} shadows="contact">
                  {product.model ? (
                    <GLTFModel model={product.model} autoRotate={autoRotate} />
                  ) : (
                    <PlaceholderModel color={product.color} autoRotate={autoRotate} />
                  )}
                </Stage>
              </PresentationControls>
            </Canvas>

            {/* UI Controls */}
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-6 pointer-events-none">
              <div className="text-center pointer-events-auto">
                <h2 className="text-3xl font-serif text-slate-900 mb-2">{product.name}</h2>
                <p className="text-slate-500 font-light tracking-wider text-sm uppercase">
                  Exclusive Collection
                </p>
              </div>

              <div className="flex gap-4 pointer-events-auto">
                <button
                  onClick={() => setAutoRotate(!autoRotate)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-full shadow-lg transition-all ${autoRotate ? 'bg-slate-900 text-white' : 'bg-white text-slate-900 border border-slate-200'
                    }`}
                >
                  <RotateCw className={`w-4 h-4 ${autoRotate ? 'animate-spin' : ''}`} />
                  {autoRotate ? 'Auto-Rotate On' : 'Auto-Rotate Off'}
                </button>
                <button
                  onClick={() => product && onAddToCart(product)}
                  className="px-6 py-3 bg-brand-pink text-slate-900 font-semibold rounded-full shadow-lg hover:brightness-95 transition-colors"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

/* ===================== Particles Background ===================== */

const Particles = () => {
  const [dots, setDots] = useState<
    Array<{ left: number; top: number; delay: number; duration: number; opacity: number }>
  >([]);

  useEffect(() => {
    const count = 26;
    const newDots: typeof dots = [];
    for (let i = 0; i < count; i++) {
      newDots.push({
        left: Math.random() * 100,
        top: Math.random() * 100,
        delay: Math.random() * 3,
        duration: 2 + Math.random() * 3,
        opacity: 0.3 + Math.random() * 0.4
      });
    }
    setDots(newDots);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {dots.map((dot, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-blue-300 rounded-full animate-pulse"
          style={{
            left: `${dot.left}%`,
            top: `${dot.top}%`,
            animationDelay: `${dot.delay}s`,
            animationDuration: `${dot.duration}s`,
            opacity: dot.opacity
          }}
        />
      ))}
    </div>
  );
};

/* ===================== Ürünler ===================== */

const products: Product[] = [
  {
    id: 101,
    name: 'Baby Blue Penguin Charm',
    image: '1.jpg',
    fallback: '1.jpg',
    color: '#AEEEEE',
    model: 'Blue_penguin.glb'        // public/models/Blue_penguin.glb
  },
  {
    id: 102,
    name: 'Strawberry Cat Charm',
    image: '2.jpg',
    fallback: '2.jpg',
    color: '#FFB7C5',
    model: 'pink trii.glb'          // public/models/pink trii.glb
  },
  {
    id: 103,
    name: 'Calico Cat Charm',
    image: '3.jpg',
    fallback: '3.jpg',
    color: '#E6C288',
    model: '021.glb'                // public/models/021.glb
  },
  {
    id: 104,
    name: 'Bunny with Cup Charm',
    image: '4.jpg',
    fallback: '4.jpg',
    color: '#FFFFFF',
    model: '021.glb',             // public/models/021.glb
  },
  {
    id: 105,
    name: 'Kuromi Purple Rose Charm',
    image: '5.jpg',
    fallback: '5.jpg',
    color: '#E0B0FF',
    model: 'pink trii.glb',
  }
];

/* ===================== App ===================== */

const App: React.FC = () => {
  const [scrollY, setScrollY] = useState(0);
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [charms, setCharms] = useState<Charm[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState<{ role: 'user' | 'model'; text: string }[]>([]);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 1.1]);
  const heroY = useTransform(scrollYProgress, [0, 0.2], [0, -50]);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (scrollY > 300 && charms.length === 0) {
      const initialCharms: Charm[] = [
        { id: '1', name: 'Love Heart', color: '#ff9999', shape: 'heart', metalness: 0.9, roughness: 0.1 },
        { id: '2', name: 'Cosmic Star', color: '#ccccff', shape: 'star', metalness: 0.8, roughness: 0.2 }
      ];
      setTimeout(() => setCharms(initialCharms), 500);
    }
  }, [scrollY, charms.length]);

  useEffect(() => {
    cartService.getCart().then(setCartItems).catch(console.error);
  }, []);

  const handleAddCharm = async (newCharm: Charm) => {
    setCharms(prev => [...prev, newCharm]);
    // Also add to cart
    try {
      const newItem: CartItem = {
        ...newCharm,
        quantity: 1
      };
      const updatedCart = await cartService.addToCart(newItem);
      setCartItems(updatedCart);
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddToCart = async (product: Product) => {
    try {
      const newItem: CartItem = {
        id: product.id.toString(),
        name: product.name,
        color: product.color,
        metalness: 0.5,
        roughness: 0.5,
        shape: 'sphere', // default
        description: 'Standard Product',
        quantity: 1
      };
      const updatedCart = await cartService.addToCart(newItem);
      setCartItems(updatedCart);
      setIsCartOpen(true);
    } catch (e) {
      console.error(e);
    }
  };

  const handleRemoveFromCart = async (id: string) => {
    try {
      const updatedCart = await cartService.removeFromCart(id);
      setCartItems(updatedCart);
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdateCartQuantity = async (id: string, quantity: number) => {
    try {
      const updatedCart = await cartService.updateCartItem(id, quantity);
      setCartItems(updatedCart);
    } catch (e) {
      console.error(e);
    }
  };

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const newMessage = { role: 'user' as const, text: chatInput };
    setChatHistory(prev => [...prev, newMessage]);
    setChatInput('');
    setIsChatLoading(true);

    const formattedHistory = chatHistory.map(h => ({
      role: h.role,
      parts: [{ text: h.text }]
    }));

    const response = await chatWithPandora(newMessage.text, formattedHistory);
    setChatHistory(prev => [...prev, { role: 'model', text: response }]);
    setIsChatLoading(false);
  };

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="relative w-full min-h-screen font-sans selection:bg-brand-pink/30">
      {/* Particles Background for Hero */}
      <Particles />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-8 py-6 flex justify-between items-center backdrop-blur-md bg-white/30 transition-all duration-300 border-b border-white/20">
        <div className="flex items-center gap-3">
          <div className="text-2xl font-serif font-light tracking-wider text-gray-800">PANDORA</div>
          <div className="text-xs text-gray-500 font-light font-sans tracking-widest">LABS</div>
        </div>


        <div className="flex gap-4 items-center">
          <button
            onClick={() => setIsAuthOpen(true)}
            className="hover:scale-110 transition-transform p-1"
            title="Login"
          >
            <User className="w-5 h-5 text-gray-600 stroke-[1.6]" />
          </button>

          <button
            onClick={() => setIsCartOpen(true)}
            className="hover:scale-110 transition-transform p-1 relative"
            title="Cart"
          >
            <ShoppingBag className="w-5 h-5 text-gray-600 stroke-[1.6]" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-[#f9a8d4] text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-medium cart-badge">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="fixed top-[88px] left-0 right-0 bg-white/80 backdrop-blur-md px-8 py-4 flex flex-col gap-4 text-sm font-light text-gray-700 md:hidden z-40 border-b border-white/50"
          >
            <button className="text-left py-2 hover:text-blue-500 transition">Collections</button>
            <button
              onClick={() => setIsBuilderOpen(true)}
              className="text-left py-2 hover:text-blue-500 transition"
            >
              Create
            </button>
            <button className="text-left py-2 hover:text-blue-500 transition">Quiz</button>
            <button className="text-left py-2 hover:text-blue-500 transition">About</button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Section 1: Hero / Intro */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <motion.div
          style={{ opacity: heroOpacity, scale: heroScale, y: heroY }}
          className="z-10 text-center w-full"
        >
          <Logo variant="hero" />

          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="mt-16 text-gray-400 flex justify-center"
          >
            <ChevronDown className="w-6 h-6 opacity-60" />
          </motion.div>
        </motion.div>

        <div className="absolute inset-0 bg-gradient-radial pointer-events-none z-0" />
      </section>

      {/* Section 2: 3D Experience */}
      <div className="relative h-[200vh]">
        <div className="sticky top-0 h-screen w-full overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Experience3D charms={charms} />
          </div>

          <motion.div
            className="absolute bottom-20 left-0 w-full text-center pointer-events-none z-10"
            style={{ opacity: useTransform(scrollYProgress, [0.2, 0.4, 0.6], [0, 1, 0]) }}
          >
            <h2 className="text-4xl font-serif text-slate-800 mb-2">Your Story, Forged</h2>
            <p className="text-slate-500 font-light tracking-wide">Collect moments in silver and gold.</p>
          </motion.div>
        </div>
      </div>

      {/* Section 3: Craft Your Imagination */}
      <CraftSection onOpenBuilder={() => setIsBuilderOpen(true)} />

      {/* Section 4: Products Grid */}
      <section className="py-24 bg-gradient-to-b from-pink-100 via-white to-blue-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif text-slate-900 mb-4">Latest Creations</h2>
            <p className="text-slate-500 font-light">Explore our newest limited edition charms.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
            {products.map(product => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                whileHover={{ scale: 1.05 }}
                className="group relative bg-white rounded-[2rem] p-4 shadow-sm hover:shadow-xl hover:shadow-pink-100 transition-all duration-300 flex flex-col items-center cursor-pointer"
                onClick={() => setSelectedProduct(product)}
              >
                <div className="relative w-full aspect-square rounded-2xl overflow-hidden mb-4 bg-gray-50">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                    onError={e => {
                      (e.target as HTMLImageElement).src = product.fallback;
                    }}
                  />
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                    <div className="bg-white/90 text-slate-900 px-4 py-2 rounded-full text-xs font-bold tracking-widest flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform">
                      <Box className="w-3 h-3" />
                      VIEW 3D
                    </div>
                  </div>
                </div>

                <h3 className="font-serif text-slate-800 font-medium text-center mb-2">
                  {product.name}
                </h3>
                <div className="w-1 h-1 rounded-full bg-brand-gold opacity-50 mb-4" />

                <button
                  onClick={e => {
                    e.stopPropagation();
                    setSelectedProduct(product);
                  }}
                  className="w-full py-2 border border-slate-200 rounded-xl text-xs uppercase tracking-wider text-slate-500 hover:bg-slate-900 hover:text-white transition-colors"
                >
                  View in 3D
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 5: Quiz & Curation */}
      <section className="py-24 min-h-screen flex items-center justify-center relative bg-white">
        <div className="container mx-auto px-6 z-10">
          {!quizCompleted ? (
            <div className="text-center">
              <h2 className="text-4xl font-serif mb-4 text-slate-900">Discover Your Style</h2>
              <p className="text-slate-500 mb-12 font-light">
                Let us curate a collection that speaks to your soul.
              </p>
              <div className="glass-panel p-8 rounded-3xl max-w-3xl mx-auto border border-white shadow-xl shadow-blue-50">
                <Quiz onComplete={() => setQuizCompleted(true)} />
              </div>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <h2 className="text-4xl font-serif mb-4 text-slate-900">Your Curated Collection</h2>
              <p className="text-slate-500 mb-12 font-light">Based on your essence.</p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[1, 2, 3].map(i => (
                  <div
                    key={i}
                    className="glass-panel p-6 rounded-2xl hover:shadow-xl transition-shadow cursor-pointer group bg-white/40"
                  >
                    <div className="h-64 bg-slate-50 rounded-xl mb-6 overflow-hidden relative">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-32 h-32 rounded-full border-4 border-slate-200 group-hover:border-pink-300 transition-colors" />
                      </div>
                      <img
                        src={`https://picsum.photos/400/400?random=${i}`}
                        className="w-full h-full object-cover opacity-60 mix-blend-multiply"
                      />
                    </div>
                    <h3 className="font-serif text-xl font-bold mb-2">The Ethereal Set {i}</h3>
                    <div className="flex justify-between items-center">
                      <span className="text-brand-gold font-semibold">$199.00</span>
                      <button className="text-xs uppercase tracking-widest font-bold border-b border-black pb-1 hover:text-brand-pink hover:border-brand-pink transition-colors">
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setQuizCompleted(false)}
                className="mt-12 text-slate-400 hover:text-slate-600 underline"
              >
                Retake Quiz
              </button>
            </motion.div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-20 px-6">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div>
            <Logo variant="light" size="md" />
            <p className="mt-6 text-slate-400 text-sm leading-relaxed font-light">
              Pandora Labs reimagines the future of jewelry through the lens of technology and artistry.
            </p>
          </div>
          <div>
            <h4 className="font-serif text-lg mb-6">Shop</h4>
            <ul className="space-y-4 text-slate-400 text-sm font-light">
              <li>
                <a href="#" className="hover:text-pink-300 transition-colors">
                  New Arrivals
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-pink-300 transition-colors">
                  Charms
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-pink-300 transition-colors">
                  Bracelets
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-pink-300 transition-colors">
                  Gift Sets
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-serif text-lg mb-6">About</h4>
            <ul className="space-y-4 text-slate-400 text-sm font-light">
              <li>
                <a href="#" className="hover:text-pink-300 transition-colors">
                  Our Story
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-pink-300 transition-colors">
                  Sustainability
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-pink-300 transition-colors">
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-pink-300 transition-colors">
                  Press
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-serif text-lg mb-6">Join the Club</h4>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="bg-white/10 border-none rounded-lg px-4 py-2 w-full text-sm focus:ring-1 focus:ring-pink-300 text-white placeholder-slate-500"
              />
              <button className="bg-white text-slate-900 px-4 py-2 rounded-lg font-bold text-xs hover:bg-pink-200 transition-colors">
                JOIN
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <CharmBuilder
        isOpen={isBuilderOpen}
        onClose={() => setIsBuilderOpen(false)}
        onAddCharm={handleAddCharm}
      />

      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />

      <CartModal
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onRemove={handleRemoveFromCart}
        onUpdateQuantity={handleUpdateCartQuantity}
      />

      {/* Product 3D Viewer Modal */}
      <Product3DModal
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        product={selectedProduct}
        onAddToCart={handleAddToCart}
      />

      {/* Chatbot Toggle */}
      <div className="fixed bottom-6 right-6 z-40">
        <AnimatePresence>
          {chatOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              className="absolute bottom-16 right-0 w-80 bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-100 flex flex-col"
              style={{ maxHeight: '500px', height: '400px' }}
            >
              <div className="bg-slate-900 text-white p-4 flex justify-between items-center">
                <span className="font-serif text-sm">Pandora Assistant</span>
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
                {chatHistory.length === 0 && (
                  <div className="text-center text-xs text-slate-400 mt-4">
                    Ask me about bracelet sizing, styling tips, or gift ideas.
                  </div>
                )}
                {chatHistory.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-xl text-sm ${msg.role === 'user'
                        ? 'bg-slate-800 text-white'
                        : 'bg-white border border-slate-200 text-slate-700'
                        }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
                {isChatLoading && (
                  <div className="flex justify-start">
                    <div className="bg-white border border-slate-200 p-3 rounded-xl">
                      <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
                    </div>
                  </div>
                )}
              </div>
              <form
                onSubmit={handleChatSubmit}
                className="p-3 bg-white border-t border-slate-100 flex gap-2"
              >
                <input
                  value={chatInput}
                  onChange={e => setChatInput(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 bg-slate-50 rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-slate-300"
                />
                <button
                  type="submit"
                  disabled={isChatLoading || !chatInput.trim()}
                  className="p-2 bg-slate-900 text-white rounded-lg hover:bg-slate-700 disabled:opacity-50"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
        <button
          onClick={() => setChatOpen(!chatOpen)}
          className="w-14 h-14 bg-slate-900 text-white rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform"
        >
          {chatOpen ? <ArrowRight className="w-6 h-6 rotate-90" /> : <MessageCircle className="w-6 h-6" />}
        </button>
      </div>
    </div>
  );
};

export default App;
