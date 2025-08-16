import { useState, useEffect, useCallback } from 'react';
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  limit, 
  startAfter,
  getDocs,
  getDoc,
  doc
} from 'firebase/firestore';
import { firestore } from '../services/firebase/firebase';

// Hook personnalisé pour gérer les produits côté client
// Hook pour la recherche de produits
export function useProductSearch(query) {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Si la requête est vide, ne pas effectuer de recherche
    if (!query || query.trim() === '') {
      setResults([]);
      return;
    }

    const searchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Construction de la requête Firestore
        const productsRef = collection(firestore, 'products');
        
        // Recherche par nom de produit (commence par)
        // Note: Firestore n'a pas de recherche plein texte native
        // Pour une recherche plus avancée, il faudrait utiliser Algolia ou un service similaire
        const q = query(
          productsRef,
          where('active', '==', true),
          where('nameSearchable', '>=', query.toLowerCase()),
          where('nameSearchable', '<=', query.toLowerCase() + '\uf8ff'),
          limit(10)
        );
        
        const querySnapshot = await getDocs(q);
        
        const searchResults = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        setResults(searchResults);
      } catch (err) {
        console.error('Erreur lors de la recherche de produits:', err);
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
      
      // Construction de la requête Firestore
      let productsQuery = collection(firestore, 'products');
      
      // Tableau pour stocker les conditions de la requête
      let queryConstraints = [];
      
      // Uniquement récupérer les produits actifs
      queryConstraints.push(where('active', '==', true));
      
      // Ajouter des filtres si présents
      if (filters.collection) {
        queryConstraints.push(where('collectionId', '==', filters.collection));
      }
      
      if (filters.inStock === true) {
        queryConstraints.push(where('stockQuantity', '>', 0));
      }
      
      if (filters.priceRange) {
        const [minPrice, maxPrice] = filters.priceRange;
        if (minPrice) queryConstraints.push(where('price', '>=', minPrice));
        if (maxPrice) queryConstraints.push(where('price', '<=', maxPrice));
      }
      
      // Ajouter tri et limite
      // Changement de tri selon le filtre demandé
      if (filters.sortBy === 'price' && filters.sortOrder) {
        queryConstraints.push(orderBy('price', filters.sortOrder));
      } else if (filters.sortBy === 'name' && filters.sortOrder) {
        queryConstraints.push(orderBy('name', filters.sortOrder));
      } else {
        // Par défaut : tri par date de création décroissante
        queryConstraints.push(orderBy('createdAt', 'desc'));
      }
      
      queryConstraints.push(limit(itemsPerPage));
      
      // Exécuter la requête
      const q = query(productsQuery, ...queryConstraints);
      const querySnapshot = await getDocs(q);
      
      // Si aucun résultat, définir hasMore à false
      if (querySnapshot.empty) {
        setProducts([]);
        setHasMore(false);
        setLastDoc(null);
        setLoading(false);
        return;
      }
      
      // Transformer les données Firestore en objets JavaScript
      const productsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      
      setProducts(productsData);
      setLastDoc(querySnapshot.docs[querySnapshot.docs.length - 1]);
      setHasMore(querySnapshot.docs.length === itemsPerPage);
      
    } catch (err) {
      console.error('Erreur lors du chargement des produits:', err);
      setError('Impossible de charger les produits. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fonction pour charger plus de produits (pagination)
  const loadMoreProducts = useCallback(async (itemsPerPage = 20, filters = {}) => {
    if (!lastDoc || loading) return;
    
    try {
      setLoading(true);
      
      // Construction de la requête avec curseur de pagination
      let productsQuery = collection(firestore, 'products');
      
      // Tableau pour stocker les conditions de la requête
      let queryConstraints = [];
      
      // Uniquement récupérer les produits actifs
      queryConstraints.push(where('active', '==', true));
      
      // Ajouter des filtres si présents
      if (filters.collection) {
        queryConstraints.push(where('collectionId', '==', filters.collection));
      }
      
      if (filters.inStock === true) {
        queryConstraints.push(where('stockQuantity', '>', 0));
      }
      
      if (filters.priceRange) {
        const [minPrice, maxPrice] = filters.priceRange;
        if (minPrice) queryConstraints.push(where('price', '>=', minPrice));
        if (maxPrice) queryConstraints.push(where('price', '<=', maxPrice));
      }
      
      // Ajouter tri, curseur et limite
      if (filters.sortBy === 'price' && filters.sortOrder) {
        queryConstraints.push(orderBy('price', filters.sortOrder));
      } else if (filters.sortBy === 'name' && filters.sortOrder) {
        queryConstraints.push(orderBy('name', filters.sortOrder));
      } else {
        // Par défaut : tri par date de création décroissante
        queryConstraints.push(orderBy('createdAt', 'desc'));
      }
      
      queryConstraints.push(startAfter(lastDoc));
      queryConstraints.push(limit(itemsPerPage));
      
      // Exécuter la requête
      const q = query(productsQuery, ...queryConstraints);
      const querySnapshot = await getDocs(q);
      
      // Si aucun résultat supplémentaire, définir hasMore à false
      if (querySnapshot.empty) {
        setHasMore(false);
        setLoading(false);
        return;
      }
      
      // Transformer les nouvelles données et les ajouter au tableau existant
      const newProductsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      
      setProducts(prevProducts => [...prevProducts, ...newProductsData]);
      setLastDoc(querySnapshot.docs[querySnapshot.docs.length - 1]);
      setHasMore(querySnapshot.docs.length === itemsPerPage);
      
    } catch (err) {
      console.error('Erreur lors du chargement de produits supplémentaires:', err);
      setError('Impossible de charger plus de produits. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  }, [lastDoc, loading]);

  // Fonction pour obtenir un produit par son ID
  const getProduct = useCallback(async (productId) => {
    try {
      setLoading(true);
      
      const productRef = doc(firestore, 'products', productId);
      const productSnap = await getDoc(productRef);
      
      if (!productSnap.exists()) {
        setError('Produit non trouvé');
        return null;
      }
      
      // Vérifier que le produit est actif
      const productData = productSnap.data();
      if (!productData.active) {
        setError('Produit non disponible');
        return null;
      }
      
      return {
        id: productSnap.id,
        ...productData
      };
      
    } catch (err) {
      console.error('Erreur lors de la récupération du produit:', err);
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
      
      // Note: Firestore ne supporte pas nativement la recherche par texte
      // Idéalement, on utiliserait Algolia ou Firebase Functions pour la recherche
      // Ici, on fait une approche simplifiée en chargeant les produits et en filtrant côté client
      
      // Charger tous les produits actifs
      const productsQuery = query(
        collection(firestore, 'products'),
        where('active', '==', true),
        limit(100) // Limite pour des raisons de performance
      );
      
      const querySnapshot = await getDocs(productsQuery);
      
      // Filtrer les produits qui contiennent le terme de recherche dans le nom ou la description
      const searchTermLower = searchTerm.toLowerCase();
      const filteredProducts = [];
      
      querySnapshot.forEach(doc => {
        const data = doc.data();
        const nameMatch = data.name && data.name.toLowerCase().includes(searchTermLower);
        const descMatch = data.description && data.description.toLowerCase().includes(searchTermLower);
        const tagsMatch = data.tags && data.tags.some(tag => tag.toLowerCase().includes(searchTermLower));
        
        if (nameMatch || descMatch || tagsMatch) {
          filteredProducts.push({
            id: doc.id,
            ...data
          });
        }
      });
      
      // Limiter les résultats
      const limitedResults = filteredProducts.slice(0, itemsPerPage);
      
      setProducts(limitedResults);
      setHasMore(filteredProducts.length > itemsPerPage);
      
      return limitedResults;
      
    } catch (err) {
      console.error('Erreur lors de la recherche de produits:', err);
      setError('Impossible de rechercher des produits. Veuillez réessayer.');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Fonction pour obtenir les produits similaires
  const getSimilarProducts = useCallback(async (productId, limit = 4) => {
    try {
      // Récupérer le produit actuel
      const currentProduct = await getProduct(productId);
      if (!currentProduct) return [];
      
      // Récupérer les produits de la même collection
      const similarQuery = query(
        collection(firestore, 'products'),
        where('active', '==', true),
        where('collectionId', '==', currentProduct.collectionId),
        where('id', '!=', productId),
        limit(limit)
      );
      
      const querySnapshot = await getDocs(similarQuery);
      
      // Si pas assez de produits dans la même collection, compléter avec d'autres produits
      if (querySnapshot.size < limit) {
        const remainingLimit = limit - querySnapshot.size;
        
        const otherProductsQuery = query(
          collection(firestore, 'products'),
          where('active', '==', true),
          where('id', '!=', productId),
          limit(remainingLimit)
        );
        
        const otherSnapshot = await getDocs(otherProductsQuery);
        
        // Combiner les résultats
        const similarProducts = [
          ...querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })),
          ...otherSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }))
        ];
        
        return similarProducts;
      }
      
      // Sinon, retourner les produits de la même collection
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
    } catch (err) {
      console.error('Erreur lors de la récupération des produits similaires:', err);
      return [];
    }
  }, [getProduct]);

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