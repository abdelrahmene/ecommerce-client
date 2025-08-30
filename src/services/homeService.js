/**
 * 🏠 HOME SERVICE CLIENT - Connecté à l'API Backend avec fallback
 * Service pour récupérer le contenu de la page d'accueil depuis l'API Backend
 * ✅ AVEC FALLBACK - Si l'API ne fonctionne pas, on retourne des données par défaut
 */
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';

// Logs de debug pour la variable 
console.log(`🔧 DEBUG: API_BASE_URL = ${process.env.REACT_APP_API_URL || 'http://localhost:4000'}`);

console.log("🔧 DEBUG: API_BASE_URL final =", API_BASE_URL);

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
  // Ajouter une section collection au lieu de nouveau-produit
  {
    id: 'collections',
    type: 'collection',
    title: 'Nos Collections',
    subtitle: 'Des pièces uniques pour tous les styles',
    enabled: true,
    order: 4,
    content: {
      title: 'Nos Collections',
      subtitle: 'Des pièces uniques pour tous les styles',
      items: [] // Sera rempli dynamiquement depuis l'API
    }
  }
];

/**
 * Récupérer toutes les sections de la page d'accueil depuis l'API avec fallback
 * ✅ AVEC FALLBACK - Si l'API ne fonctionne pas, on retourne des données par défaut
 */
export const getHomeSections = async () => {
  try {
    const fullURL = `${API_BASE_URL}/api/content/home-sections`;
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

    const data = await response.json();
    
    console.log('✅ API: Réponse récupérée avec succès:', data);
    
    // Gérer différents formats de réponse API
    let sections;
    
    if (Array.isArray(data)) {
      // Format direct : [section1, section2, ...]
      sections = data;
      console.log('📋 Format API: Tableau direct');
    } else if (data.success && Array.isArray(data.data)) {
      // Format avec wrapper : { success: true, data: [section1, ...] }
      sections = data.data;
      console.log('📋 Format API: Wrapper avec data');
    } else if (data.sections && Array.isArray(data.sections)) {
      // Format avec sections : { sections: [section1, ...] }
      sections = data.sections;
      console.log('📋 Format API: Wrapper avec sections');
    } else {
      console.warn('⚠️ API: Format de réponse non reconnu, utilisation du fallback:', data);
      return FALLBACK_SECTIONS;
    }
    
    console.log('🔍 API: Détail des sections récupérées:', sections.length, 'sections');
    
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
      url: API_BASE_URL + '/api/content/home-sections'
    });
    
    // En cas d'erreur réseau, timeout, etc. -> fallback
    return FALLBACK_SECTIONS;
  }
};

export default {
  getHomeSections
};
