/**
 * Service pour récupérer les catégories et collections
 * ✅ Connecté à l'API Backend
 */
import { getImageUrl } from '../config/api';
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';

/**
 * Récupère toutes les catégories principales
 */
export const getMainCategories = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/categories?parent=null`);
    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Erreur lors de la récupération des catégories principales:', error);
    return [];
  }
};

/**
 * Récupère les sous-catégories d'une catégorie parent
 * @param {string} parentId - ID de la catégorie parent
 */
export const getSubcategories = async (parentId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/categories?parentId=${parentId}`);
    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Erreur lors de la récupération des sous-catégories pour ${parentId}:`, error);
    return [];
  }
};

/**
 * Récupère les collections liées à une catégorie
 * @param {string} categoryId - ID de la catégorie
 */
export const getCategoryCollections = async (categoryId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/collections?categoryId=${categoryId}`);
    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Erreur lors de la récupération des collections pour la catégorie ${categoryId}:`, error);
    return [];
  }
};

/**
 * Génère un objet de catégorie formaté pour l'affichage dans la section des catégories
 * @param {Object} category - Catégorie de la base de données
 * @param {Object} options - Options de style
 */
export const formatCategoryForDisplay = (category, options = {}) => {
  const categorySlug = category.slug || category.id;
  const linkBase = category.parentId ? `/subcategory` : `/category`;
  
  return {
    id: category.id,
    name: category.name,
    slug: categorySlug,
    image: category.image || '/images/placeholder-category.jpg',
    description: category.description || '',
    link: `${linkBase}/${categorySlug}`,
    isActive: true,
    order: options.order || 0,
    style: {
      backgroundColor: options.backgroundColor || '#3b82f6',
      textColor: options.textColor || '#ffffff',
      hoverColor: options.hoverColor || '#1d4ed8',
      borderRadius: 12,
      imageOpacity: 90,
      overlayColor: '#000000',
      overlayOpacity: 30,
      textAlign: 'center',
      imageFit: 'cover',
      imagePosition: 'center center'
    },
    accent: options.accent || 'from-blue-600 to-indigo-800'
  };
};

/**
 * Récupère les catégories structurées pour la page d'accueil selon les spécifications
 * Organise automatiquement : Birk homme, Birk femme, Birk enfant, Boston, Chaussure femme, Basket Femme
 */
export const getStructuredCategoriesForHome = async () => {
  try {
    // Récupérer toutes les catégories principales
    const mainCategories = await getMainCategories();
    
    // Tableau pour stocker les catégories formatées
    let formattedCategories = [];

    // Style mapping par nom de catégorie
    const styleMapping = {
      'Homme': { backgroundColor: '#3b82f6', textColor: '#ffffff', accent: 'from-blue-600 to-indigo-800' },
      'Femmes': { backgroundColor: '#d946ef', textColor: '#ffffff', accent: 'from-purple-600 to-pink-700' },
      'Enfant': { backgroundColor: '#10b981', textColor: '#ffffff', accent: 'from-emerald-500 to-teal-700' },
      'Chaussures femmes': { backgroundColor: '#f43f5e', textColor: '#ffffff', accent: 'from-red-500 to-pink-600' },
      'Chaussures homme': { backgroundColor: '#8b5cf6', textColor: '#ffffff', accent: 'from-indigo-600 to-violet-700' }
    };
    
    // Trouver et traiter les principales catégories demandées
    let order = 0;
    
    // 1. Birk homme, Birk femme, Birk enfant
    const hommeCategory = mainCategories.find(c => c.name === 'Homme');
    const femmeCategory = mainCategories.find(c => c.name === 'Femmes');
    const enfantCategory = mainCategories.find(c => c.name === 'Enfant');
    
    if (hommeCategory) {
      const birkHommeSubcategories = await getSubcategories(hommeCategory.id);
      const birkHomme = birkHommeSubcategories.find(c => c.name === 'Birk hommes');
      if (birkHomme) {
        formattedCategories.push(formatCategoryForDisplay(birkHomme, {
          order: order++,
          ...styleMapping['Homme']
        }));
      }
    }
    
    if (femmeCategory) {
      const birkFemmeSubcategories = await getSubcategories(femmeCategory.id);
      const birkFemme = birkFemmeSubcategories.find(c => c.name === 'Birk femmes');
      if (birkFemme) {
        formattedCategories.push(formatCategoryForDisplay(birkFemme, {
          order: order++,
          ...styleMapping['Femmes']
        }));
      }
    }
    
    if (enfantCategory) {
      const birkEnfantSubcategories = await getSubcategories(enfantCategory.id);
      const birkEnfant = birkEnfantSubcategories.find(c => c.name === 'Birk enfant');
      if (birkEnfant) {
        formattedCategories.push(formatCategoryForDisplay(birkEnfant, {
          order: order++,
          ...styleMapping['Enfant']
        }));
      }
    }
    
    // 2. Boston et sous-catégories
    const bostonCategory = mainCategories.find(c => c.name.includes('Boston')) || 
                          (femmeCategory && await getSubcategories(femmeCategory.id).then(
                              subs => subs.find(c => c.name.includes('boston'))));
    
    if (bostonCategory) {
      formattedCategories.push(formatCategoryForDisplay(bostonCategory, {
        order: order++,
        backgroundColor: '#6366f1',
        textColor: '#ffffff',
        accent: 'from-indigo-500 to-blue-700'
      }));
    }
    
    // 3. Chaussures femmes et sous-catégories
    const chaussuresFemmeCategory = mainCategories.find(c => c.name === 'Chaussures femmes');
    if (chaussuresFemmeCategory) {
      formattedCategories.push(formatCategoryForDisplay(chaussuresFemmeCategory, {
        order: order++,
        ...styleMapping['Chaussures femmes']
      }));
    }
    
    // 4. Chaussures homme (Basket)
    const chaussuresHommeCategory = mainCategories.find(c => c.name === 'Chaussures homme');
    if (chaussuresHommeCategory) {
      formattedCategories.push(formatCategoryForDisplay(chaussuresHommeCategory, {
        order: order++,
        ...styleMapping['Chaussures homme']
      }));
    }
    
    console.log('✅ Categories structurées récupérées:', formattedCategories.length);
    return formattedCategories;
  } catch (error) {
    console.error('Erreur lors de la récupération des catégories structurées:', error);
    return [];
  }
};

export default {
  getMainCategories,
  getSubcategories,
  getCategoryCollections,
  formatCategoryForDisplay,
  getStructuredCategoriesForHome
};
