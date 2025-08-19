// Service de produits et collections utilisant UNIQUEMENT l'API
const API_BASE_URL = (process.env.REACT_APP_API_BASE_URL || 'http://localhost:4000') + '/api';

console.log('🔧 Service de produits API initialisé');

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

      const url = `${API_BASE_URL}/products${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur de récupération des produits');
      }

      const data = await response.json();
      console.log('✅ API Products - Produits récupérés:', data);
      return data;
    } catch (error) {
      console.error('❌ API Products - Erreur de récupération:', error);
      throw error;
    }
  },

  async getProductById(id) {
    console.log('📡 API Products - Récupération du produit:', id);
    
    try {
      const response = await fetch(`${API_BASE_URL}/products/${id}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur de récupération du produit');
      }

      const data = await response.json();
      console.log('✅ API Products - Produit récupéré:', data);
      return data;
    } catch (error) {
      console.error('❌ API Products - Erreur de récupération:', error);
      throw error;
    }
  },

  async getCollections() {
    console.log('📡 API Collections - Récupération des collections');
    
    try {
      const response = await fetch(`${API_BASE_URL}/collections`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur de récupération des collections');
      }

      const data = await response.json();
      console.log('✅ API Collections - Collections récupérées:', data);
      return data;
    } catch (error) {
      console.error('❌ API Collections - Erreur de récupération:', error);
      throw error;
    }
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
