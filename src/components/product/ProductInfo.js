import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, Plus, Minus, Check } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useCart } from '../../contexts/CartContext';
import ShippingForm from '../checkout/ShippingForm';

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

const ProductInfo = ({ 
  product, 
  selectedColor, 
  setSelectedColor, 
  selectedSize, 
  setSelectedSize, 
  quantity, 
  handleQuantityChange, 
  handleAddToCart 
}) => {
  const { processCashOnDeliveryOrder } = useCart();
  const [availableSizes, setAvailableSizes] = useState([]);

  // Extraire les pointures disponibles depuis les variants
  useEffect(() => {
    if (product?.variants && product.variants.length > 0) {
      const sizesWithStock = product.variants
        .filter(variant => variant.stock > 0) // Seulement variants en stock
        .map(variant => {
          const options = typeof variant.options === 'string' 
            ? JSON.parse(variant.options) 
            : variant.options;
          
          return {
            value: options.size || options.pointure,
            available: variant.stock > 0,
            stock: variant.stock,
            variantId: variant.id
          };
        })
        .filter(size => size.value) // Filtrer les undefined
        .sort((a, b) => {
          const numA = parseInt(a.value);
          const numB = parseInt(b.value);
          return numA - numB;
        });
      
      // Supprimer les doublons
      const uniqueSizes = Array.from(
        new Map(sizesWithStock.map(item => [item.value, item])).values()
      );
      
      setAvailableSizes(uniqueSizes);
      console.log('📏 Pointures disponibles:', uniqueSizes);
    } else if (product?.sizes) {
      // Fallback sur l'ancien système
      setAvailableSizes(product.sizes.filter(s => s.available));
    }
  }, [product]);

  // Gérer la soumission de commande
  const handleOrderSubmit = async (orderData) => {
    try {
      const response = await processCashOnDeliveryOrder(orderData);
      
      if (response.success) {
        handleAddToCart({
          deliveryInfo: orderData.customer,
          orderId: response.orderId,
          paymentMethod: 'cash-on-delivery',
          yalidineInfo: orderData.yalidine
        });

        toast.success(
          <div>
            <p className="font-bold">✅ Commande enregistrée !</p>
            <p className="text-sm">Numéro: #{response.orderId}</p>
            <p className="text-xs text-gray-600">Vous serez contacté sous 24h</p>
          </div>,
          { duration: 5000 }
        );
      }
    } catch (error) {
      console.error('❌ Erreur:', error);
      throw error;
    }
  };

  if (!product) return null;

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeInUp}
      className="flex flex-col h-full"
    >
      {/* Titre et évaluation */}
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{product.name}</h1>
      
      <div className="flex items-center mt-3 space-x-4">
        <div className="flex items-center">
          {[...Array(5)].map((_, i) => (
            <Star 
              key={i} 
              size={16} 
              className={`${i < Math.floor(product.rating || 0) ? 'text-yellow-400' : 'text-gray-300'}`} 
              fill={i < Math.floor(product.rating || 0) ? 'currentColor' : 'none'}
            />
          ))}
          <span className="ml-2 text-sm font-medium text-gray-600 dark:text-gray-400">
            {product.rating && product.rating.toFixed(1)}
          </span>
        </div>
        
        {product.reviewCount && (
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {product.reviewCount} avis
          </span>
        )}
      </div>
      
      {/* Prix */}
      <div className="mt-6 flex items-center">
        <span className="text-2xl font-bold text-gray-900 dark:text-white">
          {product.price && product.price.toFixed(2)} DA
        </span>
        
        {product.comparePrice && (
          <span className="ml-3 text-lg line-through text-gray-500 dark:text-gray-400">
            {product.comparePrice.toFixed(2)} DA
          </span>
        )}
        
        {product.discount > 0 && (
          <span className="ml-3 text-sm font-medium text-red-600 bg-red-100 px-2 py-1 rounded">
            -{product.discount}%
          </span>
        )}
      </div>
      
      {/* Description */}
      <p className="mt-4 text-gray-600 dark:text-gray-300">
        {product.description}
      </p>
      
      {/* Sélection de couleur */}
      {product.colors && product.colors.length > 0 && (
        <div className="mt-6">
          <h3 className="text-sm font-medium text-gray-900 dark:text-white">Couleur</h3>
          <div className="flex items-center space-x-3 mt-2">
            {product.colors.map((color, index) => (
              <button
                key={index}
                onClick={() => setSelectedColor(color)}
                className={`relative w-10 h-10 rounded-full transition-transform ${
                  selectedColor === color ? 'ring-2 ring-offset-2 ring-blue-500 scale-110' : ''
                }`}
                style={{ backgroundColor: color.value }}
                aria-label={`Couleur ${color.name}`}
              >
                {selectedColor === color && (
                  <span className="absolute inset-0 flex items-center justify-center">
                    <Check size={16} className="text-white" />
                  </span>
                )}
              </button>
            ))}
          </div>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {selectedColor ? selectedColor.name : ''}
          </p>
        </div>
      )}
      
      {/* Sélection de taille - Afficher seulement les pointures disponibles */}
      {availableSizes.length > 0 && (
        <div className="mt-8">
          <div className="flex items-center justify-between">
            <motion.h3 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="text-base font-bold text-gray-900 dark:text-white flex items-center"
            >
              <span className="mr-2 bg-gradient-to-r from-blue-500 to-indigo-600 h-5 w-1 rounded-full"></span>
              Pointures Disponibles
            </motion.h3>
            <span className="text-xs text-gray-500">
              {availableSizes.length} pointure{availableSizes.length > 1 ? 's' : ''} en stock
            </span>
          </div>
          
          <motion.div className="flex flex-wrap gap-3 mt-4">
            {availableSizes.map((size) => (
              <motion.button
                key={`size-${size.value}`}
                onClick={() => setSelectedSize(size)}
                whileHover={{ scale: 1.08, y: -3 }}
                whileTap={{ scale: 0.95 }}
                className={`relative h-12 w-12 flex items-center justify-center rounded-lg font-bold transition-all duration-300 ${
                  selectedSize?.value === size.value
                    ? 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/30'
                    : 'bg-gray-100 text-gray-900 hover:shadow-md dark:bg-gray-800 dark:text-gray-300'
                }`}
              >
                {size.value}
                {size.stock <= 3 && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-orange-500 rounded-full"></span>
                )}
                {selectedSize?.value === size.value && (
                  <motion.div 
                    className="absolute inset-0 rounded-lg border-2 border-blue-500"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  />
                )}
              </motion.button>
            ))}
          </motion.div>
          
          {selectedSize && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-4 flex items-center justify-between"
            >
              <div className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-medium">
                Pointure: {selectedSize.value}
              </div>
              {selectedSize.stock <= 3 && (
                <span className="text-xs text-orange-600 font-medium">
                  Plus que {selectedSize.stock} en stock !
                </span>
              )}
            </motion.div>
          )}
        </div>
      )}

      {availableSizes.length === 0 && (
        <div className="mt-8 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
          <p className="text-sm text-red-600 dark:text-red-400 font-medium">
            Aucune pointure disponible pour le moment
          </p>
        </div>
      )}

      {/* Quantité */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-6 flex items-center"
      >
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mr-4">
          Quantité:
        </label>
        <div className="flex items-center border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 shadow-sm">
          <motion.button
            type="button"
            onClick={() => handleQuantityChange(-1)}
            whileHover={{ backgroundColor: '#f3f4f6' }}
            whileTap={{ scale: 0.95 }}
            className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white rounded-l-lg"
          >
            <Minus size={18} />
          </motion.button>
          <span className="w-10 text-center text-gray-900 dark:text-white font-medium">
            {quantity}
          </span>
          <motion.button
            type="button"
            onClick={() => handleQuantityChange(1)}
            whileHover={{ backgroundColor: '#f3f4f6' }}
            whileTap={{ scale: 0.95 }}
            className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white rounded-r-lg"
          >
            <Plus size={18} />
          </motion.button>
        </div>
      </motion.div>
      
      {/* Formulaire de livraison Yalidine */}
      <div className="mt-8">
        <ShippingForm
          product={product}
          quantity={quantity}
          selectedSize={selectedSize}
          selectedColor={selectedColor}
          onSubmitSuccess={handleOrderSubmit}
        />
      </div>
      
      {/* Stock et livraison */}
      <div className="mt-6 border-t border-gray-200 dark:border-gray-800 pt-6 space-y-3">
        {availableSizes.length > 0 ? (
          <div className="flex items-center text-green-600 dark:text-green-500">
            <Check size={16} className="mr-2" />
            <span className="text-sm font-medium">
              En stock ({availableSizes.reduce((sum, s) => sum + s.stock, 0)} articles disponibles)
            </span>
          </div>
        ) : (
          <div className="flex items-center text-red-600 dark:text-red-500">
            <span className="text-sm font-medium">Rupture de stock</span>
          </div>
        )}
        
        <div className="flex items-center text-gray-600 dark:text-gray-400">
          <span className="text-sm">Livraison dans toute l'Algérie via Yalidine</span>
        </div>
        
        <div className="flex items-center text-gray-600 dark:text-gray-400">
          <span className="text-sm">Paiement à la livraison</span>
        </div>
      </div>
      
      {/* Référence */}
      {product.sku && (
        <div className="mt-6 text-sm text-gray-500 dark:text-gray-400">
          Référence : {product.sku}
        </div>
      )}
    </motion.div>
  );
};

export default ProductInfo;
