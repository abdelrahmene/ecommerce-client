import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { useInView } from 'react-intersection-observer';
import { ChevronRight, Check } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useCart } from '../../contexts/CartContext';
import useProducts from '../../hooks/useProducts';
import { toast } from 'react-hot-toast';

// Composants
import ProductGallery from '../../components/product/ProductGallery';
import ProductInfo from '../../components/product/ProductInfo';
import ProductTabs from '../../components/product/ProductTabs';
import RelatedProducts from '../../components/product/RelatedProducts';

// Données de test
const testProduct = {
  id: 'p1',
  name: 'Arizona Big Buckle',
  description: "L'iconique sandale Arizona réinventée avec une grande boucle métallique pour un style affirmé. Dotée d'une semelle anatomique en liège naturel et d'une doublure en cuir suédé, elle offre un confort exceptionnel tout en apportant une touche d'élégance à votre tenue.",
  price: 149.99,
  oldPrice: 149.99,
  discount: 0,
  rating: 4.8,
  reviewCount: 124,
  stock: 15,
  sku: 'BRK-AZ-BGB-001',
  category: 'sandales',
  colors: [
    { name: 'Noir', value: '#000000', images: [
      'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=1160&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1595341888016-a392ef81b7de?q=80&w=1160&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?q=80&w=943&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?q=80&w=1064&auto=format&fit=crop'
    ]},
    { name: 'Marron', value: '#8B4513', images: [
      'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?q=80&w=943&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1595341888016-a392ef81b7de?q=80&w=1160&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=1160&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?q=80&w=1064&auto=format&fit=crop'
    ]},
    { name: 'Taupe', value: '#483C32', images: [
      'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?q=80&w=1064&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=1160&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1595341888016-a392ef81b7de?q=80&w=1160&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?q=80&w=943&auto=format&fit=crop'
    ]}
  ],
  sizes: [
    { value: '35', available: true },
    { value: '36', available: true },
    { value: '37', available: true },
    { value: '38', available: true },
    { value: '39', available: true },
    { value: '40', available: true },
    { value: '41', available: true },
    { value: '42', available: false },
    { value: '43', available: true },
    { value: '44', available: true },
    { value: '45', available: false },
    { value: '46', available: true }
  ],
  specifications: [
    { name: 'Matériau extérieur', value: 'Cuir Birko-Flor' },
    { name: 'Semelle intérieure', value: 'Liège naturel' },
    { name: 'Semelle extérieure', value: 'EVA' },
    { name: 'Doublure', value: 'Cuir suédé' },
    { name: 'Boucles', value: 'Métal' },
    { name: 'Pays d\'origine', value: 'Allemagne' }
  ],
  features: [
    'Semelle anatomique en liège naturel',
    'Soutien de la voûte plantaire',
    'Coupe régulière',
    'Boucles ajustables',
    'Résistant à l\'eau',
    'Durable et léger'
  ],
  relatedProducts: [
    {
      id: 'rp1',
      name: 'Gizeh Platform',
      price: 139.99,
      image: 'https://images.unsplash.com/photo-1603808033192-082d6919d3e1?q=80&w=1015&auto=format&fit=crop',
      accent: 'from-yellow-400 to-amber-600'
    },
    {
      id: 'rp2',
      name: 'Madrid Big Buckle',
      price: 129.99,
      image: 'https://images.unsplash.com/photo-1604671801908-6f0c6a092c05?q=80&w=1170&auto=format&fit=crop',
      accent: 'from-neutral-400 to-stone-600'
    },
    {
      id: 'rp3',
      name: 'Boston Soft Footbed',
      price: 159.99,
      image: 'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?q=80&w=1112&auto=format&fit=crop',
      accent: 'from-stone-400 to-stone-600'
    }
  ]
};

