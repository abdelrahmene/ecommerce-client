import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Link } from 'react-router-dom';
import { Filter, ChevronDown, ArrowRight, X, Sparkles } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

// Mock data pour les nouveautés
const newProducts = [
  {
    id: 'n1',
    name: 'Arizona Shearling',
    price: 159.99,
    category: 'sandales',
    gender: 'femme',
    colors: ['Noir', 'Beige', 'Marron'],
    isNew: true,
    isBestseller: false,
    image: 'https://www.birkenstock.com/dw/image/v2/BDXC_PRD/on/demandware.static/-/Sites-master-catalog/default/dw4f283d3e/1018742/1018742.jpg',
    accent: 'from-emerald-400 to-teal-600'
  },
  {
    id: 'n2',
    name: 'Boston Shearling',
    price: 169.99,
    category: 'sabots',
    gender: 'homme',
    colors: ['Noir', 'Marron', 'Taupe'],
    isNew: true,
    isBestseller: true,
    image: 'https://www.birkenstock.com/on/demandware.static/-/Sites-master-catalog/default/dw8bf175ba/560773/560773.jpg',
    accent: 'from-amber-400 to-orange-600'
  },
  {
    id: 'n3',
    name: 'Gizeh Platform',
    price: 139.99,
    category: 'sandales',
    gender: 'femme',
    colors: ['Or', 'Argent', 'Noir'],
    isNew: true,
    isBestseller: false,
    image: 'https://www.birkenstock.com/dw/image/v2/BDXC_PRD/on/demandware.static/-/Sites-master-catalog/default/dw6f3d9da3/0560773/0560773.jpg',
    accent: 'from-yellow-400 to-amber-600'
  },
  {
    id: 'n4',
    name: 'Milano CT',
    price: 129.99,
    category: 'sandales',
    gender: 'homme',
    colors: ['Noir', 'Marron', 'Kaki'],
    isNew: true,
    isBestseller: false,
    image: 'https://www.birkenstock.com/on/demandware.static/-/Sites-master-catalog/default/dw4656762b/034701/034701.jpg',
    accent: 'from-blue-600 to-blue-800'
  },
  {
    id: 'n5',
    name: 'Bend Low',
    price: 179.99,
    category: 'chaussures',
    gender: 'mixte',
    colors: ['Blanc', 'Noir'],
    isNew: true,
    isBestseller: false,
    image: 'https://www.birkenstock.com/dw/image/v2/BDXC_PRD/on/demandware.static/-/Sites-master-catalog/default/dw6f3d9da3/0560773/0560773.jpg',
    accent: 'from-purple-400 to-indigo-600'
  },
  {
    id: 'n6',
    name: 'Kyoto',
    price: 119.99,
    category: 'sandales',
    gender: 'mixte',
    colors: ['Noir', 'Blanc', 'Taupe'],
    isNew: true,
    isBestseller: true,
    image: 'https://www.birkenstock.com/dw/image/v2/BDXC_PRD/on/demandware.static/-/Sites-master-catalog/default/dw9f5d4e33/0034793/0034793.jpg',
    accent: 'from-teal-400 to-cyan-600'
  }
];

