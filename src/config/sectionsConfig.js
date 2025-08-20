/**
 * Configuration des sections pour le côté client
 * Ce fichier centralise la configuration des types de sections supportées
 */

export const SECTION_TYPES = {
  // Types principaux supportés
  HERO: ['hero-banner', 'hero'],
  CATEGORIES: ['category-collection', 'categories'],  
  COLLECTIONS: ['featured-collections', 'collections'],
  
  // Types en développement (pas encore implémentés)
  PENDING: ['advantages', 'slider']
};

/**
 * Mapping des types de sections vers leurs composants
 */
export const SECTION_COMPONENTS = {
  'hero-banner': 'HeroSlider',
  'hero': 'HeroSlider',
  'category-collection': 'Categories',
  'categories': 'Categories',
  'featured-collections': 'SectionCollection',
  'collections': 'SectionCollection'
};

/**
 * Configuration de debugging
 * Mettre à true pour activer les console.log dans les composants
 */
export const DEBUG_CONFIG = {
  enabled: false,
  logSections: false,
  logComponentData: false
};

/**
 * Structure de données attendue pour chaque type de section
 */
export const SECTION_DATA_STRUCTURE = {
  hero: {
    required: ['title', 'subtitle'],
    optional: ['images', 'description']
  },
  categories: {
    required: ['title'],
    optional: ['subtitle', 'categories']
  },
  collections: {
    required: ['title'],
    optional: ['subtitle', 'collections']
  }
};

/**
 * Messages d'erreur par défaut
 */
export const DEFAULT_MESSAGES = {
  noData: 'Aucune donnée disponible',
  noContent: 'Le contenu de la section est vide',
  unsupportedType: 'Type de section non pris en charge',
  loadingError: 'Erreur lors du chargement des sections'
};
