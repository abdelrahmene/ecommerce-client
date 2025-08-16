import React from 'react';
import { motion } from 'framer-motion';

const SizeSelector = ({ sizes, selectedSize, setSelectedSize }) => {
  return (
    <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
      {sizes.map((size, index) => (
        <motion.button
          key={index}
          onClick={() => size.available && setSelectedSize(size)}
          disabled={!size.available}
          className={`
            py-2 px-3 rounded-lg text-center font-medium text-sm
            ${selectedSize?.value === size.value 
              ? 'bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900' 
              : size.available 
                ? 'bg-gray-100 text-gray-900 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700' 
                : 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-800 dark:text-gray-600'
            }
            transition-colors
          `}
          whileHover={size.available ? { scale: 1.05 } : {}}
          whileTap={size.available ? { scale: 0.95 } : {}}
        >
          {size.value}
        </motion.button>
      ))}
    </div>
  );
};

export default SizeSelector;