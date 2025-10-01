import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

const WomenHeroSection = ({ theme }) => {
  return (
    <section className="relative h-[400px] overflow-hidden bg-gradient-to-br from-rose-50 via-pink-100 to-purple-100 dark:from-purple-900 dark:via-pink-900 dark:to-rose-900">
      {/* Floating Shapes */}
      <motion.div
        className="absolute top-20 right-20 w-64 h-64 bg-gradient-to-br from-pink-300/30 to-purple-300/30 rounded-full filter blur-3xl"
        animate={{
          y: [0, -30, 0],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="absolute bottom-10 left-10 w-96 h-96 bg-gradient-to-br from-rose-300/20 to-pink-300/20 rounded-full filter blur-3xl"
        animate={{
          y: [0, 40, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Sparkle Effects */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-white rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: Math.random() * 3,
          }}
        />
      ))}

      <div className="relative h-full flex items-center justify-center">
        <div className="text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex items-center justify-center mb-4"
          >
            <Sparkles className="w-8 h-8 text-pink-600 dark:text-pink-300 mr-3" />
            <span className="text-pink-600 dark:text-pink-300 font-bold tracking-wider uppercase text-sm">Collection Femme</span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-7xl font-black text-gray-900 dark:text-white mb-4 tracking-tight"
          >
            ÉLÉGANCE <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600">MODERNE</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl text-gray-700 dark:text-gray-200 max-w-2xl mx-auto"
          >
            Style raffiné et confort absolu pour la femme d'aujourd'hui
          </motion.p>
        </div>
      </div>
    </section>
  );
};

export default WomenHeroSection;
