/**
 * 📁 SERVICE API COLLECTIONS - VERSION OPTIMISÉE AVEC CACHE
 * Cache intelligent + retry automatique + preload
 *
 * @date 4 octobre 2025
 */

// Configuration API
const getApiUrl = () => {
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }
  const hostname = window.location.hostname;
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'http://localhost:4000';
  }
  return 'https://api.birkshoes.store';
};

const API_BASE_URL = getApiUrl();

// 🔥 CACHE en mémoire
const cache = {
  collections: null,
  collectionsTimestamp: null,
  collectionById: {},
  CACHE_DURATION: 30 * 1000, // 30 secondes (réduit de 5 min pour voir les changements rapidement)

  set(key, value) {
    if (key === 'collections') {
      this.collections = value;
      this.collectionsTimestamp = Date.now();
    } else {
      this.collectionById[key] = {
        data: value,
        timestamp: Date.now()
      };
    }
  },

  get(key) {
    if (key === 'collections') {
      if (this.collections && (Date.now() - this.collectionsTimestamp < this.CACHE_DURATION)) {
        console.log('📦 [CACHE] Collections depuis cache');
        return this.collections;
      }
      return null;
    } else {
      const cached = this.collectionById[key];
      if (cached && (Date.now() - cached.timestamp < this.CACHE_DURATION)) {
        console.log(`📦 [CACHE] Collection ${key} depuis cache`);
        return cached.data;
      }
      return null;
    }
  },

  clear() {
    this.collections = null;
    this.collectionsTimestamp = null;
    this.collectionById = {};
  }
};

// 🔥 Fonction fetch optimisée avec retry
const fetchWithRetry = async (url, options = {}, retries = 2) => {
  const isMobile = /Android|iPhone|iPad/i.test(navigator.userAgent);
  const timeout = isMobile ? 45000 : 25000;

  for (let i = 0; i < retries; i++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        mode: 'cors',
        credentials: 'omit',
        signal: controller.signal,
        ...options
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      return await response.json();

    } catch (error) {
      if (i === retries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
};

// Service principal
export const collectionsService = {
  async getCollections(filters = {}) {
    try {
      // Vérifier le cache
      const cached = cache.get('collections');
      if (cached) return { success: true, collections: cached };

      const params = new URLSearchParams();
      if (filters.category) params.append('category', filters.category);
      if (filters.active !== undefined) params.append('active', filters.active);

      const queryString = params.toString();
      const url = `${API_BASE_URL}/api/collections${queryString ? `?${queryString}` : ''}`;

      const data = await fetchWithRetry(url);

      let collections = [];
      if (data && data.collections && Array.isArray(data.collections)) {
        collections = data.collections;
      } else if (data && Array.isArray(data)) {
        collections = data;
      }

      // 🎯 Trier les collections par displayOrder (du champ admin)
      collections = collections.sort((a, b) => {
        const orderA = a.displayOrder !== undefined ? a.displayOrder : Infinity;
        const orderB = b.displayOrder !== undefined ? b.displayOrder : Infinity;
        return orderA - orderB;
      });

      // Mettre en cache
      cache.set('collections', collections);

      console.log(`✅ [COLLECTIONS] ${collections.length} collections récupérées (triées par displayOrder)`);
      return { success: true, collections };

    } catch (error) {
      console.error('❌ [COLLECTIONS] Erreur:', error.message);
      
      // Retourner le cache même expiré en cas d'erreur
      const staleCache = cache.collections;
      if (staleCache) {
        console.log('⚠️ [COLLECTIONS] Utilisation du cache expiré en fallback');
        return { success: true, collections: staleCache };
      }

      return { success: false, collections: [], error: error.message };
    }
  },

  async getCollectionById(id) {
    try {
      // Vérifier le cache
      const cached = cache.get(id);
      if (cached) return { success: true, collection: cached };

      const url = `${API_BASE_URL}/api/collections/${encodeURIComponent(id)}`;
      const data = await fetchWithRetry(url);

      if (data && data.id) {
        // Mettre en cache
        cache.set(id, data);
        
        console.log('✅ [COLLECTION] Collection trouvée:', data.name);
        return { success: true, collection: data };
      }

      return { success: false, error: 'Collection non trouvée' };

    } catch (error) {
      console.error('❌ [COLLECTION] Erreur:', error.message);
      
      // Retourner le cache même expiré en cas d'erreur
      const staleCache = cache.collectionById[id]?.data;
      if (staleCache) {
        console.log('⚠️ [COLLECTION] Utilisation du cache expiré en fallback');
        return { success: true, collection: staleCache };
      }

      return { success: false, error: error.message };
    }
  },

  // Méthode pour précharger les collections
  async preload() {
    try {
      console.log('🚀 [PRELOAD] Préchargement des collections...');
      await this.getCollections();
      console.log('✅ [PRELOAD] Collections préchargées');
    } catch (error) {
      console.error('❌ [PRELOAD] Erreur:', error);
    }
  }
};

// Exports compatibles
export const getCollections = async () => {
  const result = await collectionsService.getCollections();
  if (result.success) return result.collections;
  throw new Error(result.error || 'Failed to fetch collections');
};

export const getCollection = async (id) => {
  const result = await collectionsService.getCollectionById(id);
  if (result.success) return result.collection;
  throw new Error(result.error || 'Failed to fetch collection');
};

export const getHomeSections = async () => {
  try {
    const response = await fetchWithRetry(`${API_BASE_URL}/api/content/home-sections`);
    if (response && Array.isArray(response)) {
      return response.filter(section => section.type === 'collection');
    }
    return [];
  } catch (error) {
    console.error('❌ [HOME-SECTIONS] Erreur:', error);
    return [];
  }
};

export const getHomeSectionCollections = async (sectionId) => {
  try {
    const data = await fetchWithRetry(`${API_BASE_URL}/api/content/home-section/${sectionId}/collections`);
    return data;
  } catch (error) {
    console.error('❌ Failed to fetch section collections:', sectionId, error);
    throw new Error('Failed to fetch section collections');
  }
};

// 🔥 Précharger au chargement de l'app
if (typeof window !== 'undefined') {
  window.addEventListener('load', () => {
    setTimeout(() => collectionsService.preload(), 1000);
  });
}
