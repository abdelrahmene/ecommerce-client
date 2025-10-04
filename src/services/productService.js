import { getImageUrl } from '../config/api';

// Service de produits et collections utilisant UNIQUEMENT l'API
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';

console.log('🔧 Service de produits API initialisé');

// 🔥 Fonction pour transformer les images d'un produit
const transformProductImages = (product) => {
  if (!product) return product;

  // Transformer les images principales
  if (product.images && Array.isArray(product.images)) {
    product.images = product.images.map(img => {
      if (typeof img === 'string') {
        return getImageUrl(img);
      } else if (img && img.url) {
        return getImageUrl(img.url);
      }
      return img;
    });
  }

  // Transformer l'image principale si elle existe
  if (product.image && typeof product.image === 'string') {
    product.image = getImageUrl(product.image);
  }

  return product;
};

const productService = {
  async getProducts(filters = {}) {
    console.log('📡 API Products - Récupération des produits:', filters);
    
    try {
      const queryParams = new URLSearchParams();
      
      Object.keys(filters).forEach(key => {
        if (filters[key] !== undefined && filters[key] !== null && filters[key] !== '') {
          queryParams.append(key, filters[key]);
        }
      });

      const url = `${API_BASE_URL}/api/products${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
      console.log('📡 URL API Products:', url);
      const response = await fetch(url);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur de récupération des produits');
      }

      let data = await response.json();
      
      // 🔥 Transformer les URLs des images pour tous les produits
      if (Array.isArray(data)) {
        data = data.map(transformProductImages);
      }
      
      console.log('✅ API Products - Produits récupérés et transformés:', data.length || 0);
      return data;
    } catch (error) {
      console.error('❌ API Products - Erreur de récupération:', error);
      throw error;
    }
  },

  async getProductById(id) {
    console.log('📡 API Products - Récupération du produit:', id);
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/products/${id}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur de récupération du produit');
      }

      let data = await response.json();
      
      // 🔥 Transformer les URLs des images
      data = transformProductImages(data);
      
      console.log('✅ API Products - Produit récupéré et transformé:', data);
      return data;
    } catch (error) {
      console.error('❌ API Products - Erreur de récupération:', error);
      throw error;
    }
  },

  async getCollections() {
    console.log('📡 API Collections - Récupération des collections');
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/collections`);
      console.log('📡 URL API Collections:', `${API_BASE_URL}/api/collections`);
      console.log('ℹ️ Réponse API Collections status:', response.status, response.statusText);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur de récupération des collections');
      }

      const data = await response.json();
      console.log('✅ API Collections - Collections récupérées:', data.length || 0);
      return data;
    } catch (error) {
      console.error('❌ API Collections - Erreur de récupération:', error);
      throw error;
    }
  },
  
  async getCollectionById(id) {
    console.log('📡 API Collections - Récupération de la collection:', id);
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/collections/${id}`);
      console.log('📡 URL API Collection:', `${API_BASE_URL}/api/collections/${id}`);
      console.log('ℹ️ Réponse API Collection status:', response.status, response.statusText);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur de récupération de la collection');
      }

      let data = await response.json();
      
      // 🔥 Transformer les images des produits dans la collection
      if (data && data.products && Array.isArray(data.products)) {
        data.products = data.products.map(transformProductImages);
      }
      
      console.log('✅ API Collections - Collection récupérée:', data);
      return data;
    } catch (error) {
      console.error('❌ API Collections - Erreur de récupération de collection:', error);
      throw error;
    }
  },
  
  async getProductsByCollection(collectionId) {
    console.log('📡 API Products - Récupération des produits par collection:', collectionId);
    return this.getProducts({ collection: collectionId, isActive: true });
  }
};

// Exports pour compatibilité avec les anciens imports Firebase
export const getDocs = async (queryObject) => {
  console.warn('⚠️ getDocs simulé - Migration vers API nécessaire');
  throw new Error('getDocs n\'est plus supporté - utiliser productService.getProducts()');
};

export const getDoc = async (docRef) => {
  console.warn('⚠️ getDoc simulé - Migration vers API nécessaire');
  throw new Error('getDoc n\'est plus supporté - utiliser productService.getProductById()');
};

export const doc = () => {
  throw new Error('doc n\'est plus supporté - utiliser productService');
};

export const collection = () => {
  throw new Error('collection n\'est plus supporté - utiliser productService');
};

export const query = () => {
  throw new Error('query n\'est plus supporté - utiliser productService.getProducts() avec des filtres');
};

export const where = () => {
  throw new Error('where n\'est plus supporté - utiliser productService.getProducts() avec des filtres');
};

export const orderBy = () => {
  throw new Error('orderBy n\'est plus supporté - utiliser productService.getProducts() avec des filtres');
};

export const limit = () => {
  throw new Error('limit n\'est plus supporté - utiliser productService.getProducts() avec des filtres');
};

export const startAfter = () => {
  throw new Error('startAfter n\'est plus supporté - utiliser productService.getProducts() avec des filtres');
};

export const mockFirestore = null;

export default productService;
