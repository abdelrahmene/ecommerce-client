import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye } from 'lucide-react';

const ProductCard = ({ product, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const productUrl = `/product/${product.id}`;
  
  return (
    <Link to={productUrl} className="block h-full">
      <motion.div 
        className="group relative overflow-hidden rounded-xl bg-gradient-to-b from-gray-900 to-black border border-gray-800 shadow-xl h-full flex flex-col"
        initial={{ opacity: 0, y: 20 }}
        animate={{ 
          opacity: 1, 
          y: 0,
          transition: { 
            delay: index * 0.1,
            duration: 0.5 
          }
        }}
        whileTap={{ scale: 0.98 }}
        whileHover={{ y: -3, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.8)' }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Image avec effet de zoom */}
        <div className="aspect-[4/5] overflow-hidden">
          <motion.div
            className="relative h-full w-full"
            animate={{ scale: isHovered ? 1.05 : 1 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <img 
              src={product.images && product.images.length > 0 
                ? (typeof product.images[0] === 'string' 
                  ? product.images[0] 
                  : (product.images[0]?.url || '/placeholder.jpg')) 
                : '/placeholder.jpg'} 
              alt={product.name} 
              className="h-full w-full object-cover"
              loading="lazy"
            />
            
            {/* Overlay avec dégradé */}
            <motion.div 
              className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"
              initial={{ opacity: 0.5 }}
              animate={{ opacity: isHovered ? 0.8 : 0.5 }}
              transition={{ duration: 0.3 }}
            />
          </motion.div>
        </div>
        
        {/* Infos produit */}
        <div className="p-3 flex-grow flex flex-col justify-between">
          <motion.h3 
            className="text-base md:text-lg font-bold text-white group-hover:text-blue-400 transition-colors"
            animate={{ y: isHovered ? -5 : 0 }}
            transition={{ duration: 0.3 }}
          >
            {product.name}
          </motion.h3>
          
          <div className="mt-auto pt-2 flex items-center justify-between">
            <motion.p 
              className="text-base font-bold text-blue-400"
              animate={{ scale: isHovered ? 1.05 : 1 }}
              transition={{ duration: 0.2 }}
            >
              {product.price && product.price.toFixed(2)} DA
            </motion.p>
          </div>
          
          {/* Couleurs disponibles */}
          {product.colorDetails && product.colorDetails.length > 0 && (
            <motion.div 
              className="mt-2 flex flex-wrap gap-1.5"
              animate={{ y: isHovered ? -3 : 0, opacity: isHovered ? 1 : 0.9 }}
              transition={{ duration: 0.3 }}
            >
              {product.colorDetails.map((color, i) => (
                <motion.div 
                  key={i}
                  className="h-5 w-5 rounded-full shadow-md border border-gray-700"
                  style={{ backgroundColor: color.hex || '#000' }}
                  title={color.name}
                  whileHover={{ scale: 1.2, y: -2 }}
                  transition={{ duration: 0.2 }}
                />
              ))}
            </motion.div>
          )}
        </div>
        
        {/* Action rapide mobile */}
        <motion.div 
          className="absolute bottom-0 right-0 p-3 z-10 sm:hidden"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1 + 0.3, duration: 0.3 }}
        >
          <div className="bg-blue-600 hover:bg-blue-500 p-2 rounded-full shadow-lg">
            <Eye size={16} className="text-white" />
          </div>
        </motion.div>
      </motion.div>
    </Link>
  );
};

export default ProductCard;