import React from 'react';
import { motion } from 'framer-motion';

const QuantitySelector = ({ quantity, handleQuantityChange }) => {
  return (
    <div className="flex items-center">
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => handleQuantityChange(-1)}
        disabled={quantity <= 1}
        className={`w-10 h-10 flex items-center justify-center rounded-l-lg ${
          quantity <= 1 
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-800 dark:text-gray-600' 
            : 'bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
        } transition-colors`}
      >
        <span className="text-xl font-bold">-</span>
      </motion.button>
      
      <div className="w-16 h-10 flex items-center justify-center bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white font-medium">
        {quantity}
      </div>
      
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => handleQuantityChange(1)}
        disabled={quantity >= 10}
        className={`w-10 h-10 flex items-center justify-center rounded-r-lg ${
          quantity >= 10 
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-800 dark:text-gray-600' 
            : 'bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
        } transition-colors`}
      >
        <span className="text-xl font-bold">+</span>
      </motion.button>
    </div>
  );
};

export default QuantitySelector;