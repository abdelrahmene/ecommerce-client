/**
 * Utilitaires pour la gestion des vidéos dans l'application
 */

/**
 * Configure les chemins des vidéos en fonction de l'environnement
 * @param {string} path - Chemin relatif de la vidéo
 * @returns {string} - Chemin complet de la vidéo
 */
export const getVideoPath = (path) => {
  // Si le chemin commence déjà par http ou https, on le retourne tel quel
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  
  // Si le chemin commence par un slash, on le considère comme un chemin absolu depuis la racine publique
  if (path.startsWith('/')) {
    return path;
  }
  
  // Sinon, on considère que c'est un chemin relatif à partir du dossier assets
  try {
    // Essayer d'importer dynamiquement la vidéo
    const videoModule = require(`../assets/videos/${path}`);
    // Vérifier si le module a une propriété default (webpack) ou s'il est déjà le chemin (create-react-app)
    return videoModule.default || videoModule;
  } catch (error) {
    console.error(`Erreur lors du chargement de la vidéo: ${path}`, error);
    return path; // Retourner le chemin original en cas d'erreur
  }
};

/**
 * Applique des styles de scrollbar personnalisés pour Firefox via JavaScript
 * Solution de contournement pour la compatibilité cross-browser
 */
export const applyCustomScrollbarStyles = () => {
  // Vérifier si le navigateur est Firefox
  const isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
  
  if (isFirefox) {
    // Appliquer des styles personnalisés pour Firefox
    const style = document.createElement('style');
    style.textContent = `
      .scrollbar-hide {
        scrollbar-width: none !important;
      }
    `;
    document.head.appendChild(style);
  }
};

/**
 * Optimise le chargement des vidéos
 * @param {HTMLVideoElement} videoElement - Élément vidéo à optimiser
 */
export const optimizeVideoLoading = (videoElement) => {
  if (!videoElement) return;
  
  // Définir les attributs pour une meilleure performance
  videoElement.preload = 'metadata';
  videoElement.playsInline = true;
  
  // Ajouter un gestionnaire d'événements pour charger la vidéo seulement lorsqu'elle est visible
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Charger la vidéo lorsqu'elle est visible
        videoElement.preload = 'auto';
        // Arrêter d'observer une fois chargée
        observer.unobserve(videoElement);
      }
    });
  }, { threshold: 0.1 }); // Commencer à charger lorsque 10% de la vidéo est visible
  
  observer.observe(videoElement);
};