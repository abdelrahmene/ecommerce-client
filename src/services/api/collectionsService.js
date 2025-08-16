/**
 * 📁 SERVICE API COLLECTIONS - VERSION MYSQL CLIENT
 * Avec logs détaillés pour le debug
 * 
 * @date 7 août 2025
 */

export const getCollections = async () => {
  const response = await fetch(`${getApiUrl()}/collections`);
  if (!response.ok) throw new Error('Failed to fetch collections');
  return response.json();
};

export const getCollection = async (id) => {
  const response = await fetch(`${getApiUrl()}/collections/${id}`);
  if (!response.ok) throw new Error('Failed to fetch collection');
  return response.json();
};

// Configuration API basée sur l'environnement
const getApiUrl = () => {
  const hostname = window.location.hostname;
  
  console.log('🔧 Collections Service Configuration:', {
    hostname,
    env: process.env.NODE_ENV,
    envUrl: process.env.REACT_APP_API_BASE_URL
  });
  
  if (process.env.REACT_APP_API_BASE_URL) {
    return process.env.REACT_APP_API_BASE_URL;
  }
  
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'http://localhost:8000';
  }
  
  if (hostname.includes('192.168.') || hostname.includes('10.0.')) {
    return `http://${hostname}:8000`;
  }
  
  return 'https://birkshoes.store/api';
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
    timeout: isMobile ? 30000 : 15000,
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
      const url = `${API_BASE_URL}/endpoints/collections.php${queryString ? `?${queryString}` : ''}`;
      
      const data = await fetchWithLogs(url);
      
      if (data.success) {
        console.log(`✅ [COLLECTIONS] ${data.collections?.length || 0} collections récupérées`);
        return {
          success: true,
          collections: data.collections || []
        };
      } else {
        console.error('❌ [COLLECTIONS] Erreur API:', data.message);
        return {
          success: false,
          collections: [],
          error: data.message
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
      
      const url = `${API_BASE_URL}/endpoints/collections.php?id=${encodeURIComponent(id)}`;
      const data = await fetchWithLogs(url);
      
      if (data.success && data.collection) {
        console.log('✅ [COLLECTION] Collection trouvée:', data.collection.name);
        return {
          success: true,
          collection: data.collection
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

export default collectionsService;