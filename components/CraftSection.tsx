import React from 'react';
import { motion } from 'framer-motion';

interface CraftSectionProps {
  onOpenBuilder: () => void;
}

export const CraftSection: React.FC<CraftSectionProps> = ({ onOpenBuilder }) => {
  return (
    <section
      id="craft-your-imagination"
      className="relative w-full py-24 bg-gradient-to-b from-white via-rose-50 to-pink-100"
    >
      <div className="max-w-6xl mx-auto grid gap-12 lg:grid-cols-2 items-center px-6">
        {/* Left side: text content (English) */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="space-y-6"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif tracking-tight text-slate-900">
            Craft Your Imagination
          </h2>
          <p className="text-lg md:text-xl text-slate-600 leading-relaxed font-light">
            Turn your dream charm into reality. Upload your idea, let our AI help you
            refine the design, and see it come to life in stunning detail.
          </p>
          <p className="text-sm md:text-base text-slate-500 font-light">
            Explore playful characters, soft pastel colors, and premium Pandora-style
            details – all crafted just for you.
          </p>
        </motion.div>

        {/* Right side: video + CTA button */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex flex-col items-center space-y-8"
        >
          <div className="w-full aspect-video rounded-[2rem] overflow-hidden shadow-2xl shadow-pink-200/60 ring-1 ring-white/50 relative">
            <video
              src="video.mp4" 
              className="w-full h-full object-cover"
              autoPlay
              loop
              muted
              playsInline
            />
            {/* Glossy overlay effect */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none" />
          </div>

          <button
            onClick={onOpenBuilder}
            className="px-12 py-5 bg-slate-900 text-white text-lg font-serif tracking-wide rounded-full shadow-xl shadow-slate-900/20 hover:shadow-pink-300/40 hover:bg-slate-800 transition-all duration-300 transform hover:-translate-y-1 hover:scale-105"
          >
            Hayalindeki charm, şimdi gerçek oluyor
          </button>
        </motion.div>
      </div>
    </section>
  );
};