import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { getImageUrl, DEFAULT_IMAGES } from '../../config/api';

const ImageWithFallback = ({ 
  imagePath, 
  alt, 
  className, 
  fallbackImage,
  onError,
  onLoad,
  animate,
  transition,
  ...props 
}) => {
  const [imageStatus, setImageStatus] = useState('loading'); // 'loading', 'loaded', 'error'
  const [currentSrc, setCurrentSrc] = useState(null);

  React.useEffect(() => {
    console.log('🚀 [IMG-EFFECT] ===========================================');
    console.log('🚀 [IMG-EFFECT] Démarrage useEffect pour:', imagePath);
    console.log('🚀 [IMG-EFFECT] Props reçues:', { imagePath, fallbackImage, alt });
    console.log('🚀 [IMG-EFFECT] ===========================================');
    
    if (!imagePath) {
      console.log('❌ [IMG-EFFECT] Aucun imagePath fourni, passage à l\'état error');
      setImageStatus('error');
      return;
    }

    const imageUrl = getImageUrl(imagePath);
    console.log('🎯 [IMG-EFFECT] URL finale construite:', imageUrl);
    
    setCurrentSrc(imageUrl);
    setImageStatus('loading');
    console.log('⏳ [IMG-EFFECT] État mis à loading, création de l\'objet Image...');

    // Précharger l'image pour détecter les erreurs
    const img = new Image();
    console.log('🖼️ [IMG-EFFECT] Objet Image créé, configuration des handlers...');
    
    img.onload = () => {
      console.log('✅ [IMG-EFFECT] Image chargée avec succès!');
      console.log('✅ [IMG-EFFECT] - URL:', imageUrl);
      console.log('✅ [IMG-EFFECT] - Dimensions:', img.naturalWidth + 'x' + img.naturalHeight);
      console.log('✅ [IMG-EFFECT] - Complete:', img.complete);
      setImageStatus('loaded');
      if (onLoad) {
        console.log('🔄 [IMG-EFFECT] Appel du callback onLoad');
        onLoad();
      }
    };
    
    img.onerror = (error) => {
      console.log('❌ [IMG-ERROR] ===========================================');
      console.log('❌ [IMG-ERROR] Erreur chargement image:', imagePath);
      console.log('❌ [IMG-ERROR] URL construite:', imageUrl);
      console.log('❌ [IMG-ERROR] Type d\'erreur:', error);
      console.log('❌ [IMG-ERROR] Error event:', error.type);
      console.log('❌ [IMG-ERROR] Target src:', error.target?.src);
      console.log('❌ [IMG-ERROR] Target complete:', error.target?.complete);
      console.log('❌ [IMG-ERROR] Target naturalWidth:', error.target?.naturalWidth);
      console.log('❌ [IMG-ERROR] Target naturalHeight:', error.target?.naturalHeight);
      console.log('❌ [IMG-ERROR] Current origin:', window.location.origin);
      console.log('❌ [IMG-ERROR] ===========================================');
      
      // Test CORS avec fetch pour plus d'infos
      console.log('🔍 [IMG-DEBUG] Test CORS avec fetch...');
      fetch(imageUrl, { 
        method: 'HEAD',
        mode: 'cors',
        credentials: 'omit',
        cache: 'no-cache'
      })
      .then(response => {
        console.log('✅ [IMG-DEBUG] Fetch HEAD réussi:', response.status);
        console.log('✅ [IMG-DEBUG] Headers de réponse:');
        for (let [key, value] of response.headers.entries()) {
          console.log(`✅ [IMG-DEBUG]   ${key}: ${value}`);
        }
      })
      .catch(fetchError => {
        console.log('❌ [IMG-DEBUG] Fetch HEAD échoué:', fetchError.name);
        console.log('❌ [IMG-DEBUG] Message:', fetchError.message);
        console.log('❌ [IMG-DEBUG] Stack:', fetchError.stack);
      });
      
      // Essayer l'image de fallback
      if (fallbackImage) {
        console.log('🔄 [IMG-FALLBACK] Utilisation de fallbackImage:', fallbackImage);
        setCurrentSrc(fallbackImage);
        setImageStatus('loaded');
      } else {
        console.log('🔄 [IMG-FALLBACK] Utilisation de DEFAULT_IMAGES.FALLBACK_IMAGE');
        // Utiliser l'image par défaut
        setCurrentSrc(DEFAULT_IMAGES.FALLBACK_IMAGE);
        setImageStatus('error');
      }
      
      if (onError) onError();
    };
    
    img.src = imageUrl;
    console.log('🔗 [IMG-EFFECT] Attribution de src à l\'objet Image:', imageUrl);
    console.log('🔗 [IMG-EFFECT] Headers prévus de la requête:');
    console.log('🔗 [IMG-EFFECT] - Origin: ' + window.location.origin);
    console.log('🔗 [IMG-EFFECT] - Referrer: ' + document.referrer);
    console.log('🔗 [IMG-EFFECT] - User-Agent: ' + navigator.userAgent.substring(0, 100) + '...');

    return () => {
      console.log('🧼 [IMG-EFFECT] Nettoyage des handlers pour:', imageUrl);
      img.onload = null;
      img.onerror = null;
    };
  }, [imagePath, fallbackImage, onError, onLoad]);

  if (imageStatus === 'loading') {
    return (
      <motion.div 
        className={`${className} flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="text-center text-gray-500">
          <motion.div 
            className="text-4xl mb-2"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            ⏳
          </motion.div>
          <p className="text-sm">Chargement...</p>
        </div>
      </motion.div>
    );
  }

  if (imageStatus === 'error' && !fallbackImage) {
    return (
      <motion.div 
        className={`${className} flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="text-center text-gray-500">
          <div className="text-6xl mb-4">📷</div>
          <p className="text-lg font-medium">{alt}</p>
          <p className="text-sm opacity-75">Image non disponible</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.img
      src={currentSrc}
      alt={alt}
      className={className}
      animate={animate}
      transition={transition}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      {...props}
    />
  );
};

export default ImageWithFallback;
