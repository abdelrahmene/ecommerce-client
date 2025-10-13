import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { mockCollections } from './mockData';
import { getHomeSections } from '../../../services/api/collectionsService';
import { getImageUrl } from '../../../config/api';

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
      {/* 🔥 DEBUG ULTRA DÉTAILLÉ: Vérifier le lien avant utilisation */}
      {console.log('==== DEBUG COLLECTION CARD ====')}
      {console.log('🔗 [CARD] Collection object:', JSON.stringify(collection, null, 2))}
      {console.log('🔗 [CARD] Link value:', collection.link)}
      {console.log('🔗 [CARD] Link type:', typeof collection.link)}
      {console.log('================================')}
      
      <Link to={collection.link || '/'} className="block w-full h-full">
        <div className={`relative h-[50vh] sm:h-[60vh] md:h-[70vh] overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-br ${collection.accent || 'from-purple-800 to-purple-950'}`}>
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
              src={getImageUrl(collection.image)}
              alt={collection.title}
              className="absolute inset-0 w-full h-full object-cover"
              style={{ opacity: (collection.imageOpacity || 50) / 100 }}
              onError={(e) => {
                console.log('❌ [IMAGE-ERROR] URL originale:', collection.image);
                console.log('❌ [IMAGE-ERROR] URL construite:', getImageUrl(collection.image));
                e.target.style.display = 'none';
                // Essayer une image de fallback
                if (!e.target.src.includes('placeholder')) {
                  e.target.src = '/images/placeholder-collection.jpg';
                }
              }}
              onLoad={() => console.log('✅ [IMAGE-LOADED]:', getImageUrl(collection.image))}
            />
          )}

          {/* Content Container */}
          <div className="absolute inset-0 p-4 sm:p-6 md:p-8 flex flex-col justify-center items-center text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="max-w-2xl z-10"
            >
              <h3 className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold ${collection.textColor || 'text-white'} mb-2 sm:mb-3 md:mb-4 tracking-tight`}>
                {collection.title}
              </h3>
              {collection.subtitle && (
                <h4 className={`text-lg sm:text-xl md:text-2xl lg:text-3xl font-medium ${collection.textColor || 'text-white'} mb-1 sm:mb-2 opacity-90`}>
                  {collection.subtitle}
                </h4>
              )}
              <p className={`${collection.textColor || 'text-gray-200'} text-sm sm:text-base md:text-lg lg:text-xl mb-4 sm:mb-6 md:mb-8 opacity-90 line-clamp-2 sm:line-clamp-none`}>
                {collection.description}
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-6 py-2.5 sm:px-8 sm:py-3 ${collection.buttonColor || 'bg-white text-black hover:bg-gray-100'} rounded-full text-base sm:text-lg font-medium transition-colors duration-200 shadow-lg`}
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
 // 🧪 DEBUG
 console.log("🧪 [DEBUG] Props reçues dans <Collection>:", data);
 if (data?.content?.items) {
    console.log("🧪 [DEBUG] Section collections items:", data.content.items.map(item => ({
      id: item.id,
      title: item.title,
      image: item.image,
      imageType: typeof item.image
    })));
  }
  
  // Vérifier et corriger les URLs d'images dans les collections de l'admin
  const processCollectionImages = (collections) => {
    return collections.map(collection => ({
      ...collection,
      image: collection.image ? getImageUrl(collection.image) : null,
      // Log pour debug
      _originalImage: collection.image,
      _processedImage: collection.image ? getImageUrl(collection.image) : null
    }));
  };
  // Extraction des données de la section depuis l'admin
  const sectionTitle = data?.content?.title || 'Collections en vedette';
  const sectionSubtitle = data?.content?.subtitle || '';
  const sectionCollections = data?.content?.items || [];
  
  // 🔥 DEBUG COMPLET: Vérifier les liens
  console.log('🔗 [COLLECTION-LINKS] DUMP COMPLET:');
  console.log('  - Nombre de collections:', sectionCollections.length);
  sectionCollections.forEach((item, index) => {
    console.log(`  - Collection ${index + 1}:`, {
      id: item.id,
      collectionId: item.collectionId,
      title: item.title,
      link: item.link,
      linkType: typeof item.link
    });
  });
  console.log('  - Objet data complet:', JSON.stringify(data, null, 2));
  
  // Traiter les URLs d'images et utiliser les collections appropriées
  const collectionsToShow = sectionCollections.length > 0 
    ? processCollectionImages(sectionCollections)
    : collectionsData;
  
  console.log('🎯 [COLLECTION] Collections finales à afficher:', collectionsToShow);
  console.log('🎯 [COLLECTION] Source:', sectionCollections.length > 0 ? 'Props (data)' : 'State (collectionsData)');
  const [[activeIndex, direction], setActiveIndex] = useState([0, 0]);

  // Charger les données depuis l'API
  useEffect(() => {
    console.log('🔄 [COLLECTION] useEffect déclenché');
    console.log('📦 [COLLECTION] sectionCollections.length:', sectionCollections.length);
    const loadCollectionData = async () => {
      try {
        console.log('⏳ [COLLECTION] Début du chargement API...');
        setLoading(true);
        const sections = await getHomeSections();
        console.log('📡 [COLLECTION] Sections reçues:', sections);
        
        // Trouver la section collection correspondante
        const collectionSection = sections.find(section => 
          section.type === 'collection' && section.content?.items?.length > 0
        );
        
        if (collectionSection?.content?.items) {
          // Traiter les images avant de sauvegarder
          const processedItems = processCollectionImages(collectionSection.content.items);
          console.log('🔍 [COLLECTION] Items avant traitement:', collectionSection.content.items);
          console.log('🔍 [COLLECTION] Items après traitement:', processedItems);
          setCollectionsData(processedItems);
          console.log('✅ [COLLECTION] Données chargées depuis la DB:', processedItems.length, 'items');
          console.log('✅ [COLLECTION] Images traitées:', processedItems.map(item => ({
            id: item.id,
            title: item.title,
            originalImage: item._originalImage,
            processedImage: item._processedImage
          })));
        } else {
          // Fallback: charger les collections depuis l'API directement
          const { collectionsService } = await import('../../../services/api/collectionsService');
          const result = await collectionsService.getCollections();
          if (result.success && result.collections.length > 0) {
            // Adapter le format API vers le format attendu
            const adaptedCollections = result.collections.map(collection => ({
              id: collection.id,
              title: collection.name,
              subtitle: collection.description?.substring(0, 100) || '',
              description: collection.description || 'Découvrez notre collection',
              image: collection.image || collection.images?.[0]?.url || collection.heroImage,
              imageOpacity: 70,
              link: `/collection/${collection.id}`, // ✅ CORRECTION: singulier + ID
              accent: 'from-blue-800 to-purple-950',
              textColor: 'text-white',
              buttonColor: 'bg-white text-black hover:bg-gray-100',
              ctaText: 'Découvrir'
            }));
            setCollectionsData(adaptedCollections);
            console.log('✅ [COLLECTION] Collections adaptées depuis API:', adaptedCollections.length);
          }
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
  // 🧪 DEBUG
  console.log("🧪 [DEBUG] Collections à afficher:", collectionsToShow);

  return (
    <div className="relative w-full overflow-hidden bg-gray-50 dark:bg-slate-900/90 transition-colors duration-300 py-4">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Espace pour le contenu */}

        {/* Carrousel */}
        <div className="relative h-[50vh] sm:h-[60vh] md:h-[70vh] w-full">
          <AnimatePresence initial={false} custom={direction}>
            <CollectionCard
              key={collectionsToShow[activeIndex]?.id || `collection-${activeIndex}`}
              collection={collectionsToShow[activeIndex]}
              isActive={true}
              direction={direction}
            />
          </AnimatePresence>

          {/* Indicateurs de navigation */}
          <div className="absolute bottom-4 sm:bottom-6 md:bottom-8 left-1/2 transform -translate-x-1/2 z-30 flex space-x-2">
            {collectionsToShow.map((_, index) => (
              <motion.button
                key={index}
                className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full ${index === activeIndex ? 'bg-white' : 'bg-white/40'}`}
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
