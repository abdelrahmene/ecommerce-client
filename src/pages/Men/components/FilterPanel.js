import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const FilterPanel = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-xl p-4 mb-8 shadow-lg container mx-auto px-4"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-gray-900 dark:text-white">Affiner la recherche</h3>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white"
            >
              <X size={18} />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Price Range */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Prix</h4>
              <div className="flex items-center space-x-4">
                <input 
                  type="range" 
                  min="0" 
                  max="300" 
                  step="10" 
                  defaultValue="300"
                  className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap">0€ - 300€</span>
              </div>
            </div>
            
            {/* Colors */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Couleurs</h4>
              <div className="flex flex-wrap gap-2">
                {['Noir', 'Marron', 'Gris', 'Taupe', 'Blanc'].map((color) => (
                  <button 
                    key={color}
                    className="w-6 h-6 rounded-full border-2 border-white dark:border-gray-700 shadow-sm hover:scale-110 transition-transform"
                    style={{
                      background: 
                        color === 'Noir' ? '#111' : 
                        color === 'Marron' ? '#8B4513' : 
                        color === 'Gris' ? '#808080' : 
                        color === 'Taupe' ? '#483C32' : 
                        '#fff'
                    }}
                    title={color}
                  />
                ))}
              </div>
            </div>
            
            {/* Sizes */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Pointures</h4>
              <div className="flex flex-wrap gap-2">
                {[40, 41, 42, 43, 44, 45, 46].map((size) => (
                  <button 
                    key={size}
                    className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 dark:border-gray-600 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FilterPanel;