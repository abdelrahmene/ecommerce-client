import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Link } from 'react-router-dom';
import { Filter, SlidersHorizontal, ChevronDown, ArrowRight, X } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useCollections } from '../../hooks/useCollections';

// Fallback data pour les produits enfants si Firebase est vide
const kidsProducts = [
  {
    id: 'k1',
    name: 'Arizona Kids EVA',
    price: 39.99,
    category: 'sandales',
    colors: ['Bleu', 'Rose', 'Vert'],
    isNew: true,
    isBestseller: true,
    image: 'https://www.birkenstock.com/dw/image/v2/BDXC_PRD/on/demandware.static/-/Sites-master-catalog/default/dw4f283d3e/1018742/1018742.jpg',
    accent: 'from-blue-400 to-purple-500'
  },
  {
    id: 'k2',
    name: 'Gizeh Kids',
    price: 49.99,
    category: 'sandales',
    colors: ['Rose', 'Violet', 'Jaune'],
    isNew: true,
    isBestseller: false,
    image: 'https://www.birkenstock.com/dw/image/v2/BDXC_PRD/on/demandware.static/-/Sites-master-catalog/default/dw6f3d9da3/0560773/0560773.jpg',
    accent: 'from-pink-400 to-purple-500'
  },
  {
    id: 'k3',
    name: 'Rio Kids',
    price: 44.99,
    category: 'sandales',
    colors: ['Orange', 'Bleu', 'Vert'],
    isNew: false,
    isBestseller: true,
    image: 'https://www.birkenstock.com/dw/image/v2/BDXC_PRD/on/demandware.static/-/Sites-master-catalog/default/dw9f5d4e33/0034793/0034793.jpg',
    accent: 'from-orange-400 to-yellow-500'
  },
  {
    id: 'k4',
    name: 'Boston Kids',
    price: 69.99,
    category: 'sabots',
    colors: ['Rose', 'Bleu', 'Violet'],
    isNew: true,
    isBestseller: true,
    image: 'https://www.birkenstock.com/dw/image/v2/BDXC_PRD/on/demandware.static/-/Sites-master-catalog/default/dw4f283d3e/1018742/1018742.jpg',
    accent: 'from-pink-400 to-purple-500'
  },
  {
    id: 'k5',
    name: 'Bend Kids',
    price: 79.99,
    category: 'chaussures',
    colors: ['Bleu', 'Rose'],
    isNew: true,
    isBestseller: false,
    image: 'https://www.birkenstock.com/dw/image/v2/BDXC_PRD/on/demandware.static/-/Sites-master-catalog/default/dw6f3d9da3/0560773/0560773.jpg',
    accent: 'from-blue-400 to-purple-500'
  }
];

// Catégories pour enfants
const kidsCategories = [
  { id: 'all', name: 'Tous les produits' },
  { id: 'sandales', name: 'Sandales' },
  { id: 'sabots', name: 'Sabots' },
  { id: 'chaussures', name: 'Chaussures' },
  { id: 'bestsellers', name: 'Best-sellers' },
  { id: 'new', name: 'Nouveautés' }
];