const ProductPage = () => {
  const { id } = useParams();
  const { isDarkMode } = useTheme();
  const { addToCart, openCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [showNotification, setShowNotification] = useState(false);
  
  // Refs pour animations
  const [headerRef, headerInView] = useInView({ threshold: 0 });
  const [imageRef, imageInView] = useInView({
    threshold: 0.3,
    triggerOnce: true
  });
  const [detailsRef, detailsInView] = useInView({
    threshold: 0.3,
    triggerOnce: true
  });

  // Utiliser le hook useProducts pour récupérer les données du produit
  const { getProduct, getSimilarProducts } = useProducts();
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        
        // Essayer de récupérer les données réelles d'abord
        try {
          const productData = await getProduct(id);
          
          if (productData) {
            console.log('Données du produit récupérées:', productData);
            console.log('🔍 VARIANTS disponibles?', productData.variants ? productData.variants.length : 'NONE');
            if (productData.variants && productData.variants.length > 0) {
              console.log('📦 Premier variant:', productData.variants[0]);
              console.log('📦 Options du premier variant:', productData.variants[0].options);
            }
            
            // Préparer les données de couleurs avec images
            let processedColors = [];
            
            // Si le produit a des images et des couleurs
            if (productData.images && productData.images.length > 0) {
              // Si le produit a des colorDetails, on les utilise
              if (productData.colorDetails && productData.colorDetails.length > 0) {
                // Traiter toutes les images disponibles
                const processedImages = productData.images.map(img => 
                  typeof img === 'string' ? img : (img?.url || '')
                ).filter(img => img);
                
                processedColors = productData.colorDetails.map((color, index) => ({
                  name: color.name || `Couleur ${index + 1}`,
                  value: color.hex || '#000000',
                  images: processedImages // Utiliser toutes les images pour chaque couleur
                }));
              } 
              // Sinon, on crée une couleur par défaut avec les images disponibles
              else {
                const processedImages = productData.images.map(img => 
                  typeof img === 'string' ? img : (img?.url || '')
                ).filter(img => img);
                
                processedColors = [{
                  name: 'Couleur par défaut',
                  value: '#000000',
                  images: processedImages
                }];
                
                if (productData.colors && productData.colors.length > 0) {
                  processedColors[0].name = productData.colors[0];
                }
              }
            }
            
            // Si aucune couleur n'a été créée, utiliser les données de test
            if (processedColors.length === 0) {
              processedColors = testProduct.colors;
            }
            
            // Traitement des pointures et du stock
            let processedSizes = [];
            
            // Constantes pour les pointures adultes et enfants (identiques à celles de l'admin)
            const adultShoeSizeOptions = ['36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46'];
            const kidsShoeSizeOptions = ['28', '29', '30', '31', '32', '33', '34', '35'];
            
            // Vérifier si nous avons du stock par pointure dans les données
            if (productData.stockBySize && Object.keys(productData.stockBySize).length > 0) {
              console.log('Stock par pointure détecté:', productData.stockBySize);
              
              // Extraire les pointures directement depuis stockBySize
              const availableSizes = Object.keys(productData.stockBySize);
              
              // Séparer les pointures adultes et enfants
              const adultSizes = availableSizes.filter(size => adultShoeSizeOptions.includes(size));
              const kidsSizes = availableSizes.filter(size => kidsShoeSizeOptions.includes(size));
              
              // Créer un objet pour chaque pointure avec sa disponibilité et son stock
              processedSizes = [
                ...adultSizes.map(size => ({
                  value: size,
                  available: productData.stockBySize[size] > 0,
                  stock: productData.stockBySize[size] || 0,
                  type: 'adult'
                })),
                ...kidsSizes.map(size => ({
                  value: size,
                  available: productData.stockBySize[size] > 0,
                  stock: productData.stockBySize[size] || 0,
                  type: 'kids'
                }))
              ];
              
              // Trier les pointures par ordre numérique
              processedSizes.sort((a, b) => parseInt(a.value) - parseInt(b.value));
            } else if (productData.sizes && productData.sizes.length > 0) {
              // Si nous avons déjà des pointures formatées
              processedSizes = productData.sizes;
            } else {
              // Utiliser les pointures de test par défaut
              processedSizes = testProduct.sizes;
            }
            
            // Charger les produits similaires depuis la catégorie
            let relatedProducts = [];
            if (productData.categoryId) {
              try {
                const similar = await getSimilarProducts(id, 4);
                relatedProducts = similar || [];
                console.log('✅ Produits similaires chargés:', relatedProducts.length);
              } catch (err) {
                console.warn('⚠️ Erreur chargement produits similaires:', err);
                relatedProducts = [];
              }
            }
            
            // Traitement des données du produit
            // Fusionner avec les données de test pour les champs manquants
            const processedProduct = {
              ...testProduct,  // Base avec les données de test
              ...productData,  // Écrase avec les données réelles disponibles
              // Utiliser les couleurs traitées avec les images
              colors: processedColors,
              // Utiliser les pointures traitées
              sizes: processedSizes,
              specifications: productData.specifications || testProduct.specifications,
              features: productData.features || testProduct.features,
              relatedProducts: relatedProducts.length > 0 ? relatedProducts : testProduct.relatedProducts
            };
            
            setProduct(processedProduct);
            setSelectedColor(processedColors[0]);
            setSelectedSize(processedProduct.sizes.find(size => size.available));
            setLoading(false);
            return;
          }
        } catch (firebaseErr) {
          console.log('Erreur lors de la récupération des données du produit:', firebaseErr);
        }
        
        // Si on n'a pas pu récupérer les données réelles, utiliser les données de test
        console.log('Utilisation des données de test car aucune donnée réelle disponible');
        setProduct(testProduct);
        setSelectedColor(testProduct.colors[0]);
        setSelectedSize(testProduct.sizes.find(size => size.available));
        setLoading(false);
      } catch (err) {
        console.error('Erreur lors du chargement du produit:', err);
        setError('Impossible de charger les détails du produit. Veuillez réessayer plus tard.');
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id, getProduct, navigate]);

  const handleQuantityChange = (value) => {
    const newQuantity = Math.max(1, Math.min(10, quantity + value));
    setQuantity(newQuantity);
  };

  const handleAddToCart = (deliveryOptions = {}) => {
    if (!selectedSize) {
      toast.error('Veuillez sélectionner une pointure');
      return;
    }
    
    if (!selectedColor) {
      toast.error('Veuillez sélectionner une couleur');
      return;
    }
    
    // S'assurer que l'image est correctement extraite
    const productImage = selectedColor.images && selectedColor.images.length > 0 
      ? (selectedColor.images[0].url || selectedColor.images[0]) 
      : null;
    
    // Créer un objet produit modifié avec l'image correcte
    const productToAdd = {
      ...product,
      image: productImage
    };
    
    const options = {
      size: selectedSize.value,
      color: selectedColor.name,
      colorCode: selectedColor.code,
      ...deliveryOptions // Ajouter les informations de livraison
    };
    
    addToCart(productToAdd, quantity, options);
    
    // Ne pas ouvrir automatiquement le panier si c'est un achat direct
    if (!deliveryOptions.deliveryInfo) {
      openCart();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="relative w-20 h-20">
          <div className="absolute inset-0 border-t-4 border-blue-500 rounded-full animate-spin"></div>
          <div className="absolute inset-3 border-t-4 border-purple-500 rounded-full animate-spin-slow"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Oups, une erreur est survenue</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
          <Link to="/" className="inline-block bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900 px-6 py-3 rounded-lg font-medium hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors">
            Retour à l'accueil
          </Link>
        </div>
      </div>
    );
  }

  if (!product) return null;

  return (
    <>
      <Helmet>
        <title>{product.name} | Notre Boutique</title>
        <meta name="description" content={product.description ? product.description.substring(0, 160) : ''} />
      </Helmet>

      {/* Notification d'ajout au panier */}
      <AnimatePresence>
        {showNotification && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded shadow-lg flex items-center"
          >
            <Check size={20} className="mr-2" />
            <span>Produit ajouté au panier avec succès !</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="min-h-screen bg-white dark:bg-gray-900 pt-24">
        {/* Titre du produit avec animation */}
        <motion.div 
          ref={headerRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="container mx-auto px-4 py-6"
        >
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            {product.name}
          </h1>
        </motion.div>

        {/* Contenu principal */}
        <div className="container mx-auto px-4 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Galerie d'images avec animations */}
            <div ref={imageRef}>
              <ProductGallery 
                product={product} 
                selectedColor={selectedColor} 
                discount={product.discount} 
              />
            </div>
            
            {/* Informations produit avec animations */}
            <div ref={detailsRef}>
              <ProductInfo 
                product={product}
                selectedColor={selectedColor}
                setSelectedColor={setSelectedColor}
                selectedSize={selectedSize}
                setSelectedSize={setSelectedSize}
                quantity={quantity}
                handleQuantityChange={handleQuantityChange}
                handleAddToCart={handleAddToCart}
              />
            </div>
          </div>

          {/* Onglets de description, spécifications et avis */}
          <ProductTabs 
            product={product} 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
          />

          {/* Produits similaires */}
          <RelatedProducts products={product.relatedProducts} />
        </div>
      </div>
    </>
  );
};

export default ProductPage;