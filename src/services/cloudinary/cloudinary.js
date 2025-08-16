// Service Cloudinary pour le client - version optimisée pour l'affichage d'images

// Configuration Cloudinary depuis les variables d'environnement
const CLOUDINARY_CONFIG = {
  cloudName: process.env.REACT_APP_CLOUDINARY_CLOUD_NAME || 'dsveonbhj',
  folder: process.env.REACT_APP_CLOUDINARY_ASSET_FOLDER || 'fds'
};

// Fonction pour générer des URL optimisées et transformées
export const getOptimizedImageUrl = (url, { width, height, quality = 'auto', crop = 'fill' } = {}) => {
  if (!url) return '';
  
  // Gérer les cas où l'URL est un objet ou un chemin relatif
  if (typeof url !== 'string') {
    // Si c'est un objet File ou Blob, retourner une URL temporaire
    if (url instanceof File || url instanceof Blob) {
      return URL.createObjectURL(url);
    }
    // Si c'est un autre type d'objet, essayer de le convertir en chaîne
    url = String(url);
  }
  
  // Si l'URL est déjà une URL Cloudinary complète
  if (url.includes('cloudinary.com')) {
    // Continuer avec le traitement normal
  } 
  // Si c'est un chemin relatif commençant par '/assets/'
  else if (url.startsWith('/assets/')) {
    return url; // Retourner tel quel car c'est une ressource locale
  }
  // Si c'est juste un ID Cloudinary sans l'URL complète
  else if (!url.startsWith('http') && !url.startsWith('/')) {
    // Construire l'URL Cloudinary complète
    url = `https://res.cloudinary.com/${CLOUDINARY_CONFIG.cloudName}/image/upload/${url}`;
  }
  // Autres URLs (http, https) non-Cloudinary
  else if (!url.includes('cloudinary.com')) {
    return url; // Retourner telle quelle
  }
  
  // Extraire les parties de l'URL Cloudinary
  const parts = url.split('/upload/');
  
  if (parts.length !== 2) {
    return url;
  }
  
  // Construire les transformations
  let transformations = [];
  
  if (quality) {
    transformations.push(`q_${quality}`);
  }
  
  if (width || height) {
    const dimensions = [];
    if (width) dimensions.push(`w_${width}`);
    if (height) dimensions.push(`h_${height}`);
    if (crop) dimensions.push(`c_${crop}`);
    
    transformations.push(dimensions.join(','));
  }
  
  // Si aucune transformation n'est appliquée, retourner l'URL originale
  if (transformations.length === 0) {
    return url;
  }
  
  // Construire l'URL transformée
  return `${parts[0]}/upload/${transformations.join('/')}/${parts[1]}`;
};

// Fonction pour obtenir une version réduite pour les vignettes
export const getThumbnailUrl = (url, size = 200) => {
  return getOptimizedImageUrl(url, { width: size, height: size, crop: 'fill' });
};

// Fonction pour obtenir une version haute qualité pour les pages détaillées
export const getHighQualityUrl = (url, width = 800) => {
  return getOptimizedImageUrl(url, { width, quality: 'auto:best' });
};

// Fonction pour obtenir une version optimisée pour le chargement de la page
export const getLowQualityPlaceholder = (url) => {
  return getOptimizedImageUrl(url, { width: 60, height: 60, quality: 10, crop: 'fill' });
};

// Fonction pour générer une URL directe pour un ID d'image Cloudinary
export const getCloudinaryUrl = (publicId, options = {}) => {
  if (!publicId) return '';
  
  // Construire les transformations
  const transformations = [];
  
  if (options.width || options.height) {
    const dimensions = [];
    if (options.width) dimensions.push(`w_${options.width}`);
    if (options.height) dimensions.push(`h_${options.height}`);
    if (options.crop) dimensions.push(`c_${options.crop || 'fill'}`);
    transformations.push(dimensions.join(','));
  }
  
  if (options.quality) {
    transformations.push(`q_${options.quality}`);
  }
  
  const transformationString = transformations.length > 0 
    ? transformations.join('/') + '/'
    : '';
  
  // Ajouter le préfixe du dossier si nécessaire
  const fullPublicId = publicId.includes('/') 
    ? publicId 
    : `${CLOUDINARY_CONFIG.folder ? CLOUDINARY_CONFIG.folder + '/' : ''}${publicId}`;
  
  return `https://res.cloudinary.com/${CLOUDINARY_CONFIG.cloudName}/image/upload/${transformationString}${fullPublicId}`;
};

// Objet exporté pour faciliter l'accès aux fonctions
const cloudinaryService = {
  getOptimizedImageUrl,
  getThumbnailUrl,
  getHighQualityUrl,
  getLowQualityPlaceholder,
  getCloudinaryUrl,
  config: CLOUDINARY_CONFIG
};

export default cloudinaryService;