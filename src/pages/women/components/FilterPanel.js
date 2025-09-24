import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const FilterPanel = ({ isOpen, onClose, children }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-40 backdrop-blur-sm"
            onClick={onClose}
          />
          
          {/* Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed top-0 right-0 h-full w-80 max-w-full bg-white dark:bg-gray-900 shadow-xl z-50 overflow-auto"
          >
            <div className="p-4">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">Filtres</h3>
                <motion.button 
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white"
                  onClick={onClose}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X size={24} />
                </motion.button>
              </div>
              
              <div className="space-y-6">
                {/* Catégorie */}
                <div>
                  <h4 className="text-sm uppercase font-semibold text-gray-500 dark:text-gray-400 mb-3">Catégorie</h4>
                  <div className="space-y-2">
                    {/* Contenu des filtres inséré ici via children */}
                    {children}
                  </div>
                </div>
                
                {/* Autres filtres potentiels */}
                <div>
                  <h4 className="text-sm uppercase font-semibold text-gray-500 dark:text-gray-400 mb-3">Prix</h4>
                  <div>
                    <input 
                      type="range" 
                      min="0" 
                      max="100" 
                      className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer dark:bg-blue-900"
                    />
                    <div className="flex justify-between mt-2">
                      <span className="text-sm text-gray-600 dark:text-gray-400">0 DA</span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">20,000 DA</span>
                    </div>
                  </div>
                </div>
                
                {/* Bouton d'application */}
                <motion.button
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-full"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onClose}
                >
                  Appliquer les filtres
                </motion.button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default FilterPanel;