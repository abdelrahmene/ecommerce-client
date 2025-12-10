import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ArrowLeft, AlertTriangle, ShoppingBag, Star, Eye, Heart } from 'lucide-react';
import productService from '../../services/productService';
import imageService from '../../services/imageService';

console.log('🔧 CollectionPage - Utilisation exclusive de l\'API');

// Animations
const fadeIn = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.6 }
  }
};

const slideUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1]
    }
  }
};

// Composant de carte produit avec design badass pour mobile
const ProductCard = ({ product, index }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className="group relative overflow-hidden rounded-xl h-full flex flex-col"
      initial={{ opacity: 0, y: 20 }}
      animate={{
        opacity: 1,
        y: 0,
        transition: {
          delay: index * 0.1,
          duration: 0.5
        }
      }}
      whileTap={{ scale: 0.98 }}
      whileHover={{ y: -3, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.8)' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image avec effet de zoom progressif */}
      <div className="aspect-[4/5] overflow-hidden">
        <motion.div
          className="relative h-full w-full"
          animate={{ scale: isHovered ? 1.05 : 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <img
            src={imageService.getImageUrl(
              product.images && product.images.length > 0
                ? (typeof product.images[0] === 'string'
                  ? product.images[0]
                  : (product.images[0]?.url || '/placeholder.jpg'))
                : '/placeholder.jpg'
            )}
            alt={product.name}
            className="h-full w-full object-cover"
            loading="lazy"
          />


        </motion.div>
      </div>

      {/* Infos produit avec animation */}
      <div className="p-3 flex-grow flex flex-col justify-between">
        {/* Nom du produit plus proéminent */}
        <motion.h3
          className="text-base md:text-lg font-bold text-black transition-colors"
          animate={{ y: isHovered ? -5 : 0 }}
          transition={{ duration: 0.3 }}
        >
          {product.name}
        </motion.h3>

        <div className="mt-auto pt-2 flex items-center justify-between">
          {/* Prix avec devise DA (Dinar Algérien) */}
          <motion.p
            className="text-base font-bold text-black"
            animate={{ scale: isHovered ? 1.05 : 1 }}
            transition={{ duration: 0.2 }}
          >
            <span className="sm:hidden">{product.price || 0} DA</span>
            <span className="hidden sm:inline">{product.price && product.price.toFixed(2)} DA</span>
          </motion.p>
        </div>

        {/* Options de couleurs avec effet de survol amélioré */}
        {product.colorDetails && product.colorDetails.length > 0 && (
          <motion.div
            className="mt-2 flex flex-wrap gap-1.5"
            animate={{ y: isHovered ? -3 : 0, opacity: isHovered ? 1 : 0.9 }}
            transition={{ duration: 0.3 }}
          >
            {product.colorDetails.map((color, i) => (
              <motion.div
                key={i}
                className="h-5 w-5 rounded-full shadow-md border border-gray-700"
                style={{ backgroundColor: color.hex || '#000' }}
                title={color.name}
                whileHover={{ scale: 1.2, y: -2 }}
                transition={{ duration: 0.2 }}
              />
            ))}
          </motion.div>
        )}

        {/* Si pas de colorDetails mais des colors, on affiche un badge basique */}
        {(!product.colorDetails || product.colorDetails.length === 0) && product.colors && product.colors.length > 0 && (
          <div className="mt-2">
            <span className="inline-block text-xs text-gray-400 bg-gray-800 px-2 py-0.5 rounded-md">
              {product.colors[0]}{product.colors.length > 1 ? ` +${product.colors.length - 1}` : ''}
            </span>
          </div>
        )}
      </div>

      {/* Action rapide flottante (uniquement sur les écrans tactiles) */}
      <motion.div
        className="absolute bottom-0 right-0 p-3 z-10 sm:hidden"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: index * 0.1 + 0.3, duration: 0.3 }}
      >
        <div className="bg-blue-600 hover:bg-blue-500 p-2 rounded-full shadow-lg">
          <Eye size={16} className="text-white" />
        </div>
      </motion.div>
    </motion.div>
  );
};

