import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Link } from 'react-router-dom';
import { Filter, SlidersHorizontal, ChevronDown, ArrowRight, X } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useCollections } from '../../hooks/useCollections';

// Fallback data pour les produits femme si Firebase est vide
const womenProducts = [
  {
    id: 'w1',
    name: 'Arizona Big Buckle',
    price: 149.99,
    category: 'sandales',
    colors: ['Rose Gold', 'Blanc', 'Noir'],
    isNew: true,
    isBestseller: true,
    image: 'https://www.birkenstock.com/dw/image/v2/BDXC_PRD/on/demandware.static/-/Sites-master-catalog/default/dw4f283d3e/1018742/1018742.jpg',
    accent: 'from-pink-400 to-rose-600'
  },
  {
    id: 'w2',
    name: 'Gizeh Platform',
    price: 139.99,
    category: 'sandales',
    colors: ['Or', 'Argent', 'Noir'],
    isNew: true,
    isBestseller: false,
    image: 'https://www.birkenstock.com/dw/image/v2/BDXC_PRD/on/demandware.static/-/Sites-master-catalog/default/dw6f3d9da3/0560773/0560773.jpg',
    accent: 'from-yellow-400 to-amber-600'
  },
  {
    id: 'w3',
    name: 'Madrid Big Buckle',
    price: 129.99,
    category: 'sandales',
    colors: ['Blanc', 'Noir', 'Taupe'],
    isNew: false,
    isBestseller: true,
    image: 'https://www.birkenstock.com/dw/image/v2/BDXC_PRD/on/demandware.static/-/Sites-master-catalog/default/dw9f5d4e33/0034793/0034793.jpg',
    accent: 'from-neutral-400 to-stone-600'
  },
  {
    id: 'w4',
    name: 'Boston Soft Footbed',
    price: 159.99,
    category: 'sabots',
    colors: ['Taupe', 'Noir', 'Marron'],
    isNew: true,
    isBestseller: true,
    image: 'https://www.birkenstock.com/dw/image/v2/BDXC_PRD/on/demandware.static/-/Sites-master-catalog/default/dw4f283d3e/1018742/1018742.jpg',
    accent: 'from-stone-400 to-stone-600'
  },
  {
    id: 'w5',
    name: 'Bend Low',
    price: 179.99,
    category: 'chaussures',
    colors: ['Blanc', 'Noir'],
    isNew: true,
    isBestseller: false,
    image: 'https://www.birkenstock.com/dw/image/v2/BDXC_PRD/on/demandware.static/-/Sites-master-catalog/default/dw6f3d9da3/0560773/0560773.jpg',
    accent: 'from-gray-400 to-gray-600'
  }
];

