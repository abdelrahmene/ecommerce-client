// Service pour corriger les chemins d'images - Version simplifiée
const imageService = {
  getImageUrl(imageUrl) {
    // Si l'URL est vide, retourner une image par défaut
    if (!imageUrl) {
      return '/images/placeholder-product.jpg';
    }

    // Si l'URL est un objet avec url (format d'API Firebase), utiliser cette URL
    if (typeof imageUrl === 'object' && imageUrl !== null && imageUrl.url) {
      imageUrl = imageUrl.url;
    }

    // Vérifier si c'est une chaîne de caractères
    if (typeof imageUrl !== 'string') {
      return '/images/placeholder-product.jpg';
    }

    // Cas 1: URL contenant localhost:4000 - Remplacer par l'URL de production
    if (imageUrl.includes('localhost:4000')) {
      const prodUrl = process.env.REACT_APP_API_URL || 'https://api.birkshoes.store';
      return imageUrl.replace('http://localhost:4000', prodUrl);
    }

    // Cas 2: URL commençant par /uploads/ - Ajouter l'URL de l'API au début
    if (imageUrl.startsWith('/uploads/')) {
      const apiUrl = process.env.REACT_APP_API_URL || 'https://api.birkshoes.store';
      return `${apiUrl}${imageUrl}`;
    }

    // Cas 3: Chemin relatif à la racine du site (sans uploads)
    if (imageUrl.startsWith('/') && !imageUrl.startsWith('/uploads/')) {
      // Utiliser l'URL du site si c'est un chemin statique (images, assets, etc.)
      return imageUrl;
    }

    // Cas 4: Déjà une URL complète - la retourner telle quelle
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
      return imageUrl;
    }

    // Cas par défaut - retourner l'URL telle quelle
    return imageUrl;
  }
};

export default imageService;