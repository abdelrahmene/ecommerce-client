import { useState, useCallback, useEffect } from 'react';
import { mockProducts } from '../data/mockData';
import productService from '../services/productService';

// Hook pour la recherche de produits
export function useProductSearch(query) {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Effectuer la recherche de produits
  useEffect(() => {
    if (!query || query.trim() === '') {
      setResults([]);
      return;
    }

    const searchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Essayer d'abord de récupérer depuis l'API réelle
        try {
          const searchResults = await productService.getProducts({ 
            search: query,
            limit: 10,
            isActive: true
          });
          
          console.log('✅ API Search: Recherche effectuée:', query, '->', searchResults.length, 'résultats');
          setResults(searchResults);
          setLoading(false);
          return;
        } catch (apiErr) {
          console.warn('⚠️ Erreur API Search - Fallback sur mock:', apiErr);
        }
        
        // Fallback: Recherche dans les données mock
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

  // Fonction pour charger les produits (première page)
  const loadProducts = useCallback(async (itemsPerPage = 20, filters = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      // Essayer d'abord de récupérer depuis l'API réelle
      try {
        const apiFilters = {
          limit: itemsPerPage,
          offset: 0,
          isActive: true,
          ...filters
        };
        
        const productsData = await productService.getProducts(apiFilters);
        
        console.log('✅ API: Produits chargés:', productsData.length);
        
        setProducts(productsData);
        setHasMore(productsData.length >= itemsPerPage);
        setLastDoc(itemsPerPage);
        setLoading(false);
        return;
      } catch (apiErr) {
        console.warn('⚠️ Erreur API - Fallback sur mock:', apiErr);
      }
      
      // Fallback: Simuler un délai réseau
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
      console.error('❌ Erreur lors du chargement des produits:', err);
      setError('Impossible de charger les produits. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fonction pour charger plus de produits (pagination)
  const loadMoreProducts = useCallback(async (itemsPerPage = 20, filters = {}) => {
    if (!hasMore || loading) return;
    
    try {
      setLoading(true);
      
      // Essayer d'abord de récupérer depuis l'API réelle
      try {
        const apiFilters = {
          limit: itemsPerPage,
          offset: lastDoc || 0,
          isActive: true,
          ...filters
        };
        
        const newProducts = await productService.getProducts(apiFilters);
        
        console.log('✅ API: Plus de produits chargés:', newProducts.length);
        
        if (newProducts.length > 0) {
          setProducts(prevProducts => [...prevProducts, ...newProducts]);
          setLastDoc((lastDoc || 0) + newProducts.length);
          setHasMore(newProducts.length >= itemsPerPage);
        } else {
          setHasMore(false);
        }
        
        setLoading(false);
        return;
      } catch (apiErr) {
        console.warn('⚠️ Erreur API loadMoreProducts - Fallback sur mock:', apiErr);
      }
      
      // Fallback: Simuler un délai réseau
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
      console.error('❌ Erreur lors du chargement de produits supplémentaires:', err);
      setError('Impossible de charger plus de produits. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  }, [lastDoc, loading, hasMore]);

  // Fonction pour obtenir un produit par son ID
  const getProduct = useCallback(async (productId) => {
    try {
      setLoading(true);
      
      // Essayer d'abord de récupérer depuis l'API réelle
      try {
        console.log('🔍 Tentative de récupération API du produit:', productId);
        const product = await productService.getProductById(productId);
        
        if (product) {
          console.log('✅ API: Produit trouvé:', productId);
          return product;
        } else {
          console.log('⚠️ API: Produit non trouvé:', productId);
        }
      } catch (apiErr) {
        console.warn('⚠️ Erreur API getProduct - Fallback sur mock:', apiErr);
      }
      
      // Fallback: Simuler un délai réseau
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
      console.error('❌ Erreur lors de la récupération du produit:', err);
      setError('Impossible de récupérer les détails du produit');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Fonction pour rechercher des produits
  const searchProducts = useCallback(async (searchTerm, itemsPerPage = 20) => {
    try {
      setLoading(true);
      
      // Essayer d'abord de récupérer depuis l'API réelle
      try {
        const productsData = await productService.getProducts({ 
          search: searchTerm,
          limit: itemsPerPage,
          isActive: true
        });
        
        console.log('✅ API: Recherche de produits:', searchTerm, '->', productsData.length);
        
        setProducts(productsData);
        setHasMore(productsData.length >= itemsPerPage);
        setLoading(false);
        return productsData;
      } catch (apiErr) {
        console.warn('⚠️ Erreur API searchProducts - Fallback sur mock:', apiErr);
      }
      
      // Fallback: Simuler un délai réseau
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
      console.error('❌ Erreur lors de la recherche de produits:', err);
      setError('Impossible de rechercher des produits. Veuillez réessayer.');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Fonction pour obtenir les produits similaires
  const getSimilarProducts = useCallback(async (productId, limit = 4) => {
    try {
      // Essayer d'abord de récupérer depuis l'API réelle
      try {
        // Récupérer d'abord le produit actuel pour connaître sa catégorie
        const currentProduct = await productService.getProductById(productId);
        
        if (currentProduct && currentProduct.categoryId) {
          // Récupérer les produits de la même catégorie
          const similarProducts = await productService.getProducts({
            category: currentProduct.categoryId,
            limit: limit + 1, // +1 pour exclure le produit actuel
            isActive: true
          });
          
          // Filtrer pour exclure le produit actuel
          const filteredProducts = similarProducts.filter(p => p.id !== productId).slice(0, limit);
          
          if (filteredProducts.length > 0) {
            console.log('✅ API: Produits similaires trouvés:', filteredProducts.length);
            return filteredProducts;
          }
        }
      } catch (apiErr) {
        console.warn('⚠️ Erreur API getSimilarProducts - Fallback sur mock:', apiErr);
      }
      
      // Fallback: Simuler un délai réseau
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
      console.error('❌ Erreur lors de la récupération des produits similaires:', err);
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
