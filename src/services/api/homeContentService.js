/**
 * 🏠 SERVICE API HOME CONTENT - VERSION MYSQL CLIENT
 * Remplace Firebase par l'API MySQL pour le contenu de la page d'accueil côté client
 */

// Déterminer l'URL API selon l'environnement
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://birkshoes.store/api';

console.log('🌐 API_BASE_URL configurée:', API_BASE_URL);

/**
 * Récupère toutes les sections visibles de la page d'accueil
 */
export const getHomeContentSections = async () => {
  try {
    console.log('📡 API Client: Récupération des sections de la page d\'accueil...');
    
    const response = await fetch(`${API_BASE_URL}/endpoints/home_content.php`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Erreur lors de la récupération des sections');
    }

    console.log('✅ Sections récupérées:', data.sections?.length || 0, 'sections');
    
    return data.sections || [];
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des sections:', error);
    throw error;
  }
};

/**
 * Récupère une section spécifique par son type
 */
export const getHomeContentSection = async (sectionType) => {
  try {
    console.log('📡 API Client: Récupération de la section:', sectionType);
    
    const response = await fetch(`${API_BASE_URL}/endpoints/home_content.php?type=${sectionType}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null; // Section non trouvée
      }
      throw new Error(`Erreur HTTP: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Erreur lors de la récupération de la section');
    }

    console.log('✅ Section récupérée:', data.section?.title || sectionType);
    
    return data.section;
  } catch (error) {
    console.error('❌ Erreur lors de la récupération de la section:', error);
    throw error;
  }
};

/**
 * Récupère les sections hero pour le carrousel principal
 */
export const getHeroSections = async () => {
  try {
    console.log('🎬 API Client: Récupération des sections hero...');
    
    const sections = await getHomeContentSections();
    return sections.filter(section => section.type === 'hero');
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des sections hero:', error);
    return [];
  }
};

/**
 * Récupère la section des catégories
 */
export const getCategoriesSection = async () => {
  try {
    console.log('📂 API Client: Récupération de la section catégories...');
    
    return await getHomeContentSection('categories');
  } catch (error) {
    console.error('❌ Erreur lors de la récupération de la section catégories:', error);
    return null;
  }
};

/**
 * Récupère la section des collections
 */
export const getCollectionsSection = async () => {
  try {
    console.log('📦 API Client: Récupération de la section collections...');
    
    return await getHomeContentSection('collections');
  } catch (error) {
    console.error('❌ Erreur lors de la récupération de la section collections:', error);
    return null;
  }
};

/**
 * Récupère la section des produits en vedette
 */
export const getFeaturedProductsSection = async () => {
  try {
    console.log('⭐ API Client: Récupération de la section produits en vedette...');
    
    return await getHomeContentSection('featured-products');
  } catch (error) {
    console.error('❌ Erreur lors de la récupération de la section produits en vedette:', error);
    return null;
  }
};

/**
 * Récupère la section des nouveaux produits
 */
export const getNewProductsSection = async () => {
  try {
    console.log('🆕 API Client: Récupération de la section nouveaux produits...');
    
    return await getHomeContentSection('new-products');
  } catch (error) {
    console.error('❌ Erreur lors de la récupération de la section nouveaux produits:', error);
    return null;
  }
};

/**
 * Récupère la section des avantages
 */
export const getAdvantagesSection = async () => {
  try {
    console.log('🏆 API Client: Récupération de la section avantages...');
    
    return await getHomeContentSection('advantages');
  } catch (error) {
    console.error('❌ Erreur lors de la récupération de la section avantages:', error);
    return null;
  }
};