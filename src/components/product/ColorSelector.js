import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

const ColorSelector = ({ colors, selectedColor, setSelectedColor }) => {
  return (
    <div className="flex items-center gap-3">
      {colors.map((color, index) => (
        <motion.button
          key={index}
          onClick={() => setSelectedColor(color)}
          className={`relative w-8 h-8 rounded-full p-0.5 ${selectedColor.name === color.name ? 'ring-2 ring-offset-2 ring-gray-800 dark:ring-gray-200' : ''}`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <span 
            className="block w-full h-full rounded-full" 
            style={{ backgroundColor: color.value }}
          />
          {selectedColor.name === color.name && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <Check size={14} className="text-white drop-shadow-md" />
            </motion.div>
          )}
        </motion.button>
      ))}
    </div>
  );
};

export default ColorSelector;