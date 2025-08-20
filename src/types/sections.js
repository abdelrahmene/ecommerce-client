/**
 * TYPES PARTAGÉS - SECTIONS HOME PAGE
 * ⚠️  IMPORTANT : Cette structure doit correspondre EXACTEMENT avec l'admin
 * 
 * Structure des données telle qu'elle est sauvegardée par l'admin :
 * - Les données de contenu sont dans section.content.*
 * - Les données de configuration sont dans section.* (type, enabled, order, etc.)
 */

// Structure d'une section telle qu'elle arrive de l'API
export const HomeSectionStructure = {
  // Métadonnées de la section
  id: 'string',
  type: 'string', // 'hero', 'categories', 'featured-collections', etc.
  enabled: 'boolean',
  order: 'number',
  
  // CONTENU DE LA SECTION - C'est ici que sont les vraies données !
  content: {
    // Champs communs à toutes les sections
    title: 'string',
    subtitle: 'string',
    
    // Champs spécifiques selon le type de section
    
    // Pour hero : 
    images: [], // Array d'objets image
    buttons: [], // Array d'objets bouton
    
    // Pour categories :
    categories: [], // Array d'objets catégorie
    
    // Pour featured-collections :
    collections: [], // Array d'objets collection
    
    // Pour advantages :
    advantages: [], // Array d'objets avantage
  }
};

/**
 * RÈGLE CRUCIALE pour les composants clients :
 * 
 * ❌ FAUX : section.title
 * ✅ CORRECT : section.content.title
 * 
 * ❌ FAUX : section.subtitle  
 * ✅ CORRECT : section.content.subtitle
 * 
 * ❌ FAUX : section.categories
 * ✅ CORRECT : section.content.categories
 * 
 * Les seules propriétés directement sur section sont :
 * - section.id
 * - section.type
 * - section.enabled 
 * - section.order
 * - section.content (qui contient tout le reste)
 */

export default HomeSectionStructure;
