import React from 'react'

// Configuration API pour le client ecommerce
export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:4000', // URL de votre API backend (SANS /api)
  ENDPOINTS: {
    CONTENT: '/api/content',
    HOME_SECTIONS: '/api/content/home-sections',
    PRODUCTS: '/api/products',
    CATEGORIES: '/api/categories'
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
  
  let finalUrl;
  
  // Si c'est déjà une URL complète, la retourner telle quelle
  if (imagePath.startsWith('http')) {
    finalUrl = imagePath;
    console.log(`🔗 [IMAGE-URL] URL complète détectée: ${finalUrl}`);
    return finalUrl;
  }
  
  // Si l'image commence par /uploads, construire l'URL complète
  if (imagePath.startsWith('/uploads/')) {
    finalUrl = `${API_CONFIG.BASE_URL}${imagePath}`;
    console.log(`📁 [IMAGE-URL] URL /uploads construite: ${finalUrl}`);
    return finalUrl;
  }
  
  // Si c'est un nom de fichier seul (UUID), construire l'URL complète
  if (imagePath.match(/^[a-f0-9-]+\.(jpg|jpeg|png|gif|webp)$/i)) {
    finalUrl = `${API_CONFIG.BASE_URL}/uploads/content/${imagePath}`;
    console.log(`🔑 [IMAGE-URL] UUID détecté: ${finalUrl}`);
    return finalUrl;
  }
  
  // Si l'image commence par /images (images mock), les servir depuis le dossier public
  if (imagePath.startsWith('/images/')) {
    finalUrl = imagePath; // Les images du dossier public sont servies directement par React
    console.log(`🖼️ [IMAGE-URL] Image publique: ${finalUrl}`);
    return finalUrl;
  }
  
  // Par défaut, ajouter /uploads/content/ si manquant
  const cleanPath = imagePath.startsWith('/') ? imagePath.substring(1) : imagePath;
  finalUrl = `${API_CONFIG.BASE_URL}/uploads/content/${cleanPath}`;
  console.log(`🎯 [IMAGE-URL] URL par défaut construite: ${finalUrl}`);
  console.log(`🎯 [IMAGE-URL] - Chemin original: ${imagePath}`);
  console.log(`🎯 [IMAGE-URL] - Chemin nettoyé: ${cleanPath}`);
  console.log(`🎯 [IMAGE-URL] - Base URL: ${API_CONFIG.BASE_URL}`);
  
  return finalUrl;
}

// Fonction pour vérifier si une image est accessible
export const checkImageUrl = async (imageUrl) => {
  try {
    const response = await fetch(imageUrl, { 
      method: 'HEAD',
      mode: 'cors'
    })
    return response.ok
  } catch (error) {
    console.warn('Image non accessible:', imageUrl, error)
    return false
  }
}

// Hook React pour gérer le chargement d'images avec fallback
export const useImageWithFallback = (imagePath, fallbackImage = null) => {
  const [imageUrl, setImageUrl] = React.useState(null)
  const [isLoading, setIsLoading] = React.useState(true)
  const [hasError, setHasError] = React.useState(false)
  
  React.useEffect(() => {
    if (!imagePath) {
      setHasError(true)
      setIsLoading(false)
      return
    }
    
    const url = getImageUrl(imagePath)
    setImageUrl(url)
    setIsLoading(true)
    setHasError(false)
    
    // Tester si l'image est accessible
    const img = new Image()
    img.onload = () => {
      setIsLoading(false)
      setHasError(false)
    }
    img.onerror = () => {
      console.warn('Image non chargeable:', url)
      setHasError(true)
      setIsLoading(false)
      if (fallbackImage) {
        setImageUrl(fallbackImage)
      }
    }
    img.src = url
    
    return () => {
      img.onload = null
      img.onerror = null
    }
  }, [imagePath, fallbackImage])
  
  return { imageUrl, isLoading, hasError }
}

// Configuration axios pour les appels API
export const apiConfig = {
  baseURL: `${API_CONFIG.BASE_URL}/api`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
}

// Configuration pour les images par défaut
export const DEFAULT_IMAGES = {
  PRODUCT_PLACEHOLDER: '/images/placeholder-product.jpg',
  HERO_PLACEHOLDER: '/images/placeholder-hero.jpg',
  FALLBACK_IMAGE: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDQwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yMDAgMTAwQzE3Mi4zODYgMTAwIDE1MiAxMjAuMzg2IDE1MiAxNDhWMjUyQzE1MiAyNzkuNjE0IDE3Mi4zODYgMzAwIDIwMCAzMDBIMjAwQzIyNy42MTQgMzAwIDI0OCAyNzkuNjE0IDI0OCAyNTJWMTQ4QzI0OCAxMjAuMzg2IDIyNy42MTQgMTAwIDIwMCAxMDBIMjAwWiIgZmlsbD0iI0U1RTdFQiIvPgo8cGF0aCBkPSJNMjAwIDEzMEMxODguOTU0IDEzMCAxODAgMTM4Ljk1NCAxODAgMTUwQzE4MCAyMjAuNyAxOTQuMyAyMjAuNyAyMDkgMjIwLjdDMjIzLjcgMjIwLjcgMjM4IDE5Ny4zIDIzOCAxNThDMjM4IDE0MS45IDIyMy43IDEzMCAyMDAgMTMwWiIgZmlsbD0iIzlDQTNBRiIvPgo8L3N2Zz4K'
}
