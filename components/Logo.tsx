import React from 'react';
import { motion } from 'framer-motion';

interface LogoProps {
  variant?: 'light' | 'dark' | 'hero';
  size?: 'sm' | 'md' | 'lg' | 'hero';
  animated?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ variant = 'dark', size = 'md', animated = false }) => {
  const isHero = variant === 'hero';
  
  if (isHero) {
    return (
      <div className="relative inline-block text-center">
        {/* Shimmer Logo */}
        <div className="text-7xl md:text-9xl font-light tracking-widest logo-shimmer font-serif">
          PANDORA
        </div>

        {/* Floating Crown aligned over 'O' */}
        <div 
          className="absolute -top-6 md:-top-10 left-1/2" 
          style={{ animation: 'crownFloat 3s ease-in-out infinite' }}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="w-8 h-8 md:w-10 md:h-10 text-pink-300 drop-shadow-lg" 
            viewBox="0 0 24 24" 
            fill="currentColor"
          >
            <path d="M4 17h16l-1-8-3 3-4-7-4 7-3-3-1 8z" />
            <circle cx="12" cy="5" r="1.4" fill="#f9a8d4" />
          </svg>
        </div>

        <div className="text-xl md:text-3xl font-thin tracking-[0.5em] text-gray-400 mt-2 md:mt-4">
          LABS
        </div>
      </div>
    );
  }

  // Standard variants
  const textColor = variant === 'light' ? 'text-white' : 'text-slate-900';
  
  const sizeClasses = {
    sm: 'text-xl',
    md: 'text-3xl',
    lg: 'text-6xl tracking-widest',
    hero: 'text-9xl' // fallback
  };

  const labSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-xl',
    hero: 'text-3xl'
  };

  return (
    <div className={`flex flex-col items-center justify-center font-serif ${textColor}`}>
      <motion.div
        initial={animated ? { opacity: 0, scale: 0.9 } : {}}
        animate={animated ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="relative flex flex-col items-center"
      >
        <span className={`${sizeClasses[size]} font-semibold relative tracking-wider`}>
          PANDORA
          {variant !== 'light' && (
             <span className="absolute -top-3 left-[48%] -translate-x-1/2 text-[0.4em] opacity-80 text-pink-300">
              ♛
            </span>
          )}
        </span>
        <span className={`${labSizeClasses[size]} font-sans font-light tracking-[0.3em] opacity-70 mt-1`}>
          LABS
        </span>
      </motion.div>
    </div>
  );
};