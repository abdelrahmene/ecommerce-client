import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart, Heart, Eye, Tag } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import { useWishlist } from '../../contexts/WishlistContext';
import cloudinaryService from '../../services/cloudinary/cloudinary';

const ProductCard = ({ product, index }) => {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  
  // Check if product is in wishlist
  const inWishlist = isInWishlist(product.id);
  
  // Check if product has a discount
  const hasDiscount = product.compareAtPrice && product.compareAtPrice > product.price;
  
  // Calculate discount percentage if there's a discount
  const discountPercentage = hasDiscount 
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100) 
    : 0;
  
  // Check if product is new (added in the last 7 days)
  const isNew = product.createdAt && (new Date() - new Date(product.createdAt)) / (1000 * 60 * 60 * 24) <= 7;
  
  // Animation variants for the card
  const cardVariants = {
    hidden: { 
      opacity: 0,
      y: 20 
    },
    visible: { 
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        delay: index * 0.1,
        ease: [0.25, 0.1, 0.25, 1.0]
      }
    },
    hover: {
      y: -8,
      transition: {
        duration: 0.3,
        ease: [0.25, 0.1, 0.25, 1.0]
      }
    }
  };
  
  // Animation variants for image
  const imageVariants = {
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.3,
        ease: [0.25, 0.1, 0.25, 1.0]
      }
    }
  };
  
  // Animation variants for the action buttons
  const buttonVariants = {
    hidden: { opacity: 0, y: 10 },
    hover: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.2,
        ease: [0.25, 0.1, 0.25, 1.0]
      }
    }
  };
  
  // Handler for adding product to cart
  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // If product has variants, navigate to product page instead
    if (product.variants && product.variants.length > 0) {
      // Navigate programmatically to product page
      window.location.href = `/product/${product.id}`;
      return;
    }
    
    // Add to cart with default quantity 1
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images && product.images.length > 0 ? product.images[0] : null,
      quantity: 1,
      stockQuantity: product.stockQuantity
    });
  };
  
  // Handler for toggling wishlist
  const handleWishlistToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (inWishlist) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images && product.images.length > 0 ? product.images[0] : null
      });
    }
  };
  
  return (
    <motion.div
      className="group"
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
    >
      <div className="bg-white dark:bg-secondary-900 rounded-xl shadow-sm hover:shadow-xl transition-shadow duration-300 h-full flex flex-col overflow-hidden">
        {/* Product image with badges */}
        <div className="relative pt-[100%] overflow-hidden">
          {/* Image principale avec lien vers le produit */}
          <div className="absolute inset-0">
            <div className="block h-full w-full">
              <motion.div className="h-full w-full" variants={imageVariants}>
                <Link to={`/product/${product.id}`} onClick={(e) => e.stopPropagation()} className="block h-full w-full">
                  <img
                    src={product.images && product.images.length > 0 
                      ? cloudinaryService.getOptimizedImageUrl(product.images[0], { width: 500 })
                      : '/placeholder-product.jpg'}
                    alt={product.name}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </Link>
              </motion.div>
            </div>
            
            {/* Status badges */}
            <div className="absolute top-2 left-2 flex flex-col gap-2">
              {hasDiscount && (
                <div className="bg-red-500 text-white text-xs font-medium px-2 py-1 rounded-md flex items-center">
                  <Tag size={12} className="mr-1" />
                  -{discountPercentage}%
                </div>
              )}
              
              {isNew && (
                <div className="bg-green-500 text-white text-xs font-medium px-2 py-1 rounded-md">
                  Nouveau
                </div>
              )}
              
              {(product.stockQuantity === 0 || product.status === 'out_of_stock') && (
                <div className="bg-gray-700 text-white text-xs font-medium px-2 py-1 rounded-md">
                  Rupture
                </div>
              )}
            </div>
            
            {/* Quick action buttons */}
            <div className="absolute bottom-2 right-2 flex flex-col gap-2">
              <motion.button
                onClick={handleWishlistToggle}
                variants={buttonVariants}
                className={`p-2 rounded-full shadow-md ${
                  inWishlist 
                    ? 'bg-red-500 text-white' 
                    : 'bg-white dark:bg-secondary-800 text-gray-700 dark:text-gray-200'
                }`}
                aria-label={inWishlist ? "Retirer des favoris" : "Ajouter aux favoris"}
              >
                <Heart size={16} fill={inWishlist ? "white" : "none"} />
              </motion.button>
              
              <motion.button
                onClick={handleAddToCart}
                variants={buttonVariants}
                disabled={product.stockQuantity === 0 || product.status === 'out_of_stock'}
                className="p-2 rounded-full shadow-md bg-primary-600 hover:bg-primary-700 text-white disabled:bg-gray-400 disabled:cursor-not-allowed"
                aria-label="Ajouter au panier"
              >
                <ShoppingCart size={16} />
              </motion.button>
              
              <motion.div variants={buttonVariants}>
                <Link 
                  to={`/product/${product.id}`} 
                  className="p-2 rounded-full shadow-md bg-white dark:bg-secondary-800 text-gray-700 dark:text-gray-200 inline-flex"
                  aria-label="Voir le produit"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Eye size={16} />
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
        
        {/* Product info */}
        <div className="p-4 flex flex-col flex-grow">
          <div className="flex-grow">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1 line-clamp-2">
              <Link to={`/product/${product.id}`} className="block hover:text-primary-600 dark:hover:text-primary-400 transition-colors" onClick={(e) => e.stopPropagation()}>
                {product.name}
              </Link>
            </h3>
            
            {product.collection && (
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-2 inline-block">
                <Link 
                  to={`/collections/${product.collection.id}`}
                  className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  {product.collection.name}
                </Link>
              </div>
            )}
            
            <div className="mt-auto">
              <div className="flex items-end gap-2">
                <span className="text-lg font-semibold text-gray-900 dark:text-white">
                  {product.price.toLocaleString('fr-DZ')} DA
                </span>
                
                {hasDiscount && (
                  <span className="text-sm text-gray-500 dark:text-gray-400 line-through">
                    {product.compareAtPrice.toLocaleString('fr-DZ')} DA
                  </span>
                )}
              </div>
              
              {product.variants && product.variants.length > 0 && (
                <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Plusieurs options disponibles
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;