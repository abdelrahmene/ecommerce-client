import { SECTION_DATA_STRUCTURE, DEBUG_CONFIG } from '../config/sectionsConfig';

/**
 * Utilitaires pour valider et extraire les données des sections
 */

/**
 * Valide la structure d'une section
 * @param {Object} section - La section à valider
 * @returns {Object} - { isValid: boolean, errors: string[] }
 */
export const validateSection = (section) => {
  const errors = [];
  
  if (!section) {
    errors.push('Section is null or undefined');
    return { isValid: false, errors };
  }
  
  if (!section.id) errors.push('Section ID is missing');
  if (!section.type) errors.push('Section type is missing');
  if (section.enabled === undefined) errors.push('Section enabled status is missing');
  if (section.order === undefined) errors.push('Section order is missing');
  
  if (!section.content) {
    errors.push('Section content is missing');
  } else {
    const contentStructure = SECTION_DATA_STRUCTURE[section.type.replace('-banner', '').replace('-collection', '')];
    if (contentStructure) {
      contentStructure.required?.forEach(field => {
        if (!section.content[field]) {
          errors.push(`Required field missing: content.${field}`);
        }
      });
    }
  }
  
  return { isValid: errors.length === 0, errors };
};

/**
 * Extrait les données de contenu d'une section de manière sécurisée
 * @param {Object} section - La section source
 * @param {string} field - Le champ à extraire
 * @param {*} defaultValue - Valeur par défaut
 * @returns {*} - La valeur extraite ou la valeur par défaut
 */
export const extractSectionData = (section, field, defaultValue = null) => {
  if (DEBUG_CONFIG.logComponentData) {
    console.log(`Extracting ${field} from section:`, section);
  }
  
  return section?.content?.[field] ?? defaultValue;
};

/**
 * Log de debug conditionnel
 * @param {string} component - Nom du composant
 * @param {string} message - Message à logger
 * @param {*} data - Données à logger
 */
export const debugLog = (component, message, data) => {
  if (DEBUG_CONFIG.enabled && DEBUG_CONFIG.logComponentData) {
    console.log(`[${component}] ${message}:`, data);
  }
};

/**
 * Valide et prépare les données d'une section pour un composant
 * @param {Object} section - La section source
 * @param {string} componentName - Nom du composant
 * @param {Object} fieldMapping - Mapping des champs avec valeurs par défaut
 * @returns {Object} - Données préparées pour le composant
 */
export const prepareSectionData = (section, componentName, fieldMapping) => {
  debugLog(componentName, 'Raw section data', section);
  
  const validation = validateSection(section);
  if (!validation.isValid) {
    console.warn(`[${componentName}] Section validation failed:`, validation.errors);
  }
  
  const preparedData = {};
  Object.entries(fieldMapping).forEach(([key, defaultValue]) => {
    preparedData[key] = extractSectionData(section, key, defaultValue);
  });
  
  debugLog(componentName, 'Prepared data', preparedData);
  return preparedData;
};

/**
 * Vérifie si une section est activée et valide
 * @param {Object} section - La section à vérifier
 * @returns {boolean}
 */
export const isSectionActive = (section) => {
  return section && 
         section.enabled !== false && 
         section.content && 
         Object.keys(section.content).length > 0;
};