// Animations
const fadeInUp = {
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

// Composant ProductCard avec un design ludique et coloré
const ProductCard = ({ product, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [cardRef, inView] = useInView({
    threshold: 0.2,
    triggerOnce: true
  });

  return (
    <Link to={`/product/${product.id}`} className="block">
      <motion.div
        ref={cardRef}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        variants={{
          hidden: { opacity: 0, y: 20, rotate: -5 },
          visible: {
            opacity: 1,
            y: 0,
            rotate: 0,
            transition: {
              duration: 0.6,
              delay: index * 0.2,
              ease: [0.16, 1, 0.3, 1]
            }
          }
        }}
        className="group relative transform transition-transform duration-300 hover:scale-105"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
      {/* Image Container avec overlay et animations */}
      <div className="aspect-[3/4] overflow-hidden rounded-2xl bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 shadow-xl">
        <div className="relative h-full w-full">
          <motion.img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover object-center"
            animate={{
              scale: isHovered ? 1.05 : 1,
              rotate: isHovered ? 2 : 0
            }}
            transition={{ duration: 0.4 }}
          />
          
          {/* Overlay avec dégradé ludique */}
          <motion.div
            className={`absolute inset-0 bg-gradient-to-t ${product.accent} opacity-0 group-hover:opacity-30 transition-opacity duration-300`}
          />

          {/* Badges New et Bestseller avec design enfantin */}
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            {product.isNew && (
              <motion.span 
                className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 text-sm font-bold rounded-full shadow-lg transform -rotate-12"
                animate={{ rotate: isHovered ? 0 : -12 }}
                transition={{ duration: 0.3 }}
              >
                Nouveau ! ✨
              </motion.span>
            )}
            {product.isBestseller && (
              <motion.span 
                className="bg-gradient-to-r from-pink-400 to-purple-500 text-white px-4 py-2 text-sm font-bold rounded-full shadow-lg transform rotate-12"
                animate={{ rotate: isHovered ? 0 : 12 }}
                transition={{ duration: 0.3 }}
              >
                Préféré ⭐
              </motion.span>
            )}
          </div>
        </div>
      </div>

      {/* Informations produit avec animations ludiques */}
      <div className="mt-4 space-y-2">
        <motion.h3
          className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors"
          animate={{ x: isHovered ? 10 : 0, scale: isHovered ? 1.05 : 1 }}
          transition={{ duration: 0.3 }}
        >
          {product.name}
        </motion.h3>

        <div className="flex items-center justify-between">
          <motion.p 
            className="text-lg font-bold text-purple-600 dark:text-purple-400"
            animate={{ x: isHovered ? 10 : 0, scale: isHovered ? 1.1 : 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            {product.price.toFixed(2)} €
          </motion.p>

          <motion.div
            initial={{ opacity: 0, x: -10, scale: 0.8 }}
            animate={{ 
              opacity: isHovered ? 1 : 0, 
              x: isHovered ? 0 : -10,
              scale: isHovered ? 1 : 0.8
            }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center space-x-1 bg-gradient-to-r from-blue-400 to-purple-500 text-white px-4 py-2 rounded-full hover:from-blue-500 hover:to-purple-600 transition-all shadow-lg shadow-purple-500/20 transform hover:scale-105">
              <span className="text-sm font-bold">Voir</span>
              <ArrowRight size={16} />
            </div>
          </motion.div>
        </div>

        {/* Couleurs disponibles avec design ludique */}
        <motion.div 
          className="flex items-center gap-2"
          animate={{ x: isHovered ? 10 : 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          {product.colors.map((color, i) => (
            <motion.span 
              key={i}
              className="text-xs font-bold text-gray-600 dark:text-gray-400 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 px-3 py-1 rounded-full border-2 border-purple-200 dark:border-purple-700"
              whileHover={{ scale: 1.1, rotate: 5 }}
            >
              {color}
            </motion.span>
          ))}
        </motion.div>
      </div>
    </motion.div>
    </Link>
  );
};

const KidsPage = () => {
  const { theme } = useTheme();
  const [activeCategory, setActiveCategory] = useState('all');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [filteredCollections, setFilteredCollections] = useState([]);
  const { data, loading, error } = useCollections();
  const [heroRef, heroInView] = useInView({
    threshold: 0.3,
    triggerOnce: false
  });
  
  // Filtrer les produits en fonction de la catégorie active
  useEffect(() => {
    if (!loading && data) {
      // Filter collections - show only kids collections from Firebase
      const kidsCollections = data.collections.filter(c => c.category === 'kids');
      setFilteredCollections(kidsCollections);
      
      // Filter products based on collections
      const kidsCollectionIds = kidsCollections.map(c => c.id);
      let filtered = [];
      
      // Add products from Firebase that belong to kids collections
      if (data.products && data.products.length > 0) {
        filtered = data.products.filter(p => 
          p.collectionId && kidsCollectionIds.includes(p.collectionId)
        );
      }
      
      // If no products found in Firebase, use mock data
      if (filtered.length === 0) {
        filtered = kidsProducts;
      }
      
      // Apply additional category filters
      if (activeCategory === 'bestsellers') {
        filtered = filtered.filter(p => p.isBestseller);
      } else if (activeCategory === 'new') {
        filtered = filtered.filter(p => p.isNew);
      } else if (activeCategory !== 'all') {
        filtered = filtered.filter(p => p.category === activeCategory);
      }
      
      setFilteredProducts(filtered);
    }
  }, [activeCategory, data, loading]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-slate-900 dark:to-purple-900/30 transition-colors duration-300">
      <Helmet>
        <title>Collection Enfant | Birk & Shoes</title>
        <meta name="description" content="Découvrez notre collection de chaussures pour enfants Birkenstock. Des sandales et chaussures confortables et colorées pour les petits pieds." />
      </Helmet>
      
      {/* Hero Section avec animations ludiques */}
      <motion.section 
        ref={heroRef}
        className="relative w-full h-[70vh] overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Background Image avec Parallax et bulles animées */}
        <div className="absolute inset-0">
          <motion.div
            className="absolute inset-0 opacity-90"
            style={{
              backgroundImage: "url('https://www.birkenstock.com/on/demandware.static/-/Sites-Birkenstock-Library/default/dw9e3af914/menu/2023/SS23/Menu_Kids_SS23.jpg')",
              backgroundSize: "cover",
              backgroundPosition: "center 40%",
              filter: theme === 'dark' ? 'brightness(0.7)' : 'none'
            }}
            animate={{
              y: heroInView ? [0, -20] : 0
            }}
            transition={{
              y: {
                duration: 8,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut"
              }
            }}
          />
          
          {/* Gradient Overlay coloré */}
          <div className="absolute inset-0 bg-gradient-to-t from-purple-500/70 via-blue-500/40 to-transparent opacity-60" />

          {/* Bulles animées */}
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-24 h-24 rounded-full bg-gradient-to-br from-yellow-300 to-pink-400 opacity-20 blur-xl"
              initial={{
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight
              }}
              animate={{
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 10 + Math.random() * 5,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            />
          ))}
        </div>
        
        {/* Hero Content */}
        <div className="relative h-full container mx-auto px-4 flex flex-col justify-center">
          <motion.div
            className="max-w-2xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <motion.h1 
              className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              Collection Enfant
              <div className="h-2 w-32 bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 mt-2 rounded-full"></div>
            </motion.h1>
            
            <motion.p 
              className="text-lg md:text-xl text-white mb-8 drop-shadow-lg"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
            >
              Des chaussures colorées et confortables pour les petits aventuriers ! ✨
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex flex-wrap gap-4"
            >
              <button className="px-6 py-3 bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 text-white rounded-full text-sm font-bold hover:from-yellow-500 hover:via-pink-600 hover:to-purple-600 transition-all shadow-lg shadow-purple-500/20 transform hover:scale-105 flex items-center space-x-2">
                <span>Explorer la collection</span>
                <ArrowRight size={16} />
              </button>
              <button className="px-6 py-3 bg-white/20 backdrop-blur-md text-white rounded-full text-sm font-bold hover:bg-white/30 transition-all border-2 border-white/30 transform hover:scale-105 flex items-center space-x-2">
                <span>Nouveautés</span>
                <ArrowRight size={16} />
              </button>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Main Content */}
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
              Nos modèles pour enfant
              <motion.div 
                className="absolute -bottom-2 left-0 h-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full"
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
              {kidsCategories.map((category) => (
                <motion.button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                    activeCategory === category.id
                      ? 'bg-yellow-100 dark:bg-yellow-600 text-yellow-700 dark:text-white shadow-md'
                      : 'text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-yellow-700/50 border border-gray-200 dark:border-transparent'
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

      {/* Filters Panel */}
      <AnimatePresence>
        {filtersOpen && (
          <motion.div
            className="bg-white dark:bg-gray-800 rounded-xl p-4 mb-8 shadow-lg"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-gray-900 dark:text-white">Affiner la recherche</h3>
              <button 
                onClick={() => setFiltersOpen(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white"
              >
                <X size={18} />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Price Range */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Prix</h4>
                <div className="flex items-center space-x-4">
                  <input 
                    type="range" 
                    min="0" 
                    max="300" 
                    step="10" 
                    defaultValue="300"
                    className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-yellow-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap">0€ - 300€</span>
                </div>
              </div>
              
              {/* Colors */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Couleurs</h4>
                <div className="flex flex-wrap gap-2">
                  {['Bleu', 'Rose', 'Vert', 'Violet', 'Orange'].map((color) => (
                    <button 
                      key={color}
                      className="w-6 h-6 rounded-full border-2 border-white dark:border-gray-700 shadow-sm hover:scale-110 transition-transform"
                      style={{
                        background: 
                          color === 'Bleu' ? '#1e40af' : 
                          color === 'Rose' ? '#FFB6C1' : 
                          color === 'Vert' ? '#22c55e' : 
                          color === 'Violet' ? '#7c3aed' : 
                          '#f97316'
                      }}
                      title={color}
                    />
                  ))}
                </div>
              </div>
              
              {/* Sizes */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Pointures</h4>
                <div className="flex flex-wrap gap-2">
                  {[28, 29, 30, 31, 32, 33, 34, 35].map((size) => (
                    <button 
                      key={size}
                      className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 dark:border-gray-600 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Grille de Produits avec animation d'apparition */}
      <div className="container mx-auto px-4 py-12">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        ) : error ? (
          <div className="text-center text-red-500 p-8">
            Une erreur est survenue lors du chargement des produits.
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center text-gray-500 p-8">
            Aucun produit trouvé dans cette catégorie.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredProducts.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default KidsPage;