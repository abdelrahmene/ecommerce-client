import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ArrowRight } from 'lucide-react';

const HeroSection = ({ theme }) => {
  const [heroRef, heroInView] = useInView({
    threshold: 0.3,
    triggerOnce: false
  });

  return (
    <motion.section 
      ref={heroRef}
      className="relative w-full h-[70vh] overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Background Image avec Parallax */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute inset-0 opacity-80"
          style={{
            backgroundImage: "url('https://www.birkenstock.com/on/demandware.static/-/Sites-Birkenstock-Library/default/dw7d8e8d8f/menu/2023/SS23/Menu_Men_SS23.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center 30%",
            filter: theme === 'dark' ? 'brightness(0.7)' : 'none'
          }}
          animate={{
            y: heroInView ? [0, -20] : 0
          }}
          transition={{
            y: {
              duration: 8,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut"
            }
          }}
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-70" />
      </div>
      
      {/* Hero Content */}
      <div className="relative h-full container mx-auto px-4 flex flex-col justify-center">
        <motion.div
          className="max-w-2xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <motion.h1 
            className="text-4xl md:text-6xl font-bold text-white mb-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Collection Homme
            <div className="h-1 w-24 bg-gradient-to-r from-blue-400 to-indigo-600 mt-2 rounded-full"></div>
          </motion.h1>
          
          <motion.p 
            className="text-lg md:text-xl text-gray-200 mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            Découvrez notre collection exclusive de chaussures pour hommes, alliant style et confort.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-wrap gap-4"
          >
            <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full text-sm font-medium hover:from-blue-600 hover:to-indigo-700 transition-all shadow-lg shadow-blue-500/20 flex items-center space-x-2">
              <span>Découvrir la collection</span>
              <ArrowRight size={16} />
            </button>
            <button className="px-6 py-3 bg-white/10 backdrop-blur-md text-white rounded-full text-sm font-medium hover:bg-white/20 transition-all border border-white/20 flex items-center space-x-2">
              <span>Nouveautés</span>
              <ArrowRight size={16} />
            </button>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default HeroSection;