'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useEffect } from 'react';
import Image from 'next/image';

interface CyberModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  width?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  showLogo?: boolean;
}

export function CyberModal({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  width = 'xl',
  showLogo = true,
}: CyberModalProps) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleEsc);
      return () => window.removeEventListener('keydown', handleEsc);
    }
  }, [isOpen, onClose]);

  const widthMap = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl',
    full: 'max-w-[95vw]',
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop with cyber grid */}
          <motion.div
            className="fixed inset-0 z-50 overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          >
            {/* Grid background */}
            <div className="absolute inset-0 bg-black/90 backdrop-blur-md">
              <div
                className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage: `
                    linear-gradient(to right, cyan 1px, transparent 1px),
                    linear-gradient(to bottom, cyan 1px, transparent 1px)
                  `,
                  backgroundSize: '40px 40px',
                }}
              />
            </div>

            {/* Animated particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {[...Array(30)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-cyan-400 rounded-full"
                  initial={{
                    x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
                    y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1000),
                    opacity: 0,
                  }}
                  animate={{
                    y: [null, Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1000)],
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: 3 + Math.random() * 2,
                    repeat: Infinity,
                    delay: Math.random() * 2,
                  }}
                />
              ))}
            </div>
          </motion.div>

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              className={`${widthMap[width]} w-full pointer-events-auto`}
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Cyber border glow effect */}
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 rounded-2xl blur-lg opacity-30 animate-pulse" />
                
                <div className="relative bg-gray-950 border border-cyan-500/30 rounded-2xl overflow-hidden shadow-2xl">
                  {/* Top accent line */}
                  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />
                  
                  {/* Header */}
                  <div className="relative border-b border-cyan-900/50 bg-gradient-to-b from-gray-900 to-gray-950 p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4 flex-1">
                        {/* SYNTX LOGO 💎 */}
                        {showLogo && (
                          <motion.div
                            className="relative"
                            initial={{ rotate: -10, scale: 0.8 }}
                            animate={{ rotate: 0, scale: 1 }}
                            transition={{ type: 'spring', damping: 20 }}
                          >
                            <div className="absolute -inset-2 bg-gradient-to-r from-cyan-500/30 to-purple-500/30 rounded-xl blur-md" />
                            <div className="relative">
                              <Image
                                src="/Logo1.png"
                                alt="SYNTX"
                                width={48}
                                height={48}
                                className="rounded-lg"
                              />
                            </div>
                          </motion.div>
                        )}
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
                            <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400">
                              {title}
                            </h2>
                          </div>
                          {subtitle && (
                            <p className="text-sm text-gray-400 font-mono pl-5">{subtitle}</p>
                          )}
                        </div>
                      </div>
                      
                      <button
                        onClick={onClose}
                        className="p-2 hover:bg-cyan-500/10 rounded-lg transition-colors group relative"
                      >
                        <div className="absolute inset-0 bg-cyan-500/20 rounded-lg blur opacity-0 group-hover:opacity-100 transition-opacity" />
                        <X className="w-6 h-6 text-gray-400 group-hover:text-cyan-400 relative z-10 transition-colors" />
                      </button>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="relative max-h-[80vh] overflow-y-auto">
                    {/* Side accent */}
                    <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-cyan-500/50 via-transparent to-purple-500/50" />
                    
                    <div className="p-6">
                      {children}
                    </div>
                  </div>

                  {/* Bottom accent line */}
                  <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-400 to-transparent" />
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
