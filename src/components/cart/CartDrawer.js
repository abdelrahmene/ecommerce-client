import React from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingCart, Trash2, Plus, Minus, AlertCircle } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import cloudinaryService from '../../services/cloudinary/cloudinary';

const CartDrawer = ({ isOpen, onClose }) => {
  const { cartItems, updateQuantity, removeFromCart, cartTotal } = useCart();
  
  // Drawer animation variants
  const drawerVariants = {
    hidden: { x: '100%', opacity: 0.5 },
    visible: { 
      x: 0, 
      opacity: 1,
      transition: { 
        type: 'spring', 
        stiffness: 300, 
        damping: 30
      }
    },
    exit: { 
      x: '100%', 
      opacity: 0,
      transition: { 
        duration: 0.2,
        ease: 'easeInOut' 
      }
    }
  };
  
  // Overlay animation variants
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.3 }
    },
    exit: { 
      opacity: 0,
      transition: { duration: 0.2 }
    }
  };
  
  // Cart item animation variants
  const cartItemVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: (i) => ({ 
      opacity: 1, 
      x: 0,
      transition: { 
        delay: i * 0.1,
        duration: 0.3
      }
    }),
    exit: { 
      opacity: 0, 
      x: 20,
      transition: { duration: 0.2 }
    }
  };
  
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Background overlay */}
          <motion.div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClose}
          />
          
          {/* Drawer */}
          <motion.div 
            className="fixed top-0 right-0 h-full w-full sm:w-96 bg-white dark:bg-secondary-900 shadow-xl z-50 flex flex-col"
            variants={drawerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-secondary-800">
              <h2 className="text-xl font-medium flex items-center text-gray-900 dark:text-white">
                <ShoppingCart className="mr-2" size={20} />
                Panier
                <span className="ml-2 text-sm font-normal text-gray-500 dark:text-gray-400">
                  ({cartItems.length} {cartItems.length > 1 ? 'articles' : 'article'})
                </span>
              </h2>
              <button 
                onClick={onClose}
                className="p-2 rounded-full text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-secondary-800 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            {/* Cart items */}
            <div className="flex-grow overflow-y-auto py-2">
              {cartItems.length > 0 ? (
                <div className="divide-y divide-gray-200 dark:divide-secondary-800">
                  {cartItems.map((item, index) => (
                    <motion.div 
                      key={`${item.id}-${item.variant}`}
                      custom={index}
                      variants={cartItemVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="p-4"
                    >
                      <div className="flex items-start">
                        <Link 
                          to={`/product/${item.id}`} 
                          onClick={onClose}
                          className="flex-shrink-0 w-24 h-24 bg-gray-100 dark:bg-secondary-800 rounded-md overflow-hidden flex items-center justify-center p-1"
                        >
                          <img 
                            src={item.image ? cloudinaryService.getThumbnailUrl(item.image, 160) : '/placeholder-product.jpg'} 
                            alt={item.name}
                            className="max-w-full max-h-full object-contain"
                            onError={(e) => {
                              console.log('Erreur de chargement d\'image:', item.image);
                              e.target.src = '/placeholder-product.jpg';
                            }}
                          />
                        </Link>
                        
                        <div className="ml-4 flex-1">
                          <div className="flex justify-between">
                            <div>
                              <h3 className="text-base font-medium text-gray-900 dark:text-white">
                                <Link to={`/product/${item.id}`} onClick={onClose}>
                                  {item.name}
                                </Link>
                              </h3>
                              
                              {item.variant && (
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                  {Object.entries(item.variant).map(([key, value]) => (
                                    `${key.charAt(0).toUpperCase() + key.slice(1)}: ${value}`
                                  )).join(', ')}
                                </p>
                              )}
                              
                              <div className="font-medium text-primary-600 dark:text-primary-400 mt-1">
                                {item.price ? item.price.toLocaleString('fr-DZ') : '0'} DA
                              </div>
                            </div>
                            
                            <button
                              onClick={() => removeFromCart(item.id, item.variant)}
                              className="text-gray-400 hover:text-red-500 transition-colors"
                              aria-label="Supprimer du panier"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                          
                          {/* Quantity */}
                          <div className="mt-2 flex items-center">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1, item.variant)}
                              disabled={item.quantity <= 1}
                              className="p-1 rounded-md border border-gray-300 dark:border-secondary-700 text-gray-500 dark:text-gray-400 disabled:opacity-50"
                              aria-label="Diminuer la quantité"
                            >
                              <Minus size={14} />
                            </button>
                            
                            <span className="mx-2 w-10 text-center text-sm">
                              {item.quantity}
                            </span>
                            
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1, item.variant)}
                              disabled={item.quantity >= (item.stockQuantity || 99)}
                              className="p-1 rounded-md border border-gray-300 dark:border-secondary-700 text-gray-500 dark:text-gray-400 disabled:opacity-50"
                              aria-label="Augmenter la quantité"
                            >
                              <Plus size={14} />
                            </button>
                            
                            {item.quantity >= (item.stockQuantity || 99) && (
                              <span className="ml-2 text-xs text-amber-600 dark:text-amber-500 flex items-center">
                                <AlertCircle size={12} className="mr-1" />
                                Stock max
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full py-12 px-4 text-center">
                  <ShoppingCart size={48} className="text-gray-300 dark:text-gray-600 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Votre panier est vide</h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-6">Ajoutez des produits à votre panier pour commencer vos achats</p>
                  <Link
                    to="/shop"
                    onClick={onClose}
                    className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
                  >
                    Découvrir nos produits
                  </Link>
                </div>
              )}
            </div>
            
            {/* Footer with total and checkout button */}
            {cartItems.length > 0 && (
              <div className="border-t border-gray-200 dark:border-secondary-800 p-4 space-y-4">
                {/* Subtotal */}
                <div className="flex justify-between items-center">
                  <span className="text-base text-gray-700 dark:text-gray-300">Sous-total</span>
                  <span className="text-lg font-medium text-gray-900 dark:text-white">{cartTotal ? cartTotal.toLocaleString('fr-DZ') : '0'} DA</span>
                </div>
                
                {/* Shipping note */}
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Les frais de livraison seront calculés à l'étape suivante
                </p>
                
                {/* Checkout button */}
                <Link
                  to="/checkout"
                  onClick={onClose}
                  className="block w-full text-center py-3 px-4 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors"
                >
                  Passer à la caisse
                </Link>
                
                {/* Continue shopping */}
                <button
                  onClick={onClose}
                  className="block w-full text-center py-2 px-4 border border-gray-300 dark:border-secondary-700 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-secondary-800 transition-colors"
                >
                  Continuer les achats
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;