const CollectionPage = () => {
  const { collectionId } = useParams();
  const [collectionData, setCollectionData] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [productsLoading, setProductsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastVisible, setLastVisible] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: false
  });

  // Fetch collection data
  useEffect(() => {
    const fetchCollection = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log('📡 API Collections - Récupération de la collection:', collectionId);

        try {
          // D'abord essayer de récupérer directement par ID
          const collection = await productService.getCollectionById(collectionId);
          console.log('✅ API Collections - Collection récupérée directement par ID:', collection);
          setCollectionData(collection);
          setLoading(false);
        } catch (directError) {
          console.log('⚠️ API Collections - Échec récupération directe, tentative alternative');

          // Si échec, essayer en récupérant toutes les collections et en filtrant
          const collections = await productService.getCollections();
          const collection = collections.find(c => c.id === collectionId || c.slug === collectionId);

          if (!collection) {
            console.error('❌ API Collections - Collection non trouvée:', collectionId);
            setError('Collection not found');
            setLoading(false);
            return;
          }

          console.log('✅ API Collections - Collection trouvée:', collection.name);
          setCollectionData(collection);
          setLoading(false);
        }

      } catch (err) {
        console.error('❌ API Collections - Erreur:', err);
        setError('Failed to load collection details');
        setLoading(false);
      }
    };

    if (collectionId) {
      fetchCollection();
    }
  }, [collectionId]);

  // Nouveau useEffect pour appeler fetchProducts uniquement quand collectionData est disponible
  useEffect(() => {
    if (collectionData) {
      console.log('📡 Collection data disponible, récupération des produits');
      fetchProducts();
    }
  }, [collectionData]);

  // Load more when bottom is reached
  useEffect(() => {
    if (inView && !productsLoading && hasMore) {
      loadMoreProducts();
    }
  }, [inView]);

  const fetchProducts = async () => {
    try {
      setProductsLoading(true);
      console.log('📡 API Products - Récupération des produits pour la collection:', collectionData.id);

      // Utiliser la nouvelle méthode getProductsByCollection
      const productsData = await productService.getProductsByCollection(collectionData.id);

      // Vérifier le format des données reçues
      console.log('✅ API Products - Données reçues:', productsData);

      // S'assurer que products est toujours un tableau
      if (Array.isArray(productsData)) {
        setProducts(productsData);
        setHasMore(productsData.length >= 20);
        console.log('✅ API Products - Produits récupérés (tableau):', productsData.length);
      } else if (typeof productsData === 'object' && productsData !== null) {
        // Si c'est un objet, vérifier s'il contient un tableau
        if (Array.isArray(productsData.products)) {
          setProducts(productsData.products);
          setHasMore(productsData.products.length >= 20);
          console.log('✅ API Products - Produits récupérés (objet.products):', productsData.products.length);
        } else {
          // Si ce n'est pas un tableau, convertir en tableau vide
          console.warn('⚠️ API Products - Format inattendu, conversion en tableau vide');
          setProducts([]);
          setHasMore(false);
        }
      } else {
        // Autre cas, initialiser avec un tableau vide
        console.warn('⚠️ API Products - Données nulles ou non reconnues, utilisation d\'un tableau vide');
        setProducts([]);
        setHasMore(false);
      }

      setProductsLoading(false);

    } catch (err) {
      console.error('❌ API Products - Erreur:', err);
      setError('Failed to load products');
      setProductsLoading(false);
      setProducts([]);
    }
  };

  const loadMoreProducts = async () => {
    if (!lastVisible) return;

    try {
      setProductsLoading(true);
      console.log('📡 API Products - Chargement de plus de produits');

      const filters = {
        collection: collectionData.id,
        active: true,
        limit: 12,
        offset: products.length
      };

      const newProducts = await productService.getProducts(filters);

      // Vérifier que newProducts est un tableau
      if (Array.isArray(newProducts)) {
        if (newProducts.length === 0) {
          setHasMore(false);
        } else {
          setProducts(prev => [...prev, ...newProducts]);
          setHasMore(newProducts.length >= 12);
        }
      } else {
        console.warn('⚠️ Format de nouveaux produits non valide');
        setHasMore(false);
      }

      setProductsLoading(false);
    } catch (err) {
      console.error('❌ API Products - Erreur chargement supplémentaire:', err);
      setProductsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-white">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center p-8"
        >
          <div className="w-16 h-16 border-4 border-t-blue-600 border-blue-400/30 rounded-full animate-spin mx-auto mb-6"></div>
          <h2 className="text-xl font-bold text-gray-900">Chargement de la collection...</h2>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-white">
        <div className="text-center p-8 max-w-md">
          <AlertTriangle size={48} className="text-red-500 mb-4 mx-auto" />
          <h1 className="text-2xl font-bold mb-2 text-gray-900">Erreur</h1>
          <p className="text-gray-400 mb-6">{error}</p>
          <Link
            to="/collections"
            className="flex items-center justify-center text-blue-400 hover:text-blue-300 transition-colors"
          >
            <ArrowLeft size={16} className="mr-2" />
            Retour aux Collections
          </Link>
        </div>
      </div>
    );
  }

  if (!collectionData) {
    return null;
  }

  return (
    <div className="bg-white text-gray-900 min-h-screen">
      <Helmet>
        <title>{collectionData.name} | Votre Boutique</title>
        <meta name="description" content={collectionData.description} />
      </Helmet>

      {/* Hero banner avec parallaxe */}
      <div className="relative h-[70vh] overflow-hidden">
        <motion.div
          className="absolute inset-0 z-0"
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5 }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-gray-900 z-10"></div>
          <img
            src={imageService.getImageUrl(collectionData.image) || '/placeholder-collection.jpg'}
            alt={collectionData.name}
            className="w-full h-full object-cover"
          />
        </motion.div>

        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-4">
          <motion.h1
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-5xl md:text-7xl font-bold text-white mb-4 drop-shadow-lg"
          >
            {collectionData.name}
          </motion.h1>

          <motion.div
            initial={{ width: 0 }}
            animate={{ width: '100px' }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="h-1 bg-blue-600 mb-6 max-w-[100px]"
          />

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.8 }}
            className="text-xl text-gray-200 max-w-2xl"
          >
            {collectionData.description}
          </motion.p>
        </div>
      </div>

      {/* Breadcrumbs */}
      <div className="container mx-auto px-4 py-6">
        <motion.nav
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex"
          aria-label="Breadcrumb"
        >
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            <li className="inline-flex items-center">
              <Link to="/" className="text-gray-400 hover:text-white transition-colors">
                Accueil
              </Link>
            </li>
            <li>
              <div className="flex items-center">
                <span className="mx-2 text-gray-600">/</span>
                <Link to="/collections" className="text-gray-400 hover:text-white transition-colors">
                  Collections
                </Link>
              </div>
            </li>
            <li aria-current="page">
              <div className="flex items-center">
                <span className="mx-2 text-gray-600">/</span>
                <span className="text-blue-400">{collectionData.name}</span>
              </div>
            </li>
          </ol>
        </motion.nav>
      </div>

      {/* Products grid - avec design optimisé pour mobile */}
      <div className="container mx-auto px-4 py-8 md:py-12">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-between items-center mb-6 md:mb-8"
        >
          <motion.h2
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-xl md:text-3xl font-bold text-white relative"
          >
            <span className="inline-block">
              <span className="relative z-10">{products?.length || 0} Produit{(products?.length || 0) !== 1 ? 's' : ''}</span>
              <motion.span
                className="absolute -bottom-1 left-0 h-1 bg-blue-600 w-full z-0"
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 0.7, delay: 0.5 }}
              />
            </span>
          </motion.h2>

          {/* Bouton de filtrage mobile - serait fonctionnel dans une future version */}
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="md:hidden bg-gray-800 px-3 py-1.5 rounded-lg text-sm font-medium text-gray-300 hover:bg-gray-700"
          >
            Filtrer
          </motion.button>
        </motion.div>

        {/* Grille des produits avec animation de stagger améliorée */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
          <AnimatePresence>
            {Array.isArray(products) && products.map((product, index) => (
              <motion.div
                key={product.id || index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{
                  duration: 0.4,
                  delay: index * 0.05, // Stagger plus rapide pour mobile
                  ease: [0.25, 1, 0.5, 1]
                }}
              >
                <Link to={`/product/${product.id}`} className="block h-full">
                  <ProductCard product={product} index={index} />
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* État de chargement pour les produits - design amélioré */}
          {productsLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-full flex justify-center py-8"
            >
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 border-3 border-t-blue-500 border-blue-300/20 rounded-full animate-spin mb-3"></div>
                <p className="text-blue-400 text-sm animate-pulse">Chargement des produits...</p>
              </div>
            </motion.div>
          )}

          {/* Message si pas de produits - design optimisé */}
          {!productsLoading && Array.isArray(products) && products.length === 0 && (
            <motion.div
              variants={fadeIn}
              initial="hidden"
              animate="visible"
              className="col-span-full text-center py-10 md:py-16"
            >
              <div className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-xl p-6 md:p-8 max-w-sm mx-auto border border-gray-700 shadow-xl">
                <div className="mb-4 text-gray-400">
                  <AlertTriangle size={32} className="mx-auto mb-3 text-yellow-500" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-white">Aucun produit trouvé</h3>
                <p className="text-gray-400 text-sm">
                  Aucun produit n'est disponible dans cette collection pour le moment.
                </p>
              </div>
            </motion.div>
          )}
        </div>

        {/* Déclencheur de chargement supplémentaire */}
        {hasMore && (
          <div ref={ref} className="h-20">
            {/* Espace pour le déclenchement du chargement */}
          </div>
        )}
      </div>
    </div>
  );
};

export default CollectionPage;