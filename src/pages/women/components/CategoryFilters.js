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
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl font-bold"
          >
            Femmes
          </motion.h2>
          
          {/* Filters toggle button for mobile/tablet */}
          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            onClick={() => setFiltersOpen(!filtersOpen)}
            className="flex items-center space-x-1 bg-blue-50 dark:bg-blue-900/30 px-3 py-2 rounded-full text-sm font-medium text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-800/50 transition-all duration-300"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <Filter size={16} className="mr-1.5" />
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