import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Link } from 'react-router-dom';
import { Filter, ChevronDown, ArrowRight, X } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useCollections } from '../../hooks/useCollections';
import useProducts from '../../hooks/useProducts';

// Catégories pour hommes
const menCategories = [
  { id: 'all', name: 'Tous les produits' },
  { id: 'sandales', name: 'Sandales' },
  { id: 'clogs', name: 'Sabots' },
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
              <span className="bg-blue-600 text-white px-3 py-1 text-xs font-medium rounded-full shadow-lg">
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
          className="text-lg font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors"
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
            <div className="flex items-center space-x-1 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors">
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

const MenPage = () => {
  const { theme } = useTheme();
  const [activeCategory, setActiveCategory] = useState('all');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [filteredCollections, setFilteredCollections] = useState([{
    id: 'florida-collection',
    name: 'Florida',
    description: 'Découvrez notre collection exclusive Florida',
    image: 'https://res.cloudinary.com/dsveonbhj/image/upload/v1748354773/collections/cypxy0yo0bxrh4sox6ob.jpg',
    category: 'men'
  }]);
  const { data, loading, error } = useCollections();
  const [heroRef, heroInView] = useInView({
    threshold: 0.3,
    triggerOnce: false
  });
  
  // Filtrer les produits en fonction de la catégorie active
  useEffect(() => {
    if (!loading && data) {
      // Filter collections - show only men collections from Firebase
      // Debug des collections dans la console
      console.log('Toutes les collections:', data.collections);
      
      // Filtre les collections homme (accepte 'men' ou 'Men')
      const menCollections = data.collections.filter(c => 
        c.category === 'men' || c.category === 'Men' || 
        (c.id === 'wGdwMyH0q7Jij894Pfr6') // Inclure aussi la collection Florida par son ID
      );
      console.log('Collections homme filtrées:', menCollections);
      setFilteredCollections(menCollections);
      
      // Filter products based on collections
      const menCollectionIds = menCollections.map(c => c.id);
      let filtered = [];
      
      // Add products from Firebase that belong to men collections
      if (data.products && data.products.length > 0) {
        filtered = data.products.filter(p => 
          p.collectionId && menCollectionIds.includes(p.collectionId)
        );
      }
      
      // Utiliser uniquement les produits de Firebase
      // Sans fallback sur des données mockées
      
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
        <title>Collection Homme | Birk & Shoes</title>
        <meta name="description" content="Découvrez notre collection de chaussures homme Birkenstock. Sandales, sabots et chaussures au design iconique et au confort inégalé." />
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
              backgroundImage: "url('https://www.birkenstock.com/on/demandware.static/-/Sites-Birkenstock-Library/default/dw7d8e8d8f/menu/2023/SS23/Menu_Men_SS23.jpg')",
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
              Collection Homme
              <div className="h-1 w-24 bg-gradient-to-r from-blue-400 to-indigo-600 mt-2 rounded-full"></div>
            </motion.h1>
            
            <motion.p 
              className="text-lg md:text-xl text-gray-200 mb-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
            >
              Découvrez notre collection exclusive de chaussures pour hommes, alliant style et confort.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex flex-wrap gap-4"
            >
              <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full text-sm font-medium hover:from-blue-600 hover:to-indigo-700 transition-all shadow-lg shadow-blue-500/20 flex items-center space-x-2">
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
              Nos modèles pour homme
              <motion.div 
                className="absolute -bottom-2 left-0 h-1 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full"
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
              {menCategories.map((category) => (
                <motion.button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                    activeCategory === category.id
                      ? 'bg-blue-100 dark:bg-blue-600 text-blue-700 dark:text-white shadow-md'
                      : 'text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-blue-700/50 border border-gray-200 dark:border-transparent'
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
                    className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap">0€ - 300€</span>
                </div>
              </div>
              
              {/* Colors */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Couleurs</h4>
                <div className="flex flex-wrap gap-2">
                  {['Noir', 'Marron', 'Gris', 'Taupe', 'Blanc'].map((color) => (
                    <button 
                      key={color}
                      className="w-6 h-6 rounded-full border-2 border-white dark:border-gray-700 shadow-sm hover:scale-110 transition-transform"
                      style={{
                        background: 
                          color === 'Noir' ? '#111' : 
                          color === 'Marron' ? '#8B4513' : 
                          color === 'Gris' ? '#808080' : 
                          color === 'Taupe' ? '#483C32' : 
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
                  {[40, 41, 42, 43, 44, 45, 46].map((size) => (
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

      {/* Affichage des Collections Homme */}
      <div className="container mx-auto px-4 py-12">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="text-center text-red-500 p-8">
            Une erreur est survenue lors du chargement des collections.
          </div>
        ) : filteredCollections.length === 0 ? (
          <div className="text-center text-gray-500 p-8">
            Aucune collection homme trouvée.
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-12">
            <div className="w-full">
              <h2 className="text-2xl font-bold text-center mb-8 text-gray-800 dark:text-white">
                Collections Homme
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
                {filteredCollections.map((collection, index) => (
                  <Link 
                    key={collection.id}
                    to={`/collection/${collection.id}`}
                    className="group block overflow-hidden rounded-xl shadow-lg transform transition-all duration-300 hover:-translate-y-2"
                  >
                    <div className="aspect-[3/2] relative overflow-hidden">
                      {collection.image && (
                        <img 
                          src={collection.image} 
                          alt={collection.name} 
                          className="w-full h-full object-contain transform transition-transform duration-500 group-hover:scale-105"
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-60 group-hover:opacity-80 transition-opacity"></div>
                      
                      <div className="absolute bottom-0 left-0 right-0 p-6">
                        <h3 className="text-2xl font-bold text-white mb-2 group-hover:translate-x-2 transition-transform">
                          {collection.name}
                        </h3>
                        {collection.description && (
                          <p className="text-gray-200 text-sm mb-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            {collection.description || 'Découvrez notre collection exclusive'}
                          </p>
                        )}
                        <div className="flex items-center mt-3">
                          <span className="text-white text-sm mr-2">Découvrir</span>
                          <ArrowRight size={16} className="text-white group-hover:translate-x-2 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MenPage;