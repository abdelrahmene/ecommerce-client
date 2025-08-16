import React from 'react';
import { motion } from 'framer-motion';

const CollectionControls = ({ scrollSnaps, activeIndex, scrollTo }) => {
  return (
    <div className="absolute bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 flex items-center space-x-2 gap-2 md:gap-3 z-20">
      {scrollSnaps.map((_, idx) => (
        <motion.button
          key={idx}
          className={`
            relative h-3 rounded-full bg-white/10 backdrop-blur-lg overflow-hidden
            ${idx === activeIndex ? 'w-12' : 'w-3'}
            hover:bg-white/20 transition-colors
          `}
          onClick={() => scrollTo(idx)}
          whileHover={{ scale: 1.1 }}
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500"
            initial={false}
            animate={{
              opacity: idx === activeIndex ? 1 : 0,
              scale: idx === activeIndex ? 1 : 0.5
            }}
            transition={{ duration: 0.3 }}
          />
        </motion.button>
      ))}
    </div>
  );
};

export default CollectionControls;