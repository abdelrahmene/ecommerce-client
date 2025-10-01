import React from 'react';
import { motion } from 'framer-motion';
import { Package } from 'lucide-react';
import { getImageUrl } from '../../../config/api';

const SubCategoryCard = ({ subCategory, index, onClick }) => {
  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.03, y: -5 }}
      onClick={onClick}
      className="relative w-full h-72 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 group"
    >
      {/* Image Background */}
      {subCategory.image ? (
        <>
          <img
            src={getImageUrl(subCategory.image)}
            alt={subCategory.name}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        </>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900">
          <motion.div 
            className="absolute inset-0 opacity-30"
            initial={{ backgroundPosition: '0% 0%' }}
            animate={{ backgroundPosition: ['0% 0%', '100% 100%'] }}
            transition={{ duration: 20, repeat: Infinity, repeatType: 'reverse' }}
            style={{
              backgroundImage: 'radial-gradient(circle at center, white 1px, transparent 1px)',
              backgroundSize: '30px 30px',
            }}
          />
        </div>
      )}

      {/* Content */}
      <div className="relative h-full flex flex-col justify-end p-6 text-left">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 + 0.2 }}
          className="flex items-center mb-3"
        >
          <Package className="w-6 h-6 text-blue-400 mr-2" />
          <span className="text-blue-400 font-semibold text-sm tracking-wider uppercase">Catégorie</span>
        </motion.div>
        
        <motion.h3
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 + 0.3 }}
          className="text-2xl md:text-3xl font-black text-white mb-2 tracking-tight"
        >
          {subCategory.name}
        </motion.h3>
        
        {subCategory.description && (
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 + 0.4 }}
            className="text-gray-200 text-sm line-clamp-2"
          >
            {subCategory.description}
          </motion.p>
        )}

        {/* Animated Arrow */}
        <motion.div
          className="absolute bottom-6 right-6 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center"
          whileHover={{ scale: 1.2, backgroundColor: 'rgba(255,255,255,0.3)' }}
        >
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </motion.div>
      </div>

      {/* Shine Effect */}
      <motion.div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%)',
        }}
        animate={{
          x: ['-100%', '200%'],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          repeatDelay: 3,
        }}
      />
    </motion.button>
  );
};

export default SubCategoryCard;
