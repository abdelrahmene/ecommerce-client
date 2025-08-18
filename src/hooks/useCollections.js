import { useState, useEffect } from 'react';
import { mockCollections, mockProducts } from '../data/mockData';

export const useCollections = () => {
  const [data, setData] = useState({ collections: [], products: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('🔧 Mock: Chargement des collections et produits...');
        
        // Simuler un délai réseau
        await new Promise(resolve => setTimeout(resolve, 400));
        
        // Trier les collections par nom
        const sortedCollections = [...mockCollections].sort((a, b) => a.name.localeCompare(b.name));
        
        // Trier les produits par date de création (plus récents d'abord)
        const sortedProducts = [...mockProducts]
          .filter(product => product.active)
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        setData({
          collections: sortedCollections,
          products: sortedProducts
        });

        console.log('🔧 Mock: Collections chargées:', sortedCollections.length);
        console.log('🔧 Mock: Produits chargés:', sortedProducts.length);
        setLoading(false);
      } catch (err) {
        console.error('❌ Mock: Erreur lors du chargement:', err);
        setError(err.message || 'Erreur de chargement');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, loading, error };
};