// Catégories pour femmes
const womenCategories = [
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

// Composant ProductCard avec un design moderne et élégant
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
          hidden: { opacity: 0, y: 20 },
          visible: {
            opacity: 1,
            y: 0,
            transition: {
              duration: 0.6,
              delay: index * 0.2,
              ease: [0.16, 1, 0.3, 1]
            }
          }
        }}
        className="group relative"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
      {/* Image Container avec overlay et animations */}
      <div className="aspect-[3/4] overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800">
        <div className="relative h-full w-full">
          <motion.img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover object-center"
            animate={{
              scale: isHovered ? 1.05 : 1
            }}
            transition={{ duration: 0.4 }}
          />
          
          {/* Overlay avec dégradé */}
          <motion.div
            className={`absolute inset-0 bg-gradient-to-t ${product.accent} opacity-0 group-hover:opacity-30 transition-opacity duration-300`}
          />

          {/* Badges New et Bestseller */}
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            {product.isNew && (
              <span className="bg-rose-500 text-white px-3 py-1 text-xs font-medium rounded-full shadow-lg">
                Nouveau
              </span>
            )}
            {product.isBestseller && (
              <span className="bg-amber-500 text-white px-3 py-1 text-xs font-medium rounded-full shadow-lg">
                Best-seller
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Informations produit avec animations */}
      <div className="mt-4 space-y-2">
        <motion.h3
          className="text-lg font-medium text-gray-900 dark:text-white group-hover:text-rose-500 dark:group-hover:text-rose-400 transition-colors"
          animate={{ x: isHovered ? 10 : 0 }}
          transition={{ duration: 0.3 }}
        >
          {product.name}
        </motion.h3>

        <div className="flex items-center justify-between">
          <motion.p 
            className="text-lg font-semibold text-gray-900 dark:text-white"
            animate={{ x: isHovered ? 10 : 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            {product.price.toFixed(2)} €
          </motion.p>

          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : -10 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center space-x-1 text-rose-500 dark:text-rose-400 hover:text-rose-600 dark:hover:text-rose-300 transition-colors">
              <span className="text-sm font-medium">Voir</span>
              <ArrowRight size={16} />
            </div>
          </motion.div>
        </div>

        {/* Couleurs disponibles */}
        <motion.div 
          className="flex items-center gap-1"
          animate={{ x: isHovered ? 10 : 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          {product.colors.map((color, i) => (
            <span 
              key={i}
              className="text-xs text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full"
            >
              {color}
            </span>
          ))}
        </motion.div>
      </div>
    </motion.div>
    </Link>
  );
};

const WomenPage = () => {
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
      // Filter collections - show only women collections from Firebase
      const womenCollections = data.collections.filter(c => c.category === 'women');
      setFilteredCollections(womenCollections);
      
      // Filter products based on collections
      const womenCollectionIds = womenCollections.map(c => c.id);
      let filtered = [];
      
      // Add products from Firebase that belong to women collections
      if (data.products && data.products.length > 0) {
        filtered = data.products.filter(p => 
          p.collectionId && womenCollectionIds.includes(p.collectionId)
        );
      }
      
      // If no products found in Firebase, use mock data
      if (filtered.length === 0) {
        filtered = womenProducts;
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
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900/90 transition-colors duration-300">
      <Helmet>
        <title>Collection Femme | Birk & Shoes</title>
        <meta name="description" content="Découvrez notre collection de chaussures femme Birkenstock. Sandales, sabots et chaussures au design iconique et au confort inégalé." />
      </Helmet>
      
      {/* Hero Section avec Parallax et Animations */}
      <motion.section 
        ref={heroRef}
        className="relative w-full h-[70vh] overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Background Image avec Parallax */}
        <div className="absolute inset-0">
          <motion.div
            className="absolute inset-0 opacity-80"
            style={{
              backgroundImage: "url('https://www.birkenstock.com/on/demandware.static/-/Sites-Birkenstock-Library/default/dwc6d3d3f7/menu/2023/SS23/Menu_Women_SS23.jpg')",
              backgroundSize: "cover",
              backgroundPosition: "center 30%",
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
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-70" />
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
              className="text-4xl md:text-6xl font-bold text-white mb-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              Collection Femme
              <div className="h-1 w-24 bg-gradient-to-r from-rose-400 to-pink-600 mt-2 rounded-full"></div>
            </motion.h1>
            
            <motion.p 
              className="text-lg md:text-xl text-gray-200 mb-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
            >
              Découvrez notre collection exclusive de chaussures pour femmes, alliant élégance et confort.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex flex-wrap gap-4"
            >
              <button className="px-6 py-3 bg-gradient-to-r from-rose-400 to-pink-600 text-white rounded-full text-sm font-medium hover:from-rose-500 hover:to-pink-700 transition-all shadow-lg shadow-pink-500/20 flex items-center space-x-2">
                <span>Découvrir la collection</span>
                <ArrowRight size={16} />
              </button>
              <button className="px-6 py-3 bg-white/10 backdrop-blur-md text-white rounded-full text-sm font-medium hover:bg-white/20 transition-all border border-white/20 flex items-center space-x-2">
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
              Nos modèles pour femme
              <motion.div 
                className="absolute -bottom-2 left-0 h-1 bg-gradient-to-r from-rose-400 to-pink-500 rounded-full"
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
              {womenCategories.map((category) => (
                <motion.button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                    activeCategory === category.id
                      ? 'bg-rose-100 dark:bg-rose-600 text-rose-700 dark:text-white shadow-md'
                      : 'text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-rose-700/50 border border-gray-200 dark:border-transparent'
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
                    className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-rose-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap">0€ - 300€</span>
                </div>
              </div>
              
              {/* Colors */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Couleurs</h4>
                <div className="flex flex-wrap gap-2">
                  {['Noir', 'Marron', 'Beige', 'Rose', 'Blanc'].map((color) => (
                    <button 
                      key={color}
                      className="w-6 h-6 rounded-full border-2 border-white dark:border-gray-700 shadow-sm hover:scale-110 transition-transform"
                      style={{
                        background: 
                          color === 'Noir' ? '#111' : 
                          color === 'Marron' ? '#8B4513' : 
                          color === 'Beige' ? '#F5F5DC' : 
                          color === 'Rose' ? '#FFB6C1' : 
                          '#fff'
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
                  {[36, 37, 38, 39, 40, 41, 42].map((size) => (
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

      {/* Grille de Produits */}
      <div className="container mx-auto px-4 py-12">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
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

export default WomenPage;