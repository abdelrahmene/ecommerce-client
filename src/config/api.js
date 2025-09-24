import React from 'react'

// Configuration API pour le client ecommerce
export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:4000', // URL de votre API backend (SANS /api)
  ENDPOINTS: {
    CONTENT: '/api/content',
    HOME_SECTIONS: '/api/content/home-sections',
    PRODUCTS: '/api/products',
    CATEGORIES: '/api/categories',
    COLLECTIONS: '/api/collections'
  }
}

// Debug configuration
console.log('🔧 [CONFIG] API_CONFIG.BASE_URL:', API_CONFIG.BASE_URL);
console.log('🔧 [CONFIG] process.env.REACT_APP_API_URL:', process.env.REACT_APP_API_URL);

// Fonction pour construire l'URL complète des images avec gestion d'erreur
export const getImageUrl = (imagePath) => {
  if (!imagePath) {
    console.log('❌ [IMAGE-URL] Chemin d\'image vide ou null');
    return null;
  }
  
  // Définir l'URL de base de l'API
  const apiBaseUrl = API_CONFIG.BASE_URL;
  
  let finalUrl;
  
  // Remplacer localhost par l'URL de production si nécessaire
  const fixLocalhost = (url) => {
    if (url && url.includes('localhost:4000')) {
      const productionUrl = process.env.REACT_APP_API_URL || 'https://api.birkshoes.store';
      const fixedUrl = url.replace('http://localhost:4000', productionUrl);
      console.log(`🛠️ [IMAGE-URL] URL locale remplacée: ${url} -> ${fixedUrl}`);
      return fixedUrl;
    }
    return url;
  };
  
  // Si c'est déjà une URL complète, la traiter
  if (imagePath.startsWith('http')) {
    finalUrl = fixLocalhost(imagePath);
    console.log(`🔗 [IMAGE-URL] URL complète corrigée: ${finalUrl}`);
    return finalUrl;
  }
  
  // Si l'image commence par /uploads, construire l'URL complète
  if (imagePath.startsWith('/uploads/')) {
    finalUrl = `${apiBaseUrl}${imagePath}`;
    console.log(`📁 [IMAGE-URL] URL /uploads construite: ${finalUrl}`);
    return fixLocalhost(finalUrl);
  }
  
  // Si c'est un nom de fichier seul (UUID), construire l'URL complète
  if (imagePath.match(/^[a-f0-9-]+\.(jpg|jpeg|png|gif|webp)$/i)) {
    finalUrl = `${apiBaseUrl}/uploads/content/${imagePath}`;
    console.log(`🔑 [IMAGE-URL] UUID détecté: ${finalUrl}`);
    return fixLocalhost(finalUrl);
  }
  
  // Si l'image commence par /images (images mock), les servir depuis le dossier public
  if (imagePath.startsWith('/images/')) {
    finalUrl = imagePath; // Les images du dossier public sont servies directement par React
    console.log(`🖼️ [IMAGE-URL] Image publique: ${finalUrl}`);
    return finalUrl;
  }
  
  // Par défaut, ajouter /uploads/content/ si manquant
  const cleanPath = imagePath.startsWith('/') ? imagePath.substring(1) : imagePath;
  finalUrl = `${apiBaseUrl}/uploads/content/${cleanPath}`;
  console.log(`🎯 [IMAGE-URL] URL par défaut construite: ${finalUrl}`);
  console.log(`🎯 [IMAGE-URL] - Chemin original: ${imagePath}`);
  console.log(`🎯 [IMAGE-URL] - Chemin nettoyé: ${cleanPath}`);
  console.log(`🎯 [IMAGE-URL] - Base URL: ${apiBaseUrl}`);
  
  return fixLocalhost(finalUrl);
};

// Fonction pour vérifier si une image est accessible
export const checkImageUrl = async (imageUrl) => {
  try {
    // Corriger l'URL avant de faire le test
    const correctedUrl = imageUrl.includes('localhost:4000') 
      ? imageUrl.replace('http://localhost:4000', process.env.REACT_APP_API_URL || 'https://api.birkshoes.store')
      : imageUrl;
      
    const response = await fetch(correctedUrl, { 
      method: 'HEAD',
      mode: 'cors'
    });
    
    return response.ok;
  } catch (error) {
    console.warn('Image non accessible:', imageUrl, error);
    return false;
  }
};

// Hook React pour gérer le chargement d'images avec fallback
export const useImageWithFallback = (imagePath, fallbackImage = null) => {
  const [imageUrl, setImageUrl] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [hasError, setHasError] = React.useState(false);
  
  React.useEffect(() => {
    if (!imagePath) {
      setHasError(true);
      setIsLoading(false);
      return;
    }
    
    // Obtenir l'URL avec correction des chemins locaux
    const url = getImageUrl(imagePath);
    setImageUrl(url);
    setIsLoading(true);
    setHasError(false);
    
    // Tester si l'image est accessible
    const img = new Image();
    img.onload = () => {
      setIsLoading(false);
      setHasError(false);
    };
    img.onerror = () => {
      console.warn('Image non chargeable:', url);
      setHasError(true);
      setIsLoading(false);
      if (fallbackImage) {
        setImageUrl(fallbackImage);
      }
    };
    img.src = url;
    
    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [imagePath, fallbackImage]);
  
  return { imageUrl, isLoading, hasError };
};

// Configuration axios pour les appels API
export const apiConfig = {
  baseURL: `${API_CONFIG.BASE_URL}/api`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
};

// Configuration pour les images par défaut
export const DEFAULT_IMAGES = {
  PRODUCT_PLACEHOLDER: '/images/placeholder-product.jpg',
  HERO_PLACEHOLDER: '/images/placeholder-hero.jpg',
  COLLECTION_PLACEHOLDER: '/images/placeholder-collection.jpg',
  FALLBACK_IMAGE: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDQwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yMDAgMTAwQzE3Mi4zODYgMTAwIDE1MiAxMjAuMzg2IDE1MiAxNDhWMjUyQzE1MiAyNzkuNjE0IDE3Mi4zODYgMzAwIDIwMCAzMDBIMjAwQzIyNy42MTQgMzAwIDI0OCAyNzkuNjE0IDI0OCAyNTJWMTQ4QzI0OCAxMjAuMzg2IDIyNy42MTQgMTAwIDIwMCAxMDBIMjAwWiIgZmlsbD0iI0U1RTdFQiIvPgo8cGF0aCBkPSJNMjAwIDEzMEMxODguOTU0IDEzMCAxODAgMTM4Ljk1NCAxODAgMTUwQzE4MCAyMjAuNyAxOTQuMyAyMjAuNyAyMDkgMjIwLjdDMjIzLjcgMjIwLjcgMjM4IDE5Ny4zIDIzOCAxNThDMjM4IDE0MS45IDIyMy43IDEzMCAyMDAgMTMwWiIgZmlsbD0iIzlDQTNBRiIvPgo8L3N2Zz4K'
};