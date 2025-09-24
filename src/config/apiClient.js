import { API_CONFIG } from './api';

// Simple client API
export const apiClient = {
  get: async (endpoint) => {
    try {
      const url = `${API_CONFIG.BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
      console.log('🔍 [API] GET:', url);
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }
      
      const data = await response.json();
      console.log('🔍 [API] Réponse brute:', data);
      
      // Vérifier la structure de la réponse spécifiquement pour les catégories
      if (endpoint.includes('categories')) {
        console.log('🔍 [API] Analyse de la structure des catégories:');
        if (data.categories) {
          console.log('- Format attendu: data.categories existe');
          console.log('- Nombre de catégories:', data.categories.length);
        } else {
          console.warn('- Format NON attendu: data.categories n\'existe pas');
          // Si data est lui-même un tableau, il faudra l'utiliser directement
          if (Array.isArray(data)) {
            console.log('- Data est un tableau de', data.length, 'items');
            console.log('- Premier élément:', data[0]);
            return { categories: data }; // Adapter la structure
          }
        }
      }
      
      return data;
    } catch (error) {
      console.error('❌ [API] Error:', error);
      throw error;
    }
  },
  post: async (endpoint, data) => {
    try {
      const url = `${API_CONFIG.BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
      console.log('📣 [API] POST:', url, data);
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('❌ [API] Error:', error);
      throw error;
    }
  }
};