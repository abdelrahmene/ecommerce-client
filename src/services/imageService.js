// Service pour corriger les chemins d'images (remplace localhost par l'URL de production)
const imageService = {
  getImageUrl(imageUrl) {
    if (!imageUrl) return '/images/placeholder-product.jpg';
    
    // Si l'URL contient localhost:4000, remplacer par l'URL de production
    if (typeof imageUrl === 'string' && imageUrl.includes('localhost:4000')) {
      const prodUrl = process.env.REACT_APP_API_URL || 'https://api.birkshoes.store';
      return imageUrl.replace('http://localhost:4000', prodUrl);
    }
    
    return imageUrl;
  }
};

export default imageService;