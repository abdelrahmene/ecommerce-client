import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { mockCollections } from './mockData';
import { getHomeSections } from '../../../services/api/collectionsService';

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
        <div className={`relative h-[70vh] overflow-hidden rounded-2xl bg-gradient-to-br ${collection.accent || 'from-purple-800 to-purple-950'}`}>
          {/* Overlay gradients for depth */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-transparent" />
          
          {/* Animated background pattern */}
          <div 
            className="absolute inset-0 opacity-30 animate-float"
            style={{
              backgroundImage: 'radial-gradient(circle at center, white 1px, transparent 1px)',
              backgroundSize: '20px 20px',
              animation: 'float 20s ease-in-out infinite alternate'
            }}
          />

          {/* Image de fond si disponible */}
          {collection.image && (
            <img
              src={collection.image.startsWith('/uploads') ? `${process.env.REACT_APP_ADMIN_API_URL || 'http://localhost:4000'}${collection.image}` : collection.image}
              alt={collection.title}
              className="absolute inset-0 w-full h-full object-cover"
              style={{ opacity: (collection.imageOpacity || 50) / 100 }}
              onError={(e) => {
                console.log('❌ [IMAGE-ERROR]:', collection.image);
                e.target.style.display = 'none';
              }}
              onLoad={() => console.log('✅ [IMAGE-LOADED]:', collection.image)}
            />
          )}

          {/* Content Container */}
          <div className="absolute inset-0 p-8 flex flex-col justify-center items-center text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="max-w-2xl z-10"
            >
              <h3 className={`text-4xl md:text-5xl font-bold ${collection.textColor || 'text-white'} mb-4 tracking-tight`}>
                {collection.title}
              </h3>
              {collection.subtitle && (
                <h4 className={`text-2xl md:text-3xl font-medium ${collection.textColor || 'text-white'} mb-2 opacity-90`}>
                  {collection.subtitle}
                </h4>
              )}
              <p className={`${collection.textColor || 'text-gray-200'} text-lg md:text-xl mb-8 opacity-90`}>
                {collection.description}
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-8 py-3 ${collection.buttonColor || 'bg-white text-black hover:bg-gray-100'} rounded-full text-lg font-medium transition-colors duration-200 shadow-lg`}
              >
                {collection.ctaText || 'Découvrir'}
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
  const [collectionsData, setCollectionsData] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Extraction des données de la section depuis l'admin
  const sectionTitle = data?.content?.title || 'Collections en vedette';
  const sectionSubtitle = data?.content?.subtitle || '';
  const sectionCollections = data?.content?.items || [];
  
  // Utiliser les collections de l'admin si disponibles, sinon fallback sur collectionsData
  const collectionsToShow = sectionCollections.length > 0 ? sectionCollections : collectionsData;
  const [[activeIndex, direction], setActiveIndex] = useState([0, 0]);

  // Charger les données depuis l'API
  useEffect(() => {
    const loadCollectionData = async () => {
      try {
        setLoading(true);
        const sections = await getHomeSections();
        
        // Trouver la section collection correspondante
        const collectionSection = sections.find(section => 
          section.type === 'collection' && section.content?.items?.length > 0
        );
        
        if (collectionSection?.content?.items) {
          setCollectionsData(collectionSection.content.items);
          console.log('✅ [COLLECTION] Données chargées depuis la DB:', collectionSection.content.items.length, 'items');
        }
      } catch (error) {
        console.error('❌ [COLLECTION] Erreur chargement:', error);
      } finally {
        setLoading(false);
      }
    };

    // Charger seulement si pas de données dans props
    if (!sectionCollections.length) {
      loadCollectionData();
    } else {
      setLoading(false);
    }
  }, [sectionCollections.length]);

  useEffect(() => {
    if (collectionsToShow.length > 1 && !loading) {
      const timer = setInterval(() => {
        setActiveIndex(([current, dir]) => {
          const next = (current + 1) % collectionsToShow.length;
          return [next, 1];
        });
      }, 4000);

      return () => clearInterval(timer);
    }
  }, [collectionsToShow.length, loading]);

  // Ne pas afficher le composant si pas de données et en cours de chargement
  if (loading || collectionsToShow.length === 0) {
    return (
      <div className="relative w-full overflow-hidden bg-gray-50 dark:bg-slate-900/90 transition-colors duration-300 py-4">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative h-[70vh] w-full flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 dark:border-white"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-400">Chargement des collections...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

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