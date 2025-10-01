import React from 'react';
import { motion } from 'framer-motion';
import { Layers } from 'lucide-react';

const BostonHeroSection = () => {
  return (
    <section className="relative h-[400px] overflow-hidden bg-gradient-to-br from-amber-900 via-orange-800 to-red-900">
      <motion.div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `repeating-linear-gradient(90deg, transparent, transparent 50px, rgba(255,255,255,.05) 50px, rgba(255,255,255,.05) 100px)`
        }}
        animate={{ x: ['0%', '100%'] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />

      <motion.div
        className="absolute top-20 right-32 w-96 h-96 bg-orange-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30"
        animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative h-full flex items-center justify-center">
        <div className="text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex items-center justify-center mb-4"
          >
            <Layers className="w-8 h-8 text-amber-300 mr-3" />
            <span className="text-amber-300 font-bold tracking-wider uppercase text-sm">Collection Boston</span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-7xl font-black text-white mb-4 tracking-tight"
          >
            STYLE <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-orange-300">ICONIQUE</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl text-amber-100 max-w-2xl mx-auto"
          >
            Le modèle légendaire Birkenstock
          </motion.p>
        </div>
      </div>
    </section>
  );
};

export default BostonHeroSection;
