import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, useAnimation } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { mockCollections } from './mockData';
import { getHomeSections } from '../../../services/api/collectionsService';
import { getImageUrl } from '../../../config/api';

const CollectionCard = ({ collection, direction }) => {
  const variants = {
    enter: (direction) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0,
      scale: 0.9,
      rotateY: direction > 0 ? 25 : -25
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      rotateY: 0,
      transition: {
        type: 'spring',
        stiffness: 200,
        damping: 30,
        opacity: { duration: 0.3 }
      }
    },
    exit: (direction) => ({
      x: direction > 0 ? '-100%' : '100%',
      opacity: 0,
      scale: 0.9,
      rotateY: direction > 0 ? -25 : 25,
      transition: {
        type: 'spring',
        stiffness: 200,
        damping: 30,
        opacity: { duration: 0.2 }
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
      className="absolute inset-0 w-full h-full"
      style={{ perspective: 1000 }}
    >
      <Link to={collection.link || '/'} className="block w-full h-full">
        <div className="relative w-full h-full overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 shadow-2xl">
          {/* Image - FORMAT CARRÉ */}
          {collection.image && (
            <motion.div 
              className="absolute inset-0"
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.6 }}
            >
              <img
                src={getImageUrl(collection.image)}
                alt={collection.title}
                className="w-full h-full object-cover"
                style={{ 
                  objectFit: 'cover',
                  objectPosition: 'center'
                }}
                onError={(e) => {
                  console.error('❌ [COLLECTION-IMAGE] Erreur:', collection.image);
                  e.target.style.display = 'none';
                }}
                onLoad={() => console.log('✅ [COLLECTION-IMAGE] Chargée:', collection.image)}
              />
              
              {/* Gradient overlay pour lisibilité */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
              
              {/* Effet de brillance animé */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                initial={{ x: '-100%' }}
                animate={{ x: '200%' }}
                transition={{ 
                  duration: 3, 
                  repeat: Infinity, 
                  repeatDelay: 2,
                  ease: "easeInOut"
                }}
              />
            </motion.div>
          )}

          {/* Content Container */}
          <div className="absolute inset-0 p-6 md:p-8 lg:p-10 flex flex-col justify-end z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="space-y-3 md:space-y-4"
            >
              {/* Subtitle badge */}
              {collection.subtitle && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="inline-flex"
                >
                  <span className="px-4 py-1.5 rounded-full text-xs md:text-sm font-semibold bg-white/20 backdrop-blur-md text-white uppercase tracking-wider">
                    {collection.subtitle}
                  </span>
                </motion.div>
              )}

              {/* Title */}
              <h3 className="text-3xl md:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight drop-shadow-2xl">
                {collection.title}
              </h3>

              {/* Description */}
              <p className="text-base md:text-lg text-gray-200 leading-relaxed max-w-2xl line-clamp-2 md:line-clamp-3">
                {collection.description}
              </p>

              {/* CTA Button */}
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className={`inline-flex items-center gap-2 px-6 md:px-8 py-3 md:py-4 rounded-full font-bold text-sm md:text-base shadow-xl transition-all ${collection.buttonColor || 'bg-white text-black hover:bg-gray-100'}`}
              >
                <span>{collection.ctaText || 'Découvrir'}</span>
                <motion.svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </motion.svg>
              </motion.button>
            </motion.div>
          </div>

          {/* Glow effect on hover */}
          <motion.div
            className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none"
            style={{
              background: 'radial-gradient(circle at center, rgba(255,255,255,0.1) 0%, transparent 70%)'
            }}
          />
        </div>
      </Link>
    </motion.div>
  );
};

const Collection = ({ data }) => {
  const [collectionsData, setCollectionsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [[activeIndex, direction], setActiveIndex] = useState([0, 0]);
  const [isDragging, setIsDragging] = useState(false);
  const autoplayRef = useRef(null);

  // Extraction des données
  const sectionCollections = data?.content?.items || [];
  const processCollectionImages = (collections) => {
    return collections.map(collection => ({
      ...collection,
      image: collection.image ? getImageUrl(collection.image) : null
    }));
  };

  const collectionsToShow = sectionCollections.length > 0 
    ? processCollectionImages(sectionCollections)
    : collectionsData;

  console.log('🎯 [COLLECTION] Collections à afficher:', collectionsToShow.length);

  // Charger les données depuis l'API
  useEffect(() => {
    const loadCollectionData = async () => {
      if (sectionCollections.length > 0) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const sections = await getHomeSections();
        const collectionSection = sections.find(section => 
          section.type === 'collection' && section.content?.items?.length > 0
        );
        
        if (collectionSection?.content?.items) {
          const processedItems = processCollectionImages(collectionSection.content.items);
          setCollectionsData(processedItems);
        }
      } catch (error) {
        console.error('❌ [COLLECTION] Erreur:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCollectionData();
  }, [sectionCollections.length]);

  // Navigation functions
  const paginate = useCallback((newDirection) => {
    setActiveIndex(([current]) => {
      let next = current + newDirection;
      if (next < 0) next = collectionsToShow.length - 1;
      if (next >= collectionsToShow.length) next = 0;
      return [next, newDirection];
    });
  }, [collectionsToShow.length]);

  const goToSlide = useCallback((index) => {
    setActiveIndex(([current]) => [index, index > current ? 1 : -1]);
  }, []);

  // Autoplay avec pause on interaction
  useEffect(() => {
    if (collectionsToShow.length <= 1 || loading || isDragging) return;

    autoplayRef.current = setInterval(() => {
      paginate(1);
    }, 5000);

    return () => {
      if (autoplayRef.current) {
        clearInterval(autoplayRef.current);
      }
    };
  }, [collectionsToShow.length, loading, isDragging, paginate]);

  // Drag handlers
  const handleDragStart = () => setIsDragging(true);
  const handleDragEnd = (event, info) => {
    setIsDragging(false);
    const threshold = 50;
    if (info.offset.x > threshold) {
      paginate(-1);
    } else if (info.offset.x < -threshold) {
      paginate(1);
    }
  };

  if (loading || collectionsToShow.length === 0) {
    return (
      <div className="relative w-full bg-gray-50 dark:bg-slate-900 py-8">
        <div className="w-full max-w-7xl mx-auto px-4">
          <div className="aspect-square max-w-2xl mx-auto flex items-center justify-center bg-gray-200 dark:bg-gray-800 rounded-2xl">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-300 border-t-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">Chargement...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full bg-gray-50 dark:bg-slate-900 py-8 overflow-hidden">
      <div className="w-full max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        {/* Carousel Container - FORMAT CARRÉ */}
        <div className="relative w-full aspect-square max-w-4xl mx-auto">
          {/* Slides */}
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={activeIndex}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              className="absolute inset-0"
            >
              <CollectionCard
                collection={collectionsToShow[activeIndex]}
                direction={direction}
              />
            </motion.div>
          </AnimatePresence>

          {/* Navigation Arrows - BADASS STYLE */}
          {collectionsToShow.length > 1 && (
            <>
              <motion.button
                whileHover={{ scale: 1.1, x: -5 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => paginate(-1)}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white transition-all shadow-xl"
              >
                <ChevronLeft className="w-6 h-6 md:w-7 md:h-7" strokeWidth={3} />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.1, x: 5 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => paginate(1)}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white transition-all shadow-xl"
              >
                <ChevronRight className="w-6 h-6 md:w-7 md:h-7" strokeWidth={3} />
              </motion.button>
            </>
          )}

          {/* Dots Navigation - BADASS STYLE */}
          {collectionsToShow.length > 1 && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-2">
              {collectionsToShow.map((_, index) => (
                <motion.button
                  key={index}
                  onClick={() => goToSlide(index)}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  className={`transition-all ${
                    index === activeIndex
                      ? 'w-8 h-3 bg-white rounded-full'
                      : 'w-3 h-3 bg-white/40 rounded-full hover:bg-white/60'
                  }`}
                />
              ))}
            </div>
          )}

          {/* Progress Bar - BADASS */}
          {collectionsToShow.length > 1 && (
            <motion.div 
              className="absolute top-0 left-0 right-0 h-1 bg-white/10"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: isDragging ? 0 : 1 }}
              transition={{ duration: 5, ease: "linear" }}
              style={{ transformOrigin: 'left' }}
            >
              <motion.div 
                className="h-full bg-white/60"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 5, ease: "linear", repeat: Infinity }}
                style={{ transformOrigin: 'left' }}
              />
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Collection;
