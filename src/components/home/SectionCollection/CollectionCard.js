import React from 'react';
import { motion } from 'framer-motion';
import { cardVariants } from './animations';

const CollectionCard = ({ collection, isActive }) => {
  const { name, imageUrl, description } = collection || {};

  if (!collection) return null;

  return (
    <motion.div 
      className="relative h-full overflow-hidden"
      animate={{
        scale: isActive ? 1 : 0.95,
        opacity: isActive ? 1 : 0.7
      }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <motion.div
        className="absolute inset-0 bg-center bg-cover bg-no-repeat"
        style={{ backgroundImage: `url(${imageUrl})` }}
        initial={{ scale: 1.2 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      />
      <motion.div 
        className="absolute inset-0 bg-black/20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      />
      {/* Contenu */}
      <motion.div
        className="relative h-full flex flex-col justify-end p-6 md:p-8 lg:p-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        {/* Badge */}
        <motion.div 
          className="mb-auto"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <motion.span 
            className="inline-block px-4 py-1.5 rounded-full text-xs font-medium bg-white/10 backdrop-blur-sm text-white/90 uppercase tracking-wider"
            whileHover={{ scale: 1.05, backgroundColor: 'rgba(255, 255, 255, 0.15)' }}
          >
            Collection
          </motion.span>
        </motion.div>

        {/* Titre et Description */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <motion.h3 
            className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4 tracking-tight"
            layout
          >
            {name}
          </motion.h3>
          <motion.p 
            className="text-base md:text-lg text-gray-300 mb-8 leading-relaxed max-w-lg"
            layout
          >
            {description}
          </motion.p>

          {/* Bouton */}
          <motion.button
            className="group/btn inline-flex items-center justify-center px-8 py-4 rounded-full bg-white text-gray-900 font-medium text-base hover:bg-opacity-90 transition-all duration-300"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
            layout
          >
            <motion.span 
              className="mr-3"
              layout
            >
              Découvrir
            </motion.span>
            <motion.svg 
              className="w-5 h-5 transform transition-transform duration-300" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
              animate={{ x: 0 }}
              whileHover={{ x: 4 }}
            >
              <motion.path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M9 5l7 7-7 7" 
              />
            </motion.svg>
          </motion.button>
        </motion.div>
      </motion.div>

      {/* Effet de bordure active */}
      {isActive && (
        <motion.div
          className="absolute inset-0 rounded-2xl"
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          <motion.div 
            className="absolute inset-0 rounded-2xl ring-2 ring-white/30"
            animate={{ 
              scale: [1, 1.02, 1],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          />
        </motion.div>
      )}
    </motion.div>
  );
};

export default CollectionCard;