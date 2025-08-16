import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Share2, Heart } from 'lucide-react';
import SwiperCore, { Navigation, Thumbs, Pagination, EffectFade } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';

// Initialiser les modules Swiper
SwiperCore.use([Navigation, Thumbs, Pagination, EffectFade]);

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

const ProductGallery = ({ product, selectedColor, discount }) => {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  
  // Images de secours si les données réelles ne sont pas disponibles
  const fallbackImages = [
    'https://www.birkenstock.com/dw/image/v2/BDXC_PRD/on/demandware.static/-/Sites-master-catalog/default/dw4f283d3e/1018742/1018742.jpg',
    'https://www.birkenstock.com/dw/image/v2/BDXC_PRD/on/demandware.static/-/Sites-master-catalog/default/dw6f3d9da3/0560773/0560773.jpg',
    'https://www.birkenstock.com/dw/image/v2/BDXC_PRD/on/demandware.static/-/Sites-master-catalog/default/dw9f5d4e33/0034793/0034793.jpg'
  ];
  
  // Déterminer quelles images utiliser
  const imagesToUse = (selectedColor && selectedColor.images && selectedColor.images.length > 0) 
    ? selectedColor.images.filter(img => img) // Filtrer les valeurs null/undefined/empty
    : (product?.images && product.images.length > 0 
      ? product.images.map(img => typeof img === 'string' ? img : (img?.url || ''))
      : fallbackImages);

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeInUp}
      className="relative"
    >
      {discount > 0 && (
        <div className="absolute top-4 left-4 z-10 bg-red-500 text-white px-3 py-1 rounded-full font-medium text-sm">
          -{discount}%
        </div>
      )}
      
      <motion.div 
        className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl overflow-hidden shadow-xl"
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <Swiper
          thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
          spaceBetween={0}
          slidesPerView={1}
          effect="fade"
          fadeEffect={{ crossFade: true }}
          pagination={{ 
            clickable: true,
            dynamicBullets: true,
            renderBullet: function (index, className) {
              return `<span class="${className} bg-blue-500"></span>`;
            }
          }}
          className="product-main-swiper"
        >
          {imagesToUse.map((image, index) => (
            <SwiperSlide key={index}>
              <motion.div 
                className="aspect-square relative overflow-hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 * index }}
              >
                <img 
                  src={image} 
                  alt={`${product?.name || 'Produit'} - Vue ${index + 1}`} 
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>
      </motion.div>
      
      {/* Thumbnails avec animations */}
      <motion.div 
        className="mt-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex justify-between items-center mb-3">
          <motion.h4 
            className="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <span className="mr-2 bg-gradient-to-r from-blue-500 to-indigo-600 h-3 w-1 rounded-full"></span>
            Toutes les images
          </motion.h4>
          <motion.div 
            className="text-xs text-blue-600 dark:text-blue-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {imagesToUse.length} photos
          </motion.div>
        </div>
        
        <Swiper
          onSwiper={setThumbsSwiper}
          spaceBetween={12}
          slidesPerView={4}
          watchSlidesProgress={true}
          className="product-thumbs-swiper"
        >
          {imagesToUse.map((image, index) => (
            <SwiperSlide key={index}>
              <motion.div 
                className="cursor-pointer rounded-lg overflow-hidden shadow-md hover:shadow-lg"
                whileHover={{ scale: 1.1, y: -5 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 * index + 0.5 }}
              >
                <div className="aspect-square relative">
                  <img 
                    src={image} 
                    alt={`Miniature ${index + 1}`} 
                    className="w-full h-full object-cover object-center"
                  />
                  <motion.div 
                    className="absolute inset-0 border-3 border-transparent hover:border-blue-500 transition-all duration-200"
                    whileHover={{ borderColor: '#3b82f6' }}
                  />
                </div>
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>
      </motion.div>
      
      {/* Actions rapides */}
      <div className="mt-6 flex items-center justify-between">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          <Share2 size={18} />
          <span className="text-sm font-medium">Partager</span>
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          <Heart size={18} />
          <span className="text-sm font-medium">Favoris</span>
        </motion.button>
      </div>
    </motion.div>
  );
};

export default ProductGallery;