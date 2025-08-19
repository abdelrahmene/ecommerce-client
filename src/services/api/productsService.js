/**
 * 🛍️ SERVICE API PRODUITS - VERSION MYSQL CLIENT AMÉLIORÉE
 * Avec logs détaillés et gestion d'erreurs améliorée
 * 
 * @date 7 août 2025
 */

export const getProducts = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const response = await fetch(`${getApiUrl()}/products?${queryString}`);
  if (!response.ok) throw new Error('Failed to fetch products');
  return response.json();
};

export const getProduct = async (id) => {
  const response = await fetch(`${getApiUrl()}/products/${id}`);
  if (!response.ok) throw new Error('Failed to fetch product');
  return response.json();
};

export const searchProducts = async (query) => {
  const response = await fetch(`${getApiUrl()}/products/search?q=${encodeURIComponent(query)}`);
  if (!response.ok) throw new Error('Failed to search products');
  return response.json();
};

export const getProductsByCollection = async (collectionId, params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const response = await fetch(`${getApiUrl()}/collections/${collectionId}/products?${queryString}`);
  if (!response.ok) throw new Error('Failed to fetch products by collection');
  return response.json();
};

// Configuration intelligente de l'URL API
const getApiUrl = () => {
  const hostname = window.location.hostname;
  const protocol = window.location.protocol;
  
  console.log('🔧 Products Service Configuration:', {
    hostname,
    protocol,
    env: process.env.NODE_ENV,
    envUrl: process.env.REACT_APP_API_BASE_URL
  });
  
  // Environnement variable prioritaire
  if (process.env.REACT_APP_API_BASE_URL) {
    return process.env.REACT_APP_API_BASE_URL;
  }
  
  // Développement local
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'http://localhost:8000';
  }
  
  // Réseau local (mobile en dev)
  if (hostname.includes('192.168.') || hostname.includes('10.0.')) {
    return `http://${hostname}:8000`;
  }
  
  // Production
  return 'https://birkshoes.store/api';
};

const API_BASE_URL = getApiUrl();
console.log('🌐 Products API_BASE_URL configurée:', API_BASE_URL);

// Détection mobile pour timeout adaptatif
const isMobileDevice = () => {
  return /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

// Configuration fetch améliorée
const createFetchConfig = (options = {}) => {
  const isMobile = isMobileDevice();
  const timeoutMs = isMobile ? 40000 : 14000; // 30s mobile, 15s desktop
  
  console.log(`📱 Fetch Config - Mobile: ${isMobile}, Timeout: ${timeoutMs}ms`);
  
  return {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Cache-Control': 'no-cache',
      'X-Requested-With': 'XMLHttpRequest',
      'User-Agent': navigator.userAgent,
      ...options.headers
    },
    timeout: timeoutMs,
    ...options
  };
};

