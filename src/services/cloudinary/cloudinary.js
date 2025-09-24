import { getImageUrl } from '../../config/api';

/**
 * Service pour gérer les URL d'images
 * Remplace simplement les URLs localhost par des URLs de production
 */
const imageService = {
  /**
   * Corrige une URL d'image pour la production
   * - Remplace http://localhost:4000 par l'URL de production
   * @param {string} imageUrl - L'URL originale
   * @returns {string} - L'URL corrigée
   */
  getImageUrl(imageUrl) {
    if (!imageUrl) {
      return '/images/placeholder-product.jpg';
    }

    // Si l'image contient localhost:4000, remplacer par l'URL de production
    if (imageUrl.includes('localhost:4000')) {
      const prodUrl = process.env.REACT_APP_API_URL || 'https://api.birkshoes.store';
      return imageUrl.replace('http://localhost:4000', prodUrl);
    }

    return imageUrl;
  }
};

export default imageService;