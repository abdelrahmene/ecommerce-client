/**
 * 🏠 HOME SERVICE CLIENT
 * Service pour récupérer le contenu de la page d'accueil côté client
 */

const API_BASE_URL = process.env.REACT_APP_ADMIN_API_URL || process.env.REACT_APP_ADMIN_API_URL;

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
        'Accept': 'application/json',
        'Cache-Control': 'no-cache'
      },
      mode: 'cors',
      credentials: 'omit',
      cache: 'no-cache'
    });
    
    console.log('📊 [HOME-SERVICE] Réponse reçue, status:', response.status);
    
    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status} - ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('📝 [HOME-SERVICE] Données reçues:', data);
    
    // Gérer différents formats de réponse
    let sections = [];
    
    if (Array.isArray(data)) {
      // Format direct : [section1, section2, ...]
      sections = data;
      console.log('✅ [HOME-SERVICE] Format direct - Sections:', sections.length);
    } else if (data.success && Array.isArray(data.data)) {
      // Format avec wrapper : { success: true, data: [section1, ...] }
      sections = data.data;
      console.log('✅ [HOME-SERVICE] Format wrapper - Sections:', sections.length);
    } else if (data.sections && Array.isArray(data.sections)) {
      // Format avec sections : { sections: [section1, ...] }
      sections = data.sections;
      console.log('✅ [HOME-SERVICE] Format sections - Sections:', sections.length);
    } else if (data.success === false) {
      console.error('❌ [HOME-SERVICE] Erreur API:', data.message);
      return [];
    } else {
      console.warn('⚠️ [HOME-SERVICE] Format non reconnu:', typeof data);
      return [];
    }
    
    return sections;
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
        'Accept': 'application/json',
        'Cache-Control': 'no-cache'
      },
      mode: 'cors',
      credentials: 'omit'
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
