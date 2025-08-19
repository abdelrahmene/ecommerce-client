/**
 * 🏠 HOME SERVICE CLIENT - Connecté à l'API Backend avec fallback
 * Service pour récupérer le contenu de la page d'accueil depuis l'API Backend
 * ✅ AVEC FALLBACK - Si l'API ne fonctionne pas, on retourne des données par défaut
 */
const API_BASE_URL = (process.env.REACT_APP_API_BASE_URL || 'http://localhost:4000') + '/api';

// Logs de debug pour la variable d'environnement
console.log('🔧 DEBUG: process.env.REACT_APP_API_BASE_URL =', process.env.REACT_APP_API_BASE_URL);
console.log('🔧 DEBUG: API_BASE_URL final =', API_BASE_URL);

// Données de fallback si l'API n'est pas disponible
const FALLBACK_SECTIONS = [
  {
    id: 'hero',
    type: 'hero',
    title: 'Bienvenue sur notre boutique',
    subtitle: 'Découvrez nos dernières collections',
    enabled: true,
    order: 1
  },
  {
    id: 'categories',
    type: 'categories', 
    title: 'Nos Catégories',
    enabled: true,
    order: 2
  },
  {
    id: 'featured',
    type: 'featured_products',
    title: 'Produits en Vedette',
    enabled: true,
    order: 3
  },
  {
    id: 'trust',
    type: 'trust_features',
    title: 'Pourquoi nous choisir',
    enabled: true,
    order: 4
  }
];

/**
 * Récupérer toutes les sections de la page d'accueil depuis l'API avec fallback
 * ✅ AVEC FALLBACK - Si l'API ne fonctionne pas, on retourne des données par défaut
 */
export const getHomeSections = async () => {
  try {
    const fullURL = `${API_BASE_URL}/content/home-sections`;
    console.log('🌐 API: Récupération des sections depuis:', fullURL);
    console.log('🔧 DEBUG: API_BASE_URL =', API_BASE_URL);
    console.log('🔧 DEBUG: URL complète construite =', fullURL);
    
    const response = await fetch(fullURL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      // Timeout de 5 secondes
      signal: AbortSignal.timeout(5000)
    });

    console.log('🌐 API: Réponse status:', response.status, response.statusText);

    if (!response.ok) {
      const errorText = await response.text();
      console.warn('⚠️ API: Erreur HTTP, utilisation du fallback:', {
        status: response.status,
        statusText: response.statusText,
        url: response.url,
        body: errorText
      });
      
      // Si 404, c'est probablement que la route n'existe pas encore
      if (response.status === 404) {
        console.log('📋 Utilisation des sections de fallback (route API non trouvée)');
        return FALLBACK_SECTIONS;
      }
      
      // Pour les autres erreurs, on utilise aussi le fallback
      console.log('📋 Utilisation des sections de fallback (erreur API)');
      return FALLBACK_SECTIONS;
    }

    const sections = await response.json();
    
    console.log('✅ API: Sections récupérées avec succès:', sections.length);
    console.log('🔍 API: Détail des sections récupérées:', sections);
    
    if (!Array.isArray(sections)) {
      console.warn('⚠️ API: La réponse n\'est pas un tableau, utilisation du fallback:', typeof sections);
      return FALLBACK_SECTIONS;
    }
    
    // Si tableau vide, utiliser le fallback
    if (sections.length === 0) {
      console.log('📋 API: Aucune section retournée, utilisation du fallback');
      return FALLBACK_SECTIONS;
    }
    
    return sections;

  } catch (error) {
    console.warn('⚠️ API: Erreur de connexion, utilisation du fallback:', {
      message: error.message,
      name: error.name,
      url: API_BASE_URL + '/content/home-sections'
    });
    
    // En cas d'erreur réseau, timeout, etc. -> fallback
    return FALLBACK_SECTIONS;
  }
};

export default {
  getHomeSections
};
