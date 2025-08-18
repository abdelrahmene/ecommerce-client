import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ChevronLeft, ChevronRight, ArrowRight, ShoppingBag, Heart } from 'lucide-react';
// Imports Firebase supprimés - utilise maintenant des données mock
import cloudinaryService from '../../services/cloudinary/cloudinary';
import { useCart } from '../../contexts/CartContext';
import { useWishlist } from '../../contexts/WishlistContext';

const FeaturedProducts = ({ products: propProducts, loading: propLoading }) => {
  // État pour stocker les produits
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Styles pour les produits
  const productStyles = [
    {
      id: 'summer-splash',
      name: 'Summer Splash',
      category: 'Sandales',
      price: 149.95,
      compareAtPrice: 179.00,
      description: 'Sandales ultra-colorées pour un été vibrant et plein d\'audace',
      colors: ['Turquoise', 'Orange', 'Jaune'],
      image: '/images/products/arizona.png',
      link: '/shop/summer/splash',
      isNew: true,
      accent: 'bg-cyan-400 dark:bg-cyan-600',
      bg: 'bg-gradient-to-br from-cyan-100 to-blue-200 dark:from-cyan-900 dark:to-blue-900',
      textColor: 'text-gray-900 dark:text-cyan-100'
    },
    {
      id: 'pink-paradise',
      name: 'Pink Paradise',
      category: 'Mules',
      price: 159.00,
      description: 'L\'audace du rose dans une version été qui ne passe pas inaperçue',
      colors: ['Rose', 'Fuchsia', 'Violet'],
      image: '/images/products/boston.png',
      link: '/shop/summer/pink-paradise',
      isExclusive: true,
      accent: 'bg-pink-400 dark:bg-pink-700',
      bg: 'bg-gradient-to-br from-pink-100 to-fuchsia-200 dark:from-pink-900 dark:to-fuchsia-900',
      textColor: 'text-gray-900 dark:text-pink-100'
    },
    {
      id: 'sunset-vibes',
      name: 'Sunset Vibes',
      category: 'Sandales',
      price: 169.95,
      description: 'Capturez la magie du coucher de soleil avec cette édition limitée',
      colors: ['Orange', 'Jaune', 'Rouge'],
      image: '/images/products/gizeh.png',
      link: '/shop/summer/sunset',
      isNew: true,
      accent: 'bg-orange-400 dark:bg-orange-700',
      bg: 'bg-gradient-to-br from-yellow-100 to-orange-200 dark:from-yellow-900 dark:to-orange-900',
      textColor: 'text-gray-900 dark:text-orange-100'
    },
    {
      id: 'night-glow',
      name: 'Night Glow',
      category: 'Mules',
      price: 179.95,
      description: 'Pour les soirées d\'été, une touche de luminosité dans la nuit',
      colors: ['Violet', 'Indigo', 'Bleu'],
      image: '/images/products/madrid.png',
      link: '/shop/summer/night-glow',
      isExclusive: true,
      accent: 'bg-violet-500 dark:bg-violet-800',
      bg: 'bg-gradient-to-br from-violet-100 to-purple-200 dark:from-violet-900 dark:to-purple-900',
      textColor: 'text-gray-900 dark:text-violet-100'
    }
  ];
  
  // Utiliser les produits passés par props ou charger depuis Firestore si non fournis
  useEffect(() => {
    if (propProducts && propProducts.length > 0) {
      // Utiliser les produits passés par props
      const styledProducts = propProducts.map((product, index) => {
        // Trouver un style correspondant ou utiliser un style par défaut
        const style = productStyles[index % productStyles.length];
        
        return {
          ...product,
          accent: style.accent,
          bg: style.bg,
          textColor: style.textColor,
          // S'assurer que l'image est correctement formatée pour l'affichage
          displayImage: product.images && product.images.length > 0 
            ? product.images[0] 
            : style.image
        };
      });
      
      setProducts(styledProducts);
      setLoading(propLoading);
    } else {
      // Si aucun produit n'est fourni, charger depuis Firestore
      const fetchProducts = async () => {
        try {
          setLoading(true);
          
          // Mock: Simuler le chargement depuis une base de données
          await new Promise(resolve => setTimeout(resolve, 500));
          const mockFeaturedProducts = productStyles.filter(p => p.isNew || p.isExclusive);
          
          // Mock: Utiliser les produits par défaut avec styles
          setProducts(mockFeaturedProducts.length > 0 ? mockFeaturedProducts : productStyles);
        } catch (error) {
          console.error('Erreur lors de la récupération des produits:', error);
          // En cas d'erreur, utiliser les produits par défaut
          setProducts(productStyles);
        } finally {
          setLoading(false);
        }
      };
      
      fetchProducts();
    }
  }, [propProducts, propLoading]);
  
  // Référence pour le scroll horizontal
  const scrollContainerRef = useRef(null);
  
  // Use IntersectionObserver to trigger animations when component comes into view
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });
  
  // Hooks pour le panier et la liste de souhaits
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  
  // Container animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };
  
  // Item animation variants
  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1]
      }
    }
  };
  
  // Fonctions pour le scroll horizontal
  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -350, behavior: 'smooth' });
    }
  };
  
  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 350, behavior: 'smooth' });
    }
  };
  
  return (
    <section className="py-24 relative overflow-hidden bg-gradient-to-b from-white to-zinc-50 dark:from-secondary-900 dark:to-secondary-950">
      {/* Motifs d'été en arrière-plan */}
      <div className="absolute inset-0 opacity-5 dark:opacity-10">
        <div className="absolute top-40 right-10 w-60 h-60 rounded-full bg-orange-400 blur-3xl"></div>
        <div className="absolute bottom-40 left-10 w-40 h-40 rounded-full bg-pink-400 blur-3xl"></div>
        <div className="absolute top-1/3 left-1/3 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-cyan-400 blur-3xl opacity-30"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <motion.div 
          ref={ref}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={containerVariants}
          className="space-y-12"
        >
          {/* Section header avec style badass */}
          <motion.div variants={itemVariants} className="max-w-3xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-block mb-4">
                <motion.span 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.4 }}
                  className="px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-lg"
                >
                  Hot Summer 2025
                </motion.span>
              </div>
              
              <motion.h2 
                className="text-3xl md:text-5xl font-extrabold mb-6 bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 bg-clip-text text-transparent"
              >
                PRODUITS TENDANCE ÉTÉ
              </motion.h2>
              
              <motion.div 
                className="h-1 w-24 mx-auto rounded-full bg-gradient-to-r from-orange-500 to-pink-500 mb-6"
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
              ></motion.div>
              
              <p className="text-lg text-gray-600 dark:text-gray-300 text-center max-w-2xl mx-auto">
                Découvrez notre sélection ultra-tendance pour un été vibrant et coloré
              </p>
            </div>
          </motion.div>
          
          {/* Horizontal scrollable products with navigation */}
          <motion.div 
            className="relative"
            variants={itemVariants}
          >
            {/* Navigation buttons */}
            <div className="absolute -left-5 top-1/2 transform -translate-y-1/2 z-10">
              <button 
                onClick={scrollLeft}
                className="p-3 rounded-full bg-gradient-to-r from-pink-500 to-orange-500 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
                aria-label="Scroll left"
              >
                <ChevronLeft className="w-6 h-6 text-white" />
              </button>
            </div>
            
            <div className="absolute -right-5 top-1/2 transform -translate-y-1/2 z-10">
              <button 
                onClick={scrollRight}
                className="p-3 rounded-full bg-gradient-to-r from-orange-500 to-pink-500 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
                aria-label="Scroll right"
              >
                <ChevronRight className="w-6 h-6 text-white" />
              </button>
            </div>
            
            {/* Scrollable products container */}
            <div 
              ref={scrollContainerRef}
              className="overflow-x-auto hide-scrollbar py-8 px-4"
              style={{ scrollBehavior: 'smooth' }}
            >
              <div className="flex space-x-6" style={{ minWidth: 'max-content' }}>
                {products.map((product) => (
                  <motion.div
                    key={product.id}
                    className="flex-shrink-0 w-[300px] group"
                    whileHover={{ y: -10 }}
                    transition={{ duration: 0.4 }}
                  >
                    <Link to={product.link} className="block">
                      <div className="summer-card rounded-2xl overflow-hidden shadow-lg transition-all duration-500 group-hover:shadow-2xl h-full flex flex-col">
                        {/* Product image avec overlay gradient */}
                        <div className="relative aspect-[4/3] overflow-hidden">
                          <img
                            src={product.displayImage ? 
                              (typeof product.displayImage === 'string' ? 
                                cloudinaryService.getOptimizedImageUrl(product.displayImage, { width: 500 }) : 
                                product.displayImage) : 
                              product.image}
                            alt={product.name}
                            className="h-full w-full object-cover rounded-lg"
                            loading="lazy"
                          />
                          
                          {/* Overlay gradient badass */}
                          <div className={`absolute inset-0 opacity-0 ${product.bg} mix-blend-overlay transition-opacity duration-300 group-hover:opacity-30`}></div>
                          
                          {/* Badges summer badass */}
                          <div className="absolute top-3 left-3 flex flex-col gap-2">
                            {product.isNew && (
                              <span className={`${product.accent} text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg`}>
                                NEW
                              </span>
                            )}
                            {product.isExclusive && (
                              <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                                EXCLUSIF
                              </span>
                            )}
                          </div>
                          
                          {/* Quick actions badass */}
                          <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-x-2 group-hover:translate-x-0">
                            <button 
                              className="p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-all duration-300 hover:scale-110 shadow-lg"
                              aria-label="Add to wishlist"
                            >
                              <Heart className="w-4 h-4 text-pink-500" />
                            </button>
                            <button 
                              className="p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-all duration-300 hover:scale-110 shadow-lg"
                              aria-label="Quick add to cart"
                            >
                              <ShoppingBag className="w-4 h-4 text-purple-500" />
                            </button>
                          </div>
                        </div>
                        
                        {/* Product info avec style badass */}
                        <div className={`p-5 flex flex-col flex-grow bg-white dark:bg-secondary-900`}>
                          <div className="mb-2 flex items-center justify-between">
                            <span className={`text-sm font-bold px-2 py-0.5 rounded-full ${product.accent} text-white`}>
                              {product.category}
                            </span>
                            <div className="flex items-center">
                              <span className="text-sm font-bold bg-gradient-to-r from-pink-500 to-orange-500 bg-clip-text text-transparent">
                                {product.price.toFixed(2)} €
                              </span>
                              {product.compareAtPrice && (
                                <span className="ml-2 text-xs line-through text-gray-400">
                                  {product.compareAtPrice.toFixed(2)} €
                                </span>
                              )}
                            </div>
                          </div>
                          
                          <h3 className="text-lg font-extrabold text-gray-900 dark:text-white mb-2">
                            {product.name}
                          </h3>
                          
                          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2 flex-grow">
                            {product.description}
                          </p>
                          
                          {/* Color options avec style badass */}
                          {product.colors && product.colors.length > 0 && (
                            <div className="mt-auto">
                              <div className="flex items-center space-x-2">
                                {product.colors.map((color, i) => (
                                  <div 
                                    key={i}
                                    className="w-4 h-4 rounded-full border-2 border-white shadow-md transition-transform duration-300 hover:scale-125 cursor-pointer"
                                    style={{ 
                                      backgroundColor: color.toLowerCase() === 'turquoise' ? '#06B6D4' : 
                                                     color.toLowerCase() === 'orange' ? '#F97316' :
                                                     color.toLowerCase() === 'jaune' ? '#FACC15' :
                                                     color.toLowerCase() === 'rose' ? '#EC4899' :
                                                     color.toLowerCase() === 'fuchsia' ? '#D946EF' :
                                                     color.toLowerCase() === 'violet' ? '#8B5CF6' :
                                                     color.toLowerCase() === 'indigo' ? '#6366F1' :
                                                     color.toLowerCase() === 'bleu' ? '#3B82F6' :
                                                     color.toLowerCase() === 'rouge' ? '#EF4444' : '#ddd'
                                    }}
                                  />
                                ))}
                                <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                                  {product.colors.length} {product.colors.length > 1 ? 'couleurs' : 'couleur'}
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
          
          {/* View all products button avec style badass */}
          <motion.div 
            variants={itemVariants}
            className="flex justify-center mt-12"
          >
            <Link 
              to="/shop"
              className="summer-button group inline-flex items-center bg-gradient-to-r from-pink-500 to-orange-500 text-white font-bold rounded-full px-8 py-4 shadow-lg transition-all duration-300 hover:shadow-xl hover:translate-y-[-4px]"
            >
              <span>VOIR TOUS LES PRODUITS</span>
              <motion.div
                className="ml-2"
                initial={{ x: 0 }}
                animate={{ x: 0 }}
                whileHover={{ x: 5 }}
                transition={{ duration: 0.3 }}
              >
                <ArrowRight size={18} />
              </motion.div>
            </Link>
          </motion.div>
          
          {/* Badge flottant badass */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
            animate={inView ? { opacity: 1, scale: 1, rotate: 0 } : { opacity: 0, scale: 0.8, rotate: 5 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="absolute bottom-10 left-10 bg-gradient-to-r from-orange-400 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg transform -rotate-3 hidden lg:block"
          >
            ⚡️ HOT SUMMER ⚡️
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedProducts;