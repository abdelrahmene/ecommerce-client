/**
 * 📁 SERVICE API COLLECTIONS - VERSION MYSQL CLIENT
 * Avec logs détaillés pour le debug
 *
 * @date 7 août 2025
 */

// Configuration API basée sur l'environnement
const getApiUrl = () => {
  const hostname = window.location.hostname;

  console.log('🔧 Collections Service Configuration:', {
    hostname,
    env: process.env.NODE_ENV,
    envUrl: process.env.REACT_APP_API_URL
  });

  // Utiliser la même var d'env que dans api.js
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }

  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'http://localhost:4000';
  }

  if (hostname.includes('192.168.') || hostname.includes('10.0.')) {
    return `http://${hostname}:4000`;
  }

  return 'https://api.birkshoes.store';
};

const API_BASE_URL = getApiUrl();
console.log('📁 Collections API_BASE_URL:', API_BASE_URL);

// Configuration fetch améliorée
const createFetchConfig = (options = {}) => {
  const isMobile = /Android|iPhone|iPad/i.test(navigator.userAgent);

  return {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Cache-Control': 'no-cache',
      'X-Requested-With': 'XMLHttpRequest',
      ...options.headers
    },
    timeout: isMobile ? 40000 : 14000,
    ...options
  };
};

// Fonction fetch avec logs
const fetchWithLogs = async (url, options = {}) => {
  const startTime = Date.now();
  const config = createFetchConfig(options);

  console.log(`🚀 [COLLECTIONS] Fetch Request:`, {
    url,
    method: config.method,
    timeout: config.timeout,
    timestamp: new Date().toISOString()
  });

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), config.timeout);

    const response = await fetch(url, {
      ...config,
      signal: controller.signal
    });

    clearTimeout(timeoutId);
    const duration = Date.now() - startTime;

    console.log(`✅ [COLLECTIONS] Response:`, {
      status: response.status,
      ok: response.ok,
      duration: `${duration}ms`,
      url
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    console.log(`📦 [COLLECTIONS] Data received:`, {
      type: typeof data,
      hasData: !!data,
      success: data.success
    });

    return data;
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(`❌ [COLLECTIONS] Error after ${duration}ms:`, {
      url,
      error: error.message,
      name: error.name
    });
    throw error;
  }
};

// Service principal
export const collectionsService = {
  // Récupérer toutes les collections
  async getCollections(filters = {}) {
    try {
      console.log('📁 [COLLECTIONS] Récupération des collections:', filters);

      const params = new URLSearchParams();
      if (filters.category) params.append('category', filters.category);
      if (filters.active !== undefined) params.append('active', filters.active);

      const queryString = params.toString();
      const url = `${API_BASE_URL}/api/collections${queryString ? `?${queryString}` : ''}`;

      const data = await fetchWithLogs(url);

      if (data && data.collections && Array.isArray(data.collections)) {
        console.log(`✅ [COLLECTIONS] ${data.collections.length} collections récupérées`);
        return {
          success: true,
          collections: data.collections
        };
      } else if (data && Array.isArray(data)) {
        console.log(`✅ [COLLECTIONS] ${data.length} collections récupérées (format direct)`);
        return {
          success: true,
          collections: data
        };
      } else {
        console.error('❌ [COLLECTIONS] Format de données invalide');
        return {
          success: false,
          collections: [],
          error: 'Format de données invalide'
        };
      }
    } catch (error) {
      console.error('❌ [COLLECTIONS] Erreur:', error);
      return {
        success: false,
        collections: [],
        error: error.message
      };
    }
  },

  // Récupérer une collection par ID
  async getCollectionById(id) {
    try {
      console.log('📁 [COLLECTION] Récupération par ID:', id);

      const url = `${API_BASE_URL}/api/collections/${encodeURIComponent(id)}`;
      const data = await fetchWithLogs(url);

      if (data && data.id) {
        console.log('✅ [COLLECTION] Collection trouvée:', data.name);
        return {
          success: true,
          collection: data
        };
      } else {
        console.error('❌ [COLLECTION] Non trouvée:', id);
        return {
          success: false,
          error: 'Collection non trouvée'
        };
      }
    } catch (error) {
      console.error('❌ [COLLECTION] Erreur:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
};

// Service pour récupérer les sections de collection depuis l'API Node.js
export const getHomeSections = async () => {
  try {
    const response = await fetchWithLogs(`${API_BASE_URL}/api/content/home-sections`);

    if (response && Array.isArray(response)) {
      const collectionSections = response.filter(section => section.type === 'collection');
      console.log(`✅ [HOME-SECTIONS] ${collectionSections.length} sections collection trouvées`);
      return collectionSections;
    }

    return [];
  } catch (error) {
    console.error('❌ [HOME-SECTIONS] Erreur:', error);
    return [];
  }
};

// Exports individuels pour compatibilité
export const getCollections = async () => {
  const result = await collectionsService.getCollections();
  if (result.success) {
    return result.collections;
  } else {
    throw new Error(result.error || 'Failed to fetch collections');
  }
};

export const getCollection = async (id) => {
  console.log('🔍 Fetching collection:', id);
  const result = await collectionsService.getCollectionById(id);
  if (result.success) {
    console.log('📦 Collection data:', result.collection);
    return result.collection;
  } else {
    console.error('❌ Failed to fetch collection:', id);
    throw new Error(result.error || 'Failed to fetch collection');
  }
};

// Nouvelle méthode pour récupérer les collections d'une section
export const getHomeSectionCollections = async (sectionId) => {
  console.log('🔍 Fetching collections for section:', sectionId);
  const response = await fetch(`${API_BASE_URL}/api/content/home-section/${sectionId}/collections`);
  
  if (!response.ok) {
    console.error('❌ Failed to fetch section collections:', sectionId);
    throw new Error('Failed to fetch section collections');
  }
  
  const data = await response.json();
  console.log('📦 Section collections data:', data);
  return data;
};
