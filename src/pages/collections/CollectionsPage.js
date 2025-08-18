import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { mockFirestore, collection, getDocs, query, where, orderBy } from '../../services/mockServices';

const CollectionsPage = () => {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        setLoading(true);
        
        const collectionsQuery = query(
          collection(mockFirestore, 'collections'),
          where('active', '==', true),
          orderBy('order', 'asc')
        );
        
        const snapshot = await getDocs(collectionsQuery);
        
        const collectionsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        setCollections(collectionsData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching collections:', err);
        setError('Failed to load collections');
        setLoading(false);
      }
    };
    
    fetchCollections();
  }, []);

  // Animation variants améliorées
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
        duration: 0.6
      }
    },
    hover: {
      y: -8,
      scale: 1.03,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Collections | Birk Algérie</title>
        <meta name="description" content="Découvrez nos collections exclusives de vêtements" />
      </Helmet>
      
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold mb-4">Nos Collections</h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Découvrez nos collections soigneusement conçues pour correspondre à votre style et à vos préférences.
          </p>
        </motion.div>
        
        {collections.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">No collections available at the moment.</p>
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 px-1 sm:px-0"
          >
            {collections.map((collection) => (
              <motion.div
                key={collection.id}
                variants={itemVariants}
                className="group"
              >
                <Link to={`/collections/${collection.id}`} className="block h-full">
                  <motion.div 
                    className="group relative overflow-hidden rounded-xl bg-gradient-to-b from-gray-900 to-black border border-gray-800 shadow-xl h-full flex flex-col"
                    whileTap={{ scale: 0.98 }}
                    whileHover={{ y: -3, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.8)' }}
                  >
                    {/* Image avec effet de zoom progressif */}
                    <div className="aspect-[4/5] overflow-hidden">
                      <motion.div
                        className="relative h-full w-full"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.6, ease: 'easeOut' }}
                      >
                        <img 
                          src={collection.image} 
                          alt={collection.name} 
                          className="h-full w-full object-contain p-2"
                          loading="lazy"
                        />
                        
                        {/* Overlay avec dégradé plus subtil */}
                        <motion.div 
                          className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"
                          initial={{ opacity: 0.5 }}
                          whileHover={{ opacity: 0.8 }}
                          transition={{ duration: 0.3 }}
                        />
                      </motion.div>
                    </div>
                    
                    {/* Infos collection avec animation */}
                    <div className="p-3 flex-grow flex flex-col justify-between">
                      {/* Nom de la collection plus proéminent */}
                      <motion.h3 
                        className="text-base md:text-lg font-bold text-white group-hover:text-blue-400 transition-colors"
                        whileHover={{ y: -5 }}
                        transition={{ duration: 0.3 }}
                      >
                        {collection.name}
                      </motion.h3>
                      
                      {/* Description courte */}
                      <motion.p 
                        className="text-gray-300 text-sm line-clamp-2 mt-1"
                        whileHover={{ opacity: 1 }}
                        initial={{ opacity: 0.8 }}
                      >
                        {collection.description}
                      </motion.p>
                      
                      <div className="mt-auto pt-2">
                        <motion.button 
                          className="w-full bg-blue-600/80 hover:bg-blue-500 text-white text-sm font-medium py-1.5 rounded-lg transition-colors flex items-center justify-center space-x-1"
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                        >
                          <span>Voir Collection</span>
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </>
  );
};

export default CollectionsPage;