import { useState, useEffect } from 'react';
import { apiClient } from '../config/apiClient';

export const useCollections = () => {
  const [data, setData] = useState({ collections: [], products: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('🔄 API: Chargement des collections et produits...');
        
        // Récupérer les collections avec l'API
        const collectionsResponse = await apiClient.get('/api/collections?include=category');
        const collectionsData = collectionsResponse?.collections || [];
        
        // Récupérer les produits actifs avec l'API
        const productsResponse = await apiClient.get('/api/products?isActive=true');
        const productsData = productsResponse?.products || [];
        
        setData({
          collections: collectionsData,
          products: productsData
        });

        console.log('✅ API: Collections chargées:', collectionsData.length);
        console.log('✅ API: Produits chargés:', productsData.length);
        setLoading(false);
      } catch (err) {
        console.error('❌ API: Erreur lors du chargement:', err);
        setError(err.message || 'Erreur de chargement');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, loading, error };
};