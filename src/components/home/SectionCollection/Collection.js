import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { mockCollections } from './mockData';

const CollectionCard = ({ collection, isActive, direction }) => {
  const variants = {
    enter: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.8,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30
      }
    },
    exit: (direction) => ({
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.8,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30
      }
    })
  };

  return (
    <motion.div
      custom={direction}
      variants={variants}
      initial="enter"
      animate="center"
      exit="exit"
      className={`absolute inset-0 w-full ${isActive ? 'z-20' : 'z-10'}`}
    >
      <Link to={collection.link} className="block w-full h-full">
        <div className={`relative h-[70vh] overflow-hidden rounded-2xl bg-gradient-to-br ${collection.accent}`}>
          {/* Overlay gradients for depth */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-transparent" />
          
          {/* Animated background pattern */}
          <motion.div 
            className="absolute inset-0 opacity-30"
            initial={{ backgroundPosition: '0% 0%' }}
            animate={{ backgroundPosition: ['0% 0%', '100% 100%'] }}
            transition={{ duration: 20, repeat: Infinity, repeatType: 'reverse' }}
            style={{
              backgroundImage: 'radial-gradient(circle at center, white 1px, transparent 1px)',
              backgroundSize: '20px 20px',
            }}
          />

          {/* Content Container */}
          <div className="absolute inset-0 p-8 flex flex-col justify-center items-center text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="max-w-2xl"
            >
              <h3 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
                {collection.title}
              </h3>
              <p className="text-gray-200 text-lg md:text-xl mb-8">
                {collection.description}
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 bg-white text-black rounded-full text-lg font-medium 
                         hover:bg-gray-100 transition-colors duration-200 shadow-lg"
              >
                Découvrir
              </motion.button>
            </motion.div>
          </div>

          {/* Background blur effect for non-active slides */}
          {!isActive && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-500" />
          )}
        </div>
      </Link>
    </motion.div>
  );
};

const Collection = ({ data }) => {
  // Extraction des données de la section depuis l'admin
  const sectionTitle = data?.content?.title || 'Collections en vedette';
  const sectionSubtitle = data?.content?.subtitle || '';
  const sectionCollections = data?.content?.collections || [];
  
  // Debug: Données de la section
  // console.log('Collection - Section data:', data);
  // console.log('Collection - Title:', sectionTitle);
  // console.log('Collection - Subtitle:', sectionSubtitle);
  // console.log('Collection - Collections:', sectionCollections);
  
  // Utiliser les collections de l'admin si disponibles, sinon fallback sur mockCollections
  const collectionsToShow = sectionCollections.length > 0 ? sectionCollections : mockCollections;
  const [[activeIndex, direction], setActiveIndex] = useState([0, 0]);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex(([current, dir]) => {
        const next = (current + 1) % collectionsToShow.length;
        return [next, 1];
      });
    }, 2000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full overflow-hidden bg-gray-50 dark:bg-slate-900/90 transition-colors duration-300 py-4">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Espace pour le contenu */}

        {/* Carrousel */}
        <div className="relative h-[70vh] w-full">
          <AnimatePresence initial={false} custom={direction}>
            <CollectionCard
              key={collectionsToShow[activeIndex]?.id || `collection-${activeIndex}`}
              collection={collectionsToShow[activeIndex]}
              isActive={true}
              direction={direction}
            />
          </AnimatePresence>

          {/* Indicateurs de navigation */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30 flex space-x-2">
            {collectionsToShow.map((_, index) => (
              <motion.button
                key={index}
                className={`w-2 h-2 rounded-full ${index === activeIndex ? 'bg-white' : 'bg-white/40'}`}
                whileHover={{ scale: 1.2 }}
                onClick={() => setActiveIndex([index, index > activeIndex ? 1 : -1])}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Collection;