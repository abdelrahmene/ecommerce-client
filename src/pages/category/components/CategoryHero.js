import React from 'react';
import { motion } from 'framer-motion';

const CategoryHero = ({ categoryInfo }) => {
  return (
    <div className="relative h-[70vh] overflow-hidden">
      <motion.div
        className="absolute inset-0 z-0"
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.5 }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-gray-900 z-10"></div>
        <img 
          src={categoryInfo.heroImage}
          alt={categoryInfo.title} 
          className="w-full h-full object-cover"
        />
      </motion.div>
      
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-4">
        <motion.h1 
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-5xl md:text-7xl font-bold text-white mb-4 drop-shadow-lg"
        >
          {categoryInfo.title}
        </motion.h1>
        
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: '100px' }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className={`h-1 bg-gradient-to-r ${categoryInfo.color} mb-6 max-w-[100px]`}
        />
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.8 }}
          className="text-xl text-gray-200 max-w-2xl"
        >
          {categoryInfo.description}
        </motion.p>
      </div>
    </div>
  );
};

export default CategoryHero;