/**
 * 🏠 HOME SERVICE CLIENT
 * Service pour récupérer le contenu de la page d'accueil côté client
 */

const API_BASE_URL = process.env.REACT_APP_ADMIN_API_URL || 'http://localhost:4000';

/**
 * Récupérer toutes les sections de la page d'accueil
 * @returns {Promise<Array>} Sections de la page d'accueil
 */
export const getHomeSections = async () => {
  console.log('🔄 [HOME-SERVICE] Récupération des sections...');
  
  try {
    const response = await fetch(`${API_BASE_URL}/api/content/home-sections`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-cache' // Toujours récupérer les données fraîches
    });
    
    console.log('📊 [HOME-SERVICE] Réponse reçue, status:', response.status);
    
    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status} - ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('📝 [HOME-SERVICE] Données reçues:', data);
    
    if (data.success) {
      console.log('✅ [HOME-SERVICE] Sections récupérées avec succès:', data.data?.length || 0);
      return data.data || [];
    } else {
      console.error('❌ [HOME-SERVICE] Erreur API:', data.message);
      return [];
    }
  } catch (error) {
    console.error('❌ [HOME-SERVICE] Erreur réseau:', error);
    return [];
  }
};

/**
 * Récupérer une section spécifique par ID
 * @param {string} id - ID de la section
 * @returns {Promise<Object|null>} Section ou null
 */
export const getHomeSection = async (id) => {
  console.log('🔍 [HOME-SERVICE] Récupération de la section:', id);
  
  try {
    const response = await fetch(`${API_BASE_URL}/api/content/home-sections/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.success) {
      console.log('✅ [HOME-SERVICE] Section récupérée:', data.data?.title || id);
      return data.data;
    } else {
      console.error('❌ [HOME-SERVICE] Erreur API:', data.message);
      return null;
    }
  } catch (error) {
    console.error('❌ [HOME-SERVICE] Erreur réseau:', error);
    return null;
  }
};

/**
 * Vérifier si des sections existent en base de données
 * @returns {Promise<boolean>} True si des sections existent
 */
export const checkHomeSectionsExist = async () => {
  try {
    const sections = await getHomeSections();
    return sections && sections.length > 0;
  } catch (error) {
    console.error('❌ [HOME-SERVICE] Erreur lors de la vérification:', error);
    return false;
  }
};

export default {
  getHomeSections,
  getHomeSection,
  checkHomeSectionsExist
};
