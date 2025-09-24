import React from 'react';
import { motion } from 'framer-motion';
import { Filter, ChevronDown } from 'lucide-react';

const CategoryFilters = ({ 
  categories, 
  activeCategory, 
  setActiveCategory, 
  filtersOpen, 
  setFiltersOpen 
}) => {
  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        {/* Title and Filter Toggle */}
        <div className="flex justify-between items-center mb-8">
          <motion.h2 
            className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white relative inline-block"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Nos modèles pour homme
            <motion.div 
              className="absolute -bottom-2 left-0 h-1 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ duration: 0.8, delay: 0.3 }}
            />
          </motion.h2>
          
          <motion.button
            className="flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-full text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            onClick={() => setFiltersOpen(!filtersOpen)}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Filter size={16} />
            <span>Filtres</span>
            <motion.div
              animate={{ rotate: filtersOpen ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <ChevronDown size={16} />
            </motion.div>
          </motion.button>
        </div>
        
        {/* Categories */}
        <motion.div
          className="mb-8 overflow-x-auto pb-2 hide-scrollbar"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="flex space-x-2 min-w-max">
            {categories.map((category) => (
              <motion.button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                  activeCategory === category.id
                    ? 'bg-blue-100 dark:bg-blue-600 text-blue-700 dark:text-white shadow-md'
                    : 'text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-blue-700/50 border border-gray-200 dark:border-transparent'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {category.name}
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CategoryFilters;