import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Star } from 'lucide-react';

const KidsHeroSection = ({ theme }) => {
  return (
    <section className="relative h-[400px] overflow-hidden bg-gradient-to-br from-green-100 via-blue-100 to-yellow-100 dark:from-green-900 dark:via-blue-900 dark:to-yellow-900">
      {/* Playful animated shapes */}
      <motion.div
        className="absolute top-10 left-20 w-20 h-20"
        animate={{
          rotate: [0, 360],
          y: [0, -20, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <Star className="w-full h-full text-yellow-400 fill-yellow-400" />
      </motion.div>
      
      <motion.div
        className="absolute top-40 right-32 w-16 h-16"
        animate={{
          rotate: [0, -360],
          scale: [1, 1.3, 1],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <Heart className="w-full h-full text-red-400 fill-red-400" />
      </motion.div>

      {/* Bouncing circles */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className={`absolute w-12 h-12 rounded-full ${
            i % 3 === 0 ? 'bg-green-400/40' : 
            i % 3 === 1 ? 'bg-blue-400/40' : 
            'bg-orange-400/40'
          }`}
          style={{
            left: `${10 + i * 12}%`,
            bottom: -50,
          }}
          animate={{
            y: [-50, -300, -50],
          }}
          transition={{
            duration: 3 + i * 0.5,
            repeat: Infinity,
            delay: i * 0.3,
            ease: "easeInOut"
          }}
        />
      ))}

      <div className="relative h-full flex items-center justify-center">
        <div className="text-center px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, type: "spring" }}
            className="flex items-center justify-center mb-4"
          >
            <Star className="w-6 h-6 text-green-600 dark:text-green-300 mr-2 fill-green-600 dark:fill-green-300" />
            <span className="text-green-600 dark:text-green-300 font-bold tracking-wider uppercase text-sm">Collection Enfant</span>
            <Heart className="w-6 h-6 text-green-600 dark:text-green-300 ml-2 fill-green-600 dark:fill-green-300" />
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-7xl font-black text-gray-900 dark:text-white mb-4 tracking-tight"
          >
            AVENTURE <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 via-blue-600 to-orange-600">COLORÉE</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl text-gray-700 dark:text-gray-200 max-w-2xl mx-auto font-medium"
          >
            Confort et joie pour les petits explorateurs
          </motion.p>
        </div>
      </div>
    </section>
  );
};

export default KidsHeroSection;
