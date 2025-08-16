import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import FeatureCard from './FeatureCard';
import { featureData } from './featureData';

const TrustFeatures = () => {
  const containerRef = useRef(null);
  const titleRef = useRef(null);
  const [titleHovered, setTitleHovered] = useState(false);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });
  
  // Effets de parallaxe et d'animation
  const y = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.6, 1, 1, 0.6]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [0.95, 1.05]);
  
  // Animation variants
  const titleVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1]
      }
    }
  };
  
  const underlineVariants = {
    hidden: { width: '0%' },
    visible: {
      width: '100%',
      transition: {
        duration: 1,
        delay: 0.4,
        ease: [0.16, 1, 0.3, 1]
      }
    }
  };
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };
  
  return (
    <section ref={containerRef} className="relative w-full bg-gradient-to-b from-gray-100 to-white dark:from-slate-900 dark:to-slate-800 transition-colors duration-300 pt-12 pb-20 md:pt-16 md:pb-24 overflow-hidden border-t border-b border-gray-200 dark:border-slate-700/30">
      {/* Motif d'arrière-plan avec effet parallaxe */}
      <motion.div 
        className="absolute inset-0 opacity-10 dark:opacity-20 pointer-events-none"
        style={{ y }}
      >
        <div className="h-full w-full" style={{ 
          backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z\' fill=\'%239C92AC\' fill-opacity=\'0.1\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")',
          backgroundSize: '180px 180px'
        }} />
      </motion.div>
      
      {/* Overlay design pattern */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-500/5 to-blue-500/5 dark:from-purple-500/10 dark:to-blue-500/10 pointer-events-none" />
      
      {/* Éléments décoratifs flottants */}
      <motion.div 
        className="absolute top-20 right-10 w-32 h-32 rounded-full bg-gradient-to-r from-purple-500/20 to-blue-500/20 dark:from-purple-500/30 dark:to-blue-500/30 blur-xl"
        animate={{ 
          y: [-10, 10, -10],
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.5, 0.3]
        }}
        transition={{ 
          duration: 8, 
          repeat: Infinity,
          repeatType: 'mirror'
        }}
      />
      
      <motion.div 
        className="absolute bottom-40 left-10 w-40 h-40 rounded-full bg-gradient-to-r from-pink-500/20 to-orange-500/20 dark:from-pink-500/30 dark:to-orange-500/30 blur-xl"
        animate={{ 
          y: [10, -10, 10],
          scale: [1.1, 1, 1.1],
          opacity: [0.4, 0.2, 0.4]
        }}
        transition={{ 
          duration: 10, 
          repeat: Infinity,
          repeatType: 'mirror',
          delay: 1
        }}
      />
      
      <motion.div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-gradient-to-r from-blue-500/5 to-purple-500/5 dark:from-blue-500/10 dark:to-purple-500/10 blur-3xl"
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3]
        }}
        transition={{ 
          duration: 15, 
          repeat: Infinity,
          repeatType: 'mirror'
        }}
      />
      
      {/* Titre de section avec soulignement animé et effet + */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 md:mb-16">
        <motion.div
          className="text-center relative"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-10%" }}
        >
          <motion.div 
            ref={titleRef}
            className="relative inline-block"
            onHoverStart={() => setTitleHovered(true)}
            onHoverEnd={() => setTitleHovered(false)}
          >
            <motion.h2 
              className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-800 to-gray-600 dark:from-white dark:to-gray-300 mb-3 md:mb-4 relative inline-block drop-shadow-sm"
              variants={titleVariants}
              animate={titleHovered ? {
                scale: [1, 1.03, 1],
                transition: { duration: 0.5, repeat: 0 }
              } : {}}
            >
              Pourquoi Nous Choisir
              <motion.span 
                className="absolute -bottom-2 left-0 h-1.5 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full shadow-sm"
                variants={underlineVariants}
                animate={titleHovered ? {
                  width: '100%',
                  opacity: [0.7, 1, 0.7],
                  height: [6, 8, 6],
                  transition: { duration: 1.5, repeat: Infinity }
                } : {}}
              />
            </motion.h2>
            
            {/* Animated + symbol on title hover */}
            <AnimatePresence>
              {titleHovered && (
                <motion.div
                  className="absolute -top-4 -right-8 w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-white text-lg font-bold shadow-lg ring-2 ring-white/50 dark:ring-slate-800/50"
                  initial={{ scale: 0, rotate: 0 }}
                  animate={{
                    scale: [0, 1.2, 1],
                    rotate: [0, 180, 0],
                    boxShadow: ['0px 0px 0px rgba(124, 58, 237, 0.5)', '0px 0px 20px rgba(124, 58, 237, 0.5)', '0px 0px 10px rgba(124, 58, 237, 0.5)'],
                  }}
                  exit={{ scale: 0, rotate: 180 }}
                  transition={{
                    duration: 0.5,
                    times: [0, 0.6, 1],
                    ease: "easeInOut"
                  }}
                >
                  <motion.span
                    animate={{
                      scale: [1, 1.2, 1],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      repeatType: "mirror"
                    }}
                  >
                    +
                  </motion.span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
          
          <motion.p 
            className="text-gray-600 dark:text-slate-300 text-base md:text-xl max-w-2xl mx-auto mt-3 md:mt-5 font-medium"
            variants={titleVariants}
            transition={{ delay: 0.2 }}
          >
            Des services exceptionnels pour une expérience d'achat parfaite
          </motion.p>
        </motion.div>
      </div>
      
      {/* Grille de fonctionnalités avec effet de scale */}
      <motion.div 
        className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        style={{ opacity, scale }}
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-10%" }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {featureData.map((feature, index) => (
            <FeatureCard key={feature.id} feature={feature} index={index} />
          ))}
        </div>
      </motion.div>
      
      {/* Bouton d'action avec effet hover avancé et animation + */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 text-center">
        <motion.div
          className="relative inline-block"
          whileHover="hover"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          viewport={{ once: true, margin: "-10%" }}
        >
          <motion.span
            className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500/70 to-blue-500/70 blur-md"
            variants={{
              hover: {
                scale: 1.5,
                opacity: 0.8,
              }
            }}
          />
          <motion.button
            className="relative px-10 py-4 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 text-white font-bold text-lg shadow-lg group"
            variants={{
              hover: {
                y: -5,
                boxShadow: '0 20px 25px -5px rgba(124, 58, 237, 0.4), 0 10px 10px -5px rgba(124, 58, 237, 0.3)',
              }
            }}
          >
            <span className="flex items-center justify-center">
              Découvrir nos produits
              <motion.span
                className="ml-3 w-6 h-6 rounded-full bg-white text-purple-600 flex items-center justify-center font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-md"
                animate={{
                  rotate: [0, 180],
                  scale: [0.8, 1, 0.8],
                  boxShadow: ['0px 0px 0px rgba(255, 255, 255, 0.5)', '0px 0px 10px rgba(255, 255, 255, 0.8)', '0px 0px 5px rgba(255, 255, 255, 0.5)'],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "loop"
                }}
              >
                +
              </motion.span>
            </span>
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default TrustFeatures;