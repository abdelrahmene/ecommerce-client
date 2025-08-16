import React from 'react';
import { motion } from 'framer-motion';

const SliderControls = ({ scrollSnaps, activeIndex, scrollTo }) => {
  return (
    <div className="flex justify-center items-center gap-2 mt-4">
      {scrollSnaps.map((_, idx) => (
        <motion.button
          key={idx}
          className={`
            w-2 h-2 rounded-full transition-all duration-300
            ${activeIndex === idx 
              ? 'bg-white w-6' 
              : 'bg-white/40 hover:bg-white/60'}
          `}
          onClick={() => scrollTo(idx)}
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
        />
      ))}
    </div>
  );
};

export default SliderControls;