import React, { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { mockFeaturedProducts } from './mockData';

const ProductCard = ({ product, index }) => {
  const cardRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  
  // Générer les étoiles pour la notation
  const renderRating = (rating) => {
    return (
      <div className="flex items-center space-x-1">
        {[...Array(5)].map((_, i) => (
          <span 
            key={i} 
            className={`${i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-400'} text-xs`}
          >★</span>
        ))}
        <span className="text-white/90 dark:text-white text-xs ml-1">
          ({product.reviews})
        </span>
      </div>
    );
  };

  // Générer les couleurs disponibles
  const renderColors = (colors) => {
    return (
      <div className="flex items-center space-x-1 mt-2">
        {colors.slice(0, 3).map((color, i) => (
          <motion.div 
            key={i}
            className="w-3 h-3 rounded-full border border-white/30"
            style={{
              background: color.toLowerCase().includes('noir') ? '#111' : 
                        color.toLowerCase().includes('blanc') ? '#f8f8f8' : 
                        color.toLowerCase().includes('rouge') ? '#e11d48' :
                        color.toLowerCase().includes('bleu') ? '#1e40af' :
                        color.toLowerCase().includes('or') ? '#b45309' :
                        color.toLowerCase().includes('argent') ? '#94a3b8' :
                        color.toLowerCase().includes('gris') ? '#4b5563' :
                        color.toLowerCase().includes('rose') ? '#ec4899' : '#333'
            }}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
          />
        ))}
        {colors.length > 3 && (
          <span className="text-white/90 dark:text-white text-[10px]">+{colors.length - 3}</span>
        )}
      </div>
    );
  };

  return (
    <motion.div
      ref={cardRef}
      className="group relative h-full"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ 
        type: 'spring', 
        stiffness: 300, 
        damping: 30,
        delay: index * 0.1
      }}
      viewport={{ once: true, margin: "-20%" }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${product.accent} shadow-xl h-full transform transition-all duration-300 group-hover:shadow-2xl group-hover:scale-[1.02] group-hover:-translate-y-1`}>
        {/* Overlay de brillance */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-50 z-0" />
        
        {/* Motif d'arrière-plan animé */}
        <motion.div
          className="absolute inset-0 opacity-10"
          animate={{ backgroundPosition: ['0% 0%', '100% 100%'] }}
          transition={{ duration: 20, repeat: Infinity, repeatType: 'reverse' }}
          style={{
            backgroundImage: 'radial-gradient(circle at center, white 1px, transparent 1px)',
            backgroundSize: '20px 20px',
          }}
        />
        
        {/* Badges et étiquettes */}
        <div className="absolute top-3 left-3 right-3 flex justify-between z-20">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="px-3 py-1 bg-white/90 dark:bg-indigo-500/90 backdrop-blur-sm rounded-full text-xs font-bold text-black dark:text-white">
              {product.badge}
            </div>
          </motion.div>
          
          {product.promotion && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="px-3 py-1 bg-red-500 rounded-full text-xs font-bold text-white shadow-lg shadow-red-500/30">
                {product.promotion}
              </div>
            </motion.div>
          )}
        </div>
        
        {/* Contenu principal */}
        <div className="relative h-full flex flex-col p-4">
          {/* Image avec effet de flottement */}
          <div className="flex-1 flex items-center justify-center mb-3 relative">
            <motion.div
              className="w-full h-full flex items-center justify-center"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity, repeatType: 'reverse' }}
            >
              <div className="w-3/4 h-3/4 bg-white/10 rounded-2xl mx-auto" />
              
              {/* Prix flottant */}
              <motion.div 
                className="absolute -bottom-2 -right-2 bg-white rounded-full px-3 py-1 shadow-lg"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <span className="text-black dark:text-indigo-900 font-bold text-base">
                  {product.price.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                </span>
              </motion.div>
            </motion.div>
          </div>
          
          {/* Informations du produit */}
          <div className="mt-auto">
            <Link to={`/products/${product.id}`}>
              <h3 className="text-lg font-bold text-white dark:text-white mb-1 line-clamp-1 hover:text-white/80 dark:hover:text-indigo-200 transition-colors">
                {product.title}
              </h3>
            </Link>
            
            <p className="text-xs text-white/80 dark:text-white/90 mb-2 line-clamp-2">
              {product.description}
            </p>
            
            <div className="flex justify-between items-end">
              <div className="space-y-1">
                {/* Rating */}
                {renderRating(product.rating)}
                
                {/* Colors */}
                {renderColors(product.colors)}
              </div>
              
              <Link to={`/products/${product.id}`}>
                <motion.button
                  className="px-3 py-1.5 bg-white dark:bg-indigo-500 text-black dark:text-white rounded-full text-xs font-medium hover:bg-white/90 dark:hover:bg-indigo-600 transition-colors shadow-md dark:shadow-indigo-500/30"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Voir
                </motion.button>
              </Link>
            </div>
          </div>
        </div>
        
        {/* Quick actions on hover */}
        <AnimatePresence>
          {isHovered && (
            <motion.div 
              className="absolute top-1/2 left-0 right-0 flex justify-center space-x-2 -mt-4 z-30"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
            >
              <motion.button 
                className="w-8 h-8 rounded-full bg-white dark:bg-indigo-500 flex items-center justify-center text-black dark:text-white shadow-lg dark:shadow-indigo-500/30"
                whileHover={{ scale: 1.1, backgroundColor: isHovered ? '#f8f8f8' : '#4f46e5' }}
                whileTap={{ scale: 0.9 }}
              >
                <span className="text-lg">❤</span>
              </motion.button>
              <motion.button 
                className="w-8 h-8 rounded-full bg-white dark:bg-indigo-500 flex items-center justify-center text-black dark:text-white shadow-lg dark:shadow-indigo-500/30"
                whileHover={{ scale: 1.1, backgroundColor: isHovered ? '#f8f8f8' : '#4f46e5' }}
                whileTap={{ scale: 0.9 }}
              >
                <span className="text-lg">➕</span>
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

const FeaturedProducts = () => {
  const [activeTab, setActiveTab] = useState('all');
  const { scrollYProgress } = useScroll();
  const containerRef = useRef(null);
  
  // Effet de parallaxe au scroll
  const y = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.8, 0.6]);
  
  // Filtres pour les produits
  const tabs = [
    { id: 'all', label: 'Tous' },
    { id: 'new', label: 'Nouveautés' },
    { id: 'best', label: 'Best-sellers' },
    { id: 'limited', label: 'Édition Limitée' }
  ];
  
  // Filtrer les produits en fonction de l'onglet actif
  const filteredProducts = mockFeaturedProducts.filter(product => {
    if (activeTab === 'all') return true;
    if (activeTab === 'new') return product.badge === 'Nouveau';
    if (activeTab === 'best') return product.badge === 'Best-seller';
    if (activeTab === 'limited') return product.badge === 'Limited' || product.promotion === 'Edition Limitée';
    return true;
  });

  return (
    <section ref={containerRef} className="relative w-full bg-gray-50 dark:bg-slate-900/90 transition-colors duration-300 py-16 md:py-24 overflow-hidden">
      {/* Motif d'arrière-plan */}
      <motion.div 
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{ y }}
      >
        <div className="h-full w-full" style={{ 
          backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 25%), radial-gradient(circle at 80% 30%, rgba(255, 255, 255, 0.05) 0%, transparent 50%)',
          backgroundSize: '100% 100%'
        }} />
      </motion.div>
      
      {/* Titre de section avec soulignement animé */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 md:mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center relative"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-3 md:mb-4 relative inline-block drop-shadow-sm">
            Produits en Vedette
            <motion.span 
              className="absolute -bottom-2 left-0 h-1.5 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full shadow-sm"
              initial={{ width: '0%' }}
              whileInView={{ width: '100%' }}
              transition={{ duration: 0.8, delay: 0.3 }}
            />
          </h2>
          <p className="text-gray-700 dark:text-slate-300 text-sm md:text-lg max-w-2xl mx-auto mt-2 md:mt-4 font-medium">
            Découvrez notre sélection de produits exceptionnels
          </p>
        </motion.div>
      </div>
      
      {/* Filtres */}
      <div className="w-full max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 md:mb-12">
        <motion.div 
          className="flex justify-center flex-wrap gap-2"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          {tabs.map((tab) => (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="px-4 py-2 rounded-full text-sm font-semibold text-gray-800 dark:text-white transition-all duration-300 hover:text-gray-900 dark:hover:text-white
              ${activeTab === tab.id ? 'bg-indigo-100 dark:bg-indigo-600 text-indigo-700 dark:text-white shadow-md' : 'hover:bg-gray-100 dark:hover:bg-indigo-700/50 border border-gray-200 dark:border-transparent'}"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {tab.label}
            </motion.button>
          ))}
        </motion.div>
      </div>

      {/* Grille de produits avec effet de parallaxe */}
      <motion.div 
        className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        style={{ opacity }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 lg:gap-8"
          >
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  index={index}
                />
              ))
            ) : (
              <div className="col-span-full py-12 text-center">
                <p className="text-gray-600 dark:text-white text-lg">Aucun produit ne correspond à ce filtre</p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* Bouton Voir tous les produits */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 text-center">
        <motion.button
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 dark:from-indigo-600 dark:to-purple-600 text-white rounded-full text-sm font-medium hover:from-purple-600 hover:to-blue-600 dark:hover:from-indigo-700 dark:hover:to-purple-700 transition-all shadow-lg shadow-blue-500/20 dark:shadow-indigo-500/30"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Voir tous les produits
        </motion.button>
      </div>

      {/* Espace minimal en bas */}
      <div className="pb-2"></div>
    </section>
  );
};

export default FeaturedProducts;