// Catégories pour filtrer les nouveautés
const newCategories = [
  { id: 'all', name: 'Toutes les nouveautés' },
  { id: 'femme', name: 'Femme' },
  { id: 'homme', name: 'Homme' },
  { id: 'mixte', name: 'Mixte' },
  { id: 'sandales', name: 'Sandales' },
  { id: 'sabots', name: 'Sabots' },
  { id: 'chaussures', name: 'Chaussures' },
  { id: 'bestsellers', name: 'Best-sellers' }
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
              <span className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-3 py-1 text-xs font-medium rounded-full shadow-lg flex items-center gap-1">
                <Sparkles size={12} className="animate-pulse" />
                <span>Nouveau</span>
              </span>
              {product.isBestseller && (
                <span className="bg-amber-500 text-white px-3 py-1 text-xs font-medium rounded-full shadow-lg">
                  Best-seller
                </span>
              )}
            </div>
            
            {/* Badge genre */}
            <div className="absolute top-4 right-4">
              <span className={`px-2 py-1 text-xs font-medium rounded-full shadow-lg ${
                product.gender === 'femme' 
                  ? 'bg-rose-100 text-rose-700' 
                  : product.gender === 'homme'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-purple-100 text-purple-700'
              }`}>
                {product.gender === 'femme' ? 'Femme' : product.gender === 'homme' ? 'Homme' : 'Mixte'}
              </span>
            </div>
          </div>
        </div>

        {/* Informations produit avec animations */}
        <div className="mt-4 space-y-2">
          <motion.h3
            className="text-lg font-medium text-gray-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors"
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
              <div className="flex items-center space-x-1 text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 transition-colors">
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

const NewPage = () => {
  const { theme } = useTheme();
  const [activeCategory, setActiveCategory] = useState('all');
  const [filteredProducts, setFilteredProducts] = useState(newProducts);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [heroRef, heroInView] = useInView({
    threshold: 0.3,
    triggerOnce: false
  });
  
  // Filtrer les produits en fonction de la catégorie active
  useEffect(() => {
    let filtered;
    switch (activeCategory) {
      case 'all':
        filtered = newProducts;
        break;
      case 'bestsellers':
        filtered = newProducts.filter(product => product.isBestseller);
        break;
      case 'femme':
      case 'homme':
      case 'mixte':
        filtered = newProducts.filter(product => product.gender === activeCategory);
        break;
      default:
        filtered = newProducts.filter(product => product.category === activeCategory);
    }
    setFilteredProducts(filtered);
  }, [activeCategory]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900/90 transition-colors duration-300">
      <Helmet>
        <title>Nouveautés | Birk & Shoes</title>
        <meta name="description" content="Découvrez les dernières nouveautés de notre collection Birkenstock. Sandales, sabots et chaussures au design iconique et au confort inégalé." />
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
              backgroundImage: "url('https://www.birkenstock.com/on/demandware.static/-/Sites-Birkenstock-Library/default/dw1f9d7c8c/menu/2023/SS23/Menu_New_SS23.jpg')",
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
            <motion.div 
              className="flex items-center gap-2 mb-2"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Sparkles size={24} className="text-teal-400 animate-pulse" />
              <span className="text-teal-400 font-semibold tracking-wider">NOUVELLE COLLECTION</span>
            </motion.div>
            
            <motion.h1 
              className="text-4xl md:text-6xl font-bold text-white mb-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              Découvrez nos nouveautés
              <div className="h-1 w-24 bg-gradient-to-r from-emerald-400 to-teal-600 mt-2 rounded-full"></div>
            </motion.h1>
            
            <motion.p 
              className="text-lg md:text-xl text-gray-200 mb-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
            >
              Explorez notre dernière collection et soyez les premiers à découvrir nos modèles exclusifs.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex flex-wrap gap-4"
            >
              <button className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-full text-sm font-medium hover:from-emerald-600 hover:to-teal-700 transition-all shadow-lg shadow-teal-500/20 flex items-center space-x-2">
                <span>Explorer la collection</span>
                <ArrowRight size={16} />
              </button>
              <button className="px-6 py-3 bg-white/10 backdrop-blur-md text-white rounded-full text-sm font-medium hover:bg-white/20 transition-all border border-white/20 flex items-center space-x-2">
                <span>Filtrer par genre</span>
                <ChevronDown size={16} />
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
              <span className="flex items-center gap-2">
                <Sparkles size={20} className="text-teal-500" />
                Nouveautés
              </span>
              <motion.div 
                className="absolute -bottom-2 left-0 h-1 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full"
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
              {newCategories.map((category) => (
                <motion.button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                    activeCategory === category.id
                      ? 'bg-teal-100 dark:bg-teal-600 text-teal-700 dark:text-white shadow-md'
                      : 'text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-teal-700/50 border border-gray-200 dark:border-transparent'
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
            className="bg-white dark:bg-gray-800 rounded-xl p-4 mb-8 shadow-lg container mx-auto px-4"
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
                    className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-teal-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap">0€ - 300€</span>
                </div>
              </div>
              
              {/* Genre */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Genre</h4>
                <div className="flex flex-wrap gap-2">
                  {['Femme', 'Homme', 'Mixte'].map((genre) => (
                    <button 
                      key={genre}
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        genre === 'Femme' 
                          ? 'bg-rose-100 text-rose-700 hover:bg-rose-200' 
                          : genre === 'Homme'
                            ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                            : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                      }`}
                    >
                      {genre}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Sizes */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Pointures</h4>
                <div className="flex flex-wrap gap-2">
                  {[36, 37, 38, 39, 40, 41, 42, 43, 44, 45].map((size) => (
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredProducts.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default NewPage;