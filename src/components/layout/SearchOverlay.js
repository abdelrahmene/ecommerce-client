import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, Loader } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useProductSearch } from '../../hooks/useProducts';
import cloudinaryService from '../../services/cloudinary/cloudinary';

const SearchOverlay = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const inputRef = useRef(null);
  const { results, loading } = useProductSearch(debouncedQuery);
  
  // Focus input when overlay opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);
  
  // Close on ESC key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleEsc);
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);
  
  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);
    
    return () => {
      clearTimeout(timer);
    };
  }, [query]);
  
  // Overlay animation variants
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.2 }
    },
    exit: { 
      opacity: 0,
      transition: { duration: 0.2 }
    }
  };
  
  // Container animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.3,
        delay: 0.1
      }
    },
    exit: {
      opacity: 0,
      y: -30,
      transition: { duration: 0.2 }
    }
  };
  
  // Result item animation variants
  const resultVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: (i) => ({ 
      opacity: 1, 
      y: 0,
      transition: { 
        delay: i * 0.05,
        duration: 0.3
      }
    })
  };
  
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-start justify-center pt-24 px-4"
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={onClose}
        >
          <motion.div 
            className="w-full max-w-3xl bg-white dark:bg-secondary-900 rounded-xl shadow-2xl overflow-hidden"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search input */}
            <div className="relative">
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Rechercher des produits..."
                className="w-full py-4 px-12 text-lg bg-white dark:bg-secondary-900 border-b border-gray-200 dark:border-secondary-800 focus:outline-none"
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <button 
                onClick={onClose} 
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                <X size={20} />
              </button>
            </div>
            
            {/* Results */}
            <div className="max-h-[60vh] overflow-y-auto py-2">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader className="animate-spin text-primary-500" size={30} />
                </div>
              ) : results.length > 0 ? (
                <div className="divide-y divide-gray-200 dark:divide-secondary-800">
                  {results.map((product, index) => (
                    <motion.div
                      key={product.id}
                      custom={index}
                      variants={resultVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      <Link 
                        to={`/product/${product.id}`} 
                        onClick={onClose}
                        className="flex items-center p-4 hover:bg-gray-50 dark:hover:bg-secondary-800 transition-colors"
                      >
                        <img 
                          src={product.images && product.images.length > 0 
                            ? cloudinaryService.getThumbnailUrl(product.images[0], 80) 
                            : '/placeholder-product.jpg'
                          } 
                          alt={product.name}
                          className="w-16 h-16 object-cover rounded-md"
                        />
                        <div className="ml-4 flex-1">
                          <h4 className="font-medium text-gray-900 dark:text-white">{product.name}</h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">{product.description}</p>
                          <div className="mt-1 font-medium text-primary-600 dark:text-primary-400">
                            {product.price.toLocaleString('fr-DZ')} DA
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              ) : query.length > 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 dark:text-gray-400">Aucun résultat pour "{query}"</p>
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500 dark:text-gray-400">Commencez à taper pour rechercher des produits</p>
                </div>
              )}
            </div>
            
            {/* Quick suggestions */}
            {!query && (
              <div className="p-4 bg-gray-50 dark:bg-secondary-800">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Recherches populaires</h3>
                <div className="flex flex-wrap gap-2">
                  {['Chaussures', 'Smartphones', 'Vêtements', 'Montres', 'Électronique'].map((term) => (
                    <button
                      key={term}
                      onClick={() => setQuery(term)}
                      className="px-3 py-1.5 text-sm bg-white dark:bg-secondary-900 rounded-full border border-gray-200 dark:border-secondary-700 hover:border-primary-500 dark:hover:border-primary-500 transition-colors"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SearchOverlay;