// Fonction fetch avec timeout et retry
const fetchWithTimeout = async (url, options = {}) => {
  const startTime = Date.now();
  const config = createFetchConfig(options);
  
  console.log(`🚀 Fetch Request - URL: ${url}`, {
    method: config.method,
    timeout: config.timeout,
    mobile: isMobileDevice(),
    timestamp: new Date().toISOString()
  });
  
  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    console.log(`⏰ Request timeout after ${config.timeout}ms`);
    controller.abort();
  }, config.timeout);
  
  try {
    const response = await fetch(url, {
      ...config,
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    const duration = Date.now() - startTime;
    
    console.log(`✅ Fetch Response - Status: ${response.status}, Duration: ${duration}ms`, {
      url,
      ok: response.ok,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries())
    });
    
    if (!response.ok) {
      console.error(`❌ HTTP Error ${response.status}:`, {
        url,
        status: response.status,
        statusText: response.statusText,
        duration
      });
      throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log(`📦 Response Data:`, { 
      url, 
      dataType: typeof data, 
      hasData: !!data,
      dataLength: Array.isArray(data) ? data.length : Object.keys(data || {}).length 
    });
    
    return data;
  } catch (error) {
    clearTimeout(timeoutId);
    const duration = Date.now() - startTime;
    
    console.error(`❌ Fetch Error after ${duration}ms:`, {
      url,
      error: error.message,
      name: error.name,
      stack: error.stack,
      mobile: isMobileDevice()
    });
    
    // Retry logic pour mobile
    if (isMobileDevice() && duration < 4000 && !options._isRetry) {
      console.log('🔄 Retry on mobile...');
      await new Promise(resolve => setTimeout(resolve, 1000));
      return fetchWithTimeout(url, { ...options, _isRetry: true });
    }
    
    throw error;
  }
};

// Service principal
export const productsService = {
  // Récupérer tous les produits avec filtres
  async getProducts(filters = {}) {
    try {
      console.log('🛍️ [PRODUCTS] Récupération des produits:', filters);
      
      // Construction des paramètres de requête
      const params = new URLSearchParams();
      
      if (filters.category && filters.category !== 'all') {
        params.append('category', filters.category);
        console.log('🏷️ Filtre catégorie:', filters.category);
      }
      
      if (filters.collection) {
        params.append('collection', filters.collection);
        console.log('📁 Filtre collection:', filters.collection);
      }
      
      if (filters.search) {
        params.append('search', filters.search);
        console.log('🔍 Terme de recherche:', filters.search);
      }
      
      if (filters.featured) {
        params.append('featured', 'true');
        console.log('⭐ Produits en vedette uniquement');
      }
      
      if (filters.limit) {
        params.append('limit', filters.limit);
        console.log('📊 Limite:', filters.limit);
      }
      
      const queryString = params.toString();
      const url = `${API_BASE_URL}/quick_products.php${queryString ? `?${queryString}` : ''}`;
      
      console.log('🌐 URL de requête complète:', url);
      
      const data = await fetchWithTimeout(url);
      
      if (data.success) {
        console.log(`✅ [PRODUCTS] ${data.products?.length || 0} produits récupérés`);
        return {
          success: true,
          products: data.products || [],
          total: data.total || 0,
          filters: data.filters || {}
        };
      } else {
        console.error('❌ [PRODUCTS] Erreur API:', data.message);
        return {
          success: false,
          products: [],
          error: data.message || 'Erreur inconnue'
        };
      }
    } catch (error) {
      console.error('❌ [PRODUCTS] Erreur lors de la récupération:', error);
      return {
        success: false,
        products: [],
        error: error.message
      };
    }
  },

  // Récupérer un produit par ID
  async getProductById(productId) {
    try {
      console.log('🛍️ [PRODUCT] Récupération du produit:', productId);
      
      if (!productId) {
        throw new Error('ID produit requis');
      }
      
      const url = `${API_BASE_URL}/quick_products.php?id=${encodeURIComponent(productId)}`;
      console.log('🌐 URL produit:', url);
      
      const data = await fetchWithTimeout(url);
      
      if (data.success && data.product) {
        console.log('✅ [PRODUCT] Produit récupéré:', data.product.name);
        return {
          success: true,
          product: data.product
        };
      } else {
        console.error('❌ [PRODUCT] Produit non trouvé:', productId);
        return {
          success: false,
          error: 'Produit non trouvé'
        };
      }
    } catch (error) {
      console.error('❌ [PRODUCT] Erreur:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Récupérer un produit par slug
  async getProductBySlug(slug) {
    try {
      console.log('🛍️ [PRODUCT-SLUG] Récupération par slug:', slug);
      
      if (!slug) {
        throw new Error('Slug produit requis');
      }
      
      const url = `${API_BASE_URL}/quick_products.php?slug=${encodeURIComponent(slug)}`;
      console.log('🌐 URL produit par slug:', url);
      
      const data = await fetchWithTimeout(url);
      
      if (data.success && data.product) {
        console.log('✅ [PRODUCT-SLUG] Produit trouvé:', data.product.name);
        return {
          success: true,
          product: data.product
        };
      } else {
        console.error('❌ [PRODUCT-SLUG] Produit non trouvé pour slug:', slug);
        return {
          success: false,
          error: 'Produit non trouvé'
        };
      }
    } catch (error) {
      console.error('❌ [PRODUCT-SLUG] Erreur:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Récupérer les produits en vedette
  async getFeaturedProducts(limit = 8) {
    console.log('⭐ [FEATURED] Récupération des produits en vedette, limite:', limit);
    return this.getProducts({ featured: true, limit });
  },

  // Récupérer les nouveaux produits
  async getNewProducts(limit = 8) {
    console.log('🆕 [NEW] Récupération des nouveaux produits, limite:', limit);
    return this.getProducts({ limit, orderBy: 'created_at', order: 'desc' });
  },

  // Recherche de produits
  async searchProducts(searchTerm, filters = {}) {
    console.log('🔍 [SEARCH] Recherche:', searchTerm, filters);
    return this.getProducts({ 
      search: searchTerm, 
      ...filters 
    });
  },

  // Récupérer les produits par catégorie
  async getProductsByCategory(category, filters = {}) {
    console.log('🏷️ [CATEGORY] Produits de la catégorie:', category, filters);
    return this.getProducts({ 
      category, 
      ...filters 
    });
  },

  // Récupérer les produits par collection
  async getProductsByCollection(collectionId, filters = {}) {
    console.log('📁 [COLLECTION] Produits de la collection:', collectionId, filters);
    return this.getProducts({ 
      collection: collectionId, 
      ...filters 
    });
  },

  // Test de connectivité
  async testConnection() {
    try {
      console.log('🔧 [TEST] Test de connexion API...');
      const startTime = Date.now();
      
      const response = await fetchWithTimeout(`${API_BASE_URL}/quick_products.php?test=1`, {
        method: 'GET'
      });
      
      const duration = Date.now() - startTime;
      console.log(`✅ [TEST] Connexion OK en ${duration}ms`);
      
      return {
        success: true,
        duration,
        url: API_BASE_URL,
        mobile: isMobileDevice()
      };
    } catch (error) {
      console.error('❌ [TEST] Connexion échouée:', error);
      return {
        success: false,
        error: error.message,
        url: API_BASE_URL,
        mobile: isMobileDevice()
      };
    }
  }
};

// Export par défaut
export default productsService;