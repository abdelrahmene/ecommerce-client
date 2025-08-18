import { useState, useCallback, useEffect } from 'react';
import { mockProducts } from '../data/mockData';

// Hook pour la recherche de produits - Mock
export function useProductSearch(query) {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Simuler la recherche avec un délai
  useEffect(() => {
    if (!query || query.trim() === '') {
      setResults([]);
      return;
    }

    const searchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Simuler un délai réseau
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // Recherche dans les données mock
        const queryLower = query.toLowerCase();
        const searchResults = mockProducts
          .filter(product => 
            product.active &&
            (product.name.toLowerCase().includes(queryLower) ||
             product.description.toLowerCase().includes(queryLower) ||
             product.tags?.some(tag => tag.toLowerCase().includes(queryLower)))
          )
          .slice(0, 10);
        
        setResults(searchResults);
        console.log('🔧 Mock: Recherche effectuée:', query, '->', searchResults.length, 'résultats');
      } catch (err) {
        console.error('❌ Mock: Erreur lors de la recherche:', err);
        setError('Impossible d\'effectuer la recherche. Veuillez réessayer.');
      } finally {
        setLoading(false);
      }
    };

    searchProducts();
  }, [query]);

  return { results, loading, error };
}

export default function useProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastDoc, setLastDoc] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  // Fonction pour charger les produits (première page) - Mock
  const loadProducts = useCallback(async (itemsPerPage = 20, filters = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      // Simuler un délai réseau
      await new Promise(resolve => setTimeout(resolve, 500));
      
      let filteredProducts = [...mockProducts];
      
      // Appliquer les filtres
      filteredProducts = filteredProducts.filter(product => product.active);
      
      if (filters.collection) {
        filteredProducts = filteredProducts.filter(product => 
          product.collectionId === filters.collection
        );
      }
      
      if (filters.inStock === true) {
        filteredProducts = filteredProducts.filter(product => 
          product.stockQuantity > 0
        );
      }
      
      if (filters.priceRange) {
        const [minPrice, maxPrice] = filters.priceRange;
        filteredProducts = filteredProducts.filter(product => {
          const price = product.salePrice || product.price;
          return (!minPrice || price >= minPrice) && (!maxPrice || price <= maxPrice);
        });
      }
      
      // Appliquer le tri
      if (filters.sortBy === 'price' && filters.sortOrder) {
        filteredProducts.sort((a, b) => {
          const priceA = a.salePrice || a.price;
          const priceB = b.salePrice || b.price;
          return filters.sortOrder === 'asc' ? priceA - priceB : priceB - priceA;
        });
      } else if (filters.sortBy === 'name' && filters.sortOrder) {
        filteredProducts.sort((a, b) => {
          const result = a.name.localeCompare(b.name);
          return filters.sortOrder === 'asc' ? result : -result;
        });
      } else {
        // Tri par défaut par date de création
        filteredProducts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      }
      
      // Pagination
      const paginatedProducts = filteredProducts.slice(0, itemsPerPage);
      
      setProducts(paginatedProducts);
      setHasMore(filteredProducts.length > itemsPerPage);
      setLastDoc(itemsPerPage);
      
      console.log('🔧 Mock: Produits chargés:', paginatedProducts.length, '/', filteredProducts.length);
      
    } catch (err) {
      console.error('❌ Mock: Erreur lors du chargement des produits:', err);
      setError('Impossible de charger les produits. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fonction pour charger plus de produits (pagination) - Mock
  const loadMoreProducts = useCallback(async (itemsPerPage = 20, filters = {}) => {
    if (!hasMore || loading) return;
    
    try {
      setLoading(true);
      
      // Simuler un délai réseau
      await new Promise(resolve => setTimeout(resolve, 400));
      
      let filteredProducts = [...mockProducts];
      
      // Appliquer les mêmes filtres que loadProducts
      filteredProducts = filteredProducts.filter(product => product.active);
      // ... (même logique de filtres)
      
      // Pagination - prendre les éléments suivants
      const startIndex = lastDoc || 0;
      const newProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);
      
      if (newProducts.length > 0) {
        setProducts(prevProducts => [...prevProducts, ...newProducts]);
        setLastDoc(startIndex + newProducts.length);
        setHasMore(startIndex + newProducts.length < filteredProducts.length);
      } else {
        setHasMore(false);
      }
      
      console.log('🔧 Mock: Plus de produits chargés:', newProducts.length);
      
    } catch (err) {
      console.error('❌ Mock: Erreur lors du chargement de produits supplémentaires:', err);
      setError('Impossible de charger plus de produits. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  }, [lastDoc, loading, hasMore]);

  // Fonction pour obtenir un produit par son ID - Mock
  const getProduct = useCallback(async (productId) => {
    try {
      setLoading(true);
      
      // Simuler un délai réseau
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const product = mockProducts.find(p => p.id === productId && p.active);
      
      if (!product) {
        setError('Produit non trouvé');
        console.log('❌ Mock: Produit non trouvé:', productId);
        return null;
      }
      
      console.log('🔧 Mock: Produit trouvé:', productId);
      return product;
      
    } catch (err) {
      console.error('❌ Mock: Erreur lors de la récupération du produit:', err);
      setError('Impossible de récupérer les détails du produit');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Fonction pour rechercher des produits - Mock
  const searchProducts = useCallback(async (searchTerm, itemsPerPage = 20) => {
    try {
      setLoading(true);
      
      // Simuler un délai réseau
      await new Promise(resolve => setTimeout(resolve, 400));
      
      const searchTermLower = searchTerm.toLowerCase();
      const filteredProducts = mockProducts.filter(product => {
        if (!product.active) return false;
        
        const nameMatch = product.name && product.name.toLowerCase().includes(searchTermLower);
        const descMatch = product.description && product.description.toLowerCase().includes(searchTermLower);
        const tagsMatch = product.tags && product.tags.some(tag => tag.toLowerCase().includes(searchTermLower));
        
        return nameMatch || descMatch || tagsMatch;
      });
      
      const limitedResults = filteredProducts.slice(0, itemsPerPage);
      
      setProducts(limitedResults);
      setHasMore(filteredProducts.length > itemsPerPage);
      
      console.log('🔧 Mock: Recherche de produits:', searchTerm, '->', limitedResults.length);
      return limitedResults;
      
    } catch (err) {
      console.error('❌ Mock: Erreur lors de la recherche de produits:', err);
      setError('Impossible de rechercher des produits. Veuillez réessayer.');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Fonction pour obtenir les produits similaires - Mock
  const getSimilarProducts = useCallback(async (productId, limit = 4) => {
    try {
      // Simuler un délai réseau
      await new Promise(resolve => setTimeout(resolve, 200));
      
      const currentProduct = mockProducts.find(p => p.id === productId);
      if (!currentProduct) return [];
      
      // Trouver des produits similaires (même collection ou catégorie)
      let similarProducts = mockProducts.filter(product => 
        product.active && 
        product.id !== productId && 
        (product.collectionId === currentProduct.collectionId || 
         product.category === currentProduct.category)
      );
      
      // Si pas assez, prendre d'autres produits actifs
      if (similarProducts.length < limit) {
        const otherProducts = mockProducts.filter(product => 
          product.active && 
          product.id !== productId &&
          !similarProducts.find(sp => sp.id === product.id)
        );
        similarProducts = [...similarProducts, ...otherProducts];
      }
      
      const result = similarProducts.slice(0, limit);
      console.log('🔧 Mock: Produits similaires trouvés:', result.length);
      return result;
      
    } catch (err) {
      console.error('❌ Mock: Erreur lors de la récupération des produits similaires:', err);
      return [];
    }
  }, []);

  return {
    products,
    loading,
    error,
    hasMore,
    loadProducts,
    loadMoreProducts,
    getProduct,
    searchProducts,
    getSimilarProducts
  };
}
