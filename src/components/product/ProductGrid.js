import React from 'react';
import { motion } from 'framer-motion';
import ProductCard from './ProductCard';

const ProductGrid = ({ products, loading, emptyMessage = "Aucun produit trouvé" }) => {
  // Container animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  // Skeleton loader for products when loading
  const ProductSkeleton = () => (
    <div className="bg-white dark:bg-secondary-900 rounded-xl shadow-sm overflow-hidden animate-pulse">
      <div className="pt-[100%] relative bg-gray-200 dark:bg-secondary-800" />
      <div className="p-4">
        <div className="h-5 bg-gray-200 dark:bg-secondary-800 rounded w-2/3 mb-2" />
        <div className="h-4 bg-gray-200 dark:bg-secondary-800 rounded w-1/2 mb-4" />
        <div className="h-5 bg-gray-200 dark:bg-secondary-800 rounded w-1/3" />
      </div>
    </div>
  );
  
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
    >
      {loading ? (
        // Loading skeletons
        Array.from({ length: 8 }).map((_, index) => (
          <ProductSkeleton key={`skeleton-${index}`} />
        ))
      ) : products.length > 0 ? (
        // Product cards
        products.map((product, index) => (
          <ProductCard 
            key={product.id} 
            product={product} 
            index={index} 
          />
        ))
      ) : (
        // Empty state
        <div className="col-span-full py-16 text-center">
          <p className="text-gray-500 dark:text-gray-400">{emptyMessage}</p>
        </div>
      )}
    </motion.div>
  );
};

export default ProductGrid;